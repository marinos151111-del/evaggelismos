import { motion } from 'framer-motion';
import { Copy, Store, Truck } from 'lucide-react';
import { useToast } from '@/components/Toast';
import { formatEUR } from '@/lib/format';
import type { OrderSnapshot } from '@/components/cart/CartDrawer';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface SuccessStepProps {
  snapshot: OrderSnapshot;
  onContinue: () => void;
}

export default function SuccessStep({ snapshot, onContinue }: SuccessStepProps) {
  const { push } = useToast();

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(snapshot.ref);
      push('Reference copied');
    } catch {
      push(snapshot.ref);
    }
  };

  return (
    <div
      data-lenis-prevent
      className="flex flex-1 flex-col items-center justify-center gap-5 overflow-y-auto px-8 py-8 text-center"
    >
      {/* Animated check */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 14, stiffness: 200 }}
        className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-brass bg-brass/[0.08]"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 text-brass"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <motion.path
            d="M4 12.5l5 5L20 6.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          />
        </svg>
      </motion.div>

      <h3 className="font-serif text-[1.6rem] font-medium text-ivory">
        Request <em className="italic text-brass">received</em>.
      </h3>

      <p className="max-w-[320px] font-sans text-sm leading-relaxed text-ivory-dim">
        Thank you, {snapshot.name}. Our team will confirm your order{' '}
        <span className="text-ivory">by email or phone</span> — orders over €700 are always
        confirmed personally. Your reference:
      </p>

      <button
        type="button"
        onClick={copyRef}
        aria-label={`Copy order reference ${snapshot.ref}`}
        className="flex items-center gap-2 rounded-lg border border-line bg-ink-2 px-4 py-2.5 font-mono text-sm font-semibold text-brass transition-colors duration-300 hover:border-brass"
      >
        {snapshot.ref}
        <Copy className="h-3.5 w-3.5 text-ivory-faint" strokeWidth={1.5} />
      </button>

      {/* Recap */}
      <div className="flex w-full max-w-[320px] flex-col gap-2 rounded-xl border border-line bg-ink-2 px-4 py-3.5 text-left">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[0.7rem] text-ivory-faint">Items</span>
          <span className="font-mono text-xs text-ivory">{snapshot.count}</span>
        </div>
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[0.7rem] text-ivory-faint">Delivery</span>
          <span className="flex items-center gap-1.5 font-mono text-xs text-ivory">
            {snapshot.method === 'home' ? (
              <>
                <Truck className="h-3 w-3 text-brass" strokeWidth={1.5} /> Home delivery
              </>
            ) : (
              <>
                <Store className="h-3 w-3 text-brass" strokeWidth={1.5} /> Pickup —{' '}
                {snapshot.storeCity}
              </>
            )}
          </span>
        </div>
        <div className="mt-1 flex items-baseline justify-between border-t border-line pt-2">
          <span className="font-mono text-[0.7rem] text-ivory-faint">Total incl. VAT</span>
          <span className="font-mono text-sm font-semibold text-ivory">
            {formatEUR(snapshot.total)}
          </span>
        </div>
      </div>

      <button type="button" onClick={onContinue} className="btn-primary mt-1">
        Continue browsing
      </button>
    </div>
  );
}
