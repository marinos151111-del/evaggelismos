import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { asset } from "@/lib/asset";

const HEADLINE = ['Come', 'hear', 'the', 'next', 'fifty', 'years.'];

export default function AboutFinale() {
  return (
    <section className="relative overflow-hidden pb-32 pt-8">
      <div className="container-site flex flex-col items-center gap-9 text-center">
        {/* Piano with floor-glow reflection */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <img
            src={asset("assets/hero-piano.png")}
            alt="Young Chang upright piano"
            className="h-auto max-h-[30vh] w-auto max-w-full object-contain"
            draggable={false}
          />
          {/* Reflection */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-full"
            style={{
              transform: 'scaleY(-1)',
              opacity: 0.12,
              maskImage: 'linear-gradient(to top, transparent 65%, black 100%)',
              WebkitMaskImage: 'linear-gradient(to top, transparent 65%, black 100%)',
            }}
          >
            <img src={asset("assets/hero-piano.png")} alt="" className="h-auto max-h-[30vh] w-auto object-contain" />
          </div>
          {/* Floor glow */}
          <motion.div
            aria-hidden
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.2, delay: 0.3 }}
            className="pointer-events-none absolute bottom-[-8%] left-1/2 -translate-x-1/2"
            style={{
              width: '130%',
              height: '30%',
              background: 'radial-gradient(ellipse at center, rgba(200,164,93,0.12) 0%, transparent 70%)',
            }}
          />
        </motion.div>

        <h2 className="display-m max-w-3xl text-ivory">
          {HEADLINE.map((w, i) => {
            const brass = w === 'fifty' || w === 'years.';
            return (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                className={`inline-block ${brass ? 'italic text-brass' : ''}`}
              >
                {w.replace(/\.$/, '')}
                {w.endsWith('.') && <span className="text-ivory">.</span>}
                {'\u00A0'}
              </motion.span>
            );
          })}
        </h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-xl leading-relaxed text-ivory-dim"
        >
          Browse the full catalog online, or visit us in Nicosia, Larnaca and Limassol.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <Link to="/shop" className="btn-primary">
            Browse the shop
          </Link>
          <Link to="/stores" className="btn-secondary">
            Our stores
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
