/**
 * CRAFT OF PINK CITY - Staff CRM Leads & Orders Store
 * Manages persistent inbound inquiries, order tracking, WhatsApp quick actions, and status workflows.
 */

import { whatsappNumber } from '../data/products'

const LEADS_STORAGE_KEY = 'cpc_leads_store_v1'

export const LEAD_STATUSES = [
  { id: 'new', label: 'New Inbound', color: 'bg-rose/10 text-rose border-rose/30', icon: 'Sparkles' },
  { id: 'contacted', label: 'In Discussion', color: 'bg-amber-50 text-amber-700 border-amber-300', icon: 'PhoneCall' },
  { id: 'quote_sent', label: 'Quote Sent', color: 'bg-blue-50 text-blue-700 border-blue-300', icon: 'FileText' },
  { id: 'sample_dispatched', label: 'Sample Dispatched', color: 'bg-purple-50 text-purple-700 border-purple-300', icon: 'Package' },
  { id: 'in_production', label: 'In Production', color: 'bg-indigo-50 text-indigo-700 border-indigo-300', icon: 'Scissors' },
  { id: 'dispatched', label: 'Dispatched', color: 'bg-emerald-50 text-emerald-700 border-emerald-300', icon: 'Truck' },
  { id: 'completed', label: 'Completed', color: 'bg-teal-50 text-teal-800 border-teal-300', icon: 'CheckCircle2' },
  { id: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-600 border-gray-300', icon: 'XCircle' },
]

// Default initial sample leads so staff has rich context upon first login
const DEFAULT_INITIAL_LEADS = [
  {
    id: 'lead-1001',
    refId: 'CPC-78219',
    timestamp: '24/09/2026, 10:15:30',
    name: 'Ananya Deshmukh',
    phone: '+91 98201 44589',
    email: 'ananya.deshmukh@atelierbombay.com',
    company: 'Atelier Bombay Boutique',
    source: 'Website Bulk & Custom Order Form',
    products: 'Quilted Tote Bags (x50), Patchwork Duffle Bags (x25)',
    quantity: '75 pcs (Boutique Tier)',
    totalAmount: '₹84,500',
    timeline: 'Within 2 - 3 Weeks',
    status: 'new',
    notes: 'Requested custom woven logo tags in gold zari and Bagru indigo print swatches.',
    staffNotes: [
      { id: 'note-1', text: 'Sent digital fabric catalog on WhatsApp. Customer wants video call at 3 PM.', timestamp: '24/09/2026, 10:45:00', author: 'Workshop Staff' }
    ],
  },
  {
    id: 'lead-1002',
    refId: 'CPC-55412',
    timestamp: '24/09/2026, 09:30:12',
    name: 'Vikramaditya Rathore',
    phone: '+91 94140 88214',
    email: 'events@rathorepalace.in',
    company: 'Rathore Heritage Weddings',
    source: 'Website Cart Direct Checkout',
    products: 'Marigold Bloom Embroidered Pouch Trio (x2)',
    quantity: '2 item(s)',
    totalAmount: '₹2,998',
    timeline: 'Immediate Dispatch',
    status: 'in_production',
    address: 'Suite 402, Royal Palms, Civil Lines, Jaipur, Rajasthan 302006',
    notes: 'Please add gift packaging with personalized welcome note for destination wedding guests.',
    staffNotes: [
      { id: 'note-2', text: 'Quilting completed. Hand-embroidery verification done. Packing today.', timestamp: '24/09/2026, 11:00:00', author: 'Master Artisan' }
    ],
  },
  {
    id: 'lead-1003',
    refId: 'CPC-39108',
    timestamp: '23/09/2026, 17:45:22',
    name: 'Sophie Laurent',
    phone: '+33 6 42 19 88 05',
    email: 'sophie@bohemiaparis.fr',
    company: 'Bohemia Lifestyle Paris',
    source: 'Live Video Workshop Tour Request',
    products: 'Sunshine Marigold Quilted Yoga Bag (x30), Candy Stripe Quilted Hair Tool Organizer (x30)',
    quantity: '60 pcs (Export Batch)',
    totalAmount: '₹79,440',
    timeline: 'Within 1 Month',
    status: 'quote_sent',
    notes: 'Interested in export air courier to Paris Charles de Gaulle with customs invoice.',
    staffNotes: [
      { id: 'note-3', text: 'Provided DHL Express international shipping slab rates.', timestamp: '23/09/2026, 18:30:00', author: 'Export Desk' }
    ],
  },
  {
    id: 'lead-1004',
    refId: 'CPC-22194',
    timestamp: '23/09/2026, 14:10:00',
    name: 'Meera Nambiar',
    phone: '+91 98451 90234',
    email: 'meera.nambiar@gmail.com',
    company: 'Direct Online Customer',
    source: 'Website Cart Direct Checkout',
    products: 'Blush Botanical Quilted Travel Duffle (x1)',
    quantity: '1 item(s)',
    totalAmount: '₹1,599',
    timeline: 'Immediate Dispatch',
    status: 'dispatched',
    address: 'B-12, Indiranagar 100ft Road, Bangalore, Karnataka 560038',
    notes: 'Pre-dispatch video shared on WhatsApp.',
    staffNotes: [
      { id: 'note-4', text: 'Dispatched via BlueDart AWB: BLU-78904321IN', timestamp: '23/09/2026, 16:00:00', author: 'Logistics Desk' }
    ],
  },
]

export function getStoredLeads() {
  try {
    const saved = localStorage.getItem(LEADS_STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed
      }
    }
  } catch (e) {
    console.error('Failed to load leads from localStorage:', e)
  }
  // If empty or fresh, seed with defaults
  saveStoredLeads(DEFAULT_INITIAL_LEADS)
  return DEFAULT_INITIAL_LEADS
}

export function saveStoredLeads(leads) {
  try {
    localStorage.setItem(LEADS_STORAGE_KEY, JSON.stringify(leads))
  } catch (e) {
    console.error('Failed to save leads to localStorage:', e)
  }
}

export function addInboundLead(leadPayload) {
  try {
    const currentLeads = getStoredLeads()
    const newLead = {
      id: `lead-${Date.now()}`,
      refId: leadPayload.refId || `CPC-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: leadPayload.timestamp || new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name: leadPayload.name || 'Inbound Customer',
      phone: leadPayload.phone || '',
      email: leadPayload.email || '',
      company: leadPayload.company || 'Direct Customer',
      source: leadPayload.source || 'Website Form',
      products: formatProductsString(leadPayload),
      quantity: leadPayload.quantity || '1 item(s)',
      totalAmount: leadPayload.totalAmount || '',
      timeline: leadPayload.timeline || 'Immediate Dispatch',
      status: 'new',
      address: leadPayload.address || '',
      notes: leadPayload.notes || '',
      items: leadPayload.items || [],
      staffNotes: [],
    }

    const updated = [newLead, ...currentLeads]
    saveStoredLeads(updated)
    
    // Dispatch custom event for real-time reactivity
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('cpc-new-lead-received', { detail: newLead }))
    }
    return newLead
  } catch (err) {
    console.error('Error adding inbound lead:', err)
    return null
  }
}

function formatProductsString(payload) {
  if (Array.isArray(payload.items)) {
    return payload.items.map(it => `${it.name} (x${it.quantity || 1})`).join(', ')
  }
  if (Array.isArray(payload.selectedProducts)) {
    return payload.selectedProducts.join(', ')
  }
  return payload.products || 'Custom Handcrafted Item'
}

export function updateLeadStatus(leadId, newStatus) {
  const leads = getStoredLeads()
  const updated = leads.map(lead => {
    if (lead.id === leadId) {
      return { ...lead, status: newStatus, lastUpdated: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) }
    }
    return lead
  })
  saveStoredLeads(updated)
  return updated
}

export function addStaffNote(leadId, noteText, author = 'Staff') {
  if (!noteText.trim()) return getStoredLeads()
  const leads = getStoredLeads()
  const updated = leads.map(lead => {
    if (lead.id === leadId) {
      const existingNotes = lead.staffNotes || []
      const newNote = {
        id: `note-${Date.now()}`,
        text: noteText.trim(),
        author,
        timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
      }
      return { ...lead, staffNotes: [newNote, ...existingNotes] }
    }
    return lead
  })
  saveStoredLeads(updated)
  return updated
}

export function deleteLead(leadId) {
  const leads = getStoredLeads()
  const updated = leads.filter(l => l.id !== leadId)
  saveStoredLeads(updated)
  return updated
}

export function generateWhatsAppMessage(lead, type = 'confirm') {
  const rawPhone = (lead.phone || '').replace(/[^0-9]/g, '')
  const cleanPhone = rawPhone.startsWith('91') || rawPhone.length > 10 ? rawPhone : `91${rawPhone}`
  const customerName = lead.name || 'Valued Patron'
  const refId = lead.refId || 'CPC-ORDER'
  
  let msg = ''
  if (type === 'confirm') {
    msg = `*Namaste ${customerName}!* 🌸\n\nThank you for choosing *Craft of Pink City* (Jaipur Artisan Atelier).\n\nWe have received your order / inquiry *#${refId}* for:\n🛍️ *${lead.products}*\n📦 Quantity: ${lead.quantity}\n${lead.totalAmount ? `💰 Total: ${lead.totalAmount}\n` : ''}\nOur workshop team in Jaipur is currently preparing your batch. Would you like a pre-dispatch video preview of your pieces once packed?\n\nWarm regards,\n*Craft of Pink City · Jaipur*`
  } else if (type === 'quote') {
    msg = `*Namaste ${customerName}!* 🌸\n\nThank you for your bulk wholesale inquiry *#${refId}* with *Craft of Pink City*.\n\nHere are the wholesale details for your requested items:\n📦 *Products:* ${lead.products}\n📊 *Batch Volume:* ${lead.quantity}\n⏳ *Timeline:* ${lead.timeline}\n\nWe would love to share our tiered wholesale rate card and fabric swatch catalog. Let us know when is a good time to discuss!\n\n*Craft of Pink City Workshop Team*`
  } else if (type === 'video_tour') {
    msg = `*Namaste ${customerName}!* 🌸\n\nGreetings from *Craft of Pink City* atelier in Jaipur!\n\nWe are ready for your *Live 5-Minute Studio Video Tour*. You can inspect our hand block printing tables, observe our karigars quilting, and verify fabric swatches in real time.\n\nPlease reply with your preferred time slot today, and we will start the WhatsApp video call.\n\n*Craft of Pink City Team*`
  } else if (type === 'dispatch') {
    msg = `*Namaste ${customerName}!* 🌸\n\nGood news! Your handcrafted parcel *#${refId}* has been dispatched directly from our Jaipur workshop.\n\n📦 *Items:* ${lead.products}\n🚚 *Courier:* Express Insured Courier\n${lead.address ? `📍 *Destination:* ${lead.address}\n` : ''}\nThank you for supporting traditional Indian handblock artisans! Let us know once you receive your parcel.\n\n*Craft of Pink City Jaipur*`
  }

  return `https://wa.me/${cleanPhone || whatsappNumber}?text=${encodeURIComponent(msg)}`
}

export function exportLeadsToCSV(leads) {
  if (!leads || leads.length === 0) return
  const headers = ['Ref ID', 'Timestamp', 'Customer Name', 'Phone', 'Email', 'Company/Studio', 'Products', 'Quantity', 'Total Amount', 'Status', 'Delivery Address', 'Customer Notes', 'Source']
  
  const csvRows = [headers.join(',')]
  leads.forEach(l => {
    const row = [
      `"${l.refId || ''}"`,
      `"${l.timestamp || ''}"`,
      `"${(l.name || '').replace(/"/g, '""')}"`,
      `"${(l.phone || '').replace(/"/g, '""')}"`,
      `"${(l.email || '').replace(/"/g, '""')}"`,
      `"${(l.company || '').replace(/"/g, '""')}"`,
      `"${(l.products || '').replace(/"/g, '""')}"`,
      `"${(l.quantity || '').replace(/"/g, '""')}"`,
      `"${(l.totalAmount || '').replace(/"/g, '""')}"`,
      `"${l.status || ''}"`,
      `"${(l.address || '').replace(/"/g, '""')}"`,
      `"${(l.notes || '').replace(/"/g, '""')}"`,
      `"${(l.source || '').replace(/"/g, '""')}"`,
    ]
    csvRows.push(row.join(','))
  })

  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.setAttribute('href', url)
  link.setAttribute('download', `Craft_of_Pink_City_Leads_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function printLeadPackingSlip(lead) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Artisan Dispatch Slip - ${lead.refId}</title>
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 30px; color: #1e121d; }
        .header { border-bottom: 2px solid #832729; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: flex-start; }
        .brand { font-size: 24px; font-weight: bold; color: #832729; font-family: Georgia, serif; }
        .tagline { font-size: 12px; color: #666; margin-top: 3px; }
        .ref-box { background: #faf4ec; border: 1px solid #e2d5c5; padding: 10px 15px; border-radius: 8px; text-align: right; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .card { background: #fdfbf7; border: 1px solid #eedecf; padding: 15px; border-radius: 8px; font-size: 13px; }
        .card h4 { margin: 0 0 10px 0; color: #832729; text-transform: uppercase; font-size: 11px; letter-spacing: 1px; }
        .table { width: 100%; border-collapse: collapse; margin-top: 15px; }
        .table th { background: #832729; color: white; padding: 10px; font-size: 12px; text-align: left; }
        .table td { border-bottom: 1px solid #eedecf; padding: 10px; font-size: 13px; }
        .total-box { margin-top: 20px; text-align: right; font-size: 16px; font-weight: bold; color: #832729; }
        .footer { margin-top: 40px; border-top: 1px dashed #ccc; padding-top: 15px; text-align: center; font-size: 11px; color: #777; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="brand">Craft of Pink City</div>
          <div class="tagline">Authentic Jaipur Artisan Handblock Atelier · Sanganer & Bagru Craft</div>
          <div style="font-size: 12px; margin-top: 5px;">Jaipur, Rajasthan | craftofpinkcity@gmail.com | +91 9351291471</div>
        </div>
        <div class="ref-box">
          <div style="font-size: 11px; color: #666;">ORDER REF ID</div>
          <div style="font-size: 18px; font-weight: bold; color: #832729;">${lead.refId}</div>
          <div style="font-size: 11px; margin-top: 4px;">${lead.timestamp}</div>
        </div>
      </div>

      <div class="grid">
        <div class="card">
          <h4>Customer / Consignee Details</h4>
          <div><strong>Name:</strong> ${lead.name}</div>
          <div><strong>Phone:</strong> ${lead.phone || 'N/A'}</div>
          <div><strong>Email:</strong> ${lead.email || 'N/A'}</div>
          <div><strong>Company / Studio:</strong> ${lead.company || 'N/A'}</div>
        </div>
        <div class="card">
          <h4>Shipping & Order Status</h4>
          <div><strong>Status:</strong> ${lead.status.toUpperCase()}</div>
          <div><strong>Source:</strong> ${lead.source}</div>
          <div><strong>Timeline:</strong> ${lead.timeline || 'Immediate Dispatch'}</div>
          <div><strong>Address:</strong> ${lead.address || 'Direct Workshop Pickup / Not Provided'}</div>
        </div>
      </div>

      <table class="table">
        <thead>
          <tr>
            <th>Handcrafted Item Description</th>
            <th>Quantity</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${lead.products}</strong><br/><small style="color: #666;">${lead.notes || '100% Pure Quilted Jaipuri Cotton'}</small></td>
            <td>${lead.quantity}</td>
            <td>${lead.totalAmount || 'As Per Quotation'}</td>
          </tr>
        </tbody>
      </table>

      ${lead.totalAmount ? `<div class="total-box">Grand Total: ${lead.totalAmount}</div>` : ''}

      <div class="footer">
        Thank you for supporting master block-printers and hand-quilting karigars of Pink City, Jaipur.<br/>
        For verification & order tracking, visit <strong>https://craftofpinkcity.shop</strong> or WhatsApp <strong>+91 9351291471</strong>
      </div>

      <script>
        window.onload = function() { window.print(); }
      </script>
    </body>
    </html>
  `
  printWindow.document.write(html)
  printWindow.document.close()
}
