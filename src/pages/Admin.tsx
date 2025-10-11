import React, { useState, useEffect } from 'react'
import {Package, ShoppingCart, Users, TrendingUp, Plus, Edit, Trash2, Eye, Settings, Save, Palette, FileText, Mail} from 'lucide-react'
import toast from 'react-hot-toast'
import { useConfigStore, SiteConfig } from '../store/configStore'

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

type ConfigTab = 'theme' | 'content' | 'contact' | 'settings'

const Admin: React.FC = () => {
  const [ongletActif, setOngletActif] = useState<'dashboard' | 'produits' | 'commandes' | 'clients' | 'configuration'>('dashboard')
  const [modaleProduit, setModaleProduit] = useState<{ ouvert: boolean; produit?: Produit }>({ ouvert: false })
  
  // Configuration
  const { config, loading, loadConfig, updateMultipleConfig } = useConfigStore()
  const [activeConfigTab, setActiveConfigTab] = useState<ConfigTab>('theme')
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

  const handleConfigChange = (key: keyof SiteConfig, value: any) => {
    setLocalConfig(prev => ({ ...prev, [key]: value }))
  }

  const handleSaveConfig = async () => {
    setSaving(true)
    const success = await updateMultipleConfig(localConfig)
    setSaving(false)
    
    if (success) {
      toast.success('Configuration enregistrée avec succès !')
    } else {
      toast.error('Erreur lors de l\'enregistrement')
    }
  }

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
    { id: 'content' as ConfigTab, label: 'Contenu', icon: FileText },
    { id: 'contact' as ConfigTab, label: 'Coordonnées', icon: Mail },
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Administration MOONLINE ART</h1>
          <p className="text-sm sm:text-base text-gray-300">Gestion de votre boutique en ligne</p>
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Gestion des produits</h2>
              <button
                onClick={() => setModaleProduit({ ouvert: true })}
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Ajouter un produit</span>
              </button>
            </div>

            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-medium">Image</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Produit</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Catégorie</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Prix</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Stock</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Statut</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {produits.map(produit => (
                      <tr key={produit.id} className="border-t border-slate-700/50">
                        <td className="p-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700/50 border border-purple-500/20">
                            {produit.image ? (
                              <img src={produit.image} alt={produit.nom} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="text-gray-500" size={24} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-white font-medium">{produit.nom}</td>
                        <td className="p-4 text-gray-300">{produit.categorie}</td>
                        <td className="p-4 text-white font-medium">{produit.prix.toFixed(2)} €</td>
                        <td className="p-4">
                          <span className={`${produit.stock === 0 ? 'text-red-400' : 'text-white'}`}>
                            {produit.stock}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            produit.statut === 'actif' 
                              ? 'bg-green-900/30 text-green-300 border border-green-500/30'
                              : 'bg-red-900/30 text-red-300 border border-red-500/30'
                          }`}>
                            {produit.statut}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex space-x-2">
                            <button className="text-blue-400 hover:text-blue-300"><Eye size={16} /></button>
                            <button onClick={() => setModaleProduit({ ouvert: true, produit })} className="text-yellow-400 hover:text-yellow-300"><Edit size={16} /></button>
                            <button className="text-red-400 hover:text-red-300"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {ongletActif === 'commandes' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Gestion des commandes</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-purple-500/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-700/50">
                    <tr>
                      <th className="text-left p-4 text-gray-300 font-medium">Commande</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Client</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Total</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Date</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Statut</th>
                      <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {commandes.map(commande => {
                      const { style, label } = getStatutCommande(commande.statut)
                      return (
                        <tr key={commande.id} className="border-t border-slate-700/50">
                          <td className="p-4 text-white font-medium">{commande.id}</td>
                          <td className="p-4">
                            <div className="text-white">{commande.client}</div>
                            <div className="text-gray-400 text-sm">{commande.email}</div>
                          </td>
                          <td className="p-4 text-white font-medium">{commande.total.toFixed(2)} €</td>
                          <td className="p-4 text-gray-300">{commande.date}</td>
                          <td className="p-4">
                            <select
                              value={commande.statut}
                              onChange={(e) => changerStatutCommande(commande.id, e.target.value)}
                              className={`px-2 py-1 rounded text-xs border bg-transparent ${style}`}
                            >
                              <option value="en_attente">En attente</option>
                              <option value="traitee">Traitée</option>
                              <option value="expediee">Expédiée</option>
                              <option value="livree">Livrée</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <button className="text-blue-400 hover:text-blue-300"><Eye size={16} /></button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {ongletActif === 'clients' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Gestion des clients</h2>
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-purple-500/20 text-center">
              <Users className="mx-auto mb-4 text-gray-400" size={64} />
              <h3 className="text-xl font-semibold text-white mb-2">Gestion des clients</h3>
              <p className="text-gray-400">Cette fonctionnalité sera disponible prochainement</p>
            </div>
          </div>
        )}

        {ongletActif === 'configuration' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Configuration du site</h2>
              <button
                onClick={handleSaveConfig}
                disabled={saving}
                className="flex items-center gap-2 bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 font-semibold"
              >
                <Save size={20} />
                {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>

            <div className="flex space-x-1 bg-slate-800/30 backdrop-blur-sm rounded-lg p-1 border border-purple-500/20 overflow-x-auto">
              {configTabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveConfigTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                      activeConfigTab === tab.id
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon size={18} />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {activeConfigTab === 'theme' && (
              <div className="space-y-6">
                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-xl font-semibold text-white mb-4">Couleurs du thème</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ColorInput label="Couleur principale" value={localConfig.primary_color || '#3b82f6'} onChange={(v) => handleConfigChange('primary_color', v)} />
                    <ColorInput label="Couleur secondaire" value={localConfig.secondary_color || '#8b5cf6'} onChange={(v) => handleConfigChange('secondary_color', v)} />
                    <ColorInput label="Couleur accent" value={localConfig.accent_color || '#f59e0b'} onChange={(v) => handleConfigChange('accent_color', v)} />
                    <ColorInput label="Fond de page" value={localConfig.background_color || '#ffffff'} onChange={(v) => handleConfigChange('background_color', v)} />
                    <ColorInput label="Couleur du texte" value={localConfig.text_color || '#1f2937'} onChange={(v) => handleConfigChange('text_color', v)} />
                    <ColorInput label="Fond du header" value={localConfig.header_bg_color || '#1e40af'} onChange={(v) => handleConfigChange('header_bg_color', v)} />
                    <ColorInput label="Fond du footer" value={localConfig.footer_bg_color || '#1f2937'} onChange={(v) => handleConfigChange('footer_bg_color', v)} />
                  </div>
                </div>

                <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <h3 className="text-lg font-semibold text-white mb-4">Aperçu</h3>
                  <div className="space-y-4">
                    <div className="p-4 rounded-lg" style={{ backgroundColor: localConfig.header_bg_color }}>
                      <p className="text-white font-bold">Header (exemple)</p>
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <button className="px-4 py-2 rounded text-white" style={{ backgroundColor: localConfig.primary_color }}>Bouton principal</button>
                      <button className="px-4 py-2 rounded text-white" style={{ backgroundColor: localConfig.secondary_color }}>Bouton secondaire</button>
                      <button className="px-4 py-2 rounded text-white" style={{ backgroundColor: localConfig.accent_color }}>Bouton accent</button>
                    </div>
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

export default Admin