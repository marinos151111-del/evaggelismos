import { motion } from 'framer-motion';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Segment {
  t: string;
  em?: boolean;
}

const HEADLINE: Segment[] = [
  { t: 'From our stores' },
  { t: ' to your ' },
  { t: 'doorstep', em: true },
  { t: '.' },
];

const SUBHEAD =
  'Simple, honest delivery across Cyprus — one flat rate, free pickup, and prices that already include VAT.';

const CHIPS = ['Home delivery €5.00', 'Pickup FREE', '2-day pickup hold', 'VAT included'];

function SplitChars() {
  return (
    <>
      {HEADLINE.map((seg, si) => (
        <span key={si} className={seg.em ? 'italic text-brass' : undefined}>
          {Array.from(seg.t).map((ch, ci) => (
            <span key={ci} className="inline-block overflow-hidden align-bottom">
              <motion.span
                className="inline-block will-change-transform"
                initial={{ y: '110%', rotate: 3 }}
                animate={{ y: '0%', rotate: 0 }}
                transition={{ duration: 0.9, delay: 0.3 + (si * 10 + ci) * 0.02, ease: EASE }}
              >
                {ch === ' ' ? ' ' : ch}
              </motion.span>
            </span>
          ))}
        </span>
      ))}
    </>
  );
}

export default function ShippingHero() {
  return (
    <section className="noise relative overflow-hidden pb-20 pt-16 lg:pb-24 lg:pt-20">
      {/* Subtle spotlight (8% opacity per shipping.md) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 0%, rgba(200,164,93,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="container-site relative flex flex-col items-center gap-7 text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="eyebrow"
        >
          Shipping &amp; Delivery
        </motion.p>

        <h1 className="display-l max-w-4xl text-ivory">
          <SplitChars />
        </h1>

        <p className="max-w-2xl font-sans text-[clamp(1.1rem,1.6vw,1.35rem)] font-medium leading-[1.4] text-ivory-dim">
          {SUBHEAD.split(' ').map((w, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.9 + i * 0.02, ease: EASE }}
            >
              {w}
              {' '}
            </motion.span>
          ))}
        </p>

        <ul className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {CHIPS.map((chip, i) => (
            <motion.li
              key={chip}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 + i * 0.07, ease: EASE }}
              className="rounded-full border border-line px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ivory-dim"
            >
              {chip}
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
