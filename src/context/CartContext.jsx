import { createContext, useContext, useState, useEffect } from 'react'
import { whatsapp, whatsappNumber } from '../data/products'

const CartContext = createContext(null)

const CART_STORAGE_KEY = 'craft_pink_city_cart_v1'

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [lastAddedItem, setLastAddedItem] = useState(null)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch (e) {
      console.error('Failed to save cart to localStorage', e)
    }
  }, [items])

  // Helper to parse numeric price from string e.g. "₹1,449" or "₹1,499 (Set of 3)"
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0
    const match = priceStr.replace(/[^0-9]/g, '')
    return match ? parseInt(match, 10) : 0
  }

  // Add item to cart
  const addToCart = (product, quantity = 1) => {
    const unitPrice = parsePrice(product.price)
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://craftofpinkcity.shop'
    const productLink = `${baseUrl}/?product=${product.id || encodeURIComponent(product.name)}`

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => (item.id && item.id === product.id) || item.name === product.name
      )

      if (existingIndex > -1) {
        const updated = [...prev]
        updated[existingIndex].quantity += quantity
        return updated
      } else {
        return [
          ...prev,
          {
            id: product.id || product.name,
            name: product.name,
            price: product.price,
            unitPrice,
            image: product.image,
            category: product.category,
            link: productLink,
            quantity,
          },
        ]
      }
    })

    setLastAddedItem(product.name)
    setIsCartOpen(true)
  }

  // Update item quantity
  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  // Remove item
  const removeFromCart = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Clear cart
  const clearCart = () => {
    setItems([])
  }

  // Total quantity count
  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Subtotal in numeric and formatted INR
  const subtotalNumeric = items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  )
  const subtotalFormatted = subtotalNumeric.toLocaleString('en-IN')

  // Generate WhatsApp order message with product links
  const getWhatsAppCheckoutUrl = () => {
    if (items.length === 0) return whatsapp

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://craftofpinkcity.shop'
    const lines = [
      `*🌟 NEW ORDER - Craft of Pink City*`,
      `----------------------------------------`,
      `🛍️ *Items Ordered (${totalCount} total):*`,
      ``,
    ]

    items.forEach((item, idx) => {
      const itemTotal = (item.unitPrice * item.quantity).toLocaleString('en-IN')
      const link = `${baseUrl}/?product=${item.id}`
      lines.push(`${idx + 1}. *${item.name}*`)
      lines.push(`   • Qty: ${item.quantity} × ${item.price}`)
      lines.push(`   • Total: ₹${itemTotal}`)
      lines.push(`   • 🔗 Product Link: ${link}`)
      lines.push(``)
    })

    lines.push(`----------------------------------------`)
    lines.push(`📦 *Total Items:* ${totalCount}`)
    lines.push(`💰 *Grand Total:* ₹${subtotalFormatted}`)
    lines.push(`🚚 *Shipping:* Express Doorstep Delivery`)
    lines.push(`----------------------------------------`)
    lines.push(`Please confirm item availability, payment details, and dispatch timing. Thank you!`)

    const message = encodeURIComponent(lines.join('\n'))
    return `https://wa.me/${whatsappNumber}?text=${message}`
  }

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        totalCount,
        subtotalNumeric,
        subtotalFormatted,
        getWhatsAppCheckoutUrl,
        lastAddedItem,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
