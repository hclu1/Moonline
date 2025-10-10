
import React from 'react'
import {Palette, Heart, Star} from 'lucide-react'

/**
 * Page "À propos de moi" présentant l'artiste
 * Inclut photo, parcours et démarche créative
 */
const APropos: React.FC = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        
        {/* En-tête de la page */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            À propos de l'artiste
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 mx-auto"></div>
        </div>

        {/* Section principale avec photo et présentation */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          
          {/* Photo de l'artiste */}
          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              {/* Placeholder pour la photo - à remplacer par la vraie photo */}
              <div className="aspect-square bg-gradient-to-br from-purple-400 via-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-center text-white">
                  <Palette size={64} className="mx-auto mb-4 opacity-80" />
                  <p className="text-lg font-medium">Photo de l'artiste</p>
                  <p className="text-sm opacity-80">en train de créer</p>
                  <p className="text-xs mt-2 opacity-60">(Remplacer par la photo prise par Jérémy)</p>
                </div>
              </div>
              
              {/* Effet de halo lumineux autour de la photo */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 via-transparent to-blue-400/20 rounded-2xl"></div>
              
              {/* Constellations discrètes autour de la photo */}
              <div className="absolute -top-4 -right-4 w-2 h-2 bg-yellow-300 rounded-full animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-1 h-1 bg-blue-300 rounded-full animate-pulse"></div>
              <div className="absolute top-1/2 -right-6 w-1 h-1 bg-purple-300 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Texte de présentation */}
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-white mb-6">
              L'art comme langage universel
            </h2>
            
            <div className="prose prose-lg text-gray-300 space-y-4">
              <p>
                Bonjour et bienvenue dans mon univers artistique ! Je suis passionnée par la création 
                depuis toujours, et c'est cette passion qui guide chacune de mes œuvres.
              </p>
              
              <p>
                Mon parcours artistique a commencé par une fascination pour les couleurs et les formes, 
                inspirée par la beauté infinie du cosmos. Chaque création est pour moi une exploration, 
                un voyage entre rêve et réalité, où l'art devient un pont entre l'imaginaire et le tangible.
              </p>
              
              <p>
                Ma démarche créative s'articule autour de trois piliers fondamentaux : 
                <strong className="text-purple-300"> l'authenticité</strong>, 
                <strong className="text-blue-300"> l'émotion</strong> et 
                <strong className="text-purple-300"> l'unicité</strong>. 
                Chaque œuvre raconte une histoire, porte une émotion et reflète un moment unique 
                de création artistique.
              </p>
              
              <p>
                Que ce soit sur toile, textile ou tout autre support, je m'efforce de créer 
                des pièces qui résonnent avec l'âme de celui qui les contemple. L'art, 
                c'est cette magie qui transforme la matière en émotion.
              </p>
            </div>
          </div>
        </div>

        {/* Section philosophie artistique */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          
          <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-purple-500/20">
            <Heart className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Passion</h3>
            <p className="text-gray-300">
              Chaque création naît d'une passion sincère pour l'art et d'un désir 
              profond de partager des émotions authentiques.
            </p>
          </div>

          <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-blue-500/20">
            <Star className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Inspiration</h3>
            <p className="text-gray-300">
              L'univers, les étoiles et les mystères du cosmos nourrissent 
              constamment mon imagination et guident mes créations.
            </p>
          </div>

          <div className="text-center p-6 bg-slate-800/50 rounded-xl border border-purple-500/20">
            <Palette className="w-12 h-12 text-purple-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-3">Créativité</h3>
            <p className="text-gray-300">
              Innovation constante dans les techniques, les matériaux et les approches 
              pour offrir des œuvres toujours plus surprenantes.
            </p>
          </div>
        </div>

        {/* Citation personnelle */}
        <div className="text-center bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-2xl p-8 border border-purple-500/20">
          <blockquote className="text-2xl md:text-3xl font-light text-white italic mb-4">
            "L'art n'est pas ce que vous voyez, mais ce que vous faites voir aux autres."
          </blockquote>
          <p className="text-purple-300 text-lg">
            Cette philosophie guide chacune de mes créations
          </p>
        </div>
      </div>
    </div>
  )
}

export default APropos
