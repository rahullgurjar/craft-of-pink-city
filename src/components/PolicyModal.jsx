import { useState, useEffect } from 'react'
import {
  X,
  ShieldCheck,
  FileText,
  Truck,
  RotateCcw,
  Sparkles,
  Lock,
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Mail,
  ChevronRight
} from 'lucide-react'
import { whatsappNumber, email } from '../data/products'

export const POLICY_TABS = [
  { id: 'privacy', label: 'Privacy Policy', icon: ShieldCheck, tag: 'Data Protection' },
  { id: 'terms', label: 'Terms & Conditions', icon: FileText, tag: 'Usage Terms' },
  { id: 'shipping', label: 'Shipping & Delivery', icon: Truck, tag: 'Pan-India & Global' },
  { id: 'refunds', label: 'Returns & Refunds', icon: RotateCcw, tag: 'Customer Protection' },
]

export default function PolicyModal({ isOpen, initialTab = 'privacy', onClose }) {
  const [activeTab, setActiveTab] = useState(initialTab)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab, isOpen])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-3 sm:p-6 backdrop-blur-sm animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-labelledby="policy-modal-title"
    >
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Card */}
      <div className="relative z-10 flex h-[90vh] max-h-[820px] w-full max-w-4xl flex-col overflow-hidden rounded-3xl bg-ivory border border-ink/15 shadow-2xl animate-scaleUp">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-ink/10 bg-white px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-ink to-rose text-white shadow-sm">
              <ShieldCheck size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="policy-modal-title" className="font-serif text-xl sm:text-2xl font-bold text-ink">
                  Craft of Pink City
                </h2>
                <span className="rounded-full bg-rose/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose">
                  Official Policies
                </span>
              </div>
              <p className="text-xs text-ink/60">
                Artisan textile workshop & direct store · Jaipur, Rajasthan
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full bg-ink/5 text-ink/70 transition-colors hover:bg-rose hover:text-white"
            aria-label="Close policies modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-ink/10 bg-white/50 px-6 overflow-x-auto no-scrollbar gap-2 py-2">
          {POLICY_TABS.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-ink text-white shadow-sm'
                    : 'text-ink/70 hover:bg-ink/5 hover:text-ink'
                }`}
              >
                <Icon size={15} className={isActive ? 'text-saffron' : 'text-ink/40'} />
                <span>{tab.label}</span>
              </button>
            )
          })}
        </div>

        {/* Policy Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6 text-ink/85 leading-relaxed text-sm">
          {activeTab === 'privacy' && <PrivacyPolicyContent />}
          {activeTab === 'terms' && <TermsContent />}
          {activeTab === 'shipping' && <ShippingContent />}
          {activeTab === 'refunds' && <RefundContent />}
        </div>

        {/* Bottom Action Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-ink/10 bg-white px-6 py-4">
          <div className="text-xs text-ink/60 text-center sm:text-left">
            Last Updated: <strong>September 2026</strong> · Questions? Contact our workshop desk.
          </div>
          <div className="flex items-center gap-2">
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                'Hello Craft of Pink City, I have a question regarding your store policies.'
              )}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold text-white shadow-sm transition-transform hover:scale-105"
            >
              <MessageCircle size={14} /> Ask on WhatsApp
            </a>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-ink/20 px-4 py-2 text-xs font-bold text-ink hover:bg-ink/5"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PrivacyPolicyContent() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-2xl border border-rose/20 bg-rose/5 p-4 flex items-start gap-3">
        <Lock size={20} className="text-rose shrink-0 mt-0.5" />
        <div className="text-xs text-ink/80 leading-relaxed">
          <strong>Summary of Privacy Promise:</strong> We respect your privacy. We strictly collect only necessary details (name, delivery address, contact number) to fulfill your retail and wholesale bag orders. We never sell, rent, or trade your personal data to any third-party advertisers.
        </div>
      </div>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">1. Information We Collect</h3>
        <p>When you interact with our website, place retail orders, or request wholesale quotations, we collect:</p>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li><strong>Contact Details:</strong> Your name, phone/WhatsApp number, and email address.</li>
          <li><strong>Shipping Information:</strong> Delivery address, city, state, and postal PIN code for dispatch.</li>
          <li><strong>Order Preferences:</strong> Products of interest, customized print selections, and wholesale quantity requirements.</li>
          <li><strong>Technical Data:</strong> Browser type, approximate location, and device details used solely for site optimization and user experience.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">2. How We Use Your Information</h3>
        <p>Your details are used strictly for legitimate business purposes, including:</p>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li>Processing, stitching, and delivering your handcrafted bags and accessories.</li>
          <li>Sending live dispatch tracking links and courier updates via WhatsApp or SMS.</li>
          <li>Providing personalized assistance and customer support via our direct artisan concierge.</li>
          <li>Sending wholesale catalogues and volume quotation invoices when requested by you.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">3. Payment & Transaction Security</h3>
        <p>
          Craft of Pink City operates with utmost transaction safety. Direct retail and wholesale payments are handled through verified payment channels (UPI, Bank Transfer NEFT/IMPS, Cash on Delivery, and trusted payment gateways). We do not store any credit card numbers or banking passwords on our servers.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">4. Third-Party Sharing</h3>
        <p>We only share essential shipping details with our trusted courier logistics partners:</p>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li><strong>Delivery Couriers:</strong> Bluedart, Delhivery, DTDC, India Post, and verified international freight forwarders for global shipments.</li>
          <li><strong>Legal Authorities:</strong> Only when strictly required by applicable Indian laws or statutory obligations.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">5. Your Data Rights & Contact</h3>
        <p>
          You have the right to request access, correction, or deletion of your contact data from our broadcast list at any time. For any privacy-related queries, email us at <a href={`mailto:${email}`} className="text-rose font-bold underline">{email}</a> or WhatsApp us at <a href={`https://wa.me/${whatsappNumber}`} className="text-rose font-bold underline">+91 93512 91471</a>.
        </p>
      </section>
    </div>
  )
}

function TermsContent() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-2xl border border-ink/10 bg-white p-4 text-xs text-ink/80 leading-relaxed">
        <strong>Welcome to Craft of Pink City:</strong> By browsing our website, placing an order, or communicating with our workshop team, you agree to the following terms and artisan craft specifications.
      </div>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">1. Authentic Artisan Craftsmanship</h3>
        <p>
          Every bag, pouch, and accessory at Craft of Pink City is handcrafted in Jaipur using 100% pure cotton, hand-carved teakwood blocks, and traditional hand-screen or block printing techniques.
        </p>
        <p className="text-ink/75">
          Because these pieces are hand-printed by master artisans rather than automated factories, subtle variations in print alignment, color depth, and quilted stitching are natural characteristics of authentic handmade heritage, making each piece uniquely yours.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">2. Retail & Wholesale Orders</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li><strong>Retail Purchases:</strong> Available with instant cart checkout and fast door delivery.</li>
          <li><strong>Wholesale & Bulk Orders:</strong> Minimum Order Quantity (MOQ) starts at 25 units. Quantity tiers, custom logo tag options, and delivery timelines are confirmed in writing on WhatsApp or email invoice before production commencement.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">3. Pricing & Taxes</h3>
        <p>
          All retail product prices displayed on the website are in Indian Rupees (INR) and inclusive of applicable taxes unless stated otherwise. Wholesale prices are offered at tiered volume discounts. We reserve the right to revise catalog prices without prior notice based on raw cotton and fabric yarn market fluctuations.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">4. Intellectual Property</h3>
        <p>
          All photographs, product descriptions, brand identity, logo, and artwork on this website are the intellectual property of <strong>Craft of Pink City</strong>. Reproduction, scraping, or commercial resale without written authorization is strictly prohibited.
        </p>
      </section>
    </div>
  )
}

function ShippingContent() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">1. Pan-India Delivery Coverage</h3>
        <p>
          We deliver across 19,000+ postal PIN codes in India through express logistics partners including <strong>Bluedart, Delhivery, DTDC, and Speed Post</strong>.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">2. Dispatch & Delivery Timelines</h3>
        <div className="grid gap-3 sm:grid-cols-2 text-xs">
          <div className="rounded-xl border border-ink/10 bg-white p-3.5">
            <p className="font-bold text-ink uppercase tracking-wider">Ready Stock Retail Orders</p>
            <p className="mt-1 text-ink/70">Dispatched within 24–48 hours from Jaipur. Delivery takes 3–5 business days depending on city destination.</p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-white p-3.5">
            <p className="font-bold text-ink uppercase tracking-wider">Wholesale & Custom Orders</p>
            <p className="mt-1 text-ink/70">Production and dispatch timelines are tailored based on quantity and confirmed on WhatsApp prior to order finalization.</p>
          </div>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">3. Live Shipment Tracking</h3>
        <p>
          Once your package is handed over to the courier partner, an automated WhatsApp notification containing the Courier AWB number and direct tracking URL is sent to you immediately.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">4. International Shipping</h3>
        <p>
          We ship boutique and personal orders globally (USA, UK, UAE, Europe, Australia). International shipping tariffs are calculated based on parcel gross weight and destination country.
        </p>
      </section>
    </div>
  )
}

function RefundContent() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">1. Artisan Quality Guarantee</h3>
        <p>
          Every item undergoes a stringent 3-point quality check (fabric inspection, diamond quilting alignment, and zipper endurance) before being packed at our Jaipur workshop.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">2. Damaged or Defective Items</h3>
        <p>
          In the rare event that you receive a defective item or package damaged during transit:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li>Please notify us within <strong>48 hours of delivery</strong> by sending an unboxing photo/video to our WhatsApp support team at <strong>+91 93512 91471</strong>.</li>
          <li>Upon verification, we will arrange a complimentary replacement or full refund to your original payment method.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">3. Cancellations</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li><strong>Retail Orders:</strong> Cancellations are accepted prior to parcel dispatch from our workshop.</li>
          <li><strong>Custom Wholesale Orders:</strong> Once fabric block-printing or brand logo tag stitching has commenced, custom production runs cannot be cancelled.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">4. Refund Processing Time</h3>
        <p>
          Approved refunds are initiated within <strong>24–48 hours</strong> and credited back to your original payment mode or UPI within 3–5 working days.
        </p>
      </section>
    </div>
  )
}
