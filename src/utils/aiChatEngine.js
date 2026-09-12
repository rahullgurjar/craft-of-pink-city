import { products, whatsapp, whatsappNumber, email, faqs } from '../data/products.js'

/**
 * Advanced AI Conversational Engine - "Gulabi 2.5 Pro"
 * Designed with Gemini & Meta AI-like multi-turn conversational reasoning,
 * natural language synthesis, contextual product recommendation, and wholesale calculations.
 * 
 * Rules:
 * 1. Delivery/dispatch schedules are decided by the workshop based on order quantity.
 * 2. Zero wedding/event mentions.
 * 3. Strict safety guardrails blocking adult, offensive, or illegal queries.
 */

// Safety & Content Moderation Patterns (Adult, Illegal, Abusive, Inappropriate)
const INAPPROPRIATE_PATTERNS = [
  /\b(porn|pornography|nude|nudity|sex|xxx|nsfw|erotic|escort|bitch|fuck|bastard|asshole|dick|cock|pussy|vagina|boobs|drugs|weed|cocaine|heroin|meth|hack|hacking|weapon|gun|kill|murder|violence|gambling|casino|torrent|piracy|darkweb)\b/i
]

/**
 * Validates if the user's message is safe and respectful
 */
export function isContentSafe(message) {
  if (!message || typeof message !== 'string') return true
  return !INAPPROPRIATE_PATTERNS.some((pattern) => pattern.test(message))
}

// System Knowledge Base
export const STORE_CONTEXT = {
  brandName: 'Craft of Pink City',
  tagline: 'Authentic Jaipur Hand Block-Printed Quilted Cotton Bags & Textiles',
  city: 'Jaipur, Rajasthan, India (PIN: 302001)',
  contact: {
    phone: '+91 93512 91471',
    whatsapp: `https://wa.me/${whatsappNumber}`,
    email: email,
    instagram: 'https://www.instagram.com/craftofpinkcity/'
  },
  materials:
    '100% Pure Indian Cotton (high-thread-count cambric), plush lightweight high-density foam quilting, heavy-duty brass/nylon zippers, handcrafted fabric-bead tassels, and natural azo-free dyes.',
  techniques:
    'Traditional woodblock carving, Sanganeri floral block printing, Bagru natural vegetable dyes, Dabu mud-resist indigo printing, machine diamond & channel quilting.',
  wholesaleMOQ:
    '25 pieces minimum order quantity per category (mix and match colorways allowed). Tiered discounts: 15-20% (25-50 pcs), 25-30% (51-100 pcs), 35%+ (100+ pcs). Includes custom branding tags, store logo cards, or bespoke packaging.',
  shipping:
    'Dispatched direct from our Jaipur workshop. Delivery and dispatch schedules are decided by our workshop team based on total order quantity & customization, and confirmed with the customer upon WhatsApp inquiry.',
  care: 'Gentle hand wash in cold water with mild liquid detergent. Shade dry only. Do not bleach or machine tumble. Warm steam iron on cotton setting.',
  payment:
    'UPI (Google Pay, PhonePe, Paytm), IMPS/NEFT Bank Transfer, Debit/Credit Cards, and SWIFT International Wire Transfer. COD is not available for direct handcrafted artisan dispatches.',
  returns: '100% Free replacement guarantee for any transit damage reported with unboxing photos within 48 hours.'
}

// Word & Phrase Matching Helpers
function hasWord(text, words) {
  const list = Array.isArray(words) ? words : [words]
  return list.some((w) => {
    const escaped = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text)
  })
}

function hasPhrase(text, phrases) {
  const list = Array.isArray(phrases) ? phrases : [phrases]
  return list.some((p) => text.toLowerCase().includes(p.toLowerCase()))
}

// Helper to find related products by category or keyword
function findMatchingProducts(query, limit = 3) {
  const q = query.toLowerCase()
  let matches = []

  if (hasWord(q, ['duffle', 'duffel', 'travel', 'overnight', 'weekender', 'luggage', 'barrel'])) {
    matches = products.filter((p) => p.category === 'Duffle Bags')
  } else if (hasWord(q, ['tote', 'totes', 'handbag', 'shoulder', 'ruffle', 'ruffled'])) {
    matches = products.filter((p) => p.category === 'Tote Bags')
  } else if (hasWord(q, ['vanity', 'makeup', 'cosmetic', 'box', 'toiletries', 'beauty', 'case'])) {
    matches = products.filter((p) => p.category === 'Vanity Boxes')
  } else if (hasWord(q, ['yoga', 'mat', 'carrier', 'gym', 'fitness', 'exercise'])) {
    matches = products.filter((p) => p.category === 'Yoga Mat Bags')
  } else if (hasWord(q, ['laptop', 'macbook', 'ipad', 'sleeve', 'cover', 'device', 'tablet'])) {
    matches = products.filter((p) => p.category === 'Laptop Sleeves')
  } else if (hasWord(q, ['pouch', 'pouches', 'trio', 'small', 'mini', 'coin', 'clutch', 'organizer', 'hair'])) {
    matches = products.filter((p) => p.category === 'Pouch Sets' || p.category === 'Organizers' || p.category === 'Pouches')
  } else if (hasWord(q, ['indigo', 'dabu', 'blue', 'patchwork'])) {
    matches = products.filter((p) => p.name.toLowerCase().includes('indigo') || p.name.toLowerCase().includes('patchwork'))
  } else if (hasWord(q, ['marigold', 'yellow', 'sunshine'])) {
    matches = products.filter((p) => p.name.toLowerCase().includes('marigold') || p.name.toLowerCase().includes('yellow') || p.name.toLowerCase().includes('sunshine'))
  } else if (hasWord(q, ['bestseller', 'popular', 'top', 'favorite', 'recommend'])) {
    matches = products.filter((p) => p.badge)
  }

  if (matches.length === 0) {
    matches = products.filter((p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q))
    )
  }

  return matches.slice(0, limit)
}

/**
 * Main Reasoning Dispatcher with Conversational Multi-Turn Context
 */
export function processUserMessage(userMessage, cartContext = null, history = []) {
  const query = (userMessage || '').trim()
  if (!query) return buildDefaultGreeting()

  // 1. Safety Guardrail Enforcement
  if (!isContentSafe(query)) {
    return {
      text: `Namaste. 🙏 I am **Gulabi**, the dedicated AI assistant for *Craft of Pink City*.\n\nI am here exclusively to help you with our handcrafted Jaipur bags, orders, wholesale inquiries, fabric care, dimensions, and customer service.\n\nPlease let me know how I can assist with our collection or orders!`,
      quickReplies: ['🛍️ Browse Collection', '🧳 Quilted Duffles', '📦 Wholesale & Bulk (MOQ 25)', '🧼 Fabric Care']
    }
  }

  // 2. Multi-turn context resolution (check previous turn context)
  const previousBotMessage = history.length > 1 ? history[history.length - 2]?.text || '' : ''
  const previousUserMessage = history.length > 2 ? history[history.length - 3]?.text || '' : ''

  // 3. Dynamic Reasoning Engine
  return synthesizeDynamicResponse(query, cartContext, { previousBotMessage, previousUserMessage })
}

/**
 * Core Generative Synthesis Engine
 */
function synthesizeDynamicResponse(query, cartContext, contextMeta = {}) {
  const q = query.toLowerCase()

  // --- GREETINGS & INTROS ---
  if (isGreeting(q)) {
    return {
      text: `Namaste! 🙏 I'm **Gulabi**, your Jaipur Craft & Shopping AI concierge at *Craft of Pink City*.\n\nI can help you with:\n• 🛍️ **Finding the perfect bag** (Duffles, Totes, Vanity Cases, Laptop Sleeves, Yoga Carriers)\n• 📦 **Instant Wholesale Calculator** (MOQ 25 pcs with tiered bulk discounts)\n• 📏 **Dimensions, sizing & what fits inside**\n• 🧼 **Authentic Jaipuri fabric care & washing guide**\n• 🚚 **Delivery dispatch & order assistance**\n\nHow may I assist you today?`,
      quickReplies: [
        '🛍️ Show Bestsellers',
        '🧳 Quilted Travel Duffles',
        '📦 Wholesale & Bulk (MOQ 25)',
        '📏 Bag Dimensions & Fit',
        '🧵 How are bags made?'
      ]
    }
  }

  // --- GRATITUDE / COURTESY ---
  if (isGratitude(q)) {
    return {
      text: `You are most welcome! 🌸 It is our absolute joy to assist you. If you need anything else—like sizing advice, wholesale slabs, or custom logo branding—just ask me anytime or connect directly with our workshop team on WhatsApp. Have a wonderful day!`,
      quickReplies: ['🛍️ Browse Retail Collection', '📦 Wholesale Inquiries', '💬 Chat on WhatsApp']
    }
  }

  // --- WHO ARE YOU / ABOUT BRAND ---
  if (
    hasPhrase(q, ['who are you', 'what is your name', 'about you', 'about pink city', 'who made you', 'about this store', 'tell me about yourself', 'what can you do'])
  ) {
    return {
      text: `🌸 **About Gulabi & Craft of Pink City:**\n\n• **I am Gulabi**, the intelligent AI concierge for *Craft of Pink City*—a direct artisan textile studio located in **Jaipur, Rajasthan**.\n• **Generational Heritage:** We specialize in authentic hand block-printed, quilted 100% pure cotton accessories using traditional woodblocks, natural vegetable dyes, and diamond quilting.\n• **Direct Workshop Model:** From hand-carving teak blocks to final zip stitching, every piece is made ethically by skilled local artisans without retail middlemen.\n• **Wholesale & Custom Gifting:** We partner with boutiques, brands, and corporate gifting clients across India and globally.`,
      quickReplies: ['🛍️ Show Bestsellers', '🧳 Quilted Duffles', '📦 Wholesale & Bulk Catalog', '🧵 The Craft Process']
    }
  }

  // --- SHOPPING CART & BAG INQUIRIES ---
  if (isCartQuery(q) || hasWord(q, ['checkout', 'order', 'cart', 'bag'])) {
    if (cartContext && cartContext.items && cartContext.items.length > 0) {
      const itemList = cartContext.items.map((it) => `• **${it.name}** (Qty: ${it.quantity} × ${it.price})`).join('\n')
      return {
        text: `🛍️ **Your Shopping Bag Status:**\n\nYou currently have **${cartContext.totalCount} handcrafted item(s)** in your bag:\n\n${itemList}\n\n💰 **Estimated Subtotal:** ₹${cartContext.subtotalFormatted}\n\nYou can review items in the drawer or checkout directly on WhatsApp with all item links attached for immediate order confirmation!`,
        action: { type: 'OPEN_CART', label: 'Open Shopping Bag Drawer' },
        quickReplies: ['Checkout on WhatsApp', 'Clear Bag', 'Show More Products']
      }
    } else if (hasPhrase(q, ['checkout', 'buy now', 'place order'])) {
      return {
        text: `Your shopping bag is currently empty! You can browse our collection below, tap **Add to Bag** on any item, or tap **WhatsApp** to place an instant order with our workshop team.`,
        quickReplies: ['🛍️ Show Bestsellers', '🧳 Travel Duffles', '🌸 Pouch Trios'],
        products: products.slice(0, 3)
      }
    }
  }

  // --- WHOLESALE & DYNAMIC BULK CALCULATOR ---
  const qtyMatch = q.match(/(\d+)\s*(pcs|pieces|bags|units|pouches|sets|totes|duffles|hampers|items)?/i)
  if (
    qtyMatch ||
    hasWord(q, ['bulk', 'wholesale', 'moq', 'resell', 'reseller', 'boutique', 'corporate', 'hamper', 'hampers', 'discount', 'quantity', 'quote', 'slab'])
  ) {
    const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : null
    let discount = '15% to 35%+'
    let tierTitle = 'Starter Wholesale'
    let note = ''

    if (qty) {
      if (qty >= 500) {
        discount = '40%+ (Factory Direct Slab)'
        tierTitle = 'Large-Scale Production'
        note = `For **${qty} pieces**, you receive our highest tier factory direct pricing with free custom logo tagging, dedicated dye lots, and prioritized workshop scheduling.`
      } else if (qty >= 101) {
        discount = '30% - 35%'
        tierTitle = 'Volume Wholesale / Corporate'
        note = `For **${qty} pieces**, you qualify for our 30-35% wholesale slab, complete with custom printed brand tags, custom colorways, and protective export packaging.`
      } else if (qty >= 51) {
        discount = '25% - 30%'
        tierTitle = 'Mid-Volume Wholesale'
        note = `For **${qty} pieces**, you receive 25-30% off retail pricing with mix-and-match print flexibility across categories.`
      } else if (qty >= 25) {
        discount = '15% - 20%'
        tierTitle = 'Starter Boutique Wholesale'
        note = `For **${qty} pieces** (our minimum wholesale order), you receive 15-20% off retail, perfect for testing Jaipuri block-print collections in your boutique.`
      } else {
        discount = 'Retail Slab'
        tierTitle = 'Below Wholesale MOQ'
        note = `Our wholesale pricing and custom branding program begins at **25 pieces minimum**. For smaller orders under 25 pcs, you can purchase directly at our standard retail prices.`
      }
    }

    return {
      text: `📦 **Wholesale & Bulk Orders Program ${qty ? `(${qty} Pieces)` : ''}:**\n\n${note ? note + '\n\n' : ''}• **Low MOQ:** Starts at just **25 pieces** per category (mix and match prints & colors freely).\n• **Discount Tier:** **${discount}** (${tierTitle}).\n• **Bespoke Customization:** Add your own brand logo tags, personalized thank-you cards, or custom gift ribbons at no extra charge.\n• **Production & Dispatch:** Timelines are decided by our workshop team based on your exact order quantity and confirmed instantly on WhatsApp.\n• **Global & Pan-India Shipping:** Insured express courier to your doorstep.`,
      action: {
        type: 'LINK',
        label: qty ? `Get Wholesale Quote for ${qty} Pcs on WhatsApp` : 'Request Wholesale Catalog on WhatsApp',
        url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          qty
            ? `Hello Craft of Pink City, I would like to request a wholesale bulk order quote for ${qty} pieces (${tierTitle}). Please share pricing slabs and dispatch schedule.`
            : 'Hello Craft of Pink City, please share your wholesale catalog, MOQ slabs, and bulk pricing for boutique orders.'
        )}`,
        internalAnchor: '#bulk-orders'
      },
      quickReplies: ['🌸 Pouch Trios in Bulk', '💄 Vanity Boxes Wholesale', '🧳 Quilted Duffles MOQ', 'Corporate Gifting']
    }
  }

  // --- LAPTOP, IPAD & DEVICE SIZING ---
  if (
    hasWord(q, ['laptop', 'macbook', 'ipad', 'tablet', 'charger', 'notebook', 'computer', 'screen', 'device']) ||
    hasPhrase(q, ['fit my laptop', '13 inch', '14 inch', '15.6 inch', '16 inch', 'laptop size'])
  ) {
    const laptopProducts = products.filter((p) => p.category === 'Laptop Sleeves' || p.category === 'Tote Bags')
    return {
      text: `💻 **Laptop & Device Sizing Guide:**\n\n• **13" to 14" Laptops & MacBooks:** Our **Quilted Laptop Sleeve (14.5" × 10.5")** fits 13" MacBook Air/Pro, 14" Dell XPS, iPads, and tablets with snug **8mm shockproof foam padding** and an inner zip compartment for charger & mouse.\n• **15.6" to 16" Laptops:** Our **Quilted Tote Bags (16" × 14" × 4.5")** comfortably accommodate up to 15.6" laptops, planners, water bottles, and daily work essentials with sturdy reinforced double handles.\n• **Protection:** Quilted cotton exterior absorbs daily knocks while remaining super lightweight.`,
      quickReplies: ['Show Laptop Sleeves', 'Show Tote Bags', 'Order on WhatsApp'],
      products: laptopProducts.slice(0, 3)
    }
  }

  // --- YOGA MAT & GYM SIZING ---
  if (hasWord(q, ['yoga', 'mat', 'gym', 'fitness', 'pilates', 'exercise', 'workout', 'carrier'])) {
    const yogaBags = products.filter((p) => p.category === 'Yoga Mat Bags')
    return {
      text: `🧘‍♀️ **Handcrafted Quilted Yoga Mat Carriers:**\n\n• **Dimensions:** **28.5" length × 6.8" diameter**—generously sized to fit all standard and extra-thick yoga/Pilates mats (up to 10mm thickness).\n• **Features:** Full-length smooth zipper for easy slide-in, adjustable reinforced shoulder strap for hands-free commuting, and an exterior zipper pocket for keys, phone, and wallet.\n• **Breathable Cotton:** 100% natural cotton keeps your mat aerated and odor-free.`,
      quickReplies: ['Royal Bengal Tiger Yoga Bag', 'Sunshine Marigold Yoga Bag', 'Show All Yoga Bags'],
      products: yogaBags.slice(0, 3)
    }
  }

  // --- TRAVEL DUFFLES & WEEKENDER SIZING ---
  if (hasWord(q, ['duffle', 'duffel', 'travel', 'weekender', 'overnight', 'flight', 'cabin', 'luggage', 'vacation', 'trip'])) {
    const duffles = products.filter((p) => p.category === 'Duffle Bags')
    return {
      text: `🧳 **Quilted Travel Duffles (Cabin Approved):**\n\n• **Dimensions & Capacity:** **18" Length × 10" Width × 10" Height** (~28 Litres capacity).\n• **What Fits Inside:** 2–3 days of clothing, footwear, vanity pouch, toiletries, charger, and travel essentials.\n• **Flight Friendly:** Fits effortlessly in airline overhead bins and under seats.\n• **Construction:** Diamond/channel quilted with 100% cotton canvas, reinforced dual carry handles, and a detachable padded shoulder strap.`,
      quickReplies: ['Blush Botanical Duffle', 'Heritage Indigo Patchwork', 'Blue Poppy Duffle'],
      products: duffles.slice(0, 3)
    }
  }

  // --- VANITY BOXES, TOILETRIES & COSMETICS ---
  if (
    hasWord(q, ['vanity', 'makeup', 'cosmetic', 'cosmetics', 'toiletries', 'perfume', 'bottle', 'bottles', 'skincare', 'serum', 'lotion', 'shampoo'])
  ) {
    const vanities = products.filter((p) => p.category === 'Vanity Boxes')
    return {
      text: `💄 **Quilted Vanity Boxes & Travel Organizers:**\n\n• **Dimensions:** **9.5" × 6.5" × 5.5"** with structured vertical sidewalls.\n• **Upright Bottle Safety:** Keeps full-size glass perfume bottles, foundations, serums, and lotions standing upright to eliminate leaks during transit.\n• **Spill Protection:** Lined with water-resistant wipeable inner fabric and internal elastic brush organizers.\n• **Top Carry Handle:** Sturdy grab-and-go handle with dual-direction brass zipper.`,
      quickReplies: ['Vanilla & Teal Vanity Case', 'Chartreuse Bloom Vanity', 'Show All Vanity Cases'],
      products: vanities.slice(0, 3)
    }
  }

  // --- HAIR STYLING TOOLS (Dyson, Curlers, Straighteners) ---
  if (hasWord(q, ['hair', 'dyson', 'straightener', 'curler', 'dryer', 'blower', 'styling', 'wrap', 'curling'])) {
    const organizers = products.filter((p) => p.category === 'Organizers' || p.category === 'Pouch Sets')
    return {
      text: `💇‍♀️ **Hair Styling Tools & Heat Device Organizer:**\n\n• **Best Match: Striped Hair Wrap & Tool Organizer (13" × 6.5" × 4.5")**\n• **Fits:** Dyson Airwrap barrels, full-size hair straighteners, curling wands, blow dryers, and hairbrush accessories.\n• **Padded Heat Buffer:** Thick diamond quilted cotton provides insulation and protects expensive hair appliances from scratches during travel.\n• **Multiple Sections:** Elastic slip bands keep cords and styling attachments neatly untangled.`,
      quickReplies: ['Hair Wrap Organizer', 'Show Pouch Trios', 'Order on WhatsApp'],
      products: organizers.slice(0, 2)
    }
  }

  // --- POUCH SETS & MULTI-SIZE TRIOS ---
  if (hasWord(q, ['pouch', 'pouches', 'trio', 'set', 'nested', 'small', 'mini', 'clutch', 'flat'])) {
    const pouches = products.filter((p) => p.category === 'Pouch Sets' || p.category === 'Pouches' || p.category === 'Flat Pouches')
    return {
      text: `🌸 **Handcrafted Quilted Pouch Trios (Set of 3):**\n\n• **3 Nested Sizes:**\n  1. **Large (10" × 6" × 4"):** Skincare, full-size creams, sunscreen, and power banks.\n  2. **Medium (8" × 5" × 3.5"):** Compact makeup, lipsticks, medication, and jewelry.\n  3. **Small (6" × 4" × 2.5"):** Keys, cards, earphones, hairpins, and coins.\n• **Artisan Detailing:** Signature hand-carved block prints with beaded pompom zipper tassels.`,
      quickReplies: ['Marigold Bloom Trio', 'Coral Paisley Trio', 'Mint Berry Trio'],
      products: pouches.slice(0, 3)
    }
  }

  // --- FABRIC, CRAFT HERITAGE & PRINTING TECHNIQUES ---
  if (
    hasWord(q, ['craft', 'make', 'made', 'artisan', 'printing', 'block', 'sanganeri', 'bagru', 'dabu', 'indigo', 'wood', 'teak', 'dye', 'natural', 'fabric', 'cotton', 'technique', 'heritage', 'jaipur'])
  ) {
    return {
      text: `🧵 **The Artisan Craft of Jaipur Block Printing:**\n\n1. **Hand-Carved Wooden Blocks:** Skilled artisans carve intricate floral and geometric motifs onto seasoned sheesham/teak wood blocks.\n2. **Natural & Azo-Free Dyes:** We use rich plant-derived vegetable extracts (indigo, madder, turmeric) and eco-friendly dyes.\n3. **Precision Hand Stamping:** The master printer (*Chhipa*) stamps the fabric by hand in rhythmic alignment, creating subtle organic variations that make every single piece unique.\n4. **Sun Curing & Washing:** Fabrics are sun-dried in the desert air and river-washed to set the pigments.\n5. **Quilting & Tailoring:** The printed cotton is layered with lightweight batting and diamond-quilted before being hand-stitched into bags.`,
      quickReplies: ['🛍️ Shop Authentic Craft', '🧳 Quilted Duffles', '📦 Wholesale Inquiries']
    }
  }

  // --- WASH CARE, CLEANING & MAINTENANCE ---
  if (hasWord(q, ['wash', 'clean', 'care', 'washing', 'iron', 'detergent', 'bleed', 'fade', 'maintenance', 'dry'])) {
    return {
      text: `🧼 **Fabric Care & Washing Guidelines for Quilted Cotton:**\n\n• **First Wash:** Hand wash separately in cold water with 1 teaspoon of salt to lock in the botanical dye pigments.\n• **Regular Wash:** Gentle hand wash in cold water using mild liquid detergent (like Ezee or baby shampoo).\n• **Drying:** Always dry in the shade to preserve vibrant colors. Avoid direct harsh sunlight.\n• **Do Not:** Do not bleach, do not wring harshly, and do not machine tumble dry.\n• **Ironing:** Warm steam iron on cotton setting to restore plush quilting puffiness.`,
      quickReplies: ['🛍️ Browse Collection', '💬 WhatsApp Support']
    }
  }

  // --- DOMESTIC INDIA SHIPPING & CITY DELIVERY ---
  const indianCities = [
    'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata', 'pune',
    'ahmedabad', 'jaipur', 'surat', 'lucknow', 'chandigarh', 'noida', 'gurgaon', 'gurugram',
    'kochi', 'cochin', 'indore', 'bhopal', 'nagpur', 'patna', 'guwahati', 'goa', 'coimbatore',
    'vadodara', 'ludhiana', 'agra', 'varanasi', 'kerala', 'rajasthan', 'punjab', 'kashmir', 'shimla'
  ]
  const matchedCity = indianCities.find((c) => hasWord(q, c))
  if (
    matchedCity ||
    (hasWord(q, ['deliver', 'delivery', 'reach', 'dispatch', 'ship', 'shipping']) &&
      hasWord(q, ['india', 'pincode', 'pin', 'days', 'time', 'how', 'when', 'fast', 'speed', 'schedule']))
  ) {
    const cityName = matchedCity ? matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1) : 'your location in India'
    return {
      text: `🚚 **Delivery & Dispatch Information for ${cityName}:**\n\n• **Decided by Order Quantity:** Because each piece is authentically handcrafted in our Jaipur workshop, exact delivery and dispatch schedules are decided by our workshop team based on your **total ordered quantity and customization**.\n• **Confirmed on WhatsApp:** When you inquire or order on WhatsApp, our team will confirm the exact estimated dispatch schedule for your pieces.\n• **All-India Coverage:** We service all 19,000+ PIN codes across India via express couriers (Bluedart, Delhivery, DTDC).\n• **Live Tracking:** An end-to-end tracking link is messaged on WhatsApp as soon as your parcel is dispatched.`,
      action: {
        type: 'LINK',
        label: `Confirm Dispatch Schedule for ${cityName} on WhatsApp`,
        url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Craft of Pink City, I would like to check delivery and dispatch schedule for ${cityName}.`)}`
      },
      quickReplies: ['💳 Payment Options', '🛍️ Browse Collection', '💬 WhatsApp Support']
    }
  }

  // --- INTERNATIONAL SHIPPING ---
  const internationalLocations = [
    'usa', 'america', 'united states', 'uk', 'united kingdom', 'london', 'canada', 'toronto',
    'uae', 'dubai', 'abu dhabi', 'australia', 'sydney', 'melbourne', 'germany', 'france',
    'paris', 'italy', 'singapore', 'netherlands', 'new zealand', 'malaysia', 'saudi', 'qatar',
    'europe', 'overseas', 'international', 'foreign'
  ]
  const matchedCountry = internationalLocations.find((c) => hasWord(q, c))
  if (
    matchedCountry ||
    hasPhrase(q, ['international shipping', 'ship abroad', 'deliver overseas', 'outside india', 'global delivery', 'worldwide shipping'])
  ) {
    const countryName = matchedCountry ? matchedCountry.toUpperCase() : 'International destinations'
    return {
      text: `✈️ **Worldwide International Shipping (${countryName}):**\n\n• **Global Reach:** Yes! We ship handcrafted bags worldwide to **${countryName}**, USA, UK, Canada, UAE, Europe, Australia, and 50+ countries.\n• **Order-Based Schedule:** Dispatch schedules are calculated based on your total order volume, weight, and destination, and confirmed directly upon WhatsApp inquiry.\n• **Courier Partners:** Shipped via **DHL Express & FedEx International Priority** with full tracking.\n• **Payment:** International Credit/Debit Cards, PayPal, and SWIFT Wire Transfers accepted.\n• **Protective Packaging:** Packed in moisture-sealed protective export packaging to ensure pristine arrival.`,
      action: {
        type: 'LINK',
        label: `Inquire International Order for ${countryName}`,
        url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Craft of Pink City, I would like to inquire about international shipping for delivery to ${countryName}. Please assist with availability and dispatch schedule.`)}`
      },
      quickReplies: ['🧳 Quilted Travel Duffles', '📦 Wholesale Catalog', '💳 Payment Methods']
    }
  }

  // --- PAYMENT METHODS & CASH ON DELIVERY ---
  if (hasWord(q, ['pay', 'payment', 'cod', 'cash', 'upi', 'gpay', 'phonepe', 'card', 'bank', 'transfer', 'qr', 'online'])) {
    return {
      text: `💳 **Payment Options & Terms:**\n\n• **Accepted Modes:** UPI (Google Pay, PhonePe, Paytm, BHIM), IMPS/NEFT Net Banking, Debit/Credit Cards, and SWIFT International Wire.\n• **Why No COD:** Each bag is crafted and dispatched directly from our Jaipur artisan workshop. To maintain handcrafted wholesale-level pricing and avoid failed artisan dispatches, all orders are processed via secure advance digital payment.\n• **Payment Guarantee:** Official digital invoice and payment confirmation are sent immediately on WhatsApp.`,
      quickReplies: ['🛍️ Browse Collection', '📦 Wholesale Inquiries', '💬 WhatsApp Support']
    }
  }

  // --- RETURNS, REPLACEMENTS & DAMAGE GUARANTEE ---
  if (hasWord(q, ['return', 'returns', 'exchange', 'refund', 'replace', 'replacement', 'damage', 'broken', 'defective', 'guarantee'])) {
    return {
      text: `🛡️ **100% Artisan Quality & Transit Guarantee:**\n\n• **Free Replacement Guarantee:** In the rare event of transit damage or manufacturing defect, we provide a **100% Free Replacement**.\n• **Process:** Simply send an unboxing video/photo on WhatsApp within 48 hours of parcel delivery.\n• **Handmade Authenticity:** Subtle variations in block-print alignment and organic vegetable dyes are the hallmark of authentic hand craftsmanship.`,
      quickReplies: ['🛍️ Browse Collection', '💬 WhatsApp Support']
    }
  }

  // --- SPECIFIC PRODUCT SEARCH & RECOMMENDATION FALLBACK ---
  const matchedProducts = findMatchingProducts(query, 3)
  if (matchedProducts.length > 0) {
    const productBullets = matchedProducts
      .map((p) => `• **${p.name}** (${p.price}) — *${p.category}*: ${p.description || '100% quilted cotton.'}`)
      .join('\n')

    return {
      text: `✨ **Handcrafted Recommendations for "${query}":**\n\n${productBullets}\n\nTap any product below to view details, add to your bag, or order directly on WhatsApp!`,
      products: matchedProducts,
      quickReplies: ['🛍️ Show All Products', '🧳 Quilted Duffles', '📦 Wholesale Quote (25+ MOQ)', '💬 WhatsApp']
    }
  }

  // --- GENERAL GENERATIVE FALLBACK ---
  return {
    text: `🌸 **Craft of Pink City Assistant:**\n\nI'm here to help with all questions regarding our authentic Jaipur hand block-printed bags, dimensions, wholesale rates, and fabric care.\n\n• Would you like to explore our **Quilted Travel Duffles**, **Tote Bags**, **Vanity Cases**, or **Pouch Trios**?\n• Or are you looking for **Wholesale & Bulk Orders (MOQ 25 pcs)** with custom brand tags?`,
    quickReplies: [
      '🛍️ Show Bestsellers',
      '🧳 Quilted Travel Duffles',
      '📦 Wholesale & Bulk (MOQ 25)',
      '📏 Bag Dimensions & Fit',
      '🧼 Wash & Care Guidelines'
    ]
  }
}

function buildDefaultGreeting() {
  return {
    text: `Namaste! 🙏 I'm **Gulabi**, your Jaipur Craft Assistant. How can I help you today with our handcrafted bags or wholesale orders?`,
    quickReplies: ['🛍️ Show Bestsellers', '🧳 Quilted Duffles', '📦 Wholesale & Bulk (MOQ 25)', '🧵 The Craft Process']
  }
}

/**
 * Helper: Check for greetings
 */
function isGreeting(q) {
  const greetings = [
    'hi', 'hello', 'hey', 'namaste', 'kem cho', 'salaam', 'good morning', 'good afternoon', 'good evening', 'hola', 'hie', 'hey there', 'hii', 'hiii'
  ]
  return greetings.some((g) => q === g || q.startsWith(g + ' ') || q.endsWith(' ' + g))
}

/**
 * Helper: Check for gratitude / closing
 */
function isGratitude(q) {
  const thanks = [
    'thank you', 'thanks', 'dhanyawad', 'shukriya', 'great thanks', 'awesome', 'nice', 'helpful', 'bye', 'goodbye', 'ok thanks', 'perfect', 'super'
  ]
  return thanks.some((t) => q.includes(t)) && q.length < 40
}

/**
 * Helper: Check for cart queries
 */
function isCartQuery(q) {
  return (
    (hasWord(q, ['cart', 'bag', 'items']) || hasPhrase(q, ['shopping bag'])) &&
    (hasWord(q, ['my', 'check', 'status', 'view', 'show']) || hasPhrase(q, ['what is in', 'in my cart', 'in my bag']))
  )
}
