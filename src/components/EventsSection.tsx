import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface EventsSectionProps {
  lang: 'de' | 'en';
  onOpenReservation: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ lang, onOpenReservation }) => {
  const isDe = lang === 'de';

  return (
    <section id="events" className="bg-[#f5f0e8] pt-[120px] md:pt-[140px] pb-20 px-6 md:px-10">
      <div className="max-w-[1280px] mx-auto">
        <div className="bg-[#1e382f] rounded-[32px] overflow-hidden text-white grid grid-cols-1 lg:grid-cols-2 p-8 md:p-14 gap-10 items-center shadow-xl border border-white/10">

          {/* Left Text */}
          <div className="space-y-6">
            <h2 className="text-[38px] md:text-[50px] font-black leading-tight">
              {isDe ? 'Veranstalten Sie Ihr Event bei uns' : 'Host Your Own Event'}
            </h2>
            <p className="text-white/80 text-[15px] leading-relaxed max-w-[480px]">
              {isDe
                ? 'Suchen Sie nach einer einzigartigen Location? MAATI bietet Private Dining und Catering-Services für Geburtstage, Firmenfeiern und besondere Anlässe.'
                : 'Looking for a unique venue? MAATI offers private dining and catering services for birthdays, corporate gatherings, and celebrations. Let us bring the spice to your special day.'}
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d85c27]" />
                <span className="font-semibold text-[14px]">
                  {isDe ? 'Individuelle Menüs' : 'Customizable Menus'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d85c27]" />
                <span className="font-semibold text-[14px]">
                  {isDe ? 'Private & Halbprivate Bereiche' : 'Private or Semi-Private Spaces'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#d85c27]" />
                <span className="font-semibold text-[14px]">
                  {isDe ? 'Kompletter Catering-Service' : 'Full Catering Service Available'}
                </span>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={onOpenReservation}
                className="bg-[#d85c27] text-white font-bold px-7 py-3.5 rounded-full text-[15px] hover:bg-[#c2501f] transition-all transform hover:scale-105 shadow-md"
              >
                {isDe ? 'Event Anfragen' : 'Inquire for Private Events'}
              </button>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="rounded-[24px] overflow-hidden h-[360px] md:h-[420px]">
            <img
              src="/assets/show2-CM6MShfY.jpeg"
              alt="MAATI Event Space"
              className="w-full h-full object-cover"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
