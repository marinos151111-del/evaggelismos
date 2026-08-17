import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router';
import type { Product } from '@/types';
import { useCatalog } from '@/context/CatalogContext';
import ProductDetailModal from '@/components/ProductDetailModal';
import ShopHeader from '@/components/shop/ShopHeader';
import FilterBar from '@/components/shop/FilterBar';
import type { SubCount } from '@/components/shop/FilterBar';
import ProductGrid from '@/components/shop/ProductGrid';
import ReassuranceStrip from '@/components/shop/ReassuranceStrip';
import AiAnswerBanner from '@/components/shop/AiAnswerBanner';
import type { SortMode } from '@/components/shop/types';
import { parseSort } from '@/components/shop/types';
import { getLenis } from '@/lib/lenis';
import { aiSearch } from '@/lib/aiSearch';

const BATCH = 48;

function matchesTerms(p: Product, terms: string[]): boolean {
  if (terms.length === 0) return true;
  const hay = `${p.name} ${p.cat} ${p.sub}`.toLowerCase();
  return terms.every((t) => hay.includes(t));
}

function applySort(list: Product[], sort: SortMode): Product[] {
  if (sort === 'featured') return list;
  const sorted = [...list];
  switch (sort) {
    case 'price-asc':
      sorted.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      sorted.sort((a, b) => b.price - a.price);
      break;
    case 'name':
      sorted.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'offers':
      sorted.sort((a, b) => Number(b.offer) - Number(a.offer));
      break;
  }
  return sorted;
}

export default function Shop() {
  const { products, categories, loading, error, byId } = useCatalog();
  const [searchParams, setSearchParams] = useSearchParams();

  const cat = searchParams.get('cat') ?? '';
  const sub = searchParams.get('sub') ?? '';
  const q = searchParams.get('q') ?? '';
  const aiQuery = searchParams.get('ai') ?? '';
  const offersOnly = searchParams.get('offer') === '1';
  const sort = parseSort(searchParams.get('sort'));
  const productParam = searchParams.get('product');
  const focusParam = searchParams.get('focus');

  const [searchInput, setSearchInput] = useState(q);
  const [visible, setVisible] = useState(BATCH);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const gridTopRef = useRef<HTMLDivElement | null>(null);
  const firstFilterRun = useRef(true);

  useEffect(() => {
    document.title = 'Shop — Evangelismos Music Stores';
  }, []);

  const updateParams = useCallback(
    (updates: Record<string, string | null>, replace = false) => {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev);
          for (const [key, value] of Object.entries(updates)) {
            if (value === null || value === '') next.delete(key);
            else next.set(key, value);
          }
          return next;
        },
        { replace }
      );
    },
    [setSearchParams]
  );

  // Keep local input in sync when ?q= changes externally (clear all, history nav)
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  // Debounced search → URL (150ms)
  useEffect(() => {
    if (searchInput === q) return;
    const t = window.setTimeout(() => {
      updateParams({ q: searchInput.trim() ? searchInput : null }, true);
    }, 150);
    return () => window.clearTimeout(t);
  }, [searchInput, q, updateParams]);

  // Focus search when arriving via navbar search icon (?focus=search)
  useEffect(() => {
    if (focusParam === 'search') {
      searchRef.current?.focus();
      updateParams({ focus: null }, true);
    }
  }, [focusParam, updateParams]);

  const terms = useMemo(() => q.trim().toLowerCase().split(/\s+/).filter(Boolean), [q]);

  // AI natural-language search (active when ?ai= is present) — typo-tolerant,
  // understands synonyms, price intent and offer intent.
  const ai = useMemo(
    () => (aiQuery.trim() ? aiSearch(products, aiQuery) : null),
    [products, aiQuery]
  );

  // Filtered + sorted catalog (memoized over 2,746 items)
  const filtered = useMemo(() => {
    if (ai) return applySort(ai.results, sort); // AI mode: relevance-ranked base list
    let list = products;
    if (cat) list = list.filter((p) => p.cat === cat);
    if (sub) list = list.filter((p) => p.sub === sub);
    if (terms.length) list = list.filter((p) => matchesTerms(p, terms));
    if (offersOnly) list = list.filter((p) => p.offer);
    return applySort(list, sort);
  }, [ai, products, cat, sub, terms, offersOnly, sort]);

  // Subcategories dependent on the active category
  const subs = useMemo<SubCount[]>(() => {
    if (!cat) return [];
    const counts = new Map<string, number>();
    for (const p of products) {
      if (p.cat === cat && p.sub) counts.set(p.sub, (counts.get(p.sub) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [products, cat]);

  // Live offer count for the toggle (ignores the offer toggle itself)
  const offerCount = useMemo(() => {
    let n = 0;
    for (const p of products) {
      if (cat && p.cat !== cat) continue;
      if (sub && p.sub !== sub) continue;
      if (!matchesTerms(p, terms)) continue;
      if (p.offer) n++;
    }
    return n;
  }, [products, cat, sub, terms]);

  const resultLine = useMemo(() => {
    const n = filtered.length.toLocaleString('en-US');
    if (ai) return `AI search · ${n} result${filtered.length === 1 ? '' : 's'}`;
    const active = cat || sub || q.trim() || offersOnly;
    if (!active) return `Showing ${n} products`;
    let line = `${n} result${filtered.length === 1 ? '' : 's'}`;
    if (q.trim()) line += ` for “${q.trim()}”`;
    if (cat) line += ` in ${cat}`;
    if (sub) line += ` · ${sub}`;
    if (offersOnly) line += ' · offers only';
    return line;
  }, [filtered.length, ai, cat, sub, q, offersOnly]);

  const hasActiveFilters = Boolean(cat || sub || q.trim() || aiQuery || offersOnly || sort !== 'featured');

  // Reset batch + scroll grid into view on any filter/search/sort change
  const filterKey = `${cat}|${sub}|${q}|${aiQuery}|${offersOnly ? '1' : '0'}`;
  useEffect(() => {
    setVisible(BATCH);
    if (firstFilterRun.current) {
      firstFilterRun.current = false;
      return;
    }
    const el = gridTopRef.current;
    if (!el) return;
    const lenis = getLenis();
    if (lenis) lenis.scrollTo(el, { offset: -150, duration: 0.6 });
    else el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [filterKey, sort]);

  // Deep-linked product modal (?product=<id>)
  const modalProduct = productParam ? byId.get(Number(productParam)) ?? null : null;
  useEffect(() => {
    if (!loading && productParam && !byId.has(Number(productParam))) {
      updateParams({ product: null }, true);
    }
  }, [loading, productParam, byId, updateParams]);

  const handleCatChange = useCallback(
    (c: string) => updateParams({ cat: c || null, sub: null }),
    [updateParams]
  );
  const handleSubChange = useCallback((s: string) => updateParams({ sub: s || null }), [updateParams]);
  const handleToggleOffers = useCallback(
    () => updateParams({ offer: offersOnly ? null : '1' }),
    [updateParams, offersOnly]
  );
  const handleSortChange = useCallback(
    (s: SortMode) => updateParams({ sort: s === 'featured' ? null : s }),
    [updateParams]
  );
  const clearAll = useCallback(
    () => updateParams({ cat: null, sub: null, q: null, ai: null, offer: null, sort: null }),
    [updateParams]
  );
  const exitAi = useCallback(() => updateParams({ ai: null }), [updateParams]);
  // Typing in the classic search box while AI mode is active exits AI mode
  const handleQueryChange = useCallback(
    (v: string) => {
      if (aiQuery) updateParams({ ai: null }, true);
      setSearchInput(v);
    },
    [aiQuery, updateParams]
  );
  const clearQuery = useCallback(() => setSearchInput(''), []);
  const openProduct = useCallback((p: Product) => updateParams({ product: String(p.id) }), [updateParams]);
  const closeProduct = useCallback(() => updateParams({ product: null }), [updateParams]);
  const loadMore = useCallback(() => setVisible((v) => v + BATCH), []);

  return (
    <div>
      <ShopHeader
        resultLine={loading ? 'Loading catalog…' : resultLine}
        query={searchInput}
        onQueryChange={handleQueryChange}
        onClearQuery={clearQuery}
        placeholder={`Search ${products.length.toLocaleString('en-US') || '2,746'} products — try “violin”, “cymbal”, “cable”…`}
        inputRef={searchRef}
      />

      {ai ? (
        <div className="container-site pt-10">
          <AiAnswerBanner
            query={aiQuery}
            interpretation={ai.interpretation}
            resultCount={filtered.length}
            onExit={exitAi}
          />
        </div>
      ) : (
        <FilterBar
          categories={categories}
          totalCount={products.length}
          activeCat={cat}
          onCatChange={handleCatChange}
          subs={subs}
          activeSub={sub}
          onSubChange={handleSubChange}
          offersOnly={offersOnly}
          onToggleOffers={handleToggleOffers}
          offerCount={offerCount}
          sort={sort}
          onSortChange={handleSortChange}
          hasActiveFilters={hasActiveFilters}
          onClearAll={clearAll}
        />
      )}

      <section className="container-site pb-32 pt-12">
        <div ref={gridTopRef} className="scroll-mt-40" />
        {loading ? (
          <div
            className="grid gap-6"
            style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}
          >
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl border border-line bg-surface"
              />
            ))}
          </div>
        ) : error ? (
          <div className="py-32 text-center">
            <h2 className="font-serif text-[1.6rem] font-medium text-ivory">The catalog could not be loaded.</h2>
            <p className="mt-3 text-ivory-dim">{error}</p>
          </div>
        ) : (
          <ProductGrid
            products={filtered}
            visible={visible}
            onLoadMore={loadMore}
            gridKey={filterKey}
            onOpen={openProduct}
            onClearAll={clearAll}
          />
        )}
      </section>

      <ReassuranceStrip />

      <ProductDetailModal product={modalProduct} onClose={closeProduct} />
    </div>
  );
}
