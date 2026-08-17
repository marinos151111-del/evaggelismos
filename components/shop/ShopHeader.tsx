import { AnimatePresence, motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import type { RefObject } from 'react';

interface ShopHeaderProps {
  resultLine: string;
  query: string;
  onQueryChange: (value: string) => void;
  onClearQuery: () => void;
  placeholder: string;
  inputRef: RefObject<HTMLInputElement | null>;
}

const TITLE_PLAIN = ['Every', 'instrument.'];
const TITLE_ACCENT = ['One', 'room.'];

function AnimatedWord({ word, index, accent }: { word: string; index: number; accent?: boolean }) {
  return (
    <span className="inline-block overflow-hidden pb-[0.08em] align-bottom">
      <motion.span
        initial={{ y: 18, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 + index * 0.03, ease: [0.22, 1, 0.36, 1] }}
        className={`inline-block ${accent ? 'italic text-brass' : ''}`}
      >
        {word}
      </motion.span>
    </span>
  );
}

export default function ShopHeader({
  resultLine,
  query,
  onQueryChange,
  onClearQuery,
  placeholder,
  inputRef,
}: ShopHeaderProps) {
  return (
    <section className="border-b border-line bg-ink-2 pb-12 pt-24">
      <div className="container-site flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="eyebrow"
          >
            The Catalog
          </motion.p>
          <h1 className="display-m mt-4 text-ivory">
            {TITLE_PLAIN.map((w, i) => (
              <AnimatedWord key={w} word={w} index={i} />
            ))}{' '}
            {TITLE_ACCENT.map((w, i) => (
              <AnimatedWord key={w} word={w} index={TITLE_PLAIN.length + i} accent />
            ))}
          </h1>

          {/* Live results line — crossfades on change */}
          <div className="mt-4 min-h-5">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={resultLine}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
                className="font-mono text-xs text-ivory-dim"
                aria-live="polite"
              >
                {resultLine}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[480px] shrink-0"
        >
          <div className="relative">
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-ivory-faint"
              strokeWidth={1.5}
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder={placeholder}
              aria-label="Search the catalog"
              className="w-full rounded-full border border-line bg-surface-2 py-3.5 pl-11 pr-11 font-mono text-sm text-ivory placeholder:text-ivory-faint focus:border-brass focus:outline-none"
            />
            {query && (
              <button
                type="button"
                onClick={onClearQuery}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ivory-faint transition-colors hover:bg-surface hover:text-ivory"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
