/**
 * CRAFT OF PINK CITY - Social Proof & Sales Popups Manager
 * Allows staff to view, customize, toggle, and create simulated/verified order notifications.
 */

const POPUP_CONFIG_KEY = 'cpc_sales_popup_config_v2'
const CUSTOM_POPUPS_KEY = 'cpc_sales_custom_popups_v2'

export const DEFAULT_POPUP_CONFIG = {
  isEnabled: true,
  displayInterval: 18, // seconds between popups
  displayDuration: 5.5, // seconds popup stays on screen
  mode: 'hybrid', // 'custom_only' | 'dynamic_only' | 'hybrid'
  showVerifiedBadge: true,
  showOnMobile: true,
}

export const DEFAULT_POPUP_ITEMS = [
  {
    id: 'pop-1',
    buyerName: 'Louis Carter',
    city: 'Porto, Portugal',
    country: 'Portugal',
    productName: 'Royal Bengal Tiger Quilted Yoga Bag',
    productImage: 'yoga-bag-magenta-tiger.jpg',
    quantity: '15 pieces (Sample Trial)',
    badge: 'Custom Batch Placed',
    tag: 'Monogram Favors',
    timeAgo: '18 minutes ago',
    isEnabled: true,
  },
  {
    id: 'pop-2',
    buyerName: 'Eva Chen',
    city: 'Madrid, Spain',
    country: 'Spain',
    productName: 'Mint & Berry Botanical Pouch Trio',
    productImage: 'pouch-mint-berry-trio.jpg',
    quantity: '75 units (Boutique Order)',
    badge: 'Bulk Order Placed',
    tag: 'Wedding Favors',
    timeAgo: '38 minutes ago',
    isEnabled: true,
  },
  {
    id: 'pop-3',
    buyerName: 'Sophie Laurent',
    city: 'Paris, France',
    country: 'France',
    productName: 'Blush Botanical Quilted Travel Duffle',
    productImage: 'duffle-blush-botanical-barrel.jpg',
    quantity: '40 pcs (Wholesale Batch)',
    badge: 'International Export',
    tag: 'Boutique Stock',
    timeAgo: '1 hour ago',
    isEnabled: true,
  },
  {
    id: 'pop-4',
    buyerName: 'Ananya Deshmukh',
    city: 'Mumbai, India',
    country: 'India',
    productName: 'Marigold Bloom Embroidered Pouch Trio',
    productImage: 'pouch-marigold-embroidered-trio.jpg',
    quantity: '120 pcs (Festive Hampers)',
    badge: 'Corporate Gifting',
    tag: 'Custom Logo Tags',
    timeAgo: '2 hours ago',
    isEnabled: true,
  },
  {
    id: 'pop-5',
    buyerName: 'Vikramaditya Rathore',
    city: 'Jaipur, India',
    country: 'India',
    productName: 'Sunshine Marigold Quilted Yoga Bag',
    productImage: 'yoga-bag-marigold-sunshine.jpg',
    quantity: '25 units (Studio Starter)',
    badge: 'Bulk Order Placed',
    tag: 'Yoga Studio Batch',
    timeAgo: '3 hours ago',
    isEnabled: true,
  },
  {
    id: 'pop-6',
    buyerName: 'Chloe & Liam Smith',
    city: 'London, UK',
    country: 'UK',
    productName: 'Candy Stripe Quilted Hair Tool Organizer',
    productImage: 'organizer-striped-hair-wrap.jpg',
    quantity: '50 units (Bridal Hampers)',
    badge: 'Wedding Batch',
    tag: 'Personalized Keepsakes',
    timeAgo: '4 hours ago',
    isEnabled: true,
  },
]

export function getPopupConfig() {
  try {
    const saved = localStorage.getItem(POPUP_CONFIG_KEY)
    if (saved) return { ...DEFAULT_POPUP_CONFIG, ...JSON.parse(saved) }
  } catch (e) {
    console.error('Failed to load popup config:', e)
  }
  return DEFAULT_POPUP_CONFIG
}

export function savePopupConfig(config) {
  try {
    localStorage.setItem(POPUP_CONFIG_KEY, JSON.stringify(config))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cpc-popup-config-updated', { detail: config }))
    }
  } catch (e) {
    console.error('Failed to save popup config:', e)
  }
}

export function getPopupItems() {
  try {
    const saved = localStorage.getItem(CUSTOM_POPUPS_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {
    console.error('Failed to load custom popup items:', e)
  }
  savePopupItems(DEFAULT_POPUP_ITEMS)
  return DEFAULT_POPUP_ITEMS
}

export function savePopupItems(items) {
  try {
    localStorage.setItem(CUSTOM_POPUPS_KEY, JSON.stringify(items))
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cpc-popup-items-updated', { detail: items }))
    }
  } catch (e) {
    console.error('Failed to save custom popup items:', e)
  }
}

export function addCustomPopup(item) {
  const current = getPopupItems()
  const newItem = {
    id: `pop-${Date.now()}`,
    buyerName: item.buyerName || 'Valued Client',
    city: item.city || 'Jaipur, India',
    country: item.country || 'India',
    productName: item.productName || 'Quilted Cotton Bag',
    productImage: item.productImage || 'duffle-blush-botanical-barrel.jpg',
    quantity: item.quantity || '25 pcs (Bulk Tier)',
    badge: item.badge || 'Bulk Order Placed',
    tag: item.tag || 'Artisan Batch',
    timeAgo: item.timeAgo || 'Just now',
    isEnabled: true,
  }
  const updated = [newItem, ...current]
  savePopupItems(updated)
  return updated
}

export function updateCustomPopup(id, updatedFields) {
  const current = getPopupItems()
  const updated = current.map((p) => (p.id === id ? { ...p, ...updatedFields } : p))
  savePopupItems(updated)
  return updated
}

export function deleteCustomPopup(id) {
  const current = getPopupItems()
  const updated = current.filter((p) => p.id !== id)
  savePopupItems(updated)
  return updated
}

export function resetPopupsToDefault() {
  savePopupConfig(DEFAULT_POPUP_CONFIG)
  savePopupItems(DEFAULT_POPUP_ITEMS)
  return { config: DEFAULT_POPUP_CONFIG, items: DEFAULT_POPUP_ITEMS }
}
