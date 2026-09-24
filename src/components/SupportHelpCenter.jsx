import { useState, useEffect, useMemo } from 'react'
import {
  LifeBuoy,
  X,
  MessageCircle,
  Phone,
  Mail,
  Search,
  Sparkles,
  ChevronRight,
  ChevronDown,
  Clock,
  MapPin,
  Truck,
  RotateCcw,
  ShieldCheck,
  Package,
  Send,
  CheckCircle2,
  Copy,
  ExternalLink,
  Bot,
  HelpCircle,
  ArrowRight,
  Building2,
  Video
} from 'lucide-react'
import { whatsappNumber, whatsapp, email } from '../data/products'
import WhatsAppIcon from './WhatsAppIcon'

// Comprehensive knowledgebase for instant answers
const HELP_TOPICS = [
  {
    id: 'track-order',
    category: 'Orders & Shipping',
    question: 'How do I track my order or check delivery status?',
    answer:
      'Once your order is handcrafted and dispatched from our Jaipur studio, we send you the courier tracking link (India Post, Bluedart, Delhivery, or DHL) directly via WhatsApp and SMS. You can also message our WhatsApp desk anytime with your order name or phone number for instant real-time dispatch updates.',
    badge: 'Popular',
    actionText: 'Track on WhatsApp',
    whatsappPrompt: 'Hello Craft of Pink City, I would like to check the tracking and dispatch status of my order.'
  },
  {
    id: 'shipping-timeline',
    category: 'Orders & Shipping',
    question: 'What are the delivery timelines for India & International orders?',
    answer:
      'Retail orders are dispatched within 24-48 business hours. Pan-India delivery takes 3-6 business days. International express delivery to USA, UK, Europe, Australia, and Middle East takes 7-12 business days with door-to-door tracking. Bulk and custom wholesale orders have tailored production schedules communicated before batch crafting.',
    badge: 'Shipping',
    actionText: 'Inquire Shipping',
    whatsappPrompt: 'Hello Craft of Pink City, I want to inquire about shipping timelines and charges for my pincode/country.'
  },
  {
    id: 'bulk-moq',
    category: 'Bulk & Wholesale',
    question: 'What is the Minimum Order Quantity (MOQ) for bulk & wholesale orders?',
    answer:
      'Our wholesale MOQ starts from just 25 pieces per category (e.g., 25 duffles, 25 pouches, 25 totes, or 25 yoga bags). You can freely mix and match block-print colorways, motifs, and patterns within the category to suit your boutique or gifting hamper.',
    badge: 'Wholesale',
    actionText: 'Get Bulk Catalog',
    whatsappPrompt: 'Hello Craft of Pink City, I would like to request the wholesale catalog and tiered bulk pricing (MOQ 25 pieces).'
  },
  {
    id: 'sample-policy',
    category: 'Bulk & Wholesale',
    question: 'How does the bulk order sample approval process work?',
    answer:
      'For wholesale and corporate orders, we create and courier a physical sample piece first. Once you inspect, test, and approve the sample quality, stitching, and fabric print, our artisans begin crafting your complete bulk batch. Bulk production strictly begins only after your written approval.',
    badge: 'Sample Policy',
    actionText: 'Request Sample',
    whatsappPrompt: 'Hello Craft of Pink City, I want to order a physical sample piece for a potential bulk/corporate order.'
  },
  {
    id: 'video-tour',
    category: 'Bulk & Wholesale',
    question: 'Can I schedule a live video call to inspect your Jaipur workshop?',
    answer:
      'Yes! We offer 1-on-1 live WhatsApp video tours of our Jaipur studio for wholesale and boutique buyers. You can view our authentic wooden block printing tables, see artisans hand-quilting fabrics, and inspect raw material inventory in real time before placing your bulk order.',
    badge: 'Transparency',
    actionText: 'Book Video Call',
    whatsappPrompt: 'Hello Craft of Pink City, I want to book a live WhatsApp video tour of your Jaipur workshop.'
  },
  {
    id: 'advance-policy',
    category: 'Payment & Terms',
    question: 'What are your payment terms (60% Advance Policy)?',
    answer:
      'For custom and wholesale production, a 60% advance payment is required to confirm the order and procure artisan fabrics, dyes, and quilting materials. The remaining 40% balance is payable prior to courier dispatch, after we send you high-resolution photos and video footage of your completed batch.',
    badge: 'Payment',
    actionText: 'Payment Details',
    whatsappPrompt: 'Hello Craft of Pink City, please share the verified payment details and bank transfer/UPI options for my order.'
  },
  {
    id: 'return-policy',
    category: 'Payment & Terms',
    question: 'What is the return and refund policy?',
    answer:
      'Retail orders can be returned or exchanged within 7 days of delivery if unused with original tags. For bulk/wholesale orders, since crafting starts after sample approval, there are no returns; however, any transit or manufacturing defect reported with an unboxing video within 48 hours is promptly replaced or credited.',
    badge: 'Protection',
    actionText: 'View Policy',
    whatsappPrompt: 'Hello Craft of Pink City, I have a query regarding returns and buyer protection.'
  },
  {
    id: 'custom-branding',
    category: 'Bulk & Wholesale',
    question: 'Can you add custom brand logos, labels, or custom prints?',
    answer:
      'Yes! For bulk orders and corporate gifting, we offer custom woven brand labels, custom printed hangtags, screen-printed or embroidered logos, and bespoke gift packaging. Share your artwork or logo file with our design studio on WhatsApp.',
    badge: 'Customization',
    actionText: 'Custom Logo Inquiry',
    whatsappPrompt: 'Hello Craft of Pink City, I would like to discuss custom brand logo labels and packaging for a bulk order.'
  },
  {
    id: 'fabric-care',
    category: 'Craft & Care',
    question: 'How do I wash and care for authentic quilted cotton bags?',
    answer:
      'Hand wash in cold water using a mild, gentle detergent. Do not bleach or machine-tumble dry. Dry flat in the shade to preserve the organic natural dyes and prevent color fading. Light steam ironing on reverse restores the quilted texture.',
    badge: 'Artisan Care',
    actionText: 'Care Advice',
    whatsappPrompt: 'Hello Craft of Pink City, I need advice on fabric care for my quilted handblock items.'
  }
]

const QUICK_PRESETS = [
  {
    id: 'track',
    label: 'Track My Order',
    icon: Truck,
    prompt: 'Hello Craft of Pink City, I need help tracking my order. Here are my details:'
  },
  {
    id: 'bulk',
    label: 'Wholesale Quote (MOQ 25)',
    icon: Building2,
    prompt: 'Hello Craft of Pink City, I am looking for a wholesale price quote for a bulk order (25+ units).'
  },
  {
    id: 'video',
    label: 'Live Video Workshop Tour',
    icon: Video,
    prompt: 'Hello Craft of Pink City, I would like to schedule a 5-minute live WhatsApp video tour of your Jaipur studio.'
  },
  {
    id: 'custom',
    label: 'Custom Prints & Sizing',
    icon: Sparkles,
    prompt: 'Hello Craft of Pink City, I would like to inquire about custom fabric block-prints and custom dimensions.'
  }
]

export default function SupportHelpCenter({
  onOpenPolicy,
  onOpenAiChat,
  onOpenBulkForm
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('contact') // 'contact' | 'faqs' | 'track' | 'callback'
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [openFaqId, setOpenFaqId] = useState('track-order')
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedPhone, setCopiedPhone] = useState(false)

  // Callback form state
  const [callbackForm, setCallbackForm] = useState({
    name: '',
    phone: '',
    topic: 'Order Status & Tracking',
    message: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  // Order lookup state
  const [trackQuery, setTrackQuery] = useState('')

  // Listen for global custom events to open Support Center
  useEffect(() => {
    const handleOpenEvent = (e) => {
      setIsOpen(true)
      if (e.detail?.tab) {
        setActiveTab(e.detail.tab)
      }
      if (e.detail?.faqId) {
        setActiveTab('faqs')
        setOpenFaqId(e.detail.faqId)
      }
    }

    window.addEventListener('open-support-help', handleOpenEvent)
    return () => window.removeEventListener('open-support-help', handleOpenEvent)
  }, [])

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Filter FAQs
  const categories = useMemo(() => {
    const cats = ['All']
    HELP_TOPICS.forEach((item) => {
      if (!cats.includes(item.category)) cats.push(item.category)
    })
    return cats
  }, [])

  const filteredFaqs = useMemo(() => {
    return HELP_TOPICS.filter((item) => {
      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory
      const query = searchQuery.toLowerCase().trim()
      if (!query) return matchesCategory

      const matchesSearch =
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.badge.toLowerCase().includes(query)

      return matchesCategory && matchesSearch
    })
  }, [searchQuery, selectedCategory])

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'email') {
        setCopiedEmail(true)
        setTimeout(() => setCopiedEmail(false), 2200)
      } else if (type === 'phone') {
        setCopiedPhone(true)
        setTimeout(() => setCopiedPhone(false), 2200)
      }
    })
  }

  const handleCallbackSubmit = (e) => {
    e.preventDefault()
    if (!callbackForm.name.trim() || !callbackForm.phone.trim()) return

    const whatsappMessage = encodeURIComponent(
      `*New Help & Callback Request - Craft of Pink City*\n` +
      `👤 *Name:* ${callbackForm.name.trim()}\n` +
      `📞 *Phone/WhatsApp:* ${callbackForm.phone.trim()}\n` +
      `📌 *Topic:* ${callbackForm.topic}\n` +
      `💬 *Query:* ${callbackForm.message.trim() || 'Please contact me back regarding this inquiry.'}`
    )

    setFormSubmitted(true)
    setTimeout(() => {
      window.open(`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`, '_blank')
      setFormSubmitted(false)
      setCallbackForm({
        name: '',
        phone: '',
        topic: 'Order Status & Tracking',
        message: ''
      })
      setIsOpen(false)
    }, 900)
  }

  const handleTrackSubmit = (e) => {
    e.preventDefault()
    if (!trackQuery.trim()) return

    const trackMessage = encodeURIComponent(
      `Hello Craft of Pink City Dispatch Desk, I would like to track my order. My Order ID / Name / Phone is: "${trackQuery.trim()}". Please share live courier tracking details.`
    )
    window.open(`https://wa.me/${whatsappNumber}?text=${trackMessage}`, '_blank')
  }

  return (
    <>
      {/* 1. Floating Bottom-Left Support & Help Capsule Launcher (Desktop & Tablet) */}
      <div className="fixed bottom-6 left-6 z-40 hidden sm:flex items-center gap-2">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 rounded-full bg-gradient-to-r from-ink via-[#2a1728] to-ink p-1 pl-3.5 pr-4 text-white shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-rose/30 ring-1 ring-white/20"
            aria-label="Open Customer Support and Help Center"
            title="Customer Support, Order Help & FAQs"
          >
            {/* Subtle glow border */}
            <span className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-emerald-500 via-saffron to-rose opacity-60 blur-xs group-hover:opacity-100 animate-pulse transition duration-500" />

            <div className="relative flex items-center gap-2">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-inner">
                <LifeBuoy size={16} className="group-hover:rotate-45 transition-transform duration-500" />
                <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-400 ring-1 ring-ink" />
                </span>
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold tracking-wide text-white">Support & Help</span>
                  <span className="rounded bg-emerald-500/20 px-1 py-0.2 text-[8px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                    Live
                  </span>
                </div>
                <p className="text-[9px] text-white/70">Jaipur Studio Desk</p>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* 2. Full Support & Help Center Modal / Drawer */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/65 p-0 sm:p-4 backdrop-blur-sm animate-fadeIn"
          role="dialog"
          aria-modal="true"
          aria-labelledby="support-modal-title"
        >
          {/* Backdrop click */}
          <div className="absolute inset-0" onClick={() => setIsOpen(false)} />

          {/* Modal Container */}
          <div className="relative z-10 flex h-[92vh] sm:h-[85vh] max-h-[780px] w-full max-w-3xl flex-col overflow-hidden rounded-t-3xl sm:rounded-3xl bg-ivory border border-ink/15 shadow-2xl animate-scaleUp">
            {/* Modal Header */}
            <div className="relative flex items-center justify-between border-b border-ink/10 bg-gradient-to-r from-ink via-[#2c182a] to-ink px-5 py-4 text-white shadow-md">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white shadow-sm shrink-0">
                  <LifeBuoy size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 id="support-modal-title" className="font-serif text-lg sm:text-xl font-bold tracking-wide text-white">
                      Support & Help Desk
                    </h2>
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70">
                    Direct Jaipur Artisan Workshop Assistance · Mon-Sun 10 AM - 8 PM IST
                  </p>
                </div>
              </div>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-2xl bg-white/10 text-white/80 hover:bg-rose hover:text-white transition-colors"
                aria-label="Close Support Desk"
              >
                <X size={18} />
              </button>
            </div>

            {/* Navigation Tab Bar */}
            <div className="flex items-center gap-1 overflow-x-auto border-b border-ink/10 bg-white px-4 py-2 text-xs font-semibold text-ink/70 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('contact')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition-all whitespace-nowrap ${
                  activeTab === 'contact'
                    ? 'bg-rose text-white shadow-sm font-bold'
                    : 'hover:bg-ink/5 hover:text-ink'
                }`}
              >
                <MessageCircle size={14} />
                <span>Instant Contact</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('faqs')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition-all whitespace-nowrap ${
                  activeTab === 'faqs'
                    ? 'bg-rose text-white shadow-sm font-bold'
                    : 'hover:bg-ink/5 hover:text-ink'
                }`}
              >
                <HelpCircle size={14} />
                <span>Knowledgebase & FAQs</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('track')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition-all whitespace-nowrap ${
                  activeTab === 'track'
                    ? 'bg-rose text-white shadow-sm font-bold'
                    : 'hover:bg-ink/5 hover:text-ink'
                }`}
              >
                <Truck size={14} />
                <span>Track Order</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('callback')}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 transition-all whitespace-nowrap ${
                  activeTab === 'callback'
                    ? 'bg-rose text-white shadow-sm font-bold'
                    : 'hover:bg-ink/5 hover:text-ink'
                }`}
              >
                <Send size={14} />
                <span>Quick Inquiry Form</span>
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              {/* TAB 1: INSTANT CONTACT CHANNELS */}
              {activeTab === 'contact' && (
                <div className="space-y-6 animate-fadeIn">
                  {/* Studio Banner */}
                  <div className="rounded-2xl bg-gradient-to-r from-ink via-[#2c192c] to-ink p-4 sm:p-5 text-white shadow-lg border border-white/10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-saffron flex items-center gap-1.5">
                          <Building2 size={12} /> Jaipur Artisan Studio & Dispatch Hub
                        </span>
                        <h3 className="font-serif text-lg font-bold text-white mt-1">
                          Craft of Pink City Customer Desk
                        </h3>
                        <p className="text-xs text-white/75 mt-1 leading-relaxed">
                          Speak directly with our artisan workshop coordinators for orders, custom sizes, wholesale tiers, or delivery queries.
                        </p>
                      </div>

                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Craft of Pink City, I would like to chat with customer support.')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#20ba59] transition-all hover:scale-105 shrink-0"
                      >
                        <WhatsAppIcon size={16} />
                        <span>Chat on WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Contact Channels Grid */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-3 flex items-center gap-1.5">
                      <Sparkles size={13} className="text-rose" /> Direct Contact Options
                    </h4>

                    <div className="grid gap-3 sm:grid-cols-2">
                      {/* WhatsApp Support */}
                      <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm hover:border-emerald-500/50 hover:shadow-md transition-all group">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-500/10 text-emerald-600">
                              <WhatsAppIcon size={20} />
                            </div>
                            <div>
                              <h5 className="font-bold text-ink text-xs sm:text-sm">WhatsApp Live Desk</h5>
                              <p className="text-[10px] text-emerald-700 font-semibold">Average reply: ~5 mins</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                            Fastest
                          </span>
                        </div>
                        <p className="text-xs text-ink/70 mb-3">
                          +91 93512 91471 · Instant photos, order status, fabric videos & bulk quotes.
                        </p>
                        <a
                          href={`https://wa.me/${whatsappNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#25D366] py-2 text-xs font-bold text-white hover:bg-[#20ba59] transition-colors"
                        >
                          <span>Open WhatsApp Chat</span>
                          <ExternalLink size={12} />
                        </a>
                      </div>

                      {/* Studio Phone Call */}
                      <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm hover:border-rose/50 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="grid h-9 w-9 place-items-center rounded-xl bg-rose/10 text-rose">
                              <Phone size={18} />
                            </div>
                            <div>
                              <h5 className="font-bold text-ink text-xs sm:text-sm">Direct Phone Line</h5>
                              <p className="text-[10px] text-ink/50">10:00 AM – 8:00 PM IST</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard('+919351291471', 'phone')}
                            className="rounded-lg bg-ink/5 px-2 py-1 text-[10px] font-semibold text-ink/70 hover:bg-ink/10 transition-colors flex items-center gap-1"
                            title="Copy Phone Number"
                          >
                            {copiedPhone ? (
                              <>
                                <CheckCircle2 size={11} className="text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={11} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-ink/70 mb-3 font-mono font-bold">
                          +91 93512 91471
                        </p>
                        <a
                          href="tel:+919351291471"
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-ink py-2 text-xs font-bold text-white hover:bg-rose transition-colors"
                        >
                          <Phone size={12} />
                          <span>Call Studio Hotline</span>
                        </a>
                      </div>

                      {/* Email Desk */}
                      <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm hover:border-amber-500/50 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                              <Mail size={18} />
                            </div>
                            <div>
                              <h5 className="font-bold text-ink text-xs sm:text-sm">Artisan Email Desk</h5>
                              <p className="text-[10px] text-ink/50">Official inquiries & RFPs</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(email, 'email')}
                            className="rounded-lg bg-ink/5 px-2 py-1 text-[10px] font-semibold text-ink/70 hover:bg-ink/10 transition-colors flex items-center gap-1"
                            title="Copy Email Address"
                          >
                            {copiedEmail ? (
                              <>
                                <CheckCircle2 size={11} className="text-emerald-600" />
                                <span className="text-emerald-700">Copied</span>
                              </>
                            ) : (
                              <>
                                <Copy size={11} />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <p className="text-xs text-ink/70 mb-3 truncate font-mono">
                          {email}
                        </p>
                        <a
                          href={`mailto:${email}?subject=${encodeURIComponent('Customer Support / Inquiry - Craft of Pink City')}`}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-ink/20 py-2 text-xs font-bold text-ink hover:border-rose hover:text-rose transition-colors"
                        >
                          <Mail size={12} />
                          <span>Send Email</span>
                        </a>
                      </div>

                      {/* Gulabi AI Assistant Handoff */}
                      <div className="rounded-2xl border border-ink/10 bg-white p-4 shadow-sm hover:border-saffron/50 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2.5">
                            <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-rose to-saffron text-white shadow-sm">
                              <Bot size={18} />
                            </div>
                            <div>
                              <h5 className="font-bold text-ink text-xs sm:text-sm">Gulabi AI Assistant</h5>
                              <p className="text-[10px] text-rose font-semibold">24/7 AI Concierge with Voice</p>
                            </div>
                          </div>
                          <span className="rounded-full bg-rose/10 px-2 py-0.5 text-[9px] font-bold text-rose border border-rose/20">
                            Instant
                          </span>
                        </div>
                        <p className="text-xs text-ink/70 mb-3">
                          Ask about fabric types, prints, duffle dimensions, bag care & quotes in Hindi or English.
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false)
                            if (onOpenAiChat) {
                              onOpenAiChat()
                            } else {
                              const aiBtn = document.querySelector('button[aria-label*="Gulabi"]')
                              if (aiBtn) aiBtn.click()
                            }
                          }}
                          className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-ink to-rose py-2 text-xs font-bold text-white hover:opacity-90 transition-opacity"
                        >
                          <Sparkles size={12} />
                          <span>Chat with Gulabi AI</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp Quick Message Presets */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink/60 mb-2.5 flex items-center gap-1.5">
                      <MessageCircle size={13} className="text-emerald-600" /> Instant 1-Tap WhatsApp Prompts
                    </h4>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {QUICK_PRESETS.map((p) => {
                        const Icon = p.icon
                        return (
                          <a
                            key={p.id}
                            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(p.prompt)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-ink/10 hover:border-emerald-500 hover:shadow-md transition-all text-center group"
                          >
                            <div className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-50 text-emerald-600 mb-1.5 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                              <Icon size={16} />
                            </div>
                            <span className="text-[11px] font-bold text-ink group-hover:text-emerald-700 leading-tight">
                              {p.label}
                            </span>
                            <span className="text-[9px] text-ink/40 mt-0.5">WhatsApp →</span>
                          </a>
                        )
                      })}
                    </div>
                  </div>

                  {/* Policy & Trust Guarantees */}
                  <div className="pt-2 border-t border-ink/10">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink/70">
                      <span className="font-semibold text-ink">Customer Policies:</span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false)
                            if (onOpenPolicy) onOpenPolicy('shipping')
                          }}
                          className="hover:text-rose hover:underline"
                        >
                          Shipping Policy
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false)
                            if (onOpenPolicy) onOpenPolicy('refunds')
                          }}
                          className="hover:text-rose hover:underline"
                        >
                          Returns & Refunds
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false)
                            if (onOpenPolicy) onOpenPolicy('terms')
                          }}
                          className="hover:text-rose hover:underline"
                        >
                          Terms
                        </button>
                        <span>·</span>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOpen(false)
                            if (onOpenPolicy) onOpenPolicy('privacy')
                          }}
                          className="hover:text-rose hover:underline"
                        >
                          Privacy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: SEARCHABLE KNOWLEDGEBASE & FAQS */}
              {activeTab === 'faqs' && (
                <div className="space-y-4 animate-fadeIn">
                  {/* Search Bar */}
                  <div className="relative">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search questions on shipping, bulk orders, sample approval, 60% advance..."
                      className="w-full rounded-2xl border border-ink/20 bg-white py-3 pl-10 pr-4 text-xs sm:text-sm text-ink placeholder-ink/40 outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/20 shadow-inner"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink text-xs"
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {/* Category Pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                          selectedCategory === cat
                            ? 'bg-ink text-white shadow-sm'
                            : 'bg-white border border-ink/10 text-ink/70 hover:border-ink/30 hover:text-ink'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* FAQ Accordion List */}
                  <div className="space-y-2.5">
                    {filteredFaqs.length > 0 ? (
                      filteredFaqs.map((faq) => {
                        const isOpenFaq = openFaqId === faq.id
                        return (
                          <div
                            key={faq.id}
                            className={`rounded-2xl border bg-white transition-all overflow-hidden ${
                              isOpenFaq
                                ? 'border-rose/50 shadow-md ring-1 ring-rose/20'
                                : 'border-ink/10 hover:border-ink/30 shadow-xs'
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => setOpenFaqId(isOpenFaq ? '' : faq.id)}
                              className="flex w-full items-center justify-between gap-3 p-4 text-left font-serif text-sm sm:text-base font-bold text-ink"
                            >
                              <div className="flex items-center gap-2">
                                <span className="rounded-full bg-rose/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-rose border border-rose/20">
                                  {faq.badge}
                                </span>
                                <span>{faq.question}</span>
                              </div>
                              <ChevronDown
                                size={18}
                                className={`shrink-0 text-ink/40 transition-transform duration-200 ${
                                  isOpenFaq ? 'rotate-180 text-rose' : ''
                                }`}
                              />
                            </button>

                            {isOpenFaq && (
                              <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-ink/75 leading-relaxed border-t border-ink/5 animate-fadeIn">
                                <p>{faq.answer}</p>
                                {faq.actionText && (
                                  <div className="mt-3 pt-2.5 flex items-center justify-between border-t border-ink/5">
                                    <span className="text-[10px] text-ink/50">Need more clarification?</span>
                                    <a
                                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(faq.whatsappPrompt)}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                                    >
                                      <WhatsAppIcon size={13} />
                                      <span>{faq.actionText} →</span>
                                    </a>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )
                      })
                    ) : (
                      <div className="rounded-2xl bg-white p-8 text-center border border-ink/10">
                        <HelpCircle size={32} className="mx-auto text-ink/30 mb-2" />
                        <p className="font-serif text-base font-bold text-ink">No matching questions found</p>
                        <p className="text-xs text-ink/60 mt-1">
                          Our artisan team is available directly on WhatsApp to answer your custom question.
                        </p>
                        <a
                          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Craft of Pink City, I have a question about: "${searchQuery}"`)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2 text-xs font-bold text-white hover:bg-[#20ba59]"
                        >
                          <WhatsAppIcon size={14} />
                          <span>Ask on WhatsApp</span>
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: TRACK ORDER & DISPATCH ASSISTANCE */}
              {activeTab === 'track' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="rounded-2xl bg-white p-5 border border-ink/10 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-2">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-amber-500/10 text-amber-600">
                        <Truck size={20} />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-ink">Order Dispatch & Live Tracking</h4>
                        <p className="text-[11px] text-ink/60">Pan-India & International Shipments</p>
                      </div>
                    </div>
                    <p className="text-xs text-ink/75 leading-relaxed mb-4">
                      Enter your <strong>Customer Name, WhatsApp Phone Number, or Order Reference ID</strong> below to immediately check dispatch status and courier AWB details with our Jaipur shipping desk.
                    </p>

                    <form onSubmit={handleTrackSubmit} className="space-y-3">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-ink/60 mb-1">
                          Order Reference / Name / Phone:
                        </label>
                        <input
                          type="text"
                          required
                          value={trackQuery}
                          onChange={(e) => setTrackQuery(e.target.value)}
                          placeholder="e.g. Rahul Sharma or 9876543210 or CPC-104"
                          className="w-full rounded-xl border border-ink/20 bg-ivory/50 px-4 py-2.5 text-xs sm:text-sm text-ink placeholder-ink/40 outline-none transition focus:border-rose focus:bg-white focus:ring-2 focus:ring-rose/20"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={!trackQuery.trim()}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-ink to-rose py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:opacity-95 transition-opacity disabled:opacity-40"
                      >
                        <Truck size={15} />
                        <span>Inquire Tracking on WhatsApp</span>
                      </button>
                    </form>
                  </div>

                  {/* Dispatch Guide Info */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl bg-white p-4 border border-ink/10 text-xs space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-ink">
                        <Clock size={15} className="text-rose" />
                        <span>Dispatch Timelines</span>
                      </div>
                      <p className="text-ink/70">
                        • Retail Orders: Dispatched in 24-48 business hours.
                      </p>
                      <p className="text-ink/70">
                        • Bulk Orders: Batch dispatched as per approved schedule.
                      </p>
                    </div>

                    <div className="rounded-2xl bg-white p-4 border border-ink/10 text-xs space-y-1.5">
                      <div className="flex items-center gap-2 font-bold text-ink">
                        <ShieldCheck size={15} className="text-emerald-600" />
                        <span>Courier Partners</span>
                      </div>
                      <p className="text-ink/70">
                        • India: Bluedart, Delhivery, Express Air & India Post.
                      </p>
                      <p className="text-ink/70">
                        • International: DHL Express & FedEx with live tracking.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: QUICK INQUIRY & CALLBACK FORM */}
              {activeTab === 'callback' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="rounded-2xl bg-white p-5 border border-ink/10 shadow-sm">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-rose/10 text-rose">
                        <Send size={18} />
                      </div>
                      <div>
                        <h4 className="font-serif text-base font-bold text-ink">Direct Support Request</h4>
                        <p className="text-[11px] text-ink/60">Our Jaipur artisan desk responds promptly</p>
                      </div>
                    </div>
                    <p className="text-xs text-ink/70 mb-4">
                      Submit your details and your request will be formatted directly for instant resolution on WhatsApp.
                    </p>

                    <form onSubmit={handleCallbackSubmit} className="space-y-3 text-xs">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                          <label className="block font-bold text-ink/70 mb-1">Your Full Name *</label>
                          <input
                            type="text"
                            required
                            value={callbackForm.name}
                            onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })}
                            placeholder="e.g. Priya Sharma"
                            className="w-full rounded-xl border border-ink/20 bg-ivory/50 px-3.5 py-2 text-ink placeholder-ink/40 outline-none transition focus:border-rose focus:bg-white focus:ring-1 focus:ring-rose"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-ink/70 mb-1">WhatsApp / Phone Number *</label>
                          <input
                            type="tel"
                            required
                            value={callbackForm.phone}
                            onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                            placeholder="e.g. +91 98765 43210"
                            className="w-full rounded-xl border border-ink/20 bg-ivory/50 px-3.5 py-2 text-ink placeholder-ink/40 outline-none transition focus:border-rose focus:bg-white focus:ring-1 focus:ring-rose"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-ink/70 mb-1">Inquiry Topic</label>
                        <select
                          value={callbackForm.topic}
                          onChange={(e) => setCallbackForm({ ...callbackForm, topic: e.target.value })}
                          className="w-full rounded-xl border border-ink/20 bg-ivory/50 px-3.5 py-2 text-ink outline-none transition focus:border-rose focus:bg-white"
                        >
                          <option value="Order Status & Tracking">Order Status & Tracking</option>
                          <option value="Bulk & Wholesale Quote (MOQ 25)">Bulk & Wholesale Quote (MOQ 25)</option>
                          <option value="Custom Bag Prints & Sizes">Custom Bag Prints & Sizes</option>
                          <option value="Bulk Sample Piece Request">Bulk Sample Piece Request</option>
                          <option value="Payment & Bank Transfer Details">Payment & Bank Transfer Details</option>
                          <option value="Returns or Exchange Query">Returns or Exchange Query</option>
                          <option value="Other Assistance">Other Assistance</option>
                        </select>
                      </div>

                      <div>
                        <label className="block font-bold text-ink/70 mb-1">Your Message (Optional)</label>
                        <textarea
                          rows={3}
                          value={callbackForm.message}
                          onChange={(e) => setCallbackForm({ ...callbackForm, message: e.target.value })}
                          placeholder="Provide any additional details, product name, or required quantity..."
                          className="w-full rounded-xl border border-ink/20 bg-ivory/50 p-3 text-ink placeholder-ink/40 outline-none transition focus:border-rose focus:bg-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={formSubmitted}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:bg-[#20ba59] transition-all"
                      >
                        {formSubmitted ? (
                          <>
                            <CheckCircle2 size={16} />
                            <span>Redirecting to WhatsApp...</span>
                          </>
                        ) : (
                          <>
                            <WhatsAppIcon size={16} />
                            <span>Send Support Request via WhatsApp</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Footer */}
            <div className="flex items-center justify-between border-t border-ink/10 bg-ivory px-5 py-3 text-[11px] text-ink/60">
              <div className="flex items-center gap-1.5">
                <MapPin size={12} className="text-rose" />
                <span>Jaipur, Rajasthan · India (302001)</span>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`mailto:${email}`}
                  className="hover:text-rose hover:underline font-semibold"
                >
                  {email}
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
