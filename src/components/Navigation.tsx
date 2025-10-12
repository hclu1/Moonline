import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, ShoppingCart, Settings } from 'lucide-react'
import { usePanierStore } from '../store/panierStore'
import { useConfigStore } from '../store/configStore'

const Navigation: React.FC = () => {
  const [menuOuvert, setMenuOuvert] = useState(false)
  const location = useLocation()
  const { articles } = usePanierStore()
  const config = useConfigStore(state => state.config)

  const nombreArticles = articles.reduce((total, article) => total + article.quantite, 0)

  const estLienActif = (chemin: string) => {
    return location.pathname === chemin
  }

  const fermerMenu = () => {
    setMenuOuvert(false)
  }

  return (
    <nav 
      className="relative z-50 backdrop-blur-md border-b border-purple-500/20"
      style={{ 
        backgroundColor: config?.header_bg_color 
          ? `${config.header_bg_color}cc` // Ajout de transparence
          : 'rgba(15, 23, 42, 0.8)' 
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Accès admin discret */}
          <div className="absolute top-2 left-2">
            <Link
              to="/admin"
              className="text-gray-400 hover:opacity-100 transition-colors opacity-30"
              title="Administration"
              style={{ color: config?.accent_color || '#a855f7' }}
            >
              <Settings size={16} />
            </Link>
          </div>

          {/* Logo et nom */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(to bottom right, ${config?.primary_color || '#a855f7'}, ${config?.secondary_color || '#3b82f6'})`
                }}
              >
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <div className="text-white">
                <h1 className="text-xl font-bold">{config?.site_name || 'MOONLINE ART'}</h1>
                <p className="text-xs hidden sm:block" style={{ color: config?.accent_color || '#d8b4fe' }}>
                  {config?.site_slogan || 'Des créations uniques entre art et style'}
                </p>
              </div>
            </Link>
          </div>

          {/* Menu desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium transition-colors"
              style={{
                color: estLienActif('/') 
                  ? config?.accent_color || '#d8b4fe'
                  : '#d1d5db'
              }}
            >
              Accueil
            </Link>
            <Link 
              to="/boutique"
              className="text-sm font-medium transition-colors"
              style={{
                color: estLienActif('/boutique') 
                  ? config?.accent_color || '#d8b4fe'
                  : '#d1d5db'
              }}
            >
              Boutique
            </Link>
            <Link
              to="/commande-personnalisee"
              className="text-sm font-medium transition-colors"
              style={{
                color: estLienActif('/commande-personnalisee') 
                  ? config?.accent_color || '#d8b4fe'
                  : '#d1d5db'
              }}
            >
              Commande personnalisée
            </Link>
            <Link
              to="/a-propos"
              className="text-sm font-medium transition-colors"
              style={{
                color: estLienActif('/a-propos') 
                  ? config?.accent_color || '#d8b4fe'
                  : '#d1d5db'
              }}
            >
              À propos
            </Link>
            <Link
              to="/conditions-vente"
              className="text-sm font-medium transition-colors"
              style={{
                color: estLienActif('/conditions-vente') 
                  ? config?.accent_color || '#d8b4fe'
                  : '#d1d5db'
              }}
            >
              Conditions de vente
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium transition-colors"
              style={{
                color: estLienActif('/contact') 
                  ? config?.accent_color || '#d8b4fe'
                  : '#d1d5db'
              }}
            >
              Contact
            </Link>

            {/* Icône panier */}
            <Link
              to="/panier"
              className="relative text-gray-300 hover:text-white transition-colors"
            >
              <ShoppingCart size={20} />
              {nombreArticles > 0 && (
                <span 
                  className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ backgroundColor: config?.accent_color || '#a855f7' }}
                >
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
                <span 
                  className="absolute -top-2 -right-2 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  style={{ backgroundColor: config?.accent_color || '#a855f7' }}
                >
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