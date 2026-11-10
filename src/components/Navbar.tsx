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

// Helper to compute equivalent URLs between English and German routes
function getLanguagePaths(pathname: string) {
  const clean = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname;
  const isGerman = clean.startsWith('/de');

  let enPath = '/';
  let dePath = '/de';

  if (isGerman) {
    const sub = clean.replace(/^\/de/, '') || '/';
    if (sub === '/' || sub === '') {
      enPath = '/';
      dePath = '/de';
    } else if (sub === '/speisekarte' || sub === '/menu') {
      enPath = '/menu';
      dePath = '/de/menu';
    } else if (sub === '/ueber-uns' || sub === '/about') {
      enPath = '/about';
      dePath = '/de/about';
    } else if (sub === '/veranstaltungen' || sub === '/events') {
      enPath = '/events';
      dePath = '/de/events';
    } else if (sub === '/kontakt' || sub === '/contact') {
      enPath = '/contact';
      dePath = '/de/contact';
    } else if (sub === '/karriere' || sub === '/jobs') {
      enPath = '/jobs';
      dePath = '/de/jobs';
    } else if (sub === '/anfahrt' || sub === '/locations') {
      enPath = '/locations';
      dePath = '/de/locations';
    } else if (sub === '/datenschutz' || sub === '/privacy') {
      enPath = '/privacy';
      dePath = '/de/privacy';
    } else if (sub === '/agb' || sub === '/terms') {
      enPath = '/terms';
      dePath = '/de/terms';
    } else {
      enPath = sub;
      dePath = clean;
    }
  } else {
    if (clean === '' || clean === '/') {
      enPath = '/';
      dePath = '/de';
    } else if (clean === '/careers') {
      enPath = '/jobs';
      dePath = '/de/jobs';
    } else {
      enPath = clean;
      dePath = `/de${clean}`;
    }
  }

  return { enPath, dePath };
}

export const Navbar: React.FC<NavbarProps> = ({ lang, setLang, onOpenReservation, onOpenSearch }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const text = DICTIONARY[lang];
  const isDe = lang === 'de';

  const { enPath, dePath } = getLanguagePaths(location.pathname);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#1e382f] text-white shadow-lg" style={{ height: '72px' }}>
      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 md:px-8 h-full flex items-center justify-between relative">

        {/* LEFT NAV (DESKTOP) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 font-bold text-[14.5px] text-white">
          <Link to={isDe ? '/de/about' : '/about'} className="hover:text-[#d85c27] transition-colors">
            {isDe ? 'Über uns' : 'About Us'}
          </Link>
          <Link to={isDe ? '/de/events' : '/events'} className="hover:text-[#d85c27] transition-colors">
            Events
          </Link>
          <Link to={isDe ? '/de/catering' : '/catering'} className="hover:text-[#d85c27] transition-colors cursor-pointer">
            Catering
          </Link>
          <Link to={isDe ? '/de/menu' : '/menu'} className="hover:text-[#d85c27] transition-colors">
            {isDe ? 'Speisekarte' : 'Menu'}
          </Link>
          <Link to={isDe ? '/de/contact' : '/contact'} className="hover:text-[#d85c27] transition-colors">
            {isDe ? 'Kontakt' : 'Contact Us'}
          </Link>
          <Link to={isDe ? '/de/jobs' : '/jobs'} className="hover:text-[#d85c27] transition-colors">
            {isDe ? 'Jobs' : 'Careers'}
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

        {/* CENTER LOGO */}
        <Link to={isDe ? '/de' : '/'} className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center py-1 pointer-events-none">
          <img
            src="/assets/logo-C86A0r1B.png"
            alt="maati - fresh indian food, made your way"
            className="w-auto object-contain drop-shadow-md h-[92px] sm:h-[140px] lg:h-[230px] pointer-events-auto transition-transform duration-300 hover:scale-105"
          />
        </Link>

        {/* Mobile Right Controls */}
        <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-xl transition-colors active-press"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Mobile Dual Language Switcher */}
          <div className="flex items-center bg-white/10 p-0.5 rounded-full border border-white/15">
            <Link
              to={enPath}
              onClick={() => setLang('en')}
              className={`px-2 py-1 text-[11px] font-extrabold rounded-full transition-all ${!isDe
                  ? 'bg-[#d85c27] text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
                }`}
            >
              EN
            </Link>
            <Link
              to={dePath}
              onClick={() => setLang('de')}
              className={`px-2 py-1 text-[11px] font-extrabold rounded-full transition-all ${isDe
                  ? 'bg-[#d85c27] text-white shadow-xs'
                  : 'text-white/70 hover:text-white'
                }`}
            >
              DE
            </Link>
          </div>
        </div>

        {/* RIGHT CONTROLS (DESKTOP) */}
        <div className="hidden lg:flex items-center gap-4">
          <button
            onClick={onOpenSearch}
            aria-label="Search"
            className="p-2.5 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors active-press"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenReservation}
            className="bg-[#d85c27] text-white font-extrabold text-[14px] px-6 py-2.5 rounded-full hover:bg-[#c2501f] transition-all shadow-md transform hover:scale-105 active-press cursor-pointer"
          >
            {isDe ? 'Tisch reservieren' : 'Book A Table'}
          </button>

          {/* Dual Bilingual Language Switcher (EN | DE) */}
          <div className="flex items-center bg-white/10 p-1 rounded-full border border-white/15">
            <Link
              to={enPath}
              onClick={() => setLang('en')}
              className={`px-3 py-1.5 text-[12.5px] font-extrabold rounded-full transition-all ${!isDe
                  ? 'bg-[#d85c27] text-white shadow-sm'
                  : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              title="Switch to English"
            >
              EN
            </Link>
            <Link
              to={dePath}
              onClick={() => setLang('de')}
              className={`px-3 py-1.5 text-[12.5px] font-extrabold rounded-full transition-all ${isDe
                  ? 'bg-[#d85c27] text-white shadow-sm'
                  : 'text-white/75 hover:text-white hover:bg-white/10'
                }`}
              title="Auf Deutsch wechseln"
            >
              DE
            </Link>
          </div>
        </div>

      </div>

      {/* Mobile Dimmed Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 top-[72px] bg-black/50 backdrop-blur-xs z-40 lg:hidden animate-fadeIn"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile Dropdown Drawer */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-[72px] left-0 right-0 bg-[#1e382f]/98 backdrop-blur-xl border-t border-white/10 shadow-2xl z-50 animate-slide-down">
          <nav className="flex flex-col px-6 py-5 gap-3.5 font-bold text-white text-[15.5px]">
            <Link
              to={isDe ? '/de/about' : '/about'}
              onClick={() => setMobileOpen(false)}
              className="hover:text-[#d85c27] py-2 border-b border-white/5 transition-colors flex items-center justify-between active-press"
            >
              <span>{isDe ? 'Über uns' : 'About Us'}</span>
              <span className="text-[#d85c27] text-xs">→</span>
            </Link>
            <Link
              to={isDe ? '/de/events' : '/events'}
              onClick={() => setMobileOpen(false)}
              className="hover:text-[#d85c27] py-2 border-b border-white/5 transition-colors flex items-center justify-between active-press"
            >
              <span>Events &amp; Feiern</span>
              <span className="text-[#d85c27] text-xs">→</span>
            </Link>
            <Link
              to={isDe ? '/de/catering' : '/catering'}
              onClick={() => setMobileOpen(false)}
              className="hover:text-[#d85c27] py-2 border-b border-white/5 transition-colors flex items-center justify-between active-press"
            >
              <span>Catering</span>
              <span className="text-[#d85c27] text-xs">→</span>
            </Link>
            <Link
              to={isDe ? '/de/menu' : '/menu'}
              onClick={() => setMobileOpen(false)}
              className="hover:text-[#d85c27] py-2 border-b border-white/5 transition-colors flex items-center justify-between active-press"
            >
              <span>{isDe ? 'Speisekarte' : 'Menu'}</span>
              <span className="text-[#d85c27] text-xs">→</span>
            </Link>
            <Link
              to={isDe ? '/de/contact' : '/contact'}
              onClick={() => setMobileOpen(false)}
              className="hover:text-[#d85c27] py-2 border-b border-white/5 transition-colors flex items-center justify-between active-press"
            >
              <span>{isDe ? 'Standorte & Kontakt' : 'Locations & Contact'}</span>
              <span className="text-[#d85c27] text-xs">→</span>
            </Link>
            <Link
              to={isDe ? '/de/jobs' : '/jobs'}
              onClick={() => setMobileOpen(false)}
              className="hover:text-[#d85c27] py-2 border-b border-white/5 transition-colors flex items-center justify-between active-press"
            >
              <span>{isDe ? 'Karriere & Jobs' : 'Careers & Jobs'}</span>
              <span className="text-[#d85c27] text-xs">→</span>
            </Link>

            <button
              onClick={() => { onOpenSearch(); setMobileOpen(false); }}
              className="flex items-center gap-2.5 text-white/90 hover:text-[#d85c27] py-2 text-left transition-colors active-press"
            >
              <Search className="w-5 h-5 text-[#d85c27]" />
              <span>{isDe ? 'Speisekarte durchsuchen' : 'Search Menu Dishes'}</span>
            </button>

            <button
              onClick={() => { onOpenReservation(); setMobileOpen(false); }}
              className="w-full text-center bg-[#d85c27] hover:bg-[#c24f1c] text-white py-3.5 rounded-2xl font-extrabold text-[15px] shadow-lg transition-all active-press mt-1"
            >
              {isDe ? 'Tisch Reservieren' : 'Book A Table'}
            </button>

            <div className="pt-2 flex items-center justify-between text-white/70 text-[12.5px] border-t border-white/10">
              <span>{isDe ? 'Sprache' : 'Language'}</span>
              <div className="flex items-center bg-white/10 p-0.5 rounded-full border border-white/15">
                <Link
                  to={enPath}
                  onClick={() => { setLang('en'); setMobileOpen(false); }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${!isDe ? 'bg-[#d85c27] text-white shadow-xs' : 'text-white/70 hover:text-white'
                    }`}
                >
                  English
                </Link>
                <Link
                  to={dePath}
                  onClick={() => { setLang('de'); setMobileOpen(false); }}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${isDe ? 'bg-[#d85c27] text-white shadow-xs' : 'text-white/70 hover:text-white'
                    }`}
                >
                  Deutsch
                </Link>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
