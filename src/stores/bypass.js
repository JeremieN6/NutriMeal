import { ref } from 'vue'

const isBypassActive = ref(localStorage.getItem('bypassActive') === 'true')

// console.log('Bypass Store - Initial state:', isBypassActive.value)

// Ajoute cette fonction pour forcer la synchro depuis le localStorage
export function syncBypassFromStorage() {
  const oldValue = isBypassActive.value
  const newValue = localStorage.getItem('bypassActive') === 'true'
  isBypassActive.value = newValue
  // console.log('Bypass Store - Sync from storage:', oldValue, '->', newValue)
}

export function activateBypass() {
  // console.log('Bypass Store - Activating bypass')
  isBypassActive.value = true
  localStorage.setItem('bypassActive', 'true')
  // Déclenche un event pour tous les onglets
  window.dispatchEvent(new Event('storage'))
  // console.log('Bypass Store - Bypass activated, localStorage:', localStorage.getItem('bypassActive'))
}

export function deactivateBypass() {
  // console.log('Bypass Store - Deactivating bypass')
  isBypassActive.value = false
  localStorage.removeItem('bypassActive')
  window.dispatchEvent(new Event('storage'))
  // console.log('Bypass Store - Bypass deactivated')
}

export { isBypassActive }