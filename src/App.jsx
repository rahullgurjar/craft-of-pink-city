import { useState, useEffect } from 'react';
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
import PolicyModal from './components/PolicyModal';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState('privacy');

  const openPolicy = (tab = 'privacy') => {
    setPolicyTab(tab);
    setIsPolicyOpen(true);
  };

  // Hash route listener for policy links (e.g. #privacy, #terms, #shipping, #refunds)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (['privacy', 'terms', 'shipping', 'refunds', 'policies'].includes(hash)) {
        const targetTab = hash === 'policies' ? 'privacy' : hash;
        setPolicyTab(targetTab);
        setIsPolicyOpen(true);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

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
        <ErrorBoundary><Footer onOpenPolicy={openPolicy} /></ErrorBoundary>
        <ErrorBoundary><FloatingWhatsApp /></ErrorBoundary>
        <ErrorBoundary><ArtisanChatbot /></ErrorBoundary>
        <ErrorBoundary><CartDrawer /></ErrorBoundary>
        <ErrorBoundary>
          <PolicyModal
            isOpen={isPolicyOpen}
            initialTab={policyTab}
            onClose={() => {
              setIsPolicyOpen(false);
              // Clean hash if it was a policy hash
              if (['#privacy', '#terms', '#shipping', '#refunds', '#policies'].includes(window.location.hash)) {
                history.replaceState(null, '', window.location.pathname + window.location.search);
              }
            }}
          />
        </ErrorBoundary>
      </CartProvider>
    </ErrorBoundary>
  );
}
