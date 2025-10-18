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
  const { config, loading, loadConfig, updateConfig, isAdmin, currentUser, checkAuth } = useConfigStore()
  
  // TOUS LES HOOKS EN PREMIER
  const [ongletActif, setOngletActif] = useState<'dashboard' | 'produits' | 'commandes' | 'clients' | 'configuration'>('dashboard')
  const [modaleProduit, setModaleProduit] = useState<{ ouvert: boolean; produit?: Produit }>({ ouvert: false })
  const [activeConfigTab, setActiveConfigTab] = useState<ConfigTab>('theme')
  const [localConfig, setLocalConfig] = useState<Partial<SiteConfig>>({})
  const [saving, setSaving] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)

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

      // Vérifier l'authentification au montage
  useEffect(() => {
    const initAuth = async () => {
      console.log('🚀 Admin: Début initAuth')
      setAuthLoading(true)
      
      await checkAuth()
      
      // ✅ Attendre que Zustand mette à jour le state
      await new Promise(resolve => setTimeout(resolve, 200))
      
      // Récupérer le state frais après checkAuth
      const { isAdmin: adminStatus, currentUser: user } = useConfigStore.getState()
      
      console.log('📊 Admin: State après checkAuth:', {
        isAdmin: adminStatus,
        currentUser: user?.email
      })
      
      if (adminStatus && user) {
        console.log('✅ Admin: Chargement config...')
        await loadConfig()
      } else {
        console.log('❌ Admin: Pas admin ou pas de user')
      }
      
      setAuthLoading(false)
      console.log('🏁 Admin: Fin initAuth')
    }
    
    initAuth()
  }, []) // ✅ TABLEAU VIDE - important !


  // Rediriger si non authentifié
  useEffect(() => {
    if (!authLoading && (!isAdmin || !currentUser)) {
      toast.error('Vous devez être connecté en tant qu\'admin')
      navigate('/login')
    }
  }, [isAdmin, currentUser, navigate, authLoading])

  // Synchroniser localConfig avec config (UNE SEULE FOIS)
  useEffect(() => {
    if (config) {
      setLocalConfig(config)
    }
  }, [config])

  // Debug logs
  console.log('🔍 Admin Debug:', {
    authLoading,
    loading,
    isAdmin,
    currentUser: currentUser?.email,
    configExists: !!config,
  })

  const handleConfigChange = (key: keyof SiteConfig, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    const success = await updateConfig(localConfig, `Configuration ${new Date().toLocaleString()}`)
    setSaving(false)
    
    if (success) {
      toast.success('Configuration enregistrée avec succès !')
    } else {
      toast.error('Erreur lors de l\'enregistrement')
    }
  }

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Déconnexion réussie')
      navigate('/login')
    } catch (error) {
      console.error('Erreur déconnexion:', error)
      toast.error('Erreur lors de la déconnexion')
    }
  }

  // CONDITIONS DE RENDU APRÈS TOUS LES HOOKS
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin || !currentUser) {
    return null
  }

  // Variables calculées
  const stats = {
    totalProduits: produits.length,
    totalCommandes: commandes.length,
    chiffreAffaires: commandes.reduce((total, cmd) => total + cmd.total, 0),
    commandesEnAttente: commandes.filter(cmd => cmd.statut === 'en_attente').length
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

  const changerStatutCommande = (commandeId: string, nouveauStatut: string) => {
    toast.success(`Statut de la commande ${commandeId} mis à jour`)
  }

  return (
    <div className="min-h-screen pt-16">
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm py-6 sm:py-8 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Administration MOONLINE ART</h1>
            <p className="text-sm sm:text-base text-gray-300">
              Connecté: <span className="text-purple-400 font-semibold">{currentUser?.email}</span>
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Déconnexion</span>
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
                  ongletActif === onglet.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
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
                        <span className={`inline-block px-2 py-1 rounded-full text-xs border ${style}`}>
                          {label}
                        </span>
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Gestion des produits</h2>
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition">
                Ajouter un produit
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-purple-500/20">
                    <th className="pb-3 text-gray-300">Produit</th>
                    <th className="pb-3 text-gray-300">Catégorie</th>
                    <th className="pb-3 text-gray-300">Prix</th>
                    <th className="pb-3 text-gray-300">Stock</th>
                    <th className="pb-3 text-gray-300">Statut</th>
                    <th className="pb-3 text-gray-300">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {produits.map(produit => (
                    <tr key={produit.id} className="border-b border-purple-500/10">
                      <td className="py-4">
                        <div className="flex items-center space-x-3">
                          {produit.image && (
                            <img src={produit.image} alt={produit.nom} className="w-12 h-12 rounded object-cover" />
                          )}
                          <span className="text-white">{produit.nom}</span>
                        </div>
                      </td>
                      <td className="py-4 text-gray-300 capitalize">{produit.categorie}</td>
                      <td className="py-4 text-white">{produit.prix.toFixed(2)} €</td>
                      <td className="py-4 text-gray-300">{produit.stock}</td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          produit.statut === 'actif' 
                            ? 'bg-green-900/30 text-green-300' 
                            : 'bg-red-900/30 text-red-300'
                        }`}>
                          {produit.statut}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className="text-blue-400 hover:text-blue-300 mr-3">Modifier</button>
                        <button className="text-red-400 hover:text-red-300">Supprimer</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {ongletActif === 'commandes' && (
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">Gestion des commandes</h2>
            
            <div className="space-y-4">
              {commandes.map(commande => {
                const { style, label } = getStatutCommande(commande.statut)
                return (
                  <div key={commande.id} className="bg-slate-700/30 rounded-lg p-5 border border-purple-500/10">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{commande.id}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs border ${style}`}>
                            {label}
                          </span>
                        </div>
                        <p className="text-gray-300">{commande.client}</p>
                        <p className="text-gray-400 text-sm">{commande.email}</p>
                        <p className="text-gray-400 text-sm mt-1">{commande.date}</p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-2xl font-bold text-white">{commande.total.toFixed(2)} €</p>
                        </div>
                        
                        <select
                          value={commande.statut}
                          onChange={(e) => changerStatutCommande(commande.id, e.target.value)}
                          className="bg-slate-700 text-white px-3 py-2 rounded-lg border border-purple-500/30 focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="en_attente">En attente</option>
                          <option value="traitee">Traitée</option>
                          <option value="expediee">Expédiée</option>
                          <option value="livree">Livrée</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
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
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50"
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
                      activeConfigTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {activeConfigTab === 'theme' && (
              <div className="space-y-6">
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Couleurs principales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ColorInput label="Couleur primaire" value={localConfig.primary_color || ''} onChange={(v) => handleConfigChange('primary_color', v)} />
                    <ColorInput label="Couleur secondaire" value={localConfig.secondary_color || ''} onChange={(v) => handleConfigChange('secondary_color', v)} />
                    <ColorInput label="Couleur accent" value={localConfig.accent_color || ''} onChange={(v) => handleConfigChange('accent_color', v)} />
                    <ColorInput label="Couleur fond" value={localConfig.background_color || ''} onChange={(v) => handleConfigChange('background_color', v)} />
                    <ColorInput label="Couleur texte" value={localConfig.text_color || ''} onChange={(v) => handleConfigChange('text_color', v)} />
                  </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">En-tête et pied de page</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <ColorInput label="Fond en-tête" value={localConfig.header_bg_color || ''} onChange={(v) => handleConfigChange('header_bg_color', v)} />
                    <ColorInput label="Fond pied de page" value={localConfig.footer_bg_color || ''} onChange={(v) => handleConfigChange('footer_bg_color', v)} />
                  </div>
                </div>
              </div>
            )}

            {activeConfigTab === 'visual' && (
              <div className="space-y-6">
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Particules animées</h3>
                  <div className="space-y-4">
                    <CheckboxInput label="Activer les particules" checked={localConfig.enable_particles || false} onChange={(v) => handleConfigChange('enable_particles', v)} />
                    <ColorInput label="Couleur des particules" value={localConfig.particles_color || ''} onChange={(v) => handleConfigChange('particles_color', v)} />
                    <NumberInput label="Nombre de particules" value={localConfig.particles_count || 0} onChange={(v) => handleConfigChange('particles_count', v)} />
                  </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Étoiles animées</h3>
                  <div className="space-y-4">
                    <CheckboxInput label="Activer les étoiles" checked={localConfig.enable_stars || false} onChange={(v) => handleConfigChange('enable_stars', v)} />
                    <ColorInput label="Couleur des étoiles" value={localConfig.stars_color || ''} onChange={(v) => handleConfigChange('stars_color', v)} />
                    <NumberInput label="Nombre d'étoiles" value={localConfig.stars_count || 0} onChange={(v) => handleConfigChange('stars_count', v)} />
                  </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Effets visuels</h3>
                  <div className="space-y-4">
                    <CheckboxInput label="Activer les effets de flou" checked={localConfig.enable_blur_effects || false} onChange={(v) => handleConfigChange('enable_blur_effects', v)} />
                    <CheckboxInput label="Activer les dégradés" checked={localConfig.enable_gradient_backgrounds || false} onChange={(v) => handleConfigChange('enable_gradient_backgrounds', v)} />
                    <ColorInput label="Couleur début dégradé" value={localConfig.gradient_start_color || ''} onChange={(v) => handleConfigChange('gradient_start_color', v)} />
                    <ColorInput label="Couleur fin dégradé" value={localConfig.gradient_end_color || ''} onChange={(v) => handleConfigChange('gradient_end_color', v)} />
                  </div>
                </div>
              </div>
            )}

            {activeConfigTab === 'advanced' && (
              <div className="space-y-6">
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Images de fond</h3>
                  <div className="space-y-4">
                    <ImageUploadInput label="Image hero (page d'accueil)" value={localConfig.hero_background_image || ''} onChange={(v) => handleConfigChange('hero_background_image', v)} />
                    <NumberInput label="Opacité overlay hero (0-1)" value={localConfig.hero_background_overlay_opacity || 0} onChange={(v) => handleConfigChange('hero_background_overlay_opacity', v)} step={0.1} />
                    <ImageUploadInput label="Image page À propos" value={localConfig.about_background_image || ''} onChange={(v) => handleConfigChange('about_background_image', v)} />
                    <ImageUploadInput label="Image page Boutique" value={localConfig.boutique_background_image || ''} onChange={(v) => handleConfigChange('boutique_background_image', v)} />
                  </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Logos et icônes</h3>
                  <div className="space-y-4">
                    <ImageUploadInput label="Logo du site" value={localConfig.logo_url || ''} onChange={(v) => handleConfigChange('logo_url', v)} />
                    <ImageUploadInput label="Favicon" value={localConfig.favicon_url || ''} onChange={(v) => handleConfigChange('favicon_url', v)} />
                    <ImageUploadInput label="Icône hero" value={localConfig.hero_icon_url || ''} onChange={(v) => handleConfigChange('hero_icon_url', v)} />
                  </div>
                </div>
              </div>
            )}

            {activeConfigTab === 'content' && (
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-xl font-semibold text-white mb-4">Textes du site</h3>
                <div className="space-y-4">
                  <TextInput label="Nom du site" value={localConfig.site_name || ''} onChange={(v) => handleConfigChange('site_name', v)} />
                  <TextInput label="Slogan" value={localConfig.site_slogan || ''} onChange={(v) => handleConfigChange('site_slogan', v)} />
                  <TextInput label="Titre hero page d'accueil" value={localConfig.home_hero_title || ''} onChange={(v) => handleConfigChange('home_hero_title', v)} />
                  <TextInput label="Sous-titre hero" value={localConfig.home_hero_subtitle || ''} onChange={(v) => handleConfigChange('home_hero_subtitle', v)} />
                  <TextInput label="Titre page À propos" value={localConfig.about_title || ''} onChange={(v) => handleConfigChange('about_title', v)} />
                  <TextareaInput label="Description À propos" value={localConfig.about_description || ''} onChange={(v) => handleConfigChange('about_description', v)} rows={6} />
                </div>
              </div>
            )}

            {activeConfigTab === 'contact' && (
              <div className="space-y-6">
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Coordonnées</h3>
                  <div className="space-y-4">
                    <TextInput label="Email de contact" type="email" value={localConfig.contact_email || ''} onChange={(v) => handleConfigChange('contact_email', v)} />
                    <TextInput label="Téléphone" type="tel" value={localConfig.contact_phone || ''} onChange={(v) => handleConfigChange('contact_phone', v)} />
                    <TextareaInput label="Adresse" value={localConfig.contact_address || ''} onChange={(v) => handleConfigChange('contact_address', v)} rows={3} />
                  </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Réseaux sociaux</h3>
                  <div className="space-y-4">
                    <TextInput label="Facebook (URL complète)" value={localConfig.facebook_url || ''} onChange={(v) => handleConfigChange('facebook_url', v)} placeholder="https://facebook.com/votre-page" />
                    <TextInput label="Instagram (URL complète)" value={localConfig.instagram_url || ''} onChange={(v) => handleConfigChange('instagram_url', v)} placeholder="https://instagram.com/votre-compte" />
                    <TextInput label="Twitter/X (URL complète)" value={localConfig.twitter_url || ''} onChange={(v) => handleConfigChange('twitter_url', v)} placeholder="https://twitter.com/votre-compte" />
                  </div>
                </div>
              </div>
            )}

            {activeConfigTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Paramètres de livraison</h3>
                  <div className="space-y-4">
                    <NumberInput label="Frais de livraison (€)" value={localConfig.shipping_cost || 0} onChange={(v) => handleConfigChange('shipping_cost', v)} step={0.1} />
                    <NumberInput label="Seuil livraison gratuite (€)" value={localConfig.free_shipping_threshold || 0} onChange={(v) => handleConfigChange('free_shipping_threshold', v)} />
                    <NumberInput label="Délai de traitement (jours)" value={localConfig.order_processing_days || 0} onChange={(v) => handleConfigChange('order_processing_days', v)} />
                    <NumberInput label="Délai commandes personnalisées (jours)" value={localConfig.custom_order_delay_days || 0} onChange={(v) => handleConfigChange('custom_order_delay_days', v)} />
                  </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Options d'affichage</h3>
                  <div className="space-y-4">
                    <CheckboxInput label="Afficher les prix" checked={localConfig.show_prices || false} onChange={(v) => handleConfigChange('show_prices', v)} />
                    <CheckboxInput label="Autoriser les commandes personnalisées" checked={localConfig.allow_custom_orders || false} onChange={(v) => handleConfigChange('allow_custom_orders', v)} />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


// COMPOSANTS UTILITAIRES
function ColorInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 w-20 border border-purple-500/30 rounded cursor-pointer bg-slate-700/50"
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
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

function TextareaInput({ label, value, onChange, rows = 4 }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
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
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 text-purple-600 rounded border-purple-500/30 bg-slate-700/50 focus:ring-2 focus:ring-purple-500"
        />
      </div>
      <span className="text-sm font-medium text-gray-300 group-hover:text-white">{label}</span>
    </label>
  )
}

function ImageUploadInput({ label, value, onChange }: { label: string, value: string, onChange: (v: string) => void }) {
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `config/${Date.now()}.${fileExt}`

      const { error } = await supabase.storage
        .from('PRODUITS-IMAGES')
        .upload(fileName, file)

      if (error) throw error

      const { data } = supabase.storage
        .from('PRODUITS-IMAGES')
        .getPublicUrl(fileName)

      onChange(data.publicUrl)
      toast.success('Image uploadée !')
    } catch (error) {
      console.error('Erreur upload:', error)
      toast.error('Erreur lors de l\'upload')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium mb-2 text-gray-300">{label}</label>
      <div className="space-y-2">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL de l'image"
          className="w-full px-3 py-2 border border-purple-500/30 rounded bg-slate-700/50 text-white focus:ring-2 focus:ring-purple-500"
        />
        <div className="flex gap-2 items-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
            id={`upload-${label.replace(/\s/g, '-')}`}
          />
          <label
            htmlFor={`upload-${label.replace(/\s/g, '-')}`}
            className={`cursor-pointer bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded text-sm ${uploading ? 'opacity-50' : ''}`}
          >
            {uploading ? 'Upload...' : 'Uploader une image'}
          </label>
          {value && (
            <img src={value} alt="Preview" className="h-10 w-10 object-cover rounded border border-purple-500/30" />
          )}
        </div>
      </div>
    </div>
  )
}

export default Admin
