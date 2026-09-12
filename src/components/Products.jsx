import { useMemo, useState, useEffect } from 'react'
import { ArrowUpRight, Package, Eye, Sparkles, Search, X, SlidersHorizontal, ShoppingBag } from 'lucide-react'
import { products, whatsapp } from '../data/products'
import ProductModal from './ProductModal'
import { useCart } from '../context/CartContext'

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

export default function Products() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const { addToCart } = useCart()

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
            Quilted, hand block-printed accessories created by skilled artisans in Jaipur. Click on any product to view details, specifications, and order directly on WhatsApp.
          </p>
        </div>

        {/* Bulk Order Banner Link */}
        <div className="shrink-0">
          <a
            href="#bulk-orders"
            className="group inline-flex items-center gap-2.5 rounded-2xl border border-rose/30 bg-rose/5 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-rose transition-all hover:bg-rose hover:text-white shadow-sm"
          >
            <Package size={16} />
            <span>Need Bulk / Wedding Favors?</span>
            <span className="font-semibold lowercase underline group-hover:no-underline">(Get Wholesale Quote)</span>
          </a>
        </div>
      </div>

      {/* Search & Filter Controls Bar */}
      <div className="mt-10 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Real-time Search Input */}
        <div className="relative w-full max-w-md">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-ink/40">
            <Search size={16} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search duffle, yoga bag, marigold, indigo, pouch..."
            className="w-full rounded-2xl border border-ink/20 bg-white/80 py-3 pl-10 pr-10 text-xs font-medium text-ink placeholder-ink/40 outline-none backdrop-blur-sm transition focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20"
            aria-label="Search products in collection"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-ink/40 hover:text-rose"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* Product Count Indicator */}
        <div className="flex items-center gap-2 text-xs font-semibold text-ink/60">
          <SlidersHorizontal size={14} className="text-rose" />
          <span>
            Showing <strong>{visibleProducts.length}</strong> of {products.length} handcrafted styles
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setActiveCategory('All')
              }}
              className="ml-2 font-bold text-rose underline hover:no-underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="mt-4 flex flex-wrap gap-2" aria-label="Filter products by collection">
        {categories.map((category) => (
          <button
            type="button"
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`filter-chip ${activeCategory === category ? 'filter-chip-active' : ''}`}
            aria-pressed={activeCategory === category}
          >
            {category} {category === 'All' ? `(${products.length})` : `(${products.filter(p => p.category === category).length})`}
          </button>
        ))}
      </div>

      {/* Empty State when no search results */}
      {visibleProducts.length === 0 && (
        <div className="mt-12 rounded-3xl border border-dashed border-ink/20 bg-white/50 p-12 text-center">
          <Package size={36} className="mx-auto text-rose/60 mb-3" />
          <h3 className="font-serif text-2xl text-ink">No handcrafted styles found</h3>
          <p className="mt-2 text-sm text-ink/70 max-w-md mx-auto">
            We couldn't find any products matching "{searchQuery}". Try searching for another keyword like "duffle", "pouch", "tote", or "organizer".
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('')
              setActiveCategory('All')
            }}
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose transition-colors"
          >
            View All {products.length} Products
          </button>
        </div>
      )}

      <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product, index) => {
          const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://craftofpinkcity.shop'
          const productLink = `${baseUrl}/?product=${product.id || encodeURIComponent(product.name)}`
          
          const message = encodeURIComponent(
            `Hello Craft of Pink City, I would like to order:\n🛍️ *${product.name}* (${product.price})\n🔗 Product Link: ${productLink}\n\nIs it available for dispatch?`
          )
          const bulkMessage = encodeURIComponent(
            `Hello Craft of Pink City, I am interested in placing a Bulk / Wholesale Order for "${product.name}".\n🔗 Product Link: ${productLink}\n\nPlease share bulk tier pricing.`
          )

          return (
            <article
              className="product-card group flex flex-col justify-between"
              key={product.id || product.name}
            >
              {/* Clickable Card Body */}
              <div
                className="cursor-pointer"
                onClick={() => setSelectedProduct(product)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setSelectedProduct(product)
                  }
                }}
                tabIndex={0}
                role="button"
                aria-label={`View details for ${product.name}`}
              >
                <div className="product-photo-wrap rounded-2xl relative overflow-hidden bg-ivory/50">
                  <img
                    className="product-photo transition-transform duration-500 group-hover:scale-105"
                    src={resolveProductImage(product.image)}
                    alt={product.name}
                    loading={index < 4 ? 'eager' : 'lazy'}
                    decoding="async"
                  />
                  <span className="product-category rounded-lg">{product.category}</span>
                  {product.badge && (
                    <span className="absolute top-3 right-3 rounded-full bg-rose/90 backdrop-blur-sm px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                      {product.badge}
                    </span>
                  )}

                  {/* Quick View Hover Pill */}
                  <div className="absolute inset-0 bg-ink/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-ivory/95 px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-lg backdrop-blur-sm transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                      <Eye size={14} className="text-rose" /> Quick View
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl leading-snug text-ink group-hover:text-rose transition-colors">
                      {product.name}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <span className="shrink-0 font-serif text-xl font-semibold text-rose">
                    {product.price}
                  </span>
                </div>
              </div>

              {/* Bottom Quick Actions: Add to Bag + Order on WhatsApp + Wholesale */}
              <div className="mt-5 space-y-2.5 border-t border-ink/10 pt-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      addToCart(product, 1)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-ink/5 hover:bg-rose hover:text-white px-3 py-2 text-xs font-bold uppercase tracking-wider text-ink transition-colors"
                  >
                    <ShoppingBag size={14} /> Add to Bag
                  </button>

                  <a
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-3 py-2 text-xs font-bold uppercase tracking-wider text-white transition-colors shadow-sm"
                    href={`${whatsapp}?text=${message}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    aria-label={`Order ${product.name} on WhatsApp`}
                  >
                    WhatsApp <ArrowUpRight size={14} />
                  </a>
                </div>

                <div className="flex items-center justify-between text-[11px] text-ink/60 px-1">
                  <span>100% Jaipuri Cotton</span>
                  <a
                    className="hover:text-rose font-semibold transition-colors"
                    href={`${whatsapp}?text=${bulkMessage}`}
                    target="_blank"
                    rel="noreferrer"
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
        />
      )}
    </section>
  )
}



