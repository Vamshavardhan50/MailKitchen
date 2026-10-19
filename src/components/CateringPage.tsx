import React, { useState } from 'react';
import { SEO } from './SEO';
import { EnquiryForm } from './EnquiryForm';
import {
  Check,
  Truck,
  Users,
  Sparkles,
  Clock,
  UtensilsCrossed,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Coffee,
  ChevronDown,
  ChevronUp,
  Flame,
  Award
} from 'lucide-react';
import { useCateringContent, DEFAULT_CATERING } from '../lib/sanityService';

interface CateringPageProps {
  lang?: 'de' | 'en';
}

export const CateringPage: React.FC<CateringPageProps> = ({ lang = 'en' }) => {
  const isDe = lang === 'de';
  const { content: cmsCatering } = useCateringContent();

  const title = isDe
    ? 'Indisches Catering Berlin Mitte für Büro und Firmen | MAATI Kitchen'
    : 'Indian Catering Berlin Mitte for Offices and Companies | MAATI Kitchen';

  const description = isDe
    ? 'Frisches indisches Catering in Berlin Mitte für Büro-Lunch, Meetings und Feiern. Von 10 bis 200 Gäste, vegane und vegetarische Optionen, Lieferung und Aufbau.'
    : 'Fresh Indian catering in Berlin Mitte for office lunches, meetings and celebrations. From 10 to 200 guests, vegan and vegetarian options, delivery and full setup.';

  const canonicalUrl = isDe ? 'https://maatikitchen.com/de/catering' : 'https://maatikitchen.com/catering';

  // Interactive Guests & Budget Calculator (beets & roots style)
  const [guestCount, setGuestCount] = useState<number>(25);

  // Active Category Filter for Offerings
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // FAQ Toggle State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  // Schema Service structured data linked to restaurant ID
  const cateringSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    'serviceType': 'Catering',
    'name': isDe ? 'MAATI Indisches Firmen- und Event-Catering' : 'MAATI Indian Corporate & Event Catering',
    'description': description,
    'areaServed': {
      '@type': 'City',
      'name': 'Berlin'
    },
    'provider': {
      '@type': 'Restaurant',
      '@id': 'https://maatikitchen.com/#restaurant',
      'name': 'MAATI Kitchen',
      'telephone': '+49 30 51891367',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Zimmerstraße 56',
        'addressLocality': 'Berlin',
        'postalCode': '10117',
        'addressCountry': 'DE'
      }
    }
  };

  const CATEGORIES = [
    { id: 'all', label: isDe ? 'Alle Angebote' : 'All Offerings' },
    { id: 'bowls', label: isDe ? 'Team Bowls' : 'Team Bowls' },
    { id: 'naan', label: isDe ? 'Naan Pockets & Platten' : 'Naan Pockets & Platters' },
    { id: 'fingerfood', label: isDe ? 'Fingerfood & Salate' : 'Fingerfood & Salads' },
    { id: 'drinks', label: isDe ? 'Lassis & Chai' : 'Lassis & Chai Bar' },
    { id: 'buffet', label: isDe ? 'Warmes Chafing Buffet' : 'Hot Chafing Buffet' }
  ];

  const SHOWCASE_ITEMS = [
    {
      category: 'bowls',
      title: isDe ? 'Signature Butter Chicken & Paneer Bowls' : 'Signature Butter Chicken & Paneer Bowls',
      desc: isDe
        ? 'Aromatischer Basmatireis oder nussiger Bulgur, getoppt mit zartem Chicken Tikka oder Bio-Paneer, frischem Marktgemüse und samtiger Sauce.'
        : 'Fragrant basmati or nutty bulgur layered with slow-simmered chicken tikka or organic paneer, charred market veggies, and mild coconut gravy.',
      tag: isDe ? 'Der Bestseller' : 'Top Bestseller',
      badge: 'GLUTEN-FREE OPTION',
      img: '/assets/show3-D0blnzja.jpeg'
    },
    {
      category: 'naan',
      title: isDe ? 'Gefüllte Naan-Taschen Sharing Platten' : 'Naan Pocket Fingerfood Platters',
      desc: isDe
        ? 'Frisch gebackene Naan-Brote, halbiert und gefüllt mit Paneer Makhani, saftigem Hähnchen oder rauchigem Gemüse. Sauberes Fingerfood fürs Meeting.'
        : 'Fresh baked naan pockets cut in half, filled with savory paneer makhani, spiced chicken, or smoky veggies. Zero mess, perfect for boardrooms.',
      tag: isDe ? 'Ideal für Meetings' : 'Meeting Essential',
      badge: 'VEGAN & VEGGIE',
      img: '/assets/show1-Cg86629k.jpeg'
    },
    {
      category: 'fingerfood',
      title: isDe ? 'Bunte Markt-Salate & Knusper-Platten' : 'Crispy Sev & Heritage Market Boards',
      desc: isDe
        ? 'Frische Granatäpfel, Rote Bete, marinierte Kichererbsen, Gurke, Minz-Chutney und knusprige Papads zum Teilen.'
        : 'Vibrant ruby beets, pomegranate, marinated chickpeas, crisp greens, homemade mint chutney, and crunchy spiced papads for sharing.',
      tag: isDe ? 'Frisch & Vital' : 'Fresh & Vibrant',
      badge: '100% VEGAN',
      img: '/assets/show2-CM6MShfY.jpeg'
    },
    {
      category: 'drinks',
      title: isDe ? 'Hausgemachte Lassis & Bio-Limonaden' : 'Artisan Lassis & Spiced Sodas',
      desc: isDe
        ? 'Gekühlter Mango Lassi, erfrischende Rosenmilch, indische Nimbu Pani Limonade mit Minze und frisch gebrühter Masala Chai.'
        : 'Chilled Alphonso mango lassi, floral rose milk, fizzy cumin-lime Nimbu Pani electrolyte soda, and brewed whole-spice chai.',
      tag: isDe ? 'Erfrischend' : 'Refreshing',
      badge: 'HOMEMADE',
      img: '/assets/Lemonade.png'
    },
    {
      category: 'buffet',
      title: isDe ? 'Warmes Chafing Dish Buffet Setup' : 'Hot Chafing Dish Buffet Line',
      desc: isDe
        ? 'Professionell temperierte Warmhalte-Stationen mit Biryani, Currys, Tandoori-Naan und Chutney-Bar direkt in Ihrem Büro oder Event-Space aufgebaut.'
        : 'Professional stainless chafing stations keeping curries, fragrant biryani, tandoor naan, and chutney bars piping hot for your entire team.',
      tag: isDe ? 'Für große Teams (ab 30 Pers.)' : 'For Large Teams (30+)',
      badge: 'FULL SERVICE',
      img: '/assets/show5-BiQql1jr.jpeg'
    },
    {
      category: 'fingerfood',
      title: isDe ? 'Süße Kardamom-Jars & Granola Pots' : 'Cardamom Chia & Sweet Yogurt Jars',
      desc: isDe
        ? 'Portionierte Weckgläser mit geschichtetem Kardamom-Joghurt, Mango-Püree, hausgemachtem Dattel-Nuss-Granola und Beeren.'
        : 'Individual glass jars layered with cardamom yogurt, mango coulis, homemade date-cashew toasted granola, and berries.',
      tag: isDe ? 'Süßer Abschluss' : 'Sweet Finish',
      badge: 'VEGETARIAN',
      img: '/assets/wPT_69fdf67802a5542f2c8b6cf8.jpg'
    }
  ];

  const filteredShowcase = activeCategory === 'all'
    ? SHOWCASE_ITEMS
    : SHOWCASE_ITEMS.filter((item) => item.category === activeCategory);

  const rawPackages = ((cmsCatering?.packages && cmsCatering.packages.length > 0)
    ? cmsCatering.packages
    : DEFAULT_CATERING.packages) || [];

  const PACKAGES = rawPackages.map((p) => ({
    id: p.id,
    popular: Boolean(p.popular),
    name: isDe ? (p.nameDe || p.name) : (p.name || p.nameDe),
    pricePerPerson: p.pricePerPerson || parseFloat((p.price || '12').replace(/[^0-9.]/g, '')) || 12,
    price: p.price || `€${p.pricePerPerson}`,
    priceDetail: isDe ? (p.priceDetailDe || 'pro Person') : (p.priceDetailEn || 'per person'),
    minGuests: p.minGuests || 10,
    suitableFor: isDe ? (p.suitableForDe || p.suitableForEn) : (p.suitableForEn || p.suitableForDe),
    features: isDe ? (p.featuresDe || p.featuresEn || []) : (p.featuresEn || p.featuresDe || []),
  }));

  const ADDITIONS = [
    {
      item: isDe ? 'Naan Pockets' : 'Naan Pockets',
      price: isDe ? '€5,50 pro Person' : '€5.50 per person',
      detail: isDe ? 'Halbierte, getoastete Naan-Brote mit verschiedenen Füllungen' : 'Cut-in-half warm toasted naan pockets with savory fillings'
    },
    {
      item: isDe ? 'Breakfast Setup' : 'Breakfast setup',
      price: isDe ? '€6,50 pro Person' : '€6.50 per person',
      detail: isDe ? 'Chutney-Croissants, Kardamom-Granola-Jars und Obst' : 'Chutney croissants, spiced yogurt granola jars & fresh fruit'
    },
    {
      item: isDe ? 'Coffee & Chai Bar' : 'Coffee and chai bar',
      price: isDe ? '€3,50 pro Person' : '€3.50 per person',
      detail: isDe ? 'Frisch gebrühter Masala Chai & Kaffeespezialitäten' : 'Slow-simmered whole-spice masala chai & specialty artisan coffee'
    },
    {
      item: isDe ? 'Snack Station' : 'Snack station',
      price: isDe ? '€4,00 pro Person' : '€4.00 per person',
      detail: isDe ? 'Knuspriges Sev, Mini-Samosas, würzige Cashews & Chutneys' : 'Crispy sev, mini samosa bites, spiced cashews & house chutneys'
    }
  ];

  const DELIVERY_TERMS = [
    {
      label: isDe ? 'Lieferung im Umkreis bis 5 km' : 'Delivery within 5 km',
      value: isDe ? 'Kostenlos' : 'Free',
      detail: isDe ? 'Deckt Berlin Mitte, Kreuzberg und Friedrichshain ab.' : 'Covers Mitte, Kreuzberg and Friedrichshain.'
    },
    {
      label: isDe ? 'Lieferung 5 km bis 15 km' : 'Delivery 5 km to 15 km',
      value: '€25',
      detail: isDe ? 'Fester Lieferpreis im gesamten Berliner Stadtgebiet.' : 'Flat delivery fee across Berlin metropolitan area.'
    },
    {
      label: isDe ? 'Vorlaufzeit der Bestellung' : 'Order lead time',
      value: isDe ? '24 – 48 Std.' : '24 – 48 hours',
      detail: isDe ? 'Empfohlen für reibungslose Planung (kurzfristig auf Anfrage).' : 'Recommended lead time (express same-day on request).'
    }
  ];

  const FAQS = [
    {
      q: isDe
        ? 'Wie viele Tage im Voraus muss ich das Catering bestellen?'
        : 'How far in advance do I need to book catering?',
      a: isDe
        ? 'Für Standard-Team-Lunches und Naan-Pocket-Platten bis zu 40 Personen empfehlen wir 24 bis 48 Stunden Vorlauf. Für große Buffets ab 50 Personen oder individuelle Menüs sind 3 bis 5 Tage ideal. Bei sehr kurzfristigen Anfragen rufen Sie uns bitte direkt an: +49 30 51891367.'
        : 'For standard team lunch bowls and naan pocket platters up to 40 guests, 24 to 48 hours notice is recommended. For large buffets over 50 guests or bespoke menus, 3 to 5 days is ideal. For last-minute orders, give us a quick call at +49 30 51891367.'
    },
    {
      q: isDe
        ? 'Gibt es eine Mindestbestellmenge?'
        : 'Is there a minimum order requirement?',
      a: isDe
        ? 'Unsere Catering-Pakete beginnen ab 10 Personen oder einem Mindestbestellwert von €100. Für kleinere Bestellungen unter 10 Personen können Sie Ihre Speisen bequem zur Abholung oder Einzellieferung in unserem Restaurant in der Zimmerstraße 56 vorbestellen.'
        : 'Our catering packages start at a minimum of 10 people or €100 total. For smaller groups, you can easily place takeaway or delivery orders directly through our restaurant at Zimmerstraße 56.'
    },
    {
      q: isDe
        ? 'Wie werden die Speisen geliefert und warm gehalten?'
        : 'How is the food delivered and kept warm?',
      a: isDe
        ? 'Unsere Bowls und Naan Pockets werden in isolierten Thermobehältern geliefert und bleiben garantiert bis zu 60 Minuten ofenfrisch warm. Für Buffets bringen wir professionelle Chafing Dishes (Warmhaltebehälter) mit, sodass das Essen über mehrere Stunden perfekt temperiert bleibt.'
        : 'Bowls and naan pockets arrive in insulated thermal transport cases that keep food piping hot for up to 60 minutes. For buffet orders, we supply professional chafing stations that keep dishes perfectly hot for hours.'
    },
    {
      q: isDe
        ? 'Können wir auf Firmenrechnung mit Zahlungsziel zahlen?'
        : 'Can corporate clients pay via invoice?',
      a: isDe
        ? 'Ja! Für registrierte Unternehmen, Agenturen und Institutionen bieten wir bequeme Zahlung auf Rechnung mit 14 Tagen Zahlungsziel inklusive ausgewiesener Mehrwertsteuer. Bei Erstbestellung genügt eine Bestätigung per E-Mail.'
        : 'Yes! Registered companies, agencies, and institutions can pay comfortably via standard invoice with 14-day payment terms including clear VAT breakdown.'
    },
    {
      q: isDe
        ? 'Wie werden Allergien und Ernährungsformen (vegan, vegetarisch, glutenfrei) gehandhabt?'
        : 'How do you handle dietary requirements (vegan, vegetarian, gluten-free)?',
      a: isDe
        ? 'Über 70% unserer Speisen sind von Natur aus vegan oder vegetarisch. Wir servieren zartes Hähnchen sowie rein pflanzliche Optionen (ohne Rind und ohne Schwein) und bieten glutenfreie Reis- und Salat-Bowls an. Jedes Gericht wird mit deutlichen Allergen- und Zutatenkarten gekennzeichnet.'
        : 'Over 70% of our menu is naturally vegan or vegetarian. We serve tender chicken as well as plant-based creations (strictly no beef and no pork), along with dedicated gluten-free rice and salad bowls. Every tray and bowl is clearly marked with ingredient and allergen tags.'
    }
  ];

  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-24 sm:pt-28 pb-20">
      <SEO
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        lang={lang}
        enPath="/catering"
        structuredData={cateringSchema}
      />

      {/* ── 1. HERO BANNER (BEETS & ROOTS VIBE) ── */}
      <section className="px-5 sm:px-8 md:px-16 lg:px-24 pt-6 pb-14 max-w-[1360px] mx-auto">
        <div className="bg-[#1e382f] text-white rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 relative overflow-hidden shadow-2xl">
          <div className="max-w-[800px] relative z-10 space-y-6">
            <span className="bg-[#d85c27] text-white text-[11px] sm:text-[12px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full uppercase inline-block">
              {isDe ? 'MAATI CATERING BERLIN MITTE' : 'MAATI CATERING BERLIN MITTE'}
            </span>
            <h1 className="text-[36px] sm:text-[48px] md:text-[60px] font-black leading-[1.08] tracking-tight text-white">
              {isDe ? 'Business Catering für Teams & Events' : 'Corporate Catering That Brings Teams Together'}
            </h1>
            <p className="text-white/85 text-[16px] sm:text-[19px] leading-relaxed max-w-[680px]">
              {isDe
                ? 'Gesunde Bowls, getoastete Naan-Pockets und Sharing-Platten direkt aus unserer Küche in der Zimmerstraße zu Ihnen ins Büro geliefert. Frisch, unkompliziert und auf den Punkt.'
                : 'Vibrant Indian bowls, toasted naan pockets, and sharing platters crafted for Berlin’s top offices. Delivered warm, on time, and effortlessly customized to every diet.'}
            </p>

            {/* Quick USPs Pills */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full text-[12px] font-bold text-white/90">
                <Users className="w-3.5 h-3.5 text-[#d85c27]" /> {isDe ? 'Ab 10 Personen' : 'From 10 People'}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full text-[12px] font-bold text-white/90">
                <Sparkles className="w-3.5 h-3.5 text-[#d85c27]" /> {isDe ? '100% Vegan & Veggie-freundlich' : 'Vegan & Veggie Friendly'}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full text-[12px] font-bold text-white/90">
                <Truck className="w-3.5 h-3.5 text-[#d85c27]" /> {isDe ? 'Pünktliche Berliner Lieferung' : 'On-Time Berlin Delivery'}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/10 px-3.5 py-1.5 rounded-full text-[12px] font-bold text-white/90">
                <ShieldCheck className="w-3.5 h-3.5 text-[#d85c27]" /> {isDe ? '14 Tage Zahlungsziel auf Rechnung' : 'Corporate Invoicing'}
              </span>
            </div>

            {/* CTAs */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#enquiry"
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-8 py-4 rounded-full text-[15px] shadow-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2"
              >
                <span>{isDe ? 'Jetzt Angebot anfragen' : 'Request Catering Quote'}</span>
                <ArrowDown className="w-4 h-4" />
              </a>
              <a
                href="#packages"
                className="border-2 border-white/30 hover:border-white text-white font-bold px-7 py-3.5 rounded-full text-[15px] transition-colors"
              >
                {isDe ? 'Pakete & Rechner ansehen' : 'Explore Packages & Calculator'}
              </a>
            </div>
          </div>

          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#d85c27]/25 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* ── 2. OFFERING CATEGORIES (BEETS & ROOTS STYLE) ── */}
      <section className="px-5 sm:px-8 md:px-16 lg:px-24 py-12 max-w-[1360px] mx-auto">
        <div className="text-center max-w-[700px] mx-auto mb-10 space-y-3">
          <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">
            {isDe ? 'UNSERE SPEISEN' : 'OUR CATERING OFFERINGS'}
          </span>
          <h2 className="text-[30px] sm:text-[42px] font-black text-[#1e382f]">
            {isDe ? 'Frisch zubereitet für jedes Team' : 'Curated For Modern Workplaces'}
          </h2>
          <p className="text-[#555] text-[15px] sm:text-[16px]">
            {isDe
              ? 'Wählen Sie aus modularen Meeting-Bowls, handlichen getoasteten Naan-Pockets oder einem warmen Chafing-Buffet.'
              : 'Choose from modular meeting bowls, mess-free naan pocket platters, or warm on-site buffet lines.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2.5 rounded-full text-[13.5px] font-extrabold transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#1e382f] text-white shadow-md'
                  : 'bg-white text-[#444] border border-[#ebdcd0] hover:border-[#1e382f]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Showcase Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredShowcase.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col justify-between group hover-lift active-press"
            >
              <div>
                <div className="relative h-[220px] overflow-hidden bg-[#ebdcd0]/40">
                  <img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#d85c27] text-white font-black text-[10.5px] uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {item.tag}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-md">
                    {item.badge}
                  </div>
                </div>

                <div className="p-6 sm:p-7 space-y-2">
                  <h3 className="text-[20px] font-black text-[#1e382f] group-hover:text-[#d85c27] transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[#666] text-[14px] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <a
                  href="#enquiry"
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#f5f0e8] hover:bg-[#1e382f] hover:text-white text-[#1e382f] font-extrabold text-[13px] transition-colors"
                >
                  <span>{isDe ? 'In Anfrage aufnehmen' : 'Add to Inquiry'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3. INTERACTIVE GUEST / BUDGET CALCULATOR & PACKAGES ── */}
      <section id="packages" className="px-5 sm:px-8 md:px-16 lg:px-24 py-16 bg-white/70 border-y border-[#ebdcd0]/60">
        <div className="max-w-[1360px] mx-auto">
          <div className="text-center max-w-[760px] mx-auto space-y-4 mb-10">
            <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">
              {isDe ? 'TRANSPARENTE PAKETE & RECHNER' : 'TRANSPARENT PACKAGES & CALCULATOR'}
            </span>
            <h2 className="text-[32px] sm:text-[44px] font-black text-[#1e382f]">
              {isDe ? 'Kalkulieren Sie Ihr Team-Catering' : 'Estimate Your Team Catering in Seconds'}
            </h2>
            <p className="text-[#666] text-[15px] sm:text-[16px]">
              {isDe
                ? 'Verschieben Sie den Regler, um die Gesamtkosten für Ihre Teamgröße direkt zu sehen. Keine versteckten Kosten.'
                : 'Slide to adjust your guest count and preview total package prices instantly. No hidden fees.'}
            </p>
          </div>

          {/* Interactive Slider Card */}
          <div className="max-w-[700px] mx-auto bg-[#1e382f] text-white p-6 sm:p-8 rounded-[28px] shadow-xl mb-14 text-center space-y-4">
            <div className="flex items-center justify-between font-extrabold text-[15px]">
              <span className="text-white/80">{isDe ? 'Geplante Personenanzahl:' : 'Expected Guest Count:'}</span>
              <span className="text-[#d85c27] text-[24px] sm:text-[28px] font-black bg-white/10 px-4 py-1 rounded-xl">
                {guestCount} {isDe ? 'Personen' : 'Guests'}
              </span>
            </div>

            <input
              type="range"
              min="10"
              max="200"
              step="5"
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full accent-[#d85c27] h-3 bg-white/20 rounded-lg cursor-pointer"
            />

            <div className="flex justify-between text-[11px] text-white/50 font-bold uppercase tracking-wider">
              <span>10 Pers. (Min)</span>
              <span>50 Pers.</span>
              <span>100 Pers.</span>
              <span>200+ Pers.</span>
            </div>
          </div>

          {/* 3 Confirmed Packages Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PACKAGES.map((pkg) => {
              const estimatedTotal = (guestCount * pkg.pricePerPerson).toFixed(2);

              return (
                <div
                  key={pkg.id}
                  className={`rounded-[28px] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 relative hover-lift ${
                    pkg.popular
                      ? 'bg-[#1e382f] text-white shadow-2xl ring-4 ring-[#d85c27] -translate-y-2'
                      : 'bg-white text-[#1a1a1a] shadow-sm border border-gray-100 hover:shadow-xl'
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#d85c27] text-white text-[11px] font-black tracking-widest uppercase py-1 px-4 rounded-full shadow-md">
                      {isDe ? 'AM BELIEBTESTEN' : 'MOST POPULAR'}
                    </div>
                  )}

                  <div>
                    <div className="mb-4">
                      <h3 className={`text-[22px] font-black ${pkg.popular ? 'text-white' : 'text-[#1e382f]'}`}>
                        {pkg.name}
                      </h3>
                      <p className={`text-[13px] mt-1.5 leading-snug ${pkg.popular ? 'text-white/70' : 'text-[#666]'}`}>
                        {pkg.suitableFor}
                      </p>
                    </div>

                    <div className="py-4 my-2 border-y border-gray-100/20">
                      <div className="flex items-baseline gap-1">
                        <span className="text-[34px] font-black text-[#d85c27]">{pkg.price}</span>
                        <span className={`text-[12px] font-bold ${pkg.popular ? 'text-white/60' : 'text-[#888]'}`}>
                          {pkg.priceDetail} (Min. {pkg.minGuests} {isDe ? 'Pers.' : 'guests'})
                        </span>
                      </div>
                      <div className={`text-[12px] font-bold mt-1.5 ${pkg.popular ? 'text-white/80' : 'text-[#555]'}`}>
                        {isDe ? 'Geschätzt für ' : 'Estimated for '} {guestCount} {isDe ? 'Gäste:' : 'guests:'}{' '}
                        <span className="text-[#d85c27] font-black">ca. €{estimatedTotal}</span>
                      </div>
                    </div>

                    <ul className="space-y-2.5 text-[13px] my-5">
                      {pkg.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-2.5">
                          <Check className="w-4 h-4 text-[#d85c27] shrink-0 mt-0.5" />
                          <span className={pkg.popular ? 'text-white/90' : 'text-[#444]'}>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="#enquiry"
                    className={`w-full py-3.5 rounded-full font-extrabold text-[14px] text-center transition-all mt-4 ${
                      pkg.popular
                        ? 'bg-[#d85c27] hover:bg-[#c24f1c] text-white shadow-lg'
                        : 'bg-[#1e382f] hover:bg-[#152721] text-white'
                    }`}
                  >
                    {isDe ? 'Dieses Paket anfragen' : 'Select This Package'}
                  </a>
                </div>
              );
            })}
          </div>

          {/* Additions and Delivery Terms Section (Visible Text for Search Engines) */}
          <div className="mt-14 pt-10 border-t border-white/10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Additions */}
            <div className="lg:col-span-7 bg-white/10 backdrop-blur-sm rounded-[28px] p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d85c27]" />
                <h3 className="text-[20px] font-black text-white">
                  {isDe ? 'Zusatzoptionen & Stationen (Add-ons)' : 'Additions & Optional Stations'}
                </h3>
              </div>
              <p className="text-white/70 text-[13.5px]">
                {isDe
                  ? 'Ergänzen Sie Ihr gewähltes Catering-Paket flexibel mit unseren beliebten Stationen:'
                  : 'Customize any of our core catering packages with these popular add-on stations:'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {ADDITIONS.map((addon, aIdx) => (
                  <div key={aIdx} className="bg-black/20 rounded-2xl p-4 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-white text-[14.5px]">{addon.item}</span>
                      <span className="text-[#d85c27] font-black text-[13px] whitespace-nowrap">{addon.price}</span>
                    </div>
                    <p className="text-white/60 text-[12px] leading-snug">{addon.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Terms */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-sm rounded-[28px] p-6 sm:p-8 border border-white/10 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d85c27]" />
                <h3 className="text-[20px] font-black text-white">
                  {isDe ? 'Lieferung & Bestellkonditionen' : 'Delivery & Ordering Terms'}
                </h3>
              </div>
              <p className="text-white/70 text-[13.5px]">
                {isDe
                  ? 'Transparente Konditionen und pünktliche Zustellung in ganz Berlin:'
                  : 'Clear transparent delivery terms across the entire Berlin area:'}
              </p>
              <div className="space-y-3 pt-2">
                {DELIVERY_TERMS.map((term, tIdx) => (
                  <div key={tIdx} className="bg-black/20 rounded-2xl p-4 border border-white/5 flex flex-col gap-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-extrabold text-white text-[14px]">{term.label}</span>
                      <span className="bg-[#d85c27] text-white text-[12px] font-black px-2.5 py-0.5 rounded-full">{term.value}</span>
                    </div>
                    <p className="text-white/60 text-[12px]">{term.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS (3 SIMPLE STEPS) ── */}
      <section className="px-5 sm:px-8 md:px-16 lg:px-24 py-16 max-w-[1360px] mx-auto">
        <div className="text-center max-w-[700px] mx-auto mb-14 space-y-3">
          <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">
            {isDe ? 'IN 3 SCHRITTEN' : 'HOW IT WORKS'}
          </span>
          <h2 className="text-[30px] sm:text-[40px] font-black text-[#1e382f]">
            {isDe ? 'So einfach geht MAATI Catering' : 'Stress-Free Catering in 3 Steps'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#d85c27] text-white flex items-center justify-center font-black text-[22px] mx-auto shadow-md">
              1
            </div>
            <h3 className="text-[20px] font-black text-[#1e382f]">
              {isDe ? 'Anfrage in 2 Minuten' : 'Request in 2 Minutes'}
            </h3>
            <p className="text-[#666] text-[14px] leading-relaxed">
              {isDe
                ? 'Wunschdatum, Personenanzahl und Lieblingsgerichte über unser Formular oder per Telefon durchgeben.'
                : 'Share your event date, team size, and dietary wishes via our quick form or a short call.'}
            </p>
          </div>

          <div className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#1e382f] text-white flex items-center justify-center font-black text-[22px] mx-auto shadow-md">
              2
            </div>
            <h3 className="text-[20px] font-black text-[#1e382f]">
              {isDe ? 'Individuelles Angebot' : 'Tailored Confirmation'}
            </h3>
            <p className="text-[#666] text-[14px] leading-relaxed">
              {isDe
                ? 'Wir senden Ihnen innerhalb eines Werktages ein klares, transparentes Angebot mit flexiblen Anpassungsoptionen.'
                : 'Receive a transparent proposal with dietary breakdowns and corporate billing within one business day.'}
            </p>
          </div>

          <div className="bg-white rounded-[28px] p-8 shadow-sm border border-gray-100 text-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-[#d85c27] text-white flex items-center justify-center font-black text-[22px] mx-auto shadow-md">
              3
            </div>
            <h3 className="text-[20px] font-black text-[#1e382f]">
              {isDe ? 'Pünktlich & Warm geliefert' : 'Warm, On-Time Delivery'}
            </h3>
            <p className="text-[#666] text-[14px] leading-relaxed">
              {isDe
                ? 'Unser Fahrer bringt alles auf die Minute genau zu Ihnen ins Büro. Auf Wunsch inklusive Aufbau und Beschriftung.'
                : 'Punctual delivery right to your office floor. Pre-labeled, thermal-insulated, and ready to enjoy.'}
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. FREQUENTLY ASKED QUESTIONS (ACCORDION) ── */}
      <section className="px-5 sm:px-8 md:px-16 lg:px-24 py-16 bg-[#1e382f] text-white">
        <div className="max-w-[900px] mx-auto space-y-8">
          <div className="text-center space-y-3">
            <span className="text-[#d85c27] font-black text-[12px] uppercase tracking-[0.2em]">
              FAQ
            </span>
            <h2 className="text-[30px] sm:text-[42px] font-black text-white">
              {isDe ? 'Häufig gestellte Fragen' : 'Frequently Asked Questions'}
            </h2>
          </div>

          <div className="space-y-4 pt-4">
            {FAQS.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white/10 rounded-2xl border border-white/10 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-black text-[16px] sm:text-[17px] text-white hover:text-[#d85c27] transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-[#d85c27] shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-white/60 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-6 text-white/80 text-[14.5px] leading-relaxed animate-fadeIn">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. INTERACTIVE ENQUIRY FORM (ANCHOR #enquiry) ── */}
      <section id="enquiry" className="px-5 sm:px-8 md:px-16 lg:px-24 pt-16">
        <EnquiryForm
          lang={lang}
          defaultType="corporate-catering"
          title={isDe ? 'Catering für Ihr Büro oder Event anfragen' : 'Request Catering For Your Team or Event'}
          subtitle={
            isDe
              ? 'Teilen Sie uns Ihre Wünsche mit. Wir senden Ihnen innerhalb von 24 Stunden ein detailliertes Angebot zu.'
              : 'Tell us about your event date and group size. We will respond within one business day.'
          }
        />
      </section>
    </div>
  );
};

export default CateringPage;
