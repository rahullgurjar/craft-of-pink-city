import { useState, useEffect, useRef, useCallback } from 'react'
import { CheckCircle2, X, Sparkles, MapPin, ArrowUpRight, PackageCheck, Layers } from 'lucide-react'
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

// Curated bulk & wholesale order profiles with authentic occasions and locations
const BULK_ORDER_PROFILES = [
  {
    name: 'Radhika S.',
    role: 'Wedding Planner',
    city: 'Udaipur',
    state: 'Rajasthan',
    qty: '50 pieces',
    tag: 'Wedding Favors',
    badge: 'Bulk Order Placed'
  },
  {
    name: 'Pooja S.',
    role: 'Boutique Curator',
    city: 'Mumbai',
    state: 'Maharashtra',
    qty: '75 units',
    tag: 'Boutique Wholesale',
    badge: 'Bulk Order Placed'
  },
  {
    name: 'Aditi M.',
    role: 'Corporate Gifting Lead',
    city: 'Bengaluru',
    state: 'Karnataka',
    qty: '100 units',
    tag: 'Corporate Hampers',
    badge: 'Bulk Order Placed'
  },
  {
    name: 'Kunal V.',
    role: 'Event Designer',
    city: 'New Delhi',
    state: 'Delhi NCR',
    qty: '60 pieces',
    tag: 'Mehendi Giveaways',
    badge: 'Bulk Order Placed'
  },
  {
    name: 'Meera D.',
    role: 'Resort Store Buyer',
    city: 'Goa',
    state: 'Goa',
    qty: '80 units',
    tag: 'Resort Gift Shop',
    badge: 'Bulk Order Placed'
  },
  {
    name: 'Siddharth J.',
    role: 'Textile Wholesale Buyer',
    city: 'Ahmedabad',
    state: 'Gujarat',
    qty: '150 units',
    tag: 'Custom Batch Print',
    badge: 'Bulk Order Placed'
  },
  {
    name: 'Sarah T.',
    role: 'Boutique Importer',
    city: 'London',
    state: 'United Kingdom',
    qty: '200 pieces',
    tag: 'Export Shipment',
    badge: 'Bulk Order Placed'
  },
  {
    name: 'Neha & Varun',
    role: 'Bride & Groom',
    city: 'Jaipur',
    state: 'Rajasthan',
    qty: '45 pieces',
    tag: 'Wedding Welcome Bags',
    badge: 'Bulk Order Placed'
  },
  {
    name: 'Divya N.',
    role: 'Handloom Studio',
    city: 'Kolkata',
    state: 'West Bengal',
    qty: '90 units',
    tag: 'Festive Collection Lot',
    badge: 'Bulk Order Placed'
  },
  {
    name: 'Rhea B.',
    role: 'Merchandising Head',
    city: 'Gurugram',
    state: 'Haryana',
    qty: '120 units',
    tag: 'Client Appreciation Kit',
    badge: 'Bulk Order Placed'
  },
  {
    name: 'Ananya R.',
    role: 'Concept Store',
    city: 'Hyderabad',
    state: 'Telangana',
    qty: '40 units',
    tag: 'Boutique Restock',
    badge: 'Bulk Order Placed'
  },
  {
    name: 'Tanya K.',
    role: 'Luxury Gifting',
    city: 'Chandigarh',
    state: 'Punjab',
    qty: '35 pieces',
    tag: 'Custom Monogram Favors',
    badge: 'Bulk Order Placed'
  },
  {
    name: 'Farhan K.',
    role: 'Souvenir Buyer',
    city: 'Dubai',
    state: 'UAE',
    qty: '180 pieces',
    tag: 'International Wholesale',
    badge: 'Bulk Order Placed'
  },
  {
    name: 'Kavita M.',
    role: 'Family Host',
    city: 'Chennai',
    state: 'Tamil Nadu',
    qty: '30 units',
    tag: 'Anniversary Return Gifts',
    badge: 'Bulk Order Placed'
  }
]

const TIME_AGO_LIST = [
  'Just now',
  '2 minutes ago',
  '4 minutes ago',
  '6 minutes ago',
  '11 minutes ago',
  '18 minutes ago',
  '25 minutes ago',
  '38 minutes ago',
]

export default function SalesPopup() {
  const [currentSale, setCurrentSale] = useState(() => {
    if (!products || products.length === 0) return null
    const buyer = BULK_ORDER_PROFILES[0]
    const product = products[0]
    return {
      buyerName: buyer.name,
      role: buyer.role,
      city: buyer.city,
      state: buyer.state,
      quantity: buyer.qty,
      tag: buyer.tag,
      badge: buyer.badge,
      timeAgo: 'Just now',
      product,
    }
  })

  const [isVisible, setIsVisible] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)
  
  const timerRef = useRef(null)
  const hideTimerRef = useRef(null)

  // Generate a random bulk sale record pairing buyer with a product
  const generateSaleRecord = useCallback(() => {
    if (!products || products.length === 0) return null

    const buyer = BULK_ORDER_PROFILES[Math.floor(Math.random() * BULK_ORDER_PROFILES.length)]
    const product = products[Math.floor(Math.random() * products.length)]
    const timeAgo = TIME_AGO_LIST[Math.floor(Math.random() * TIME_AGO_LIST.length)]

    return {
      buyerName: buyer.name,
      role: buyer.role,
      city: buyer.city,
      state: buyer.state,
      quantity: buyer.qty,
      tag: buyer.tag,
      badge: buyer.badge,
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

  const { buyerName, role, city, quantity, tag, badge, timeAgo, product } = currentSale
  const productImage = resolveProductImage(product.image)

  return (
    <aside
      aria-label="Recent bulk order placed notification"
      aria-live="polite"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`fixed bottom-4 left-4 z-[70] max-w-[340px] sm:max-w-[390px] w-[calc(100vw-2rem)] sm:w-auto transition-all duration-500 ease-out transform ${
        isVisible
          ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
          : 'translate-y-8 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      <div
        onClick={handleOpenProduct}
        className="group relative cursor-pointer overflow-hidden rounded-2xl border border-ink/15 bg-white/95 backdrop-blur-md p-3.5 shadow-2xl shadow-ink/20 transition-all duration-300 hover:border-rose/50 hover:shadow-rose/20 hover:-translate-y-0.5"
      >
        {/* Top Gradient Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-rose via-saffron to-terracotta" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink/5 text-ink/40 transition-colors hover:bg-rose/10 hover:text-rose"
          aria-label="Dismiss order notification"
          title="Dismiss notification"
        >
          <X size={13} />
        </button>

        {/* Header Ribbon: Bulk Order Placed Badge */}
        <div className="flex items-center gap-1.5 mb-2 pr-6">
          <span className="inline-flex items-center gap-1 rounded-full bg-rose/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose border border-rose/20">
            <PackageCheck size={11} className="text-rose" />
            {badge}
          </span>
          <span className="inline-flex items-center rounded-full bg-saffron/10 px-2 py-0.5 text-[9px] font-semibold text-terracotta truncate">
            {tag}
          </span>
        </div>

        <div className="flex items-center gap-3.5 pr-2">
          {/* Product Thumbnail with Live Pulse */}
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-ink/10 bg-[#faf6ef]">
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              loading="lazy"
              decoding="async"
            />
            {/* Live Indicator Dot */}
            <span className="absolute bottom-1 right-1 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 border border-white" />
            </span>
          </div>

          {/* Bulk Order Details */}
          <div className="min-w-0 flex-1">
            {/* Buyer & Location */}
            <div className="flex items-center gap-1 text-[11px] text-ink/70 truncate">
              <span className="font-bold text-ink truncate">{buyerName}</span>
              <span className="text-ink/40">•</span>
              <span className="text-terracotta font-medium flex items-center gap-0.5 shrink-0">
                <MapPin size={10} className="text-rose shrink-0" />
                {city}
              </span>
            </div>

            {/* Order Placed Statement */}
            <p className="mt-0.5 text-xs text-ink/90 font-medium line-clamp-1">
              Order Placed: <strong className="text-rose font-bold">{quantity}</strong>
            </p>

            {/* Product Name */}
            <h4 className="text-xs font-bold text-ink truncate group-hover:text-rose transition-colors">
              {product.name}
            </h4>

            {/* Footer / Meta: Time ago + Verified Bulk Badge */}
            <div className="mt-1.5 flex items-center justify-between gap-2 text-[10px] text-ink/50">
              <div className="flex items-center gap-1">
                <span className="text-ink/60">{timeAgo}</span>
                <span>•</span>
                <span className="font-bold text-terracotta">Wholesale Tier</span>
              </div>

              <div className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 size={10} className="text-emerald-600 shrink-0" />
                <span>Verified Order</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover / Click Prompt for Wholesale Quote */}
        <div className="mt-2.5 pt-2 border-t border-ink/5 flex items-center justify-between text-[10px] text-rose font-semibold">
          <span className="flex items-center gap-1 text-ink/60 font-normal truncate">
            <Sparkles size={11} className="text-saffron shrink-0" />
            Tap to View Product & Bulk Quotes
          </span>
          <span className="inline-flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform shrink-0">
            Wholesale Quote <ArrowUpRight size={11} />
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
