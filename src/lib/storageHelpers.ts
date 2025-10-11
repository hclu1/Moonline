import { supabase } from './supabaseClient'

/**
 * Obtenir l'URL publique d'une image de produit
 */
export const getProductImageUrl = (imagePath: string | null): string => {
  if (!imagePath) return '/placeholder-product.jpg'
  
  const { data } = supabase.storage
    .from('produits-images')
    .getPublicUrl(imagePath)
  
  return data.publicUrl
}

/**
 * Upload une image de produit (admin uniquement)
 */
export const uploadProductImage = async (
  file: File,
  category: string
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${category}/${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
      .from('produits-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    return fileName
  } catch (error) {
    console.error('Erreur upload image produit:', error)
    return null
  }
}

/**
 * Upload une image de référence pour commande personnalisée
 */
export const uploadCommandeImage = async (
  file: File,
  userId: string,
  commandeId: string
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${commandeId}_${Date.now()}.${fileExt}`

    const { error } = await supabase.storage
      .from('commandes-personnalisees')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (error) throw error

    return fileName
  } catch (error) {
    console.error('Erreur upload image commande:', error)
    return null
  }
}

/**
 * Obtenir l'URL d'une image de commande (privée)
 */
export const getCommandeImageUrl = async (
  imagePath: string
): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from('commandes-personnalisees')
      .createSignedUrl(imagePath, 3600) // URL valide 1h

    if (error) throw error

    return data.signedUrl
  } catch (error) {
    console.error('Erreur récupération image commande:', error)
    return null
  }
}

/**
 * Upload un avatar utilisateur
 */
export const uploadAvatar = async (
  file: File,
  userId: string
): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/avatar.${fileExt}`

    // Supprimer l'ancien avatar s'il existe
    await supabase.storage
      .from('avatars')
      .remove([fileName])

    const { error } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      })

    if (error) throw error

    return fileName
  } catch (error) {
    console.error('Erreur upload avatar:', error)
    return null
  }
}

/**
 * Obtenir l'URL publique d'un avatar
 */
export const getAvatarUrl = (userId: string, ext: string = 'jpg'): string => {
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(`${userId}/avatar.${ext}`)
  
  return data.publicUrl
}

/**
 * Valider un fichier image
 */
export const validateImageFile = (file: File, maxSizeMB: number = 5): string | null => {
  // Vérifier le type
  if (!file.type.startsWith('image/')) {
    return 'Le fichier doit être une image (JPG, PNG, WebP)'
  }

  // Vérifier la taille
  const maxSize = maxSizeMB * 1024 * 1024
  if (file.size > maxSize) {
    return `Le fichier est trop volumineux (max ${maxSizeMB}MB)`
  }

  return null
}