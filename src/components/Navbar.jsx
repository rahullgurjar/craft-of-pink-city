import { Menu, X, Sparkles, ShoppingBag } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.jpeg';
import { instagram, whatsapp } from '../data/products';
import InstagramIcon from './InstagramIcon';
import WhatsAppIcon from './WhatsAppIcon';
import { useCart } from '../context/CartContext';

const links = [
  ['Home', 'home'],
  ['About', 'about'],
  ['Our Craft', 'craft'],
  ['Products', 'products'],
  ['Curated Sets', 'bundles'],
  ['Bulk Orders', 'bulk-orders'],
  ['Reviews', 'reviews'],
  ['FAQs', 'faq'],
];

export default function Navbar({ onNavigateHome, isThankYouPage = false }) {
  const [open, setOpen] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [activeSection, setActiveSection] = useState('home');
  const { totalCount, setIsCartOpen } = useCart();

  useEffect(() => {
    if (isThankYouPage) {
      setActiveSection('bulk-orders');
      return;
    }

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(currentProgress);
      }

      // Active Section Spy for smooth navigation highlights
      const sectionIds = ['home', 'about', 'craft', 'fabric-explorer', 'products', 'bundles', 'bulk-orders', 'reviews', 'faq'];
      const scrollPosition = window.scrollY + 130;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el && el.offsetTop <= scrollPosition) {
          setActiveSection(sectionIds[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isThankYouPage]);

  const handleNavClick = (e, id) => {
    e.preventDefault();
    setOpen(false);

    if (isThankYouPage && onNavigateHome) {
      onNavigateHome(id);
      return;
    }

    const targetElement = document.getElementById(id);
    if (targetElement) {
      const navHeight = 76;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
      window.history.pushState(null, '', `#${id}`);
      setActiveSection(id);
    } else if (onNavigateHome) {
      onNavigateHome(id);
    } else {
      window.location.hash = id;
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-ivory/95 backdrop-blur-md transition-shadow duration-300">
      {/* Top Page Scroll Progress Bar */}
      {!isThankYouPage && (
        <div
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose via-saffron to-rose z-[100] origin-left transition-transform duration-75 ease-out pointer-events-none shadow-sm"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        />
      )}

      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, 'home')}
          className="flex items-center gap-3 group"
          aria-label="Craft of Pink City home"
        >
          <img
            className="h-14 w-14 rounded-full object-cover shadow-sm transition-transform duration-300 group-hover:scale-105"
            src={logo}
            alt="Craft of Pink City logo"
          />
          <span className="hidden font-serif text-xl leading-[.85] text-ink sm:block">
            Craft of<br />
            <i className="font-normal text-rose transition-colors group-hover:text-terracotta">Pink City</i>
          </span>
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-4 text-xs font-semibold uppercase tracking-[.13em] lg:flex">
          {links.map(([label, id]) => {
            const isActive = !isThankYouPage && activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleNavClick(e, id)}
                className={`relative px-2 py-1.5 transition-all duration-300 ${
                  id === 'bulk-orders'
                    ? 'flex items-center gap-1.5 rounded-full border border-rose/30 bg-rose/10 px-3 py-1.5 text-rose font-bold hover:bg-rose hover:text-white shadow-xs hover:-translate-y-0.5'
                    : isActive
                    ? 'text-rose font-bold'
                    : 'text-ink/75 hover:text-rose'
                }`}
              >
                {id === 'bulk-orders' && <Sparkles size={13} className="animate-pulse" />}
                {label}
                {isActive && id !== 'bulk-orders' && (
                  <span className="absolute -bottom-1 left-2 right-2 h-[2px] rounded-full bg-rose animate-fadeIn shadow-xs" />
                )}
              </a>
            );
          })}
        </div>

        {/* Right CTA Actions: Cart & Contact */}
        <div className="flex items-center gap-3">
          {/* Cart Bag Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full border border-ink/15 bg-white/80 px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-xs backdrop-blur-sm transition-all hover:border-rose hover:bg-rose hover:text-white hover:shadow-md"
            aria-label={`Open shopping cart (${totalCount} items)`}
          >
            <ShoppingBag size={16} />
            <span className="hidden sm:inline">Bag</span>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-rose text-[10px] font-bold text-white transition-colors group-hover:bg-white group-hover:text-rose">
              {totalCount}
            </span>
          </button>

          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-bold uppercase tracking-[.13em] text-ivory transition-transform duration-300 hover:scale-[1.03] hover:bg-rose sm:flex shadow-xs"
          >
            <WhatsAppIcon size={14} /> WhatsApp
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full bg-ink/5 text-ink hover:bg-ink/10 lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {open && (
        <div
          id="mobile-navigation"
          className="border-t border-ink/10 bg-ivory px-5 py-5 lg:hidden animate-slideUp shadow-xl"
        >
          {links.map(([label, id]) => {
            const isActive = !isThankYouPage && activeSection === id;
            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleNavClick(e, id)}
                className={`block py-3 text-sm font-semibold transition-colors ${
                  id === 'bulk-orders'
                    ? 'text-rose font-bold flex items-center gap-2'
                    : isActive
                    ? 'text-rose font-bold pl-2 border-l-2 border-rose'
                    : 'text-ink/80 hover:text-rose'
                }`}
              >
                {id === 'bulk-orders' && <Sparkles size={15} />}
                {label}
              </a>
            );
          })}
          <div className="mt-4 flex gap-5 border-t border-ink/10 pt-4">
            <a
              className="flex min-h-11 items-center gap-2 text-rose font-semibold text-sm hover:underline"
              href={instagram}
              target="_blank"
              rel="noreferrer"
            >
              <InstagramIcon size={18} /> Instagram
            </a>
            <a
              className="flex min-h-11 items-center gap-2 text-rose font-semibold text-sm hover:underline"
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon size={18} /> WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
