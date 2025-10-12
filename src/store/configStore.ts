import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export interface SiteConfig {
  id?: string
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
  
  loadConfig: () => Promise<void>
  updateConfig: (updates: Partial<SiteConfig>, description?: string) => Promise<boolean>
  loadConfigHistory: () => Promise<void>
  restoreVersion: (versionNumber: number) => Promise<boolean>
}

interface ConfigVersion {
  id: string
  version_number: number
  created_at: string
  description: string | null
}

const defaultConfig: SiteConfig = {
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

  loadConfig: async () => {
    set({ loading: true, error: null })
    
    try {
      // D'abord, essayer de charger depuis l'historique (dernière version)
      const { data: historyData, error: historyError } = await supabase
        .from('site_config_history')
        .select('config_snapshot, version_number')
        .order('version_number', { ascending: false })
        .limit(1)
      
      if (!historyError && historyData && historyData.length > 0) {
        // Si on a une version dans l'historique, l'utiliser
        const snapshot = historyData[0].config_snapshot as SiteConfig
        set({ 
          config: snapshot, 
          loading: false,
          currentVersion: historyData[0].version_number 
        })
        return
      }
      
      // Sinon, charger depuis la table principale
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .limit(1)
      
      if (error || !data || data.length === 0) {
        console.error('Erreur chargement config:', error)
        set({ config: defaultConfig, loading: false })
        return
      }
      
      set({ config: data[0] || defaultConfig, loading: false })
    } catch (error: any) {
      console.error('Erreur chargement config:', error)
      set({ 
        error: error.message, 
        loading: false,
        config: defaultConfig 
      })
    }
  },

  loadConfigHistory: async () => {
    try {
      const { data, error } = await supabase
        .from('site_config_history')
        .select('id, version_number, created_at, description')
        .order('version_number', { ascending: false })
        .limit(20)
      
      if (error) throw error
      
      set({ configHistory: data || [] })
    } catch (error) {
      console.error('Erreur chargement historique:', error)
    }
  },

  updateConfig: async (updates: Partial<SiteConfig>, description?: string) => {
    try {
      const currentConfig = get().config
      if (!currentConfig?.id) {
        // Si pas d'ID, on fait un INSERT
        const { data, error } = await supabase
          .from('site_config')
          .insert({ ...defaultConfig, ...updates })
          .select()
          .single()
        
        if (error) throw error
        
        // Sauvegarder dans l'historique
        await saveConfigToHistory(data, description)
        
        set({ config: data })
        return true
      }
      
      // Sinon UPDATE
      const { data, error } = await supabase
        .from('site_config')
        .update(updates)
        .eq('id', currentConfig.id)
        .select()
        .single()
      
      if (error) throw error
      
      // Sauvegarder dans l'historique
      await saveConfigToHistory(data, description)
      
      set({ config: data })
      
      // Recharger l'historique
      get().loadConfigHistory()
      
      return true
    } catch (error) {
      console.error('Erreur update config:', error)
      return false
    }
  },

  restoreVersion: async (versionNumber: number) => {
    try {
      const { data, error } = await supabase
        .from('site_config_history')
        .select('config_snapshot')
        .eq('version_number', versionNumber)
        .single()
      
      if (error) throw error
      
      const snapshot = data.config_snapshot as SiteConfig
      
      const currentConfig = get().config
      if (!currentConfig?.id) return false
      
      const { data: updated, error: updateError } = await supabase
        .from('site_config')
        .update(snapshot)
        .eq('id', currentConfig.id)
        .select()
        .single()
      
      if (updateError) throw updateError
      
      set({ config: updated })
      
      return true
    } catch (error) {
      console.error('Erreur restore version:', error)
      return false
    }
  }
}))

// Fonction helper pour sauvegarder dans l'historique
async function saveConfigToHistory(config: SiteConfig, description?: string) {
  try {
    const { data: versionData } = await supabase
      .rpc('get_next_config_version')
    
    const nextVersion = versionData || 1
    
    await supabase
      .from('site_config_history')
      .insert({
        config_snapshot: config,
        version_number: nextVersion,
        description: description || `Configuration v${nextVersion}`
      })
  } catch (error) {
    console.error('Erreur sauvegarde historique:', error)
  }
}

// Hook personnalisé pour appliquer le thème
export const useTheme = () => {
  const config = useConfigStore(state => state.config)
  
  // Appliquer les couleurs au document
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