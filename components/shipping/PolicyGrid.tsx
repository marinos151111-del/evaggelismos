import { motion } from 'framer-motion';
import { CreditCard, Phone, RefreshCcw, Tag } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface Policy {
  icon: LucideIcon;
  title: string;
  body: ReactNode;
}

const POLICIES: Policy[] = [
  {
    icon: Phone,
    title: 'Confirmation for larger orders',
    body: (
      <>
        Orders with a total over <strong className="font-medium text-ivory">€700</strong> are confirmed by
        email or telephone before processing. Keep an eye on your inbox after checkout.
      </>
    ),
  },
  {
    icon: CreditCard,
    title: 'Secure payment',
    body: "Card payments are processed on PayPal's secure page with SSL encryption. Evangelismos never holds, sees, or stores your card details.",
  },
  {
    icon: Tag,
    title: 'Prices include VAT',
    body: 'Every price you see is final. All products are priced in euro with VAT already included — no surprises at checkout.',
  },
  {
    icon: RefreshCcw,
    title: 'Returns',
    body: 'Returns follow the policy of the physical Evangelismos stores. Keep your purchase document or receipt — it is required for any return.',
  },
];

export default function PolicyGrid() {
  return (
    <section className="container-site py-20 lg:py-24">
      <div className="mb-12 flex flex-col gap-4 lg:mb-14">
        <p className="eyebrow">The Fine Print</p>
        <h2 className="display-l max-w-2xl text-ivory">
          Policies, made <span className="italic text-brass">clear</span>
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {POLICIES.map((p, i) => (
          <motion.article
            key={p.title}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
            className="flex flex-col gap-5 rounded-2xl border border-line bg-surface p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brass/40"
          >
            <motion.span
              initial={{ rotate: -90 }}
              whileInView={{ rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: EASE }}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-brass/15 text-brass"
            >
              <p.icon className="h-5 w-5" strokeWidth={1.5} />
            </motion.span>
            <h3 className="font-sans text-lg font-semibold text-ivory">{p.title}</h3>
            <p className="leading-relaxed text-ivory-dim">{p.body}</p>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
