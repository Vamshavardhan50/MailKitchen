import React from 'react';
import { Leaf } from 'lucide-react';
import { MenuItem } from '../data/june2026MenuData';

interface MenuCardProps {
  item: MenuItem;
  lang?: 'de' | 'en';
  layout?: 'vertical' | 'horizontal';
}

const dietBadgeColor = (badge?: string) => {
  if (badge === 'VEGAN') return '#2d6a4f';
  if (badge === 'VEGETARISCH' || badge === 'VEGETARIAN' || badge === 'VEGTARIAN') return '#1e382f';
  return '#d85c27';
};

export const MenuCard: React.FC<MenuCardProps> = ({ item, lang = 'en', layout = 'vertical' }) => {
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
        <div className="flex items-center gap-3.5 text-[14px]">
          {parts.map((p, idx) => {
            const match = p.match(/([A-Za-z]+)\s*([€\d.,]+)/);
            if (match) {
              return (
                <span key={idx} className="flex items-baseline gap-1">
                  <span className="font-black text-[#1a1a1a] text-[13px]">{match[1]}</span>
                  <span className="text-[#d85c27] font-black text-[18px]">{match[2]}</span>
                </span>
              );
            }
            return (
              <span key={idx} className="text-[#d85c27] font-black text-[18px]">
                {p}
              </span>
            );
          })}
        </div>
      );
    }

    return (
      <span className="text-[#d85c27] font-black text-[24px] leading-none text-right transition-transform duration-300 group-hover:scale-105 shrink-0">
        {priceStr}
      </span>
    );
  };

  // ── HORIZONTAL SPLIT CARD LAYOUT ──
  if (layout === 'horizontal') {
    return (
      <div
        id={item.id}
        className="group scroll-mt-28 bg-[#fcf8f3] rounded-[24px] overflow-hidden flex flex-col sm:flex-row shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ease-out border border-[#ebdcd0]/70 h-full"
      >
        {/* Left Side: Image with Badge Tag */}
        <div className="relative w-full sm:w-[210px] md:w-[230px] h-[210px] sm:h-auto overflow-hidden bg-[#fae8d8]/40 shrink-0">
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

          {badge && (
            <span
              className="absolute top-4 left-4 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: dietBadgeColor(item.badgeDe) }}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Right Side: Content */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-[20px] text-[#1a1a1a] mb-2 leading-snug group-hover:text-[#d85c27] transition-colors duration-300">
              {title}
            </h3>
            {desc && (
              <p className="text-[#666] text-[13.5px] leading-relaxed mb-4">
                {desc}
              </p>
            )}
          </div>

          {/* Bottom: Symbols on the left, multi-size or single price on the right */}
          <div className="pt-3 mt-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {isVegan && (
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

            <div className="flex justify-end">
              {renderPrice(item.price)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── VERTICAL CARD LAYOUT ──
  return (
    <div
      id={item.id}
      className="group scroll-mt-28 bg-[#fcf8f3] rounded-[24px] overflow-hidden flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-400 ease-out border border-[#ebdcd0]/70 h-full"
    >
      {/* Top Food Image with Tag Badge on Upside */}
      <div className="relative h-[250px] w-full overflow-hidden bg-[#fae8d8]/50 shrink-0">
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

        {badge && (
          <span
            className="absolute top-4 left-4 text-white text-[11px] font-bold px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundColor: dietBadgeColor(item.badgeDe) }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Card Content Area */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-[20px] text-[#1a1a1a] mb-2 leading-snug group-hover:text-[#d85c27] transition-colors duration-300">
            {title}
          </h3>
          {desc && (
            <p className="text-[#777] text-[14px] leading-relaxed mb-4">
              {desc}
            </p>
          )}
        </div>

        {/* Bottom: Symbols on the left, Price on the right */}
        <div className="pt-3 mt-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {isVegan && (
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

          <div className="flex justify-end">
            {renderPrice(item.price)}
          </div>
        </div>
      </div>
    </div>
  );
};
