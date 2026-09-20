import { useEffect } from 'react'
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowUpRight,
  Sparkles,
  ShieldCheck,
  Truck,
  ExternalLink
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import WhatsAppIcon from './WhatsAppIcon'

const newImages = import.meta.glob('../assets/products-new/*', { eager: true, import: 'default' })
const legacyImages = import.meta.glob('../assets/products/*', { eager: true, import: 'default' })

const resolveProductImage = (image) => {
  return (
    newImages[`../assets/products-new/${image}`] ||
    legacyImages[`../assets/products/${image}`] ||
    image
  )
}

export default function CartDrawer() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalCount,
    subtotal,
    getWhatsAppCheckoutUrl,
  } = useCart()
  const { formatPrice } = useCurrency()

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
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose/10 text-rose font-bold">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-ink">Your Shopping Bag</h3>
              <p className="text-[11px] text-ink/60">{totalCount} items selected</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {items.length > 0 && (
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

        {/* Cart Item List */}
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
                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-ink px-6 py-3 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose transition-colors"
              >
                Browse Products
              </button>
            </div>
          ) : (
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
                        {formatPrice(item.price)}
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

        {/* Drawer Footer (Subtotal & WhatsApp Checkout) */}
        {items.length > 0 && (
          <div className="border-t border-ink/10 bg-white p-6 space-y-4 shrink-0 shadow-lg">
            {/* Subtotal breakdown */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-ink/70">
                <span>Subtotal ({totalCount} items)</span>
                <span className="font-semibold text-ink">{formatPrice(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-ink/70">
                <span>Direct WhatsApp Confirmation</span>
                <span className="font-semibold text-emerald-700">Free Instant Quote</span>
              </div>
            </div>

            {/* Checkout via WhatsApp Button */}
            <a
              href={getWhatsAppCheckoutUrl()}
              target="_blank"
              rel="noreferrer"
              className="flex w-full min-h-[52px] items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-600/20 transition-all duration-300 hover:bg-[#20ba59] hover:shadow-xl hover:-translate-y-0.5"
            >
              <WhatsAppIcon size={20} />
              <span>Order on WhatsApp ({totalCount} Items)</span>
              <ArrowUpRight size={16} />
            </a>

            <div className="flex items-center justify-between text-[11px] text-ink/60">
              <button
                type="button"
                onClick={clearCart}
                className="hover:text-rose underline"
              >
                Clear Bag
              </button>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <ShieldCheck size={13} /> 100% Handcrafted Guarantee
              </span>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
