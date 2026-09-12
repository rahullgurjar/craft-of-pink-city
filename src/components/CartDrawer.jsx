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
    subtotalFormatted,
    getWhatsAppCheckoutUrl,
  } = useCart()

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

  if (!isCartOpen) return null

  return (
    <div
      className="fixed inset-0 z-[120] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag Drawer"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 animate-fadeIn"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      {/* Slide-over Drawer Panel */}
      <div
        className="relative z-[125] flex h-full w-full max-w-md flex-col bg-ivory shadow-2xl border-l border-ink/10 transition-transform duration-300 animate-slideLeft"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-ink/10 bg-white/80 px-6 py-4 backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <div className="grid h-8 w-8 place-items-center rounded-full bg-rose/10 text-rose">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-ink">Your Shopping Bag</h2>
              <p className="text-[11px] font-semibold text-ink/60">
                {totalCount} {totalCount === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 text-ink hover:bg-rose hover:text-white transition-colors"
            aria-label="Close Shopping Bag"
          >
            <X size={18} />
          </button>
        </div>

        {/* Free Shipping / Dispatch Banner */}
        <div className="bg-amber-50/80 border-b border-amber-200/60 px-6 py-2.5 flex items-center justify-between text-[11px] text-amber-900 font-semibold">
          <span className="flex items-center gap-1.5">
            <Truck size={14} className="text-amber-700" />
            Express All-India & Global Delivery
          </span>
          <span className="text-[10px] uppercase tracking-wider font-bold bg-amber-200/60 px-2 py-0.5 rounded-full">
            In Stock
          </span>
        </div>

        {/* Drawer Body (Items List or Empty State) */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-6 space-y-4">
          {items.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ink/5 text-ink/40">
                <ShoppingBag size={28} />
              </div>
              <h3 className="font-serif text-2xl text-ink">Your bag is empty</h3>
              <p className="text-xs text-ink/70 max-w-xs mx-auto leading-relaxed">
                Explore our hand block-printed duffles, tote bags, and vanity pouches to add your favorite artisanal styles.
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
              {items.map((item) => {
                const itemTotal = (item.unitPrice * item.quantity).toLocaleString('en-IN')
                return (
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
                          {item.price}
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
                          ₹{itemTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
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
                <span className="font-semibold text-ink">₹{subtotalFormatted}</span>
              </div>
              <div className="flex items-center justify-between text-xs text-ink/70">
                <span>Direct WhatsApp Confirmation</span>
                <span className="font-semibold text-emerald-700">Free Instant Quote</span>
              </div>
              <div className="flex items-center justify-between text-sm font-bold text-ink pt-2 border-t border-ink/10">
                <span>Estimated Total</span>
                <span className="font-serif text-xl font-bold text-rose">
                  ₹{subtotalFormatted}
                </span>
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
    </div>
  )
}
