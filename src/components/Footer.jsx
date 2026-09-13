import { Mail, Sparkles, ShieldCheck } from 'lucide-react';
import logo from '../assets/logo.jpeg';
import { instagram, whatsapp, email } from '../data/products';
import InstagramIcon from './InstagramIcon';
import WhatsAppIcon from './WhatsAppIcon';

export default function Footer({ onOpenPolicy }) {
  const handlePolicyClick = (e, tabId) => {
    e.preventDefault();
    if (onOpenPolicy) {
      onOpenPolicy(tabId);
    } else {
      window.location.hash = tabId;
    }
  };

  return (
    <footer className="bg-ink text-ivory">
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
          <p className="footer-label">Connect & Enquire</p>
          <a className="mt-3 flex items-center gap-2 text-sm text-ivory/70 hover:text-saffron transition-colors" href={instagram} target="_blank" rel="noreferrer">
            <InstagramIcon size={16} /> @craftofpinkcity
          </a>
          <a className="mt-2 flex items-center gap-2 text-sm text-ivory/70 hover:text-saffron transition-colors" href={whatsapp} target="_blank" rel="noreferrer">
            <WhatsAppIcon size={16} /> +91 93512 91471
          </a>
          <a className="mt-2 flex items-center gap-2 text-sm text-ivory/70 hover:text-saffron transition-colors" href={`mailto:${email}`}>
            <Mail size={16} /> {email}
          </a>
          <a className="mt-3 inline-flex items-center gap-1.5 text-xs text-saffron hover:underline font-bold" href="#bulk-orders">
            <Sparkles size={13} /> Bulk & Wholesale Desk →
          </a>
        </div>

        {/* Col 4: Explore */}
        <div>
          <p className="footer-label">Explore</p>
          <div className="mt-3 grid gap-2 text-sm text-ivory/70">
            <a href="#about" className="hover:text-ivory transition-colors">About Us</a>
            <a href="#craft" className="hover:text-ivory transition-colors">Our Craft Process</a>
            <a href="#products" className="hover:text-ivory transition-colors">Retail Collections</a>
            <a href="#bulk-orders" className="hover:text-saffron transition-colors text-ivory font-semibold">Bulk & Custom Orders</a>
            <a href="#faq" className="hover:text-ivory transition-colors">Frequently Asked Questions</a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-ivory/15 px-5 py-5 text-center text-xs text-ivory/45 flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
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
        </div>
      </div>
    </footer>
  );
}
