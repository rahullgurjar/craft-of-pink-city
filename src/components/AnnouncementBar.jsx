import { useState, useEffect } from 'react'
import { Sparkles, Globe, ChevronDown, Check, ShieldCheck, Truck, Gift } from 'lucide-react'
import { useCurrency, CURRENCIES } from '../context/CurrencyContext'

const LUXURY_MESSAGES = [
  {
    icon: Sparkles,
    text: 'Authentic Jaipur Artisan Craft • 100% Pure Quilted Cotton',
    highlight: 'Jaipur Heritage',
  },
  {
    icon: Truck,
    text: 'Free Express Delivery Across India on Orders Above ₹1,999',
    highlight: 'Free Shipping',
  },
  {
    icon: Gift,
    text: 'Custom Wedding Favors & Bulk Orders • Tiered Wholesale Rates',
    highlight: 'Bulk Gifting',
  },
  {
    icon: ShieldCheck,
    text: 'Worldwide Insured Express Delivery • London, Dubai, USA & Worldwide',
    highlight: 'Global Export',
  },
]

export default function AnnouncementBar() {
  const [currentIdx, setCurrentIdx] = useState(0)
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const { currency, setCurrency, activeCurrency } = useCurrency()

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % LUXURY_MESSAGES.length)
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const currentMsg = LUXURY_MESSAGES[currentIdx]
  const Icon = currentMsg.icon

  return (
    <div className="relative z-[60] bg-gradient-to-r from-[#21121d] via-[#2d1827] to-[#21121d] text-white text-[11px] sm:text-xs font-medium border-b border-white/10 shadow-xs">
      <div className="mx-auto flex h-9 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Left: Trust Seal */}
        <div className="hidden md:flex items-center gap-2 text-white/80">
          <span className="flex h-2 w-2 rounded-full bg-saffron animate-pulse" />
          <span className="text-[10px] tracking-wider uppercase font-semibold text-saffron">
            Jaipur Artisan Atelier
          </span>
        </div>

        {/* Center: Rotating Heritage Announcement */}
        <div className="flex-1 flex items-center justify-center text-center px-2">
          <div className="flex items-center gap-2 transition-all duration-300 animate-fadeIn" key={currentIdx}>
            <Icon size={13} className="text-saffron shrink-0 animate-spin-slow" />
            <span className="text-white/95 truncate max-w-[280px] sm:max-w-none tracking-wide">
              {currentMsg.text}
            </span>
          </div>
        </div>

        {/* Right: Currency Selector */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
            className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-bold text-white transition hover:bg-white/20"
            aria-label="Select Currency"
            title="Change Currency"
          >
            <span>{activeCurrency.flag}</span>
            <span>{activeCurrency.code}</span>
            <ChevronDown size={11} className={`text-white/70 transition-transform duration-200 ${showCurrencyDropdown ? 'rotate-180' : ''}`} />
          </button>

          {/* Currency Dropdown Menu */}
          {showCurrencyDropdown && (
            <>
              <div
                className="fixed inset-0 z-[65]"
                onClick={() => setShowCurrencyDropdown(false)}
              />
              <div className="absolute right-0 top-full mt-2 z-[70] w-48 rounded-2xl border border-ink/15 bg-white p-1.5 shadow-2xl animate-scaleIn text-ink">
                <div className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-ink/40 border-b border-ink/5 mb-1">
                  Select Currency
                </div>
                {Object.values(CURRENCIES).map((c) => {
                  const isSelected = c.code === currency
                  return (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => {
                        setCurrency(c.code)
                        setShowCurrencyDropdown(false)
                      }}
                      className={`flex w-full items-center justify-between rounded-xl px-2.5 py-2 text-xs font-semibold transition ${
                        isSelected
                          ? 'bg-rose/10 text-rose font-bold'
                          : 'text-ink/80 hover:bg-ink/5 hover:text-ink'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.label}</span>
                      </span>
                      {isSelected && <Check size={13} className="text-rose" />}
                    </button>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
