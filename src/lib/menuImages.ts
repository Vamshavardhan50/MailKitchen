import { urlFor } from './sanity';
import type { SanityMenuItem, SanityCategoryWithItems } from './sanityService';

export function normalizeMenuItem(item: SanityMenuItem): SanityMenuItem {
  let img = item.img;
  if (!img && item.image) {
    try { img = typeof item.image === 'string' ? item.image : urlFor(item.image).url(); }
    catch { img = undefined; }
  }
  return {
    ...item,
    _id: item._id || item.id || (typeof item.slug === 'object' ? item.slug.current : item.slug) || item.titleEn,
    id: item.id || (typeof item.slug === 'object' ? item.slug.current : item.slug) || item._id,
    img,
  };
}

export function normalizeMenuCategories(categories: SanityCategoryWithItems[]) {
  return categories.map(category => ({ ...category, items: (category.items || []).map(normalizeMenuItem) }));
}
