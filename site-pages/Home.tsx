import { useState } from 'react';
import type { Product } from '@/types';
import Hero from '@/components/home/Hero';
import StatsBand from '@/components/home/StatsBand';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import OffersRail from '@/components/home/OffersRail';
import ShippingTeaser from '@/components/home/ShippingTeaser';
import StoresTeaser from '@/components/home/StoresTeaser';
import FinalCta from '@/components/home/FinalCta';
import ProductDetailModal from '@/components/ProductDetailModal';

export default function Home() {
  const [selected, setSelected] = useState<Product | null>(null);

  return (
    <>
      <Hero />
      <StatsBand />
      <CategoryShowcase />
      <OffersRail onOpen={setSelected} />
      <ShippingTeaser />
      <StoresTeaser />
      <FinalCta />
      <ProductDetailModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
}
