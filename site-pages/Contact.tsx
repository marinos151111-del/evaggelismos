import { useEffect } from 'react';
import ContactHero from '@/components/contact/ContactHero';
import ContactForm from '@/components/contact/ContactForm';
import StoreContactCards from '@/components/contact/StoreContactCards';
import ReassuranceStrip from '@/components/contact/ReassuranceStrip';

export default function Contact() {
  useEffect(() => {
    document.title = 'Contact — Evangelismos Music Stores';
    return () => {
      document.title = 'Evangelismos Music Stores';
    };
  }, []);

  return (
    <>
      <ContactHero />
      <section className="pb-24 pt-12 lg:pb-32">
        <div className="container-site grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
          <div className="lg:col-span-5">
            <StoreContactCards />
          </div>
        </div>
      </section>
      <ReassuranceStrip />
    </>
  );
}
