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
