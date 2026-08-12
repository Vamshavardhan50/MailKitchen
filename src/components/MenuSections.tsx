import React from 'react';
import { BREAKFAST_ITEMS, COLD_DRINKS, HOT_DRINKS, DICTIONARY } from '../data/content';

interface MenuSectionsProps {
  lang: 'de' | 'en';
}

export const MenuSections: React.FC<MenuSectionsProps> = ({ lang }) => {
  const text = DICTIONARY[lang];

  return (
    <>
      {/* ── House Favorites (Breakfast) ── */}
      <section className="bg-[#f5f0e8] py-20 px-6 md:px-10">
        <div className="max-w-[1280px] mx-auto">
          <div className="mb-12">
            <h2 className="text-[36px] md:text-[48px] font-black text-[#1a1a1a] leading-tight mb-2">
              {text.breakfast_title}
            </h2>
            <p className="text-[#777] text-[15px]">{text.breakfast_desc}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {BREAKFAST_ITEMS.map((item) => (
              <div key={item.id} className="bg-white rounded-[20px] overflow-hidden flex flex-col text-[#1a1a1a]">
                <div className="relative h-[240px] overflow-hidden">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-4 left-4 bg-[#d85c27] text-white text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wide">
                    {item.badge}
                  </span>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-black text-[18px] leading-snug mb-2">{item.title}</h3>
                  <p className="text-[#666] text-[13px] leading-relaxed flex-1">{item.desc}</p>
                  <div className="mt-5 pt-4 border-t border-gray-100 text-right">
                    <span className="text-[#d85c27] font-black text-[20px]">{item.price}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Maati Cold Specials ── */}
      <section className="bg-[#1e382f] text-white py-20 px-6 md:px-10">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-[36px] md:text-[44px] font-black mb-10">{text.cold_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COLD_DRINKS.map((drink) => (
              <div key={drink.id} className="bg-white/10 rounded-[20px] overflow-hidden text-white">
                <div className="h-[200px] overflow-hidden">
                  <img src={drink.img} alt={drink.title} className="w-full h-full object-cover opacity-80" />
                </div>
                <div className="p-6">
                  <h3 className="font-black text-[18px] mb-3">{drink.title}</h3>
                  <div className="flex gap-4">
                    {drink.sizes.map((size) => (
                      <div key={size.label} className="flex items-center gap-1">
                        <span className="text-white/60 text-[13px] font-bold">{size.label}</span>
                        <span className="text-[#d85c27] font-black text-[16px]">{size.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Maati Hot Specials ── */}
      <section className="bg-[#f5f0e8] py-20 px-6 md:px-10">
        <div className="max-w-[1280px] mx-auto">
          <h2 className="text-[36px] md:text-[44px] font-black text-[#1a1a1a] mb-10">{text.hot_title}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {HOT_DRINKS.map((drink) => (
              <div key={drink.id} className="bg-white rounded-[20px] overflow-hidden flex flex-col text-[#1a1a1a]">
                <div className="h-[200px] overflow-hidden">
                  <img src={drink.img} alt={drink.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <h3 className="font-black text-[18px] mb-3">{drink.title}</h3>
                  <div className="flex gap-4">
                    {drink.sizes.map((size) => (
                      <div key={size.label} className="flex items-center gap-1">
                        <span className="text-[#777] text-[13px] font-bold">{size.label}</span>
                        <span className="text-[#d85c27] font-black text-[16px]">{size.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
