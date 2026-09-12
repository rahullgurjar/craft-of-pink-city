import PDFDocument from 'pdfkit'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const outputPath = path.resolve(__dirname, '../Craft_of_Pink_City_Website_Audit_Report.pdf')
const artifactPath = path.resolve(
  'C:/Users/madan/.gemini/antigravity-ide/brain/7782b311-a8d8-40cb-bed4-6ed8fc2bf815/Craft_of_Pink_City_Website_Audit_Report.pdf'
)

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 45, right: 45 },
  info: {
    Title: 'Craft of Pink City - Comprehensive Website Audit & Optimization Report',
    Author: 'Antigravity AI',
    Subject: 'Customer UX & Technical SEO Analysis for Google Reach',
  },
})

// Ensure output stream
const stream = fs.createWriteStream(outputPath)
doc.pipe(stream)

// Brand Palette Colors
const C_INK = '#3A2722'
const C_ROSE = '#C62667'
const C_SAFFRON = '#D97706'
const C_BG_CARD = '#F9F4EE'
const C_TEXT_MUTED = '#6B5E5B'
const C_BORDER = '#E5DCD3'
const C_SUCCESS = '#059669'

// Helper: Header on each page
function drawHeader(title) {
  doc.save()
  doc.rect(45, 20, 505, 1).fill(C_BORDER)
  doc.fontSize(8).fillColor(C_ROSE).text('CRAFT OF PINK CITY  |  WEBSITE AUDIT & SEO ROADMAP', 45, 10, { align: 'left' })
  doc.fontSize(8).fillColor(C_TEXT_MUTED).text(title, 45, 10, { align: 'right', width: 505 })
  doc.restore()
  doc.moveDown(1.5)
}

// Helper: Section Title
function drawSectionTitle(number, title, subtitle) {
  doc.moveDown(0.8)
  doc.save()
  doc.roundedRect(doc.x, doc.y, 505, 34, 6).fill(C_BG_CARD)
  doc.fillColor(C_ROSE).fontSize(10).font('Helvetica-Bold').text(`SECTION ${number}`, doc.x + 12, doc.y - 28)
  doc.fillColor(C_INK).fontSize(14).font('Helvetica-Bold').text(title, doc.x + 90, doc.y - 13)
  doc.restore()
  doc.moveDown(1.2)
  if (subtitle) {
    doc.fillColor(C_TEXT_MUTED).fontSize(9.5).font('Helvetica-Oblique').text(subtitle)
    doc.moveDown(0.6)
  }
}

// Helper: Card Box for Recommendations
function drawItem(title, category, issueText, impactText, fixText) {
  const startY = doc.y
  
  // Estimate height check for page break
  if (startY > 680) {
    doc.addPage()
    drawHeader('Comprehensive Website Audit')
  }

  doc.save()
  doc.fillColor(C_INK).fontSize(11).font('Helvetica-Bold').text(`• ${title}`)
  doc.fontSize(8).fillColor(C_ROSE).font('Helvetica-Bold').text(`[${category.toUpperCase()}]`, { indent: 15 })
  doc.moveDown(0.2)

  doc.fontSize(9).font('Helvetica-Bold').fillColor('#B91C1C').text('Problem / Friction: ', { indent: 15, continued: true })
  doc.font('Helvetica').fillColor(C_INK).text(issueText)
  
  doc.fontSize(9).font('Helvetica-Bold').fillColor(C_SAFFRON).text('Google & Business Impact: ', { indent: 15, continued: true })
  doc.font('Helvetica').fillColor(C_INK).text(impactText)

  doc.fontSize(9).font('Helvetica-Bold').fillColor(C_SUCCESS).text('Exact Fix & Solution: ', { indent: 15, continued: true })
  doc.font('Helvetica').fillColor(C_INK).text(fixText)
  
  doc.moveDown(0.8)
  doc.restore()
}

// -----------------------------------------------------------------------------
// PAGE 1: COVER & EXECUTIVE SUMMARY
// -----------------------------------------------------------------------------
doc.rect(0, 0, 595, 140).fill(C_INK)

// Header Banner
doc.fillColor('#FFF').fontSize(22).font('Helvetica-Bold').text('CRAFT OF PINK CITY', 45, 35)
doc.fillColor(C_SAFFRON).fontSize(13).font('Helvetica').text('Website Audit, UX Analysis & Google Search Ranking Blueprint', 45, 62)
doc.fillColor('#E5DCD3').fontSize(9).font('Helvetica').text('Domain: craftofpinkcity.shop  •  Focus: Retail & Wholesale Growth  •  Date: September 2026', 45, 82)

doc.y = 160

doc.fillColor(C_ROSE).fontSize(12).font('Helvetica-Bold').text('EXECUTIVE SUMMARY & AUDIT SCOPE')
doc.rect(45, doc.y + 2, 505, 1.5).fill(C_ROSE)
doc.moveDown(0.8)

doc.fillColor(C_INK).fontSize(9.5).font('Helvetica').text(
  'This audit evaluates Craft of Pink City (craftofpinkcity.shop) through two distinct lenses: (1) The Customer Perspective focusing on browsing experience, trust, friction, and WhatsApp conversion flow; and (2) The Expert Developer Perspective focusing on SEO discovery, Google rich snippet recommendations, Core Web Vitals, and technical architecture.',
  { lineGap: 3 }
)
doc.moveDown(0.8)

// Highlights Grid
const boxY = doc.y
doc.roundedRect(45, boxY, 245, 95, 6).fillAndStroke('#FEF2F2', '#FECACA')
doc.fillColor('#991B1B').fontSize(10).font('Helvetica-Bold').text('1. Customer Experience Gaps', 55, boxY + 10)
doc.fillColor(C_INK).fontSize(8.5).font('Helvetica').text(
  '• Hero CTA lacks direct "Shop Now" action.\n• No search bar across 40+ products.\n• Missing customer reviews & social proof.\n• Single-item WhatsApp checkout limits AOV.\n• Lack of mobile floating contact.',
  55, boxY + 26, { lineGap: 2 }
)

doc.roundedRect(305, boxY, 245, 95, 6).fillAndStroke('#EFF6FF', '#BFDBFE')
doc.fillColor('#1E40AF').fontSize(10).font('Helvetica-Bold').text('2. Technical & SEO Gaps', 315, boxY + 10)
doc.fillColor(C_INK).fontSize(8.5).font('Helvetica').text(
  '• ZERO Schema.org JSON-LD structured data.\n• Missing sitemap.xml & robots.txt in public/.\n• Incomplete OpenGraph & Twitter preview tags.\n• Render-blocking font @import in CSS.\n• Legacy files styles.css & script.js in root.',
  315, boxY + 26, { lineGap: 2 }
)

doc.y = boxY + 115

// -----------------------------------------------------------------------------
// SECTION 1: CUSTOMER PERSPECTIVE
// -----------------------------------------------------------------------------
drawSectionTitle('01', 'THE CUSTOMER PERSPECTIVE (UX & CONVERSION)', 'Analysis of first impressions, catalog discovery, buying confidence, and checkout friction.')

drawItem(
  'Hero Section CTA Mismatch',
  'First Impression & Navigation',
  'The primary buttons in the hero section are "Explore Our Craft" and "Follow on Instagram". Ready-to-buy shoppers are forced to scroll past 2 long storytelling sections before seeing any products.',
  'Causes bounce rate for commercial-intent visitors searching for "buy Jaipur block print bags".',
  'Change the primary CTA to "Shop Collection" (smoothly scrolls to #products) and secondary to "Wholesale / Bulk Quote" (jumps to #bulk-orders).'
)

drawItem(
  'Catalog Search & Filter Usability',
  'Product Discovery',
  'With over 40 distinct handcrafted products (Yoga bags, Duffles, Pouches, Laptop Sleeves, Vanity Boxes), users currently only have broad category pills with no text search bar.',
  'Shoppers looking for specific patterns (e.g., "marigold", "safari", "indigo", "patchwork") struggle to find them quickly.',
  'Implement an instant live Search Input Bar above the product grid that filters products by name, print pattern, and category in real time.'
)

drawItem(
  'Lack of Social Proof & Verified Reviews',
  'Trust & Buying Confidence',
  'There are zero customer ratings, reviews, or wedding favor testimonials anywhere on the website. Handcrafted purchases online require high trust.',
  'First-time visitors may hesitate to place orders on WhatsApp without seeing previous satisfied customers.',
  'Add a "Customer Love & Reviews" section featuring a 4.9/5 star badge, verified customer photos, and testimonials from brides and boutique owners.'
)

// -----------------------------------------------------------------------------
// PAGE 2: CUSTOMER CONTINUED & DEVELOPER PERSPECTIVE
// -----------------------------------------------------------------------------
doc.addPage()
drawHeader('Customer Experience & Developer Architecture')

drawItem(
  'Multi-Item Order Friction (No Bag / Cart Drawer)',
  'Order Value & Conversion',
  'Orders currently send individual single-item WhatsApp messages. A customer wanting 1 Duffle + 2 Pouches has to send 2 separate messages or type them out manually.',
  'Lowers Average Order Value (AOV) and creates checkout drop-off.',
  'Add a lightweight "WhatsApp Bag / Wishlist" drawer allowing shoppers to add multiple items and click a single "Order 3 Items on WhatsApp" button.'
)

drawItem(
  'Floating WhatsApp Support on Mobile',
  'Mobile UX',
  'On mobile devices, once the user scrolls down into the catalog or FAQs, the navbar WhatsApp icon is completely hidden.',
  'Reduces spontaneous inquiries and quick wholesale quote questions on mobile.',
  'Add a discreet floating WhatsApp action button pinned to the bottom-right corner with a pulse indicator.'
)

// -----------------------------------------------------------------------------
// SECTION 2: EXPERT DEVELOPER & SEO PERSPECTIVE
// -----------------------------------------------------------------------------
drawSectionTitle('02', 'THE EXPERT DEVELOPER PERSPECTIVE (SEO & PERFORMANCE)', 'Technical audit of search engine discoverability, structured data, Core Web Vitals, and code quality.')

drawItem(
  'Missing Schema.org JSON-LD Structured Data',
  'Critical Google SEO',
  'index.html contains zero structured data markups (no Organization, FAQPage, or ItemList/Product schema).',
  'Google cannot show rich snippets, star ratings, merchant carousels, or interactive FAQ dropdowns in Google Search results.',
  'Add 3 complete JSON-LD script tags in index.html: (1) Organization with logo/socials, (2) FAQPage for Jaipur craft queries, (3) ItemList/Product catalog.'
)

drawItem(
  'Missing robots.txt and sitemap.xml in public/',
  'Google Indexing',
  'The public directory only has a CNAME file. There is no sitemap.xml or robots.txt file.',
  'Googlebot cannot efficiently discover all section anchors, product collections, and canonical pages.',
  'Create public/robots.txt pointing to https://craftofpinkcity.shop/sitemap.xml and generate a clean sitemap.xml.'
)

drawItem(
  'Incomplete Open Graph & Social Sharing Tags',
  'Social & Viral Sharing',
  'When sharing craftofpinkcity.shop on WhatsApp, Instagram DMs, or Facebook, no rich banner image or optimized title/description appears.',
  'Reduces click-through rates (CTR) when links are shared across social channels.',
  'Configure og:image, og:url, og:type, twitter:card, and twitter:image in index.html.'
)

drawItem(
  'Render-Blocking Google Fonts @import in CSS',
  'Core Web Vitals & Speed',
  'src/index.css uses @import url(...) at line 1. @import creates a waterfall chain that delays First Contentful Paint (FCP) and Largest Contentful Paint (LCP).',
  'Slows down mobile page load speeds and lowers Google PageSpeed Insights score.',
  'Move Google Fonts into index.html using <link rel="preconnect"> and <link rel="stylesheet"> with display=swap.'
)

// -----------------------------------------------------------------------------
// PAGE 3: ACTION PLAN & ROADMAP
// -----------------------------------------------------------------------------
doc.addPage()
drawHeader('Implementation Roadmap & Checklists')

drawSectionTitle('03', 'PRIORITIZED ACTION PLAN & ROADMAP', 'Step-by-step priority matrix to achieve top Google search ranking and maximize retail/bulk revenue.')

const tableData = [
  ['P0 (Critical)', 'SEO JSON-LD Structured Data', 'Adds Organization, FAQPage & ItemList for Google rich snippets.', 'Immediate (1 day)'],
  ['P0 (Critical)', 'sitemap.xml & robots.txt', 'Enables fast indexing of all pages on Google Search Console.', 'Immediate (1 day)'],
  ['P0 (Critical)', 'Social OpenGraph & Font Opt.', 'High-res WhatsApp link preview + faster Core Web Vitals.', 'Immediate (1 day)'],
  ['P1 (High)', 'Customer Reviews & Social Proof', '4.9/5 star badge & verified testimonials to boost conversions.', 'Short-term (2-3 days)'],
  ['P1 (High)', 'Live Product Search Bar', 'Instant filtering by keywords (duffle, yoga, marigold, indigo).', 'Short-term (2-3 days)'],
  ['P1 (High)', 'Sticky Floating WhatsApp', '1-tap customer chat & order button on mobile screens.', 'Short-term (1 day)'],
  ['P2 (Medium)', 'Multi-Item Order Cart', 'Allows bundling multiple products into one WhatsApp checkout.', 'Next Phase (1 week)'],
  ['P2 (Medium)', 'Codebase Cleanup', 'Remove unused legacy styles.css and script.js files.', 'Maintenance'],
]

// Table Header
const tY = doc.y + 5
doc.rect(45, tY, 505, 20).fill(C_INK)
doc.fillColor('#FFF').fontSize(8.5).font('Helvetica-Bold')
doc.text('PRIORITY', 55, tY + 6)
doc.text('TASK / IMPROVEMENT', 125, tY + 6)
doc.text('BUSINESS & GOOGLE IMPACT', 260, tY + 6)
doc.text('TIMELINE', 470, tY + 6)

let currentY = tY + 20
tableData.forEach((row, i) => {
  const isEven = i % 2 === 0
  doc.rect(45, currentY, 505, 24).fill(isEven ? '#FFF' : C_BG_CARD)
  
  const pColor = row[0].startsWith('P0') ? '#DC2626' : row[0].startsWith('P1') ? C_SAFFRON : C_INK
  doc.fillColor(pColor).fontSize(8).font('Helvetica-Bold').text(row[0], 55, currentY + 7)
  doc.fillColor(C_INK).fontSize(8).font('Helvetica-Bold').text(row[1], 125, currentY + 7, { width: 125 })
  doc.fillColor(C_TEXT_MUTED).fontSize(7.5).font('Helvetica').text(row[2], 260, currentY + 5, { width: 200, lineGap: 1 })
  doc.fillColor(C_INK).fontSize(8).font('Helvetica').text(row[3], 470, currentY + 7)
  
  currentY += 24
})

doc.y = currentY + 25

// Final Sign-off Box
doc.roundedRect(45, doc.y, 505, 80, 8).fillAndStroke('#FDF2F8', '#FBCFE8')
doc.fillColor(C_ROSE).fontSize(11).font('Helvetica-Bold').text('✨ CONCLUSION & NEXT STEPS', 60, doc.y + 12)
doc.fillColor(C_INK).fontSize(8.5).font('Helvetica').text(
  'By combining authentic Jaipur artisan craftsmanship with technical SEO best practices (Schema markup, sitemap, OpenGraph) and conversion-focused UX (search, reviews, mobile floating CTA), Craft of Pink City is positioned to dominate search rankings for Jaipur handcrafted block-print bags, wedding favors, and wholesale exports.',
  60, doc.y + 28, { width: 475, lineGap: 2 }
)

// Finish PDF
doc.end()

stream.on('finish', () => {
  // Also copy to artifact path if possible
  try {
    fs.copyFileSync(outputPath, artifactPath)
  } catch (e) {
    // ignore
  }
  console.log('PDF generated successfully at:', outputPath)
})
