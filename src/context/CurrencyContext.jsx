import { createContext, useContext, useState, useEffect } from 'react'

const CurrencyContext = createContext(null)

export const CURRENCIES = {
  INR: { code: 'INR', symbol: '₹', label: 'INR (₹)', rate: 1.0, flag: '🇮🇳' },
  USD: { code: 'USD', symbol: '$', label: 'USD ($)', rate: 0.012, flag: '🇺🇸' },
  GBP: { code: 'GBP', symbol: '£', label: 'GBP (£)', rate: 0.0094, flag: '🇬🇧' },
  EUR: { code: 'EUR', symbol: '€', label: 'EUR (€)', rate: 0.011, flag: '🇪🇺' },
  AED: { code: 'AED', symbol: 'AED ', label: 'AED (د.إ)', rate: 0.044, flag: '🇦🇪' },
}

const STORAGE_KEY = 'craft_pink_city_currency_v1'

export function CurrencyProvider({ children }) {
  const [currency, setCurrency] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved && CURRENCIES[saved] ? saved : 'INR'
    } catch {
      return 'INR'
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency)
    } catch {
      // ignore
    }
  }, [currency])

  const activeCurrency = CURRENCIES[currency] || CURRENCIES.INR

  // Helper to format any price string or numeric value into the active currency
  const formatPrice = (priceInput) => {
    if (!priceInput) return ''
    
    // If numeric
    if (typeof priceInput === 'number') {
      if (currency === 'INR') {
        return `₹${priceInput.toLocaleString('en-IN')}`
      }
      const converted = priceInput * activeCurrency.rate
      return `${activeCurrency.symbol}${converted.toFixed(currency === 'AED' ? 0 : 2)}`
    }

    // If string price e.g. "₹1,499 (Set of 3)" or "₹1,449"
    const str = String(priceInput)
    const numericMatch = str.replace(/[^0-9]/g, '')
    if (!numericMatch) return str

    const inrValue = parseInt(numericMatch, 10)
    let convertedStr = ''

    if (currency === 'INR') {
      convertedStr = `₹${inrValue.toLocaleString('en-IN')}`
    } else {
      const converted = inrValue * activeCurrency.rate
      convertedStr = `${activeCurrency.symbol}${converted.toFixed(currency === 'AED' ? 0 : 2)}`
    }

    // Append suffixes like (Set of 3), (Set of 2), each, etc.
    if (str.includes('(Set of 3)')) convertedStr += ' (Set of 3)'
    else if (str.includes('(Set of 2)')) convertedStr += ' (Set of 2)'
    else if (str.includes('each')) convertedStr += ' each'

    return convertedStr
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, activeCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  const context = useContext(CurrencyContext)
  if (!context) {
    return {
      currency: 'INR',
      setCurrency: () => {},
      activeCurrency: CURRENCIES.INR,
      formatPrice: (p) => p,
    }
  }
  return context
}
