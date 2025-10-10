
import React, { useState } from 'react'
import {Trash2, Plus, Minus, ShoppingBag, CreditCard, Truck} from 'lucide-react'
import { usePanierStore } from '../store/panierStore'
import toast from 'react-hot-toast'

/**
 * Page du panier d'achat
 */
const Panier: React.FC = () => {
  const { articles, modifierQuantite, supprimerArticle, viderPanier } = usePanierStore()
  const [codePromo, setCodePromo] = useState('')
  const [promoAppliquee, setPromoAppliquee] = useState<{ code: string; reduction: number } | null>(null)
  const [commandeEnCours, setCommandeEnCours] = useState(false)

  // Codes promo d'exemple
  const codesPromo = {
    'BIENVENUE10': 10,
    'MOONLINE20': 20,
    'FIRST15': 15
  }

  // Calculs des totaux
  const sousTotal = articles.reduce((total, article) => total + (article.prix * article.quantite), 0)
  const fraisLivraison = sousTotal > 50 ? 0 : 5.99
  const reductionPromo = promoAppliquee ? (sousTotal * promoAppliquee.reduction) / 100 : 0
  const total = sousTotal + fraisLivraison - reductionPromo

  /**
   * Applique un code promo
   */
  const appliquerPromo = () => {
    if (codesPromo[codePromo as keyof typeof codesPromo]) {
      const reduction = codesPromo[codePromo as keyof typeof codesPromo]
      setPromoAppliquee({ code: codePromo, reduction })
      toast.success(`Code promo appliqué ! -${reduction}%`)
    } else {
      toast.error('Code promo invalide')
    }
  }

  /**
   * Retire le code promo
   */
  const retirerPromo = () => {
    setPromoAppliquee(null)
    setCodePromo('')
    toast.success('Code promo retiré')
  }

  /**
   * Procède à la commande
   */
  const procederCommande = async () => {
    if (articles.length === 0) {
      toast.error('Votre panier est vide')
      return
    }

    setCommandeEnCours(true)

    try {
      // Simulation de traitement de commande
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Commande validée ! Vous allez être redirigé vers le paiement.')
      
      // Ici, redirection vers le système de paiement
      // Pour la démo, on vide juste le panier
      setTimeout(() => {
        viderPanier()
        toast.success('Merci pour votre commande !')
      }, 1000)
      
    } catch (error) {
      toast.error('Erreur lors de la commande. Veuillez réessayer.')
    } finally {
      setCommandeEnCours(false)
    }
  }

  return (
    <div className="min-h-screen pt-16">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur-sm py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Votre Panier
          </h1>
          <p className="text-xl text-purple-200">
            {articles.length > 0 
              ? `${articles.length} article${articles.length > 1 ? 's' : ''} dans votre panier`
              : 'Votre panier est vide'
            }
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {articles.length === 0 ? (
          // Panier vide
          <div className="text-center py-16">
            <ShoppingBag className="mx-auto mb-6 text-gray-400" size={80} />
            <h2 className="text-2xl font-bold text-white mb-4">Votre panier est vide</h2>
            <p className="text-gray-400 mb-8">
              Découvrez notre collection unique d'art spatial et d'accessoires
            </p>
            <a
              href="/boutique"
              className="inline-flex items-center bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
            >
              Découvrir la boutique
            </a>
          </div>
        ) : (
          // Panier avec articles
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Liste des articles */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Articles dans votre panier</h2>
                <button
                  onClick={viderPanier}
                  className="text-red-400 hover:text-red-300 text-sm font-medium"
                >
                  Vider le panier
                </button>
              </div>

              {articles.map(article => (
                <div key={article.id} className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                  <div className="flex items-center space-x-4">
                    {/* Image du produit */}
                    <img
                      src={article.image}
                      alt={article.nom}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    
                    {/* Informations du produit */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">
                        {article.nom}
                      </h3>
                      <p className="text-purple-300 font-medium">
                        {article.prix.toFixed(2)} €
                      </p>
                    </div>
                    
                    {/* Contrôles de quantité */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => modifierQuantite(article.id, article.quantite - 1)}
                        disabled={article.quantite <= 1}
                        className="w-8 h-8 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-full flex items-center justify-center text-white"
                      >
                        <Minus size={16} />
                      </button>
                      
                      <span className="text-white font-medium w-8 text-center">
                        {article.quantite}
                      </span>
                      
                      <button
                        onClick={() => modifierQuantite(article.id, article.quantite + 1)}
                        className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-white"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    
                    {/* Prix total de la ligne */}
                    <div className="text-right">
                      <p className="text-lg font-bold text-white">
                        {(article.prix * article.quantite).toFixed(2)} €
                      </p>
                    </div>
                    
                    {/* Bouton supprimer */}
                    <button
                      onClick={() => supprimerArticle(article.id)}
                      className="text-red-400 hover:text-red-300 p-2"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Résumé de commande */}
            <div className="space-y-6">
              {/* Code promo */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-bold text-white mb-4">Code promo</h3>
                
                {promoAppliquee ? (
                  <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <span className="text-green-300 font-medium">
                        {promoAppliquee.code} (-{promoAppliquee.reduction}%)
                      </span>
                      <button
                        onClick={retirerPromo}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Retirer
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={codePromo}
                      onChange={(e) => setCodePromo(e.target.value.toUpperCase())}
                      placeholder="Code promo"
                      className="flex-1 px-3 py-2 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    />
                    <button
                      onClick={appliquerPromo}
                      disabled={!codePromo}
                      className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-medium"
                    >
                      Appliquer
                    </button>
                  </div>
                )}
              </div>

              {/* Récapitulatif des prix */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
                <h3 className="text-lg font-bold text-white mb-4">Récapitulatif</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Sous-total</span>
                    <span className="text-white">{sousTotal.toFixed(2)} €</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-300">Livraison</span>
                    <span className="text-white">
                      {fraisLivraison === 0 ? 'Gratuite' : `${fraisLivraison.toFixed(2)} €`}
                    </span>
                  </div>
                  
                  {promoAppliquee && (
                    <div className="flex justify-between text-green-400">
                      <span>Réduction ({promoAppliquee.reduction}%)</span>
                      <span>-{reductionPromo.toFixed(2)} €</span>
                    </div>
                  )}
                  
                  {sousTotal < 50 && (
                    <div className="text-sm text-gray-400 flex items-center">
                      <Truck size={16} className="mr-2" />
                      Livraison gratuite dès 50€
                    </div>
                  )}
                  
                  <div className="border-t border-purple-500/30 pt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span className="text-white">Total</span>
                      <span className="text-purple-300">{total.toFixed(2)} €</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bouton de commande */}
              <button
                onClick={procederCommande}
                disabled={commandeEnCours}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 flex items-center justify-center"
              >
                {commandeEnCours ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Traitement...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2" size={20} />
                    Procéder au paiement
                  </>
                )}
              </button>

              {/* Sécurité */}
              <div className="text-center text-sm text-gray-400">
                <p>🔒 Paiement 100% sécurisé</p>
                <p>Carte bancaire, PayPal acceptés</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Panier
