export type SortMode = 'featured' | 'price-asc' | 'price-desc' | 'name' | 'offers';

export const SORT_OPTIONS: { value: SortMode; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low→High' },
  { value: 'price-desc', label: 'Price: High→Low' },
  { value: 'name', label: 'Name A–Z' },
  { value: 'offers', label: 'Offers first' },
];

export function parseSort(raw: string | null): SortMode {
  return SORT_OPTIONS.some((o) => o.value === raw) ? (raw as SortMode) : 'featured';
}
