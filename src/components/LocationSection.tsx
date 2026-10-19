import React from 'react';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { DICTIONARY } from '../data/content';
import { SEO } from './SEO';
import { useContactContent, useSiteSettings } from '../lib/sanityService';

interface LocationSectionProps {
  lang: 'de' | 'en';
  onOpenReservation: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ lang, onOpenReservation }) => {
  const text = DICTIONARY[lang];
  const isDe = lang === 'de';
  const { content: contact } = useContactContent();
  const { settings } = useSiteSettings();

  // Primary phone is landline, secondary phone is mobile
  const primaryPhone = '+49 30 51891367';
  const mobilePhone = '+49 172 9498262';
  const phone = contact.phone || settings.phone || primaryPhone;
  const email = contact.email || settings.email || 'hello@maatikitchen.com';
  const address = contact.address || settings.address || 'Zimmerstraße 56, 10117 Berlin';
  const rawHoursDe = contact.openingHoursDe || settings.openingHoursDe || '';
  const rawHoursEn = contact.openingHoursEn || settings.openingHoursEn || '';
  
  // Confirmed opening hours: Mon–Wed 11:00–16:00, Thu–Sat 11:00–21:00, Sun 11:30–18:00
  const openingHours = isDe
    ? (rawHoursDe && !rawHoursDe.includes('Geschlossen') && !rawHoursDe.includes('21:30')
        ? rawHoursDe
        : 'Montag – Mittwoch: 11:00 – 16:00\nDonnerstag – Samstag: 11:00 – 21:00\nSonntag: 11:30 – 18:00')
    : (rawHoursEn && !rawHoursEn.includes('Closed') && !rawHoursEn.includes('21:30')
        ? rawHoursEn
        : 'Monday – Wednesday: 11:00 – 16:00\nThursday – Saturday: 11:00 – 21:00\nSunday: 11:30 – 18:00');

  const headline = isDe
    ? (contact.locationHeadlineDe || 'MAATI Berlin')
    : (contact.locationHeadlineEn || 'MAATI Berlin');

  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const isKontakt = currentPath.includes('kontakt') || currentPath.includes('contact');
  const canonicalUrl = isDe
    ? (isKontakt ? 'https://maatikitchen.com/de/kontakt' : 'https://maatikitchen.com/de/locations')
    : (isKontakt ? 'https://maatikitchen.com/contact' : 'https://maatikitchen.com/locations');

  // Restaurant schema with exact 7-day confirmed opening hours
  const locationRestaurantSchema = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': 'https://maatikitchen.com/#restaurant',
    'name': 'MAATI Kitchen',
    'url': isDe ? 'https://maatikitchen.com/de' : 'https://maatikitchen.com/',
    'telephone': '+49 30 51891367',
    'email': 'hello@maatikitchen.com',
    'servesCuisine': 'Indian, Fast Casual, Bowls, Vegan Options, Vegetarian Options',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Zimmerstraße 56',
      'addressLocality': 'Berlin',
      'postalCode': '10117',
      'addressCountry': 'DE'
    },
    'geo': {
      '@type': 'GeoCoordinates',
      'latitude': 52.5081,
      'longitude': 13.3949
    },
    'openingHoursSpecification': [
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday'],
        'opens': '11:00',
        'closes': '16:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Thursday', 'Friday', 'Saturday'],
        'opens': '11:00',
        'closes': '21:00'
      },
      {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': ['Sunday'],
        'opens': '11:30',
        'closes': '18:00'
      }
    ]
  };

  return (
    <section id="location" className="bg-[#f5f0e8] min-h-screen pt-[96px] sm:pt-[120px] md:pt-[150px] pb-16 sm:pb-28 px-4 sm:px-8 md:px-16 lg:px-24">
      <SEO
        title={isDe ? 'Anfahrt & Öffnungszeiten | MAATI Kitchen Berlin Mitte' : 'Location & Opening Hours | MAATI Kitchen Berlin Mitte'}
        description={
          isDe
            ? 'MAATI Kitchen in der Zimmerstraße 56, 10117 Berlin, nahe Checkpoint Charlie. Öffnungszeiten, Anfahrt und Kontakt zu unserem indischen Café.'
            : 'Visit MAATI Kitchen at Zimmerstraße 56, 10117 Berlin, near Checkpoint Charlie. Find opening hours, directions and contact details for our Indian café.'
        }
        canonicalUrl={canonicalUrl}
        lang={lang}
        enPath={isKontakt ? '/contact' : '/locations'}
        structuredData={locationRestaurantSchema}
      />

      <div className="max-w-[1360px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 items-stretch">

          {/* ── Left: Info Card ── */}
          <div className="bg-white rounded-[28px] sm:rounded-[32px] p-6 sm:p-10 md:p-14 shadow-sm border border-gray-100 flex flex-col justify-between space-y-8 sm:space-y-10">
            <div>
              <h1 className="text-[34px] md:text-[44px] font-black text-[#1a1a1a] leading-tight mb-8">
                {isDe ? 'MAATI Kitchen in Berlin Mitte finden' : 'Find MAATI Kitchen in Berlin Mitte'}
              </h1>

              <div className="space-y-7">
                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-[#1a1a1a] mb-1">{text.location_address}</p>
                    <p className="text-[#666] text-[14px] leading-relaxed">{address}</p>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
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
                    <div className="space-y-1">
                      <div>
                        <a href={`tel:${phone.replace(/\s/g, '')}`} className="text-[#1a1a1a] font-medium text-[14px] hover:text-[#d85c27] transition-colors">
                          {phone}
                        </a>
                        <span className="text-[11px] text-[#888] ml-2 font-normal">({isDe ? 'Festnetz' : 'Landline'})</span>
                      </div>
                      <div>
                        <a href={`tel:${mobilePhone.replace(/\s/g, '')}`} className="text-[#666] text-[13px] hover:text-[#d85c27] transition-colors">
                          {mobilePhone}
                        </a>
                        <span className="text-[11px] text-[#888] ml-2 font-normal">({isDe ? 'Mobil / WhatsApp' : 'Mobile / WhatsApp'})</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#fdf5f0] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-5 h-5 text-[#d85c27]" />
                  </div>
                  <div>
                    <p className="font-bold text-[15px] text-[#1a1a1a] mb-1">{text.location_email}</p>
                    <a href={`mailto:${email}`} className="text-[#666] text-[14px] hover:text-[#d85c27] transition-colors">
                      {email}
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
                    <p className="text-[#666] text-[14px] whitespace-pre-line leading-relaxed">
                      {openingHours}
                    </p>
                  </div>
                </div>
                {/* Public Transport & Walking Directions */}
                <div className="p-4 rounded-2xl bg-[#fdfaf7] border border-[#ebdcd0]/70 space-y-2 text-[13px] text-[#555]">
                  <strong className="text-[#1e382f] block text-[13.5px]">
                    {isDe ? 'Öffentliche Verkehrsmittel & Anfahrt:' : 'Public Transit & Walking:'}
                  </strong>
                  <p>
                    {isDe
                      ? '• U-Bahn: U6 Kochstraße / Checkpoint Charlie (ca. 3 Min. zu Fuß) oder U2 Stadtmitte (ca. 6 Min. zu Fuß)'
                      : '• U-Bahn: U6 Kochstraße / Checkpoint Charlie (3 min walk) or U2 Stadtmitte (6 min walk)'}
                  </p>
                  <p>
                    {isDe
                      ? '• Bus: M29 Charlottenstraße / U Kochstraße'
                      : '• Bus: M29 Charlottenstraße / U Kochstraße'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenReservation}
                className="w-full sm:w-auto bg-[#d85c27] text-white font-extrabold px-8 py-4 rounded-full text-[15px] hover:bg-[#c2501f] transition-all transform hover:scale-105 shadow-md"
              >
                {isDe ? 'Tisch reservieren' : 'Make a Reservation'}
              </button>
              <a
                href={`https://maps.google.com/?q=${encodeURIComponent(address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="border-2 border-[#1e382f] text-[#1e382f] hover:bg-[#1e382f] hover:text-white font-bold px-7 py-3 rounded-full text-[14px] transition-colors"
              >
                {isDe ? 'Route planen' : 'Get Directions'}
              </a>
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
