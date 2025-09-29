import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './pages/LandingPage.vue'
import CalculateurPage from './pages/CalculateurPage.vue'
import BypassPage from './pages/BypassPage.vue';
import FonctionnalitePage from './pages/FonctionnalitePage.vue'
import BlogPage from './pages/BlogPage.vue'
import BlogContentPage from './pages/BlogContentPage.vue'
import PolitiqueConfidentialitePage from './pages/PolitiqueConfidentialitePage.vue'
import RecettesFrigoPage from './pages/RecettesFrigoPage.vue'
import Success from './pages/stripe/Success.vue'
import Cancel from './pages/stripe/Cancel.vue'


const routes = [
  { path: '/', component: LandingPage,
    meta: {
      title: 'NutriMeal | Compteur de calories & recettes intelligentes',
      description: 'Comptez les calories, suivez les macros et générez des recettes à partir de votre frigo. Gratuit et sans inscription.'
    }
   },
    { path: '/recettes-frigo', component: RecettesFrigoPage,
      meta: {
        title: 'NutriMeal | Recettes depuis le frigo',
        description: 'Saisissez vos ingrédients du frigo et obtenez des recettes adaptées avec étapes, temps de cuisson et suggestions.'
      }
     },
  { path: '/compteur', component: CalculateurPage,
    meta: {
      title: 'NutriMeal | Compteur de calories',
      description: 'Recherchez un aliment (OpenFoodFacts) et obtenez calories et macros par gramme ou par portion. Historique local et mode hors‑ligne.'
    }
   },
  // Redirect old path
  { path: '/calculateur', redirect: '/compteur' },
  { path: '/fonctionnalites', component: FonctionnalitePage,
    meta: {
      title: 'NutriMeal | Fonctionnalités',
      description: 'Compteur de calories, macros, historique, PWA hors‑ligne et recettes IA depuis le frigo.'
    }
   },
   { path: '/blog', component: BlogPage,
    meta: {
      title: 'NutriMeal | Blog',
      description: 'Conseils nutrition, recettes et actualités du produit NutriMeal.'
    }
   },
   { path: '/blog/:slug', name: 'BlogContent', component: BlogContentPage,
    meta: {
      title: 'NutriMeal | Article du blog',
      description: 'Un article du blog NutriMeal sur la nutrition, les recettes ou le produit.'
    }
   },
   { path: '/politique-de-confidentialite', component: PolitiqueConfidentialitePage,
    meta: {
      title: 'NutriMeal | Politique de confidentialité',
      description: 'Découvrez comment NutriMeal collecte et protège vos données.'
    }
   },
   { path: '/success', component: Success,
    meta: {
      title: 'NutriMeal | Paiement réussi',
      description: 'Votre paiement a bien été pris en compte.'
    }
   },
   { path: '/cancel', component: Cancel,
    meta: {
      title: 'NutriMeal | Paiement annulé',
      description: 'Votre paiement a été annulé. Vous pouvez réessayer à tout moment.'
    }
   },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

if (import.meta.env.VITE_ENABLE_BYPASS === 'true') {
  router.addRoute({
    path: '/compteur/bypass-mode',
    name: 'Bypass',
    component: BypassPage,
    meta: {
      title: 'NutriMeal | Compteur (Admin)',
      description: 'Outils internes pour le compteur de calories.'
    }
  });
  // Backward compatibility redirect
  router.addRoute({ path: '/calculateur/bypass-mode', redirect: '/compteur/bypass-mode' });
}

export default router
