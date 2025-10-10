
import React from 'react'
import { Link } from 'react-router-dom'
import {Palette, Star, Sparkles} from 'lucide-react'

/**
 * Page d'accueil de MOONLINE ART
 * Présente la boutique avec un design astronomique et des liens vers les sections principales
 */
const Accueil: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Section hero avec thème astronomique */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          
          {/* Titre principal avec effet lumineux */}
          <div className="relative mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              MOONLINE ART
            </h1>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent opacity-50 blur-sm">
              MOONLINE ART
            </div>
          </div>

          {/* Slogan */}
          <p className="text-xl md:text-2xl text-purple-200 mb-8 font-light">
            Des créations uniques entre art et style
          </p>

          {/* Description */}
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Plongez dans un univers artistique inspiré par les mystères du cosmos. 
            Chaque œuvre est une invitation au voyage, entre rêverie et créativité, 
            où l'art rencontre l'infini des étoiles.
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link 
              to="/boutique"
              className="group bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
            >
              <span className="flex items-center gap-2">
                <Palette size={20} />
                Découvrir la boutique
                <Sparkles size={16} className="group-hover:animate-pulse" />
              </span>
            </Link>
            
            <Link 
              to="/commande-personnalisee"
              className="group border-2 border-purple-400 text-purple-300 hover:bg-purple-400 hover:text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <Star size={20} />
                Commande personnalisée
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Section caractéristiques */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Créations uniques */}
            <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-purple-500/20 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Créations Uniques</h3>
              <p className="text-gray-300">
                Chaque œuvre est créée avec passion et attention aux détails, 
                garantissant une pièce unique qui vous ressemble.
              </p>
            </div>

            {/* Commandes personnalisées */}
            <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-purple-500/20 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Sur Mesure</h3>
              <p className="text-gray-300">
                Donnez vie à vos idées avec nos commandes personnalisées. 
                Toiles, vêtements, accessoires... tout est possible !
              </p>
            </div>

            {/* Qualité artistique */}
            <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-purple-500/20 backdrop-blur-sm">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="text-white" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Qualité Premium</h3>
              <p className="text-gray-300">
                Matériaux de qualité, techniques éprouvées et finitions soignées 
                pour des œuvres qui traversent le temps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section appel à l'action */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à explorer l'univers MOONLINE ART ?
          </h2>
          <p className="text-xl text-purple-200 mb-8">
            Laissez-vous porter par la magie de nos créations
          </p>
          <Link 
            to="/a-propos"
            className="inline-block bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            En savoir plus sur l'artiste
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Accueil
