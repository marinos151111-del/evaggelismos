import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Music, Plus } from 'lucide-react';
import type { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/components/Toast';
import { discountPct, formatEUR } from '@/lib/format';
import { asset } from "@/lib/asset";

interface ProductCardProps {
  product: Product;
  onOpen?: (product: Product) => void;
  /** stagger index for entrance animation */
  index?: number;
}

function ProductCard({ product, onOpen, index = 0 }: ProductCardProps) {
  const { add } = useCart();
  const { push } = useToast();
  const [imgError, setImgError] = useState(false);
  const [added, setAdded] = useState(false);
  const pct = discountPct(product.price, product.old);

  const quickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    add(product.id);
    push(`Added — ${product.name}`);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1200);
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.5, delay: (index % 4) * 0.04, ease: [0.22, 1, 0.36, 1] }}
      onClick={() => onOpen?.(product)}
      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(200,164,93,0.45)]"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-[#EDE8DD]">
        <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.95),rgba(255,255,255,0)_62%)]" />
        {(!product.img || imgError) ? (
          <div className="flex h-full w-full items-center justify-center">
            <Music className="h-10 w-10 text-ivory-faint" strokeWidth={1.5} />
          </div>
        ) : (
          <img
            src={asset(product.img)}
            alt={product.name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="relative h-full w-full object-contain p-7 mix-blend-multiply transition-transform duration-500 ease-out group-hover:scale-[1.07]"
          />
        )}
        {pct !== null ? (
          <span className="absolute left-3 top-3 rounded-md bg-sale px-2 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ivory">
            Offer −{pct}%
          </span>
        ) : (
          product.offer && (
            <span className="absolute left-3 top-3 rounded-md bg-sale px-2 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ivory">
              Special Offer
            </span>
          )
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-4">
        <p className="truncate font-mono text-[0.68rem] uppercase tracking-[0.14em] text-ivory-faint">
          {product.cat}
          {product.sub ? ` · ${product.sub}` : ''}
        </p>
        <h3 className="line-clamp-2 min-h-[2.6em] font-sans text-[0.95rem] font-medium leading-snug text-ivory">
          {product.name}
        </h3>
        <div className="mt-auto flex items-baseline gap-2 pt-1">
          <span className="font-mono text-[1.05rem] font-semibold text-ivory">
            {formatEUR(product.price)}
          </span>
          {product.offer && product.old !== null && (
            <span className="font-mono text-[0.85rem] text-sale line-through">
              {formatEUR(product.old)}
            </span>
          )}
        </div>

        {/* Quick add */}
        <button
          type="button"
          onClick={quickAdd}
          aria-label={`Quick add ${product.name} to cart`}
          className={`mt-3 flex items-center justify-center gap-2 rounded-full border py-2 font-sans text-[0.8rem] font-medium transition-all duration-300 lg:opacity-0 lg:group-hover:opacity-100 ${
            added
              ? 'border-ok bg-ok/10 text-ok'
              : 'border-line text-ivory-dim hover:border-brass hover:bg-brass hover:text-ink'
          }`}
        >
          {added ? (
            <Check className="h-3.5 w-3.5" strokeWidth={2} />
          ) : (
            <Plus className="h-3.5 w-3.5" strokeWidth={2} />
          )}
          {added ? 'Added' : 'Quick add'}
        </button>
      </div>
    </motion.article>
  );
}

export default memo(ProductCard);
