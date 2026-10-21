import { apiUrl } from './api';
import { subscribeToPublishedContent, refreshPublishedContent } from './cmsRefresh';
import { normalizeMenuCategories } from './menuImages';
import { useState, useEffect } from 'react';
import { sanityClient, isSanityConfigured, urlFor } from './sanity';
import {
  getMenuCategoriesQuery,
  getMenuItemsQuery,
  getFeaturedMenuItemsQuery,
  getMenuByCategoryQuery,
  getHomepageQuery,
  getSiteSettingsQuery,
} from '../sanity/queries';
import {
  MenuItem as LocalMenuItem,
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
} from '../data/june2026MenuData';

export type FoodType = 'vegetarian' | 'nonVegetarian' | 'vegan';

export interface SanityMenuItem {
  _id: string;
  id?: string;
  titleEn: string;
  titleDe: string;
  slug?: { current: string } | string;
  descEn?: string;
  descDe?: string;
  price: string;
  priceEn?: string;
  priceDe?: string;
  options?: { nameEn: string; nameDe?: string; price: string }[];
  foodType: FoodType;
  image?: any;
  img?: string;
  featured?: boolean;
  featuredOrder?: number;
  available?: boolean;
  popular?: boolean;
  isSpicy?: boolean;
  isVeganLeaf?: boolean;
  badgeEn?: string;
  badgeDe?: string;
  displayOrder?: number;
  category?: {
    _id: string;
    name: string;
    nameDe?: string;
    slug?: { current: string } | string;
  };
}

export interface SanityCategoryWithItems {
  _id: string;
  name: string;
  nameDe?: string;
  slug?: { current: string } | string;
  description?: string;
  descriptionDe?: string;
  displayOrder?: number;
  items: SanityMenuItem[];
}

export interface MaatiWayStep {
  id?: string;
  step: number;
  title: string;
  titleDe?: string;
  items: string[];
  itemsDe?: string[];
}

export interface HomepageContent {
  // 1. Hero
  heroBadgeEn?: string;
  heroBadgeDe?: string;
  heroTitle1En?: string;
  heroTitle1De?: string;
  heroTitle2En?: string;
  heroTitle2De?: string;
  heroDescEn?: string;
  heroDescDe?: string;
  heroBtnMenuEn?: string;
  heroBtnMenuDe?: string;
  heroBtnResEn?: string;
  heroBtnResDe?: string;
  heroPill1En?: string;
  heroPill1De?: string;
  heroPill2En?: string;
  heroPill2De?: string;
  heroPill3En?: string;
  heroPill3De?: string;
  heroImage?: string;

  // 2. House Favorites / Lunch
  lunchTitleEn?: string;
  lunchTitleDe?: string;
  lunchDescEn?: string;
  lunchDescDe?: string;

  // 3. The MAATI Way
  maatiWayBadgeEn?: string;
  maatiWayBadgeDe?: string;
  maatiWayTitleEn?: string;
  maatiWayTitleDe?: string;
  maatiWaySteps?: MaatiWayStep[];

  // 4. Experience
  experienceEyebrowEn?: string;
  experienceEyebrowDe?: string;
  experienceTitleEn?: string;
  experienceTitleDe?: string;
  experienceDescEn?: string;
  experienceDescDe?: string;
  experienceImg1?: string;
  experienceImg2?: string;

  // 5. Catering
  cateringBadgeEn?: string;
  cateringBadgeDe?: string;
  cateringTitleEn?: string;
  cateringTitleDe?: string;
  cateringDescEn?: string;
  cateringDescDe?: string;
  cateringP2En?: string;
  cateringP2De?: string;
  cateringBullet1En?: string;
  cateringBullet1De?: string;
  cateringBullet2En?: string;
  cateringBullet2De?: string;
  cateringBullet3En?: string;
  cateringBullet3De?: string;
  cateringBullet4En?: string;
  cateringBullet4De?: string;
  cateringBtnEn?: string;
  cateringBtnDe?: string;
  cateringImage?: string;

  // 6. Footer CTA
  ctaTitleEn?: string;
  ctaTitleDe?: string;
  ctaDescEn?: string;
  ctaDescDe?: string;
  ctaBtnMenuEn?: string;
  ctaBtnMenuDe?: string;
  ctaBtnLocationsEn?: string;
  ctaBtnLocationsDe?: string;
}

export interface SiteSettings {
  restaurantName?: string;
  taglineEn?: string;
  taglineDe?: string;
  logo?: any;
  phone?: string;
  email?: string;
  address?: string;
  openingHoursEn?: string;
  openingHoursDe?: string;
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  googleMapsUrl?: string;
}

// ── Helper to convert local item into SanityMenuItem format ──
function mapLocalToSanityItem(item: LocalMenuItem, defaultFoodType?: FoodType): SanityMenuItem {
  let foodType: FoodType = defaultFoodType || 'vegetarian';
  if (item.badgeDe === 'NON-VEGETARIAN' || item.badgeEn === 'NON-VEGETARIAN') {
    foodType = 'nonVegetarian';
  } else if (item.badgeDe === 'VEGAN' || item.badgeEn === 'VEGAN' || item.isVeganLeaf) {
    foodType = 'vegan';
  } else if (item.badgeDe === 'VEGETARISCH' || item.badgeEn === 'VEGETARIAN') {
    foodType = 'vegetarian';
  }

  return {
    _id: item.id,
    id: item.id,
    titleEn: item.titleEn,
    titleDe: item.titleDe,
    descEn: item.descEn,
    descDe: item.descDe,
    price: item.price,
    priceEn: item.priceEn,
    priceDe: item.priceDe,
    foodType,
    img: item.img,
    isSpicy: item.isSpicy,
    isVeganLeaf: foodType === 'vegan',
    badgeEn: item.badgeEn,
    badgeDe: item.badgeDe,
    available: true,
  };
}

// ── Fallback Category Data Generator (Used only when Sanity is completely unreachable) ──
function getLocalFallbackCategories(): SanityCategoryWithItems[] {
  return [
    {
      _id: 'cat-breakfast',
      name: 'Morning Bites',
      nameDe: 'Frühstück & Snacks',
      displayOrder: 1,
      items: BREAKFAST_ITEMS.map((item, idx) => ({
        ...mapLocalToSanityItem(item, 'vegetarian'),
        featured: idx === 0,
        featuredOrder: idx === 0 ? 5 : undefined,
      })),
    },
    {
      _id: 'cat-naan-pockets',
      name: 'Punjab Naan Pockets',
      nameDe: 'Punjab Naan Taschen',
      displayOrder: 2,
      items: [{
        ...mapLocalToSanityItem(NAAN_POCKET_ITEM, 'nonVegetarian'),
        featured: true,
        featuredOrder: 4,
      }],
    },
    {
      _id: 'cat-lunch-bowls',
      name: 'Signature Bowls',
      nameDe: 'Signatur Schalen',
      displayOrder: 3,
      items: HAUSSPEZIALITAETEN_ITEMS.map((item, idx) => ({
        ...mapLocalToSanityItem(item),
        featured: idx === 0 || idx === 1 || idx === 3,
        featuredOrder: idx === 0 ? 1 : idx === 1 ? 2 : idx === 3 ? 3 : undefined,
      })),
    },
    {
      _id: 'cat-made-to-order',
      name: 'Maati Specialties',
      nameDe: 'Maati Spezialitäten',
      displayOrder: 4,
      items: AUF_BESTELLUNG_ITEMS.map((item) => mapLocalToSanityItem(item)),
    },
    {
      _id: 'cat-desserts',
      name: 'Desserts',
      nameDe: 'Nachtisch',
      displayOrder: 5,
      items: NACHTISCH_ITEMS.map((item) => mapLocalToSanityItem(item, 'vegetarian')),
    },
    {
      _id: 'cat-cold-drinks',
      name: 'Homemade Drinks',
      nameDe: 'Hausgemachte Getränke',
      displayOrder: 6,
      items: COLD_DRINKS.map((item) => mapLocalToSanityItem(item)),
    },
    {
      _id: 'cat-hot-drinks',
      name: 'Hot Drinks',
      nameDe: 'Heisse Getränke',
      displayOrder: 7,
      items: HOT_DRINKS.map((item) => mapLocalToSanityItem(item, 'vegetarian')),
    },
    {
      _id: 'cat-bottled-drinks',
      name: 'Bottled Drinks',
      nameDe: 'Flaschen Getränke',
      displayOrder: 8,
      items: BOTTLED_DRINKS.map((item) => mapLocalToSanityItem(item, 'vegan')),
    },
    {
      _id: 'cat-alcoholic',
      name: 'Alcoholic Beverages',
      nameDe: 'Alkoholische Getränke',
      displayOrder: 9,
      items: ALKOHOLISCHE_GETRAENKE.map((item) => mapLocalToSanityItem(item, 'vegan')),
    },
    {
      _id: 'cat-cocktails',
      name: 'Cocktails',
      nameDe: 'Cocktails',
      displayOrder: 10,
      items: COCKTAILS.map((item) => mapLocalToSanityItem(item, 'vegan')),
    },
  ];
}

// ── Fallback Featured Items (Used only when Sanity is completely unreachable) ──
function getLocalFallbackFeatured(): SanityMenuItem[] {
  return [
    mapLocalToSanityItem(HAUSSPEZIALITAETEN_ITEMS[0]), // Chettinad
    mapLocalToSanityItem(HAUSSPEZIALITAETEN_ITEMS[1]), // Delhi
    mapLocalToSanityItem(HAUSSPEZIALITAETEN_ITEMS[3]), // Bihar
    mapLocalToSanityItem(NAAN_POCKET_ITEM),           // Punjab Naan
    mapLocalToSanityItem(BREAKFAST_ITEMS[0]),         // Croissant
  ];
}

// ─────────────────────────────────────────────
// React Hook: useSanityMenu (Public Menu Hook)
// ─────────────────────────────────────────────
export function useSanityMenu() {
  const [categories, setCategories] = useState<SanityCategoryWithItems[]>(getLocalFallbackCategories);
  const [loading, setLoading] = useState(true);
  const [isFromSanity, setIsFromSanity] = useState(false);
  const [revision, setRevision] = useState<string>();
  useEffect(() => {
    let isMounted = true;
    let request = 0;
    async function fetchMenu() {
      const currentRequest = ++request;
      if (!isSanityConfigured) { setLoading(false); return; }
      try {
        const doc = await sanityClient.fetch<any>(
          '*[_id == "menuCategoriesData" && !(_id in path("drafts.**"))][0]'
        );
        const data = Array.isArray(doc?.categories) ? doc.categories
          : await sanityClient.fetch<SanityCategoryWithItems[]>(getMenuByCategoryQuery);
        if (isMounted && request === currentRequest && Array.isArray(data)) {
          setCategories(normalizeMenuCategories(data));
          setRevision(doc?._rev);
          setIsFromSanity(true);
        }
      } catch (err) {
        console.warn('Sanity menu fetch failed; retaining last loaded menu:', err);
      } finally { if (isMounted && request === currentRequest) setLoading(false); }
    }
    const unsubscribePublished = subscribeToPublishedContent(fetchMenu);
    fetchMenu();
    return () => { isMounted = false; unsubscribePublished(); };
  }, []);
  return { categories, loading, isFromSanity, revision };
}

export function useFeaturedMenu() {
  const { categories, loading, isFromSanity } = useSanityMenu();
  const items = categories.flatMap(category => category.items)
    .filter(item => item.featured && item.available !== false)
    .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999));
  return { items, loading, isFromSanity };
}

// ─────────────────────────────────────────────
// React Hook: useHomepageContent (Public Homepage Hook)
// ─────────────────────────────────────────────
const DEFAULT_HOMEPAGE: HomepageContent = {
  heroBadgeEn: 'FAST CASUAL • INDIAN SOUL',
  heroBadgeDe: 'FAST CASUAL • INDIAN SOUL',
  heroTitle1En: 'Craft Your Own',
  heroTitle1De: 'Kreieren Sie Ihre eigene',
  heroTitle2En: 'Flavor Journey',
  heroTitle2De: 'Geschmacksreise',
  heroDescEn: 'Fresh, vibrant Indian ingredients in customizable Bowls, Salads, and Wraps. Authentic spices, Modern style.',
  heroDescDe: 'Frische, lebendige indische Zutaten in anpassbaren Bowls, Salaten und Wraps. Authentische Gewürze, moderner Stil.',
  heroBtnMenuEn: 'View Menu',
  heroBtnMenuDe: 'Speisekarte',
  heroBtnResEn: 'Book A Table',
  heroBtnResDe: 'Tisch reservieren',
  heroPill1En: 'FRESH INGREDIENTS',
  heroPill1De: 'FRISCHE ZUTATEN',
  heroPill2En: 'AUTHENTIC SPICES',
  heroPill2De: 'AUTHENTISCHE GEWÜRZE',
  heroPill3En: 'READY IN MINUTES',
  heroPill3De: 'SCHNELL SERVIERT',
  heroImage: '/assets/maati-cover-3.jpg',
  lunchTitleEn: 'Treat Your Tastebuds',
  lunchTitleDe: 'Verwöhnen Sie Ihren Gaumen',
  lunchDescEn: 'Discover our most-loved signature combinations, crafted for perfect balance.',
  lunchDescDe: 'Entdecken Sie unsere beliebtesten Signatur-Kombinationen für perfekte Ausgewogenheit.',
  maatiWayBadgeEn: 'CUSTOMIZED TO YOUR TASTE',
  maatiWayBadgeDe: 'INDIVIDUELL NACH IHREM GESCHMACK',
  maatiWayTitleEn: 'The MAATI Way',
  maatiWayTitleDe: 'Der MAATI Weg',
  experienceEyebrowEn: 'EXPERIENCE',
  experienceEyebrowDe: 'ERLEBNIS',
  experienceTitleEn: 'Breakfast, Lunch and Events at MAATI',
  experienceTitleDe: 'Frühstück, Mittagessen und Events bei MAATI',
  experienceDescEn: 'A warm, modern space designed for quick breakfast & lunches and cozy events alike.',
  experienceDescDe: 'Ein warmer, moderner Raum für ein schnelles Frühstück, Mittagessen und gemütliche Events.',
  experienceImg1: '/assets/show5-BiQql1jr.jpeg',
  experienceImg2: '/assets/show2-CM6MShfY.jpeg',
  cateringBadgeEn: 'MAATI CATERING',
  cateringBadgeDe: 'MAATI CATERING',
  cateringTitleEn: 'Bold Flavours That Fuel Your Team',
  cateringTitleDe: 'Kräftige Aromen, die Ihr Team begeistern',
  cateringDescEn: 'From team lunches to full corporate events — we bring freshly crafted bowls, warm naan pockets, and signature drinks directly to your office.',
  cateringDescDe: 'Von Team-Lunches bis hin zu großen Firmenfeiern — wir bringen frisch zubereitete Bowls, warme Naan-Taschen und Signature Drinks direkt in Ihr Büro.',
  cateringP2En: 'Customized for your team, effortlessly delivered. Full setup available on request.',
  cateringP2De: 'Individuell zusammengestellt, unkompliziert geliefert. Auf Wunsch mit individuellem Setup vor Ort.',
  cateringBullet1En: 'Perfect for 10 to 200+ people',
  cateringBullet1De: 'Perfekt für 10 bis 200+ Personen',
  cateringBullet2En: '100% Vegan & Veggie friendly',
  cateringBullet2De: '100% Vegan & Veggie-freundlich',
  cateringBullet3En: 'On-time Berlin delivery',
  cateringBullet3De: 'Pünktliche Berliner Lieferung',
  cateringBullet4En: 'Custom corporate invoicing',
  cateringBullet4De: 'Individuelle Firmenrechnung',
  cateringBtnEn: 'Get a Quote',
  cateringBtnDe: 'Catering Anfragen',
  cateringImage: '/assets/show3-D0blnzja.jpeg',
  ctaTitleEn: 'Visit us at Zimmerstraße 56, 10117 Berlin - where every bite tells a story.',
  ctaTitleDe: 'Besuchen Sie uns in der Zimmerstraße 56, 10117 Berlin - wo jeder Bissen eine Geschichte erzählt.',
  ctaDescEn: 'Experience modern Indian soul food in a cozy, welcoming atmosphere.',
  ctaDescDe: 'Erleben Sie modernes indisches Soul Food in gemütlicher Atmosphäre.',
  ctaBtnMenuEn: 'View Menu',
  ctaBtnMenuDe: 'Speisekarte',
  ctaBtnLocationsEn: 'Make a Reservation',
  ctaBtnLocationsDe: 'Tisch reservieren',
};

export function useHomepageContent() {
  const [content, setContent] = useState<HomepageContent>(DEFAULT_HOMEPAGE);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // Reactively update if admin saves in current session
    const handleSync = (e?: Event) => {
      if (!isMounted) return;
      if (e instanceof CustomEvent && e.detail?.homepage) {
        setContent(e.detail.homepage);
      }
    };
    window.addEventListener('maati_homepage_updated', handleSync);

    async function fetchHomepage() {
      if (!isSanityConfigured) {
        setLoading(false);
        return;
      }

      try {
        const data = await sanityClient.fetch<any>(
          `*[_type == "homepage" && !(_id in path("drafts.**"))][0]`
        );
        if (isMounted && data && typeof data === 'object') {
          const normalized: HomepageContent = {
            ...data,
            heroBadgeEn: data.heroBadgeEn || data.heroEyebrowEn,
            heroBadgeDe: data.heroBadgeDe || data.heroEyebrowDe,
            heroTitle1En: data.heroTitle1En || data.heroTitleEn,
            heroTitle1De: data.heroTitle1De || data.heroTitleDe,
            heroTitle2En: data.heroTitle2En || data.heroSubtitleEn,
            heroTitle2De: data.heroTitle2De || data.heroSubtitleDe,
            heroDescEn: data.heroDescEn,
            heroDescDe: data.heroDescDe,
            lunchTitleEn: data.lunchTitleEn || data.featuredTitleEn,
            lunchTitleDe: data.lunchTitleDe || data.featuredTitleDe,
            lunchDescEn: data.lunchDescEn || data.featuredDescEn,
            lunchDescDe: data.lunchDescDe || data.featuredDescDe,
            heroImage: data.heroImage ? (typeof data.heroImage === 'string' ? data.heroImage : (urlFor(data.heroImage) as any)?.url?.() || data.heroImage) : data.heroImage,
            experienceImg1: data.experienceImg1 ? (typeof data.experienceImg1 === 'string' ? data.experienceImg1 : (urlFor(data.experienceImg1) as any)?.url?.() || data.experienceImg1) : data.experienceImg1,
            experienceImg2: data.experienceImg2 ? (typeof data.experienceImg2 === 'string' ? data.experienceImg2 : (urlFor(data.experienceImg2) as any)?.url?.() || data.experienceImg2) : data.experienceImg2,
            cateringImage: data.cateringImage ? (typeof data.cateringImage === 'string' ? data.cateringImage : (urlFor(data.cateringImage) as any)?.url?.() || data.cateringImage) : data.cateringImage,
          };
          setContent((prev) => ({ ...prev, ...normalized }));
        }
      } catch (err) {
        console.warn('Sanity homepage fetch error, using fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const unsubscribePublished = subscribeToPublishedContent(fetchHomepage);
    fetchHomepage();
    return () => {
      isMounted = false;
      unsubscribePublished();
      window.removeEventListener('maati_homepage_updated', handleSync);
    };
  }, []);

  return { content, loading };
}

// ─────────────────────────────────────────────
// React Hook: useSiteSettings (Public Site Settings Hook)
// ─────────────────────────────────────────────
const DEFAULT_SETTINGS: SiteSettings = {
  restaurantName: 'MAATI Kitchen',
  taglineEn: 'Indian Soul Food — Berlin Mitte',
  taglineDe: 'Indisches Soul Food — Berlin Mitte',
  phone: '+49 30 51891367',
  email: 'hello@maatikitchen.com',
  openingHoursEn: 'Mon – Wed: 11:00 – 16:00\nThu – Sat: 11:00 – 21:00\nSun: 11:30 – 18:00',
  openingHoursDe: 'Mo – Mi: 11:00 – 16:00\nDo – Sa: 11:00 – 21:00\nSo: 11:30 – 18:00',
  instagram: 'https://instagram.com/maatikitchen',
  facebook: 'https://facebook.com',
  tiktok: 'https://tiktok.com/@maatikitchen',
  googleMapsUrl: 'https://maps.google.com/?q=MAATI+Kitchen+Zimmerstrasse+56+Berlin',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const handleSync = (e?: Event) => {
      if (!isMounted) return;
      if (e instanceof CustomEvent && e.detail?.settings) {
        setSettings(e.detail.settings);
      }
    };
    window.addEventListener('maati_settings_updated', handleSync);

    async function fetchSettings() {
      if (!isSanityConfigured) {
        setLoading(false);
        return;
      }

      try {
        const data = await sanityClient.fetch<SiteSettings>(
          `*[_type == "siteSettings" && !(_id in path("drafts.**"))][0]`
        );
        if (isMounted && data && typeof data === 'object') {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Sanity site settings fetch error, using fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    const unsubscribePublished = subscribeToPublishedContent(fetchSettings);
    fetchSettings();
    return () => {
      isMounted = false;
      unsubscribePublished();
      window.removeEventListener('maati_settings_updated', handleSync);
    };
  }, []);

  return { settings, loading };
}

// ─────────────────────────────────────────────
// EventsContent Interface + Hook
// ─────────────────────────────────────────────
export interface EventsContent {
  headlineEn?: string;
  headlineDe?: string;
  descEn?: string;
  descDe?: string;
  bullet1En?: string;
  bullet1De?: string;
  bullet2En?: string;
  bullet2De?: string;
  bullet3En?: string;
  bullet3De?: string;
  ctaBtnEn?: string;
  ctaBtnDe?: string;
  eventImage?: string;
}

const DEFAULT_EVENTS: EventsContent = {
  headlineEn: 'Host Your Own Event',
  headlineDe: 'Veranstalten Sie Ihr Event bei uns',
  descEn: 'Looking for a unique venue? MAATI offers private dining and catering services for birthdays, corporate gatherings, and celebrations. Let us bring the spice to your special day.',
  descDe: 'Suchen Sie nach einer einzigartigen Location? MAATI bietet Private Dining und Catering-Services für Geburtstage, Firmenfeiern und besondere Anlässe. Wir bringen die Gewürze zu Ihrem besonderen Tag.',
  bullet1En: 'Customizable Menus',
  bullet1De: 'Individuelle Menüs',
  bullet2En: 'Private or Semi-Private Spaces',
  bullet2De: 'Private & Halbprivate Bereiche',
  bullet3En: 'Full Catering Service Available',
  bullet3De: 'Kompletter Catering-Service',
  ctaBtnEn: 'Inquire for Private Events',
  ctaBtnDe: 'Event Anfragen',
  eventImage: '/assets/show2-CM6MShfY.jpeg',
};

export function useEventsContent() {
  const [content, setContent] = useState<EventsContent>(DEFAULT_EVENTS);

  useEffect(() => {
    let isMounted = true;

    const handleSync = (e?: Event) => {
      if (!isMounted) return;
      if (e instanceof CustomEvent && e.detail?.events) {
        setContent(e.detail.events);
      }
    };
    window.addEventListener('maati_events_updated', handleSync);

    async function fetchFromSanity() {
      if (!isSanityConfigured) return;
      try {
        const data = await sanityClient.fetch<EventsContent>(
          `*[_type == "eventsContent" && !(_id in path("drafts.**"))][0]`
        );
        if (isMounted && data && typeof data === 'object') {
          setContent((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Sanity events fetch error:', err);
      }
    }
    const unsubscribePublished = subscribeToPublishedContent(fetchFromSanity);
    fetchFromSanity();

    return () => {
      isMounted = false;
      unsubscribePublished();
      window.removeEventListener('maati_events_updated', handleSync);
    };
  }, []);

  return { content };
}

// ─────────────────────────────────────────────
// ContactContent Interface + Hook
// ─────────────────────────────────────────────
export interface ContactContent {
  headlineEn?: string;
  headlineDe?: string;
  descEn?: string;
  descDe?: string;
  phone?: string;
  email?: string;
  address?: string;
  openingHoursEn?: string;
  openingHoursDe?: string;
  theforkWidgetId?: string;
  googleMapsUrl?: string;
  locationHeadlineEn?: string;
  locationHeadlineDe?: string;
}

const DEFAULT_CONTACT: ContactContent = {
  headlineEn: 'Get in Touch',
  headlineDe: 'Kontaktieren Sie uns',
  descEn: 'Have a question? Want to make a reservation? We\'d love to hear from you.',
  descDe: 'Haben Sie eine Frage? Möchten Sie reservieren? Wir freuen uns von Ihnen zu hören.',
  phone: '+49 30 51891367',
  email: 'hello@maatikitchen.com',
  address: 'Zimmerstraße 56, 10117 Berlin',
  openingHoursEn: 'Mon – Wed: 11:00 – 16:00\nThu – Sat: 11:00 – 21:00\nSun: 11:30 – 18:00',
  openingHoursDe: 'Mo – Mi: 11:00 – 16:00\nDo – Sa: 11:00 – 21:00\nSo: 11:30 – 18:00',
  theforkWidgetId: '7beffe40-786f-496c-b196-48b939750c77',
  googleMapsUrl: 'https://maps.google.com/?q=MAATI+Kitchen+Zimmerstrasse+56+Berlin',
  locationHeadlineEn: 'MAATI Berlin',
  locationHeadlineDe: 'MAATI Berlin',
};

export function useContactContent() {
  const [content, setContent] = useState<ContactContent>(DEFAULT_CONTACT);

  useEffect(() => {
    let isMounted = true;

    async function fetchFromSanity() {
      if (!isSanityConfigured) return;
      try {
        const data = await sanityClient.fetch<ContactContent>(
          `*[_type == "contactContent" && !(_id in path("drafts.**"))][0]`
        );
        if (isMounted && data && typeof data === 'object') {
          setContent((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Sanity contact fetch error:', err);
      }
    }
    const unsubscribePublished = subscribeToPublishedContent(fetchFromSanity);
    fetchFromSanity();

    return () => {
      isMounted = false;
      unsubscribePublished();
    };
  }, []);

  return { content };
}

// ─────────────────────────────────────────────
// PrintMenuContent Interface + Hook
// ─────────────────────────────────────────────
export interface PrintMenuContent {
  badgeEn?: string;
  badgeDe?: string;
  titleEn?: string;
  titleDe?: string;
  descEn?: string;
  descDe?: string;
  page1TitleEn?: string;
  page1TitleDe?: string;
  page1DescEn?: string;
  page1DescDe?: string;
  page1Image?: string;
  page2TitleEn?: string;
  page2TitleDe?: string;
  page2DescEn?: string;
  page2DescDe?: string;
  page2Image?: string;
}

const DEFAULT_PRINT_MENU: PrintMenuContent = {
  badgeEn: 'OFFICIAL PRINT MENU',
  badgeDe: 'OFFIZIELLE SPEISEKARTE',
  titleEn: 'View Full Visual Menu',
  titleDe: 'Vollständige Speisekarte ansehen',
  descEn: 'Click on any page below to inspect or open the high-resolution restaurant menu cards directly in a new tab.',
  descDe: 'Klicken Sie auf eine der Seiten, um sie zu vergrößern, oder öffnen Sie die hochauflösenden Menükarten direkt in einem neuen Tab.',
  page1TitleEn: 'Page 1: Signature Bowls & Naan',
  page1TitleDe: 'Seite 1: Bowls, Naan & Favoriten',
  page1DescEn: 'All signature bowls, warm naan pockets, protein choices, dressings, and toppings.',
  page1DescDe: 'Alle Bowls, Naan-Taschen, Toppings, Proteine und hausgemachten Saucen im Überblick.',
  page1Image: '/assets/Menue1.png',
  page2TitleEn: 'Page 2: Lassis, Coffee & Craft Drinks',
  page2TitleDe: 'Seite 2: Lassis, Kaffee & Drinks',
  page2DescEn: 'Specialty Indian coffee, masala chai, fresh fruit lassis, cold drinks, and desserts.',
  page2DescDe: 'Kaffeespezialitäten, Chai, hausgemachte Lassis, Bio-Limonaden und Desserts.',
  page2Image: '/assets/Menue2.png',
};

export function usePrintMenuContent() {
  const [content, setContent] = useState<PrintMenuContent>(DEFAULT_PRINT_MENU);

  useEffect(() => {
    let isMounted = true;

    async function fetchFromSanity() {
      if (!isSanityConfigured) return;
      try {
        const data = await sanityClient.fetch<PrintMenuContent>(
          `*[_type == "printMenuContent" && !(_id in path("drafts.**"))][0]`
        );
        if (isMounted && data && typeof data === 'object') {
          setContent((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Sanity print menu fetch error:', err);
      }
    }
    const unsubscribePublished = subscribeToPublishedContent(fetchFromSanity);
    fetchFromSanity();

    return () => {
      isMounted = false;
      unsubscribePublished();
    };
  }, []);

  return { content };
}

// ─────────────────────────────────────────────
// CateringContent Interface + Hook
// ─────────────────────────────────────────────
export interface CateringPackageItem {
  id: string;
  name: string;
  nameDe?: string;
  price: string;
  priceDetailEn: string;
  priceDetailDe: string;
  pricePerPerson: number;
  popular?: boolean;
  minGuests: number;
  suitableForEn: string;
  suitableForDe: string;
  featuresEn: string[];
  featuresDe: string[];
}

export interface CateringFaqItem {
  qEn: string;
  qDe: string;
  aEn: string;
  aDe: string;
}

export interface CateringContent {
  badgeEn?: string;
  badgeDe?: string;
  heroTitleEn?: string;
  heroTitleDe?: string;
  heroDescEn?: string;
  heroDescDe?: string;
  packages?: CateringPackageItem[];
  faqs?: CateringFaqItem[];
  leadTimeEn?: string;
  leadTimeDe?: string;
}

export const DEFAULT_CATERING: CateringContent = {
  badgeEn: 'MAATI CATERING BERLIN MITTE',
  badgeDe: 'MAATI CATERING BERLIN MITTE',
  heroTitleEn: 'Corporate Catering That Brings Teams Together',
  heroTitleDe: 'Business Catering für Teams & Events',
  heroDescEn: 'Vibrant Indian bowls, toasted naan pockets, and sharing platters crafted for Berlin’s top offices. Delivered warm, on time, and effortlessly customized to every diet.',
  heroDescDe: 'Gesunde Bowls, getoastete Naan-Pockets und Sharing-Platten direkt aus unserer Küche in der Zimmerstraße zu Ihnen ins Büro geliefert. Frisch, unkompliziert und auf den Punkt.',
  leadTimeEn: '24 to 48 hours recommended. Call +49 30 51891367 for urgent requests.',
  leadTimeDe: 'Empfohlen: 24 bis 48 Std. Vorlauf. Für dringende Anfragen: +49 30 51891367.',
  packages: [
    {
      id: 'essentials',
      name: 'The Team Lunch',
      nameDe: 'The Team Lunch',
      price: '€11.90',
      priceDetailEn: 'per person',
      priceDetailDe: 'pro Person',
      pricePerPerson: 11.90,
      minGuests: 10,
      suitableForEn: 'Team lunches and productive work sessions',
      suitableForDe: 'Produktive Team-Lunches und Arbeitssitzungen',
      featuresEn: [
        'Choice of warm signature bowls (curry or salad base)',
        'Vegan, vegetarian, and tender chicken choices',
        'Fresh artisanal chutneys & toasted seed toppings',
        '100% compostable sugarcane bowls, cutlery & napkins'
      ],
      featuresDe: [
        'Auswahl aus warmen Signature Bowls (Curry oder Salatbasis)',
        'Vegane, vegetarische und Hähnchen-Optionen',
        'Frische hausgemachte Chutneys & geröstete Saaten',
        '100% biologisch abbaubares Zuckerrohr-Besteck & Servietten'
      ]
    },
    {
      id: 'workshop',
      popular: true,
      name: 'The Meeting & Workshop',
      nameDe: 'The Meeting & Workshop',
      price: '€14.90',
      priceDetailEn: 'per person',
      priceDetailDe: 'pro Person',
      pricePerPerson: 14.90,
      minGuests: 15,
      suitableForEn: 'Client presentations, all-hands, and workshops',
      suitableForDe: 'Kundenpräsentationen, All-Hands und Workshops',
      featuresEn: [
        'Mix of warm bowls and cut-in-half naan pocket platters',
        'Broad variety of spiced proteins & crunchy finishers',
        'Includes 1x homemade mango lassi or craft lemonade per guest',
        'Elegant printed menu cards with all dietary & allergen tags'
      ],
      featuresDe: [
        'Mix aus warmen Bowls und getoasteten Naan-Pocket Fingerfood-Platten',
        'Große Vielfalt an Proteinen & knackigen Finishers',
        'Inklusive 1x hausgemachter Mango Lassi oder frischer Limonade p.P.',
        'Stilvolle Beschriftungskarten mit allen Allergenen & Zutaten'
      ]
    },
    {
      id: 'crowd-pleaser',
      name: 'The Crowd-Pleaser',
      nameDe: 'The Crowd-Pleaser',
      price: '€18.50',
      priceDetailEn: 'per person',
      priceDetailDe: 'pro Person',
      pricePerPerson: 18.50,
      minGuests: 20,
      suitableForEn: 'Team milestones, celebrations, and socials',
      suitableForDe: 'Team-Meilensteine, Feiern und Sommerfeste',
      featuresEn: [
        'Comprehensive spread of bowls, naan pockets, and fingerfood',
        'Crispy mini samosas, sev crunch, and spiced cashews',
        'Sweet cardamom dessert jars in glass for every guest',
        'Chai & craft drink bar complete with glassware and setup'
      ],
      featuresDe: [
        'Umfangreiche Auswahl an Bowls, Naan Pockets und Fingerfood-Platten',
        'Mini Samosa Bites, knuspriges Sev und marinierte Cashews',
        'Süße Kardamom-Jars im Weckglas als Dessert',
        'Chai & Cold Drinks Station inklusive Gläsern & Aufbau'
      ]
    },
    {
      id: 'chafing-buffet',
      name: 'Full Chafing Buffet',
      nameDe: 'Full Chafing Buffet',
      price: '€24.50',
      priceDetailEn: 'per person',
      priceDetailDe: 'pro Person',
      pricePerPerson: 24.50,
      minGuests: 30,
      suitableForEn: 'Corporate galas, large celebrations, and evening events',
      suitableForDe: 'Firmen-Galas, große Events und Abendveranstaltungen',
      featuresEn: [
        'Stainless steel chafing dish hot buffet line on-site',
        '3 hot entrees (e.g. Butter Chicken, Paneer Tikka, slow Dal)',
        'Fragrant saffron basmati, warm garlic naan, and raita bar',
        'Full on-site delivery, setup, and clearing by hospitality staff'
      ],
      featuresDe: [
        'Warmhalte-Buffet mit Edelstahl-Chafing-Dishes',
        '3 Hauptgerichte (z.B. Butter Chicken, Paneer Tikka, Kichererbsen-Curry)',
        'Duftender Safran-Basmatireis, frisches Knoblauch-Naan und Raita-Bar',
        'Auf- und Abbau vor Ort durch unser geschultes Servicepersonal'
      ]
    }
  ],
  faqs: [
    {
      qEn: 'How far in advance do I need to book catering?',
      qDe: 'Wie viele Tage im Voraus muss ich das Catering bestellen?',
      aEn: 'For standard team lunch bowls and naan pocket platters up to 40 guests, 24 to 48 hours notice is recommended. For large buffets over 50 guests, 3 to 5 days is ideal.',
      aDe: 'Für Standard-Team-Lunches und Naan-Pocket-Platten bis zu 40 Personen empfehlen wir 24 bis 48 Stunden Vorlauf. Für große Buffets ab 50 Personen sind 3 bis 5 Tage ideal.'
    },
    {
      qEn: 'Can corporate clients pay via invoice?',
      qDe: 'Können wir auf Firmenrechnung mit Zahlungsziel zahlen?',
      aEn: 'Yes! Registered companies, agencies, and institutions can pay comfortably via standard invoice with 14-day payment terms including clear VAT breakdown.',
      aDe: 'Ja! Für registrierte Unternehmen, Agenturen und Institutionen bieten wir bequeme Zahlung auf Rechnung mit 14 Tagen Zahlungsziel inklusive ausgewiesener Mehrwertsteuer.'
    }
  ]
};

export function useCateringContent() {
  const [content, setContent] = useState<CateringContent>(DEFAULT_CATERING);

  useEffect(() => {
    let isMounted = true;
    const handleSync = (e?: Event) => {
      if (!isMounted) return;
      if (e instanceof CustomEvent && e.detail?.catering) {
        setContent(e.detail.catering);
      }
    };
    window.addEventListener('maati_catering_updated', handleSync);

    async function fetchFromSanity() {
      if (!isSanityConfigured) return;
      try {
        const data = await sanityClient.fetch<CateringContent>(
          `*[_type == "cateringPageContent" && !(_id in path("drafts.**"))][0]`
        );
        if (isMounted && data && typeof data === 'object') {
          setContent((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Sanity catering fetch error:', err);
      }
    }
    const unsubscribePublished = subscribeToPublishedContent(fetchFromSanity);
    fetchFromSanity();

    return () => {
      isMounted = false;
      unsubscribePublished();
      window.removeEventListener('maati_catering_updated', handleSync);
    };
  }, []);

  return { content };
}

// ─────────────────────────────────────────────
// JobsContent Interface + Hook
// ─────────────────────────────────────────────
export interface JobOpeningItem {
  id: string;
  titleEn: string;
  titleDe: string;
  department: 'management' | 'service' | 'kitchen' | 'general';
  deptLabelEn: string;
  deptLabelDe: string;
  typeEn: string;
  typeDe: string;
  location: string;
  summaryEn: string;
  summaryDe: string;
  responsibilitiesEn: string[];
  responsibilitiesDe: string[];
  offerEn: string;
  offerDe: string;
  active: boolean;
}

export interface JobsContent {
  badgeEn?: string;
  badgeDe?: string;
  heroTitleEn?: string;
  heroTitleDe?: string;
  heroDescEn?: string;
  heroDescDe?: string;
  cultureTitleEn?: string;
  cultureTitleDe?: string;
  jobs?: JobOpeningItem[];
}

export const DEFAULT_JOBS: JobsContent = {
  badgeEn: 'CAREERS AT MAATI',
  badgeDe: 'KARRIERE BEI MAATI',
  heroTitleEn: 'Put Down Roots With Us. Shape Berlin Dining.',
  heroTitleDe: 'Wachse mit uns. Put down roots with MAATI.',
  heroDescEn: 'We are looking for dedicated individuals who care about honest Indian soul food, authentic hospitality, and a team culture grounded in equality and growth.',
  heroDescDe: 'Wir suchen Menschen mit Herzblut für ehrliches indisches Soul Food, echte Gastfreundschaft und ein Arbeitsumfeld, in dem Respekt und Wertschätzung gelebt werden.',
  cultureTitleEn: 'More Than Just A Restaurant Job',
  cultureTitleDe: 'Mehr als nur ein Job in der Gastronomie',
  jobs: [
    {
      id: 'general-manager',
      department: 'management',
      deptLabelEn: 'Management & Leadership',
      deptLabelDe: 'Management & Leitung',
      titleEn: 'Restaurant General Manager (f/m/d)',
      titleDe: 'Restaurant General Manager (w/m/d)',
      typeEn: 'Full-Time',
      typeDe: 'Vollzeit',
      location: 'Berlin Mitte (Zimmerstraße 56)',
      summaryEn: 'Lead our front-of-house and kitchen teams, champion operational excellence, and shape guest hospitality.',
      summaryDe: 'Du führst unser Team mit Leidenschaft, optimierst Service-Abläufe und steuerst das operative Tagesgeschäft.',
      responsibilitiesEn: [
        'Overall operational management of restaurant shifts and scheduling',
        'Leading, mentoring, and inspiring our 15+ hospitality team members',
        'Upholding strict hygiene, inventory, and food quality standards'
      ],
      responsibilitiesDe: [
        'Operative Gesamtleitung des Restaurantbetriebs & Schichtplanung',
        'Führung, Motivation und Weiterentwicklung unseres 15-köpfigen Teams',
        'Einhaltung von HACCP-Standards, Qualitätskontrolle und Inventur'
      ],
      offerEn: 'Competitive salary + performance bonus, BVG monthly ticket, 30 vacation days, free staff meals',
      offerDe: 'Attraktives Gehalt + Bonus, BVG-Ticket, 30 Tage Urlaub, kostenlose Verpflegung',
      active: true
    },
    {
      id: 'catering-manager',
      department: 'management',
      deptLabelEn: 'Management & Sales',
      deptLabelDe: 'Management & Vertrieb',
      titleEn: 'Account Manager - Corporate Catering (f/m/d)',
      titleDe: 'Account Manager - B2B Catering (w/m/d)',
      typeEn: 'Full-Time / Part-Time',
      typeDe: 'Vollzeit / Teilzeit',
      location: 'Berlin Mitte / Hybrid',
      summaryEn: 'Manage corporate catering accounts across Berlin, coordinate custom lunch programs, and expand relationships.',
      summaryDe: 'Du betreust Firmenkunden in Berlin, erstellst maßgeschneiderte Catering-Angebote und baust Partnerschaften auf.',
      responsibilitiesEn: [
        'Handling incoming corporate catering and private event inquiries',
        'Creating tailored menus, pricing estimates, and invoices',
        'Coordinating kitchen preparation and timely delivery schedules'
      ],
      responsibilitiesDe: [
        'Betreuung eingehender Catering- und Eventanfragen per Mail und Telefon',
        'Erstellung von individuellen Menü- und Budgetvorschlägen',
        'Koordination mit der Küche bezüglich Lieferzeiten und Aufbauten'
      ],
      offerEn: 'Base salary + commission, flexible hybrid hours, free dining perks',
      offerDe: 'Attraktives Fixgehalt + Erfolgsbeteiligung, flexible Arbeitszeiten, Homeoffice-Tage',
      active: true
    },
    {
      id: 'service-barista',
      department: 'service',
      deptLabelEn: 'Service & Barista',
      deptLabelDe: 'Service & Barista',
      titleEn: 'Front of House Host & Barista (f/m/d)',
      titleDe: 'Service Team Member & Barista (w/m/d)',
      typeEn: 'Full-Time / Part-Time / Student',
      typeDe: 'Vollzeit / Teilzeit / Minijob',
      location: 'Berlin Mitte (Zimmerstraße 56)',
      summaryEn: 'Be the welcoming face of MAATI at the counter and coffee bar. Craft spiced chai, signature lassis, and specialty coffee.',
      summaryDe: 'Du bist das herzliche Gesicht für unsere Gäste an der Kasse und Kaffeebar. Du bereitest frischen Chai, Lassis und Kaffee zu.',
      responsibilitiesEn: [
        'Warm guest greeting, POS order handling, and menu guidance',
        'Crafting hot and cold drinks (fragrant chai, fruit lassis, specialty coffee)',
        'Maintaining clean, welcoming counter and dining room ambiance'
      ],
      responsibilitiesDe: [
        'Herzliche Gästebetreuung, Kassenbedienung und Beratung zu Speisen',
        'Zubereitung von Heiß- und Kaltgetränken (Chai, Lassis, Kaffeespezialitäten)',
        'Sicherstellung von Sauberkeit und ansprechender Präsentation im Gastraum'
      ],
      offerEn: 'Above-scale hourly wage + tips, predictable schedules, complimentary shifts meals',
      offerDe: 'Faire übertarifliche Bezahlung + Trinkgeld, verlässliche Dienstpläne, kostenlose Mahlzeiten',
      active: true
    },
    {
      id: 'cook-line',
      department: 'kitchen',
      deptLabelEn: 'Kitchen & Line Cook',
      deptLabelDe: 'Küche & Zubereitung',
      titleEn: 'Kitchen Team Member / Line Cook (f/m/d)',
      titleDe: 'Kitchen Team Member / Koch (w/m/d)',
      typeEn: 'Full-Time / Part-Time',
      typeDe: 'Vollzeit / Teilzeit',
      location: 'Berlin Mitte (Zimmerstraße 56)',
      summaryEn: 'Prepare our slow-simmered curries, bake fresh naan pockets, and assemble vibrant bowls with precision and care.',
      summaryDe: 'Du bereitest unsere Currys nach traditionellen Familienrezepten zu, backst frisches Naan und richtest warme Bowls an.',
      responsibilitiesEn: [
        'Cooking traditional chicken, paneer, and vegan curry bases',
        'Baking warm naan pockets and grilling skewers',
        'Prep of fresh vegetables, market chutneys, and crunchy finishers'
      ],
      responsibilitiesDe: [
        'Zubereitung von Fleisch-, vegetarischen und veganen Currys',
        'Backen von Naan-Taschen und Tandoori-Spezialitäten',
        'Vorbereitung (Mise en Place) frischer Salate, Chutneys und Toppings'
      ],
      offerEn: 'Fair wages, modern kitchen equipment, no late night shifts, shift meals',
      offerDe: 'Faires Gehalt, moderne Küchenausstattung, keine späten Nachtschichten, kostenlose Verpflegung',
      active: true
    },
    {
      id: 'prep-cook',
      department: 'kitchen',
      deptLabelEn: 'Kitchen & Prep',
      deptLabelDe: 'Küche & Prep',
      titleEn: 'Prep Cook / Kitchen Assistant (f/m/d)',
      titleDe: 'Vorbereitungskoch / Prep Cook (w/m/d)',
      typeEn: 'Part-Time / Student / Minijob',
      typeDe: 'Teilzeit / Minijob / Werkstudent',
      location: 'Berlin Mitte (Zimmerstraße 56)',
      summaryEn: 'Support our morning kitchen prep with vegetable chopping, artisanal chutney blending, sauce simmering, and marinade preparation.',
      summaryDe: 'Du unterstützt unser Küchenteam am Vormittag bei der frischen Vorbereitung von Gemüse, Chutneys, Saucen und Kichererbsen.',
      responsibilitiesEn: [
        'Washing, cutting, and prepping fresh market ingredients',
        'Blending homemade mint, tamarind, and chili chutneys',
        'Stock organization and kitchen station setup',
        'Support with hygiene maintenance and clean workstation handover'
      ],
      responsibilitiesDe: [
        'Waschen, Schneiden und Portionieren frischer Marktgemüse',
        'Herstellung unserer hausgemachten Chutneys und Saucen',
        'Unterstützung bei der Warenannahme und Lagerung',
        'Reinigungs- und Vorbereitungsarbeiten vor Schichtbeginn'
      ],
      offerEn: 'Flexible morning shifts (great for students), supportive team, free meals',
      offerDe: 'Flexible Schichten am Vormittag (ideal für Studenten), familiäres Team, Personalessen',
      active: true
    },
    {
      id: 'spontaneous',
      department: 'general',
      deptLabelEn: 'General / All Departments',
      deptLabelDe: 'Initiativbewerbung',
      titleEn: 'Open / Spontaneous Application (f/m/d)',
      titleDe: 'Initiativbewerbung (w/m/d)',
      typeEn: 'All Work Models',
      typeDe: 'Alle Zeitmodelle',
      location: 'Berlin Mitte (Zimmerstraße 56)',
      summaryEn: 'Passionate about Indian soul food and genuine hospitality, but don’t see your exact role listed? We are always thrilled to hear from energetic people.',
      summaryDe: 'Du brennst für gutes Essen und Gastfreundschaft, hast aber keine passende Stelle gefunden? Wir freuen uns immer über motivierte Talente!',
      responsibilitiesEn: [
        'Tell us about your background, skills, and where you want to grow',
        'Whether full-time or flexible shifts, we love meeting proactive applicants'
      ],
      responsibilitiesDe: [
        'Sag uns einfach, was du kannst und wo du dich siehst',
        'Ob Vollzeit, Teilzeit oder als Werkstudent – wir finden den richtigen Platz für dich'
      ],
      offerEn: 'Tailored conditions, fair compensation, and prompt personal feedback',
      offerDe: 'Individuelle Absprache, faires Gehalt und sofortige Rückmeldung',
      active: true
    }
  ]
};

export function useJobsContent() {
  const [content, setContent] = useState<JobsContent>(DEFAULT_JOBS);

  useEffect(() => {
    let isMounted = true;
    const handleSync = (e?: Event) => {
      if (!isMounted) return;
      if (e instanceof CustomEvent && e.detail?.jobs) {
        setContent(e.detail.jobs);
      }
    };
    window.addEventListener('maati_jobs_updated', handleSync);

    async function fetchFromSanity() {
      if (!isSanityConfigured) return;
      try {
        const data = await sanityClient.fetch<JobsContent>(
          `*[_type == "jobsPageContent" && !(_id in path("drafts.**"))][0]`
        );
        if (isMounted && data && typeof data === 'object') {
          setContent((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Sanity jobs fetch error:', err);
      }
    }
    const unsubscribePublished = subscribeToPublishedContent(fetchFromSanity);
    fetchFromSanity();

    return () => {
      isMounted = false;
      unsubscribePublished();
      window.removeEventListener('maati_jobs_updated', handleSync);
    };
  }, []);

  return { content };
}

// ─────────────────────────────────────────────
// AboutContent Interface + Hook
// ─────────────────────────────────────────────
export interface AboutValueItem {
  titleEn: string;
  titleDe: string;
  descEn: string;
  descDe: string;
}

export interface AboutContent {
  heroTitleEn?: string;
  heroTitleDe?: string;
  heroSubtitleEn?: string;
  heroSubtitleDe?: string;
  storyTitleEn?: string;
  storyTitleDe?: string;
  storyP1En?: string;
  storyP1De?: string;
  storyP2En?: string;
  storyP2De?: string;
  maatiMeaningTitleEn?: string;
  maatiMeaningTitleDe?: string;
  maatiMeaningP1En?: string;
  maatiMeaningP1De?: string;
  maatiMeaningP2En?: string;
  maatiMeaningP2De?: string;
  values?: AboutValueItem[];
  aboutImg1?: string;
  aboutImg2?: string;
}

export const DEFAULT_ABOUT: AboutContent = {
  heroTitleEn: 'The Story Behind MAATI',
  heroTitleDe: 'Die Geschichte hinter MAATI',
  heroSubtitleEn: 'A modern Indian quick-service restaurant offering customizable, wholesome meals — rooted in tradition, crafted for everyday life in Berlin.',
  heroSubtitleDe: 'Ein modernes indisches Restaurant mit individuell zusammengestellten, bekömmlichen Gerichten — in Tradition verwurzelt, für den Berliner Alltag geschaffen.',
  storyTitleEn: 'Rooted in Indian Heritage, Made for Berlin',
  storyTitleDe: 'Verwurzelt in indischer Tradition, gemacht für Berlin',
  storyP1En: 'Maati is a modern Indian quick-service culinary haven. Rooted in authentic generational recipes and thoughtfully balanced spices, our food nourishes the body with age-old wisdom while staying bold, vibrant, and light.',
  storyP1De: 'Maati ist ein modernes indisches Soul-Food-Restaurant. Aufbauend auf traditionellen Familienrezepten und sorgfältig abgestimmten Gewürzen nährt unser Essen den Körper mit alter Weisheit, bleibt dabei aber frisch, bekömmlich und lecker.',
  storyP2En: 'Whether you stop by for a quick lunch bowl, crispy toasted naan pockets, or an afternoon spiced chai, we invite you to experience real Indian dining reimagined for modern Berlin living.',
  storyP2De: 'Ob für eine warme Mittagspause, knusprig getoastete Naan-Pockets oder einen duftenden Masala Chai am Nachmittag: Wir laden Sie ein, eine neue Interpretation indischer Gastfreundschaft zu erleben.',
  maatiMeaningTitleEn: '“मिट्टी — Maati: The Word That Connects India”',
  maatiMeaningTitleDe: '“मिट्टी — Maati: Das Wort, das Indien verbindet”',
  maatiMeaningP1En: 'Maati (मिट्टी) is the Hindi and Urdu word for earth, clay, and soil. To us, Maati is a living philosophy — the grounding foundation of everything we harvest, prepare, and share.',
  maatiMeaningP1De: 'Maati (मिट्टी) ist das Hindi- und Urdu-Wort für Erde, Ton und Boden. Für uns ist Maati eine lebendige Philosophie — der nährende Ursprung von allem, was wir ernten, kochen und teilen.',
  maatiMeaningP2En: "It is the soil beneath our feet, the handcrafted terracotta of our serving vessels, and the fragrant earth where turmeric, cumin, and cardamoms flourish.",
  maatiMeaningP2De: 'Es ist der Boden unter unseren Füßen, die handgefertigte Terracotta unserer Schalen und die fruchtbare Erde, auf der Kurkuma, Kreuzkümmel und Kardamom gedeihen.',
  aboutImg1: '/assets/show5-BiQql1jr.jpeg',
  aboutImg2: '/assets/show2-CM6MShfY.jpeg',
  values: [
    {
      titleEn: '100% Wholesome & Honest',
      titleDe: '100% Natürlich & Ehrlich',
      descEn: 'Slow-simmered whole spices, no artificial preservatives, zero refined fillers.',
      descDe: 'Schonend gekochte ganze Gewürze, keine künstlichen Zusatzstoffe, reine Naturzutaten.'
    },
    {
      titleEn: 'Inclusive by Nature',
      titleDe: 'Von Natur aus Vielfältig',
      descEn: 'Over 70% of our menu is naturally vegetarian and vegan, with dedicated gluten-free options.',
      descDe: 'Über 70% unserer Gerichte sind vegetarisch oder vegan, mit zertifizierten glutenfreien Optionen.'
    },
    {
      titleEn: 'Warm Berlin Hospitality',
      titleDe: 'Herzliche Berliner Gastfreundschaft',
      descEn: 'A warm, light-filled space at Zimmerstraße 56 designed for casual comfort and real connection.',
      descDe: 'Ein lichtdurchfluteter Raum in der Zimmerstraße 56 für gemütliche Pausen und echte Begegnungen.'
    }
  ]
};

export function useAboutContent() {
  const [content, setContent] = useState<AboutContent>(DEFAULT_ABOUT);

  useEffect(() => {
    let isMounted = true;
    const handleSync = (e?: Event) => {
      if (!isMounted) return;
      if (e instanceof CustomEvent && e.detail?.about) {
        setContent(e.detail.about);
      }
    };
    window.addEventListener('maati_about_updated', handleSync);

    async function fetchFromSanity() {
      if (!isSanityConfigured) return;
      try {
        const data = await sanityClient.fetch<AboutContent>(
          `*[_type == "aboutPageContent" && !(_id in path("drafts.**"))][0]`
        );
        if (isMounted && data && typeof data === 'object') {
          setContent((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Sanity about fetch error:', err);
      }
    }
    const unsubscribePublished = subscribeToPublishedContent(fetchFromSanity);
    fetchFromSanity();

    return () => {
      isMounted = false;
      unsubscribePublished();
      window.removeEventListener('maati_about_updated', handleSync);
    };
  }, []);

  return { content };
}

// ─────────────────────────────────────────────
// LegalContent Interface + Hook (Impressum, Privacy, Terms)
// ─────────────────────────────────────────────
export interface LegalSectionItem {
  id: string;
  titleEn: string;
  titleDe: string;
  bodyEn: string;
  bodyDe: string;
}

export interface LegalContent {
  impressumCompanyName?: string;
  impressumManagingDirector?: string;
  impressumRegisterCourt?: string;
  impressumVatId?: string;
  impressumAddress?: string;
  impressumEmail?: string;
  impressumPhone?: string;
  privacyPolicyEn?: string;
  privacyPolicyDe?: string;
  privacySections?: LegalSectionItem[];
  termsEn?: string;
  termsDe?: string;
  termsSections?: LegalSectionItem[];
}

export const DEFAULT_PRIVACY_SECTIONS: LegalSectionItem[] = [
  {
    id: 'sec-1',
    titleEn: '1. General & Data Controller',
    titleDe: '1. Allgemeines & Verantwortliche Stelle',
    bodyEn: 'We are MAATI (Unicorn Table UG, Lindenstraße 74, 10969 Berlin). We take the protection of your personal data very seriously and process data strictly in accordance with GDPR provisions.',
    bodyDe: 'Wir sind MAATI (Unicorn Table UG, Lindenstraße 74, 10969 Berlin). Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und verarbeiten diese ausschließlich im Einklang mit der DSGVO.'
  },
  {
    id: 'sec-2',
    titleEn: '2. Information We Collect',
    titleDe: '2. Erhobene Daten',
    bodyEn: 'We collect data you provide when using our contact form, catering inquiries, table reservations, and job applications (name, email, telephone number, requested date, guest count).',
    bodyDe: 'Wir erfassen Daten, die Sie bei der Nutzung unseres Kontaktformulars, von Catering-Anfragen, Tischreservierungen und Bewerbungen angeben (Name, E-Mail, Telefonnummer, Datum, Personenzahl).'
  },
  {
    id: 'sec-3',
    titleEn: '3. Purpose of Processing',
    titleDe: '3. Zweck der Verarbeitung',
    bodyEn: 'Your data is processed exclusively to answer your enquiries, fulfill catering contracts, manage table reservations, and consider career applications.',
    bodyDe: 'Ihre Daten werden ausschließlich zur Beantwortung von Anfragen, zur Erfüllung von Catering-Aufträgen, zur Verwaltung von Tischreservierungen und zur Prüfung von Bewerbungen verarbeitet.'
  },
  {
    id: 'sec-4',
    titleEn: '4. Third-Party Integrations & Cookies',
    titleDe: '4. Drittanbieter-Dienste & Cookies',
    bodyEn: 'We use necessary cookies for site function. Table reservations are powered securely via TheFork widget. Google Maps is embedded for location guidance only upon user interaction.',
    bodyDe: 'Wir verwenden technisch notwendige Cookies. Tischreservierungen erfolgen sicher über das TheFork-Widget. Google Maps wird zur Anfahrtsbeschreibung eingebunden.'
  },
  {
    id: 'sec-5',
    titleEn: '5. Your Rights Under GDPR',
    titleDe: '5. Ihre Rechte nach DSGVO',
    bodyEn: 'You have the right to request access, rectification, erasure, and restriction of processing of your personal data at any time by contacting hello@maatikitchen.com.',
    bodyDe: 'Sie haben jederzeit das Recht auf Auskunft, Berichtigung, Löschung und Einschränkung der Verarbeitung Ihrer personenbezogenen Daten unter hello@maatikitchen.com.'
  }
];

export const DEFAULT_TERMS_SECTIONS: LegalSectionItem[] = [
  {
    id: 'terms-1',
    titleEn: '1. Scope & Provider',
    titleDe: '1. Geltungsbereich & Anbieter',
    bodyEn: 'These General Terms and Conditions govern all food orders, table reservations, catering contracts, and interactions with MAATI Kitchen (Unicorn Table UG).',
    bodyDe: 'Diese Allgemeinen Geschäftsbedingungen gelten für alle Bestellungen, Reservierungen, Catering-Aufträge und Interaktionen mit MAATI Kitchen (Unicorn Table UG).'
  },
  {
    id: 'terms-2',
    titleEn: '2. Orders & Menu Offerings',
    titleDe: '2. Bestellungen & Speisenangebot',
    bodyEn: 'All dishes, ingredients, and prices displayed on our website are subject to daily kitchen availability. We prepare all meals fresh using whole authentic spices.',
    bodyDe: 'Alle auf unserer Website gezeigten Speisen, Zutaten und Preise gelten vorbehaltlich der täglichen Verfügbarkeit. Wir kochen alle Gerichte frisch mit authentischen Gewürzen.'
  },
  {
    id: 'terms-3',
    titleEn: '3. Table Reservations',
    titleDe: '3. Tischreservierungen',
    bodyEn: 'Reservations are confirmed immediately upon booking. For parties larger than 8 guests, please submit an inquiry or call the restaurant directly.',
    bodyDe: 'Reservierungen werden direkt bei Buchung bestätigt. Für Gruppen ab 8 Personen bitten wir um eine direkte Anfrage per Formular oder Telefon.'
  },
  {
    id: 'terms-4',
    titleEn: '4. Corporate Catering & Private Events',
    titleDe: '4. Catering & Private Veranstaltungen',
    bodyEn: 'Catering orders require 24 to 48 hours notice depending on guest count. Cancellation policies and payment terms are detailed in each individual offer.',
    bodyDe: 'Catering-Bestellungen erfordern je nach Personenzahl 24 bis 48 Stunden Vorlauf. Stornobedingungen und Zahlungsmodalitäten sind im jeweiligen Angebot geregelt.'
  },
  {
    id: 'terms-5',
    titleEn: '5. Governing Law & Jurisdiction',
    titleDe: '5. Anwendbares Recht & Gerichtsstand',
    bodyEn: 'German law applies exclusively. The place of jurisdiction for all commercial disputes is Berlin, Germany.',
    bodyDe: 'Es gilt deutsches Recht. Gerichtsstand für alle Streitigkeiten ist Berlin, Deutschland.'
  }
];

export const DEFAULT_LEGAL: LegalContent = {
  impressumCompanyName: 'Unicorn Table UG (MAATI Kitchen)',
  impressumManagingDirector: 'Naveen Prasad',
  impressumRegisterCourt: 'Amtsgericht Charlottenburg, HRB 207902 B',
  impressumVatId: 'DE 324 159 872',
  impressumAddress: 'Lindenstraße 74, 10969 Berlin (Restaurant: Zimmerstr. 56, 10117 Berlin)',
  impressumEmail: 'hello@maatikitchen.com',
  impressumPhone: '+49 1729498262',
  privacyPolicyEn: 'We are MAATI (Unicorn Table UG, Lindenstraße 74, 10969 Berlin). We take the protection of your personal data very seriously and process data strictly in accordance with GDPR provisions.',
  privacyPolicyDe: 'Wir sind MAATI (Unicorn Table UG, Lindenstraße 74, 10969 Berlin). Wir nehmen den Schutz Ihrer persönlichen Daten sehr ernst und verarbeiten diese ausschließlich im Einklang mit der DSGVO.',
  privacySections: DEFAULT_PRIVACY_SECTIONS,
  termsEn: 'These General Terms and Conditions govern all orders, reservations, catering services, and interactions with MAATI Kitchen (Unicorn Table UG).',
  termsDe: 'Diese Allgemeinen Geschäftsbedingungen regeln alle Bestellungen, Reservierungen, Catering-Leistungen und Interaktionen mit MAATI Kitchen (Unicorn Table UG).',
  termsSections: DEFAULT_TERMS_SECTIONS,
};

export function useLegalContent() {
  const [content, setContent] = useState<LegalContent>(DEFAULT_LEGAL);

  useEffect(() => {
    let isMounted = true;
    const handleSync = (e?: Event) => {
      if (!isMounted) return;
      if (e instanceof CustomEvent && e.detail?.legal) {
        setContent(e.detail.legal);
      }
    };
    window.addEventListener('maati_legal_updated', handleSync);

    async function fetchFromSanity() {
      if (!isSanityConfigured) return;
      try {
        const data = await sanityClient.fetch<LegalContent>(
          `*[_type == "legalPageContent" && !(_id in path("drafts.**"))][0]`
        );
        if (isMounted && data && typeof data === 'object') {
          setContent((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Sanity legal fetch error:', err);
      }
    }
    const unsubscribePublished = subscribeToPublishedContent(fetchFromSanity);
    fetchFromSanity();

    return () => {
      isMounted = false;
      unsubscribePublished();
      window.removeEventListener('maati_legal_updated', handleSync);
    };
  }, []);

  return { content };
}

// ─────────────────────────────────────────────
// Landing Pages Content Interface + Hook
// (Punjab Naan Pockets, Bowls, Breakfast, Coffee/Chai)
// ─────────────────────────────────────────────
export interface LandingPageItem {
  nameEn: string;
  nameDe: string;
  descEn: string;
  descDe: string;
  dietary: string;
}

export interface LandingCategoryConfig {
  titleEn: string;
  titleDe: string;
  descEn: string;
  descDe: string;
  h1En: string;
  h1De: string;
  badgeEn: string;
  badgeDe: string;
  introEn: string;
  introDe: string;
  priceEn: string;
  priceDe: string;
  items: LandingPageItem[];
}

export interface LandingPagesContent {
  'naan-pockets': LandingCategoryConfig;
  'bowls': LandingCategoryConfig;
  'breakfast': LandingCategoryConfig;
  'coffee-chai': LandingCategoryConfig;
}

export const DEFAULT_LANDING_PAGES: LandingPagesContent = {
  'naan-pockets': {
    titleEn: 'Naan Pockets Berlin | Indian Street Food | MAATI Kitchen',
    titleDe: 'Naan Pockets Berlin | Indisches Street Food | MAATI Kitchen',
    descEn: "Try MAATI's signature Punjab Naan Pockets in Berlin Mitte: freshly toasted naan filled with paneer tikka or chicken tikka. Vegan options available.",
    descDe: 'Probieren Sie MAATIs hausgemachte Punjab Naan Pockets in Berlin Mitte: frisch getoastetes Naan gefüllt mit Paneer Tikka oder Hähnchen Tikka. Vegane Optionen verfügbar.',
    h1En: 'Punjab Naan Pockets in Berlin Mitte',
    h1De: 'Punjab Naan Pockets in Berlin Mitte',
    badgeEn: 'SIGNATURE CREATION',
    badgeDe: 'SIGNATURE GERICHT',
    introEn: 'Freshly toasted, pillowy naan pockets packed with succulent tandoori-style chicken, grilled paneer or tofu, fresh seasonal salads, and vibrant regional chutneys.',
    introDe: 'Frisch gebackenes, warm getoastetes Naan-Brot, gefüllt mit mariniertem Hähnchen, saftigem Grill-Paneer oder Tofu, knackigen Salaten und aromatischen Chutneys.',
    priceEn: '€9.50',
    priceDe: '€9.50',
    items: [
      {
        nameEn: 'Punjab Chicken Tikka Naan Pocket',
        nameDe: 'Punjab Chicken Tikka Naan Pocket',
        descEn: 'Grilled marinated chicken, crunchy kachumbar salad, mint coriander chutney & tomato cream sauce',
        descDe: 'Gegrilltes Hähnchen, frischer Kachumbar-Salat, Minz-Koriander-Chutney & Tomaten-Creme',
        dietary: 'Non-Vegetarian'
      },
      {
        nameEn: 'Grilled Paneer Naan Pocket',
        nameDe: 'Grilled Paneer Naan Pocket',
        descEn: 'Spiced grilled paneer cheese, cucumber salad, fennel ginger sauce & crunchy sev',
        descDe: 'Würziger Paneer-Käse, Gurken-Salat, Fenchel-Ingwer-Sauce & knuspriges Sev',
        dietary: 'Vegetarian'
      },
      {
        nameEn: 'Vegan Spiced Tofu Naan Pocket',
        nameDe: 'Vegan Spiced Tofu Naan Pocket',
        descEn: 'Marinated tofu, roasted bell peppers, coconut tamarind sauce & fresh greens',
        descDe: 'Marinierter Tofu, geröstete Paprika, Kokos-Tamarinden-Chutney & Kirschtomaten',
        dietary: 'Vegan'
      }
    ]
  },
  'bowls': {
    titleEn: 'Indian Lunch Bowls Berlin Mitte | MAATI Kitchen',
    titleDe: 'Indische Lunch Bowls Berlin Mitte | MAATI Kitchen',
    descEn: 'Build your own Indian lunch bowl in Berlin Mitte: Delhi Butter Chicken, Kashmir Spinach Paneer or Tofu and more. Fresh, filling, vegan options.',
    descDe: 'Stellen Sie Ihre eigene indische Lunch Bowl in Berlin Mitte zusammen: Delhi Butter Chicken, Kashmir Spinat Paneer oder Tofu und mehr. Frisch, sättigend, vegan.',
    h1En: 'Customizable Indian Lunch Bowls in Berlin Mitte',
    h1De: 'Indische Lunch Bowls in Berlin Mitte',
    badgeEn: 'LUNCH FAVORITE',
    badgeDe: 'BELIEBTESTES LUNCH',
    introEn: 'Craft your ideal balanced lunch bowl in 5 easy steps: nutrient-dense grains, warm tender proteins, crisp market greens, signature curry sauces, and crunchy toppers.',
    introDe: 'Bauen Sie Ihre perfekte Bowl in 5 Schritten auf: Nährstoffreiche Basis, warme Proteine, frisches Marktgemüse, hausgemachte Currysaucen und knusprige Toppings.',
    priceEn: 'from €10.50',
    priceDe: 'ab €10.50',
    items: [
      {
        nameEn: 'Delhi Butter Chicken Bowl',
        nameDe: 'Delhi Butter Chicken Bowl',
        descEn: 'Tender grilled chicken, wholesome bulgur, cucumber salad, pickled red onions & creamy tomato velvet sauce',
        descDe: 'Zartes Grillhähnchen, Bulgur, Gurkensalat, eingelegte Zwiebeln und samtige Tomatensauce',
        dietary: 'Non-Vegetarian'
      },
      {
        nameEn: 'Chettinad Spicy Chicken Bowl',
        nameDe: 'Chettinad Spicy Chicken Bowl',
        descEn: 'Spicy marinated chicken, red rice, grilled corn & peppers, served with spicy Chettinad sauce',
        descDe: 'Würzige Hähnchenbrust, roter Reis, Mais-Paprika-Salat und pikante Chettinad-Currysauce',
        dietary: 'Spicy'
      },
      {
        nameEn: 'Bihar Lentil & Potato Bowl',
        nameDe: 'Bihar Lentil & Potato Bowl',
        descEn: 'Yellow lentil dal, sautéed spiced potatoes, black chickpeas, basmati rice & marinated mango',
        descDe: 'Gelbes Linsen-Dal, sautierte Kartoffeln, Kichererbsen, Basmatireis und Mango-Pickle',
        dietary: 'Vegan'
      }
    ]
  },
  'breakfast': {
    titleEn: 'Indian Breakfast & Brunch Berlin Mitte | MAATI Kitchen',
    titleDe: 'Indisches Frühstück & Brunch Berlin Mitte | MAATI Kitchen',
    descEn: 'Start the day with Indian-inspired breakfast in Berlin Mitte: chutney croissants, homemade granola, specialty coffee and chai at MAATI Kitchen.',
    descDe: 'Starten Sie den Tag mit indisch inspiriertem Frühstück in Berlin Mitte: Chutney-Croissants, hausgemachtes Granola, Kaffeespezialitäten und Chai.',
    h1En: 'Indian Breakfast & Brunch in Berlin Mitte',
    h1De: 'Indisches Frühstück & Brunch in Berlin Mitte',
    badgeEn: 'BREAKFAST & BRUNCH',
    badgeDe: 'FRÜHSTÜCK & KAFFEE',
    introEn: 'Start your morning with golden buttery croissants toasted with cheddar and green herb chutney, homemade fruit granola bowls, and freshly brewed spiced chai.',
    introDe: 'Beginnen Sie den Tag mit knusprigen getoasteten Croissants mit würzigem Käse und Koriander-Chutney, cremigen Joghurt-Bowls und frisch gebrühtem Masala Chai.',
    priceEn: 'from €4.00',
    priceDe: 'ab €4.00',
    items: [
      {
        nameEn: 'Green Chutney & Cheese Toasted Croissant',
        nameDe: 'Green Chutney & Cheese Toasted Croissant',
        descEn: 'Flaky butter croissant toasted with melted cheddar and lively coriander mint chutney',
        descDe: 'Knuspriges Buttercroissant gefüllt mit herzhaftem Cheddar und frischem Koriander-Minz-Chutney',
        dietary: 'Vegetarian'
      },
      {
        nameEn: 'Homemade Spiced Granola Bowl',
        nameDe: 'Homemade Spiced Granola Bowl',
        descEn: 'Toasted oats, cardamom, coconut flakes, dates, cashews & honey over yogurt with fresh fruits',
        descDe: 'Haferflocken, Kardamom, Kokos, Datteln, Cashews und Honig auf cremigem Joghurt mit frischen Früchten',
        dietary: 'Vegetarian'
      }
    ]
  },
  'coffee-chai': {
    titleEn: 'Coffee, Masala Chai & Golden Milk Berlin | MAATI',
    titleDe: 'Kaffee, Masala Chai & Goldene Milch Berlin | MAATI',
    descEn: 'Specialty coffee, masala chai and golden milk at MAATI Kitchen, Berlin Mitte. Stop by for a warm drink near Checkpoint Charlie.',
    descDe: 'Spezialitätenkaffee, Masala Chai und Goldene Milch im MAATI Kitchen Berlin Mitte. Genießen Sie aromatische Heißgetränke nahe Checkpoint Charlie.',
    h1En: 'Specialty Coffee, Masala Chai & Craft Drinks',
    h1De: 'Kaffeespezialitäten, Masala Chai & Goldene Milch',
    badgeEn: 'SPECIALTY BEVERAGES',
    badgeDe: 'WARME SPEZIALITÄTEN',
    introEn: 'Authentic slow-simmered masala chai brewed with whole spices, golden turmeric lattes, and artisan specialty coffee sourced from sustainable roasteries.',
    introDe: 'Aromatischer, traditionell im Topf gekochter Masala Chai mit echten Gewürzen, samtige Kurkuma-Goldene-Milch und handwerklich gerösteter Spezialitätenkaffee.',
    priceEn: 'from €3.00',
    priceDe: 'ab €3.00',
    items: [
      {
        nameEn: 'Authentic Spiced Masala Chai',
        nameDe: 'Authentic Spiced Masala Chai',
        descEn: 'Rich Assam black tea simmered with fresh ginger, crushed cardamom, cinnamon, and whole or oat milk',
        descDe: 'Schwarzer Assam-Tee aufgekocht mit Kardamom, Zimt, Nelken, Ingwer und Vollmilch oder Hafermilch',
        dietary: 'Vegan option'
      },
      {
        nameEn: 'Golden Turmeric Latte (Golden Milk)',
        nameDe: 'Golden Turmeric Latte (Goldene Milch)',
        descEn: 'Fresh turmeric root, cracked pepper, cinnamon and steamed oat milk for soothing warmth',
        descDe: 'Frischer Kurkuma, schwarzer Pfeffer, Zimt und cremige Hafermilch — wohltuend und entzündungshemmend',
        dietary: 'Vegan'
      },
      {
        nameEn: 'Specialty Indian Filter Coffee',
        nameDe: 'Specialty Indian Filter Coffee',
        descEn: 'Traditional chicory-infused South Indian filter coffee frothed to perfection',
        descDe: 'Dunkel gerösteter indischer Arabica-Robusta-Blend mit Chicorée und schaumiger Milch',
        dietary: 'Vegetarian'
      }
    ]
  }
};

export function useLandingPagesContent() {
  const [content, setContent] = useState<LandingPagesContent>(DEFAULT_LANDING_PAGES);

  useEffect(() => {
    let isMounted = true;
    const handleSync = (e?: Event) => {
      if (!isMounted) return;
      if (e instanceof CustomEvent && e.detail?.landingPages) {
        setContent(e.detail.landingPages);
      }
    };
    window.addEventListener('maati_landing_pages_updated', handleSync);

    async function fetchFromSanity() {
      if (!isSanityConfigured) return;
      try {
        const data = await sanityClient.fetch<LandingPagesContent>(
          `*[_type == "landingPagesContent" && !(_id in path("drafts.**"))][0]`
        );
        if (isMounted && data && typeof data === 'object') {
          setContent((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Sanity landing pages fetch error:', err);
      }
    }
    const unsubscribePublished = subscribeToPublishedContent(fetchFromSanity);
    fetchFromSanity();

    return () => {
      isMounted = false;
      unsubscribePublished();
      window.removeEventListener('maati_landing_pages_updated', handleSync);
    };
  }, []);

  return { content };
}

// ─────────────────────────────────────────────
// Table Reservation Content Interface + Hook
// ─────────────────────────────────────────────
export interface ReservationContent {
  titleEn?: string;
  titleDe?: string;
  subtitleEn?: string;
  subtitleDe?: string;
  theforkWidgetId?: string;
  theforkUrl?: string;
  phone?: string;
  email?: string;
  maxPartySize?: number;
  noticeEn?: string;
  noticeDe?: string;
}

export const DEFAULT_RESERVATION: ReservationContent = {
  titleEn: 'Book A Table Online',
  titleDe: 'Tisch online reservieren',
  subtitleEn: 'Instant confirmation via TheFork. For groups over 8 people, please contact our team directly.',
  subtitleDe: 'Sofortige Bestätigung über TheFork. Für Gruppen über 8 Personen kontaktieren Sie uns bitte direkt.',
  theforkWidgetId: '7beffe40-786f-496c-b196-48b939750c77',
  theforkUrl: 'https://www.thefork.com/restaurant/maati-kitchen-r938475',
  phone: '+49 30 51891367',
  email: 'hello@maatikitchen.com',
  maxPartySize: 8,
  noticeEn: 'Same-day walk-ins are always warmly welcomed! Counter ordering is available throughout the day.',
  noticeDe: 'Spontane Besuche ohne Reservierung sind jederzeit herzlich willkommen!',
};

export function useReservationContent() {
  const [content, setContent] = useState<ReservationContent>(DEFAULT_RESERVATION);

  useEffect(() => {
    let isMounted = true;
    const handleSync = (e?: Event) => {
      if (!isMounted) return;
      if (e instanceof CustomEvent && e.detail?.reservation) {
        setContent(e.detail.reservation);
      }
    };
    window.addEventListener('maati_reservation_updated', handleSync);

    async function fetchFromSanity() {
      if (!isSanityConfigured) return;
      try {
        const data = await sanityClient.fetch<ReservationContent>(
          `*[_type == "reservationContent" && !(_id in path("drafts.**"))][0]`
        );
        if (isMounted && data && typeof data === 'object') {
          setContent((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Sanity reservation fetch error:', err);
      }
    }
    const unsubscribePublished = subscribeToPublishedContent(fetchFromSanity);
    fetchFromSanity();

    return () => {
      isMounted = false;
      unsubscribePublished();
      window.removeEventListener('maati_reservation_updated', handleSync);
    };
  }, []);

  return { content };
}

// Publishing uses the authenticated VPS API. Never bundle a Sanity write token.
const DOC_SECTIONS: Record<string, string> = {
  siteSettings: 'settings', homepage: 'homepage', eventsContent: 'events', contactContent: 'contact',
  printMenuContent: 'printMenu', menuCategoriesData: 'menu', galleryData: 'gallery',
  cateringPageContent: 'catering', jobsPageContent: 'jobs', aboutPageContent: 'about',
  legalPageContent: 'legal', landingPagesContent: 'landingPages', reservationContent: 'reservation',
};
export type PublishResult = { success: boolean; message: string; revision?: string };
async function writeSanityDoc(docId: string, _docType: string, fields: Record<string, any>, baseRevision?: string): Promise<PublishResult> {
  try {
    const response = await fetch(apiUrl('/api/admin/content'), {
      method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: DOC_SECTIONS[docId], fields, baseRevision: baseRevision ?? fields._rev }),
    });
    const result = await response.json();
    if (!response.ok || !result.success) return { success: false, message: result.error || 'Publishing failed.' };
    fields._rev = result.revision;
    window.dispatchEvent(new CustomEvent('maati_content_published', { detail: { fields } }));
    refreshPublishedContent();
    return { success: true, message: result.message, revision: result.revision };
  } catch (err: any) { return { success: false, message: err.message || 'Could not reach the publishing server.' }; }
}

export async function saveSettingsToSanity(settings: SiteSettings): Promise<{ success: boolean; message: string }> {
  return writeSanityDoc('siteSettings', 'siteSettings', settings);
}

export async function saveHomepageToSanity(homepage: HomepageContent): Promise<{ success: boolean; message: string }> {
  return writeSanityDoc('homepage', 'homepage', homepage);
}

export async function saveEventsToSanity(events: EventsContent): Promise<{ success: boolean; message: string }> {
  return writeSanityDoc('eventsContent', 'eventsContent', events);
}

export async function saveContactToSanity(contact: ContactContent): Promise<{ success: boolean; message: string }> {
  return writeSanityDoc('contactContent', 'contactContent', contact);
}

export async function savePrintMenuToSanity(printMenu: PrintMenuContent): Promise<{ success: boolean; message: string }> {
  return writeSanityDoc('printMenuContent', 'printMenuContent', printMenu);
}

export async function saveMenuCategoriesToSanity(menu: SanityCategoryWithItems[], baseRevision?: string): Promise<PublishResult> {
  return writeSanityDoc('menuCategoriesData', 'menuCategoriesData', { categories: menu }, baseRevision);
}

export async function saveGalleryToSanity(gallery: any[], baseRevision?: string): Promise<PublishResult> {
  return writeSanityDoc('galleryData', 'galleryData', { items: gallery }, baseRevision);
}

export async function saveCateringToSanity(catering: CateringContent): Promise<{ success: boolean; message: string }> {
  return writeSanityDoc('cateringPageContent', 'cateringPageContent', catering);
}

export async function saveJobsToSanity(jobs: JobsContent): Promise<{ success: boolean; message: string }> {
  return writeSanityDoc('jobsPageContent', 'jobsPageContent', jobs);
}

export async function saveAboutToSanity(about: AboutContent): Promise<{ success: boolean; message: string }> {
  return writeSanityDoc('aboutPageContent', 'aboutPageContent', about);
}

export async function saveLegalToSanity(legal: LegalContent): Promise<{ success: boolean; message: string }> {
  return writeSanityDoc('legalPageContent', 'legalPageContent', legal);
}

export async function saveLandingPagesToSanity(landingPages: LandingPagesContent): Promise<{ success: boolean; message: string }> {
  return writeSanityDoc('landingPagesContent', 'landingPagesContent', landingPages);
}

export async function saveReservationToSanity(reservation: ReservationContent): Promise<{ success: boolean; message: string }> {
  return writeSanityDoc('reservationContent', 'reservationContent', reservation);
}

/**
 * Uploads all locally edited admin data directly to Sanity Cloud.
 */
export async function syncAllLocalToSanity(): Promise<PublishResult> {
  refreshPublishedContent();
  return { success: true, message: 'Refreshed published content from Sanity. Save edits in their page editor to publish.' };
}
