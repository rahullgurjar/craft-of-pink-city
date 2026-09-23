import { useEffect, useState } from 'react'
import {
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Mail,
  Phone,
  Building2,
  Package,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Heart,
  Send,
  HelpCircle,
  MessageCircle,
  ChevronRight
} from 'lucide-react'
import logo from '../assets/logo.jpeg'
import { whatsappNumber, email as supportEmail } from '../data/products'

export default function ThankYou({ inquiryData, onBackHome }) {
  const [inquiry, setInquiry] = useState(inquiryData || null)
  const [refId, setRefId] = useState('')

  useEffect(() => {
    // Scroll to top when Thank You page loads
    window.scrollTo({ top: 0, behavior: 'instant' })

    // If inquiryData is not passed as prop, load from sessionStorage
    if (!inquiryData) {
      try {
        const cached = sessionStorage.getItem('cpc_last_inquiry')
        if (cached) {
          const parsed = JSON.parse(cached)
          setInquiry(parsed)
          setRefId(parsed.refId || generateRefId())
          return
        }
      } catch (e) {
        console.warn('Could not retrieve cached inquiry data', e)
      }
    } else {
      setInquiry(inquiryData)
      setRefId(inquiryData.refId || generateRefId())
    }

    if (!refId) {
      setRefId(generateRefId())
    }
  }, [inquiryData])

  const generateRefId = () => {
    const random = Math.floor(10000 + Math.random() * 90000)
    return `CPC-${random}`
  }

  const handleNavigateBack = (sectionId = 'home') => {
    if (onBackHome) {
      onBackHome(sectionId)
    } else {
      window.location.hash = sectionId
    }
  }

  const customerName = inquiry?.name?.trim() || 'Valued Customer'
  const customerEmail = inquiry?.email?.trim() || 'Your provided email'
  const customerPhone = inquiry?.phone?.trim() || 'Your provided phone'
  const customerCompany = inquiry?.company?.trim()
  const selectedProducts = Array.isArray(inquiry?.selectedProducts)
    ? inquiry.selectedProducts
    : typeof inquiry?.products === 'string' && inquiry.products
    ? inquiry.products.split(',').map((p) => p.trim())
    : ['Handcrafted Jaipur Accessories']
  const quantity = inquiry?.quantity || '25+ Pieces (Standard Wholesale Slab)'
  const timeline = inquiry?.timeline || 'Within 2 - 3 Weeks'
  const notes = inquiry?.notes?.trim()

  return (
    <div className="min-h-screen bg-[#faf4ec] text-ink py-12 lg:py-20 animate-fadeIn">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Top Breadcrumb & Return Action */}
        <div className="mb-8 flex items-center justify-between">
          <button
            type="button"
            onClick={() => handleNavigateBack('products')}
            className="inline-flex items-center gap-2 rounded-full border border-ink/15 bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-wider text-ink/80 shadow-sm backdrop-blur-sm transition-all hover:border-rose hover:bg-white hover:text-rose hover:-translate-x-0.5"
          >
            <ArrowLeft size={15} /> Back to Catalog
          </button>

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100/80 px-3.5 py-1 text-[11px] font-bold text-emerald-900 border border-emerald-300/80 shadow-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Enquiry Received • {refId}</span>
          </div>
        </div>

        {/* Main Hero Confirmation Card */}
        <div className="relative overflow-hidden rounded-3xl border border-ink/15 bg-white p-6 shadow-xl sm:p-10 lg:p-12">
          {/* Subtle decorative background pattern */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-rose/5 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-saffron/10 blur-3xl" />

          {/* Header Icon & Title */}
          <div className="relative z-10 text-center">
            <div className="mx-auto inline-flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-lg shadow-emerald-500/30">
              <CheckCircle2 size={42} strokeWidth={2.4} />
            </div>

            <span className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-rose">
              <Sparkles size={14} /> Submission Confirmed
            </span>

            <h1 className="mt-2 font-serif text-3xl font-bold tracking-tight text-ink sm:text-5xl">
              Thank You, {customerName}!
            </h1>

            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-ink/75 sm:text-base">
              Your inquiry has been successfully recorded and sent to our artisan workshop in Jaipur. A customized catalog pricing schedule and fabric swatches are being prepared for you.
            </p>

            {/* Artisan Confirmation Badge */}
            <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50/80 px-4 py-2.5 text-xs text-emerald-900">
              <ShieldCheck size={16} className="text-emerald-700" />
              <span className="font-semibold">Successfully Logged with Jaipur Artisan Production Desk</span>
              <span className="text-emerald-700 font-mono text-[11px]">[{refId}]</span>
            </div>
          </div>

          {/* Inquiry Summary Box */}
          <div className="relative z-10 mt-10 rounded-2xl border border-ink/10 bg-[#faf6f0] p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-ink/10 pb-4">
              <div className="flex items-center gap-2.5">
                <img
                  src={logo}
                  alt="Craft of Pink City"
                  className="h-9 w-9 rounded-full object-cover border border-ink/15"
                />
                <div>
                  <h3 className="font-serif text-base font-bold text-ink">Inquiry Summary</h3>
                  <p className="text-[11px] text-ink/60">Craft of Pink City · Jaipur Workshop Desk</p>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold text-rose bg-rose/10 px-2.5 py-1 rounded-lg">
                Ref: {refId}
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2 text-xs">
              {/* Contact Info */}
              <div className="space-y-2 rounded-xl bg-white/80 p-3.5 border border-ink/5">
                <p className="font-bold uppercase tracking-wider text-ink/50 text-[10px]">Contact Details</p>
                <div className="space-y-1.5 text-ink/80">
                  <p className="font-semibold text-ink text-sm">{customerName}</p>
                  <p className="flex items-center gap-2">
                    <Mail size={13} className="text-rose shrink-0" />
                    <span className="font-medium text-ink">{customerEmail}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={13} className="text-rose shrink-0" />
                    <span>{customerPhone}</span>
                  </p>
                  {customerCompany && (
                    <p className="flex items-center gap-2">
                      <Building2 size={13} className="text-rose shrink-0" />
                      <span>{customerCompany}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Order Specs */}
              <div className="space-y-2 rounded-xl bg-white/80 p-3.5 border border-ink/5">
                <p className="font-bold uppercase tracking-wider text-ink/50 text-[10px]">Order Specifications</p>
                <div className="space-y-1.5 text-ink/80">
                  <div>
                    <span className="text-ink/60">Quantity:</span>{' '}
                    <span className="font-semibold text-ink">{quantity}</span>
                  </div>
                  <div>
                    <span className="text-ink/60">Timeline:</span>{' '}
                    <span className="font-semibold text-ink">{timeline}</span>
                  </div>
                  <div>
                    <span className="text-ink/60">Terms:</span>{' '}
                    <span className="font-medium text-emerald-800">60% Advance · Sample First Approval</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Products */}
            <div className="mt-4 rounded-xl bg-white/80 p-3.5 border border-ink/5">
              <p className="font-bold uppercase tracking-wider text-ink/50 text-[10px] mb-2">Selected Products of Interest</p>
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((p, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-rose/10 px-3 py-1 text-xs font-semibold text-rose"
                  >
                    <Package size={12} /> {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Notes if any */}
            {notes && (
              <div className="mt-4 rounded-xl bg-white/80 p-3.5 border border-ink/5 text-xs">
                <p className="font-bold uppercase tracking-wider text-ink/50 text-[10px] mb-1">Custom Requirements & Notes</p>
                <p className="text-ink/80 italic leading-relaxed">"{notes}"</p>
              </div>
            )}
          </div>

          {/* Next Steps: What Happens Next? */}
          <div className="relative z-10 mt-10">
            <h3 className="text-center font-serif text-2xl font-bold text-ink sm:text-3xl">
              What Happens Next?
            </h3>
            <p className="text-center text-xs text-ink/60 mt-1 max-w-md mx-auto">
              Our direct Jaipur artisan production process ensures supreme quality and timely delivery.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {/* Step 1 */}
              <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-all hover:border-rose/30">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose/10 font-bold text-rose text-sm">
                  1
                </div>
                <h4 className="mt-3 font-serif text-lg font-bold text-ink">Requirement Review</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/70">
                  Within <strong>2–4 business hours</strong>, our workshop team reviews fabric stock, block-prints, and custom tag specs.
                </p>
              </div>

              {/* Step 2 */}
              <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-all hover:border-rose/30">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-saffron/20 font-bold text-saffron text-sm">
                  2
                </div>
                <h4 className="mt-3 font-serif text-lg font-bold text-ink">Wholesale Catalog & Slab</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/70">
                  We send high-definition swatch photographs and discounted bulk slab pricing to <strong>{customerEmail}</strong>.
                </p>
              </div>

              {/* Step 3 */}
              <div className="rounded-2xl border border-ink/10 bg-white p-5 shadow-sm transition-all hover:border-rose/30">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 font-bold text-emerald-800 text-sm">
                  3
                </div>
                <h4 className="mt-3 font-serif text-lg font-bold text-ink">Sample Approval & Crafting</h4>
                <p className="mt-1.5 text-xs leading-relaxed text-ink/70">
                  For bulk orders, we send a physical sample first. Batch production starts strictly after your physical confirmation.
                </p>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="relative z-10 mt-10 border-t border-ink/10 pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => handleNavigateBack('products')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 rounded-2xl bg-rose px-8 py-4 text-xs font-bold uppercase tracking-wider text-white shadow-lg transition-all hover:bg-[#962325] hover:shadow-xl hover:-translate-y-0.5"
              >
                <ShoppingBag size={16} /> Explore Full Collection
              </button>

              <button
                type="button"
                onClick={() => handleNavigateBack('craft')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-ink/20 bg-white px-6 py-4 text-xs font-bold uppercase tracking-wider text-ink transition-colors hover:border-rose hover:text-rose"
              >
                <Sparkles size={16} /> Our Artisan Craft Process
              </button>
            </div>

            {/* Optional Immediate Assistance Link */}
            <div className="mt-8 text-center border-t border-ink/5 pt-6">
              <p className="text-xs text-ink/65">
                Have an urgent custom query or need an immediate quote?
              </p>
              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                  `Hello Craft of Pink City, I just submitted an inquiry (Ref: ${refId}) on your website for ${quantity} of ${selectedProducts.join(', ')}.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex items-center gap-2 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                <MessageCircle size={15} /> Chat directly with Jaipur Workshop on WhatsApp →
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Trust Guarantee Strip */}
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4 text-center text-xs">
          <div className="rounded-2xl bg-white/70 p-4 border border-ink/10">
            <ShieldCheck size={20} className="mx-auto text-rose" />
            <p className="mt-2 font-bold text-ink">100% Pure Cotton</p>
            <p className="text-[11px] text-ink/60">Natural Jaipur dyes & quilting</p>
          </div>
          <div className="rounded-2xl bg-white/70 p-4 border border-ink/10">
            <Sparkles size={20} className="mx-auto text-rose" />
            <p className="mt-2 font-bold text-ink">Direct Workshop</p>
            <p className="text-[11px] text-ink/60">Zero middleman margins</p>
          </div>
          <div className="rounded-2xl bg-white/70 p-4 border border-ink/10">
            <Clock size={20} className="mx-auto text-rose" />
            <p className="mt-2 font-bold text-ink">Fast Turnaround</p>
            <p className="text-[11px] text-ink/60">Guaranteed dispatch timelines</p>
          </div>
          <div className="rounded-2xl bg-white/70 p-4 border border-ink/10">
            <Package size={20} className="mx-auto text-rose" />
            <p className="mt-2 font-bold text-ink">Pan-India & Global</p>
            <p className="text-[11px] text-ink/60">Insured express delivery</p>
          </div>
        </div>

      </div>
    </div>
  )
}
