import { products, whatsapp, whatsappNumber, email, faqs } from '../data/products.js'

/**
 * Advanced AI Conversational Engine for "Gulabi" (Craft of Pink City)
 * Dynamically answers any customer question in natural, friendly, brand-authentic language.
 * Strictly enforces safety guardrails (blocking adult, offensive, or illegal content).
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
  tagline: 'Handcrafted Heritage Quilted Bags & Artisan Textiles',
  city: 'Jaipur, Rajasthan, India (PIN: 302001)',
  contact: {
    phone: '+91 93512 91471',
    whatsapp: `https://wa.me/${whatsappNumber}`,
    email: email,
    instagram: 'https://www.instagram.com/craftofpinkcity/'
  },
  materials:
    '100% Pure Indian Cotton (high-thread-count cambric), plush lightweight foam quilting, heavy-duty brass/nylon zippers, handcrafted fabric-bead tassels, natural and azo-free dyes.',
  techniques:
    'Traditional woodblock carving, Sanganeri floral block printing, Bagru natural vegetable dyes, Dabu mud-resist indigo printing, machine diamond & channel quilting.',
  wholesaleMOQ:
    '25 pieces minimum order quantity per category (mix and match patterns allowed). Tiered discounts: 15-20% (25-50 pcs), 25-30% (51-100 pcs), 35%+ (100+ pcs). Custom couple monogram or corporate tags included free.',
  shipping:
    'Dispatches within 24-48 hours. India: 2-5 business days via express courier (Bluedart, Delhivery, DTDC). International: 4-7 business days globally via DHL/FedEx Express.',
  care: 'Gentle hand wash in cold water with mild liquid detergent. Shade dry only. Do not bleach or machine tumble. Warm steam iron on cotton setting.',
  payment:
    'UPI (GPay, PhonePe, Paytm), IMPS/NEFT Bank Transfer, Debit/Credit Cards, International Wire Transfer (SWIFT). COD is not available for handcrafted artisan dispatches.',
  returns: '100% Free replacement guarantee for any transit damage reported with unboxing photos within 48 hours.'
}

// Word & Phrase Matching Utility with Word-Boundary Enforcement
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

/**
 * Main function used by ArtisanChatbot
 * Handles synchronous/instant reasoning
 */
export function processUserMessage(userMessage, cartContext = null) {
  const query = (userMessage || '').trim()
  if (!query) return buildGenerativeContextResponse('')

  // 1. Safety Guardrail Check
  if (!isContentSafe(query)) {
    return {
      text: `Namaste. 🙏 I am **Gulabi**, the dedicated AI assistant for *Craft of Pink City*.\n\nI am here exclusively to help you with our handcrafted Jaipur bags, orders, wholesale inquiries, fabric care, dimensions, and customer service.\n\nPlease let me know how I can assist with our collection or order inquiries!`,
      quickReplies: ['🛍️ Browse Collection', '🧳 Quilted Duffles', '🎁 Wedding Favors (MOQ 25)', '🧼 Fabric Care']
    }
  }

  // 2. Dynamic Conversational Synthesis
  return synthesizeDynamicResponse(query, cartContext)
}

/**
 * Asynchronous gateway (supports Cloud LLM if API Key is present in localStorage)
 */
export async function generateAIResponse(userMessage, cartContext = null) {
  const query = (userMessage || '').trim()

  if (!isContentSafe(query)) {
    return processUserMessage(query, cartContext)
  }

  const geminiApiKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') : null
  if (geminiApiKey) {
    try {
      const llmResult = await callGeminiAPI(query, geminiApiKey, cartContext)
      if (llmResult) return llmResult
    } catch (e) {
      console.warn('Live LLM call failed, falling back to dynamic synthesis engine:', e)
    }
  }

  return processUserMessage(query, cartContext)
}

/**
 * Intelligent Dynamic Synthesis Engine
 */
function synthesizeDynamicResponse(query, cartContext) {
  const q = query.toLowerCase()

  // 1. GREETINGS & CASUAL INTROS
  if (isGreeting(q)) {
    return {
      text: `Namaste! 🙏 I'm **Gulabi**, your personal Jaipur Craft & Shopping Assistant at *Craft of Pink City*.\n\nWhether you're looking for everyday quilted totes, travel duffles, wedding favors, wholesale pricing, or fabric details, I am here to answer everything instantly. How can I help you today?`,
      quickReplies: [
        '🛍️ Show Bestsellers',
        '🧳 Quilted Travel Duffles',
        '🎁 Wedding Favors (MOQ 25)',
        '📏 Bag Sizes & Dimensions',
        '🚚 Shipping & Delivery'
      ]
    }
  }

  // 2. GRATITUDE / COURTESY
  if (isGratitude(q)) {
    return {
      text: `You are most welcome! 🌸 It is our absolute joy to assist you. If you need help with dimensions, custom monogramming, or placing an order, just message me here or tap WhatsApp to speak with our workshop team. Have a wonderful day!`,
      quickReplies: ['🛍️ Browse Retail Collection', '🎁 Wholesale Inquiries', '💬 Chat on WhatsApp']
    }
  }

  // 3. WHO ARE YOU / ABOUT GULABI / ABOUT BRAND
  if (
    hasPhrase(q, ['who are you', 'what is your name', 'about you', 'about pink city', 'who made you', 'about this store', 'tell me about yourself'])
  ) {
    return {
      text: `🌸 **About Gulabi & Craft of Pink City:**\n\n• **I am Gulabi**, the AI concierge for *Craft of Pink City*—a luxury handcrafted textile studio based in **Jaipur, Rajasthan**.\n• **Our Mission:** We celebrate generational Rajasthani block-printing heritage (Sanganeri, Bagru, Dabu) by crafting premium **100% pure quilted cotton** travel duffles, tote bags, vanity boxes, laptop sleeves, and gifting favors.\n• **Direct Artisan Workshop:** Every piece is printed with hand-carved teak wood blocks, padded with soft batting, and tailored with artisan-beaded tassels.`,
      quickReplies: ['🛍️ Show Bestsellers', '🧳 Quilted Duffles', '🎁 Bulk / Wedding Orders', '🧵 How Bags Are Made']
    }
  }

  // 4. SHOPPING BAG / CART INQUIRIES
  if (isCartQuery(q)) {
    if (cartContext && cartContext.items && cartContext.items.length > 0) {
      return {
        text: `🛍️ **Your Shopping Bag Status:**\n\nYou currently have **${cartContext.totalCount} items** in your bag (Estimated Total: **₹${cartContext.subtotalFormatted}**).\n\nYou can review your items in the drawer or checkout directly on WhatsApp with all product links attached!`,
        action: { type: 'OPEN_CART', label: 'View Shopping Bag Drawer' },
        quickReplies: ['Checkout on WhatsApp', 'Clear Bag', 'Show More Products']
      }
    } else {
      return {
        text: `Your shopping bag is currently empty! Would you like me to recommend some of our popular travel duffles, tote bags, or pouch sets?`,
        quickReplies: ['🛍️ Show Bestsellers', '🧳 Travel Duffles', '🌸 Pouch Trios', '🎁 Gift Sets'],
        products: products.slice(0, 2)
      }
    }
  }

  // 5. PERFUME BOTTLES / COSMETICS / GLASS BOTTLE TRAVEL PROTECTION
  if (
    hasWord(q, ['perfume', 'perfumes', 'bottle', 'bottles', 'glass', 'cosmetics', 'toiletries', 'skincare', 'shampoo', 'lotion', 'serum', 'makeup']) &&
    hasWord(q, ['carry', 'travel', 'pack', 'hold', 'fit', 'protect', 'train', 'flight', 'bag'])
  ) {
    return {
      text: `💄 **Carrying Perfumes, Skincare & Glass Bottles Safely:**\n\n• **Best Choice: Structured Vanity Box (9.5" × 6.5" × 5.5")**\n• **Upright Bottle Storage:** Designed with firm padded vertical sidewalls specifically to keep full-size glass perfume bottles, foundations, and serums standing upright without tipping or leaking during train or flight journeys.\n• **Cushioning Protection:** High-density foam padding absorbs bumps and impacts on the road.\n• **Easy Cleanup:** Water-resistant wipeable inner lining in case of minor cosmetic spills.`,
      quickReplies: ['Show Vanity Boxes', 'Show Pouch Sets', 'Order on WhatsApp']
    }
  }

  // 6. CITIES & DOMESTIC DELIVERY TIMELINES (India)
  const indianCities = [
    'mumbai', 'delhi', 'bangalore', 'bengaluru', 'hyderabad', 'chennai', 'kolkata', 'pune',
    'ahmedabad', 'jaipur', 'surat', 'lucknow', 'chandigarh', 'noida', 'gurgaon', 'gurugram',
    'kochi', 'cochin', 'indore', 'bhopal', 'nagpur', 'patna', 'guwahati', 'goa', 'coimbatore',
    'vadodara', 'ludhiana', 'agra', 'varanasi', 'kerala', 'rajasthan', 'punjab', 'kashmir', 'shimla'
  ]
  const matchedCity = indianCities.find((c) => hasWord(q, c))
  if (matchedCity || (hasWord(q, ['deliver', 'delivery', 'reach', 'dispatch']) && hasWord(q, ['india', 'pincode', 'pin', 'days', 'time']))) {
    const cityName = matchedCity ? matchedCity.charAt(0).toUpperCase() + matchedCity.slice(1) : 'your location in India'
    return {
      text: `🚚 **Delivery Timelines for ${cityName}:**\n\n• **Workshop Dispatch:** Orders ship directly from our Jaipur studio within **24–48 hours**.\n• **Transit Duration:** Express delivery to **${cityName}** takes approx. **2 to 4 business days** via Bluedart, Delhivery, or DTDC Express.\n• **All PIN Codes:** We service all 19,000+ PIN codes across India.\n• **Live Tracking:** An end-to-end tracking link is messaged on WhatsApp as soon as your parcel is dispatched.`,
      quickReplies: ['💳 Payment Options', '🛍️ Browse Collection', '💬 WhatsApp Support']
    }
  }

  // 7. INTERNATIONAL SHIPPING & COUNTRIES
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
      text: `✈️ **Worldwide International Shipping (${countryName}):**\n\n• **Global Reach:** Yes! We ship handcrafted bags worldwide to **${countryName}**, USA, UK, Canada, UAE, Europe, Australia, and 50+ countries.\n• **Courier Partners:** Dispatched via **DHL Express & FedEx International Priority**.\n• **Transit Timeline:** Arrives at your doorstep in **4 to 7 business days**.\n• **Payment:** International Credit/Debit Cards, PayPal, and SWIFT Wire Transfers accepted.\n• **Customs & Packaging:** Packed in moisture-sealed protective export packaging with full customs declaration documents.`,
      action: {
        type: 'LINK',
        label: `Inquire International Order for ${countryName}`,
        url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hello Craft of Pink City, I would like to place an international order for delivery to ${countryName}. Please assist with shipping rates.`)}`
      },
      quickReplies: ['🧳 Quilted Travel Duffles', '🎁 Bulk Orders / Gifting', '💳 Payment Methods']
    }
  }

  // 8. BULK ORDERS, WEDDING FAVORS & QUANTITY QUOTES
  const qtyMatch = q.match(/(\d+)\s*(pcs|pieces|bags|units|pouches|sets|totes|duffles|favors|gifts)?/i)
  if (
    qtyMatch ||
    hasWord(q, ['bulk', 'wholesale', 'wedding', 'favor', 'favors', 'mehendi', 'sangeet', 'haldi', 'moq', 'resell', 'corporate', 'hamper', 'hampers', 'discount'])
  ) {
    const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : null
    let slabDiscount = '15% to 35%+'
    let pieceNote = qty ? `for **${qty} pieces**` : 'for bulk orders'

    if (qty) {
      if (qty >= 100) slabDiscount = '35%+'
      else if (qty >= 50) slabDiscount = '25% - 30%'
      else if (qty >= 25) slabDiscount = '15% - 20%'
      else slabDiscount = 'Retail slab (Wholesale begins at 25 pcs)'
    }

    return {
      text: `🎉 **Wholesale & Wedding Favors Program ${pieceNote}:**\n\n• **Low MOQ:** Starts at just **25 pieces** per category (mix and match colors/prints freely).\n• **Discount Tier:** **${slabDiscount} discount** off retail prices.\n• **Free Custom Monogramming:** Personalized bride & groom tags, wedding dates, or company logos printed on each bag.\n• **Sample Approval:** Physical sample piece dispatched within **48 hours** for your review.\n• **Color Schemes:** Customized prints for Mehendi (Greens), Haldi (Yellows), Sangeet (Crimson/Pink), and Corporate themes.\n• **Doorstep Delivery:** Insured express bulk courier across India and worldwide.`,
      action: {
        type: 'LINK',
        label: qty ? `Get Wholesale Quote for ${qty} Pcs on WhatsApp` : 'Get Wholesale Catalog on WhatsApp',
        url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
          qty
            ? `Hello Craft of Pink City, I would like to inquire about a bulk order for ${qty} pieces. Please share catalog pricing and discount slabs.`
            : 'Hello Craft of Pink City, please share your bulk wholesale catalog and pricing slabs for wedding favors/corporate orders.'
        )}`,
        internalAnchor: '#bulk-orders'
      },
      quickReplies: ['🌸 Pouch Trios for Gifting', '💄 Vanity Boxes MOQ', '🧳 Quilted Duffles', 'Sample Piece Dispatch']
    }
  }

  // 9. FLIGHT / AIRLINE / CABIN LUGGAGE
  if (
    hasWord(q, ['flight', 'airport', 'cabin', 'plane', 'airplane', 'overhead', 'indigo', 'carryon', 'airlines']) ||
    hasPhrase(q, ['carry on', 'travel luggage', 'air india', 'hand luggage'])
  ) {
    return {
      text: `✈️ **Airline & Cabin Luggage Suitability:**\n\n• **100% Flight Cabin-Approved:** Our Quilted Barrel Duffles (**18" × 10" × 10"**) comply with standard cabin carry-on regulations for all major domestic & international airlines (IndiGo, Air India, Emirates, Delta, Singapore Airlines, British Airways, etc.).\n• **Overhead & Under-Seat Fit:** The soft, flexible quilted cotton body slides effortlessly into tight overhead bins or under the seat in front of you.\n• **Ultra-Lightweight:** Weighs only **~500g empty**, saving your precious cabin baggage weight allowance for your personal items.\n• **Comfort Straps:** Reinforced dual striped handles with an ergonomic grip for easy airport terminal walking.`,
      quickReplies: ['Show Travel Duffles', 'Bag Dimensions & Capacity', 'Order on WhatsApp']
    }
  }

  // 10. SIZES, DIMENSIONS & FITS (Laptop, Duffle, Tote, Vanity, Yoga, Pouch)
  if (
    hasWord(q, ['size', 'sizes', 'dimension', 'dimensions', 'measurement', 'measurements', 'inches', 'capacity', 'height', 'width', 'weight', 'fit', 'fits']) ||
    hasPhrase(q, ['how big', 'how large', 'what size'])
  ) {
    if (hasWord(q, ['laptop', 'macbook', 'dell', 'hp', 'lenovo', 'thinkpad', 'ipad', 'asus', 'sleeve'])) {
      return {
        text: `💻 **Laptop Sleeve Dimensions & Compatibility:**\n\n• **Outer Dimensions:** **15.5" (L) × 11.2" (H) × 1.2" (W)**.\n• **Device Fit:** Fits **13-inch, 14-inch, and 15.6-inch laptops** (Apple MacBook Pro/Air, Dell XPS/Inspiron, HP Pavilion/Spectre, Lenovo ThinkPad, ASUS ZenBook, iPad Pro).\n• **Impact Protection:** Triple-layer construction with **8mm shock-absorbent high-density foam** and smooth scratch-free inner cotton lining.\n• **Top Closure:** Smooth dual brass zipper sliders with fabric pulls.`,
        quickReplies: ['Show Laptop Sleeves', 'Order on WhatsApp', 'Wash & Care']
      }
    }
    if (hasWord(q, ['duffle', 'travel', 'weekender', 'barrel'])) {
      return {
        text: `🧳 **Quilted Barrel Duffle Dimensions & Capacity:**\n\n• **Dimensions:** **18" (Length) × 10" (Diameter) × 10" (Height)**.\n• **Volume Capacity:** Approx. **28 Litres**.\n• **Packing Capacity:** Holds **3 to 4 days of travel clothes**, 1 pair of shoes, vanity toiletry pouch, chargers, and travel documents.\n• **Features:** Outer slip pocket for boarding passes/phone, heavy-duty zipper, and reinforced handles.`,
        quickReplies: ['Show Duffle Bags', 'Cabin Fit Details', 'Wholesale MOQ']
      }
    }
    if (hasWord(q, ['vanity', 'box', 'cosmetic', 'makeup'])) {
      return {
        text: `💄 **Structured Vanity Box Dimensions:**\n\n• **Dimensions:** **9.5" (Length) × 6.5" (Width) × 5.5" (Height)**.\n• **Capacity:** Structured padded vertical walls keep full-sized lotion bottles, skincare serums, perfumes, and foundation upright to prevent leaks.\n• **Features:** Cushioned top carry handle, mirror pocket on inner lid, and water-resistant wipeable base.`,
        quickReplies: ['Show Vanity Boxes', 'Show Pouch Sets', 'Order on WhatsApp']
      }
    }
    if (hasWord(q, ['tote', 'ruffle'])) {
      return {
        text: `👜 **Quilted Tote Bag Dimensions:**\n\n• **Dimensions:** **16" (Height) × 14" (Width) × 4.5" (Base Gusset)**.\n• **Handle Drop:** **11 inches** (comfortable shoulder drop over winter coats and summer outfits).\n• **Fit:** Fits a 15.6" laptop, A4 notebooks, water bottle, wallet, sunglasses, and makeup pouch.\n• **Style:** Available in playful **Ruffle Trim** or sleek **Classic Clean Edge** finishes.`,
        quickReplies: ['Show Ruffle Totes', 'Show Classic Totes', 'Order on WhatsApp']
      }
    }
    if (hasWord(q, ['pouch', 'trio', 'pouches'])) {
      return {
        text: `🌸 **Pouch Trio (Set of 3) Nested Dimensions:**\n\n• **Large Pouch:** **9.0" × 6.0"** (makeup, skincare, chargers).\n• **Medium Pouch:** **7.5" × 5.0"** (medicines, cards, lipsticks).\n• **Small Pouch:** **6.0" × 4.0"** (coins, jewelry, earphones).\n• All 3 pouches nest inside each other when empty to save space!`,
        quickReplies: ['Show Pouch Trios', 'Wedding Favor MOQ', 'Order on WhatsApp']
      }
    }
    if (hasWord(q, ['yoga', 'mat'])) {
      return {
        text: `🧘 **Yoga Mat Carrier Dimensions:**\n\n• **Length:** **28.5 inches (72 cm)** × **Diameter:** **6.8 inches (17 cm)**.\n• **Fit:** Accommodates all standard and extra-thick yoga mats (4mm, 6mm, 8mm, and 10mm) with room for straps and a small towel.\n• **Features:** Breathable side eyelets, full-length zipper, and adjustable shoulder sling.`,
        quickReplies: ['Show Yoga Bags', 'Fabric Details', 'Wholesale MOQ']
      }
    }

    return {
      text: `📏 **Quick Dimensions & Size Guide:**\n\n• **Travel Duffles:** 18" × 10" × 10" (28L cabin size, 3-4 days trip)\n• **Ruffle Totes:** 16" × 14" × 4.5" (fits 15.6" laptop & daily essentials)\n• **Laptop Sleeves:** 15.5" × 11.2" × 1.2" (fits 13" to 15.6" laptops with 8mm padding)\n• **Vanity Boxes:** 9.5" × 6.5" × 5.5" (upright cosmetic bottle storage)\n• **Pouch Trio:** 3 nested sizes (9"×6", 7.5"×5", 6"×4")\n• **Yoga Carriers:** 28.5" × 6.8" (fits up to 10mm thick mats)`,
      quickReplies: ['🧳 Travel Duffles', '💻 Laptop Sleeves', '👜 Tote Bags', '💄 Vanity Boxes']
    }
  }

  // 11. PRODUCT COMPARISONS (e.g. "duffle vs tote", "difference between vanity and pouch")
  if (
    hasPhrase(q, [' vs ', 'versus', 'difference between', 'better between', 'compare', 'which one is better', 'which should i choose'])
  ) {
    if (hasWord(q, 'duffle') && hasWord(q, 'tote')) {
      return {
        text: `⚖️ **Duffle Bag vs. Quilted Tote Bag:**\n\n• **Quilted Barrel Duffle (18"×10"×10", 28L):**\n  - *Best For:* Weekend travel, gym, flights, overnight getaways.\n  - *Capacity:* 3–4 days clothes, shoes, toiletry pouch.\n• **Quilted Tote Bag (16"×14"×4.5"):**\n  - *Best For:* Daily office, college, shopping, cafes, everyday carry.\n  - *Capacity:* 15.6" laptop, planner, water bottle, wallet.\n\n*Recommendation:* Get the **Duffle** for trips & holidays, and the **Tote** for everyday chic carry!`,
        quickReplies: ['Show Duffle Bags', 'Show Tote Bags', 'Wholesale MOQs']
      }
    }
    if (hasWord(q, 'vanity') || hasWord(q, 'pouch')) {
      return {
        text: `⚖️ **Vanity Box vs. Pouch Trio:**\n\n• **Structured Vanity Box (9.5"×6.5"×5.5"):**\n  - *Best For:* Storing full-size skincare bottles, perfumes, and foundation upright on dressers and during travel.\n  - *Structure:* Firm padded walls with top handle.\n• **Pouch Trio (Set of 3 Nested Pouches):**\n  - *Best For:* Handbag organizing, makeup touch-ups, chargers, coins, and wedding favor gifting.\n  - *Structure:* Soft, flexible, collapsible.\n\n*Recommendation:* The **Vanity Box** is ideal for travel toiletries; the **Pouch Trio** is our top pick for gifting hampers!`,
        quickReplies: ['Show Vanity Boxes', 'Show Pouch Sets', 'Wedding Favors MOQ']
      }
    }
  }

  // 12. ARTISAN CRAFT, BLOCK PRINTING, HERITAGE & MATERIALS
  if (
    hasWord(q, ['craft', 'craftsmanship', 'handblock', 'sanganeri', 'bagru', 'dabu', 'cotton', 'material', 'materials', 'fabric', 'authentic', 'dye', 'dyes', 'wooden', 'artisan']) ||
    hasPhrase(q, ['how made', 'how are bags made', 'block print', 'block printing'])
  ) {
    return {
      text: `🧵 **Authentic Jaipur Handblock Heritage & Craftsmanship:**\n\n• **100% Pure Indian Cotton:** Sourced directly from local spinning mills and layered with soft inner quilting for plush durability.\n• **Teak Wood Block Carving:** Generational master craftsmen in Sanganer & Bagru carve intricate botanical and geometric motifs onto seasoned teak wood.\n• **Hand Stamping:** Each meter of fabric is hand-stamped up to **1,200 times** using natural mineral & azo-free vegetable dyes (indigo, madder root, pomegranate rind, turmeric).\n• **Sun Curing:** Fabrics are washed in local riverbeds and sun-dried in the vibrant Rajasthan sunshine to naturally set the colors.\n• **Handmade Detailing:** Finished with artisan fabric-and-bead tassels and reinforced heavy-duty zippers.`,
      quickReplies: ['Show Bestsellers', 'Wash & Care Guide', 'Wholesale MOQ', 'Shipping Timelines']
    }
  }

  // 13. WASH & CARE INSTRUCTIONS
  if (
    hasWord(q, ['wash', 'washing', 'care', 'clean', 'cleaning', 'iron', 'ironing', 'stain', 'detergent', 'waterproof', 'bleach', 'dryclean']) ||
    hasPhrase(q, ['machine wash', 'hand wash', 'how to clean', 'in rain'])
  ) {
    return {
      text: `🧼 **Wash & Care Guide for Quilted Block-Print Cotton:**\n\n1. **First Wash:** Gentle cold hand wash separately using mild liquid detergent (such as Ezee or baby shampoo).\n2. **Drying:** Always dry in the shade to preserve the brightness of natural botanical dyes. Avoid harsh direct afternoon sunlight.\n3. **Do Not:** Do not bleach, machine tumble-dry, or soak for prolonged hours.\n4. **Ironing:** Warm steam iron on cotton setting to restore the plush quilted ridges.\n5. **Rain / Water:** Quilted cotton handles light drizzles well, but is a breathable natural fabric (not rubber plastic). If wet, simply air dry in shade.`,
      quickReplies: ['Show Bestsellers', 'Shipping Details', 'Wholesale MOQ']
    }
  }

  // 14. PAYMENT METHODS & CASH ON DELIVERY (COD)
  if (
    hasWord(q, ['pay', 'payment', 'cod', 'upi', 'gpay', 'phonepe', 'paytm', 'card', 'cards', 'bhim', 'netbanking']) ||
    hasPhrase(q, ['cash on delivery', 'google pay', 'bank transfer'])
  ) {
    return {
      text: `💳 **Payment Modes & COD Policy:**\n\n• **Accepted Payment Modes:** UPI (Google Pay, PhonePe, Paytm, BHIM), Net Banking / IMPS, Credit & Debit Cards (Visa, Mastercard, RuPay, Amex), and International Wire Transfer (SWIFT).\n• **About COD (Cash on Delivery):** Because each piece is handcrafted, inspected, and shipped directly from our artisan workshop in Jaipur, we operate on direct digital payment to guarantee dispatch, reserve inventory, and pay artisans upfront without transit-return waste.\n• **100% Secure & Verified:** Instant digital receipt and direct courier tracking link provided upon confirmation.`,
      quickReplies: ['🛍️ Browse Collection', '🎁 Wholesale Inquiries', '💬 Chat on WhatsApp']
    }
  }

  // 15. TRANSIT DAMAGE, REPLACEMENTS & RETURNS
  if (
    hasWord(q, ['return', 'returns', 'refund', 'refunds', 'damage', 'damaged', 'broken', 'exchange', 'guarantee', 'warranty']) ||
    hasPhrase(q, ['return policy', 'what if broken', 'transit damage'])
  ) {
    return {
      text: `🛡️ **100% Quality & Transit Damage Guarantee:**\n\n• **Artisan Quality Check:** Every single bag undergoes a 3-stage quality check for stitching, zipper smoothness, and block-print clarity before dispatch.\n• **Transit Protection:** In the rare event that a parcel arrives damaged, simply share an unboxing photo/video on WhatsApp within **48 hours** of delivery.\n• **Free Immediate Replacement:** We will ship a brand-new replacement immediately at zero extra cost to you!\n• **Customer Happiness:** Our Jaipur workshop team is available on WhatsApp daily (9 AM – 9 PM IST) to assist with any order needs.`,
      action: {
        type: 'LINK',
        label: 'Contact Support on WhatsApp',
        url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Craft of Pink City, I have a question regarding order support/assistance.')}`
      },
      quickReplies: ['Shop Collection', 'Wholesale Inquiry', 'Contact Studio']
    }
  }

  // 16. GIFTING, GIFT NOTES & WEDDING HAMPERS
  if (
    hasWord(q, ['gift', 'gifting', 'present', 'presents', 'birthday', 'anniversary', 'sister', 'mother', 'friend', 'wrap', 'note', 'hamper'])
  ) {
    return {
      text: `🎁 **Artisan Gifting & Handwritten Notes:**\n\n• **Personalized Gift Notes:** We include a complimentary handwritten artisan note card with your custom message!\n• **Direct Recipient Delivery:** We can ship directly to your recipient's address with discreet pricing.\n• **Gift Packaging:** Beautifully wrapped in sustainable tissue with handmade fabric-bead tags.\n• **Top Gifting Choices:**\n  1. **Vanity Box & Pouch Trio Bundle** (Ideal for bridesmaids, mothers & sisters)\n  2. **Quilted Travel Duffle** (Perfect for frequent travelers & weekend getaways)\n  3. **Padded Laptop Sleeve** (Thoughtful gift for working professionals & students)`,
      quickReplies: ['Show Pouch Sets', 'Show Vanity Boxes', 'Show Travel Duffles', 'Order on WhatsApp']
    }
  }

  // 17. PRICING & BUDGET OVERVIEW
  if (
    hasWord(q, ['price', 'prices', 'cost', 'costs', 'rate', 'rates', 'cheap', 'expensive', 'affordable', 'offer']) ||
    hasPhrase(q, ['how much', 'discount code', 'price list'])
  ) {
    return {
      text: `🏷️ **Craft of Pink City Price Overview:**\n\n• **Pouch Trios (Set of 3):** ₹899 – ₹1,099\n• **Padded Laptop Sleeves:** ₹1,199 – ₹1,399\n• **Structured Vanity Boxes:** ₹1,099 – ₹1,349\n• **Quilted Tote Bags & Ruffle Bags:** ₹1,299 – ₹1,599\n• **Quilted Barrel Travel Duffles:** ₹1,699 – ₹1,899\n• **Yoga Mat Carriers:** ₹1,199 – ₹1,399\n\n💡 *Wholesale & Bulk Orders (25+ pcs) receive 15% to 35%+ tiered volume discounts!*`,
      quickReplies: ['🛍️ Browse Catalog', '🎁 Bulk / Wedding MOQ', '🧳 Travel Duffles', 'Order on WhatsApp']
    }
  }

  // 18. STYLING & OCCASION RECOMMENDATIONS
  if (
    hasWord(q, ['wear', 'style', 'outfit', 'match', 'occasion', 'dress', 'aesthetic', 'pair'])
  ) {
    return {
      text: `👗 **Styling Your Handcrafted Jaipur Bag:**\n\n• **Ethnic & Festive:** Pair our Marigold Yellow, Sanganeri Crimson, or Booti print bags with white chikankari kurtas, linen sarees, or pastel anarkalis for an effortless royal aesthetic.\n• **Contemporary & Casual:** Our Indigo Patchwork duffles and Candy-Stripe Ruffle totes look stunning with crisp white shirts, blue denim, and sundresses.\n• **Airport & Travel Look:** Carry a matching quilted duffle + pouch trio for an Instagram-worthy bohemian travel ensemble.\n• **Studio & Fitness:** The Royal Bengal Tiger yoga bag brings regal Jaipur heritage to modern workout gear.`,
      quickReplies: ['Show Ruffle Totes', 'Show Indigo Duffles', 'Bestsellers']
    }
  }

  // 19. SPECIFIC PRODUCT MATCHING (Search & Filtering)
  const matched = findMatchingProducts(q)
  if (matched.length > 0) {
    return {
      text: `✨ Here are the top handcrafted styles matching your query:\n\nTap **"View"** to see detailed zoom photos & specs, or **"+ Bag"** to add directly to your shopping bag.`,
      products: matched.slice(0, 4),
      quickReplies: ['Order on WhatsApp', 'Wholesale MOQ', 'Wash & Care', 'Shipping Timelines']
    }
  }

  // 20. DYNAMIC CONTEXTUAL REASONING FOR OPEN-ENDED QUESTIONS
  return buildGenerativeContextResponse(query)
}

/**
 * Helper: Find matching products by query
 */
function findMatchingProducts(query) {
  const q = query.toLowerCase()

  if (hasWord(q, ['yoga'])) return products.filter((p) => p.category.toLowerCase().includes('yoga'))
  if (hasWord(q, ['duffle', 'travel', 'weekender', 'barrel'])) {
    return products.filter((p) => p.category.toLowerCase().includes('duffle'))
  }
  if (hasWord(q, ['tote', 'ruffle'])) {
    return products.filter((p) => p.category.toLowerCase().includes('tote'))
  }
  if (hasWord(q, ['vanity', 'cosmetic'])) {
    return products.filter((p) => p.category.toLowerCase().includes('vanity'))
  }
  if (hasWord(q, ['laptop', 'sleeve', 'macbook'])) {
    return products.filter((p) => p.category.toLowerCase().includes('laptop'))
  }
  if (hasWord(q, ['pouch', 'trio', 'pouches'])) {
    return products.filter((p) => p.category.toLowerCase().includes('pouch'))
  }

  const printKeywords = [
    'marigold',
    'indigo',
    'safari',
    'tiger',
    'cats',
    'patchwork',
    'kalamkari',
    'ruffle',
    'pink',
    'blue',
    'teal',
    'yellow',
    'crimson',
    'sage',
    'mint',
    'peach',
    'ganjifa',
    'lotus',
    'mughal',
    'booti'
  ]

  for (const kw of printKeywords) {
    if (hasWord(q, kw)) {
      const matches = products.filter(
        (p) => p.name.toLowerCase().includes(kw) || p.description.toLowerCase().includes(kw)
      )
      if (matches.length > 0) return matches
    }
  }

  return []
}

/**
 * Helper: Generative local response for any custom user query
 */
function buildGenerativeContextResponse(userQuery) {
  const customQueryMessage = encodeURIComponent(
    `Hello Craft of Pink City, I have a question regarding: "${userQuery}". Could you please assist me with this?`
  )

  return {
    text: `Regarding your question: *"**${userQuery}**"*\n\nAt *Craft of Pink City*, every product is handcrafted in our Jaipur workshop using **100% pure quilted cotton** and authentic handblock printing. Whether you are looking for single retail pieces, customized wedding hampers (MOQ 25 pcs), specific dimensions, or custom dispatches, our workshop team would be delighted to assist you!\n\nFeel free to ask another question or tap below to connect with our artisan team on WhatsApp:`,
    action: {
      type: 'LINK',
      label: 'Ask Artisan Workshop on WhatsApp',
      url: `https://wa.me/${whatsappNumber}?text=${customQueryMessage}`
    },
    quickReplies: [
      '📏 Bag Dimensions & Sizes',
      '🎁 Wedding Favors (MOQ 25)',
      '🧼 Wash & Care Guidelines',
      '🚚 Shipping & Dispatch',
      '🛍️ Show Bestsellers'
    ]
  }
}

/**
 * Helper: Check for greetings
 */
function isGreeting(q) {
  const greetings = [
    'hi',
    'hello',
    'hey',
    'namaste',
    'kem cho',
    'salaam',
    'good morning',
    'good afternoon',
    'good evening',
    'hola',
    'hie',
    'hey there',
    'hii',
    'hiii'
  ]
  return greetings.some((g) => q === g || q.startsWith(g + ' ') || q.endsWith(' ' + g))
}

/**
 * Helper: Check for gratitude / closing
 */
function isGratitude(q) {
  const thanks = [
    'thank you',
    'thanks',
    'dhanyawad',
    'shukriya',
    'great thanks',
    'awesome',
    'nice',
    'helpful',
    'bye',
    'goodbye',
    'ok thanks',
    'perfect'
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

/**
 * Cloud LLM API Gateway (Google Gemini) - Optional Live Enhancement
 */
async function callGeminiAPI(userQuery, apiKey, cartContext) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`

  const systemInstruction = `You are Gulabi, the warm, polite, and knowledgeable AI artisan assistant for "Craft of Pink City" (craftofpinkcity.shop), a luxury handcrafted block-print quilted bag studio in Jaipur, Rajasthan.
Key Facts:
- Products: 100% pure quilted cotton travel duffles (18x10x10", 28L cabin approved), tote bags (16x14x4.5", fits 15.6" laptop), ruffled bags, yoga mat carriers (28.5x6.8"), padded laptop sleeves (fits 13-15.6" with 8mm foam), vanity boxes (9.5x6.5x5.5"), and pouch sets.
- Artisan Craft: Hand block-printed in Jaipur using hand-carved wood blocks and natural/azo-free dyes.
- Wholesale/Bulk: Starts at MOQ 25 pcs with customized monogram tags, tiered discounts (15-35%).
- Shipping: Ships in 24-48h. Pan-India 2-5 days, International (USA, UK, Canada, Dubai, Europe) 4-7 days via DHL/FedEx.
- Payment: UPI, Cards, Bank Transfer. COD is not available.
- Wash Care: Gentle cold hand wash, shade dry, warm steam iron.
- Safety: Strictly refuse adult, offensive, illegal, or irrelevant non-store topics politely.
Answer the customer's question directly, accurately, and politely with bullet points or concise paragraphs.`

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemInstruction}\n\nCustomer Question: ${userQuery}` }]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500
    }
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  if (!res.ok) return null
  const data = await res.json()
  const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!generatedText) return null

  return {
    text: generatedText,
    quickReplies: ['🛍️ Browse Collection', '🎁 Wedding Favors (MOQ 25)', '🚚 Shipping Timelines', '🧼 Fabric Care']
  }
}
