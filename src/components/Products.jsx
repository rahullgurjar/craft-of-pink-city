import { useMemo, useState } from 'react'
import { ArrowUpRight, Package, Check, Sparkles } from 'lucide-react'
import { products, whatsapp } from '../data/products'

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
  const visibleProducts = useMemo(
    () => (activeCategory === 'All' ? products : products.filter((product) => product.category === activeCategory)),
    [activeCategory]
  )

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
            Quilted, hand block-printed accessories created by skilled artisans in Jaipur. Filter by collection to browse our {products.length} handcrafted styles, then message us directly on WhatsApp to order.
          </p>
        </div>

        {/* Bulk Order Banner Link */}
        <div className="shrink-0">
          <a
            href="#bulk-orders"
            className="group inline-flex items-center gap-2.5 rounded-2xl border border-rose/30 bg-rose/5 px-5 py-3.5 text-xs font-bold uppercase tracking-wider text-rose transition-all hover:bg-rose hover:text-white"
          >
            <Package size={16} />
            <span>Need Bulk / Wedding Favors?</span>
            <span className="font-semibold lowercase underline group-hover:no-underline">(Get Wholesale Quote)</span>
          </a>
        </div>
      </div>

      <div className="mt-9 flex flex-wrap gap-2" aria-label="Filter products by collection">
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

      <div className="mt-10 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product, index) => {
          const message = encodeURIComponent(
            `Hello Craft of Pink City, I would like to order the ${product.name} (${product.price}). Is it available?`
          )
          const bulkMessage = encodeURIComponent(
            `Hello Craft of Pink City, I am interested in placing a Bulk / Wholesale Order for "${product.name}". Please share bulk tier pricing.`
          )

          return (
            <article className="product-card group flex flex-col justify-between" key={product.id || product.name}>
              <div>
                <div className="product-photo-wrap rounded-2xl relative overflow-hidden bg-ivory/50">
                  <img
                    className="product-photo"
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
                </div>

                <div className="mt-4 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl leading-snug text-ink">{product.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink/70">{product.description}</p>
                  </div>
                  <span className="shrink-0 font-serif text-xl font-semibold text-rose">{product.price}</span>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-3">
                <a
                  className="product-enquiry mt-0 text-rose font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1.5 hover:underline"
                  href={`${whatsapp}?text=${message}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Enquire about ${product.name} on WhatsApp`}
                >
                  Order on WhatsApp <ArrowUpRight size={15} />
                </a>
                <a
                  className="text-[11px] font-semibold text-ink/60 hover:text-rose transition-colors"
                  href={`${whatsapp}?text=${bulkMessage}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Wholesale MOQ
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}

