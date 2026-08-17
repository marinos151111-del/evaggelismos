import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { MapPin, ShieldCheck, Store, Truck } from 'lucide-react';

const ROWS = [
  { icon: Truck, label: 'Home delivery', figure: '€5.00' },
  { icon: Store, label: 'Store pickup', figure: 'FREE' },
  { icon: ShieldCheck, label: 'Orders over €700', figure: 'Confirmed by phone/email' },
];

export default function ShippingTeaser() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 56 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="grid overflow-hidden rounded-[20px] border border-line bg-surface transition-colors duration-300 hover:border-[rgba(200,164,93,0.4)] lg:grid-cols-[55%_45%]"
        >
          {/* Left panel */}
          <div className="dot-grid relative flex flex-col items-start gap-5 border-b border-line bg-ink-2 p-8 sm:p-12 lg:border-b-0 lg:border-r">
            {/* Truck + route illustration */}
            <div className="relative mb-2 w-full max-w-sm">
              <svg viewBox="0 0 320 120" fill="none" className="w-full" aria-hidden>
                <path
                  d="M60 84 C 130 20, 210 20, 268 70"
                  stroke="var(--brass)"
                  strokeWidth="1.5"
                  strokeDasharray="6 7"
                  className="animate-dash-flow"
                  opacity="0.7"
                />
              </svg>
              <Truck
                className="absolute left-2 top-1/2 h-16 w-16 -translate-y-1/2 text-brass"
                strokeWidth={1}
              />
              <MapPin
                className="absolute right-4 top-[52%] h-8 w-8 -translate-y-1/2 text-brass-bright"
                strokeWidth={1.5}
              />
            </div>

            <p className="eyebrow">03 — Shipping &amp; Delivery</p>
            <h2 className="display-l text-ivory">
              Anywhere in Cyprus for <em className="italic text-brass">€5</em>.
            </h2>
            <p className="max-w-md leading-relaxed text-ivory-dim">
              Home delivery €5.00 incl. VAT via our associates. Prefer to collect? Pickup is free at
              any Evangelismos store — we'll hold your order for 2 days.
            </p>
            <Link to="/shipping" className="btn-secondary mt-2">
              Delivery details →
            </Link>
          </div>

          {/* Right panel */}
          <div className="flex flex-col justify-center">
            {ROWS.map((r, i) => (
              <motion.div
                key={r.label}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.6, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
                className={`flex items-center gap-5 px-8 py-8 sm:px-12 ${
                  i > 0 ? 'border-t border-line' : ''
                }`}
              >
                <r.icon className="h-7 w-7 shrink-0 text-brass" strokeWidth={1.5} />
                <div className="flex flex-col gap-1">
                  <span className="font-sans font-medium text-ivory">{r.label}</span>
                  <span className="font-mono text-sm text-ivory-dim">{r.figure}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
