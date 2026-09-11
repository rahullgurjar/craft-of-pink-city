import { Menu, X, Sparkles } from 'lucide-react';
import { useState } from 'react';
import logo from '../assets/logo.jpeg';
import { instagram, whatsapp } from '../data/products';
import InstagramIcon from './InstagramIcon';
import WhatsAppIcon from './WhatsAppIcon';

const links = [
  ['Home', 'home'],
  ['About', 'about'],
  ['Our Craft', 'craft'],
  ['Products', 'products'],
  ['Bulk Orders', 'bulk-orders'],
  ['FAQs', 'faq'],
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-ink/10 bg-ivory/95 backdrop-blur-md">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <a href="#home" className="flex items-center gap-3" aria-label="Craft of Pink City home">
          <img className="h-14 w-14 rounded-full object-cover shadow-sm" src={logo} alt="Craft of Pink City logo" />
          <span className="hidden font-serif text-xl leading-[.85] text-ink sm:block">
            Craft of<br />
            <i className="font-normal text-rose">Pink City</i>
          </span>
        </a>
        <div className="hidden items-center gap-6 text-xs font-semibold uppercase tracking-[.13em] lg:flex">
          {links.map(([label, id]) => (
            <a
              className={`transition-colors hover:text-rose ${
                id === 'bulk-orders'
                  ? 'flex items-center gap-1.5 rounded-full border border-rose/30 bg-rose/10 px-3 py-1 text-rose font-bold hover:bg-rose hover:text-white'
                  : ''
              }`}
              href={`#${id}`}
              key={id}
            >
              {id === 'bulk-orders' && <Sparkles size={13} />}
              {label}
            </a>
          ))}
          <div className="flex items-center gap-2 border-l border-ink/15 pl-4">
            <a
              aria-label="Craft of Pink City on Instagram"
              className="grid min-h-11 min-w-8 place-items-center text-rose hover:text-ink transition-colors"
              href={instagram}
              target="_blank"
              rel="noreferrer"
            >
              <InstagramIcon size={19} />
            </a>
            <a
              aria-label="Chat with Craft of Pink City on WhatsApp"
              className="grid min-h-11 min-w-8 place-items-center text-rose hover:text-ink transition-colors"
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon size={20} />
            </a>
          </div>
        </div>
        <button
          className="grid min-h-11 min-w-11 place-items-center lg:hidden"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label="Toggle navigation"
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div id="mobile-navigation" className="border-t border-ink/10 bg-ivory px-5 py-5 lg:hidden">
          {links.map(([label, id]) => (
            <a
              className={`block py-3 text-sm font-semibold ${
                id === 'bulk-orders' ? 'text-rose font-bold flex items-center gap-2' : ''
              }`}
              onClick={() => setOpen(false)}
              href={`#${id}`}
              key={id}
            >
              {id === 'bulk-orders' && <Sparkles size={15} />}
              {label}
            </a>
          ))}
          <div className="mt-4 flex gap-5 border-t border-ink/10 pt-4">
            <a className="flex min-h-11 items-center gap-2 text-rose font-semibold text-sm" href={instagram} target="_blank" rel="noreferrer">
              <InstagramIcon size={18} /> Instagram
            </a>
            <a className="flex min-h-11 items-center gap-2 text-rose font-semibold text-sm" href={whatsapp} target="_blank" rel="noreferrer">
              <WhatsAppIcon size={18} /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
