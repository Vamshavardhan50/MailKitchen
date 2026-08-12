import { useState, useEffect } from 'react';
import { sanityClient, isSanityConfigured, urlFor } from './sanity';
import {
  MenuItem,
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

export interface FullMenuState {
  breakfast: MenuItem[];
  naanPocket: MenuItem;
  lunchBowls: MenuItem[];
  madeToOrder: MenuItem[];
  desserts: MenuItem[];
  coldDrinks: MenuItem[];
  hotDrinks: MenuItem[];
  alcoholic: MenuItem[];
  cocktails: MenuItem[];
  isLoading: boolean;
  isFromSanity: boolean;
}

const DEFAULT_MENU_STATE: FullMenuState = {
  breakfast: BREAKFAST_ITEMS,
  naanPocket: NAAN_POCKET_ITEM,
  lunchBowls: HAUSSPEZIALITAETEN_ITEMS,
  madeToOrder: AUF_BESTELLUNG_ITEMS,
  desserts: NACHTISCH_ITEMS,
  coldDrinks: COLD_DRINKS,
  hotDrinks: HOT_DRINKS,
  alcoholic: ALKOHOLISCHE_GETRAENKE,
  cocktails: COCKTAILS,
  isLoading: false,
  isFromSanity: false
};

/**
 * GROQ query to fetch all menu items from Sanity
 */
const MENU_GROQ_QUERY = `*[_type == "menuItem"] | order(order asc, titleEn asc) {
  _id,
  id,
  titleDe,
  titleEn,
  descDe,
  descEn,
  price,
  badgeDe,
  badgeEn,
  isSpicy,
  isVeganLeaf,
  category,
  "img": image.asset->url
}`;

/**
 * Custom React Hook to fetch live menu items from Sanity CMS with fallback
 */
export function useSanityMenu() {
  const [menu, setMenu] = useState<FullMenuState>(DEFAULT_MENU_STATE);

  useEffect(() => {
    if (!isSanityConfigured) {
      return;
    }

    let isMounted = true;

    async function fetchMenuFromSanity() {
      try {
        const items = await sanityClient.fetch<any[]>(MENU_GROQ_QUERY);
        if (!items || !Array.isArray(items) || items.length === 0) return;

        const breakfast: MenuItem[] = [];
        let naanPocket: MenuItem = NAAN_POCKET_ITEM;
        const lunchBowls: MenuItem[] = [];
        const madeToOrder: MenuItem[] = [];
        const desserts: MenuItem[] = [];
        const coldDrinks: MenuItem[] = [];
        const hotDrinks: MenuItem[] = [];
        const alcoholic: MenuItem[] = [];
        const cocktails: MenuItem[] = [];

        items.forEach((item) => {
          const menuItem: MenuItem = {
            id: item.id || item._id,
            titleDe: item.titleDe || item.titleEn,
            titleEn: item.titleEn || item.titleDe,
            descDe: item.descDe,
            descEn: item.descEn,
            price: item.price,
            badgeDe: item.badgeDe,
            badgeEn: item.badgeEn,
            isSpicy: item.isSpicy,
            isVeganLeaf: item.isVeganLeaf,
            img: item.img || (item.image ? urlFor(item.image).url() : undefined)
          };

          const cat = (item.category || '').toLowerCase();

          if (cat.includes('breakfast') || cat.includes('frühstück')) {
            breakfast.push(menuItem);
          } else if (cat.includes('naan') || cat.includes('pocket')) {
            naanPocket = menuItem;
          } else if (cat.includes('lunch') || cat.includes('bowl') || cat.includes('haus')) {
            lunchBowls.push(menuItem);
          } else if (cat.includes('order') || cat.includes('bestellung')) {
            madeToOrder.push(menuItem);
          } else if (cat.includes('dessert') || cat.includes('nachtisch')) {
            desserts.push(menuItem);
          } else if (cat.includes('cold') || cat.includes('kalt')) {
            coldDrinks.push(menuItem);
          } else if (cat.includes('hot') || cat.includes('heiß') || cat.includes('tea') || cat.includes('chai')) {
            hotDrinks.push(menuItem);
          } else if (cat.includes('beer') || cat.includes('alcohol') || cat.includes('bier')) {
            alcoholic.push(menuItem);
          } else if (cat.includes('cocktail')) {
            cocktails.push(menuItem);
          } else {
            lunchBowls.push(menuItem);
          }
        });

        if (isMounted) {
          setMenu({
            breakfast: breakfast.length > 0 ? breakfast : BREAKFAST_ITEMS,
            naanPocket: naanPocket || NAAN_POCKET_ITEM,
            lunchBowls: lunchBowls.length > 0 ? lunchBowls : HAUSSPEZIALITAETEN_ITEMS,
            madeToOrder: madeToOrder.length > 0 ? madeToOrder : AUF_BESTELLUNG_ITEMS,
            desserts: desserts.length > 0 ? desserts : NACHTISCH_ITEMS,
            coldDrinks: coldDrinks.length > 0 ? coldDrinks : COLD_DRINKS,
            hotDrinks: hotDrinks.length > 0 ? hotDrinks : HOT_DRINKS,
            alcoholic: alcoholic.length > 0 ? alcoholic : ALKOHOLISCHE_GETRAENKE,
            cocktails: cocktails.length > 0 ? cocktails : COCKTAILS,
            isLoading: false,
            isFromSanity: true
          });
        }
      } catch (err) {
        console.warn('Sanity fetch fallback to local menu items:', err);
      }
    }

    fetchMenuFromSanity();

    return () => {
      isMounted = false;
    };
  }, []);

  return menu;
}
