import React from 'react'
import { Link } from 'react-router-dom'
import { Palette, Star, Sparkles } from 'lucide-react'
import { useConfigStore } from '../store/configStore'

const Accueil: React.FC = () => {
  const config = useConfigStore(state => state.config)

  return (
    <div className="min-h-screen">
      {/* Section hero */}
      <section className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">

          {/* Titre principal */}
          <div className="relative mb-8">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
              {config?.site_name || 'MOONLINE ART'}
            </h1>
            <div 
              className="absolute inset-0 bg-clip-text text-transparent opacity-50 blur-sm"
              style={{
                backgroundImage: `linear-gradient(to right, ${config?.primary_color || '#a855f7'}, ${config?.secondary_color || '#3b82f6'}, ${config?.primary_color || '#a855f7'})`
              }}
            >
              {config?.site_name || 'MOONLINE ART'}
            </div>
          </div>

          {/* Slogan */}
          <p 
            className="text-xl md:text-2xl mb-8 font-light"
            style={{ color: config?.accent_color || '#d8b4fe' }}
          >
            {config?.site_slogan || 'Des créations uniques entre art et style'}
          </p>

          {/* Description */}
          <p className="text-lg text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            {config?.home_hero_subtitle || 'Plongez dans un univers artistique inspiré par les mystères du cosmos. Chaque œuvre est une invitation au voyage, entre rêverie et créativité, où l\'art rencontre l\'infini des étoiles.'}
          </p>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <Link
              to="/boutique"
              className="group text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
              style={{
                background: `linear-gradient(to right, ${config?.primary_color || '#9333ea'}, ${config?.secondary_color || '#2563eb'})`
              }}
            >
              <span className="flex items-center gap-2">
                <Palette size={20} />
                Découvrir la boutique
                <Sparkles size={16} className="group-hover:animate-pulse" />
              </span>
            </Link>

            <Link
              to="/commande-personnalisee"
              className="group border-2 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              style={{
                borderColor: config?.accent_color || '#a855f7',
                color: config?.accent_color || '#d8b4fe'
              }}
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
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: `linear-gradient(to bottom right, ${config?.primary_color || '#a855f7'}, ${config?.secondary_color || '#3b82f6'})`
                }}
              >
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
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: `linear-gradient(to bottom right, ${config?.secondary_color || '#3b82f6'}, ${config?.primary_color || '#a855f7'})`
                }}
              >
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
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{
                  background: `linear-gradient(to bottom right, ${config?.primary_color || '#a855f7'}, ${config?.accent_color || '#f59e0b'})`
                }}
              >
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
      <section 
        className="py-16 px-4"
        style={{
          background: `linear-gradient(to right, ${config?.primary_color || '#581c87'}40, ${config?.secondary_color || '#1e3a8a'}40)`
        }}
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à explorer l'univers {config?.site_name || 'MOONLINE ART'} ?
          </h2>
          <p 
            className="text-xl mb-8"
            style={{ color: config?.accent_color || '#d8b4fe' }}
          >
            Laissez-vous porter par la magie de nos créations
          </p>
          <Link
            to="/a-propos"
            className="inline-block text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            style={{
              background: `linear-gradient(to right, ${config?.primary_color || '#9333ea'}, ${config?.secondary_color || '#2563eb'})`
            }}
          >
            En savoir plus sur l'artiste
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Accueil