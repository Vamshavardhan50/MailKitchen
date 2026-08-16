import React, { useState } from 'react';
import { MenuCard } from './MenuCard';
import { useSanityMenu, usePrintMenuContent } from '../lib/sanityService';
import { SEO } from './SEO';
import { Info, Sparkles, ExternalLink, FileText, Eye, X } from 'lucide-react';

interface June2026MenuProps {
  lang?: 'de' | 'en';
  onOpenReservation?: () => void;
}

export const June2026Menu: React.FC<June2026MenuProps> = ({ lang = 'en' }) => {
  const isDe = lang === 'de';
  const { categories } = useSanityMenu();
  const { content: printMenu } = usePrintMenuContent();
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  const printBadge = (isDe ? printMenu.badgeDe : printMenu.badgeEn) || (isDe ? 'OFFIZIELLE SPEISEKARTE' : 'OFFICIAL PRINT MENU');
  const printTitle = (isDe ? printMenu.titleDe : printMenu.titleEn) || (isDe ? 'Vollständige Speisekarte ansehen' : 'View Full Visual Menu');
  const printDesc = (isDe ? printMenu.descDe : printMenu.descEn) || (isDe ? 'Klicken Sie auf eine der Seiten, um sie zu vergrößern, oder öffnen Sie die hochauflösenden Menükarten direkt in einem neuen Tab.' : 'Click on any page below to inspect or open the high-resolution restaurant menu cards directly in a new tab.');

  const page1Title = (isDe ? printMenu.page1TitleDe : printMenu.page1TitleEn) || (isDe ? 'Seite 1: Bowls, Naan & Favoriten' : 'Page 1: Signature Bowls & Naan');
  const page1Desc = (isDe ? printMenu.page1DescDe : printMenu.page1DescEn) || (isDe ? 'Alle Bowls, Naan-Taschen, Toppings, Proteine und hausgemachten Saucen im Überblick.' : 'All signature bowls, warm naan pockets, protein choices, dressings, and toppings.');
  const page1Img = printMenu.page1Image || '/assets/Menue1.png';

  const page2Title = (isDe ? printMenu.page2TitleDe : printMenu.page2TitleEn) || (isDe ? 'Seite 2: Lassis, Kaffee & Drinks' : 'Page 2: Lassis, Coffee & Craft Drinks');
  const page2Desc = (isDe ? printMenu.page2DescDe : printMenu.page2DescEn) || (isDe ? 'Kaffeespezialitäten, Chai, hausgemachte Lassis, Bio-Limonaden und Desserts.' : 'Specialty Indian coffee, masala chai, fresh fruit lassis, cold drinks, and desserts.');
  const page2Img = printMenu.page2Image || '/assets/Menue2.png';

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
              {printBadge}
            </span>
            <h3 className="text-[22px] sm:text-[32px] md:text-[36px] font-black text-[#1e382f] leading-tight">
              {printTitle}
            </h3>
            <p className="text-[#666] text-[13px] sm:text-[14px] mt-1 max-w-[600px]">
              {printDesc}
            </p>
          </div>

          {/* Grid with 2 Menu Pages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            {/* Page 1 */}
            <div className="bg-[#fcfaf7] border border-[#ebdcd0] rounded-[24px] overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-lg">
              <div 
                className="relative cursor-pointer overflow-hidden bg-[#1e382f]/5 aspect-[4/3] flex items-center justify-center"
                onClick={() => setSelectedPreviewImage(page1Img)}
              >
                <img
                  src={page1Img}
                  alt={page1Title}
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
                    {page1Title}
                  </h4>
                  <p className="text-[#777] text-[12.5px] sm:text-[13px] mt-1">
                    {page1Desc}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-2">
                  <a
                    href={page1Img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-[#1e382f] hover:bg-[#142620] text-white font-extrabold px-4 py-2.5 rounded-xl text-[12.5px] sm:text-[13px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4 text-[#d85c27]" />
                    <span>{isDe ? 'In neuem Tab öffnen' : 'Open in New Tab'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewImage(page1Img)}
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
                onClick={() => setSelectedPreviewImage(page2Img)}
              >
                <img
                  src={page2Img}
                  alt={page2Title}
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
                    {page2Title}
                  </h4>
                  <p className="text-[#777] text-[12.5px] sm:text-[13px] mt-1">
                    {page2Desc}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 pt-2">
                  <a
                    href={page2Img}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-[#1e382f] hover:bg-[#142620] text-white font-extrabold px-4 py-2.5 rounded-xl text-[12.5px] sm:text-[13px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <ExternalLink className="w-4 h-4 text-[#d85c27]" />
                    <span>{isDe ? 'In neuem Tab öffnen' : 'Open in New Tab'}</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSelectedPreviewImage(page2Img)}
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
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 animate-fadeIn"
          onClick={() => setSelectedPreviewImage(null)}
        >
          {/* Top Floating Controls Bar */}
          <div className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 flex items-center gap-3">
            <a
              href={selectedPreviewImage}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 text-white font-bold text-[13px] flex items-center gap-1.5 transition-all shadow-lg backdrop-blur-md border border-white/20"
              title="Open full resolution in new tab"
            >
              <ExternalLink className="w-4 h-4 text-[#d85c27]" />
              <span className="hidden sm:inline">Open Original</span>
            </a>
            <button
              type="button"
              onClick={() => setSelectedPreviewImage(null)}
              className="w-10 h-10 rounded-full bg-white/15 hover:bg-rose-600 text-white flex items-center justify-center transition-all shadow-lg backdrop-blur-md border border-white/20"
              aria-label="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Full Screen Scrollable Image Container */}
          <div 
            className="w-full h-full max-h-[96vh] max-w-[96vw] overflow-auto flex items-center justify-center p-1 sm:p-2 cursor-zoom-out"
            onClick={() => setSelectedPreviewImage(null)}
          >
            <img
              src={selectedPreviewImage}
              alt="MAATI Menu Full Preview"
              onClick={(e) => e.stopPropagation()}
              className="max-h-[92vh] max-w-[92vw] w-auto h-auto object-contain rounded-xl sm:rounded-2xl shadow-2xl transition-transform duration-200"
            />
          </div>
        </div>
      )}
    </div>
  );
};
export default June2026Menu;
