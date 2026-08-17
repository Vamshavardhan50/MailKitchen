import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { useSiteSettings } from '../lib/sanityService';

// TikTok icon — clean white monochrome SVG for dark background
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.95a8.27 8.27 0 0 0 4.84 1.55V7.04a4.85 4.85 0 0 1-1.07-.35z"/>
  </svg>
);


interface FooterProps {
  lang?: 'de' | 'en';
  onOpenReservation?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang = 'en' }) => {
  const isDe = lang === 'de';
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-white text-[#1a1a1a] py-12 sm:py-16 md:py-20 px-5 sm:px-8 md:px-16 lg:px-24 border-t border-gray-100">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row justify-between items-start gap-10 sm:gap-12 md:gap-24">

        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 max-w-[420px]">
          {/* Brand Logo */}
          <Link to="/" className="inline-block mb-3 sm:mb-4">
            <h2 className="text-[#d85c27] font-black text-[24px] sm:text-[26px] tracking-normal uppercase leading-none">
              MAATI
            </h2>
          </Link>

          {/* Tagline */}
          <div className="text-[#666] text-[13.5px] sm:text-[14px] leading-relaxed mb-6 font-normal">
            <p>{isDe ? 'Verwurzelt in indischer Tradition.' : 'Rooted in Indian tradition.'}</p>
            <p>{isDe ? 'Neu interpretiert für den modernen Tisch.' : 'Reimagined for the modern table.'}</p>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 mb-6 text-[13.5px] sm:text-[14px] text-[#444]">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#d85c27] shrink-0 mt-0.5" />
              <span className="font-semibold uppercase tracking-wider text-[11px] leading-snug text-[#444]">
                {settings.address || 'ZIMMERSTR. 56, 10117'}<br />Berlin
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#d85c27] shrink-0" />
              <a href={`tel:${settings.phone || '+491729498262'}`} className="hover:text-[#d85c27] transition-colors">
                {settings.phone || '+49 1729498262'}
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#d85c27] shrink-0" />
              <a href={`mailto:${settings.email || 'hello@maatikitchen.com'}`} className="hover:text-[#d85c27] transition-colors">
                {settings.email || 'hello@maatikitchen.com'}
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-[12.5px] sm:text-[13px] text-[#777] leading-tight mb-4">
            <p>© 2026 MAATI Kitchen Berlin. All rights reserved.</p>
          </div>

          {/* Social Icons — Colored Brand Icons */}
          <div className="flex items-center gap-3">
            {/* Instagram — gradient pink/orange */}
            <a
              href={settings.instagram || 'https://instagram.com/maatikitchen'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform hover:scale-110 shadow-sm"
              style={{ background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}
            >
              <Instagram className="w-4 h-4 text-white" />
            </a>

            {/* Facebook — brand blue */}
            <a
              href={settings.facebook || 'https://facebook.com'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#1877F2] hover:bg-[#1465d8] transition-transform hover:scale-110 shadow-sm"
            >
              <Facebook className="w-4 h-4 text-white" />
            </a>

            {/* TikTok — brand dark (always visible) */}
            <a
              href={settings.tiktok || 'https://tiktok.com/@maatikitchen'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok"
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#010101] hover:bg-[#333] transition-transform hover:scale-110 shadow-sm"
            >
              <TikTokIcon />
            </a>

            {/* Email — brand orange */}
            <a
              href={`mailto:${settings.email || 'hello@maatikitchen.com'}`}
              aria-label="Email"
              className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#d85c27] hover:bg-[#c24f1c] transition-transform hover:scale-110 shadow-sm"
            >
              <Mail className="w-4 h-4 text-white" />
            </a>

          </div>
        </div>

        {/* ── RIGHT COLUMN: COMPANY ── */}
        <div className="w-full md:w-auto">
          <h4 className="font-black text-[12.5px] sm:text-[13px] tracking-widest uppercase text-[#1a1a1a] mb-4 sm:mb-5">
            COMPANY
          </h4>
          <ul className="space-y-3 text-[13.5px] sm:text-[14px] text-[#444]">
            <li>
              <Link to="/about" className="hover:text-[#d85c27] transition-colors">
                {isDe ? 'Über uns' : 'About Us'}
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:text-[#d85c27] transition-colors">
                {isDe ? 'Datenschutz' : 'Privacy Policy'}
              </Link>
            </li>
            <li>
              <Link to="/impressum" className="hover:text-[#d85c27] transition-colors">
                Impressum
              </Link>
            </li>
            <li>
              <Link to="/terms" className="hover:text-[#d85c27] transition-colors">
                {isDe ? 'Allgemeine Geschäftsbedingungen' : 'Terms and Conditions'}
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
};
