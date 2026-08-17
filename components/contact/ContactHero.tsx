import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

interface Segment {
  t: string;
  em?: boolean;
}

const HEADLINE: Segment[] = [{ t: 'Talk to a\u00A0' }, { t: 'musician', em: true }, { t: '.' }];

const SUBHEAD =
  'Questions about an instrument, an order, or a repair? Call a store directly or send us a message — real people answer.';

export default function ContactHero() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set('.contact-hero-char', { yPercent: 0, rotate: 0 });
        gsap.set(['.contact-hero-word', '.contact-hero-eyebrow'], { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'expo.out' } });
      tl.fromTo('.contact-hero-eyebrow', { opacity: 0 }, { opacity: 1, duration: 0.5 })
        .fromTo(
          '.contact-hero-char',
          { yPercent: 110, rotate: 4 },
          { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.02 },
          '-=0.2'
        )
        .fromTo(
          '.contact-hero-word',
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.02 },
          '-=0.5'
        );
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="relative overflow-hidden bg-ink pb-20 pt-16 lg:pt-20">
      {/* Subtle spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: '50%',
          top: '20%',
          width: '100vmax',
          height: '100vmax',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(200,164,93,0.1) 0%, transparent 55%)',
        }}
      />

      <div className="container-site relative z-10 flex flex-col items-center gap-7 text-center">
        <p className="contact-hero-eyebrow eyebrow" style={{ opacity: 0 }}>
          Contact
        </p>
        <h1 className="display-l text-ivory">
          <span className="block">
            {HEADLINE.map((seg, si) => (
              <span key={si} className={seg.em ? 'italic text-brass' : undefined}>
                {Array.from(seg.t).map((ch, ci) => (
                  <span key={ci} className="inline-block overflow-hidden align-bottom">
                    <span className="contact-hero-char inline-block will-change-transform">
                      {ch === ' ' ? '\u00A0' : ch}
                    </span>
                  </span>
                ))}
              </span>
            ))}
          </span>
        </h1>
        <p className="max-w-xl font-sans text-[clamp(1.1rem,1.6vw,1.35rem)] font-medium leading-[1.4] text-ivory-dim">
          {SUBHEAD.split(' ').map((w, i) => (
            <span key={i} className="contact-hero-word inline-block" style={{ opacity: 0 }}>
              {w}
              {'\u00A0'}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
