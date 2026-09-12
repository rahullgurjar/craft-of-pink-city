import { useState, useEffect } from 'react'
import {
  X,
  ArrowUpRight,
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
  Layers,
  Heart,
  ShoppingBag
} from 'lucide-react'
import { whatsapp, whatsappNumber } from '../data/products'
import WhatsAppIcon from './WhatsAppIcon'
import { useCart } from '../context/CartContext'

export default function ProductModal({
  product,
  onClose,
  onSelectProduct,
  allProducts = [],
  resolveProductImage,
}) {
  const [quantity, setQuantity] = useState(1)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('details') // 'details' | 'specs' | 'craft'
  const { addToCart } = useCart()

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

  // Reset quantity and tab whenever active product changes
  useEffect(() => {
    setQuantity(1)
    setActiveTab('details')
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

  // Related products from same category (excluding current)
  const relatedProducts = allProducts
    .filter(
      (p) =>
        p.category === product.category &&
        ((p.id && p.id !== product.id) || p.name !== product.name)
    )
    .slice(0, 4)

  // Parse numeric price for calculation
  const numericPriceMatch = product.price ? product.price.replace(/[^0-9]/g, '') : ''
  const unitPrice = numericPriceMatch ? parseInt(numericPriceMatch, 10) : 0
  const totalPrice = unitPrice ? (unitPrice * quantity).toLocaleString('en-IN') : null

  // Direct product deep link
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://craftofpinkcity.shop'
  const productLink = `${baseUrl}/?product=${product.id || encodeURIComponent(product.name)}`

  // WhatsApp order link WITH direct product URL
  const orderMessage = encodeURIComponent(
    `Hello Craft of Pink City, I would like to order:\n🛍️ *${product.name}* (Qty: ${quantity} × ${product.price}${
      quantity > 1 ? ` • Total: ₹${totalPrice}` : ''
    })\n🔗 Product Link: ${productLink}\n\nPlease confirm availability and payment details!`
  )
  const whatsappOrderUrl = `${whatsapp}?text=${orderMessage}`

  // Bulk inquiry message WITH direct product URL
  const bulkMessage = encodeURIComponent(
    `Hello Craft of Pink City, I would like to request a Wholesale / Bulk Order quote for "${product.name}" (25+ MOQ).\n🔗 Product Link: ${productLink}\n\nPlease share bulk tier pricing and timeline.`
  )
  const whatsappBulkUrl = `${whatsapp}?text=${bulkMessage}`


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
      dimensions = 'Approx. 28" (L) x 6.5" (Dia) — Fits standard & extra-thick mats'
    } else if (cat.includes('duffle')) {
      dimensions = 'Approx. 18" (L) x 10" (W) x 10" (H) — Roomy weekend & cabin carry'
    } else if (cat.includes('tote')) {
      dimensions = 'Approx. 16" (W) x 14" (H) x 4.5" (Base) — Fits 15" laptop + essentials'
    } else if (cat.includes('vanity')) {
      dimensions = 'Approx. 9.5" (L) x 6.5" (W) x 5.5" (H) with reinforced padded walls'
    } else if (cat.includes('laptop')) {
      dimensions = 'Fits 13" to 15.6" Laptops, MacBooks & iPads with padded foam'
    } else if (cat.includes('pouch')) {
      dimensions = product.price.includes('Set of 3')
        ? '3 Nested Sizes: Large (9x6"), Medium (7.5x5"), Small (6x4")'
        : 'Approx. 8.5" (L) x 5.5" (H) with 2" bottom gusset'
    }

    return [
      { label: 'Craft Origin', value: 'Jaipur, Rajasthan (India)' },
      { label: 'Fabric / Material', value: '100% Pure Jaipuri Quilted Cotton' },
      { label: 'Printing Technique', value: 'Hand Block Printing (Carved Sheesham Wood Blocks)' },
      { label: 'Closure & Hardware', value: 'Smooth Heavy-Duty Zipper + Handcrafted Fabric Tassels' },
      { label: 'Dimensions', value: dimensions },
      { label: 'Wash & Care', value: 'Gentle hand wash in cold water with mild detergent; dry in shade' },
      { label: 'Dispatch Timeline', value: 'Decided and confirmed upon order on WhatsApp based on quantity' },
    ]
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 md:p-8 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/70 backdrop-blur-md transition-opacity duration-300 animate-fadeIn"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Prev / Next floating arrows on large screens */}
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
              className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 text-ink hover:bg-rose hover:text-white transition-colors"
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

            {/* Right: Product Information & Actions */}
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
                    {product.price}
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
                    ● Ready to Dispatch
                  </span>
                </div>

                {/* Description */}
                <p className="mt-4 text-sm sm:text-base leading-relaxed text-ink/80">
                  {product.description}
                </p>
              </div>

              {/* Quantity Selector & Total Price Calculation */}
              <div className="rounded-2xl border border-ink/10 bg-white/70 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-ink/80">
                    Quantity
                  </span>
                  {totalPrice && (
                    <span className="text-xs font-semibold text-ink/70">
                      Total:{' '}
                      <strong className="font-serif text-base text-rose font-bold">
                        ₹{totalPrice}
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
                      className="grid h-10 w-10 place-items-center text-ink hover:text-rose disabled:opacity-30 disabled:hover:text-ink transition-colors"
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
                      className="grid h-10 w-10 place-items-center text-ink hover:text-rose transition-colors"
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
                  onClick={() => {
                    addToCart(product, quantity)
                    onClose()
                  }}
                  className="flex w-full min-h-[50px] items-center justify-center gap-2.5 rounded-xl bg-ink px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-rose hover:shadow-lg hover:-translate-y-0.5"
                >
                  <ShoppingBag size={17} />
                  <span>Add to Shopping Bag ({quantity} {quantity > 1 ? 'items' : 'item'})</span>
                </button>

                <a
                  href={whatsappOrderUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex w-full min-h-[50px] items-center justify-center gap-2.5 rounded-xl bg-[#25D366] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-emerald-600/20 transition-all hover:bg-[#20ba59] hover:shadow-xl hover:-translate-y-0.5"
                >
                  <WhatsAppIcon size={18} />
                  <span>Instant Order on WhatsApp</span>
                  <ArrowUpRight size={16} />
                </a>

                <div className="flex gap-2">
                  <a
                    href={whatsappBulkUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-rose/30 bg-rose/5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-rose hover:bg-rose hover:text-white transition-all"
                  >
                    <Package size={15} />
                    <span>Wholesale Quote (25+ MOQ)</span>
                  </a>

                  <a
                    href="#bulk-orders"
                    onClick={onClose}
                    className="flex items-center justify-center rounded-xl border border-ink/15 bg-white px-3 py-2.5 text-xs font-semibold text-ink/80 hover:border-rose hover:text-rose transition-all"
                    title="Customize for Wholesale / Corporate Hampers"
                  >
                    Bulk Form
                  </a>
                </div>
              </div>

              {/* Quick tabs: Details vs Specs vs Craft */}
              <div className="border-t border-ink/10 pt-4">
                <div className="flex gap-4 border-b border-ink/10 pb-2 text-xs font-bold uppercase tracking-wider">
                  <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`pb-1 transition-colors ${
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
                    className={`pb-1 transition-colors ${
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
                      <strong>Handblock Printing Heritage:</strong> Each fabric is hand-printed using meticulously carved teak/sheesham wood blocks dipped in azo-free dyes, stamped repeatedly across premium cotton.
                    </p>
                    <p>
                      <strong>Quilted Construction:</strong> Stuffed with soft lightweight padding and machine diamond/channel quilted for structured durability and a plush, luxurious tactile feel.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Related Products from same collection */}
          {relatedProducts.length > 0 && (
            <div className="border-t border-ink/10 pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl sm:text-2xl text-ink">
                  More in <i>{product.category}</i>
                </h3>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose">
                  {relatedProducts.length} related styles
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {relatedProducts.map((rel) => (
                  <button
                    type="button"
                    key={rel.id || rel.name}
                    onClick={() => onSelectProduct(rel)}
                    className="group flex flex-col text-left rounded-xl bg-white/70 p-2.5 border border-ink/10 transition-all hover:border-rose/50 hover:shadow-md hover:-translate-y-1"
                  >
                    <div className="aspect-[4/5] w-full overflow-hidden rounded-lg bg-ivory">
                      <img
                        src={resolveProductImage ? resolveProductImage(rel.image) : rel.image}
                        alt={rel.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <h4 className="mt-2 text-xs font-serif font-bold text-ink line-clamp-1 group-hover:text-rose">
                      {rel.name}
                    </h4>
                    <span className="mt-0.5 text-xs font-bold text-rose">{rel.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
