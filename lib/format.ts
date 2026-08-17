const eur = new Intl.NumberFormat('en-CY', {
  style: 'currency',
  currency: 'EUR',
});

export function formatEUR(value: number): string {
  return eur.format(value);
}

/** Discount percentage from old/price. Returns null when not an offer. */
export function discountPct(price: number, old: number | null): number | null {
  if (!old || old <= price) return null;
  return Math.round(((old - price) / old) * 100);
}
