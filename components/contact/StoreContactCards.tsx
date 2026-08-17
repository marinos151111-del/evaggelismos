import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin, Phone, Printer } from 'lucide-react';
import { STORES } from '@/lib/stores';

const NICOSIA_FAX = '+357 22672424';

export default function StoreContactCards() {
  return (
    <div className="flex flex-col gap-5">
      {STORES.map((s, i) => (
        <motion.div
          key={s.city}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-4 rounded-2xl border border-line bg-ink-2 p-7 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-[rgba(200,164,93,0.4)]"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-serif text-[1.4rem] font-medium text-ivory">{s.city}</h3>
            <span className="eyebrow">{s.flagship ? 'Flagship' : 'Store'}</span>
          </div>

          <div className="flex flex-col gap-2.5">
            <p className="flex items-start gap-3 font-mono text-[0.85rem] leading-relaxed text-ivory-dim">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} aria-hidden />
              <span>
                {s.address}, {s.region.replace(', Cyprus', '')}
              </span>
            </p>
            <a
              href={`tel:${s.tel}`}
              className="flex items-center gap-3 font-mono text-[0.85rem] text-ivory-dim transition-colors duration-300 hover:text-brass"
            >
              <Phone className="h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} aria-hidden />
              {s.telDisplay}
            </a>
            {s.flagship && (
              <p className="flex items-center gap-3 font-mono text-[0.85rem] text-ivory-dim">
                <Printer className="h-4 w-4 shrink-0 text-brass" strokeWidth={1.5} aria-hidden />
                Fax {NICOSIA_FAX}
              </p>
            )}
          </div>

          <Link
            to="/stores"
            className="group mt-1 inline-flex items-center gap-2 self-start font-mono text-[0.78rem] text-brass transition-colors hover:text-brass-bright"
          >
            Store details
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1"
              strokeWidth={1.5}
              aria-hidden
            />
          </Link>
        </motion.div>
      ))}

      {/* Map placeholder */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link
          to="/stores"
          className="dot-grid group relative flex h-[180px] items-center justify-center overflow-hidden rounded-2xl border border-line bg-ink-2 transition-colors duration-300 hover:border-[rgba(200,164,93,0.4)]"
          aria-label="View all three stores on the Stores page"
        >
          <div className="flex flex-col items-center gap-2.5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(200,164,93,0.4)] bg-ink text-brass transition-transform duration-300 group-hover:scale-110">
              <MapPin className="h-5 w-5" strokeWidth={1.5} aria-hidden />
            </span>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.22em] text-ivory-dim transition-colors duration-300 group-hover:text-brass">
              3 stores across Cyprus
            </span>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
