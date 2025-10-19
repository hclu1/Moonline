// ==================== configStore.ts - VERSION FINALE COMPLÈTE ====================
import React from 'react'
import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

// ==================== INTERFACES ====================
export interface SiteConfig {
  id?: string
  user_id?: string
  
  // Couleurs
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  text_color: string
  header_bg_color: string
  footer_bg_color: string
  
  // Contenu
  site_name: string
  site_slogan: string
  home_hero_title: string
  home_hero_subtitle: string
  about_title: string
  about_description: string
  
  // Contact
  contact_email: string
  contact_phone: string
  contact_address: string
  facebook_url: string
  instagram_url: string
  twitter_url: string
  
  // Paramètres
  shipping_cost: number
  free_shipping_threshold: number
  order_processing_days: number
  custom_order_delay_days: number
  show_prices: boolean
  allow_custom_orders: boolean
  
  // Animations de fond
  enable_particles: boolean
  particles_color: string
  particles_count: number
  enable_stars: boolean
  stars_color: string
  stars_count: number
  
  // Images de fond
  hero_background_image: string
  hero_background_overlay_opacity: number
  about_background_image: string
  boutique_background_image: string
  
  // Effets visuels
  enable_blur_effects: boolean
  enable_gradient_backgrounds: boolean
  gradient_start_color: string
  gradient_end_color: string
  
  // Logos et icones
  logo_url: string
  favicon_url: string
  hero_icon_url: string
  
  // Typographie
  font_family: string
  heading_font_family: string
  base_font_size: number
  
  // Design
  border_radius: string
  section_spacing: string
  card_shadow: string
}

interface ConfigStore {
  config: SiteConfig | null
  loading: boolean
  error: string | null
  configHistory: ConfigVersion[]
  currentVersion: number | null
  isAdmin: boolean
  currentUser: any | null
  
  loadConfig: () => Promise<void>
  updateConfig: (updates: Partial<SiteConfig>, description?: string) => Promise<boolean>
  loadConfigHistory: () => Promise<void>
  restoreVersion: (versionNumber: number) => Promise<boolean>
  checkAuth: () => Promise<void>
  initializeConfig: () => Promise<void>
}

interface ConfigVersion {
  id: string
  version_number: number
  created_at: string
  description: string | null
  user_id: string
}

// ==================== CONFIGURATION PAR DÉFAUT ====================
const defaultConfig: Omit<SiteConfig, 'id' | 'user_id'> = {
  primary_color: '#3b82f6',
  secondary_color: '#8b5cf6',
  accent_color: '#f59e0b',
  background_color: '#0f172a',
  text_color: '#ffffff',
  header_bg_color: '#1e293b',
  footer_bg_color: '#0f172a',
  
  site_name: 'MOONLINE ART',
  site_slogan: 'Des créations uniques entre art et style',
  home_hero_title: 'Bienvenue dans l\'univers MOONLINE',
  home_hero_subtitle: 'Découvrez notre collection unique d\'art spatial',
  about_title: 'Notre histoire',
  about_description: 'MOONLINE ART est né d\'une passion pour l\'art et l\'univers.',
  
  contact_email: 'contact@moonlineart.com',
  contact_phone: '+33 1 23 45 67 89',
  contact_address: '',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  
  shipping_cost: 5.99,
  free_shipping_threshold: 50,
  order_processing_days: 3,
  custom_order_delay_days: 14,
  show_prices: true,
  allow_custom_orders: true,
  
  enable_particles: true,
  particles_color: '#a855f7',
  particles_count: 50,
  enable_stars: true,
  stars_color: '#ffffff',
  stars_count: 100,
  
  hero_background_image: '',
  hero_background_overlay_opacity: 0.6,
  about_background_image: '',
  boutique_background_image: '',
  
  enable_blur_effects: true,
  enable_gradient_backgrounds: true,
  gradient_start_color: '#7c3aed',
  gradient_end_color: '#2563eb',
  
  logo_url: '',
  favicon_url: '',
  hero_icon_url: '',
  
  font_family: 'Inter, system-ui, sans-serif',
  heading_font_family: 'Inter, system-ui, sans-serif',
  base_font_size: 16,
  
  border_radius: '0.75rem',
  section_spacing: '4rem',
  card_shadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
}

// ==================== STORE ZUSTAND ====================
export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: null,
  loading: false,
  error: null,
  configHistory: [],
  currentVersion: null,
  isAdmin: false,
  currentUser: null,

  // ✅ VÉRIFICATION AUTHENTIFICATION
  checkAuth: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user) {
        console.log('✅ Utilisateur authentifié:', session.user.email)
        set({ currentUser: session.user, isAdmin: true })
        return
      }
      
      console.log('⚠️ Aucun utilisateur authentifié')
      set({ isAdmin: false, currentUser: null })
    } catch (error) {
      console.error('❌ Erreur checkAuth:', error)
      set({ isAdmin: false, currentUser: null })
    }
  },

  // ✅ INITIALISATION CONFIGURATION
  initializeConfig: async () => {
    const { currentUser } = get()
    
    if (!currentUser) {
      console.error('❌ Utilisateur non authentifié')
      return
    }

    try {
      const { data: existingConfig } = await supabase
        .from('site_config')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle()

      if (existingConfig) {
        set({ config: existingConfig })
        applyThemeToDocument(existingConfig)
        return
      }

      const { data: newConfig, error } = await supabase
        .from('site_config')
        .insert({
          ...defaultConfig,
          user_id: currentUser.id
        })
        .select()
        .single()

      if (error) throw error

      await saveConfigToHistory(newConfig, 'Configuration initiale')

      set({ config: newConfig })
      applyThemeToDocument(newConfig)
    } catch (error) {
      console.error('❌ Erreur initialisation config:', error)
    }
  },

  // ✅ CHARGEMENT CONFIGURATION
  loadConfig: async () => {
    set({ loading: true, error: null })
    
    try {
      // 1. Charger depuis cache local pour affichage rapide
      const cachedConfig = localStorage.getItem('moonline_config_cache')
      if (cachedConfig) {
        const parsed = JSON.parse(cachedConfig)
        set({ config: parsed, loading: false })
        applyThemeToDocument(parsed)
      }

      // 2. Vérifier l'authentification
      await get().checkAuth()
      
      const { currentUser } = get()
      
      // 3. Si pas d'utilisateur, charger config publique depuis l'historique
      if (!currentUser) {
        const { data: historyData } = await supabase
          .from('site_config_history')
          .select('config_snapshot, version_number')
          .order('version_number', { ascending: false })
          .limit(1)
        
        if (historyData && historyData.length > 0) {
          const snapshot = historyData[0].config_snapshot as SiteConfig
          set({ 
            config: snapshot, 
            loading: false,
            currentVersion: historyData[0].version_number 
          })
          localStorage.setItem('moonline_config_cache', JSON.stringify(snapshot))
          applyThemeToDocument(snapshot)
          return
        }
        
        // Fallback sur config par défaut
        const config = defaultConfig as SiteConfig
        set({ config, loading: false })
        localStorage.setItem('moonline_config_cache', JSON.stringify(config))
        applyThemeToDocument(config)
        return
      }
      
      // 4. Charger config utilisateur depuis Supabase
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle()
      
      if (error) throw error
      
      // 5. Créer config si elle n'existe pas
      if (!data) {
        console.log('⚠️ Aucune config trouvée, création automatique...')
        
        const newConfig = {
          ...defaultConfig,
          user_id: currentUser.id
        }
        
        const { data: created, error: createError } = await supabase
          .from('site_config')
          .insert(newConfig)
          .select()
          .single()
        
        if (createError) {
          console.error('❌ Erreur création config:', createError)
          const config = defaultConfig as SiteConfig
          set({ config, loading: false })
          applyThemeToDocument(config)
          return
        }
        
        console.log('✅ Config créée avec succès!')
        
        await saveConfigToHistory(created, 'Configuration initiale')
        
        set({ config: created, loading: false })
        localStorage.setItem('moonline_config_cache', JSON.stringify(created))
        applyThemeToDocument(created)
        return
      }
      
      // 6. Appliquer la config chargée
      set({ config: data, loading: false })
      localStorage.setItem('moonline_config_cache', JSON.stringify(data))
      applyThemeToDocument(data)
      
      // 7. Charger l'historique
      await get().loadConfigHistory()
      
    } catch (error: any) {
      console.error('❌ Erreur chargement config:', error)
      const config = defaultConfig as SiteConfig
      set({ 
        error: error.message, 
        loading: false,
        config
      })
      applyThemeToDocument(config)
    }
  },

  // ✅ CHARGEMENT HISTORIQUE
  loadConfigHistory: async () => {
    const { currentUser } = get()
    
    if (!currentUser) return

    try {
      const { data, error } = await supabase
        .from('site_config_history')
        .select('id, version_number, created_at, description, user_id')
        .eq('user_id', currentUser.id)
        .order('version_number', { ascending: false })
        .limit(20)
      
      if (error) throw error
      
      set({ configHistory: data || [] })
    } catch (error) {
      console.error('❌ Erreur chargement historique:', error)
    }
  },

  // ✅ ✅ ✅ MISE À JOUR CONFIGURATION - FONCTION PRINCIPALE ✅ ✅ ✅
// ✅ ✅ ✅ VERSION FINALE CORRIGÉE - updateConfig ✅ ✅ ✅
updateConfig: async (updates: Partial<SiteConfig>, description?: string) => {
  console.log('💾 [START] updateConfig appelé')
  console.log('📦 Updates:', updates)
  
  try {
    // 1. Vérification authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('❌ Auth error:', authError)
      return false
    }
    console.log('✅ User:', user.email)

    // 2. UPDATE DIRECT dans Supabase (sans récupérer avant)
    console.log('📤 UPDATE direct...')
    const { data: updatedData, error: updateError } = await supabase
      .from('site_config')
      .update(updates)
      .eq('user_id', user.id)
      .select()
      .single()

    if (updateError) {
      console.error('❌ UPDATE error:', updateError)
      console.error('Details:', {
        code: updateError.code,
        message: updateError.message,
        hint: updateError.hint
      })
      return false
    }

    console.log('✅ UPDATE OK!')
    console.log('📥 Data:', updatedData)

    // 3. Mettre à jour le store Zustand IMMÉDIATEMENT
    set({ config: updatedData })
    console.log('✅ Store mis à jour')

    // 4. Mettre à jour localStorage
    localStorage.setItem('moonline_config_cache', JSON.stringify(updatedData))
    console.log('✅ Cache mis à jour')

    // 5. Appliquer le thème au DOM
    applyThemeToDocument(updatedData)
    console.log('✅ Thème appliqué')

    // 6. Sauvegarder dans l'historique (optionnel, en arrière-plan)
    try {
      await saveConfigToHistory(updatedData, description || 'Mise à jour')
      console.log('✅ Historique sauvegardé')
    } catch (histError) {
      console.warn('⚠️ Erreur historique (non bloquant):', histError)
    }

    // 7. Recharger l'historique
    await get().loadConfigHistory()

    console.log('✅✅✅ SUCCÈS COMPLET !')
    return true

  } catch (error: any) {
    console.error('❌ EXCEPTION:', error)
    set({ error: error.message })
    return false
  }
},


  // ✅ RESTAURATION VERSION
  restoreVersion: async (versionNumber: number) => {
    const { currentUser, isAdmin, config: currentConfig } = get()
    
    if (!currentUser || !isAdmin) {
      console.error('❌ Accès refusé')
      return false
    }

    try {
      const { data, error } = await supabase
        .from('site_config_history')
        .select('config_snapshot')
        .eq('version_number', versionNumber)
        .eq('user_id', currentUser.id)
        .maybeSingle()
      
      if (error) throw error
      if (!data) throw new Error('Version introuvable')
      
      const snapshot = data.config_snapshot as SiteConfig
      
      if (!currentConfig?.id) return false
      
      const { data: updated, error: updateError } = await supabase
        .from('site_config')
        .update(snapshot)
        .eq('id', currentConfig.id)
        .eq('user_id', currentUser.id)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      // Mettre à jour immédiatement
      set({ config: updated })
      localStorage.setItem('moonline_config_cache', JSON.stringify(updated))
      applyThemeToDocument(updated)
      
      await saveConfigToHistory(updated, `Restauration de la version ${versionNumber}`)
      await get().loadConfigHistory()
      
      console.log('✅ Version restaurée avec succès')
      return true
      
    } catch (error) {
      console.error('❌ Erreur restore version:', error)
      return false
    }
  }
}))

// ==================== FONCTIONS UTILITAIRES ====================

// ✅ Appliquer le thème au document
function applyThemeToDocument(config: SiteConfig) {
  if (typeof document === 'undefined') return
  
  const root = document.documentElement
  
  // Couleurs principales
  root.style.setProperty('--color-primary', config.primary_color)
  root.style.setProperty('--color-secondary', config.secondary_color)
  root.style.setProperty('--color-accent', config.accent_color)
  root.style.setProperty('--color-background', config.background_color)
  root.style.setProperty('--color-text', config.text_color)
  root.style.setProperty('--color-header-bg', config.header_bg_color)
  root.style.setProperty('--color-footer-bg', config.footer_bg_color)
  
  // Couleurs animations
  root.style.setProperty('--particles-color', config.particles_color)
  root.style.setProperty('--stars-color', config.stars_color)
  
  // Couleurs gradient
  root.style.setProperty('--gradient-start', config.gradient_start_color)
  root.style.setProperty('--gradient-end', config.gradient_end_color)
  
  console.log('🎨 Thème appliqué:', config.site_name)
}

// ✅ Sauvegarder dans l'historique
async function saveConfigToHistory(config: SiteConfig, description?: string) {
  if (!config.user_id) {
    console.error('❌ user_id manquant dans la config')
    return
  }

  try {
    const { data: maxVersionData } = await supabase
      .from('site_config_history')
      .select('version_number')
      .eq('user_id', config.user_id)
      .order('version_number', { ascending: false })
      .limit(1)
    
    const nextVersion = maxVersionData && maxVersionData.length > 0 
      ? maxVersionData[0].version_number + 1 
      : 1
    
    const { error } = await supabase
      .from('site_config_history')
      .insert({
        config_snapshot: config,
        version_number: nextVersion,
        description: description || `Configuration v${nextVersion}`,
        user_id: config.user_id
      })

    if (error) throw error
    
    console.log(`✅ Historique sauvegardé (v${nextVersion})`)
  } catch (error) {
    console.error('❌ Erreur sauvegarde historique:', error)
  }
}

// ==================== HOOK PERSONNALISÉ ====================

// ✅ Hook pour utiliser le thème
export const useTheme = () => {
  const config = useConfigStore(state => state.config)
  
  React.useEffect(() => {
    if (config) {
      applyThemeToDocument(config)
    }
  }, [config])
  
  return config
}

// ==================== FIN DU FICHIER ====================
