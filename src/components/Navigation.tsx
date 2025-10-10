
import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {Menu, X, ShoppingCart, Settings} from 'lucide-react'
import { usePanierStore } from '../store/panierStore'

/**
 * Composant de navigation principale
 * Affiche le menu de navigation avec logo, liens et accès admin discret
 */
const Navigation: React.FC = () => {
  const [menuOuvert, setMenuOuvert] = useState(false)
  const location = useLocation()
  const { articles } = usePanierStore()

  // Calcul du nombre total d'articles dans le panier
  const nombreArticles = articles.reduce((total, article) => total + article.quantite, 0)

  /**
   * Vérifie si le lien actuel est actif
   */
  const estLienActif = (chemin: string) => {
    return location.pathname === chemin
  }

  /**
   * Ferme le menu mobile
   */
  const fermerMenu = () => {
    setMenuOuvert(false)
  }

  return (
    <nav className="relative z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Accès admin discret (roue dentée en haut à gauche) */}
          <div className="absolute top-2 left-2">
            <Link 
              to="/admin" 
              className="text-gray-400 hover:text-purple-300 transition-colors opacity-30 hover:opacity-100"
              title="Administration"
            >
              <Settings size={16} />
            </Link>
          </div>

          {/* Logo et nom de la boutique */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">MOONLINE ART</h1>
                <p className="text-xs text-purple-300 hidden sm:block">Des créations uniques entre art et style</p>
              </div>
            </Link>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors ${
                estLienActif('/') ? 'text-purple-300' : 'text-gray-300 hover:text-white'
              }`}
            >
              Accueil
            </Link>
            <Link 
              to="/boutique" 
              className={`text-sm font-medium transition-colors ${
                estLienActif('/boutique') ? 'text-purple-300' : 'text-gray-300 hover:text-white'
              }`}
            >
              Boutique
            </Link>
            <Link 
              to="/commande-personnalisee" 
              className={`text-sm font-medium transition-colors ${
                estLienActif('/commande-personnalisee') ? 'text-purple-300' : 'text-gray-300 hover:text-white'
              }`}
            >
              Commande personnalisée
            </Link>
            <Link 
              to="/a-propos" 
              className={`text-sm font-medium transition-colors ${
                estLienActif('/a-propos') ? 'text-purple-300' : 'text-gray-300 hover:text-white'
              }`}
            >
              À propos
            </Link>
            <Link 
              to="/conditions-vente" 
              className={`text-sm font-medium transition-colors ${
                estLienActif('/conditions-vente') ? 'text-purple-300' : 'text-gray-300 hover:text-white'
              }`}
            >
              Conditions de vente
            </Link>
            <Link 
              to="/contact" 
              className={`text-sm font-medium transition-colors ${
                estLienActif('/contact') ? 'text-purple-300' : 'text-gray-300 hover:text-white'
              }`}
            >
              Contact
            </Link>
            
            {/* Icône panier avec compteur */}
            <Link 
              to="/panier" 
              className="relative text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart size={20} />
              {nombreArticles > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {nombreArticles}
                </span>
              )}
            </Link>
          </div>

          {/* Bouton menu mobile */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/panier" className="relative text-gray-300">
              <ShoppingCart size={20} />
              {nombreArticles > 0 && (
                <span className="absolute -top-2 -right-2 bg-purple-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {nombreArticles}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMenuOuvert(!menuOuvert)}
              className="text-gray-300 hover:text-white"
            >
              {menuOuvert ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOuvert && (
          <div className="md:hidden bg-slate-800/95 backdrop-blur-md border-t border-purple-500/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link 
                to="/" 
                onClick={fermerMenu}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 rounded-md"
              >
                Accueil
              </Link>
              <Link 
                to="/boutique" 
                onClick={fermerMenu}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 rounded-md"
              >
                Boutique
              </Link>
              <Link 
                to="/commande-personnalisee" 
                onClick={fermerMenu}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 rounded-md"
              >
                Commande personnalisée
              </Link>
              <Link 
                to="/a-propos" 
                onClick={fermerMenu}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 rounded-md"
              >
                À propos
              </Link>
              <Link 
                to="/conditions-vente" 
                onClick={fermerMenu}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 rounded-md"
              >
                Conditions de vente
              </Link>
              <Link 
                to="/contact" 
                onClick={fermerMenu}
                className="block px-3 py-2 text-base font-medium text-gray-300 hover:text-white hover:bg-slate-700 rounded-md"
              >
                Contact
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
