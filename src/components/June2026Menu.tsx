import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuCard } from './MenuCard';
import { useSanityMenu, usePrintMenuContent } from '../lib/sanityService';
import { SEO } from './SEO';
import {
  Info,
  Sparkles,
  ExternalLink,
  FileText,
  Eye,
  X,
  ChevronDown,
  ChevronUp,
  Leaf,
  Flame,
  HelpCircle,
  Utensils,
  CheckCircle2,
  MapPin,
  Clock
} from 'lucide-react';

interface June2026MenuProps {
  lang?: 'de' | 'en';
  onOpenReservation?: () => void;
}

export const June2026Menu: React.FC<June2026MenuProps> = ({ lang = 'en', onOpenReservation }) => {
  const isDe = lang === 'de';
  const { categories } = useSanityMenu();
  const { content: printMenu } = usePrintMenuContent();
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

  // Interactive Dietary Filter
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'vegan' | 'vegetarian' | 'nonVegetarian' | 'spicy'>('all');

  // FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const printBadge = (isDe ? printMenu.badgeDe : printMenu.badgeEn) || (isDe ? 'OFFIZIELLE SPEISEKARTE' : 'OFFICIAL PRINT MENU');
  const printTitle = (isDe ? printMenu.titleDe : printMenu.titleEn) || (isDe ? 'Vollständige Speisekarte ansehen' : 'View Full Visual Menu');
  const printDesc = (isDe ? printMenu.descDe : printMenu.descEn) || (isDe ? 'Klicken Sie auf eine der Seiten, um sie zu vergrößern, oder öffnen Sie die hochauflösenden Menükarten direkt in einem neuen Tab.' : 'Click on any page below to inspect or open the high-resolution restaurant menu cards directly in a new tab.');

  const page1Title = (isDe ? printMenu.page1TitleDe : printMenu.page1TitleEn) || (isDe ? 'Seite 1: Bowls, Naan & Favoriten' : 'Page 1: Signature Bowls & Naan');
  const page1Desc = (isDe ? printMenu.page1DescDe : printMenu.page1DescEn) || (isDe ? 'Alle Bowls, Naan-Taschen, Toppings, Proteine und hausgemachten Saucen im Überblick.' : 'All signature bowls, warm naan pockets, protein choices, dressings, and toppings.');
  const page1Img = printMenu.page1Image || '/assets/Menue1.png';

  const page2Title = (isDe ? printMenu.page2TitleDe : printMenu.page2TitleEn) || (isDe ? 'Seite 2: Lassis, Kaffee & Drinks' : 'Page 2: Lassis, Coffee & Craft Drinks');
  const page2Desc = (isDe ? printMenu.page2DescDe : printMenu.page2DescEn) || (isDe ? 'Kaffeespezialitäten, Chai, hausgemachte Lassis, Bio-Limonaden und Desserts.' : 'Specialty Indian coffee, masala chai, fresh fruit lassis, cold drinks, and desserts.');
  const page2Img = printMenu.page2Image || '/assets/Menue2.png';

  // Helper to extract clean decimal price string (e.g. "€11,5" -> "11.50")
  const extractCleanPrice = (p?: string): string => {
    if (!p) return '10.00';
    const normalized = p.replace(',', '.');
    const match = normalized.match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]).toFixed(2) : '10.00';
  };

  // Keyword-Rich Menu FAQs for SEO & Search Queries
  const MENU_FAQS = [
    {
      qEn: 'What makes the Indian Bowls at MAATI Kitchen Berlin Mitte special?',
      qDe: 'Was zeichnet die indischen Lunch Bowls bei MAATI Kitchen in Berlin Mitte aus?',
      aEn: 'Our Indian bowls combine slow-simmered regional curries (such as Delhi Butter Chicken, Chettinad Spiced Chicken, or Kashmir Spinach Paneer) with wholesome grain bases (fragrant basmati rice or nutrient-dense bulgur), fresh market salads, and artisanal chutneys. Everything is cooked daily without artificial preservatives or refined fillers.',
      aDe: 'Unsere indischen Bowls verbinden schonend geschmorte Currys (wie Delhi Butter Chicken, Chettinad Pepper Chicken oder cremiges Palak Paneer) mit gesunden Basen wie Basmatireis oder Bulgur, frischen Salaten und hausgemachten Chutneys. Alle Gerichte werden täglich frisch und ohne künstliche Zusätze zubereitet.'
    },
    {
      qEn: 'What are Punjab Naan Pockets?',
      qDe: 'Was sind Punjab Naan Pockets?',
      aEn: 'Punjab Naan Pockets are MAATI’s signature street-food creation: freshly baked pillowy naan bread, folded and toasted until golden and crispy, stuffed with succulent marinated chicken tikka, grilled paneer, or vegan tofu, crunchy kachumbar salad, and vibrant mint-coriander chutneys. Ideal for a fast, delicious lunch on the go.',
      aDe: 'Punjab Naan Pockets sind unsere beliebte Signature-Kreation: Frisch gebackenes, warm getoastetes Naan-Brot, gefüllt mit mariniertem Hähnchen Tikka, gegrilltem Paneer-Käse oder Tofu, knackigem Salat und frischen Chutneys. Perfekt für die schnelle, unkomplizierte Mittagspause.'
    },
    {
      qEn: 'Does MAATI Kitchen offer vegan, vegetarian, and gluten-free options?',
      qDe: 'Bietet MAATI Kitchen vegane, vegetarische und glutenfreie Gerichte an?',
      aEn: 'Yes! Over 70% of our menu is naturally vegetarian and vegan. We offer plant-based curries like Yellow Lentil Dal and Spiced Potato Chickpea Bowls, vegan naan options, dairy-free oat milk for all chais and coffees, and naturally gluten-free basmati rice bowls. Please inform our counter team of any allergies.',
      aDe: 'Ja! Mehr als 70% unserer Gerichte sind vegetarisch oder rein pflanzlich. Wir servieren vegane Linsen-Dals, aromatische Kichererbsen-Bowls, Hafermilch für Chai und Kaffeespezialitäten sowie von Natur aus glutenfreie Basmatireis-Bowls.'
    },
    {
      qEn: 'Can I order food for takeaway, office lunch delivery, or team catering?',
      qDe: 'Kann ich das Essen zur Abholung, Lieferung ins Büro oder als Catering bestellen?',
      aEn: 'Yes! You can order for express counter takeaway directly at Zimmerstraße 56 (near Checkpoint Charlie), get fast delivery to your door via Lieferando and Uber Eats, or book corporate catering for teams of 10 to 200+ people through our Catering page.',
      aDe: 'Ja! Sie können Gerichte direkt vor Ort in der Zimmerstraße 56 zur schnellen Abholung bestellen, über Lieferando und Uber Eats zu sich bestellen oder Firmen-Catering für 10 bis 200+ Personen über unsere Catering-Seite buchen.'
    },
    {
      qEn: 'Where is MAATI Kitchen located and what are the opening hours?',
      qDe: 'Wo befindet sich MAATI Kitchen und wie sind die Öffnungszeiten?',
      aEn: 'MAATI Kitchen is located at Zimmerstraße 56, 10117 Berlin Mitte, right around the corner from Checkpoint Charlie and U-Bahn Kochstraße (U6). We are open Monday to Wednesday from 11:00 to 16:00, Thursday to Saturday from 11:00 to 21:00, and Sunday from 11:30 to 18:00.',
      aDe: 'MAATI Kitchen liegt in der Zimmerstraße 56, 10117 Berlin Mitte (nur 2 Minuten vom Checkpoint Charlie und U-Bahnhof Kochstraße / U6). Wir haben Montag bis Mittwoch von 11:00 bis 16:00 Uhr, Donnerstag bis Samstag von 11:00 bis 21:00 Uhr und Sonntag von 11:30 bis 18:00 Uhr geöffnet.'
    }
  ];

  // Comprehensive Connected Schema: Restaurant + Menu + FAQPage
  const menuStructuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Restaurant',
        '@id': 'https://maatikitchen.com/#restaurant',
        'name': 'MAATI Kitchen',
        'alternateName': isDe ? 'MAATI - Moderne Indische Küche & Café Berlin Mitte' : 'MAATI Kitchen - Modern Indian Food & Café Berlin Mitte',
        'image': [
          'https://maatikitchen.com/assets/circle-Bq5xyFQD.png',
          'https://maatikitchen.com/assets/hero-flatlay.jpg'
        ],
        'logo': 'https://maatikitchen.com/assets/logo-C86A0r1B.png',
        'url': 'https://maatikitchen.com/',
        'telephone': '+49 30 51891367',
        'email': 'hello@maatikitchen.com',
        'priceRange': '€€',
        'servesCuisine': 'Indian, Fast Casual, Bowls, Vegan Options, Vegetarian Options',
        'acceptsReservations': true,
        'menu': isDe ? 'https://maatikitchen.com/de/menu' : 'https://maatikitchen.com/menu',
        'hasMenu': {
          '@id': isDe ? 'https://maatikitchen.com/de/menu#menu' : 'https://maatikitchen.com/menu#menu'
        },
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': 'Zimmerstraße 56',
          'addressLocality': 'Berlin',
          'postalCode': '10117',
          'addressCountry': 'DE'
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': 52.5081,
          'longitude': 13.3949
        },
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Monday', 'Tuesday', 'Wednesday'],
            'opens': '11:00',
            'closes': '16:00'
          },
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Thursday', 'Friday', 'Saturday'],
            'opens': '11:00',
            'closes': '21:00'
          },
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': ['Sunday'],
            'opens': '11:30',
            'closes': '18:00'
          }
        ]
      },
      {
        '@type': 'Menu',
        '@id': isDe ? 'https://maatikitchen.com/de/menu#menu' : 'https://maatikitchen.com/menu#menu',
        'name': isDe ? 'MAATI Kitchen Speisekarte Berlin Mitte' : 'MAATI Kitchen Restaurant Menu Berlin Mitte',
        'url': isDe ? 'https://maatikitchen.com/de/menu' : 'https://maatikitchen.com/menu',
        'mainEntityOfPage': isDe ? 'https://maatikitchen.com/de/menu' : 'https://maatikitchen.com/menu',
        'inLanguage': isDe ? 'de-DE' : 'en-US',
        'hasMenuSection': categories.map((cat) => ({
          '@type': 'MenuSection',
          'name': (isDe ? cat.nameDe || cat.name : cat.name) || cat.name,
          'description': (isDe ? cat.descriptionDe || cat.description : cat.description) || undefined,
          'hasMenuItem': (cat.items || []).map((item) => ({
            '@type': 'MenuItem',
            'name': (isDe ? item.titleDe || item.titleEn : item.titleEn) || item.titleEn,
            'description': (isDe ? item.descDe || item.descEn : item.descEn) || '',
            'suitableForDiet': item.foodType === 'vegan'
              ? 'https://schema.org/VeganDiet'
              : (item.foodType === 'vegetarian' ? 'https://schema.org/VegetarianDiet' : undefined),
            'offers': {
              '@type': 'Offer',
              'price': extractCleanPrice((isDe ? item.priceDe : item.priceEn) || item.price),
              'priceCurrency': 'EUR',
              'availability': item.available === false ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock'
            }
          }))
        }))
      },
      {
        '@type': 'FAQPage',
        'mainEntity': MENU_FAQS.map((faq) => ({
          '@type': 'Question',
          'name': isDe ? faq.qDe : faq.qEn,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': isDe ? faq.aDe : faq.aEn
          }
        }))
      }
    ]
  };

  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-24 sm:pt-28 pb-20 px-4 sm:px-8 md:px-16 lg:px-24">
      <SEO
        title={isDe ? 'Speisekarte: Indische Bowls & Naan Pockets | MAATI Kitchen Berlin Mitte' : 'Menu: Indian Bowls, Naan Pockets & Chai | MAATI Kitchen Berlin Mitte'}
        description={
          isDe
            ? 'Entdecken Sie die Speisekarte von MAATI Kitchen in Berlin Mitte: frische indische Lunch Bowls, getoastete Naan Pockets, Chai, Kaffeespezialitäten & vegane Optionen.'
            : 'Explore the MAATI Kitchen menu in Berlin Mitte: wholesome Indian lunch bowls, toasted naan pockets, masala chai, specialty coffee, and vegan options. Zimmerstraße 56.'
        }
        canonicalUrl={isDe ? 'https://maatikitchen.com/de/menu' : 'https://maatikitchen.com/menu'}
        lang={lang}
        enPath="/menu"
        ogType="restaurant.menu"
        structuredData={menuStructuredData}
      />

      <div className="max-w-[1360px] mx-auto space-y-8 sm:space-y-12">
        
        {/* ── BREADCRUMB NAVIGATION (CRAWLABLE SEMANTIC LINKS) ── */}
        <nav aria-label="Breadcrumb" className="text-[12.5px] sm:text-[13px] text-[#666] flex items-center gap-2">
          <Link to={isDe ? '/de' : '/'} className="hover:text-[#d85c27] transition-colors">
            {isDe ? 'Startseite' : 'Home'}
          </Link>
          <span>/</span>
          <span className="text-[#1e382f] font-bold">{isDe ? 'Speisekarte' : 'Menu'}</span>
        </nav>

        {/* ── HEADER & KEYWORD-RICH CRAWLABLE EDITORIAL INTRO ── */}
        <header className="space-y-5 pb-6 border-b border-[#ebdcd0]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[#d85c27] font-black text-[12px] sm:text-[13px] uppercase tracking-[0.2em] flex items-center gap-2 mb-2">
                <Sparkles className="w-4 h-4" />
                {isDe ? 'FRISCH GEKOCHT IN BERLIN MITTE' : 'FRESHLY CRAFTED IN BERLIN MITTE'}
              </span>
              <h1 className="text-[30px] sm:text-[40px] md:text-[50px] font-black text-[#1e382f] leading-[1.1] tracking-tight">
                {isDe ? 'Speisekarte: Moderne indische Bowls, Naan Pockets & Chai' : 'Indian Food Menu: Fresh Bowls, Naan Pockets & Chai'}
              </h1>
            </div>

            {onOpenReservation && (
              <button
                type="button"
                onClick={onOpenReservation}
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-6 py-3 rounded-full text-[13.5px] shadow-sm hover:shadow-md transition-all shrink-0 inline-flex items-center gap-2"
              >
                <Utensils className="w-4 h-4" />
                <span>{isDe ? 'Tisch reservieren' : 'Book A Table'}</span>
              </button>
            )}
          </div>

          <p className="text-[#555] text-[15px] sm:text-[16.5px] leading-relaxed max-w-[960px]">
            {isDe
              ? 'Willkommen bei MAATI Kitchen in der Zimmerstraße 56, nahe Checkpoint Charlie. Unsere Speisekarte zelebriert modernes indisches Soul Food: langsam geschmorte Currys mit ganzen gerösteten Gewürzen, warm getoastete Punjab Naan Pockets, handgemachte Chutneys, frische Mango Lassis und im Topf gekochten Masala Chai. Über 70% unserer Gerichte sind von Natur aus vegetarisch oder vegan.'
              : 'Welcome to MAATI Kitchen at Zimmerstraße 56, Berlin Mitte (near Checkpoint Charlie). Our menu reimagines Indian soul food for modern city living: slow-simmered regional curries with toasted whole spices, warm Punjab naan pockets, vibrant house-made chutneys, freshly whipped fruit lassis, and authentic spiced chai. Over 70% of our menu is naturally vegetarian and vegan.'}
          </p>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 text-[12px] sm:text-[13px] font-semibold text-[#1e382f]">
            <span className="bg-white px-3.5 py-1.5 rounded-full border border-[#ebdcd0] flex items-center gap-1.5 shadow-xs">
              <MapPin className="w-3.5 h-3.5 text-[#d85c27]" />
              Zimmerstr. 56, 10117 Berlin (U6 Kochstr.)
            </span>
            <span className="bg-white px-3.5 py-1.5 rounded-full border border-[#ebdcd0] flex items-center gap-1.5 shadow-xs">
              <Leaf className="w-3.5 h-3.5 text-emerald-700" />
              {isDe ? '70%+ Vegetarisch & Vegan' : '70%+ Vegetarian & Vegan Friendly'}
            </span>
            <span className="bg-white px-3.5 py-1.5 rounded-full border border-[#ebdcd0] flex items-center gap-1.5 shadow-xs">
              <Clock className="w-3.5 h-3.5 text-[#d85c27]" />
              {isDe ? 'Mo–Sa ab 11:00 Uhr | So ab 11:30' : 'Mon–Sat from 11:00 | Sun from 11:30'}
            </span>
            <span className="bg-white px-3.5 py-1.5 rounded-full border border-[#ebdcd0] flex items-center gap-1.5 shadow-xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              {isDe ? 'Tagesfrische Zubereitung' : 'Fresh Daily Prep, No Additives'}
            </span>
          </div>

          {/* Dietary Filter Buttons */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-[12px] font-bold text-gray-500 uppercase mr-1">
              {isDe ? 'Filter nach Ernährung:' : 'Dietary Filter:'}
            </span>
            <button
              type="button"
              onClick={() => setDietaryFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-extrabold transition-all ${
                dietaryFilter === 'all'
                  ? 'bg-[#1e382f] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-[#ebdcd0] hover:bg-gray-100'
              }`}
            >
              {isDe ? 'Alle Gerichte' : 'All Dishes'}
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('vegan')}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-extrabold transition-all flex items-center gap-1.5 ${
                dietaryFilter === 'vegan'
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-white text-emerald-800 border border-[#ebdcd0] hover:bg-emerald-50'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>{isDe ? '🌿 Rein Vegan' : '🌿 100% Vegan'}</span>
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('vegetarian')}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-extrabold transition-all flex items-center gap-1.5 ${
                dietaryFilter === 'vegetarian'
                  ? 'bg-[#1e382f] text-white shadow-xs'
                  : 'bg-white text-[#1e382f] border border-[#ebdcd0] hover:bg-gray-100'
              }`}
            >
              <Leaf className="w-3.5 h-3.5" />
              <span>{isDe ? '🌱 Vegetarisch' : '🌱 Vegetarian'}</span>
            </button>
            <button
              type="button"
              onClick={() => setDietaryFilter('nonVegetarian')}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-extrabold transition-all ${
                dietaryFilter === 'nonVegetarian'
                  ? 'bg-[#d85c27] text-white shadow-xs'
                  : 'bg-white text-gray-700 border border-[#ebdcd0] hover:bg-gray-100'
              }`}
            >
              {isDe ? '🍗 Hähnchen & Fleisch' : '🍗 Chicken & Meat'}
            </button>
          </div>
        </header>

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
                    className="whitespace-nowrap bg-white hover:bg-[#1e382f] text-[#1e382f] hover:text-white border border-[#ebdcd0] font-extrabold text-[12px] sm:text-[13px] px-3.5 sm:px-4 py-1.5 rounded-full shadow-xs transition-all shrink-0 active-press hover-lift"
                  >
                    {catName} ({cat.items.length})
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DYNAMIC CATEGORIES RENDERED FROM SANITY WITH DIETARY FILTER ── */}
        {categories.map((cat) => {
          if (!cat.items || cat.items.length === 0) return null;

          // Apply dietary filter if selected
          const filteredItems = cat.items.filter((item) => {
            if (dietaryFilter === 'all') return true;
            if (dietaryFilter === 'vegan') return item.foodType === 'vegan' || item.isVeganLeaf;
            if (dietaryFilter === 'vegetarian') return item.foodType === 'vegetarian' || item.foodType === 'vegan' || item.isVeganLeaf;
            if (dietaryFilter === 'nonVegetarian') return item.foodType === 'nonVegetarian';
            if (dietaryFilter === 'spicy') return item.isSpicy;
            return true;
          });

          if (filteredItems.length === 0) return null;

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
                {filteredItems.map((item) => (
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
              ? 'Für Informationen zu Allergenen und Inhaltsstoffen fragen Sie bitte unser Team am Counter oder nutzen Sie unsere gedruckte Speisekarte.'
              : 'For detailed allergen information and ingredient lists, please ask our friendly team at the counter or consult our printed menu.'}
          </span>
        </div>

        {/* ── KEYWORD-RICH SEO FAQ ACCORDION SECTION ── */}
        <section className="bg-white rounded-[28px] border border-[#ebdcd0] p-6 sm:p-10 shadow-sm space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="text-[#d85c27] font-black text-[11px] sm:text-[12px] uppercase tracking-[0.2em] flex items-center gap-1.5 mb-1">
              <HelpCircle className="w-4 h-4" />
              {isDe ? 'HÄUFIG GESTELLTE FRAGEN' : 'FREQUENTLY ASKED QUESTIONS'}
            </span>
            <h3 className="text-[22px] sm:text-[30px] font-black text-[#1e382f] leading-tight">
              {isDe ? 'Alles über Speisen, Zutaten & Bestellung bei MAATI' : 'Everything You Need to Know About Dining at MAATI'}
            </h3>
            <p className="text-[#666] text-[13px] sm:text-[14px] mt-1">
              {isDe
                ? 'Häufige Fragen zu unseren indischen Lunch Bowls, Naan Pockets, veganen Optionen und Vorbestellungen in Berlin Mitte.'
                : 'Common questions about our modern Indian bowls, naan pockets, vegan choices, and ordering in Berlin Mitte.'}
            </p>
          </div>

          <div className="space-y-3">
            {MENU_FAQS.map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-gray-100 overflow-hidden transition-all bg-[#fcfaf7]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                    className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-bold text-[15px] sm:text-[16px] text-[#1e382f] hover:text-[#d85c27] transition-colors"
                  >
                    <span>{isDe ? faq.qDe : faq.qEn}</span>
                    <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-200 shadow-xs">
                      {isOpen ? <ChevronUp className="w-4 h-4 text-[#d85c27]" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-[13.5px] sm:text-[14.5px] text-[#555] leading-relaxed border-t border-gray-100/60 bg-white">
                      {isDe ? faq.aDe : faq.aEn}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

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
