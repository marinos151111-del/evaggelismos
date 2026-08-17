import { useRef } from 'react';
import { Link } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useCatalog } from '@/context/CatalogContext';
import ParticleField from '@/components/home/ParticleField';
import { asset } from "@/lib/asset";

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Segment {
  t: string;
  em?: boolean;
}

const HEADLINE: Segment[][] = [
  [{ t: 'Fifty years' }],
  [{ t: 'of\u00A0' }, { t: 'sound', em: true }, { t: '.' }],
];

const SUBHEAD =
  'The largest importer of musical instruments, accessories and books in Cyprus. 2,746 instruments in stock — from concert pianos to guitar strings.';

function SplitChars({ segments }: { segments: Segment[] }) {
  return (
    <span className="block">
      {segments.map((seg, si) => (
        <span
          key={si}
          className={seg.em ? 'italic text-brass' : undefined}
          style={seg.em ? { fontStyle: 'italic' } : undefined}
        >
          {Array.from(seg.t).map((ch, ci) => (
            <span key={ci} className="inline-block overflow-hidden align-bottom">
              <span className="hero-char inline-block will-change-transform">
                {ch === ' ' ? '\u00A0' : ch}
              </span>
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

export default function Hero() {
  const { categories } = useCatalog();
  const heroRef = useRef<HTMLElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const pianoColRef = useRef<HTMLDivElement>(null);
  const mouseWrapRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);
  const marqueeRef = useRef<HTMLDivElement>(null);

  // Mouse parallax (lerped via gsap.quickTo)
  useGSAP(
    () => {
      const hero = heroRef.current;
      if (!hero || !mouseWrapRef.current || !spotRef.current) return;
      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce), (hover: none), (pointer: coarse), (max-width: 767px)'
      ).matches;
      if (reduced) return;

      const pianoX = gsap.quickTo(mouseWrapRef.current, 'x', { duration: 0.9, ease: 'power3.out' });
      const pianoY = gsap.quickTo(mouseWrapRef.current, 'y', { duration: 0.9, ease: 'power3.out' });
      const spotX = gsap.quickTo(spotRef.current, 'x', { duration: 1.4, ease: 'power3.out' });
      const spotY = gsap.quickTo(spotRef.current, 'y', { duration: 1.4, ease: 'power3.out' });

      const onMove = (e: MouseEvent) => {
        const rect = hero.getBoundingClientRect();
        const nx = (e.clientX - rect.left) / rect.width - 0.5;
        const ny = (e.clientY - rect.top) / rect.height - 0.5;
        pianoX(-nx * 14);
        pianoY(-ny * 14);
        spotX(nx * rect.width * 0.06);
        spotY(ny * rect.height * 0.06);
      };
      hero.addEventListener('mousemove', onMove);
      return () => hero.removeEventListener('mousemove', onMove);
    },
    { scope: heroRef }
  );

  // Load timeline + scroll parallax
  useGSAP(
    () => {
      const reduced = window.matchMedia(
        '(prefers-reduced-motion: reduce), (hover: none), (pointer: coarse), (max-width: 767px)'
      ).matches;
      if (reduced) {
        gsap.set('.hero-char', { yPercent: 0, rotate: 0 });
        gsap.set(['.hero-word', '.hero-fade', floatRef.current, marqueeRef.current], {
          opacity: 1,
          y: 0,
          yPercent: 0,
          x: 0,
        });
        return;
      }

      const tl = gsap.timeline({ delay: 0.15, defaults: { ease: 'expo.out' } });
      tl.fromTo('.hero-eyebrow', { opacity: 0 }, { opacity: 1, duration: 0.5 })
        .fromTo(
          '.hero-char',
          { yPercent: 110, rotate: 4 },
          { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.025 },
          '-=0.2'
        )
        .fromTo(
          '.hero-word',
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.02 },
          '-=0.5'
        )
        .fromTo(
          '.hero-cta',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08 },
          '-=0.4'
        )
        .fromTo('.hero-trust', { opacity: 0 }, { opacity: 1, duration: 0.6 }, '-=0.2')
        .fromTo(
          floatRef.current,
          { x: 120, opacity: 0, rotate: 3 },
          {
            x: 0,
            opacity: 1,
            rotate: -4,
            duration: 1.2,
            onComplete: () => {
              gsap.to(floatRef.current, {
                y: 10,
                rotate: -3.4,
                duration: 3.5,
                yoyo: true,
                repeat: -1,
                ease: 'sine.inOut',
              });
            },
          },
          '-=0.9'
        )
        .fromTo('.hero-floor', { opacity: 0 }, { opacity: 1, duration: 1 }, '-=1')
        .fromTo(marqueeRef.current, { yPercent: 100 }, { yPercent: 0, duration: 0.7 }, '-=0.6');

      // Scroll parallax — content 0.35×, piano 0.2×, fade out by ~70%
      gsap.to(contentRef.current, {
        y: -160,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to(pianoColRef.current, {
        y: -90,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      });
      gsap.to([contentRef.current, pianoColRef.current], {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: '35% top', end: '70% top', scrub: true },
      });
    },
    { scope: heroRef }
  );

  const track = [...categories, ...categories];

  return (
    <section
      ref={heroRef}
      className="noise relative flex flex-col overflow-hidden bg-ink"
      style={{ minHeight: 'calc(100svh - 108px)' }}
    >
      {/* Spotlight */}
      <div
        ref={spotRef}
        aria-hidden
        className="pointer-events-none absolute"
        style={{
          zIndex: 0,
          left: '62%',
          top: '30%',
          width: '130vmax',
          height: '130vmax',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(200,164,93,0.16) 0%, transparent 55%)',
        }}
      />
      {/* CSS fallback dots when canvas/reduced motion */}
      <div aria-hidden className="dot-grid pointer-events-none absolute inset-0 opacity-30" style={{ zIndex: 0 }} />
      <ParticleField />

      {/* Content */}
      <div className="container-site relative z-10 grid flex-1 grid-cols-1 items-center gap-10 py-16 lg:grid-cols-12 lg:py-8">
        <div ref={contentRef} className="flex flex-col items-start gap-7 lg:col-span-6">
          <p className="hero-eyebrow eyebrow" style={{ opacity: 0 }}>
            Est. 1973 · Nicosia, Cyprus
          </p>
          <h1 className="display-xl text-ivory">
            {HEADLINE.map((line, i) => (
              <SplitChars key={i} segments={line} />
            ))}
          </h1>
          <p className="max-w-xl font-sans text-[clamp(1.1rem,1.6vw,1.35rem)] font-medium leading-[1.4] text-ivory-dim">
            {SUBHEAD.split(' ').map((w, i) => (
              <span key={i} className="hero-word inline-block" style={{ opacity: 0 }}>
                {w}
                {'\u00A0'}
              </span>
            ))}
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/shop" className="hero-cta btn-primary" style={{ opacity: 0 }}>
              Browse the collection
            </Link>
            <Link to="/shop?offer=1" className="hero-cta btn-secondary" style={{ opacity: 0 }}>
              <span className="animate-pulse-dot inline-block h-2 w-2 rounded-full bg-sale" />
              Explore special offers
            </Link>
          </div>
          <p className="hero-trust flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.72rem] text-ivory-faint" style={{ opacity: 0 }}>
            {['€5 home delivery', 'Free store pickup', 'Prices incl. VAT'].map((t, i) => (
              <span key={t} className="flex items-center gap-2">
                {i > 0 && <span aria-hidden>·</span>}
                <Link to="/shipping" className="underline-offset-4 transition-colors hover:text-ivory-dim hover:underline">
                  {t}
                </Link>
              </span>
            ))}
          </p>
        </div>

        {/* Piano */}
        <div ref={pianoColRef} className="relative flex items-end justify-center lg:col-span-6">
          <div ref={mouseWrapRef} className="relative">
            <div ref={floatRef} style={{ opacity: 0 }}>
              <img
                src={asset("assets/hero-piano.png")}
                alt="Young Chang upright piano"
                className="h-auto max-h-[54vh] w-auto max-w-full object-contain"
                draggable={false}
              />
            </div>
            {/* Reflection */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-full"
              style={{
                transform: 'scaleY(-1)',
                opacity: 0.12,
                maskImage: 'linear-gradient(to top, transparent 65%, black 100%)',
                WebkitMaskImage: 'linear-gradient(to top, transparent 65%, black 100%)',
              }}
            >
              <img src={asset("assets/hero-piano.png")} alt="" className="h-auto max-h-[54vh] w-auto object-contain" />
            </div>
          </div>
          {/* Floor glow */}
          <div
            aria-hidden
            className="hero-floor pointer-events-none absolute bottom-[-8%] left-1/2 -translate-x-1/2"
            style={{
              width: '120%',
              height: '26%',
              opacity: 0,
              background: 'radial-gradient(ellipse at center, rgba(200,164,93,0.08) 0%, transparent 70%)',
            }}
          />
        </div>
      </div>

      {/* Category marquee */}
      <div ref={marqueeRef} className="relative z-10 overflow-hidden border-y border-line bg-ink/60" style={{ height: 56 }}>
        <div className="animate-marquee flex h-full w-max items-center hover:[animation-play-state:paused]">
          {track.map((c, i) => (
            <Link
              key={`${c.name}-${i}`}
              to={`/shop?cat=${encodeURIComponent(c.name)}`}
              className="flex items-center whitespace-nowrap font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ivory-dim transition-colors hover:text-brass"
            >
              <span className="px-5">
                {c.name} <span className="text-ivory-faint">{c.count}</span>
              </span>
              <span aria-hidden className="text-brass">
                ✦
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
