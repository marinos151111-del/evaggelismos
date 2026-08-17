import { STORES } from '@/lib/stores';
import StoresHero from '@/components/stores/StoresHero';
import StoreBlock from '@/components/stores/StoreBlock';
import type { StoreMeta } from '@/components/stores/StoreBlock';
import PickupBand from '@/components/stores/PickupBand';

const STORE_META: Record<string, StoreMeta> = {
  Nicosia: {
    eyebrow: 'Store 01 — Flagship',
    blurb:
      'Our three-storey central store on Kennedy Avenue — the heart of Evangelismos since the 1997 consolidation.',
    fax: '+35722672424',
    faxDisplay: '+357 22672424',
  },
  Larnaca: {
    eyebrow: 'Store 02',
    blurb: 'Serving Larnaca musicians since 1996.',
  },
  Limassol: {
    eyebrow: 'Store 03',
    blurb: 'Our coastal home since 1997, on Nikou Pattichi.',
  },
};

export default function Stores() {
  return (
    <>
      <StoresHero />
      <div className="pb-16">
        {STORES.map((store, i) => (
          <StoreBlock key={store.city} store={store} meta={STORE_META[store.city]} index={i} />
        ))}
      </div>
      <PickupBand />
    </>
  );
}
