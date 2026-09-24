import { Mail, Sparkles, ShieldCheck, LifeBuoy, Phone, Truck, HelpCircle } from 'lucide-react';
import logo from '../assets/logo.jpeg';
import { instagram, whatsapp, email } from '../data/products';
import InstagramIcon from './InstagramIcon';
import WhatsAppIcon from './WhatsAppIcon';

export default function Footer({ onOpenPolicy, onOpenSupport }) {
  const handlePolicyClick = (e, tabId) => {
    e.preventDefault();
    if (onOpenPolicy) {
      onOpenPolicy(tabId);
    } else {
      window.location.hash = tabId;
    }
  };

  const handleSupportClick = (e, tab = 'contact') => {
    e.preventDefault();
    if (onOpenSupport) {
      onOpenSupport(tab);
    } else {
      window.dispatchEvent(new CustomEvent('open-support-help', { detail: { tab } }));
    }
  };

  return (
    <footer className="bg-ink text-ivory">
      {/* 24/7 Support & Help Desk Top Banner */}
      <div className="border-b border-ivory/10 bg-gradient-to-r from-ink via-[#291729] to-ink px-5 py-6">
        <div className="mx-auto flex max-w-7xl flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <LifeBuoy size={22} className="animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="font-serif text-base sm:text-lg font-bold text-white">
                  Need Help or Have a Custom Query?
                </h3>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Support
                </span>
              </div>
              <p className="text-xs text-ivory/70 mt-0.5">
                Our Jaipur artisan coordinators are online to assist with orders, bulk catalogs, and custom sizing.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={(e) => handleSupportClick(e, 'contact')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-rose to-saffron px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md hover:scale-105 transition-all"
            >
              <LifeBuoy size={14} />
              <span>Open Help Center</span>
            </button>

            <a
              href={whatsapp}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-[#20ba59] transition-all hover:scale-105"
            >
              <WhatsAppIcon size={15} />
              <span>WhatsApp Live</span>
            </a>

            <button
              type="button"
              onClick={(e) => handleSupportClick(e, 'track')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/20 px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <Truck size={14} />
              <span>Track Order</span>
            </button>
          </div>
        </div>
      </div>

      <div className="section-shell grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4">
        {/* Col 1: Brand Info */}
        <div>
          <img className="h-20 w-20 rounded-full object-cover border border-ivory/20" src={logo} alt="Craft of Pink City" />
          <p className="mt-4 font-serif text-3xl leading-none">
            Craft of<br />
            <i>Pink City</i>
          </p>
          <p className="mt-3 text-xs text-ivory/60 leading-relaxed">
            Handmade quilted accessories & heritage block prints direct from the artisan workshops of Jaipur.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              onClick={(e) => handleSupportClick(e, 'faqs')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-ivory/10 px-2.5 py-1.5 text-[11px] font-semibold text-ivory hover:bg-ivory/20 hover:text-white transition-colors"
            >
              <HelpCircle size={13} className="text-saffron" />
              <span>Support & FAQs</span>
            </button>
          </div>
        </div>

        {/* Col 2: Studio Location */}
        <div>
          <p className="footer-label">Visit & Workshop</p>
          <p className="mt-3 text-sm text-ivory/70 leading-relaxed">
            Jaipur, Rajasthan<br />
            India - 302001
          </p>
          <p className="mt-3 text-xs text-saffron/90">
            Artisan Studio · Direct Workshop
          </p>
          <div className="mt-4 border-t border-ivory/10 pt-3">
            <p className="footer-label">Customer Policies</p>
            <div className="mt-2 flex flex-col gap-1.5 text-xs text-ivory/70">
              <a
                href="#privacy"
                onClick={(e) => handlePolicyClick(e, 'privacy')}
                className="hover:text-saffron transition-colors cursor-pointer"
              >
                Privacy Policy
              </a>
              <a
                href="#terms"
                onClick={(e) => handlePolicyClick(e, 'terms')}
                className="hover:text-saffron transition-colors cursor-pointer"
              >
                Terms & Conditions
              </a>
              <a
                href="#shipping"
                onClick={(e) => handlePolicyClick(e, 'shipping')}
                className="hover:text-saffron transition-colors cursor-pointer"
              >
                Shipping & Delivery
              </a>
              <a
                href="#refunds"
                onClick={(e) => handlePolicyClick(e, 'refunds')}
                className="hover:text-saffron transition-colors cursor-pointer"
              >
                Returns & Refunds
              </a>
            </div>
          </div>
        </div>

        {/* Col 3: Contact & Enquire */}
        <div>
          <p className="footer-label">Connect & Support</p>
          <a className="mt-3 flex items-center gap-2 text-sm text-ivory/70 hover:text-saffron transition-colors" href={instagram} target="_blank" rel="noreferrer">
            <InstagramIcon size={16} /> @craftofpinkcity
          </a>
          <a className="mt-2 flex items-center gap-2 text-sm text-ivory/70 hover:text-saffron transition-colors" href={whatsapp} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={16} /> +91 93512 91471
          </a>
          <a className="mt-2 flex items-center gap-2 text-sm text-ivory/70 hover:text-saffron transition-colors" href={`mailto:${email}`}>
            <Mail size={16} /> {email}
          </a>
          <div className="mt-3.5 flex flex-col gap-1.5">
            <a className="inline-flex items-center gap-1.5 text-xs text-saffron hover:underline font-bold" href="#bulk-orders">
              <Sparkles size={13} /> Bulk & Wholesale Desk →
            </a>
            <button
              type="button"
              onClick={(e) => handleSupportClick(e, 'callback')}
              className="inline-flex items-center gap-1.5 text-xs text-rose hover:underline font-semibold text-left"
            >
              <LifeBuoy size={13} /> Request Call Back / Support Ticket →
            </button>
          </div>
        </div>

        {/* Col 4: Explore */}
        <div>
          <p className="footer-label">Explore & Help</p>
          <div className="mt-3 grid gap-2 text-sm text-ivory/70">
            <a href="#about" className="hover:text-ivory transition-colors">About Us</a>
            <a href="#craft" className="hover:text-ivory transition-colors">Our Craft Process</a>
            <a href="#products" className="hover:text-ivory transition-colors">Retail Collections</a>
            <a href="#bulk-orders" className="hover:text-saffron transition-colors text-ivory font-semibold">Bulk & Custom Orders</a>
            <a href="#faq" className="hover:text-ivory transition-colors">Frequently Asked Questions</a>
            <button
              type="button"
              onClick={(e) => handleSupportClick(e, 'contact')}
              className="text-left text-xs font-bold text-saffron hover:underline mt-1"
            >
              24/7 Support Desk Hub →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ivory/15 px-5 py-5 text-center text-xs text-ivory/45 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto pb-20 sm:pb-5">
        <span>© 2026 Craft of Pink City. All rights reserved. Handcrafted with pride in Jaipur, Rajasthan.</span>
        <div className="flex items-center gap-4 text-ivory/60">
          <a
            href="#privacy"
            onClick={(e) => handlePolicyClick(e, 'privacy')}
            className="hover:text-ivory hover:underline"
          >
            Privacy
          </a>
          <span>·</span>
          <a
            href="#terms"
            onClick={(e) => handlePolicyClick(e, 'terms')}
            className="hover:text-ivory hover:underline"
          >
            Terms
          </a>
          <span>·</span>
          <a
            href="#shipping"
            onClick={(e) => handlePolicyClick(e, 'shipping')}
            className="hover:text-ivory hover:underline"
          >
            Shipping
          </a>
          <span>·</span>
          <a
            href="#refunds"
            onClick={(e) => handlePolicyClick(e, 'refunds')}
            className="hover:text-ivory hover:underline"
          >
            Refunds
          </a>
          <span>·</span>
          <button
            type="button"
            onClick={(e) => handleSupportClick(e, 'contact')}
            className="hover:text-saffron hover:underline"
          >
            Support & Help
          </button>
          <span>·</span>
          <a
            href="#admin"
            className="hover:text-rose hover:underline inline-flex items-center gap-1 opacity-60 hover:opacity-100 transition-all font-mono text-[11px]"
            title="Staff Atelier CRM & Product Manager (Alt+A)"
          >
            <ShieldCheck size={12} className="text-rose" /> Staff Portal
          </a>
        </div>
      </div>
    </footer>
  );
}

