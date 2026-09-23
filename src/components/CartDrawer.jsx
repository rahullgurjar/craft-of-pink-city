import { useState, useEffect } from 'react'
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Truck,
  Loader2,
  CheckCircle2,
  Mail,
  MapPin,
  Phone
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import { submitToGoogleSheet } from '../config/googleSheet'

const newImages = import.meta.glob('../assets/products-new/*', { eager: true, import: 'default' })
const legacyImages = import.meta.glob('../assets/products/*', { eager: true, import: 'default' })

const resolveProductImage = (image) => {
  return (
    newImages[`../assets/products-new/${image}`] ||
    legacyImages[`../assets/products/${image}`] ||
    image
  )
}

export default function CartDrawer({ onNavigateThankYou }) {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCount,
    subtotal,
  } = useCart()
  const { formatPrice } = useCurrency()

  const [isCheckingOut, setIsCheckingOut] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customerData, setCustomerData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    notes: '',
  })

  // Reset checkout view when drawer closes
  useEffect(() => {
    if (!isCartOpen) {
      setIsCheckingOut(false)
    }
  }, [isCartOpen])

  // Scroll lock & Escape key
  useEffect(() => {
    if (!isCartOpen) return

    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsCartOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isCartOpen, setIsCartOpen])

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault()

    if (
      !customerData.name.trim() ||
      !customerData.phone.trim() ||
      !customerData.email.trim() ||
      !customerData.address.trim() ||
      items.length === 0 ||
      isSubmitting
    ) {
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
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        price: formatPrice(it.price || it.unitPrice),
        unitPrice: it.unitPrice,
        quantity: it.quantity,
      })),
      selectedProducts: items.map((it) => `${it.name} (x${it.quantity})`),
      quantity: `${totalCount} item(s)`,
      totalAmount: formatPrice(subtotal),
      timeline: 'Immediate Dispatch',
      source: 'Website Cart Direct Checkout',
    }

    // 1. Meta Pixel Purchase/Lead Tracking (if available)
    try {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'InitiateCheckout', {
          num_items: totalCount,
          value: subtotal,
          currency: 'INR',
        })
      }
    } catch (pixelErr) {
      console.debug('Pixel checkout tracking ignored:', pixelErr)
    }

    // 2. Submit form data directly to Google Sheet
    try {
      await submitToGoogleSheet(orderPayload)
    } catch (err) {
      console.error('Google Sheet submission failed:', err)
    }

    // 3. Cache payload in sessionStorage for Thank You page
    try {
      sessionStorage.setItem('cpc_last_inquiry', JSON.stringify(orderPayload))
    } catch (storageErr) {
      console.warn('Session storage write error:', storageErr)
    }

    clearCart()
    setIsSubmitting(false)
    setIsCartOpen(false)

    // 4. Redirect to Thank You page
    if (onNavigateThankYou) {
      onNavigateThankYou(orderPayload)
    } else {
      window.location.hash = 'thank-you'
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className={`fixed inset-0 z-50 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Slide-out Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-md flex-col bg-ivory shadow-2xl transition-transform duration-300 ease-out border-l border-ink/10 ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Your Shopping Bag"
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-ink/10 bg-white px-6 py-4">
          <div className="flex items-center gap-2.5">
            {isCheckingOut ? (
              <button
                type="button"
                onClick={() => setIsCheckingOut(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink/5 text-ink hover:bg-rose hover:text-white transition-colors"
                title="Back to Bag"
              >
                <ArrowLeft size={17} />
              </button>
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose/10 text-rose font-bold">
                <ShoppingBag size={18} />
              </div>
            )}
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">
                {isCheckingOut ? 'Delivery & Order Details' : 'Your Shopping Bag'}
              </h3>
              <p className="text-[11px] text-ink/60">
                {isCheckingOut ? `${totalCount} item(s) · Total: ${formatPrice(subtotal)}` : `${totalCount} items selected`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {!isCheckingOut && items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] font-semibold text-rose hover:underline"
              >
                Clear
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsCartOpen(false)}
              className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 text-ink hover:bg-rose hover:text-white transition-colors"
              aria-label="Close cart"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Free Shipping Progress Indicator (Threshold ₹1,999) */}
        {!isCheckingOut && (
          <div className="bg-[#1e121d] px-6 py-2.5 text-white">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-saffron font-bold">
                <Truck size={13} />
                {subtotal >= 1999 ? '🎉 Free Express Shipping Unlocked!' : `Add ${formatPrice(Math.max(0, 1999 - subtotal))} for Free Shipping`}
              </span>
              <span className="text-[10px] text-white/60 font-mono">
                {Math.min(100, Math.round((subtotal / 1999) * 100))}%
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
              <div
                className="h-full bg-gradient-to-r from-rose to-saffron transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, (subtotal / 1999) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-ink/5 text-ink/40">
                <ShoppingBag size={28} />
              </div>
              <h4 className="mt-4 font-serif text-xl font-bold text-ink">Your bag is empty</h4>
              <p className="mt-2 text-xs text-ink/60 max-w-xs mx-auto">
                Explore our Jaipur hand block printed duffle bags, vanity boxes, and pouches.
              </p>
              <button
                type="button"
                onClick={() => setIsCartOpen(false)}
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose transition-colors cursor-pointer"
              >
                Browse Products
              </button>
            </div>
          ) : isCheckingOut ? (
            /* Checkout Form View */
            <form id="drawer-checkout-form" onSubmit={handleCheckoutSubmit} className="space-y-4">
              <div className="rounded-xl bg-rose/5 p-3 border border-rose/15 text-xs text-rose">
                <p className="font-semibold flex items-center gap-1.5">
                  <Sparkles size={14} /> Direct Artisan Dispatch
                </p>
                <p className="text-[11px] text-ink/70 mt-0.5">
                  Enter your delivery details below. Order will be recorded and dispatched directly from Jaipur.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ananya Sharma"
                  value={customerData.name}
                  onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
                  className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-xs text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-1.5">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={customerData.phone}
                    onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-xs text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. ananya@domain.com"
                    value={customerData.email}
                    onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-xs text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-1.5">
                  Delivery Address & Pincode *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="Flat/House, Street, City, State, PIN code"
                  value={customerData.address}
                  onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })}
                  className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2 text-xs text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-1.5">
                  Special Notes / Gift Message (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gift wrap please / urgent delivery"
                  value={customerData.notes}
                  onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
                  className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2 text-xs text-ink outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20"
                />
              </div>

              {/* Order Items Preview in Form */}
              <div className="border-t border-ink/10 pt-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-ink/60 mb-2">Order Items</p>
                <div className="space-y-1.5 max-h-32 overflow-y-auto text-xs bg-white/70 rounded-xl p-3 border border-ink/10">
                  {items.map((it) => (
                    <div key={it.id} className="flex justify-between text-ink/80">
                      <span className="truncate pr-2">
                        {it.name} × {it.quantity}
                      </span>
                      <span className="font-semibold shrink-0">
                        {formatPrice(it.unitPrice * it.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* Bag Items View */
            <div className="divide-y divide-ink/10 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="pt-4 first:pt-0 flex gap-4">
                  {/* Thumbnail */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white border border-ink/10">
                    <img
                      src={resolveProductImage(item.image)}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-base font-bold text-ink leading-tight truncate">
                          {item.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-ink/40 hover:text-rose transition-colors p-1"
                          title="Remove item"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <p className="text-[11px] font-semibold text-rose mt-0.5">
                        {formatPrice(item.price || item.unitPrice)}
                      </p>
                    </div>

                    {/* Quantity Selector & Item Subtotal */}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center rounded-lg border border-ink/20 bg-white">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="grid h-7 w-7 place-items-center text-ink hover:text-rose transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-ink select-none">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="grid h-7 w-7 place-items-center text-ink hover:text-rose transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus size={13} />
                        </button>
                      </div>

                      <span className="font-serif text-sm font-bold text-ink">
                        {formatPrice(item.unitPrice * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="border-t border-ink/10 bg-white p-6 space-y-4 shrink-0 shadow-lg">
            {/* Subtotal breakdown */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-ink/70">
                <span>Subtotal ({totalCount} items)</span>
                <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-ink/70">
                <span>Dispatch Schedule</span>
                <span className="font-semibold text-emerald-700">Express Insured Courier</span>
              </div>
            </div>

            {/* Action Button */}
            {isCheckingOut ? (
              <button
                type="submit"
                form="drawer-checkout-form"
                disabled={isSubmitting}
                className="flex w-full min-h-[52px] items-center justify-center gap-3 rounded-2xl bg-rose px-6 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-rose/25 transition-all duration-300 hover:bg-[#962325] hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin text-white" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    <span>Confirm & Place Order ({formatPrice(subtotal)})</span>
                  </>
                )}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsCheckingOut(true)}
                className="flex w-full min-h-[52px] items-center justify-center gap-3 rounded-2xl bg-rose px-6 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-rose/25 transition-all duration-300 hover:bg-[#962325] hover:shadow-2xl hover:-translate-y-0.5 cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight size={16} />
              </button>
            )}

            <div className="flex items-center justify-between text-[11px] text-ink/60">
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <CheckCircle2 size={13} /> Recorded with Artisan Workshop
              </span>
              <span className="flex items-center gap-1 text-ink/70 font-medium">
                <ShieldCheck size={13} /> 100% Handcrafted Guarantee
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
