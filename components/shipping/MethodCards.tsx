import { memo } from 'react';
import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Check, MapPin, Store, Truck } from 'lucide-react';
import { STORES } from '@/lib/stores';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const HOME_POINTS = ['Delivered by trusted associates', 'Flat rate island-wide', 'Confirmation before dispatch'];

/** Perpetual route-dash loop under the truck badge — isolated + memoized. */
const RouteLine = memo(function RouteLine() {
  return (
    <svg viewBox="0 0 64 10" className="h-2.5 w-16" fill="none" aria-hidden>
      <motion.path
        d="M2 5 H62"
        stroke="var(--brass)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="6 6"
        animate={{ strokeDashoffset: [0, -24] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
        opacity={0.6}
      />
    </svg>
  );
});

/** Breathing brass border glow (3s cycle) — isolated + memoized. */
const BreathingBorder = memo(function BreathingBorder() {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute inset-0 rounded-[20px]"
      animate={{
        boxShadow: [
          '0 0 0 1px rgba(200,164,93,0.12), 0 0 24px rgba(200,164,93,0.12)',
          '0 0 0 1px rgba(200,164,93,0.28), 0 0 44px rgba(200,164,93,0.28)',
        ],
      }}
      transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
    />
  );
});

export default function MethodCards() {
  return (
    <section className="container-site py-20 lg:py-24">
      <div className="grid gap-8 lg:grid-cols-2">
        {/* Card A — Home delivery */}
        <motion.article
          initial={{ opacity: 0, y: 64 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="flex min-h-[380px] flex-col gap-6 rounded-[20px] border border-line bg-surface p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-brass/50 lg:p-10"
        >
          <div className="flex items-center gap-5">
            <div className="flex flex-col items-center gap-1.5">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brass/15 text-brass">
                <Truck className="h-6 w-6" strokeWidth={1.5} />
              </span>
              <RouteLine />
            </div>
            <p className="eyebrow">Option 01</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="font-serif text-[4rem] font-semibold leading-none text-brass">€5.00</p>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ivory-faint">
              Flat rate · incl. VAT
            </p>
          </div>

          <h2 className="font-sans text-xl font-semibold text-ivory">Home delivery, anywhere in Cyprus</h2>

          <p className="leading-relaxed text-ivory-dim">
            Your order is delivered to your address by our associates. One flat rate —{' '}
            <strong className="font-medium text-ivory">€5.00 including VAT</strong> — no matter the size of
            your order. In exceptional cases an order may carry different delivery charges per item; when
            that happens, only the <strong className="font-medium text-ivory">maximum</strong> applicable
            charge is applied — never the sum.
          </p>

          <ul className="mt-auto flex flex-col gap-2.5 border-t border-line pt-5">
            {HOME_POINTS.map((p) => (
              <li
                key={p}
                className="flex items-center gap-2.5 font-mono text-[0.8rem] text-ivory-dim"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-brass" strokeWidth={2} />
                {p}
              </li>
            ))}
          </ul>
        </motion.article>

        {/* Card B — Store pickup (recommended) */}
        <motion.article
          initial={{ opacity: 0, y: 64 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
          className="relative flex min-h-[380px] flex-col gap-6 rounded-[20px] border border-brass/40 bg-ink-2 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-brass/60 lg:p-10"
        >
          <BreathingBorder />
          <span className="absolute right-6 top-6 rounded-full bg-brass px-3 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink">
            Free
          </span>

          <div className="flex items-center gap-5">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brass/15 text-brass">
              <Store className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <p className="eyebrow">Option 02</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="font-serif text-[4rem] font-semibold leading-none text-ivory">€0.00</p>
            <p className="font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ivory-faint">
              Free at all 3 stores
            </p>
          </div>

          <h2 className="font-sans text-xl font-semibold text-ivory">Collect from your preferred store</h2>

          <p className="leading-relaxed text-ivory-dim">
            Order online and collect from Nicosia, Larnaca or Limassol — completely free. Your order is
            held at the store for <strong className="font-medium text-ivory">2 days</strong>; after that it
            is automatically cancelled, so pop in soon.
          </p>

          <ul className="mt-auto border-t border-line">
            {STORES.map((s) => (
              <li key={s.city} className="border-b border-line last:border-b-0">
                <Link
                  to="/stores"
                  className="group flex items-center gap-2.5 py-3 font-mono text-[0.8rem] text-ivory-dim transition-colors hover:text-brass"
                >
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-brass" strokeWidth={1.5} />
                  {s.city} — {s.address}
                </Link>
              </li>
            ))}
          </ul>
        </motion.article>
      </div>
    </section>
  );
}
