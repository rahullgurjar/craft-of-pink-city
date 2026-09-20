import { useState, useEffect, useRef, useCallback } from 'react'
import { CheckCircle2, X, Sparkles, MapPin, ArrowUpRight } from 'lucide-react'
import { products } from '../data/products'

// Resolve image assets dynamically
const newImages = import.meta.glob('../assets/products-new/*', { eager: true, import: 'default' })
const legacyImages = import.meta.glob('../assets/products/*', { eager: true, import: 'default' })

const resolveProductImage = (image) => {
  return (
    newImages[`../assets/products-new/${image}`] ||
    legacyImages[`../assets/products/${image}`] ||
    image
  )
}

// Curated buyers with authentic Indian & international locations
const BUYER_PROFILES = [
  { name: 'Pooja S.', city: 'Mumbai', state: 'Maharashtra', qty: '2 units', action: 'purchased' },
  { name: 'Ananya R.', city: 'Bengaluru', state: 'Karnataka', qty: '1 unit', action: 'ordered' },
  { name: 'Sneha K.', city: 'Jaipur', state: 'Rajasthan', qty: '1x Set of 3', action: 'purchased' },
  { name: 'Rohit M.', city: 'New Delhi', state: 'Delhi NCR', qty: '3 units (Gift Set)', action: 'purchased' },
  { name: 'Meera D.', city: 'Hyderabad', state: 'Telangana', qty: '2 units', action: 'ordered' },
  { name: 'Vikram J.', city: 'Pune', state: 'Maharashtra', qty: '1 unit', action: 'purchased' },
  { name: 'Divya N.', city: 'Kolkata', state: 'West Bengal', qty: '2 units', action: 'ordered' },
  { name: 'Tanvi G.', city: 'Chandigarh', state: 'Punjab', qty: '1 unit', action: 'purchased' },
  { name: 'Aarav P.', city: 'Ahmedabad', state: 'Gujarat', qty: '4 units (Bulk Order)', action: 'ordered' },
  { name: 'Rhea B.', city: 'Gurugram', state: 'Haryana', qty: '2 units', action: 'purchased' },
  { name: 'Sarah T.', city: 'London', state: 'United Kingdom', qty: '3 units', action: 'ordered' },
  { name: 'Kavita M.', city: 'Chennai', state: 'Tamil Nadu', qty: '1 unit', action: 'purchased' },
  { name: 'Priya V.', city: 'Kochi', state: 'Kerala', qty: '2 units', action: 'purchased' },
  { name: 'Nisha B.', city: 'Lucknow', state: 'Uttar Pradesh', qty: '1x Set of 3', action: 'ordered' },
]

const TIME_AGO_LIST = [
  'Just now',
  '2 minutes ago',
  '4 minutes ago',
  '7 minutes ago',
  '12 minutes ago',
  '18 minutes ago',
  '25 minutes ago',
  '34 minutes ago',
]

export default function SalesPopup() {
  const [currentSale, setCurrentSale] = useState(() => {
    if (!products || products.length === 0) return null
    const buyer = BUYER_PROFILES[0]
    const product = products[0]
    return {
      buyerName: buyer.name,
      city: buyer.city,
      state: buyer.state,
      quantity: buyer.qty,
      action: buyer.action,
      timeAgo: 'Just now',
      product,
    }
  })
  const [isVisible, setIsVisible] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  
  const timerRef = useRef(null)
  const hideTimerRef = useRef(null)

  // Generate a random sale record pairing a buyer with a real product from catalog
  const generateSaleRecord = useCallback(() => {
    if (!products || products.length === 0) return null

    // Pick random buyer, product, time
    const buyer = BUYER_PROFILES[Math.floor(Math.random() * BUYER_PROFILES.length)]
    const product = products[Math.floor(Math.random() * products.length)]
    const timeAgo = TIME_AGO_LIST[Math.floor(Math.random() * TIME_AGO_LIST.length)]

    // Determine quantity text tailored to item category if set
    let quantityText = buyer.qty
    if (product.price && product.price.includes('Set of 3') && !quantityText.includes('Set')) {
      quantityText = '1x Set of 3'
    }

    return {
      buyerName: buyer.name,
      city: buyer.city,
      state: buyer.state,
      quantity: quantityText,
      action: buyer.action,
      timeAgo,
      product,
    }
  }, [])

  // Show a notification
  const showNextSale = useCallback(() => {
    if (isDismissed) return

    const sale = generateSaleRecord()
    if (!sale) return

    setCurrentSale(sale)
    setIsVisible(true)

    // Schedule auto-hide after 6.5 seconds (unless hovered)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false)
      scheduleNextSale()
    }, 6500)
  }, [generateSaleRecord, isDismissed])

  // Schedule next appearance
  const scheduleNextSale = useCallback(() => {
    if (isDismissed) return
    if (timerRef.current) clearTimeout(timerRef.current)

    // Interval between 5 to 8 seconds
    const delay = Math.floor(Math.random() * 3000) + 5000
    timerRef.current = setTimeout(() => {
      showNextSale()
    }, delay)
  }, [showNextSale, isDismissed])

  // Initial startup after 1.2s
  useEffect(() => {
    const initialDelay = setTimeout(() => {
      showNextSale()
    }, 1200)

    return () => {
      clearTimeout(initialDelay)
      if (timerRef.current) clearTimeout(timerRef.current)
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    }
  }, [showNextSale])

  // Handle Pause on Hover
  const handleMouseEnter = () => {
    setIsPaused(true)
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current)
    }
  }

  const handleMouseLeave = () => {
    setIsPaused(false)
    if (isVisible && !isDismissed) {
      // Resume hide timer for 4 more seconds
      hideTimerRef.current = setTimeout(() => {
        setIsVisible(false)
        scheduleNextSale()
      }, 4000)
    }
  }

  // Handle dismiss click
  const handleDismiss = (e) => {
    e.stopPropagation()
    setIsVisible(false)
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current)
    if (timerRef.current) clearTimeout(timerRef.current)

    // Snooze for 30 seconds before resuming
    timerRef.current = setTimeout(() => {
      scheduleNextSale()
    }, 30000)
  }

  // Open product details modal
  const handleOpenProduct = () => {
    if (!currentSale?.product) return
    
    // Dispatch custom event to trigger ProductModal in Products.jsx
    window.dispatchEvent(
      new CustomEvent('open-product-modal', {
        detail: currentSale.product,
      })
    )
  }

  if (!currentSale || !currentSale.product) return null

  const { buyerName, city, quantity, timeAgo, product } = currentSale
  const productImage = resolveProductImage(product.image)

  return (
    <aside
      aria-label="Recent customer purchase notification"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed bottom-4 left-4 z-[70] max-w-[340px] sm:max-w-[380px] w-[calc(100vw-2rem)] sm:w-auto transition-all duration-500 ease-out transform ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
          : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div
        onClick={handleOpenProduct}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-ink/15 bg-white/95 backdrop-blur-md p-3.5 shadow-2xl shadow-ink/20 transition-all duration-300 hover:border-rose/50 hover:shadow-rose/20 hover:-translate-y-0.5"
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose via-saffron to-terracotta" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink/5 text-ink/40 transition-colors hover:bg-rose/10 hover:text-rose"
          aria-label="Dismiss sales notification"
          title="Dismiss notification"
        >
          <X size={13} />
        </button>

        <div className="flex items-center gap-3.5 pr-4">
          {/* Product Thumbnail with Badge */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-[#faf6ef]">
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
            />
            {/* Live Indicator Dot */}
            <span className="absolute bottom-1 right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
            </span>
          </div>

          {/* Sale Info Details */}
          <div className="min-w-0 flex-1">
            {/* Buyer & Location header */}
            <div className="flex items-center gap-1.5 text-[11px] text-ink/70">
              <span className="font-bold text-ink">{buyerName}</span>
              <span>from</span>
              <span className="font-semibold text-terracotta flex items-center gap-0.5 truncate">
                <MapPin size={10} className="shrink-0 text-rose" />
                {city}
              </span>
            </div>

            {/* Quantity and Action */}
            <p className="mt-0.5 text-xs text-ink/90 font-medium line-clamp-1">
              purchased <strong className="text-rose font-bold">{quantity}</strong> of
            </p>

            {/* Product Name */}
            <h4 className="text-xs font-bold text-ink truncate group-hover:text-rose transition-colors">
              {product.name}
            </h4>

            {/* Footer / Meta: Time ago + Verified Buyer */}
            <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-ink/50">
              <div className="flex items-center gap-1">
                <span className="text-ink/60">{timeAgo}</span>
                <span>•</span>
                <span className="font-bold text-ink/80">{product.price}</span>
              </div>

              <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={10} className="text-emerald-600 shrink-0" />
                <span>Verified</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover / Click Prompt */}
        <div className="mt-2.5 pt-2 border-t border-ink/5 flex items-center justify-between text-[10px] text-rose font-semibold">
          <span className="flex items-center gap-1 text-ink/60 font-normal">
            <Sparkles size={11} className="text-saffron" />
            Tap to view product
          </span>
          <span className="inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
            Quick View <ArrowUpRight size={11} />
          </span>
        </div>

        {/* Subtle Progress Bar */}
        {isVisible && !isPaused && (
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-ink/5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose to-saffron animate-sales-progress"
            />
          </div>
        )}
      </div>
    </aside>
  )
}
