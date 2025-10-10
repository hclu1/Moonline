
import { create } from 'zustand'

// Types pour les articles du panier
export interface ArticlePanier {
  id: string
  nom: string
  prix: number
  quantite: number
  image: string
  categorie: string
}

// Interface du store du panier
interface PanierStore {
  articles: ArticlePanier[]
  ajouterArticle: (article: Omit<ArticlePanier, 'quantite'>) => void
  supprimerArticle: (id: string) => void
  modifierQuantite: (id: string, quantite: number) => void
  viderPanier: () => void
  obtenirTotal: () => number
}

/**
 * Store Zustand pour la gestion du panier d'achat
 * Permet d'ajouter, supprimer et modifier les articles
 */
export const usePanierStore = create<PanierStore>((set, get) => ({
  articles: [],

  /**
   * Ajoute un article au panier ou augmente sa quantité s'il existe déjà
   */
  ajouterArticle: (nouvelArticle) => set((state) => {
    const articleExistant = state.articles.find(article => article.id === nouvelArticle.id)
    
    if (articleExistant) {
      // Si l'article existe déjà, on augmente la quantité
      return {
        articles: state.articles.map(article =>
          article.id === nouvelArticle.id
            ? { ...article, quantite: article.quantite + 1 }
            : article
        )
      }
    } else {
      // Sinon on ajoute le nouvel article avec quantité 1
      return {
        articles: [...state.articles, { ...nouvelArticle, quantite: 1 }]
      }
    }
  }),

  /**
   * Supprime complètement un article du panier
   */
  supprimerArticle: (id) => set((state) => ({
    articles: state.articles.filter(article => article.id !== id)
  })),

  /**
   * Modifie la quantité d'un article spécifique
   */
  modifierQuantite: (id, nouvelleQuantite) => set((state) => {
    if (nouvelleQuantite <= 0) {
      // Si la quantité est 0 ou négative, on supprime l'article
      return {
        articles: state.articles.filter(article => article.id !== id)
      }
    }
    
    return {
      articles: state.articles.map(article =>
        article.id === id
          ? { ...article, quantite: nouvelleQuantite }
          : article
      )
    }
  }),

  /**
   * Vide complètement le panier
   */
  viderPanier: () => set({ articles: [] }),

  /**
   * Calcule le prix total du panier
   */
  obtenirTotal: () => {
    const { articles } = get()
    return articles.reduce((total, article) => total + (article.prix * article.quantite), 0)
  }
}))
