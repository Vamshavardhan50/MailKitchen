import React from 'react';
import { SEO } from './SEO';
import { Sparkles, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLandingPagesContent, DEFAULT_LANDING_PAGES } from '../lib/sanityService';

interface MenuCategoryLandingProps {
  categoryKey: 'naan-pockets' | 'bowls' | 'breakfast' | 'coffee-chai';
  lang?: 'de' | 'en';
  onOpenReservation?: () => void;
}

export const MenuCategoryLanding: React.FC<MenuCategoryLandingProps> = ({
  categoryKey,
  lang = 'en',
  onOpenReservation
}) => {
  const isDe = lang === 'de';
  const { content: liveLanding } = useLandingPagesContent();
  const data = (liveLanding && liveLanding[categoryKey]) || DEFAULT_LANDING_PAGES[categoryKey];

  const pageTitle = isDe ? data.titleDe : data.titleEn;
  const pageDesc = isDe ? data.descDe : data.descEn;
  const pageH1 = isDe ? data.h1De : data.h1En;
  const pageBadge = isDe ? data.badgeDe : data.badgeEn;
  const pageIntro = isDe ? data.introDe : data.introEn;
  const enPath = `/menu/${categoryKey}`;
  const canonicalUrl = isDe ? `https://maatikitchen.com/de/menu/${categoryKey}` : `https://maatikitchen.com${enPath}`;

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://maatikitchen.com/'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'Menu',
        'item': 'https://maatikitchen.com/menu'
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': pageH1,
        'item': canonicalUrl
      }
    ]
  };

  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-8 md:px-16 lg:px-24">
      <SEO
        title={pageTitle}
        description={pageDesc}
        canonicalUrl={canonicalUrl}
        lang={lang}
        enPath={enPath}
        structuredData={breadcrumbSchema}
      />

      <div className="max-w-[1200px] mx-auto space-y-12">
        {/* Breadcrumb Navigation */}
        <nav aria-label="Breadcrumb" className="text-[13px] text-[#666] flex items-center gap-2">
          <Link to={isDe ? '/de' : '/'} className="hover:text-[#d85c27] transition-colors">
            {isDe ? 'Startseite' : 'Home'}
          </Link>
          <span>/</span>
          <Link to={isDe ? '/de/menu' : '/menu'} className="hover:text-[#d85c27] transition-colors">
            {isDe ? 'Speisekarte' : 'Menu'}
          </Link>
          <span>/</span>
          <span className="text-[#1e382f] font-bold">{pageH1}</span>
        </nav>

        {/* Hero Banner */}
        <div className="bg-[#1e382f] text-white rounded-[32px] p-8 sm:p-14 shadow-2xl relative overflow-hidden">
          <div className="max-w-[700px] space-y-5 relative z-10">
            <span className="bg-[#d85c27] text-white text-[11px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full uppercase inline-block">
              {pageBadge}
            </span>
            <h1 className="text-[34px] sm:text-[46px] font-black leading-tight text-white">
              {pageH1}
            </h1>
            <p className="text-white/80 text-[16px] leading-relaxed">
              {pageIntro}
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to={isDe ? '/de/menu' : '/menu'}
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-7 py-3.5 rounded-full text-[14px] shadow-lg transition-transform hover:scale-105 inline-flex items-center gap-2"
              >
                <span>{isDe ? 'Vollständige Speisekarte' : 'View Full Menu'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              {onOpenReservation && (
                <button
                  onClick={onOpenReservation}
                  className="border-2 border-white/30 hover:border-white text-white font-bold px-7 py-3 rounded-full text-[14px] transition-colors"
                >
                  {isDe ? 'Tisch reservieren' : 'Make a Reservation'}
                </button>
              )}
            </div>
          </div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#d85c27]/20 blur-3xl pointer-events-none" />
        </div>

        {/* Featured Items Grid */}
        <div className="space-y-6">
          <h2 className="text-[26px] font-black text-[#1e382f]">
            {isDe ? 'Highlights dieser Kategorie' : 'Category Highlights & Selections'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(data.items || []).map((item: any, idx: number) => {
              const itemName = isDe ? (item.nameDe || item.name) : (item.nameEn || item.name);
              const itemDesc = isDe ? (item.descDe || item.desc) : (item.descEn || item.desc);
              const itemPrice = isDe ? (data.priceDe || data.priceEn || '') : (data.priceEn || data.priceDe || '');

              return (
                <div
                  key={idx}
                  className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  <div className="space-y-3">
                    <span className="text-[11px] font-black tracking-widest uppercase px-3 py-1 rounded-full bg-[#fdf5f0] text-[#d85c27] inline-block">
                      {item.dietary}
                    </span>
                    <h3 className="text-[19px] font-bold text-[#1e382f] leading-snug">{itemName}</h3>
                    <p className="text-[#666] text-[13.5px] leading-relaxed">{itemDesc}</p>
                  </div>
                  <div className="pt-5 mt-5 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-black text-[#d85c27] text-[16px]">{itemPrice}</span>
                    <Link
                      to={isDe ? '/de/menu' : '/menu'}
                      className="text-[12.5px] font-bold text-[#1e382f] hover:text-[#d85c27] transition-colors inline-flex items-center gap-1"
                    >
                      <span>{isDe ? 'Im Menü ansehen' : 'Explore in Menu'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Delivery Partners & Order Callout */}
        <div className="bg-white rounded-[28px] p-8 border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-[20px] font-black text-[#1e382f]">
              {isDe ? 'Lust auf frisches Essen im Büro oder zu Hause?' : 'Craving fresh MAATI at the office or home?'}
            </h3>
            <p className="text-[#666] text-[14px] mt-1">
              {isDe
                ? 'Bestellen Sie ganz bequem zur Abholung in der Zimmerstraße 56 oder über unsere Berliner Lieferpartner.'
                : 'Order for quick takeaway at Zimmerstraße 56 or have it delivered via our online partners.'}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <a
              href="https://www.lieferando.de/speisekarte/maati-indische-kuche-und-cafe-berlin"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#FF8000] text-white px-5 py-2.5 rounded-full font-bold text-[13px] hover:opacity-90 shadow-sm transition-opacity"
            >
              Lieferando
            </a>
            <a
              href="https://www.ubereats.com/de/store/maati/OS3dPd_3VuuLuJYMUIWoYA"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#06C167] text-white px-5 py-2.5 rounded-full font-bold text-[13px] hover:opacity-90 shadow-sm transition-opacity"
            >
              Uber Eats
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
