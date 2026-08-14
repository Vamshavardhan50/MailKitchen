import React from 'react';
import { MenuCard } from './MenuCard';
import { useSanityMenu } from '../lib/sanityService';
import { SEO } from './SEO';
import { Info, Sparkles } from 'lucide-react';

interface June2026MenuProps {
  lang?: 'de' | 'en';
  onOpenReservation?: () => void;
}

export const June2026Menu: React.FC<June2026MenuProps> = ({ lang = 'en' }) => {
  const isDe = lang === 'de';
  const { categories } = useSanityMenu();

  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-28 pb-20 px-6 sm:px-12 md:px-20 lg:px-28">
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

      <div className="max-w-[1360px] mx-auto space-y-16">
        
        {/* ── HEADER ── */}
        <div className="text-left pb-4 border-b border-[#ebdcd0]">
          <h1 className="text-[36px] md:text-[48px] font-black text-[#1e382f] leading-tight flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-[#d85c27]" />
            <span>{isDe ? 'Speisekarte' : 'Full Menu'}</span>
          </h1>
        </div>

        {/* ── DYNAMIC CATEGORIES RENDERED FROM SANITY ── */}
        {categories.map((cat) => {
          if (!cat.items || cat.items.length === 0) return null;

          const catName = (isDe ? cat.nameDe || cat.name : cat.name) || cat.name;
          const catDesc = isDe ? cat.descriptionDe || cat.description : cat.description;
          const catSlug = typeof cat.slug === 'object' && cat.slug?.current ? cat.slug.current : (typeof cat.slug === 'string' ? cat.slug : cat._id);

          return (
            <section key={cat._id} id={catSlug} className="space-y-6 scroll-mt-28">
              <div>
                <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">
                  MAATI SELECTION
                </span>
                <h2 className="text-[30px] md:text-[38px] font-black text-[#1e382f] leading-tight">
                  {catName}
                </h2>
                {catDesc && (
                  <p className="text-[#666] text-[14px] mt-1">{catDesc}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cat.items.map((item) => (
                  <MenuCard key={item._id || item.id} item={item} lang={lang} />
                ))}
              </div>
            </section>
          );
        })}

        {/* ── ALLERGENS BANNER ── */}
        <div className="bg-[#ebdcd0]/80 border border-[#ebdcd0] rounded-[24px] p-6 text-center text-[14px] text-[#1e382f] font-bold flex items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all duration-300">
          <Info className="w-5 h-5 text-[#d85c27] shrink-0" />
          <span>
            {isDe
              ? 'Für Informationen zu Allergenen fragen Sie bitte am Counter.'
              : 'For allergen information, please ask at the counter.'}
          </span>
        </div>

      </div>
    </div>
  );
};
