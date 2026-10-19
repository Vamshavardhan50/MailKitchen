import React from 'react';
import { Link } from 'react-router-dom';
import { SEO } from './SEO';
import { EnquiryForm } from './EnquiryForm';
import { Users, Sparkles, CheckCircle2, Music, Utensils, Wine, ArrowDown, ArrowRight } from 'lucide-react';

interface EventsSectionProps {
  lang?: 'de' | 'en';
  onOpenReservation?: () => void;
}

export const EventsSection: React.FC<EventsSectionProps> = ({ lang = 'en', onOpenReservation }) => {
  const isDe = lang === 'de';

  const title = isDe
    ? 'Events & Feiern in Berlin Mitte | MAATI Kitchen'
    : 'Private Events & Dining in Berlin Mitte | MAATI Kitchen';

  const description = isDe
    ? 'Feiern Sie Geburtstage, Team-Lunches und private Anlässe bei MAATI Kitchen in Berlin Mitte. Flexible Räume, indisches Essen und Getränke. Jetzt anfragen.'
    : 'Host birthdays, team lunches and private celebrations at MAATI Kitchen in Berlin Mitte. Flexible event space with Indian food and drinks. Enquire today.';

  const canonicalUrl = isDe ? 'https://maatikitchen.com/de/events' : 'https://maatikitchen.com/events';

  // EventVenue Schema with maximum capacity of 60
  const eventVenueSchema = {
    '@context': 'https://schema.org',
    '@type': 'EventVenue',
    'name': isDe ? 'MAATI Kitchen Eventlocation Berlin' : 'MAATI Kitchen Berlin Event Space',
    'description': description,
    'maximumAttendeeCapacity': 60,
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': 'Zimmerstraße 56',
      'addressLocality': 'Berlin',
      'postalCode': '10117',
      'addressCountry': 'DE'
    },
    'containedInPlace': {
      '@type': 'Restaurant',
      '@id': 'https://maatikitchen.com/#restaurant',
      'name': 'MAATI Kitchen'
    }
  };

  return (
    <div className="bg-[#f5f0e8] min-h-screen pt-24 sm:pt-28 pb-20">
      <SEO
        title={title}
        description={description}
        canonicalUrl={canonicalUrl}
        lang={lang}
        enPath="/events"
        structuredData={eventVenueSchema}
      />

      {/* ── HERO BANNER ── */}
      <section className="px-5 sm:px-8 md:px-16 lg:px-24 pt-6 pb-12 max-w-[1360px] mx-auto">
        <div className="bg-[#1e382f] text-white rounded-[32px] sm:rounded-[44px] p-8 sm:p-14 lg:p-20 relative overflow-hidden shadow-2xl">
          <div className="max-w-[780px] relative z-10 space-y-6">
            <span className="bg-[#d85c27] text-white text-[11px] sm:text-[12px] font-black tracking-[0.2em] px-4 py-1.5 rounded-full uppercase inline-block">
              {isDe ? 'EXKLUSIVE LOCATION IN BERLIN MITTE' : 'EXCLUSIVE VENUE IN BERLIN MITTE'}
            </span>
            <h1 className="text-[36px] sm:text-[48px] md:text-[58px] font-black leading-[1.08] tracking-tight text-white">
              {isDe ? 'Private Events & Feiern im MAATI, Berlin Mitte' : 'Private Events & Celebrations at MAATI, Berlin Mitte'}
            </h1>
            <p className="text-white/80 text-[16px] sm:text-[18px] leading-relaxed">
              {isDe
                ? 'Ein warmer, moderner Raum im Herzen Berlins für private Dinners, Firmenfeiern, Geburtstage und Workshops. Genießen Sie maßgeschneiderte Menüs, erlesene Weine und aufmerksamen Service.'
                : 'A warm, design-forward space in the heart of Berlin Mitte for private dinners, corporate socials, birthdays, and workshops. Indulge in bespoke food stations, craft drinks, and attentive hospitality.'}
            </p>
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <a
                href="#enquiry-form"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('enquiry-form')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-[#d85c27] hover:bg-[#c24f1c] text-white font-extrabold px-8 py-4 rounded-full text-[15px] shadow-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>{isDe ? 'Privates Event Anfragen' : 'Inquire for Private Events'}</span>
                <ArrowDown className="w-4 h-4" />
              </a>
              {onOpenReservation && (
                <button
                  onClick={onOpenReservation}
                  className="border-2 border-white/30 hover:border-white text-white font-bold px-7 py-3.5 rounded-full text-[15px] transition-colors"
                >
                  {isDe ? 'Tisch reservieren' : 'Make a Reservation'}
                </button>
              )}
            </div>
          </div>

          <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-[#d85c27]/20 blur-3xl pointer-events-none" />
        </div>
      </section>

      {/* ── EXPANDED CONTENT: 4 to 6 SECTIONS (400 - 600 words) ── */}
      <section className="px-5 sm:px-8 md:px-16 lg:px-24 py-12 max-w-[1360px] mx-auto space-y-16">
        
        {/* Section 1: The Space & Atmosphere */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-5">
            <span className="text-[#d85c27] font-black text-[12px] tracking-[0.2em] uppercase block">
              {isDe ? 'DER RAUM & DAS AMBIENTE' : 'THE SPACE & ATMOSPHERE'}
            </span>
            <h2 className="text-[28px] sm:text-[36px] font-black text-[#1e382f] leading-tight">
              {isDe
                ? 'Gemütliche Eleganz trifft auf zeitgenössisches Berliner Flair'
                : 'Intimate elegance meets contemporary Berlin design'}
            </h2>
            <p className="text-[#555] text-[15px] sm:text-[16px] leading-relaxed">
              {isDe
                ? 'In der Zimmerstraße 56, nur wenige Schritte vom Checkpoint Charlie entfernt, bietet das MAATI Kitchen eine unverwechselbare architektonische Kulisse. Warme Erdtöne, handgefertigte Hängelampen und helle Holzelemente schaffen eine einladende Atmosphäre, die sich flexibel an feierliche Dinner oder dynamische Stehempfänge anpassen lässt.'
                : 'Situated at Zimmerstraße 56 near Checkpoint Charlie, MAATI Kitchen provides a warm, architecturally distinctive setting. Terracotta tones, artisan woven pendant lights, and natural light oak fixtures deliver a soothing balance between upscale intimacy and casual Berlin warmth.'}
            </p>
          </div>
          <div className="lg:col-span-5 rounded-[32px] overflow-hidden shadow-xl border border-[#ebdcd0]">
            <img
              src="/assets/show5-BiQql1jr.jpeg"
              alt="MAATI Event Space interior ambiance"
              className="w-full h-[360px] object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>
        </div>

        {/* Section 2: Explicit Capacities & Layouts */}
        <div className="bg-white rounded-[32px] p-8 sm:p-12 shadow-sm border border-gray-100 space-y-6">
          <span className="text-[#d85c27] font-black text-[12px] tracking-[0.2em] uppercase block">
            {isDe ? 'KAPAZITÄTEN & BESTUHLUNG' : 'CAPACITY & LAYOUTS'}
          </span>
          <h2 className="text-[28px] sm:text-[34px] font-black text-[#1e382f]">
            {isDe ? 'Kapazitäten und Raumaufteilung' : 'Capacity and Flexible Room Layouts'}
          </h2>
          <p className="text-[#555] text-[15px] sm:text-[16px] leading-relaxed max-w-[850px]">
            {isDe
              ? 'Für private Dinners, Firmen-Lunches, Workshops und Feiern bietet MAATI Kitchen flexible Bestuhlungsvarianten: 40 sitzende Gäste bei gesetzten Menüs, 60 stehende Gäste bei feierlichen Stehempfängen, plus 8 Außenplätze an der Zimmerstraße und 24 Terrassenplätze auf unserem sonnigen Innenhof.'
              : 'For private dinners, corporate lunches, workshops, and celebrations, MAATI Kitchen provides flexible layout options: 40 seated guests for plated or family-style dining, 60 standing guests for reception cocktail mixers, plus 8 outside seats curbside and 24 terrace seats on our courtyard patio in warmer months.'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            <div className="p-6 rounded-2xl bg-[#fdfaf7] border border-[#ebdcd0]/70">
              <span className="text-[32px] font-black text-[#d85c27] block">40</span>
              <strong className="text-[16px] text-[#1e382f] block mt-1">
                {isDe ? 'Sitzplätze Innen' : 'Seated Indoors'}
              </strong>
              <p className="text-[#666] text-[13px] mt-1">
                {isDe ? '40 Sitzplätze für festliche Dinners & Meetings' : '40 seated capacity for dining and presentations'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdfaf7] border border-[#ebdcd0]/70">
              <span className="text-[32px] font-black text-[#d85c27] block">60</span>
              <strong className="text-[16px] text-[#1e382f] block mt-1">
                {isDe ? 'Stehplätze (Empfang)' : 'Standing Reception'}
              </strong>
              <p className="text-[#666] text-[13px] mt-1">
                {isDe ? '60 Stehplätze für Cocktails, Fingerfood & Partys' : '60 standing capacity for cocktails & networking'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdfaf7] border border-[#ebdcd0]/70">
              <span className="text-[32px] font-black text-[#d85c27] block">+8</span>
              <strong className="text-[16px] text-[#1e382f] block mt-1">
                {isDe ? 'Außenplätze' : 'Outside Seats'}
              </strong>
              <p className="text-[#666] text-[13px] mt-1">
                {isDe ? '8 Außenplätze vor unserem Restaurant' : '8 outside seats directly on Zimmerstraße'}
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#fdfaf7] border border-[#ebdcd0]/70">
              <span className="text-[32px] font-black text-[#d85c27] block">+24</span>
              <strong className="text-[16px] text-[#1e382f] block mt-1">
                {isDe ? 'Terrassenplätze' : 'Terrace Seats'}
              </strong>
              <p className="text-[#666] text-[13px] mt-1">
                {isDe ? '24 Terrassenplätze auf dem grünen Innenhof' : '24 terrace seats on our quiet summer courtyard'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 3: What Is Included */}
        <div className="space-y-6">
          <div>
            <span className="text-[#d85c27] font-black text-[12px] tracking-[0.2em] uppercase block">
              {isDe ? 'AUSSTATTUNG & SERVICE' : 'WHAT IS INCLUDED'}
            </span>
            <h2 className="text-[28px] sm:text-[34px] font-black text-[#1e382f] mt-1">
              {isDe ? 'Was in Ihrer Event-Buchung enthalten ist' : 'What Is Included in Your Event Hire'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-[28px] bg-white shadow-sm border border-gray-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1e382f] text-white flex items-center justify-center">
                <Utensils className="w-6 h-6 text-[#d85c27]" />
              </div>
              <h3 className="text-[20px] font-bold text-[#1e382f]">
                {isDe ? 'Kulinarische Menüs' : 'Custom Menus & Stations'}
              </h3>
              <p className="text-[#666] text-[14px] leading-relaxed">
                {isDe
                  ? 'Von mehrgängigen Menüs über Bowl-Buffets bis hin zu Flying Fingerfood passen wir Speisen und Allergene präzise an.'
                  : 'From multi-course family-style dining to custom street-food stations and vegan dietary accommodations.'}
              </p>
            </div>

            <div className="p-8 rounded-[28px] bg-white shadow-sm border border-gray-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1e382f] text-white flex items-center justify-center">
                <Wine className="w-6 h-6 text-[#d85c27]" />
              </div>
              <h3 className="text-[20px] font-bold text-[#1e382f]">
                {isDe ? 'Bar & Getränkepakete' : 'Craft Bar Packages'}
              </h3>
              <p className="text-[#666] text-[14px] leading-relaxed">
                {isDe
                  ? 'Hausgemachte Lassis, Spezialitätenkaffee, Masala Chai sowie Weine, Craft Beer und signature Cocktails.'
                  : 'Artisanal mango lassis, spiced chai, regional craft beers, natural wines, and bespoke cocktails.'}
              </p>
            </div>

            <div className="p-8 rounded-[28px] bg-white shadow-sm border border-gray-100 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1e382f] text-white flex items-center justify-center">
                <Music className="w-6 h-6 text-[#d85c27]" />
              </div>
              <h3 className="text-[20px] font-bold text-[#1e382f]">
                {isDe ? 'Technik & Service' : 'Sound & Staffing'}
              </h3>
              <p className="text-[#666] text-[14px] leading-relaxed">
                {isDe
                  ? 'Hochwertiges Soundsystem für Ihre Playlists, Highspeed-WLAN, Beamer auf Anfrage und engagiertes Serviceteam.'
                  : 'Integrated premium audio system for playlists, fast Wi-Fi, projector setup on request, and full dedicated service.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Menu Options */}
        <div className="bg-white rounded-[32px] p-8 sm:p-12 shadow-sm border border-gray-100 space-y-6">
          <span className="text-[#d85c27] font-black text-[12px] tracking-[0.2em] uppercase block">
            {isDe ? 'KULINARISCHE FORMATE' : 'MENU OPTIONS'}
          </span>
          <h2 className="text-[28px] sm:text-[34px] font-black text-[#1e382f]">
            {isDe ? 'Individuelle Menüoptionen für jeden Anlass' : 'Menu Options Tailored to Your Celebration'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[14.5px] text-[#555]">
            <div className="space-y-2 p-5 bg-[#fdfaf7] rounded-2xl border border-[#ebdcd0]/60">
              <strong className="text-[#1e382f] block text-[16px]">
                {isDe ? '1. Family-Style Sharing Feast' : '1. Family-Style Sharing Feast'}
              </strong>
              <p>
                {isDe
                  ? 'Gedeckte Tische mit großen Servierplatten: duftender Safranreis, zartes Butter Chicken, mariniertes Paneer, bunte Chutneys und ofenfrisches Naan zum gemeinsamen Teilen.'
                  : 'Platters placed in the center of long tables: fragrant saffron basmati, tender curries, warm garlic naan, and chutneys passed around for shared connection.'}
              </p>
            </div>

            <div className="space-y-2 p-5 bg-[#fdfaf7] rounded-2xl border border-[#ebdcd0]/60">
              <strong className="text-[#1e382f] block text-[16px]">
                {isDe ? '2. Flying Street Food & Bowls' : '2. Flying Street Food & Bowls'}
              </strong>
              <p>
                {isDe
                  ? 'Perfekt für dynamische Stehempfänge: Mini-Naan-Pockets, knusprige Samosas, mundgerechte Curry-Bowls und herzhafte Snacks auf stilvollen Holztabletts serviert.'
                  : 'Ideal for standing mixers: bite-sized naan pockets, crisp spiced samosas, mini market bowls, and handheld fingerfood circulated by our hospitality team.'}
              </p>
            </div>

            <div className="space-y-2 p-5 bg-[#fdfaf7] rounded-2xl border border-[#ebdcd0]/60">
              <strong className="text-[#1e382f] block text-[16px]">
                {isDe ? '3. Dessert & Chai Station' : '3. Dessert & Chai Station'}
              </strong>
              <p>
                {isDe
                  ? 'Süßer Abschluss mit hausgemachten Kardamom-Jars, Mango-Püree, Dattel-Nuss-Crunch und traditionell im Kessel gekochtem Masala Chai oder Kaffeespezialitäten.'
                  : 'Indulgent glass jars layered with cardamom yogurt, mango coulis, toasted nuts, accompanied by authentic slow-brewed spiced Assam chai and barista coffee.'}
              </p>
            </div>
          </div>
        </div>

        {/* Section 5: How Booking Works */}
        <div className="bg-[#1e382f] text-white rounded-[32px] p-8 sm:p-12 space-y-6">
          <span className="text-[#d85c27] font-black text-[12px] tracking-[0.2em] uppercase block">
            {isDe ? 'DER ABLAUF' : 'HOW BOOKING WORKS'}
          </span>
          <h2 className="text-[28px] sm:text-[34px] font-black text-white">
            {isDe ? 'So funktioniert Ihre Buchung' : 'How Event Booking Works'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[14.5px] text-white/85">
            <div className="space-y-2">
              <span className="w-8 h-8 rounded-full bg-[#d85c27] text-white flex items-center justify-center font-black text-[14px]">
                1
              </span>
              <strong className="text-white block text-[16px]">
                {isDe ? 'Unverbindliche Anfrage' : '1. Submit Enquiry'}
              </strong>
              <p>
                {isDe
                  ? 'Füllen Sie das untenstehende Formular mit Ihrem Wunschtermin und der Gästeanzahl aus.'
                  : 'Fill out the enquiry form below with your desired date and estimated party size.'}
              </p>
            </div>

            <div className="space-y-2">
              <span className="w-8 h-8 rounded-full bg-[#d85c27] text-white flex items-center justify-center font-black text-[14px]">
                2
              </span>
              <strong className="text-white block text-[16px]">
                {isDe ? 'Menü- & Raumabsprache' : '2. Menu Consultation'}
              </strong>
              <p>
                {isDe
                  ? 'Wir besprechen Ihre Menüwünsche, Bestuhlung und zeitlichen Ablauf telefonisch oder vor Ort.'
                  : 'We consult on dietary requirements, layout arrangements, and custom beverage packages.'}
              </p>
            </div>

            <div className="space-y-2">
              <span className="w-8 h-8 rounded-full bg-[#d85c27] text-white flex items-center justify-center font-black text-[14px]">
                3
              </span>
              <strong className="text-white block text-[16px]">
                {isDe ? 'Entspannt genießen' : '3. Celebrate Seamlessly'}
              </strong>
              <p>
                {isDe
                  ? 'Unser Team kümmert sich um Aufbau, Bewirtung und Abbau, damit Sie und Ihre Gäste sich wohlfühlen.'
                  : 'Our hospitality team executes the complete service, leaving you to enjoy your event.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── EMBEDDED ENQUIRY FORM (R3 & R5) ── */}
      <section id="enquiry-form" className="px-5 sm:px-8 md:px-16 lg:px-24 pt-6 scroll-mt-24">
        <EnquiryForm
          lang={lang}
          defaultType="private-event"
          title={isDe ? 'Privates Event oder Feier anfragen' : 'Inquire for Private Events & Hire'}
          subtitle={
            isDe
              ? 'Senden Sie uns die Eckdaten Ihrer Veranstaltung. Wir antworten innerhalb eines Werktages.'
              : 'Send us your event details. We will respond with availability and a customized quote within one business day.'
          }
        />
      </section>
    </div>
  );
};
