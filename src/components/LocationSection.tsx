import React from 'react';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { DICTIONARY } from '../data/content';
import { SEO } from './SEO';

interface LocationSectionProps {
  lang: 'de' | 'en';
  onOpenReservation: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ lang, onOpenReservation }) => {
  const text = DICTIONARY[lang];
  const isDe = lang === 'de';

  return (
    <section id="location" className="bg-[#f5f0e8] min-h-screen pt-[96px] sm:pt-[120px] md:pt-[150px] pb-16 sm:pb-28 px-4 sm:px-8 md:px-16 lg:px-24">
      <SEO
        title={isDe ? 'Standort & Kontakt | MAATI Kitchen Berlin' : 'Location & Hours | MAATI Kitchen Berlin'}
        description={
          isDe
            ? 'Finden Sie uns in der Zimmerstraße 56, 10117 Berlin Mitte (nahe Checkpoint Charlie). Öffnungszeiten, Anfahrt und Tischreservierung.'
            : 'Find MAATI Kitchen at Zimmerstraße 56, 10117 Berlin (near Checkpoint Charlie). Opening hours, directions, and reservations.'
        }
        canonicalUrl="https://maatikitchen.com/locations"
        lang={lang}
      />

      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-stretch">

          {/* ── Left: Info Card ── */}
          <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 md:p-14 shadow-sm border border-gray-100 flex flex-col justify-between space-y-8 sm:space-y-10">
            <div>
              <h1 className="text-[34px] md:text-[44px] font-black text-[#1a1a1a] leading-tight mb-8">
                MAATI Berlin
              </h1>

              <div className="space-y-7">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-[#1a1a1a] mb-1">{text.location_address}</p>
                    <p className="text-[#666] text-[14px] leading-relaxed">Zimmerstr. 56<br />10117 Berlin, Germany</p>
                    <a
                      href="https://maps.google.com/?q=Zimmerstrasse+56,+10117+Berlin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#d85c27] font-bold text-[13px] mt-2 inline-block hover:underline"
                    >
                      {text.location_directions} →
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-[#1a1a1a] mb-1">{text.location_phone}</p>
                    <a href="tel:+491729498262" className="text-[#666] text-[14px] hover:text-[#d85c27] transition-colors">
                      +49 172 9498262
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-[#1a1a1a] mb-1">{text.location_email}</p>
                    <a href="mailto:hello@maatikitchen.com" className="text-[#666] text-[14px] hover:text-[#d85c27] transition-colors">
                      hello@maatikitchen.com
                    </a>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-[#1a1a1a] mb-1">{text.location_hours}</p>
                    <p className="text-[#666] text-[14px]">
                      {text.location_mon_fri}: 11:30 - 21:30<br />
                      {text.location_sat}: 12:00 - 21:00<br />
                      {text.location_sun}: {text.location_closed}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100">
              <button
                onClick={onOpenReservation}
                className="w-full sm:w-auto bg-[#d85c27] text-white font-bold px-8 py-4 rounded-full text-[15px] hover:bg-[#c2501f] transition-all transform hover:scale-105 shadow-md"
              >
                {text.hero_btn_res}
              </button>
            </div>
          </div>

          {/* ── Right: Google Map Container ── */}
          <div className="rounded-[32px] overflow-hidden border border-gray-100 shadow-sm min-h-[460px] bg-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.6282956823694!2d13.38869!3d52.50722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851f6a6f16fdb%3A0x8fcc8b2b5e7e1e5b!2sZimmerstra%C3%9Fe+56%2C+10117+Berlin!5e0!3m2!1sen!2sde!4v1596000000000!5m2!1sen!2sde"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '460px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MAATI Kitchen Berlin Map"
            />
          </div>

        </div>
      </div>
    </section>
  );
};
