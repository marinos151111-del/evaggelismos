import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router';

const SUGGESTIONS = [
  'guitars',
  'pianos under €3,000',
  'microphones on sale',
  'cheap drum sticks',
  'dj controllers',
  'violin strings',
];

interface AiSearchBarProps {
  compact?: boolean;
  autoFocus?: boolean;
  onSubmitted?: () => void;
}

/** Conversational AI search input — understands natural language & typos. */
export default function AiSearchBar({ compact = false, autoFocus = false, onSubmitted }: AiSearchBarProps) {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const [sugIdx, setSugIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const id = window.setInterval(() => setSugIdx((i) => (i + 1) % SUGGESTIONS.length), 3200);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    const q = value.trim();
    if (!q) return;
    navigate(`/shop?ai=${encodeURIComponent(q)}`);
    setValue('');
    setFocused(false);
    inputRef.current?.blur();
    onSubmitted?.();
  };

  return (
    <div className={`relative ${compact ? 'w-full' : 'hidden w-[280px] md:block xl:w-[320px]'}`}>
      <form
        onSubmit={submit}
        className={`group flex items-center gap-2.5 rounded-full border transition-all duration-300 ${
          focused
            ? 'border-brass/60 bg-ivory/[0.08] shadow-[0_0_0_4px_rgba(200,164,93,0.10)]'
            : 'border-line bg-ivory/[0.05] hover:border-ivory/30'
        } ${compact ? 'px-4 py-3' : 'px-4 py-2'}`}
      >
        <Sparkles
          className={`h-4 w-4 shrink-0 transition-colors ${focused ? 'text-brass' : 'text-ivory-dim group-hover:text-brass'}`}
          strokeWidth={1.5}
        />
        <div className="relative min-w-0 flex-1">
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            aria-label="Ask AI to find products"
            className="w-full bg-transparent font-sans text-[13px] tracking-[0.02em] text-ivory outline-none placeholder:text-transparent"
            placeholder=""
          />
          {!value && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex w-full items-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={sugIdx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="truncate font-sans text-[13px] text-ivory-faint"
                >
                  Ask AI: “{SUGGESTIONS[sugIdx]}”
                </motion.span>
              </AnimatePresence>
            </div>
          )}
        </div>
        <AnimatePresence>
          {value.trim() && (
            <motion.button
              initial={{ opacity: 0, scale: 0.7 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.7 }}
              transition={{ duration: 0.18 }}
              type="submit"
              aria-label="Search"
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brass text-ink transition-transform hover:scale-110"
            >
              <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.2} />
            </motion.button>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
