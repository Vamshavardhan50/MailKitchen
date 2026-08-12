import React from 'react';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { DICTIONARY } from '../data/content';

interface LocationSectionProps {
  lang: 'de' | 'en';
  onOpenReservation: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ lang, onOpenReservation }) => {
  const text = DICTIONARY[lang];

  return (
    <section id="location" className="bg-[#f5f0e8] py-20 px-6 md:px-10">
      <div className="max-w-[1280px] mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* Left: Info Card */}
          <div className="bg-white rounded-[28px] p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col justify-between space-y-8">
            <div>
              <h2 className="text-[28px] md:text-[34px] font-black text-[#1a3626] leading-tight mb-6">
                MAATI Berlin
              </h2>

              <div className="space-y-6">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-[#1a1a1a] mb-0.5">{text.location_address}</p>
                    <p className="text-[#666] text-[13px]">Zimmerstr. 56<br />10117 Berlin, Germany</p>
                    <a
                      href="https://maps.google.com/?q=Zimmerstrasse+56,+10117+Berlin"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#d85c27] font-bold text-[12px] mt-1 inline-block hover:underline"
                    >
                      {text.location_directions}
                    </a>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0">
                    <Phone className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-[#1a1a1a] mb-0.5">{text.location_phone}</p>
                    <a href="tel:+491729498262" className="text-[#666] text-[13px] hover:text-[#d85c27]">
                      +49 172 9498262
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div>
                    <p className="font-bold text-[14px] text-[#1a1a1a] mb-0.5">{text.location_email}</p>
                    <a href="mailto:hello@maatikitchen.com" className="text-[#666] text-[13px] hover:text-[#d85c27]">
                      hello@maatikitchen.com
                    </a>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-[14px] text-[#1a1a1a] mb-2">{text.location_hours}</p>
                    <div className="space-y-1 text-[13px] text-[#666]">
                      <div className="flex justify-between max-w-[280px]">
                        <span>{text.location_mon_fri}</span><span className="font-bold text-[#1a1a1a]">08:00 - 15:00</span>
                      </div>
                      <div className="flex justify-between max-w-[280px]">
                        <span>{text.location_sat}</span><span className="font-bold text-[#1a1a1a]">11:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between max-w-[280px]">
                        <span>{text.location_sun}</span><span className="font-bold text-[#1a1a1a]">{text.location_closed}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenReservation}
              className="w-full bg-[#d85c27] text-white font-bold py-3.5 rounded-xl text-[15px] hover:bg-[#c2501f] transition-colors text-center"
            >
              {text.location_book}
            </button>
          </div>

          {/* Right: Map Container */}
          <div className="rounded-[28px] overflow-hidden min-h-[440px] shadow-sm border border-gray-100 bg-white">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2428.6282956823694!2d13.38869!3d52.50722!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47a851f6a6f16fdb%3A0x8fcc8b2b5e7e1e5b!2sZimmerstra%C3%9Fe+56%2C+10117+Berlin!5e0!3m2!1sen!2sde!4v1596000000000!5m2!1sen!2sde"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '440px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MAATI Kitchen Location"
            />
          </div>

        </div>
      </div>
    </section>
  );
};

