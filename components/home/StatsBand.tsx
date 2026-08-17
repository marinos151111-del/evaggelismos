import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { value: 1973, caption: 'Founded in Nicosia', format: (v: number) => String(Math.round(v)) },
  { value: 50, caption: 'Years of musical heritage', format: (v: number) => `${Math.round(v)}+` },
  { value: 3, caption: 'Stores across Cyprus', format: (v: number) => String(Math.round(v)) },
  {
    value: 2746,
    caption: 'Instruments & accessories in stock',
    format: (v: number) => Math.round(v).toLocaleString('en-US'),
  },
];

export default function StatsBand() {
  const bandRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const numerals = gsap.utils.toArray<HTMLElement>('.stat-numeral');

      if (reduced) {
        numerals.forEach((el) => {
          const stat = STATS[Number(el.dataset.stat)];
          el.textContent = stat.format(stat.value);
        });
        gsap.set(['.stat-caption', '.stat-divider'], { opacity: 1, y: 0, scaleY: 1 });
        return;
      }

      ScrollTrigger.create({
        trigger: bandRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          numerals.forEach((el, i) => {
            const stat = STATS[Number(el.dataset.stat)];
            const obj = { v: 0 };
            gsap.to(obj, {
              v: stat.value,
              duration: 1.6,
              delay: i * 0.12,
              ease: 'power2.out',
              onUpdate: () => {
                el.textContent = stat.format(obj.v);
              },
            });
          });
          gsap.fromTo(
            '.stat-caption',
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' }
          );
          gsap.fromTo(
            '.stat-divider',
            { scaleY: 0 },
            { scaleY: 1, duration: 0.8, stagger: 0.1, transformOrigin: 'center', ease: 'power2.out' }
          );
        },
      });
    },
    { scope: bandRef }
  );

  return (
    <section ref={bandRef} className="border-y border-line bg-ink-2 py-20 lg:py-24">
      <div className="container-site grid grid-cols-2 gap-y-12 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div key={s.caption} className="relative flex flex-col items-center gap-3 px-4 text-center">
            {i > 0 && (
              <span
                aria-hidden
                className="stat-divider absolute left-0 top-1/2 hidden h-16 w-px -translate-y-1/2 bg-line lg:block"
                style={{ transform: 'scaleY(0)' }}
              />
            )}
            <span
              data-stat={i}
              className="stat-numeral font-serif font-semibold text-brass"
              style={{ fontSize: 'clamp(2.6rem, 6vw, 5rem)', lineHeight: 1 }}
            >
              0
            </span>
            <span className="stat-caption font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ivory-dim" style={{ opacity: 0 }}>
              {s.caption}
              {i === 2 && <span className="mt-1 block text-ivory-faint">Nicosia · Larnaca · Limassol</span>}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
