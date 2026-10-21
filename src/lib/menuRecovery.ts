import type { SanityCategoryWithItems, SanityMenuItem } from './sanityService';

const label = (value?: string) => (value || '').trim().toLocaleLowerCase();
const isCocktails = (category: SanityCategoryWithItems) => category._id === 'cat-cocktails' || label(category.name).includes('cocktail');
const sameItem = (a: SanityMenuItem, b: SanityMenuItem) =>
  Boolean((a.id && (a.id === b.id || a.id === b._id)) || (a._id && (a._id === b._id || a._id === b.id))) ||
  Boolean(label(a.titleEn) && label(a.titleEn) === label(b.titleEn));

// Recover additions only. Existing published prices/photos always win over an old browser copy.
export function recoverMissingCocktails(published: SanityCategoryWithItems[], draft: unknown) {
  const categories = published.map(category => ({ ...category, items: [...category.items] }));
  const added: SanityMenuItem[] = [];
  if (!Array.isArray(draft)) return { categories, added };
  for (const source of draft) {
    if (!source || typeof source !== 'object' || !isCocktails(source) || !Array.isArray(source.items)) continue;
    let target = categories.find(isCocktails);
    for (const candidate of source.items) {
      if (!candidate || typeof candidate.titleEn !== 'string' || !candidate.titleEn.trim() || typeof candidate.price !== 'string') continue;
      if (categories.some(category => category.items.some(item => sameItem(item, candidate)))) continue;
      if (!target) {
        target = { ...source, _id: source._id || 'cat-cocktails', name: source.name || 'Cocktails', items: [] };
        categories.push(target!);
      }
      const id = candidate._id || candidate.id || `recovered-cocktail-${added.length}-${label(candidate.titleEn).replace(/[^a-z0-9]+/g, '-')}`;
      const recovered = { ...candidate, _id: id, id: candidate.id || id, titleDe: candidate.titleDe || candidate.titleEn };
      target!.items.push(recovered);
      added.push(recovered);
    }
  }
  return { categories, added };
}
