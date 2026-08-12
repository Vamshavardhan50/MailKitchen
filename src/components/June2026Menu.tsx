import React from 'react';
import { Info } from 'lucide-react';
import { MenuCard } from './MenuCard';
import {
  BREAKFAST_ITEMS,
  NAAN_POCKET_ITEM,
  HAUSSPEZIALITAETEN_ITEMS,
  AUF_BESTELLUNG_ITEMS,
  NACHTISCH_ITEMS,
  COLD_DRINKS,
  HOT_DRINKS,
  ALKOHOLISCHE_GETRAENKE,
  COCKTAILS
} from '../data/june2026MenuData';

interface June2026MenuProps {
  lang?: 'de' | 'en';
  onOpenReservation?: () => void;
}

export const June2026Menu: React.FC<June2026MenuProps> = ({ lang = 'en' }) => {
  const isDe = lang === 'de';

  return (
    <div className="bg-[#f5f0e8] text-[#1a1a1a] min-h-screen" style={{ paddingTop: '80px', paddingBottom: '90px' }}>

      <div className="max-w-[1320px] mx-auto px-8 md:px-14 lg:px-20 space-y-16 animate-fadeIn">

        {/* ── Main Heading ── */}
        <div className="pt-4">
          <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">
            {isDe ? 'Frisch & Authentisch' : 'Fresh & Authentic'}
          </span>
          <h1 className="text-[42px] md:text-[56px] font-black text-[#1e382f] leading-tight mt-1">
            {isDe ? 'Vollständige Speisekarte' : 'Full Menu'}
          </h1>
        </div>

        {/* ── 1. HOUSE FAVORITES (BREAKFAST) ── */}
        <section id="breakfast" className="space-y-6">
          <div>
            <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">Morning Bites</span>
            <h2 className="text-[30px] md:text-[38px] font-black text-[#1e382f] leading-tight">
              {isDe ? 'Hausgerichte (Frühstück)' : 'House Favorites (Breakfast)'}
            </h2>
            <p className="text-[#666] text-[14px] mt-1">
              {isDe ? 'Ausgewählte Kombinationen für den perfekten Start in den Tag.' : 'Curated combinations for the perfect bite.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BREAKFAST_ITEMS.map((item) => (
              <MenuCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </section>

        {/* ── 2. PUNJAB NAAN POCKETS ── */}
        <section id="naan-pockets" className="space-y-6">
          <div>
            <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">Stuffed Naan</span>
            <h2 className="text-[30px] md:text-[38px] font-black text-[#1e382f] leading-tight">
              Punjab Naan Pockets
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <MenuCard item={NAAN_POCKET_ITEM} lang={lang} />
          </div>
        </section>

        {/* ── 3. HAUSSPEZIALITÄTEN / HOUSE FAVORITES (LUNCH) ── */}
        <section id="hausspezialitaeten" className="space-y-6">
          <div>
            <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">Signature Bowls</span>
            <h2 className="text-[30px] md:text-[38px] font-black text-[#1e382f] leading-tight">
              {isDe ? 'Hausgerichte (Mittagessen)' : 'House Favorites (Lunch)'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HAUSSPEZIALITAETEN_ITEMS.map((item) => (
              <MenuCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </section>

        {/* ── 4. AUF BESTELLUNG GEFERTIGT ── */}
        <section id="auf-bestellung" className="space-y-6">
          <div>
            <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">Fresh Made To Order</span>
            <h2 className="text-[30px] md:text-[38px] font-black text-[#1e382f] leading-tight">
              {isDe ? 'Auf Bestellung gefertigt' : 'Made to Order'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {AUF_BESTELLUNG_ITEMS.map((item) => (
              <MenuCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </section>

        {/* ── 5. NACHTISCH ── */}
        <section id="nachtisch" className="space-y-6">
          <div>
            <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">Sweet Treats</span>
            <h2 className="text-[30px] md:text-[38px] font-black text-[#1e382f] leading-tight">
              {isDe ? 'Nachtisch' : 'Desserts'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {NACHTISCH_ITEMS.map((item) => (
              <MenuCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </section>

        {/* ── 6. MAATI COLD SPECIALS ── */}
        <section id="cold-drinks" className="space-y-6">
          <div>
            <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">Refreshing</span>
            <h2 className="text-[30px] md:text-[38px] font-black text-[#1e382f] leading-tight">
              {isDe ? 'Maati Kalte Spezialitäten' : 'Maati Cold Specials'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COLD_DRINKS.map((drink) => (
              <MenuCard key={drink.id} item={drink} lang={lang} />
            ))}
          </div>
        </section>

        {/* ── 7. MAATI HOT SPECIALS ── */}
        <section id="hot-drinks" className="space-y-6">
          <div>
            <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">Warm & Cozy</span>
            <h2 className="text-[30px] md:text-[38px] font-black text-[#1e382f] leading-tight">
              {isDe ? 'Maati Heiße Spezialitäten' : 'Maati Hot Specials'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {HOT_DRINKS.map((drink) => (
              <MenuCard key={drink.id} item={drink} lang={lang} />
            ))}
          </div>
        </section>

        {/* ── 8. ALKOHOLISCHE GETRÄNKE ── */}
        <section id="alcoholic-beverages" className="space-y-6">
          <div>
            <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">Craft Beers</span>
            <h2 className="text-[30px] md:text-[38px] font-black text-[#1e382f] leading-tight">
              {isDe ? 'Alkoholische Getränke' : 'Alcoholic Beverages'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {ALKOHOLISCHE_GETRAENKE.map((item) => (
              <MenuCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </section>

        {/* ── 9. COCKTAILS ── */}
        <section id="cocktails" className="space-y-6">
          <div>
            <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">Mixology</span>
            <h2 className="text-[30px] md:text-[38px] font-black text-[#1e382f] leading-tight">
              Cocktails
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {COCKTAILS.map((item) => (
              <MenuCard key={item.id} item={item} lang={lang} />
            ))}
          </div>
        </section>

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
