import { Home, Grid, Sparkles, ShoppingBag, LifeBuoy } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function MobileBottomBar({
  onOpenSupport,
  onOpenAiChat,
  onNavigateSection,
  isThankYouPage = false
}) {
  const { totalCount, setIsCartOpen } = useCart()

  const handleNavClick = (sectionId) => {
    if (onNavigateSection) {
      onNavigateSection(sectionId)
    } else {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        window.history.pushState(null, '', '#home')
      } else {
        const el = document.getElementById(sectionId)
        if (el) {
          const navHeight = 70
          const elementPosition = el.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - navHeight
          window.scrollTo({ top: offsetPosition, behavior: 'smooth' })
          window.history.pushState(null, '', `#${sectionId}`)
        }
      }
    }
  }

  const handleOpenAi = () => {
    if (onOpenAiChat) {
      onOpenAiChat()
    } else {
      const aiBtn = document.querySelector('button[aria-label*="Gulabi"]')
      if (aiBtn) aiBtn.click()
    }
  }

  const handleOpenSupportCenter = () => {
    if (onOpenSupport) {
      onOpenSupport()
    } else {
      window.dispatchEvent(new CustomEvent('open-support-help'))
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 sm:hidden border-t border-ink/10 bg-white/95 backdrop-blur-lg shadow-2xl px-2 py-1 transition-all"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 4px)' }}
      role="navigation"
      aria-label="Mobile Bottom Navigation & Support"
    >
      <div className="grid grid-cols-5 items-center justify-between text-center">
        {/* 1. Home */}
        <button
          type="button"
          onClick={() => handleNavClick('home')}
          className="flex flex-col items-center justify-center py-1 text-ink/70 hover:text-rose transition-colors group"
          aria-label="Go to Home"
        >
          <Home size={19} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-semibold mt-0.5">Home</span>
        </button>

        {/* 2. Products / Collection */}
        <button
          type="button"
          onClick={() => handleNavClick('products')}
          className="flex flex-col items-center justify-center py-1 text-ink/70 hover:text-rose transition-colors group"
          aria-label="View Handcrafted Products"
        >
          <Grid size={19} className="group-hover:scale-110 transition-transform" />
          <span className="text-[10px] font-semibold mt-0.5">Collection</span>
        </button>

        {/* 3. Gulabi AI Assistant */}
        <button
          type="button"
          onClick={handleOpenAi}
          className="flex flex-col items-center justify-center py-1 text-ink/70 hover:text-rose transition-colors relative group"
          aria-label="Ask Gulabi AI Concierge"
        >
          <div className="relative">
            <Sparkles size={19} className="text-rose group-hover:scale-110 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1.5 flex h-2 w-2 rounded-full bg-saffron ring-1 ring-white" />
          </div>
          <span className="text-[10px] font-bold text-rose mt-0.5">Ask AI</span>
        </button>

        {/* 4. Bag */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="flex flex-col items-center justify-center py-1 text-ink/70 hover:text-rose transition-colors relative group"
          aria-label={`View Shopping Bag (${totalCount} items)`}
        >
          <div className="relative">
            <ShoppingBag size={19} className="group-hover:scale-110 transition-transform" />
            {totalCount > 0 && (
              <span className="absolute -top-1.5 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose px-1 text-[9px] font-bold text-white shadow-sm ring-1 ring-white animate-scaleUp">
                {totalCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5">Bag</span>
        </button>

        {/* 5. Support & Help */}
        <button
          type="button"
          onClick={handleOpenSupportCenter}
          className="flex flex-col items-center justify-center py-1 text-emerald-700 hover:text-emerald-800 transition-colors relative group"
          aria-label="Open 24/7 Support and Help Desk"
        >
          <div className="relative">
            <LifeBuoy size={19} className="group-hover:rotate-45 transition-transform text-emerald-600" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
          </div>
          <span className="text-[10px] font-bold text-emerald-700 mt-0.5">Support</span>
        </button>
      </div>
    </div>
  )
}
