import { Menu, X, Sparkles, ShoppingBag, Layers, Phone, LifeBuoy } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.jpeg';
import { instagram, whatsapp } from '../data/products';
import InstagramIcon from './InstagramIcon';
import WhatsAppIcon from './WhatsAppIcon';
import { useCart } from '../context/CartContext';

// Streamlined high-impact desktop links (optimized to eliminate clutter and give brand breathing room)
const desktopLinks = [
  ['Collection', 'products'],
  ['Curated Sets', 'bundles'],
  ['Our Craft', 'craft'],
  ['Bulk Orders', 'bulk-orders'],
  ['Reviews', 'reviews'],
];

// Full links for mobile drawer
const mobileLinks = [
  ['Home', 'home'],
  ['Collection', 'products'],
  ['Curated Sets', 'bundles'],
  ['Our Craft', 'craft'],
  ['About Us', 'about'],
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

  const handleOpenSupport = () => {
    setOpen(false);
    window.dispatchEvent(new CustomEvent('open-support-help'));
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#EADBC8] bg-[#FFFDF9]/95 backdrop-blur-lg shadow-[0_4px_25px_rgba(90,50,30,0.04)] transition-all duration-300">
      {/* Top Page Scroll Progress Bar */}
      {!isThankYouPage && (
        <div
          className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-rose via-saffron to-terracotta z-[100] origin-left transition-transform duration-75 ease-out pointer-events-none shadow-xs"
          style={{ transform: `scaleX(${scrollProgress / 100})` }}
        />
      )}

      <nav className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-3.5 sm:px-6 lg:px-8 gap-3 sm:gap-6">
        {/* Brand Logo & Prominently Visible Brand Name */}
        <a
          href="#home"
          onClick={(e) => handleNavClick(e, 'home')}
          className="flex items-center gap-2.5 sm:gap-3 group shrink-0 min-w-0"
          aria-label="Craft of Pink City home"
        >
          <div className="relative shrink-0">
            <img
              className="h-11 w-11 sm:h-13 sm:w-13 rounded-full object-cover shadow-sm ring-2 ring-rose/25 ring-offset-2 ring-offset-[#FFFDF9] transition-transform duration-300 group-hover:scale-105"
              src={logo}
              alt="Craft of Pink City logo"
            />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-saffron text-[8px] text-ink font-bold shadow-xs">
              🌸
            </span>
          </div>

          <div className="text-left flex flex-col justify-center min-w-0">
            <span className="font-serif text-lg sm:text-2xl font-bold leading-none text-ink tracking-tight whitespace-nowrap">
              Craft of <i className="font-normal text-rose transition-colors group-hover:text-terracotta">Pink City</i>
            </span>
            <span className="text-[9px] sm:text-[10px] font-semibold tracking-wider text-ink/50 uppercase mt-0.5 truncate">
              Jaipur Artisan Atelier
            </span>
          </div>
        </a>

        {/* Streamlined Desktop Navigation Links (Spacious & Clean) */}
        <div className="hidden items-center gap-1.5 text-[11.5px] font-bold uppercase tracking-[.11em] lg:flex bg-[#FAF4EC]/85 p-1 rounded-full border border-[#E8DCCB] shadow-inner">
          {desktopLinks.map(([label, id]) => {
            const isActive = !isThankYouPage && activeSection === id;
            const isBulk = id === 'bulk-orders';
            const isBundles = id === 'bundles';

            return (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => handleNavClick(e, id)}
                className={`relative px-3.5 py-1.5 rounded-full transition-all duration-200 whitespace-nowrap flex items-center gap-1.5 ${
                  isBulk
                    ? 'bg-gradient-to-r from-rose/15 to-saffron/20 border border-rose/30 text-rose hover:bg-rose hover:text-white shadow-xs font-bold'
                    : isBundles
                    ? isActive
                      ? 'bg-rose text-white shadow-xs'
                      : 'text-ink/75 hover:text-rose hover:bg-white/90'
                    : isActive
                    ? 'bg-rose text-white shadow-xs font-bold'
                    : 'text-ink/75 hover:text-rose hover:bg-white/90'
                }`}
              >
                {isBulk && <Sparkles size={12} className="animate-pulse text-rose" />}
                {isBundles && !isActive && <Layers size={11} className="text-saffron shrink-0" />}
                <span>{label}</span>
              </a>
            );
          })}
        </div>

        {/* Right CTA Actions: Bag & Studio Chat */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Cart Bag Trigger */}
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 rounded-full border border-[#E5D7C5] bg-white/90 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold uppercase tracking-wider text-ink shadow-xs backdrop-blur-sm transition-all hover:border-rose hover:bg-[#FFF8F8] hover:shadow-md hover:scale-105"
            aria-label={`Open shopping cart (${totalCount} items)`}
          >
            <ShoppingBag size={16} className="text-ink/80 group-hover:text-rose transition-colors" />
            <span className="hidden sm:inline font-bold">Bag</span>
            <span className="grid h-5 w-5 place-items-center rounded-full bg-rose text-[10px] font-bold text-white shadow-xs ring-1 ring-white">
              {totalCount}
            </span>
          </button>

          {/* Cozy WhatsApp Artisan Button */}
          <a
            href={whatsapp}
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-1.5 rounded-full bg-gradient-to-r from-[#2D1B1E] via-[#3a2027] to-[#2D1B1E] px-3.5 py-2 text-xs font-bold uppercase tracking-[.11em] text-[#FAF4EC] transition-all duration-300 hover:scale-[1.04] hover:bg-rose shadow-sm hover:shadow-md sm:flex border border-white/10"
          >
            <WhatsAppIcon size={14} className="text-[#25D366]" />
            <span>Chat</span>
          </a>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            className="grid h-9 w-9 sm:h-10 sm:w-10 place-items-center rounded-full bg-[#FAF4EC] text-ink hover:bg-rose/10 hover:text-rose border border-[#E8DCCB] transition-colors lg:hidden"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-label="Toggle navigation"
          >
            {open ? <X size={19} /> : <Menu size={19} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu with Full Links */}
      {open && (
        <div
          id="mobile-navigation"
          className="border-t border-[#E8DCCB] bg-[#FFFDF9] px-5 py-5 lg:hidden animate-slideUp shadow-2xl"
        >
          <div className="space-y-1">
            {mobileLinks.map(([label, id]) => {
              const isActive = !isThankYouPage && activeSection === id;
              const isBulk = id === 'bulk-orders';
              const isBundles = id === 'bundles';

              return (
                <a
                  key={id}
                  href={`#${id}`}
                  onClick={(e) => handleNavClick(e, id)}
                  className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                    isBulk
                      ? 'bg-rose/10 text-rose font-bold border border-rose/20'
                      : isActive
                      ? 'bg-rose text-white font-bold shadow-xs'
                      : 'text-ink/80 hover:bg-[#FAF4EC] hover:text-rose'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isBulk && <Sparkles size={15} className="text-rose" />}
                    {isBundles && <Layers size={15} className="text-saffron" />}
                    <span>{label}</span>
                  </div>
                  <span className="text-xs text-ink/30 font-normal">→</span>
                </a>
              );
            })}
          </div>

          <div className="mt-4 border-t border-[#E8DCCB] pt-4 space-y-2.5">
            <button
              type="button"
              onClick={handleOpenSupport}
              className="flex w-full min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#2D1B1E] to-rose py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:opacity-95"
            >
              <LifeBuoy size={15} />
              <span>24/7 Support & Help Center</span>
            </button>

            <div className="flex items-center justify-around pt-1">
              <a
                className="flex min-h-10 items-center gap-2 text-rose font-bold text-xs hover:underline"
                href={instagram}
                target="_blank"
                rel="noreferrer"
              >
                <InstagramIcon size={16} /> Instagram
              </a>
              <span className="text-ink/20">·</span>
              <a
                className="flex min-h-10 items-center gap-2 text-emerald-700 font-bold text-xs hover:underline"
                href={whatsapp}
                target="_blank"
                rel="noreferrer"
              >
                <WhatsAppIcon size={16} /> WhatsApp Studio
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}


