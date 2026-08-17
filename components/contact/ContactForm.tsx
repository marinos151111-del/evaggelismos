import { useMemo, useState } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, Loader2 } from 'lucide-react';
import { STORES } from '@/lib/stores';

const TOPICS = ['Product enquiry', 'Order & delivery', 'Repairs & service', 'Something else'];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface FormValues {
  name: string;
  email: string;
  phone: string;
  topic: string;
  message: string;
}

type FieldName = keyof FormValues;

const INITIAL: FormValues = { name: '', email: '', phone: '', topic: TOPICS[0], message: '' };

function validateField(name: FieldName, value: string): string | null {
  switch (name) {
    case 'name':
      return value.trim().length >= 2 ? null : 'Please enter your full name.';
    case 'email':
      return EMAIL_RE.test(value.trim()) ? null : 'Please enter a valid email address.';
    case 'message':
      return value.trim().length >= 10 ? null : 'Please tell us a little more (min. 10 characters).';
    default:
      return null;
  }
}

const inputBase =
  'w-full rounded-xl border bg-surface-2 px-4 py-3 font-sans text-[0.95rem] text-ivory placeholder:text-ivory-faint transition-[border-color,box-shadow] duration-200 focus:outline-none';
const inputOk = 'border-line focus:border-brass focus:shadow-[0_0_0_3px_rgba(200,164,93,0.15)]';
const inputErr = 'border-sale focus:border-sale focus:shadow-[0_0_0_3px_rgba(229,72,77,0.12)]';

export default function ContactForm() {
  const [values, setValues] = useState<FormValues>(INITIAL);
  const [touched, setTouched] = useState<Partial<Record<FieldName, boolean>>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const errors = useMemo(() => {
    const e: Partial<Record<FieldName, string>> = {};
    (Object.keys(values) as FieldName[]).forEach((k) => {
      const err = validateField(k, values[k]);
      if (err) e[k] = err;
    });
    return e;
  }, [values]);

  const isValid = Object.keys(errors).length === 0;

  const showError = (k: FieldName) => (touched[k] || submitAttempted) && errors[k];

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setValues((v) => ({ ...v, [name]: value }));
  };

  const onBlur = (e: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched((t) => ({ ...t, [e.target.name]: true }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    if (!isValid || status !== 'idle') return;
    setStatus('sending');
    window.setTimeout(() => setStatus('sent'), 800);
  };

  const reset = () => {
    setValues(INITIAL);
    setTouched({});
    setSubmitAttempted(false);
    setStatus('idle');
  };

  const fieldProps = (name: FieldName) => ({
    name,
    value: values[name],
    onChange,
    onBlur,
    className: `${inputBase} ${showError(name) ? inputErr : inputOk}`,
    'aria-invalid': Boolean(showError(name)),
  });

  return (
    <motion.div
      initial={{ opacity: 0, x: -40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-[20px] border border-line bg-surface p-7 sm:p-10"
    >
      <AnimatePresence mode="wait" initial={false}>
        {status === 'sent' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex min-h-[28rem] flex-col items-center justify-center gap-5 text-center"
          >
            <motion.svg viewBox="0 0 64 64" className="h-16 w-16" fill="none" aria-hidden>
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke="var(--brass)"
                strokeWidth="2.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              />
              <motion.path
                d="M20 33 L28.5 41.5 L45 24"
                stroke="var(--brass)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.svg>
            <h3 className="font-serif text-[1.5rem] font-medium text-ivory">
              Message <em className="italic text-brass">sent</em>.
            </h3>
            <p className="max-w-sm leading-relaxed text-ivory-dim">
              Thank you — we'll get back to you by email or phone shortly.
            </p>
            <button
              type="button"
              onClick={reset}
              className="mt-2 inline-flex items-center gap-2 rounded-full border border-line px-6 py-3 font-sans text-[0.9rem] font-medium text-ivory transition-colors duration-300 hover:border-brass hover:text-brass"
            >
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-8 flex flex-col gap-2">
              <p className="eyebrow">Send a message</p>
              <h2 className="font-sans text-[1.25rem] font-semibold text-ivory">
                We reply by email or phone.
              </h2>
            </div>

            <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="cf-name" className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ivory-dim">
                    Full name*
                  </label>
                  <input id="cf-name" type="text" autoComplete="name" {...fieldProps('name')} />
                  <FieldError msg={showError('name')} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="cf-email" className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ivory-dim">
                    Email*
                  </label>
                  <input id="cf-email" type="email" autoComplete="email" {...fieldProps('email')} />
                  <FieldError msg={showError('email')} />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label htmlFor="cf-phone" className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ivory-dim">
                    Phone <span className="text-ivory-faint">(optional)</span>
                  </label>
                  <input id="cf-phone" type="tel" autoComplete="tel" placeholder="+357 …" {...fieldProps('phone')} />
                </div>
                <div className="flex flex-col gap-2">
                  <label htmlFor="cf-topic" className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ivory-dim">
                    Topic
                  </label>
                  <div className="relative">
                    <select id="cf-topic" {...fieldProps('topic')} className={`${inputBase} ${inputOk} appearance-none pr-10`}>
                      {TOPICS.map((t) => (
                        <option key={t} value={t} className="bg-surface-2 text-ivory">
                          {t}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory-dim"
                      strokeWidth={1.5}
                      aria-hidden
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="cf-message" className="font-mono text-[0.7rem] uppercase tracking-[0.14em] text-ivory-dim">
                  Message*
                </label>
                <textarea
                  id="cf-message"
                  rows={5}
                  placeholder="Tell us which instrument you're looking at…"
                  {...fieldProps('message')}
                />
                <FieldError msg={showError('message')} />
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-5">
                <button
                  type="submit"
                  disabled={!isValid || status === 'sending'}
                  className="btn-primary disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
                >
                  {status === 'sending' ? (
                    <>
                      Sending
                      <Loader2 className="h-4 w-4 animate-spin" strokeWidth={2} aria-hidden />
                    </>
                  ) : (
                    <>
                      Send message
                      <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
                    </>
                  )}
                </button>
                <p className="font-mono text-[0.72rem] text-ivory-faint">
                  Prefer to talk? Nicosia {STORES[0].telDisplay}
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function FieldError({ msg }: { msg: string | null | false | undefined }) {
  return (
    <AnimatePresence initial={false}>
      {msg && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.15 }}
          className="font-mono text-[0.7rem] text-sale"
          role="alert"
        >
          {msg}
        </motion.p>
      )}
    </AnimatePresence>
  );
}
