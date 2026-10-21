import React, { useEffect } from 'react';
import { FileText, Building, Mail } from 'lucide-react';
import { SEO } from './SEO';
import { useLegalContent } from '../lib/sanityService';

interface TermsProps {
  lang?: 'de' | 'en';
}

export const Terms: React.FC<TermsProps> = ({ lang = 'en' }) => {
  const { content: legal } = useLegalContent();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-[#f5f0e8] min-h-screen text-[#1a1a1a]" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <SEO
        title={lang === 'de' ? 'Allgemeine Geschäftsbedingungen | MAATI Kitchen Berlin' : 'Terms & Conditions | MAATI Kitchen Berlin'}
        description="Terms and conditions for using the MAATI Kitchen website and ordering from our Berlin restaurant."
        canonicalUrl={lang === 'de' ? 'https://maatikitchen.com/de/agb' : 'https://maatikitchen.com/terms'}
        lang={lang}
        enPath="/terms"
        robots="noindex, follow"
      />
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">

        {/* ── Page Header ── */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">
            Legal Agreements
          </span>
          <h1 className="text-[40px] md:text-[54px] font-black text-[#1e382f] leading-tight mt-1">
            Terms and Conditions
          </h1>
        </div>

        {/* ── Main Legal Content Card ── */}
        <div className="bg-[#fcf8f3] rounded-[28px] p-8 md:p-12 shadow-sm border border-[#ebdcd0]/80 space-y-10">

          {/* Company Card Header */}
          <div className="bg-white/80 rounded-[20px] p-6 border border-[#ebdcd0]/60 space-y-2 text-[15px] leading-relaxed text-[#333]">
            <p className="font-bold text-[17px] text-[#1e382f]">The &apos;MAATI&apos; brand is operated by</p>
            <p className="font-semibold text-[#1a1a1a]">{legal.impressumCompanyName || 'Unicorn Table UG'}</p>
            <p>{legal.impressumAddress || 'Lindenstraße 74, 10969 Berlin'}</p>
            <p>{legal.impressumRegisterCourt || 'HRB 207902 B, Amtsgericht Charlottenburg'}</p>
            <p>
              E-Mail:{' '}
              <a href={`mailto:${legal.impressumEmail || 'hello@maatikitchen.com'}`} className="text-[#d85c27] font-semibold hover:underline">
                {legal.impressumEmail || 'hello@maatikitchen.com'}
              </a>
            </p>
          </div>

          {/* Dynamic / Editable Sections */}
          {legal.termsSections && legal.termsSections.length > 0 ? (
            legal.termsSections.map((sec, idx) => {
              const secTitle = lang === 'de' ? (sec.titleDe || sec.titleEn) : (sec.titleEn || sec.titleDe);
              const secBody = lang === 'de' ? (sec.bodyDe || sec.bodyEn) : (sec.bodyEn || sec.bodyDe);

              return (
                <React.Fragment key={sec.id || idx}>
                  <section className="space-y-3">
                    <h2 className="text-[22px] font-bold text-[#1e382f]">
                      {secTitle}
                    </h2>
                    <div className="text-[14px] leading-relaxed text-[#555] whitespace-pre-line">
                      {secBody}
                    </div>
                  </section>
                  {idx < (legal.termsSections?.length || 0) - 1 && (
                    <hr className="border-t border-[#ebdcd0]" />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <>
              {/* 1. General */}
              <section className="space-y-3">
                <h2 className="text-[22px] font-bold text-[#1e382f]">
                  1. General &amp; Scope
                </h2>
                <p className="text-[14px] leading-relaxed text-[#555]">
                  {(lang === 'de' ? legal.termsDe : legal.termsEn) || 'These General Terms and Conditions govern all orders, reservations, catering services, and interactions with MAATI Kitchen (Unicorn Table UG).'}
                </p>
              </section>

              <hr className="border-t border-[#ebdcd0]" />

              {/* 2. Menu and Availability */}
              <section className="space-y-3">
                <h2 className="text-[22px] font-bold text-[#1e382f]">
                  2. Menu &amp; Food Availability
                </h2>
                <p className="text-[14px] leading-relaxed text-[#555]">
                  All dishes, ingredients, and prices displayed on our website are subject to daily kitchen availability. We prepare all meals fresh using whole authentic spices.
                </p>
              </section>

              <hr className="border-t border-[#ebdcd0]" />

              {/* 3. Catering & Events */}
              <section className="space-y-3">
                <h2 className="text-[22px] font-bold text-[#1e382f]">
                  3. Catering &amp; Event Bookings
                </h2>
                <p className="text-[14px] leading-relaxed text-[#555]">
                  Catering orders require 24 to 48 hours notice depending on guest count. Cancellation policies and payment terms are detailed in each individual offer.
                </p>
              </section>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
