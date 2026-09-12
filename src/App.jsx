import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import CraftProcess from './components/CraftProcess';
import Products from './components/Products';
import Reviews from './components/Reviews';
import BulkOrder from './components/BulkOrder';
import WhyChooseUs from './components/WhyChooseUs';
import FAQ from './components/FAQ';
import InstagramCTA from './components/InstagramCTA';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import ArtisanChatbot from './components/ArtisanChatbot';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';

export default function App() {
  useEffect(() => {
    // Smooth Page & Section Scroll Reveal Animation Observer
    const sections = document.querySelectorAll('main > section, footer');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-revealed');
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -50px 0px',
        threshold: 0.08,
      }
    );

    sections.forEach((sec, idx) => {
      if (idx === 0) {
        sec.classList.add('scroll-revealed');
      } else {
        sec.classList.add('scroll-reveal');
        observer.observe(sec);
      }
    });

    return () => {
      sections.forEach((sec) => observer.unobserve(sec));
    };
  }, []);

  return (
    <CartProvider>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <CraftProcess />
        <Products />
        <Reviews />
        <BulkOrder />
        <WhyChooseUs />
        <FAQ />
        <InstagramCTA />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <ArtisanChatbot />
      <CartDrawer />
    </CartProvider>
  );
}
