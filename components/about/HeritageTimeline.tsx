import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Era {
  year: string;
  label: string;
  title: string;
  body: ReactNode;
  chips: string[];
}

const Strong = ({ children }: { children: ReactNode }) => (
  <strong className="font-medium text-ivory">{children}</strong>
);

const ERAS: Era[] = [
  {
    year: '1973',
    label: 'The first shop',
    title: 'A counter, a few pianos, and a promise.',
    body: (
      <>
        Evangelismos Trading Company opens in Nicosia, importing{' '}
        <Strong>Bentley pianos from the UK</Strong>, <Strong>Admira guitars from Spain</Strong>,
        mandolins from Italy, and music books.
      </>
    ),
    chips: ['BENTLEY PIANOS · UK', 'ADMIRA GUITARS · ES', 'MANDOLINS · IT', 'MUSIC BOOKS'],
  },
  {
    year: '1978',
    label: 'A second home',
    title: 'Demand outgrows the first door.',
    body: <>Demand grows — a second Nicosia store opens its doors.</>,
    chips: ['NICOSIA ×2'],
  },
  {
    year: '1983',
    label: 'Three stores strong',
    title: 'A new partnership crosses continents.',
    body: (
      <>
        A third Nicosia shop, and a new partnership: <Strong>Young Chang pianos from Korea</Strong>{' '}
        join the family.
      </>
    ),
    chips: ['YOUNG CHANG · KR'],
  },
  {
    year: '1996',
    label: 'Larnaca',
    title: 'The family reaches the coast.',
    body: <>The family reaches the coast — the Larnaca store opens.</>,
    chips: ['LARNACA'],
  },
  {
    year: '1997',
    label: 'Limassol & the flagship',
    title: 'One city, one landmark store.',
    body: (
      <>
        Limassol opens, and the Nicosia shops consolidate into one large{' '}
        <Strong>three-storey central store</Strong> on Kennedy Avenue.
      </>
    ),
    chips: ['LIMASSOL', '65 KENNEDY AVENUE'],
  },
  {
    year: 'Today',
    label: "Cyprus' largest",
    title: 'Every musician, served.',
    body: (
      <>
        The largest importer of musical instruments, accessories and books in Cyprus:{' '}
        <Strong>2,746 products</Strong>, 14 categories, 3 stores, one promise — every musician,
        served.
      </>
    ),
    chips: ['2,746 PRODUCTS', '3 STORES', '50+ YEARS'],
  },
];

function EraCard({ era, className, style }: { era: Era; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={className} style={style}>
      <p className="tl-eyebrow eyebrow mb-4">{era.label}</p>
      <h3 className="tl-title mb-4 font-serif text-[1.8rem] font-medium leading-snug text-ivory">
        {era.title}
      </h3>
      <p className="tl-body max-w-xl leading-[1.65] text-ivory-dim">{era.body}</p>
      <div className="mt-6 flex flex-wrap gap-2.5">
        {era.chips.map((c) => (
          <span
            key={c}
            className="tl-chip rounded-md border border-line px-3 py-1.5 font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-brass"
          >
            {c}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function HeritageTimeline() {
  const sectionRef = useRef<HTMLElement>(null);
  const [reduced] = useState(
    () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );

  useGSAP(
    () => {
      if (reduced) return;

      const years = gsap.utils.toArray<HTMLElement>('.tl-year');
      const cards = gsap.utils.toArray<HTMLElement>('.tl-card');

      // Initial states: era 0 visible, the rest hidden below
      gsap.set(years, { y: 80, opacity: 0, rotate: 1.5 });
      gsap.set(years[0], { y: 0, opacity: 1, rotate: 0 });
      gsap.set(cards, { y: 32, opacity: 0 });
      gsap.set(cards[0], { y: 0, opacity: 1 });
      gsap.set('.tl-spot', { xPercent: 0 });

      // Era crossfades across the pin (each era ≈ one beat of the scrub)
      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=250%',
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
        },
      });

      for (let i = 1; i < ERAS.length; i++) {
        const at = i; // one time-unit per era
        tl.to(years[i - 1], { y: -80, opacity: 0, duration: 0.5, ease: 'power2.in' }, at)
          .fromTo(
            years[i],
            { y: 80, opacity: 0, rotate: 1.5 },
            { y: 0, opacity: 1, rotate: 0, duration: 0.6 },
            at + 0.25
          )
          .to(cards[i - 1], { y: -32, opacity: 0, duration: 0.5, ease: 'power2.in' }, at)
          .fromTo(
            cards[i],
            { y: 32, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6 },
            at + 0.25
          )
          .fromTo(
            cards[i].querySelectorAll('.tl-chip'),
            { y: 12, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, stagger: 0.06 },
            at + 0.55
          )
          // Drifting spotlight shifts position per era (subtle)
          .to('.tl-spot', { xPercent: (i - (ERAS.length - 1) / 2) * 8, duration: 0.8 }, at);
      }

      // Continuous progress line
      gsap.fromTo(
        '.tl-progress',
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: 'none',
          transformOrigin: 'top',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: '+=250%',
            scrub: true,
          },
        }
      );
    },
    { scope: sectionRef }
  );

  /* Reduced-motion fallback: unpinned vertical stack of era cards */
  if (reduced) {
    return (
      <section className="bg-ink py-24 lg:py-32">
        <div className="container-site flex flex-col gap-16">
          {ERAS.map((era) => (
            <div key={era.year} className="grid gap-6 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <span className="font-serif font-semibold text-brass" style={{ fontSize: 'clamp(3rem, 8vw, 6rem)', lineHeight: 1 }}>
                  {era.year}
                </span>
              </div>
              <div className="lg:col-span-8">
                <EraCard era={era} />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-ink">
      <style>{`
        @keyframes about-brass-breath {
          0%, 100% { box-shadow: 0 0 0 rgba(200,164,93,0); }
          50% { box-shadow: 0 8px 60px rgba(200,164,93,0.22); }
        }
        .about-breath { animation: about-brass-breath 2s ease-in-out infinite; }
        @media (prefers-reduced-motion: reduce) { .about-breath { animation: none; } }
      `}</style>

      <div className="flex min-h-[100dvh] items-center">
        {/* Drifting spotlight */}
        <div
          aria-hidden
          className="tl-spot pointer-events-none absolute left-1/2 top-1/3"
          style={{
            width: '120vmax',
            height: '120vmax',
            transform: 'translate(-50%, -50%)',
            opacity: 0.1,
            background: 'radial-gradient(circle, rgba(200,164,93,0.6) 0%, transparent 55%)',
          }}
        />

        <div className="container-site relative z-10 grid w-full grid-cols-1 items-center gap-10 py-16 lg:grid-cols-12 lg:gap-8">
          {/* Left: giant year + progress line */}
          <div className="relative flex items-center gap-8 lg:col-span-5">
            <div className="relative h-24 w-full overflow-hidden lg:h-72">
              {ERAS.map((era) => (
                <span
                  key={era.year}
                  className="tl-year absolute left-0 top-0 font-serif font-semibold text-brass will-change-transform"
                  style={{ fontSize: 'clamp(4rem, 14vw, 12rem)', lineHeight: 1 }}
                >
                  {era.year}
                </span>
              ))}
            </div>
            <div aria-hidden className="relative hidden h-64 w-px shrink-0 bg-line lg:block">
              <span className="tl-progress absolute inset-0 bg-brass" style={{ transform: 'scaleY(0)' }} />
            </div>
          </div>

          {/* Right: story cards */}
          <div className="relative min-h-[22rem] sm:min-h-[19rem] lg:col-span-7 lg:min-h-[17rem]">
            {ERAS.map((era, i) => (
              <EraCard
                key={era.year}
                era={era}
                className={
                  'tl-card absolute inset-0 ' +
                  (i === ERAS.length - 1 ? 'about-breath rounded-2xl' : '')
                }
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
