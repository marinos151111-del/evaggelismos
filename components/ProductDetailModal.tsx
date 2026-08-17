import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Music, Plus, ShoppingBag, Truck, X } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast';
import { discountPct, formatEUR } from '@/lib/format';
import { startLenis, stopLenis } from '@/lib/lenis';
import { asset } from "@/lib/asset";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function ProductDetailModal({ product, onClose }: ProductDetailModalProps) {
  const { add } = useCart();
  const { push } = useToast();
  const [qty, setQty] = useState(1);
  const [imgError, setImgError] = useState(false);

  // Reset per-product state
  useEffect(() => {
    setQty(1);
    setImgError(false);
  }, [product?.id]);

  // ESC close + Lenis/body scroll lock
  useEffect(() => {
    if (!product) return;
    stopLenis();
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      startLenis();
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
    };
  }, [product, onClose]);

  const pct = product ? discountPct(product.price, product.old) : null;

  const handleAdd = () => {
    if (!product) return;
    add(product.id, qty);
    push(`Added — ${product.name}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          key="product-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[rgba(10,10,12,0.8)] p-4 backdrop-blur-[8px] sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label={product.name}
        >
          <motion.div
            key="product-modal"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.94, opacity: 0 }}
            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent
            className="relative grid max-h-[90dvh] w-full max-w-[960px] grid-cols-1 overflow-y-auto rounded-[20px] border border-line bg-surface md:grid-cols-2 md:overflow-hidden"
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close product details"
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-line bg-surface/80 text-ivory-dim transition-colors hover:bg-surface-2 hover:text-ivory"
            >
              <X className="h-[18px] w-[18px]" strokeWidth={1.5} />
            </button>

            {/* Image panel */}
            <div className="relative aspect-square overflow-hidden bg-[#EDE8DD]">
              <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.95),rgba(255,255,255,0)_62%)]" />
              {(!product.img || imgError) ? (
                <div className="flex h-full w-full items-center justify-center">
                  <Music className="h-16 w-16 text-ivory-faint" strokeWidth={1.5} />
                </div>
              ) : (
                <motion.img
                  src={asset(product.img)}
                  alt={product.name}
                  onError={() => setImgError(true)}
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.08, 1] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative h-full w-full object-contain p-10 mix-blend-multiply"
                />
              )}
              {pct !== null && (
                <span className="absolute left-4 top-4 rounded-md bg-sale px-2.5 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ivory">
                  Offer −{pct}%
                </span>
              )}
            </div>

            {/* Details */}
            <div className="flex flex-col gap-5 p-6 sm:p-8">
              <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ivory-faint">
                {product.cat}
                {product.sub ? <span className="text-brass"> / {product.sub}</span> : ''}
              </p>
              <h2 className="font-serif text-[1.8rem] font-medium leading-tight text-ivory">
                {product.name}
              </h2>
              <p className="text-[0.95rem] leading-relaxed text-ivory-dim">
                {product.desc?.trim()
                  ? product.desc
                  : 'Contact our stores for full specifications.'}
              </p>

              <div className="mt-auto flex flex-col gap-1.5 border-t border-line pt-5">
                <div className="flex items-baseline gap-3">
                  <span className="font-mono text-3xl font-semibold text-ivory">
                    {formatEUR(product.price)}
                  </span>
                  {product.offer && product.old !== null && (
                    <span className="font-mono text-lg text-sale line-through">
                      {formatEUR(product.old)}
                    </span>
                  )}
                </div>
                <p className="font-mono text-[0.72rem] text-ivory-faint">Price incl. VAT</p>
              </div>

              <div className="flex items-stretch gap-3">
                {/* Qty stepper */}
                <div className="flex items-center rounded-full border border-line">
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="flex h-full w-10 items-center justify-center text-ivory-dim transition-colors hover:text-ivory"
                  >
                    <Minus className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <span className="w-8 text-center font-mono text-sm font-semibold text-ivory">{qty}</span>
                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={() => setQty((q) => Math.min(99, q + 1))}
                    className="flex h-full w-10 items-center justify-center text-ivory-dim transition-colors hover:text-ivory"
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
                <button type="button" onClick={handleAdd} className="btn-primary flex-1 justify-center">
                  <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                  Add to cart
                </button>
              </div>

              <p className="flex items-center gap-2 font-mono text-[0.72rem] text-ivory-faint">
                <Truck className="h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />
                Delivery from €5 · Free pickup —
                <Link to="/shipping" onClick={onClose} className="text-brass underline-offset-2 hover:underline">
                  Shipping details
                </Link>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
