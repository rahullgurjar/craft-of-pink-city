import { useState, useEffect, useMemo } from 'react'
import {
  Shield,
  Lock,
  Unlock,
  KeyRound,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Settings,
  Plus,
  Search,
  Filter,
  Download,
  Printer,
  ExternalLink,
  MessageCircle,
  Phone,
  Mail,
  CheckCircle2,
  Clock,
  Truck,
  FileText,
  AlertCircle,
  Trash2,
  Edit3,
  Eye,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  X,
  Upload,
  Check,
  TrendingUp,
  Package,
  Layers,
  Calendar,
  Building2,
  DollarSign,
  Share2,
  Video,
  LogOut,
  SlidersHorizontal,
  ChevronDown,
  BellRing,
  ToggleLeft,
  ToggleRight,
  Play,
  MapPin,
  PackageCheck
} from 'lucide-react'
import { useProducts } from '../../context/ProductsContext'
import { useCurrency } from '../../context/CurrencyContext'
import {
  getStoredLeads,
  addInboundLead,
  updateLeadStatus,
  addStaffNote,
  deleteLead,
  generateWhatsAppMessage,
  exportLeadsToCSV,
  printLeadPackingSlip,
  LEAD_STATUSES,
} from '../../utils/leadsManager'
import {
  getPopupConfig,
  savePopupConfig,
  getPopupItems,
  savePopupItems,
  addCustomPopup,
  updateCustomPopup,
  deleteCustomPopup,
  resetPopupsToDefault,
} from '../../utils/salesPopupsManager'
import { GOOGLE_SHEET_WEB_APP_URL } from '../../config/googleSheet'

const MASTER_PIN_KEY = 'cpc_staff_master_pin_v1'
const IDLE_TIMEOUT_KEY = 'cpc_staff_idle_timeout_min'
const DEFAULT_PIN = '1471' // Matching atelier support WhatsApp ending 1471

const AVAILABLE_SAMPLE_IMAGES = [
  'duffle-blush-botanical-barrel.jpg',
  'yoga-bag-marigold-sunshine.jpg',
  'pouch-marigold-embroidered-trio.jpg',
  'vanity-vanilla-teal-floral.jpg',
  'pouch-coral-paisley-trio.jpg',
  'organizer-striped-hair-wrap.jpg',
  'duffle-indigo-blossom.jpg',
  'yoga-bag-magenta-tiger.jpg',
  'tote-cherry-blossom-ruffle.jpg',
  'duffle-heritage-patchwork.jpg',
  'vanity-blue-botanical.jpg',
  'pouch-turquoise-saffron-trio.jpg',
  'tote-pink-blue-booti-ruffle.jpg',
  'tote-crimson-ruffle.jpg',
  'pouch-sunshine-yellow.jpg',
]

const newImages = import.meta.glob('../../assets/products-new/*', { eager: true, import: 'default' })
const legacyImages = import.meta.glob('../../assets/products/*', { eager: true, import: 'default' })

const resolveProductImage = (image) => {
  if (!image) return ''
  if (image.startsWith('data:') || image.startsWith('http')) return image
  return (
    newImages[`../../assets/products-new/${image}`] ||
    legacyImages[`../../assets/products/${image}`] ||
    image
  )
}

export default function AdminPortal({ onBackToStore }) {
  // Authentication State - Always requires fresh PIN verification on every login session
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState('')
  const [idleTimeoutMin, setIdleTimeoutMin] = useState(() => {
    try {
      const val = parseInt(localStorage.getItem(IDLE_TIMEOUT_KEY) || '5', 10)
      return isNaN(val) || val <= 0 ? 5 : val
    } catch {
      return 5
    }
  })
  const [idleChangeMsg, setIdleChangeMsg] = useState('')

  // Current Active Tab: 'dashboard' | 'leads' | 'products' | 'popups' | 'settings'
  const [activeTab, setActiveTab] = useState('leads')

  // Products Context
  const {
    products,
    allProducts,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    resetCatalogToDefaults,
  } = useProducts()
  const { formatPrice } = useCurrency()

  // Leads State
  const [leads, setLeads] = useState(getStoredLeads)
  const [selectedLead, setSelectedLead] = useState(null)
  const [newStaffNoteText, setNewStaffNoteText] = useState('')
  const [leadSearchQuery, setLeadSearchQuery] = useState('')
  const [leadStatusFilter, setLeadStatusFilter] = useState('all')
  const [leadSourceFilter, setLeadSourceFilter] = useState('all')

  // Modals
  const [isAddLeadModalOpen, setIsAddLeadModalOpen] = useState(false)
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Social Proof Popups State
  const [popupConfig, setPopupConfig] = useState(getPopupConfig)
  const [popupItems, setPopupItems] = useState(getPopupItems)
  const [isAddPopupModalOpen, setIsAddPopupModalOpen] = useState(false)
  const [editingPopup, setEditingPopup] = useState(null)
  const [testTriggerFeedback, setTestTriggerFeedback] = useState('')

  // Settings State
  const [newMasterPin, setNewMasterPin] = useState('')
  const [pinChangeMsg, setPinChangeMsg] = useState('')

  // Clear any legacy persistent authentication tokens on startup
  useEffect(() => {
    try {
      localStorage.removeItem('cpc_staff_auth_token_v1')
    } catch {}
  }, [])

  // Listen for real-time leads
  useEffect(() => {
    const handleNewLead = () => {
      setLeads(getStoredLeads())
    }
    window.addEventListener('cpc-new-lead-received', handleNewLead)
    return () => window.removeEventListener('cpc-new-lead-received', handleNewLead)
  }, [])

  // Inactivity Auto-Logout Tracker
  useEffect(() => {
    if (!isAuthenticated) return

    let timeoutId = null
    const timeoutMs = (idleTimeoutMin || 5) * 60 * 1000

    const triggerAutoLogout = () => {
      setIsAuthenticated(false)
      setPinInput('')
      setPinError(`🔒 Auto-logged out due to ${idleTimeoutMin || 5} minutes of inactivity for staff security. Please re-enter your master PIN.`)
    }

    const resetInactivityTimer = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(triggerAutoLogout, timeoutMs)
    }

    // Passive activity listeners (mouse movement, clicks, typing, scrolling, touches)
    const activityEvents = [
      'mousemove',
      'mousedown',
      'keydown',
      'touchstart',
      'scroll',
      'wheel',
      'click',
    ]

    resetInactivityTimer()

    activityEvents.forEach((evt) => {
      window.addEventListener(evt, resetInactivityTimer, { passive: true })
    })

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
      activityEvents.forEach((evt) => {
        window.removeEventListener(evt, resetInactivityTimer)
      })
    }
  }, [isAuthenticated, idleTimeoutMin])

  // AUTHENTICATION HANDLERS
  const handlePinSubmit = (e) => {
    e.preventDefault()
    const storedPin = localStorage.getItem(MASTER_PIN_KEY) || DEFAULT_PIN
    if (pinInput.trim() === storedPin) {
      setIsAuthenticated(true)
      setPinError('')
    } else {
      setPinError('Incorrect Staff Passcode. Please try again or check with the Jaipur workshop desk.')
      setPinInput('')
    }
  }

  const handleLogout = () => {
    try {
      localStorage.removeItem('cpc_staff_auth_token_v1')
    } catch {}
    setIsAuthenticated(false)
    setPinInput('')
    setPinError('')
  }

  const handleUpdateIdleTimeout = (minutes) => {
    const minVal = parseInt(minutes, 10) || 5
    setIdleTimeoutMin(minVal)
    try {
      localStorage.setItem(IDLE_TIMEOUT_KEY, String(minVal))
      setIdleChangeMsg(`Auto-lock timeout updated to ${minVal} minutes.`)
      setTimeout(() => setIdleChangeMsg(''), 4000)
    } catch {}
  }

  // LEADS ACTIONS
  const handleStatusChange = (leadId, newStatus) => {
    const updated = updateLeadStatus(leadId, newStatus)
    setLeads(updated)
    if (selectedLead && selectedLead.id === leadId) {
      setSelectedLead(updated.find((l) => l.id === leadId))
    }
  }

  const handleAddNote = (e) => {
    e.preventDefault()
    if (!newStaffNoteText.trim() || !selectedLead) return
    const updated = addStaffNote(selectedLead.id, newStaffNoteText)
    setLeads(updated)
    setSelectedLead(updated.find((l) => l.id === selectedLead.id))
    setNewStaffNoteText('')
  }

  const handleDeleteLead = (leadId) => {
    if (window.confirm('Are you sure you want to delete this lead record?')) {
      const updated = deleteLead(leadId)
      setLeads(updated)
      if (selectedLead && selectedLead.id === leadId) {
        setSelectedLead(null)
      }
    }
  }

  // Filtered Leads
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const matchesSearch =
        !leadSearchQuery ||
        (lead.name && lead.name.toLowerCase().includes(leadSearchQuery.toLowerCase())) ||
        (lead.phone && lead.phone.includes(leadSearchQuery)) ||
        (lead.email && lead.email.toLowerCase().includes(leadSearchQuery.toLowerCase())) ||
        (lead.refId && lead.refId.toLowerCase().includes(leadSearchQuery.toLowerCase())) ||
        (lead.products && lead.products.toLowerCase().includes(leadSearchQuery.toLowerCase()))

      const matchesStatus = leadStatusFilter === 'all' || lead.status === leadStatusFilter
      const matchesSource = leadSourceFilter === 'all' || lead.source === leadSourceFilter

      return matchesSearch && matchesStatus && matchesSource
    })
  }, [leads, leadSearchQuery, leadStatusFilter, leadSourceFilter])

  // METRICS & KPIS
  const metrics = useMemo(() => {
    const totalLeadsCount = leads.length
    const newLeadsCount = leads.filter((l) => l.status === 'new').length
    const inProductionCount = leads.filter((l) => l.status === 'in_production').length
    const dispatchedCount = leads.filter((l) => l.status === 'dispatched' || l.status === 'completed').length

    let estimatedPipelineVal = 0
    leads.forEach((l) => {
      if (l.totalAmount) {
        const num = parseInt(l.totalAmount.replace(/[^0-9]/g, ''), 10)
        if (!isNaN(num)) estimatedPipelineVal += num
      }
    })

    return {
      totalLeadsCount,
      newLeadsCount,
      inProductionCount,
      dispatchedCount,
      estimatedPipelineVal,
    }
  }, [leads])

  // PRODUCT MANAGEMENT HANDLERS
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    category: 'Duffle Bag',
    price: '₹1,499',
    badge: 'New Arrival',
    description: '',
    dimensions: 'Standard Size (100% Handblock Cotton)',
    image: 'duffle-blush-botanical-barrel.jpg',
    status: 'in_stock',
  })
  const [imageUploadType, setImageUploadType] = useState('asset')

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setNewProductForm((prev) => ({ ...prev, image: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateProductSubmit = (e) => {
    e.preventDefault()
    if (!newProductForm.name.trim() || !newProductForm.price.trim()) {
      alert('Please fill in product name and price.')
      return
    }

    addProduct(newProductForm)
    setIsAddProductModalOpen(false)
    setNewProductForm({
      name: '',
      category: 'Duffle Bag',
      price: '₹1,499',
      badge: 'New Arrival',
      description: '',
      dimensions: 'Standard Size (100% Handblock Cotton)',
      image: 'duffle-blush-botanical-barrel.jpg',
      status: 'in_stock',
    })
    alert('🎉 Product successfully published to the live store!')
  }

  const handleSaveProductEdit = (e) => {
    e.preventDefault()
    if (!editingProduct) return
    updateProduct(editingProduct.id, {
      name: editingProduct.name,
      price: editingProduct.price,
      category: editingProduct.category,
      badge: editingProduct.badge,
      description: editingProduct.description,
      status: editingProduct.status,
    })
    setEditingProduct(null)
    alert('Product details updated successfully!')
  }

  // SOCIAL PROOF POPUPS HANDLERS
  const handleUpdatePopupConfig = (key, value) => {
    const updated = { ...popupConfig, [key]: value }
    setPopupConfig(updated)
    savePopupConfig(updated)
  }

  const handleTogglePopupItem = (id, currentVal) => {
    const updated = updateCustomPopup(id, { isEnabled: !currentVal })
    setPopupItems(updated)
  }

  const handleDeletePopupItem = (id) => {
    if (window.confirm('Delete this order notification popup?')) {
      const updated = deleteCustomPopup(id)
      setPopupItems(updated)
    }
  }

  const handleTriggerTestPopup = (popupItem) => {
    const item = popupItem || popupItems[0]
    if (!item) return

    const matchedProd =
      products.find(
        (p) =>
          p.name.toLowerCase() === item.productName?.toLowerCase() ||
          p.image === item.productImage
      ) || {
        id: item.productName?.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        name: item.productName,
        image: item.productImage,
        category: 'Quilted Bag',
      }

    const payload = {
      buyerName: item.buyerName,
      role: item.badge || 'Verified Client',
      city: item.city,
      country: item.country || '',
      quantity: item.quantity,
      tag: item.tag || 'Artisan Quilted Batch',
      badge: item.badge || 'Bulk Order Placed',
      timeAgo: 'Just now',
      product: matchedProd,
    }

    window.dispatchEvent(new CustomEvent('cpc-trigger-test-popup', { detail: payload }))
    setTestTriggerFeedback(`Fired test popup for "${item.buyerName}"! Check the website or preview.`)
    setTimeout(() => setTestTriggerFeedback(''), 4000)
  }

  // [NEW POPUP MODAL FORM STATE]
  const [newPopupForm, setNewPopupForm] = useState({
    buyerName: 'Zara Al-Mansoor',
    city: 'Dubai, UAE',
    country: 'UAE',
    productName: 'Royal Bengal Tiger Quilted Yoga Bag',
    productImage: 'yoga-bag-magenta-tiger.jpg',
    quantity: '50 pieces (Boutique Tier)',
    badge: 'Bulk Order Placed',
    tag: 'Monogram Favors',
    timeAgo: '12 minutes ago',
  })

  const handleCreatePopupSubmit = (e) => {
    e.preventDefault()
    if (!newPopupForm.buyerName.trim() || !newPopupForm.productName.trim()) {
      alert('Please fill in buyer name and product.')
      return
    }
    const updated = addCustomPopup(newPopupForm)
    setPopupItems(updated)
    setIsAddPopupModalOpen(false)
    setNewPopupForm({
      buyerName: 'Zara Al-Mansoor',
      city: 'Dubai, UAE',
      country: 'UAE',
      productName: 'Royal Bengal Tiger Quilted Yoga Bag',
      productImage: 'yoga-bag-magenta-tiger.jpg',
      quantity: '50 pieces (Boutique Tier)',
      badge: 'Bulk Order Placed',
      tag: 'Monogram Favors',
      timeAgo: '12 minutes ago',
    })
    alert('🎉 Order notification popup saved!')
  }

  const handleSavePopupEdit = (e) => {
    e.preventDefault()
    if (!editingPopup) return
    const updated = updateCustomPopup(editingPopup.id, editingPopup)
    setPopupItems(updated)
    setEditingPopup(null)
    alert('Notification popup updated!')
  }

  // CHANGE PIN HANDLER
  const handleChangePin = (e) => {
    e.preventDefault()
    if (newMasterPin.trim().length < 4) {
      setPinChangeMsg('PIN must be at least 4 digits.')
      return
    }
    localStorage.setItem(MASTER_PIN_KEY, newMasterPin.trim())
    setPinChangeMsg('Master PIN updated successfully! Next login will require the new PIN.')
    setNewMasterPin('')
  }

  // ==========================================
  // VIEW: 1. AUTHENTICATION LOCK SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#1e121d] flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-saffron/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative w-full max-w-md bg-[#2a1b29] border border-white/10 rounded-3xl p-8 shadow-2xl backdrop-blur-xl text-white">
          <div className="text-center space-y-2 mb-8">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-rose/20 text-rose border border-rose/30 shadow-inner">
              <Shield size={32} />
            </div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-saffron">
              Jaipur Artisan Atelier
            </p>
            <h1 className="font-serif text-2xl font-bold text-white">
              Staff & Workshop Portal
            </h1>
            <p className="text-xs text-white/60">
              Authorized workshop staff verification. Master PIN is required on every login session.
            </p>
          </div>

          <form onSubmit={handlePinSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-white/80 mb-2">
                Staff Master Passcode / PIN
              </label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="password"
                  maxLength={10}
                  autoFocus
                  required
                  placeholder="••••"
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value)
                    setPinError('')
                  }}
                  className="w-full rounded-2xl border border-white/20 bg-black/40 pl-11 pr-4 py-3.5 text-center font-mono text-xl tracking-widest text-white placeholder:text-white/20 outline-none transition focus:border-rose focus:ring-2 focus:ring-rose/30"
                />
              </div>

              {pinError && (
                <div className={`mt-3 p-3 rounded-2xl text-xs flex items-start gap-2.5 ${
                  pinError.includes('inactivity') || pinError.includes('Auto-logged out')
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-200'
                    : 'bg-rose/20 border border-rose/40 text-rose-200'
                }`}>
                  <AlertCircle className="shrink-0 mt-0.5" size={15} />
                  <p className="font-medium leading-relaxed">{pinError}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-white/60 bg-white/5 p-2.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-1.5 text-[11px]">
                <Clock size={13} className="text-saffron" />
                <span>Auto-locks on {idleTimeoutMin}m inactivity</span>
              </div>
              <span className="text-[11px] text-white/40">Default PIN: 1471</span>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-rose py-4 text-xs font-bold uppercase tracking-wider text-white shadow-xl shadow-rose/30 hover:bg-[#962325] transition-all cursor-pointer font-sans"
            >
              <Unlock size={16} /> Unlock Staff Dashboard
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} /> Return to Customer Website
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // VIEW: 2. MAIN STAFF CRM & BACKEND HUB
  // ==========================================
  return (
    <div className="min-h-screen bg-[#FBF7F2] text-ink flex flex-col">
      {/* Top Staff Navigation Bar */}
      <header className="sticky top-0 z-40 bg-[#1E121D] text-white border-b border-white/10 shadow-lg px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-rose/20 border border-rose/30 flex items-center justify-center text-rose font-bold">
            <Shield size={18} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-serif text-base sm:text-lg font-bold tracking-wide">
                Craft of Pink City
              </h2>
              <span className="rounded-md bg-rose px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white">
                Staff CRM & Atelier Hub
              </span>
            </div>
            <p className="text-[11px] text-white/60">
              Jaipur Workshop Command · Real-time Store Sync
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap items-center gap-1 bg-white/10 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-rose text-white shadow'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <LayoutDashboard size={14} /> Overview
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('leads')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'leads'
                ? 'bg-rose text-white shadow'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Users size={14} />
            <span>Leads & Orders</span>
            {metrics.newLeadsCount > 0 && (
              <span className="h-4 min-w-[16px] px-1 rounded-full bg-saffron text-ink text-[10px] font-bold flex items-center justify-center">
                {metrics.newLeadsCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'products'
                ? 'bg-rose text-white shadow'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShoppingBag size={14} />
            <span>Product Catalog</span>
            <span className="text-[10px] text-white/50">({products.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('popups')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'popups'
                ? 'bg-rose text-white shadow'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <BellRing size={14} />
            <span>Social Proof Popups</span>
            <span className="text-[10px] text-white/50">({popupItems.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'settings'
                ? 'bg-rose text-white shadow'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Settings size={14} /> Settings
          </button>
        </div>

        {/* Live Store Button & Logout */}
        <div className="flex items-center gap-2">
          {/* Active Auto-lock Security Indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-white/80" title={`Session automatically locks after ${idleTimeoutMin} minutes of inactivity`}>
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Auto-Lock: {idleTimeoutMin}m idle</span>
          </div>

          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/10 transition-colors"
          >
            <Eye size={14} />
            <span>View Live Website</span>
          </button>
          <button
            type="button"
            onClick={handleLogout}
            title="Lock & Logout"
            className="grid h-8 w-8 place-items-center rounded-xl bg-white/5 text-white/60 hover:text-rose hover:bg-white/10 transition-colors"
          >
            <LogOut size={15} />
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {/* ==================================================== */}
        {/* TAB 1: WORKSHOP COMMAND OVERVIEW */}
        {/* ==================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="rounded-3xl bg-white p-5 border border-ink/10 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Total Inquiries</p>
                  <h3 className="font-serif text-3xl font-bold text-ink mt-1">{metrics.totalLeadsCount}</h3>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">Across all web channels</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-rose/10 text-rose flex items-center justify-center">
                  <Users size={24} />
                </div>
              </div>

              <div className="rounded-3xl bg-white p-5 border border-ink/10 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink/50">New Inbound</p>
                  <h3 className="font-serif text-3xl font-bold text-rose mt-1">{metrics.newLeadsCount}</h3>
                  <p className="text-[11px] text-rose/80 font-semibold mt-1">Requires staff review</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-rose/10 text-rose flex items-center justify-center">
                  <Sparkles size={24} />
                </div>
              </div>

              <div className="rounded-3xl bg-white p-5 border border-ink/10 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink/50">In Production</p>
                  <h3 className="font-serif text-3xl font-bold text-indigo-700 mt-1">{metrics.inProductionCount}</h3>
                  <p className="text-[11px] text-indigo-700 font-semibold mt-1">Quilting & Block-printing</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Package size={24} />
                </div>
              </div>

              <div className="rounded-3xl bg-white p-5 border border-ink/10 shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-ink/50">Active Pipeline Value</p>
                  <h3 className="font-serif text-3xl font-bold text-emerald-700 mt-1">
                    {formatPrice(metrics.estimatedPipelineVal)}
                  </h3>
                  <p className="text-[11px] text-emerald-700 font-semibold mt-1">Estimated total value</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <TrendingUp size={24} />
                </div>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-3xl bg-[#1e121d] text-white p-6 border border-white/10 shadow-md flex flex-col justify-between">
                <div>
                  <span className="eyebrow text-saffron">Wholesale & Quotes</span>
                  <h4 className="font-serif text-xl font-bold mt-1">Log New Offline Lead</h4>
                  <p className="text-xs text-white/70 mt-2">
                    Received an order via phone, Instagram DM, or studio walk-in? Add it directly to the CRM.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(true)}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-rose px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#962325] transition"
                >
                  <Plus size={15} /> Add Manual Lead
                </button>
              </div>

              <div className="rounded-3xl bg-white p-6 border border-ink/10 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="eyebrow text-rose">Catalog Management</span>
                  <h4 className="font-serif text-xl font-bold text-ink mt-1">Upload New Product</h4>
                  <p className="text-xs text-ink/70 mt-2">
                    Add new quilted totes, duffles, or pouches with real photos and set live pricing.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose transition"
                >
                  <Plus size={15} /> Upload Product
                </button>
              </div>

              <div className="rounded-3xl bg-white p-6 border border-ink/10 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="eyebrow text-purple-700">Urgency & Social Proof</span>
                  <h4 className="font-serif text-xl font-bold text-ink mt-1">Social Proof Popups</h4>
                  <p className="text-xs text-ink/70 mt-2">
                    Manage buyer names, cities, and live order popups that encourage visitor conversions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('popups')}
                  className="mt-4 inline-flex items-center justify-center gap-2 rounded-xl border border-ink/20 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-ink hover:bg-ink hover:text-white transition"
                >
                  <BellRing size={15} /> Manage Popups ({popupItems.length})
                </button>
              </div>
            </div>

            {/* Recent Leads Preview */}
            <div className="rounded-3xl bg-white border border-ink/10 p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-serif text-lg font-bold text-ink">Recent Customer Inquiries</h4>
                  <p className="text-xs text-ink/60">Showing the latest orders and quote requests.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('leads')}
                  className="text-xs font-bold text-rose hover:underline"
                >
                  View All Leads →
                </button>
              </div>

              <div className="divide-y divide-ink/5">
                {leads.slice(0, 4).map((lead) => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setSelectedLead(lead)
                      setActiveTab('leads')
                    }}
                    className="py-3 flex items-center justify-between gap-4 hover:bg-rose/5 px-3 rounded-xl transition cursor-pointer"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-ink">{lead.name}</span>
                        <span className="text-[11px] font-mono text-ink/50">{lead.refId}</span>
                        <span className="rounded-md bg-rose/10 text-rose px-2 py-0.5 text-[10px] font-bold">
                          {lead.status.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-xs text-ink/70 truncate mt-0.5">{lead.products}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-xs text-rose">{lead.totalAmount || lead.quantity}</span>
                      <p className="text-[10px] text-ink/40">{lead.timestamp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: LEADS & ORDERS CRM */}
        {/* ==================================================== */}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-ink">Inquiries & Orders CRM</h3>
                <p className="text-xs text-ink/60">
                  Track, update, and respond to incoming direct checkout orders, bulk wholesale inquiries, and video tours.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLeadModalOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-rose px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#962325] transition shadow-sm"
                >
                  <Plus size={15} /> Add Manual Lead
                </button>
                <button
                  type="button"
                  onClick={() => exportLeadsToCSV(filteredLeads)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-xs font-bold uppercase tracking-wider text-ink hover:bg-ink hover:text-white transition shadow-sm"
                >
                  <Download size={15} /> Export CSV
                </button>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" size={16} />
                <input
                  type="text"
                  placeholder="Search customer name, phone, email, ref ID, or product..."
                  value={leadSearchQuery}
                  onChange={(e) => setLeadSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-ink/20 bg-white pl-10 pr-4 py-2.5 text-xs text-ink outline-none focus:border-rose focus:ring-2 focus:ring-rose/20"
                />
              </div>

              <div className="md:col-span-4">
                <select
                  value={leadStatusFilter}
                  onChange={(e) => setLeadStatusFilter(e.target.value)}
                  className="w-full rounded-xl border border-ink/20 bg-white px-3 py-2.5 text-xs text-ink outline-none focus:border-rose"
                >
                  <option value="all">All Pipeline Stages (All Statuses)</option>
                  {LEAD_STATUSES.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-3">
                <select
                  value={leadSourceFilter}
                  onChange={(e) => setLeadSourceFilter(e.target.value)}
                  className="w-full rounded-xl border border-ink/20 bg-white px-3 py-2.5 text-xs text-ink outline-none focus:border-rose"
                >
                  <option value="all">All Channels / Sources</option>
                  <option value="Website Cart Direct Checkout">Direct Bag Checkout</option>
                  <option value="Website Bulk & Custom Order Form">Bulk & Custom Orders</option>
                  <option value="Live Video Workshop Tour Request">Live Video Tours</option>
                  <option value="Manual Staff Entry">Manual Staff Entry</option>
                </select>
              </div>
            </div>

            {/* Leads Table */}
            <div className="rounded-3xl bg-white border border-ink/10 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-ink">
                  <thead className="bg-[#FAF4EC] border-b border-ink/10 text-[11px] font-bold uppercase tracking-wider text-ink/70">
                    <tr>
                      <th className="px-5 py-3.5">Ref ID & Date</th>
                      <th className="px-5 py-3.5">Customer & Studio</th>
                      <th className="px-5 py-3.5">Products & Quantity</th>
                      <th className="px-5 py-3.5">Total / Tier</th>
                      <th className="px-5 py-3.5">Pipeline Stage</th>
                      <th className="px-5 py-3.5 text-right">Quick Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-ink/10">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-ink/50">
                          <AlertCircle className="mx-auto mb-2 text-ink/30" size={28} />
                          No leads matching your current filter.
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => {
                        const statusObj =
                          LEAD_STATUSES.find((s) => s.id === lead.status) || LEAD_STATUSES[0]
                        return (
                          <tr
                            key={lead.id}
                            className="hover:bg-rose/5 transition-colors cursor-pointer group"
                            onClick={() => setSelectedLead(lead)}
                          >
                            <td className="px-5 py-4">
                              <span className="font-mono font-bold text-rose">{lead.refId}</span>
                              <p className="text-[10px] text-ink/50 mt-0.5">{lead.timestamp}</p>
                              <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-ink/5 text-ink/60 font-medium">
                                {lead.source}
                              </span>
                            </td>

                            <td className="px-5 py-4">
                              <span className="font-serif text-sm font-bold text-ink group-hover:text-rose transition-colors">
                                {lead.name}
                              </span>
                              {lead.company && lead.company !== 'Direct Customer' && (
                                <p className="text-[11px] text-ink/60 flex items-center gap-1 mt-0.5">
                                  <Building2 size={11} /> {lead.company}
                                </p>
                              )}
                              <p className="text-[11px] text-ink/70 mt-1 font-mono">{lead.phone}</p>
                            </td>

                            <td className="px-5 py-4 max-w-xs">
                              <p className="font-semibold text-ink line-clamp-2">{lead.products}</p>
                              <p className="text-[11px] text-ink/60 mt-0.5 font-mono">Qty: {lead.quantity}</p>
                            </td>

                            <td className="px-5 py-4">
                              <span className="font-serif text-sm font-bold text-rose">
                                {lead.totalAmount || 'Per Quotation'}
                              </span>
                              <p className="text-[10px] text-ink/50 mt-0.5">{lead.timeline}</p>
                            </td>

                            <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                              <select
                                value={lead.status}
                                onChange={(e) => handleStatusChange(lead.id, e.target.value)}
                                className={`rounded-xl border px-3 py-1.5 text-xs font-bold cursor-pointer transition shadow-xs ${statusObj.color}`}
                              >
                                {LEAD_STATUSES.map((st) => (
                                  <option key={st.id} value={st.id}>
                                    {st.label}
                                  </option>
                                ))}
                              </select>
                            </td>

                            <td className="px-5 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                              <div className="flex items-center justify-end gap-1.5">
                                <a
                                  href={generateWhatsAppMessage(
                                    lead,
                                    lead.source.includes('Bulk') ? 'quote' : 'confirm'
                                  )}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Chat on WhatsApp"
                                  className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition shadow-xs"
                                >
                                  <MessageCircle size={15} />
                                </a>

                                <button
                                  type="button"
                                  title="Print Packing Slip"
                                  onClick={() => printLeadPackingSlip(lead)}
                                  className="grid h-8 w-8 place-items-center rounded-xl bg-ink/5 text-ink hover:bg-ink hover:text-white transition"
                                >
                                  <Printer size={15} />
                                </button>

                                <button
                                  type="button"
                                  title="Delete Lead"
                                  onClick={() => handleDeleteLead(lead.id)}
                                  className="grid h-8 w-8 place-items-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: PRODUCT CATALOG MANAGER */}
        {/* ==================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-ink">Product Catalog & Pricing</h3>
                <p className="text-xs text-ink/60">
                  Upload new quilted collections, modify prices, update badges, or toggle stock availability in real time.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#962325] transition shadow-md shadow-rose/25"
                >
                  <Plus size={16} /> Add New Product
                </button>
              </div>
            </div>

            {/* Catalog Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allProducts.map((product) => (
                <div
                  key={product.id}
                  className="rounded-3xl border border-ink/10 bg-white p-5 shadow-sm flex flex-col justify-between hover:shadow-lg transition group"
                >
                  <div>
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-ivory border border-ink/10">
                      <img
                        src={resolveProductImage(product.image)}
                        alt={product.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 rounded-full bg-rose px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                          {product.badge}
                        </span>
                      )}
                      <span className="absolute bottom-3 right-3 rounded-full bg-ink/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-saffron backdrop-blur-sm">
                        {product.category}
                      </span>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-serif text-lg font-bold text-ink group-hover:text-rose transition-colors">
                          {product.name}
                        </h4>
                        <span className="font-serif text-base font-bold text-rose shrink-0">
                          {product.price}
                        </span>
                      </div>
                      <p className="text-xs text-ink/60 mt-1 line-clamp-2">{product.description}</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-ink/10 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingProduct(product)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl border border-ink/20 bg-ink/5 px-3 py-2 text-xs font-bold text-ink hover:bg-rose hover:text-white transition"
                    >
                      <Edit3 size={14} /> Edit Details
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete product "${product.name}" from catalog?`)) {
                          deleteProduct(product.id)
                        }
                      }}
                      className="grid h-8 w-8 place-items-center rounded-xl bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                      title="Delete Product"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: SOCIAL PROOF & LIVE POPUPS MANAGER */}
        {/* ==================================================== */}
        {activeTab === 'popups' && (
          <div className="space-y-6">
            {/* Header & Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-ink">Social Proof & Order Popups</h3>
                <p className="text-xs text-ink/60">
                  Manage the verified order badges and live buyer notifications shown to store visitors.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddPopupModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-xl bg-rose px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-[#962325] transition shadow-md shadow-rose/25"
                >
                  <Plus size={16} /> Add Order Popup
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Reset all popup settings and notifications back to defaults?')) {
                      const res = resetPopupsToDefault()
                      setPopupConfig(res.config)
                      setPopupItems(res.items)
                    }
                  }}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-ink/20 bg-white px-3 py-2.5 text-xs font-bold text-ink hover:bg-ink hover:text-white transition"
                >
                  <RefreshCw size={14} /> Reset
                </button>
              </div>
            </div>

            {/* Global Settings Card */}
            <div className="rounded-3xl bg-white border border-ink/10 p-6 shadow-sm space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-ink/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-2xl flex items-center justify-center font-bold ${
                    popupConfig.isEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-ink/5 text-ink/40'
                  }`}>
                    <BellRing size={22} />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-ink">Live Storefront Popups Switch</h4>
                    <p className="text-xs text-ink/60">Toggle all recent order notifications on or off globally across the website.</p>
                  </div>
                </div>

                {/* Master Toggle */}
                <button
                  type="button"
                  onClick={() => handleUpdatePopupConfig('isEnabled', !popupConfig.isEnabled)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition ${
                    popupConfig.isEnabled
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/25'
                      : 'bg-ink/10 text-ink/60'
                  }`}
                >
                  {popupConfig.isEnabled ? (
                    <>
                      <CheckCircle2 size={16} /> Popups Active (Live)
                    </>
                  ) : (
                    <>
                      <X size={16} /> Popups Paused
                    </>
                  )}
                </button>
              </div>

              {/* Timing & Mode Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1.5">
                    Notification Mode
                  </label>
                  <select
                    value={popupConfig.mode}
                    onChange={(e) => handleUpdatePopupConfig('mode', e.target.value)}
                    className="w-full rounded-xl border border-ink/20 bg-white px-3 py-2 outline-none focus:border-rose"
                  >
                    <option value="hybrid">🌟 Hybrid (Staff List + Worldwide Auto)</option>
                    <option value="custom_only">📋 Staff Curated List Only</option>
                    <option value="dynamic_only">🌐 Global Auto-Generator Only</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1.5">
                    Display Cadence (Interval)
                  </label>
                  <select
                    value={popupConfig.displayInterval}
                    onChange={(e) => handleUpdatePopupConfig('displayInterval', Number(e.target.value))}
                    className="w-full rounded-xl border border-ink/20 bg-white px-3 py-2 outline-none focus:border-rose"
                  >
                    <option value={10}>⚡ High Urgency (Every 10 seconds)</option>
                    <option value={18}>🎯 Standard Balanced (Every 18 seconds)</option>
                    <option value={30}>🌿 Subtle (Every 30 seconds)</option>
                    <option value={60}>🛋️ Relaxed (Every 60 seconds)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1.5">
                    Display Stay Duration
                  </label>
                  <select
                    value={popupConfig.displayDuration}
                    onChange={(e) => handleUpdatePopupConfig('displayDuration', Number(e.target.value))}
                    className="w-full rounded-xl border border-ink/20 bg-white px-3 py-2 outline-none focus:border-rose"
                  >
                    <option value={4}>4 seconds on screen</option>
                    <option value={5.5}>5.5 seconds (Recommended)</option>
                    <option value={7}>7 seconds on screen</option>
                  </select>
                </div>
              </div>

              {/* Test Fire Bar */}
              <div className="rounded-2xl bg-[#faf4ec] p-4 border border-ink/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-ink/80">
                  <Sparkles size={16} className="text-saffron shrink-0" />
                  <span>Want to preview how the notification appears on the storefront right now?</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleTriggerTestPopup(null)}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-ink px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose transition shrink-0"
                >
                  <Play size={13} /> Fire Test Popup Now
                </button>
              </div>
              {testTriggerFeedback && (
                <p className="text-xs font-semibold text-emerald-700">{testTriggerFeedback}</p>
              )}
            </div>

            {/* List of Active Social Proof Popups */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-serif text-lg font-bold text-ink">
                  Staff Curated Order Popups ({popupItems.length})
                </h4>
                <span className="text-xs text-ink/60">
                  {popupItems.filter((p) => p.isEnabled).length} active · {popupItems.filter((p) => !p.isEnabled).length} paused
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popupItems.map((item) => (
                  <div
                    key={item.id}
                    className={`rounded-2xl border p-4 transition-all duration-300 flex flex-col justify-between ${
                      item.isEnabled
                        ? 'bg-white border-ink/15 shadow-sm hover:shadow-md'
                        : 'bg-gray-50/80 border-dashed border-gray-300 opacity-60'
                    }`}
                  >
                    <div>
                      {/* Ribbon */}
                      <div className="flex items-center justify-between gap-1 mb-2">
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose/10 px-2 py-0.5 text-[10px] font-bold text-rose">
                          <PackageCheck size={11} /> {item.badge}
                        </span>
                        <span className="text-[10px] font-semibold text-terracotta bg-saffron/10 px-2 py-0.5 rounded-full">
                          {item.tag}
                        </span>
                      </div>

                      {/* Details with Thumbnail */}
                      <div className="flex gap-3 items-center">
                        <div className="h-14 w-14 rounded-xl overflow-hidden border border-ink/10 bg-ivory shrink-0">
                          <img
                            src={resolveProductImage(item.productImage)}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1 text-xs">
                            <strong className="text-ink truncate">{item.buyerName}</strong>
                            <span className="text-ink/40">•</span>
                            <span className="text-terracotta font-medium flex items-center gap-0.5 shrink-0 text-[11px]">
                              <MapPin size={10} className="text-rose" /> {item.city}
                            </span>
                          </div>
                          <p className="text-[11px] text-ink/70 mt-0.5">
                            Order: <strong className="text-rose font-semibold">{item.quantity}</strong>
                          </p>
                          <h5 className="font-bold text-xs text-ink truncate mt-0.5">{item.productName}</h5>
                          <span className="text-[10px] text-ink/40">{item.timeAgo}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="mt-4 pt-3 border-t border-ink/10 flex items-center justify-between gap-2 text-xs">
                      {/* Active/Pause Toggle */}
                      <button
                        type="button"
                        onClick={() => handleTogglePopupItem(item.id, item.isEnabled)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg font-bold text-[11px] transition ${
                          item.isEnabled
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                            : 'bg-ink/5 text-ink/50 hover:bg-ink/10'
                        }`}
                      >
                        {item.isEnabled ? 'Active' : 'Paused'}
                      </button>

                      <div className="flex items-center gap-1">
                        {/* Trigger test */}
                        <button
                          type="button"
                          onClick={() => handleTriggerTestPopup(item)}
                          title="Test fire this popup"
                          className="grid h-7 w-7 place-items-center rounded-lg bg-ink/5 text-ink hover:bg-rose hover:text-white transition"
                        >
                          <Play size={12} />
                        </button>

                        {/* Edit */}
                        <button
                          type="button"
                          onClick={() => setEditingPopup(item)}
                          title="Edit Popup Details"
                          className="grid h-7 w-7 place-items-center rounded-lg bg-ink/5 text-ink hover:bg-ink hover:text-white transition"
                        >
                          <Edit3 size={12} />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeletePopupItem(item.id)}
                          title="Delete Popup"
                          className="grid h-7 w-7 place-items-center rounded-lg bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 5: STORE SETTINGS & SECURITY */}
        {/* ==================================================== */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6">
            <div>
              <h3 className="font-serif text-2xl font-bold text-ink">Store Settings & Staff Security</h3>
              <p className="text-xs text-ink/60">
                Manage your staff authentication PIN, test webhook endpoints, and download catalog backups.
              </p>
            </div>

            {/* Change PIN Card */}
            <div className="rounded-3xl bg-white border border-ink/10 p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-rose/10 text-rose flex items-center justify-center">
                  <KeyRound size={20} />
                </div>
                <div>
                  <h4 className="font-serif text-base font-bold text-ink">Change Staff Master PIN</h4>
                  <p className="text-xs text-ink/60">Update the passcode required to access this staff portal.</p>
                </div>
              </div>

              <form onSubmit={handleChangePin} className="space-y-3">
                <div className="max-w-xs">
                  <input
                    type="password"
                    maxLength={10}
                    placeholder="Enter new 4-digit PIN"
                    value={newMasterPin}
                    onChange={(e) => {
                      setNewMasterPin(e.target.value)
                      setPinChangeMsg('')
                    }}
                    className="w-full rounded-xl border border-ink/20 bg-white px-3.5 py-2.5 text-xs text-ink outline-none focus:border-rose focus:ring-2 focus:ring-rose/20"
                  />
                </div>
                {pinChangeMsg && (
                  <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={14} /> {pinChangeMsg}
                  </p>
                )}
                <button
                  type="submit"
                  className="rounded-xl bg-ink px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-rose transition cursor-pointer"
                >
                  Update Master PIN
                </button>
              </form>
            </div>

            {/* Inactivity Auto-Logout Timeout Settings */}
            <div className="rounded-3xl bg-white border border-ink/10 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-ink">Auto-Lock Inactivity Timer</h4>
                    <p className="text-xs text-ink/60">
                      Automatically locks the staff portal when no mouse, keyboard, touch, or scroll activity is detected.
                    </p>
                  </div>
                </div>
                <span className="rounded-full bg-amber-100 text-amber-900 px-3 py-1 text-xs font-bold">
                  {idleTimeoutMin} min timeout
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {[
                  { label: '2 Minutes (High Security)', val: 2 },
                  { label: '5 Minutes (Recommended)', val: 5 },
                  { label: '10 Minutes', val: 10 },
                  { label: '15 Minutes', val: 15 },
                ].map((opt) => (
                  <button
                    key={opt.val}
                    type="button"
                    onClick={() => handleUpdateIdleTimeout(opt.val)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition cursor-pointer ${
                      idleTimeoutMin === opt.val
                        ? 'bg-rose text-white shadow'
                        : 'border border-ink/10 bg-ink/5 text-ink/80 hover:bg-ink/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {idleChangeMsg && (
                <p className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <CheckCircle2 size={14} /> {idleChangeMsg}
                </p>
              )}

              <p className="text-[11px] text-ink/50 bg-[#faf4ec] p-3 rounded-xl border border-ink/5">
                🔒 <strong>Atelier Security Policy:</strong> Every login requires entering the staff PIN. If the screen is left idle for {idleTimeoutMin} minutes, the session immediately locks to protect client leads and order records.
              </p>
            </div>

            {/* Google Sheets Webhook Integration Info */}
            <div className="rounded-3xl bg-white border border-ink/10 p-6 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <h4 className="font-serif text-base font-bold text-ink">Google Apps Script Webhook</h4>
                    <p className="text-xs text-ink/60">Target endpoint for automatic sheet synchronization</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-100 text-emerald-800 px-3 py-1 text-xs font-bold">
                  Active & Connected
                </span>
              </div>
              <p className="text-xs font-mono bg-ink/5 p-3 rounded-xl break-all text-ink/70">
                {GOOGLE_SHEET_WEB_APP_URL}
              </p>
            </div>

            {/* Factory Reset Catalog */}
            <div className="rounded-3xl bg-red-50/50 border border-red-200 p-6 shadow-sm space-y-3">
              <h4 className="font-serif text-base font-bold text-red-900">Reset Catalog to Factory Defaults</h4>
              <p className="text-xs text-red-700">
                Clear all custom staff products and price overrides, restoring original atelier collections.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Are you sure you want to reset all custom products and price edits to factory defaults?')) {
                    resetCatalogToDefaults()
                    alert('Catalog reset to factory defaults.')
                  }
                }}
                className="rounded-xl bg-red-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-red-700 transition"
              >
                Reset to Defaults
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ==================================================== */}
      {/* MODAL 1: LEAD DETAIL & KARIGAR NOTES DRAWER */}
      {/* ==================================================== */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-ink/10 space-y-6">
            <div className="flex items-start justify-between border-b border-ink/10 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold text-rose">{selectedLead.refId}</span>
                  <span className="rounded-md bg-rose/10 text-rose px-2 py-0.5 text-[10px] font-bold uppercase">
                    {selectedLead.status}
                  </span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-ink mt-1">{selectedLead.name}</h3>
                <p className="text-xs text-ink/60">{selectedLead.source} · {selectedLead.timestamp}</p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 text-ink hover:bg-rose hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="rounded-2xl bg-[#faf4ec] p-4 border border-ink/10 space-y-1.5">
                <p className="font-bold text-[11px] uppercase tracking-wider text-rose">Contact Details</p>
                <div><strong>Phone / WhatsApp:</strong> {selectedLead.phone || 'N/A'}</div>
                <div><strong>Email:</strong> {selectedLead.email || 'N/A'}</div>
                <div><strong>Company:</strong> {selectedLead.company || 'N/A'}</div>
              </div>

              <div className="rounded-2xl bg-[#faf4ec] p-4 border border-ink/10 space-y-1.5">
                <p className="font-bold text-[11px] uppercase tracking-wider text-rose">Order Details</p>
                <div><strong>Quantity:</strong> {selectedLead.quantity}</div>
                <div><strong>Total Amount:</strong> {selectedLead.totalAmount || 'Per Quotation'}</div>
                <div><strong>Timeline:</strong> {selectedLead.timeline || 'Immediate'}</div>
              </div>
            </div>

            <div className="rounded-2xl border border-ink/10 p-4 bg-white">
              <p className="font-bold text-[11px] uppercase tracking-wider text-ink/60 mb-1">Products Requested</p>
              <p className="text-sm font-semibold text-ink">{selectedLead.products}</p>
              {selectedLead.notes && (
                <p className="text-xs text-ink/70 mt-2 bg-ink/5 p-2.5 rounded-xl">
                  <strong>Customer Note:</strong> {selectedLead.notes}
                </p>
              )}
              {selectedLead.address && (
                <p className="text-xs text-ink/70 mt-2 bg-ink/5 p-2.5 rounded-xl">
                  <strong>Delivery Address:</strong> {selectedLead.address}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <p className="font-bold text-[11px] uppercase tracking-wider text-ink/60">
                1-Click WhatsApp Client Triggers
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                <a
                  href={generateWhatsAppMessage(selectedLead, 'confirm')}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-emerald-500/40 bg-emerald-50 text-emerald-800 p-2.5 text-center font-bold hover:bg-emerald-500 hover:text-white transition flex flex-col items-center gap-1"
                >
                  <MessageCircle size={15} /> Confirm Order
                </a>
                <a
                  href={generateWhatsAppMessage(selectedLead, 'quote')}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-blue-500/40 bg-blue-50 text-blue-800 p-2.5 text-center font-bold hover:bg-blue-500 hover:text-white transition flex flex-col items-center gap-1"
                >
                  <FileText size={15} /> Send Rate Card
                </a>
                <a
                  href={generateWhatsAppMessage(selectedLead, 'video_tour')}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-purple-500/40 bg-purple-50 text-purple-800 p-2.5 text-center font-bold hover:bg-purple-500 hover:text-white transition flex flex-col items-center gap-1"
                >
                  <Video size={15} /> Video Call Link
                </a>
                <a
                  href={generateWhatsAppMessage(selectedLead, 'dispatch')}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-amber-500/40 bg-amber-50 text-amber-800 p-2.5 text-center font-bold hover:bg-amber-500 hover:text-white transition flex flex-col items-center gap-1"
                >
                  <Truck size={15} /> Dispatch Tracking
                </a>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-ink/10">
              <p className="font-bold text-[11px] uppercase tracking-wider text-ink/60">
                Internal Karigar & Staff Notes
              </p>

              <form onSubmit={handleAddNote} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. Fabric sample verified with master block-printer / Advance 50% received..."
                  value={newStaffNoteText}
                  onChange={(e) => setNewStaffNoteText(e.target.value)}
                  className="flex-1 rounded-xl border border-ink/20 px-3 py-2 text-xs outline-none focus:border-rose"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-ink text-white px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-rose transition"
                >
                  Add Note
                </button>
              </form>

              <div className="space-y-2 max-h-36 overflow-y-auto">
                {selectedLead.staffNotes && selectedLead.staffNotes.length > 0 ? (
                  selectedLead.staffNotes.map((note) => (
                    <div key={note.id} className="rounded-xl bg-[#FAF6F0] p-3 text-xs border border-ink/5">
                      <div className="flex justify-between text-[10px] text-ink/50 font-semibold mb-1">
                        <span>{note.author}</span>
                        <span>{note.timestamp}</span>
                      </div>
                      <p className="text-ink/80">{note.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-ink/40 italic">No staff notes recorded yet.</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-ink/10 pt-4">
              <button
                type="button"
                onClick={() => printLeadPackingSlip(selectedLead)}
                className="inline-flex items-center gap-2 rounded-xl border border-ink/20 px-4 py-2.5 text-xs font-bold text-ink hover:bg-ink hover:text-white transition"
              >
                <Printer size={15} /> Print Dispatch Slip
              </button>

              <button
                type="button"
                onClick={() => setSelectedLead(null)}
                className="rounded-xl bg-rose text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-[#962325] transition"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 2: ADD MANUAL LEAD */}
      {/* ==================================================== */}
      {isAddLeadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-ink/10 space-y-4">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <h3 className="font-serif text-xl font-bold text-ink">Log Offline / Manual Inbound Lead</h3>
              <button
                type="button"
                onClick={() => setIsAddLeadModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 hover:bg-rose hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const fd = new FormData(e.target)
                addInboundLead({
                  name: fd.get('name'),
                  phone: fd.get('phone'),
                  email: fd.get('email'),
                  company: fd.get('company') || 'Offline Customer',
                  products: fd.get('products'),
                  quantity: fd.get('quantity'),
                  totalAmount: fd.get('totalAmount'),
                  timeline: fd.get('timeline') || 'Immediate',
                  source: 'Manual Staff Entry',
                  notes: fd.get('notes'),
                })
                setLeads(getStoredLeads())
                setIsAddLeadModalOpen(false)
                alert('Manual lead recorded in CRM!')
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Customer Name *</label>
                <input required name="name" placeholder="e.g. Pooja Singhania" className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Phone / WhatsApp *</label>
                  <input required name="phone" placeholder="+91 98..." className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose" />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Email</label>
                  <input name="email" placeholder="customer@domain.com" className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose" />
                </div>
              </div>
              <div>
                <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Items / Products *</label>
                <input required name="products" placeholder="e.g. Quilted Duffle Bag (x10)" className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Quantity</label>
                  <input name="quantity" placeholder="e.g. 10 pcs" className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose" />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Total Amount (₹)</label>
                  <input name="totalAmount" placeholder="e.g. ₹14,990" className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose" />
                </div>
              </div>
              <div>
                <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Notes</label>
                <textarea name="notes" rows={2} placeholder="Custom notes / requirements..." className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose resize-none" />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-ink/10">
                <button type="button" onClick={() => setIsAddLeadModalOpen(false)} className="px-4 py-2 rounded-xl text-ink hover:bg-ink/5">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-rose text-white font-bold uppercase tracking-wider hover:bg-[#962325]">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 3: ADD NEW PRODUCT */}
      {/* ==================================================== */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-ink/10 space-y-4">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">Upload & Publish New Product</h3>
                <p className="text-xs text-ink/60">Adds product directly to the live customer storefront</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 hover:bg-rose hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Product Title *</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Saffron Marigold Quilted Tote Bag"
                  value={newProductForm.name}
                  onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                  className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 outline-none focus:border-rose focus:ring-2 focus:ring-rose/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Category *</label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 outline-none focus:border-rose bg-white"
                  >
                    <option value="Duffle Bag">Duffle Bag</option>
                    <option value="Pouch">Pouch</option>
                    <option value="Tote Bag">Tote Bag</option>
                    <option value="Vanity Box">Vanity Box</option>
                    <option value="Yoga Mat Bag">Yoga Mat Bag</option>
                    <option value="Organizer">Organizer</option>
                    <option value="Laptop Sleeve">Laptop Sleeve</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Price in ₹ *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. ₹1,499"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 outline-none focus:border-rose focus:ring-2 focus:ring-rose/20 font-bold text-rose"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Badge Tag</label>
                  <select
                    value={newProductForm.badge}
                    onChange={(e) => setNewProductForm({ ...newProductForm, badge: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 outline-none focus:border-rose bg-white"
                  >
                    <option value="New Arrival">New Arrival</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Trending">Trending</option>
                    <option value="Limited Edition">Limited Edition</option>
                    <option value="Artisan Classic">Artisan Classic</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Stock Status</label>
                  <select
                    value={newProductForm.status}
                    onChange={(e) => setNewProductForm({ ...newProductForm, status: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 outline-none focus:border-rose bg-white"
                  >
                    <option value="in_stock">In Stock (Ready to Dispatch)</option>
                    <option value="made_to_order">Made to Order (2-3 Weeks)</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block font-bold uppercase tracking-wider text-ink/70">Product Image</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setImageUploadType('file')}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                      imageUploadType === 'file' ? 'bg-rose text-white border-rose' : 'bg-ink/5 text-ink'
                    }`}
                  >
                    Upload from Device
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadType('asset')}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                      imageUploadType === 'asset' ? 'bg-rose text-white border-rose' : 'bg-ink/5 text-ink'
                    }`}
                  >
                    Select Atelier Photo
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageUploadType('url')}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold ${
                      imageUploadType === 'url' ? 'bg-rose text-white border-rose' : 'bg-ink/5 text-ink'
                    }`}
                  >
                    Image URL
                  </button>
                </div>

                {imageUploadType === 'file' && (
                  <div className="border-2 border-dashed border-ink/20 rounded-2xl p-4 text-center">
                    <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" id="staff-img-file" />
                    <label htmlFor="staff-img-file" className="cursor-pointer flex flex-col items-center gap-1.5 text-xs text-rose font-bold">
                      <Upload size={20} />
                      <span>Click to choose image file</span>
                    </label>
                  </div>
                )}

                {imageUploadType === 'asset' && (
                  <div className="grid grid-cols-4 gap-2 max-h-36 overflow-y-auto p-2 bg-[#faf4ec] rounded-xl border border-ink/10">
                    {AVAILABLE_SAMPLE_IMAGES.map((imgName) => (
                      <div
                        key={imgName}
                        onClick={() => setNewProductForm({ ...newProductForm, image: imgName })}
                        className={`cursor-pointer aspect-square rounded-lg overflow-hidden border-2 transition ${
                          newProductForm.image === imgName ? 'border-rose ring-2 ring-rose/30' : 'border-transparent'
                        }`}
                      >
                        <img src={resolveProductImage(imgName)} alt="" className="h-full w-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}

                {imageUploadType === 'url' && (
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={newProductForm.image}
                    onChange={(e) => setNewProductForm({ ...newProductForm, image: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3.5 py-2 outline-none focus:border-rose"
                  />
                )}
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Description & Craft Story</label>
                <textarea
                  rows={2}
                  placeholder="Quilted pure cotton artisan piece created with natural dyes..."
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full rounded-xl border border-ink/20 px-3.5 py-2 outline-none focus:border-rose resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setIsAddProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-ink font-semibold hover:bg-ink/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose text-white font-bold uppercase tracking-wider hover:bg-[#962325] shadow-md shadow-rose/25"
                >
                  Publish to Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 4: EDIT EXISTING PRODUCT */}
      {/* ==================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-ink/10 space-y-4">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <h3 className="font-serif text-xl font-bold text-ink">Edit Product Details</h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 hover:bg-rose hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSaveProductEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Product Title</label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 outline-none focus:border-rose font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Price (e.g. ₹1,599)</label>
                  <input
                    type="text"
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3.5 py-2.5 outline-none focus:border-rose font-bold text-rose"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Badge Tag</label>
                  <select
                    value={editingProduct.badge || 'New Arrival'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, badge: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3 py-2.5 outline-none focus:border-rose bg-white"
                  >
                    <option value="New Arrival">New Arrival</option>
                    <option value="Bestseller">Bestseller</option>
                    <option value="Trending">Trending</option>
                    <option value="Limited Edition">Limited Edition</option>
                    <option value="Artisan Classic">Artisan Classic</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full rounded-xl border border-ink/20 px-3.5 py-2 outline-none focus:border-rose resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2.5 rounded-xl text-ink hover:bg-ink/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose text-white font-bold uppercase tracking-wider hover:bg-[#962325]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 5: ADD NEW ORDER POPUP */}
      {/* ==================================================== */}
      {isAddPopupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-ink/10 space-y-4">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-ink">Add Social Proof Order Notification</h3>
                <p className="text-xs text-ink/60">Simulate or display a verified customer order popup</p>
              </div>
              <button
                type="button"
                onClick={() => setIsAddPopupModalOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 hover:bg-rose hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreatePopupSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Customer / Client Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Zara Al-Mansoor"
                    value={newPopupForm.buyerName}
                    onChange={(e) => setNewPopupForm({ ...newPopupForm, buyerName: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">City & Country *</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Dubai, UAE"
                    value={newPopupForm.city}
                    onChange={(e) => setNewPopupForm({ ...newPopupForm, city: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Select Product *</label>
                <select
                  value={newPopupForm.productName}
                  onChange={(e) => {
                    const sel = products.find((p) => p.name === e.target.value)
                    setNewPopupForm({
                      ...newPopupForm,
                      productName: e.target.value,
                      productImage: sel?.image || newPopupForm.productImage,
                    })
                  }}
                  className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose bg-white"
                >
                  {products.map((p) => (
                    <option key={p.id || p.name} value={p.name}>
                      {p.name} ({p.price})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Order Quantity / Batch</label>
                  <input
                    type="text"
                    placeholder="e.g. 50 pieces (Boutique Tier)"
                    value={newPopupForm.quantity}
                    onChange={(e) => setNewPopupForm({ ...newPopupForm, quantity: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Time text</label>
                  <input
                    type="text"
                    placeholder="e.g. 12 minutes ago"
                    value={newPopupForm.timeAgo}
                    onChange={(e) => setNewPopupForm({ ...newPopupForm, timeAgo: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Ribbon Badge</label>
                  <select
                    value={newPopupForm.badge}
                    onChange={(e) => setNewPopupForm({ ...newPopupForm, badge: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose bg-white"
                  >
                    <option value="Bulk Order Placed">Bulk Order Placed</option>
                    <option value="Custom Batch Placed">Custom Batch Placed</option>
                    <option value="Sample Trial Placed">Sample Trial Placed</option>
                    <option value="International Export">International Export</option>
                    <option value="Corporate Gifting">Corporate Gifting</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Sub-tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Monogram Favors"
                    value={newPopupForm.tag}
                    onChange={(e) => setNewPopupForm({ ...newPopupForm, tag: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setIsAddPopupModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-ink hover:bg-ink/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose text-white font-bold uppercase tracking-wider hover:bg-[#962325]"
                >
                  Save Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* MODAL 6: EDIT EXISTING POPUP */}
      {/* ==================================================== */}
      {editingPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-ink/10 space-y-4">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3">
              <h3 className="font-serif text-xl font-bold text-ink">Edit Order Notification</h3>
              <button
                type="button"
                onClick={() => setEditingPopup(null)}
                className="grid h-8 w-8 place-items-center rounded-full bg-ink/5 hover:bg-rose hover:text-white transition"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSavePopupEdit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Customer Name</label>
                  <input
                    type="text"
                    value={editingPopup.buyerName}
                    onChange={(e) => setEditingPopup({ ...editingPopup, buyerName: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">City & Country</label>
                  <input
                    type="text"
                    value={editingPopup.city}
                    onChange={(e) => setEditingPopup({ ...editingPopup, city: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Product</label>
                <input
                  type="text"
                  value={editingPopup.productName}
                  onChange={(e) => setEditingPopup({ ...editingPopup, productName: e.target.value })}
                  className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Quantity</label>
                  <input
                    type="text"
                    value={editingPopup.quantity}
                    onChange={(e) => setEditingPopup({ ...editingPopup, quantity: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase tracking-wider text-ink/70 mb-1">Time Text</label>
                  <input
                    type="text"
                    value={editingPopup.timeAgo}
                    onChange={(e) => setEditingPopup({ ...editingPopup, timeAgo: e.target.value })}
                    className="w-full rounded-xl border border-ink/20 px-3 py-2 outline-none focus:border-rose"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-ink/10">
                <button
                  type="button"
                  onClick={() => setEditingPopup(null)}
                  className="px-4 py-2.5 rounded-xl text-ink hover:bg-ink/5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-rose text-white font-bold uppercase tracking-wider hover:bg-[#962325]"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
