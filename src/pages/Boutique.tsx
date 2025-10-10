import React, { useState } from 'react'
import {ShoppingCart, Filter, Star, ZoomIn} from 'lucide-react'
import { usePanierStore } from '../store/panierStore'
import toast from 'react-hot-toast'
import Lightbox from '../components/Lightbox'

interface Produit {
  id: string
  nom: string
  prix: number
  image: string
  categorie: string
  description: string
  note: number
  enStock: boolean
}

/**
 * Page boutique avec catalogue de produits
 */
const Boutique: React.FC = () => {
  const { ajouterArticle } = usePanierStore()
  const [categorieSelectionnee, setCategorieSelectionnee] = useState<string>('tous')
  const [recherche, setRecherche] = useState<string>('')
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; image: string; alt: string }>({
    isOpen: false,
    image: '',
    alt: ''
  })

  // Produits d'exemple
  const produits: Produit[] = [
    {
      id: '1',
      nom: 'Tableau "Nébuleuse d\'Orion"',
      prix: 89.99,
      image: 'https://images.pexels.com/photos/1169754/pexels-photo-1169754.jpeg?w=400',
      categorie: 'tableaux',
      description: 'Reproduction artistique de la magnifique nébuleuse d\'Orion sur toile premium',
      note: 4.8,
      enStock: true
    },
    {
      id: '2',
      nom: 'Sac Tote "Constellation"',
      prix: 24.99,
      image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=400',
      categorie: 'sacs',
      description: 'Sac en toile avec motif constellation brodé à la main',
      note: 4.6,
      enStock: true
    },
    {
      id: '3',
      nom: 'T-shirt "Galaxie Spirale"',
      prix: 32.99,
      image: 'https://images.pexels.com/photos/1040427/pexels-photo-1040427.jpeg?w=400',
      categorie: 'vetements',
      description: 'T-shirt en coton bio avec impression galaxie spirale phosphorescente',
      note: 4.7,
      enStock: true
    },
    {
      id: '4',
      nom: 'Tableau "Système Solaire"',
      prix: 124.99,
      image: 'https://images.pexels.com/photos/2150/sky-space-dark-galaxy.jpg?w=400',
      categorie: 'tableaux',
      description: 'Représentation artistique du système solaire avec détails des planètes',
      note: 4.9,
      enStock: false
    },
    {
      id: '5',
      nom: 'Sac à Dos "Astronaute"',
      prix: 45.99,
      image: 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?w=400',
      categorie: 'sacs',
      description: 'Sac à dos résistant avec design astronaute et compartiments multiples',
      note: 4.5,
      enStock: true
    },
    {
      id: '6',
      nom: 'Sweat "Lune Mystique"',
      prix: 54.99,
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?w=400',
      categorie: 'vetements',
      description: 'Sweat à capuche avec broderie lune et étoiles, coton premium',
      note: 4.8,
      enStock: true
    }
  ]

  const categories = [
    { id: 'tous', nom: 'Tous les produits' },
    { id: 'tableaux', nom: 'Tableaux' },
    { id: 'sacs', nom: 'Sacs' },
    { id: 'vetements', nom: 'Vêtements' }
  ]

  // Filtrage des produits
  const produitsFiltres = produits.filter(produit => {
    const correspondCategorie = categorieSelectionnee === 'tous' || produit.categorie === categorieSelectionnee
    const correspondRecherche = produit.nom.toLowerCase().includes(recherche.toLowerCase()) ||
                               produit.description.toLowerCase().includes(recherche.toLowerCase())
    return correspondCategorie && correspondRecherche
  })

  /**
   * Ajoute un produit au panier
   */
  const ajouterAuPanier = (produit: Produit) => {
    ajouterArticle({
      id: produit.id,
      nom: produit.nom,
      prix: produit.prix,
      image: produit.image,
      quantite: 1
    })
    toast.success(`${produit.nom} ajouté au panier !`)
  }

  /**
   * Ouvre l'image en plein écran
   */
  const ouvrirLightbox = (image: string, nom: string) => {
    setLightbox({
      isOpen: true,
      image: image,
      alt: nom
    })
  }

  /**
   * Ferme la lightbox
   */
  const fermerLightbox = () => {
    setLightbox({
      isOpen: false,
      image: '',
      alt: ''
    })
  }

  return (
    <div className="min-h-screen pt-16">
      {/* En-tête de la boutique */}
      <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur-sm py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-2 sm:mb-4">
            Boutique Cosmique
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-purple-200 max-w-2xl mx-auto px-4">
            Découvrez notre collection unique d'art spatial et d'accessoires inspirés de l'univers
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Filtres et recherche */}
        <div className="mb-8 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          {/* Barre de recherche */}
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
            />
          </div>

          {/* Filtres par catégorie */}
          <div className="flex items-center space-x-2">
            <Filter className="text-purple-300" size={20} />
            <select
              value={categorieSelectionnee}
              onChange={(e) => setCategorieSelectionnee(e.target.value)}
              className="px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
            >
              {categories.map(categorie => (
                <option key={categorie.id} value={categorie.id}>
                  {categorie.nom}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {produitsFiltres.map(produit => (
            <div key={produit.id} className="bg-slate-800/30 backdrop-blur-sm rounded-xl overflow-hidden border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 group">
              {/* Image du produit */}
              <div className="relative overflow-hidden cursor-pointer" onClick={() => ouvrirLightbox(produit.image, produit.nom)}>
                <img
                  src={produit.image}
                  alt={produit.nom}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* Icône de zoom au survol */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={48} />
                </div>
                {!produit.enStock && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                    <span className="text-white font-semibold bg-red-600 px-3 py-1 rounded-full">
                      Rupture de stock
                    </span>
                  </div>
                )}
              </div>

              {/* Informations du produit */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                  {produit.nom}
                </h3>
                
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">
                  {produit.description}
                </p>

                {/* Note */}
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < Math.floor(produit.note) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-500'
                      }`}
                    />
                  ))}
                  <span className="text-gray-400 text-sm ml-2">({produit.note})</span>
                </div>

                {/* Prix et bouton */}
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-purple-300">
                    {produit.prix.toFixed(2)} €
                  </span>
                  
                  <button
                    onClick={() => ajouterAuPanier(produit)}
                    disabled={!produit.enStock}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      produit.enStock
                        ? 'bg-purple-600 hover:bg-purple-700 text-white'
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <ShoppingCart size={18} />
                    <span>{produit.enStock ? 'Ajouter' : 'Indisponible'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Message si aucun produit trouvé */}
        {produitsFiltres.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-semibold text-white mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-400">
              Essayez de modifier vos critères de recherche ou de filtrage
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <Lightbox
        image={lightbox.image}
        alt={lightbox.alt}
        isOpen={lightbox.isOpen}
        onClose={fermerLightbox}
      />
    </div>
  )
}

export default Boutique