import React from 'react';
import { Leaf } from 'lucide-react';
import { MenuItem } from '../data/june2026MenuData';

interface MenuCardProps {
  item: MenuItem;
  lang?: 'de' | 'en';
}

const dietBadgeColor = (badge?: string) => {
  if (badge === 'VEGAN') return '#2d6a4f';
  if (badge === 'VEGETARISCH' || badge === 'VEGETARIAN' || badge === 'VEGTARIAN') return '#1e382f';
  return '#d85c27';
};

export const MenuCard: React.FC<MenuCardProps> = ({ item, lang = 'en' }) => {
  const isDe = lang === 'de';
  const title = isDe ? item.titleDe : item.titleEn;
  const desc = isDe ? item.descDe : item.descEn;
  const badge = isDe ? item.badgeDe : item.badgeEn;
  const isVegan = item.badgeDe === 'VEGAN' || item.badgeEn === 'VEGAN' || item.isVeganLeaf;

  const renderPrice = (priceStr?: string) => {
    if (!priceStr) return null;

    if (priceStr.includes('M') && priceStr.includes('L')) {
      const parts = priceStr.split(/[|]/).map((p) => p.trim());
      return (
        <div className="flex items-center gap-4 text-[16px]">
          {parts.map((p, idx) => {
            const match = p.match(/([A-Za-z]+)\s*([€\d.,]+)/);
            if (match) {
              return (
                <span key={idx} className="flex items-baseline gap-1.5">
                  <span className="font-black text-[#1a1a1a] text-[16px] md:text-[18px]">{match[1]}</span>
                  <span className="text-[#d85c27] font-black text-[22px] md:text-[26px]">{match[2]}</span>
                </span>
              );
            }
            return (
              <span key={idx} className="text-[#d85c27] font-black text-[22px] md:text-[26px]">
                {p}
              </span>
            );
          })}
        </div>
      );
    }

    return (
      <span className="text-[#d85c27] font-black text-[26px] leading-none text-right transition-transform duration-300 group-hover:scale-105 shrink-0">
        {priceStr}
      </span>
    );
  };

  return (
    <div
      id={item.id}
      className="group scroll-mt-28 bg-[#fffdfa] rounded-[26px] overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ease-out border border-[#ebdcd0]/70 h-full"
    >
      {/* ── Top Food Image Area with Badge ── */}
      <div className="relative h-[250px] w-full overflow-hidden bg-[#fae8d8]/40 shrink-0">
        {item.img ? (
          <img
            src={item.img}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600 ease-out"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#ebdcd0]/40 text-gray-400 font-bold">
            MAATI Kitchen
          </div>
        )}

        {/* Dietary Pill Badge on Top Left */}
        {badge && (
          <span
            className="absolute top-4 left-4 text-white text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: dietBadgeColor(item.badgeDe) }}
          >
            {badge}
          </span>
        )}

        {/* Spicy Icon on Top Right if applicable */}
        {item.isSpicy && (
          <span className="absolute top-4 right-4 text-lg bg-white/80 backdrop-blur-sm rounded-full px-2 py-0.5 shadow-sm">
            🌶️
          </span>
        )}
      </div>

      {/* ── Card Content Area ── */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-extrabold text-[20px] text-[#1a1a1a] mb-2 leading-snug group-hover:text-[#d85c27] transition-colors duration-300">
            {title}
          </h3>
          {desc && (
            <p className="text-[#777] text-[13.5px] leading-relaxed mb-4">
              {desc}
            </p>
          )}
        </div>

        {/* ── Bottom Area: Vegan Symbol on Left, Price on Right ── */}
        <div className="pt-2 mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isVegan && (
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#2d6a4f]/15 text-[#2d6a4f]" title="Vegan">
                <Leaf className="w-4 h-4 text-[#2d6a4f]" />
              </span>
            )}
          </div>

          <div className="flex justify-end">
            {renderPrice(item.price)}
          </div>
        </div>
      </div>
    </div>
  );
};
