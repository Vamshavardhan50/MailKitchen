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
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 h-full flex items-center justify-between relative">

        {/* LEFT NAV (DESKTOP) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-bold text-[14.5px] text-white">
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
          className="lg:hidden p-2 -ml-1 text-white hover:bg-white/10 rounded-xl transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6 text-[#d85c27]" /> : <MenuIcon className="w-6 h-6" />}
        </button>

        {/* CENTER LOGO (Responsive scaling on all screens) */}
        <Link to="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center py-1 pointer-events-none">
          <img
            src="/assets/logo-C86A0r1B.png"
            alt="maati - fresh indian food, made your way"
            className="w-auto object-contain drop-shadow-md h-[130px] sm:h-[180px] lg:h-[260px] pointer-events-auto transition-all"
          />
        </Link>

        {/* Mobile Right Controls */}
        <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>
          <button
            onClick={() => setLang(lang === 'en' ? 'de' : 'en')}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white text-[11.5px] font-bold px-2.5 py-1.5 rounded-full border border-white/15 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#d85c27]" />
            <span className="uppercase font-black">{lang}</span>
          </button>
        </div>

        {/* RIGHT CONTROLS (DESKTOP) */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenReservation}
            className="bg-[#d85c27] text-white font-bold text-[14px] px-5 py-2.5 rounded-full hover:bg-[#c2501f] transition-all shadow-md transform hover:scale-105"
          >
            {text.nav_reservations || (isDe ? 'Reservieren' : 'Reservations')}
          </button>

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

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-[#1e382f] border-t border-white/10 shadow-2xl z-50 animate-fadeIn">
          <nav className="flex flex-col px-6 py-5 gap-4 font-bold text-white text-[15.5px]">
            <Link
              to="/about"
              onClick={() => setMobileOpen(false)}
              className="hover:text-[#d85c27] py-1 border-b border-white/5 transition-colors"
            >
              {isDe ? 'Über uns' : 'About Us'}
            </Link>
            <Link
              to="/events"
              onClick={() => setMobileOpen(false)}
              className="hover:text-[#d85c27] py-1 border-b border-white/5 transition-colors"
            >
              Events
            </Link>
            <a
              href="/#catering"
              onClick={handleCateringClick}
              className="hover:text-[#d85c27] py-1 border-b border-white/5 transition-colors"
            >
              Catering
            </a>
            <Link
              to="/menu"
              onClick={() => setMobileOpen(false)}
              className="hover:text-[#d85c27] py-1 border-b border-white/5 transition-colors"
            >
              {isDe ? 'Speisekarte' : 'Menu'}
            </Link>
            <Link
              to="/locations"
              onClick={() => setMobileOpen(false)}
              className="hover:text-[#d85c27] py-1 border-b border-white/5 transition-colors"
            >
              {isDe ? 'Kontakt & Anfahrt' : 'Contact Us & Location'}
            </Link>

            <button
              onClick={() => { onOpenSearch(); setMobileOpen(false); }}
              className="flex items-center gap-2.5 text-white/90 hover:text-[#d85c27] py-2 text-left transition-colors"
            >
              <Search className="w-5 h-5 text-[#d85c27]" />
              <span>{isDe ? 'Speisekarte durchsuchen' : 'Search Menu Dishes'}</span>
            </button>

            <button
              onClick={() => { onOpenReservation(); setMobileOpen(false); }}
              className="w-full text-center bg-[#d85c27] hover:bg-[#c24f1c] text-white py-3.5 rounded-2xl font-extrabold text-[15px] shadow-lg transition-all"
            >
              {text.nav_reservations || (isDe ? 'Tisch Reservieren' : 'Book a Table')}
            </button>

            <div className="pt-2 flex items-center justify-between text-white/70 text-[12.5px] border-t border-white/10">
              <span>{isDe ? 'Sprache / Language' : 'Language'}</span>
              <button
                onClick={() => { setLang(lang === 'en' ? 'de' : 'en'); setMobileOpen(false); }}
                className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full text-white font-bold"
              >
                <Globe className="w-3.5 h-3.5 text-[#d85c27]" />
                <span>{lang === 'en' ? 'Switch to Deutsch' : 'Switch to English'}</span>
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
