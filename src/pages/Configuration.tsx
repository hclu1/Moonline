import { useState, useEffect } from 'react'
import { useConfigStore, SiteConfig } from '../store/configStore'
import { Save, Palette, FileText, Mail, Settings } from 'lucide-react'
import toast from 'react-hot-toast'

type TabType = 'theme' | 'content' | 'contact' | 'settings'

export default function Configuration() {
  const { config, loading, loadConfig, updateMultipleConfig } = useConfigStore()
  const [activeTab, setActiveTab] = useState<TabType>('theme')
  const [localConfig, setLocalConfig] = useState<Partial<SiteConfig>>({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadConfig()
  }, [loadConfig])

  useEffect(() => {
    if (config) {
      setLocalConfig(config)
    }
  }, [config])

  const handleChange = (key: keyof SiteConfig, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    const success = await updateMultipleConfig(localConfig)
    setSaving(false)
    
    if (success) {
      toast.success('Configuration enregistrée !')
    } else {
      toast.error('Erreur lors de l\'enregistrement')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Chargement de la configuration...</div>
      </div>
    )
  }

  const tabs = [
    { id: 'theme' as TabType, label: 'Thème & Couleurs', icon: Palette },
    { id: 'content' as TabType, label: 'Contenu', icon: FileText },
    { id: 'contact' as TabType, label: 'Coordonnées', icon: Mail },
    { id: 'settings' as TabType, label: 'Paramètres', icon: Settings },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Configuration du site</h1>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <div className="flex gap-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600 font-semibold'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </button>
            )
          })}
        </div>
      </div>

      {/* Theme Tab */}
      {activeTab === 'theme' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Couleurs du thème</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ColorInput
                label="Couleur principale"
                value={localConfig.primary_color || '#3b82f6'}
                onChange={(v) => handleChange('primary_color', v)}
              />
              <ColorInput
                label="Couleur secondaire"
                value={localConfig.secondary_color || '#8b5cf6'}
                onChange={(v) => handleChange('secondary_color', v)}
              />
              <ColorInput
                label="Couleur accent"
                value={localConfig.accent_color || '#f59e0b'}
                onChange={(v) => handleChange('accent_color', v)}
              />
              <ColorInput
                label="Fond de page"
                value={localConfig.background_color || '#ffffff'}
                onChange={(v) => handleChange('background_color', v)}
              />
              <ColorInput
                label="Couleur du texte"
                value={localConfig.text_color || '#1f2937'}
                onChange={(v) => handleChange('text_color', v)}
              />
              <ColorInput
                label="Fond du header"
                value={localConfig.header_bg_color || '#1e40af'}
                onChange={(v) => handleChange('header_bg_color', v)}
              />
              <ColorInput
                label="Fond du footer"
                value={localConfig.footer_bg_color || '#1f2937'}
                onChange={(v) => handleChange('footer_bg_color', v)}
              />
            </div>
          </div>

          {/* Preview */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold mb-4">Aperçu</h3>
            <div className="space-y-4">
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: localConfig.header_bg_color }}
              >
                <p className="text-white font-bold">Header (exemple)</p>
              </div>
              <div className="flex gap-4">
                <button 
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: localConfig.primary_color }}
                >
                  Bouton principal
                </button>
                <button 
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: localConfig.secondary_color }}
                >
                  Bouton secondaire
                </button>
                <button 
                  className="px-4 py-2 rounded text-white"
                  style={{ backgroundColor: localConfig.accent_color }}
                >
                  Bouton accent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Textes du site</h2>
            <div className="space-y-4">
              <TextInput
                label="Nom du site"
                value={localConfig.site_name || ''}
                onChange={(v) => handleChange('site_name', v)}
              />
              <TextInput
                label="Slogan"
                value={localConfig.site_slogan || ''}
                onChange={(v) => handleChange('site_slogan', v)}
              />
              <TextInput
                label="Titre hero page d'accueil"
                value={localConfig.home_hero_title || ''}
                onChange={(v) => handleChange('home_hero_title', v)}
              />
              <TextInput
                label="Sous-titre hero"
                value={localConfig.home_hero_subtitle || ''}
                onChange={(v) => handleChange('home_hero_subtitle', v)}
              />
              <TextInput
                label="Titre page À propos"
                value={localConfig.about_title || ''}
                onChange={(v) => handleChange('about_title', v)}
              />
              <TextareaInput
                label="Description À propos"
                value={localConfig.about_description || ''}
                onChange={(v) => handleChange('about_description', v)}
                rows={6}
              />
            </div>
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Coordonnées</h2>
            <div className="space-y-4">
              <TextInput
                label="Email de contact"
                type="email"
                value={localConfig.contact_email || ''}
                onChange={(v) => handleChange('contact_email', v)}
              />
              <TextInput
                label="Téléphone"
                type="tel"
                value={localConfig.contact_phone || ''}
                onChange={(v) => handleChange('contact_phone', v)}
              />
              <TextareaInput
                label="Adresse"
                value={localConfig.contact_address || ''}
                onChange={(v) => handleChange('contact_address', v)}
                rows={3}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Réseaux sociaux</h2>
            <div className="space-y-4">
              <TextInput
                label="Facebook (URL complète)"
                value={localConfig.facebook_url || ''}
                onChange={(v) => handleChange('facebook_url', v)}
                placeholder="https://facebook.com/votre-page"
              />
              <TextInput
                label="Instagram (URL complète)"
                value={localConfig.instagram_url || ''}
                onChange={(v) => handleChange('instagram_url', v)}
                placeholder="https://instagram.com/votre-compte"
              />
              <TextInput
                label="Twitter/X (URL complète)"
                value={localConfig.twitter_url || ''}
                onChange={(v) => handleChange('twitter_url', v)}
                placeholder="https://twitter.com/votre-compte"
              />
            </div>
          </div>
        </div>
      )}

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Paramètres de livraison</h2>
            <div className="space-y-4">
              <NumberInput
                label="Frais de livraison (€)"
                value={localConfig.shipping_cost || 0}
                onChange={(v) => handleChange('shipping_cost', v)}
                step={0.1}
              />
              <NumberInput
                label="Seuil livraison gratuite (€)"
                value={localConfig.free_shipping_threshold || 0}
                onChange={(v) => handleChange('free_shipping_threshold', v)}
              />
              <NumberInput
                label="Délai de traitement (jours)"
                value={localConfig.order_processing_days || 0}
                onChange={(v) => handleChange('order_processing_days', v)}
              />
              <NumberInput
                label="Délai commandes personnalisées (jours)"
                value={localConfig.custom_order_delay_days || 0}
                onChange={(v) => handleChange('custom_order_delay_days', v)}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Options d'affichage</h2>
            <div className="space-y-4">
              <CheckboxInput
                label="Afficher les prix"
                checked={localConfig.show_prices || false}
                onChange={(v) => handleChange('show_prices', v)}
              />
              <CheckboxInput
                label="Autoriser les commandes personnalisées"
                checked={localConfig.allow_custom_orders || false}
                onChange={(v) => handleChange('allow_custom_orders', v)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Components utilitaires
function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20 border rounded cursor-pointer"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2 border rounded"
        />
      </div>
    </div>
  )
}

function TextInput({ label, value, onChange, type = 'text', placeholder = '' }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

function TextareaInput({ label, value, onChange, rows = 4 }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

function NumberInput({ label, value, onChange, step = 1 }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        step={step}
        className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

function CheckboxInput({ label, checked, onChange }: any) {
  return (
    <label className="flex items-center gap-3 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 text-blue-600 rounded"
      />
      <span className="text-sm font-medium">{label}</span>
    </label>
  )
}