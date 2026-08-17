import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface StorePhotoProps {
  img: string;
  city: string;
}

/**
 * Photo panel — GSAP-only component (clip-path reveal + inner parallax scrub).
 * Kept free of Framer Motion to respect the library-isolation rule.
 */
export default function StorePhoto({ img, city }: StorePhotoProps) {
  const frameRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set(frameRef.current, { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1 });
        gsap.set('.store-photo-img', { y: 0 });
        return;
      }

      gsap.fromTo(
        frameRef.current,
        { clipPath: 'inset(8% 8% 8% 8%)', opacity: 0 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 1,
          ease: 'power2.out',
          scrollTrigger: { trigger: frameRef.current, start: 'top 80%', once: true },
        }
      );

      gsap.fromTo(
        '.store-photo-img',
        { y: -24 },
        {
          y: 24,
          ease: 'none',
          scrollTrigger: {
            trigger: frameRef.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        }
      );
    },
    { scope: frameRef }
  );

  return (
    <div className="relative">
      {/* Brass corner accent (top-left L-shape, 40px arms) */}
      <span aria-hidden className="absolute -left-3 -top-3 z-10 h-10 w-10 border-l-2 border-t-2 border-brass" />

      <div ref={frameRef} className="relative aspect-[4/3] overflow-hidden rounded-[20px] border border-line bg-ink-2">
        <img
          src={img}
          alt={`Evangelismos Music Stores — ${city} storefront`}
          loading="lazy"
          className="store-photo-img h-full w-full scale-[1.1] object-cover will-change-transform"
        />
      </div>
    </div>
  );
}
