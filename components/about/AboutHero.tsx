import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ChevronDown } from 'lucide-react';

gsap.registerPlugin(useGSAP);

interface Segment {
  t: string;
  em?: boolean;
}

const HEADLINE: Segment[] = [{ t: 'Since\u00A0' }, { t: '1973', em: true }, { t: '.' }];

const SUBHEAD =
  "Evangelismos Trading Company — the largest importer of musical instruments, accessories and books in Cyprus. Five decades of putting instruments into musicians' hands.";

function SplitChars({ segments }: { segments: Segment[] }) {
  return (
    <span className="block">
      {segments.map((seg, si) => (
        <span key={si} className={seg.em ? 'italic text-brass' : undefined}>
          {Array.from(seg.t).map((ch, ci) => (
            <span key={ci} className="inline-block overflow-hidden align-bottom">
              <span className="about-hero-char inline-block will-change-transform">
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

export default function AboutHero() {
  const heroRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set('.about-hero-char', { yPercent: 0, rotate: 0 });
        gsap.set(['.about-hero-word', '.about-hero-eyebrow', '.about-hero-scroll'], { opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'expo.out' } });
      tl.fromTo('.about-hero-eyebrow', { opacity: 0 }, { opacity: 1, duration: 0.5 })
        .fromTo(
          '.about-hero-char',
          { yPercent: 110, rotate: 4 },
          { yPercent: 0, rotate: 0, duration: 1, stagger: 0.03 },
          '-=0.2'
        )
        .fromTo(
          '.about-hero-word',
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.02 },
          '-=0.5'
        )
        .fromTo('.about-hero-scroll', { opacity: 0 }, { opacity: 1, duration: 1 }, '+=0.2');
    },
    { scope: heroRef }
  );

  return (
    <section ref={heroRef} className="noise relative overflow-hidden bg-ink pb-24 pt-16 lg:pt-20">
      {/* Spotlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          left: '50%',
          top: '24%',
          width: '110vmax',
          height: '110vmax',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(200,164,93,0.14) 0%, transparent 55%)',
        }}
      />

      <div className="container-site relative z-10 flex flex-col items-center gap-8 text-center">
        <p className="about-hero-eyebrow eyebrow" style={{ opacity: 0 }}>
          Company Profile
        </p>
        <h1 className="display-xl text-ivory">
          <SplitChars segments={HEADLINE} />
        </h1>
        <p className="max-w-2xl font-sans text-[clamp(1.1rem,1.6vw,1.35rem)] font-medium leading-[1.4] text-ivory-dim">
          {SUBHEAD.split(' ').map((w, i) => (
            <span key={i} className="about-hero-word inline-block" style={{ opacity: 0 }}>
              {w}
              {'\u00A0'}
            </span>
          ))}
        </p>

        <div
          className="about-hero-scroll mt-10 flex flex-col items-center gap-2 font-mono text-[0.72rem] uppercase tracking-[0.22em] text-brass"
          style={{ opacity: 0 }}
        >
          Scroll
          <ChevronDown className="h-4 w-4 animate-bounce" strokeWidth={1.5} aria-hidden />
        </div>
      </div>
    </section>
  );
}
