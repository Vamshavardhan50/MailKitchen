import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Globe, ChevronDown, Menu as MenuIcon, X } from 'lucide-react';
import { DICTIONARY } from '../data/content';

interface NavbarProps {
  lang: 'de' | 'en';
  setLang: (lang: 'de' | 'en') => void;
  onOpenReservation: () => void;
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ lang, setLang, onOpenReservation, onOpenSearch }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const text = DICTIONARY[lang];
  const isDe = lang === 'de';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1e382f] text-white shadow-lg" style={{ height: '72px' }}>
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 h-full flex items-center justify-between relative">

        {/* LEFT NAV */}
        <nav className="hidden md:flex items-center gap-8 font-bold text-[15px] text-white">
          <Link to="/menu" className="hover:text-[#d85c27] transition-colors">{text.nav_menu}</Link>
          <Link to="/events" className="hover:text-[#d85c27] transition-colors">{text.nav_events}</Link>
          <Link to="/about" className="hover:text-[#d85c27] transition-colors">{text.nav_about}</Link>
          <Link to="/locations" className="hover:text-[#d85c27] transition-colors">{text.nav_locations}</Link>
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-1 text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>

        {/* CENTER LOGO (matching user reference screenshot) */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center py-1">
          <img
            src="/assets/logo-C86A0r1B.png"
            alt="maati - fresh indian food, made your way"
            className="w-auto object-contain drop-shadow-md"
            style={{ height: '300px' }}
          />
        </Link>

        {/* RIGHT CONTROLS */}
        <div className="hidden md:flex items-center gap-4">
          {/* Search Button */}
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Reservations CTA */}
          <button
            onClick={onOpenReservation}
            className="bg-[#d85c27] text-white font-bold text-[14px] px-5 py-2.5 rounded-full hover:bg-[#c2501f] transition-all shadow-md transform hover:scale-105"
          >
            {text.nav_reservations}
          </button>

          {/* Language Toggle */}
          <button
            onClick={() => setLang(lang === 'en' ? 'de' : 'en')}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-[13px] font-bold px-3 py-2 rounded-full transition-colors border border-white/15"
          >
            <Globe className="w-4 h-4 text-[#d85c27]" />
            <span className="uppercase">{lang}</span>
            <ChevronDown className="w-3 h-3 opacity-70" />
          </button>
        </div>

      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[88px] left-0 right-0 bg-[#1e382f] border-t border-white/10 shadow-xl z-40">
          <nav className="flex flex-col px-6 py-4 gap-4 font-bold text-white text-[16px]">
            <Link to="/menu" onClick={() => setMobileOpen(false)} className="hover:text-[#d85c27]">{text.nav_menu}</Link>
            <Link to="/events" onClick={() => setMobileOpen(false)} className="hover:text-[#d85c27]">{text.nav_events}</Link>
            <Link to="/about" onClick={() => setMobileOpen(false)} className="hover:text-[#d85c27]">{text.nav_about}</Link>
            <Link to="/locations" onClick={() => setMobileOpen(false)} className="hover:text-[#d85c27]">{text.nav_locations}</Link>
            <button
              onClick={() => { onOpenSearch(); setMobileOpen(false); }}
              className="flex items-center gap-2 text-white/90 hover:text-[#d85c27]"
            >
              <Search className="w-5 h-5 text-[#d85c27]" />
              <span>{isDe ? 'Speisekarte durchsuchen' : 'Search Menu'}</span>
            </button>
            <button
              onClick={() => { onOpenReservation(); setMobileOpen(false); }}
              className="w-full text-center bg-[#d85c27] text-white py-3 rounded-full font-bold"
            >
              {text.nav_reservations}
            </button>
            <button
              onClick={() => { setLang(lang === 'en' ? 'de' : 'en'); setMobileOpen(false); }}
              className="flex items-center gap-2 text-white/80 text-sm"
            >
              <Globe className="w-4 h-4 text-[#d85c27]" />
              <span>{isDe ? 'Sprache wechseln: English (EN)' : 'Sprache wechseln: Deutsch (DE)'}</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
