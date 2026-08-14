/**
 * MAATI Kitchen — Sanity Data Seeding Script
 * Run this script to populate your Sanity dataset with all existing MAATI menu items, categories, and settings.
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
  console.log('🌱 Starting MAATI Kitchen Sanity Data Migration...');

  // 1. Seed Site Settings
  console.log('📦 Seeding siteSettings...');
  await client.createOrReplace({
    _id: 'siteSettings',
    _type: 'siteSettings',
    restaurantName: 'MAATI Kitchen',
    taglineEn: 'Indian Soul Food — Berlin Mitte',
    taglineDe: 'Indisches Soul Food — Berlin Mitte',
    phone: '+49 030 51891367',
    email: 'hello@maatikitchen.com',
    address: 'Dircksenstraße 105, 10178 Berlin',
    openingHoursEn: 'Mon – Fri: 11:30 – 15:00',
    openingHoursDe: 'Mo – Fr: 11:30 – 15:00 Uhr',
    instagram: 'https://instagram.com/maatikitchen',
    googleMapsUrl: 'https://maps.google.com/?q=MAATI+Kitchen+Berlin',
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
    heroDescEn: 'Crafted with authentic heritage recipes and mindful local ingredients.',
    heroDescDe: 'Zubereitet nach authentischen Familienrezepten und mit regionalen Zutaten.',
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

  // 3. Seed Categories and Items
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

  console.log('✅ Migration complete! All categories, items, homepage, and site settings have been seeded into Sanity.');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
