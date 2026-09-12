import { Star, CheckCircle2, Heart, Sparkles, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Pooja Singhal',
    location: 'Delhi NCR',
    role: 'Wedding Favors (85 Pcs)',
    rating: 5,
    title: 'Exquisite Mehendi Return Favors!',
    comment:
      'We ordered 85 Marigold Bloom Pouches for my sister’s Mehendi giveaway hampers. Every guest raved about the fabric richness, diamond quilting, and artisan tassels. Dispatched right on time with custom tags!',
    product: 'Marigold Bloom Pouch Trio',
  },
  {
    name: 'Ananya Roy',
    location: 'Bengaluru',
    role: 'Verified Retail Buyer',
    rating: 5,
    title: 'Stunning Yoga Carrier — Head Turner!',
    comment:
      'The Royal Bengal Tiger quilted yoga bag is so unique and sturdy. Fits my extra-thick mat effortlessly with room for keys and mobile. Authentic Jaipuri handblock art at its finest.',
    product: 'Royal Bengal Tiger Yoga Bag',
  },
  {
    name: 'Radhika Mehta',
    location: 'Mumbai',
    role: 'Boutique Store Owner',
    rating: 5,
    title: 'Exceptional Wholesale Quality & MOQ',
    comment:
      'Stocking Craft of Pink City barrel duffles and vanity cases in our Bandra boutique. Artisan block prints, neat stitching, and reliable wholesale dispatch keep our repeat buyers coming back.',
    product: 'Blush Botanical Duffle & Vanity Cases',
  },
  {
    name: 'Sneha & Tarun K.',
    location: 'Hyderabad',
    role: 'Corporate Festive Gifting',
    rating: 5,
    title: 'Bespoke Corporate Hampers',
    comment:
      'Ordered vanity boxes and Indigo pouches for our annual team appreciation gifts. Smooth WhatsApp coordination, custom branding cards, and pristine packaging. Highly recommended!',
    product: 'Vanilla & Teal Botanical Vanity Case',
  },
]

export default function Reviews() {
  return (
    <section id="reviews" className="bg-[#fffbf6] py-20 lg:py-28 border-y border-ink/10">
      <div className="section-shell py-0">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="eyebrow flex items-center gap-2 text-rose">
              <Sparkles size={13} /> Verified Customer Love
            </p>
            <h2 className="section-title">
              Loved by Brides, Boutiques<br />
              <i>& Everyday Carriers.</i>
            </h2>
          </div>

          {/* Aggregate Rating Pill */}
          <div className="rounded-2xl border border-ink/10 bg-white/90 p-4 shadow-sm backdrop-blur-sm shrink-0">
            <div className="flex items-center gap-3">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} fill="currentColor" />
                ))}
              </div>
              <div className="border-l border-ink/10 pl-3">
                <p className="text-sm font-bold text-ink">4.9 / 5.0 Rating</p>
                <p className="text-[11px] font-medium text-ink/60">500+ Handcrafted Orders</p>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {reviews.map((rev) => (
            <article
              key={rev.name}
              className="group flex flex-col justify-between rounded-3xl border border-ink/10 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-rose/40 hover:shadow-md"
            >
              <div>
                {/* Header Stars & Quote Icon */}
                <div className="flex items-center justify-between">
                  <div className="flex text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" />
                    ))}
                  </div>
                  <Quote size={20} className="text-rose/20 group-hover:text-rose/40 transition-colors" />
                </div>

                <h3 className="mt-4 font-serif text-xl font-bold text-ink leading-snug">
                  {rev.title}
                </h3>
                <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-ink/75">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Verified Tag */}
              <div className="mt-6 border-t border-ink/10 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-ink">{rev.name}</h4>
                    <p className="text-[11px] text-ink/60">{rev.location}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                    <CheckCircle2 size={11} /> Verified
                  </span>
                </div>
                <p className="mt-2 text-[10px] font-semibold text-rose truncate">
                  Ordered: {rev.product}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
