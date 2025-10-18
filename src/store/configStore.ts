import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

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

export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: null,
  loading: false,
  error: null,
  configHistory: [],
  currentVersion: null,
  isAdmin: false,
  currentUser: null,

  // Vérifier l'authentification de l'utilisateur
  checkAuth: async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error || !user) {
        set({ isAdmin: false, currentUser: null })
        return
      }

      set({ currentUser: user, isAdmin: true })
    } catch (error) {
      console.error('Erreur vérification auth:', error)
      set({ isAdmin: false, currentUser: null })
    }
  },

  // Initialiser la configuration (créer si n'existe pas)
  initializeConfig: async () => {
    const { currentUser } = get()
    
    if (!currentUser) {
      console.error('Utilisateur non authentifié')
      return
    }

    try {
      // ✅ Utiliser maybeSingle() au lieu de single()
      const { data: existingConfig } = await supabase
        .from('site_config')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle()

      if (existingConfig) {
        set({ config: existingConfig })
        return
      }

      // Créer une nouvelle configuration
      const { data: newConfig, error } = await supabase
        .from('site_config')
        .insert({
          ...defaultConfig,
          user_id: currentUser.id
        })
        .select()
        .single()

      if (error) throw error

      // Sauvegarder dans l'historique
      await saveConfigToHistory(newConfig, 'Configuration initiale')

      set({ config: newConfig })
    } catch (error) {
      console.error('Erreur initialisation config:', error)
    }
  },

  // Charger la configuration
  loadConfig: async () => {
    set({ loading: true, error: null })
    
    try {
      // Vérifier l'authentification d'abord
      await get().checkAuth()
      
      const { currentUser } = get()
      
      // Si pas d'utilisateur authentifié, charger config publique
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
          return
        }
        
        // Fallback sur la config par défaut
        set({ config: defaultConfig as SiteConfig, loading: false })
        return
      }
      
      // ✅ Utiliser maybeSingle() pour éviter l'erreur 406
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .eq('user_id', currentUser.id)
        .maybeSingle()
      
      if (error) throw error
      
      // Si aucune config n'existe, l'initialiser
      if (!data) {
        await get().initializeConfig()
        return
      }
      
      set({ config: data, loading: false })
      
      // Charger l'historique
      await get().loadConfigHistory()
    } catch (error: any) {
      console.error('Erreur chargement config:', error)
      set({ 
        error: error.message, 
        loading: false,
        config: defaultConfig as SiteConfig
      })
    }
  },

  // Charger l'historique des versions
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
      console.error('Erreur chargement historique:', error)
    }
  },

  // Mettre à jour la configuration
  updateConfig: async (updates: Partial<SiteConfig>, description?: string) => {
    const { currentUser, isAdmin, config: currentConfig } = get()
    
    if (!currentUser || !isAdmin) {
      console.error('Accès refusé: utilisateur non authentifié ou non admin')
      set({ error: 'Accès refusé' })
      return false
    }

    try {
      // Si pas de config existante, initialiser d'abord
      if (!currentConfig?.id) {
        await get().initializeConfig()
        const { config: newConfig } = get()
        
        if (!newConfig?.id) {
          throw new Error('Impossible de créer la configuration')
        }
      }

      const configToUpdate = get().config

      if (!configToUpdate?.id) {
        throw new Error('Configuration introuvable')
      }

      // Mettre à jour la configuration
      const { data, error } = await supabase
        .from('site_config')
        .update(updates)
        .eq('id', configToUpdate.id)
        .eq('user_id', currentUser.id)
        .select()
        .single()
      
      if (error) throw error
      
      // Sauvegarder dans l'historique
      await saveConfigToHistory(data, description)
      
      set({ config: data })
      
      // Recharger l'historique
      await get().loadConfigHistory()
      
      return true
    } catch (error: any) {
      console.error('Erreur update config:', error)
      set({ error: error.message })
      return false
    }
  },

  // Restaurer une version précédente
  restoreVersion: async (versionNumber: number) => {
    const { currentUser, isAdmin, config: currentConfig } = get()
    
    if (!currentUser || !isAdmin) {
      console.error('Accès refusé')
      return false
    }

    try {
      // ✅ Utiliser maybeSingle()
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
      
      // Sauvegarder la restauration dans l'historique
      await saveConfigToHistory(updated, `Restauration de la version ${versionNumber}`)
      
      set({ config: updated })
      
      // Recharger l'historique
      await get().loadConfigHistory()
      
      return true
    } catch (error) {
      console.error('Erreur restore version:', error)
      return false
    }
  }
}))

// Fonction helper pour sauvegarder dans l'historique
async function saveConfigToHistory(config: SiteConfig, description?: string) {
  if (!config.user_id) {
    console.error('user_id manquant dans la config')
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
  } catch (error) {
    console.error('Erreur sauvegarde historique:', error)
  }
}

// Hook personnalisé pour appliquer le thème
export const useTheme = () => {
  const config = useConfigStore(state => state.config)
  
  if (config && typeof document !== 'undefined') {
    document.documentElement.style.setProperty('--color-primary', config.primary_color)
    document.documentElement.style.setProperty('--color-secondary', config.secondary_color)
    document.documentElement.style.setProperty('--color-accent', config.accent_color)
    document.documentElement.style.setProperty('--color-background', config.background_color)
    document.documentElement.style.setProperty('--color-text', config.text_color)
    document.documentElement.style.setProperty('--color-header-bg', config.header_bg_color)
    document.documentElement.style.setProperty('--color-footer-bg', config.footer_bg_color)
  }
  
  return config
}
