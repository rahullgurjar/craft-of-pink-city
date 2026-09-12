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
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  return (
    <ErrorBoundary>
      <CartProvider>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <ErrorBoundary><Navbar /></ErrorBoundary>
        <main id="main">
          <ErrorBoundary><Hero /></ErrorBoundary>
          <ErrorBoundary><About /></ErrorBoundary>
          <ErrorBoundary><CraftProcess /></ErrorBoundary>
          <ErrorBoundary><Products /></ErrorBoundary>
          <ErrorBoundary><Reviews /></ErrorBoundary>
          <ErrorBoundary><BulkOrder /></ErrorBoundary>
          <ErrorBoundary><WhyChooseUs /></ErrorBoundary>
          <ErrorBoundary><FAQ /></ErrorBoundary>
          <ErrorBoundary><InstagramCTA /></ErrorBoundary>
        </main>
        <ErrorBoundary><Footer /></ErrorBoundary>
        <ErrorBoundary><FloatingWhatsApp /></ErrorBoundary>
        <ErrorBoundary><ArtisanChatbot /></ErrorBoundary>
        <ErrorBoundary><CartDrawer /></ErrorBoundary>
      </CartProvider>
    </ErrorBoundary>
  );
}
