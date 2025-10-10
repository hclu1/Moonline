import React from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface LightboxProps {
  image: string
  alt: string
  isOpen: boolean
  onClose: () => void
  onPrevious?: () => void
  onNext?: () => void
  showNavigation?: boolean
}

/**
 * Composant Lightbox pour afficher les images en plein écran
 */
const Lightbox: React.FC<LightboxProps> = ({
  image,
  alt,
  isOpen,
  onClose,
  onPrevious,
  onNext,
  showNavigation = false
}) => {
  if (!isOpen) return null

  // Fermer avec la touche Échap
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && onPrevious) onPrevious()
      if (e.key === 'ArrowRight' && onNext) onNext()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose, onPrevious, onNext])

  // Empêcher le scroll du body quand la lightbox est ouverte
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-2 sm:p-4"
      onClick={onClose}
    >
      {/* Bouton fermer */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onClose()
        }}
        className="absolute top-2 right-2 sm:top-4 sm:right-4 text-white hover:text-purple-300 transition-colors p-2 bg-black/70 hover:bg-black/90 rounded-full z-10"
        aria-label="Fermer"
      >
        <X size={28} className="sm:w-8 sm:h-8" />
      </button>

      {/* Bouton précédent */}
      {showNavigation && onPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrevious()
          }}
          className="absolute left-2 sm:left-4 text-white hover:text-purple-300 transition-colors p-2 bg-black/70 hover:bg-black/90 rounded-full z-10"
          aria-label="Image précédente"
        >
          <ChevronLeft size={28} className="sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Image - TAILLE AUGMENTÉE */}
      <div className="relative w-full h-full flex items-center justify-center p-12 sm:p-16">
        <img
          src={image}
          alt={alt}
          className="max-w-full max-h-full w-auto h-auto object-contain rounded-lg shadow-2xl"
          style={{
            maxWidth: '95vw',
            maxHeight: '95vh'
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Bouton suivant */}
      {showNavigation && onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-2 sm:right-4 text-white hover:text-purple-300 transition-colors p-2 bg-black/70 hover:bg-black/90 rounded-full z-10"
          aria-label="Image suivante"
        >
          <ChevronRight size={28} className="sm:w-8 sm:h-8" />
        </button>
      )}

      {/* Titre de l'image en bas */}
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-white text-sm sm:text-base bg-black/70 inline-block px-4 py-2 rounded-full">
          {alt}
        </p>
      </div>
    </div>
  )
}

export default Lightbox