import { useState } from 'react'
import { CheckCircle2, MessageCircle, Package, Gift, Building2, Sparkles, Send, PhoneCall, Clock, ShieldCheck } from 'lucide-react'
import { whatsappNumber, whatsapp, email } from '../data/products'

const productCategories = [
  'Patchwork Duffle Bags',
  'Quilted Tote Bags',
  'Ruffled Tote Bags',
  'Yoga Mat Bags',
  'Quilted Laptop Sleeves',
  'Hair Tool & Travel Organizers',
  'Vanity Boxes & Pouches',
  'Mini Tote Bags',
  'Indigo Flat Pouches',
  'Custom Gifting Hampers',
  'Assorted Mix Collection',
]

const quantityRanges = [
  '25 - 50 pcs (Starter Wholesale)',
  '51 - 100 pcs (Mid-Volume Wholesale)',
  '101 - 250 pcs (Festive / Corporate)',
  '251 - 500 pcs (Boutique Orders)',
  '500+ pcs (Large Scale Production)',
]

const timelineOptions = [
  'Immediate (Ready Stock)',
  'Within 2 - 3 Weeks',
  'Within 1 Month',
  'More than 1 Month (Advance Booking)',
]

const bulkPerks = [
  {
    icon: Gift,
    title: 'Bespoke Artisan Gifting',
    desc: 'Premium gift hampers, vanity kits, and personalized keepsake bags handcrafted with custom tags.',
  },
  {
    icon: Building2,
    title: 'Corporate & Festive Hampers',
    desc: 'Premium sustainable gifts for clients and employees with customized thank-you cards and bespoke packaging.',
  },
  {
    icon: Package,
    title: 'Boutiques & Retail Resellers',
    desc: 'Low MOQ starting at 25 pieces with competitive wholesale slab pricing and consistent artisan quality.',
  },
  {
    icon: Sparkles,
    title: 'Custom Prints & Tags',
    desc: 'Choose from authentic Bagru, Dabu & Sanganeri block prints with custom logo tags and personalized finishes.',
  },
]

export default function BulkOrder() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    phone: '',
    email: '',
    selectedProducts: ['Quilted Tote Bags', 'Vanity Boxes & Pouches'],
    quantity: '51 - 100 pcs (Mid-Volume Wholesale)',
    timeline: 'Within 2 - 3 Weeks',
    notes: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const handleProductToggle = (item) => {
    setFormData((prev) => {
      const exists = prev.selectedProducts.includes(item)
      if (exists) {
        return {
          ...prev,
          selectedProducts: prev.selectedProducts.length > 1
            ? prev.selectedProducts.filter((p) => p !== item)
            : prev.selectedProducts,
        }
      } else {
        return { ...prev, selectedProducts: [...prev.selectedProducts, item] }
      }
    })
  }

  const buildWhatsAppMessage = () => {
    const msg = [
      `*🌟 NEW BULK / WHOLESALE ENQUIRY - Craft of Pink City*`,
      `----------------------------------------`,
      `👤 *Name:* ${formData.name || 'Not provided'}`,
      formData.company ? `🏢 *Company / Studio:* ${formData.company}` : '',
      `📞 *Phone / WhatsApp:* ${formData.phone || 'Not provided'}`,
      formData.email ? `✉️ *Email:* ${formData.email}` : '',
      `🛍️ *Interested In:* ${formData.selectedProducts.join(', ')}`,
      `📦 *Estimated Quantity:* ${formData.quantity}`,
      `⏳ *Required Timeline:* ${formData.timeline}`,
      formData.notes ? `📝 *Custom Requirements / Notes:* ${formData.notes}` : '',
      `----------------------------------------`,
      `Please provide catalog pricing and availability. Thank you!`,
    ]
      .filter(Boolean)
      .join('\n')

    return encodeURIComponent(msg)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    const encodedMessage = buildWhatsAppMessage()
    const targetUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`
    window.open(targetUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section id="bulk-orders" className="relative bg-[#f8f1e7] py-20 lg:py-28 border-y border-ink/10">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        {/* Section Header */}
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <span className="eyebrow inline-flex items-center gap-2">
              <Sparkles size={13} className="text-rose" /> Bulk & Wholesale Orders
            </span>
            <h2 className="section-title">
              Crafted in Volume.<br />
              <i>Cherished for a Lifetime.</i>
            </h2>
            <p className="body-copy">
              Stocking your boutique, curating corporate hampers, or planning bulk retail dispatches? We craft bespoke,
              artisan block-printed collections in bulk with personalized branding and tiered wholesale pricing.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-col gap-3 sm:flex-row sm:items-center lg:justify-end">
            <div className="rounded-2xl border border-ink/15 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-rose/10 text-rose font-bold text-sm">
                  25+
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink">Low MOQ</p>
                  <p className="text-xs text-ink/70">Starting at just 25 units per design</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-ink/15 bg-white/70 p-4 shadow-sm backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-saffron/10 text-saffron font-bold text-sm">
                  🚚
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink">Pan-India & Global</p>
                  <p className="text-xs text-ink/70">Safe and insured doorstep shipping</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4 Feature Cards */}
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {bulkPerks.map((perk) => {
            const Icon = perk.icon
            return (
              <div
                key={perk.title}
                className="group rounded-2xl border border-ink/10 bg-white/80 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-rose/40 hover:shadow-md"
              >
                <div className="inline-grid h-12 w-12 place-items-center rounded-xl bg-[#fff0e4] text-rose transition-colors group-hover:bg-rose group-hover:text-white">
                  <Icon size={22} />
                </div>
                <h3 className="mt-4 font-serif text-2xl leading-snug text-ink">{perk.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/70">{perk.desc}</p>
              </div>
            )
          })}
        </div>

        {/* Form Container */}
        <div className="mt-16 rounded-3xl border border-ink/15 bg-white p-6 shadow-xl lg:p-10">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Form Left Side Info */}
            <div className="lg:col-span-5 flex flex-col justify-between border-b border-ink/10 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[.2em] text-terracotta">
                  Quick Quotation Request
                </span>
                <h3 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
                  Get a Custom Quote <br /><i>in 2 Hours on WhatsApp</i>
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/75">
                  Fill in your approximate requirements below. Our workshop team in Jaipur will prepare a tailored catalog with discounted tier pricing, available print swatches, and timeline estimates.
                </p>

                <div className="mt-8 space-y-3.5">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-leaf" />
                    <p className="text-xs text-ink/80"><strong>Sample First Approval:</strong> We send a sample piece first. Bulk batch production starts only after your sample confirmation and approval. (Sample orders are separate from bulk orders depending on product).</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-leaf" />
                    <p className="text-xs text-ink/80"><strong>60% Advance Payment:</strong> 60% advance to confirm order & start artisan crafting; remaining 40% before courier dispatch after video inspection of finished batch.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={18} className="mt-0.5 shrink-0 text-leaf" />
                    <p className="text-xs text-ink/80"><strong>Bulk Quality & Policy:</strong> Strictly no returns or refunds on bulk orders (as work starts after sample approval). Any transit/manufacturing defective piece is replaced promptly.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="mt-0.5 shrink-0 text-leaf" />
                    <p className="text-xs text-ink/80"><strong>Custom Tags & Packaging:</strong> Brand logo tags, custom monograms & order-based tailored delivery schedules.</p>
                  </div>
                </div>

              </div>

              {/* Direct Call / Contact Box */}
              <div className="mt-8 rounded-2xl bg-ivory p-5 border border-ink/10">
                <p className="text-xs font-semibold text-ink/70 uppercase tracking-wider">Prefer discussing over a phone call?</p>
                <div className="mt-3 flex flex-wrap gap-3">
                  <a
                    href={`tel:+${whatsappNumber}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2 text-xs font-bold text-white transition-opacity hover:opacity-90"
                  >
                    <PhoneCall size={14} /> Call +91 93512 91471
                  </a>
                  <a
                    href={`mailto:${email}?subject=Bulk%20Order%20Enquiry`}
                    className="inline-flex items-center gap-2 rounded-xl border border-ink/30 bg-white px-4 py-2 text-xs font-bold text-ink transition-colors hover:border-rose hover:text-rose"
                  >
                    Email Catalog Request
                  </a>
                </div>
              </div>
            </div>

            {/* Form Right Side Interactive Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name & Company */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bulk-name" className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-2">
                      Your Name *
                    </label>
                    <input
                      id="bulk-name"
                      type="text"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full rounded-xl border border-ink/20 bg-ivory/50 px-4 py-3 text-sm text-ink outline-none transition focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="bulk-company" className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-2">
                      Organization / Studio Name <span className="text-[10px] font-medium text-ink/50 normal-case">(optional)</span>
                    </label>
                    <input
                      id="bulk-company"
                      type="text"
                      placeholder="e.g. Boutique, Studio, or Company Name (optional)"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full rounded-xl border border-ink/20 bg-ivory/50 px-4 py-3 text-sm text-ink outline-none transition focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20"
                    />
                  </div>
                </div>

                {/* Phone & Email */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bulk-phone" className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-2">
                      WhatsApp Number / Phone *
                    </label>
                    <input
                      id="bulk-phone"
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full rounded-xl border border-ink/20 bg-ivory/50 px-4 py-3 text-sm text-ink outline-none transition focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="bulk-email" className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-2">
                      Email Address <span className="text-[10px] font-medium text-ink/50 normal-case">(optional)</span>
                    </label>
                    <input
                      id="bulk-email"
                      type="email"
                      placeholder="e.g. contact@example.com (optional)"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full rounded-xl border border-ink/20 bg-ivory/50 px-4 py-3 text-sm text-ink outline-none transition focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20"
                    />
                  </div>
                </div>

                {/* Product Categories Selection */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-2">
                    Products of Interest (Select all that apply)
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {productCategories.map((item) => {
                      const isSelected = formData.selectedProducts.includes(item)
                      return (
                        <button
                          type="button"
                          key={item}
                          onClick={() => handleProductToggle(item)}
                          className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition-all ${
                            isSelected
                              ? 'bg-rose text-white shadow-sm ring-2 ring-rose/30'
                              : 'border border-ink/20 bg-ivory/60 text-ink/80 hover:border-rose/60 hover:text-rose'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '} {item}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Quantity & Timeline */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bulk-quantity" className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-2">
                      Estimated Quantity
                    </label>
                    <select
                      id="bulk-quantity"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                      className="w-full rounded-xl border border-ink/20 bg-ivory/50 px-4 py-3 text-sm text-ink outline-none transition focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20"
                    >
                      {quantityRanges.map((q) => (
                        <option key={q} value={q}>
                          {q}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="bulk-timeline" className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-2">
                      Required Delivery Timeline
                    </label>
                    <select
                      id="bulk-timeline"
                      value={formData.timeline}
                      onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                      className="w-full rounded-xl border border-ink/20 bg-ivory/50 px-4 py-3 text-sm text-ink outline-none transition focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20"
                    >
                      {timelineOptions.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Custom Notes */}
                <div>
                  <label htmlFor="bulk-notes" className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-2">
                    Customization Details / Specific Requirements (Optional)
                  </label>
                  <textarea
                    id="bulk-notes"
                    rows={3}
                    placeholder="Tell us about specific colors, monogramming tags, packaging preferences, or target budget..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 bg-ivory/50 px-4 py-3 text-sm text-ink outline-none transition focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20 resize-none"
                  />
                </div>

                {/* Submit Action */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-300 hover:bg-[#20bd5a] hover:shadow-xl hover:-translate-y-0.5"
                  >
                    <MessageCircle size={20} className="fill-white text-white" />
                    Submit Bulk Enquiry on WhatsApp
                  </button>
                  <p className="mt-2.5 text-center text-xs text-ink/60">
                    Direct connection with Jaipur artisan workshop • Instant responses during working hours
                  </p>
                </div>

                {submitted && (
                  <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-4 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                    <span>WhatsApp chat opened! If it didn't open automatically, <a href={`https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`} target="_blank" rel="noreferrer" className="underline font-bold">click here to send</a>.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
