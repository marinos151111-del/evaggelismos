import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Phone, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { STORES } from '@/lib/stores';
import { startLenis, stopLenis } from '@/lib/lenis';
import { asset } from "@/lib/asset";
import AiSearchBar from '@/components/AiSearchBar';

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shipping', label: 'Shipping' },
  { to: '/stores', label: 'Stores' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

interface NavbarProps {
  announcementVisible: boolean;
  onDismissAnnouncement: () => void;
}

export default function Navbar({ announcementVisible, onDismissAnnouncement }: NavbarProps) {
  const { count, lastAddedAt, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll + pause Lenis while the mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      stopLenis();
      document.body.style.overflow = 'hidden';
    } else {
      startLenis();
      document.body.style.overflow = '';
    }
    return () => {
      startLenis();
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Announcement bar */}
        <AnimatePresence initial={false}>
          {announcementVisible && (
            <motion.div
              key="announcement"
              initial={{ height: 36, opacity: 1 }}
              animate={{ height: 36, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden bg-brass"
            >
              <div className="container-site flex h-9 items-center justify-center gap-3">
                <Link
                  to="/shipping"
                  className="truncate font-mono text-[0.7rem] font-medium uppercase tracking-[0.14em] text-ink hover:underline"
                >
                  Home delivery across Cyprus — €5.00 incl. VAT · Free store pickup
                </Link>
                <button
                  type="button"
                  onClick={onDismissAnnouncement}
                  aria-label="Dismiss announcement"
                  className="ml-auto shrink-0 rounded-full p-1 text-ink/70 transition-colors hover:text-ink"
                >
                  <X className="h-3.5 w-3.5" strokeWidth={2} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main nav */}
        <nav
          className="border-b border-line backdrop-blur-[14px] transition-colors duration-300"
          style={{ background: scrolled ? 'var(--ink)' : 'rgba(10,10,12,0.72)' }}
        >
          <div className="container-site flex h-[72px] items-center justify-between gap-4">
            <Link to="/" aria-label="Evangelismos Music Stores — home" className="shrink-0">
              <img src={asset("assets/logo.png")} alt="Evangelismos Music Stores" className="h-[34px] w-auto" />
            </Link>

            {/* Desktop links */}
            <ul className="hidden items-center gap-7 lg:flex">
              {LINKS.map((l) => (
                <li key={l.to}>
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `group relative py-2 font-sans text-[0.9rem] font-medium transition-colors duration-300 ${
                        isActive ? 'text-ivory' : 'text-ivory-dim hover:text-ivory'
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {l.label}
                        <span
                          className={`absolute -bottom-0.5 left-0 h-px w-full origin-left bg-brass transition-transform duration-300 ${
                            isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        />
                      </>
                    )}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Right actions */}
            <div className="flex items-center gap-2.5">
              <AiSearchBar />

              <button
                type="button"
                onClick={openCart}
                aria-label={`Open cart, ${count} items`}
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line text-ivory-dim transition-colors duration-300 hover:bg-surface-2 hover:text-ivory"
              >
                <ShoppingBag className="h-[18px] w-[18px]" strokeWidth={1.5} />
                <AnimatePresence>
                  {count > 0 && (
                    <motion.span
                      key={lastAddedAt || 'cart-badge'}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                      className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-brass px-1 font-mono text-[0.65rem] font-semibold text-ink"
                    >
                      {count}
                    </motion.span>
                  )}
                </AnimatePresence>
              </button>

              <Link to="/shop?offer=1" className="btn-primary hidden !px-5 !py-2.5 text-sm lg:inline-flex">
                Shop Offers
              </Link>

              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ivory transition-colors duration-300 hover:bg-surface-2 lg:hidden"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink/[0.98] lg:hidden"
          >
            <div className="container-site flex h-[72px] items-center justify-between">
              <img src={asset("assets/logo.png")} alt="Evangelismos Music Stores" className="h-[34px] w-auto" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ivory"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
            <nav className="container-site flex flex-1 flex-col justify-center gap-1">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6"
              >
                <AiSearchBar compact autoFocus={false} onSubmitted={() => setMenuOpen(false)} />
              </motion.div>
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.45, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
                >
                  <NavLink
                    to={l.to}
                    end={l.to === '/'}
                    onClick={() => setMenuOpen(false)}
                    className={({ isActive }) =>
                      `font-serif text-[2.4rem] leading-tight transition-colors ${
                        isActive ? 'italic text-brass' : 'text-ivory hover:text-brass'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.4 }}
              className="container-site flex flex-col gap-2 border-t border-line py-6"
            >
              {STORES.map((s) => (
                <a
                  key={s.city}
                  href={`tel:${s.tel}`}
                  className="flex items-center gap-3 font-mono text-xs text-ivory-dim transition-colors hover:text-brass"
                >
                  <Phone className="h-3.5 w-3.5 text-brass" strokeWidth={1.5} />
                  {s.city} — {s.telDisplay}
                </a>
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
