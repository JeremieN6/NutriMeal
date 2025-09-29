import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)

router.afterEach((to) => {
  // Mise à jour du <title>
  if (to.meta?.title) {
    document.title = to.meta.title
  }

  // Mise à jour ou création du <meta name="description">
  if (to.meta?.description) {
    let descriptionTag = document.querySelector('meta[name="description"]')
    if (!descriptionTag) {
      descriptionTag = document.createElement('meta')
      descriptionTag.setAttribute('name', 'description')
      document.head.appendChild(descriptionTag)
    }
    descriptionTag.setAttribute('content', to.meta.description)
  }
})

app.use(router).mount('#app')

// Service Worker management
if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    // Always unregister in dev to avoid HMR and router issues
    navigator.serviceWorker.getRegistrations().then(regs => regs.forEach(r => r.unregister()))
  } else if (import.meta.env.PROD) {
    // Register in prod but also clean up any rogue workers from previous paths
    window.addEventListener('load', () => {
      navigator.serviceWorker.getRegistrations().then(regs => {
        regs.forEach(r => {
          if (!r.active || (r.scope && !r.scope.endsWith('/'))) {
            r.unregister().catch(() => {})
          }
        })
      })
      navigator.serviceWorker.register('/sw.js').catch(() => {/* ignore */})
    })
  }
}

// Dark / Light theme toggle
function setupThemeToggle() {
  const darkIcon = document.getElementById('theme-toggle-dark-icon')
  const lightIcon = document.getElementById('theme-toggle-light-icon')
  const btn = document.getElementById('theme-toggle')
  if (!btn) return

  // initial state
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const stored = localStorage.getItem('color-theme')
  const isDark = stored ? stored === 'dark' : prefersDark
  document.documentElement.classList.toggle('dark', isDark)
  if (darkIcon && lightIcon) {
    lightIcon.classList.toggle('hidden', !isDark)
    darkIcon.classList.toggle('hidden', isDark)
  }

  btn.addEventListener('click', () => {
    if (darkIcon && lightIcon) {
      darkIcon.classList.toggle('hidden')
      lightIcon.classList.toggle('hidden')
    }
    const current = localStorage.getItem('color-theme')
    if (current) {
      if (current === 'light') {
        document.documentElement.classList.add('dark')
        localStorage.setItem('color-theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('color-theme', 'light')
      }
    } else {
      // not set previously
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('color-theme', 'light')
      } else {
        document.documentElement.classList.add('dark')
        localStorage.setItem('color-theme', 'dark')
      }
    }
  })
}

// Wait DOM ready to attach listeners
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setupThemeToggle()
} else {
  document.addEventListener('DOMContentLoaded', setupThemeToggle)
}
