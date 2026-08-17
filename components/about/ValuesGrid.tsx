import { motion } from 'framer-motion';
import { Layers, Music, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface Value {
  icon: LucideIcon;
  title: string;
  body: string;
}

const VALUES: Value[] = [
  {
    icon: Music,
    title: 'Heritage',
    body: "A family company since 1973. We grew up with Cyprus' musicians — and their children.",
  },
  {
    icon: Layers,
    title: 'Range',
    body: "From concert pianos to a single guitar string: the island's deepest catalog, 2,746 products across 14 categories.",
  },
  {
    icon: ShieldCheck,
    title: 'Service',
    body: 'Three stores, honest VAT-included prices, €5 delivery, and people who actually play what they sell.',
  },
];

export default function ValuesGrid() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-site">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 flex flex-col gap-4 lg:mb-16"
        >
          <p className="eyebrow">What we stand for</p>
          <h2 className="display-l max-w-2xl text-ivory">
            Fifty years, three <em className="italic text-brass">promises</em>
          </h2>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          {VALUES.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              className="group flex flex-col gap-5 rounded-2xl border border-line bg-surface p-9 transition-[border-color,transform] duration-300 hover:-translate-y-1.5 hover:border-[rgba(200,164,93,0.45)]"
            >
              <motion.span
                initial={{ rotate: -90, opacity: 0 }}
                whileInView={{ rotate: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.8, delay: i * 0.12 + 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="flex h-12 w-12 items-center justify-center rounded-full border border-line text-brass"
              >
                <v.icon className="h-5 w-5" strokeWidth={1.5} />
              </motion.span>
              <h3 className="font-serif text-2xl font-medium text-ivory">{v.title}</h3>
              <p className="leading-[1.65] text-ivory-dim">{v.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
