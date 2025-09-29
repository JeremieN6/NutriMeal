import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from './pages/LandingPage.vue'
import CalculateurPage from './pages/CalculateurPage.vue'
import BypassPage from './pages/BypassPage.vue';
import FonctionnalitePage from './pages/FonctionnalitePage.vue'
import BlogPage from './pages/BlogPage.vue'
import BlogContentPage from './pages/BlogContentPage.vue'
import PolitiqueConfidentialitePage from './pages/PolitiqueConfidentialitePage.vue'
import Success from './pages/stripe/Success.vue'
import Cancel from './pages/stripe/Cancel.vue'


const routes = [
  { path: '/', component: LandingPage,
    meta: {
      title: 'Calcul ton TJM avec Tajimo',
      description: 'Obtenez instantanément le temps et la température de cuisson de vos aliments au air fryer grâce à notre IA.'
    }
   },
  { path: '/compteur', component: CalculateurPage,
    meta: {
      title: 'Calcul ton TJM avec Tajimo | Compteur',
      description: 'Obtenez instantanément le temps et la température de cuisson de vos aliments au air fryer grâce à notre IA.'
    }
   },
  // Redirect old path
  { path: '/calculateur', redirect: '/compteur' },
  { path: '/fonctionnalites', component: FonctionnalitePage,
    meta: {
      title: 'Calcul ton TJM avec Tajimo | Fonctionnalités',
      description: 'Obtenez instantanément le temps et la température de cuisson de vos aliments au air fryer grâce à notre IA.'
    }
   },
   { path: '/blog', component: BlogPage,
    meta: {
      title: 'Calcul ton TJM avec Tajimo | Blog',
      description: 'Obtenez instantanément le temps et la température de cuisson de vos aliments au air fryer grâce à notre IA.'
    }
   },
   { path: '/blog/:slug', name: 'BlogContent', component: BlogContentPage,
    meta: {
      title: 'Calcul ton TJM avec Tajimo | Blog Content',
      description: 'Obtenez instantanément le temps et la température de cuisson de vos aliments au air fryer grâce à notre IA.'
    }
   },
   { path: '/politique-de-confidentialite', component: PolitiqueConfidentialitePage,
    meta: {
      title: 'Calcul ton TJM avec Tajimo | Politique de Confidentialité',
      description: 'Obtenez instantanément le temps et la température de cuisson de vos aliments au air fryer grâce à notre IA.'
    }
   },
   { path: '/success', component: Success,
    meta: {
      title: 'Calcul ton TJM avec Tajimo | Success',
      description: 'Obtenez instantanément le temps et la température de cuisson de vos aliments au air fryer grâce à notre IA.'
    }
   },
   { path: '/cancel', component: Cancel,
    meta: {
      title: 'Calcul ton TJM avec Tajimo | Cancel',
      description: 'Obtenez instantanément le temps et la température de cuisson de vos aliments au air fryer grâce à notre IA.'
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
      title: 'Calcul ton TJM avec Tajimo | Compteur Admin',
      description: 'Obtenez instantanément le temps et la température de cuisson de vos aliments au air fryer grâce à notre IA.'
    }
  });
  // Backward compatibility redirect
  router.addRoute({ path: '/calculateur/bypass-mode', redirect: '/compteur/bypass-mode' });
}

export default router
