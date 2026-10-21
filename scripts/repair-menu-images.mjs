import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { createClient } from '@sanity/client';

// Dry run by default. Only repair known local photo paths; preserve custom CMS photos.
const apply = process.argv.includes('--apply');
const env = { ...process.env };
for (const line of fs.readFileSync('.env', 'utf8').split(/\r?\n/)) {
  const match = line.match(/^([A-Z_]+)=(.*)$/);
  if (match && !env[match[1]]) env[match[1]] = match[2].replace(/^["']|["']$/g, '');
}
const client = createClient({
  projectId: env.SANITY_PROJECT_ID || env.VITE_SANITY_PROJECT_ID,
  dataset: env.SANITY_DATASET || env.VITE_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01', useCdn: false,
  token: env.SANITY_API_TOKEN,
});
const source = fs.readFileSync('src/data/june2026MenuData.ts', 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const data = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const originals = Object.values(data).flat().filter(item => item?.id && item?.img);
const byId = new Map(originals.map(item => [item.id, item]));
const doc = await client.getDocument('menuCategoriesData');
if (!doc?.categories) throw new Error('Published menuCategoriesData was not found');
const backupDir = path.resolve('.task-backups');
fs.mkdirSync(backupDir, { recursive: true });
const backupPath = path.join(backupDir, `menu-${Date.now()}.json`);
fs.writeFileSync(backupPath, JSON.stringify(doc, null, 2));
const set = {};
const uploaded = new Map();
for (const [categoryIndex, category] of doc.categories.entries()) {
  for (const [itemIndex, item] of (category.items || []).entries()) {
    const original = byId.get(item.id || item._id);
    if (!original || !item.img?.startsWith('/assets/')) continue;
    const file = path.resolve('public', `.${original.img}`);
    if (!file.startsWith(path.resolve('public') + path.sep) || !fs.existsSync(file)) {
      throw new Error(`Missing original photograph for ${item.titleEn}`);
    }
    console.log(`${item.titleEn}: ${item.img} -> ${original.img}`);
    if (!apply) continue;
    let asset = uploaded.get(file);
    if (!asset) {
      asset = await client.assets.upload('image', fs.createReadStream(file), { filename: path.basename(file) });
      uploaded.set(file, asset);
    }
    const prefix = `categories[${categoryIndex}].items[${itemIndex}]`;
    set[`${prefix}.img`] = asset.url;
    set[`${prefix}.image`] = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
  }
}
if (apply && Object.keys(set).length) {
  await client.patch(doc._id).ifRevisionId(doc._rev).set(set).commit();
  const after = await client.getDocument(doc._id);
  // Image repair must never change dishes, prices, order, or availability.
  const withoutImages = value => JSON.stringify(value.categories, (key, val) => ['img', 'image'].includes(key) ? undefined : val);
  if (withoutImages(doc) !== withoutImages(after)) throw new Error('Menu content changed during repair; inspect backup');
  const urls = [...new Set(after.categories.flatMap(c => c.items || []).map(i => i.img).filter(Boolean))];
  for (const url of urls) {
    const response = await fetch(url.startsWith('/') ? `https://maatikitchen.com${url}` : url, { method: 'HEAD' });
    if (!response.ok || !response.headers.get('content-type')?.startsWith('image/')) throw new Error(`Image unavailable: ${url}`);
  }
  console.log(`Verified ${urls.length} image URLs. Menu content preserved. Backup: ${backupPath}`);
} else {
  console.log(`Dry run complete. Backup: ${backupPath}. Use --apply to upload the original photos and patch only image fields.`);
}
