import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { MapPin, Phone, Printer } from 'lucide-react';
import type { StoreInfo } from '@/lib/stores';
import { mapsUrl } from '@/lib/stores';
import StorePhoto from '@/components/stores/StorePhoto';
import MapPlaceholder from '@/components/stores/MapPlaceholder';
import { asset } from "@/lib/asset";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export interface StoreMeta {
  eyebrow: string;
  blurb: string;
  fax?: string;
  faxDisplay?: string;
}

interface StoreBlockProps {
  store: StoreInfo;
  meta: StoreMeta;
  index: number;
}

export default function StoreBlock({ store, meta, index }: StoreBlockProps) {
  // Nicosia (index 0) leads with image on the right; alternates after that.
  const imageRight = index % 2 === 0;
  const slideX = imageRight ? -40 : 40;
  const maps = mapsUrl(store);

  const item = (i: number) => ({
    initial: { opacity: 0, x: slideX },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.7, delay: i * 0.09, ease: EASE },
  });

  return (
    <section id={`store-${store.city.toLowerCase()}`} className="container-site scroll-mt-28 py-16">
      <div
        className={`flex flex-col gap-12 lg:items-center lg:gap-16 ${
          imageRight ? 'lg:flex-row-reverse' : 'lg:flex-row'
        }`}
      >
        {/* Photo panel (55%) */}
        <div className="lg:w-[55%]">
          <StorePhoto img={asset(store.img)} city={store.city} />
        </div>

        {/* Info panel (45%) */}
        <div className="flex flex-col gap-6 lg:w-[45%]">
          <motion.p {...item(0)} className="eyebrow">
            {meta.eyebrow}
          </motion.p>

          <motion.h2
            {...item(1)}
            className="font-serif font-medium text-ivory"
            style={{ fontSize: 'clamp(2.4rem, 4vw, 3.5rem)', lineHeight: 1.05 }}
          >
            {store.city}
          </motion.h2>

          <motion.ul {...item(2)} className="flex flex-col gap-3">
            <li className="flex items-start gap-3 font-mono text-[0.95rem] text-ivory-dim">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />
              {store.address}, {store.region}
            </li>
            <li>
              <a
                href={`tel:${store.tel}`}
                className="flex items-start gap-3 font-mono text-[0.95rem] text-ivory-dim transition-colors hover:text-brass"
              >
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />
                {store.telDisplay}
              </a>
            </li>
            {meta.fax && (
              <li>
                <a
                  href={`tel:${meta.fax}`}
                  className="flex items-start gap-3 font-mono text-[0.95rem] text-ivory-dim transition-colors hover:text-brass"
                >
                  <Printer className="mt-0.5 h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} />
                  Fax {meta.faxDisplay}
                </a>
              </li>
            )}
          </motion.ul>

          <motion.p {...item(3)} className="leading-relaxed text-ivory-dim">
            {meta.blurb}
          </motion.p>

          <motion.div {...item(4)} className="flex flex-wrap items-center gap-3">
            <a href={`tel:${store.tel}`} className="btn-primary !px-5 !py-2.5 text-sm">
              <Phone className="h-4 w-4" strokeWidth={1.5} />
              Call the store
            </a>
            <a href={maps} target="_blank" rel="noreferrer" className="btn-secondary !px-5 !py-2.5 text-sm">
              Get directions
            </a>
            <Link
              to="/shipping"
              className="inline-flex items-center gap-2 rounded-full border border-line px-5 py-2.5 text-sm text-ivory-dim transition-colors duration-300 hover:border-brass hover:text-brass"
            >
              Pickup here — free
            </Link>
          </motion.div>

          <motion.div {...item(5)}>
            <MapPlaceholder href={maps} label={`${store.address}, ${store.city}`} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
