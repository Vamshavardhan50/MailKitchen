import React from 'react';
import { phoneHref } from '../lib/phone';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { DICTIONARY } from '../data/content';
import { SEO } from './SEO';
import { useContactContent } from '../lib/sanityService';

interface LocationSectionProps {
  lang: 'de' | 'en';
  onOpenReservation: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ lang, onOpenReservation }) => {
  const text = DICTIONARY[lang];
  const isDe = lang === 'de';
  const { content: contact } = useContactContent();
  const { phone, mobilePhone, address, email } = contact;
  const headline = isDe ? contact.locationHeadlineDe : contact.locationHeadlineEn;
  const subheadline = isDe ? contact.headlineDe : contact.headlineEn;
  const description = isDe ? contact.descDe : contact.descEn;
  const openingHours = isDe ? contact.openingHoursDe : contact.openingHoursEn;
  const directions = isDe ? contact.directionsDe : contact.directionsEn;
  const addressQuery = address ? encodeURIComponent(address) : '';
  const mapUrl = contact.googleMapsUrl && /^https?:\/\//i.test(contact.googleMapsUrl)
    ? contact.googleMapsUrl
    : addressQuery && `https://maps.google.com/?q=${addressQuery}`;

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const isKontakt = currentPath.includes('kontakt') || currentPath.includes('contact');
  const canonicalUrl = isDe
    ? (isKontakt ? 'https://maatikitchen.com/de/kontakt' : 'https://maatikitchen.com/de/locations')
    : (isKontakt ? 'https://maatikitchen.com/contact' : 'https://maatikitchen.com/locations');

  const locationRestaurantSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': 'https://maatikitchen.com/#restaurant',
    'name': 'MAATI Kitchen',
    'url': isDe ? 'https://maatikitchen.com/de' : 'https://maatikitchen.com/',
    telephone: phone || mobilePhone || undefined,
    email: email || undefined,
    address: address || undefined,
    openingHours: openingHours?.split('\n').filter(Boolean),
    servesCuisine: 'Indian, Fast Casual, Bowls, Vegan Options, Vegetarian Options',
  };

  return (
    <section id="location" className="bg-[#f5f0e8] min-h-screen pt-[96px] sm:pt-[120px] md:pt-[150px] pb-16 sm:pb-28 px-4 sm:px-8 md:px-16 lg:px-24">
      <SEO
        title={isDe ? 'Anfahrt & Öffnungszeiten | MAATI Kitchen Berlin Mitte' : 'Location & Opening Hours | MAATI Kitchen Berlin Mitte'}
        description={description || headline || 'MAATI Kitchen'}
        canonicalUrl={canonicalUrl}
        lang={lang}
        enPath={isKontakt ? '/contact' : '/locations'}
        structuredData={locationRestaurantSchema}
      />

      <div className="max-w-[1360px] mx-auto">
        <div className={`grid grid-cols-1 ${addressQuery ? 'lg:grid-cols-2' : ''} gap-8 sm:gap-10 items-stretch`}>

          {/* ── Left: Info Card ── */}
          <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 md:p-14 shadow-sm border border-gray-100 flex flex-col justify-between space-y-8 sm:space-y-10">
            <div>
              {headline && <h1 className="text-[34px] md:text-[44px] font-black text-[#1a1a1a] leading-tight mb-8">
                {headline}
              </h1>}
              {subheadline && <h2 className="text-xl font-bold text-[#1e382f] mb-2">{subheadline}</h2>}
              {description && <p className="text-[#666] whitespace-pre-line mb-6">{description}</p>}

              <div className="space-y-7">
                {/* Address */}
                {address && <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-[#1a1a1a] mb-1">{text.location_address}</p>
                    <p className="text-[#666] text-[14px] leading-relaxed">{address}</p>
                    <a
                      href={mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#d85c27] font-bold text-[13px] mt-2 inline-block hover:underline"
                    >
                      {text.location_directions} →
                    </a>
                  </div>
                </div>}

                {/* Phone */}
                {(phone || mobilePhone) && <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-[#1a1a1a] mb-1">{text.location_phone}</p>
                    <div className="space-y-1">
                      {phone && <div>
                        <a href={phoneHref(phone)} className="text-[#1a1a1a] font-medium text-[14px] hover:text-[#d85c27] transition-colors">
                          {phone}
                        </a>
                        <span className="text-[11px] text-[#888] ml-2 font-normal">({isDe ? 'Festnetz' : 'Landline'})</span>
                      </div>}
                      {mobilePhone && <div>
                        <a href={phoneHref(mobilePhone)} className="text-[#666] text-[13px] hover:text-[#d85c27] transition-colors">
                          {mobilePhone}
                        </a>
                        <span className="text-[11px] text-[#888] ml-2 font-normal">({isDe ? 'Mobil / WhatsApp' : 'Mobile / WhatsApp'})</span>
                      </div>}
                    </div>
                  </div>
                </div>}

                {/* Email */}
                {email && <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-[#1a1a1a] mb-1">{text.location_email}</p>
                    <a href={`mailto:${email}`} className="text-[#666] text-[14px] hover:text-[#d85c27] transition-colors">
                      {email}
                    </a>
                  </div>
                </div>}

                {/* Opening Hours */}
                {openingHours && <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-[#1a1a1a] mb-1">{text.location_hours}</p>
                    <p className="text-[#666] text-[14px] whitespace-pre-line leading-relaxed">
                      {openingHours}
                    </p>
                  </div>
                </div>}
                {/* Public Transport & Walking Directions */}
                {directions && <div className="p-4 rounded-2xl bg-[#fdfaf7] border border-[#ebdcd0]/70 space-y-2 text-[13px] text-[#555]">
                  <strong className="text-[#1e382f] block text-[13.5px]">
                    {isDe ? 'Öffentliche Verkehrsmittel & Anfahrt:' : 'Public Transit & Walking:'}
                  </strong>
                  <p className="whitespace-pre-line">{directions}</p>
                </div>}
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenReservation}
                className="w-full sm:w-auto bg-[#d85c27] text-white font-extrabold px-8 py-4 rounded-full text-[15px] hover:bg-[#c2501f] transition-all transform hover:scale-105 shadow-md"
              >
                {isDe ? 'Tisch reservieren' : 'Make a Reservation'}
              </button>
              {mapUrl && <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#1e382f] text-[#1e382f] hover:bg-[#1e382f] hover:text-white font-bold px-7 py-3 rounded-full text-[14px] transition-colors"
              >
                {isDe ? 'Route planen' : 'Get Directions'}
              </a>}
            </div>
          </div>

          {/* ── Right: Google Map Container ── */}
          {addressQuery && <div className="rounded-[32px] overflow-hidden border border-gray-100 shadow-sm min-h-[460px] bg-white">
            <iframe
              src={`https://maps.google.com/maps?q=${addressQuery}&hl=${lang}&output=embed`}
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: '460px' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="MAATI Kitchen Berlin Map"
            />
          </div>}

        </div>
      </div>
    </section>
  );
};
