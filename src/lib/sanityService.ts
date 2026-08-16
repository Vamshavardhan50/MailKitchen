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

// ── Fallback Category Data Generator ──
function getLocalFallbackCategories(): SanityCategoryWithItems[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('maati_admin_menu');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {}
    }
  }

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

// ── Fallback Featured Items (for Homepage) ──
function getLocalFallbackFeatured(): SanityMenuItem[] {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('maati_admin_menu');
    if (saved) {
      try {
        const parsed: SanityCategoryWithItems[] = JSON.parse(saved);
        const featured = parsed
          .flatMap((c) => c.items.filter((it) => it.featured && it.available !== false))
          .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));
        if (featured.length > 0) return featured;
      } catch {}
    }
  }

  return [
    mapLocalToSanityItem(HAUSSPEZIALITAETEN_ITEMS[0]), // Chettinad
    mapLocalToSanityItem(HAUSSPEZIALITAETEN_ITEMS[1]), // Delhi
    mapLocalToSanityItem(HAUSSPEZIALITAETEN_ITEMS[3]), // Bihar
    mapLocalToSanityItem(NAAN_POCKET_ITEM),           // Punjab Naan
    mapLocalToSanityItem(BREAKFAST_ITEMS[0]),         // Croissant
  ];
}

// ─────────────────────────────────────────────
// React Hook: useSanityMenu
// ─────────────────────────────────────────────
export function useSanityMenu() {
  const [categories, setCategories] = useState<SanityCategoryWithItems[]>(getLocalFallbackCategories);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFromSanity, setIsFromSanity] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    // Always re-read from localStorage when admin panel triggers a save
    const handleLocalSync = (e?: Event) => {
      const isForced = e instanceof CustomEvent && e.detail?.forceLocal;
      if (isMounted) {
        const freshData = getLocalFallbackCategories();
        setCategories(freshData);
        // If admin forced an update, override Sanity data too
        if (isForced) setIsFromSanity(false);
      }
    };

    window.addEventListener('maati_menu_updated', handleLocalSync);
    window.addEventListener('storage', handleLocalSync);

    async function fetchMenu() {
      // Check if admin has saved custom data - if so, prioritize it
      const adminSaved = localStorage.getItem('maati_admin_menu');
      if (adminSaved) {
        try {
          const parsed = JSON.parse(adminSaved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            if (isMounted) {
              setCategories(parsed);
              setLoading(false);
            }
            return; // Use admin data, skip Sanity
          }
        } catch {}
      }

      if (!isSanityConfigured) {
        setLoading(false);
        return;
      }

      try {
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
      window.removeEventListener('maati_menu_updated', handleLocalSync);
      window.removeEventListener('storage', handleLocalSync);
    };
  }, []);

  return { categories, loading, isFromSanity };
}

// ─────────────────────────────────────────────
// React Hook: useFeaturedMenu
// ─────────────────────────────────────────────
export function useFeaturedMenu() {
  const [items, setItems] = useState<SanityMenuItem[]>(getLocalFallbackFeatured);
  const [loading, setLoading] = useState<boolean>(true);
  const [isFromSanity, setIsFromSanity] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    const handleLocalSync = (e?: Event) => {
      const isForced = e instanceof CustomEvent && e.detail?.forceLocal;
      if (isMounted) {
        setItems(getLocalFallbackFeatured());
        if (isForced) setIsFromSanity(false);
      }
    };

    window.addEventListener('maati_menu_updated', handleLocalSync);
    window.addEventListener('storage', handleLocalSync);

    async function fetchFeatured() {
      // Prioritize admin data if it exists
      const adminSaved = localStorage.getItem('maati_admin_menu');
      if (adminSaved) {
        try {
          const parsed: SanityCategoryWithItems[] = JSON.parse(adminSaved);
          const featured = parsed
            .flatMap((c) => c.items.filter((it) => it.featured && it.available !== false))
            .sort((a, b) => (a.featuredOrder || 999) - (b.featuredOrder || 999));
          if (featured.length > 0 && isMounted) {
            setItems(featured);
            setLoading(false);
            return; // Use admin data
          }
        } catch {}
      }

      if (!isSanityConfigured) {
        setLoading(false);
        return;
      }

      try {
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
      window.removeEventListener('maati_menu_updated', handleLocalSync);
      window.removeEventListener('storage', handleLocalSync);
    };
  }, []);

  return { items, loading, isFromSanity };
}

// ─────────────────────────────────────────────
// React Hook: useHomepageContent
// ─────────────────────────────────────────────
export function useHomepageContent() {
  const [content, setContent] = useState<HomepageContent>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maati_admin_homepage');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
      // 1. Hero
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
      heroBtnResDe: 'Reservierungen',
      heroPill1En: 'FRESH INGREDIENTS',
      heroPill1De: 'FRISCHE ZUTATEN',
      heroPill2En: 'AUTHENTIC SPICES',
      heroPill2De: 'AUTHENTISCHE GEWÜRZE',
      heroPill3En: 'READY IN MINUTES',
      heroPill3De: 'SCHNELL SERVIERT',
      heroImage: '/assets/hero-flatlay.jpg',

      // 2. House Favorites
      lunchTitleEn: 'Treat Your Tastebuds',
      lunchTitleDe: 'Verwöhnen Sie Ihren Gaumen',
      lunchDescEn: 'Discover our most-loved signature combinations, crafted for perfect balance.',
      lunchDescDe: 'Entdecken Sie unsere beliebtesten Signatur-Kombinationen für perfekte Ausgewogenheit.',

      // 3. The MAATI Way
      maatiWayBadgeEn: 'CUSTOMIZED TO YOUR TASTE',
      maatiWayBadgeDe: 'INDIVIDUELL NACH IHREM GESCHMACK',
      maatiWayTitleEn: 'The MAATI Way',
      maatiWayTitleDe: 'Der MAATI Weg',
      maatiWaySteps: [
        {
          id: 'step-1',
          step: 1,
          title: 'Choose your base (Upto 1)',
          titleDe: 'Wählen Sie Ihre Basis (Bis zu 1)',
          items: ['White Rice', 'Red Rice', 'Bulgar Wheat', 'Pearl Barley', 'Salad(Mix)'],
          itemsDe: ['Weißer Reis', 'Roter Reis', 'Bulgur Weizen', 'Perlgraupen', 'Salatmischung']
        },
        {
          id: 'step-2',
          step: 2,
          title: 'Choose your Protein',
          titleDe: 'Wählen Sie Ihr Protein',
          items: [
            'Poached Chicken (+€2)',
            'Grilled Chicken (+€2) (Spicy)',
            'Grilled Spicy chicken (+€2.5)',
            'Butter Garlic Prawns (+€3)',
            'Grilled Paneer (+€1.5)',
            'Grilled Tofu (+€1)'
          ],
          itemsDe: [
            'Pochiertes Hähnchen (+€2)',
            'Gegrilltes Hähnchen (+€2) (Scharf)',
            'Scharfes gegrilltes Hähnchen (+€2.5)',
            'Butter-Knoblauch-Garnelen (+€3)',
            'Gegrillter Paneer (+€1.5)',
            'Gegrillter Tofu (+€1)'
          ]
        },
        {
          id: 'step-3',
          step: 3,
          title: 'Choose your sides (Upto 2)',
          titleDe: 'Wählen Sie Ihre Beilagen (Bis zu 2)',
          items: [
            'Dark Green Salad leaves',
            'Mixed salad (Kachumbar)',
            'Grilled Paprika',
            'Cherry Tomatoes',
            'Grilled Beetroot',
            'Sprout Salad',
            'Baby Carrots'
          ],
          itemsDe: [
            'Dunkelgrüne Salatblätter',
            'Gemischter Salat (Kachumbar)',
            'Gegrillte Paprika',
            'Kirschtomaten',
            'Gegrillte Rote Bete',
            'Sprossensalat',
            'Baby-Karotten'
          ]
        },
        {
          id: 'step-4',
          step: 4,
          title: 'Choose your Sauce (Pick 1)',
          titleDe: 'Wählen Sie Ihre Sauce (Wählen Sie 1)',
          items: [
            'Tomato Cream Sauce',
            'Coconut Mustard Sauce',
            'Fennel Ginger Yoghurt Sauce',
            'Coconut Tamarind Sauce',
            'Chettinad Curry Sauce',
            'Coriander Mint Lemon Chutney'
          ],
          itemsDe: [
            'Tomaten-Sahne-Sauce',
            'Kokos-Senf-Sauce',
            'Fenchel-Ingwer-Joghurt-Sauce',
            'Kokos-Tamarinden-Sauce',
            'Chettinad-Currysauce',
            'Koriander-Minze-Zitronen-Chutney'
          ]
        },
        {
          id: 'step-5',
          step: 5,
          title: 'Finishers (Upto 2)',
          titleDe: 'Toppings & Finishers (Bis zu 2)',
          items: [
            'Crushed Papads',
            'Spicy Crunchy Sev',
            'Diced Raw Mangoes',
            'Coriander chutney (Spicy)',
            'Tamarind chutney',
            'Chopped Onions & Green Chillies (Extra Spicy)',
            'Roasted Cashews (+€2)'
          ],
          itemsDe: [
            'Geknackte Papads',
            'Knuspriges Sev',
            'Gewürfelte Mangostücke',
            'Koriander-Chutney (Scharf)',
            'Tamarinden-Chutney',
            'Zwiebeln & Grüne Chilis (Extra Scharf)',
            'Geröstete Cashews (+€2)'
          ]
        }
      ],

      // 4. Experience
      experienceEyebrowEn: 'EXPERIENCE',
      experienceEyebrowDe: 'ERLEBNIS',
      experienceTitleEn: 'Breakfast, Lunch and Events at MAATI',
      experienceTitleDe: 'Frühstück, Mittagessen und Events bei MAATI',
      experienceDescEn: 'A warm, modern space designed for quick breakfast & lunches and cozy events alike.',
      experienceDescDe: 'Ein warmer, moderner Raum für ein schnelles Frühstück, Mittagessen und gemütliche Events.',
      experienceImg1: '/assets/show5-BiQql1jr.jpeg',
      experienceImg2: '/assets/show2-CM6MShfY.jpeg',

      // 5. Catering
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

      // 6. Footer CTA
      ctaTitleEn: 'Visit us at Zimmestr. 56, 10117 Berlin - where every bite tells a story.',
      ctaTitleDe: 'Besuchen Sie uns in der Zimmerstr. 56, 10117 Berlin - wo jeder Bissen eine Geschichte erzählt.',
      ctaDescEn: 'Experience modern Indian soul food in a cozy, welcoming atmosphere.',
      ctaDescDe: 'Erleben Sie modernes indisches Soul Food in gemütlicher Atmosphäre.',
      ctaBtnMenuEn: 'View Menu',
      ctaBtnMenuDe: 'Speisekarte',
      ctaBtnLocationsEn: 'Our Locations',
      ctaBtnLocationsDe: 'Unsere Standorte',
    };
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    // Re-read from localStorage whenever admin saves homepage changes
    const handleLocalSync = () => {
      if (!isMounted) return;
      const saved = localStorage.getItem('maati_admin_homepage');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && typeof parsed === 'object') {
            setContent((prev) => ({ ...prev, ...parsed }));
          }
        } catch {}
      }
    };

    window.addEventListener('maati_homepage_updated', handleLocalSync);
    window.addEventListener('storage', handleLocalSync);

    async function fetchHomepage() {
      // Prioritize admin data if it exists
      const adminSaved = localStorage.getItem('maati_admin_homepage');
      if (adminSaved) {
        try {
          const parsed = JSON.parse(adminSaved);
          if (parsed && typeof parsed === 'object') {
            if (isMounted) {
              setContent((prev) => ({ ...prev, ...parsed }));
              setLoading(false);
            }
            return; // Use admin data, skip Sanity
          }
        } catch {}
      }

      if (!isSanityConfigured) {
        setLoading(false);
        return;
      }

      try {
        const data = await sanityClient.fetch<HomepageContent>(getHomepageQuery);
        if (isMounted && data && typeof data === 'object') {
          setContent((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Sanity homepage fetch error, using local fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchHomepage();
    return () => {
      isMounted = false;
      window.removeEventListener('maati_homepage_updated', handleLocalSync);
      window.removeEventListener('storage', handleLocalSync);
    };
  }, []);

  return { content, loading };
}

// ─────────────────────────────────────────────
// React Hook: useSiteSettings
// ─────────────────────────────────────────────
export function useSiteSettings() {
  const [settings, setSettings] = useState<SiteSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maati_admin_settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {}
      }
    }
    return {
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
    };
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchSettings() {
      if (!isSanityConfigured) {
        setLoading(false);
        return;
      }

      try {
        const data = await sanityClient.fetch<SiteSettings>(getSiteSettingsQuery);
        if (isMounted && data && typeof data === 'object') {
          setSettings((prev) => ({ ...prev, ...data }));
        }
      } catch (err) {
        console.warn('Sanity site settings fetch error, using local fallback:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchSettings();
    return () => {
      isMounted = false;
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
  const [content, setContent] = useState<EventsContent>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maati_admin_events');
      if (saved) {
        try { return { ...DEFAULT_EVENTS, ...JSON.parse(saved) }; } catch {}
      }
    }
    return DEFAULT_EVENTS;
  });

  useEffect(() => {
    let isMounted = true;
    const sync = () => {
      if (!isMounted) return;
      const saved = localStorage.getItem('maati_admin_events');
      if (saved) {
        try { setContent((prev) => ({ ...prev, ...JSON.parse(saved) })); } catch {}
      }
    };
    window.addEventListener('maati_events_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      isMounted = false;
      window.removeEventListener('maati_events_updated', sync);
      window.removeEventListener('storage', sync);
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
}

const DEFAULT_CONTACT: ContactContent = {
  headlineEn: 'Get in Touch',
  headlineDe: 'Kontaktieren Sie uns',
  descEn: 'Have a question? Want to make a reservation? We\'d love to hear from you.',
  descDe: 'Haben Sie eine Frage? Möchten Sie reservieren? Wir freuen uns von Ihnen zu hören.',
  phone: '+49 030 51891367',
  email: 'hello@maatikitchen.com',
  address: 'Zimmerstraße 56, 10117 Berlin',
  openingHoursEn: 'Mon – Fri: 11:30 – 15:00',
  openingHoursDe: 'Mo – Fr: 11:30 – 15:00 Uhr',
  theforkWidgetId: '7beffe40-786f-496c-b196-48b939750c77',
  googleMapsUrl: 'https://maps.google.com/?q=MAATI+Kitchen+Zimmerstrasse+56+Berlin',
};

export function useContactContent() {
  const [content, setContent] = useState<ContactContent>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maati_admin_contact');
      if (saved) {
        try { return { ...DEFAULT_CONTACT, ...JSON.parse(saved) }; } catch {}
      }
    }
    return DEFAULT_CONTACT;
  });

  useEffect(() => {
    let isMounted = true;
    const sync = () => {
      if (!isMounted) return;
      const saved = localStorage.getItem('maati_admin_contact');
      if (saved) {
        try { setContent((prev) => ({ ...prev, ...JSON.parse(saved) })); } catch {}
      }
    };
    window.addEventListener('maati_contact_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      isMounted = false;
      window.removeEventListener('maati_contact_updated', sync);
      window.removeEventListener('storage', sync);
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
  const [content, setContent] = useState<PrintMenuContent>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('maati_admin_print_menu');
      if (saved) {
        try { return { ...DEFAULT_PRINT_MENU, ...JSON.parse(saved) }; } catch {}
      }
    }
    return DEFAULT_PRINT_MENU;
  });

  useEffect(() => {
    let isMounted = true;
    const sync = () => {
      if (!isMounted) return;
      const saved = localStorage.getItem('maati_admin_print_menu');
      if (saved) {
        try { setContent((prev) => ({ ...prev, ...JSON.parse(saved) })); } catch {}
      }
    };
    window.addEventListener('maati_print_menu_updated', sync);
    window.addEventListener('storage', sync);
    return () => {
      isMounted = false;
      window.removeEventListener('maati_print_menu_updated', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return { content };
}

