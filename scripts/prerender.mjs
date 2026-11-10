import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const DIST_DIR = path.resolve(ROOT_DIR, 'dist');

// Check that dist/index.html exists
const templatePath = path.join(DIST_DIR, 'index.html');
if (!fs.existsSync(templatePath)) {
  console.error('[Prerender] Error: dist/index.html not found. Run vite build first!');
  process.exit(1);
}

const templateHtml = fs.readFileSync(templatePath, 'utf8');

// ── Shared Structured Data Helpers ──
const RESTAURANT_SCHEMA = {
  '@type': 'Restaurant',
  '@id': 'https://maatikitchen.com/#restaurant',
  'name': 'MAATI Kitchen',
  'alternateName': 'MAATI - Moderne Indische Küche & Café Berlin Mitte',
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
  'menu': 'https://maatikitchen.com/menu',
  'hasMenu': 'https://maatikitchen.com/menu',
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
  ],
  'sameAs': [
    'https://facebook.com',
    'https://instagram.com/maatikitchen',
    'https://www.lieferando.de/speisekarte/maati-indische-kuche-und-cafe-berlin',
    'https://www.ubereats.com/de/store/maati/OS3dPd_3VuuLuJYMUIWoYA'
  ]
};

// ── Complete Route Catalog ──
const ROUTES = [
  // 1. English Homepage
  {
    path: '/',
    outputPath: 'index.html',
    lang: 'en',
    title: 'MAATI Kitchen | Modern Indian Restaurant & Café Berlin Mitte',
    description: 'Modern Indian food in Berlin Mitte: fresh bowls, naan pockets, curries, specialty coffee and chai. Vegan options. Zimmerstraße 56, near Checkpoint Charlie.',
    canonical: 'https://maatikitchen.com/',
    enUrl: 'https://maatikitchen.com/',
    deUrl: 'https://maatikitchen.com/de',
    h1: 'Modern Indian Food. Made for Berlin.',
    subheading: 'Fresh Bowls, Crispy Naan Pockets & Artisan Chai',
    bodyText: `Welcome to MAATI Kitchen at Zimmerstraße 56, 10117 Berlin Mitte. We serve modern Indian fast-casual cuisine crafted with wholesome ingredients, slow-simmered curries, warm toasted naan pockets, specialty coffee, and authentic masala chai. Enjoy dine-in, takeaway, delivery, and corporate office catering.`,
    schema: {
      '@context': 'https://schema.org',
      ...RESTAURANT_SCHEMA
    }
  },

  // 2. German Homepage
  {
    path: '/de',
    outputPath: 'de/index.html',
    lang: 'de',
    title: 'MAATI Kitchen | Indisches Restaurant & Café Berlin Mitte',
    description: 'Moderne indische Küche in Berlin Mitte: frische Bowls, Naan Pockets, Currys, Kaffee und Chai. Vegane Optionen. Zimmerstraße 56, nahe Checkpoint Charlie.',
    canonical: 'https://maatikitchen.com/de',
    enUrl: 'https://maatikitchen.com/',
    deUrl: 'https://maatikitchen.com/de',
    h1: 'Moderne indische Küche. Für Berlin gemacht.',
    subheading: 'Frische Bowls, knusprige Naan Pockets & aromatischer Chai',
    bodyText: `Willkommen bei MAATI Kitchen in der Zimmerstraße 56, 10117 Berlin Mitte. Entdecken Sie frische indische Lunch Bowls, warm getoastete Naan Pockets, hausgemachten Chai und Kaffeespezialitäten. Über 70% vegane und vegetarische Optionen. Vor Ort genießen, zum Mitnehmen oder als Catering für Ihr Team.`,
    schema: {
      '@context': 'https://schema.org',
      ...RESTAURANT_SCHEMA,
      url: 'https://maatikitchen.com/de',
      menu: 'https://maatikitchen.com/de/menu',
      hasMenu: 'https://maatikitchen.com/de/menu'
    }
  },

  // 3. English Menu
  {
    path: '/menu',
    outputPath: 'menu/index.html',
    lang: 'en',
    title: 'Menu: Indian Bowls, Naan Pockets & Chai | MAATI Kitchen Berlin Mitte',
    description: 'Explore the MAATI Kitchen menu in Berlin Mitte: wholesome Indian lunch bowls, toasted naan pockets, masala chai, specialty coffee, and vegan options. Zimmerstraße 56.',
    canonical: 'https://maatikitchen.com/menu',
    enUrl: 'https://maatikitchen.com/menu',
    deUrl: 'https://maatikitchen.com/de/menu',
    h1: 'Indian Food Menu: Fresh Bowls, Naan Pockets & Chai',
    subheading: 'Signature Bowls, Crispy Naan Pockets, Artisan Drinks & Desserts',
    bodyText: `Explore our official restaurant menu. Featuring Delhi Butter Chicken Bowl, Chettinad Spiced Chicken, Kashmiri Paneer Bowl, Yellow Lentil Dal, and crisp Punjab Naan Pockets. Over 70% vegetarian and vegan options. Served daily near Checkpoint Charlie, Berlin Mitte.`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        RESTAURANT_SCHEMA,
        {
          '@type': 'Menu',
          '@id': 'https://maatikitchen.com/menu#menu',
          'name': 'MAATI Kitchen Restaurant Menu Berlin Mitte',
          'url': 'https://maatikitchen.com/menu',
          'inLanguage': 'en-US',
          'mainEntityOfPage': 'https://maatikitchen.com/menu'
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'What makes the Indian Bowls at MAATI Kitchen Berlin Mitte special?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Our bowls combine slow-simmered regional curries with wholesome grain bases (fragrant basmati rice or bulgur), fresh market salads, and artisanal chutneys. Cooked daily without preservatives.'
              }
            },
            {
              '@type': 'Question',
              'name': 'What are Punjab Naan Pockets?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Punjab Naan Pockets are MAATI’s signature creation: freshly baked pillowy naan bread, folded and toasted until golden and crispy, stuffed with chicken tikka, grilled paneer, or vegan tofu.'
              }
            }
          ]
        }
      ]
    }
  },

  // 4. German Menu
  {
    path: '/de/menu',
    outputPath: 'de/menu/index.html',
    lang: 'de',
    title: 'Speisekarte: Indische Bowls & Naan Pockets | MAATI Kitchen Berlin Mitte',
    description: 'Entdecken Sie die Speisekarte von MAATI Kitchen in Berlin Mitte: frische indische Lunch Bowls, getoastete Naan Pockets, Chai, Kaffeespezialitäten & vegane Optionen.',
    canonical: 'https://maatikitchen.com/de/menu',
    enUrl: 'https://maatikitchen.com/menu',
    deUrl: 'https://maatikitchen.com/de/menu',
    h1: 'Speisekarte: Moderne indische Bowls, Naan Pockets & Chai',
    subheading: 'Frische Bowls, getoastete Naan-Pockets, Drinks & hausgemachte Desserts',
    bodyText: `Entdecken Sie die offizielle Speisekarte von MAATI Kitchen. Genießen Sie Delhi Butter Chicken Bowl, Chettinad Pepper Bowl, Kashmir Palak Paneer, mildes Dal und knusprige Punjab Naan Pockets. Über 70% vegetarisch & vegan. Täglich frisch zubereitet in der Zimmerstraße 56, Berlin Mitte.`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          ...RESTAURANT_SCHEMA,
          url: 'https://maatikitchen.com/de/menu',
          menu: 'https://maatikitchen.com/de/menu',
          hasMenu: 'https://maatikitchen.com/de/menu'
        },
        {
          '@type': 'Menu',
          '@id': 'https://maatikitchen.com/de/menu#menu',
          'name': 'MAATI Kitchen Speisekarte Berlin Mitte',
          'url': 'https://maatikitchen.com/de/menu',
          'inLanguage': 'de-DE',
          'mainEntityOfPage': 'https://maatikitchen.com/de/menu'
        },
        {
          '@type': 'FAQPage',
          'mainEntity': [
            {
              '@type': 'Question',
              'name': 'Was zeichnet die indischen Lunch Bowls bei MAATI Kitchen in Berlin Mitte aus?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Unsere indischen Bowls verbinden schonend geschmorte Currys (wie Delhi Butter Chicken oder cremiges Palak Paneer) mit gesunden Basen wie Basmatireis oder Bulgur, frischen Salaten und hausgemachten Chutneys.'
              }
            },
            {
              '@type': 'Question',
              'name': 'Was sind Punjab Naan Pockets?',
              'acceptedAnswer': {
                '@type': 'Answer',
                'text': 'Punjab Naan Pockets sind unsere Signature-Kreation: Frisch gebackenes, warm getoastetes Naan-Brot, gefüllt mit mariniertem Hähnchen Tikka, gegrilltem Paneer-Käse oder Tofu, Salat und frischen Chutneys.'
              }
            }
          ]
        }
      ]
    }
  },

  // German Speisekarte alias
  {
    path: '/de/speisekarte',
    outputPath: 'de/speisekarte/index.html',
    lang: 'de',
    title: 'Speisekarte: Indische Bowls & Naan Pockets | MAATI Kitchen Berlin Mitte',
    description: 'Entdecken Sie die Speisekarte von MAATI Kitchen in Berlin Mitte: frische indische Lunch Bowls, getoastete Naan Pockets, Chai, Kaffeespezialitäten & vegane Optionen.',
    canonical: 'https://maatikitchen.com/de/menu', // Canonical points to primary /de/menu URL
    enUrl: 'https://maatikitchen.com/menu',
    deUrl: 'https://maatikitchen.com/de/menu',
    h1: 'Speisekarte: Moderne indische Bowls, Naan Pockets & Chai',
    subheading: 'Frische Bowls, getoastete Naan-Pockets, Drinks & Desserts',
    bodyText: `Speisekarte von MAATI Kitchen in Berlin Mitte. Frische Bowls, getoastete Naan Pockets, Kaffeespezialitäten und hausgemachter Chai.`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [RESTAURANT_SCHEMA]
    }
  },

  // 5. English Catering
  {
    path: '/catering',
    outputPath: 'catering/index.html',
    lang: 'en',
    title: 'Indian Catering Berlin Mitte for Offices and Companies | MAATI Kitchen',
    description: 'Fresh Indian catering in Berlin Mitte for office lunches, meetings and celebrations. From 10 to 200 guests, vegan and vegetarian options, delivery and full setup.',
    canonical: 'https://maatikitchen.com/catering',
    enUrl: 'https://maatikitchen.com/catering',
    deUrl: 'https://maatikitchen.com/de/catering',
    h1: 'Indian Catering Berlin',
    subheading: 'Corporate & Event Catering for Teams, Meetings & Celebrations',
    serviceText: 'Service: Indian Corporate & Event Catering (Team Bowls, Naan Platters, Finger Food & Buffets)',
    areaServedText: 'Area Served: Berlin (Mitte, Kreuzberg, Friedrichshain & Greater Berlin)',
    bodyText: `MAATI Kitchen delivers authentic, vibrant Indian catering across Berlin. From modular office team bowls to crisp naan pocket platters and warm chafing buffets. Suitable for 10 to 200+ guests with 100% vegan, vegetarian, and meat options. Punctual delivery, setup, and 14-day invoice payment terms for companies.`,
    extraHtml: `
      <section class="mt-8 pt-8 border-t border-[#ebdcd0]">
        <h3 class="text-2xl font-black text-[#1e382f] mb-2">Additions &amp; Optional Stations</h3>
        <p class="text-[#666] text-sm mb-6">Customize any of our core catering packages with these popular add-on stations:</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 bg-white rounded-xl border border-[#ebdcd0] shadow-sm">
            <p class="font-extrabold text-[#1e382f]">Naan Pockets <span class="text-[#d85c27] text-sm font-bold">(€5.50 per person)</span></p>
            <p class="text-xs text-[#666] mt-1">Cut-in-half warm toasted naan pockets with savory fillings</p>
          </div>
          <div class="p-4 bg-white rounded-xl border border-[#ebdcd0] shadow-sm">
            <p class="font-extrabold text-[#1e382f]">Breakfast Setup <span class="text-[#d85c27] text-sm font-bold">(€6.50 per person)</span></p>
            <p class="text-xs text-[#666] mt-1">Chutney croissants, spiced yogurt granola jars &amp; fresh fruit</p>
          </div>
          <div class="p-4 bg-white rounded-xl border border-[#ebdcd0] shadow-sm">
            <p class="font-extrabold text-[#1e382f]">Coffee &amp; Chai Bar <span class="text-[#d85c27] text-sm font-bold">(€3.50 per person)</span></p>
            <p class="text-xs text-[#666] mt-1">Slow-simmered whole-spice masala chai &amp; specialty artisan coffee</p>
          </div>
          <div class="p-4 bg-white rounded-xl border border-[#ebdcd0] shadow-sm">
            <p class="font-extrabold text-[#1e382f]">Snack Station <span class="text-[#d85c27] text-sm font-bold">(€4.00 per person)</span></p>
            <p class="text-xs text-[#666] mt-1">Crispy sev, mini samosa bites, spiced cashews &amp; house chutneys</p>
          </div>
        </div>
      </section>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          ...RESTAURANT_SCHEMA,
          url: 'https://maatikitchen.com/catering',
          makesOffer: {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              '@id': 'https://maatikitchen.com/catering#service',
              'name': 'Indian Catering Berlin',
              'serviceType': 'Catering',
              'areaServed': {
                '@type': 'City',
                'name': 'Berlin'
              }
            }
          }
        },
        {
          '@type': 'Service',
          '@id': 'https://maatikitchen.com/catering#service',
          'name': 'Indian Catering Berlin',
          'serviceType': 'Catering',
          'description': 'Fresh Indian catering in Berlin Mitte for office lunches, meetings and celebrations. From 10 to 200 guests, vegan and vegetarian options, delivery and full setup.',
          'areaServed': {
            '@type': 'City',
            'name': 'Berlin'
          },
          'provider': {
            '@type': 'Restaurant',
            '@id': 'https://maatikitchen.com/#restaurant'
          }
        }
      ]
    }
  },

  // 6. German Catering
  {
    path: '/de/catering',
    outputPath: 'de/catering/index.html',
    lang: 'de',
    title: 'Indisches Catering Berlin Mitte für Büro und Firmen | MAATI Kitchen',
    description: 'Frisches indisches Catering in Berlin Mitte für Büro-Lunch, Meetings und Feiern. Von 10 bis 200 Gäste, vegane und vegetarische Optionen, Lieferung und Aufbau.',
    canonical: 'https://maatikitchen.com/de/catering',
    enUrl: 'https://maatikitchen.com/catering',
    deUrl: 'https://maatikitchen.com/de/catering',
    h1: 'Indisches Catering Berlin',
    subheading: 'Business Catering für Teams, Meetings & Firmen-Events',
    serviceText: 'Service: Indisches Firmen- & Event-Catering (Team Bowls, Naan-Platten, Fingerfood & Buffets)',
    areaServedText: 'Einsatzgebiet: Berlin (Mitte, Kreuzberg, Friedrichshain & ganz Berlin)',
    bodyText: `MAATI Kitchen liefert frisches indisches Catering in ganz Berlin. Gesunde modulare Lunch Bowls, getoastete Naan-Pockets, Fingerfood und warme Chafing-Buffets direkt in Ihr Büro. Ab 10 bis 200+ Personen. Über 70% vegan & vegetarisch, pünktliche Berliner Lieferung und 14 Tage Zahlungsziel auf Rechnung.`,
    extraHtml: `
      <section class="mt-8 pt-8 border-t border-[#ebdcd0]">
        <h3 class="text-2xl font-black text-[#1e382f] mb-2">Zusatzoptionen &amp; Stationen (Add-ons)</h3>
        <p class="text-[#666] text-sm mb-6">Ergänzen Sie Ihr gewähltes Catering-Paket flexibel mit unseren beliebten Stationen:</p>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div class="p-4 bg-white rounded-xl border border-[#ebdcd0] shadow-sm">
            <p class="font-extrabold text-[#1e382f]">Naan Pockets <span class="text-[#d85c27] text-sm font-bold">(€5,50 pro Person)</span></p>
            <p class="text-xs text-[#666] mt-1">Halbierte, getoastete Naan-Brote mit verschiedenen Füllungen</p>
          </div>
          <div class="p-4 bg-white rounded-xl border border-[#ebdcd0] shadow-sm">
            <p class="font-extrabold text-[#1e382f]">Breakfast Setup <span class="text-[#d85c27] text-sm font-bold">(€6,50 pro Person)</span></p>
            <p class="text-xs text-[#666] mt-1">Chutney-Croissants, Kardamom-Granola-Jars und Obst</p>
          </div>
          <div class="p-4 bg-white rounded-xl border border-[#ebdcd0] shadow-sm">
            <p class="font-extrabold text-[#1e382f]">Coffee &amp; Chai Bar <span class="text-[#d85c27] text-sm font-bold">(€3,50 pro Person)</span></p>
            <p class="text-xs text-[#666] mt-1">Frisch gebrühter Masala Chai &amp; Kaffeespezialitäten</p>
          </div>
          <div class="p-4 bg-white rounded-xl border border-[#ebdcd0] shadow-sm">
            <p class="font-extrabold text-[#1e382f]">Snack Station <span class="text-[#d85c27] text-sm font-bold">(€4,00 pro Person)</span></p>
            <p class="text-xs text-[#666] mt-1">Knuspriges Sev, Mini-Samosas, würzige Cashews &amp; Chutneys</p>
          </div>
        </div>
      </section>
    `,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        {
          ...RESTAURANT_SCHEMA,
          url: 'https://maatikitchen.com/de/catering',
          makesOffer: {
            '@type': 'Offer',
            'itemOffered': {
              '@type': 'Service',
              '@id': 'https://maatikitchen.com/de/catering#service',
              'name': 'Indisches Catering Berlin',
              'serviceType': 'Catering',
              'areaServed': {
                '@type': 'City',
                'name': 'Berlin'
              }
            }
          }
        },
        {
          '@type': 'Service',
          '@id': 'https://maatikitchen.com/de/catering#service',
          'name': 'Indisches Catering Berlin',
          'serviceType': 'Catering',
          'description': 'Frisches indisches Catering in Berlin Mitte für Büro-Lunch, Meetings und Feiern. Von 10 bis 200 Gäste, vegane und vegetarische Optionen, Lieferung und Aufbau.',
          'areaServed': {
            '@type': 'City',
            'name': 'Berlin'
          },
          'provider': {
            '@type': 'Restaurant',
            '@id': 'https://maatikitchen.com/#restaurant'
          }
        }
      ]
    }
  },

  // 7. English Events
  {
    path: '/events',
    outputPath: 'events/index.html',
    lang: 'en',
    title: 'Private Events & Dining in Berlin Mitte | MAATI Kitchen',
    description: 'Host birthdays, team lunches and private celebrations at MAATI Kitchen in Berlin Mitte. Flexible event space with Indian food and drinks. Enquire today.',
    canonical: 'https://maatikitchen.com/events',
    enUrl: 'https://maatikitchen.com/events',
    deUrl: 'https://maatikitchen.com/de/events',
    h1: 'Private Events & Celebrations in Berlin Mitte',
    subheading: 'Book Our Restaurant Space For Birthdays, Team Dinners & Parties',
    bodyText: `Celebrate your milestone, birthday, or corporate dinner at MAATI Kitchen. Our light-filled venue in Zimmerstraße 56 accommodates up to 60 guests with tailored food packages, bar service, and warm hospitality.`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        RESTAURANT_SCHEMA,
        {
          '@type': 'EventVenue',
          'name': 'MAATI Kitchen Berlin Event Space',
          'description': 'Host birthdays, team lunches and private celebrations at MAATI Kitchen in Berlin Mitte.',
          'maximumAttendeeCapacity': 60,
          'address': RESTAURANT_SCHEMA.address
        }
      ]
    }
  },

  // 8. German Events
  {
    path: '/de/events',
    outputPath: 'de/events/index.html',
    lang: 'de',
    title: 'Events & Feiern in Berlin Mitte | MAATI Kitchen',
    description: 'Feiern Sie Geburtstage, Team-Lunches und private Anlässe bei MAATI Kitchen in Berlin Mitte. Flexible Räume, indisches Essen und Getränke. Jetzt anfragen.',
    canonical: 'https://maatikitchen.com/de/events',
    enUrl: 'https://maatikitchen.com/events',
    deUrl: 'https://maatikitchen.com/de/events',
    h1: 'Events & Feiern in Berlin Mitte',
    subheading: 'Exklusive Räume für Geburtstage, Firmen-Lunches & Feiern',
    bodyText: `Feiern Sie private Anlässe, Team-Abende oder Geburtstage bei MAATI Kitchen. Unsere stilvollen Räume in der Zimmerstraße 56 bieten Platz für bis zu 60 Personen inklusive individuellem Catering und Drinks.`,
    schema: {
      '@context': 'https://schema.org',
      '@graph': [
        RESTAURANT_SCHEMA,
        {
          '@type': 'EventVenue',
          'name': 'MAATI Kitchen Eventlocation Berlin',
          'description': 'Feiern Sie Geburtstage, Team-Lunches und private Anlässe bei MAATI Kitchen in Berlin Mitte.',
          'maximumAttendeeCapacity': 60,
          'address': RESTAURANT_SCHEMA.address
        }
      ]
    }
  },

  // 9. Category: Naan Pockets EN
  {
    path: '/menu/naan-pockets',
    outputPath: 'menu/naan-pockets/index.html',
    lang: 'en',
    title: 'Punjab Naan Pockets Berlin Mitte | MAATI Kitchen',
    description: 'Freshly toasted, crispy Punjab Naan Pockets filled with succulent chicken, paneer, or tofu, fresh salads and artisan chutneys in Berlin Mitte.',
    canonical: 'https://maatikitchen.com/menu/naan-pockets',
    enUrl: 'https://maatikitchen.com/menu/naan-pockets',
    deUrl: 'https://maatikitchen.com/de/menu/naan-pockets',
    h1: 'Punjab Naan Pockets in Berlin Mitte',
    subheading: 'Crispy Toasted Naan Stuffed with Fresh Ingredients & House Chutneys',
    bodyText: `Crispy on the outside, pillowy soft inside. Our Punjab Naan Pockets are stuffed with your choice of chicken tikka, grilled paneer, or tofu, accompanied by fresh herbs and spiced sauces.`,
    schema: { '@context': 'https://schema.org', '@graph': [RESTAURANT_SCHEMA] }
  },

  // 10. Category: Naan Pockets DE
  {
    path: '/de/menu/naan-pockets',
    outputPath: 'de/menu/naan-pockets/index.html',
    lang: 'de',
    title: 'Punjab Naan Pockets Berlin Mitte | MAATI Kitchen',
    description: 'Knusprig getoastete Punjab Naan Taschen mit Chicken Tikka, Paneer oder veganem Tofu, knackigen Salaten und frischen Chutneys in Berlin Mitte.',
    canonical: 'https://maatikitchen.com/de/menu/naan-pockets',
    enUrl: 'https://maatikitchen.com/menu/naan-pockets',
    deUrl: 'https://maatikitchen.com/de/menu/naan-pockets',
    h1: 'Punjab Naan Pockets in Berlin Mitte',
    subheading: 'Frisch getoastete Naan-Brote mit herzhaften Füllungen & Chutneys',
    bodyText: `Außen goldbraun und kross, innen wunderbar saftig. Unsere Punjab Naan Taschen sind gefüllt mit mariniertem Hähnchen, Bio-Paneer oder veganem Tofu.`,
    schema: { '@context': 'https://schema.org', '@graph': [RESTAURANT_SCHEMA] }
  },

  // 11. Category: Bowls EN
  {
    path: '/menu/bowls',
    outputPath: 'menu/bowls/index.html',
    lang: 'en',
    title: 'Indian Lunch Bowls Berlin Mitte | MAATI Kitchen',
    description: 'Nutritious, authentic Indian lunch bowls with fragrant basmati, slow-cooked curries, market veggies and house chutneys. Berlin Mitte Zimmerstraße.',
    canonical: 'https://maatikitchen.com/menu/bowls',
    enUrl: 'https://maatikitchen.com/menu/bowls',
    deUrl: 'https://maatikitchen.com/de/menu/bowls',
    h1: 'Indian Lunch Bowls in Berlin Mitte',
    subheading: 'Wholesome Grains, Slow-Simmered Curries & Fresh Market Greens',
    bodyText: `Crafted for Berlin’s fast lunch pace. Our Indian bowls offer Delhi Butter Chicken, Chettinad Spiced Chicken, Kashmiri Paneer, or Yellow Lentil Dal on basmati or bulgur.`,
    schema: { '@context': 'https://schema.org', '@graph': [RESTAURANT_SCHEMA] }
  },

  // 12. Category: Bowls DE
  {
    path: '/de/menu/bowls',
    outputPath: 'de/menu/bowls/index.html',
    lang: 'de',
    title: 'Indische Lunch Bowls Berlin Mitte | MAATI Kitchen',
    description: 'Gesunde, aromatische indische Lunch Bowls mit Basmatireis, schonend gegarten Currys, frischem Gemüse und Chutneys in Berlin Mitte.',
    canonical: 'https://maatikitchen.com/de/menu/bowls',
    enUrl: 'https://maatikitchen.com/menu/bowls',
    deUrl: 'https://maatikitchen.com/de/menu/bowls',
    h1: 'Indische Lunch Bowls in Berlin Mitte',
    subheading: 'Frischer Basmatireis, milde & würzige Currys und knackige Salate',
    bodyText: `Perfekt für die Mittagspause in Berlin Mitte: Aromatische Bowls mit Butter Chicken, Chettinad Chicken, cremigen Linsen oder Paneer auf duftendem Basmati.`,
    schema: { '@context': 'https://schema.org', '@graph': [RESTAURANT_SCHEMA] }
  },

  // 13. Category: Breakfast EN
  {
    path: '/menu/breakfast',
    outputPath: 'menu/breakfast/index.html',
    lang: 'en',
    title: 'Indian Breakfast & Morning Bites Berlin Mitte | MAATI Kitchen',
    description: 'Chutney croissants, turmeric cheese toasties, and cardamom granola jars for morning breakfast and coffee in Berlin Mitte.',
    canonical: 'https://maatikitchen.com/menu/breakfast',
    enUrl: 'https://maatikitchen.com/menu/breakfast',
    deUrl: 'https://maatikitchen.com/de/menu/breakfast',
    h1: 'Indian Breakfast & Morning Bites Berlin Mitte',
    subheading: 'Chutney Croissants, Spiced Granola & Fresh Specialty Coffee',
    bodyText: `Start your day at MAATI Kitchen with savory chutney croissants, turmeric cottage cheese toasties, or spiced fruit granola jars paired with barista coffee.`,
    schema: { '@context': 'https://schema.org', '@graph': [RESTAURANT_SCHEMA] }
  },

  // 14. Category: Breakfast DE
  {
    path: '/de/menu/breakfast',
    outputPath: 'de/menu/breakfast/index.html',
    lang: 'de',
    title: 'Indisches Frühstück & Snacks Berlin Mitte | MAATI Kitchen',
    description: 'Chutney-Croissants, Kurkuma-Käse-Toasts und hausgemachtes Granola für Ihr Frühstück in Berlin Mitte nahe Checkpoint Charlie.',
    canonical: 'https://maatikitchen.com/de/menu/breakfast',
    enUrl: 'https://maatikitchen.com/menu/breakfast',
    deUrl: 'https://maatikitchen.com/de/menu/breakfast',
    h1: 'Indisches Frühstück & Snacks Berlin Mitte',
    subheading: 'Chutney-Croissants, Kardamom-Granola und Kaffeespezialitäten',
    bodyText: `Starten Sie den Tag bei MAATI Kitchen: Herzhafte Croissants mit Koriander-Chutney und geschmolzenem Käse, Kurkuma-Paneer oder fruchtiges Granola.`,
    schema: { '@context': 'https://schema.org', '@graph': [RESTAURANT_SCHEMA] }
  },

  // 15. Category: Coffee & Chai EN
  {
    path: '/menu/coffee-chai',
    outputPath: 'menu/coffee-chai/index.html',
    lang: 'en',
    title: 'Specialty Indian Coffee & Masala Chai Berlin Mitte | MAATI Kitchen',
    description: 'Slow-simmered whole-spice masala chai and specialty single-origin Indian espresso drinks in Berlin Mitte Zimmerstraße.',
    canonical: 'https://maatikitchen.com/menu/coffee-chai',
    enUrl: 'https://maatikitchen.com/menu/coffee-chai',
    deUrl: 'https://maatikitchen.com/de/menu/coffee-chai',
    h1: 'Specialty Indian Coffee & Masala Chai Berlin Mitte',
    subheading: 'Authentic Whole-Spice Masala Chai, Flat Whites & Mango Lassi',
    bodyText: `Slow-simmered ginger-cardamom masala chai with whole spices and artisan specialty coffee. Pair with fresh mango lassis or sweet gulab jamun.`,
    schema: { '@context': 'https://schema.org', '@graph': [RESTAURANT_SCHEMA] }
  },

  // 16. Category: Coffee & Chai DE
  {
    path: '/de/menu/coffee-chai',
    outputPath: 'de/menu/coffee-chai/index.html',
    lang: 'de',
    title: 'Indischer Spezialitätenkaffee & Masala Chai Berlin Mitte | MAATI Kitchen',
    description: 'Frisch gekochter Masala Chai mit ganzen Gewürzen und feinster indischer Barista-Kaffee in Berlin Mitte Zimmerstraße.',
    canonical: 'https://maatikitchen.com/de/menu/coffee-chai',
    enUrl: 'https://maatikitchen.com/menu/coffee-chai',
    deUrl: 'https://maatikitchen.com/de/menu/coffee-chai',
    h1: 'Indischer Spezialitätenkaffee & Masala Chai Berlin Mitte',
    subheading: 'Echter Masala Chai, frischer Espresso & cremige Mango Lassis',
    bodyText: `Schonend aufgebrühter Masala Chai mit Zimt, Nelken, Ingwer und Kardamom sowie Kaffeespezialitäten auf Hafer- oder Bio-Kuhmilchbasis.`,
    schema: { '@context': 'https://schema.org', '@graph': [RESTAURANT_SCHEMA] }
  },

  // 17. Locations EN
  {
    path: '/locations',
    outputPath: 'locations/index.html',
    lang: 'en',
    title: 'Location & Opening Hours Berlin Mitte | MAATI Kitchen',
    description: 'Visit MAATI Kitchen at Zimmerstraße 56, 10117 Berlin Mitte near Checkpoint Charlie. Opening hours, directions, and contact information.',
    canonical: 'https://maatikitchen.com/locations',
    enUrl: 'https://maatikitchen.com/locations',
    deUrl: 'https://maatikitchen.com/de/locations',
    h1: 'Visit MAATI Kitchen in Berlin Mitte',
    subheading: 'Zimmerstraße 56, 10117 Berlin (Near Checkpoint Charlie & U-Kochstraße)',
    bodyText: `Located in the heart of Berlin Mitte at Zimmerstraße 56, just two minutes from U-Bahn Kochstraße (U6) and Checkpoint Charlie. Open Monday to Sunday.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  },

  // 18. Locations DE
  {
    path: '/de/locations',
    outputPath: 'de/locations/index.html',
    lang: 'de',
    title: 'Standort & Öffnungszeiten Berlin Mitte | MAATI Kitchen',
    description: 'Besuchen Sie MAATI Kitchen in der Zimmerstraße 56, 10117 Berlin Mitte nahe Checkpoint Charlie. Öffnungszeiten, Anfahrt und Kontakt.',
    canonical: 'https://maatikitchen.com/de/locations',
    enUrl: 'https://maatikitchen.com/locations',
    deUrl: 'https://maatikitchen.com/de/locations',
    h1: 'MAATI Kitchen in Berlin Mitte besuchen',
    subheading: 'Zimmerstraße 56, 10117 Berlin (Nahe Checkpoint Charlie & U-Kochstraße)',
    bodyText: `Zentral in Berlin Mitte gelegen: Zimmerstraße 56, nur wenige Schritte vom U-Bahnhof Kochstraße (U6) und Checkpoint Charlie entfernt.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  },

  // 19. Contact EN
  {
    path: '/contact',
    outputPath: 'contact/index.html',
    lang: 'en',
    title: 'Contact MAATI Kitchen Berlin Mitte | Enquiries & Reservations',
    description: 'Contact MAATI Kitchen Berlin Mitte: Phone +49 30 51891367, email hello@maatikitchen.com. Table bookings, private events, and catering.',
    canonical: 'https://maatikitchen.com/contact',
    enUrl: 'https://maatikitchen.com/contact',
    deUrl: 'https://maatikitchen.com/de/kontakt',
    h1: 'Contact MAATI Kitchen Berlin',
    subheading: 'Get in Touch for Table Bookings, Catering & Event Inquiries',
    bodyText: `Questions, table reservations, or event enquiries? Reach our team directly by phone at +49 30 51891367 or email hello@maatikitchen.com.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  },

  // 20. Contact DE
  {
    path: '/de/contact',
    outputPath: 'de/contact/index.html',
    lang: 'de',
    title: 'Kontakt MAATI Kitchen Berlin Mitte | Reservierung & Anfragen',
    description: 'Kontaktieren Sie MAATI Kitchen in Berlin Mitte: Telefon +49 30 51891367, E-Mail hello@maatikitchen.com. Reservierungen, Catering & Events.',
    canonical: 'https://maatikitchen.com/de/kontakt',
    enUrl: 'https://maatikitchen.com/contact',
    deUrl: 'https://maatikitchen.com/de/kontakt',
    h1: 'Kontakt zu MAATI Kitchen Berlin',
    subheading: 'Tischreservierungen, Catering-Anfragen & persönlicher Kontakt',
    bodyText: `Haben Sie Fragen oder möchten einen Tisch reservieren? Rufen Sie uns an unter +49 30 51891367 oder schreiben Sie an hello@maatikitchen.com.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  },
  {
    path: '/de/kontakt',
    outputPath: 'de/kontakt/index.html',
    lang: 'de',
    title: 'Kontakt MAATI Kitchen Berlin Mitte | Reservierung & Anfragen',
    description: 'Kontaktieren Sie MAATI Kitchen in Berlin Mitte: Telefon +49 30 51891367, E-Mail hello@maatikitchen.com. Reservierungen, Catering & Events.',
    canonical: 'https://maatikitchen.com/de/kontakt',
    enUrl: 'https://maatikitchen.com/contact',
    deUrl: 'https://maatikitchen.com/de/kontakt',
    h1: 'Kontakt zu MAATI Kitchen Berlin',
    subheading: 'Tischreservierungen, Catering-Anfragen & persönlicher Kontakt',
    bodyText: `Haben Sie Fragen oder möchten einen Tisch reservieren? Rufen Sie uns an unter +49 30 51891367 oder schreiben Sie an hello@maatikitchen.com.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  },

  // 21. About EN & DE
  {
    path: '/about',
    outputPath: 'about/index.html',
    lang: 'en',
    title: 'About MAATI Kitchen | Our Story & Indian Heritage Berlin',
    description: 'Discover the story behind MAATI Kitchen: Authentic Indian home recipes reimagined with wholesome ingredients for Berlin.',
    canonical: 'https://maatikitchen.com/about',
    enUrl: 'https://maatikitchen.com/about',
    deUrl: 'https://maatikitchen.com/de/about',
    h1: 'Our Story: Modern Indian Food in Berlin Mitte',
    subheading: 'Rooted in Indian Heritage, Crafted for Berlin',
    bodyText: `MAATI means "Earth" or "Soil" in Hindi. Our philosophy brings wholesome, vibrant regional dishes from the heart of India into a welcoming, fast-casual Berlin setting.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  },
  {
    path: '/de/about',
    outputPath: 'de/about/index.html',
    lang: 'de',
    title: 'Über MAATI Kitchen | Unsere Geschichte & Philosophie Berlin',
    description: 'Erfahren Sie mehr über MAATI Kitchen in Berlin Mitte: Traditionelle indische Aromen modern und gesund interpretiert.',
    canonical: 'https://maatikitchen.com/de/about',
    enUrl: 'https://maatikitchen.com/about',
    deUrl: 'https://maatikitchen.com/de/about',
    h1: 'Unsere Geschichte: MAATI Kitchen in Berlin Mitte',
    subheading: 'Verwurzelt in indischer Tradition, gekocht für Berlin',
    bodyText: `MAATI bedeutet Erde auf Hindi. Wir kochen ehrliche, aromatische Gerichte ohne künstliche Zusätze, frisch serviert in der Zimmerstraße 56.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  },
  {
    path: '/de/ueber-uns',
    outputPath: 'de/ueber-uns/index.html',
    lang: 'de',
    title: 'Über MAATI Kitchen | Unsere Geschichte & Philosophie Berlin',
    description: 'Erfahren Sie mehr über MAATI Kitchen in Berlin Mitte: Traditionelle indische Aromen modern und gesund interpretiert.',
    canonical: 'https://maatikitchen.com/de/about',
    enUrl: 'https://maatikitchen.com/about',
    deUrl: 'https://maatikitchen.com/de/about',
    h1: 'Unsere Geschichte: MAATI Kitchen in Berlin Mitte',
    subheading: 'Verwurzelt in indischer Tradition, gekocht für Berlin',
    bodyText: `MAATI bedeutet Erde auf Hindi. Wir kochen ehrliche, aromatische Gerichte ohne künstliche Zusätze, frisch serviert in der Zimmerstraße 56.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  },
  {
    path: '/de/veranstaltungen',
    outputPath: 'de/veranstaltungen/index.html',
    lang: 'de',
    title: 'Events & Feiern in Berlin Mitte | MAATI Kitchen',
    description: 'Buchen Sie MAATI Kitchen für private Feiern, Firmen-Events und Get-Together in Berlin Mitte nahe Checkpoint Charlie.',
    canonical: 'https://maatikitchen.com/de/events',
    enUrl: 'https://maatikitchen.com/events',
    deUrl: 'https://maatikitchen.com/de/events',
    h1: 'Private Events & Feiern bei MAATI Kitchen',
    subheading: 'Die ideale Event-Location in Berlin Mitte für bis zu 80 Gäste',
    bodyText: `Ob Geburtstagsfeier, Team-Dinner oder Firmenfeier: Wir bieten Ihnen exklusive Räumlichkeiten, maßgeschneiderte Menüs und herzlichen Service.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  },

  // 22. Jobs EN & DE
  {
    path: '/jobs',
    outputPath: 'jobs/index.html',
    lang: 'en',
    title: 'Careers & Jobs at MAATI Kitchen Berlin Mitte | Join Our Team',
    description: 'Join the MAATI Kitchen team in Berlin Mitte. Open positions for baristas, counter crew, line cooks, and kitchen leaders.',
    canonical: 'https://maatikitchen.com/jobs',
    enUrl: 'https://maatikitchen.com/jobs',
    deUrl: 'https://maatikitchen.com/de/jobs',
    h1: 'Careers at MAATI Kitchen Berlin Mitte',
    subheading: 'Join Our Diverse, Energetic Restaurant & Café Team',
    bodyText: `We are always looking for passionate team members who love great food and warm hospitality. Apply for full-time, part-time, or student positions.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  },
  {
    path: '/de/jobs',
    outputPath: 'de/jobs/index.html',
    lang: 'de',
    title: 'Jobs & Karriere bei MAATI Kitchen Berlin Mitte | Team werden',
    description: 'Werden Sie Teil des MAATI Kitchen Teams in Berlin Mitte. Stellenangebote für Service, Barista, Küchenhilfe und Koch.',
    canonical: 'https://maatikitchen.com/de/jobs',
    enUrl: 'https://maatikitchen.com/jobs',
    deUrl: 'https://maatikitchen.com/de/jobs',
    h1: 'Jobs & Karriere bei MAATI Kitchen',
    subheading: 'Werde Teil unseres motivierten Restaurant- & Barista-Teams in Berlin Mitte',
    bodyText: `Wir suchen engagierte Talente für Service, Küche und Barista in Vollzeit oder Teilzeit in der Zimmerstraße 56, Berlin Mitte.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  },

  // 23. Legal pages
  {
    path: '/impressum',
    outputPath: 'impressum/index.html',
    lang: 'de',
    title: 'Impressum | MAATI Kitchen Berlin',
    description: 'Gesetzliche Angaben und Impressum der MAATI Kitchen in Berlin Mitte gemäß § 5 TMG.',
    canonical: 'https://maatikitchen.com/impressum',
    enUrl: 'https://maatikitchen.com/impressum',
    deUrl: 'https://maatikitchen.com/impressum',
    h1: 'Impressum & Gesetzliche Angaben',
    subheading: 'MAATI Kitchen, Zimmerstraße 56, 10117 Berlin',
    bodyText: `Angaben gemäß § 5 TMG. MAATI Kitchen, Zimmerstraße 56, 10117 Berlin. Telefon: +49 30 51891367. E-Mail: hello@maatikitchen.com.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  },
  {
    path: '/privacy',
    outputPath: 'privacy/index.html',
    lang: 'de',
    title: 'Datenschutzerklärung | MAATI Kitchen Berlin',
    description: 'Informationen zur Datenverarbeitung und zum Datenschutz der MAATI Kitchen gemäß DSGVO.',
    canonical: 'https://maatikitchen.com/privacy',
    enUrl: 'https://maatikitchen.com/privacy',
    deUrl: 'https://maatikitchen.com/privacy',
    h1: 'Datenschutzerklärung (Privacy Policy)',
    subheading: 'Transparenz über die Verarbeitung Ihrer personenbezogenen Daten gemäß DSGVO',
    bodyText: `Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Hier finden Sie alle Details zur Datenverarbeitung bei Besuch unserer Website.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  },
  {
    path: '/terms',
    outputPath: 'terms/index.html',
    lang: 'de',
    title: 'Allgemeine Geschäftsbedingungen (AGB) | MAATI Kitchen Berlin',
    description: 'AGB von MAATI Kitchen für Vor-Ort-Verzehr, Außer-Haus-Verkauf und Catering.',
    canonical: 'https://maatikitchen.com/terms',
    enUrl: 'https://maatikitchen.com/terms',
    deUrl: 'https://maatikitchen.com/terms',
    h1: 'Allgemeine Geschäftsbedingungen',
    subheading: 'MAATI Kitchen – Zimmerstraße 56, 10117 Berlin',
    bodyText: `Allgemeine Geschäftsbedingungen für die Inanspruchnahme von Restaurant-Leistungen, Bestellungen und Catering bei MAATI Kitchen.`,
    schema: { '@context': 'https://schema.org', ...RESTAURANT_SCHEMA }
  }
];

// ── HTML Pre-renderer Execution ──
console.log(`[Prerender] Generating static HTML for ${ROUTES.length} routes...`);

let successCount = 0;

for (const route of ROUTES) {
  try {
    let html = templateHtml;

    // 1. Language attribute on <html>
    html = html.replace(/<html[^>]*>/i, `<html lang="${route.lang}">`);

    // 2. Title tag
    html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(route.title)}</title>`);
    html = html.replace(/<meta\s+name=["']title["'][^>]*>/i, `<meta name="title" content="${escapeHtml(route.title)}" />`);

    // 3. Meta description
    html = html.replace(/<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeHtml(route.description)}" />`);

    // 4. Canonical tag - STRICT SELF-REFERENCING URL!
    html = html.replace(/<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${route.canonical}" />`);

    // 5. Reciprocal Hreflang Tags (en, de, x-default)
    const hreflangBlock = `
  <!-- Reciprocal Hreflang Tags (Self-Declared for Multi-Language SEO) -->
  <link rel="alternate" hreflang="en" href="${route.enUrl}" />
  <link rel="alternate" hreflang="de" href="${route.deUrl}" />
  <link rel="alternate" hreflang="x-default" href="${route.enUrl}" />`;

    // Remove any existing hreflangs in template then inject fresh ones right after canonical
    html = html.replace(/<link\s+rel=["']alternate["']\s+hreflang=[^>]*>\s*/gi, '');
    html = html.replace(/(<link\s+rel=["']canonical["'][^>]*>)/i, `$1${hreflangBlock}`);

    // 6. OpenGraph tags
    html = html.replace(/<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeHtml(route.title)}" />`);
    html = html.replace(/<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeHtml(route.description)}" />`);
    html = html.replace(/<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${route.canonical}" />`);
    html = html.replace(/<meta\s+property=["']og:locale["'][^>]*>/i, `<meta property="og:locale" content="${route.lang === 'de' ? 'de_DE' : 'en_US'}" />`);

    // 7. Twitter tags
    html = html.replace(/<meta\s+property=["']twitter:title["'][^>]*>/i, `<meta property="twitter:title" content="${escapeHtml(route.title)}" />`);
    html = html.replace(/<meta\s+property=["']twitter:description["'][^>]*>/i, `<meta property="twitter:description" content="${escapeHtml(route.description)}" />`);
    html = html.replace(/<meta\s+property=["']twitter:url["'][^>]*>/i, `<meta property="twitter:url" content="${route.canonical}" />`);

    // 8. Inject Structured Data JSON-LD Schema
    const schemaJson = JSON.stringify(route.schema, null, 2);
    const schemaScriptTag = `<script type="application/ld+json" id="route-schema">\n${schemaJson}\n  </script>`;
    // Replace the default static schema in index.html with the route-specific schema
    html = html.replace(/<script\s+type=["']application\/ld\+json["']>[\s\S]*?<\/script>/i, schemaScriptTag);

    // 9. Inject Semantic Initial HTML Body into <div id="root">
    const initialBody = `
      <div class="server-rendered-seo min-h-screen bg-[#f5f0e8] text-[#1a1a1a]">
        <header class="bg-[#1e382f] text-white py-4 px-6 sm:px-12 flex items-center justify-between shadow-md">
          <a href="${route.lang === 'de' ? '/de' : '/'}" class="text-xl font-black tracking-wider text-white">MAATI KITCHEN</a>
          <nav aria-label="Main Navigation" class="flex items-center gap-4 text-sm font-semibold">
            <a href="${route.lang === 'de' ? '/de/menu' : '/menu'}" class="hover:text-[#d85c27] transition-colors">${route.lang === 'de' ? 'Speisekarte' : 'Menu'}</a>
            <a href="${route.lang === 'de' ? '/de/catering' : '/catering'}" class="hover:text-[#d85c27] transition-colors">${route.lang === 'de' ? 'Catering' : 'Catering'}</a>
            <a href="${route.lang === 'de' ? '/de/events' : '/events'}" class="hover:text-[#d85c27] transition-colors">${route.lang === 'de' ? 'Events' : 'Events'}</a>
            <a href="${route.lang === 'de' ? '/de/locations' : '/locations'}" class="hover:text-[#d85c27] transition-colors">${route.lang === 'de' ? 'Standort' : 'Location'}</a>
            <a href="${route.enUrl}" class="text-xs px-2 py-1 rounded bg-white/20">EN</a>
            <a href="${route.deUrl}" class="text-xs px-2 py-1 rounded bg-white/20">DE</a>
          </nav>
        </header>

        <main class="max-w-[1200px] mx-auto px-6 sm:px-10 py-12">
          <article class="space-y-6">
            <h1 class="text-3xl sm:text-5xl font-black text-[#1e382f] leading-tight tracking-tight">${escapeHtml(route.h1)}</h1>
            ${route.subheading ? `<h2 class="text-xl sm:text-2xl font-bold text-[#d85c27]">${escapeHtml(route.subheading)}</h2>` : ''}
            
            ${route.serviceText ? `
              <div class="bg-white rounded-2xl p-6 shadow-sm border border-[#ebdcd0] my-4">
                <p class="font-extrabold text-[#1e382f] text-base sm:text-lg">${escapeHtml(route.serviceText)}</p>
                ${route.areaServedText ? `<p class="font-bold text-[#d85c27] text-sm sm:text-base mt-1">${escapeHtml(route.areaServedText)}</p>` : ''}
              </div>
            ` : ''}

            <p class="text-base sm:text-lg text-[#444] leading-relaxed max-w-[850px]">${escapeHtml(route.bodyText)}</p>
            ${route.extraHtml || ''}
          </article>
        </main>

        <footer class="bg-[#1e382f] text-white/80 py-8 px-6 text-center text-sm border-t border-white/10 mt-12">
          <p class="font-bold text-white mb-2">MAATI Kitchen Berlin Mitte</p>
          <p>Zimmerstraße 56, 10117 Berlin · Telefon: +49 30 51891367 · E-Mail: hello@maatikitchen.com</p>
          <p class="text-xs text-white/50 mt-4">Montag–Mittwoch 11:00–16:00 · Donnerstag–Samstag 11:00–21:00 · Sonntag 11:30–18:00</p>
        </footer>
      </div>
    `;

    html = html.replace('<div id="root"></div>', `<div id="root">${initialBody}</div>`);

    // Write file to target destination
    const targetFile = path.resolve(DIST_DIR, route.outputPath);
    const targetDir = path.dirname(targetFile);
    if (!fs.existsSync(targetDir)) {
      fs.mkdirSync(targetDir, { recursive: true });
    }

    fs.writeFileSync(targetFile, html, 'utf8');
    successCount++;
  } catch (err) {
    console.error(`[Prerender] Failed generating ${route.path}:`, err.message);
  }
}

console.log(`[Prerender] Successfully generated ${successCount} static pre-rendered HTML pages.`);

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

