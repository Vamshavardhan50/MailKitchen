import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ScrollToTop } from './components/ScrollToTop';
import { Navbar } from './components/Navbar';
import { HomePage } from './components/HomePage';
import { June2026Menu } from './components/June2026Menu';
import { EventsSection } from './components/EventsSection';
import { AboutSection } from './components/AboutSection';
import { ReservationSection } from './components/ReservationSection';
import { LocationSection } from './components/LocationSection';
import { Impressum } from './components/Impressum';
import { Privacy } from './components/Privacy';
import { Terms } from './components/Terms';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';

export const App: React.FC = () => {
  const [lang, setLang] = useState<'de' | 'en'>('en');
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0e8]">
      <ScrollToTop />
      <Navbar
        lang={lang}
        setLang={setLang}
        onOpenReservation={() => setIsReservationOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
      />

      <main className="flex-1">
        <Routes>
          {/* HOME — matches https://maatikitchen.com/ */}
          <Route
            path="/"
            element={
              <HomePage
                lang={lang}
                onOpenReservation={() => setIsReservationOpen(true)}
              />
            }
          />

          {/* MENU — matches https://maatikitchen.com/menu */}
          <Route
            path="/menu"
            element={
              <June2026Menu
                lang={lang}
                onOpenReservation={() => setIsReservationOpen(true)}
              />
            }
          />

          {/* DEDICATED EVENTS PAGE */}
          <Route
            path="/events"
            element={
              <div className="pt-[20px]">
                <EventsSection
                  lang={lang}
                  onOpenReservation={() => setIsReservationOpen(true)}
                />
              </div>
            }
          />

          {/* DEDICATED ABOUT PAGE */}
          <Route
            path="/about"
            element={
              <div className="pt-[20px]">
                <AboutSection lang={lang} />
              </div>
            }
          />

          {/* DEDICATED LOCATIONS PAGE */}
          <Route
            path="/locations"
            element={
              <div className="pt-[88px] md:pt-[96px]">
                <LocationSection
                  lang={lang}
                  onOpenReservation={() => setIsReservationOpen(true)}
                />
              </div>
            }
          />

          {/* IMPRESSUM — matches https://maatikitchen.com/impressum */}
          <Route
            path="/impressum"
            element={<Impressum lang={lang} />}
          />

          {/* PRIVACY — matches https://maatikitchen.com/privacy */}
          <Route
            path="/privacy"
            element={<Privacy lang={lang} />}
          />

          {/* TERMS — matches https://maatikitchen.com/terms */}
          <Route
            path="/terms"
            element={<Terms lang={lang} />}
          />
        </Routes>
      </main>

      <Footer
        lang={lang}
        onOpenReservation={() => setIsReservationOpen(true)}
      />

      {/* SEARCH MODAL */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />

      {/* RESERVATION MODAL (Popup available from everywhere) */}
      <ReservationSection
        lang={lang}
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
        onOpen={() => setIsReservationOpen(true)}
      />
    </div>
  );
};

export default App;
