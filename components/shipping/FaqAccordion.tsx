import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How much is home delivery?',
    a: '€5.00 including VAT, island-wide, via our associates. If items in your order carry different delivery charges, only the maximum single charge applies.',
  },
  {
    q: 'Is store pickup really free?',
    a: 'Yes. Choose pickup at Nicosia, Larnaca or Limassol during checkout and pay nothing for delivery. Your order waits at the store for 2 days before it is automatically cancelled.',
  },
  {
    q: 'How do I pay?',
    a: 'By credit card on a secure PayPal page (SSL encrypted). Your card details are never shared with or stored by Evangelismos.',
  },
  {
    q: 'Do prices include VAT?',
    a: 'Yes — all catalog prices are final and include VAT.',
  },
  {
    q: 'What about orders over €700?',
    a: 'We confirm every order over €700 by email or phone before processing, so expect our call.',
  },
  {
    q: 'Can I return a product?',
    a: 'Returns follow the physical-store policy and require your purchase document/receipt. Contact your store of purchase.',
  },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number>(0);

  return (
    <section className="container-site max-w-[808px] pb-24 lg:pb-32">
      <div className="mb-10 flex flex-col gap-4">
        <p className="eyebrow">Questions</p>
        <h2 className="display-l text-ivory">
          Delivery <span className="italic text-brass">FAQ</span>
        </h2>
      </div>

      <div className="flex flex-col gap-3">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: EASE }}
              className="overflow-hidden rounded-xl border border-line bg-surface"
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? -1 : i)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${i}`}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span
                  className={`font-sans text-[1.05rem] font-medium transition-colors duration-300 ${
                    isOpen ? 'text-brass' : 'text-ivory'
                  }`}
                >
                  {f.q}
                </span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  className={`shrink-0 transition-colors duration-300 ${isOpen ? 'text-brass' : 'text-ivory-dim'}`}
                >
                  <ChevronDown className="h-5 w-5" strokeWidth={1.5} />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="panel"
                    id={`faq-panel-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <p className="border-t border-line px-6 py-5 leading-relaxed text-ivory-dim">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
