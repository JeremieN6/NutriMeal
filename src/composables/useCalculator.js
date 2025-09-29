import { ref, reactive, computed, watch } from 'vue'

export function useCalculator() {
  // Données de base
  const salaryTarget = ref(5000)

  const expenses = reactive({
    rent: 0,
    travel: 0,
    software: 0,
    accounting: 0,
    phone: 0,
    fuel: 0,
    maintenance: 0,
    supplies: 0,
    meals: 0,
    banking: 0,
    computer: 0,
    taxes: 0,
    other: 0,
  })

  const socialChargesRate = ref(14)
  const showAnnualSocialCharges = ref(true)
  const activityType = ref('commercial')
  const hasVersementLiberatoire = ref(false)
  const customTaxRate = ref(15)
  const profitMargin = ref(5)
  const totalWorkingDays = ref(251)

  const nonBillableDays = reactive({
    holidays: 0,
    business: 2,
    admin: 3,
    sick: 5,
    unemployment: 5,
  })

  // Calculs
  const annualSalary = computed(() => salaryTarget.value * 12)

  const totalMonthlyExpenses = computed(() =>
    Object.values(expenses).reduce((total, val) => total + (parseFloat(val) || 0), 0)
  )

  const totalAnnualExpenses = computed(() => totalMonthlyExpenses.value * 12)

  const monthlyGrossSalary = computed(() => {
    const rate = parseFloat(socialChargesRate.value) / 100
    return salaryTarget.value / (1 - rate)
  })

  const monthlySocialCharges = computed(() => monthlyGrossSalary.value - salaryTarget.value)
  const annualSocialCharges = computed(() => monthlySocialCharges.value * 12)
  const annualGrossSalary = computed(() => monthlyGrossSalary.value * 12)

  const vlirTaxRate = computed(() => {
    switch (activityType.value) {
      case 'commercial': return 1
      case 'artisanal': return 1.7
      case 'liberal': return 2.2
      default: return 1.7
    }
  })

  const effectiveTaxRate = computed(() =>
    hasVersementLiberatoire.value ? vlirTaxRate.value : customTaxRate.value
  )

  const totalImposition = computed(() => {
    const base = annualGrossSalary.value
    const taux = hasVersementLiberatoire.value ? vlirTaxRate.value : customTaxRate.value
    return (base * taux) / 100
  })

  const totalNonBillableDays = computed(() =>
    Object.values(nonBillableDays).reduce((total, val) => total + (parseInt(val) || 0), 0)
  )

  const billableDays = computed(() =>
    Math.max(0, totalWorkingDays.value - totalNonBillableDays.value)
  )

  const totalAnnualNeeds = computed(() =>
    annualGrossSalary.value + totalImposition.value + totalAnnualExpenses.value
  )

  const annualRevenue = computed(() =>
    totalAnnualNeeds.value * (1 + profitMargin.value / 100)
  )

  const dailyRate = computed(() =>
    billableDays.value > 0 ? annualRevenue.value / billableDays.value : 0
  )

  const formatNumber = (num) => {
    const rounded = Math.round(num * 100) / 100
    return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }

  const downloadSimulation = async () => {
    try {
      // Dynamically import html2canvas
      const html2canvas = (await import('html2canvas')).default

      // Find the calculator container by ID (most reliable)
      let calculatorElement = document.getElementById('calculator-content')

      // Fallback selectors if the ID doesn't work
      if (!calculatorElement) {
        calculatorElement = document.querySelector('.grid.grid-cols-1.gap-y-4.gap-x-1.auto-rows-auto')
      }

      if (!calculatorElement) {
        calculatorElement = document.querySelector('.w-full.p-4 > div')
      }

      if (!calculatorElement) {
        console.error('Calculator element not found')
        console.log('Available elements:', document.querySelectorAll('div[class*="grid"]'))
        return
      }

      // Add temporary styling for better PNG capture
      const originalStyle = calculatorElement.style.cssText
      calculatorElement.style.padding = '30px'
      calculatorElement.style.backgroundColor = '#ffffff'
      calculatorElement.style.borderRadius = '12px'
      calculatorElement.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'

      // Detect if we're in dark mode
      const isDarkMode = document.documentElement.classList.contains('dark')

      // Force appropriate colors for better contrast on white background
      const textElements = calculatorElement.querySelectorAll('*')
      const originalStyles = []

      textElements.forEach((el, index) => {
        const computedStyle = window.getComputedStyle(el)
        originalStyles[index] = {
          color: el.style.color,
          backgroundColor: el.style.backgroundColor,
          borderColor: el.style.borderColor
        }

        if (isDarkMode) {
          // In dark mode, force dark text colors for white background

          // White text -> dark text
          if (computedStyle.color.includes('rgb(255, 255, 255)') || // white
              computedStyle.color.includes('rgb(249, 250, 251)')) { // gray-50
            el.style.color = '#111827' // gray-900
          }

          // Light gray text -> dark gray text
          if (computedStyle.color.includes('rgb(156, 163, 175)') || // gray-400
              computedStyle.color.includes('rgb(107, 114, 128)') || // gray-500
              computedStyle.color.includes('rgb(75, 85, 99)') ||    // gray-600
              computedStyle.color.includes('rgb(55, 65, 81)')) {    // gray-700
            el.style.color = '#374151' // gray-700 for better contrast
          }

          // Dark backgrounds -> white backgrounds
          if (el.classList.contains('dark:bg-gray-800') ||
              el.classList.contains('dark:bg-gray-700') ||
              el.classList.contains('dark:bg-gray-900') ||
              computedStyle.backgroundColor.includes('rgb(31, 41, 55)') || // gray-800
              computedStyle.backgroundColor.includes('rgb(55, 65, 81)') || // gray-700
              computedStyle.backgroundColor.includes('rgb(17, 24, 39)')) { // gray-900
            el.style.backgroundColor = '#ffffff'
          }

          // Dark borders -> light borders
          if (el.classList.contains('dark:border-gray-600') ||
              el.classList.contains('dark:border-gray-700') ||
              computedStyle.borderColor.includes('rgb(75, 85, 99)') || // gray-600
              computedStyle.borderColor.includes('rgb(55, 65, 81)')) { // gray-700
            el.style.borderColor = '#d1d5db' // gray-300
          }
        }

        // Ensure white backgrounds for all cards regardless of mode
        if (el.classList.contains('bg-white') || el.classList.contains('dark:bg-gray-800')) {
          el.style.backgroundColor = '#ffffff'
        }
      })

      // Capture the element as canvas
      const canvas = await html2canvas(calculatorElement, {
        backgroundColor: '#ffffff', // White background
        scale: 2, // Higher quality
        useCORS: true,
        allowTaint: true,
        scrollX: 0,
        scrollY: 0,
        width: calculatorElement.scrollWidth + 80, // Add padding width
        height: calculatorElement.scrollHeight + 80, // Add padding height
        logging: false // Disable console logs
      })

      // Restore original styling
      calculatorElement.style.cssText = originalStyle
      textElements.forEach((el, index) => {
        if (originalStyles[index]) {
          el.style.color = originalStyles[index].color
          el.style.backgroundColor = originalStyles[index].backgroundColor
          el.style.borderColor = originalStyles[index].borderColor
        }
      })

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `simulation-tjm-${new Date().toISOString().split('T')[0]}.png`
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
          document.body.removeChild(a)
          URL.revokeObjectURL(url)
        }, 0)
      }, 'image/png', 0.95)

    } catch (error) {
      console.error('Erreur lors de la capture:', error)
      // Fallback to JSON export if screenshot fails
      alert('Erreur lors de la capture d\'écran. Téléchargement des données en JSON...')

      const simulationData = {
        salaryTarget: salaryTarget.value,
        annualSalary: annualSalary.value,
        dailyRate: dailyRate.value,
        annualRevenue: annualRevenue.value,
        totalAnnualExpenses: totalAnnualExpenses.value,
        totalImposition: totalImposition.value,
        date: new Date().toISOString()
      }

      const blob = new Blob([JSON.stringify(simulationData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'simulation-tjm-fallback.json'
      document.body.appendChild(a)
      a.click()
      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 0)
    }
  }

  // Nettoyage des champs
  watch(expenses, (newVal) => {
    for (const key in newVal) {
      if (isNaN(parseFloat(newVal[key]))) {
        expenses[key] = 0
      }
    }
  }, { deep: true })

  watch(nonBillableDays, (newVal) => {
    for (const key in newVal) {
      if (isNaN(parseInt(newVal[key]))) {
        nonBillableDays[key] = 0
      }
    }
  }, { deep: true })

  return {
    // États
    salaryTarget,
    expenses,
    socialChargesRate,
    showAnnualSocialCharges,
    activityType,
    hasVersementLiberatoire,
    customTaxRate,
    profitMargin,
    totalWorkingDays,
    nonBillableDays,

    // Résultats
    annualSalary,
    totalMonthlyExpenses,
    totalAnnualExpenses,
    monthlyGrossSalary,
    monthlySocialCharges,
    annualSocialCharges,
    annualGrossSalary,
    vlirTaxRate,
    effectiveTaxRate,
    totalImposition,
    totalNonBillableDays,
    billableDays,
    totalAnnualNeeds,
    annualRevenue,
    dailyRate,

    // Méthodes
    formatNumber,
    downloadSimulation
  }
}
