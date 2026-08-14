import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';

interface FooterProps {
  lang?: 'de' | 'en';
  onOpenReservation?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ lang = 'en' }) => {
  const isDe = lang === 'de';

  return (
    <footer className="bg-white text-[#1a1a1a] py-16 md:py-20 px-8 sm:px-14 md:px-24 lg:px-36 xl:px-44 border-t border-gray-100">
      <div className="max-w-[1360px] mx-auto flex flex-col md:flex-row justify-between items-start gap-12 md:gap-24">

        {/* ── LEFT COLUMN ── */}
        <div className="flex-1 max-w-[420px]">
          {/* Brand Logo */}
          <Link to="/" className="inline-block mb-4">
            <h2 className="text-[#d85c27] font-black text-[26px] tracking-normal uppercase leading-none">
              MAATI
            </h2>
          </Link>

          {/* Tagline */}
          <div className="text-[#666] text-[14px] leading-relaxed mb-6 font-normal">
            <p>{isDe ? 'Verwurzelt in indischer Tradition.' : 'Rooted in Indian tradition.'}</p>
            <p>{isDe ? 'Neu interpretiert für den modernen Tisch.' : 'Reimagined for the modern table.'}</p>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 mb-6 text-[14px] text-[#444]">
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[#d85c27] shrink-0 mt-0.5" />
              <span className="font-semibold uppercase tracking-wider text-[11px] leading-snug text-[#444]">
                ZIMMERSTR. 56, 10117<br />Berlin
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-[#d85c27] shrink-0" />
              <a href="tel:+491729498262" className="hover:text-[#d85c27] transition-colors text-[14px]">
                +49 1729498262
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-[#d85c27] shrink-0" />
              <a href="mailto:hello@maatikitchen.com" className="hover:text-[#d85c27] transition-colors text-[14px]">
                hello@maatikitchen.com
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-[13px] text-[#777] leading-tight mb-4">
            <p>@2026 MAATI. All rights</p>
            <p>reserved.</p>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 text-[#333]">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d85c27] transition-colors"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#d85c27] transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="mailto:hello@maatikitchen.com"
              className="hover:text-[#d85c27] transition-colors"
              aria-label="Email"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* ── RIGHT COLUMN: COMPANY ── */}
        <div className="w-full md:w-auto">
          <h4 className="font-black text-[13px] tracking-widest uppercase text-[#1a1a1a] mb-5">
            COMPANY
          </h4>
          <ul className="space-y-3.5 text-[14px] text-[#444]">
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
            <li className="pt-2">
              <Link to="/studio" className="text-[12px] font-bold text-[#d85c27] hover:underline flex items-center gap-1">
                <span>⚙️ Admin Panel / Studio</span>
              </Link>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  );
};
