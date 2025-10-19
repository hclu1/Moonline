// ==================== DÉBUT DU FICHIER Admin.tsx (VERSION CORRIGÉE) ====================
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {Package, ShoppingCart, Users, TrendingUp, Settings, Save, Palette, FileText, Mail, Sparkles, Image as ImageIcon, LogOut} from 'lucide-react'
import toast from 'react-hot-toast'
import { useConfigStore, SiteConfig } from '../store/configStore'
import { supabase } from '../lib/supabaseClient'

interface Produit {
  id: string
  nom: string
  prix: number
  image?: string
  categorie: string
  stock: number
  statut: 'actif' | 'inactif'
  dateCreation: string
}

interface Commande {
  id: string
  client: string
  email: string
  total: number
  statut: 'en_attente' | 'traitee' | 'expediee' | 'livree'
  date: string
}

type ConfigTab = 'theme' | 'content' | 'contact' | 'settings' | 'visual' | 'advanced'

const Admin: React.FC = () => {
  const navigate = useNavigate()
  const { config, loadConfig, updateConfig } = useConfigStore()
  
  // ✅ NOUVEAU : États pour connexion Email/Password
 // ✅ REMPLACEZ PAR CECI (à partir de la ligne 36)
const [isAuthenticated, setIsAuthenticated] = useState(false)
const [pinInput, setPinInput] = useState('')
const [pinError, setPinError] = useState(false)
  
  const [ongletActif, setOngletActif] = useState<'dashboard' | 'produits' | 'commandes' | 'clients' | 'configuration'>('dashboard')
  const [activeConfigTab, setActiveConfigTab] = useState<ConfigTab>('theme')
  
  const [localConfig, setLocalConfig] = useState<Partial<SiteConfig>>({})
  const [saving, setSaving] = useState(false)

  const [produits] = useState<Produit[]>([
    {
      id: '1',
      nom: 'Tableau "Nébuleuse d\'Orion"',
      prix: 89.99,
      image: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?w=400',
      categorie: 'tableaux',
      stock: 12,
      statut: 'actif',
      dateCreation: '2025-01-10'
    },
    {
      id: '2',
      nom: 'Sac Tote "Constellation"',
      prix: 24.99,
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=400',
      categorie: 'sacs',
      stock: 25,
      statut: 'actif',
      dateCreation: '2025-01-12'
    },
    {
      id: '3',
      nom: 'T-shirt "Galaxie Spirale"',
      prix: 32.99,
      image: 'https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?w=400',
      categorie: 'vetements',
      stock: 0,
      statut: 'inactif',
      dateCreation: '2025-01-08'
    }
  ])

  const [commandes] = useState<Commande[]>([
    {
      id: 'CMD-001',
      client: 'Marie Dubois',
      email: 'marie.dubois@email.com',
      total: 114.98,
      statut: 'expediee',
      date: '2025-01-15'
    },
    {
      id: 'CMD-002',
      client: 'Pierre Martin',
      email: 'pierre.martin@email.com',
      total: 89.99,
      statut: 'traitee',
      date: '2025-01-16'
    },
    {
      id: 'CMD-003',
      client: 'Sophie Laurent',
      email: 'sophie.laurent@email.com',
      total: 57.98,
      statut: 'en_attente',
      date: '2025-01-16'
    }
  ])

  const stats = {
    totalProduits: produits.length,
    totalCommandes: commandes.length,
    chiffreAffaires: commandes.reduce((acc, cmd) => acc + cmd.total, 0),
    commandesEnAttente: commandes.filter(cmd => cmd.statut === 'en_attente').length
  }

  useEffect(() => {
    const auth = localStorage.getItem('admin_auth')
    if (auth === 'true') {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadConfig()
    }
  }, [isAuthenticated, loadConfig])

  // ✅ ✅ ✅ CORRECTION : Synchroniser localConfig avec config du store ✅ ✅ ✅
  useEffect(() => {
    if (config && Object.keys(config).length > 0) {
      console.log('🔄 Synchronisation localConfig avec config du store:', config)
      setLocalConfig(config)
    }
  }, [config])
  // ✅ AJOUTEZ CES LIGNES entre ligne 133 et 135
const handleConfigChange = (key: keyof SiteConfig, value: any) => {
  console.log('📝 Modification:', key, '=', value)
  setLocalConfig(prev => ({ ...prev, [key]: value }))
}


 const handlePinSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  const correctPin = '1234'
  
  if (pinInput === correctPin) {
    try {
      // ✅ Connexion avec email + mot de passe simple
      const { data, error } = await supabase.auth.signInWithPassword({
        email: 'hchampag1@hotmail.fr',
        password: 'TempPassword123!'  // ⬬ Mot de passe temporaire
      })
      
      if (error) {
        // Si le mot de passe est incorrect, on crée le compte !
        console.log('⚠️ Mot de passe incorrect, création du compte...')
        
        const { error: signUpError } = await supabase.auth.signUp({
          email: 'hchampag1@hotmail.fr',
          password: 'TempPassword123!',
          options: {
            emailRedirectTo: undefined // Pas de redirection
          }
        })
        
        if (signUpError) {
          toast.error('❌ Erreur création compte')
          return
        }
        
        // Réessayer la connexion
        await supabase.auth.signInWithPassword({
          email: 'hchampag1@hotmail.fr',
          password: 'herve3131'
        })
      }
      
      setIsAuthenticated(true)
      localStorage.setItem('admin_auth', 'true')
      toast.success('✅ Connecté à Supabase !')
      await loadConfig()
      
    } catch (error) {
      console.error('❌ Exception:', error)
      toast.error('❌ Erreur connexion')
    }
  } else {
    setPinError(true)
    toast.error('❌ Code incorrect !')
    setPinInput('')
  }
}


// Puis votre handleSaveConfig (qui est déjà correct)


const handleSaveConfig = async () => {
  console.log('🚀 SAUVEGARDE')
  setSaving(true)
  
  try {
    if (!localConfig || Object.keys(localConfig).length < 10) {
      console.error('❌ Config incomplète')
      toast.error('❌ Configuration incomplète')
      setSaving(false)
      return
    }
    
    const success = await updateConfig(localConfig, `Config ${new Date().toLocaleString()}`)
    
    if (success) {
      toast.success('✅ Enregistré !')
      await loadConfig()
    } else {
      toast.error('❌ Erreur')
    }
  } catch (error) {
    console.error('❌ Exception:', error)
    toast.error('❌ Erreur')
  } finally {
    setSaving(false)
  }
}   
 
  const handleLogout = () => {
    localStorage.removeItem('admin_auth')
    setIsAuthenticated(false)
    toast.success('Déconnexion')
    navigate('/')
  }
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="bg-slate-800/50 backdrop-blur-lg p-8 rounded-2xl border border-purple-500/30 w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Accès Admin</h1>
            <p className="text-gray-400">Entrez le code PIN</p>
          </div>
          <form onSubmit={handlePinSubmit} className="space-y-4">
            <input
              type="password"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Code PIN"
              className={`w-full px-4 py-3 rounded-lg bg-slate-700/50 text-white border ${
                pinError ? 'border-red-500' : 'border-purple-500/30'
              } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              maxLength={4}
            />
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              Valider
            </button>
          </form>
        </div>
      </div>
    )
  }

  const onglets = [
    { id: 'dashboard', nom: 'Tableau de bord', icone: TrendingUp },
    { id: 'produits', nom: 'Produits', icone: Package },
    { id: 'commandes', nom: 'Commandes', icone: ShoppingCart },
    { id: 'clients', nom: 'Clients', icone: Users },
    { id: 'configuration', nom: 'Configuration', icone: Settings }
  ]

  const configTabs = [
    { id: 'theme' as ConfigTab, label: 'Thème & Couleurs', icon: Palette },
    { id: 'visual' as ConfigTab, label: 'Effets Visuels', icon: Sparkles },
    { id: 'content' as ConfigTab, label: 'Contenu', icon: FileText },
    { id: 'contact' as ConfigTab, label: 'Coordonnées', icon: Mail },
    { id: 'advanced' as ConfigTab, label: 'Avancé', icon: ImageIcon },
    { id: 'settings' as ConfigTab, label: 'Paramètres', icon: Settings },
  ]

  const getStatutCommande = (statut: string) => {
    const styles = {
      'en_attente': 'bg-yellow-900/30 text-yellow-300 border-yellow-500/30',
      'traitee': 'bg-blue-900/30 text-blue-300 border-blue-500/30',
      'expediee': 'bg-purple-900/30 text-purple-300 border-purple-500/30',
      'livree': 'bg-green-900/30 text-green-300 border-green-500/30'
    }
    
    const labels = {
      'en_attente': 'En attente',
      'traitee': 'Traitée',
      'expediee': 'Expédiée',
      'livree': 'Livrée'
    }

    return { style: styles[statut as keyof typeof styles], label: labels[statut as keyof typeof labels] }
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm py-6 sm:py-8 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Administration MOONLINE ART</h1>
            <p className="text-sm sm:text-base text-gray-300">Mode développement</p>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg">
            <LogOut size={18} />
            <span className="hidden sm:inline">Retour</span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="flex space-x-1 mb-8 bg-slate-800/30 backdrop-blur-sm rounded-lg p-1 border border-purple-500/20 overflow-x-auto">
          {onglets.map(onglet => {
            const IconeComponent = onglet.icone
            return (
              <button
                key={onglet.id}
                onClick={() => setOngletActif(onglet.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                  ongletActif === onglet.id ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                }`}
              >
                <IconeComponent size={20} />
                <span>{onglet.nom}</span>
              </button>
            )
          })}
        </div>

        {ongletActif === 'dashboard' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Produits</p>
                    <p className="text-2xl font-bold text-white">{stats.totalProduits}</p>
                  </div>
                  <Package className="text-purple-400" size={32} />
                </div>
              </div>
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Commandes</p>
                    <p className="text-2xl font-bold text-white">{stats.totalCommandes}</p>
                  </div>
                  <ShoppingCart className="text-blue-400" size={32} />
                </div>
              </div>
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Chiffre d'affaires</p>
                    <p className="text-2xl font-bold text-white">{stats.chiffreAffaires.toFixed(2)} €</p>
                  </div>
                  <TrendingUp className="text-green-400" size={32} />
                </div>
              </div>
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">En attente</p>
                    <p className="text-2xl font-bold text-white">{stats.commandesEnAttente}</p>
                  </div>
                  <div className="w-8 h-8 bg-yellow-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">!</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
              <h3 className="text-xl font-bold text-white mb-4">Commandes récentes</h3>
              <div className="space-y-3">
                {commandes.slice(0, 3).map(commande => {
                  const { style, label } = getStatutCommande(commande.statut)
                  return (
                    <div key={commande.id} className="flex items-center justify-between p-4 bg-slate-700/30 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{commande.id}</p>
                        <p className="text-gray-400 text-sm">{commande.client}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">{commande.total.toFixed(2)} €</p>
                        <span className={`inline-block px-2 py-1 rounded-full text-xs border ${style}`}>{label}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}

        {ongletActif === 'produits' && (
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">Gestion des produits</h2>
            <p className="text-gray-400">Fonctionnalité en développement...</p>
          </div>
        )}

        {ongletActif === 'commandes' && (
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">Gestion des commandes</h2>
            <p className="text-gray-400">Fonctionnalité en développement...</p>
          </div>
        )}

        {ongletActif === 'clients' && (
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">Gestion des clients</h2>
            <p className="text-gray-400">Fonctionnalité en développement...</p>
          </div>
        )}

        {ongletActif === 'configuration' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Configuration du site</h2>
              <button 
                onClick={handleSaveConfig} 
                disabled={saving} 
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Save size={20} />
                {saving ? 'Enregistrement...' : 'Sauvegarder'}
              </button>
            </div>

            <div className="flex space-x-1 bg-slate-800/30 backdrop-blur-sm rounded-lg p-1 border border-purple-500/20 overflow-x-auto">
              {configTabs.map(tab => {
                const IconComponent = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveConfigTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all whitespace-nowrap ${
                      activeConfigTab === tab.id ? 'bg-purple-600 text-white' : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {activeConfigTab === 'theme' && (
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">Couleurs principales</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ColorInput label="Couleur primaire" value={localConfig.primary_color || ''} onChange={(v) => handleConfigChange('primary_color', v)} />
                  <ColorInput label="Couleur secondaire" value={localConfig.secondary_color || ''} onChange={(v) => handleConfigChange('secondary_color', v)} />
                  <ColorInput label="Couleur accent" value={localConfig.accent_color || ''} onChange={(v) => handleConfigChange('accent_color', v)} />
                  <ColorInput label="Couleur fond" value={localConfig.background_color || ''} onChange={(v) => handleConfigChange('background_color', v)} />
                </div>
              </div>
            )}

            {activeConfigTab === 'content' && (
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">Textes du site</h3>
                <div className="space-y-4">
                  <TextInput label="Nom du site" value={localConfig.site_name || ''} onChange={(v) => handleConfigChange('site_name', v)} />
                  <TextInput label="Slogan" value={localConfig.site_slogan || ''} onChange={(v) => handleConfigChange('site_slogan', v)} />
                </div>
              </div>
            )}

            {activeConfigTab === 'visual' && (
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">Effets visuels</h3>
                <div className="space-y-4">
                  <CheckboxInput label="Activer les particules" checked={localConfig.enable_particles || false} onChange={(v) => handleConfigChange('enable_particles', v)} />
                  <CheckboxInput label="Activer les étoiles" checked={localConfig.enable_stars || false} onChange={(v) => handleConfigChange('enable_stars', v)} />
                  <NumberInput label="Nombre de particules" value={localConfig.particles_count || 0} onChange={(v) => handleConfigChange('particles_count', v)} />
                </div>
              </div>
            )}

            {activeConfigTab === 'contact' && (
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">Coordonnées</h3>
                <div className="space-y-4">
                  <TextInput label="Email" type="email" value={localConfig.contact_email || ''} onChange={(v) => handleConfigChange('contact_email', v)} />
                  <TextInput label="Téléphone" type="tel" value={localConfig.contact_phone || ''} onChange={(v) => handleConfigChange('contact_phone', v)} />
                </div>
              </div>
            )}

            {activeConfigTab === 'settings' && (
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">Paramètres</h3>
                <div className="space-y-4">
                  <CheckboxInput label="Afficher les prix" checked={localConfig.show_prices || false} onChange={(v) => handleConfigChange('show_prices', v)} />
                  <NumberInput label="Frais de livraison (€)" value={localConfig.shipping_cost || 0} onChange={(v) => handleConfigChange('shipping_cost', v)} step={0.1} />
                </div>
              </div>
            )}

            {activeConfigTab === 'advanced' && (
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">Images</h3>
                <div className="space-y-4">
                  <ImageUploadInput label="Logo" value={localConfig.logo_url || ''} onChange={(v) => handleConfigChange('logo_url', v)} />
                  <ImageUploadInput label="Image hero" value={localConfig.hero_background_image || ''} onChange={(v) => handleConfigChange('hero_background_image', v)} />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ==================== COMPOSANTS UTILITAIRES ====================

function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
      <div className="flex gap-2">
        <input 
          type="color" 
          value={value || '#000000'} 
          onChange={(e) => onChange(e.target.value)} 
          className="h-10 w-20 border border-purple-500/30 rounded cursor-pointer" 
        />
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)} 
          placeholder="#000000" 
          className="flex-1 px-3 py-2 border border-purple-500/30 rounded bg-slate-700/50 text-white focus:ring-2 focus:ring-purple-500" 
        />
      </div>
    </div>
  )
}

function TextInput({ label, value, onChange, type = 'text', placeholder = '' }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
      <input 
        type={type} 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder={placeholder} 
        className="w-full px-3 py-2 border border-purple-500/30 rounded bg-slate-700/50 text-white focus:ring-2 focus:ring-purple-500" 
      />
    </div>
  )
}

function NumberInput({ label, value, onChange, step = 1 }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
      <input 
        type="number" 
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))} 
        step={step} 
        className="w-full px-3 py-2 border border-purple-500/30 rounded bg-slate-700/50 text-white focus:ring-2 focus:ring-purple-500" 
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
        className="w-5 h-5 text-purple-600 rounded" 
      />
      <span className="text-sm font-medium text-gray-300">{label}</span>
    </label>
  )
}

function ImageUploadInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false)

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const name = `${Date.now()}.${ext}`
      const { error } = await supabase.storage.from('PRODUITS-IMAGES').upload(name, file)
      if (error) throw error

      const { data } = supabase.storage.from('PRODUITS-IMAGES').getPublicUrl(name)
      onChange(data.publicUrl)
      toast.success('Image uploadée !')
    } catch (error) {
      console.error(error)
      toast.error('Erreur upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
      <input 
        type="text" 
        value={value} 
        onChange={(e) => onChange(e.target.value)} 
        placeholder="URL" 
        className="w-full px-3 py-2 mb-2 border border-purple-500/30 rounded bg-slate-700/50 text-white" 
      />
      <input 
        type="file" 
        accept="image/*" 
        onChange={handleUpload} 
        disabled={uploading} 
        className="text-sm text-gray-300" 
      />
    </div>
  )
}

export default Admin

// ==================== FIN DU FICHIER ====================
