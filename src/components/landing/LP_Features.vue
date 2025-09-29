<template>
        <!-- Features -->
        <section class="bg-white dark:bg-gray-900" id="features">
        <div class="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
            <div class="flex justify-center items-center flex-col w-full mb-8 lg:mb-16">
                <h2 class="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">Tout pour mieux manger, simplement</h2>
                <p class="text-gray-500 text-center sm:text-xl dark:text-gray-400">NutriMeal vous aide à comprendre ce que vous mangez aujourd’hui et à cuisiner facilement demain.</p>
            </div>
            <div class="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
                <div>
                    <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                        <svg class="w-5 h-5 lg:w-6 lg:h-6 text-blue-700 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4 3a2 2 0 00-2 2v1a1 1 0 001 1h1v9a2 2 0 002 2h8a2 2 0 002-2V7h1a1 1 0 001-1V5a2 2 0 00-2-2H4zm6 4a3 3 0 00-3 3v6h6V10a3 3 0 00-3-3z"/></svg>
                    </div>
                    <h3 class="mb-2 text-xl font-semibold text-gray-700 dark:text-white">Compteur de calories précis</h3>
                    <p class="text-gray-500 dark:text-gray-400">Recherche instantanée (OpenFoodFacts), calories par 100g et par portion, calcul par grammes ou par unité, avec macros.</p>
                </div>
                <div>
                    <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                        <svg class="w-5 h-5 lg:w-6 lg:h-6 text-green-700 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-9V6a1 1 0 10-2 0v3H6a1 1 0 100 2h3v3a1 1 0 102 0v-3h3a1 1 0 100-2h-3z" clip-rule="evenodd"/></svg>
                    </div>
                    <h3 class="mb-2 text-xl font-semibold text-gray-700 dark:text-white">Historique et hors-ligne</h3>
                    <p class="text-gray-500 dark:text-gray-400">Vos derniers aliments restent accessibles même sans réseau. Reprenez où vous vous êtes arrêté.</p>
                </div>
                <div>
                    <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                        <svg class="w-5 h-5 lg:w-6 lg:h-6 text-orange-700 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M4 3h12a1 1 0 011 1v8a2 2 0 01-2 2H9l-4 3v-3H5a2 2 0 01-2-2V4a1 1 0 011-1z"/></svg>
                    </div>
                    <h3 class="mb-2 text-xl font-semibold text-gray-700 dark:text-white">Bientôt: idées recettes du frigo</h3>
                    <p class="text-gray-500 dark:text-gray-400">Indiquez ce que vous avez à la maison, on vous suggère des recettes compatibles avec vos produits et vos objectifs.</p>
                </div>
                <div>
                    <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                        <svg class="w-5 h-5 lg:w-6 lg:h-6 text-purple-700 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M13 7H7v6h6V7z"/><path fill-rule="evenodd" d="M5 3a2 2 0 00-2 2v2h2V5h2V3H5zm8 0h2a2 2 0 012 2v2h-2V5h-2V3zm4 8h-2v2h-2v2h2a2 2 0 002-2v-2zM7 17v-2H5v-2H3v2a2 2 0 002 2h2z" clip-rule="evenodd"/></svg>
                    </div>
                    <h3 class="mb-2 text-xl font-semibold text-gray-700 dark:text-white">Design simple, rapide</h3>
                    <p class="text-gray-500 dark:text-gray-400">Interface claire, adaptée mobile. Travaillez vite, sans fioritures.</p>
                </div>
                <div>
                    <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                        <svg class="w-5 h-5 lg:w-6 lg:h-6 text-pink-700 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M2 5a2 2 0 012-2h3l2 2h7a2 2 0 012 2v3H2V5z"/><path d="M2 11h16v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"/></svg>
                    </div>
                    <h3 class="mb-2 text-xl font-semibold text-gray-700 dark:text-white">Macros lisibles</h3>
                    <p class="text-gray-500 dark:text-gray-400">Protéines, glucides, lipides par 100g mis en avant pour comparer d’un coup d’œil.</p>
                </div>
                <div>
                    <div class="flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
                        <svg class="w-5 h-5 lg:w-6 lg:h-6 text-teal-700 dark:text-primary-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.293 9.293a1 1 0 011.414 0L11 10.586l3.293-3.293a1 1 0 111.414 1.414L12.414 12l-2.707-2.707a1 1 0 00-1.414 0L7 10.586l-1.293-1.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0L10 11.414l4.293 4.293a1 1 0 001.414-1.414L11 10.586l-1.293-1.293a1 1 0 00-1.414 0L6 11.586l-2.293-2.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0L10 12.414l3.293 3.293a1 1 0 001.414-1.414L12 11.586l-1.293-1.293a1 1 0 00-1.414 0L9 11.586l-2.293-2.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0L10 13.414l4.293 4.293a1 1 0 001.414-1.414L12 12.586l-1.293-1.293a1 1 0 00-1.414 0L9 12.586l-2.293-2.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0L10 14.414z" clip-rule="evenodd"/></svg>
                    </div>
                    <h3 class="mb-2 text-xl font-semibold text-gray-700 dark:text-white">Gratuit et sans inscription</h3>
                    <p class="text-gray-500 dark:text-gray-400">Utilisation immédiate. Nous respectons votre vie privée.</p>
                </div>
            </div>
        </div>
    </section>
    <!-- Features -->
</template>