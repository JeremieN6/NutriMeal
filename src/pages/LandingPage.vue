<template>
    <section>
      <LP_Header />
      <LP_Hero />
      <LP_Features />
      <LP_Testimonials />
      <!-- <LP_Pricing /> -->
      <LP_FAQ />
      <LP_Footer />
    </section>
  </template>

<script setup>
    import { RouterLink } from 'vue-router'
  import LP_Header from '../components/landing/LP_Header.vue'
  import LP_Hero from '../components/landing/LP_Hero.vue'
  import LP_Features from '../components/landing/LP_Features.vue'
  import LP_Testimonials from '../components/landing/LP_Testimonials.vue'
    // import LP_Pricing from '../components/Landing/LP_Pricing.vue'
  import LP_FAQ from '../components/landing/LP_FAQ.vue'
  import LP_Footer from '../components/landing/LP_Footer.vue'

    import { onMounted } from 'vue'

onMounted(() => {
  const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon')
  const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon')
  const themeToggleBtn = document.getElementById('theme-toggle')

  // Sécurité : vérifier que les éléments existent
  if (!themeToggleBtn || !themeToggleDarkIcon || !themeToggleLightIcon) return

  // Afficher l’icône correspondante
  if (
    localStorage.getItem('color-theme') === 'dark' ||
    (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  ) {
    themeToggleLightIcon.classList.remove('hidden')
  } else {
    themeToggleDarkIcon.classList.remove('hidden')
  }

  // Ajouter l'écouteur
  themeToggleBtn.addEventListener('click', () => {
    // Toggle des icônes
    themeToggleDarkIcon.classList.toggle('hidden')
    themeToggleLightIcon.classList.toggle('hidden')

    // Gestion du thème
    if (localStorage.getItem('color-theme')) {
      if (localStorage.getItem('color-theme') === 'light') {
        document.documentElement.classList.add('dark')
        localStorage.setItem('color-theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('color-theme', 'light')
      }
    } else {
      if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('color-theme', 'light')
      } else {
        document.documentElement.classList.add('dark')
        localStorage.setItem('color-theme', 'dark')
      }
    }
  })
})

</script>