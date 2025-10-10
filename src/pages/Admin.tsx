import React, { useState } from 'react'
import {Package, ShoppingCart, Users, TrendingUp, Plus, Edit, Trash2, Eye} from 'lucide-react'
import toast from 'react-hot-toast'

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

/**
 * Interface d'administration
 */
const Admin: React.FC = () => {
  const [ongletActif, setOngletActif] = useState<'dashboard' | 'produits' | 'commandes' | 'clients'>('dashboard')
  const [modaleProduit, setModaleProduit] = useState<{ ouvert: boolean; produit?: Produit }>({ ouvert: false })

  // Données d'exemple avec images
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

  // Statistiques
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
    { id: 'clients', nom: 'Clients', icone: Users }
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
      {/* En-tête admin */}
      <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm py-6 sm:py-8 border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-3 sm:px-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">Administration MOONLINE ART</h1>
          <p className="text-sm sm:text-base text-gray-300">Gestion de votre boutique en ligne</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
        {/* Navigation des onglets */}
        <div className="flex space-x-1 mb-8 bg-slate-800/30 backdrop-blur-sm rounded-lg p-1 border border-purple-500/20">
          {onglets.map(onglet => {
            const IconeComponent = onglet.icone
            return (
              <button
                key={onglet.id}
                onClick={() => setOngletActif(onglet.id as any)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
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

        {/* Contenu des onglets */}
        {ongletActif === 'dashboard' && (
          <div className="space-y-8">
            {/* Cartes de statistiques */}
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

            {/* Commandes récentes */}
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
            {/* En-tête avec bouton d'ajout */}
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

            {/* Liste des produits avec vignettes */}
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
                        {/* Vignette du produit */}
                        <td className="p-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-700/50 border border-purple-500/20">
                            {produit.image ? (
                              <img
                                src={produit.image}
                                alt={produit.nom}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="text-gray-500" size={24} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="text-white font-medium">{produit.nom}</div>
                        </td>
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
                            <button className="text-blue-400 hover:text-blue-300">
                              <Eye size={16} />
                            </button>
                            <button 
                              onClick={() => setModaleProduit({ ouvert: true, produit })}
                              className="text-yellow-400 hover:text-yellow-300"
                            >
                              <Edit size={16} />
                            </button>
                            <button className="text-red-400 hover:text-red-300">
                              <Trash2 size={16} />
                            </button>
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
                          <td className="p-4">
                            <div className="text-white font-medium">{commande.id}</div>
                          </td>
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
                            <button className="text-blue-400 hover:text-blue-300">
                              <Eye size={16} />
                            </button>
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
      </div>
    </div>
  )
}

export default Admin