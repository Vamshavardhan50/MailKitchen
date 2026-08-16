import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { SEO } from './SEO';
import { useEventsContent } from '../lib/sanityService';

interface EventsSectionProps {
  lang?: 'de' | 'en';
  onOpenReservation?: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ lang = 'en', onOpenReservation }) => {
  const isDe = lang === 'de';
  const { content } = useEventsContent();

  const headline = (isDe ? content.headlineDe : content.headlineEn) || (isDe ? 'Veranstalten Sie Ihr Event bei uns' : 'Host Your Own Event');
  const desc = (isDe ? content.descDe : content.descEn) || '';
  const bullet1 = (isDe ? content.bullet1De : content.bullet1En) || (isDe ? 'Individuelle Menüs' : 'Customizable Menus');
  const bullet2 = (isDe ? content.bullet2De : content.bullet2En) || (isDe ? 'Private & Halbprivate Bereiche' : 'Private or Semi-Private Spaces');
  const bullet3 = (isDe ? content.bullet3De : content.bullet3En) || (isDe ? 'Kompletter Catering-Service' : 'Full Catering Service Available');
  const ctaBtn = (isDe ? content.ctaBtnDe : content.ctaBtnEn) || (isDe ? 'Event Anfragen' : 'Inquire for Private Events');
  const eventImage = content.eventImage || '/assets/show2-CM6MShfY.jpeg';

  return (
    <section id="events" className="bg-[#f5f0e8] min-h-screen pt-[96px] sm:pt-[120px] md:pt-[150px] pb-16 sm:pb-28 px-4 sm:px-8 md:px-16 lg:px-24">
      <SEO
        title={isDe ? 'Events & Feiern | MAATI Kitchen Berlin' : 'Events & Private Dining | MAATI Kitchen Berlin'}
        description={
          isDe
            ? 'Veranstalten Sie Ihr privates Event, Catering oder Firmenfeier bei MAATI Kitchen in Berlin. Individuelle Menüs und einzigartiges Ambiente.'
            : 'Host your private event, birthday, corporate gathering, or catering with MAATI Kitchen in Berlin. Customizable menus and cozy modern space.'
        }
        canonicalUrl="https://maatikitchen.com/events"
        lang={lang}
      />

      <div className="max-w-[1360px] mx-auto">
        <div className="bg-[#1e382f] rounded-[28px] sm:rounded-[36px] overflow-hidden text-white grid grid-cols-1 lg:grid-cols-2 p-6 sm:p-10 md:p-16 lg:p-20 gap-8 sm:gap-12 lg:gap-16 items-center shadow-2xl border border-white/10">

          {/* ── Left Text ── */}
          <div className="flex flex-col justify-center">
            <h1 className="text-[40px] md:text-[54px] font-black leading-[1.08] mb-6 text-white tracking-tight">
              {headline}
            </h1>
            <p className="text-white/80 text-[15px] md:text-[16px] leading-relaxed max-w-[500px] mb-8">
              {desc}
            </p>

            {/* Checklist */}
            <div className="space-y-4 mb-10">
              {[bullet1, bullet2, bullet3].filter(Boolean).map((bullet, idx) => (
                <div key={idx} className="flex items-center gap-3.5">
                  <CheckCircle2 className="w-5 h-5 text-[#d85c27] shrink-0" />
                  <span className="font-semibold text-[15px] text-white">{bullet}</span>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <div>
              <button
                onClick={onOpenReservation}
                className="inline-flex items-center justify-center bg-[#d85c27] text-white font-bold px-8 py-4 rounded-full text-[15px] hover:bg-[#c2501f] transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                {ctaBtn}
              </button>
            </div>
          </div>

          {/* ── Right Image ── */}
          <div className="rounded-[28px] overflow-hidden h-[380px] md:h-[480px] lg:h-[520px] shadow-lg bg-[#142821] w-full">
            <img
              src={eventImage}
              alt="MAATI Event Space"
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
