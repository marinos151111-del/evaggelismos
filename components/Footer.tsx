import { Link } from 'react-router';
import { Lock } from 'lucide-react';
import { CONTACT_EMAIL, STORES } from '@/lib/stores';
import { asset } from "@/lib/asset";

const EXPLORE_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
  { to: '/shop?offer=1', label: 'Special Offers' },
  { to: '/shipping', label: 'Shipping & Delivery' },
  { to: '/stores', label: 'Stores' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const INFO_ITEMS = ['Prices include VAT', 'Home delivery €5.00', 'Free store pickup'];

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative overflow-hidden border-t border-line bg-ink-2">
      {/* Oversized watermark */}
      <div
        aria-hidden
        className="pointer-events-none select-none overflow-hidden"
        style={{ height: 'clamp(4rem, 9vw, 9rem)' }}
      >
        <p
          className="whitespace-nowrap text-center font-serif font-semibold leading-[0.85] text-ivory"
          style={{ fontSize: '12vw', opacity: 0.04 }}
        >
          EVANGELISMOS
        </p>
      </div>

      <div className="container-site grid gap-12 pb-16 pt-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand */}
        <div className="flex flex-col gap-5">
          <Link to="/">
            <img src={asset("assets/logo.png")} alt="Evangelismos Music Stores" className="h-[34px] w-auto" />
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-ivory-dim">
            The largest importer of musical instruments, accessories and books in Cyprus since 1973.
          </p>
          <p className="flex items-center gap-2 font-mono text-xs text-ivory-faint">
            <Lock className="h-3.5 w-3.5 text-brass" strokeWidth={1.5} />
            Secure payments via PayPal
          </p>
        </div>

        {/* Explore */}
        <div>
          <h3 className="eyebrow mb-5">Explore</h3>
          <ul className="flex flex-col gap-2.5">
            {EXPLORE_LINKS.map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm text-ivory-dim transition-colors hover:text-brass">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Stores */}
        <div>
          <h3 className="eyebrow mb-5">Stores</h3>
          <ul className="flex flex-col gap-5">
            {STORES.map((s) => (
              <li key={s.city} className="flex flex-col gap-1">
                <span className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-brass">
                  {s.city}
                </span>
                <span className="text-sm text-ivory-dim">
                  {s.address}, {s.region}
                </span>
                <a href={`tel:${s.tel}`} className="font-mono text-xs text-ivory-faint transition-colors hover:text-brass">
                  {s.telDisplay}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Info */}
        <div>
          <h3 className="eyebrow mb-5">Good to know</h3>
          <ul className="flex flex-col gap-2.5">
            {INFO_ITEMS.map((item) => (
              <li key={item} className="text-sm text-ivory-dim">
                {item}
              </li>
            ))}
            <li>
              <Link to="/shipping" className="text-sm text-brass transition-colors hover:text-brass-bright">
                Shipping & Delivery →
              </Link>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-mono text-xs text-ivory-faint transition-colors hover:text-brass"
              >
                {CONTACT_EMAIL}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-line">
        <div className="container-site flex flex-col items-center justify-between gap-3 py-6 text-center sm:flex-row sm:text-left">
          <p className="font-mono text-xs text-ivory-faint">
            © {year} Evangelismos Music Stores
          </p>
          <p className="font-mono text-xs text-ivory-faint">Nicosia · Larnaca · Limassol</p>
          <span className="rounded-md border border-brass/40 px-2.5 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-brass">
            Since 1973
          </span>
        </div>
      </div>
    </footer>
  );
}
