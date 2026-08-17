import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ShieldCheck, Store, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

const ITEMS: { icon: LucideIcon; text: string }[] = [
  { icon: Truck, text: 'Home delivery €5.00 incl. VAT' },
  { icon: Store, text: 'Free pickup, held 2 days' },
  { icon: ShieldCheck, text: 'Secure PayPal payment' },
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
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              to="/shipping"
              className="group flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-ivory-dim transition-colors hover:text-ivory"
            >
              <item.icon className="h-5 w-5 text-brass" strokeWidth={1.5} />
              <span className="group-hover:underline group-hover:underline-offset-4">{item.text}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
