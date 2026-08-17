import { useEffect } from 'react';
import AboutHero from '@/components/about/AboutHero';
import HeritageTimeline from '@/components/about/HeritageTimeline';
import LegacyMarquee from '@/components/about/LegacyMarquee';
import ValuesGrid from '@/components/about/ValuesGrid';
import AboutFinale from '@/components/about/AboutFinale';

export default function About() {
  useEffect(() => {
    document.title = 'About — Evangelismos Music Stores · Since 1973';
    return () => {
      document.title = 'Evangelismos Music Stores';
    };
  }, []);

  return (
    <>
      <AboutHero />
      <HeritageTimeline />
      <LegacyMarquee />
      <ValuesGrid />
      <AboutFinale />
    </>
  );
}
