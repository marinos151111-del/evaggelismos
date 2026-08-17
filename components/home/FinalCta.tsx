import { Link } from 'react-router';
import { motion } from 'framer-motion';

const BRANDS = [
  'BENTLEY PIANOS · UK',
  'ADMIRA GUITARS · SPAIN',
  'YOUNG CHANG PIANOS · KOREA',
  'MANDOLINS · ITALY',
  'MUSIC BOOKS',
  'SINCE 1973',
];

const HEADLINE = ['Your next', 'instrument', 'is', 'waiting.'];

export default function FinalCta() {
  const track = [...BRANDS, ...BRANDS, ...BRANDS];

  return (
    <section className="py-24 lg:pb-32 lg:pt-24">
      {/* Brand legacy marquee */}
      <div className="overflow-hidden border-y border-line py-5">
        <div className="animate-marquee-slow flex w-max items-center hover:[animation-play-state:paused]">
          {track.map((b, i) => (
            <span
              key={`${b}-${i}`}
              className="flex items-center whitespace-nowrap font-mono text-[0.72rem] uppercase tracking-[0.22em] text-ivory-dim"
            >
              <span className="px-6">{b}</span>
              <span aria-hidden className="text-brass">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* CTA block */}
      <div className="container-site flex flex-col items-center gap-7 pt-20 text-center lg:pt-28">
        {/* Treble clef draw-on */}
        <motion.svg
          viewBox="0 0 60 100"
          className="h-16 w-10"
          fill="none"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.6 }}
          aria-hidden
        >
          <motion.path
            d="M34 8 C 20 14, 18 30, 30 38 C 44 47, 46 62, 32 70 C 18 78, 18 92, 32 94 C 44 96, 48 84, 38 78 M34 8 L 30 96"
            stroke="var(--brass)"
            strokeWidth="2.5"
            strokeLinecap="round"
            variants={{
              hidden: { pathLength: 0, opacity: 0 },
              visible: { pathLength: 1, opacity: 1 },
            }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          />
        </motion.svg>

        <h2 className="display-l max-w-3xl text-ivory">
          {HEADLINE.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 0.6, delay: 0.15 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className={`inline-block ${w === 'waiting.' ? 'italic text-brass' : ''}`}
            >
              {w.replace(/\.$/, '')}
              {w.endsWith('.') && <span className="text-ivory">.</span>}
              {'\u00A0'}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl leading-relaxed text-ivory-dim"
        >
          Browse 2,746 products with prices incl. VAT — or walk into a store and play it first.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/shop" className="btn-primary">
            Start browsing
          </Link>
          <Link to="/contact" className="btn-secondary">
            Contact us
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
