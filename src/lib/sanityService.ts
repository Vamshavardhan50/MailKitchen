import { useState, useEffect } from 'react';
import { createClient } from '@sanity/client';
import { sanityClient, isSanityConfigured, urlFor, SANITY_PROJECT_ID, SANITY_DATASET, SANITY_API_VERSION } from './sanity';
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
  const [loading, setLoading] = useState<boolean>(true);
  const [isFromSanity, setIsFromSanity] = useState<boolean>(false);



  useEffect(() => {
    let isMounted = true;

    // Reactively update if admin dispatches event in current session
    const handleSync = (e?: Event) => {
      if (!isMounted) return;
      if (e instanceof CustomEvent && e.detail?.categories) {
        setCategories(e.detail.categories);
      }
    };
    window.addEventListener('maati_menu_updated', handleSync);

    async function fetchMenu() {
      if (!isSanityConfigured) {
        setLoading(false);
        return;
      }

      try {
        // 1. First check if consolidated menuCategoriesData exists in Sanity Cloud
        const customMenu = await sanityClient.fetch<any>(
          `*[_type == "menuCategoriesData" && !(_id in path("drafts.**"))][0].categories`
        );
        if (isMounted && customMenu && Array.isArray(customMenu) && customMenu.length > 0) {
          setCategories(customMenu);
          setIsFromSanity(true);
          setLoading(false);
          return;
        }

        // 2. Otherwise fetch from standard categories query
        const data = await sanityClient.fetch<SanityCategoryWithItems[]>(getMenuByCategoryQuery);
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          const normalized = data.map((cat) => ({
            ...cat,
            items: (cat.items || []).map((item) => ({
              ...item,
              id: item.slug && typeof item.slug === 'object' ? item.slug.current : item.id || item._id,
              img: item.image ? ((urlFor(item.image) as any)?.url?.() || item.img) : item.img,
            })),
          }));
          setCategories(normalized);
          setIsFromSanity(true);
        }
      } catch (err) {
        console.warn('Sanity menu fetch error, using local fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchMenu();
    return () => {
      isMounted = false;
      window.removeEventListener('maati_menu_updated', handleSync);
    };
  }, []);

  return { categories, loading, isFromSanity };
}

// ─────────────────────────────────────────────
// React Hook: useFeaturedMenu (Public Featured Dishes Hook)
// ─────────────────────────────────────────────
export function useFeaturedMenu() {
  const [items, setItems] = useState<SanityMenuItem[]>(getLocalFallbackFeatured);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFromSanity, setIsFromSanity] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchFeatured() {
      if (!isSanityConfigured) {
        setLoading(false);
        return;
      }

      try {
        // 1. First check if consolidated menuCategoriesData exists
        const customMenu = await sanityClient.fetch<any>(
          `*[_type == "menuCategoriesData" && !(_id in path("drafts.**"))][0].categories`
        );
        if (isMounted && customMenu && Array.isArray(customMenu) && customMenu.length > 0) {
          const featured = customMenu
            .flatMap((c: any) => (c.items || []).filter((it: any) => it.featured && it.available !== false))
            .sort((a: any, b: any) => (a.featuredOrder || 999) - (b.featuredOrder || 999));
          if (featured.length > 0) {
            setItems(featured);
            setIsFromSanity(true);
            setLoading(false);
            return;
          }
        }

        // 2. Otherwise fetch from standard query
        const data = await sanityClient.fetch<SanityMenuItem[]>(getFeaturedMenuItemsQuery);
        if (isMounted && data && Array.isArray(data) && data.length > 0) {
          const normalized = data.map((item) => ({
            ...item,
            id: item.slug && typeof item.slug === 'object' ? item.slug.current : item.id || item._id,
            img: item.image ? ((urlFor(item.image) as any)?.url?.() || item.img) : item.img,
          }));
          setItems(normalized);
          setIsFromSanity(true);
        }
      } catch (err) {
        console.warn('Sanity featured items fetch error, using local fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

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
  heroBtnResEn: 'Reservations',
  heroBtnResDe: 'Reservieren',
  heroPill1En: 'FRESH INGREDIENTS',
  heroPill1De: 'FRISCHE ZUTATEN',
  heroPill2En: 'AUTHENTIC SPICES',
  heroPill2De: 'AUTHENTISCHE GEWÜRZE',
  heroPill3En: 'READY IN MINUTES',
  heroPill3De: 'SCHNELL SERVIERT',
  heroImage: '/assets/hero-flatlay.jpg',
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
  ctaBtnLocationsEn: 'Our Locations',
  ctaBtnLocationsDe: 'Unsere Standorte',
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

    fetchHomepage();
    return () => {
      isMounted = false;
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
  phone: '+49 030 51891367',
  email: 'hello@maatikitchen.com',
  address: 'Zimmerstraße 56, 10117 Berlin',
  openingHoursEn: 'Mon – Fri: 11:30 – 21:30\nSat: 12:00 – 21:00\nSun: Closed',
  openingHoursDe: 'Mo – Fr: 11:30 – 21:30\nSa: 12:00 – 21:00\nSo: Geschlossen',
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

    fetchSettings();
    return () => {
      isMounted = false;
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
    fetchFromSanity();

    return () => {
      isMounted = false;
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
  phone: '+49 030 51891367',
  email: 'hello@maatikitchen.com',
  address: 'Zimmerstraße 56, 10117 Berlin',
  openingHoursEn: 'Mon – Fri: 11:30 – 21:30\nSat: 12:00 – 21:00\nSun: Closed',
  openingHoursDe: 'Mo – Fr: 11:30 – 21:30\nSa: 12:00 – 21:00\nSo: Geschlossen',
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
    fetchFromSanity();

    return () => {
      isMounted = false;
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
    fetchFromSanity();

    return () => {
      isMounted = false;
    };
  }, []);

  return { content };
}

// ─────────────────────────────────────────────
// Admin Direct Write Client
// Uses VITE_SANITY_WRITE_TOKEN — only present in admin builds
// ─────────────────────────────────────────────

const metaEnvWrite = (import.meta as any).env || {};
const WRITE_TOKEN = metaEnvWrite.VITE_SANITY_WRITE_TOKEN || '';

const adminWriteClient = WRITE_TOKEN
  ? createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: SANITY_API_VERSION,
      useCdn: false,
      token: WRITE_TOKEN,
    })
  : null;

async function writeSanityDoc(docId: string, docType: string, fields: Record<string, any>): Promise<{ success: boolean; message: string }> {
  if (!adminWriteClient) {
    return { success: false, message: 'Admin write token not configured. Add VITE_SANITY_WRITE_TOKEN to .env and rebuild.' };
  }
  try {
    await adminWriteClient.createOrReplace({
      _id: docId,
      _type: docType,
      ...fields,
    });
    return { success: true, message: `Published to Sanity Cloud (${docId})` };
  } catch (err: any) {
    console.error(`[MAATI Admin] Sanity write error for ${docId}:`, err);
    return { success: false, message: err?.message || 'Sanity write failed' };
  }
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

export async function saveMenuCategoriesToSanity(menu: SanityCategoryWithItems[]): Promise<{ success: boolean; message: string }> {
  return writeSanityDoc('menuCategoriesData', 'menuCategoriesData', { categories: menu });
}

export async function saveGalleryToSanity(gallery: any[]): Promise<{ success: boolean; message: string }> {
  return writeSanityDoc('galleryData', 'galleryData', { items: gallery });
}

/**
 * Uploads all locally edited admin data directly to Sanity Cloud.
 */
export async function syncAllLocalToSanity(): Promise<{ success: boolean; message: string }> {
  if (!adminWriteClient) {
    return { success: false, message: 'Admin write token not configured. Add VITE_SANITY_WRITE_TOKEN to .env and rebuild.' };
  }

  try {
    const results: string[] = [];
    const errors: string[] = [];

    const localSettings = localStorage.getItem('maati_admin_settings');
    if (localSettings) {
      const r = await saveSettingsToSanity(JSON.parse(localSettings));
      r.success ? results.push('settings') : errors.push(`settings: ${r.message}`);
    }

    const localHomepage = localStorage.getItem('maati_admin_homepage');
    if (localHomepage) {
      const r = await saveHomepageToSanity(JSON.parse(localHomepage));
      r.success ? results.push('homepage') : errors.push(`homepage: ${r.message}`);
    }

    const localEvents = localStorage.getItem('maati_admin_events');
    if (localEvents) {
      const r = await saveEventsToSanity(JSON.parse(localEvents));
      r.success ? results.push('events') : errors.push(`events: ${r.message}`);
    }

    const localContact = localStorage.getItem('maati_admin_contact');
    if (localContact) {
      const r = await saveContactToSanity(JSON.parse(localContact));
      r.success ? results.push('contact') : errors.push(`contact: ${r.message}`);
    }

    const localPrint = localStorage.getItem('maati_admin_print_menu');
    if (localPrint) {
      const r = await savePrintMenuToSanity(JSON.parse(localPrint));
      r.success ? results.push('printMenu') : errors.push(`printMenu: ${r.message}`);
    }

    const localMenu = localStorage.getItem('maati_admin_menu');
    if (localMenu) {
      const r = await saveMenuCategoriesToSanity(JSON.parse(localMenu));
      r.success ? results.push('menu') : errors.push(`menu: ${r.message}`);
    }

    const localGallery = localStorage.getItem('maati_admin_gallery_v2');
    if (localGallery) {
      const r = await saveGalleryToSanity(JSON.parse(localGallery));
      r.success ? results.push('gallery') : errors.push(`gallery: ${r.message}`);
    }

    if (errors.length === 0) {
      return { success: true, message: `Published ${results.join(', ')} to Sanity Cloud! 🚀` };
    } else if (results.length > 0) {
      return { success: false, message: `Partial sync. OK: ${results.join(', ')}. Failed: ${errors.join('; ')}` };
    } else {
      return { success: false, message: `Sync failed: ${errors.join('; ')}` };
    }
  } catch (err: any) {
    console.error('syncAllLocalToSanity error:', err);
    return { success: false, message: `Sync failed: ${err.message || 'Unknown error'}` };
  }
}






