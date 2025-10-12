import { create } from 'zustand'
import { supabase } from '../lib/supabaseClient'

export interface SiteConfig {
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
  
  // Animations
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
  
  // Logos
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

interface ConfigHistory {
  id: string
  config_data: SiteConfig
  label: string
  created_at: string
}

interface ConfigStore {
  config: SiteConfig | null
  configHistory: ConfigHistory[]
  loading: boolean
  error: string | null
  loadConfig: () => Promise<void>
  updateMultipleConfig: (updates: Partial<SiteConfig>, label?: string) => Promise<boolean>
  loadConfigHistory: () => Promise<void>
  restoreVersion: (historyId: string) => Promise<boolean>
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
  about_description: '',
  
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
  configHistory: [],
  loading: false,
  error: null,

  loadConfig: async () => {
    set({ loading: true, error: null })
    
    try {
      const { data, error } = await supabase
        .from('site_config')
        .select('*')
        .single()

      if (error && error.code !== 'PGRST116') {
        throw error
      }

      if (data) {
        set({ config: { ...defaultConfig, ...data }, loading: false })
      } else {
        const { data: newData, error: insertError } = await supabase
          .from('site_config')
          .insert([defaultConfig])
          .select()
          .single()

        if (insertError) throw insertError
        set({ config: newData, loading: false })
      }
    } catch (error) {
      console.error('Erreur chargement config:', error)
      set({ error: 'Erreur de chargement', loading: false, config: defaultConfig })
    }
  },

  updateMultipleConfig: async (updates, label = '') => {
    const currentConfig = get().config
    if (!currentConfig) return false

    try {
      // 1. Sauvegarder dans l'historique
      if (label) {
        await supabase
          .from('site_config_history')
          .insert([{
            config_data: { ...currentConfig, ...updates },
            label: label || `Modification ${new Date().toLocaleString()}`
          }])
      }

      // 2. Mettre à jour la config actuelle
      const { error } = await supabase
        .from('site_config')
        .update(updates)
        .eq('id', (currentConfig as any).id)

      if (error) throw error

      // 3. Mettre à jour le state local
      set({ config: { ...currentConfig, ...updates } })
      
      // 4. Recharger l'historique
      get().loadConfigHistory()
      
      return true
    } catch (error) {
      console.error('Erreur mise à jour:', error)
      return false
    }
  },

  loadConfigHistory: async () => {
    try {
      const { data, error } = await supabase
        .from('site_config_history')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20)

      if (error) throw error
      
      set({ configHistory: data || [] })
    } catch (error) {
      console.error('Erreur chargement historique:', error)
    }
  },

  restoreVersion: async (historyId: string) => {
    try {
      const { data: historyEntry, error: fetchError } = await supabase
        .from('site_config_history')
        .select('*')
        .eq('id', historyId)
        .single()

      if (fetchError) throw fetchError

      const success = await get().updateMultipleConfig(
        historyEntry.config_data,
        `Restauration: ${historyEntry.label}`
      )

      return success
    } catch (error) {
      console.error('Erreur restauration:', error)
      return false
    }
  },
}))