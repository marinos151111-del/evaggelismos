import ShippingHero from '@/components/shipping/ShippingHero';
import MethodCards from '@/components/shipping/MethodCards';
import OrderJourney from '@/components/shipping/OrderJourney';
import PolicyGrid from '@/components/shipping/PolicyGrid';
import FaqAccordion from '@/components/shipping/FaqAccordion';
import ShippingCta from '@/components/shipping/ShippingCta';

export default function Shipping() {
  return (
    <>
      <ShippingHero />
      <MethodCards />
      <OrderJourney />
      <PolicyGrid />
      <FaqAccordion />
      <ShippingCta />
    </>
  );
}
