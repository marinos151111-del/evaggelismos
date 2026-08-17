import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, X } from 'lucide-react';
import { HOME_DELIVERY_FEE, useCart } from '@/context/CartContext';
import { startLenis, stopLenis } from '@/lib/lenis';
import { STORES } from '@/lib/stores';
import CartReviewStep from '@/components/cart/CartReviewStep';
import EnquiryStep from '@/components/cart/EnquiryStep';
import SuccessStep from '@/components/cart/SuccessStep';

export type DeliveryMethod = 'home' | 'pickup';
export type CartStep = 'cart' | 'enquiry' | 'success';

export interface OrderSnapshot {
  ref: string;
  name: string;
  count: number;
  total: number;
  method: DeliveryMethod;
  storeCity: string | null;
}

/** Client-side order reference, e.g. EMS-K4X9P2 (base36 timestamp). */
export function makeOrderRef(): string {
  return `EMS-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function CartDrawer() {
  const { isCartOpen, closeCart, count, subtotal, clear } = useCart();
  const [step, setStep] = useState<CartStep>('cart');
  const [dir, setDir] = useState(1);
  const [method, setMethod] = useState<DeliveryMethod>('home');
  const [storeCity, setStoreCity] = useState<string>(STORES[0].city);
  const [orderRef, setOrderRef] = useState('');
  const [snapshot, setSnapshot] = useState<OrderSnapshot | null>(null);
  const [entered, setEntered] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  const deliveryFee = method === 'home' ? HOME_DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  // Pause Lenis + lock body scroll while the drawer is open
  useEffect(() => {
    if (isCartOpen) {
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
  }, [isCartOpen]);

  // ESC to close
  useEffect(() => {
    if (!isCartOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isCartOpen, closeCart]);

  // Focus trap + focus restore
  useEffect(() => {
    if (!isCartOpen) return;
    const drawer = drawerRef.current;
    if (!drawer) return;
    const prevActive = document.activeElement as HTMLElement | null;
    drawer.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusables = drawer.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (!drawer.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      prevActive?.focus?.();
    };
  }, [isCartOpen]);

  // Stagger line items on first open only
  useEffect(() => {
    if (!isCartOpen) return;
    setEntered(false);
    const t = window.setTimeout(() => setEntered(true), 900);
    return () => window.clearTimeout(t);
  }, [isCartOpen]);

  // Reset the flow after the drawer has closed (post exit animation)
  useEffect(() => {
    if (isCartOpen) return;
    const t = window.setTimeout(() => {
      setStep('cart');
      setDir(1);
      setSnapshot(null);
    }, 400);
    return () => window.clearTimeout(t);
  }, [isCartOpen]);

  const goTo = useCallback((next: CartStep, forward: boolean) => {
    setDir(forward ? 1 : -1);
    setStep(next);
  }, []);

  const startEnquiry = useCallback(() => {
    setOrderRef(makeOrderRef());
    goTo('enquiry', true);
  }, [goTo]);

  const handleSubmitted = useCallback(
    (name: string) => {
      setSnapshot({
        ref: orderRef,
        name,
        count,
        total,
        method,
        storeCity: method === 'pickup' ? storeCity : null,
      });
      clear();
      goTo('success', true);
    },
    [orderRef, count, total, method, storeCity, clear, goTo]
  );

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            aria-hidden="true"
            className="fixed inset-0 z-[65] bg-[rgba(10,10,12,0.7)] backdrop-blur-[6px]"
          />

          {/* Drawer */}
          <motion.div
            key="cart-drawer"
            ref={drawerRef}
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            aria-label={step === 'cart' ? 'Your cart' : 'Order enquiry'}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 260 }}
            className="fixed inset-y-0 right-0 z-[70] flex h-[100dvh] w-full max-w-[440px] flex-col border-l border-line bg-surface outline-none"
          >
            {/* Zone A — header */}
            <div className="shrink-0 border-b border-line">
              <div className="flex h-[72px] items-center justify-between gap-3 px-6">
                {step === 'cart' ? (
                  <div className="flex items-baseline gap-2.5">
                    <h2 className="font-serif text-[1.4rem] font-medium text-ivory">Your cart</h2>
                    <span className="font-mono text-xs text-ivory-faint">
                      ({count} {count === 1 ? 'item' : 'items'})
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2.5">
                    {step === 'enquiry' && (
                      <button
                        type="button"
                        onClick={() => goTo('cart', false)}
                        aria-label="Back to cart"
                        className="-ml-2 flex h-9 w-9 items-center justify-center rounded-full text-ivory-dim transition-colors hover:bg-surface-2 hover:text-ivory"
                      >
                        <ChevronLeft className="h-5 w-5" strokeWidth={1.5} />
                      </button>
                    )}
                    <div className="flex items-baseline gap-2.5">
                      <h2 className="font-serif text-[1.4rem] font-medium text-ivory">
                        Order enquiry
                      </h2>
                      <span className="font-mono text-xs text-brass">{orderRef}</span>
                    </div>
                  </div>
                )}
                <button
                  type="button"
                  onClick={closeCart}
                  aria-label="Close cart"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ivory-dim transition-colors duration-300 hover:bg-surface-2 hover:text-ivory"
                >
                  <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </button>
              </div>
              {step === 'cart' && (
                <div className="border-t border-line px-6 py-2">
                  <Link
                    to="/shipping"
                    onClick={closeCart}
                    className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-brass transition-colors hover:text-brass-bright"
                  >
                    Home delivery €5.00 · Store pickup FREE
                  </Link>
                </div>
              )}
            </div>

            {/* Sliding step panels */}
            <div className="relative flex-1 overflow-hidden">
              <AnimatePresence initial={false} custom={dir}>
                {step === 'cart' && (
                  <motion.div
                    key="step-cart"
                    custom={dir}
                    initial={{ x: dir >= 0 ? '100%' : '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: dir >= 0 ? '-100%' : '100%' }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="absolute inset-0 flex flex-col"
                  >
                    <CartReviewStep
                      entered={entered}
                      method={method}
                      onMethodChange={setMethod}
                      storeCity={storeCity}
                      onStoreChange={setStoreCity}
                      deliveryFee={deliveryFee}
                      total={total}
                      onCheckout={startEnquiry}
                    />
                  </motion.div>
                )}
                {step === 'enquiry' && (
                  <motion.div
                    key="step-enquiry"
                    custom={dir}
                    initial={{ x: dir >= 0 ? '100%' : '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: dir >= 0 ? '-100%' : '100%' }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="absolute inset-0 flex flex-col"
                  >
                    <EnquiryStep total={total} onSubmitted={handleSubmitted} />
                  </motion.div>
                )}
                {step === 'success' && snapshot && (
                  <motion.div
                    key="step-success"
                    custom={dir}
                    initial={{ x: dir >= 0 ? '100%' : '-100%' }}
                    animate={{ x: 0 }}
                    exit={{ x: dir >= 0 ? '-100%' : '100%' }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="absolute inset-0 flex flex-col"
                  >
                    <SuccessStep snapshot={snapshot} onContinue={closeCart} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
