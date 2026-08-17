import { Link } from 'react-router';
import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const HEADLINE: { t: string; em?: boolean }[] = [
  { t: 'Ready' },
  { t: 'to' },
  { t: 'fill' },
  { t: 'the' },
  { t: 'cart?', em: true },
];

export default function ShippingCta() {
  return (
    <section className="border-t border-line bg-ink-2 py-20 lg:py-24">
      <div className="container-site flex flex-col items-center gap-7 text-center">
        <h2 className="display-m max-w-2xl text-ivory">
          {HEADLINE.map((w, i) => (
            <motion.span
              key={w.t}
              className={`inline-block ${w.em ? 'italic text-brass' : ''}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6, delay: i * 0.03, ease: EASE }}
            >
              {w.t}
              {' '}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
          className="max-w-xl leading-relaxed text-ivory-dim"
        >
          2,746 instruments and accessories, all with VAT-included pricing.
        </motion.p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
          >
            <Link to="/shop" className="btn-primary">
              Browse the shop
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.4, ease: EASE }}
          >
            <Link to="/stores" className="btn-secondary">
              Visit a store
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
