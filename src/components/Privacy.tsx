import React, { useEffect } from 'react';

interface PrivacyProps {
  lang?: 'de' | 'en';
}

export const Privacy: React.FC<PrivacyProps> = ({ lang = 'en' }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="bg-[#f5f0e8] min-h-screen text-[#1a1a1a]" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
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
          <section className="space-y-4">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              1. General
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              We are MAATI (referred to as &quot;we&quot; or &quot;us&quot; or &quot;our&quot;). Unicorn Table UG registered office is at Lindenstraße 74, 10969 Berlin. MAATI is committed to protecting and respecting your privacy.
            </p>
            <p className="text-[14px] leading-relaxed text-[#555]">
              We provide a platform via our website (&quot;Website&quot;) for providing discretionary lending and investing advice only. These Terms apply to actual clients and anyone simply browsing our Website as a guest (either one referred to as &quot;you&quot; or &quot;your&quot;).
            </p>
            <p className="text-[14px] leading-relaxed text-[#555]">
              Please read this policy (&quot;Privacy Policy&quot;) carefully as it sets out the basis on which we collect any personal information from you when you use our Website and how we use it. We will ask you to consent to our Website Terms and our Privacy Policy when you first visit our Website. If you click &quot;OK&quot; or continue to browse and use the Digital Platform, you are agreeing to comply with and be bound by these Website Terms and our Privacy Policy.
            </p>
            <p className="text-[14px] leading-relaxed text-[#555]">
              We may change this Privacy Policy from time to time by updating this page. You should check this page from time to time to ensure you are happy with any changes. If you have any questions about this Privacy Policy, please contact us at{' '}
              <a href="mailto:hello@maatikitchen.com" className="text-[#d85c27] font-semibold hover:underline">
                hello@maatikitchen.com
              </a>
            </p>
            <p className="text-[14px] leading-relaxed text-[#555]">
              <strong>Notice to Customers of MAATI Clients:</strong> Where we collect personal information on behalf of our clients, MAATI acts as a &quot;data processor&quot; (as defined in the European General Data Protection Regulation (GDPR)) on behalf of its clients and this privacy policy shall not apply. Customers of our clients or any person providing information in connection with obtaining a product or service from a client of MAATI should consult directly with the concerned client to obtain a copy of the privacy policy issued by the client as &quot;controllers&quot; (as described in GDPR) which will apply in such instance.
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 2. What information do we collect */}
          <section className="space-y-4">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              2. What information do we collect from any user of the website?
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              You can browse this Website without giving us any information, and we won&apos;t know who you are. However, even if you are a guest, please bear in mind that we may:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[14px] leading-relaxed text-[#555]">
              <li>Record the areas of the Website which you visit and at what times.</li>
              <li>Record information about your activities in using the Website.</li>
              <li>Collect information about your computer, such as which browser you are using, your network location, your operating system, your IP address and the type of connection you are using (e.g. broadband, ADSL etc.); and store data that you submit to us via email, via our optional surveys, and through our contact form on the Website.</li>
              <li>If you email, telephone, write, or exchange other electronic communications with our employees and other staff members, our information technology systems will record details of those conversations and exchanges, sometimes including their content.</li>
            </ul>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 3. How will we use your information */}
          <section className="space-y-4">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              3. How will we use your information?
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              We will use the information you provide to us to provide you with our services and to improve our services. We may use your information for the following purposes:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-[14px] leading-relaxed text-[#555]">
              <li>To send you marketing communications regarding our products and services.</li>
              <li>To customize and personalize your experience with us; conduct research and analysis; and fulfil orders and requests for products, services, or information from you or the organization that you represent.</li>
              <li>For ordinary business purposes, including to operate and administer the products and services provided by us in accordance with the terms of any agreements that we may have with our clients.</li>
              <li>To operate, administer and improve our website and premises and other aspects of the way in which we conduct our operations.</li>
              <li>To comply with our legal and regulatory obligations, and to bring and defend legal claims where the information is pertinent (including to allow us to pursue available remedies or limit the damages that we may sustain).</li>
              <li>To comply with our internal policies and maintain our records or as otherwise required by applicable data protection laws.</li>
            </ul>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 4. Marketing & Newsletter */}
          <section className="space-y-4">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              4. Marketing &amp; Newsletter
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              We will provide you with our newsletter, information on our services and/or other marketing-related notices via email, in the case you have provided your prior consent. You will receive a confirmation email with regard to your registration.
            </p>
            <p className="text-[14px] leading-relaxed text-[#555]">
              If you decide at any time that you no longer wish to receive the mails, please contact us by email at{' '}
              <a href="mailto:hello@maatikitchen.com" className="text-[#d85c27] font-semibold hover:underline">
                hello@maatikitchen.com
              </a>.
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 5. Your Rights */}
          <section className="space-y-4">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              5. Your Rights
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              You may request details of personal information which we hold about you. If you would like a copy of the information held on you please contact us by email at{' '}
              <a href="mailto:hello@maatikitchen.com" className="text-[#d85c27] font-semibold hover:underline">
                hello@maatikitchen.com
              </a>. Any access request may be subject to a small fee to meet our costs in providing you with details of the information we hold about you.
            </p>
            <p className="text-[14px] leading-relaxed text-[#555]">
              If you think any information we have about you is incorrect or incomplete, please email us at{' '}
              <a href="mailto:hello@maatikitchen.com" className="text-[#d85c27] font-semibold hover:underline">
                hello@maatikitchen.com
              </a>{' '}
              as soon as possible. We will correct, delete or update any information as soon as possible.
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 6. Security and Third Party Content */}
          <section className="space-y-4">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              6. Security and Third Party Content
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              We are committed to ensuring that your information is secure. In order to prevent unauthorised access or disclosure we have put in place suitable physical, electronic and managerial procedures to safeguard and secure the information we collect online. Unfortunately, the transmission of information via the internet is not completely secure. Although we will do our best to protect your personal data, we cannot guarantee the security of your data transmitted to our Website; any transmission is at your own risk.
            </p>
            <p className="text-[14px] leading-relaxed text-[#555]">
              We may link to other websites which are not within our control. Once you have left our Website, we cannot be responsible for the content of other websites or for the protection and privacy of any information which you provide on these websites. Please note that these websites have their own privacy policies and website terms and conditions.
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 7. Retention */}
          <section className="space-y-4">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              7. How long do we keep your personal information?
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              We will retain your data in accordance with our Personal Data Retention Policy, which provide for a period of at least 7 years or longer as required by applicable law. We will delete the information that we hold about you when we no longer need it.
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* 8. Cookies */}
          <section className="space-y-4">
            <h2 className="text-[22px] font-bold text-[#1e382f]">
              8. Cookies
            </h2>
            <p className="text-[14px] leading-relaxed text-[#555]">
              We do not use cookies of any kind in our website, at the moment.
            </p>
          </section>

        </div>

      </div>
    </div>
  );
};
