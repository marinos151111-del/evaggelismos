import { Link } from 'react-router';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface SectionHeaderProps {
  eyebrow: string;
  title: React.ReactNode;
  linkTo?: string;
  linkLabel?: string;
  /** prefix dot (e.g. sale-red) before the eyebrow */
  dotColor?: string;
}

/** Shared section header: eyebrow + Fraunces title + optional right-aligned link (§7.8) */
export default function SectionHeader({ eyebrow, title, linkTo, linkLabel, dotColor }: SectionHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="mb-12 flex flex-wrap items-end justify-between gap-6 lg:mb-16"
    >
      <div className="flex flex-col gap-4">
        <p className="eyebrow flex items-center gap-2">
          {dotColor && (
            <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: dotColor }} />
          )}
          {eyebrow}
        </p>
        <h2 className="display-l max-w-2xl text-ivory">{title}</h2>
      </div>
      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          className="group flex items-center gap-2 font-mono text-sm text-brass transition-colors hover:text-brass-bright"
        >
          {linkLabel}
          <ArrowRight
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            strokeWidth={1.5}
          />
        </Link>
      )}
    </motion.div>
  );
}
