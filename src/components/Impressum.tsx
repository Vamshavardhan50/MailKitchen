import React, { useEffect } from 'react';
import { Mail, Phone, MapPin, Building, ShieldCheck } from 'lucide-react';
import { SEO } from './SEO';

interface ImpressumProps {
  lang?: 'de' | 'en';
}

export const Impressum: React.FC<ImpressumProps> = ({ lang = 'de' }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return (
    <div className="bg-[#f5f0e8] min-h-screen text-[#1a1a1a]" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <SEO
        title="Impressum | MAATI Kitchen Berlin"
        description="Rechtliche Angaben und Impressum der Unicorn Table UG (MAATI Kitchen) nach § 5 TMG."
        canonicalUrl="https://maatikitchen.com/impressum"
        lang={lang}
      />
      <div className="max-w-[1000px] mx-auto px-6 md:px-10">

        {/* ── Page Header ── */}
        <div className="mb-10 text-center md:text-left">
          <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">
            Rechtliche Hinweise
          </span>
          <h1 className="text-[40px] md:text-[54px] font-black text-[#1e382f] leading-tight mt-1">
            Impressum
          </h1>
        </div>

        {/* ── Main Legal Content Card ── */}
        <div className="bg-[#fcf8f3] rounded-[28px] p-8 md:p-12 shadow-sm border border-[#ebdcd0]/80 space-y-10">

          {/* 1. Angaben gemäß § 5 TMG */}
          <section className="space-y-4">
            <h2 className="text-[22px] font-bold text-[#1e382f] flex items-center gap-2.5">
              <Building className="w-5 h-5 text-[#d85c27]" />
              Angaben gemäß § 5 TMG
            </h2>
            <div className="bg-white/80 rounded-[20px] p-6 border border-[#ebdcd0]/60 space-y-1.5 text-[15px] leading-relaxed text-[#333]">
              <p className="font-bold text-[17px] text-[#1a1a1a]">Unicorn Table UG</p>
              <p>Lindenstraße 74</p>
              <p>10969 Berlin</p>
            </div>
          </section>

          {/* 2. Vertreten durch */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#1e382f]">
              Vertreten durch:
            </h2>
            <div className="bg-white/80 rounded-[20px] p-6 border border-[#ebdcd0]/60 text-[15px] text-[#333]">
              <p className="font-semibold text-[#1a1a1a]">Naveen Prasad</p>
            </div>
          </section>

          {/* 3. Kontakt */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#1e382f]">
              Kontakt:
            </h2>
            <div className="bg-white/80 rounded-[20px] p-6 border border-[#ebdcd0]/60 space-y-3 text-[15px] text-[#333]">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#d85c27]" />
                <span>Telefon: </span>
                <a href="tel:+491729498262" className="font-semibold text-[#d85c27] hover:underline">
                  +49 1729498262
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#d85c27]" />
                <span>E-Mail: </span>
                <a href="mailto:hello@maatikitchen.com" className="font-semibold text-[#d85c27] hover:underline">
                  hello@maatikitchen.com
                </a>
              </div>
            </div>
          </section>

          {/* 4. Registereintrag */}
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#1e382f] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#d85c27]" />
              Registereintrag:
            </h2>
            <div className="bg-white/80 rounded-[20px] p-6 border border-[#ebdcd0]/60 space-y-1.5 text-[15px] text-[#333]">
              <p>Eintragung im Handelsregister.</p>
              <p><strong>Registergericht:</strong> Amtsgericht Charlottenburg</p>
              <p><strong>Registernummer:</strong> HRB 207902 B</p>
            </div>
          </section>

          {/* 5. Bildquellen */}
          <section className="space-y-3">
            <h2 className="text-[18px] font-bold text-[#1e382f]">
              Quellenangaben für die verwendeten Bilder und Grafiken:
            </h2>
            <p className="text-[14px] text-[#555]">
              <a
                href="http://de.fotolia.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#d85c27] font-semibold hover:underline"
              >
                http://de.fotolia.com/
              </a>
            </p>
          </section>

          <hr className="border-t border-[#ebdcd0]" />

          {/* ── Haftungsausschluss (Disclaimer) ── */}
          <div className="space-y-8 pt-2">
            <h2 className="text-[28px] font-black text-[#1e382f]">
              Haftungsausschluss (Disclaimer)
            </h2>

            {/* Haftung für Inhalte */}
            <div className="space-y-3">
              <h3 className="text-[19px] font-bold text-[#1a1a1a]">
                Haftung für Inhalte
              </h3>
              <p className="text-[14px] leading-relaxed text-[#555]">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Verpflichtungen zur Entfernung oder Sperrung der Nutzung von Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt. Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden von entsprechenden Rechtsverletzungen werden wir diese Inhalte umgehend entfernen.
              </p>
            </div>

            {/* Haftung für Links */}
            <div className="space-y-3">
              <h3 className="text-[19px] font-bold text-[#1a1a1a]">
                Haftung für Links
              </h3>
              <p className="text-[14px] leading-relaxed text-[#555]">
                Unser Angebot enthält Links zu externen Webseiten Dritter, auf deren Inhalte wir keinen Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar. Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Links umgehend entfernen.
              </p>
            </div>

            {/* Urheberrecht */}
            <div className="space-y-3">
              <h3 className="text-[19px] font-bold text-[#1a1a1a]">
                Urheberrecht
              </h3>
              <p className="text-[14px] leading-relaxed text-[#555]">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers. Downloads und Kopien dieser Seite sind nur für den privaten, nicht kommerziellen Gebrauch gestattet. Soweit die Inhalte auf dieser Seite nicht vom Betreiber erstellt wurden, werden die Urheberrechte Dritter beachtet. Insbesondere werden Inhalte Dritter als solche gekennzeichnet. Sollten Sie trotzdem auf eine Urheberrechtsverletzung aufmerksam werden, bitten wir um einen entsprechenden Hinweis. Bei Bekanntwerden von Rechtsverletzungen werden wir derartige Inhalte umgehend entfernen.
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
