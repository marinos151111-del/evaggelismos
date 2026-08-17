import { motion } from 'framer-motion';
import { Sparkles, X } from 'lucide-react';
import type { AiInterpretation } from '@/lib/aiSearch';

interface AiAnswerBannerProps {
  query: string;
  interpretation: AiInterpretation;
  resultCount: number;
  onExit: () => void;
}

/** Assistant-style answer card shown above the grid while AI search is active. */
export default function AiAnswerBanner({ query, interpretation, resultCount, onExit }: AiAnswerBannerProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl border border-brass/25 bg-surface p-6 md:p-8"
    >
      {/* ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full opacity-25 blur-3xl"
        style={{ background: 'radial-gradient(circle, var(--brass) 0%, transparent 70%)' }}
      />

      <div className="relative flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-brass/40 bg-brass/10">
          <Sparkles className="h-5 w-5 text-brass" strokeWidth={1.5} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-brass">
            AI catalog assistant
          </p>
          <h2 className="mt-2 font-serif text-[1.35rem] leading-snug text-ivory md:text-[1.6rem]">
            “{query}”
          </h2>
          <p className="mt-2 max-w-2xl font-sans text-[0.95rem] leading-relaxed text-ivory-dim">
            {interpretation.answer}
          </p>

          {(interpretation.chips.length > 0 || resultCount > 0) && (
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {interpretation.chips.map((chip) => (
                <span
                  key={chip}
                  className="rounded-full border border-line bg-ink-2 px-3.5 py-1.5 font-mono text-[0.72rem] tracking-[0.04em] text-ivory-dim"
                >
                  {chip}
                </span>
              ))}
              <span className="rounded-full border border-brass/40 bg-brass/10 px-3.5 py-1.5 font-mono text-[0.72rem] tracking-[0.04em] text-brass">
                {resultCount.toLocaleString('en-US')} result{resultCount === 1 ? '' : 's'}
              </span>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onExit}
          aria-label="Exit AI search"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ivory-dim transition-colors hover:bg-surface-2 hover:text-ivory"
        >
          <X className="h-4 w-4" strokeWidth={1.5} />
        </button>
      </div>

      <button
        type="button"
        onClick={onExit}
        className="relative mt-5 font-mono text-[0.72rem] uppercase tracking-[0.18em] text-ivory-faint underline-offset-4 transition-colors hover:text-brass hover:underline"
      >
        ← Back to the full catalog
      </button>
    </motion.div>
  );
}
