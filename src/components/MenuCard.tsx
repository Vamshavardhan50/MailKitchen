import React from 'react';
import { Leaf, Flame } from 'lucide-react';
import { SanityMenuItem } from '../lib/sanityService';
import { MenuItem } from '../data/june2026MenuData';

interface MenuCardProps {
  item: SanityMenuItem | MenuItem;
  lang?: 'de' | 'en';
}

const getDietBadge = (item: SanityMenuItem | MenuItem, isDe: boolean) => {
  if ('foodType' in item && item.foodType) {
    if (item.foodType === 'vegan') return { text: 'VEGAN', color: '#2d6a4f' };
    if (item.foodType === 'vegetarian') return { text: isDe ? 'VEGETARISCH' : 'VEGETARIAN', color: '#1e382f' };
    return { text: 'NON-VEGETARIAN', color: '#d85c27' };
  }

  const badge = isDe ? item.badgeDe : item.badgeEn;
  if (badge === 'VEGAN') return { text: 'VEGAN', color: '#2d6a4f' };
  if (badge === 'VEGETARISCH' || badge === 'VEGETARIAN' || badge === 'VEGTARIAN') return { text: isDe ? 'VEGETARISCH' : 'VEGETARIAN', color: '#1e382f' };
  if (badge) return { text: 'NON-VEGETARIAN', color: '#d85c27' };
  return null;
};

export const MenuCard: React.FC<MenuCardProps> = ({ item, lang = 'en' }) => {
  const isDe = lang === 'de';
  const title = (isDe ? item.titleDe : item.titleEn) || item.titleEn || item.titleDe;
  const desc = isDe ? item.descDe : item.descEn;
  const price = (isDe ? item.priceDe : item.priceEn) || item.price;
  
  const dietBadge = getDietBadge(item, isDe);
  const isVegan =
    ('foodType' in item && item.foodType === 'vegan') ||
    item.badgeDe === 'VEGAN' ||
    item.badgeEn === 'VEGAN' ||
    item.isVeganLeaf;

  const renderPrice = (priceStr?: string) => {
    if (!priceStr) return null;

    if (priceStr.includes('|')) {
      const parts = priceStr.split(/[|]/).map((p) => p.trim());
      return (
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          {parts.map((p, idx) => {
            const match = p.match(/^([A-Za-z0-9ÄöüäÖÜß\s/,\.-]+)\s*([€\d.,]+)$/u);
            if (match) {
              return (
                <span key={idx} className="inline-flex items-baseline gap-1 bg-[#1e382f]/3 px-2.5 py-1 rounded-md text-[11px] md:text-[12px]">
                  <span className="font-bold text-[#1a1a1a]/85 uppercase tracking-wider">{match[1]}</span>
                  <span className="text-[#d85c27] font-black text-[14px] md:text-[15px]">{match[2]}</span>
                </span>
              );
            }
            return (
              <span key={idx} className="inline-flex items-center bg-[#1e382f]/3 px-2.5 py-1 rounded-md text-[13px] md:text-[14px] font-black text-[#d85c27]">
                {p}
              </span>
            );
          })}
        </div>
      );
    }

    return (
      <span className="inline-flex items-center bg-[#1e382f]/3 px-2.5 py-1 rounded-md text-[14px] md:text-[15px] font-black text-[#d85c27]">
        {priceStr}
      </span>
    );
  };

  const itemId = ('id' in item && item.id) ? item.id : ('_id' in item ? item._id : undefined);
  const isSoldOut = 'available' in item ? item.available === false : false;

  // Extract clean decimal price for search engine microdata (e.g. "€11,5" -> "11.50")
  const rawPriceStr = (isDe ? item.priceDe : item.priceEn) || item.price || '';
  const priceMatch = rawPriceStr.replace(',', '.').match(/\d+(\.\d+)?/);
  const numericPrice = priceMatch ? parseFloat(priceMatch[0]).toFixed(2) : '10.00';

  const dietSchemaUrl = isVegan
    ? 'https://schema.org/VeganDiet'
    : (dietBadge?.text === 'VEGETARIAN' || dietBadge?.text === 'VEGETARISCH')
    ? 'https://schema.org/VegetarianDiet'
    : undefined;

  return (
    <article
      id={itemId}
      itemScope
      itemType="https://schema.org/MenuItem"
      className={`group scroll-mt-28 bg-[#fffdfa] rounded-[24px] sm:rounded-[26px] overflow-hidden flex flex-col shadow-sm hover:shadow-xl transition-all duration-400 ease-out border border-[#ebdcd0]/70 h-full hover-lift ${
        isSoldOut ? 'opacity-60 grayscale-[35%]' : ''
      }`}
    >
      {/* Search Engine Dietary Metadata */}
      {dietSchemaUrl && <link itemProp="suitableForDiet" href={dietSchemaUrl} />}

      {/* ── Top Food Image Area with Badge ── */}
      <div className="relative h-[210px] sm:h-[240px] md:h-[250px] w-full overflow-hidden bg-[#fae8d8]/40 shrink-0">
        {item.img ? (
          <img
            src={item.img}
            alt={title}
            itemProp="image"
            loading="lazy"
            className={`w-full h-full transition-transform duration-600 ease-out group-hover:scale-108 ${
              item.img.toLowerCase().endsWith('.png') && (item.img.includes('water') || item.img.includes('still') || item.img.includes('cola') || item.img.includes('fanta') || item.img.includes('fuze') || item.img.includes('Mezo') || item.img.includes('vio') || item.img.includes('Thums'))
                ? 'object-contain p-3.5 bg-white/70'
                : 'object-cover'
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#ebdcd0]/40 text-gray-400 font-bold">
            MAATI Kitchen
          </div>
        )}

        {/* Sold Out Badge */}
        {isSoldOut ? (
          <span className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 bg-rose-600 text-white text-[10.5px] sm:text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-md">
            {isDe ? 'Ausverkauft' : 'Sold Out'}
          </span>
        ) : (
          /* Dietary Pill Badge on Top Left */
          dietBadge && (
            <span
              className="absolute top-3.5 left-3.5 sm:top-4 sm:left-4 text-white text-[10.5px] sm:text-[11px] font-black px-3.5 py-1 rounded-full uppercase tracking-wider shadow-sm transition-transform duration-300 group-hover:scale-105"
              style={{ backgroundColor: dietBadge.color }}
            >
              {dietBadge.text}
            </span>
          )
        )}

        {/* Spicy Icon on Top Right if applicable */}
        {item.isSpicy && (
          <span className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-sm text-orange-600 flex items-center justify-center" title="Spicy">
            <Flame className="w-4 h-4 fill-orange-500 text-orange-600" />
          </span>
        )}
      </div>

      {/* ── Card Content Area ── */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          <h3
            itemProp="name"
            className="font-extrabold text-[20px] text-[#1a1a1a] mb-2 leading-snug group-hover:text-[#d85c27] transition-colors duration-300"
          >
            {title}
          </h3>
          {desc && (
            <p
              itemProp="description"
              className="text-[#777] text-[13.5px] leading-relaxed mb-4"
            >
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

          {/* Microdata Offer for Google / Bing Crawlers */}
          <div
            itemProp="offers"
            itemScope
            itemType="https://schema.org/Offer"
            className="flex justify-end max-w-[70%]"
          >
            <meta itemProp="price" content={numericPrice} />
            <meta itemProp="priceCurrency" content="EUR" />
            <meta
              itemProp="availability"
              content={isSoldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock'}
            />
            {renderPrice(price)}
          </div>
        </div>
      </div>
    </article>
  );
};
