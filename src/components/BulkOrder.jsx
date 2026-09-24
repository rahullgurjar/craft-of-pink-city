import { useState } from 'react'
import {
  CheckCircle2,
  Package,
  Gift,
  Building2,
  Sparkles,
  Send,
  PhoneCall,
  Clock,
  ShieldCheck,
  Loader2,
  Mail,
  AlertCircle,
  Video
} from 'lucide-react'
import { whatsappNumber, email } from '../data/products'
import WhatsAppIcon from './WhatsAppIcon'
import { submitToGoogleSheet } from '../config/googleSheet'
import { validateName, validatePhone, validateEmail } from '../utils/validation'

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

const initialFormState = {
  name: '',
  company: '',
  phone: '',
  email: '',
  selectedProducts: ['Quilted Tote Bags', 'Vanity Boxes & Pouches'],
  quantity: '51 - 100 pcs (Mid-Volume Wholesale)',
  timeline: 'Within 2 - 3 Weeks',
  notes: '',
}

export default function BulkOrder({ onNavigateThankYou }) {
  const [formData, setFormData] = useState(initialFormState)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleProductToggle = (item) => {
    setFormData((prev) => {
      const exists = prev.selectedProducts.includes(item)
      if (exists) {
        return {
          ...prev,
          selectedProducts:
            prev.selectedProducts.length > 1
              ? prev.selectedProducts.filter((p) => p !== item)
              : prev.selectedProducts,
        }
      } else {
        return { ...prev, selectedProducts: [...prev.selectedProducts, item] }
      }
    })
  }

  const handleBlur = (field) => {
    let result
    if (field === 'name') result = validateName(formData.name)
    if (field === 'phone') result = validatePhone(formData.phone)
    if (field === 'email') result = validateEmail(formData.email)

    if (result) {
      setErrors((prev) => ({
        ...prev,
        [field]: result.isValid ? null : result.error,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    // Strict Verification of all Client Inputs
    const nameVal = validateName(formData.name)
    const phoneVal = validatePhone(formData.phone)
    const emailVal = validateEmail(formData.email)

    const newErrors = {}
    if (!nameVal.isValid) newErrors.name = nameVal.error
    if (!phoneVal.isValid) newErrors.phone = phoneVal.error
    if (!emailVal.isValid) newErrors.email = emailVal.error

    setErrors(newErrors)

    // Stop immediately if any details are fake, incomplete, or invalid
    if (Object.keys(newErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    const randomId = Math.floor(10000 + Math.random() * 90000)
    const refId = `CPC-${randomId}`

    const submissionPayload = {
      ...formData,
      refId,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      source: 'Website Bulk & Custom Order Form',
    }

    // 1. Meta Pixel Lead Tracking (if available)
    try {
      if (typeof window !== 'undefined' && window.fbq) {
        window.fbq('track', 'Lead', {
          content_name: 'Bulk Order Form Submission',
          content_category: formData.selectedProducts.join(', '),
          value: formData.quantity,
          currency: 'INR',
        })
      }
    } catch (pixelErr) {
      console.debug('Pixel Lead tracking ignored:', pixelErr)
    }

    // 2. Submit form data directly to Google Sheet
    try {
      await submitToGoogleSheet(submissionPayload)
    } catch (err) {
      console.error('Google Sheet submission failed:', err)
    }

    // 3. Cache payload in sessionStorage for Thank You page
    try {
      sessionStorage.setItem('cpc_last_inquiry', JSON.stringify(submissionPayload))
    } catch (storageErr) {
      console.warn('Session storage write error:', storageErr)
    }

    setIsSubmitting(false)

    // 4. Redirect to Thank You page
    if (onNavigateThankYou) {
      onNavigateThankYou(submissionPayload)
    } else {
      window.location.hash = 'thank-you'
    }
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

        {/* Live Workshop Video Verification Banner */}
        <div className="mt-12 rounded-3xl bg-gradient-to-r from-[#2B1727] via-ink to-[#2B1727] p-6 sm:p-8 text-white shadow-xl border border-white/10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-rose/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-300 border border-rose/30">
                <Video size={14} className="animate-pulse text-rose-400" />
                <span>100% Workshop Transparency</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold leading-tight">
                Schedule a Live 5-Minute Studio Video Call
              </h3>
              <p className="text-xs sm:text-sm text-white/75 leading-relaxed">
                Placing a bulk order of 25+ pieces? Connect directly with our Jaipur workshop manager on a live WhatsApp video call. Inspect authentic wooden block-printing tables, watch our artisans hand-stitch quilted layers, and verify fabric swatches in real time before booking.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full lg:w-auto">
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Craft of Pink City, I would like to schedule a 5-minute live WhatsApp video tour of your Jaipur workshop for a bulk order inquiry.')}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] px-6 py-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg hover:bg-[#20ba59] hover:scale-105 transition-all cursor-pointer"
              >
                <WhatsAppIcon size={16} />
                <span>Book Live Studio Video Call</span>
              </a>
            </div>
          </div>
        </div>

        {/* Form Container */}
        <div className="mt-16 rounded-3xl border border-ink/15 bg-white p-6 shadow-xl lg:p-10">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Form Left Side Info */}
            <div className="lg:col-span-5 flex flex-col justify-between border-b border-ink/10 pb-8 lg:border-b-0 lg:border-r lg:pb-0 lg:pr-10">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-[.2em] text-terracotta">
                  Direct Workshop Quotation
                </span>
                <h3 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">
                  Request a Custom Quote <br /><i>from Jaipur Artisans</i>
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink/75">
                  Fill in your requirements below. Our workshop team in Jaipur will prepare a tailored catalog with discounted tier pricing, available print swatches, and timeline estimates.
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
                    <Mail size={14} /> Email Catalog Desk
                  </a>
                </div>
              </div>
            </div>

            {/* Form Right Side Interactive Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
                      onBlur={() => handleBlur('name')}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value })
                        if (errors.name) setErrors({ ...errors, name: null })
                      }}
                      className={`w-full rounded-xl border bg-ivory/50 px-4 py-3 text-sm text-ink outline-none transition ${
                        errors.name
                          ? 'border-red-500 ring-2 ring-red-200 bg-red-50/30'
                          : 'border-ink/20 focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20'
                      }`}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
                        <AlertCircle size={13} /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="bulk-company" className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-2">
                      Organization / Studio Name <span className="text-[10px] font-medium text-ink/50 normal-case">(optional)</span>
                    </label>
                    <input
                      id="bulk-company"
                      type="text"
                      placeholder="e.g. Boutique, Studio, or Company Name"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full rounded-xl border border-ink/20 bg-ivory/50 px-4 py-3 text-sm text-ink outline-none transition focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20"
                    />
                  </div>
                </div>

                {/* Phone & Mandatory Email */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="bulk-phone" className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-2">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      id="bulk-phone"
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={formData.phone}
                      onBlur={() => handleBlur('phone')}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value })
                        if (errors.phone) setErrors({ ...errors, phone: null })
                      }}
                      className={`w-full rounded-xl border bg-ivory/50 px-4 py-3 text-sm text-ink outline-none transition ${
                        errors.phone
                          ? 'border-red-500 ring-2 ring-red-200 bg-red-50/30'
                          : 'border-ink/20 focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20'
                      }`}
                    />
                    {errors.phone && (
                      <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
                        <AlertCircle size={13} /> {errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="bulk-email" className="block text-xs font-bold uppercase tracking-wider text-ink/80 mb-2">
                      Email Address *
                    </label>
                    <input
                      id="bulk-email"
                      type="email"
                      required
                      placeholder="e.g. ananya@domain.com"
                      value={formData.email}
                      onBlur={() => handleBlur('email')}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value })
                        if (errors.email) setErrors({ ...errors, email: null })
                      }}
                      className={`w-full rounded-xl border bg-ivory/50 px-4 py-3 text-sm text-ink outline-none transition ${
                        errors.email
                          ? 'border-red-500 ring-2 ring-red-200 bg-red-50/30'
                          : 'border-ink/20 focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20'
                      }`}
                    />
                    {errors.email && (
                      <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1">
                        <AlertCircle size={13} /> {errors.email}
                      </p>
                    )}
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
                <div className="pt-2 space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center gap-3 rounded-2xl bg-rose px-6 py-4 text-sm font-bold uppercase tracking-wider text-white shadow-xl shadow-rose/20 transition-all duration-300 hover:bg-[#962325] hover:shadow-2xl hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin text-white" />
                        <span>Verifying & Submitting Inquiry...</span>
                      </>
                    ) : (
                      <>
                        <Send size={18} className="text-white" />
                        <span>Submit Custom Order & Bulk Inquiry</span>
                      </>
                    )}
                  </button>
                  <div className="flex items-center justify-center gap-2 text-center text-xs text-ink/65">
                    <ShieldCheck size={14} className="text-emerald-700" />
                    <span>Directly recorded at Jaipur Artisan Production Desk</span>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
