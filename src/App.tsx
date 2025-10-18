import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useConfigStore } from './store/configStore'
import { supabase } from './lib/supabaseClient'

import Navigation from './components/Navigation'
import Accueil from './pages/Accueil'
import Boutique from './pages/Boutique'
import APropos from './pages/APropos'
import Contact from './pages/Contact'
import CommandePersonnalisee from './pages/CommandePersonnalisee'
import Panier from './pages/Panier'
import Admin from './pages/Admin'
import ConditionsVente from './pages/ConditionsVente'
import Login from './pages/Login'

function App() {
  const { loadConfig, checkAuth, config } = useConfigStore()
  
  // Initialiser l'authentification et charger la configuration au démarrage
  useEffect(() => {
    const initializeApp = async () => {
      // Vérifier l'authentification
      await checkAuth()
      // Charger la configuration
      await loadConfig()
    }
    
    initializeApp()
    
    // Écouter les changements d'authentification
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        
        // Vérifier l'authentification à chaque changement
        await checkAuth()
        
        // Recharger la configuration après authentification
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await loadConfig()
        }
        
        // Réinitialiser en cas de déconnexion
        if (event === 'SIGNED_OUT') {
          await loadConfig()
        }
      }
    )
    
    // Nettoyer l'écouteur au démontage du composant
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [checkAuth, loadConfig])

  // Appliquer le thème au document
  useEffect(() => {
    if (config) {
      document.documentElement.style.setProperty('--color-primary', config.primary_color)
      document.documentElement.style.setProperty('--color-secondary', config.secondary_color)
      document.documentElement.style.setProperty('--color-accent', config.accent_color)
      document.documentElement.style.setProperty('--color-background', config.background_color)
      document.documentElement.style.setProperty('--color-text', config.text_color)
      document.documentElement.style.setProperty('--color-header-bg', config.header_bg_color)
      document.documentElement.style.setProperty('--color-footer-bg', config.footer_bg_color)
    }
  }, [config])

  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <div 
        className="min-h-screen" 
        style={{ backgroundColor: config?.background_color || '#0f172a' }}
      >
        <Navigation />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/boutique" element={<Boutique />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/commande-personnalisee" element={<CommandePersonnalisee />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/conditions-vente" element={<ConditionsVente />} />
        </Routes>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  )
}

export default App
