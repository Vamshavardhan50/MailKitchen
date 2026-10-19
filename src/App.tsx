import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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
import { StudioPage } from './components/StudioPage';
import { CateringPage } from './components/CateringPage';
import { JobsPage } from './components/JobsPage';
import { MenuCategoryLanding } from './components/MenuCategoryLanding';
import { NotFoundPage } from './components/NotFoundPage';
import { CookieConsentBanner } from './components/CookieConsentBanner';

export const App: React.FC = () => {
  const location = useLocation();
  // Derive language directly from URL path - URL is the authority!
  const isDeUrl = location.pathname.startsWith('/de');
  const [lang, setLang] = useState<'de' | 'en'>(isDeUrl ? 'de' : 'en');
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Sync lang state with URL if user navigates back/forward
  React.useEffect(() => {
    if (location.pathname.startsWith('/de') && lang !== 'de') {
      setLang('de');
    } else if (!location.pathname.startsWith('/de') && lang !== 'en') {
      setLang('en');
    }
  }, [location.pathname, lang]);

  const isStudio = location.pathname.startsWith('/studio') || location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f0e8]">
      <ScrollToTop />
      {!isStudio && (
        <Navbar
          lang={lang}
          setLang={setLang}
          onOpenReservation={() => setIsReservationOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
      )}

      <main className="flex-1">
        <Routes>
          {/* ══════════ ENGLISH ROUTES (DEFAULT) ══════════ */}
          <Route
            path="/"
            element={
              <HomePage
                lang="en"
                onOpenReservation={() => setIsReservationOpen(true)}
              />
            }
          />
          <Route
            path="/menu"
            element={
              <June2026Menu
                lang="en"
                onOpenReservation={() => setIsReservationOpen(true)}
              />
            }
          />
          {/* Priority Menu Landing Pages (SEO Brief v2.0 Section 5.3) */}
          <Route
            path="/menu/naan-pockets"
            element={<MenuCategoryLanding categoryKey="naan-pockets" lang="en" onOpenReservation={() => setIsReservationOpen(true)} />}
          />
          <Route
            path="/menu/bowls"
            element={<MenuCategoryLanding categoryKey="bowls" lang="en" onOpenReservation={() => setIsReservationOpen(true)} />}
          />
          <Route
            path="/menu/breakfast"
            element={<MenuCategoryLanding categoryKey="breakfast" lang="en" onOpenReservation={() => setIsReservationOpen(true)} />}
          />
          <Route
            path="/menu/coffee-chai"
            element={<MenuCategoryLanding categoryKey="coffee-chai" lang="en" onOpenReservation={() => setIsReservationOpen(true)} />}
          />
          <Route
            path="/catering"
            element={<CateringPage lang="en" />}
          />
          <Route
            path="/events"
            element={
              <EventsSection
                lang="en"
                onOpenReservation={() => setIsReservationOpen(true)}
              />
            }
          />
          <Route
            path="/jobs"
            element={<JobsPage lang="en" />}
          />
          <Route
            path="/careers"
            element={<JobsPage lang="en" />}
          />
          <Route
            path="/about"
            element={
              <div className="pt-[20px]">
                <AboutSection lang="en" />
              </div>
            }
          />
          <Route
            path="/locations"
            element={
              <div className="pt-[88px] md:pt-[96px]">
                <LocationSection
                  lang="en"
                  onOpenReservation={() => setIsReservationOpen(true)}
                />
              </div>
            }
          />
          <Route
            path="/contact"
            element={
              <div className="pt-[88px] md:pt-[96px]">
                <LocationSection
                  lang="en"
                  onOpenReservation={() => setIsReservationOpen(true)}
                />
              </div>
            }
          />
          <Route
            path="/impressum"
            element={<Impressum lang="en" />}
          />
          <Route
            path="/privacy"
            element={<Privacy lang="en" />}
          />
          <Route
            path="/terms"
            element={<Terms lang="en" />}
          />

          {/* ══════════ GERMAN DEDICATED ROUTES (/de/*) (R1) ══════════ */}
          <Route
            path="/de"
            element={
              <HomePage
                lang="de"
                onOpenReservation={() => setIsReservationOpen(true)}
              />
            }
          />
          <Route
            path="/de/"
            element={
              <HomePage
                lang="de"
                onOpenReservation={() => setIsReservationOpen(true)}
              />
            }
          />
          <Route
            path="/de/menu"
            element={
              <June2026Menu
                lang="de"
                onOpenReservation={() => setIsReservationOpen(true)}
              />
            }
          />
          <Route
            path="/de/speisekarte"
            element={
              <June2026Menu
                lang="de"
                onOpenReservation={() => setIsReservationOpen(true)}
              />
            }
          />
          {/* German Category Landing Pages */}
          <Route
            path="/de/menu/naan-pockets"
            element={<MenuCategoryLanding categoryKey="naan-pockets" lang="de" onOpenReservation={() => setIsReservationOpen(true)} />}
          />
          <Route
            path="/de/menu/bowls"
            element={<MenuCategoryLanding categoryKey="bowls" lang="de" onOpenReservation={() => setIsReservationOpen(true)} />}
          />
          <Route
            path="/de/menu/breakfast"
            element={<MenuCategoryLanding categoryKey="breakfast" lang="de" onOpenReservation={() => setIsReservationOpen(true)} />}
          />
          <Route
            path="/de/menu/coffee-chai"
            element={<MenuCategoryLanding categoryKey="coffee-chai" lang="de" onOpenReservation={() => setIsReservationOpen(true)} />}
          />
          <Route
            path="/de/catering"
            element={<CateringPage lang="de" />}
          />
          <Route
            path="/de/events"
            element={
              <EventsSection
                lang="de"
                onOpenReservation={() => setIsReservationOpen(true)}
              />
            }
          />
          <Route
            path="/de/jobs"
            element={<JobsPage lang="de" />}
          />
          <Route
            path="/de/karriere"
            element={<JobsPage lang="de" />}
          />
          <Route
            path="/de/about"
            element={
              <div className="pt-[20px]">
                <AboutSection lang="de" />
              </div>
            }
          />
          <Route
            path="/de/locations"
            element={
              <div className="pt-[88px] md:pt-[96px]">
                <LocationSection
                  lang="de"
                  onOpenReservation={() => setIsReservationOpen(true)}
                />
              </div>
            }
          />
          <Route
            path="/de/kontakt"
            element={
              <div className="pt-[88px] md:pt-[96px]">
                <LocationSection
                  lang="de"
                  onOpenReservation={() => setIsReservationOpen(true)}
                />
              </div>
            }
          />
          <Route
            path="/de/contact"
            element={
              <div className="pt-[88px] md:pt-[96px]">
                <LocationSection
                  lang="de"
                  onOpenReservation={() => setIsReservationOpen(true)}
                />
              </div>
            }
          />
          <Route
            path="/de/anfahrt"
            element={
              <div className="pt-[88px] md:pt-[96px]">
                <LocationSection
                  lang="de"
                  onOpenReservation={() => setIsReservationOpen(true)}
                />
              </div>
            }
          />
          <Route
            path="/de/impressum"
            element={<Impressum lang="de" />}
          />
          <Route
            path="/de/privacy"
            element={<Privacy lang="de" />}
          />
          <Route
            path="/de/datenschutz"
            element={<Privacy lang="de" />}
          />
          <Route
            path="/de/terms"
            element={<Terms lang="de" />}
          />
          <Route
            path="/de/agb"
            element={<Terms lang="de" />}
          />

          {/* SANITY / MAATI STUDIO ADMIN ROUTES */}
          <Route path="/studio" element={<StudioPage />} />
          <Route path="/studio/*" element={<StudioPage />} />
          <Route path="/admin" element={<StudioPage />} />
          <Route path="/admin/*" element={<StudioPage />} />

          {/* CUSTOM 404 NOT FOUND ROUTE */}
          <Route path="*" element={<NotFoundPage lang={lang} />} />
        </Routes>
      </main>

      {!isStudio && (
        <Footer
          lang={lang}
          onOpenReservation={() => setIsReservationOpen(true)}
        />
      )}

      {/* GDPR / DSGVO CONSENT BANNER (CONSENT MODE V2) */}
      {!isStudio && <CookieConsentBanner lang={lang} />}

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
