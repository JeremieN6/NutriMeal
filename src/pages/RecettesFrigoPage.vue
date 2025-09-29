<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen">
    <LP_Header />
    <FridgeRecipes />
    <LP_Testimonials />
    <LP_Footer />
  </div>
</template>

<script setup>
import LP_Header from '../components/landing/LP_Header.vue'
import LP_Footer from '../components/landing/LP_Footer.vue'
import FridgeRecipes from '../components/recipes/FridgeRecipes.vue'
import LP_Testimonials from '../components/landing/LP_Testimonials.vue'
</script>
