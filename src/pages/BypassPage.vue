<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
    <div class="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
      <form class="space-y-6" @submit.prevent="checkCode">
        <div class="text-center">
          <h5 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">🔓 Mode Développeur</h5>
          <p class="text-gray-600 dark:text-gray-400">Entrez le code d'accès pour débloquer toutes les fonctionnalités</p>
        </div>

        <div>
          <label for="code" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Code d'accès</label>
          <input
            v-model="code"
            type="password"
            id="code"
            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
            placeholder="Entrez le code reçu par le développeur"
            required
            @keyup.enter="checkCode"
          />
        </div>

        <button
          type="submit"
          :disabled="!code.trim()"
          class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Activer le mode sans restriction
        </button>

        <div v-if="error" class="mt-2 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg dark:text-red-400 dark:bg-red-900/20 dark:border-red-800">
          <span class="font-medium">Erreur :</span> Le code saisi n'est pas valide.
        </div>

        <div v-if="success" class="mt-2 p-3 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg dark:text-green-400 dark:bg-green-900/20 dark:border-green-800">
          <span class="font-medium">Succès :</span> Mode sans restriction activé ! Redirection en cours...
        </div>

        <!-- Debug info en mode développement -->
        <div v-if="showDebug" class="mt-4 p-3 text-xs text-gray-500 bg-gray-50 border border-gray-200 rounded-lg dark:text-gray-400 dark:bg-gray-700 dark:border-gray-600">
          <!-- <p><strong>Codes autorisés :</strong> {{ allowedCodes.join(', ') }}</p> -->
          <p><strong>Bypass activé :</strong> {{ isBypassActive ? '✅ Oui déjà activé' : '❌Non, pas activé' }}</p>
        </div>
      </form>
    </div>
  </div>
</template>
  
<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { activateBypass, isBypassActive, syncBypassFromStorage } from '../stores/bypass';

const code = ref('');
const error = ref(false);
const success = ref(false);
const router = useRouter();

// Récupérer les codes autorisés depuis les variables d'environnement
const allowedCodes = computed(() => {
  const codes = import.meta.env.VITE_BYPASS_ALLOWED_CODES?.split(',') || [];
  return codes.map(c => c.trim());
});

// Afficher les infos de debug en mode développement
const showDebug = computed(() => {
  return import.meta.env.DEV || import.meta.env.VITE_SHOW_DEBUG === 'true';
});

function checkCode() {
  // Reset des états
  error.value = false;
  success.value = false;

  const inputCode = code.value.trim();

  if (!inputCode) {
    error.value = true;
    return;
  }

  // console.log('Code saisi:', inputCode);
  // console.log('Codes autorisés:', allowedCodes.value);

  if (allowedCodes.value.includes(inputCode)) {
    success.value = true;
    activateBypass();

    // Attendre que l'état soit synchronisé avant la redirection
    setTimeout(() => {
      // Forcer une nouvelle synchronisation
      syncBypassFromStorage();
      // console.log('Bypass state before redirect:', isBypassActive.value);

      // Redirection avec un délai plus long pour garantir la synchronisation
      setTimeout(() => {
  router.push('/compteur');
      }, 500);
    }, 1000);
  } else {
    error.value = true;
    // Reset le code après une erreur
    setTimeout(() => {
      code.value = '';
    }, 2000);
  }
}

// Vérifier si le bypass est déjà actif au chargement
onMounted(() => {
  if (isBypassActive.value) {
    success.value = true;
    setTimeout(() => {
  router.push('/compteur');
    }, 1000);
  }
});
</script>