import { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import type { Product } from '@/types';
import { useCatalog } from '@/context/CatalogContext';
import ProductCard from '@/components/ProductCard';
import SectionHeader from '@/components/home/SectionHeader';
import { discountPct } from '@/lib/format';

interface OffersRailProps {
  onOpen: (product: Product) => void;
}

export default function OffersRail({ onOpen }: OffersRailProps) {
  const { products } = useCatalog();
  const railRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const offers = useMemo(
    () =>
      products
        .filter((p) => p.offer && p.img)
        .sort(
          (a, b) =>
            (discountPct(b.price, b.old) ?? 0) - (discountPct(a.price, a.old) ?? 0) ||
            (b.price ?? 0) - (a.price ?? 0)
        )
        .slice(0, 12),
    [products]
  );

  const update = () => {
    const el = railRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft >= max - 4);
  };

  useEffect(() => {
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, [offers.length]);

  const scrollBy = (dir: 1 | -1) => {
    railRef.current?.scrollBy({ left: dir * 660, behavior: 'smooth' });
  };

  // Pointer drag-to-scroll (desktop)
  const dragState = useRef<{ down: boolean; startX: number; startLeft: number; moved: boolean }>({
    down: false,
    startX: 0,
    startLeft: 0,
    moved: false,
  });

  const onPointerDown = (e: React.PointerEvent) => {
    const el = railRef.current;
    if (!el || e.pointerType === 'touch') return;
    dragState.current = { down: true, startX: e.clientX, startLeft: el.scrollLeft, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const el = railRef.current;
    if (!el || !dragState.current.down) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 6) dragState.current.moved = true;
    if (dragState.current.moved) el.scrollLeft = dragState.current.startLeft - dx;
  };
  const endDrag = () => {
    dragState.current.down = false;
  };

  return (
    <section className="border-y border-line bg-ink-2 py-24 lg:py-32">
      <div className="container-site">
        <SectionHeader
          eyebrow="02 — Special Offers"
          dotColor="var(--sale)"
          title={
            <>
              Prices worth <em className="italic text-brass">hearing</em>
            </>
          }
          linkTo="/shop?offer=1"
          linkLabel="View all 694 offers →"
        />
      </div>

      <div className="container-site">
        <div
          ref={railRef}
          onScroll={update}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          data-lenis-prevent
          className="no-scrollbar flex cursor-grab gap-4 overflow-x-auto pb-2 active:cursor-grabbing"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {offers.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: 60 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="w-[280px] shrink-0 sm:w-[300px]"
              style={{ scrollSnapAlign: 'start' }}
              onClickCapture={(e) => {
                if (dragState.current.moved) {
                  e.stopPropagation();
                  e.preventDefault();
                  dragState.current.moved = false;
                }
              }}
            >
              <ProductCard product={p} onOpen={onOpen} index={i} />
            </motion.div>
          ))}
        </div>

        {/* Chrome: arrows + progress */}
        <div className="mt-8 flex items-center gap-6">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => scrollBy(-1)}
              disabled={atStart}
              aria-label="Scroll offers left"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ivory transition-all duration-300 hover:border-brass hover:text-brass disabled:opacity-40"
            >
              <ArrowLeft className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => scrollBy(1)}
              disabled={atEnd}
              aria-label="Scroll offers right"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ivory transition-all duration-300 hover:border-brass hover:text-brass disabled:opacity-40"
            >
              <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
            </button>
          </div>
          <div className="h-0.5 flex-1 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-brass transition-[width] duration-150"
              style={{ width: `${Math.max(progress * 100, 4)}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
