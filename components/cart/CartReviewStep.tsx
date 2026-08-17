import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Minus, Music, Phone, Plus, Store, Trash2, Truck } from 'lucide-react';
import type { CartItem, Product } from '@/types';
import { HOME_DELIVERY_FEE, useCart } from '@/context/CartContext';
import { useCatalog } from '@/context/CatalogContext';
import { formatEUR } from '@/lib/format';
import { STORES } from '@/lib/stores';
import type { DeliveryMethod } from '@/components/cart/CartDrawer';
import { asset } from "@/lib/asset";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface CartReviewStepProps {
  entered: boolean;
  method: DeliveryMethod;
  onMethodChange: (m: DeliveryMethod) => void;
  storeCity: string;
  onStoreChange: (city: string) => void;
  deliveryFee: number;
  total: number;
  onCheckout: () => void;
}

interface ResolvedLine {
  item: CartItem;
  product: Product;
}

/** 72×72 thumbnail with music-note fallback on image error. */
function Thumb({ product }: { product: Product }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className="flex h-[72px] w-[72px] shrink-0 items-center justify-center overflow-hidden rounded-[10px] bg-[#EDE8DD]">
      {(!product.img || failed) ? (
        <Music className="h-6 w-6 text-ivory-faint" strokeWidth={1.5} />
      ) : (
        <img
          src={asset(product.img)}
          alt={product.name}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-2 mix-blend-multiply"
        />
      )}
    </div>
  );
}

function QtyStepper({ line }: { line: ResolvedLine }) {
  const { setQty } = useCart();
  const { item } = line;
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        onClick={() => setQty(item.id, item.qty - 1)}
        aria-label={item.qty === 1 ? `Remove ${line.product.name}` : 'Decrease quantity'}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-ivory-dim transition-colors hover:border-brass hover:text-brass"
      >
        {item.qty === 1 ? (
          <Trash2 className="h-3 w-3" strokeWidth={1.5} />
        ) : (
          <Minus className="h-3 w-3" strokeWidth={1.5} />
        )}
      </button>
      <span className="relative inline-flex h-5 w-7 items-center justify-center overflow-hidden font-mono text-sm text-ivory">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={item.qty}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {item.qty}
          </motion.span>
        </AnimatePresence>
      </span>
      <button
        type="button"
        onClick={() => setQty(item.id, Math.min(99, item.qty + 1))}
        aria-label="Increase quantity"
        disabled={item.qty >= 99}
        className="flex h-7 w-7 items-center justify-center rounded-full border border-line text-ivory-dim transition-colors hover:border-brass hover:text-brass disabled:opacity-40"
      >
        <Plus className="h-3 w-3" strokeWidth={1.5} />
      </button>
    </div>
  );
}

function LineItemRow({ line, index, entered }: { line: ResolvedLine; index: number; entered: boolean }) {
  const { remove } = useCart();
  const { item, product } = line;
  return (
    <motion.div
      layout="position"
      initial={entered ? false : { opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 60, height: 0, paddingTop: 0, paddingBottom: 0, marginBottom: 0 }}
      transition={{
        duration: entered ? 0.3 : 0.4,
        delay: entered ? 0 : 0.2 + index * 0.05,
        ease: EASE,
      }}
      className="overflow-hidden border-b border-line"
    >
      <div className="flex gap-3.5 py-4">
        <Thumb product={product} />
        <div className="flex min-w-0 flex-1 flex-col">
          <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ivory-faint">
            {product.cat}
          </p>
          <p className="mt-0.5 line-clamp-2 font-sans text-sm font-medium leading-snug text-ivory">
            {product.name}
          </p>
          <div className="mt-1.5 flex items-baseline gap-2">
            {product.offer && product.old !== null && (
              <span className="font-mono text-[0.8rem] text-sale line-through">
                {formatEUR(product.old)}
              </span>
            )}
            <span className="font-mono text-[0.85rem] text-ivory-dim">
              {formatEUR(product.price)} each
            </span>
          </div>
          <div className="mt-auto pt-2.5">
            <QtyStepper line={line} />
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end justify-between">
          <button
            type="button"
            onClick={() => remove(item.id)}
            aria-label={`Remove ${product.name}`}
            className="flex h-7 w-7 items-center justify-center rounded-full text-ivory-faint transition-colors hover:bg-surface-2 hover:text-sale"
          >
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
          <span className="font-mono text-[0.95rem] font-semibold text-ivory">
            {formatEUR(product.price * item.qty)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  const navigate = useNavigate();
  const { closeCart } = useCart();
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full border border-line bg-ink-2">
        <Music className="h-8 w-8 text-ivory-faint" strokeWidth={1.25} />
      </div>
      <h3 className="font-serif text-[1.3rem] font-medium text-ivory">Nothing yet.</h3>
      <p className="max-w-[260px] font-sans text-sm leading-relaxed text-ivory-dim">
        Browse the catalog and add your first instrument.
      </p>
      <button
        type="button"
        onClick={() => {
          closeCart();
          navigate('/shop');
        }}
        className="btn-primary mt-2"
      >
        Start browsing
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
      </button>
    </div>
  );
}

export default function CartReviewStep({
  entered,
  method,
  onMethodChange,
  storeCity,
  onStoreChange,
  deliveryFee,
  total,
  onCheckout,
}: CartReviewStepProps) {
  const { items, subtotal } = useCart();
  const { byId } = useCatalog();

  // Resolve display fields from the catalog; silently drop ids that no longer exist
  const lines = useMemo<ResolvedLine[]>(
    () =>
      items
        .map((item) => ({ item, product: byId.get(item.id) }))
        .filter((l): l is ResolvedLine => Boolean(l.product)),
    [items, byId]
  );

  if (lines.length === 0) {
    return <EmptyState />;
  }

  const needsStore = method === 'pickup' && !storeCity;
  const over700 = subtotal > 700;

  return (
    <>
      {/* Zone B — line items */}
      <div data-lenis-prevent className="flex-1 overflow-y-auto px-6">
        <AnimatePresence initial={false}>
          {lines.map((line, i) => (
            <LineItemRow key={line.item.id} line={line} index={i} entered={entered} />
          ))}
        </AnimatePresence>
      </div>

      {/* Zone C — summary + delivery */}
      <div className="shrink-0 border-t border-line px-6 py-5">
        {/* Delivery method radio cards */}
        <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Delivery method">
          <button
            type="button"
            role="radio"
            aria-checked={method === 'home'}
            onClick={() => onMethodChange('home')}
            className={`flex flex-col gap-1.5 rounded-xl border p-3.5 text-left transition-colors duration-300 ${
              method === 'home'
                ? 'border-brass bg-brass/[0.06]'
                : 'border-line bg-transparent hover:border-ivory-faint'
            }`}
          >
            <Truck
              className={`h-[18px] w-[18px] ${method === 'home' ? 'text-brass' : 'text-ivory-dim'}`}
              strokeWidth={1.5}
            />
            <span className="font-sans text-sm font-medium text-ivory">Home delivery</span>
            <span className="font-mono text-xs text-ivory-dim">+ {formatEUR(HOME_DELIVERY_FEE)}</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={method === 'pickup'}
            onClick={() => onMethodChange('pickup')}
            className={`flex flex-col gap-1.5 rounded-xl border p-3.5 text-left transition-colors duration-300 ${
              method === 'pickup'
                ? 'border-brass bg-brass/[0.06]'
                : 'border-line bg-transparent hover:border-ivory-faint'
            }`}
          >
            <Store
              className={`h-[18px] w-[18px] ${method === 'pickup' ? 'text-brass' : 'text-ivory-dim'}`}
              strokeWidth={1.5}
            />
            <span className="font-sans text-sm font-medium text-ivory">Store pickup</span>
            <span className="font-mono text-xs text-ivory-dim">FREE</span>
          </button>
        </div>

        {/* Store select — animated height */}
        <AnimatePresence initial={false}>
          {method === 'pickup' && (
            <motion.div
              key="store-select"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex flex-col gap-1.5" role="radiogroup" aria-label="Pickup store">
                {STORES.map((s) => (
                  <button
                    key={s.city}
                    type="button"
                    role="radio"
                    aria-checked={storeCity === s.city}
                    onClick={() => onStoreChange(s.city)}
                    className={`flex items-center gap-3 rounded-lg border px-3.5 py-2.5 text-left transition-colors duration-300 ${
                      storeCity === s.city
                        ? 'border-brass bg-brass/[0.06]'
                        : 'border-line hover:border-ivory-faint'
                    }`}
                  >
                    <span
                      className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                        storeCity === s.city ? 'border-brass' : 'border-ivory-faint'
                      }`}
                    >
                      {storeCity === s.city && <span className="h-1.5 w-1.5 rounded-full bg-brass" />}
                    </span>
                    <span className="font-sans text-sm text-ivory">
                      {s.city} <span className="text-ivory-dim">— {s.address}</span>
                    </span>
                  </button>
                ))}
                <p className="mt-1 font-mono text-[0.7rem] text-ivory-faint">
                  Held for 2 days, then auto-cancelled.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* €700 order-confirmation notice */}
        <AnimatePresence initial={false}>
          {over700 && (
            <motion.div
              key="over-700"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="mt-3 flex items-start gap-2.5 rounded-lg border border-brass/30 bg-brass/[0.06] px-3.5 py-2.5">
                <Phone className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brass" strokeWidth={1.5} />
                <p className="font-mono text-[0.7rem] leading-relaxed text-brass">
                  Orders over €700 are confirmed by email/phone before processing.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Totals */}
        <div className="mt-4 flex flex-col gap-1.5">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs text-ivory-dim">Subtotal</span>
            <span className="font-mono text-sm text-ivory">{formatEUR(subtotal)}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs text-ivory-dim">Delivery</span>
            <span className="font-mono text-sm text-ivory">
              {method === 'home' ? formatEUR(deliveryFee) : 'FREE'}
            </span>
          </div>
          <div className="my-1.5 h-px bg-line" />
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-sm text-ivory">Total</span>
            <span className="flex items-baseline gap-2">
              <span className="font-mono text-[0.7rem] text-ivory-faint">incl. VAT</span>
              <span className="font-mono text-lg font-semibold text-ivory">{formatEUR(total)}</span>
            </span>
          </div>
        </div>

        {/* CTA */}
        <button
          type="button"
          onClick={onCheckout}
          disabled={needsStore}
          className="btn-primary mt-4 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          {needsStore ? 'Select a store' : 'Request this order'}
          {!needsStore && <ArrowRight className="h-4 w-4" strokeWidth={1.5} />}
        </button>
      </div>
    </>
  );
}
