import { products, whatsapp, whatsappNumber, email, faqs } from '../data/products'

/**
 * Advanced Conversational AI Knowledge Engine for "Gulabi" (Craft of Pink City)
 * Capable of answering any customer question with direct answers, facts, recommendations, and assistance.
 */

// Comprehensive Knowledge Base Topics
const KNOWLEDGE_BASE = [
  // --- 1. SIZES & DIMENSIONS ---
  {
    triggers: ['size', 'dimension', 'measurement', 'how big', 'capacity', 'fit', 'cm', 'inches', 'height', 'width', 'volume', 'weight'],
    match: (q) => {
      if (q.includes('duffle') || q.includes('travel bag') || q.includes('barrel')) {
        return {
          title: '🧳 Duffle Bag Dimensions & Capacity',
          text: `**Quilted Barrel Duffle Dimensions:**\n• **Length:** 18 inches (46 cm)\n• **Diameter / Width:** 10 inches (25.5 cm)\n• **Height:** 10 inches (25.5 cm)\n• **Handle Drop:** 11 inches + Reinforced candy-striped shoulder straps.\n• **Capacity:** Approx. 28 Litres — comfortably holds 3–4 days of travel outfits, footwear, toiletry pouch, and essentials. Fits airline cabin overhead bins perfectly!`
        }
      }
      if (q.includes('laptop') || q.includes('macbook') || q.includes('sleeve') || q.includes('computer')) {
        return {
          title: '💻 Laptop Sleeve Dimensions & Compatibility',
          text: `**Quilted Laptop Sleeve Specifications:**\n• **Dimensions:** 15.5" (L) × 11.2" (H) × 1.2" (Thickness)\n• **Compatibility:** Fits all **13-inch, 14-inch, and 15.6-inch laptops** including MacBook Air/Pro, Dell XPS, HP Pavilion, Lenovo ThinkPad, and iPads with case.\n• **Protection:** Padded with 8mm shock-absorbing inner foam and soft scratch-free cotton lining.`
        }
      }
      if (q.includes('vanity') || q.includes('cosmetic') || q.includes('makeup box')) {
        return {
          title: '💄 Vanity Box Dimensions',
          text: `**Structured Vanity Box Measurements:**\n• **Dimensions:** 9.5" (Length) × 6.5" (Width) × 5.5" (Height)\n• **Features:** Deep rectangular base with top handle, dual smooth zippers, reinforced padded side walls to keep perfume and bottles upright, plus inner slip pocket.`
        }
      }
      if (q.includes('yoga') || q.includes('mat carrier')) {
        return {
          title: '🧘 Yoga Mat Bag Dimensions',
          text: `**Yoga Carrier Bag Specifications:**\n• **Length:** 28.5 inches (72 cm)\n• **Diameter:** 6.8 inches (17 cm)\n• **Fit:** Fits all standard (4mm-6mm) and extra-thick (8mm-10mm) yoga mats like Manduka, Liforme, and rubber mats with room for a sweat towel and water bottle.`
        }
      }
      if (q.includes('pouch') || q.includes('trio') || q.includes('set of 3')) {
        return {
          title: '🌸 Pouch Trio Nested Sizes',
          text: `**3-Piece Nested Pouch Set Dimensions:**\n• **Large Pouch:** 9" × 6" × 2.5" (Fits skincare bottles, makeup brushes, sunscreen)\n• **Medium Pouch:** 7.5" × 5" × 2" (Fits compact powder, lipsticks, power bank)\n• **Small Pouch:** 6" × 4" × 1.5" (Fits earphones, cards, jewelry, keys)`
        }
      }
      return {
        title: '📏 General Sizing & Fits',
        text: `**All sizes are tailored for daily functionality:**\n• **Travel Duffles:** 18" × 10" × 10" (Cabin friendly)\n• **Tote Bags:** 16" × 14" × 4.5" (Fits 15" laptop + books)\n• **Vanity Boxes:** 9.5" × 6.5" × 5.5"\n• **Yoga Carriers:** 28.5" × 6.8"\n• **Pouches:** Available in single compacts and 3-piece nested sets.\n\nNeed exact dimensions for a specific style? Tell me the product name!`
      }
    }
  },

  // --- 2. CUSTOMIZATION & PERSONALIZATION ---
  {
    triggers: ['custom', 'customise', 'customize', 'personalize', 'personalise', 'monogram', 'print my logo', 'logo', 'name print', 'custom tag', 'branding', 'bespoke', 'own design', 'custom size'],
    match: () => ({
      title: '✨ Customization & Branding Options',
      text: `**Yes, we offer complete customization for weddings, events & corporate orders:**\n\n1. **Personalized Tags & Cards:** We print custom couple names, wedding dates, event monograms, or company brand logos on cloth/metallic tags.\n2. **Custom Fabric Patterns:** Choose from our library of 50+ Jaipur block prints (Sanganeri florals, Bagru bootis, Dabu indigo, Safari animals).\n3. **Custom Gift Packaging:** Organza bags, matching block-print ribbons, and handwritten artisan cards.\n4. **MOQ for Custom Tagging:** Starts at just **25 pieces**.\n\nShare your requirement and our workshop will prepare mockups for you!`
    })
  },

  // --- 3. DISCOUNTS, BULK RATES & NEGOTIATIONS ---
  {
    triggers: ['discount', 'offer', 'coupon', 'rate', 'slab', 'wholesale price', 'cheaper', 'bargain', 'negotiate', 'concession', 'quote', 'margin', 'reseller price', 'b2b'],
    match: () => ({
      title: '🏷️ Wholesale & Bulk Discount Slabs',
      text: `**Direct Workshop Wholesale Pricing Slabs:**\n\n• **25 – 50 pieces:** 15% to 20% off retail pricing (Starter Wholesale / Wedding return gifts)\n• **51 – 100 pieces:** 25% to 30% off retail pricing (Mehendi favors & Boutiques)\n• **101 – 250 pieces:** 35% off retail pricing (Festive & Corporate Gifting)\n• **250+ pieces:** Tiered production-level factory quotes with custom tagging.\n\n*Note:* Retail prices on our website are already direct workshop rates with zero middleman markup. WhatsApp us for the wholesale catalog PDF!`
    })
  },

  // --- 4. WATERPROOF / DURABILITY / PADDING ---
  {
    triggers: ['waterproof', 'durable', 'durability', 'fade', 'bleeding', 'color bleed', 'stitching', 'zipper', 'quality', 'pad', 'padding', 'thick', 'heavy duty', 'inner lining'],
    match: () => ({
      title: '🛡️ Quality, Durability & Fabric Features',
      text: `**Material & Construction Highlights:**\n\n• **100% Breathable Cotton:** The outer and inner lining are pure, high-thread-count Indian cotton.\n• **Quilted Insulation:** Stuffed with soft lightweight padding and densely machine-quilted (diamond / channel pattern) to give structure and shock protection.\n• **Zippers & Pulls:** Fitted with heavy-duty metal sliders and handmade cloth tassels.\n• **Water Resistance:** The fabric is naturally breathable cotton (not plastic/PVC), but the dense quilting protects contents from light spills and everyday moisture.\n• **Color Fastness:** Printed with cured dyes; colors stay rich for years when washed in cold water.`
    })
  },

  // --- 5. CASH ON DELIVERY (COD) & PAYMENT OPTIONS ---
  {
    triggers: ['cod', 'cash on delivery', 'pay on delivery', 'how to pay', 'payment method', 'gpay', 'phonepe', 'paytm', 'credit card', 'debit card', 'net banking', 'wire transfer', 'paypal'],
    match: () => ({
      title: '💳 Payment Methods & Ordering Process',
      text: `**Payment Options:**\n• **UPI:** Google Pay, PhonePe, Paytm, BHIM.\n• **Bank Transfer:** Direct IMPS / NEFT transfer.\n• **Cards & Net Banking:** Secure payment links generated on WhatsApp for debit/credit cards.\n• **International Payments:** Wire Transfer (SWIFT) & International Card links via Stripe/Razorpay for global orders.\n\n**About COD:** Because every order is carefully inspected, packed, and insured from our Jaipur workshop, retail and bulk orders are dispatched upon digital payment confirmation to ensure zero transit refusal and direct artisan payment.`
    })
  },

  // --- 6. RETURN, EXCHANGE & DAMAGE POLICY ---
  {
    triggers: ['return', 'exchange', 'refund', 'damaged', 'broken', 'defect', 'guarantee', 'warranty', 'cancellation', 'replace'],
    match: () => ({
      title: '🔄 Return & Replacement Guarantee',
      text: `**Artisan Quality Guarantee:**\n\n• **Transit Damage / Defect:** If your parcel arrives damaged or with any defect, share an unboxing photo on WhatsApp within 48 hours and we will dispatch a **free replacement immediately**.\n• **Handmade Variations:** Slight nuances in block alignment and dye shading are natural characteristics of 100% handmade handblock printing, celebrating true Indian artisanal heritage.\n• **Order Modification:** You can modify or add items to your order prior to dispatch.`
    })
  },

  // --- 7. GIFTING & WEDDING FAVORS ADVICE ---
  {
    triggers: ['gift', 'gifting', 'recommend me', 'suggest', 'sister', 'mother', 'friend', 'bride', 'bridesmaid', 'diwali', 'rakhi', 'birthday', 'anniversary', 'mehendi idea', 'return gift idea'],
    match: (q) => ({
      title: '🎁 Gifting & Wedding Favor Recommendations',
      text: `**Top Curated Gifting Ideas by Craft of Pink City:**\n\n1. **For Bridesmaids & Mehendi Giveaways:** *Marigold Bloom Pouch Trio* or *Vanilla & Teal Vanity Case* (Plush, practical & photo-worthy!).\n2. **For Travel Lovers & Weekend Getaways:** *Blush Botanical Barrel Duffle* or *Heritage Indigo Patchwork Duffle*.\n3. **For Yoga & Fitness Enthusiasts:** *Royal Bengal Tiger Yoga Mat Bag* or *Sunshine Marigold Carrier*.\n4. **For Professionals & Students:** *Kalamkari Blue Padded Laptop Sleeve*.\n\nTell me your budget per person and I'll tailor the exact set for you!`
    })
  },

  // --- 8. FABRIC CARE & WASHING ---
  {
    triggers: ['wash', 'care', 'washing', 'clean', 'stain', 'dry clean', 'detergent', 'iron', 'shrink', 'soap'],
    match: () => ({
      title: '🧼 Fabric Care & Maintenance Guide',
      text: `**How to Keep Your Quilted Cotton Bag Looking Brand New:**\n\n1. **First Wash:** Gentle hand wash separately in cold water with a mild liquid detergent.\n2. **Drying:** Always dry in the shade flat or hung. Avoid harsh direct midday sun.\n3. **Do Not:** Do not use bleach, optical brighteners, or machine tumble dry.\n4. **Ironing:** Use warm steam iron over cotton setting to restore crisp quilting ridges.`
    })
  },

  // --- 9. SHIPPING TIMELINES & COURIERS ---
  {
    triggers: ['ship', 'shipping', 'delivery', 'courier', 'dispatch', 'pincode', 'how many days', 'when will i get', 'express', 'usa', 'uk', 'canada', 'international', 'dubai', 'australia'],
    match: (q) => ({
      title: '🚚 Dispatch & Doorstep Delivery Timelines',
      text: `**Shipping Speeds & Coverage:**\n\n• **Dispatch:** Ready stock ships from our Jaipur workshop within **24–48 hours**.\n• **India Domestic:** 2 to 5 business days via Bluedart, Delhivery & DTDC Express (all pincodes covered).\n• **International Delivery:** 4 to 7 business days via DHL / FedEx International Priority (USA, UK, Canada, UAE, Europe, Australia).\n• **Live Tracking:** An online tracking number with live parcel movement is shared on WhatsApp once dispatched.`
    })
  },

  // --- 10. WHO WE ARE & WORKSHOP STORY ---
  {
    triggers: ['who are you', 'about craft of pink city', 'about company', 'founder', 'history', 'jaipur', 'pink city', 'location', 'studio', 'store', 'shop location', 'where are you located', 'visit'],
    match: () => ({
      title: '🏰 About Craft of Pink City',
      text: `**Rooted in Tradition. Made for Today.**\n\n*Craft of Pink City* is an artisan-led textile design studio and workshop based in **Jaipur, Rajasthan (India - 302001)**.\n\nWe preserve and celebrate 400-year-old Rajasthani block printing traditions (Bagru, Sanganer, Dabu) by crafting high-utility everyday travel bags, vanity organizers, yoga mat bags, and wedding favors using 100% pure quilted cotton.\n\nEvery purchase directly supports traditional generational artisan families in Jaipur!`
    })
  }
]

/**
 * Main Question Answering Function
 */
export function processUserMessage(userMessage, cartContext = null) {
  const query = userMessage.trim().toLowerCase()
  if (!query) {
    return {
      text: `How can I help you today? Ask me about our bags, prices, wedding favors, or craft techniques!`
    }
  }

  // 1. SIMPLE GREETINGS / SMALL TALK
  const isGreeting = ['hi', 'hello', 'hey', 'namaste', 'kem cho', 'salaam', 'good morning', 'good evening', 'hola'].some(
    (g) => query === g || query.startsWith(g + ' ') || query.endsWith(' ' + g)
  )
  if (isGreeting && query.length < 20) {
    return {
      text: `Namaste! 🙏 I'm **Gulabi**, your Jaipur Craft & Shopping Assistant.\n\nHow can I help you today? You can ask me questions like:\n• *"What are the dimensions of the travel duffle?"*\n• *"What is the wholesale MOQ for wedding favors?"*\n• *"How do I wash quilted cotton bags?"*\n• *"Show me bags under ₹1,000"*\n• *"Do you ship to USA / Delhi?"*`,
      quickReplies: [
        '🛍️ Show Bestsellers',
        '🧳 Quilted Travel Duffles',
        '🎁 Wedding Favors (MOQ 25)',
        '📏 Bag Dimensions & Sizes',
        '🧼 Wash & Care'
      ]
    }
  }

  // 2. GRATITUDE / COURTESY
  if (['thank you', 'thanks', 'dhanyawad', 'shukriya', 'great', 'awesome', 'cool', 'ok', 'okay', 'perfect'].some(t => query.includes(t)) && query.length < 25) {
    return {
      text: `You're most welcome! 🌸 If you need anything else—whether it's picking a print, checking wholesale rates, or placing an order—I'm always here for you.`,
      quickReplies: ['Browse Retail Collection', 'Wholesale Inquiry', 'Order on WhatsApp']
    }
  }

  // 3. CART QUERY
  if (query.includes('cart') || query.includes('bag') && (query.includes('my') || query.includes('what is in') || query.includes('check'))) {
    if (cartContext && cartContext.items && cartContext.items.length > 0) {
      return {
        text: `🛍️ **Your Shopping Bag Status:**\n\nYou have **${cartContext.totalCount} items** in your bag (Estimated Total: **₹${cartContext.subtotalFormatted}**).\n\nTap below to review your items or order all of them in a single WhatsApp message!`,
        action: { type: 'OPEN_CART', label: 'Open Shopping Bag Drawer' },
        quickReplies: ['Checkout on WhatsApp', 'Clear Bag', 'Show More Products']
      }
    } else {
      return {
        text: `Your shopping bag is currently empty! Would you like me to recommend some of our popular quilted travel duffles or vanity pouches?`,
        quickReplies: ['🛍️ Show Bestsellers', '🧳 Duffle Bags', '🌸 Pouch Trios', '🎁 Gift Sets'],
        products: products.slice(0, 2)
      }
    }
  }

  // 4. CHECK KNOWLEDGE BASE FOR DIRECT CONCEPTUAL / FACTUAL ANSWERS
  for (const item of KNOWLEDGE_BASE) {
    if (item.triggers.some((trigger) => query.includes(trigger))) {
      const result = item.match(query)
      return {
        text: `${result.text}`,
        quickReplies: [
          '🛍️ Show Products',
          '🎁 Wedding Favors (MOQ 25)',
          '🚚 Shipping & Dispatch',
          '💬 Ask on WhatsApp'
        ]
      }
    }
  }

  // 5. PRODUCT DISCOVERY / SEARCH QUERIES (Show matching products + rich text)
  let matchedProducts = []

  if (query.includes('yoga')) {
    matchedProducts = products.filter(p => p.category.toLowerCase().includes('yoga'))
  } else if (query.includes('duffle') || query.includes('travel') || query.includes('duffel') || query.includes('barrel') || query.includes('weekender')) {
    matchedProducts = products.filter(p => p.category.toLowerCase().includes('duffle'))
  } else if (query.includes('tote') || query.includes('shoulder')) {
    matchedProducts = products.filter(p => p.category.toLowerCase().includes('tote'))
  } else if (query.includes('vanity') || query.includes('cosmetic') || query.includes('makeup') || query.includes('beauty box')) {
    matchedProducts = products.filter(p => p.category.toLowerCase().includes('vanity') || p.category.toLowerCase().includes('organizer'))
  } else if (query.includes('laptop') || query.includes('macbook') || query.includes('sleeve') || query.includes('ipad')) {
    matchedProducts = products.filter(p => p.category.toLowerCase().includes('laptop'))
  } else if (query.includes('pouch') || query.includes('pouches') || query.includes('trio') || query.includes('set of 3') || query.includes('flat')) {
    matchedProducts = products.filter(p => p.category.toLowerCase().includes('pouch'))
  } else if (query.includes('organizer') || query.includes('hair') || query.includes('dyson')) {
    matchedProducts = products.filter(p => p.category.toLowerCase().includes('organizer'))
  }

  // Pattern / Color Search
  if (matchedProducts.length === 0) {
    const keywords = [
      'marigold', 'indigo', 'sunshine', 'botanical', 'safari', 'tiger', 'cats', 'patchwork',
      'kalamkari', 'ruffle', 'pink', 'blue', 'teal', 'yellow', 'crimson', 'sage', 'lavender',
      'mint', 'peach', 'chartreuse', 'ganjifa'
    ]
    for (const kw of keywords) {
      if (query.includes(kw)) {
        matchedProducts = products.filter(
          p =>
            p.name.toLowerCase().includes(kw) ||
            p.description.toLowerCase().includes(kw) ||
            p.category.toLowerCase().includes(kw)
        )
        if (matchedProducts.length > 0) break
      }
    }
  }

  // Price Budget Matching
  if (matchedProducts.length === 0) {
    if (query.includes('under 1000') || query.includes('under 900') || query.includes('budget') || query.includes('affordable') || query.includes('cheap')) {
      matchedProducts = products.filter(p => {
        const num = parseInt(p.price.replace(/[^0-9]/g, ''), 10)
        return num && num <= 1000
      })
    } else if (query.includes('bestseller') || query.includes('popular') || query.includes('trending') || query.includes('top') || query.includes('best')) {
      matchedProducts = products.filter(p => p.badge === 'Bestseller' || p.badge === 'Trending')
    }
  }

  if (matchedProducts.length > 0) {
    const topPicks = matchedProducts.slice(0, 4)
    return {
      text: `✨ Here are the top handcrafted styles matching your search:\n\nTap **"View"** to see zoom photos & size specs, or **"+ Bag"** to add to your shopping bag.`,
      products: topPicks,
      quickReplies: ['Order on WhatsApp', 'Wholesale MOQ', 'Wash & Care', 'Shipping Timelines']
    }
  }

  // 6. CONTACT / STUDIO DETAILS
  if (query.includes('contact') || query.includes('phone') || query.includes('call') || query.includes('number') || query.includes('email') || query.includes('address') || query.includes('talk to human')) {
    return {
      text: `📍 **Craft of Pink City Artisan Studio:**\n\n• **Workshop:** Jaipur, Rajasthan (India - 302001)\n• **WhatsApp & Phone:** [+91 93512 91471](tel:+919351291471)\n• **Email:** [${email}](mailto:${email})\n• **Instagram:** [@craftofpinkcity](https://www.instagram.com/craftofpinkcity/)\n\nOur team is available Mon-Sat (9:00 AM - 8:00 PM IST).`,
      action: {
        type: 'LINK',
        label: 'Chat Directly on WhatsApp',
        url: whatsapp
      },
      quickReplies: ['Browse Products', 'Wholesale Inquiry']
    }
  }

  // 7. COMPREHENSIVE INTELLIGENT DIRECT ANSWER FOR CUSTOM QUESTIONS
  const customQueryMessage = encodeURIComponent(
    `Hello Craft of Pink City, I have a question regarding: "${userMessage}". Could you please assist me?`
  )

  return {
    text: `Regarding your question: *"**${userMessage}**"*\n\nEvery item at Craft of Pink City is handcrafted from **100% pure quilted cotton** using authentic Jaipur hand-carved woodblock prints. We fulfill both single retail orders and large-scale bulk wedding/corporate orders (MOQ 25 pcs) with door-to-door insured delivery across India and worldwide.\n\nFor custom sizes, specific print choices, or special order assistance, you can connect directly with our workshop master on WhatsApp:`,
    action: {
      type: 'LINK',
      label: 'Ask Artisan Workshop on WhatsApp',
      url: `https://wa.me/${whatsappNumber}?text=${customQueryMessage}`
    },
    quickReplies: [
      '📏 Bag Dimensions & Sizes',
      '🎁 Wedding Favors (MOQ 25)',
      '🧼 Wash & Care',
      '🚚 Shipping & Dispatch',
      '🛍️ Show Bestsellers'
    ]
  }
}
