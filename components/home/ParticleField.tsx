import { memo, useEffect, useRef } from 'react';

interface Mote {
  x: number;
  y: number;
  r: number;
  speed: number;
  wanderAmp: number;
  wanderFreq: number;
  phase: number;
  twinkleFreq: number;
  baseAlpha: number;
}

/** Lightweight gold-dust particle field — ~70 motes, upward drift, paused off-screen. */
const ParticleField = memo(function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let running = false;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const motes: Mote[] = Array.from({ length: 70 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.5 + Math.random() * 1.5,
      speed: 1 / (12 + Math.random() * 16), // 12–28s full traverse
      wanderAmp: 6 + Math.random() * 14,
      wanderFreq: 0.3 + Math.random() * 0.7,
      phase: Math.random() * Math.PI * 2,
      twinkleFreq: 0.5 + Math.random() * 1.2,
      baseAlpha: 0.25 + Math.random() * 0.45,
    }));

    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const t = now / 1000;
      ctx.clearRect(0, 0, width, height);
      for (const m of motes) {
        m.y -= m.speed * dt;
        if (m.y < -0.02) {
          m.y = 1.02;
          m.x = Math.random();
        }
        const x = m.x * width + Math.sin(t * m.wanderFreq + m.phase) * m.wanderAmp;
        const alpha = m.baseAlpha * (0.6 + 0.4 * Math.sin(t * m.twinkleFreq + m.phase));
        ctx.beginPath();
        ctx.arc(x, m.y * height, m.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230,198,133,${alpha.toFixed(3)})`;
        ctx.fill();
      }
      if (running) raf = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          running = true;
          last = performance.now();
          raf = requestAnimationFrame(tick);
        } else if (!entry.isIntersecting && running) {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { threshold: 0.05 }
    );
    io.observe(canvas);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 1 }}
    />
  );
});

export default ParticleField;
