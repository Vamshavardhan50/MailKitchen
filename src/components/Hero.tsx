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
    <section className="min-h-[calc(100vh-88px)] md:min-h-[calc(100vh-96px)] bg-[#f5f0e8] flex items-center pt-[100px] md:pt-[120px] pb-16">
      <div className="max-w-[1280px] mx-auto px-6 md:px-10 w-full flex flex-col md:flex-row items-center gap-12 py-8 md:py-12">

        {/* LEFT TEXT */}
        <div className="flex-1 flex flex-col justify-center">
          {/* Badge */}
          <div className="inline-flex items-center mb-6">
            <span className="border border-[#d85c27] text-[#d85c27] text-[11px] font-bold tracking-[0.15em] px-4 py-1.5 rounded-full">
              {text.hero_badge}
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[48px] md:text-[58px] lg:text-[68px] font-black leading-[1.05] mb-6 text-[#1a1a1a]">
            {text.hero_title_1}
            <br />
            <span className="text-[#d85c27] italic">{text.hero_title_2}</span>
          </h1>

          {/* Subtitle */}
          <p className="text-[17px] text-[#555] leading-relaxed mb-10 max-w-[480px]">
            {text.hero_desc}
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 mb-12">
            <a
              href="/menu"
              className="inline-flex items-center gap-3 bg-[#d85c27] text-white font-bold text-[15px] px-7 py-3.5 rounded-full hover:bg-[#c2501f] transition-colors"
            >
              {text.hero_btn_menu}
              <span className="text-[18px] font-black">→</span>
            </a>
            <button
              onClick={onOpenReservation}
              className="inline-flex items-center border-2 border-[#1a1a1a] text-[#1a1a1a] font-bold text-[15px] px-7 py-3.5 rounded-full hover:bg-[#1a1a1a] hover:text-white transition-all"
            >
              {text.hero_btn_res}
            </button>
          </div>

          {/* Feature Row */}
          <div className="flex items-center gap-8 text-[#666]">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-[#d85c27]" />
              <span className="text-[11px] font-black tracking-widest">{text.hero_fresh}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#d85c27]" />
              <span className="text-[11px] font-black tracking-widest">{text.hero_spices}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#d85c27]" />
              <span className="text-[11px] font-black tracking-widest">{text.hero_ready}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: Single Large Circle with food spread & rotation on load + interactive hover */}
        <div className="flex-1 flex items-center justify-center md:justify-end">
          <div
            className="
              group
              w-[340px] h-[340px]
              sm:w-[420px] sm:h-[420px]
              md:w-[480px] md:h-[480px]
              lg:w-[540px] lg:h-[540px]
              rounded-full
              border-[20px] md:border-[24px]
              border-white
              overflow-hidden
              shadow-2xl
              bg-white
              animate-rotate-load
              transition-all
              duration-700
              ease-out
              hover:scale-105
              hover:rotate-6
              cursor-pointer
            "
          >
            <img
              src="/assets/circle-Bq5xyFQD.png"
              alt="MAATI Fresh Indian food spread"
              className="w-full h-full object-cover scale-105 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:rotate-6"
            />
          </div>
        </div>

      </div>
    </section>
  );
};
