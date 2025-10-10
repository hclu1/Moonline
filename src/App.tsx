
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navigation from './components/Navigation'
import Accueil from './pages/Accueil'
import APropos from './pages/APropos'
import Boutique from './pages/Boutique'
import CommandePersonnalisee from './pages/CommandePersonnalisee'
import ConditionsVente from './pages/ConditionsVente'
import Contact from './pages/Contact'
import Panier from './pages/Panier'
import Admin from './pages/Admin'

/**
 * Composant principal de l'application MOONLINE ART
 * Gère le routage entre toutes les pages et affiche la navigation
 */
function App() {
  return (
    <Router>
      {/* Fond étoilé avec thème astronomique */}
      <div className="min-h-screen bg-gradient-to-b from-slate-900 via-purple-900 to-slate-900 relative">
        {/* Effet d'étoiles en arrière-plan */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-20 right-20 w-1 h-1 bg-yellow-300 rounded-full animate-pulse"></div>
          <div className="absolute top-40 left-1/4 w-1 h-1 bg-blue-300 rounded-full animate-pulse"></div>
          <div className="absolute top-60 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse"></div>
          <div className="absolute bottom-40 left-1/3 w-1 h-1 bg-purple-300 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        </div>

        {/* Navigation principale */}
        <Navigation />
        
        {/* Contenu des pages */}
        <main className="relative z-10">
          <Routes>
            <Route path="/" element={<Accueil />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/commande-personnalisee" element={<CommandePersonnalisee />} />
            <Route path="/a-propos" element={<APropos />} />
            <Route path="/conditions-vente" element={<ConditionsVente />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/panier" element={<Panier />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>

        {/* Notifications toast */}
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#1e293b',
              color: '#fff',
              border: '1px solid #475569'
            }
          }}
        />
      </div>
    </Router>
  )
}

export default App
