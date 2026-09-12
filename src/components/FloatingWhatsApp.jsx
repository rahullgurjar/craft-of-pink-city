import { useState } from 'react'
import { whatsapp } from '../data/products'
import WhatsAppIcon from './WhatsAppIcon'

export default function FloatingWhatsApp() {
  const [hovered, setHovered] = useState(false)

  return (
    <div className="fixed bottom-22 right-6 z-40 flex items-center gap-3">
      {/* Tooltip */}

      <div
        className={`hidden sm:flex items-center rounded-2xl bg-ink px-4 py-2 text-xs font-bold text-white shadow-xl transition-all duration-300 ${
          hovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
        }`}
      >
        <span>👋 Need help or want to order? Chat on WhatsApp</span>
      </div>

      {/* Floating Button */}
      <a
        href={whatsapp}
        target="_blank"
        rel="noreferrer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-2xl shadow-emerald-900/30 transition-all duration-300 hover:scale-110 hover:bg-[#20ba59]"
        aria-label="Order or Chat with Craft of Pink City on WhatsApp"
      >
        {/* Pulsing ring */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 animate-ping pointer-events-none" />
        
        <WhatsAppIcon size={28} />
      </a>
    </div>
  )
}
