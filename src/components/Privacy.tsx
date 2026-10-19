import React, { useEffect } from 'react';
import { SEO } from './SEO';
import { useLegalContent } from '../lib/sanityService';

interface PrivacyProps {
  lang?: 'de' | 'en';
}

export const Privacy: React.FC<PrivacyProps> = ({ lang = 'en' }) => {
  const { content: legal } = useLegalContent();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="bg-[#f5f0e8] min-h-screen text-[#1a1a1a]" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <SEO
        title={lang === 'de' ? 'Datenschutzerklärung | MAATI Kitchen Berlin' : 'Privacy Policy | MAATI Kitchen Berlin'}
        description="Privacy policy and GDPR data protection provisions for MAATI Kitchen (Unicorn Table UG)."
        canonicalUrl={lang === 'de' ? 'https://maatikitchen.com/de/datenschutz' : 'https://maatikitchen.com/privacy'}
        lang={lang}
        enPath="/privacy"
        robots="noindex, follow"
      />
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">

        {/* ── Page Header ── */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">
            Data Protection
          </span>
          <h1 className="text-[40px] md:text-[54px] font-black text-[#1e382f] leading-tight mt-1">
            Privacy Policy
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
          {legal.privacySections && legal.privacySections.length > 0 ? (
            legal.privacySections.map((sec, idx) => {
              const secTitle = lang === 'de' ? (sec.titleDe || sec.titleEn) : (sec.titleEn || sec.titleDe);
              const secBody = lang === 'de' ? (sec.bodyDe || sec.bodyEn) : (sec.bodyEn || sec.bodyDe);

              return (
                <React.Fragment key={sec.id || idx}>
                  <section className="space-y-4">
                    <h2 className="text-[22px] font-bold text-[#1e382f]">
                      {secTitle}
                    </h2>
                    <div className="text-[14px] leading-relaxed text-[#555] whitespace-pre-line">
                      {secBody}
                    </div>
                  </section>
                  {idx < (legal.privacySections?.length || 0) - 1 && (
                    <hr className="border-t border-[#ebdcd0]" />
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <>
              {/* 1. General */}
              <section className="space-y-4">
                <h2 className="text-[22px] font-bold text-[#1e382f]">
                  1. General &amp; Data Protection
                </h2>
                <p className="text-[14px] leading-relaxed text-[#555]">
                  {legal.privacyPolicyEn || 'We are MAATI (Unicorn Table UG, Lindenstraße 74, 10969 Berlin). We take the protection of your personal data very seriously and process data strictly in accordance with GDPR provisions.'}
                </p>
                <p className="text-[14px] leading-relaxed text-[#555]">
                  Please read this policy carefully as it sets out the basis on which we collect any personal information from you when you use our website. If you have any questions about this Privacy Policy, please contact us at{' '}
                  <a href={`mailto:${legal.impressumEmail || 'hello@maatikitchen.com'}`} className="text-[#d85c27] font-semibold hover:underline">
                    {legal.impressumEmail || 'hello@maatikitchen.com'}
                  </a>.
                </p>
              </section>

              <hr className="border-t border-[#ebdcd0]" />

              {/* 2. What information do we collect */}
              <section className="space-y-4">
                <h2 className="text-[22px] font-bold text-[#1e382f]">
                  2. What Information Do We Collect?
                </h2>
                <p className="text-[14px] leading-relaxed text-[#555]">
                  You can browse our website without submitting any personal information. However, when placing catering inquiries, table reservations, or job applications, we collect necessary contact information.
                </p>
                <ul className="list-disc pl-6 space-y-2 text-[14px] leading-relaxed text-[#555]">
                  <li>Name, email address, and phone number submitted via forms.</li>
                  <li>Inquiry details (preferred date, group size, dietary requirements).</li>
                  <li>Job applicant CV details and work history where submitted.</li>
                </ul>
              </section>

              <hr className="border-t border-[#ebdcd0]" />

              {/* 3. Cookies & Analytics */}
              <section className="space-y-4">
                <h2 className="text-[22px] font-bold text-[#1e382f]">
                  3. Cookies &amp; Third-Party Services
                </h2>
                <p className="text-[14px] leading-relaxed text-[#555]">
                  We use cookies strictly necessary for the operation of this website. Table reservations are powered securely via the embedded TheFork booking widget.
                </p>
              </section>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
