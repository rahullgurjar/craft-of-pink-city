import { useState, useEffect } from 'react'
import {
  X,
  Package,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  Share2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  ShoppingBag,
  Send,
  Loader2,
  ArrowRight,
  ArrowLeft,
  AlertCircle
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { submitToGoogleSheet } from '../config/googleSheet'
import { validateName, validatePhone, validateEmail, validateAddress } from '../utils/validation'

export default function ProductModal({
  product,
  onClose,
  onSelectProduct,
  allProducts = [],
  resolveProductImage,
  onNavigateThankYou,
}) {
  const [quantity, setQuantity] = useState(1)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('details') // 'details' | 'specs' | 'craft'
  const [isOrdering, setIsOrdering] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  })

  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()

  // Keyboard navigation & scroll lock
  useEffect(() => {
    if (!product) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowRight') {
        handleNextProduct()
      } else if (e.key === 'ArrowLeft') {
        handlePrevProduct()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [product, allProducts])

  // Reset quantity, tab, and errors whenever active product changes
  useEffect(() => {
    setQuantity(1)
    setActiveTab('details')
    setIsOrdering(false)
    setErrors({})
  }, [product?.id, product?.name])

  if (!product) return null

  // Find index for next/previous navigation
  const currentIndex = allProducts.findIndex(
    (p) => (p.id && p.id === product.id) || p.name === product.name
  )
  const prevProduct =
    currentIndex > 0 ? allProducts[currentIndex - 1] : allProducts[allProducts.length - 1]
  const nextProduct =
    currentIndex < allProducts.length - 1 ? allProducts[currentIndex + 1] : allProducts[0]

  const handlePrevProduct = () => {
    if (prevProduct && onSelectProduct) {
      onSelectProduct(prevProduct)
    }
  }

  const handleNextProduct = () => {
    if (nextProduct && onSelectProduct) {
      onSelectProduct(nextProduct)
    }
  }

  // Parse numeric price for calculation
  const numericPriceMatch = product.price ? String(product.price).replace(/[^0-9]/g, '') : ''
  const unitPrice = numericPriceMatch ? parseInt(numericPriceMatch, 10) : 0
  const totalPriceFormatted = formatPrice(unitPrice * quantity)

  const handleShare = async () => {
    try {
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2500)
      }
    } catch {
      // fallback
    }
  }

  // Category specific dimensions / specifications
  const getProductSpecs = () => {
    const cat = (product.category || '').toLowerCase()
    let dimensions = 'Standard Handcrafted Size'
    if (cat.includes('yoga')) {
      dimensions = '28" Length × 6.5" Diameter (Fits all mats)'
    } else if (cat.includes('duffle')) {
      dimensions = '18" Length × 10" Diameter Barrel Duffel'
    } else if (cat.includes('tote')) {
      dimensions = '16" Width × 14" Height × 4" Gusset'
    } else if (cat.includes('laptop')) {
      dimensions = '14.5" × 10.5" (Fits 13" & 14" Laptops)'
    } else if (cat.includes('vanity') || cat.includes('box')) {
      dimensions = '9" Length × 6" Width × 5" Height'
    } else if (cat.includes('pouch') || cat.includes('organizer')) {
      dimensions = '8" × 5" Compact Multi-Pocket'
    }

    return [
      { label: 'Category', value: product.category || 'Quilted Accessory' },
      { label: 'Dimensions', value: dimensions },
      { label: 'Material', value: '100% Pure Organic Cambric Cotton' },
      { label: 'Filling', value: 'Lightweight Natural Cotton Quilting Sheet' },
      { label: 'Printing Technique', value: 'Authentic Jaipur Hand Block Printing' },
      { label: 'Closure', value: 'Heavy Duty Smooth Metal Zipper with Tassel Pull' },
      { label: 'Wash Care', value: 'Gentle hand wash in cold water or dry clean' },
      { label: 'Origin', value: 'Handcrafted with pride in Jaipur, Rajasthan' },
    ]
  }

  const handleBlur = (field) => {
    let result
    if (field === 'name') result = validateName(customerData.name)
    if (field === 'phone') result = validatePhone(customerData.phone)
    if (field === 'email') result = validateEmail(customerData.email)
    if (field === 'address') result = validateAddress(customerData.address)

    if (result) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.isValid ? null : result.error,
      }))
    }
  }

  const handleDirectOrderSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    // Strict Input Verification
    const nameVal = validateName(customerData.name)
    const phoneVal = validatePhone(customerData.phone)
    const emailVal = validateEmail(customerData.email)
    const addressVal = validateAddress(customerData.address)

    const newErrors = {}
    if (!nameVal.isValid) newErrors.name = nameVal.error
    if (!phoneVal.isValid) newErrors.phone = phoneVal.error
    if (!emailVal.isValid) newErrors.email = emailVal.error
    if (!addressVal.isValid) newErrors.address = addressVal.error

    setErrors(newErrors)

    // Halt submission if any field fails authenticity/format verification
    if (Object.keys(newErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    const randomId = Math.floor(10000 + Math.random() * 90000)
    const refId = `CPC-${randomId}`

    const orderPayload = {
      refId,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name: customerData.name.trim(),
      phone: customerData.phone.trim(),
      email: customerData.email.trim(),
      address: customerData.address.trim(),
      notes: customerData.notes.trim(),
      items: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          unitPrice,
          quantity,
        },
      ],
      selectedProducts: [`${product.name} (x${quantity})`],
      quantity: `${quantity} pc(s)`,
      totalAmount: totalPriceFormatted,
      timeline: 'Immediate Dispatch',
      source: 'Website Product Direct Order',
    }

    // 1. Pixel Tracking
    try {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          content_name: product.name,
          value: unitPrice * quantity,
          currency: 'INR',
        })
      }
    } catch (pixelErr) {
      console.debug('Pixel error:', pixelErr)
    }

    // 2. Submit to Google Sheet
    try {
      await submitToGoogleSheet(orderPayload)
    } catch (err) {
      console.error('Google Sheet submission error:', err)
    }

    // 3. Cache for Thank You page
    try {
      sessionStorage.setItem('cpc_last_inquiry', JSON.stringify(orderPayload))
    } catch (err) {
      console.warn('Storage error:', err)
    }

    setIsSubmitting(false)
    onClose()

    // 4. Redirect to Thank You page
    if (onNavigateThankYou) {
      onNavigateThankYou(orderPayload)
    } else {
      window.location.hash = 'thank-you'
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/75 p-4 sm:p-6 backdrop-blur-md animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      onClick={onClose}
    >
      {/* Desktop Next/Previous Navigation */}
      {allProducts.length > 1 && (
        <>
          <button
            type="button"
            onClick={handlePrevProduct}
            className="fixed left-4 top-1/2 -translate-y-1/2 z-[110] hidden xl:flex h-12 w-12 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-xl backdrop-blur-md transition-transform hover:scale-110 hover:bg-rose hover:text-white"
            aria-label="Previous product"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            type="button"
            onClick={handleNextProduct}
            className="fixed right-4 top-1/2 -translate-y-1/2 z-[110] hidden xl:flex h-12 w-12 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-xl backdrop-blur-md transition-transform hover:scale-110 hover:bg-rose hover:text-white"
            aria-label="Next product"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Modal Card Container */}
      <div
        className="relative z-[105] w-full max-w-4xl max-h-[92vh] flex flex-col bg-ivory rounded-3xl shadow-2xl border border-ink/10 overflow-hidden animate-slideUp my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between border-b border-ink/10 bg-ivory/90 px-6 py-3.5 backdrop-blur-sm shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-rose">
            <Sparkles size={14} />
            <span>Craft of Pink City • Jaipur Collection</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink/15 px-3 py-1 text-xs font-semibold text-ink/80 hover:border-rose hover:text-rose transition-colors"
              title="Share or Copy Link"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-emerald-600" />
                  <span className="text-emerald-700 font-bold">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={13} />
                  <span className="hidden sm:inline">Share</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 text-ink hover:bg-rose hover:text-white transition-colors cursor-pointer"
              aria-label="Close product details"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Scrollable Modal Body */}
        <div className="overflow-y-auto overscroll-contain p-6 sm:p-8 space-y-8">
          <div className="grid gap-8 md:grid-cols-2 md:gap-10 items-start">
            {/* Left: Product Image & Badges */}
            <div className="space-y-4">
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-ivory border border-ink/10 shadow-sm group">
                <img
                  src={resolveProductImage ? resolveProductImage(product.image) : product.image}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                  <span className="rounded-lg bg-ivory/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-ink shadow-sm">
                    {product.category}
                  </span>
                  {product.badge && (
                    <span className="rounded-full bg-rose px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      {product.badge}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 rounded-full bg-ink/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-saffron flex items-center gap-1.5 shadow">
                  <span>✤ 100% Handblock</span>
                </div>
              </div>

              {/* Trust Badges below image */}
              <div className="grid grid-cols-3 gap-2 rounded-2xl border border-ink/10 bg-white/60 p-3 text-center text-xs">
                <div className="flex flex-col items-center gap-1 p-1">
                  <Sparkles size={16} className="text-rose" />
                  <span className="font-semibold text-[11px] text-ink">Handmade</span>
                  <span className="text-[9px] text-ink/60">Jaipur Artisans</span>
                </div>
                <div className="flex flex-col items-center gap-1 border-x border-ink/10 p-1">
                  <Truck size={16} className="text-rose" />
                  <span className="font-semibold text-[11px] text-ink">Express Ship</span>
                  <span className="text-[9px] text-ink/60">All India & Global</span>
                </div>
                <div className="flex flex-col items-center gap-1 p-1">
                  <ShieldCheck size={16} className="text-rose" />
                  <span className="font-semibold text-[11px] text-ink">Pure Cotton</span>
                  <span className="text-[9px] text-ink/60">Quilted Comfort</span>
                </div>
              </div>
            </div>

            {/* Right: Product Information & Interactive Form */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[.2em] text-rose">
                  {product.category}
                </p>
                <h1
                  id="modal-product-title"
                  className="mt-1.5 font-serif text-3xl sm:text-4xl text-ink leading-tight"
                >
                  {product.name}
                </h1>

                {/* Price Section */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="font-serif text-3xl font-bold text-rose">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                    ● Ready to Dispatch
                  </span>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm leading-relaxed text-ink/80">
                  {product.description}
                </p>
              </div>

              {/* Toggle Direct Order Form vs Standard Info */}
              {isOrdering ? (
                /* Direct Order Form */
                <form onSubmit={handleDirectOrderSubmit} noValidate className="space-y-4 rounded-2xl border border-rose/30 bg-rose/5 p-5">
                  <div className="flex items-center justify-between border-b border-rose/20 pb-3">
                    <span className="font-serif font-bold text-base text-ink">
                      Direct Order · {product.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsOrdering(false)}
                      className="text-xs text-rose hover:underline font-semibold cursor-pointer"
                    >
                      ← Back
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={customerData.name}
                      onBlur={() => handleBlur('name')}
                      onChange={(e) => {
                        setCustomerData({ ...customerData, name: e.target.value })
                        if (errors.name) setErrors({ ...errors, name: null })
                      }}
                      className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-ink outline-none transition ${
                        errors.name
                          ? 'border-red-500 ring-2 ring-red-200 bg-red-50/20'
                          : 'border-ink/20 focus:border-rose focus:ring-2 focus:ring-rose/20'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-[11px] font-medium text-red-600 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.name}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-1">
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={customerData.phone}
                        onBlur={() => handleBlur('phone')}
                        onChange={(e) => {
                          setCustomerData({ ...customerData, phone: e.target.value })
                          if (errors.phone) setErrors({ ...errors, phone: null })
                        }}
                        className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-ink outline-none transition ${
                          errors.phone
                            ? 'border-red-500 ring-2 ring-red-200 bg-red-50/20'
                            : 'border-ink/20 focus:border-rose focus:ring-2 focus:ring-rose/20'
                        }`}
                      />
                      {errors.phone && (
                        <p className="mt-1 text-[11px] font-medium text-red-600 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.phone}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. ananya@domain.com"
                        value={customerData.email}
                        onBlur={() => handleBlur('email')}
                        onChange={(e) => {
                          setCustomerData({ ...customerData, email: e.target.value })
                          if (errors.email) setErrors({ ...errors, email: null })
                        }}
                        className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-ink outline-none transition ${
                          errors.email
                            ? 'border-red-500 ring-2 ring-red-200 bg-red-50/20'
                            : 'border-ink/20 focus:border-rose focus:ring-2 focus:ring-rose/20'
                        }`}
                      />
                      {errors.email && (
                        <p className="mt-1 text-[11px] font-medium text-red-600 flex items-center gap-1">
                          <AlertCircle size={12} /> {errors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-1">
                      Delivery Address & Pincode *
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Complete street address, city, state, and pin code"
                      value={customerData.address}
                      onBlur={() => handleBlur('address')}
                      onChange={(e) => {
                        setCustomerData({ ...customerData, address: e.target.value })
                        if (errors.address) setErrors({ ...errors, address: null })
                      }}
                      className={`w-full rounded-xl border bg-white px-3 py-2 text-xs text-ink outline-none transition resize-none ${
                        errors.address
                          ? 'border-red-500 ring-2 ring-red-200 bg-red-50/20'
                          : 'border-ink/20 focus:border-rose focus:ring-2 focus:ring-rose/20'
                      }`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-[11px] font-medium text-red-600 flex items-center gap-1">
                        <AlertCircle size={12} /> {errors.address}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-ink/70">Quantity: <strong>{quantity}</strong></span>
                    <span className="font-serif font-bold text-base text-rose">
                      Total: {totalPriceFormatted}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex min-h-[48px] items-center justify-center gap-2.5 rounded-xl bg-rose px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-rose/25 transition-all hover:bg-[#962325] hover:shadow-2xl disabled:opacity-70 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={18} className="animate-spin text-white" />
                        <span>Verifying & Logging Order...</span>
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        <span>Place Order · {totalPriceFormatted}</span>
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-ink/65 flex items-center justify-center gap-1.5">
                    <ShieldCheck size={13} className="text-emerald-700" />
                    <span>Directly received by Jaipur Artisan Workshop</span>
                  </p>
                </form>
              ) : (
                /* Standard View with Quantity & CTAs */
                <>
                  {/* Quantity Selector & Total Price Calculation */}
                  <div className="rounded-2xl border border-ink/10 bg-white/70 p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-ink/80">
                        Quantity
                      </span>
                      {unitPrice > 0 && (
                        <span className="text-xs font-semibold text-ink/70">
                          Total:{' '}
                          <strong className="font-serif text-base text-rose font-bold">
                            {totalPriceFormatted}
                          </strong>
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center rounded-xl border border-ink/20 bg-ivory">
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                          disabled={quantity <= 1}
                          className="grid h-10 w-10 place-items-center text-ink hover:text-rose disabled:opacity-30 disabled:hover:text-ink transition-colors cursor-pointer"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-bold text-sm text-ink select-none">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQuantity((q) => q + 1)}
                          className="grid h-10 w-10 place-items-center text-ink hover:text-rose transition-colors cursor-pointer"
                          aria-label="Increase quantity"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <span className="text-[11px] text-ink/60">
                        Need 25+ pieces for wholesale or bulk orders? Tiered wholesale rates apply.
                      </span>
                    </div>
                  </div>

                  {/* Primary Call to Actions */}
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setIsOrdering(true)}
                      className="flex w-full min-h-[50px] items-center justify-center gap-2.5 rounded-xl bg-rose px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-rose/20 transition-all hover:bg-[#962325] hover:shadow-xl hover:-translate-y-0.5 cursor-pointer"
                    >
                      <Send size={16} />
                      <span>Order Now / Fill Form ({totalPriceFormatted})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        addToCart(product, quantity)
                        onClose()
                      }}
                      className="flex w-full min-h-[50px] items-center justify-center gap-2.5 rounded-xl bg-ink px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-rose hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
                    >
                      <ShoppingBag size={17} />
                      <span>Add to Shopping Bag ({quantity} {quantity > 1 ? 'items' : 'item'})</span>
                    </button>

                    <div className="flex gap-2">
                      <a
                        href="#bulk-orders"
                        onClick={onClose}
                        className="flex-1 flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-rose/30 bg-rose/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-rose hover:bg-rose hover:text-white transition-all cursor-pointer"
                      >
                        <Package size={15} />
                        <span>Wholesale Quote (25+ MOQ)</span>
                      </a>
                    </div>
                  </div>
                </>
              )}

              {/* Quick tabs: Details vs Specs vs Craft */}
              <div className="border-t border-ink/10 pt-4">
                <div className="flex gap-4 border-b border-ink/10 pb-2 text-xs font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`pb-1 transition-colors cursor-pointer ${
                      activeTab === 'details'
                        ? 'border-b-2 border-rose text-rose font-bold'
                        : 'text-ink/60 hover:text-ink'
                    }`}
                  >
                    Specifications
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('craft')}
                    className={`pb-1 transition-colors cursor-pointer ${
                      activeTab === 'craft'
                        ? 'border-b-2 border-rose text-rose font-bold'
                        : 'text-ink/60 hover:text-ink'
                    }`}
                  >
                    Artisan Craft
                  </button>
                </div>

                {activeTab === 'details' && (
                  <div className="mt-3 space-y-2 text-xs">
                    {getProductSpecs().map((spec) => (
                      <div key={spec.label} className="flex flex-col sm:flex-row sm:justify-between py-1 border-b border-ink/5 gap-1">
                        <span className="font-semibold text-ink/60">{spec.label}</span>
                        <span className="font-medium text-ink sm:text-right">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === 'craft' && (
                  <div className="mt-3 text-xs leading-relaxed text-ink/80 space-y-2">
                    <p>
                      Hand block-printed in the ancient craft hubs of <strong>Bagru & Sanganer</strong>, Jaipur using carved teakwood blocks and natural, skin-safe mineral pigments.
                    </p>
                    <p>
                      Each piece is meticulously layered with pure organic cotton batting, channel-quilted by hand, and stitched with reinforced double-piped hems for lifelong durability.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
