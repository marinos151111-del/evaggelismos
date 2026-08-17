import { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Phone, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface Step {
  icon: LucideIcon;
  title: string;
  body: ReactNode;
}

const STEPS: Step[] = [
  {
    icon: ShoppingBag,
    title: 'Cart & enquiry',
    body: 'Add instruments to your cart and send an order enquiry — no card details needed at this step.',
  },
  {
    icon: Phone,
    title: 'Confirmation',
    body: (
      <>
        We confirm availability by email or phone. Orders over{' '}
        <strong className="font-medium text-ivory">€700</strong> are always confirmed personally.
      </>
    ),
  },
  {
    icon: ShieldCheck,
    title: 'Secure payment',
    body: (
      <>
        Payment is completed on a secure <strong className="font-medium text-ivory">PayPal</strong> page
        over SSL. We never see or store your card data.
      </>
    ),
  },
  {
    icon: Truck,
    title: 'Delivery or pickup',
    body: (
      <>
        Home delivery for €5.00, or free collection at your store within{' '}
        <strong className="font-medium text-ivory">2 days</strong>.
      </>
    ),
  },
];

export default function OrderJourney() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced) {
        gsap.set('.journey-line-h', { scaleX: 1 });
        gsap.set('.journey-line-v', { scaleY: 1 });
        gsap.set('.journey-step', { opacity: 1, y: 0 });
        gsap.set('.journey-dot', { scale: 1 });
        return;
      }

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 75%',
        once: true,
        onEnter: () => {
          gsap.fromTo(
            '.journey-line-h',
            { scaleX: 0 },
            { scaleX: 1, duration: 1.2, ease: 'power2.inOut', transformOrigin: 'left center' }
          );
          gsap.fromTo(
            '.journey-line-v',
            { scaleY: 0 },
            { scaleY: 1, duration: 1.2, ease: 'power2.inOut', transformOrigin: 'center top' }
          );
          gsap.fromTo(
            '.journey-dot',
            { scale: 0 },
            { scale: 1, duration: 0.5, stagger: 0.15, ease: 'back.out(2)' }
          );
          gsap.fromTo(
            '.journey-step',
            { opacity: 0, y: 32 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out' }
          );
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="bg-ink-2 py-20 lg:py-24">
      <div className="container-site">
        <div className="mb-14 flex flex-col gap-4 lg:mb-16">
          <p className="eyebrow">The Journey</p>
          <h2 className="display-l max-w-2xl text-ivory">What happens after you order</h2>
        </div>

        <ol className="relative grid gap-12 lg:grid-cols-4 lg:gap-8">
          {/* Connector lines (desktop horizontal / mobile vertical) */}
          <span
            aria-hidden
            className="journey-line-h absolute left-0 right-0 top-[7px] hidden h-px bg-line lg:block"
          />
          <span
            aria-hidden
            className="journey-line-v absolute bottom-0 left-[7px] top-0 w-px bg-line lg:hidden"
          />

          {STEPS.map((step, i) => (
            <li key={step.title} className="journey-step relative flex gap-5 pl-8 lg:flex-col lg:gap-6 lg:pl-0 lg:pt-10">
              <span
                aria-hidden
                className="journey-dot absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2 border-brass bg-ink lg:left-0 lg:top-0"
              />
              <div className="flex items-center gap-4">
                <span className="font-mono text-[0.72rem] font-medium uppercase tracking-[0.22em] text-brass">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brass/15 text-brass">
                  <step.icon className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </span>
              </div>
              <div className="flex flex-col gap-2.5">
                <h3 className="font-sans text-lg font-semibold text-ivory">{step.title}</h3>
                <p className="text-[0.95rem] leading-relaxed text-ivory-dim">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
