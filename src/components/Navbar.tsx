import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const text = DICTIONARY[lang];
  const isDe = lang === 'de';

  const handleCateringClick = (e: React.MouseEvent) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById('catering');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setMobileOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1e382f] text-white shadow-lg" style={{ height: '72px' }}>
      <div className="max-w-[1360px] mx-auto px-6 md:px-8 h-full flex items-center justify-between relative">

        {/* LEFT NAV (1. About Us, 2. Events, 3. Catering, 4. Menu, 5. Contact Us) */}
        <nav className="hidden lg:flex items-center gap-7 font-bold text-[14.5px] text-white">
          <Link to="/about" className="hover:text-[#d85c27] transition-colors">
            {isDe ? 'Über uns' : 'About Us'}
          </Link>
          <Link to="/events" className="hover:text-[#d85c27] transition-colors">
            Events
          </Link>
          <a
            href="/#catering"
            onClick={handleCateringClick}
            className="hover:text-[#d85c27] transition-colors cursor-pointer"
          >
            Catering
          </a>
          <Link to="/menu" className="hover:text-[#d85c27] transition-colors">
            {isDe ? 'Speisekarte' : 'Menu'}
          </Link>
          <Link to="/locations" className="hover:text-[#d85c27] transition-colors">
            {isDe ? 'Kontakt' : 'Contact Us'}
          </Link>
        </nav>

        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-1 text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
        </button>

        {/* CENTER LOGO */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center py-1 pointer-events-none">
          <img
            src="/assets/logo-C86A0r1B.png"
            alt="maati - fresh indian food, made your way"
            className="w-auto object-contain drop-shadow-md h-[160px] sm:h-[220px] lg:h-[300px] pointer-events-auto"
          />
        </Link>

        {/* Mobile Right Controls */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className="p-1.5 text-white/80 hover:text-white"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setLang(lang === 'en' ? 'de' : 'en')}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-[12px] font-bold px-2.5 py-1 rounded-full border border-white/15"
          >
            <Globe className="w-3.5 h-3.5 text-[#d85c27]" />
            <span className="uppercase">{lang}</span>
          </button>
        </div>

        {/* RIGHT CONTROLS (DESKTOP) */}
        <div className="hidden lg:flex items-center gap-4">
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
            {text.nav_reservations || (isDe ? 'Reservieren' : 'Reservations')}
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
        <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-[#1e382f] border-t border-white/10 shadow-xl z-40">
          <nav className="flex flex-col px-6 py-4 gap-4 font-bold text-white text-[16px]">
            <Link to="/about" onClick={() => setMobileOpen(false)} className="hover:text-[#d85c27]">
              {isDe ? 'Über uns' : 'About Us'}
            </Link>
            <Link to="/events" onClick={() => setMobileOpen(false)} className="hover:text-[#d85c27]">
              Events
            </Link>
            <a href="/#catering" onClick={handleCateringClick} className="hover:text-[#d85c27]">
              Catering
            </a>
            <Link to="/menu" onClick={() => setMobileOpen(false)} className="hover:text-[#d85c27]">
              {isDe ? 'Speisekarte' : 'Menu'}
            </Link>
            <Link to="/locations" onClick={() => setMobileOpen(false)} className="hover:text-[#d85c27]">
              {isDe ? 'Kontakt' : 'Contact Us'}
            </Link>
            <button
              onClick={() => { onOpenSearch(); setMobileOpen(false); }}
              className="flex items-center gap-2 text-white/90 hover:text-[#d85c27] pt-2 border-t border-white/10"
            >
              <Search className="w-5 h-5 text-[#d85c27]" />
              <span>{isDe ? 'Speisekarte durchsuchen' : 'Search Menu'}</span>
            </button>
            <button
              onClick={() => { onOpenReservation(); setMobileOpen(false); }}
              className="w-full text-center bg-[#d85c27] text-white py-3 rounded-full font-bold shadow-md"
            >
              {text.nav_reservations || (isDe ? 'Reservieren' : 'Reservations')}
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
