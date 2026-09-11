import { Mail, Sparkles } from 'lucide-react';
import logo from '../assets/logo.jpeg';
import { instagram, whatsapp, email } from '../data/products';
import InstagramIcon from './InstagramIcon';
import WhatsAppIcon from './WhatsAppIcon';

export default function Footer() {
  return (
    <footer className="bg-ink text-ivory">
      <div className="section-shell grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-4">
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

        <div>
          <p className="footer-label">Visit & Workshop</p>
          <p className="mt-3 text-sm text-ivory/70 leading-relaxed">
            Jaipur, Rajasthan<br />
            India - 302001
          </p>
          <p className="mt-3 text-xs text-saffron/90">
            Artisan Studio · Direct Workshop
          </p>
        </div>

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
      <div className="border-t border-ivory/15 px-5 py-5 text-center text-xs text-ivory/45">
        © 2026 Craft of Pink City. All rights reserved. Handcrafted with pride in Jaipur, Rajasthan.
      </div>
    </footer>
  );
}
