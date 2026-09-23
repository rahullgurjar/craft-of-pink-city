import { useMemo, useState, useEffect } from 'react'
import { ArrowUpRight, Package, Eye, Sparkles, Search, X, SlidersHorizontal, ShoppingBag, Send } from 'lucide-react'
import { products } from '../data/products'
import ProductModal from './ProductModal'
import { useCart } from '../context/CartContext'
import { useCurrency } from '../context/CurrencyContext'

const categories = ['All', ...new Set(products.map((product) => product.category))]
const newImages = import.meta.glob('../assets/products-new/*', { eager: true, import: 'default' })
const legacyImages = import.meta.glob('../assets/products/*', { eager: true, import: 'default' })

const resolveProductImage = (image) => {
  return (
    newImages[`../assets/products-new/${image}`] ||
    legacyImages[`../assets/products/${image}`] ||
    image
  )
}

export default function Products({ onNavigateThankYou }) {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { addToCart } = useCart()
  const { formatPrice } = useCurrency()

  // Deep-link check: auto-open modal if ?product=id or #product-id in URL or via custom event
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search)
      const queryId = params.get('product')
      const hashId = window.location.hash.startsWith('#product-')
        ? window.location.hash.replace('#product-', '')
        : null

      const targetId = queryId || hashId
      if (targetId) {
        const found = products.find(
          (p) => p.id === targetId || p.name.toLowerCase() === decodeURIComponent(targetId).toLowerCase()
        )
        if (found) {
          setSelectedProduct(found)
        }
      }
    } catch {
      // ignore
    }

    const handleCustomOpen = (e) => {
      if (e.detail) {
        setSelectedProduct(e.detail)
      }
    }
    window.addEventListener('open-product-modal', handleCustomOpen)
    return () => window.removeEventListener('open-product-modal', handleCustomOpen)
  }, [])

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'All' || product.category === activeCategory
      const query = searchQuery.trim().toLowerCase()
      if (!query) return matchesCategory

      const matchesSearch =
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.description && product.description.toLowerCase().includes(query))

      return matchesCategory && matchesSearch
    })
  }, [activeCategory, searchQuery])

  return (
    <section id="products" className="section-shell">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="max-w-2xl">
          <p className="eyebrow">Shop the collection</p>
          <h2 className="section-title">
            Made to carry<br />
            <i>your everyday.</i>
          </h2>
          <p className="body-copy">
            Quilted, hand block-printed accessories created by skilled artisans in Jaipur. Click on any product to view details, specifications, and place your order directly online.
          </p>
        </div>

        {/* Bulk Order Banner Link */}
        <div className="shrink-0">
          <a
            href="#bulk-orders"
            className="group inline-flex items-center gap-2.5 rounded-2xl border border-rose/30 bg-rose/5 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-rose transition-all hover:bg-rose hover:text-white shadow-sm"
          >
            <Package size={16} />
            <span>Need Wholesale / Bulk Orders?</span>
            <span className="font-semibold lowercase underline group-hover:no-underline">(Get Wholesale Quote)</span>
          </a>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="mt-8 space-y-4">
        {/* Search input */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
          <input
            type="text"
            placeholder="Search bags, prints, duffles, vanity kits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-2xl border border-ink/20 bg-white pl-11 pr-10 py-3 text-xs text-ink placeholder:text-ink/40 outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20 shadow-xs"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-rose"
              aria-label="Clear search"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Categories Chips */}
        <div className="flex flex-wrap gap-2 pt-2">
          {categories.map((category) => {
            const isActive = activeCategory === category
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-wider transition-all duration-300 ${
                  isActive
                    ? 'bg-rose text-white shadow-md shadow-rose/25'
                    : 'bg-white text-ink/75 hover:bg-rose/10 hover:text-rose border border-ink/10'
                }`}
              >
                {category}
              </button>
            )
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product) => {
          return (
            <article
              key={product.id || product.name}
              onClick={() => setSelectedProduct(product)}
              className="group cursor-pointer rounded-3xl border border-ink/10 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose/40 hover:shadow-xl flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-ivory border border-ink/10">
                  <img
                    src={resolveProductImage(product.image)}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 rounded-full bg-rose px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-saffron backdrop-blur-sm">
                    {product.category}
                  </span>
                </div>

                <div className="mt-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl leading-snug text-ink group-hover:text-rose transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <span className="shrink-0 font-serif text-xl font-semibold text-rose">
                    {formatPrice(product.price)}
                  </span>
                </div>
              </div>

              {/* Bottom Quick Actions: Add to Bag + Order Now + Wholesale */}
              <div className="mt-5 space-y-2.5 border-t border-ink/10 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(product, 1)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-ink/5 hover:bg-rose hover:text-white px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-ink transition-colors cursor-pointer"
                  >
                    <ShoppingBag size={14} /> Add to Bag
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedProduct(product)
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-rose hover:bg-[#962325] px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors shadow-sm cursor-pointer"
                  >
                    <Send size={13} /> Order Now
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] text-ink/60 px-1">
                  <span>100% Jaipuri Cotton</span>
                  <a
                    className="hover:text-rose font-semibold transition-colors"
                    href="#bulk-orders"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Wholesale Quote (25+ MOQ) →
                  </a>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onSelectProduct={(prod) => setSelectedProduct(prod)}
          allProducts={products}
          resolveProductImage={resolveProductImage}
          onNavigateThankYou={onNavigateThankYou}
        />
      )}
    </section>
  )
}
