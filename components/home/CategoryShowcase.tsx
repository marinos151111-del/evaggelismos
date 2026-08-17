import { useMemo, useRef } from 'react';
import { useNavigate } from 'react-router';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';
import { useCatalog } from '@/context/CatalogContext';
import SectionHeader from '@/components/home/SectionHeader';
import { asset } from "@/lib/asset";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Nicer display names for the 14 real catalog categories. */
const DISPLAY: Record<string, string> = {
  'Percussion Instruments': 'Percussion',
  'String Instruments & Accesories': 'String Instruments',
  'Audio Equipment & Accessories': 'Audio Equipment',
  'Wind Instruments & Acceessories': 'Wind Instruments',
  'Stands': 'Stands & Supports',
  'Keyboards-Pianos': 'Keyboards & Pianos',
  'Accessories': 'Accessories',
  'Amplifiers for BT &  Instruments': 'Amplifiers',
  'Sonic Energy': 'Sonic Energy',
  'Stock Clearance': 'Stock Clearance',
  'Hearing Protection': 'Hearing Protection',
  'Drum Set': 'Drum Sets',
  'Upright Pianos': 'Upright Pianos',
  'Music Books & Games': 'Music Books & Games',
};

/** Hidden from the home showcase (still browsable in the shop) — keeps the
 *  grid symmetric: 12 tiles = 4×3 on xl, 3×4 on md, 2×6 on mobile. */
const EXCLUDE = new Set(['Stock Clearance', 'Hearing Protection']);

interface Tile {
  catName: string;
  display: string;
  count: number;
  img: string | null;
}

export default function CategoryShowcase() {
  const { categories, products } = useCatalog();
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLElement>(null);

  const tiles = useMemo<Tile[]>(() => {
    return categories.filter((cat) => !EXCLUDE.has(cat.name)).map((cat) => {
      // Representative image: the flagship (highest-priced) product that has one —
      // real instruments, not cables/connectors.
      const flagship = products
        .filter((p) => p.cat === cat.name && p.img && p.price !== null)
        .sort((a, b) => (b.price ?? 0) - (a.price ?? 0))[0];
      return {
        catName: cat.name,
        display: DISPLAY[cat.name] ?? cat.name,
        count: cat.count,
        img: flagship ? asset(flagship.img) : null,
      };
    });
  }, [categories, products]);

  useGSAP(
    () => {
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        gsap.set('.cat-tile', { opacity: 1, y: 0 });
        return;
      }
      gsap.fromTo(
        '.cat-tile',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'expo.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', once: true },
        }
      );
    },
    { scope: sectionRef, dependencies: [tiles.length] }
  );

  return (
    <section ref={sectionRef} className="py-24 lg:py-32">
      <div className="container-site">
        <SectionHeader
          eyebrow="01 — Catalog"
          title={
            <>
              Twelve worlds of <em className="italic text-brass">music</em>
            </>
          }
          linkTo="/shop"
          linkLabel="Browse all 2,746 →"
        />

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {tiles.map((t) => (
            <button
              key={t.catName}
              type="button"
              onClick={() => navigate(`/shop?cat=${encodeURIComponent(t.catName)}`)}
              className="cat-tile group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface text-left transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(200,164,93,0.45)]"
              style={{ opacity: 0 }}
            >
              {/* Ivory product tile — image fully contained inside */}
              <span className="relative block aspect-[4/3] overflow-hidden bg-[#EDE8DD]">
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(255,255,255,0.95),rgba(255,255,255,0)_62%)]"
                />
                {t.img ? (
                  <img
                    src={t.img}
                    alt={t.display}
                    loading="lazy"
                    className="relative h-full w-full object-contain p-6 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.07]"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center font-serif text-4xl text-ink/20">
                    {t.display.charAt(0)}
                  </span>
                )}
              </span>

              {/* Label row */}
              <span className="flex flex-1 items-center justify-between gap-3 p-4 lg:p-5">
                <span className="flex min-w-0 flex-col gap-1.5">
                  <span className="truncate font-serif text-[1.05rem] font-medium leading-tight text-ivory lg:text-[1.2rem]">
                    {t.display}
                  </span>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-ivory-faint">
                    {t.count} products
                  </span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line text-ivory-dim transition-all duration-300 group-hover:border-brass group-hover:bg-brass group-hover:text-ink">
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.5} />
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
