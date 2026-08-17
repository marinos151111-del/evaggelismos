import { useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, CreditCard, Loader2, RefreshCcw, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useCatalog } from '@/context/CatalogContext';
import { formatEUR } from '@/lib/format';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface EnquiryStepProps {
  total: number;
  onSubmitted: (name: string) => void;
}

interface FieldErrors {
  name?: string;
  phone?: string;
  email?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateName(v: string): string | undefined {
  return v.trim().length >= 2 ? undefined : 'Enter your full name';
}
function validatePhone(v: string): string | undefined {
  const digits = v.replace(/\D/g, '');
  return digits.length >= 8 ? undefined : 'Enter a valid phone';
}
function validateEmail(v: string): string | undefined {
  return EMAIL_RE.test(v.trim()) ? undefined : 'Enter a valid email';
}

const inputBase =
  'w-full rounded-xl border bg-surface-2 px-4 py-3 font-sans text-sm text-ivory placeholder:text-ivory-faint transition-colors duration-300 focus:outline-none';
const inputOk = `${inputBase} border-line focus:border-brass`;
const inputErr = `${inputBase} border-sale focus:border-sale`;

export default function EnquiryStep({ total, onSubmitted }: EnquiryStepProps) {
  const { items, count } = useCart();
  const { byId } = useCatalog();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [recapOpen, setRecapOpen] = useState(false);

  const lines = useMemo(
    () =>
      items
        .map((item) => ({ item, product: byId.get(item.id) }))
        .filter((l) => Boolean(l.product)),
    [items, byId]
  );

  const errors: FieldErrors = {
    name: validateName(name),
    phone: validatePhone(phone),
    email: validateEmail(email),
  };
  const isValid = !errors.name && !errors.phone && !errors.email;
  const showErr = (field: keyof FieldErrors) =>
    (touched[field] || submitAttempted) && errors[field];

  const blur = (field: string) => () => setTouched((t) => ({ ...t, [field]: true }));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!isValid || submitting) return;
    setSubmitting(true);
    window.setTimeout(() => onSubmitted(name.trim()), 800);
  };

  return (
    <form
      data-lenis-prevent
      onSubmit={onSubmit}
      noValidate
      className="flex-1 overflow-y-auto px-6 py-5"
    >
      {/* Summary recap card */}
      <div className="rounded-xl border border-line bg-ink-2">
        <button
          type="button"
          onClick={() => setRecapOpen((o) => !o)}
          aria-expanded={recapOpen}
          className="flex w-full items-center justify-between px-4 py-3"
        >
          <span className="font-mono text-xs text-ivory">
            {count} {count === 1 ? 'item' : 'items'} — {formatEUR(total)}
          </span>
          <ChevronDown
            className={`h-4 w-4 text-ivory-dim transition-transform duration-300 ${recapOpen ? 'rotate-180' : ''}`}
            strokeWidth={1.5}
          />
        </button>
        <AnimatePresence initial={false}>
          {recapOpen && (
            <motion.div
              key="recap"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: EASE }}
              className="overflow-hidden"
            >
              <div className="flex flex-col gap-2 border-t border-line px-4 py-3">
                {lines.map(({ item, product }) => (
                  <div key={item.id} className="flex items-baseline justify-between gap-3">
                    <span className="min-w-0 truncate font-sans text-xs text-ivory-dim">
                      {product?.name} <span className="font-mono text-ivory-faint">×{item.qty}</span>
                    </span>
                    <span className="shrink-0 font-mono text-xs text-ivory">
                      {product ? formatEUR(product.price * item.qty) : ''}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Fields */}
      <div className="mt-5 flex flex-col gap-4">
        <div>
          <label
            htmlFor="enquiry-name"
            className="mb-1.5 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ivory-dim"
          >
            Full name*
          </label>
          <input
            id="enquiry-name"
            type="text"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={blur('name')}
            className={showErr('name') ? inputErr : inputOk}
          />
          {showErr('name') && (
            <p className="mt-1.5 font-mono text-[0.7rem] text-sale">{errors.name}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-phone"
            className="mb-1.5 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ivory-dim"
          >
            Phone*
          </label>
          <input
            id="enquiry-phone"
            type="tel"
            autoComplete="tel"
            placeholder="+357 …"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onBlur={blur('phone')}
            className={showErr('phone') ? inputErr : inputOk}
          />
          {showErr('phone') && (
            <p className="mt-1.5 font-mono text-[0.7rem] text-sale">{errors.phone}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-email"
            className="mb-1.5 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ivory-dim"
          >
            Email*
          </label>
          <input
            id="enquiry-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={blur('email')}
            className={showErr('email') ? inputErr : inputOk}
          />
          {showErr('email') && (
            <p className="mt-1.5 font-mono text-[0.7rem] text-sale">{errors.email}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="enquiry-notes"
            className="mb-1.5 block font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ivory-dim"
          >
            Notes
          </label>
          <textarea
            id="enquiry-notes"
            rows={3}
            placeholder="Preferred pickup time, questions, delivery instructions…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className={`${inputOk} resize-none`}
          />
        </div>
      </div>

      {/* Policies row */}
      <div className="mt-5 flex flex-col gap-2 border-t border-line pt-4">
        <p className="flex items-center gap-2.5 font-mono text-[0.7rem] text-ivory-faint">
          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-brass" strokeWidth={1.5} />
          Prices incl. VAT
        </p>
        <p className="flex items-center gap-2.5 font-mono text-[0.7rem] text-ivory-faint">
          <CreditCard className="h-3.5 w-3.5 shrink-0 text-brass" strokeWidth={1.5} />
          Payment via secure PayPal page — we never hold card details
        </p>
        <p className="flex items-center gap-2.5 font-mono text-[0.7rem] text-ivory-faint">
          <RefreshCcw className="h-3.5 w-3.5 shrink-0 text-brass" strokeWidth={1.5} />
          Returns per store policy with receipt
        </p>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={!isValid || submitting}
        className="btn-primary mt-5 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} />
            Sending…
          </>
        ) : (
          'Send order enquiry'
        )}
      </button>
      <p className="mt-3 text-center font-mono text-[0.7rem] text-ivory-faint">
        No payment now — the store confirms your order by email/phone.
      </p>
    </form>
  );
}
