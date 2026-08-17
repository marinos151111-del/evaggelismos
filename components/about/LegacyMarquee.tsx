import { motion } from 'framer-motion';

const ITEMS = [
  'BENTLEY PIANOS',
  'ADMIRA GUITARS',
  'YOUNG CHANG PIANOS',
  'MANDOLINS',
  'MUSIC BOOKS',
  "2,746 PRODUCTS IN TODAY'S CATALOG",
];

export default function LegacyMarquee() {
  const track = [...ITEMS, ...ITEMS, ...ITEMS];

  return (
    <section className="border-y border-line bg-ink-2 py-16">
      <motion.p
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="eyebrow mb-10 text-center"
      >
        Brands we've carried since day one
      </motion.p>
      <div className="overflow-hidden">
        <div
          className="animate-marquee flex w-max items-center hover:[animation-play-state:paused]"
          style={{ animationDuration: '36s' }}
        >
          {[...track, ...track].map((b, i) => (
            <span
              key={`${b}-${i}`}
              className="flex items-center whitespace-nowrap font-mono text-[0.78rem] uppercase tracking-[0.22em] text-ivory-dim"
            >
              <span className="px-7">{b}</span>
              <span aria-hidden className="text-brass">
                ✦
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
