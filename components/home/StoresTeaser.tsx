import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import SectionHeader from '@/components/home/SectionHeader';
import { mapsUrl, STORES } from '@/lib/stores';
import { asset } from "@/lib/asset";

export default function StoresTeaser() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-site">
        <SectionHeader
          eyebrow="04 — Our Stores"
          title={
            <>
              Visit us in <em className="italic text-brass">person</em>
            </>
          }
          linkTo="/stores"
          linkLabel="All store details →"
        />

        <div className="grid gap-6 md:grid-cols-3">
          {STORES.map((s, i) => (
            <motion.article
              key={s.city}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-300 hover:-translate-y-1.5 hover:border-[rgba(200,164,93,0.45)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={asset(s.img)}
                  alt={`Evangelismos Music Stores — ${s.city} storefront`}
                  loading="lazy"
                  className="h-full w-full object-cover transition-all duration-500 group-hover:scale-105"
                />
                {s.flagship && (
                  <span className="absolute left-4 top-4 rounded-md bg-brass px-2.5 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-ink">
                    Flagship · 3-storey store
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2 p-6">
                <h3 className="font-serif text-[1.5rem] font-medium text-ivory">{s.city}</h3>
                <p className="font-mono text-[0.72rem] uppercase tracking-[0.14em] text-ivory-faint">
                  {s.address}, {s.region}
                </p>
                <a
                  href={`tel:${s.tel}`}
                  className="mt-1 flex items-center gap-2 font-mono text-sm text-ivory-dim transition-colors hover:text-brass"
                >
                  <Phone className="h-3.5 w-3.5" strokeWidth={1.5} />
                  {s.telDisplay}
                </a>
                <a
                  href={mapsUrl(s)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex w-fit items-center gap-1.5 text-sm text-ivory-dim underline-offset-4 transition-colors hover:text-brass hover:underline"
                >
                  Get directions →
                </a>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
