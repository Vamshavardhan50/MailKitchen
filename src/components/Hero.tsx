import React from 'react';
import { Leaf, Flame, Clock } from 'lucide-react';
import { DICTIONARY } from '../data/content';

interface HeroProps {
  lang: 'de' | 'en';
  onOpenReservation: () => void;
}

export const Hero: React.FC<HeroProps> = ({ lang, onOpenReservation }) => {
  const text = DICTIONARY[lang];

  return (
    <section className="min-h-[calc(100vh-80px)] bg-[#f5f0e8] flex items-center pt-[90px] sm:pt-[110px] md:pt-[120px] pb-12 sm:pb-16">
      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 md:px-10 w-full flex flex-col md:flex-row items-center gap-8 sm:gap-12 py-4 sm:py-8 md:py-12">

        {/* LEFT TEXT */}
        <div className="flex-1 flex flex-col justify-center text-left">
          {/* Badge */}
          <div className="inline-flex items-center mb-4 sm:mb-6">
            <span className="bg-[#d85c27] text-white text-[10.5px] sm:text-[11px] font-black tracking-[0.18em] px-3.5 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase shadow-sm transition-transform duration-300 hover:scale-105">
              {text.hero_badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-black leading-[1.06] mb-4 sm:mb-6 text-[#1a1a1a]" style={{ fontSize: 'clamp(34px, 5.5vw, 68px)' }}>
            {text.hero_title_1}
            <br />
            <span className="text-[#d85c27] italic">{text.hero_title_2}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] sm:text-[17px] text-[#555] leading-relaxed mb-8 sm:mb-10 max-w-[500px]">
            {text.hero_desc}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-8 sm:mb-12">
            <a
              href="/menu"
              className="inline-flex items-center gap-2.5 bg-[#d85c27] text-white font-bold text-[14px] sm:text-[15px] px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-[#c2501f] transition-all shadow-sm hover:shadow-md"
            >
              {text.hero_btn_menu}
              <span className="text-[16px] sm:text-[18px] font-black">→</span>
            </a>
            <button
              onClick={onOpenReservation}
              className="inline-flex items-center border-2 border-[#1a1a1a] text-[#1a1a1a] font-bold text-[14px] sm:text-[15px] px-6 sm:px-7 py-3 sm:py-3.5 rounded-full hover:bg-[#1a1a1a] hover:text-white transition-all"
            >
              {text.hero_btn_res}
            </button>
          </div>

          {/* Feature Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 text-[#666]">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Leaf className="w-4 h-4 text-[#d85c27]" />
              <span className="text-[10.5px] sm:text-[11px] font-black tracking-widest">{text.hero_fresh}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Flame className="w-4 h-4 text-[#d85c27]" />
              <span className="text-[10.5px] sm:text-[11px] font-black tracking-widest">{text.hero_spices}</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Clock className="w-4 h-4 text-[#d85c27]" />
              <span className="text-[10.5px] sm:text-[11px] font-black tracking-widest">{text.hero_ready}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Single Large Circle with food spread & rotation on load */}
        <div className="flex-1 flex items-center justify-center md:justify-end w-full">
          <div className="transition-transform duration-500 ease-out hover:scale-105 cursor-pointer max-w-full">
            <div
              className="
                w-[280px] h-[280px]
                sm:w-[380px] sm:h-[380px]
                md:w-[440px] md:h-[440px]
                lg:w-[520px] lg:h-[520px]
                rounded-full
                overflow-hidden
                shadow-2xl
                animate-spin-dish
              "
            >
              <img
                src="/assets/circle-Bq5xyFQD.png"
                alt="MAATI Fresh Indian food spread"
                className="w-full h-full object-cover pointer-events-none"
              />
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
