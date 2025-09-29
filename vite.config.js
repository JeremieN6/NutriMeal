import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  /**
   * Objectif: Une URL canonique = sous-domaine (NutriMeal.jeremiecode.fr)
   * On ne laisse plus de fallback sur /projets/labo/NutriMeal/ pour ne pas casser cet usage.
   * Pour un build spécifique sous-dossier, on forcera manuellement VITE_BASE_PATH=/projets/labo/NutriMeal/.
   * Ordre de priorité: VITE_BASE_PATH > VITE_BASE_URL > '/'
   */
  const basePath = env.VITE_BASE_PATH || env.VITE_BASE_URL || '/'
  console.log(`[vite] base utilisé: ${basePath}`)

  return {
    plugins: [vue()],
    base: basePath,
  }
})