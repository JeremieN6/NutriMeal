<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen">
    <LP_Header />

    <div class="py-8 px-4 mx-auto max-w-screen-lg sm:py-16 lg:px-6" id="calculateur">
      <div class="title">
        <h1
          class="mb-4 text-3xl font-extrabold text-center tracking-tight leading-none text-gray-900 md:text-4xl lg:text-5xl dark:text-white">
          Compteur de calories par aliment
        </h1>
        <p
          class="mb-8 text-lg font-normal text-center text-gray-500 lg:text-xl sm:px-16 xl:px-28 dark:text-gray-400">
          Recherchez un aliment et calculez ses calories par grammes ou par unité. Données OpenFoodFacts.
        </p>
      </div>

      <div class="w-full p-4">
        <div class="grid grid-cols-1 gap-4 auto-rows-auto">
          <section>
            <CompteurCalories />
          </section>
        </div>
      </div>
    </div>

    <LP_Testimonials />
    <LP_Footer />
  </div>
  
</template>

<script setup>
import LP_Header from '../components/Landing/LP_Header.vue'
import LP_Testimonials from '../components/Landing/LP_Testimonials.vue'
import LP_Footer from '../components/Landing/LP_Footer.vue'
import CompteurCalories from '../components/compteur/CompteurCalories.vue'
</script>
