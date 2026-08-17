import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, SlidersHorizontal } from 'lucide-react';
import type { Category } from '@/types';
import type { SortMode } from '@/components/shop/types';
import { SORT_OPTIONS } from '@/components/shop/types';

export interface SubCount {
  name: string;
  count: number;
}

interface FilterBarProps {
  categories: Category[];
  totalCount: number;
  activeCat: string;
  onCatChange: (cat: string) => void;
  subs: SubCount[];
  activeSub: string;
  onSubChange: (sub: string) => void;
  offersOnly: boolean;
  onToggleOffers: () => void;
  offerCount: number;
  sort: SortMode;
  onSortChange: (sort: SortMode) => void;
  hasActiveFilters: boolean;
  onClearAll: () => void;
}

function formatCount(n: number) {
  return n.toLocaleString('en-US');
}

function OffersToggle({
  offersOnly,
  onToggleOffers,
  offerCount,
}: Pick<FilterBarProps, 'offersOnly' | 'onToggleOffers' | 'offerCount'>) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={offersOnly}
      onClick={onToggleOffers}
      className="flex shrink-0 items-center gap-2.5"
    >
      <span
        className={`relative h-6 w-11 rounded-full border transition-colors duration-200 ${
          offersOnly ? 'border-sale bg-sale' : 'border-line bg-surface-2'
        }`}
      >
        <span
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full bg-ivory transition-all duration-200 ${
            offersOnly ? 'left-[22px]' : 'left-1'
          }`}
        />
      </span>
      <span className="whitespace-nowrap font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ivory-dim">
        Offers only <span className={offersOnly ? 'text-sale' : 'text-ivory-faint'}>({formatCount(offerCount)})</span>
      </span>
    </button>
  );
}

function SortDropdown({ sort, onSortChange }: Pick<FilterBarProps, 'sort' | 'onSortChange'>) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = SORT_OPTIONS.find((o) => o.value === sort) ?? SORT_OPTIONS[0];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-[0.72rem] uppercase tracking-[0.14em] transition-colors duration-200 ${
          open ? 'border-brass text-brass' : 'border-line text-ivory-dim hover:border-brass hover:text-ivory'
        }`}
      >
        Sort · {active.label}
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          strokeWidth={1.5}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            role="listbox"
            aria-label="Sort products"
            className="absolute right-0 top-full z-50 mt-2 w-52 rounded-xl border border-line bg-surface-2 p-1"
          >
            {SORT_OPTIONS.map((o) => (
              <li key={o.value}>
                <button
                  type="button"
                  role="option"
                  aria-selected={o.value === sort}
                  onClick={() => {
                    onSortChange(o.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left font-mono text-[0.72rem] uppercase tracking-[0.1em] transition-colors ${
                    o.value === sort ? 'text-brass' : 'text-ivory-dim hover:bg-surface hover:text-ivory'
                  }`}
                >
                  {o.label}
                  {o.value === sort && <Check className="h-3.5 w-3.5" strokeWidth={2} />}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubChips({
  subs,
  activeSub,
  onSubChange,
}: Pick<FilterBarProps, 'subs' | 'activeSub' | 'onSubChange'>) {
  return (
    <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
      {subs.map((s, i) => {
        const active = s.name === activeSub;
        return (
          <motion.button
            key={s.name}
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: Math.min(i * 0.02, 0.2), ease: [0.22, 1, 0.36, 1] }}
            onClick={() => onSubChange(active ? '' : s.name)}
            aria-pressed={active}
            className={`shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] transition-colors duration-200 ${
              active
                ? 'border-brass bg-brass text-ink'
                : 'border-line text-ivory-dim hover:border-brass hover:text-ivory'
            }`}
          >
            {s.name}
          </motion.button>
        );
      })}
    </div>
  );
}

function ClearAllButton({ onClearAll }: { onClearAll: () => void }) {
  return (
    <button
      type="button"
      onClick={onClearAll}
      className="shrink-0 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-sale transition-opacity hover:opacity-80"
    >
      Clear all
    </button>
  );
}

export default function FilterBar(props: FilterBarProps) {
  const {
    categories,
    totalCount,
    activeCat,
    onCatChange,
    subs,
    activeSub,
    onSubChange,
    offersOnly,
    onToggleOffers,
    offerCount,
    sort,
    onSortChange,
    hasActiveFilters,
    onClearAll,
  } = props;
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.div
      initial={{ y: '-100%' }}
      animate={{ y: '0%' }}
      transition={{ duration: 0.5, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="mobile-scroll-layer sticky top-[72px] z-40 border-b border-line bg-ink lg:bg-ink/90 lg:backdrop-blur-[12px]"
    >
      <div className="container-site">
        {/* Row 1 — category pills */}
        <div className="relative -mx-6 px-6 lg:-mx-12 lg:px-12">
          <div className="no-scrollbar flex items-center gap-2 overflow-x-auto py-3">
            <button
              type="button"
              onClick={() => onCatChange('')}
              aria-pressed={activeCat === ''}
              className={`relative shrink-0 whitespace-nowrap rounded-full border px-4 py-2 font-mono text-[0.75rem] uppercase tracking-[0.12em] transition-colors duration-200 ${
                activeCat === '' ? 'border-brass' : 'border-line hover:border-brass'
              }`}
            >
              {activeCat === '' && (
                <motion.span
                  layoutId="cat-pill-active"
                  transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
                  className="absolute inset-0 rounded-full bg-brass"
                />
              )}
              <span className={`relative z-10 ${activeCat === '' ? 'text-ink' : 'text-ivory-dim hover:text-ivory'}`}>
                All ({formatCount(totalCount)})
              </span>
            </button>
            {categories.map((c) => {
              const active = c.name === activeCat;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => onCatChange(active ? '' : c.name)}
                  aria-pressed={active}
                  className={`relative shrink-0 whitespace-nowrap rounded-full border px-4 py-2 font-mono text-[0.75rem] uppercase tracking-[0.12em] transition-colors duration-200 ${
                    active ? 'border-brass' : 'border-line hover:border-brass'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="cat-pill-active"
                      transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
                      className="absolute inset-0 rounded-full bg-brass"
                    />
                  )}
                  <span className={`relative z-10 ${active ? 'text-ink' : 'text-ivory-dim hover:text-ivory'}`}>
                    {c.name} ({formatCount(c.count)})
                  </span>
                </button>
              );
            })}
          </div>
          {/* Edge fades */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-ink to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-ink to-transparent" />
        </div>

        {/* Row 2 — desktop secondary controls */}
        <div className="hidden items-center justify-between gap-6 border-t border-line py-3 sm:flex">
          <div className="min-w-0 flex-1">
            {subs.length > 0 && <SubChips subs={subs} activeSub={activeSub} onSubChange={onSubChange} />}
          </div>
          <div className="flex shrink-0 items-center gap-5">
            <OffersToggle offersOnly={offersOnly} onToggleOffers={onToggleOffers} offerCount={offerCount} />
            <SortDropdown sort={sort} onSortChange={onSortChange} />
            {hasActiveFilters && <ClearAllButton onClearAll={onClearAll} />}
          </div>
        </div>

        {/* Row 2 — mobile "Filters" disclosure */}
        <div className="border-t border-line sm:hidden">
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            aria-expanded={mobileOpen}
            className="flex w-full items-center justify-between py-3 font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ivory-dim"
          >
            <span className="flex items-center gap-2">
              <SlidersHorizontal className="h-4 w-4 text-brass" strokeWidth={1.5} />
              Filters
              {hasActiveFilters && <span className="h-1.5 w-1.5 rounded-full bg-brass" />}
            </span>
            <ChevronDown
              className={`h-4 w-4 transition-transform duration-200 ${mobileOpen ? 'rotate-180' : ''}`}
              strokeWidth={1.5}
            />
          </button>
          <AnimatePresence initial={false}>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-4 pb-4">
                  {subs.length > 0 && (
                    <SubChips subs={subs} activeSub={activeSub} onSubChange={onSubChange} />
                  )}
                  <div className="flex items-center justify-between gap-4">
                    <OffersToggle offersOnly={offersOnly} onToggleOffers={onToggleOffers} offerCount={offerCount} />
                    {hasActiveFilters && <ClearAllButton onClearAll={onClearAll} />}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    {SORT_OPTIONS.map((o) => (
                      <button
                        key={o.value}
                        type="button"
                        onClick={() => onSortChange(o.value)}
                        aria-pressed={o.value === sort}
                        className={`rounded-full border px-3 py-1.5 font-mono text-[0.7rem] uppercase tracking-[0.1em] transition-colors duration-200 ${
                          o.value === sort
                            ? 'border-brass bg-brass text-ink'
                            : 'border-line text-ivory-dim hover:border-brass hover:text-ivory'
                        }`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
