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
        title={isDe ? 'MAATI Kitchen | Fast Casual • Indische Küche | Berlin' : 'MAATI Kitchen | Fast Casual • Indian Soul | Berlin'}
        description={
          isDe
            ? 'Frische, lebendige indische Zutaten in anpassbaren Bowls, Salaten und getoasteten Punjab Naan Pockets in der Zimmerstraße 56, 10117 Berlin.'
            : 'Fresh, vibrant Indian ingredients in customizable Bowls, Salads, and Naan Pockets in Zimmerstraße 56, 10117 Berlin. Authentic spices, Modern style.'
        }
        canonicalUrl="https://maatikitchen.com"
        lang={lang}
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
            <h1 className="font-black leading-[1.05] mb-6 text-[#1a1a1a]" style={{ fontSize: 'clamp(40px,5vw,68px)' }}>
              {(isDe ? content.heroTitle1De : content.heroTitle1En) || dict.hero_title_1}
              <br />
              <span className="text-[#d85c27]">
                {(isDe ? content.heroTitle2De : content.heroTitle2En) || dict.hero_title_2}
              </span>
            </h1>

            {/* Description */}
            <p className="text-[#555] text-[16px] md:text-[18px] leading-relaxed mb-8 max-w-[500px]">
              {(isDe ? content.heroDescDe : content.heroDescEn) || dict.hero_desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <Link
                to="/menu"
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-8 py-4 rounded-full text-[15px] shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
              >
                {(isDe ? content.heroBtnMenuDe : content.heroBtnMenuEn) || dict.hero_btn_menu}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={onOpenReservation}
                className="border-2 border-[#1e382f] text-[#1e382f] hover:bg-[#1e382f] hover:text-white font-extrabold px-8 py-3.5 rounded-full text-[15px] transition-all duration-300"
              >
                {(isDe ? content.heroBtnResDe : content.heroBtnResEn) || dict.hero_btn_res}
              </button>
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

          {/* RIGHT FOOD FLATLAY PHOTO */}
          <div className="flex-1 flex justify-center items-center w-full">
            <div className="w-full max-w-[560px] md:max-w-[620px] lg:max-w-[660px]">
              <div className="animate-rotate-in rounded-[32px] md:rounded-[40px] overflow-hidden transition-transform duration-700 hover:scale-[1.02]">
                <img
                  src={content.heroImage || "/assets/hero-flatlay.jpg"}
                  alt="MAATI Indian Soul Food spread"
                  className="w-full h-auto object-cover block rounded-[32px] md:rounded-[40px]"
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
                      className="bg-[#d85c27] text-white rounded-[24px] p-6 sm:p-8 text-left shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 flex flex-col justify-between"
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

              <div className="space-y-3 sm:space-y-4 text-[#555] text-[14px] sm:text-[16px] leading-relaxed">
                <p>
                  {(isDe ? content.cateringDescDe : content.cateringDescEn) ||
                    (isDe
                      ? 'Von Team-Lunches bis hin zu großen Firmenfeiern — wir bringen frisch zubereitete Bowls, warme Naan-Taschen und Signature Drinks direkt in Ihr Büro.'
                      : 'From team lunches to full corporate events — we bring freshly crafted bowls, warm naan pockets, and signature drinks directly to your office.')}
                </p>
                <p>
                  {(isDe ? content.cateringP2De : content.cateringP2En) ||
                    (isDe
                      ? 'Individuell zusammengestellt, unkompliziert geliefert. Auf Wunsch mit individuellem Setup vor Ort.'
                      : 'Customized for your team, effortlessly delivered. Full setup available on request.')}
                </p>
              </div>

              {/* Key Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
                <div className="flex items-center gap-2.5 text-[#1e382f] font-extrabold text-[13px] sm:text-[14px]">
                  <span className="w-2 h-2 rounded-full bg-[#d85c27]" />
                  <span>{(isDe ? content.cateringBullet1De : content.cateringBullet1En) || (isDe ? 'Perfekt für 10 bis 200+ Personen' : 'Perfect for 10 to 200+ people')}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#1e382f] font-extrabold text-[13px] sm:text-[14px]">
                  <span className="w-2 h-2 rounded-full bg-[#d85c27]" />
                  <span>{(isDe ? content.cateringBullet2De : content.cateringBullet2En) || (isDe ? '100% Vegan & Veggie-freundlich' : '100% Vegan & Veggie friendly')}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#1e382f] font-extrabold text-[13px] sm:text-[14px]">
                  <span className="w-2 h-2 rounded-full bg-[#d85c27]" />
                  <span>{(isDe ? content.cateringBullet3De : content.cateringBullet3En) || (isDe ? 'Pünktliche Berliner Lieferung' : 'On-time Berlin delivery')}</span>
                </div>
                <div className="flex items-center gap-2.5 text-[#1e382f] font-extrabold text-[13px] sm:text-[14px]">
                  <span className="w-2 h-2 rounded-full bg-[#d85c27]" />
                  <span>{(isDe ? content.cateringBullet4De : content.cateringBullet4En) || (isDe ? 'Individuelle Firmenrechnung' : 'Custom corporate invoicing')}</span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-4">
                <Link
                  to="/locations"
                  className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-[14px] sm:text-[15px] shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
                >
                  <span>{(isDe ? content.cateringBtnDe : content.cateringBtnEn) || (isDe ? 'Catering Anfragen' : 'Get a Quote')}</span>
                  <ArrowRight className="w-4 h-4" />
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
            {(isDe ? content.ctaTitleDe : content.ctaTitleEn) || dict.ready_title || (isDe ? 'Besuchen Sie uns in Berlin Mitte' : 'Visit us in Berlin Mitte')}
          </h2>
          <p className="text-white/70 text-[14px] sm:text-[16px] md:text-[17px] mb-6 sm:mb-8 max-w-[500px] mx-auto">
            {(isDe ? content.ctaDescDe : content.ctaDescEn) ||
              (isDe
                ? 'Erleben Sie modernes indisches Soul Food in gemütlicher Atmosphäre.'
                : 'Experience modern Indian soul food in a cozy, welcoming atmosphere.')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/menu"
              className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-[14px] sm:text-[15px] shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-105 inline-flex items-center gap-2"
            >
              {(isDe ? content.ctaBtnMenuDe : content.ctaBtnMenuEn) || dict.ready_btn_menu || (isDe ? 'Speisekarte' : 'View Menu')}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/locations"
              className="border-2 border-white/40 hover:border-white text-white font-extrabold px-7 sm:px-8 py-3.5 rounded-full text-[14px] sm:text-[15px] transition-all duration-300 hover:bg-white/10"
            >
              {(isDe ? content.ctaBtnLocationsDe : content.ctaBtnLocationsEn) || (isDe ? 'Unsere Standorte' : 'Our Locations')}
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
