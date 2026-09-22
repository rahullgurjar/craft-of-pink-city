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
      {/* Important Store Policy Notice Banner */}
      <div className="rounded-2xl border-2 border-rose/30 bg-rose/5 p-5 space-y-3 shadow-sm">
        <div className="flex items-center gap-2.5 text-rose font-bold text-sm">
          <ShieldCheck size={20} className="text-rose shrink-0" />
          <span>Essential Store & Bulk Order Policies</span>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 text-xs text-ink/85">
          <div className="rounded-xl bg-white/80 p-3 border border-rose/15 space-y-1">
            <p className="font-bold text-ink">💰 60% Advance Payment Policy</p>
            <p className="text-ink/75">
              A <strong>60% advance payment</strong> is mandatory to confirm your order and initiate custom artisan crafting/batch production. The remaining <strong>40% balance</strong> is payable prior to dispatch after we share video proof of the finished batch.
            </p>
          </div>
          <div className="rounded-xl bg-white/80 p-3 border border-rose/15 space-y-1">
            <p className="font-bold text-ink">📦 Sample First Approval Process</p>
            <p className="text-ink/75">
              For bulk orders, we send you a <strong>sample piece first</strong>. Only once you inspect and <strong>confirm/approve the sample</strong> do our artisans start manufacturing your full order.
            </p>
          </div>
          <div className="rounded-xl bg-white/80 p-3 border border-rose/15 space-y-1">
            <p className="font-bold text-ink">⚖️ Sample vs. Bulk Orders</p>
            <p className="text-ink/75">
              Sample orders are <strong>not the same as bulk orders</strong>. Pricing, production timelines, and customization specifications depend on the specific product category.
            </p>
          </div>
          <div className="rounded-xl bg-white/80 p-3 border border-rose/15 space-y-1">
            <p className="font-bold text-ink">🚫 Bulk Return & Refund Policy</p>
            <p className="text-ink/75">
              Strictly <strong>NO returns or refunds on bulk orders</strong> because production starts only after sample approval. However, if any piece is verified to be <strong>defective or damaged</strong> upon delivery, we replace or credit it immediately.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-ink/10 bg-white p-4 flex items-start gap-3">
        <Lock size={20} className="text-rose shrink-0 mt-0.5" />
        <div className="text-xs text-ink/80 leading-relaxed">
          <strong>Privacy Commitment:</strong> Craft of Pink City values your privacy. We only collect necessary information (name, delivery address, phone/WhatsApp number) required to process, manufacture, and dispatch your orders. We never sell, rent, or trade your personal data.
        </div>
      </div>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">1. Information We Collect</h3>
        <p>When you interact with our store, place retail orders, or request wholesale quotes, we collect:</p>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li><strong>Contact Details:</strong> Your name, phone/WhatsApp number, and email address.</li>
          <li><strong>Shipping Information:</strong> Doorstep delivery address, city, state, and postal PIN code for courier dispatch.</li>
          <li><strong>Order & Customization Details:</strong> Chosen bag designs, block print selections, custom logo branding tags, and bulk quantity requirements.</li>
          <li><strong>Payment Confirmation Data:</strong> Transaction reference IDs and receipts (we do not store your bank passwords or card CVVs).</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">2. How We Use Your Information</h3>
        <p>Your details are used strictly for legitimate customer order processing, including:</p>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li>Handcrafting, stitching, and packaging your authentic Jaipur cotton bags and accessories.</li>
          <li>Sending sample approval photos, batch production updates, and courier dispatch tracking links via WhatsApp/SMS.</li>
          <li>Providing personalized customer support and concierge assistance directly from our artisan workshop.</li>
          <li>Sharing wholesale catalog pricing slabs and tax invoices when requested.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">3. Payment & Transaction Security</h3>
        <p>
          All retail and bulk order transactions are conducted through verified and secure payment channels including UPI, NEFT/IMPS Bank Transfer, and secure payment gateways. Our 60% advance and 40% pre-dispatch milestone terms are executed transparently with digital invoices.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">4. Third-Party Courier Logistics</h3>
        <p>We only share essential shipping details with our trusted courier logistics partners:</p>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li><strong>Delivery Couriers:</strong> Bluedart, Delhivery, DTDC, India Post, and verified international freight forwarders for global shipments.</li>
          <li><strong>Legal Authorities:</strong> Only when strictly required under applicable Indian statutory laws.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">5. Your Data Rights & Contact</h3>
        <p>
          You have the right to request access, correction, or removal of your contact details from our database at any time. For questions regarding our privacy or store policies, email us at <a href={`mailto:${email}`} className="text-rose font-bold underline">{email}</a> or WhatsApp us at <a href={`https://wa.me/${whatsappNumber}`} className="text-rose font-bold underline">+91 93512 91471</a>.
        </p>
      </section>
    </div>
  )
}

function TermsContent() {
  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="rounded-2xl border border-ink/10 bg-white p-4 text-xs text-ink/80 leading-relaxed">
        <strong>Terms of Service:</strong> By browsing our website, placing an order, requesting samples, or engaging with our Jaipur workshop team, you agree to the following terms, milestone payment structures, and artisan craft specifications.
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
        <h3 className="font-serif text-lg font-bold text-ink">2. 60% Advance Payment Policy (Mandatory for Orders)</h3>
        <div className="rounded-2xl border-2 border-saffron/40 bg-saffron/10 p-4 text-xs text-ink/90 leading-relaxed space-y-2">
          <p className="font-bold text-ink text-sm">
            Milestone Structure for Orders & Production:
          </p>
          <ul className="list-disc pl-5 space-y-1.5">
            <li>
              <strong>60% Advance Payment (Mandatory to Confirm Order):</strong> A 60% advance payment is strictly required to confirm the order, lock fabric print selections, procure pure cotton fabric and natural dyes, and schedule artisan workshop batch stitching.
            </li>
            <li>
              <strong>Remaining 40% Balance (Payable Prior to Dispatch):</strong> Once your complete batch is stitched, channel-quilted, quality-checked, and packaged, our workshop team shares high-definition photos and video footage of your ready stock on WhatsApp for your inspection. The remaining 40% balance is payable prior to courier handover.
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">3. Sample First Approval Workflow for Bulk Orders</h3>
        <div className="rounded-2xl border border-ink/15 bg-white p-4 text-xs text-ink/85 leading-relaxed space-y-2">
          <p className="font-bold text-ink text-sm">
            Sample Approval & Production Agreement:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-ink/75">
            <li>
              <strong>Sample Sent First:</strong> For all wholesale and bulk orders, we send a physical sample piece first to ensure you are 100% satisfied with the fabric quality, print design, dimensions, and stitching.
            </li>
            <li>
              <strong>Batch Production upon Sample Confirmation:</strong> Our artisan workshop starts working on your full bulk batch only after you inspect, confirm, and give explicit approval of the sample.
            </li>
            <li>
              <strong>Sample Orders vs. Bulk Orders:</strong> Please note that sample orders are not the same as bulk orders. Unit pricing, production timelines, customization options, and freight terms depend on the specific product and quantity.
            </li>
          </ul>
        </div>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">4. Bulk Orders No Return / No Refund Policy</h3>
        <p className="text-ink/80 text-xs">
          Because wholesale and bulk orders are custom manufactured in volume strictly after sample approval, <strong>bulk orders cannot be returned or refunded</strong> once dispatched, unless an individual piece is verified to be defective upon arrival. See the Returns & Refunds section for defect replacement terms.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">5. Pricing & Taxes</h3>
        <p>
          Retail prices on the website are in Indian Rupees (INR) and inclusive of applicable taxes. Wholesale prices are offered at tiered volume discounts. Catalog prices may adjust periodically based on pure cotton fabric and natural dye raw material market fluctuations.
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">6. Intellectual Property</h3>
        <p>
          All photographs, product descriptions, brand identity, logo, and artwork on this website are the intellectual property of <strong>Craft of Pink City</strong>. Reproduction, scraping, or commercial resale of media assets without written authorization is strictly prohibited.
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
            <p className="mt-1 text-ink/70">Dispatched within 24–48 hours from Jaipur. Delivery takes 3–5 business days depending on destination.</p>
          </div>
          <div className="rounded-xl border border-ink/10 bg-white p-3.5">
            <p className="font-bold text-ink uppercase tracking-wider">Wholesale & Custom Orders</p>
            <p className="mt-1 text-ink/70">Production and dispatch schedules depend on order volume and are confirmed directly on WhatsApp prior to order finalization.</p>
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
      {/* Highlight Box for Wholesale / Bulk Return Policy */}
      <div className="rounded-2xl border-2 border-rose/30 bg-rose/5 p-5 space-y-3">
        <div className="flex items-center gap-2 text-rose font-bold text-sm">
          <RotateCcw size={18} />
          <span>Wholesale & Bulk Orders: No Return & No Refund Policy</span>
        </div>
        <div className="text-xs text-ink/85 space-y-2 leading-relaxed">
          <p>
            <strong>Strict Policy on Bulk / Wholesale Orders:</strong> Because every bulk order is custom manufactured after a physical sample is sent and confirmed by you, we operate on a strict <strong>NO RETURN and NO REFUND policy on bulk orders</strong>.
          </p>
          <p>
            <strong>Exception for Defective Pieces:</strong> If any individual piece in your bulk batch is found to have a manufacturing defect or transit damage, we will promptly replace that piece or provide a credit adjustment upon receiving verification.
          </p>
        </div>
      </div>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">1. Sample Approval Safeguard</h3>
        <p className="text-ink/80 text-xs">
          To prevent discrepancies, we send a physical sample piece prior to beginning bulk manufacturing. Once you inspect and approve the sample, batch production commences. Sample orders are independent of bulk orders (pricing and timelines depend on the specific product).
        </p>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">2. Defective or Damaged Item Reporting (48-Hour Policy)</h3>
        <p>
          In the rare event that you receive a defective item or an item damaged during transit:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li>Please notify us within <strong>48 hours of delivery</strong> by sending an unboxing photo/video and invoice details to our WhatsApp support team at <strong>+91 93512 91471</strong>.</li>
          <li>Upon verification of the defect, we will arrange a complimentary replacement piece or process a refund/credit for that piece.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">3. Cancellations & Order Modifications</h3>
        <ul className="list-disc pl-5 space-y-1 text-ink/75">
          <li><strong>Retail Orders:</strong> Cancellations are accepted prior to parcel dispatch from our workshop.</li>
          <li><strong>Bulk & Custom Orders:</strong> Once the 60% advance is paid, fabric is cut/printed, or brand tags are stitched, production is committed and custom orders cannot be cancelled.</li>
        </ul>
      </section>

      <section className="space-y-2">
        <h3 className="font-serif text-lg font-bold text-ink">4. Refund Processing Time</h3>
        <p>
          Approved refunds for verified defective pieces are initiated within <strong>24–48 hours</strong> and credited back to your original payment mode or UPI within 3–5 working days.
        </p>
      </section>
    </div>
  )
}

