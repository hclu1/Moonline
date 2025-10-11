import React, { useState } from 'react'
import {Upload, Palette, Sparkles, Send} from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '../lib/supabaseClient'
import { uploadCommandeImage, validateImageFile } from '../lib/storageHelpers'

/**
 * Page de commande personnalisée
 */
const CommandePersonnalisee: React.FC = () => {
  const [formulaire, setFormulaire] = useState({
    nom: '',
    email: '',
    telephone: '',
    typeCommande: '',
    dimensions: '',
    couleurs: '',
    description: '',
    budget: '',
    delai: ''
  })

  const [fichierSelectionne, setFichierSelectionne] = useState<File | null>(null)
  const [imagePath, setImagePath] = useState<string | null>(null)
  const [envoiEnCours, setEnvoiEnCours] = useState(false)

  const typesCommande = [
    { id: 'tableau', nom: 'Tableau personnalisé', prix: 'À partir de 150€' },
    { id: 'vetement', nom: 'Vêtement personnalisé', prix: 'À partir de 45€' },
    { id: 'sac', nom: 'Sac personnalisé', prix: 'À partir de 35€' },
    { id: 'autre', nom: 'Autre création', prix: 'Devis sur mesure' }
  ]

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
   * Gère la sélection et l'upload de fichier
   */
  const gererFichier = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fichier = e.target.files?.[0]
    if (!fichier) return

    // Validation avec le helper
    const erreur = validateImageFile(fichier, 5)
    if (erreur) {
      toast.error(erreur)
      return
    }

    try {
      // Générer un ID unique pour cette commande
      const commandeId = crypto.randomUUID()
      
      // Pour le moment, on utilise 'guest' comme userId
      // Plus tard, remplacer par : const { data: { user } } = await supabase.auth.getUser()
      const userId = 'guest'
      
      // Upload vers Supabase Storage
      toast.loading('Upload de l\'image...')
      const uploadedPath = await uploadCommandeImage(fichier, userId, commandeId)
      toast.dismiss()
      
      if (!uploadedPath) {
        toast.error('Erreur lors du téléchargement de l\'image')
        return
      }

      setFichierSelectionne(fichier)
      setImagePath(uploadedPath)
      toast.success('Image téléchargée avec succès')
      
    } catch (error) {
      toast.dismiss()
      toast.error('Erreur lors du téléchargement')
      console.error('Erreur upload:', error)
    }
  }

  /**
   * Soumet le formulaire de commande vers Supabase
   */
  const soumettreCommande = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation basique
    if (!formulaire.nom || !formulaire.email || !formulaire.typeCommande || !formulaire.description) {
      toast.error('Veuillez remplir tous les champs obligatoires')
      return
    }

    setEnvoiEnCours(true)

    try {
      // Insertion dans la table commandes_personnalisees
      const { data, error } = await supabase
        .from('commandes_personnalisees')
        .insert([
          {
            nom: formulaire.nom,
            email: formulaire.email,
            telephone: formulaire.telephone || null,
            type_commande: formulaire.typeCommande,
            dimensions: formulaire.dimensions || null,
            couleurs: formulaire.couleurs || null,
            description: formulaire.description,
            budget: formulaire.budget || null,
            delai: formulaire.delai || null,
            fichier_reference: imagePath || null,
            statut: 'nouvelle'
          }
        ])
        .select()

      if (error) {
        throw error
      }

      toast.success('Votre demande de commande personnalisée a été envoyée ! Nous vous recontacterons sous 24h.')
      
      // Réinitialiser le formulaire
      setFormulaire({
        nom: '',
        email: '',
        telephone: '',
        typeCommande: '',
        dimensions: '',
        couleurs: '',
        description: '',
        budget: '',
        delai: ''
      })
      setFichierSelectionne(null)
      setImagePath(null)
      
      // Réinitialiser l'input file
      const fileInput = document.getElementById('upload-reference') as HTMLInputElement
      if (fileInput) fileInput.value = ''
      
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error)
      toast.error('Erreur lors de l\'envoi. Veuillez réessayer.')
    } finally {
      setEnvoiEnCours(false)
    }
  }

  return (
    <div className="min-h-screen pt-16">
      {/* En-tête */}
      <div className="bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur-sm py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Commande Personnalisée
          </h1>
          <p className="text-xl text-purple-200 max-w-2xl mx-auto">
            Donnez vie à vos idées ! Créons ensemble une œuvre unique qui vous ressemble
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Processus de création */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">1. Décrivez votre vision</h3>
              <p className="text-gray-300">Partagez vos idées, inspirations et références</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">2. Nous créons</h3>
              <p className="text-gray-300">Notre équipe donne vie à votre projet unique</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Send className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">3. Vous recevez</h3>
              <p className="text-gray-300">Livraison soignée de votre création personnalisée</p>
            </div>
          </div>
        </div>

        {/* Formulaire de commande */}
        <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-purple-500/20">
          <h2 className="text-2xl font-bold text-white mb-6">Formulaire de commande</h2>
          
          <form onSubmit={soumettreCommande} className="space-y-6">
            {/* Informations personnelles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  placeholder="Votre nom complet"
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
                Téléphone
              </label>
              <input
                type="tel"
                name="telephone"
                value={formulaire.telephone}
                onChange={gererChangement}
                className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                placeholder="Votre numéro de téléphone"
              />
            </div>

            {/* Type de commande */}
            <div>
              <label className="block text-white font-medium mb-2">
                Type de commande *
              </label>
              <select
                name="typeCommande"
                value={formulaire.typeCommande}
                onChange={gererChangement}
                required
                className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
              >
                <option value="">Sélectionnez un type</option>
                {typesCommande.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.nom} - {type.prix}
                  </option>
                ))}
              </select>
            </div>

            {/* Détails du projet */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Dimensions souhaitées
                </label>
                <input
                  type="text"
                  name="dimensions"
                  value={formulaire.dimensions}
                  onChange={gererChangement}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  placeholder="Ex: 50x70cm, Taille M, etc."
                />
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">
                  Couleurs préférées
                </label>
                <input
                  type="text"
                  name="couleurs"
                  value={formulaire.couleurs}
                  onChange={gererChangement}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400"
                  placeholder="Ex: Bleu nuit, violet, doré..."
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-white font-medium mb-2">
                  Budget approximatif
                </label>
                <select
                  name="budget"
                  value={formulaire.budget}
                  onChange={gererChangement}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="">Sélectionnez un budget</option>
                  <option value="50-100">50€ - 100€</option>
                  <option value="100-200">100€ - 200€</option>
                  <option value="200-500">200€ - 500€</option>
                  <option value="500+">Plus de 500€</option>
                </select>
              </div>
              
              <div>
                <label className="block text-white font-medium mb-2">
                  Délai souhaité
                </label>
                <select
                  name="delai"
                  value={formulaire.delai}
                  onChange={gererChangement}
                  className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-purple-400"
                >
                  <option value="">Sélectionnez un délai</option>
                  <option value="1-2-semaines">1-2 semaines</option>
                  <option value="3-4-semaines">3-4 semaines</option>
                  <option value="1-2-mois">1-2 mois</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
            </div>

            {/* Description détaillée */}
            <div>
              <label className="block text-white font-medium mb-2">
                Description de votre projet *
              </label>
              <textarea
                name="description"
                value={formulaire.description}
                onChange={gererChangement}
                required
                rows={5}
                className="w-full px-4 py-3 bg-slate-700/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 resize-none"
                placeholder="Décrivez en détail votre vision, vos inspirations, l'usage prévu, etc. Plus vous êtes précis, mieux nous pourrons répondre à vos attentes !"
              />
            </div>

            {/* Upload d'image de référence */}
            <div>
              <label className="block text-white font-medium mb-2">
                Image de référence (optionnel)
              </label>
              <div className="border-2 border-dashed border-purple-500/30 rounded-lg p-6 text-center hover:border-purple-400/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={gererFichier}
                  className="hidden"
                  id="upload-reference"
                />
                <label htmlFor="upload-reference" className="cursor-pointer">
                  <Upload className="mx-auto mb-4 text-purple-300" size={48} />
                  <p className="text-white mb-2">
                    Cliquez pour télécharger une image de référence
                  </p>
                  <p className="text-gray-400 text-sm">
                    PNG, JPG jusqu'à 5MB
                  </p>
                  {fichierSelectionne && (
                    <p className="text-green-400 mt-2">
                      ✓ {fichierSelectionne.name}
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* Bouton de soumission */}
            <div className="text-center">
              <button
                type="submit"
                disabled={envoiEnCours}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {envoiEnCours ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Envoi en cours...
                  </span>
                ) : (
                  'Envoyer ma demande'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Informations supplémentaires */}
        <div className="mt-12 bg-purple-900/20 backdrop-blur-sm rounded-xl p-6 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">Informations importantes</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Nous vous recontacterons sous 24h pour discuter de votre projet</li>
            <li>• Un devis détaillé vous sera envoyé après notre échange</li>
            <li>• Possibilité de voir des esquisses avant validation finale</li>
            <li>• Paiement en plusieurs fois possible pour les commandes importantes</li>
            <li>• Livraison soignée avec emballage de protection</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CommandePersonnalisee