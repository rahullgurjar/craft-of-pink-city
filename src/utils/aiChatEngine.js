import { products, whatsapp, whatsappNumber, email, faqs } from '../data/products'

/**
 * Intelligent Knowledge Graph and Natural Language Engine for Craft of Pink City
 */

const GREETINGS = [
  'hi', 'hello', 'hey', 'namaste', 'kem cho', 'salaam', 'good morning', 'good afternoon', 'good evening', 'hola'
]

export function processUserMessage(userMessage, cartContext = null) {
  const query = userMessage.trim().toLowerCase()

  // 1. GREETING INTENT
  if (GREETINGS.some((g) => query === g || query.startsWith(g + ' ') || query.endsWith(' ' + g))) {
    return {
      text: `Namaste! 🙏 I'm **Gulabi**, your Jaipur Craft & Shopping Assistant at *Craft of Pink City*.\n\nHow can I help you today? I can recommend handcrafted bags, provide wholesale quotes, explain our handblock craft, or help you place an order!`,
      quickReplies: [
        '🛍️ Show Bestsellers',
        '🧳 Quilted Duffle Bags',
        '🎁 Wedding Favors & Bulk MOQ',
        '🧘 Yoga Mat Carriers',
        '🧵 How are products made?'
      ],
      products: products.filter(p => p.badge === 'Bestseller').slice(0, 3)
    }
  }

  // 2. CART STATUS INTENT
  if (query.includes('cart') || query.includes('bag') && (query.includes('my') || query.includes('what is in') || query.includes('check'))) {
    if (cartContext && cartContext.items && cartContext.items.length > 0) {
      return {
        text: `You currently have **${cartContext.totalCount} items** in your shopping bag (Total: **₹${cartContext.subtotalFormatted}**).\n\nWould you like to review your bag or checkout directly on WhatsApp?`,
        action: { type: 'OPEN_CART', label: 'View Shopping Bag' },
        quickReplies: ['Checkout on WhatsApp', 'Clear Bag', 'Show More Products']
      }
    } else {
      return {
        text: `Your shopping bag is currently empty! Would you like me to recommend some of our popular quilted travel duffles or vanity pouches?`,
        quickReplies: ['🛍️ Show Bestsellers', '🧳 Duffle Bags', '🌸 Pouch Trios', '🎁 Gift Sets'],
        products: products.slice(0, 3)
      }
    }
  }

  // 3. BULK / WHOLESALE / WEDDING FAVORS INTENT
  if (
    query.includes('bulk') ||
    query.includes('wholesale') ||
    query.includes('wedding') ||
    query.includes('favor') ||
    query.includes('favour') ||
    query.includes('mehendi') ||
    query.includes('sangeet') ||
    query.includes('moq') ||
    query.includes('quantity') ||
    query.includes('corporate') ||
    query.includes('hamper') ||
    query.includes('resell') ||
    query.includes('boutique') ||
    query.includes('discount on large')
  ) {
    const wholesaleMessage = encodeURIComponent(
      `Hello Craft of Pink City, I am interested in placing a Bulk / Wholesale Order for wedding favors or boutique stock. Please share tiered pricing.`
    )
    return {
      text: `🎉 **Yes, we specialize in Bulk Orders & Wedding Favors!**\n\n• **Minimum Order Quantity (MOQ):** Starts at just **25 pieces** per category (you can mix colors and patterns).\n• **Customization:** Personalized bride & groom tags, wedding monograms, custom gift packaging & ribbons.\n• **Wholesale Pricing:** Tiered discount slabs (25-50 pcs, 51-100 pcs, 101-250 pcs, 500+ pcs).\n• **Sample Dispatch:** We dispatch physical sample pieces within **48 hours** for your approval!`,
      action: {
        type: 'LINK',
        label: 'Get Instant Wholesale Quote on WhatsApp',
        url: `https://wa.me/${whatsappNumber}?text=${wholesaleMessage}`,
        internalAnchor: '#bulk-orders'
      },
      quickReplies: ['Pouch Sets for Gifting', 'Vanity Boxes MOQ', 'Request Sample Piece', 'How to order?']
    }
  }

  // 4. CRAFT, MATERIAL & FABRIC DETAILS
  if (
    query.includes('material') ||
    query.includes('fabric') ||
    query.includes('cotton') ||
    query.includes('how is it made') ||
    query.includes('how made') ||
    query.includes('craft') ||
    query.includes('block print') ||
    query.includes('handblock') ||
    query.includes('hand block') ||
    query.includes('authentic') ||
    query.includes('jaipur') ||
    query.includes('dye') ||
    query.includes('color natural') ||
    query.includes('handmade')
  ) {
    return {
      text: `🧵 **100% Authentic Jaipur Handblock Craft:**\n\n• **Pure Cotton:** Every bag is crafted from **100% pure breathable cotton** with diamond or channel quilting for plush durability.\n• **Artisan Printing:** Printed by hand in Jaipur using hand-carved sheesham wood blocks dipped in non-toxic azo-free dyes.\n• **Subtle Uniqueness:** Minor variations in print and dye are the hallmark of authentic handmade heritage.\n• **Hardware:** Premium smooth zippers with handcrafted cloth-and-bead tassels.`,
      quickReplies: ['Show Quilted Duffles', 'Care Instructions', 'Shipping Details', 'Shop Collection']
    }
  }

  // 5. WASH & CARE INSTRUCTIONS
  if (
    query.includes('wash') ||
    query.includes('care') ||
    query.includes('clean') ||
    query.includes('maintain') ||
    query.includes('washing') ||
    query.includes('color bleed') ||
    query.includes('machine wash')
  ) {
    return {
      text: `🧼 **Wash & Care Guidelines for Quilted Cotton:**\n\n1. **First Wash:** Gentle hand wash separately in cold water with mild detergent.\n2. **Drying:** Dry in the shade to preserve vibrant natural colors and fabric softness.\n3. **Do Not:** Do not bleach, wring harshly, or soak for prolonged hours.\n4. **Ironing:** Light warm steam iron if desired.`,
      quickReplies: ['Show Bestsellers', 'Shipping Timelines', 'Wholesale MOQ']
    }
  }

  // 6. SHIPPING, DISPATCH & INTERNATIONAL DELIVERY
  if (
    query.includes('ship') ||
    query.includes('deliver') ||
    query.includes('dispatch') ||
    query.includes('track') ||
    query.includes('international') ||
    query.includes('usa') ||
    query.includes('uk') ||
    query.includes('global') ||
    query.includes('courier') ||
    query.includes('pincode') ||
    query.includes('how long') ||
    query.includes('time')
  ) {
    return {
      text: `🚚 **Shipping & Doorstep Dispatch Information:**\n\n• **Ready Stock Dispatch:** Orders ship from our Jaipur studio within **24 to 48 hours**.\n• **Pan-India Delivery:** 2 to 5 business days across all Indian pincodes via express couriers (Bluedart / Delhivery / DTDC).\n• **Worldwide International Shipping:** We ship globally to the US, UK, Canada, Australia, UAE & Europe via DHL/FedEx Express with door-to-door tracking.\n• **Tracking:** Direct tracking link shared on WhatsApp as soon as your parcel is dispatched.`,
      quickReplies: ['How to order on WhatsApp?', 'Show Collection', 'Bulk Shipping Info']
    }
  }

  // 7. PAYMENT, RETURN & EXCHANGE
  if (
    query.includes('pay') ||
    query.includes('payment') ||
    query.includes('cod') ||
    query.includes('upi') ||
    query.includes('gpay') ||
    query.includes('return') ||
    query.includes('exchange') ||
    query.includes('refund') ||
    query.includes('cancel')
  ) {
    return {
      text: `💳 **Payment & Order Process:**\n\n• **Payment Methods:** UPI (Google Pay, PhonePe, Paytm), Bank Transfer (NEFT/IMPS), Credit/Debit Cards, and International Wire.\n• **How it works:** Once you tap 'Order on WhatsApp', our team confirms item stock, generates your order invoice with direct payment link, and shares tracking once shipped.\n• **Quality Guarantee:** Every piece undergoes strict artisan quality checks. In the rare event of transit damage, we provide immediate replacement!`,
      quickReplies: ['Browse Bags & Pouches', 'Wholesale Enquiry', 'Talk to Support']
    }
  }

  // 8. PRODUCT SEARCH & RECOMMENDATION LOGIC
  // Check for categories or patterns
  let matchedProducts = []

  // Check Category Match
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

  // Check specific colors / print keywords
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

  // Check price keywords (e.g. "under 1000", "cheap", "budget", "under 1500")
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

  // If products matched
  if (matchedProducts.length > 0) {
    const topPicks = matchedProducts.slice(0, 4)
    return {
      text: `✨ I found **${matchedProducts.length} handcrafted ${matchedProducts.length === 1 ? 'item' : 'styles'}** matching your request:\n\nTap on any item below to view full details, high-res photos, or add it to your bag!`,
      products: topPicks,
      quickReplies: ['Show More Styles', 'How to order on WhatsApp?', 'Wholesale Slab Prices', 'Wash & Care']
    }
  }

  // 9. CONTACT / CALL / HUMAN SUPPORT
  if (query.includes('contact') || query.includes('phone') || query.includes('call') || query.includes('number') || query.includes('email') || query.includes('location') || query.includes('address') || query.includes('talk to human') || query.includes('agent')) {
    return {
      text: `📍 **Craft of Pink City Studio Details:**\n\n• **Workshop Address:** Jaipur, Rajasthan, India - 302001\n• **WhatsApp & Phone:** [+91 93512 91471](tel:+919351291471)\n• **Email:** [${email}](mailto:${email})\n• **Instagram:** [@craftofpinkcity](https://www.instagram.com/craftofpinkcity/)\n\nOur Jaipur workshop team is available Monday to Saturday (9:00 AM – 8:00 PM IST).`,
      action: {
        type: 'LINK',
        label: 'Chat Directly with Artisan Team on WhatsApp',
        url: whatsapp
      },
      quickReplies: ['Browse Products', 'Wholesale Inquiry', 'Customer Reviews']
    }
  }

  // 10. GENERAL SMART FALLBACK (Understands context, offers WhatsApp handover with user query)
  const customQueryMessage = encodeURIComponent(
    `Hello Craft of Pink City, I have a question regarding: "${userMessage}". Could you please assist me?`
  )
  return {
    text: `I'd love to help you with that! 😊\n\nYou can explore our handcrafted Jaipur quilted bags, pouch sets, and wholesale wedding favors below, or connect directly with our artisan workshop on WhatsApp for custom inquiries:`,
    action: {
      type: 'LINK',
      label: 'Ask Artisan Workshop on WhatsApp',
      url: `https://wa.me/${whatsappNumber}?text=${customQueryMessage}`
    },
    quickReplies: [
      '🛍️ Show Bestsellers',
      '🧳 Quilted Travel Duffles',
      '🎁 Bulk / Wedding Favors',
      '🧼 Wash & Care',
      '🚚 Shipping Info'
    ],
    products: products.filter(p => p.badge === 'Bestseller').slice(0, 2)
  }
}
