import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import { useConfigStore, useTheme } from './store/configStore'

import Navigation from './components/Navigation'
import Accueil from './pages/Accueil'
import Boutique from './pages/Boutique'
import APropos from './pages/APropos'
import Contact from './pages/Contact'
import CommandePersonnalisee from './pages/CommandePersonnalisee'
import Panier from './pages/Panier'
import Admin from './pages/Admin'
import Configuration from './pages/Configuration'
import ConditionsVente from './pages/ConditionsVente'

function App() {
  const { loadConfig } = useConfigStore()
  
  // Charger la configuration au démarrage
  useEffect(() => {
    loadConfig()
  }, [loadConfig])
  
  // Appliquer le thème
  useTheme()

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/boutique" element={<Boutique />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/commande-personnalisee" element={<CommandePersonnalisee />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/configuration" element={<Configuration />} />
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