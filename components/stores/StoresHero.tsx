import { motion } from 'framer-motion';
import { getLenis } from '@/lib/lenis';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Segment {
  t: string;
  em?: boolean;
}

const HEADLINE: Segment[] = [
  { t: 'Three cities.' },
  { t: ' One ' },
  { t: 'stage', em: true },
  { t: '.' },
];

const SUBHEAD =
  'Walk in, pick up an instrument, and play. Nicosia, Larnaca and Limassol — the largest musical instrument stores in Cyprus.';

const CHIPS = [
  { label: 'Nicosia · Flagship', target: 'store-nicosia' },
  { label: 'Larnaca', target: 'store-larnaca' },
  { label: 'Limassol', target: 'store-limassol' },
];

function scrollToStore(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(el, { offset: -96, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

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

export default function StoresHero() {
  return (
    <section className="noise relative overflow-hidden pb-20 pt-16 lg:pb-24 lg:pt-20">
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
          Our Stores
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
              key={chip.target}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.4 + i * 0.07, ease: EASE }}
            >
              <button
                type="button"
                onClick={() => scrollToStore(chip.target)}
                className="rounded-full border border-line px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ivory-dim transition-colors duration-300 hover:border-brass hover:text-brass"
              >
                {chip.label}
              </button>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
