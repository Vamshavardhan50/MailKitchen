import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Flame, Clock } from 'lucide-react';
import { SEO } from './SEO';
import {
  LUNCH_ITEMS,
  BREAKFAST_ITEMS,
  COLD_DRINKS,
  HOT_DRINKS,
  MAATI_WAY_STEPS,
  DICTIONARY
} from '../data/content';

interface HomePageProps {
  lang: 'de' | 'en';
  onOpenReservation: () => void;
}

// ─── BADGE COLORS ─────────────────────────────────────────────────────────────
const badgeColor = (badge?: string) => {
  if (badge === 'VEGAN') return '#2d6a4f';
  if (badge === 'VEGETARIAN' || badge === 'VEGTARIAN') return '#1e382f';
  return '#d85c27';
};

export const HomePage: React.FC<HomePageProps> = ({ lang, onOpenReservation }) => {
  const text = DICTIONARY[lang];
  const isDe = lang === 'de';

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
        className="bg-[#f5f0e8] flex items-center px-8 md:px-16 lg:px-24 pb-16"
        style={{ paddingTop: '120px', minHeight: '92vh' }}
      >
        <div className="max-w-[1320px] mx-auto w-full flex flex-col md:flex-row items-center gap-12 lg:gap-20 animate-fadeInUp">

          {/* LEFT TEXT */}
          <div className="flex-1 flex flex-col justify-center">
            {/* Badge - Filled with Orange */}
            <div className="inline-flex items-center mb-6">
              <span className="bg-[#d85c27] text-white text-[11px] font-black tracking-[0.18em] px-4 py-1.5 rounded-full uppercase shadow-sm transition-transform duration-300 hover:scale-105">
                {text.hero_badge}
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-black leading-[1.05] mb-6 text-[#1a1a1a]" style={{ fontSize: 'clamp(40px,5vw,68px)' }}>
              {text.hero_title_1}
              <br />
              <span className="text-[#d85c27] italic">{text.hero_title_2}</span>
            </h1>

            {/* Subtitle */}
            <p className="text-[17px] text-[#555] leading-relaxed mb-10 max-w-[500px]">
              {text.hero_desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Link
                to="/menu"
                className="inline-flex items-center gap-3 bg-[#d85c27] text-white font-bold text-[15px] px-8 py-4 rounded-full hover:bg-[#c2501f] transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-md"
              >
                {text.hero_btn_menu}
                <span className="text-[18px] font-black transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
              <button
                onClick={onOpenReservation}
                className="inline-flex items-center border-2 border-[#1a1a1a] text-[#1a1a1a] font-bold text-[15px] px-8 py-4 rounded-full hover:bg-[#1a1a1a] hover:text-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
              >
                {text.hero_btn_res}
              </button>
            </div>

            {/* Feature Row */}
            <div className="flex flex-wrap items-center gap-6 sm:gap-10 text-[#666]">
              <div className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
                <Leaf className="w-4 h-4 text-[#d85c27]" />
                <span className="text-[11px] font-black tracking-widest uppercase">{text.hero_fresh}</span>
              </div>
              <div className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
                <Flame className="w-4 h-4 text-[#d85c27]" />
                <span className="text-[11px] font-black tracking-widest uppercase">{text.hero_spices}</span>
              </div>
              <div className="flex items-center gap-2.5 transition-transform duration-300 hover:scale-105">
                <Clock className="w-4 h-4 text-[#d85c27]" />
                <span className="text-[11px] font-black tracking-widest uppercase">{text.hero_ready}</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Rotating Circle Image with Responsive Whole-Unit Hover Scale */}
          <div className="flex-1 flex items-center justify-center md:justify-end">
            <div className="transition-transform duration-500 ease-out hover:scale-108 cursor-pointer">
              <div
                className="rounded-full overflow-hidden shadow-2xl animate-spin-dish"
                style={{ width: 'clamp(280px,38vw,520px)', height: 'clamp(280px,38vw,520px)' }}
              >
                <img
                  src="/assets/circle-Bq5xyFQD.png"
                  alt="Top down healthy Indian bowl"
                  className="w-full h-full object-cover pointer-events-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          2. HOUSE FAVORITES (LUNCH)
      ═══════════════════════════════════════════════ */}
      <section id="menu" className="bg-[#1e382f] text-white py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1320px] mx-auto">
          <div className="mb-14">
            <h2 className="text-[36px] md:text-[48px] font-black leading-tight mb-3">
              {text.lunch_title}
            </h2>
            <p className="text-white/70 text-[15px] max-w-[620px]">{text.lunch_desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {LUNCH_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group bg-[#fcf8f3] rounded-[24px] overflow-hidden flex flex-col text-[#1a1a1a] shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 border border-[#ebdcd0]/60"
              >
                <div className="relative h-[250px] overflow-hidden bg-[#fae8d8]/40">
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600 ease-out"
                  />
                  {/* Tag on upside */}
                  <span
                    className="absolute top-4 left-4 text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: badgeColor(item.badge) }}
                  >
                    {item.badge === 'NON-VEGETARIAN' ? 'Non-Vegetarian' : item.badge === 'VEGETARIAN' ? 'Vegetarian' : 'Vegan'}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-[19px] leading-snug mb-2 text-[#1a1a1a] group-hover:text-[#d85c27] transition-colors duration-300">{item.title}</h3>
                    <p className="text-[#777] text-[13px] leading-relaxed">{item.desc}</p>
                  </div>
                  {/* Bottom: Symbols on the left, price on the right */}
                  <div className="pt-3 mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {item.badge === 'VEGAN' && (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#2d6a4f]/15 text-[#2d6a4f]" title="Vegan">
                          <Leaf className="w-4 h-4 text-[#2d6a4f]" />
                        </span>
                      )}
                      {item.isSpicy && (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#d85c27]/15 text-base" title="Spicy">
                          🌶️
                        </span>
                      )}
                    </div>
                    <span className="text-[#d85c27] font-black text-[22px] text-right transition-transform duration-300 group-hover:scale-105 shrink-0">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          3. CUSTOMIZED TO YOUR TASTE — THE MAATI WAY
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#f5f0e8] py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1320px] mx-auto text-center">
          <p className="text-[#d85c27] font-black tracking-[0.2em] text-[13px] mb-3 uppercase">
            CUSTOMIZED TO YOUR TASTE
          </p>
          <h2 className="text-[40px] md:text-[56px] font-black text-[#1a1a1a] mb-14">
            The MAATI Way
          </h2>

          {/* Row 1: 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-[1100px] mx-auto">
            {MAATI_WAY_STEPS.slice(0, 3).map((s) => (
              <div
                key={s.step}
                className="bg-[#d85c27] text-white rounded-[24px] p-8 text-left shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-white text-[#d85c27] flex items-center justify-center font-black text-[16px] mb-5 shadow-sm">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-[19px] mb-4 leading-snug text-white">{s.title}</h3>
                  <ul className="space-y-2 text-[13px] text-white/95">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-1.5">
                        <span className="text-white/60 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Row 2: 2 cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[730px] mx-auto mt-8">
            {MAATI_WAY_STEPS.slice(3, 5).map((s) => (
              <div
                key={s.step}
                className="bg-[#d85c27] text-white rounded-[24px] p-8 text-left shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 rounded-full bg-white text-[#d85c27] flex items-center justify-center font-black text-[16px] mb-5 shadow-sm">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-[19px] mb-4 leading-snug text-white">{s.title}</h3>
                  <ul className="space-y-2 text-[13px] text-white/95">
                    {s.items.map((item) => (
                      <li key={item} className="flex items-start gap-1.5">
                        <span className="text-white/60 font-bold">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          4. HOUSE FAVORITES (BREAKFAST)
      ═══════════════════════════════════════════════ */}
      <section className="bg-white py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1320px] mx-auto">
          <div className="mb-14">
            <h2 className="text-[36px] md:text-[48px] font-black text-[#1a1a1a] leading-tight mb-2">
              {text.breakfast_title}
            </h2>
            <p className="text-[#666] text-[15px]">{text.breakfast_desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {BREAKFAST_ITEMS.map((item) => (
              <div
                key={item.id}
                className="group bg-[#fcf8f3] rounded-[24px] overflow-hidden flex flex-col shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 border border-[#ebdcd0]/60"
              >
                <div className="relative h-[250px] overflow-hidden bg-[#fae8d8]/40">
                  <img
                    src={item.img}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600 ease-out"
                  />
                  {/* Tag on upside */}
                  <span
                    className="absolute top-4 left-4 text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105"
                    style={{ backgroundColor: badgeColor(item.badge) }}
                  >
                    {item.badge === 'VEGTARIAN' || item.badge === 'VEGETARIAN' ? 'Vegetarian' : item.badge}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-bold text-[19px] text-[#1a1a1a] leading-snug mb-2 group-hover:text-[#d85c27] transition-colors duration-300">{item.title}</h3>
                    <p className="text-[#777] text-[13px] leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="pt-3 mt-auto flex items-center justify-end">
                    <span className="text-[#d85c27] font-black text-[24px] text-right transition-transform duration-300 group-hover:scale-105">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          5. MAATI COLD SPECIALS
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#f5f0e8] py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1320px] mx-auto">
          <div className="mb-14">
            <h2 className="text-[36px] md:text-[44px] font-black text-[#1a1a1a]">{text.cold_title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {COLD_DRINKS.map((drink) => (
              <div
                key={drink.id}
                className="group bg-[#fcf8f3] rounded-[24px] overflow-hidden flex flex-col shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 border border-[#ebdcd0]/60"
              >
                <div className="relative h-[250px] overflow-hidden bg-[#fae8d8]/40">
                  <img
                    src={drink.img}
                    alt={drink.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600 ease-out"
                  />
                  {drink.badge && (
                    <span
                      className="absolute top-4 left-4 text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: badgeColor(drink.badge) }}
                    >
                      {drink.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-[18px] text-[#1a1a1a] mb-2 group-hover:text-[#d85c27] transition-colors duration-300">{drink.title}</h3>
                    {drink.desc && <p className="text-[#777] text-[13px] leading-relaxed mb-4">{drink.desc}</p>}
                  </div>
                  <div className="pt-3 mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {drink.badge === 'VEGAN' && (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#2d6a4f]/15 text-[#2d6a4f]" title="Vegan">
                          <Leaf className="w-4 h-4 text-[#2d6a4f]" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-[16px]">
                      {drink.sizes.map((s) => (
                        <span key={s.label} className="flex items-baseline gap-1.5">
                          <span className="font-black text-[#1a1a1a] text-[16px] md:text-[18px]">{s.label.split(' ')[0]}</span>
                          <strong className="text-[#d85c27] font-black text-[22px] md:text-[26px]">{s.price}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          6. MAATI HOT SPECIALS
      ═══════════════════════════════════════════════ */}
      <section className="bg-white py-24 px-8 md:px-16 lg:px-24">
        <div className="max-w-[1320px] mx-auto">
          <div className="mb-14">
            <h2 className="text-[36px] md:text-[44px] font-black text-[#1a1a1a]">{text.hot_title}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HOT_DRINKS.map((drink) => (
              <div
                key={drink.id}
                className="group bg-[#fffdfa] rounded-[26px] overflow-hidden flex flex-col shadow-sm hover:shadow-2xl transition-all duration-400 hover:-translate-y-2 border border-[#ebdcd0]/70"
              >
                <div className="relative h-[250px] overflow-hidden bg-[#fae8d8]/40 shrink-0">
                  <img
                    src={drink.img}
                    alt={drink.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600 ease-out"
                  />
                  {drink.badge && (
                    <span
                      className="absolute top-4 left-4 text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundColor: badgeColor(drink.badge) }}
                    >
                      {drink.badge}
                    </span>
                  )}
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-[20px] text-[#1a1a1a] mb-2 leading-snug group-hover:text-[#d85c27] transition-colors duration-300">{drink.title}</h3>
                    {drink.desc && <p className="text-[#777] text-[13.5px] leading-relaxed mb-4">{drink.desc}</p>}
                  </div>
                  <div className="pt-2 mt-auto flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      {drink.badge === 'VEGAN' && (
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#2d6a4f]/15 text-[#2d6a4f]" title="Vegan">
                          <Leaf className="w-4 h-4 text-[#2d6a4f]" />
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-[16px]">
                      {drink.sizes.map((s) => (
                        <span key={s.label} className="flex items-baseline gap-1.5">
                          <span className="font-black text-[#1a1a1a] text-[16px] md:text-[18px]">{s.label.split(' ')[0]}</span>
                          <strong className="text-[#d85c27] font-black text-[22px] md:text-[26px]">{s.price}</strong>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          7. EXPERIENCE
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#f5f0e8] py-20 md:py-28 px-8 sm:px-12 md:px-20 lg:px-28">
        <div className="max-w-[1360px] mx-auto">
          {/* Centered Heading */}
          <div className="text-center max-w-[800px] mx-auto mb-12 md:mb-16">
            <p className="text-[#d85c27] font-black text-[13px] tracking-[0.2em] uppercase mb-3">
              {text.experience_label || 'EXPERIENCE'}
            </p>
            <h2 className="text-[34px] sm:text-[42px] md:text-[48px] font-black text-[#1a1a1a] leading-tight mb-4">
              {text.experience_title || 'Breakfast, Lunch and Events at MAATI'}
            </h2>
            <p className="text-[#666] text-[15px] leading-relaxed max-w-[620px] mx-auto">
              {text.experience_desc || 'A warm, modern space designed for quick breakfast & lunches and cozy events alike.'}
            </p>
          </div>

          {/* Two Side-by-Side Rounded Images with Staggered Height Offset */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-start pt-4 pb-8">
            {/* Left Image (Lower offset) */}
            <div className="group rounded-[32px] md:rounded-[36px] overflow-hidden shadow-sm bg-[#ebdcd0]/30 h-[360px] sm:h-[440px] md:h-[480px] lg:h-[520px] w-full md:mt-12 transition-transform duration-500">
              <img
                src="/assets/show5-BiQql1jr.jpeg"
                alt="MAATI warm dining ambiance and light installation"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            {/* Right Image (Higher offset) */}
            <div className="group rounded-[32px] md:rounded-[36px] overflow-hidden shadow-sm bg-[#ebdcd0]/30 h-[360px] sm:h-[440px] md:h-[480px] lg:h-[520px] w-full md:-mt-2 transition-transform duration-500">
              <img
                src="/assets/show2-CM6MShfY.jpeg"
                alt="MAATI window seats with woven pendant lamps"
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          8. READY TO EAT — FULL-WIDTH BANNER
      ═══════════════════════════════════════════════ */}
      <section className="bg-[#1e382f] text-white py-24 md:py-32 px-8 md:px-16 lg:px-24 text-center">
        <div className="max-w-[800px] mx-auto flex flex-col items-center">
          <h2 className="text-[44px] md:text-[58px] font-black text-white leading-tight mb-4">
            Ready to Eat?
          </h2>
          <p className="text-white/80 text-[15px] md:text-[16px] leading-relaxed mb-10 max-w-[620px]">
            {isDe
              ? 'Besuchen Sie uns in der Zimmerstr. 56, 10117 Berlin – wo jeder Bissen eine Geschichte erzählt. 😊'
              : 'Visit us at Zimmerstr. 56, 10117 Berlin - where every bite tells a story. 😊'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center bg-[#d85c27] text-white font-bold text-[15px] px-8 py-3.5 rounded-full hover:bg-[#c2501f] transition-all duration-300 transform hover:scale-105 shadow-md min-w-[150px]"
            >
              {text.ready_btn_menu || 'View Menu'}
            </Link>
            <button
              onClick={onOpenReservation}
              className="inline-flex items-center justify-center border-2 border-white text-white font-bold text-[15px] px-8 py-3.5 rounded-full hover:bg-white hover:text-[#1e382f] transition-all duration-300 transform hover:scale-105 min-w-[150px]"
            >
              {text.ready_btn_res || 'Reservations'}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
