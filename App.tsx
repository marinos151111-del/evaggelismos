import { useEffect } from 'react';
import { AnimatePresence, MotionConfig, motion } from 'framer-motion';
import { Route, Routes, useLocation } from 'react-router';
import Layout from '@/components/Layout';
import { ToastProvider } from '@/components/Toast';
import { CatalogProvider } from '@/context/CatalogContext';
import { CartProvider } from '@/context/CartContext';
import { getLenis } from '@/lib/lenis';
import Home from '@/site-pages/Home';
import Shop from '@/site-pages/Shop';
import Shipping from '@/site-pages/Shipping';
import Stores from '@/site-pages/Stores';
import About from '@/site-pages/About';
import Contact from '@/site-pages/Contact';
import { useIsMobile } from '@/hooks/use-mobile';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    getLenis()?.scrollTo(0, { immediate: true });
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const location = useLocation();
  const isMobile = useIsMobile();

  return (
    <MotionConfig reducedMotion={isMobile ? 'always' : 'user'}>
      <CatalogProvider>
        <CartProvider>
          <ToastProvider>
            <ScrollToTop />
            <Layout>
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] } }}
                  exit={{ opacity: 0, y: -12, transition: { duration: 0.25 } }}
                >
                  <Routes location={location}>
                    <Route path="/" element={<Home />} />
                    <Route path="/shop" element={<Shop />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/stores" element={<Stores />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="*" element={<Home />} />
                  </Routes>
                </motion.div>
              </AnimatePresence>
            </Layout>
          </ToastProvider>
        </CartProvider>
      </CatalogProvider>
    </MotionConfig>
  );
}
