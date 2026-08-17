import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { Store } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const HEADLINE: { t: string; em?: boolean }[] = [
  { t: 'Order' },
  { t: 'online,' },
  { t: 'collect' },
  { t: 'free.', em: true },
];

export default function PickupBand() {
  return (
    <section className="border-y border-line bg-ink-2 py-20">
      <div className="container-site flex flex-col items-center gap-7 text-center">
        <motion.span
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-brass/15 text-brass"
        >
          <Store className="h-6 w-6" strokeWidth={1.5} />
        </motion.span>

        <h2 className="display-m max-w-2xl text-ivory">
          {HEADLINE.map((w, i) => (
            <motion.span
              key={w.t}
              className={`inline-block ${w.em ? 'italic text-brass' : ''}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.03, ease: EASE }}
            >
              {w.t}
              {' '}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.25, ease: EASE }}
          className="max-w-xl leading-relaxed text-ivory-dim"
        >
          Choose store pickup at checkout — your order is held for 2 days at the store of your choice.
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.35, ease: EASE }}
          >
            <Link to="/shop" className="btn-primary">
              Shop now
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6, delay: 0.45, ease: EASE }}
          >
            <Link to="/shipping" className="btn-secondary">
              Delivery details
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
