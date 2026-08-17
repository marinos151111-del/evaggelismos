import { useCallback, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/cart/CartDrawer';
import { destroyLenis, initLenis } from '@/lib/lenis';

const DISMISS_KEY = 'ems-announce-dismissed';

/**
 * Global layout — owns the fixed-nav offset contract.
 * Fixed header = announcement bar (36px, dismissible) + nav (72px).
 * Pages must NOT add their own nav-height padding.
 */
export default function Layout({ children }: { children: ReactNode }) {
  const [announceVisible, setAnnounceVisible] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem(DISMISS_KEY) !== '1';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    initLenis();
    return () => destroyLenis();
  }, []);

  const dismissAnnouncement = useCallback(() => {
    setAnnounceVisible(false);
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* storage unavailable */
    }
  }, []);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-ink text-ivory">
      <Navbar announcementVisible={announceVisible} onDismissAnnouncement={dismissAnnouncement} />
      <main
        className="flex-1"
        style={{ paddingTop: announceVisible ? 108 : 72 }}
      >
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}
