<template>
  <section class="bg-white dark:bg-gray-900">
    <div class="py-8 px-4 mx-auto max-w-screen-lg sm:py-16 lg:px-6">
      <div class="mb-8 text-center">
        <h2 class="mb-2 text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">Recettes depuis votre frigo</h2>
        <p class="text-gray-500 dark:text-gray-400">Saisissez vos ingrédients. Nous générons 1 à 3 recettes adaptées, avec étapes et conseils.</p>
      </div>

      <!-- Input chips -->
      <div class="mb-6">
        <label for="ingredient-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Ingrédients disponibles</label>
        <div class="flex gap-2">
          <input id="ingredient-input" v-model="current" @keydown.enter.prevent="addCurrent" type="text" placeholder="ex: poulet, riz, tomates" class="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
          <button @click="addCurrent" class="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800">Ajouter</button>
        </div>
        <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Appuyez sur Entrée pour ajouter chaque ingrédient.</p>

        <div v-if="ingredients.length" class="mt-4 flex flex-wrap gap-2">
          <span v-for="(ing, idx) in ingredients" :key="ing+idx" class="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
            {{ ing }}
            <button @click="remove(idx)" type="button" class="ml-2 inline-flex items-center p-0.5 text-blue-600 hover:text-blue-800 dark:text-blue-300">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
            </button>
          </span>
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-3">
        <div class="md:col-span-2">
          <div class="grid sm:grid-cols-2 gap-4">
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cuisine (optionnel)</label>
              <input v-model="cuisine" type="text" placeholder="ex: italienne, asiatique" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
            </div>
            <div>
              <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Régime/contraintes (optionnel)</label>
              <input v-model="diet" type="text" placeholder="ex: végétarien, sans lactose" class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-600 focus:border-blue-600 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white" />
            </div>
          </div>
        </div>
        <div class="flex items-end">
          <button @click="generate" :disabled="loading || ingredients.length===0" class="w-full inline-flex items-center justify-center px-4 py-3 text-base font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:ring-4 focus:ring-green-300 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-green-800">
            <svg v-if="loading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path></svg>
            Générer des recettes
          </button>
        </div>
      </div>

      <div v-if="error" class="mt-6 p-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
        {{ error }}
      </div>

      <!-- Results -->
      <div v-if="recipes.length" class="mt-10 grid gap-6 md:grid-cols-2">
        <article v-for="(r, i) in recipes" :key="r.title+i" class="p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
          <h3 class="mb-1 text-2xl font-semibold text-gray-900 dark:text-white">{{ r.title }}</h3>
          <p class="mb-4 text-gray-600 dark:text-gray-300">{{ r.description }}</p>
          <div class="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span class="inline-flex items-center"><svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v2h16V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1z"/><path d="M18 9H2v7a2 2 0 002 2h12a2 2 0 002-2V9z"/></svg> {{ r.prepMinutes + r.cookMinutes }} min (prep {{ r.prepMinutes }} + cuisson {{ r.cookMinutes }})</span>
            <span class="inline-flex items-center"><svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M8 9a3 3 0 116 0v1h1a2 2 0 012 2v1H5v-1a2 2 0 012-2h1V9z"/></svg> {{ r.servings }} parts</span>
          </div>

          <div class="mt-4">
            <h4 class="mb-2 font-semibold text-gray-900 dark:text-white">Ingrédients utilisés</h4>
            <ul class="list-disc ml-6 text-gray-700 dark:text-gray-300">
              <li v-for="(ing, idx) in r.ingredientsUsed" :key="ing.name+idx">
                {{ ing.quantity ? ing.quantity + ' ' : '' }}{{ ing.name }}<span v-if="ing.optional" class="text-xs text-gray-500"> (optionnel)</span>
              </li>
            </ul>
          </div>

          <div v-if="r.missingIngredients && r.missingIngredients.length" class="mt-3">
            <p class="text-sm text-amber-700 bg-amber-50 dark:bg-gray-800 dark:text-amber-400 p-3 rounded">Il manque: {{ r.missingIngredients.join(', ') }}</p>
          </div>

          <div class="mt-4">
            <h4 class="mb-2 font-semibold text-gray-900 dark:text-white">Étapes</h4>
            <ol class="list-decimal ml-6 space-y-1 text-gray-700 dark:text-gray-300">
              <li v-for="(s, si) in r.steps" :key="si">{{ s }}</li>
            </ol>
          </div>

          <div v-if="r.tips && r.tips.length" class="mt-4">
            <h4 class="mb-2 font-semibold text-gray-900 dark:text-white">Conseils</h4>
            <ul class="list-disc ml-6 space-y-1 text-gray-700 dark:text-gray-300">
              <li v-for="(t, ti) in r.tips" :key="ti">{{ t }}</li>
            </ul>
          </div>
        </article>
      </div>

      <!-- Suggestions if add -->
      <div v-if="suggestionsIfAdd.length" class="mt-10">
        <div class="p-6 bg-blue-50 border border-blue-200 rounded-lg dark:bg-gray-800 dark:border-gray-700">
          <h4 class="mb-2 text-xl font-semibold text-blue-900 dark:text-blue-200">Et si vous ajoutiez...</h4>
          <ul class="list-disc ml-6 text-blue-900 dark:text-blue-100">
            <li v-for="(sug, si) in suggestionsIfAdd" :key="si">
              <span class="font-medium">{{ sug.add.join(', ') }}</span> → {{ sug.idea }}
            </li>
          </ul>
        </div>
      </div>

    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const current = ref('')
const ingredients = ref([])
const cuisine = ref('')
const diet = ref('')
const loading = ref(false)
const error = ref('')
const recipes = ref([])
const suggestionsIfAdd = ref([])

function addCurrent () {
  const val = current.value.trim()
  if (!val) return
  val.split(',').map(s => s.trim()).filter(Boolean).forEach(v => {
    if (!ingredients.value.includes(v)) ingredients.value.push(v)
  })
  current.value = ''
}

function remove (idx) {
  ingredients.value.splice(idx, 1)
}

async function generate () {
  error.value = ''
  recipes.value = []
  suggestionsIfAdd.value = []
  loading.value = true
  try {
    const isDev = import.meta.env.DEV
    const isViteDefaultPort = typeof window !== 'undefined' && window.location.port === '5173'
    const fnUrl = isDev && isViteDefaultPort
      ? 'http://localhost:8888/.netlify/functions/generate-recipes'
      : '/.netlify/functions/generate-recipes'

    const res = await fetch(fnUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: ingredients.value, cuisine: cuisine.value, diet: diet.value, count: 3 })
    })
    if (!res.ok) {
      const t = await res.text()
      throw new Error(`Erreur API (${res.status}): ${t}`)
    }
    const data = await res.json()
    recipes.value = data.recipes || []
    suggestionsIfAdd.value = data.suggestionsIfAdd || []
  } catch (e) {
    error.value = e.message || 'Une erreur est survenue.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
</style>
