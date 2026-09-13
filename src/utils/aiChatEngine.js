import { products, whatsapp, whatsappNumber, email, faqs } from '../data/products.js'

/**
 * Advanced AI Conversational Engine - "Gulabi 2.5 Pro"
 * Trilingual Architecture: English, Hindi (हिंदी), and Hinglish (Jaipuri Conversational)
 * Supports natural human dialogue, wholesale calculator, sizing, and craft heritage.
 */

// Safety & Content Moderation Patterns (Adult, Illegal, Abusive, Inappropriate)
const INAPPROPRIATE_PATTERNS = [
  /\b(porn|pornography|nude|nudity|sex|xxx|nsfw|erotic|escort|bitch|fuck|bastard|asshole|dick|cock|pussy|vagina|boobs|drugs|weed|cocaine|heroin|meth|hack|hacking|weapon|gun|kill|murder|violence|gambling|casino|torrent|piracy|darkweb)\b/i
]

export function isContentSafe(message) {
  if (!message || typeof message !== 'string') return true
  return !INAPPROPRIATE_PATTERNS.some((pattern) => pattern.test(message))
}

/**
 * Detect language of input: 'hi' (Devanagari Hindi), 'hinglish' (Roman Hindi/Hinglish), or 'en' (English)
 */
export function detectLanguage(text) {
  if (!text) return 'en'
  // Devanagari script detection for Hindi
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi'
  }
  // Hinglish keyword detection
  const hinglishWords = [
    'kya', 'hai', 'hain', 'chahiye', 'kitna', 'kitne', 'kitni', 'kaise', 'batao', 'bataiye',
    'mujhe', 'aapka', 'aapke', 'aapki', 'karna', 'karo', 'hoga', 'hogi', 'milega', 'milegi',
    'shukriya', 'dhanyawad', 'bhejo', 'bhejiye', 'lagta', 'lagti', 'wali', 'wale', 'sasta',
    'accha', 'achha', 'khareedna', 'samaan', 'pouch', 'kapda', 'dhona', 'batao', 'pata', 'kab',
    'pahuchenga', 'kaha', 'jaipur', 'kaise', 'karo', 'bolo', 'sunao'
  ]
  const lower = text.toLowerCase()
  const isHinglish = hinglishWords.some((w) => new RegExp(`\\b${w}\\b`, 'i').test(lower))
  if (isHinglish) return 'hinglish'

  return 'en'
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

  if (hasWord(q, ['duffle', 'duffel', 'travel', 'overnight', 'weekender', 'luggage', 'barrel', 'yatra', 'safar'])) {
    matches = products.filter((p) => p.category === 'Duffle Bags')
  } else if (hasWord(q, ['tote', 'totes', 'handbag', 'shoulder', 'ruffle', 'ruffled', 'jhola', 'bag'])) {
    matches = products.filter((p) => p.category === 'Tote Bags')
  } else if (hasWord(q, ['vanity', 'makeup', 'cosmetic', 'box', 'toiletries', 'beauty', 'case', 'shringar'])) {
    matches = products.filter((p) => p.category === 'Vanity Boxes')
  } else if (hasWord(q, ['yoga', 'mat', 'carrier', 'gym', 'fitness', 'exercise'])) {
    matches = products.filter((p) => p.category === 'Yoga Mat Bags')
  } else if (hasWord(q, ['laptop', 'macbook', 'ipad', 'sleeve', 'cover', 'device', 'tablet'])) {
    matches = products.filter((p) => p.category === 'Laptop Sleeves')
  } else if (hasWord(q, ['pouch', 'pouches', 'trio', 'small', 'mini', 'coin', 'clutch', 'organizer', 'hair', 'batua'])) {
    matches = products.filter((p) => p.category === 'Pouch Sets' || p.category === 'Organizers' || p.category === 'Pouches')
  } else if (hasWord(q, ['indigo', 'dabu', 'blue', 'patchwork', 'neel'])) {
    matches = products.filter((p) => p.name.toLowerCase().includes('indigo') || p.name.toLowerCase().includes('patchwork'))
  } else if (hasWord(q, ['marigold', 'yellow', 'sunshine', 'peela', 'genda'])) {
    matches = products.filter((p) => p.name.toLowerCase().includes('marigold') || p.name.toLowerCase().includes('yellow') || p.name.toLowerCase().includes('sunshine'))
  } else if (hasWord(q, ['bestseller', 'popular', 'top', 'favorite', 'recommend', 'famous'])) {
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
 * Main Reasoning Dispatcher with Trilingual Support (English, Hindi, Hinglish)
 */
export function processUserMessage(userMessage, cartContext = null, history = [], preferredLanguage = null) {
  const query = (userMessage || '').trim()
  const detectedLang = detectLanguage(query)
  const lang = preferredLanguage || (detectedLang !== 'en' ? detectedLang : 'en')

  if (!query) return buildDefaultGreeting(lang)

  // 1. Safety Guardrails
  if (!isContentSafe(query)) {
    if (lang === 'hi') {
      return {
        text: `नमस्ते! 🙏 मैं **गुलाबी** हूँ, *क्राफ्ट ऑफ पिंक सिटी* की कारीगर सहायक। मैं केवल हमारे प्रामाणिक जयपुरी हस्तनिर्मित बैग्स, थोक ऑर्डर, फैब्रिक देखभाल और साइजिंग में सहायता कर सकती हूँ। कृपया बताएं मैं आपके ऑर्डर में कैसे मदद करूँ?`,
        quickReplies: ['🛍️ कलेक्शन देखें', '🧳 ट्रेवल डफल्स', '📦 होलसेल और बल्क', '🧼 फैब्रिक केयर']
      }
    } else if (lang === 'hinglish') {
      return {
        text: `Namaste! 🙏 Main **Gulabi** hoon, *Craft of Pink City* ki artisan assistant. Main specifically hamare authentic Jaipur handcrafted bags, wholesale orders, aur sizing me aapki help ke liye yahan hoon. Aapko kis bag ya order ke bare me janna hai?`,
        quickReplies: ['🛍️ Bestsellers Dekhein', '🧳 Quilted Duffles', '📦 Wholesale (MOQ 25)', '🧼 Wash Care']
      }
    }
    return {
      text: `Namaste. 🙏 I am **Gulabi**, the dedicated AI assistant for *Craft of Pink City*.\n\nI am here exclusively to help you with our handcrafted Jaipur bags, orders, wholesale inquiries, fabric care, dimensions, and customer service.`,
      quickReplies: ['🛍️ Browse Collection', '🧳 Quilted Duffles', '📦 Wholesale & Bulk (MOQ 25)', '🧼 Fabric Care']
    }
  }

  // 2. Dynamic Synthesis Engine in target language
  return synthesizeDynamicResponse(query, cartContext, lang)
}

/**
 * Generative Multilingual Synthesis
 */
function synthesizeDynamicResponse(query, cartContext, lang = 'en') {
  const q = query.toLowerCase()

  // --- GREETINGS ---
  if (isGreeting(q)) {
    if (lang === 'hi') {
      return {
        text: `नमस्ते! 🙏 मैं **गुलाबी** हूँ, *क्राफ्ट ऑफ पिंक सिटी* की आपकी जयपुरी कारीगर सहायक।\n\nमैं आपकी इन सभी में सहायता कर सकती हूँ:\n• 🧳 **क्विल्टेड ट्रेवल डफल्स एवं टोट बैग्स**\n• 📦 **थोक व बल्क ऑर्डर्स (न्यूनतम २५ पीस)** ब्रांड लोगो टैग्स के साथ\n• 📏 **बैग साइज व लैपटॉप फिट (१३"–१६")**\n• 🧼 **जयपुरी ब्लॉक-प्रिंट फैब्रिक धुलाई व देखभाल**\n\nआज मैं आपके लिए क्या तैयार करूँ?`,
        quickReplies: ['🛍️ बेस्टसेलर्स देखें', '🧳 ट्रेवल डफल्स', '📦 थोक ऑर्डर (MOQ 25)', '📏 साइज गाइड']
      }
    } else if (lang === 'hinglish') {
      return {
        text: `Namaste! 🙏 Main **Gulabi** hoon, *Craft of Pink City* ki Jaipur artisan concierge.\n\nMain aapki in sabhi cheezon me help kar sakti hoon:\n• 🧳 **Quilted Travel Duffles & Tote Bags**\n• 📦 **Wholesale & Bulk Orders (MOQ 25 pcs)** custom logo tags ke sath\n• 📏 **Bag Sizing & Laptop Fit (13"–16")**\n• 🧼 **Pure Cotton Block Print Fabric Care**\n\nBataiye, aaj aapko retail bag chahiye ya wholesale quote?`,
        quickReplies: ['🛍️ Bestsellers Dekhein', '🧳 Quilted Duffles', '📦 Wholesale (MOQ 25)', '📏 Laptop Bag Sizes']
      }
    }

    return {
      text: `Namaste! 🙏 I'm **Gulabi**, your Jaipur Craft & Shopping AI concierge at *Craft of Pink City*.\n\nI can help you with:\n• 🛍️ **Finding the perfect bag** (Duffles, Totes, Vanity Cases, Laptop Sleeves, Yoga Carriers)\n• 📦 **Instant Wholesale Calculator** (MOQ 25 pcs with tiered bulk discounts)\n• 📏 **Dimensions, sizing & what fits inside**\n• 🧼 **Authentic Jaipuri fabric care & washing guide**\n• 🚚 **Delivery dispatch & order assistance**\n\nHow may I assist you today?`,
      quickReplies: ['🛍️ Show Bestsellers', '🧳 Quilted Travel Duffles', '📦 Wholesale & Bulk (MOQ 25)', '📏 Bag Dimensions & Fit']
    }
  }

  // --- GRATITUDE ---
  if (isGratitude(q)) {
    if (lang === 'hi') {
      return {
        text: `आपका बहुत-बहुत धन्यवाद! 🌸 हमारी जयपुरी कारीगरी में आपकी रुचि देखकर हमें अत्यंत प्रसन्नता हुई। यदि आपको कोई और सहायता या थोक जानकारी चाहिए, तो आप कभी भी पूछ सकते हैं या व्हाट्सएप पर जुड़ सकते हैं। आपका दिन शुभ हो!`,
        quickReplies: ['🛍️ कलेक्शन देखें', '📦 थोक पूछताछ', '💬 व्हाट्सएप पर बात करें']
      }
    } else if (lang === 'hinglish') {
      return {
        text: `Aapka bohot bohot shukriya! 🌸 Humein aapki help karke bohot khushi hui. Agar koi bhi sizing doubt ya bulk order quote chahiye, toh aap kabhi bhi puch sakte hain ya seedhe WhatsApp par message karein. Have a wonderful day!`,
        quickReplies: ['🛍️ Collection Dekhein', '📦 Wholesale Inquiries', '💬 WhatsApp Chat']
      }
    }
    return {
      text: `You are most welcome! 🌸 It is our absolute joy to assist you. If you need anything else—like sizing advice, wholesale slabs, or custom logo branding—just ask me anytime or connect directly with our workshop team on WhatsApp. Have a wonderful day!`,
      quickReplies: ['🛍️ Browse Retail Collection', '📦 Wholesale Inquiries', '💬 Chat on WhatsApp']
    }
  }

  // --- ABOUT BRAND / ARTISAN STUDIO ---
  if (hasPhrase(q, ['who are you', 'what is your name', 'about you', 'about pink city', 'koun ho', 'kaun ho', 'kya karte ho', 'kahan se ho', 'jaipur'])) {
    if (lang === 'hi') {
      return {
        text: `🌸 **गुलाबी और क्राफ्ट ऑफ पिंक सिटी के बारे में:**\n\n• **मैं गुलाबी हूँ**, *क्राफ्ट ऑफ पिंक सिटी* की डिजिटल कारीगर सहायक। हमारा वर्कशॉप **जयपुर, राजस्थान** में स्थित है।\n• **प्रामाणिक विरासत:** हम १००% शुद्ध सूती कपड़े पर शीशम के लकड़ी के ब्लॉक्स और प्राकृतिक वनस्पति रंगों से हाथ से छपाई और क्विल्टिंग करते हैं।\n• **सीधा वर्कशॉप मॉडल:** बिना किसी बिचौलिए के हमारे कुशल कारीगर हर बैग को प्यार और शुद्धता से सिलते हैं।\n• **थोक व कस्टमाइजेशन:** हम पूरे भारत और विश्वभर में बुटीक और कॉर्पोरेट गिफ्टिंग के लिए कस्टम ब्रांडिंग के साथ डिलीवरी करते हैं।`,
        quickReplies: ['🛍️ बेस्टसेलर्स', '🧳 ट्रेवल डफल्स', '📦 थोक कैटलॉग']
      }
    } else if (lang === 'hinglish') {
      return {
        text: `🌸 **About Gulabi & Craft of Pink City:**\n\n• **Main Gulabi hoon**, *Craft of Pink City* ki AI concierge. Humara direct textile workshop **Jaipur, Rajasthan** me hai.\n• **Generational Craft:** Hum 100% pure cotton par hand-carved woodblocks aur natural dyes se traditional Sanganeri & Bagru prints banate hain.\n• **Direct Workshop:** Har bag local master artisans dwara diamond quilting aur heavy brass zip ke sath banaya jata hai.\n• **Wholesale & Custom:** Hum boutique owners aur corporate gifting ke liye custom logo tags ke sath bulk orders deliver karte hain.`,
        quickReplies: ['🛍️ Show Bestsellers', '🧳 Quilted Duffles', '📦 Wholesale Catalog']
      }
    }
    return {
      text: `🌸 **About Gulabi & Craft of Pink City:**\n\n• **I am Gulabi**, the intelligent AI concierge for *Craft of Pink City*—a direct artisan textile studio located in **Jaipur, Rajasthan**.\n• **Generational Heritage:** We specialize in authentic hand block-printed, quilted 100% pure cotton accessories using traditional woodblocks, natural vegetable dyes, and diamond quilting.\n• **Direct Workshop Model:** Every piece is ethically handcrafted by skilled local artisans without retail middlemen.\n• **Wholesale & Custom Gifting:** We partner with boutiques, brands, and corporate gifting clients across India and globally.`,
      quickReplies: ['🛍️ Show Bestsellers', '🧳 Quilted Duffles', '📦 Wholesale & Bulk Catalog']
    }
  }

  // --- WHOLESALE & DYNAMIC BULK CALCULATOR ---
  const qtyMatch = q.match(/(\d+)\s*(pcs|pieces|bags|units|pouches|sets|totes|duffles|hampers|items|peace|piece)?/i)
  if (
    qtyMatch ||
    hasWord(q, ['bulk', 'wholesale', 'moq', 'resell', 'reseller', 'boutique', 'corporate', 'hamper', 'discount', 'quantity', 'quote', 'slab', 'thok', 'vyapar', 'kimat', 'rate'])
  ) {
    const qty = qtyMatch ? parseInt(qtyMatch[1], 10) : null
    let discount = '15% to 35%+'
    let tierTitle = 'Starter Wholesale'

    if (qty) {
      if (qty >= 500) { discount = '40%+ (Factory Direct)'; tierTitle = 'Large-Scale Production' }
      else if (qty >= 101) { discount = '30% - 35%'; tierTitle = 'Volume Wholesale / Corporate' }
      else if (qty >= 51) { discount = '25% - 30%'; tierTitle = 'Mid-Volume Wholesale' }
      else if (qty >= 25) { discount = '15% - 20%'; tierTitle = 'Starter Boutique Wholesale' }
      else { discount = 'Retail Slab'; tierTitle = 'Below MOQ (Retail)' }
    }

    if (lang === 'hi') {
      return {
        text: `📦 **थोक व बल्क ऑर्डर प्रोग्राम ${qty ? `(${qty} पीस)` : ''}:**\n\n• **कम MOQ:** केवल **२५ पीस** प्रति श्रेणी से शुरू (आप प्रिंट्स और कलर्स मिक्स कर सकते हैं)।\n• **छूट स्लैब:** **${discount}** (${tierTitle})।\n• **फ्री कस्टम ब्रांडिंग:** आपके बुटीक का लोगो टैग और ब्रांड कार्ड बिना किसी अतिरिक्त शुल्क के लगाया जाता है।\n• **डिस्पैच समय:** आपके ऑर्डर की मात्रा के अनुसार वर्कशॉप टीम द्वारा तय कर व्हाट्सएप पर कन्फर्म किया जाता है।\n• **डिलीवरी:** पूरे भारत व विदेश में सुरक्षित एक्सप्रेस कूरियर द्वारा।`,
        action: {
          type: 'LINK',
          label: qty ? `व्हाट्सएप पर ${qty} पीस का थोक कोट प्राप्त करें` : 'व्हाट्सएप पर थोक कैटलॉग मांगें',
          url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            qty
              ? `नमस्ते Craft of Pink City, मुझे ${qty} पीस का थोक कोटेशन चाहिए (${tierTitle})। कृपया रेट स्लैब और डिस्पैच समय बताएं।`
              : 'नमस्ते Craft of Pink City, कृपया बुटीक ऑर्डर्स के लिए थोक कैटलॉग और मूल्य सूची साझा करें।'
          )}`,
          internalAnchor: '#bulk-orders'
        },
        quickReplies: ['🌸 पाउच ट्रायो बल्क', '💄 वैनिटी बॉक्स थोक', '🧳 क्विल्टेड डफल MOQ']
      }
    } else if (lang === 'hinglish') {
      return {
        text: `📦 **Wholesale & Bulk Orders Program ${qty ? `(${qty} Pieces)` : ''}:**\n\n• **Low MOQ:** Sirf **25 pieces** per category se start hota hai (mix and match prints allowed).\n• **Discount Tier:** **${discount}** (${tierTitle}).\n• **Free Custom Brand Tags:** Aapke boutique/brand ka logo tag aur thank-you card free lagaya jata hai.\n• **Dispatch Schedule:** Total quantity ke hisab se hamari workshop team WhatsApp par instant schedule confirm karti hai.\n• **Pan-India & Global Delivery:** Doorstep express shipping available.`,
        action: {
          type: 'LINK',
          label: qty ? `WhatsApp Par ${qty} Pcs Ka Wholesale Quote Lein` : 'WhatsApp Par Wholesale Catalog Mangein',
          url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
            qty
              ? `Hello Craft of Pink City, mujhe ${qty} pieces ka wholesale quote chahiye (${tierTitle}). Please pricing slabs aur dispatch schedule batayein.`
              : 'Hello Craft of Pink City, please share your wholesale catalog, MOQ slabs, and bulk pricing for boutique orders.'
          )}`,
          internalAnchor: '#bulk-orders'
        },
        quickReplies: ['🌸 Pouch Trios Bulk', '💄 Vanity Boxes Wholesale', '🧳 Quilted Duffles MOQ']
      }
    }

    return {
      text: `📦 **Wholesale & Bulk Orders Program ${qty ? `(${qty} Pieces)` : ''}:**\n\n• **Low MOQ:** Starts at just **25 pieces** per category (mix and match prints & colors freely).\n• **Discount Tier:** **${discount}** (${tierTitle}).\n• **Bespoke Customization:** Add your own brand logo tags or cards at no extra charge.\n• **Production & Dispatch:** Timelines are decided by our workshop team based on total order quantity and confirmed instantly on WhatsApp.\n• **Global & Pan-India Shipping:** Insured express courier to your doorstep.`,
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
      quickReplies: ['🌸 Pouch Trios in Bulk', '💄 Vanity Boxes Wholesale', '🧳 Quilted Duffles MOQ']
    }
  }

  // --- TRAVEL DUFFLES ---
  if (hasWord(q, ['duffle', 'duffel', 'travel', 'weekender', 'overnight', 'flight', 'cabin', 'safar', 'yatra'])) {
    const duffles = products.filter((p) => p.category === 'Duffle Bags')
    if (lang === 'hi') {
      return {
        text: `🧳 **क्विल्टेड ट्रेवल डफल्स (फ्लाइट केबिन अप्रूव्ड):**\n\n• **साइज व क्षमता:** **१८" लंबाई × १०" चौड़ाई × १०" ऊंचाई** (~२८ लीटर क्षमता)।\n• **क्या-क्या आ सकता है:** २–३ दिन के कपड़े, जूते, वैनिटी पाउच, चार्जर और ट्रेवल का जरूरी सामान।\n• **केबिन फ्रेंडली:** फ्लाइट के ओवरहेड बिन और सीट के नीचे आसानी से फिट होता है।\n• **मजबूती:** शुद्ध कॉटन कैनवास, डायमंड क्विल्टिंग, मजबूत डबल हैंडल और डिटैचेबल शोल्डर स्ट्रैप।`,
        quickReplies: ['ब्लश बोटैनिकल डफल', 'हेरिटेज इंडिगो पैचवर्क', 'ब्लू पॉपी डफल'],
        products: duffles.slice(0, 3)
      }
    } else if (lang === 'hinglish') {
      return {
        text: `🧳 **Quilted Travel Duffles (Cabin Approved):**\n\n• **Dimensions & Capacity:** **18" Length × 10" Width × 10" Height** (~28 Litres capacity).\n• **Kya Fit Hoga:** 2-3 din ke kapde, footwear, vanity pouch, toiletries aur charger aasaani se aa jate hain.\n• **Flight & Weekend Trip Friendly:** Airline overhead cabin aur car boot me perfect fit hota hai.\n• **Material:** 100% pure cotton canvas, diamond quilting aur detachable shoulder strap.`,
        quickReplies: ['Blush Botanical Duffle', 'Heritage Indigo Patchwork', 'Blue Poppy Duffle'],
        products: duffles.slice(0, 3)
      }
    }
    return {
      text: `🧳 **Quilted Travel Duffles (Cabin Approved):**\n\n• **Dimensions & Capacity:** **18" Length × 10" Width × 10" Height** (~28 Litres capacity).\n• **What Fits Inside:** 2–3 days of clothing, footwear, vanity pouch, toiletries, and travel essentials.\n• **Flight Friendly:** Fits effortlessly in airline overhead bins and under seats.\n• **Construction:** Diamond quilted with 100% cotton canvas, reinforced dual handles, and padded shoulder strap.`,
      quickReplies: ['Blush Botanical Duffle', 'Heritage Indigo Patchwork', 'Blue Poppy Duffle'],
      products: duffles.slice(0, 3)
    }
  }

  // --- TOTE BAGS & LAPTOP SLEEVES ---
  if (hasWord(q, ['laptop', 'macbook', 'ipad', 'tote', 'totes', 'handbag', 'shoulder', 'ruffle', 'office', 'jhola'])) {
    const laptopProducts = products.filter((p) => p.category === 'Laptop Sleeves' || p.category === 'Tote Bags')
    if (lang === 'hi') {
      return {
        text: `💻 **लैपटॉप व टोट बैग साइज गाइड:**\n\n• **१३" से १४" लैपटॉप:** हमारा **क्विल्टेड लैपटॉप स्लीव (१४.५" × १०.५")** १३" मैकबुक और १४" लैपटॉप्स को ८मिमी शॉकप्रूफ फोम पैडिंग के साथ सुरक्षित रखता है।\n• **१५.६" से १६" लैपटॉप:** हमारे **क्विल्टेड टोट बैग्स (१६" × १४" × ४.५")** में १५.६" लैपटॉप, डायरी, पानी की बोतल और रोजमर्रा का सामान आसानी से आता है।\n• **स्टाइल:** हाथ से ब्लॉक प्रिंटेड रफल बॉर्डर्स और मजबूत शोल्डर हैंडल।`,
        quickReplies: ['लैपटॉप स्लीव्स देखें', 'टोट बैग्स देखें', 'व्हाट्सएप ऑर्डर'],
        products: laptopProducts.slice(0, 3)
      }
    } else if (lang === 'hinglish') {
      return {
        text: `💻 **Laptop & Tote Bag Sizing Guide:**\n\n• **13" to 14" Laptops:** Humara **Quilted Laptop Sleeve (14.5" × 10.5")** 8mm shockproof foam padding aur charger zip compartment ke sath aata hai.\n• **15.6" to 16" Laptops:** Humare **Quilted Tote Bags (16" × 14" × 4.5")** me 15.6" laptop, diary, water bottle aur daily essentials comfortably fit hote hain.\n• **Speciality:** Pure cotton lightweight fabric with durable double shoulder handles.`,
        quickReplies: ['Show Laptop Sleeves', 'Show Tote Bags', 'Order on WhatsApp'],
        products: laptopProducts.slice(0, 3)
      }
    }
    return {
      text: `💻 **Laptop & Device Sizing Guide:**\n\n• **13" to 14" Laptops & MacBooks:** Our **Quilted Laptop Sleeve (14.5" × 10.5")** fits 13" MacBook Air/Pro, 14" laptops with **8mm shockproof foam padding** and charger pocket.\n• **15.6" to 16" Laptops:** Our **Quilted Tote Bags (16" × 14" × 4.5")** comfortably hold up to 15.6" laptops, bottles, and work essentials.\n• **Protection:** Quilted cotton absorbs bumps while remaining feather-light.`,
      quickReplies: ['Show Laptop Sleeves', 'Show Tote Bags', 'Order on WhatsApp'],
      products: laptopProducts.slice(0, 3)
    }
  }

  // --- VANITY BOXES & MAKEUP ORGANIZERS ---
  if (hasWord(q, ['vanity', 'makeup', 'cosmetic', 'box', 'toiletries', 'bottles', 'shringar'])) {
    const vanities = products.filter((p) => p.category === 'Vanity Boxes')
    if (lang === 'hi') {
      return {
        text: `💄 **क्विल्टेड वैनिटी बॉक्स व कॉस्मेटिक ऑर्गेनाइजर:**\n\n• **साइज:** **९.५" × ६.५" × ५.५"** मजबूत चौकोर डिजाइन।\n• **सीधी बोतल सुरक्षा:** परफ्यूम, सीरम और फाउंडेशन की शीशियों को सीधा रखता है ताकि लीकेज का खतरा न रहे।\n• **वॉटर-रेसिस्टेंट लाइनिंग:** अंदर वाटर-रेसिस्टेंट कपड़ा लगा है जिसे आसानी से पोंछा जा सकता है।\n• **ब्रश होल्डर:** ढक्कन के अंदर इलास्टिक मेकअप ब्रश होल्डर्स दिए गए हैं।`,
        quickReplies: ['वैनिटी बॉक्स देखें', 'व्हाट्सएप पर ऑर्डर करें'],
        products: vanities.slice(0, 3)
      }
    } else if (lang === 'hinglish') {
      return {
        text: `💄 **Quilted Vanity Boxes & Travel Organizers:**\n\n• **Dimensions:** **9.5" × 6.5" × 5.5"** with structured vertical walls.\n• **Upright Bottle Safety:** Glass perfume bottles, foundations aur serums travel ke dauran bilkul seedhe rehte hain, zero leakage risk.\n• **Easy Clean:** Water-resistant wipeable inner lining aur elastic brush holders.\n• **Carry Handle:** Top sturdy handle with dual smooth zippers.`,
        quickReplies: ['Vanilla & Teal Vanity Case', 'Chartreuse Bloom Vanity', 'Show All Vanity Cases'],
        products: vanities.slice(0, 3)
      }
    }
    return {
      text: `💄 **Quilted Vanity Boxes & Travel Organizers:**\n\n• **Dimensions:** **9.5" × 6.5" × 5.5"** with structured vertical sidewalls.\n• **Upright Bottle Safety:** Keeps full-size perfume bottles and skincare standing upright to eliminate leaks.\n• **Spill Protection:** Lined with wipeable inner fabric and internal elastic brush organizers.\n• **Top Handle:** Sturdy grab-and-go handle with dual-direction zipper.`,
      quickReplies: ['Vanilla & Teal Vanity Case', 'Chartreuse Bloom Vanity', 'Show All Vanity Cases'],
      products: vanities.slice(0, 3)
    }
  }

  // --- POUCH SETS ---
  if (hasWord(q, ['pouch', 'pouches', 'trio', 'small', 'mini', 'clutch', 'batua'])) {
    const pouches = products.filter((p) => p.category === 'Pouch Sets' || p.category === 'Pouches')
    if (lang === 'hi') {
      return {
        text: `🌸 **हस्तनिर्मित क्विल्टेड पाउच ट्रायो (३ का सेट):**\n\n• **३ नेस्टेड साइज:**\n  १. **बड़ा (१०" × ६" × ४"):** स्किनकेयर, क्रीम्स और पावर बैंक के लिए।\n  २. **मध्यम (८" × ५" × ३.५"):** लिपस्टिक, दवाइयां और ज्वेलरी के लिए।\n  ३. **छोटा (६" × ४" × २.५"):** चाबियां, सिक्के और ईयरफोन के लिए।\n• **कारीगरी:** लकड़ी के ब्लॉक प्रिंट्स और सुंदर बीडेड पोम-पॉम टैसल्स।`,
        quickReplies: ['मैरीगोल्ड ब्लूम ट्रायो', 'कोरल पैस्ले ट्रायो', 'मिंट बेरी ट्रायो'],
        products: pouches.slice(0, 3)
      }
    } else if (lang === 'hinglish') {
      return {
        text: `🌸 **Handcrafted Quilted Pouch Trios (Set of 3):**\n\n• **3 Nested Sizes:**\n  1. **Large (10" × 6" × 4"):** Skincare, full-size creams aur power banks.\n  2. **Medium (8" × 5" × 3.5"):** Compact makeup, lipsticks aur jewelry.\n  3. **Small (6" × 4" × 2.5"):** Keys, cards, earphones aur coins.\n• **Artisan Charm:** Signature hand-block prints with pompom zipper tassels.`,
        quickReplies: ['Marigold Bloom Trio', 'Coral Paisley Trio', 'Mint Berry Trio'],
        products: pouches.slice(0, 3)
      }
    }
    return {
      text: `🌸 **Handcrafted Quilted Pouch Trios (Set of 3):**\n\n• **3 Nested Sizes:**\n  1. **Large (10" × 6" × 4"):** Skincare, sunscreens, and power banks.\n  2. **Medium (8" × 5" × 3.5"):** Makeup, lipsticks, and jewelry.\n  3. **Small (6" × 4" × 2.5"):** Keys, cards, and earphones.\n• **Artisan Detailing:** Hand-carved block prints with beaded pompom zipper tassels.`,
      quickReplies: ['Marigold Bloom Trio', 'Coral Paisley Trio', 'Mint Berry Trio'],
      products: pouches.slice(0, 3)
    }
  }

  // --- FABRIC CARE & WASHING ---
  if (hasWord(q, ['wash', 'clean', 'care', 'washing', 'iron', 'detergent', 'dhona', 'safai', 'color', 'rang'])) {
    if (lang === 'hi') {
      return {
        text: `🧼 **शुद्ध सूती क्विल्टेड बैग्स की धुलाई व देखभाल:**\n\n• **पहली धुलाई:** प्राकृतिक रंगों को पक्का करने के लिए ठंडे पानी में १ चम्मच नमक डालकर हाथ से धोएं।\n• **नियमित धुलाई:** माइल्ड लिक्विड डिटर्जेंट (जैसे Ezee) के साथ हल्के हाथ से ठंडे पानी में धोएं।\n• **सुखाना:** हमेशा छाया में सुखाएं। सीधी तेज धूप से बचाएं।\n• **सावधानी:** ब्लीच न करें, जोर से न निचोड़ें और वॉशिंग मशीन में न सुखाएं।\n• **इस्त्री:** कॉटन सेटिंग पर गर्म भाप वाली हल्की प्रेस करें।`,
        quickReplies: ['🛍️ कलेक्शन देखें', '💬 व्हाट्सएप सपोर्ट']
      }
    } else if (lang === 'hinglish') {
      return {
        text: `🧼 **Fabric Care & Washing Guide for Quilted Cotton:**\n\n• **First Wash:** Natural vegetable dyes ko lock karne ke liye cold water me 1 spoon namak daalkar gentle hand wash karein.\n• **Regular Wash:** Mild liquid detergent (jaise Ezee) ke sath cold water hand wash karein.\n• **Drying:** Hamesha shade me dry karein taaki vibrant colors bane rahein. Harsh dhoop se bachayein.\n• **Dont's:** Machine tumble dry ya bleach na karein.\n• **Ironing:** Warm steam iron se quilting ka plush puffiness dobara fresh ho jata hai.`,
        quickReplies: ['🛍️ Browse Collection', '💬 WhatsApp Support']
      }
    }
    return {
      text: `🧼 **Fabric Care & Washing Guidelines for Quilted Cotton:**\n\n• **First Wash:** Hand wash separately in cold water with 1 teaspoon of salt to lock in botanical dyes.\n• **Regular Wash:** Gentle hand wash in cold water using mild liquid detergent.\n• **Drying:** Always dry in the shade to preserve vibrant colors.\n• **Do Not:** Do not bleach, wring harshly, or machine tumble dry.\n• **Ironing:** Warm steam iron on cotton setting to restore plush quilting puffiness.`,
      quickReplies: ['🛍️ Browse Collection', '💬 WhatsApp Support']
    }
  }

  // --- DOMESTIC & INTERNATIONAL DELIVERY ---
  if (hasWord(q, ['deliver', 'delivery', 'reach', 'dispatch', 'ship', 'shipping', 'pincode', 'days', 'kab', 'pahuchenga', 'kaha'])) {
    if (lang === 'hi') {
      return {
        text: `🚚 **डिलीवरी व डिस्पैच की जानकारी:**\n\n• **मात्रा के आधार पर समय:** क्योंकि हर बैग हमारे जयपुर वर्कशॉप में हाथ से तैयार होता है, इसलिए सटीक डिस्पैच समय आपके **ऑर्डर की मात्रा और कस्टमाइजेशन** के आधार पर तय होता है।\n• **व्हाट्सएप पर पुष्टि:** व्हाट्सएप पर पूछताछ करते ही हमारी टीम आपके ऑर्डर का सटीक डिलीवरी शेड्यूल बता देती है।\n• **अखिल भारतीय सेवा:** भारत के सभी १९,०००+ पिन कोड्स पर एक्सप्रेस कूरियर (Bluedart, Delhivery, DTDC) से डिलीवरी।\n• **लाइव ट्रैकिंग:** पार्सल निकलते ही व्हाट्सएप पर लाइव ट्रैकिंग लिंक भेजा जाता है।`,
        action: {
          type: 'LINK',
          label: 'व्हाट्सएप पर डिलीवरी समय चेक करें',
          url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('नमस्ते Craft of Pink City, मुझे डिलीवरी और डिस्पैच समय की जानकारी चाहिए।')}`
        },
        quickReplies: ['💳 भुगतान के तरीके', '🛍️ कलेक्शन देखें', '💬 व्हाट्सएप']
      }
    } else if (lang === 'hinglish') {
      return {
        text: `🚚 **Delivery & Dispatch Information:**\n\n• **Order Quantity Based Schedule:** Har piece Jaipur artisan workshop me authentically handcraft hota hai, isliye exact dispatch timeline total order quantity aur customization par depend karta hai.\n• **WhatsApp Confirmation:** Jab aap WhatsApp par message karte hain, hamari team instant exact dispatch schedule confirm kar deti hai.\n• **All-India PIN Codes:** Bluedart, Delhivery aur DTDC express couriers se safe delivery.\n• **Live Tracking:** Parcel dispatch hote hi tracking link WhatsApp par mil jata hai.`,
        action: {
          type: 'LINK',
          label: 'Confirm Dispatch Schedule on WhatsApp',
          url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Craft of Pink City, I want to check delivery & dispatch schedule.')}`
        },
        quickReplies: ['💳 Payment Options', '🛍️ Browse Collection', '💬 WhatsApp']
      }
    }
    return {
      text: `🚚 **Delivery & Dispatch Information:**\n\n• **Decided by Order Quantity:** Handcrafted in our Jaipur workshop, exact dispatch schedules are decided based on your **total quantity and customization**.\n• **Confirmed on WhatsApp:** Our workshop team confirms exact dates directly upon WhatsApp inquiry.\n• **All-India Coverage:** Express couriers (Bluedart, Delhivery, DTDC) covering 19,000+ PIN codes.\n• **Live Tracking:** Direct tracking link sent on WhatsApp upon dispatch.`,
      action: {
        type: 'LINK',
        label: 'Confirm Dispatch Schedule on WhatsApp',
        url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Craft of Pink City, I would like to check delivery and dispatch schedule.')}`
      },
      quickReplies: ['💳 Payment Options', '🛍️ Browse Collection', '💬 WhatsApp Support']
    }
  }

  // --- MATCHED PRODUCTS FALLBACK ---
  const matchedProducts = findMatchingProducts(query, 3)
  if (matchedProducts.length > 0) {
    const bullets = matchedProducts.map((p) => `• **${p.name}** (${p.price}) — *${p.category}*`).join('\n')
    if (lang === 'hi') {
      return {
        text: `✨ **"${query}" के लिए हमारे हस्तनिर्मित बैग्स:**\n\n${bullets}\n\nनीचे दिए गए किसी भी उत्पाद पर टैप करके आप उसे बैग में जोड़ सकते हैं या सीधे व्हाट्सएप पर ऑर्डर कर सकते हैं!`,
        products: matchedProducts,
        quickReplies: ['🛍️ सभी उत्पाद देखें', '🧳 ट्रेवल डफल्स', '📦 थोक भाव (MOQ 25)', '💬 व्हाट्सएप']
      }
    } else if (lang === 'hinglish') {
      return {
        text: `✨ **Handcrafted Recommendations for "${query}":**\n\n${bullets}\n\nNeeche kisi bhi product par tap karke aap use Bag me add kar sakte hain ya direct WhatsApp par order kar sakte hain!`,
        products: matchedProducts,
        quickReplies: ['🛍️ Show All Products', '🧳 Quilted Duffles', '📦 Wholesale Quote (25+ MOQ)', '💬 WhatsApp']
      }
    }
    return {
      text: `✨ **Handcrafted Recommendations for "${query}":**\n\n${bullets}\n\nTap any product below to view details, add to your bag, or order directly on WhatsApp!`,
      products: matchedProducts,
      quickReplies: ['🛍️ Show All Products', '🧳 Quilted Duffles', '📦 Wholesale Quote (25+ MOQ)', '💬 WhatsApp']
    }
  }

  // --- GENERAL FALLBACK ---
  if (lang === 'hi') {
    return {
      text: `🌸 **क्राफ्ट ऑफ पिंक सिटी सहायक:**\n\nमैं हमारे प्रामाणिक जयपुरी हाथ से ब्लॉक प्रिंटेड बैग्स, साइज, थोक दरों और फैब्रिक केयर में आपकी पूरी सहायता के लिए यहाँ हूँ।\n\n• क्या आप हमारे **ट्रेवल डफल्स**, **टोट बैग्स**, **वैनिटी बॉक्स** या **पाउच सेट्स** देखना चाहते हैं?\n• या क्या आप **थोक ऑर्डर्स (न्यूनतम २५ पीस)** के लिए जानकारी चाहते हैं?`,
      quickReplies: ['🛍️ बेस्टसेलर्स', '🧳 ट्रेवल डफल्स', '📦 थोक ऑर्डर (MOQ 25)', '📏 साइज गाइड']
    }
  } else if (lang === 'hinglish') {
    return {
      text: `🌸 **Craft of Pink City Assistant:**\n\nMain aapki authentic Jaipur hand block-printed bags, dimensions, wholesale rates aur wash care me help ke liye yahan hoon.\n\n• Kya aap humare **Quilted Travel Duffles**, **Tote Bags**, **Vanity Cases** ya **Pouch Trios** dekhna chahte hain?\n• Ya fir **Wholesale & Bulk Orders (MOQ 25 pcs)** ka quote chahiye?`,
      quickReplies: ['🛍️ Show Bestsellers', '🧳 Quilted Travel Duffles', '📦 Wholesale & Bulk (MOQ 25)', '📏 Sizing Guide']
    }
  }

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

function buildDefaultGreeting(lang = 'en') {
  if (lang === 'hi') {
    return {
      text: `नमस्ते! 🙏 मैं **गुलाबी** हूँ, आपकी जयपुरी कारीगर सहायक। मैं आज आपके लिए क्या तैयार करूँ?`,
      quickReplies: ['🛍️ बेस्टसेलर्स', '🧳 ट्रेवल डफल्स', '📦 थोक ऑर्डर (MOQ 25)', '🧵 कारीगरी प्रक्रिया']
    }
  } else if (lang === 'hinglish') {
    return {
      text: `Namaste! 🙏 Main **Gulabi** hoon, aapki Jaipur Craft Assistant. Bataiye aaj handcrafted bags ya wholesale order me kya help karoon?`,
      quickReplies: ['🛍️ Show Bestsellers', '🧳 Quilted Duffles', '📦 Wholesale (MOQ 25)', '🧵 The Craft Process']
    }
  }
  return {
    text: `Namaste! 🙏 I'm **Gulabi**, your Jaipur Craft Assistant. How can I help you today with our handcrafted bags or wholesale orders?`,
    quickReplies: ['🛍️ Show Bestsellers', '🧳 Quilted Duffles', '📦 Wholesale & Bulk (MOQ 25)', '🧵 The Craft Process']
  }
}

function isGreeting(q) {
  const greetings = [
    'hi', 'hello', 'hey', 'namaste', 'kem cho', 'salaam', 'good morning', 'good afternoon', 'good evening',
    'hola', 'hie', 'hey there', 'hii', 'hiii', 'namaskar', 'ram ram', 'pranam', 'namastey', 'kaise ho'
  ]
  return greetings.some((g) => q === g || q.startsWith(g + ' ') || q.endsWith(' ' + g))
}

function isGratitude(q) {
  const thanks = [
    'thank you', 'thanks', 'dhanyawad', 'shukriya', 'great thanks', 'awesome', 'nice', 'helpful',
    'bye', 'goodbye', 'ok thanks', 'perfect', 'super', 'dhanyavaad', 'bahut accha', 'bohot shukriya'
  ]
  return thanks.some((t) => q.includes(t)) && q.length < 40
}
