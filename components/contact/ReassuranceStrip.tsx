import { motion } from 'framer-motion';
import { Phone, RefreshCcw, ShieldCheck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ITEMS: { icon: LucideIcon; text: string }[] = [
  { icon: Phone, text: 'We answer in store hours' },
  { icon: ShieldCheck, text: 'Orders > €700 confirmed personally' },
  { icon: RefreshCcw, text: 'Returns with receipt, per store policy' },
];

export default function ReassuranceStrip() {
  return (
    <section className="border-t border-line bg-ink-2 py-16">
      <div className="container-site flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {ITEMS.map((item, i) => (
          <motion.div
            key={item.text}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center gap-3 font-mono text-[0.78rem] uppercase tracking-[0.14em] text-ivory-dim"
          >
            <item.icon className="h-[18px] w-[18px] text-brass" strokeWidth={1.5} aria-hidden />
            {item.text}
          </motion.div>
        ))}
      </div>
    </section>
  );
}
