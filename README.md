# NutriMeal™ - Calculateur de dosettes pour biberon

**NutriMeal™** est une application web simple et intuitive qui permet aux parents de calculer rapidement le nombre de dosettes de lait en poudre à mettre dans un biberon selon le volume souhaité. L’outil est conçu pour sécuriser la préparation du biberon, réduire les erreurs de dosage et faciliter le quotidien des parents.

---

## 📌 Fonctionnalités

- Calcul automatique du nombre de dosettes à partir du volume du biberon et du ratio ml/dosette.
- Boutons de volumes courants pour un accès rapide (90 ml, 120 ml, 150 ml, etc.).
- Messages d’alerte pour volumes ou ratios invalides.
- Interface responsive et compatible dark mode.
- Instructions claires sur le fonctionnement et la sécurité.
- Facilement intégrable sur un site existant grâce à Vue.js et TailwindCSS.

---

## ⚡ Technologies utilisées

- [Vue 3](https://vuejs.org/) – framework JavaScript moderne pour construire l’interface réactive.
- [TailwindCSS](https://tailwindcss.com/) – framework CSS pour le design et la mise en page rapide.
- Flowbite – composants UI pour un rendu élégant et responsive.

---

## 🚀 Installation / Lancement local

1. Clonez le dépôt :

```bash
git clone https://github.com/<votre-utilisateur>/NutriMeal-calculator.git



2- Accédez au dossier du projet :

cd NutriMeal-calculator


3- Installez les dépendances :
npm install


4- Lancez le serveur de développement :
npm run dev


5 - Ouvrez votre navigateur à l’adresse indiquée.

📝 Utilisation

Saisissez le volume du biberon (en ml).

Indiquez le nombre de ml par dosette (par défaut 30 ml).

Cliquez sur Calculer pour obtenir le nombre de dosettes recommandé.

Cliquez sur un volume courant pour remplir automatiquement le champ et recalculer.

⚠️ Avertissement

Le calcul est basé sur le ratio que vous avez renseigné.

Vérifiez toujours les instructions du fabricant de lait pour éviter tout risque.

Cette application est un outil d’aide, elle ne remplace pas les conseils d’un pédiatre.

📁 Structure du projet
NutriMeal-calculator/
│
├─ src/
│   ├─ components/      # Composants Vue (Header, Footer, Testimonials)
│   ├─ composables/     # Composables Vue (useCalculator)
│   ├─ views/           # Pages (Calculateur)
│   └─ App.vue
│
├─ public/              # Fichiers statiques
├─ package.json
└─ README.md

🤝 Contribuer

Les contributions sont les bienvenues !

Forkez le projet

Créez votre branche (git checkout -b feature/nom)

Commitez vos modifications (git commit -m 'Ajout d’une fonctionnalité')

Pushez la branche (git push origin feature/nom)

Ouvrez un Pull Request

📄 Licence

MIT License © 2025 NutriMeal™