import React, { useEffect } from 'react';
import { FileText, Building, Mail } from 'lucide-react';
import { SEO } from './SEO';

interface TermsProps {
  lang?: 'de' | 'en';
}

export const Terms: React.FC<TermsProps> = ({ lang = 'en' }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-[#f5f0e8] min-h-screen text-[#1a1a1a]" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <SEO
        title="Terms and Conditions | MAATI Kitchen Berlin"
        description="General terms and conditions of business for MAATI Kitchen (Unicorn Table UG)."
        canonicalUrl="https://maatikitchen.com/terms"
        lang={lang}
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
            <p className="font-bold text-[17px] text-[#1e382f]">The &apos;MAATI&apos; brand is used by</p>
            <p className="font-semibold text-[#1a1a1a]">Unicorn Table UG</p>
            <p>Lindenstraße 74, 10969 Berlin</p>
            <p>HRB 207902 B, Amtsgericht Charlottenburg</p>
            <p>
              E-Mail:{' '}
              <a href="mailto:hello@maatikitchen.com" className="text-[#d85c27] font-semibold hover:underline">
                hello@maatikitchen.com
              </a>
            </p>
          </div>

          {/* 1. General */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              1. General
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              The term &quot;MAATI&quot; or &quot;us&quot; or &quot;we&quot; refers to the owner of the website and other online offerings (altogether &quot;Digital Platform&quot;), Unicorn Table UG, whose registered office is at Lindenstraße 74, 10969 Berlin, Germany. The term &apos;you&apos; refers to the user or viewer of our Digital Platform. If you continue to browse and use the Digital Platform, you are agreeing to comply with and be bound by these terms of use, our privacy and cookie policy (altogether &quot;Terms of Use&quot;). If you disagree with any part of these Terms of Use, please do not use our Digital Platform.
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 2. Intended Use */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              2. Intended Use
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              Our Digital Platform is exclusively intended for use by representatives of companies and natural persons with place of residence in countries, which fulfil the statutory and contractual requirements for making use of the service offered by MAATI. The data, information or other content of the Digital Platform (altogether &quot;Content&quot;) may not be compliant with statutory requirements of locations outside of Germany.
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 3. No Offer */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              3. No Offer
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              No contractual relationship is formed between you and MAATI merely by retrieval of Content unless expressly stipulated otherwise; the Content does not constitute any kind of offer which can be accepted by you without a declaration by MAATI.
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 4. No Advice */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              4. No Advice
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              The Content does not constitute investment, legal advice and services, regulatory advice or services, financial reporting, insurance advice or services, taxation advice or services as well as any specialised, professional or technical advice or services including general financial and strategic advice. For such advice and services, you shall rely on other professional consultants as appropriate. In particular, the Content on mortgages is not to be understood as individual advice or recommendation. Investing is subject to various risks. Thus, it may be necessary to consult a professional adviser on financial, tax and/or legal matters. It shall be your own responsibility to ensure that any products, services or information available through this website meet your specific requirements.
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 5. Exclusion of Liability */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              5. Exclusion of Liability
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              The Content is presented merely with the aim to explain the few lending and investing process. Unless expressly stipulated otherwise by mandatory provisions of law and/or contractual provisions, MAATI assumes no liability for the completeness, timeliness and/or correctness of the Content. In addition, MAATI does not warrant that the Digital Platform can be used flawlessly and/or is free of any malware. MAATI may cease, interrupt and/or amend the operation of the Digital Platform or the access to the Digital Platform in whole or in part at any time without notice.
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 6. Third Party Content */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              6. Third Party Content
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              The responsibility for linked third party content on the Digital Platform lies with the operator of that third party content. We assume no liability for the completeness, timeliness and/or correctness of the third party content. We have reviewed the third party content with due care for illegal content. Later amendments are generally not considered. Insofar as we become aware of indications for illegal content, we will review the third party content and, if need be, remove it from the Digital Platform.
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 7. Copyright and other Property Rights */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              7. Copyright and other Property Rights
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              The Content presented on the Digital Platform (in particular text, pictures and graphics) is subject to copyright and property rights laws. A reproduction, dissemination, display or other exploitation (altogether &quot;Exploitation&quot;) is only permissible observing this legal framework. In general, every kind of Exploitation requires the prior approval of the respective rights holder. The Digital Platform may not be linked from third party websites without prior approval of MAATI.
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 8. Language of Contract */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              8. Language of Contract
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              English is the main language of most of the contracts.
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 9. Miscellaneous */}
          <section className="space-y-3">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              9. Miscellaneous
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              We may amend these Terms of Use at any time without prior notice. If, at any time, any provision of the Terms of Use are or become illegal, invalid or unenforceable in any respect under the law of any jurisdiction, neither the legality, validity or enforceability of any other provision of the Terms of Use nor the legality, validity or enforceability under the law of any other jurisdiction shall in any way be affected or impaired. Your use of Digital Platform and any dispute arising out of such use is subject to the laws of Germany. The courts of Berlin shall have exclusive jurisdiction to the extent that it is competent.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
