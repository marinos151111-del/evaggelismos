import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Music } from 'lucide-react';
import type { Product } from '@/types';
import ProductCard from '@/components/ProductCard';

interface ProductGridProps {
  products: Product[];
  visible: number;
  onLoadMore: () => void;
  /** changes on filter/search/offer change — remounts grid so reveals re-run */
  gridKey: string;
  onOpen: (product: Product) => void;
  onClearAll: () => void;
}

export default function ProductGrid({
  products,
  visible,
  onLoadMore,
  gridKey,
  onOpen,
  onClearAll,
}: ProductGridProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const shown = products.slice(0, visible);
  const remaining = products.length - shown.length;

  // Auto-load next batch when the sentinel enters the viewport
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || remaining <= 0) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) onLoadMore();
      },
      { rootMargin: '600px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [remaining, visible, onLoadMore]);

  if (products.length === 0) {
    return (
      <motion.div
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="flex flex-col items-center gap-4 py-32 text-center"
      >
        <Music className="h-24 w-24 text-ivory/10" strokeWidth={1} />
        <h2 className="font-serif text-[1.6rem] font-medium text-ivory">Nothing in this key.</h2>
        <p className="max-w-sm text-ivory-dim">Try a different search or clear the filters.</p>
        <button type="button" onClick={onClearAll} className="btn-secondary mt-2">
          Clear all filters
        </button>
      </motion.div>
    );
  }

  return (
    <>
      <div
        key={gridKey}
        className="grid gap-6"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}
      >
        {shown.map((p, i) => (
          // content-visibility lets the browser skip rendering off-screen cards —
          // essential for keeping 2,746 cards in the DOM without freezing scroll.
          <div
            key={p.id}
            style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 420px' }}
          >
            <ProductCard product={p} onOpen={onOpen} index={i % 12} />
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-12 flex flex-col items-center gap-4">
          <div ref={sentinelRef} aria-hidden className="h-px w-full" />
          <button type="button" onClick={onLoadMore} className="btn-secondary font-mono text-sm">
            Load {Math.min(48, remaining)} more — {remaining.toLocaleString('en-US')} remaining
          </button>
        </div>
      )}
    </>
  );
}
