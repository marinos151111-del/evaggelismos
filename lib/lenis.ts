import Lenis from 'lenis';

/**
 * Module-level Lenis singleton. Layout initializes it once; any overlay
 * (modal, drawer, menu) can pause/resume smooth scrolling.
 */
let lenis: Lenis | null = null;
let rafId = 0;

export function initLenis(): Lenis | null {
  if (lenis) return lenis;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touchDevice = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const mobileViewport = window.matchMedia('(max-width: 767px)').matches;
  // Native touch scrolling is both faster and more stable on mobile Safari/Chrome.
  // Running Lenis' permanent RAF alongside fixed blurred layers can make the
  // compositor repaint the entire viewport and visibly flash while scrolling.
  if (reduced || touchDevice || mobileViewport) return null;
  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 1.0 });
  const raf = (time: number) => {
    lenis?.raf(time);
    rafId = requestAnimationFrame(raf);
  };
  rafId = requestAnimationFrame(raf);
  return lenis;
}

export function destroyLenis() {
  cancelAnimationFrame(rafId);
  lenis?.destroy();
  lenis = null;
}

export function stopLenis() {
  lenis?.stop();
}

export function startLenis() {
  lenis?.start();
}

export function getLenis() {
  return lenis;
}
