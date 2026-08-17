import { memo } from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Perpetual pin idle-bounce (y ±4px, 2s cycle) — isolated + memoized. */
const BouncingPin = memo(function BouncingPin() {
  return (
    <motion.span
      animate={{ y: [-4, 4] }}
      transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      className="flex h-11 w-11 items-center justify-center rounded-full border border-brass/40 bg-ink text-brass transition-colors duration-300 group-hover:text-brass-bright"
    >
      <MapPin className="h-5 w-5" strokeWidth={1.5} />
    </motion.span>
  );
});

interface MapPlaceholderProps {
  href: string;
  label: string;
}

export default function MapPlaceholder({ href, label }: MapPlaceholderProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, delay: 0.2, ease: EASE }}
      className="group relative block h-[220px] overflow-hidden rounded-2xl border border-line bg-ink-2 transition-colors duration-300 hover:border-brass/40"
      aria-label={`Open map — ${label}`}
    >
      {/* Dotted grid texture */}
      <span aria-hidden className="dot-grid absolute inset-0" />

      {/* Faint brass contour arcs */}
      <svg aria-hidden className="absolute inset-0 h-full w-full" fill="none" preserveAspectRatio="xMidYMid slice" viewBox="0 0 600 220">
        <path d="M-40 220 C 120 120, 260 180, 420 90 S 620 60, 700 -20" stroke="var(--brass)" strokeOpacity="0.12" strokeWidth="1" />
        <path d="M-60 260 C 100 160, 280 220, 440 130 S 640 100, 720 20" stroke="var(--brass)" strokeOpacity="0.08" strokeWidth="1" />
        <path d="M-20 180 C 140 90, 300 140, 460 60 S 640 30, 720 -40" stroke="var(--brass)" strokeOpacity="0.06" strokeWidth="1" />
      </svg>

      <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
        <BouncingPin />
        <span className="px-4 text-center font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ivory-dim underline-offset-4 transition-colors duration-300 group-hover:text-ivory group-hover:underline">
          Map — {label}
        </span>
      </span>
    </motion.a>
  );
}
