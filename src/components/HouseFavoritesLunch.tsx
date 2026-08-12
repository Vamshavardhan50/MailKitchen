import React from 'react';
import { LunchItem, LUNCH_ITEMS, DICTIONARY } from '../data/content';

interface HouseFavoritesLunchProps {
  lang: 'de' | 'en';
  items?: LunchItem[];
}

export const HouseFavoritesLunch: React.FC<HouseFavoritesLunchProps> = ({ lang, items = LUNCH_ITEMS }) => {
  const text = DICTIONARY[lang];

  return (
    <section id="menu" className="bg-[#1e382f] text-white py-20 px-6 md:px-10">
      <div className="max-w-[1280px] mx-auto">

        {/* Section Header */}
        <div className="mb-12">
          <h2 className="text-[36px] md:text-[48px] font-black leading-tight mb-3">
            {text.lunch_title}
          </h2>
          <p className="text-white/60 text-[15px]">{text.lunch_desc}</p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-[20px] overflow-hidden flex flex-col text-[#1a1a1a]">
              {/* Image */}
              <div className="relative h-[240px] overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <span className="absolute top-4 left-4 bg-[#d85c27] text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wide">
                  {item.badge}
                </span>
              </div>

              {/* Content */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="font-black text-[18px] leading-snug mb-3">{item.title}</h3>
                <p className="text-[#666] text-[13px] leading-relaxed flex-1">{item.desc}</p>
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    {item.isSpicy && <span className="text-[16px]">🌶️</span>}
                    {item.isVeganLeaf && <span className="text-[16px]">🍃</span>}
                  </div>
                  <span className="text-[#d85c27] font-black text-[20px]">{item.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
