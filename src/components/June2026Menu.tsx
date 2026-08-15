import React, { useState } from 'react';
import { MenuCard } from './MenuCard';
import { useSanityMenu } from '../lib/sanityService';
import { SEO } from './SEO';
import { Info, Sparkles, ExternalLink, FileText, Eye, X } from 'lucide-react';

interface June2026MenuProps {
  lang?: 'de' | 'en';
  onOpenReservation?: () => void;
}

export const June2026Menu: React.FC<June2026MenuProps> = ({ lang = 'en' }) => {
  const isDe = lang === 'de';
  const { categories } = useSanityMenu();
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-8 md:px-16 lg:px-24">
      <SEO
        title={isDe ? 'Speisekarte | MAATI Kitchen Berlin Mitte' : 'Menu | MAATI Kitchen Berlin Mitte'}
        description={
          isDe
            ? 'Entdecken Sie die Speisekarte von MAATI Kitchen in Berlin Mitte. Frische Bowls, Naan-Taschen, hausgemachte Lassis, Kaffeespezialitäten und mehr.'
            : 'Explore the MAATI Kitchen menu in Berlin Mitte. Fresh Indian soul bowls, crispy naan pockets, homemade lassis, specialty coffee, and craft drinks.'
        }
        canonicalUrl="https://maatikitchen.com/menu"
        lang={lang}
      />

      <div className="max-w-[1360px] mx-auto space-y-8 sm:space-y-12">
        
        {/* ── HEADER ── */}
        <div className="text-left pb-4 border-b border-[#ebdcd0]">
          <h1 className="text-[28px] sm:text-[36px] md:text-[48px] font-black text-[#1e382f] leading-tight flex items-center gap-2.5 sm:gap-3">
            <Sparkles className="w-6 h-6 sm:w-8 sm:h-8 text-[#d85c27] shrink-0" />
            <span>{isDe ? 'Speisekarte' : 'Full Menu'}</span>
          </h1>
        </div>

        {/* ── STICKY HORIZONTAL CATEGORY NAVIGATION BAR (MOBILE & DESKTOP) ── */}
        {categories.length > 0 && (
          <div className="sticky top-[72px] z-30 -mx-4 sm:-mx-8 md:-mx-16 lg:-mx-24 px-4 sm:px-8 md:px-16 lg:px-24 py-2.5 bg-[#f5f0e8]/95 backdrop-blur-md border-y border-[#ebdcd0] shadow-xs">
            <div className="max-w-[1360px] mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
              {categories.map((cat) => {
                if (!cat.items || cat.items.length === 0) return null;
                const catName = (isDe ? cat.nameDe || cat.name : cat.name) || cat.name;
                const catSlug = typeof cat.slug === 'object' && cat.slug?.current ? cat.slug.current : (typeof cat.slug === 'string' ? cat.slug : cat._id);

                return (
                  <a
                    key={cat._id}
                    href={`#${catSlug}`}
                    className="whitespace-nowrap bg-white hover:bg-[#1e382f] text-[#1e382f] hover:text-white border border-[#ebdcd0] font-extrabold text-[12px] sm:text-[13px] px-3.5 sm:px-4 py-1.5 rounded-full shadow-xs transition-all shrink-0"
                  >
                    {catName} ({cat.items.length})
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DYNAMIC CATEGORIES RENDERED FROM SANITY ── */}
        {categories.map((cat) => {
          if (!cat.items || cat.items.length === 0) return null;

          const catName = (isDe ? cat.nameDe || cat.name : cat.name) || cat.name;
          const catDesc = isDe ? cat.descriptionDe || cat.description : cat.description;
          const catSlug = typeof cat.slug === 'object' && cat.slug?.current ? cat.slug.current : (typeof cat.slug === 'string' ? cat.slug : cat._id);

          return (
            <section key={cat._id} id={catSlug} className="space-y-5 sm:space-y-6 scroll-mt-32">
              <div>
                <span className="text-[#d85c27] font-black text-[11px] sm:text-[12px] uppercase tracking-[0.2em]">
                  MAATI SELECTION
                </span>
                <h2 className="text-[24px] sm:text-[32px] md:text-[38px] font-black text-[#1e382f] leading-tight">
                  {catName}
                </h2>
                {catDesc && (
                  <p className="text-[#666] text-[13px] sm:text-[14px] mt-1">{catDesc}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-7">
                {cat.items.map((item) => (
                  <MenuCard key={item._id || item.id} item={item} lang={lang} />
                ))}
              </div>
            </section>
          );
        })}

        {/* ── ALLERGENS BANNER ── */}
        <div className="bg-[#ebdcd0]/80 border border-[#ebdcd0] rounded-[24px] p-4 sm:p-6 text-center text-[12.5px] sm:text-[14px] text-[#1e382f] font-bold flex items-center justify-center gap-2.5 shadow-sm">
          <Info className="w-5 h-5 text-[#d85c27] shrink-0" />
          <span>
            {isDe
              ? 'Für Informationen zu Allergenen fragen Sie bitte am Counter.'
              : 'For allergen information, please ask at the counter.'}
          </span>
        </div>

        {/* ── COMPLETE PRINT / VISUAL MENU CARDS & HYPERLINK SECTION ── */}
        <div className="bg-white rounded-[28px] border border-[#ebdcd0] p-5 sm:p-8 md:p-12 shadow-sm space-y-6 sm:space-y-8">
          <div className="pb-5 sm:pb-6 border-b border-gray-100">
            <span className="text-[#d85c27] font-black text-[11px] sm:text-[12px] uppercase tracking-[0.2em] flex items-center gap-1.5 mb-1">
              <FileText className="w-4 h-4" />
              {isDe ? 'OFFIZIELLE SPEISEKARTE' : 'OFFICIAL PRINT MENU'}
            </span>
            <h3 className="text-[22px] sm:text-[32px] md:text-[36px] font-black text-[#1e382f] leading-tight">
              {isDe ? 'Vollständige Speisekarte ansehen' : 'View Full Visual Menu'}
            </h3>
            <p className="text-[#666] text-[13px] sm:text-[14px] mt-1 max-w-[600px]">
              {isDe
                ? 'Klicken Sie auf eine der Seiten, um sie zu vergrößern, oder öffnen Sie die hochauflösenden Menükarten direkt in einem neuen Tab.'
                : 'Click on any page below to inspect or open the high-resolution restaurant menu cards directly in a new tab.'}
            </p>
          </div>

          {/* Grid with 2 Menu Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Page 1 */}
            <div className="bg-[#fcfaf7] border border-[#ebdcd0] rounded-[24px] overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-lg">
              <div 
                className="relative cursor-pointer overflow-hidden bg-[#1e382f]/5 aspect-[4/3] flex items-center justify-center"
                onClick={() => setSelectedPreviewImage('/assets/Menue1.png')}
              >
                <img
                  src="/assets/Menue1.png"
                  alt={isDe ? 'MAATI Speisekarte Seite 1' : 'MAATI Menu Page 1'}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                  <span className="bg-white/90 text-[#1e382f] font-extrabold text-[12.5px] px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Eye className="w-4 h-4 text-[#d85c27]" />
                    <span>{isDe ? 'Vollbild ansehen' : 'Click to Preview'}</span>
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-4">
                <div>
                  <h4 className="font-black text-[17px] sm:text-[18px] text-[#1e382f]">
                    {isDe ? 'Seite 1: Bowls, Naan & Favoriten' : 'Page 1: Signature Bowls & Naan'}
                  </h4>
                  <p className="text-[#777] text-[12.5px] sm:text-[13px] mt-1">
                    {isDe
                      ? 'Alle Bowls, Naan-Taschen, Toppings, Proteine und hausgemachten Saucen im Überblick.'
                      : 'All signature bowls, warm naan pockets, protein choices, dressings, and toppings.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-2">
                  <a
                    href="/assets/Menue1.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-[#1e382f] hover:bg-[#142620] text-white font-extrabold px-4 py-2.5 rounded-xl text-[12.5px] sm:text-[13px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4 text-[#d85c27]" />
                    <span>{isDe ? 'In neuem Tab öffnen' : 'Open in New Tab'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewImage('/assets/Menue1.png')}
                    className="bg-white hover:bg-gray-100 text-[#1e382f] border border-[#ebdcd0] font-extrabold px-4 py-2.5 rounded-xl text-[12.5px] sm:text-[13px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{isDe ? 'Vorschau' : 'Preview'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Page 2 */}
            <div className="bg-[#fcfaf7] border border-[#ebdcd0] rounded-[24px] overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-lg">
              <div 
                className="relative cursor-pointer overflow-hidden bg-[#1e382f]/5 aspect-[4/3] flex items-center justify-center"
                onClick={() => setSelectedPreviewImage('/assets/Menue2.png')}
              >
                <img
                  src="/assets/Menue2.png"
                  alt={isDe ? 'MAATI Speisekarte Seite 2' : 'MAATI Menu Page 2'}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-xs">
                  <span className="bg-white/90 text-[#1e382f] font-extrabold text-[12.5px] px-4 py-2 rounded-full flex items-center gap-2 shadow-lg">
                    <Eye className="w-4 h-4 text-[#d85c27]" />
                    <span>{isDe ? 'Vollbild ansehen' : 'Click to Preview'}</span>
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-6 flex flex-col justify-between flex-1 gap-4">
                <div>
                  <h4 className="font-black text-[17px] sm:text-[18px] text-[#1e382f]">
                    {isDe ? 'Seite 2: Lassis, Kaffee & Drinks' : 'Page 2: Lassis, Coffee & Craft Drinks'}
                  </h4>
                  <p className="text-[#777] text-[12.5px] sm:text-[13px] mt-1">
                    {isDe
                      ? 'Kaffeespezialitäten, Chai, hausgemachte Lassis, Bio-Limonaden und Desserts.'
                      : 'Specialty Indian coffee, masala chai, fresh fruit lassis, cold drinks, and desserts.'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-2">
                  <a
                    href="/assets/Menue2.png"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-[#1e382f] hover:bg-[#142620] text-white font-extrabold px-4 py-2.5 rounded-xl text-[12.5px] sm:text-[13px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4 text-[#d85c27]" />
                    <span>{isDe ? 'In neuem Tab öffnen' : 'Open in New Tab'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewImage('/assets/Menue2.png')}
                    className="bg-white hover:bg-gray-100 text-[#1e382f] border border-[#ebdcd0] font-extrabold px-4 py-2.5 rounded-xl text-[12.5px] sm:text-[13px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Eye className="w-4 h-4" />
                    <span>{isDe ? 'Vorschau' : 'Preview'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ── LIGHTBOX FULLSCREEN IMAGE MODAL ── */}
      {selectedPreviewImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn"
          onClick={() => setSelectedPreviewImage(null)}
        >
          <div 
            className="relative max-w-4xl w-full max-h-[92vh] bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-3.5 sm:p-4 bg-[#1e382f] text-white flex items-center justify-between">
              <span className="font-extrabold text-[13px] sm:text-[14px] truncate">
                {isDe ? 'MAATI Speisekarte - Vollansicht' : 'MAATI Restaurant Menu - High Resolution'}
              </span>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={selectedPreviewImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Open image in new tab"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedPreviewImage(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="overflow-auto max-h-[calc(92vh-60px)] p-2 sm:p-4 bg-[#f5f0e8] flex items-center justify-center">
              <img
                src={selectedPreviewImage}
                alt="MAATI Menu Preview"
                className="max-w-full h-auto rounded-lg shadow-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default June2026Menu;
