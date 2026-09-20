import { useState } from 'react'
import { Sparkles, ShoppingBag, Check, ArrowRight, Gift, Percent } from 'lucide-react'
import { products, whatsapp } from '../data/products'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'
import WhatsAppIcon from './WhatsAppIcon'

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

const LUXURY_BUNDLES = [
  {
    id: 'royal-travel-trio',
    title: 'The Royal Jaipur Travel Trio',
    badge: '15% Off Bestseller Set',
    tag: '3-Piece Heritage Set',
    description: 'Our flagship cylindrical travel duffle paired with the 3-tier toiletry trio and candy-striped hair tool organizer.',
    productIds: [
      'heritage-indigo-patchwork-duffle',
      'coral-paisley-toiletry-trio',
      'striped-hair-tool-organizer',
    ],
    originalPrice: 4597,
    bundlePrice: 3899,
    savings: 698,
  },
  {
    id: 'marigold-wellness-set',
    title: 'The Sunshine Marigold Botanical Set',
    badge: 'Gifting Favorite',
    tag: 'Yoga & Vanity Kit',
    description: 'Sunshine-yellow quilted yoga carrier matched with butter-cream botanical vanity box and embroidered pouch trio.',
    productIds: [
      'sunshine-marigold-yoga-bag',
      'vanilla-teal-botanical-vanity-case',
      'marigold-bloom-embroidered-trio',
    ],
    originalPrice: 3847,
    bundlePrice: 3249,
    savings: 598,
  },
  {
    id: 'blush-berry-weekend',
    title: 'The Blush & Berry Weekend Hamper',
    badge: 'Trending Colorway',
    tag: 'Complete Organizer Set',
    description: 'Bubblegum pink quilted duffle coordinated with mint-raspberry cosmetic organizers and chartreuse vanity box.',
    productIds: [
      'blush-botanical-barrel-duffle',
      'mint-berry-botanical-pouch-trio',
      'chartreuse-bloom-vanity-box',
    ],
    originalPrice: 3897,
    bundlePrice: 3299,
    savings: 598,
  },
]

export default function BundleSave() {
  const [selectedBundleId, setSelectedBundleId] = useState(LUXURY_BUNDLES[0].id)
  const [isAdded, setIsAdded] = useState(false)
  const { addToCart, setIsCartOpen } = useCart()
  const { formatPrice } = useCurrency()

  const activeBundle = LUXURY_BUNDLES.find((b) => b.id === selectedBundleId) || LUXURY_BUNDLES[0]

  // Resolve matching product items from products.js
  const bundleProducts = activeBundle.productIds
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean)

  const handleAddBundleToCart = () => {
    bundleProducts.forEach((prod) => {
      addToCart(prod, 1)
    })
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
    setIsCartOpen(true)
  }

  const handleWhatsAppOrder = () => {
    const productNames = bundleProducts.map((p) => p.name).join(', ')
    const text = encodeURIComponent(
      `Hello Craft of Pink City, I would like to order the Curated Bundle:\n🎁 *${activeBundle.title}*\n🛍️ Includes: ${productNames}\n💰 Bundle Offer Price: ₹${activeBundle.bundlePrice} (Save ₹${activeBundle.savings})\n\nPlease share dispatch details!`
    )
    window.open(`${whatsapp}?text=${text}`, '_blank')
  }

  return (
    <section id="bundles" className="relative overflow-hidden bg-white py-20 lg:py-28 border-b border-ink/10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <p className="eyebrow flex items-center justify-center gap-2">
            <Gift size={13} className="text-saffron" />
            Curated Artisan Ensembles
          </p>
          <h2 className="section-title mt-3">
            Complete the Look. <i>Bundle & Save 15%.</i>
          </h2>
          <p className="body-copy mx-auto mt-4 text-sm sm:text-base">
            Coordinate your travel duffle with matching vanity boxes and quilted organizers. Enjoy bundled savings on our most loved handcrafted sets.
          </p>
        </div>

        {/* Bundle Selector Chips */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {LUXURY_BUNDLES.map((bundle) => {
            const isSelected = bundle.id === selectedBundleId
            return (
              <button
                key={bundle.id}
                type="button"
                onClick={() => setSelectedBundleId(bundle.id)}
                className={`rounded-2xl px-5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  isSelected
                    ? 'bg-rose text-white shadow-xl shadow-rose/25 ring-2 ring-rose/50 scale-105'
                    : 'bg-[#faf6ef] text-ink/70 hover:bg-rose/10 hover:text-rose border border-ink/10'
                }`}
              >
                <span>{bundle.title}</span>
              </button>
            )
          })}
        </div>

        {/* Active Bundle Showcase Card */}
        <div className="mt-12 overflow-hidden rounded-3xl border border-ink/15 bg-[#faf6ef]/90 shadow-2xl p-6 sm:p-10 lg:p-12">
          <div className="grid lg:grid-cols-[1.2fr_.8fr] gap-10 items-center">
            {/* Left: 3 Coordinated Product Cards */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <span className="rounded-full bg-rose px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  {activeBundle.badge}
                </span>
                <span className="text-xs font-semibold text-terracotta">
                  {activeBundle.tag}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {bundleProducts.map((prod, idx) => (
                  <div
                    key={prod.id || idx}
                    className="group rounded-2xl bg-white p-3 border border-ink/10 shadow-sm transition hover:shadow-md hover:border-rose/30 flex flex-col justify-between"
                  >
                    <div className="relative aspect-square overflow-hidden rounded-xl bg-[#faf6ef] mb-3">
                      <img
                        src={resolveProductImage(prod.image)}
                        alt={prod.name}
                        className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                          prod.image?.includes('coral-paisley') ? 'object-bottom' : 'object-center'
                        }`}
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="absolute top-2 left-2 rounded-full bg-white/90 backdrop-blur-sm px-2 py-0.5 text-[9px] font-bold text-ink uppercase">
                        Item {idx + 1}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-ink line-clamp-2 leading-tight">
                        {prod.name}
                      </h4>
                      <p className="mt-1 text-xs font-serif font-bold text-rose">
                        {formatPrice(prod.price)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Bundle Price & 1-Click Action */}
            <div className="rounded-3xl bg-white p-6 sm:p-8 border border-ink/10 shadow-xl flex flex-col justify-between">
              <div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-ink">
                  {activeBundle.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-ink/70 leading-relaxed">
                  {activeBundle.description}
                </p>

                {/* Price Breakdown */}
                <div className="mt-6 pt-6 border-t border-ink/10">
                  <div className="flex items-center justify-between text-xs text-ink/60 mb-1">
                    <span>Individual Total:</span>
                    <span className="line-through">{formatPrice(activeBundle.originalPrice)}</span>
                  </div>

                  <div className="flex items-baseline justify-between text-ink">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block">
                        Bundle Deal (15% Savings)
                      </span>
                      <span className="font-serif text-3xl sm:text-4xl font-bold text-rose">
                        {formatPrice(activeBundle.bundlePrice)}
                      </span>
                    </div>

                    <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 text-xs font-bold">
                      Save {formatPrice(activeBundle.savings)}
                    </span>
                  </div>
                </div>

                {/* Feature Checkpoints */}
                <div className="mt-6 space-y-2 text-xs text-ink/80">
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>Free Insured Express Shipping Included</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>Matching Handblock Printed Fabric & Quality</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-600 shrink-0" />
                    <span>Gift-Ready Artisanal Packaging</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 space-y-2.5">
                <button
                  type="button"
                  onClick={handleAddBundleToCart}
                  className="w-full btn-primary rounded-2xl justify-center shadow-lg hover:bg-rose transition-all py-3.5"
                >
                  <ShoppingBag size={16} />
                  <span>{isAdded ? 'Added Entire Set to Bag!' : 'Add Entire 3-Piece Set to Bag'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-[#25D366] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-md transition-all hover:bg-[#20ba59]"
                >
                  <WhatsAppIcon size={18} />
                  <span>Order Bundle on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
