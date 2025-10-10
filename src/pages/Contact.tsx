
import React, { useState } from 'react'
import {Mail, Phone, MapPin, Clock, Send, MessageCircleDashed as MessageCircle} from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Page de contact
 */
const Contact: React.FC = () => {
  const [formulaire, setFormulaire] = useState({
    nom: '',
    email: '',
    sujet: '',
    message: ''
  })
  const [envoiEnCours, setEnvoiEnCours] = useState(false)

  /**
   * Gère les changements dans le formulaire
   */
  const gererChangement = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormulaire(prev => ({
      ...prev,
      [name]: value
    }))
  }

  /**
   * Soumet le formulaire de contact
   */
  const soumettreMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formulaire.nom || !formulaire.email || !formulaire.message) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    setEnvoiEnCours(true)

    try {
      // Simulation d'envoi (remplacer par vraie API)
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      toast.success('Votre message a été envoyé ! Nous vous répondrons dans les plus brefs délais.')
      
      // Réinitialiser le formulaire
      setFormulaire({
        nom: '',
        email: '',
        sujet: '',
        message: ''
      })
      
    } catch (error) {
      toast.error('Erreur lors de l\'envoi. Veuillez réessayer.')
    } finally {
      setEnvoiEnCours(false)
    }
  }

  const sujets = [
    'Question générale',
    'Commande personnalisée',
    'Problème avec une commande',
    'Collaboration artistique',
    'Presse / Média',
    'Autre'
  ]

  return (
    <div className="min-h-screen pt-16">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur-sm py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Contactez-nous
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Une question, une idée, un projet ? Nous sommes là pour vous accompagner dans votre démarche artistique
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <MessageCircle className="mr-3 text-purple-400" size={28} />
              Envoyez-nous un message
            </h2>
            
            <form onSubmit={soumettreMessage} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-medium mb-2">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={formulaire.nom}
                    onChange={gererChangement}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    placeholder="Votre nom"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formulaire.email}
                    onChange={gererChangement}
                    required
                    className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                    placeholder="votre@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Sujet
                </label>
                <select
                  name="sujet"
                  value={formulaire.sujet}
                  onChange={gererChangement}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="">Sélectionnez un sujet</option>
                  {sujets.map(sujet => (
                    <option key={sujet} value={sujet}>
                      {sujet}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-white font-medium mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formulaire.message}
                  onChange={gererChangement}
                  required
                  rows={6}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 resize-none"
                  placeholder="Écrivez votre message ici..."
                />
              </div>

              <button
                type="submit"
                disabled={envoiEnCours}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {envoiEnCours ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <Send className="mr-2" size={20} />
                    Envoyer le message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Informations de contact */}
          <div className="space-y-8">
            {/* Coordonnées */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Nos coordonnées</h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Email</h4>
                    <p className="text-purple-300">contact@moonlineart.com</p>
                    <p className="text-gray-400 text-sm">Réponse sous 24h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Téléphone</h4>
                    <p className="text-purple-300">+33 1 23 45 67 89</p>
                    <p className="text-gray-400 text-sm">Lun-Ven 9h-18h</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Adresse</h4>
                    <p className="text-purple-300">123 Rue des Étoiles</p>
                    <p className="text-purple-300">75001 Paris, France</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="text-white" size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Horaires</h4>
                    <p className="text-purple-300">Lundi - Vendredi : 9h - 18h</p>
                    <p className="text-purple-300">Samedi : 10h - 16h</p>
                    <p className="text-gray-400">Dimanche : Fermé</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQ rapide */}
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
              <h3 className="text-2xl font-bold text-white mb-6">Questions fréquentes</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="text-white font-semibold mb-2">Délai de livraison ?</h4>
                  <p className="text-gray-300 text-sm">3-7 jours pour les produits en stock, 2-4 semaines pour les créations personnalisées.</p>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">Modes de paiement acceptés ?</h4>
                  <p className="text-gray-300 text-sm">Carte bancaire, PayPal, virement, paiement en plusieurs fois possible.</p>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">Retours et échanges ?</h4>
                  <p className="text-gray-300 text-sm">14 jours pour les produits standards, créations personnalisées non échangeables.</p>
                </div>
                
                <div>
                  <h4 className="text-white font-semibold mb-2">Livraison internationale ?</h4>
                  <p className="text-gray-300 text-sm">Oui, nous livrons dans toute l'Europe. Frais calculés à la commande.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
