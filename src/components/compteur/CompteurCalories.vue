<template>
  <section>
    <div class="bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 p-6 content-fit">
      <!-- Search -->
      <div class="relative">
        <label for="food-search" class="block text-sm font-medium mb-2 text-left text-gray-900 dark:text-white">Aliment</label>
        <input
          id="food-search"
          v-model="query"
          type="text"
          placeholder="Ex: pomme, yaourt, poulet…"
          class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          @input="onInput"
          autocomplete="off"
        />

        <!-- Suggestions -->
        <ul
          v-if="showSuggestions"
          class="absolute z-10 mt-1 w-full max-h-72 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg dark:bg-gray-700 dark:border-gray-600"
        >
          <li
            v-for="(p, idx) in suggestions"
            :key="p.id || p.code || idx"
            @click="selectProduct(p)"
            class="flex items-center gap-3 cursor-pointer px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            <img v-if="p.image" :src="p.image" class="h-8 w-8 object-cover rounded" alt="" loading="lazy" />
            <div class="min-w-0">
              <div class="truncate font-medium text-gray-900 dark:text-white">{{ p.displayName }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-300">
                {{ p.kcalPer100g ? p.kcalPer100g.toFixed(0) + ' kcal / 100g' : 'Énergie inconnue' }}
              </div>
            </div>
          </li>
          <li v-if="!loading && suggestions.length === 0" class="px-3 py-2 text-sm text-gray-500 dark:text-gray-300">
            Aucun résultat
          </li>
          <li v-if="loading" class="px-3 py-2 text-sm text-gray-500 dark:text-gray-300">Recherche…</li>
        </ul>
        <!-- Recent searches when no suggestions open -->
        <div v-if="!showSuggestions && recent.length" class="mt-2">
          <div class="text-xs text-gray-500 dark:text-gray-300 mb-1">Récemment recherchés</div>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="r in recent"
              :key="r.id"
              type="button"
              class="flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs bg-gray-50 text-gray-800 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-100"
              @click="quickSelect(r)"
            >
              <img v-if="r.image" :src="r.image" class="h-4 w-4 object-cover rounded" alt="" />
              <span class="truncate max-w-[180px]">{{ r.name }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Selected product -->
      <div v-if="selected" class="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:bg-gray-800 dark:border-gray-700">
        <div class="flex items-start gap-4">
          <img v-if="selected.image" :src="selected.image" class="h-16 w-16 object-cover rounded" alt="" />
          <div class="min-w-0">
            <h2 class="text-lg font-semibold truncate text-gray-900 dark:text-white">{{ selected.displayName }}</h2>
            <p class="text-sm text-gray-600 dark:text-gray-300">
              <span v-if="selected.kcalPer100g">{{ selected.kcalPer100g.toFixed(0) }} kcal / 100g</span>
              <span v-else>Énergie inconnue</span>
              <span v-if="selected.kcalPerServing && selected.servingQuantity" class="ml-2">
                • ~{{ selected.kcalPerServing.toFixed(0) }} kcal / portion ({{ selected.servingQuantity }} g)
              </span>
            </p>
            <!-- Macros -->
            <div class="mt-3 grid grid-cols-3 gap-2 text-sm">
              <div class="rounded border border-gray-200 p-2 text-gray-800 dark:text-gray-100 dark:border-gray-700">
                <div class="text-xs text-gray-500 dark:text-gray-300">Protéines</div>
                <div class="font-medium">{{ macroValue(selected.proteins_100g) }}</div>
              </div>
              <div class="rounded border border-gray-200 p-2 text-gray-800 dark:text-gray-100 dark:border-gray-700">
                <div class="text-xs text-gray-500 dark:text-gray-300">Glucides</div>
                <div class="font-medium">{{ macroValue(selected.carbohydrates_100g) }}</div>
              </div>
              <div class="rounded border border-gray-200 p-2 text-gray-800 dark:text-gray-100 dark:border-gray-700">
                <div class="text-xs text-gray-500 dark:text-gray-300">Lipides</div>
                <div class="font-medium">{{ macroValue(selected.fat_100g) }}</div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <!-- By grams -->
          <div class="rounded-md border border-gray-200 p-3 dark:border-gray-700">
            <h3 class="font-medium mb-2 text-gray-900 dark:text-white">Par grammes</h3>
            <div class="flex items-center gap-2">
              <input
                type="number"
                min="0"
                v-model.number="grams"
                class="w-28 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <span class="text-sm text-gray-600 dark:text-gray-300">g</span>
            </div>
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-200">
              ≈ <strong>{{ caloriesByGrams.toFixed(0) }}</strong> kcal
            </p>
          </div>

          <!-- By units -->
          <div class="rounded-md border border-gray-200 p-3 dark:border-gray-700">
            <h3 class="font-medium mb-2 text-gray-900 dark:text-white">Par unité</h3>
            <div class="flex flex-wrap items-center gap-2">
              <input
                type="number"
                min="0"
                v-model.number="units"
                class="w-24 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <span class="text-sm text-gray-600 dark:text-gray-300">unités ×</span>
              <input
                type="number"
                min="0"
                v-model.number="gramsPerUnit"
                class="w-28 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 px-3 py-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
              />
              <span class="text-sm text-gray-600 dark:text-gray-300">g / unité</span>
            </div>
            <p class="mt-2 text-sm text-gray-700 dark:text-gray-200">
              ≈ <strong>{{ caloriesByUnits.toFixed(0) }}</strong> kcal
              <span v-if="autofilledGramsPerUnit" class="text-xs text-gray-500 dark:text-gray-400">(poids par unité auto: {{ gramsPerUnit }} g)</span>
            </p>
          </div>
        </div>

        <p class="mt-3 text-xs text-gray-500 dark:text-gray-400">
          Données issues d'OpenFoodFacts. Les valeurs sont indicatives et peuvent varier selon le produit.
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

const query = ref('')
const suggestions = ref([])
const loading = ref(false)
const showSuggestions = computed(() => query.value.length >= 3 && (loading.value || suggestions.value.length > 0))
const selected = ref(null)
const recent = ref([])

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
    proteins_100g: numberOrNull(n['proteins_100g']),
    carbohydrates_100g: numberOrNull(n['carbohydrates_100g']),
    fat_100g: numberOrNull(n['fat_100g']),
    raw: p,
  }
}

function selectProduct(p) {
  selected.value = p
  query.value = p.displayName
  suggestions.value = []
  addToRecent(p)
  // Prefill grams-per-unit if we know a serving quantity
  if (p.servingQuantity) {
    gramsPerUnit.value = p.servingQuantity
    autofilledGramsPerUnit.value = true
  } else {
    gramsPerUnit.value = 0
    autofilledGramsPerUnit.value = false
  }
}

async function quickSelect(r) {
  query.value = r.name
  loading.value = true
  try {
    const url = `https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(r.id)}.json?fields=product_name,brands,code,image_front_small_url,serving_quantity,serving_size,nutriments`
    const res = await fetch(url)
    const data = await res.json()
    if (data && data.product) {
      const p = mapProduct(data.product)
      selectProduct(p)
    } else {
      selectProduct(minimalFromRecent(r))
    }
  } catch {
    selectProduct(minimalFromRecent(r))
  } finally {
    loading.value = false
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

// Helpers for macros
function numberOrNull(v) {
  return typeof v === 'number' ? v : null
}
function macroValue(v) {
  return v == null ? '—' : `${v.toFixed(1)} g / 100g`
}

// Recent searches (localStorage)
const RECENT_KEY = 'alimentr_recent_v1'
function addToRecent(p) {
  const item = {
    id: p.id,
    name: p.displayName,
    image: p.image,
    kcalPer100g: p.kcalPer100g,
    ts: Date.now(),
  }
  const current = loadRecent().filter(r => r.id !== item.id)
  current.unshift(item)
  recent.value = current.slice(0, 8)
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.value))
}
function loadRecent() {
  try {
    const raw = localStorage.getItem(RECENT_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}
function minimalFromRecent(r) {
  return {
    id: r.id,
    code: r.id,
    displayName: r.name,
    image: r.image || '',
    kcalPer100g: r.kcalPer100g || null,
    kcalPerServing: null,
    servingQuantity: null,
    proteins_100g: null,
    carbohydrates_100g: null,
    fat_100g: null,
  }
}
recent.value = loadRecent()
</script>

<style scoped>
</style>
