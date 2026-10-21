import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { createClient } from '@sanity/client';

// Add back verified missing dishes, without replacing any current menu items.
const apply = process.argv.includes('--apply');
const env = { ...process.env };
for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match && !env[match[1]]) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
}
const client = createClient({ projectId: env.SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET || env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', useCdn: false, token: env.SANITY_API_TOKEN });
const compiled = ts.transpileModule(fs.readFileSync('src/data/june2026MenuData.ts', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.ESNext },
}).outputText;
const data = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const doc = await client.getDocument('menuCategoriesData');
if (!doc?.categories) throw new Error('Published menu not found');
fs.mkdirSync('.task-backups', { recursive: true });
fs.writeFileSync(`.task-backups/menu-before-restoration-${Date.now()}.json`, JSON.stringify(doc, null, 2));
const before = new Map(doc.categories.flatMap(c => c.items).map(item => [item.id || item._id, JSON.stringify(item)]));
const set = {};
for (const [categoryId, originals, foodType] of [
  ['cat-cocktails', data.COCKTAILS, 'vegan'],
  ['cat-breakfast', data.BREAKFAST_ITEMS, 'vegetarian'],
]) {
  const index = doc.categories.findIndex(c => c._id === categoryId);
  if (index < 0) throw new Error(`Missing category ${categoryId}`);
  const current = doc.categories[index].items;
  const known = new Set(doc.categories.flatMap(c => c.items).map(item => item.id || item._id));
  const missing = originals.filter(item => !known.has(item.id));
  if (!missing.length) continue;
  console.log(categoryId, 'restoring', missing.map(item => item.titleEn).join(', '));
  const restored = [];
  for (const item of missing) {
    const entry = { ...item, _id: item.id, available: true, foodType };
    if (apply && item.img?.startsWith('/assets/')) {
      const file = path.resolve('public', `.${item.img}`);
      const asset = await client.assets.upload('image', fs.createReadStream(file), { filename: path.basename(file) });
      entry.img = asset.url;
      entry.image = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
    }
    // Historical cocktail-N files are restaurant interiors. Missing photos stay blank.
    restored.push(entry);
  }
  set[`categories[${index}].items`] = [...current, ...restored];
}
if (apply && Object.keys(set).length) {
  await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit({ visibility: 'sync' });
  const after = await client.getDocument(doc._id);
  for (const item of after.categories.flatMap(c => c.items)) {
    const original = before.get(item.id || item._id);
    if (original && original !== JSON.stringify(item)) throw new Error('An existing menu card changed unexpectedly');
  }
  console.log('Verified published category counts:', after.categories.map(c => `${c.name}: ${c.items.length}`).join('; '));
} else console.log(apply ? 'All verified dishes are already published.' : 'Dry run complete. Use --apply to restore missing items.');
