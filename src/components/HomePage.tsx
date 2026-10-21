import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Flame, Clock, ArrowRight } from 'lucide-react';
import { SEO } from './SEO';
import { MenuCard } from './MenuCard';
import {
  MAATI_WAY_STEPS,
  DICTIONARY
} from '../data/content';
import { useHomepageContent, useFeaturedMenu } from '../lib/sanityService';

interface HomePageProps {
  lang: 'de' | 'en';
  onOpenReservation: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ lang, onOpenReservation }) => {
  const dict = DICTIONARY[lang];
  const isDe = lang === 'de';
  const { content } = useHomepageContent();
  const { items: featuredItems } = useFeaturedMenu();

  return (
    <div className="bg-[#f5f0e8] text-[#1a1a1a]">
      <SEO
        title={isDe ? 'MAATI Kitchen | Indisches Restaurant & Café Berlin Mitte' : 'MAATI Kitchen | Modern Indian Restaurant & Café Berlin Mitte'}
        description={
          isDe
            ? 'Moderne indische Küche in Berlin Mitte: frische Bowls, Naan Pockets, Currys, Kaffee und Chai. Vegane Optionen. Zimmerstraße 56, nahe Checkpoint Charlie.'
            : 'Modern Indian food in Berlin Mitte: fresh bowls, naan pockets, curries, specialty coffee and chai. Vegan options. Zimmerstraße 56, near Checkpoint Charlie.'
        }
        canonicalUrl={isDe ? 'https://maatikitchen.com/de' : 'https://maatikitchen.com/'}
        lang={lang}
        enPath=""
      />

      {/* ═══════════════════════════════════════════════
          1. HERO SECTION
      ═══════════════════════════════════════════════ */}
      <section
        className="bg-[#f5f0e8] flex items-center px-5 sm:px-8 md:px-16 lg:px-24 pb-12 sm:pb-16"
        style={{ paddingTop: '100px', minHeight: '88vh' }}
      >
        <div className="max-w-[1320px] mx-auto w-full flex flex-col md:flex-row items-center gap-8 sm:gap-12 lg:gap-20 animate-fadeInUp">

          {/* LEFT TEXT */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Badge - Filled with Orange */}
            <div className="inline-flex items-center mb-6">
              <span className="bg-[#d85c27] text-white text-[11px] font-black tracking-[0.18em] px-4 py-1.5 rounded-full uppercase shadow-sm transition-transform duration-300 hover:scale-105">
                {(isDe ? content.heroBadgeDe : content.heroBadgeEn) || dict.hero_badge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-black leading-[1.05] mb-3 text-[#1a1a1a]" style={{ fontSize: 'clamp(40px,5vw,68px)' }}>
              Modern Indian Food.
              <br />
              <span className="text-[#d85c27]">
                Made for Berlin.
              </span>
            </h1>
            <p className="text-[#1e382f] font-bold text-[15px] sm:text-[17px] mb-5 leading-snug">
              {isDe
                ? 'Indisches Restaurant & Café in Berlin Mitte, Zimmerstraße 56, nahe Checkpoint Charlie.'
                : 'Indian restaurant & café in Berlin Mitte, Zimmerstraße 56, near Checkpoint Charlie.'}
            </p>

            {/* Description */}
            <p className="text-[#555] text-[16px] md:text-[18px] leading-relaxed mb-8 max-w-[500px]">
              {(isDe ? content.heroDescDe : content.heroDescEn) || dict.hero_desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 sm:gap-4 mb-8">
              <button
                onClick={onOpenReservation}
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-8 py-4 rounded-full text-[15px] shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 active-press"
              >
                <span>{(isDe ? 'Tisch reservieren' : 'Book A Table')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                to={isDe ? '/de/menu' : '/menu'}
                className="border-2 border-[#1e382f] text-[#1e382f] hover:bg-[#1e382f] hover:text-white font-extrabold px-8 py-3.5 rounded-full text-[15px] transition-all duration-300 text-center active-press"
              >
                {(isDe ? content.heroBtnMenuDe : content.heroBtnMenuEn) || dict.hero_btn_menu}
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <span className="inline-flex items-center gap-1.5 bg-[#1e382f]/5 px-3.5 py-1.5 rounded-full text-[12px] font-bold text-[#1e382f]">
                <Leaf className="w-3.5 h-3.5 text-[#2d6a4f]" /> {(isDe ? content.heroPill1De : content.heroPill1En) || dict.hero_fresh}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#1e382f]/5 px-3.5 py-1.5 rounded-full text-[12px] font-bold text-[#1e382f]">
                <Flame className="w-3.5 h-3.5 text-[#d85c27]" /> {(isDe ? content.heroPill2De : content.heroPill2En) || dict.hero_spices}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-[#1e382f]/5 px-3.5 py-1.5 rounded-full text-[12px] font-bold text-[#1e382f]">
                <Clock className="w-3.5 h-3.5 text-[#1e382f]" /> {(isDe ? content.heroPill3De : content.heroPill3En) || dict.hero_ready}
              </span>
            </div>
          </div>

          {/* Original circular hero image */}
          <div className="flex-1 flex justify-center items-center w-full">
            <div className="max-w-full transition-transform duration-500 ease-out hover:scale-[1.02]">
              <div
                className="rounded-full overflow-hidden animate-spin-dish"
                style={{ width: 'clamp(280px,38vw,520px)', height: 'clamp(280px,38vw,520px)', maxWidth: '100%' }}
              >
                <img
                  src={content.heroImage || "/assets/circle-Bq5xyFQD.png"}
                  alt="MAATI Indian Soul Food spread"
                  className="w-full h-full object-cover block pointer-events-none"
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. HOUSE FAVORITES (LUNCH) — "Treat Your Tastebuds"
      ═══════════════════════════════════════════════ */}
      <section id="menu" className="bg-[#1e382f] text-white py-16 sm:py-24 px-5 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-[1320px] mx-auto">
          <div className="mb-10 sm:mb-14">
            <h2 className="text-[30px] sm:text-[36px] md:text-[48px] font-black leading-tight mb-3">
              {(isDe ? content.lunchTitleDe : content.lunchTitleEn) || dict.lunch_title}
            </h2>
            <p className="text-white/70 text-[14px] sm:text-[15px] max-w-[620px]">
              {(isDe ? content.lunchDescDe : content.lunchDescEn) || dict.lunch_desc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredItems.map((item) => (
              <MenuCard key={item._id || item.id} item={item} lang={lang} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. CUSTOMIZED TO YOUR TASTE — THE MAATI WAY
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#f5f0e8] py-16 sm:py-24 px-5 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-[1320px] mx-auto text-center">
          <p className="text-[#d85c27] font-black tracking-[0.2em] text-[12px] sm:text-[13px] mb-2 sm:mb-3 uppercase">
            {(isDe ? content.maatiWayBadgeDe : content.maatiWayBadgeEn) || 'CUSTOMIZED TO YOUR TASTE'}
          </p>
          <h2 className="text-[32px] sm:text-[40px] md:text-[56px] font-black text-[#1e382f] mb-10 sm:mb-14">
            {(isDe ? content.maatiWayTitleDe : content.maatiWayTitleEn) || 'The MAATI Way'}
          </h2>

          {/* Dynamic Step Cards */}
          {(() => {
            const steps = content.maatiWaySteps && content.maatiWaySteps.length > 0
              ? content.maatiWaySteps
              : MAATI_WAY_STEPS;

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-[1200px] mx-auto justify-center">
                {steps.map((s, idx) => {
                  const stepNum = s.step || idx + 1;
                  const stepTitle = (isDe ? s.titleDe : s.title) || s.title;
                  const stepItems = (isDe && s.itemsDe && s.itemsDe.length > 0 ? s.itemsDe : s.items) || [];

                  return (
                    <div
                      key={s.id || idx}
                      className="bg-[#d85c27] text-white rounded-[24px] p-6 sm:p-8 text-left shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 flex flex-col justify-between hover-lift active-press"
                    >
                      <div>
                        <div className="w-10 h-10 rounded-full bg-white text-[#d85c27] flex items-center justify-center font-black text-[16px] mb-5 shadow-sm">
                          {stepNum}
                        </div>
                        <h3 className="font-bold text-[18px] sm:text-[19px] mb-4 leading-snug text-white">{stepTitle}</h3>
                        <ul className="space-y-2 text-[13px] text-white/95">
                          {stepItems.map((item, itemIdx) => (
                            <li key={itemIdx} className="flex items-start gap-1.5">
                              <span className="text-white/80 font-bold">•</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. EXPERIENCE
      ═══════════════════════════════════════════════ */}
      <section className="bg-white py-16 sm:py-20 md:py-28 px-5 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-[1360px] mx-auto">
          {/* Centered Heading */}
          <div className="text-center max-w-[800px] mx-auto mb-10 sm:mb-16">
            <p className="text-[#d85c27] font-black text-[12px] sm:text-[13px] tracking-[0.2em] uppercase mb-2 sm:mb-3">
              {(isDe ? content.experienceEyebrowDe : content.experienceEyebrowEn) || dict.experience_label || 'EXPERIENCE'}
            </p>
            <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-black text-[#1e382f] leading-tight mb-3 sm:mb-4">
              {(isDe ? content.experienceTitleDe : content.experienceTitleEn) || dict.experience_title || 'Breakfast, Lunch and Events at MAATI'}
            </h2>
            <p className="text-[#666] text-[14px] sm:text-[15px] leading-relaxed max-w-[620px] mx-auto">
              {(isDe ? content.experienceDescDe : content.experienceDescEn) || dict.experience_desc || 'A warm, modern space designed for quick breakfast & lunches and cozy events alike.'}
            </p>
          </div>

          {/* Two Side-by-Side Rounded Images with Staggered Height Offset */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start pt-2 pb-6">
            {/* Left Image */}
            <div className="group rounded-[24px] sm:rounded-[32px] md:rounded-[36px] overflow-hidden shadow-sm bg-[#ebdcd0]/30 h-[280px] sm:h-[380px] md:h-[480px] lg:h-[520px] w-full md:mt-12 transition-transform duration-500">
              <img
                src={content.experienceImg1 || "/assets/show5-BiQql1jr.jpeg"}
                alt="MAATI warm dining ambiance and light installation"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            {/* Right Image */}
            <div className="group rounded-[24px] sm:rounded-[32px] md:rounded-[36px] overflow-hidden shadow-sm bg-[#ebdcd0]/30 h-[280px] sm:h-[380px] md:h-[480px] lg:h-[520px] w-full md:-mt-2 transition-transform duration-500">
              <img
                src={content.experienceImg2 || "/assets/show2-CM6MShfY.jpeg"}
                alt="MAATI window seats with woven pendant lamps"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>

          {/* Experience Inquire CTA */}
          <div className="mt-8 text-center">
            <Link
              to={isDe ? '/de/events#enquiry-form' : '/events#enquiry-form'}
              className="inline-flex items-center gap-2 bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-8 py-4 rounded-full text-[15px] shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <span>{isDe ? 'Privates Event Anfragen' : 'Inquire for Private Events'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7.5. MAATI CATERING SECTION
      ═══════════════════════════════════════════════ */}
      <section id="catering" className="bg-[#f5f0e8] py-16 sm:py-24 px-5 sm:px-8 md:px-16 lg:px-24 border-t border-[#ebdcd0]/60">
        <div className="max-w-[1360px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-6">
              <div>
                <span className="bg-[#d85c27] text-white text-[11px] font-black tracking-[0.18em] px-4 py-1.5 rounded-full uppercase shadow-sm inline-block mb-3 sm:mb-4">
                  {(isDe ? content.cateringBadgeDe : content.cateringBadgeEn) || 'MAATI CATERING'}
                </span>
                <h2 className="text-[28px] sm:text-[38px] md:text-[50px] font-black text-[#1e382f] leading-[1.15] mb-4 sm:mb-6">
                  {(isDe ? content.cateringTitleDe : content.cateringTitleEn) || 'Bold Flavours That Fuel Your Team'}
                </h2>
              </div>

              <div className="space-y-3 sm:space-y-4 text-[#555] text-[15px] sm:text-[16px] leading-relaxed">
                <p>
                  {isDe
                    ? 'Frisches indisches Catering für Büro-Lunches, Team-Meetings und Feiern in Berlin Mitte. Von 10 bis 200+ Personen liefern wir warme Bowls, getoastete Naan-Pockets und Lassis direkt zu Ihnen.'
                    : 'Fresh Indian catering crafted for office lunches, team meetings, and celebrations in Berlin Mitte. From 10 to 200+ guests, we deliver warm wholesome bowls, toasted naan pockets, and signature drinks directly to your team.'}
                </p>
                <p>
                  {isDe
                    ? 'Wählen Sie aus unseren transparenten Paketen ab €11,90 pro Person oder lassen Sie sich ein individuelles Buffet-Setup zusammenstellen.'
                    : 'Choose from our confirmed transparent packages starting at €11.90 per person or request a tailored on-site buffet setup.'}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-[#1e382f] font-extrabold text-[13px] sm:text-[14px]">
                  <span className="w-2 h-2 rounded-full bg-[#d85c27]" />
                  <span>{isDe ? 'Pakete ab €11,90 p.P.' : 'Packages from €11.90 p.p.'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#1e382f] font-extrabold text-[13px] sm:text-[14px]">
                  <span className="w-2 h-2 rounded-full bg-[#d85c27]" />
                  <span>{isDe ? '100% Vegan & Veggie-freundlich' : '100% Vegan & Veggie friendly'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#1e382f] font-extrabold text-[13px] sm:text-[14px]">
                  <span className="w-2 h-2 rounded-full bg-[#d85c27]" />
                  <span>{isDe ? 'Kostenlose Lieferung in Mitte (<5km)' : 'Free delivery in Mitte (<5km)'}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#1e382f] font-extrabold text-[13px] sm:text-[14px]">
                  <span className="w-2 h-2 rounded-full bg-[#d85c27]" />
                  <span>{isDe ? 'Individuelle Firmenrechnung' : 'Custom corporate invoicing'}</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link
                  to={isDe ? '/de/catering#enquiry' : '/catering#enquiry'}
                  className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-[14px] sm:text-[15px] shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center justify-center gap-2 active-press"
                >
                  <span>{isDe ? 'Catering Anfragen' : 'Get a Quote'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to={isDe ? '/de/catering' : '/catering'}
                  className="border-2 border-[#1e382f] text-[#1e382f] hover:bg-[#1e382f] hover:text-white font-extrabold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-[14px] text-center transition-colors active-press"
                >
                  {isDe ? 'Alle Catering-Preise' : 'View Full Catering Menu'}
                </Link>
              </div>
            </div>

            {/* Right Image Column (5 cols) */}
            <div className="lg:col-span-5">
              <div className="group rounded-[28px] sm:rounded-[36px] overflow-hidden shadow-2xl bg-[#ebdcd0]/40 border border-[#ebdcd0] transition-transform duration-500 hover:scale-[1.02]">
                <img
                  src={content.cateringImage || "/assets/show3-D0blnzja.jpeg"}
                  alt="MAATI Fresh Catering Spread"
                  loading="lazy"
                  className="w-full h-[320px] sm:h-[420px] md:h-[480px] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8. FOOTER CTA SECTION
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#1e382f] text-white py-16 sm:py-20 px-5 sm:px-8 md:px-16 lg:px-24 text-center">
        <div className="max-w-[800px] mx-auto">
          <h2 className="text-[28px] sm:text-[36px] md:text-[48px] font-black leading-tight mb-3 sm:mb-4">
            {(isDe ? content.ctaTitleDe : content.ctaTitleEn) ||
              (isDe
                ? 'Besuchen Sie uns in der Zimmerstraße 56, 10117 Berlin - wo jeder Bissen eine Geschichte erzählt.'
                : 'Visit us at Zimmerstr. 56, 10117 Berlin - where every bite tells a story.')}
          </h2>
          <p className="text-white/70 text-[14px] sm:text-[16px] md:text-[17px] mb-6 sm:mb-8 max-w-[500px] mx-auto">
            {(isDe ? content.ctaDescDe : content.ctaDescEn) ||
              (isDe
                ? 'Erleben Sie modernes indisches Soul Food in gemütlicher Atmosphäre.'
                : 'Experience modern Indian soul food in a cozy, welcoming atmosphere.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={onOpenReservation}
              className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-8 py-4 rounded-full text-[15px] shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              <span>{isDe ? 'Tisch reservieren' : 'Make a Reservation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <Link
              to={isDe ? '/de/menu' : '/menu'}
              className="border-2 border-white/40 hover:border-white text-white font-extrabold px-8 py-3.5 rounded-full text-[15px] transition-all duration-300 hover:bg-white/10"
            >
              {(isDe ? content.ctaBtnMenuDe : content.ctaBtnMenuEn) || dict.ready_btn_menu || (isDe ? 'Speisekarte' : 'View Menu')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
