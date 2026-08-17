import { createContext, useContext, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Category, Product } from '@/types';
// The catalog is bundled directly into the app (no runtime fetch) so it works
// in every serving environment — root or sub-path, with or without SPA fallback.
import catalogJson from '@/data/catalog.json';

export type { Category, Product } from '@/types';

interface CatalogState {
  products: Product[];
  categories: Category[];
  loading: boolean;
  error: string | null;
  /** O(1) lookup by product id */
  byId: Map<number, Product>;
}

const data = catalogJson as unknown as { products: Product[]; categories: Category[] };

const CatalogContext = createContext<CatalogState>({
  products: data.products,
  categories: data.categories,
  loading: false,
  error: null,
  byId: new Map(data.products.map((p) => [p.id, p])),
});

export function CatalogProvider({ children }: { children: ReactNode }) {
  const value = useMemo<CatalogState>(
    () => ({
      products: data.products,
      categories: data.categories,
      loading: false,
      error: null,
      byId: new Map(data.products.map((p) => [p.id, p])),
    }),
    []
  );

  return <CatalogContext.Provider value={value}>{children}</CatalogContext.Provider>;
}

export function useCatalog() {
  return useContext(CatalogContext);
}
