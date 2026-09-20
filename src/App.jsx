import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import CraftProcess from './components/CraftProcess';
import Products from './components/Products';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import { CartProvider } from './context/CartContext';
import ErrorBoundary from './components/ErrorBoundary';

// Dynamic code-splitting for below-the-fold and heavy modal components
const Reviews = lazy(() => import('./components/Reviews'));
const BulkOrder = lazy(() => import('./components/BulkOrder'));
const WhyChooseUs = lazy(() => import('./components/WhyChooseUs'));
const FAQ = lazy(() => import('./components/FAQ'));
const InstagramCTA = lazy(() => import('./components/InstagramCTA'));
const ArtisanChatbot = lazy(() => import('./components/ArtisanChatbot'));
const CartDrawer = lazy(() => import('./components/CartDrawer'));
const PolicyModal = lazy(() => import('./components/PolicyModal'));
const SalesPopup = lazy(() => import('./components/SalesPopup'));

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
          <Suspense fallback={<div className="min-h-[300px] flex items-center justify-center text-ink/40 text-xs">Loading reviews...</div>}>
            <ErrorBoundary><Reviews /></ErrorBoundary>
          </Suspense>
          <Suspense fallback={null}>
            <ErrorBoundary><BulkOrder /></ErrorBoundary>
          </Suspense>
          <Suspense fallback={null}>
            <ErrorBoundary><WhyChooseUs /></ErrorBoundary>
          </Suspense>
          <Suspense fallback={null}>
            <ErrorBoundary><FAQ /></ErrorBoundary>
          </Suspense>
          <Suspense fallback={null}>
            <ErrorBoundary><InstagramCTA /></ErrorBoundary>
          </Suspense>
        </main>
        <ErrorBoundary><Footer onOpenPolicy={openPolicy} /></ErrorBoundary>
        <ErrorBoundary><FloatingWhatsApp /></ErrorBoundary>
        <Suspense fallback={null}>
          <ErrorBoundary><ArtisanChatbot /></ErrorBoundary>
        </Suspense>
        <Suspense fallback={null}>
          <ErrorBoundary><CartDrawer /></ErrorBoundary>
        </Suspense>
        <Suspense fallback={null}>
          <ErrorBoundary><SalesPopup /></ErrorBoundary>
        </Suspense>
        <Suspense fallback={null}>
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
        </Suspense>
      </CartProvider>
    </ErrorBoundary>
  );
}
