import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export interface SiteConfig {
  // Theme
  primary_color: string
  secondary_color: string
  accent_color: string
  background_color: string
  text_color: string
  header_bg_color: string
  footer_bg_color: string
  
  // Content
  site_name: string
  site_slogan: string
  about_title: string
  about_description: string
  home_hero_title: string
  home_hero_subtitle: string
  
  // Contact
  contact_email: string
  contact_phone: string
  contact_address: string
  facebook_url: string
  instagram_url: string
  twitter_url: string
  
  // Settings
  shipping_cost: number
  free_shipping_threshold: number
  order_processing_days: number
  custom_order_delay_days: number
  show_prices: boolean
  allow_custom_orders: boolean
}

interface ConfigStore {
  config: SiteConfig | null
  loading: boolean
  error: string | null
  
  loadConfig: () => Promise<void>
  updateConfig: (key: keyof SiteConfig, value: any) => Promise<boolean>
  updateMultipleConfig: (updates: Partial<SiteConfig>) => Promise<boolean>
}

const defaultConfig: SiteConfig = {
  primary_color: '#3b82f6',
  secondary_color: '#8b5cf6',
  accent_color: '#f59e0b',
  background_color: '#ffffff',
  text_color: '#1f2937',
  header_bg_color: '#1e40af',
  footer_bg_color: '#1f2937',
  
  site_name: 'Moonline Art',
  site_slogan: 'Créations marines uniques et personnalisées',
  about_title: 'À propos de nous',
  about_description: 'Bienvenue dans notre boutique dédiée à l\'art marin...',
  home_hero_title: 'Découvrez nos créations marines',
  home_hero_subtitle: 'Des œuvres uniques inspirées de l\'océan',
  
  contact_email: 'contact@moonline-art.com',
  contact_phone: '+33 6 12 34 56 78',
  contact_address: '123 Rue de la Marine, 75000 Paris',
  facebook_url: '',
  instagram_url: '',
  twitter_url: '',
  
  shipping_cost: 5.90,
  free_shipping_threshold: 50,
  order_processing_days: 2,
  custom_order_delay_days: 14,
  show_prices: true,
  allow_custom_orders: true,
}

export const useConfigStore = create<ConfigStore>((set, get) => ({
  config: null,
  loading: false,
  error: null,

  loadConfig: async () => {
    set({ loading: true, error: null })
    
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('key, value')
      
      if (error) throw error
      
      // Convertir les résultats en objet config
      const configObj: any = { ...defaultConfig }
      
      data?.forEach((item) => {
        const key = item.key as keyof SiteConfig
        let value = item.value
        
        // Parser les valeurs JSON si nécessaire
        if (typeof value === 'string') {
          try {
            value = JSON.parse(value)
          } catch {
            // Si ce n'est pas du JSON valide, garder la valeur telle quelle
          }
        }
        
        configObj[key] = value
      })
      
      set({ config: configObj, loading: false })
    } catch (error: any) {
      console.error('Erreur chargement config:', error)
      set({ 
        error: error.message, 
        loading: false,
        config: defaultConfig 
      })
    }
  },

  updateConfig: async (key: keyof SiteConfig, value: any) => {
    try {
      // Déterminer la catégorie
      let category = 'settings'
      if (['primary_color', 'secondary_color', 'accent_color', 'background_color', 'text_color', 'header_bg_color', 'footer_bg_color'].includes(key)) {
        category = 'theme'
      } else if (['site_name', 'site_slogan', 'about_title', 'about_description', 'home_hero_title', 'home_hero_subtitle'].includes(key)) {
        category = 'content'
      } else if (['contact_email', 'contact_phone', 'contact_address', 'facebook_url', 'instagram_url', 'twitter_url'].includes(key)) {
        category = 'contact'
      }
      
      const { error } = await supabase
        .from('site_config')
        .upsert({
          key,
          value: JSON.stringify(value),
          category
        }, {
          onConflict: 'key'
        })
      
      if (error) throw error
      
      // Mettre à jour le state local
      const currentConfig = get().config || defaultConfig
      set({ 
        config: { 
          ...currentConfig, 
          [key]: value 
        } 
      })
      
      return true
    } catch (error) {
      console.error('Erreur update config:', error)
      return false
    }
  },

  updateMultipleConfig: async (updates: Partial<SiteConfig>) => {
    try {
      const promises = Object.entries(updates).map(([key, value]) => 
        get().updateConfig(key as keyof SiteConfig, value)
      )
      
      const results = await Promise.all(promises)
      return results.every(r => r === true)
    } catch (error) {
      console.error('Erreur update multiple config:', error)
      return false
    }
  }
}))

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