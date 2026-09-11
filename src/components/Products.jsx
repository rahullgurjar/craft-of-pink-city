import { useMemo, useState } from 'react'
import { ArrowUpRight, Sparkles, Package } from 'lucide-react'
import { products, whatsapp } from '../data/products'

const categories = ['All', ...new Set(products.map((product) => product.category))]
const productImages = import.meta.glob('../assets/products-new/*', { eager: true, import: 'default' })

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
            Quilted, block-printed accessories created in Jaipur. Tap a collection to browse, then message us directly to order.
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
            {category}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product, index) => {
          const message = encodeURIComponent(
            `Hello Craft of Pink City, I would like to order the ${product.name} (${product.price}). Is it available?`
          )
          const bulkMessage = encodeURIComponent(
            `Hello Craft of Pink City, I am interested in placing a Bulk / Wholesale Order for "${product.name}". Please share bulk tier pricing.`
          )

          return (
            <article className="product-card group" key={product.name}>
              <div className="product-photo-wrap rounded-2xl">
                <img
                  className="product-photo"
                  src={productImages[`../assets/products-new/${product.image}`]}
                  alt={product.name}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  decoding="async"
                />
                <span className="product-category rounded-lg">{product.category}</span>
              </div>
              <div className="mt-4 flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-3xl leading-none text-ink">{product.name}</h3>
                  <p className="mt-2 text-sm leading-5 text-ink/65">{product.description}</p>
                </div>
                <span className="shrink-0 font-serif text-xl text-rose">{product.price}</span>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-3">
                <a
                  className="product-enquiry mt-0"
                  href={`${whatsapp}?text=${message}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Enquire about ${product.name} on WhatsApp`}
                >
                  Order on WhatsApp <ArrowUpRight size={16} />
                </a>
                <a
                  className="text-[11px] font-semibold text-ink/60 hover:text-rose transition-colors"
                  href={`${whatsapp}?text=${bulkMessage}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Bulk Inquiry
                </a>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
