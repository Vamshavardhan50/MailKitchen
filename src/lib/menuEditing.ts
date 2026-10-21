import type { SanityCategoryWithItems, SanityMenuItem } from './sanityService';

// Editing a price or photo keeps the dish in its existing position.
export function updateMenuItem(categories: SanityCategoryWithItems[], item: SanityMenuItem, target: string) {
  const matches = (candidate: SanityMenuItem) => (candidate._id || candidate.id) === (item._id || item.id);
  const alreadyInTarget = categories.find(cat => cat._id === target)?.items.some(matches);
  return categories.map(cat => ({ ...cat, items: cat._id === target
    ? alreadyInTarget ? cat.items.map(existing => matches(existing) ? item : existing) : [...cat.items, item]
    : cat.items.filter(existing => !matches(existing)),
  }));
}
