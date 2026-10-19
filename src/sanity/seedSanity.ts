/**
 * MAATI Kitchen — Sanity Data Seeding Script
 * Run this script to populate your Sanity dataset with all existing MAATI menu items, categories, settings, and pages.
 *
 * Usage:
 *   VITE_SANITY_PROJECT_ID=your_id SANITY_API_TOKEN=your_token npx tsx src/sanity/seedSanity.ts
 */

import { createClient } from '@sanity/client';
import {
  BREAKFAST_ITEMS,
  NAAN_POCKET_ITEM,
  HAUSSPEZIALITAETEN_ITEMS,
  AUF_BESTELLUNG_ITEMS,
  NACHTISCH_ITEMS,
  COLD_DRINKS,
  HOT_DRINKS,
  BOTTLED_DRINKS,
  ALKOHOLISCHE_GETRAENKE,
  COCKTAILS,
  MenuItem,
} from '../data/june2026MenuData';

const projectId = process.env.VITE_SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.VITE_SANITY_DATASET || process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_TOKEN || process.env.VITE_SANITY_TOKEN;

if (!projectId || !token) {
  console.error('❌ Error: VITE_SANITY_PROJECT_ID and SANITY_API_TOKEN must be set to run the seeding script.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
});

const CATEGORIES = [
  { _id: 'cat-breakfast', name: 'Morning Bites', nameDe: 'Frühstück & Snacks', displayOrder: 1, items: BREAKFAST_ITEMS, defaultFoodType: 'vegetarian' },
  { _id: 'cat-naan-pockets', name: 'Punjab Naan Pockets', nameDe: 'Punjab Naan Taschen', displayOrder: 2, items: [NAAN_POCKET_ITEM], defaultFoodType: 'nonVegetarian' },
  { _id: 'cat-lunch-bowls', name: 'Signature Bowls', nameDe: 'Signatur Schalen', displayOrder: 3, items: HAUSSPEZIALITAETEN_ITEMS, defaultFoodType: 'nonVegetarian' },
  { _id: 'cat-made-to-order', name: 'Maati Specialties', nameDe: 'Maati Spezialitäten', displayOrder: 4, items: AUF_BESTELLUNG_ITEMS, defaultFoodType: 'nonVegetarian' },
  { _id: 'cat-desserts', name: 'Desserts', nameDe: 'Nachtisch', displayOrder: 5, items: NACHTISCH_ITEMS, defaultFoodType: 'vegetarian' },
  { _id: 'cat-cold-drinks', name: 'Homemade Drinks', nameDe: 'Hausgemachte Getränke', displayOrder: 6, items: COLD_DRINKS, defaultFoodType: 'vegetarian' },
  { _id: 'cat-hot-drinks', name: 'Hot Drinks', nameDe: 'Heisse Getränke', displayOrder: 7, items: HOT_DRINKS, defaultFoodType: 'vegetarian' },
  { _id: 'cat-bottled-drinks', name: 'Bottled Drinks', nameDe: 'Flaschen Getränke', displayOrder: 8, items: BOTTLED_DRINKS, defaultFoodType: 'vegan' },
  { _id: 'cat-alcoholic', name: 'Alcoholic Beverages', nameDe: 'Alkoholische Getränke', displayOrder: 9, items: ALKOHOLISCHE_GETRAENKE, defaultFoodType: 'vegan' },
  { _id: 'cat-cocktails', name: 'Cocktails', nameDe: 'Cocktails', displayOrder: 10, items: COCKTAILS, defaultFoodType: 'vegan' },
];

const FEATURED_ITEM_IDS = new Set([
  'chettinad-spicy-chicken',
  'delhi-butter-chicken',
  'bihar-lentil-potato',
  'punjab-naan-pockets',
  'croissant-chutney',
]);

function determineFoodType(item: MenuItem, defaultType: string): string {
  if (item.badgeDe === 'NON-VEGETARIAN' || item.badgeEn === 'NON-VEGETARIAN') return 'nonVegetarian';
  if (item.badgeDe === 'VEGAN' || item.badgeEn === 'VEGAN' || item.isVeganLeaf) return 'vegan';
  if (item.badgeDe === 'VEGETARISCH' || item.badgeEn === 'VEGETARIAN') return 'vegetarian';
  return defaultType;
}

async function seed() {
  console.log('🌱 Starting MAATI Kitchen Sanity Full CMS Migration...');

  // 1. Seed Site Settings (with GTM, Verification & Delivery URLs)
  console.log('📦 Seeding siteSettings...');
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    restaurantName: 'MAATI Kitchen',
    taglineEn: 'Indian Soul Food — Berlin Mitte',
    taglineDe: 'Indisches Soul Food — Berlin Mitte',
    phone: '+49 30 51891367',
    email: 'hello@maatikitchen.com',
    cateringEmail: 'catering@maatikitchen.com',
    address: 'Zimmerstraße 56, 10117 Berlin Mitte',
    openingHoursEn: 'Mon – Fri: 09:00 – 21:00\nSat: 10:00 – 21:00\nSun: Closed',
    openingHoursDe: 'Mo – Fr: 09:00 – 21:00\nSa: 10:00 – 21:00\nSo: Geschlossen',
    transitInfoEn: 'U6 Kochstraße / Checkpoint Charlie (3 min walk) | U2 Stadtmitte (5 min walk)',
    transitInfoDe: 'U6 Kochstraße / Checkpoint Charlie (3 Min. Fußweg) | U2 Stadtmitte (5 Min. Fußweg)',
    googleMapsUrl: 'https://maps.app.goo.gl/9z39r539s9o35Zg97',
    gtmId: 'GTM-KLZRV6LQ',
    googleVerification: 'yDJxfShS_AZYy2gpyyqeSNr8TUp7otlsJ3zwPcwuuI0',
    bingVerification: '7182C2664B051B9F6F450C0854F9A893',
    clarityProjectId: 'ynru8q0k5s',
    lieferandoUrl: 'https://www.lieferando.de/speisekarte/maati-kitchen-berlin',
    uberEatsUrl: 'https://www.ubereats.com/store/maati-kitchen-berlin',
    woltUrl: 'https://wolt.com/en/deu/berlin/restaurant/maati-kitchen',
    instagram: 'https://instagram.com/maatikitchen',
    linkedin: 'https://www.linkedin.com/company/maati-kitchen',
  });

  // 2. Seed Homepage
  console.log('🏠 Seeding homepage...');
  await client.createOrReplace({
    _id: 'homepage',
    _type: 'homepage',
    title: 'Main Landing Page',
    heroEyebrowEn: 'BERLIN MITTE',
    heroEyebrowDe: 'BERLIN MITTE',
    heroTitleEn: 'INDIAN SOUL FOOD',
    heroTitleDe: 'INDISCHES SOUL FOOD',
    heroSubtitleEn: 'LUNCH & DRINKS',
    heroSubtitleDe: 'MITTAGESSEN & GETRÄNKE',
    heroDescEn: 'Crafted with authentic heritage recipes and mindful local ingredients. Near Checkpoint Charlie, Zimmerstraße 56.',
    heroDescDe: 'Zubereitet nach authentischen Familienrezepten und mit regionalen Zutaten. Nahe Checkpoint Charlie, Zimmerstraße 56.',
    featuredEyebrowEn: 'OUR SPECIALTIES',
    featuredEyebrowDe: 'UNSERE SPEZIALITÄTEN',
    featuredTitleEn: 'Treat Your Tastebuds',
    featuredTitleDe: 'Verwöhnen Sie Ihren Gaumen',
    experienceEyebrowEn: 'EXPERIENCE',
    experienceEyebrowDe: 'ERLEBNIS',
    experienceTitleEn: 'Breakfast, Lunch and Events at MAATI',
    experienceTitleDe: 'Frühstück, Mittagessen und Events bei MAATI',
    experienceDescEn: 'A warm, modern space designed for quick breakfast & lunches and cozy events alike.',
    experienceDescDe: 'Ein warmer, moderner Raum für ein schnelles Frühstück, Mittagessen und gemütliche Events.',
    cateringTitleEn: 'Bold Flavours That Fuel Your Team',
    cateringTitleDe: 'Kräftige Aromen, die Ihr Team begeistern',
    cateringDescEn: 'From team lunches to full corporate events — we bring freshly crafted bowls, warm naan pockets, and signature drinks directly to your office.',
    cateringDescDe: 'Von Team-Lunches bis hin zu großen Firmenfeiern — wir bringen frisch zubereitete Bowls, warme Naan-Taschen und Signature Drinks direkt in Ihr Büro.',
  });

  // 3. Seed Category Landing Pages
  console.log('📑 Seeding category landing pages...');
  const LANDING_PAGES = [
    {
      _id: 'landing-naan-pockets',
      categoryKey: 'naan-pockets',
      slug: { _type: 'slug', current: 'naan-pockets' },
      h1En: 'Signature Naan Pockets in Berlin Mitte',
      h1De: 'Punjab Naan Taschen in Berlin Mitte',
      seoTitleEn: 'Naan Pockets Berlin Mitte | Handheld Indian Street Food',
      seoTitleDe: 'Naan Taschen Berlin Mitte | Frisches Indisches Street Food',
      seoDescEn: 'Fresh tandoor-baked naan folded around tender spiced meats, paneer, and homemade chutneys. Perfect handheld lunch in Berlin Mitte near Checkpoint Charlie.',
      seoDescDe: 'Ofenfrisches Naan gefüllt mit mariniertem Fleisch, Paneer und Chutneys. Schneller, köstlicher Lunch in Berlin Mitte nahe Checkpoint Charlie.',
      eyebrowEn: 'SIGNATURE STREET FOOD',
      eyebrowDe: 'SIGNATUR STREET FOOD',
      leadDescriptionEn: 'Our Punjab Naan Pockets reinvent authentic street food into a satisfying handheld lunch for busy Berliners.',
      leadDescriptionDe: 'Unsere Punjab Naan Taschen verbinden alte nordindische Backkunst mit modernem Berliner Streetfood-Genuss.',
    },
    {
      _id: 'landing-bowls',
      categoryKey: 'bowls',
      slug: { _type: 'slug', current: 'bowls' },
      h1En: 'Slow-Simmered Indian Curry Bowls',
      h1De: 'Traditionelle Indische Curry Bowls',
      seoTitleEn: 'Indian Curry Bowls Berlin Mitte | Slow-Cooked Lunch & Dinner',
      seoTitleDe: 'Indische Curry Bowls Berlin Mitte | Frischer Mittagstisch',
      seoDescEn: 'Wholesome Indian bowls crafted with aromatic basmati rice, slow-cooked curries, pickled onions, and homemade crisps. Dine in or order delivery.',
      seoDescDe: 'Wärmende indische Schalen mit Basmati-Reis, schonend gekochten Currys, Chutneys und Crunch. Zum Vor-Ort-Genießen oder bequem Liefern lassen.',
      eyebrowEn: 'COMFORT BOWLS',
      eyebrowDe: 'WARME BOWLS',
      leadDescriptionEn: 'Slow-simmered regional curries served over fragrant basmati rice with house salads and pickled condiments.',
      leadDescriptionDe: 'Nach regionalen Rezepten stundenlang gekochte Currys, serviert auf feinstem Basmatireis mit frischen Toppings.',
    },
    {
      _id: 'landing-breakfast',
      categoryKey: 'breakfast',
      slug: { _type: 'slug', current: 'breakfast' },
      h1En: 'Indian Breakfast & Morning Bites in Berlin',
      h1De: 'Indisches Frühstück & Snacks in Berlin Mitte',
      seoTitleEn: 'Indian Breakfast & Brunch Berlin Mitte | Morning Bites',
      seoTitleDe: 'Indisches Frühstück & Brunch Berlin Mitte | MAATI Kitchen',
      seoDescEn: 'Start your morning in Berlin Mitte with spiced egg rolls, butter-toasted pavs, granola with cardamom yogurt, and freshly brewed artisan chai.',
      seoDescDe: 'Starte deinen Tag in Berlin Mitte mit Egg Rolls, warmen Pavs, Chai-Gewürzen und Kardamom-Joghurt. Frisch ab 09:00 Uhr in der Zimmerstraße.',
      eyebrowEn: 'MORNING ENERGY',
      eyebrowDe: 'FRÜHSTÜCK & SNACKS',
      leadDescriptionEn: 'Warm up your mornings in Berlin with vibrant street-breakfast staples, artisan roasts, and spiced bites.',
      leadDescriptionDe: 'Erlebe den perfekten Morgenstart mit warmen Street-Snacks, Chai und frischen Spezialitäten.',
    },
    {
      _id: 'landing-coffee-chai',
      categoryKey: 'coffee-chai',
      slug: { _type: 'slug', current: 'coffee-chai' },
      h1En: 'Artisan Masala Chai & Specialty Coffee Berlin',
      h1De: 'Hausgemachter Masala Chai & Kaffeespezialitäten',
      seoTitleEn: 'Masala Chai & Specialty Coffee Berlin Mitte | MAATI Kitchen',
      seoTitleDe: 'Masala Chai & Kaffeespezialitäten Berlin Mitte | MAATI',
      seoDescEn: 'Handcrafted slow-brewed spiced masala chai with whole spices and Assam tea. Plus artisan espresso drinks, golden turmeric lattes, and mango lassis.',
      seoDescDe: 'Handgekochter Masala Chai mit ganzen Gewürzen und Assam-Tee. Barista-Kaffee, Golden Milk und cremige Mango Lassis in Berlin Mitte.',
      eyebrowEn: 'HERITAGE BREWS',
      eyebrowDe: 'TRADITIONELLE GETRÄNKE',
      leadDescriptionEn: 'Crushed cardamom, cloves, fresh ginger and Assam tea simmered slowly to perfection every morning.',
      leadDescriptionDe: 'Frisch gemahlene Gewürze und edler Assam-Tee, schonend aufgekocht für unverfälschte indische Wärme.',
    },
  ];

  for (const landing of LANDING_PAGES) {
    await client.createOrReplace({
      _type: 'menuLandingPage',
      ...landing,
    });
  }

  // 4. Seed Catering Page
  console.log('🍱 Seeding catering page...');
  await client.createOrReplace({
    _id: 'cateringPage',
    _type: 'cateringPage',
    title: 'Catering Page',
    seoTitleEn: 'Indian Catering in Berlin for Offices & Events | MAATI',
    seoTitleDe: 'Indisches Catering in Berlin für Events & Büros | MAATI',
    seoDescEn: 'Fresh Indian office lunches, conference buffets, and private celebration catering in Berlin. Hot curry bowls, naan pockets, finger food. Request a quote.',
    seoDescDe: 'Frisches indisches Catering für Bürolunches, Meetings und Firmen-Events in Berlin Mitte. Warme Bowls, Naan-Pockets & Fingerfood. Jetzt unverbindlich anfragen.',
    h1En: 'Indian Catering in Berlin for Offices and Events',
    h1De: 'Indisches Catering in Berlin für Büros und Events',
    inquiryEmail: 'catering@maatikitchen.com',
    inquiryPhone: '+49 30 51891367',
  });

  // 5. Seed Events Page
  console.log('🎉 Seeding events page...');
  await client.createOrReplace({
    _id: 'eventsPage',
    _type: 'eventsPage',
    title: 'Events Page',
    seoTitleEn: 'Private Events & Celebrations at MAATI | Berlin Mitte',
    seoTitleDe: 'Private Events & Feiern bei MAATI | Berlin Mitte',
    seoDescEn: 'Host your private party, company dinner or team celebration at MAATI Kitchen in Berlin Mitte. Tailored Indian menus, cozy indoor seating & sunny terrace.',
    seoDescDe: 'Plane deine private Feier, Firmenevents oder Geburtstage bei MAATI Kitchen in Berlin Mitte. Individuelle Menüs, gemütliches Ambiente und Sonnenterrasse.',
    h1En: 'Private Events & Celebrations at MAATI, Berlin Mitte',
    h1De: 'Private Events & Feiern bei MAATI, Berlin Mitte',
    seatedCapacity: 50,
    standingCapacity: 80,
    terraceCapacity: 30,
  });

  // 6. Seed Location Page
  console.log('📍 Seeding location page...');
  await client.createOrReplace({
    _id: 'locationPage',
    _type: 'locationPage',
    title: 'Location & Contact Page',
    seoTitleEn: 'Find MAATI Kitchen in Berlin Mitte | Location & Hours',
    seoTitleDe: 'MAATI Kitchen in Berlin Mitte | Anfahrt & Öffnungszeiten',
    seoDescEn: 'Visit MAATI Kitchen at Zimmerstraße 56, 10117 Berlin Mitte near Checkpoint Charlie. Open Mon-Fri 09:00-21:00, Sat 10:00-21:00. U Kochstraße / U Stadtmitte.',
    seoDescDe: 'Besuche MAATI Kitchen in der Zimmerstraße 56, 10117 Berlin nahe Checkpoint Charlie. U-Bahn Kochstraße & Stadtmitte. Öffnungszeiten, Anfahrt & Reservierung.',
    h1En: 'Find MAATI Kitchen in Berlin Mitte',
    h1De: 'Finden Sie MAATI Kitchen in Berlin Mitte',
    streetAddress: 'Zimmerstraße 56',
    postalCodeCity: '10117 Berlin Mitte',
    neighborhoodNoteEn: 'Checkpoint Charlie / Axel Springer Kiez',
    neighborhoodNoteDe: 'Nahe Checkpoint Charlie & Axel-Springer-Quartier',
    googleMapsUrl: 'https://maps.app.goo.gl/9z39r539s9o35Zg97',
  });

  // 7. Seed Job Openings
  console.log('💼 Seeding jobs...');
  const JOBS = [
    {
      _id: 'job-service-barista',
      _type: 'jobListing',
      titleEn: 'Front of House & Barista (m/f/d)',
      titleDe: 'Servicekraft & Barista (m/w/d)',
      slug: { _type: 'slug', current: 'service-barista' },
      department: 'service',
      employmentType: 'fulltime',
      location: 'Zimmerstraße 56, 10117 Berlin Mitte',
      descEn: 'You are the welcoming face of MAATI at the counter and coffee station. You craft artisan lassis, brew fragrant masala chai, and ensure every guest feels at home.',
      descDe: 'Du bist das herzliche Gesicht für unsere Gäste an der Kasse und Kaffeebar. Du bereitest frischen Chai, Lassis und Spezialitätenkaffee zu und sorgst für einen reibungslosen Ablauf.',
      isActive: true,
      displayOrder: 1,
    },
    {
      _id: 'job-cook-chef',
      _type: 'jobListing',
      titleEn: 'Line Cook / Kitchen Assistant (m/f/d)',
      titleDe: 'Koch / Küchenhilfe (m/w/d)',
      slug: { _type: 'slug', current: 'cook-kitchen-assistant' },
      department: 'kitchen',
      employmentType: 'fulltime',
      location: 'Zimmerstraße 56, 10117 Berlin Mitte',
      descEn: 'Prepare authentic Indian curries, bake fresh naan in our tandoor setup, and assemble vibrant lunch bowls with speed and culinary pride.',
      descDe: 'Zubereitung authentischer indischer Currys, Frischebacken von Naan und Zusammenstellen warmer Bowls für den schnellen Berliner Mittagstisch.',
      isActive: true,
      displayOrder: 2,
    },
  ];

  for (const job of JOBS) {
    await client.createOrReplace(job);
  }

  // 8. Seed Categories and Items
  for (const cat of CATEGORIES) {
    console.log(`[Category] Creating category: ${cat.name} (${cat._id})...`);
    await client.createOrReplace({
      _id: cat._id,
      _type: 'menuCategory',
      name: cat.name,
      nameDe: cat.nameDe,
      slug: { _type: 'slug', current: cat._id.replace('cat-', '') },
      displayOrder: cat.displayOrder,
      active: true,
    });

    let itemOrder = 1;
    for (const item of cat.items) {
      const foodType = determineFoodType(item, cat.defaultFoodType);
      const isFeatured = FEATURED_ITEM_IDS.has(item.id);

      console.log(`  🍽️ Creating item: ${item.titleEn} (${item.id}) [${foodType}]...`);
      await client.createOrReplace({
        _id: `item-${item.id}`,
        _type: 'menuItem',
        titleEn: item.titleEn,
        titleDe: item.titleDe,
        slug: { _type: 'slug', current: item.id },
        descEn: item.descEn || '',
        descDe: item.descDe || '',
        price: item.price,
        priceEn: item.priceEn,
        priceDe: item.priceDe,
        foodType,
        featured: isFeatured,
        available: true,
        isSpicy: Boolean(item.isSpicy),
        badgeEn: item.badgeEn,
        badgeDe: item.badgeDe,
        displayOrder: itemOrder++,
        category: {
          _type: 'reference',
          _ref: cat._id,
        },
      });
    }
  }

  console.log('✅ Migration complete! Full CMS schema dataset (settings, tracking, SEO, categories, items, landing pages, catering, events, location, jobs) seeded into Sanity.');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
