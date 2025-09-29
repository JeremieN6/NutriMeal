<template>
  <main class="min-h-screen bg-gray-50 text-gray-900">
    <section class="max-w-3xl mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-2">Compteur de calories</h1>
      <p class="text-sm text-gray-600 mb-6">
        Recherchez un aliment (min. 3 lettres), puis calculez son apport calorique par grammes ou par unité.
      </p>

      <!-- Search -->
      <div class="relative">
        <label for="food-search" class="block text-sm font-medium mb-1">Aliment</label>
        <input
          id="food-search"
          v-model="query"
          type="text"
          placeholder="Ex: pomme, yaourt, poulet…"
          class="w-full rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
          @input="onInput"
          autocomplete="off"
        />

        <!-- Suggestions -->
        <ul
          v-if="showSuggestions"
          class="absolute z-10 mt-1 max-h-72 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg"
        >
          <li
            v-for="(p, idx) in suggestions"
            :key="p.id || p.code || idx"
            @click="selectProduct(p)"
            class="flex items-center gap-3 cursor-pointer px-3 py-2 hover:bg-gray-50"
          >
            <img
              v-if="p.image"
              :src="p.image"
              class="h-8 w-8 object-cover rounded"
              alt=""
              loading="lazy"
            />
            <div class="min-w-0">
              <div class="truncate font-medium">{{ p.displayName }}</div>
              <div class="text-xs text-gray-500">
                {{ p.kcalPer100g ? p.kcalPer100g.toFixed(0) + ' kcal / 100g' : 'Énergie inconnue' }}
              </div>
            </div>
          </li>
          <li v-if="!loading && suggestions.length === 0" class="px-3 py-2 text-sm text-gray-500">
            Aucun résultat
          </li>
          <li v-if="loading" class="px-3 py-2 text-sm text-gray-500">Recherche…</li>
        </ul>
      </div>

      <!-- Selected product -->
      <div v-if="selected" class="mt-6 rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div class="flex items-start gap-4">
          <img
            v-if="selected.image"
            :src="selected.image"
            class="h-16 w-16 object-cover rounded"
            alt=""
          />
          <div class="min-w-0">
            <h2 class="text-lg font-semibold truncate">{{ selected.displayName }}</h2>
            <p class="text-sm text-gray-600">
              <span v-if="selected.kcalPer100g">{{ selected.kcalPer100g.toFixed(0) }} kcal / 100g</span>
              <span v-else>Énergie inconnue</span>
              <span v-if="selected.kcalPerServing && selected.servingQuantity" class="ml-2">
                • ~{{ selected.kcalPerServing.toFixed(0) }} kcal / portion ({{ selected.servingQuantity }} g)
              </span>
            </p>
          </div>
        </div>

        <!-- Calculations -->
        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <!-- By grams -->
          <div class="rounded-md border border-gray-200 p-3">
            <h3 class="font-medium mb-2">Par grammes</h3>
            <div class="flex items-center gap-2">
              <input
                type="number"
                min="0"
                v-model.number="grams"
                class="w-28 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <span class="text-sm text-gray-600">g</span>
            </div>
            <p class="mt-2 text-sm text-gray-700">
              ≈ <strong>{{ caloriesByGrams.toFixed(0) }}</strong> kcal
            </p>
          </div>

          <!-- By units -->
          <div class="rounded-md border border-gray-200 p-3">
            <h3 class="font-medium mb-2">Par unité</h3>
            <div class="flex flex-wrap items-center gap-2">
              <input
                type="number"
                min="0"
                v-model.number="units"
                class="w-24 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <span class="text-sm text-gray-600">unités ×</span>
              <input
                type="number"
                min="0"
                v-model.number="gramsPerUnit"
                class="w-28 rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none"
              />
              <span class="text-sm text-gray-600">g / unité</span>
            </div>
            <p class="mt-2 text-sm text-gray-700">
              ≈ <strong>{{ caloriesByUnits.toFixed(0) }}</strong> kcal
              <span v-if="autofilledGramsPerUnit" class="text-xs text-gray-500">(poids par unité auto: {{ gramsPerUnit }} g)</span>
            </p>
          </div>
        </div>

        <p class="mt-3 text-xs text-gray-500">
          Données issues d'OpenFoodFacts. Les valeurs sont indicatives et peuvent varier selon le produit.
        </p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const query = ref('')
const suggestions = ref([])
const loading = ref(false)
const showSuggestions = computed(() => query.value.length >= 3 && (loading.value || suggestions.value.length > 0))
const selected = ref(null)

// Calculation state
const grams = ref(100)
const units = ref(1)
const gramsPerUnit = ref(0)
const autofilledGramsPerUnit = ref(false)

let debounceTimer = null
let inFlightAbort = null

function onInput() {
  selected.value = null
  autofilledGramsPerUnit.value = false
  if (query.value.trim().length < 3) {
    suggestions.value = []
    return
  }
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(fetchSuggestions, 300)
}

async function fetchSuggestions() {
  const q = query.value.trim()
  if (q.length < 3) return
  if (inFlightAbort) inFlightAbort.abort()
  inFlightAbort = new AbortController()
  loading.value = true
  try {
    const params = new URLSearchParams({
      search_terms: q,
      search_simple: '1',
      action: 'process',
      json: '1',
      page_size: '10',
      fields: [
        'product_name',
        'brands',
        'code',
        'image_front_small_url',
        'serving_quantity',
        'serving_size',
        'nutriments',
      ].join(',')
    })
    const url = `https://world.openfoodfacts.org/cgi/search.pl?${params.toString()}`
    const res = await fetch(url, { signal: inFlightAbort.signal })
    const data = await res.json()
    const prods = Array.isArray(data.products) ? data.products : []
    suggestions.value = prods.map(mapProduct)
  } catch (e) {
    if (e.name !== 'AbortError') {
      console.warn('Search error', e)
      suggestions.value = []
    }
  } finally {
    loading.value = false
  }
}

function mapProduct(p) {
  const name = [p.product_name, p.brands].filter(Boolean).join(' — ')
  const n = p.nutriments || {}
  // Best-effort kcal/100g
  let kcalPer100g = n['energy-kcal_100g']
  if (kcalPer100g == null) {
    if (n['energy_100g'] != null && (n['energy_unit'] === 'kcal' || n['energy_unit'] === 'kcal (Nutritional)')) {
      kcalPer100g = n['energy_100g']
    } else if (n['energy-kj_100g'] != null) {
      kcalPer100g = n['energy-kj_100g'] / 4.184
    }
  }

  let kcalPerServing = n['energy-kcal_serving']
  if (kcalPerServing == null && n['energy_serving'] != null && (n['energy_unit'] === 'kcal' || n['energy_unit'] === 'kcal (Nutritional)')) {
    kcalPerServing = n['energy_serving']
  }

  // Serving quantity in grams if available (parse serving_size like "30 g")
  let servingQuantity = Number(p.serving_quantity)
  if (!servingQuantity && typeof p.serving_size === 'string') {
    const m = p.serving_size.match(/(\d+[\.,]?\d*)\s*(g|ml)/i)
    if (m) servingQuantity = Number(m[1].replace(',', '.'))
  }

  return {
    id: p.code,
    code: p.code,
    displayName: name || 'Produit sans nom',
    image: p.image_front_small_url || '',
    kcalPer100g: typeof kcalPer100g === 'number' ? kcalPer100g : null,
    kcalPerServing: typeof kcalPerServing === 'number' ? kcalPerServing : null,
    servingQuantity: servingQuantity || null,
    raw: p,
  }
}

function selectProduct(p) {
  selected.value = p
  query.value = p.displayName
  suggestions.value = []
  // Prefill grams-per-unit if we know a serving quantity
  if (p.servingQuantity) {
    gramsPerUnit.value = p.servingQuantity
    autofilledGramsPerUnit.value = true
  } else {
    gramsPerUnit.value = 0
    autofilledGramsPerUnit.value = false
  }
}

// Calories calculations
const caloriesByGrams = computed(() => {
  if (!selected.value || !selected.value.kcalPer100g || grams.value <= 0) return 0
  return (grams.value * selected.value.kcalPer100g) / 100
})

const caloriesByUnits = computed(() => {
  if (!selected.value || !selected.value.kcalPer100g || units.value <= 0) return 0
  const gPerUnit = gramsPerUnit.value > 0
    ? gramsPerUnit.value
    : (selected.value.servingQuantity || 0)
  const totalGrams = units.value * gPerUnit
  if (totalGrams <= 0) return 0
  return (totalGrams * selected.value.kcalPer100g) / 100
})

// Keep units calc in sync when we pick a product with serving info
watch(() => selected.value?.servingQuantity, (sq) => {
  if (sq && gramsPerUnit.value === 0) {
    gramsPerUnit.value = sq
    autofilledGramsPerUnit.value = true
  }
})
</script>

<style scoped>
</style>
