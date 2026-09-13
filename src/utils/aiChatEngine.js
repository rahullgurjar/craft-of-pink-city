import { products, whatsapp, whatsappNumber, email, faqs } from '../data/products.js'

/**
 * Advanced AI Conversational Engine - "Gulabi AI"
 * Bilingual Architecture: English and Hindi (हिंदी)
 * Zero-Emoji Professional Luxury Craft Edition
 */

// Safety & Content Moderation Patterns
const INAPPROPRIATE_PATTERNS = [
  /\b(porn|pornography|nude|nudity|sex|xxx|nsfw|erotic|escort|bitch|fuck|bastard|asshole|dick|cock|pussy|vagina|boobs|drugs|weed|cocaine|heroin|meth|hack|hacking|weapon|gun|kill|murder|violence|gambling|casino|torrent|piracy|darkweb)\b/i
]

export function isContentSafe(message) {
  if (!message || typeof message !== 'string') return true
  return !INAPPROPRIATE_PATTERNS.some((pattern) => pattern.test(message))
}

/**
 * Detect language of input: 'hi' (Devanagari Hindi) or 'en' (English)
 */
export function detectLanguage(text) {
  if (!text) return 'en'
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hi'
  }
  return 'en'
}

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
 * Main Reasoning Dispatcher with Zero-Emoji output
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
        text: `नमस्ते। मैं **गुलाबी** हूँ, *क्राफ्ट ऑफ पिंक सिटी* की डिजिटल कारीगर सहायक। मैं केवल हमारे प्रामाणिक जयपुरी हस्तनिर्मित बैग्स, थोक ऑर्डर, फैब्रिक देखभाल और साइजिंग में सहायता कर सकती हूँ। कृपया बताएं मैं आपके ऑर्डर में कैसे मदद करूँ?`,
        quickReplies: ['कलेक्शन देखें', 'ट्रेवल डफल्स', 'होलसेल और बल्क', 'फैब्रिक केयर']
      }
    }
    return {
      text: `Namaste. I am **Gulabi**, the dedicated AI assistant for *Craft of Pink City*.\n\nI am here exclusively to help you with our handcrafted Jaipur bags, orders, wholesale inquiries, fabric care, dimensions, and customer service.`,
      quickReplies: ['Browse Collection', 'Quilted Duffles', 'Wholesale & Bulk (MOQ 25)', 'Fabric Care']
    }
  }

  // 2. Dynamic Synthesis Engine in target language
  return synthesizeDynamicResponse(query, cartContext, lang)
}

/**
 * Generative Multilingual Synthesis without emojis
 */
function synthesizeDynamicResponse(query, cartContext, lang = 'en') {
  const q = query.toLowerCase()

  // --- GREETINGS ---
  if (isGreeting(q)) {
    if (lang === 'hi') {
      return {
        text: `नमस्ते। मैं **गुलाबी** हूँ, *क्राफ्ट ऑफ पिंक सिटी* की आपकी जयपुरी कारीगर सहायक।\n\nमैं आपकी इन सभी में सहायता कर सकती हूँ:\n• **क्विल्टेड ट्रेवल डफल्स एवं टोट बैग्स**\n• **थोक व बल्क ऑर्डर्स (न्यूनतम 25 पीस)** ब्रांड लोगो टैग्स के साथ\n• **बैग साइज व लैपटॉप फिट (13"–16")**\n• **जयपुरी ब्लॉक-प्रिंट फैब्रिक धुलाई व देखभाल**\n\nआज मैं आपके लिए क्या तैयार करूँ?`,
        quickReplies: ['बेस्टसेलर्स देखें', 'ट्रेवल डफल्स', 'थोक ऑर्डर (MOQ 25)', 'साइज गाइड']
      }
    }

    return {
      text: `Namaste. I'm **Gulabi**, your Jaipur Craft & Shopping AI concierge at *Craft of Pink City*.\n\nI can help you with:\n• **Finding the perfect bag** (Duffles, Totes, Vanity Cases, Laptop Sleeves, Yoga Carriers)\n• **Instant Wholesale Calculator** (MOQ 25 pcs with tiered bulk discounts)\n• **Dimensions, sizing & what fits inside**\n• **Authentic Jaipuri fabric care & washing guide**\n• **Delivery dispatch & order assistance**\n\nHow may I assist you today?`,
      quickReplies: ['Show Bestsellers', 'Quilted Travel Duffles', 'Wholesale & Bulk (MOQ 25)', 'Bag Dimensions & Fit']
    }
  }

  // --- GRATITUDE ---
  if (isGratitude(q)) {
    if (lang === 'hi') {
      return {
        text: `आपका बहुत-बहुत धन्यवाद। हमारी जयपुरी कारीगरी में आपकी रुचि देखकर हमें अत्यंत प्रसन्नता हुई। यदि आपको कोई और सहायता या थोक जानकारी चाहिए, तो आप कभी भी पूछ सकते हैं या व्हाट्सएप पर जुड़ सकते हैं। आपका दिन शुभ हो!`,
        quickReplies: ['कलेक्शन देखें', 'थोक पूछताछ', 'व्हाट्सएप पर बात करें']
      }
    }
    return {
      text: `You are most welcome. It is our absolute joy to assist you. If you need anything else—like sizing advice, wholesale slabs, or custom logo branding—just ask me anytime or connect directly with our workshop team on WhatsApp. Have a wonderful day!`,
      quickReplies: ['Browse Retail Collection', 'Wholesale Inquiries', 'Chat on WhatsApp']
    }
  }

  // --- ABOUT BRAND / ARTISAN STUDIO ---
  if (hasPhrase(q, ['who are you', 'what is your name', 'about you', 'about pink city', 'koun ho', 'kaun ho', 'kya karte ho', 'kahan se ho', 'jaipur'])) {
    if (lang === 'hi') {
      return {
        text: `**गुलाबी और क्राफ्ट ऑफ पिंक सिटी के बारे में:**\n\n• **मैं गुलाबी हूँ**, *क्राफ्ट ऑफ पिंक सिटी* की डिजिटल कारीगर सहायक। हमारा वर्कशॉप **जयपुर, राजस्थान** में स्थित है।\n• **प्रामाणिक विरासत:** हम 100% शुद्ध सूती कपड़े पर शीशम के लकड़ी के ब्लॉक्स और प्राकृतिक वनस्पति रंगों से हाथ से छपाई और क्विल्टिंग करते हैं।\n• **सीधा वर्कशॉप मॉडल:** बिना किसी बिचौलिए के हमारे कुशल कारीगर हर बैग को प्यार और शुद्धता से सिलते हैं।\n• **थोक व कस्टमाइजेशन:** हम पूरे भारत और विश्वभर में बुटीक और कॉर्पोरेट गिफ्टिंग के लिए कस्टम ब्रांडिंग के साथ डिलीवरी करते हैं।`,
        quickReplies: ['बेस्टसेलर्स', 'ट्रेवल डफल्स', 'थोक कैटलॉग']
      }
    }
    return {
      text: `**About Gulabi & Craft of Pink City:**\n\n• **I am Gulabi**, the intelligent AI concierge for *Craft of Pink City*—a direct artisan textile studio located in **Jaipur, Rajasthan**.\n• **Generational Heritage:** We specialize in authentic hand block-printed, quilted 100% pure cotton accessories using traditional woodblocks, natural vegetable dyes, and diamond quilting.\n• **Direct Workshop Model:** Every piece is ethically handcrafted by skilled local artisans without retail middlemen.\n• **Wholesale & Custom Gifting:** We partner with boutiques, brands, and corporate gifting clients across India and globally.`,
      quickReplies: ['Show Bestsellers', 'Quilted Duffles', 'Wholesale & Bulk Catalog']
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
        text: `**थोक व बल्क ऑर्डर प्रोग्राम ${qty ? `(${qty} पीस)` : ''}:**\n\n• **कम MOQ:** केवल **25 पीस** प्रति श्रेणी से शुरू (आप प्रिंट्स और कलर्स मिक्स कर सकते हैं)।\n• **छूट स्लैब:** **${discount}** (${tierTitle})।\n• **भुगतान शर्तें:** ऑर्डर कन्फर्म करने और कारीगरी शुरू करने के लिए **60% एडवांस**; बाकी **40% बैलेंस** डिस्पैच से पहले (व्हाट्सएप पर तैयार माल के वीडियो देखने के बाद)।\n• **फ्री कस्टम ब्रांडिंग:** आपके बुटीक का लोगो टैग और ब्रांड कार्ड बिना किसी अतिरिक्त शुल्क के लगाया जाता है।\n• **डिस्पैच समय:** आपके ऑर्डर की मात्रा के अनुसार वर्कशॉप टीम द्वारा तय कर व्हाट्सएप पर कन्फर्म किया जाता है।\n• **डिलीवरी:** पूरे भारत व विदेश में सुरक्षित एक्सप्रेस कूरियर द्वारा।`,
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
        quickReplies: ['पाउच ट्रायो बल्क', 'वैनिटी बॉक्स थोक', 'क्विल्टेड डफल MOQ']
      }
    }

    return {
      text: `**Wholesale & Bulk Orders Program ${qty ? `(${qty} Pieces)` : ''}:**\n\n• **Low MOQ:** Starts at just **25 pieces** per category (mix and match prints & colors freely).\n• **Discount Tier:** **${discount}** (${tierTitle}).\n• **Payment Terms:** **60% advance** to confirm order & start workshop crafting; remaining **40% balance** prior to dispatch (after sharing ready stock batch photos/videos).\n• **Bespoke Customization:** Add your own brand logo tags or cards at no extra charge.\n• **Production & Dispatch:** Timelines are decided by our workshop team based on total order quantity and confirmed instantly on WhatsApp.\n• **Global & Pan-India Shipping:** Insured express courier to your doorstep.`,
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
      quickReplies: ['Pouch Trios in Bulk', 'Vanity Boxes Wholesale', 'Quilted Duffles MOQ']
    }
  }

  // --- TRAVEL DUFFLES ---
  if (hasWord(q, ['duffle', 'duffel', 'travel', 'weekender', 'overnight', 'flight', 'cabin', 'safar', 'yatra'])) {
    const duffles = products.filter((p) => p.category === 'Duffle Bags')
    if (lang === 'hi') {
      return {
        text: `**क्विल्टेड ट्रेवल डफल्स (फ्लाइट केबिन अप्रूव्ड):**\n\n• **साइज व क्षमता:** **18" लंबाई × 10" चौड़ाई × 10" ऊंचाई** (~28 लीटर क्षमता)।\n• **क्या-क्या आ सकता है:** 2–3 दिन के कपड़े, जूते, वैनिटी पाउच, चार्जर और ट्रेवल का जरूरी सामान।\n• **केबिन फ्रेंडली:** फ्लाइट के ओवरहेड बिन और सीट के नीचे आसानी से फिट होता है।\n• **मजबूती:** शुद्ध कॉटन कैनवास, डायमंड क्विल्टिंग, मजबूत डबल हैंडल और डिटैचेबल शोल्डर स्ट्रैप।`,
        quickReplies: ['ब्लश बोटैनिकल डफल', 'हेरिटेज इंडिगो पैचवर्क', 'ब्लू पॉपी डफल'],
        products: duffles.slice(0, 3)
      }
    }
    return {
      text: `**Quilted Travel Duffles (Cabin Approved):**\n\n• **Dimensions & Capacity:** **18" Length × 10" Width × 10" Height** (~28 Litres capacity).\n• **What Fits Inside:** 2–3 days of clothing, footwear, vanity pouch, toiletries, and travel essentials.\n• **Flight Friendly:** Fits effortlessly in airline overhead bins and under seats.\n• **Construction:** Diamond quilted with 100% cotton canvas, reinforced dual handles, and padded shoulder strap.`,
      quickReplies: ['Blush Botanical Duffle', 'Heritage Indigo Patchwork', 'Blue Poppy Duffle'],
      products: duffles.slice(0, 3)
    }
  }

  // --- TOTE BAGS & LAPTOP SLEEVES ---
  if (hasWord(q, ['laptop', 'macbook', 'ipad', 'tote', 'totes', 'handbag', 'shoulder', 'ruffle', 'office', 'jhola'])) {
    const laptopProducts = products.filter((p) => p.category === 'Laptop Sleeves' || p.category === 'Tote Bags')
    if (lang === 'hi') {
      return {
        text: `**लैपटॉप व टोट बैग साइज गाइड:**\n\n• **13" से 14" लैपटॉप:** हमारा **क्विल्टेड लैपटॉप स्लीव (14.5" × 10.5")** 13" मैकबुक और 14" लैपटॉप्स को 8मिमी शॉकप्रूफ फोम पैडिंग के साथ सुरक्षित रखता है।\n• **15.6" से 16" लैपटॉप:** हमारे **क्विल्टेड टोट बैग्स (16" × 14" × 4.5")** में 15.6" लैपटॉप, डायरी, पानी की बोतल और रोजमर्रा का सामान आसानी से आता है।\n• **स्टाइल:** हाथ से ब्लॉक प्रिंटेड रफल बॉर्डर्स और मजबूत शोल्डर हैंडल।`,
        quickReplies: ['लैपटॉप स्लीव्स देखें', 'टोट बैग्स देखें', 'व्हाट्सएप ऑर्डर'],
        products: laptopProducts.slice(0, 3)
      }
    }
    return {
      text: `**Laptop & Device Sizing Guide:**\n\n• **13" to 14" Laptops & MacBooks:** Our **Quilted Laptop Sleeve (14.5" × 10.5")** fits 13" MacBook Air/Pro, 14" laptops with **8mm shockproof foam padding** and charger pocket.\n• **15.6" to 16" Laptops:** Our **Quilted Tote Bags (16" × 14" × 4.5")** comfortably hold up to 15.6" laptops, bottles, and work essentials.\n• **Protection:** Quilted cotton absorbs bumps while remaining feather-light.`,
      quickReplies: ['Show Laptop Sleeves', 'Show Tote Bags', 'Order on WhatsApp'],
      products: laptopProducts.slice(0, 3)
    }
  }

  // --- VANITY BOXES & MAKEUP ORGANIZERS ---
  if (hasWord(q, ['vanity', 'makeup', 'cosmetic', 'box', 'toiletries', 'bottles', 'shringar'])) {
    const vanities = products.filter((p) => p.category === 'Vanity Boxes')
    if (lang === 'hi') {
      return {
        text: `**क्विल्टेड वैनिटी बॉक्स व कॉस्मेटिक ऑर्गेनाइजर:**\n\n• **साइज:** **9.5" × 6.5" × 5.5"** मजबूत चौकोर डिजाइन।\n• **सीधी बोतल सुरक्षा:** परफ्यूम, सीरम और फाउंडेशन की शीशियों को सीधा रखता है ताकि लीकेज का खतरा न रहे।\n• **वॉटर-रेसिस्टेंट लाइनिंग:** अंदर वाटर-रेसिस्टेंट कपड़ा लगा है जिसे आसानी से पोंछा जा सकता है।\n• **ब्रश होल्डर:** ढक्कन के अंदर इलास्टिक मेकअप ब्रश होल्डर्स दिए गए हैं।`,
        quickReplies: ['वैनिटी बॉक्स देखें', 'व्हाट्सएप पर ऑर्डर करें'],
        products: vanities.slice(0, 3)
      }
    }
    return {
      text: `**Quilted Vanity Boxes & Travel Organizers:**\n\n• **Dimensions:** **9.5" × 6.5" × 5.5"** with structured vertical sidewalls.\n• **Upright Bottle Safety:** Keeps full-size perfume bottles and skincare standing upright to eliminate leaks.\n• **Spill Protection:** Lined with wipeable inner fabric and internal elastic brush organizers.\n• **Top Handle:** Sturdy grab-and-go handle with dual-direction zipper.`,
      quickReplies: ['Vanilla & Teal Vanity Case', 'Chartreuse Bloom Vanity', 'Show All Vanity Cases'],
      products: vanities.slice(0, 3)
    }
  }

  // --- POUCH SETS ---
  if (hasWord(q, ['pouch', 'pouches', 'trio', 'small', 'mini', 'clutch', 'batua'])) {
    const pouches = products.filter((p) => p.category === 'Pouch Sets' || p.category === 'Pouches')
    if (lang === 'hi') {
      return {
        text: `**हस्तनिर्मित क्विल्टेड पाउच ट्रायो (3 का सेट):**\n\n• **3 नेस्टेड साइज:**\n  1. **बड़ा (10" × 6" × 4"):** स्किनकेयर, क्रीम्स और पावर बैंक के लिए।\n  2. **मध्यम (8" × 5" × 3.5"):** लिपस्टिक, दवाइयां और ज्वेलरी के लिए।\n  3. **छोटा (6" × 4" × 2.5"):** चाबियां, सिक्के और ईयरफोन के लिए।\n• **कारीगरी:** लकड़ी के ब्लॉक प्रिंट्स और सुंदर बीडेड पोम-पॉम टैसल्स।`,
        quickReplies: ['मैरीगोल्ड ब्लूम ट्रायो', 'कोरल पैस्ले ट्रायो', 'मिंट बेरी ट्रायो'],
        products: pouches.slice(0, 3)
      }
    }
    return {
      text: `**Handcrafted Quilted Pouch Trios (Set of 3):**\n\n• **3 Nested Sizes:**\n  1. **Large (10" × 6" × 4"):** Skincare, sunscreens, and power banks.\n  2. **Medium (8" × 5" × 3.5"):** Makeup, lipsticks, and jewelry.\n  3. **Small (6" × 4" × 2.5"):** Keys, cards, and earphones.\n• **Artisan Detailing:** Hand-carved block prints with beaded pompom zipper tassels.`,
      quickReplies: ['Marigold Bloom Trio', 'Coral Paisley Trio', 'Mint Berry Trio'],
      products: pouches.slice(0, 3)
    }
  }

  // --- FABRIC CARE & WASHING ---
  if (hasWord(q, ['wash', 'clean', 'care', 'washing', 'iron', 'detergent', 'dhona', 'safai', 'color', 'rang'])) {
    if (lang === 'hi') {
      return {
        text: `**शुद्ध सूती क्विल्टेड बैग्स की धुलाई व देखभाल:**\n\n• **पहली धुलाई:** प्राकृतिक रंगों को पक्का करने के लिए ठंडे पानी में 1 चम्मच नमक डालकर हाथ से धोएं।\n• **नियमित धुलाई:** माइल्ड लिक्विड डिटर्जेंट (जैसे Ezee) के साथ हल्के हाथ से ठंडे पानी में धोएं।\n• **सुखाना:** हमेशा छाया में सुखाएं। सीधी तेज धूप से बचाएं।\n• **सावधानी:** ब्लीच न करें, जोर से न निचोड़ें और वॉशिंग मशीन में न सुखाएं।\n• **इस्त्री:** कॉटन सेटिंग पर गर्म भाप वाली हल्की प्रेस करें।`,
        quickReplies: ['कलेक्शन देखें', 'व्हाट्सएप सपोर्ट']
      }
    }
    return {
      text: `**Fabric Care & Washing Guidelines for Quilted Cotton:**\n\n• **First Wash:** Hand wash separately in cold water with 1 teaspoon of salt to lock in botanical dyes.\n• **Regular Wash:** Gentle hand wash in cold water using mild liquid detergent.\n• **Drying:** Always dry in the shade to preserve vibrant colors.\n• **Do Not:** Do not bleach, wring harshly, or machine tumble dry.\n• **Ironing:** Warm steam iron on cotton setting to restore plush quilting puffiness.`,
      quickReplies: ['Browse Collection', 'WhatsApp Support']
    }
  }

  // --- PAYMENT & STORE POLICIES (60% ADVANCE & SAMPLE APPROVAL) ---
  if (hasWord(q, ['payment', 'advance', '60%', '40%', 'policy', 'policies', 'sample', 'terms', 'condition', 'conditions', 'niti', 'shartein', 'bhejo', 'paise'])) {
    if (lang === 'hi') {
      return {
        text: `**ऑर्डर, भुगतान और सैंपल नीतियां (क्राफ्ट ऑफ पिंक सिटी):**\n\n• **60% एडवांस भुगतान नीति:** ऑर्डर कन्फर्म करने और जयपुरी कारीगरी शुरू करने के लिए **60% अग्रिम भुगतान** अनिवार्य है। शेष **40% बैलेंस** डिस्पैच से पहले (व्हाट्सएप पर तैयार बैच का वीडियो देखने के बाद) देय होता है।\n• **सैंपल अप्रूवल प्रक्रिया:** थोक ऑर्डर्स के लिए हम **पहले सैंपल पीस भेजते हैं**। जब आप सैंपल देखकर **कन्फर्म/अप्रूव** कर देते हैं, तभी आपके पूरे बल्क ऑर्डर का निर्माण शुरू होता है।\n• **सैंपल बनाम बल्क ऑर्डर:** सैंपल ऑर्डर और बल्क ऑर्डर अलग-अलग होते हैं (उत्पाद के आधार पर मूल्य और समय निर्भर करता है)।\n• **बल्क नो-रिटर्न पॉलिसी:** थोक ऑर्डर्स पर **कोई रिटर्न या रिफंड नहीं** है क्योंकि काम सैंपल अप्रूवल के बाद ही शुरू होता है। केवल डिलीवरी के समय **डिफेक्टिव/क्षतिग्रस्त पीस** पाए जाने पर (48 घंटे में अनबॉक्सिंग वीडियो देने पर) उसे तुरंत बदला जाता है।`,
        action: {
          type: 'LINK',
          label: 'व्हाट्सएप पर स्टोर टीम से बात करें',
          url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('नमस्ते Craft of Pink City, मुझे आपके 60% भुगतान, सैंपल प्रक्रिया और स्टोर पॉलिसी के बारे में जानना है।')}`,
          internalAnchor: '#bulk-orders'
        },
        quickReplies: ['थोक कैटलॉग (MOQ 25)', 'सैंपल मंगाएं', 'कलेक्शन देखें']
      }
    }
    return {
      text: `**Order, Payment & Store Policies (Craft of Pink City):**\n\n• **60% Advance Payment Policy:** A **60% advance payment** is mandatory to confirm the order and begin artisan workshop batch crafting. The remaining **40% balance** is payable prior to courier dispatch after we share video proof of the finished batch on WhatsApp.\n• **Sample First Approval Workflow:** For bulk orders, we send a **physical sample piece first**. Full batch production starts strictly after you inspect, **confirm, and approve the sample**.\n• **Sample vs. Bulk Orders:** Sample orders are **not the same as bulk orders** (pricing, lead times, and customization depend on the specific product).\n• **Bulk No-Return / No-Refund Policy:** Strictly **NO returns or refunds on bulk orders** once dispatched (since manufacturing commences only post-sample approval). Any verified **defective/damaged piece** reported with an unboxing video within 48 hours is replaced or credited promptly.`,
      action: {
        type: 'LINK',
        label: 'Chat with Workshop on WhatsApp',
        url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Craft of Pink City, I would like more information on your 60% advance payment and sample approval policies.')}`,
        internalAnchor: '#bulk-orders'
      },
      quickReplies: ['Wholesale Catalog (MOQ 25)', 'Request Sample Piece', 'Browse Collection']
    }
  }

  // --- RETURNS & REFUND POLICY ---
  if (hasWord(q, ['return', 'refund', 'replace', 'replacement', 'exchange', 'defect', 'defective', 'damaged', 'broken', 'wapsi', 'badalna', 'kharab', 'tuta'])) {
    if (lang === 'hi') {
      return {
        text: `**रिटर्न व रिफंड नीति (क्राफ्ट ऑफ पिंक सिटी):**\n\n• **थोक / बल्क ऑर्डर्स:** थोक ऑर्डर्स पर **कोई रिटर्न या रिफंड नहीं** है, क्योंकि संपूर्ण उत्पादन आपके द्वारा **सैंपल पीस कन्फर्म व अप्रूव करने के बाद** ही शुरू किया जाता है।\n• **डिफेक्टिव पीस का समाधान:** यदि पार्सल मिलने पर कोई पीस डिफेक्टिव या डैमेज निकलता है, तो डिलीवरी के **48 घंटे के भीतर** अनबॉक्सिंग वीडियो हमारे व्हाट्सएप पर भेजें। हम उस पीस को तुरंत बदल देंगे या क्रेडिट देंगे।\n• **रिटेल ऑर्डर्स:** यदि रिटेल पार्सल में कोई त्रुटि हो, तो 48 घंटे के भीतर व्हाट्सएप सपोर्ट पर संपर्क करें।`,
        action: {
          type: 'LINK',
          label: 'व्हाट्सएप सपोर्ट से संपर्क करें',
          url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('नमस्ते Craft of Pink City, मुझे रिटर्न/रिफंड और डिफेक्टिव पीस पॉलिसी के बारे में सहायता चाहिए।')}`
        },
        quickReplies: ['थोक नीतियां', 'कलेक्शन देखें', 'व्हाट्सएप चैट']
      }
    }
    return {
      text: `**Returns & Refunds Policy (Craft of Pink City):**\n\n• **Wholesale & Bulk Orders:** Strictly **NO returns or refunds on bulk orders**, as manufacturing begins only after you inspect and **approve a physical sample piece**.\n• **Defective Piece Guarantee:** If any piece is verified to have a manufacturing or transit defect, simply share an unboxing video within **48 hours of delivery** on WhatsApp (+91 93512 91471). We will immediately arrange a free replacement or credit.\n• **Retail Orders:** 48-hour reporting for damaged transit items with prompt replacement.\n• **Payment Terms:** 60% advance to confirm order and 40% before dispatch.`,
      action: {
        type: 'LINK',
        label: 'Contact Support on WhatsApp',
        url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Craft of Pink City, I have a query regarding returns, refunds, or a defective piece.')}`
      },
      quickReplies: ['Wholesale Policies', 'Browse Collection', 'WhatsApp Support']
    }
  }

  // --- DOMESTIC & INTERNATIONAL DELIVERY ---
  if (hasWord(q, ['deliver', 'delivery', 'reach', 'dispatch', 'ship', 'shipping', 'pincode', 'days', 'kab', 'pahuchenga', 'kaha'])) {
    if (lang === 'hi') {
      return {
        text: `**डिलीवरी व डिस्पैच की जानकारी:**\n\n• **मात्रा के आधार पर समय:** क्योंकि हर बैग हमारे जयपुर वर्कशॉप में हाथ से तैयार होता है, इसलिए सटीक डिस्पैच समय आपके **ऑर्डर की मात्रा और कस्टमाइजेशन** के आधार पर तय होता है।\n• **व्हाट्सएप पर पुष्टि:** व्हाट्सएप पर पूछताछ करते ही हमारी टीम आपके ऑर्डर का सटीक डिलीवरी शेड्यूल बता देती है।\n• **अखिल भारतीय सेवा:** भारत के सभी 19,000+ पिन कोड्स पर एक्सप्रेस कूरियर (Bluedart, Delhivery, DTDC) से डिलीवरी।\n• **लाइव ट्रैकिंग:** पार्सल निकलते ही व्हाट्सएप पर लाइव ट्रैकिंग लिंक भेजा जाता है।`,
        action: {
          type: 'LINK',
          label: 'व्हाट्सएप पर डिलीवरी समय चेक करें',
          url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('नमस्ते Craft of Pink City, मुझे डिलीवरी और डिस्पैच समय की जानकारी चाहिए।')}`
        },
        quickReplies: ['भुगतान के तरीके', 'कलेक्शन देखें', 'व्हाट्सएप']
      }
    }
    return {
      text: `**Delivery & Dispatch Information:**\n\n• **Decided by Order Quantity:** Handcrafted in our Jaipur workshop, exact dispatch schedules are decided based on your **total quantity and customization**.\n• **Confirmed on WhatsApp:** Our workshop team confirms exact dates directly upon WhatsApp inquiry.\n• **All-India Coverage:** Express couriers (Bluedart, Delhivery, DTDC) covering 19,000+ PIN codes.\n• **Live Tracking:** Direct tracking link sent on WhatsApp upon dispatch.`,
      action: {
        type: 'LINK',
        label: 'Confirm Dispatch Schedule on WhatsApp',
        url: `https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello Craft of Pink City, I would like to check delivery and dispatch schedule.')}`
      },
      quickReplies: ['Payment Options', 'Browse Collection', 'WhatsApp Support']
    }
  }


  // --- MATCHED PRODUCTS FALLBACK ---
  const matchedProducts = findMatchingProducts(query, 3)
  if (matchedProducts.length > 0) {
    const bullets = matchedProducts.map((p) => `• **${p.name}** (${p.price}) — *${p.category}*`).join('\n')
    if (lang === 'hi') {
      return {
        text: `**"${query}" के लिए हमारे हस्तनिर्मित बैग्स:**\n\n${bullets}\n\nनीचे दिए गए किसी भी उत्पाद पर टैप करके आप उसे बैग में जोड़ सकते हैं या सीधे व्हाट्सएप पर ऑर्डर कर सकते हैं!`,
        products: matchedProducts,
        quickReplies: ['सभी उत्पाद देखें', 'ट्रेवल डफल्स', 'थोक भाव (MOQ 25)', 'व्हाट्सएप']
      }
    }
    return {
      text: `**Handcrafted Recommendations for "${query}":**\n\n${bullets}\n\nTap any product below to view details, add to your bag, or order directly on WhatsApp!`,
      products: matchedProducts,
      quickReplies: ['Show All Products', 'Quilted Duffles', 'Wholesale Quote (25+ MOQ)', 'WhatsApp']
    }
  }

  // --- GENERAL FALLBACK ---
  if (lang === 'hi') {
    return {
      text: `**क्राफ्ट ऑफ पिंक सिटी सहायक:**\n\nमैं हमारे प्रामाणिक जयपुरी हाथ से ब्लॉक प्रिंटेड बैग्स, साइज, थोक दरों और फैब्रिक केयर में आपकी पूरी सहायता के लिए यहाँ हूँ।\n\n• क्या आप हमारे **ट्रेवल डफल्स**, **टोट बैग्स**, **वैनिटी बॉक्स** या **पाउच सेट्स** देखना चाहते हैं?\n• या क्या आप **थोक ऑर्डर्स (न्यूनतम 25 पीस)** के लिए जानकारी चाहते हैं?`,
      quickReplies: ['बेस्टसेलर्स', 'ट्रेवल डफल्स', 'थोक ऑर्डर (MOQ 25)', 'साइज गाइड']
    }
  }

  return {
    text: `**Craft of Pink City Assistant:**\n\nI'm here to help with all questions regarding our authentic Jaipur hand block-printed bags, dimensions, wholesale rates, and fabric care.\n\n• Would you like to explore our **Quilted Travel Duffles**, **Tote Bags**, **Vanity Cases**, or **Pouch Trios**?\n• Or are you looking for **Wholesale & Bulk Orders (MOQ 25 pcs)** with custom brand tags?`,
    quickReplies: [
      'Show Bestsellers',
      'Quilted Travel Duffles',
      'Wholesale & Bulk (MOQ 25)',
      'Bag Dimensions & Fit',
      'Wash & Care Guidelines'
    ]
  }
}

function buildDefaultGreeting(lang = 'en') {
  if (lang === 'hi') {
    return {
      text: `नमस्ते। मैं **गुलाबी** हूँ, आपकी जयपुरी कारीगर सहायक। मैं आज आपके लिए क्या तैयार करूँ?`,
      quickReplies: ['बेस्टसेलर्स', 'ट्रेवल डफल्स', 'थोक ऑर्डर (MOQ 25)', 'कारीगरी प्रक्रिया']
    }
  }
  return {
    text: `Namaste. I'm **Gulabi**, your Jaipur Craft Assistant. How can I help you today with our handcrafted bags or wholesale orders?`,
    quickReplies: ['Show Bestsellers', 'Quilted Duffles', 'Wholesale & Bulk (MOQ 25)', 'The Craft Process']
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
