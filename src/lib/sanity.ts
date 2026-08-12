import { LunchItem, BreakfastItem, DrinkItem, LUNCH_ITEMS, BREAKFAST_ITEMS, COLD_DRINKS, HOT_DRINKS } from '../data/content';

// Configurable Sanity Project Credentials
const metaEnv = (import.meta as any).env || {};

export const SANITY_CONFIG = {
  projectId: metaEnv.VITE_SANITY_PROJECT_ID || 'demo_project_id',
  dataset: metaEnv.VITE_SANITY_DATASET || 'production',
  apiVersion: '2021-10-21',
  useCdn: true,
};


/**
 * Fetch menu items from Sanity CMS with fallback to local items
 */
export async function fetchSanityMenuItems() {
  if (!SANITY_CONFIG.projectId || SANITY_CONFIG.projectId === 'demo_project_id') {
    console.log('Sanity.io: Using local menu data (Provide VITE_SANITY_PROJECT_ID to connect live Sanity CMS).');
    return {
      lunch: LUNCH_ITEMS,
      breakfast: BREAKFAST_ITEMS,
      coldDrinks: COLD_DRINKS,
      hotDrinks: HOT_DRINKS,
    };
  }

  try {
    const query = `*[_type in ["lunchItem", "breakfastItem", "drinkItem"]]{ ... }`;
    const url = `https://${SANITY_CONFIG.projectId}.api.sanity.io/v${SANITY_CONFIG.apiVersion}/data/query/${SANITY_CONFIG.dataset}?query=${encodeURIComponent(query)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (data.result && Array.isArray(data.result) && data.result.length > 0) {
      const lunch: LunchItem[] = [];
      const breakfast: BreakfastItem[] = [];
      const coldDrinks: DrinkItem[] = [];
      const hotDrinks: DrinkItem[] = [];

      data.result.forEach((item: any) => {
        if (item._type === 'lunchItem') lunch.push(item);
        else if (item._type === 'breakfastItem') breakfast.push(item);
        else if (item._type === 'drinkItem') {
          if (item.isHot) hotDrinks.push(item);
          else coldDrinks.push(item);
        }
      });

      return {
        lunch: lunch.length > 0 ? lunch : LUNCH_ITEMS,
        breakfast: breakfast.length > 0 ? breakfast : BREAKFAST_ITEMS,
        coldDrinks: coldDrinks.length > 0 ? coldDrinks : COLD_DRINKS,
        hotDrinks: hotDrinks.length > 0 ? hotDrinks : HOT_DRINKS,
      };
    }
  } catch (error) {
    console.warn('Sanity fetch fallback to local data:', error);
  }

  return {
    lunch: LUNCH_ITEMS,
    breakfast: BREAKFAST_ITEMS,
    coldDrinks: COLD_DRINKS,
    hotDrinks: HOT_DRINKS,
  };
}
