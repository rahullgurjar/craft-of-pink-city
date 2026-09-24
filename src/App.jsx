import { useState, useEffect, lazy, Suspense } from 'react';
import Navbar from './components/Navbar';
import AnnouncementBar from './components/AnnouncementBar';
import Hero from './components/Hero';
import About from './components/About';
import CraftProcess from './components/CraftProcess';
import Products from './components/Products';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';
import MobileBottomBar from './components/MobileBottomBar';
import { CartProvider } from './context/CartContext';
import { CurrencyProvider } from './context/CurrencyContext';
import { ProductsProvider } from './context/ProductsContext';
import ErrorBoundary from './components/ErrorBoundary';

// Dynamic code-splitting for below-the-fold and heavy modal components
const FabricExplorer = lazy(() => import('./components/FabricExplorer'));
const BundleSave = lazy(() => import('./components/BundleSave'));
const Reviews = lazy(() => import('./components/Reviews'));
const BulkOrder = lazy(() => import('./components/BulkOrder'));
const WhyChooseUs = lazy(() => import('./components/WhyChooseUs'));
const FAQ = lazy(() => import('./components/FAQ'));
const InstagramCTA = lazy(() => import('./components/InstagramCTA'));
const ArtisanChatbot = lazy(() => import('./components/ArtisanChatbot'));
const SupportHelpCenter = lazy(() => import('./components/SupportHelpCenter'));
const CartDrawer = lazy(() => import('./components/CartDrawer'));
const PolicyModal = lazy(() => import('./components/PolicyModal'));
const SalesPopup = lazy(() => import('./components/SalesPopup'));
const ThankYou = lazy(() => import('./components/ThankYou'));
const AdminPortal = lazy(() => import('./components/admin/AdminPortal'));

export default function App() {
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [policyTab, setPolicyTab] = useState('privacy');
  const [isThankYouPage, setIsThankYouPage] = useState(false);
  const [isAdminPage, setIsAdminPage] = useState(false);
  const [inquiryData, setInquiryData] = useState(null);

  const openPolicy = (tab = 'privacy') => {
    setPolicyTab(tab);
    setIsPolicyOpen(true);
  };

  // Hash and Path route listener
  useEffect(() => {
    const handleRouteChange = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      // Check Admin / Staff CRM Route
      if (['admin', 'crm', 'backend', 'portal', 'dashboard'].includes(hash) || pathname === '/admin' || pathname === '/crm') {
        setIsAdminPage(true);
        setIsThankYouPage(false);
        return;
      } else {
        setIsAdminPage(false);
      }

      // Check Thank You Page
      if (hash === 'thank-you' || pathname === '/thank-you') {
        setIsThankYouPage(true);
        try {
          const cached = sessionStorage.getItem('cpc_last_inquiry');
          if (cached) {
            setInquiryData(JSON.parse(cached));
          }
        } catch (e) {
          console.debug('Error reading cached inquiry:', e);
        }
      } else {
        setIsThankYouPage(false);
      }

      // Check Policies Modal
      if (['privacy', 'terms', 'shipping', 'refunds', 'policies'].includes(hash)) {
        const targetTab = hash === 'policies' ? 'privacy' : hash;
        setPolicyTab(targetTab);
        setIsPolicyOpen(true);
      }
    };

    handleRouteChange();
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);

    // Keyboard shortcut for Staff Portal: Alt + A
    const handleKeyDown = (e) => {
      if ((e.altKey && (e.key === 'a' || e.key === 'A')) || (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault();
        setIsAdminPage(true);
        window.location.hash = 'admin';
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleNavigateThankYou = (data) => {
    setInquiryData(data);
    setIsThankYouPage(true);
    setIsAdminPage(false);
    window.location.hash = 'thank-you';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToStore = (sectionId = 'home') => {
    setIsThankYouPage(false);
    setIsAdminPage(false);
    window.history.pushState(null, '', `#${sectionId}`);

    setTimeout(() => {
      if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const targetElement = document.getElementById(sectionId);
        if (targetElement) {
          const navHeight = 76;
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - navHeight;
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth',
          });
        }
      }
    }, 50);
  };

  return (
    <ErrorBoundary>
      <ProductsProvider>
        <CurrencyProvider>
          <CartProvider>
            <a className="skip-link" href="#main">
              Skip to content
            </a>

            {/* If Staff CRM / Admin Page is active */}
            {isAdminPage ? (
              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center bg-[#1e121d] text-white">
                    <div className="text-center space-y-3">
                      <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-rose border-t-transparent" />
                      <p className="font-serif text-lg">Authenticating Jaipur Atelier Staff Portal...</p>
                    </div>
                  </div>
                }
              >
                <ErrorBoundary>
                  <AdminPortal onBackToStore={() => handleBackToStore('home')} />
                </ErrorBoundary>
              </Suspense>
            ) : (
              <>
                <ErrorBoundary>
                  <AnnouncementBar />
                </ErrorBoundary>
                <ErrorBoundary>
                  <Navbar
                    onNavigateHome={handleBackToStore}
                    isThankYouPage={isThankYouPage}
                  />
                </ErrorBoundary>

                {isThankYouPage ? (
                  <main id="main" className="min-h-screen">
                    <Suspense
                      fallback={
                        <div className="min-h-screen flex items-center justify-center bg-[#faf4ec] text-ink/70">
                          <div className="text-center space-y-3">
                            <div className="h-8 w-8 mx-auto animate-spin rounded-full border-2 border-rose border-t-transparent" />
                            <p className="font-serif text-lg">Preparing your confirmation...</p>
                          </div>
                        </div>
                      }
                    >
                      <ErrorBoundary>
                        <ThankYou
                          inquiryData={inquiryData}
                          onBackHome={handleBackToStore}
                        />
                      </ErrorBoundary>
                    </Suspense>
                  </main>
                ) : (
                  <main id="main">
                    <ErrorBoundary><Hero /></ErrorBoundary>
                    <ErrorBoundary><About /></ErrorBoundary>
                    <ErrorBoundary><CraftProcess /></ErrorBoundary>
                    <Suspense fallback={null}>
                      <ErrorBoundary><FabricExplorer /></ErrorBoundary>
                    </Suspense>
                    <ErrorBoundary><Products onNavigateThankYou={handleNavigateThankYou} /></ErrorBoundary>
                    <Suspense fallback={null}>
                      <ErrorBoundary><BundleSave /></ErrorBoundary>
                    </Suspense>
                    <Suspense fallback={<div className="min-h-[300px] flex items-center justify-center text-ink/40 text-xs">Loading reviews...</div>}>
                      <ErrorBoundary><Reviews /></ErrorBoundary>
                    </Suspense>
                    <Suspense fallback={null}>
                      <ErrorBoundary>
                        <BulkOrder onNavigateThankYou={handleNavigateThankYou} />
                      </ErrorBoundary>
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
                )}

                <ErrorBoundary><Footer onOpenPolicy={openPolicy} /></ErrorBoundary>
                <ErrorBoundary><FloatingWhatsApp /></ErrorBoundary>
                <ErrorBoundary>
                  <MobileBottomBar
                    onNavigateSection={handleBackToStore}
                    isThankYouPage={isThankYouPage}
                  />
                </ErrorBoundary>
                <Suspense fallback={null}>
                  <ErrorBoundary>
                    <SupportHelpCenter
                      onOpenPolicy={openPolicy}
                    />
                  </ErrorBoundary>
                </Suspense>
                <Suspense fallback={null}>
                  <ErrorBoundary><ArtisanChatbot /></ErrorBoundary>
                </Suspense>
                <Suspense fallback={null}>
                  <ErrorBoundary><CartDrawer onNavigateThankYou={handleNavigateThankYou} /></ErrorBoundary>
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
                        if (['#privacy', '#terms', '#shipping', '#refunds', '#policies'].includes(window.location.hash)) {
                          history.replaceState(null, '', window.location.pathname + window.location.search);
                        }
                      }}
                    />
                  </ErrorBoundary>
                </Suspense>
              </>
            )}
          </CartProvider>
        </CurrencyProvider>
      </ProductsProvider>
    </ErrorBoundary>
  );
}
