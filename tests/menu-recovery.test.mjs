import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const compiled = ts.transpileModule(fs.readFileSync(new URL('../src/lib/menuRecovery.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { recoverMissingCocktails } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);
const menuCompiled = ts.transpileModule(fs.readFileSync(new URL('../src/data/june2026MenuData.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { COCKTAILS, BREAKFAST_ITEMS } = await import(`data:text/javascript;base64,${Buffer.from(menuCompiled).toString('base64')}`);
const item = index => ({ _id: `cocktail-${index}`, id: `cocktail-${index}`, titleEn: `Cocktail ${index}`, price: '€7,5', img: 'correct-image', available: true });
const category = items => ({ _id: 'cat-cocktails', name: 'Cocktails', items });

test('10 browser cocktail cards and 2 published cards recover exactly the missing 8', () => {
  const published = [category([item(1), item(2)])];
  const draft = [category(Array.from({ length: 10 }, (_, index) => item(index + 1)))];
  draft[0].items[0].img = 'old-wrong-photo';
  draft[0].items[0].price = '€1';
  const result = recoverMissingCocktails(published, draft);
  assert.equal(result.added.length, 8);
  assert.equal(result.categories[0].items.length, 10);
  assert.equal(result.categories[0].items[0].img, 'correct-image');
  assert.equal(result.categories[0].items[0].price, '€7,5');
  assert.equal(published[0].items.length, 2);
  assert.equal(recoverMissingCocktails(result.categories, draft).added.length, 0);
});

test('recovery does not resurrect removed dishes in other categories', () => {
  const result = recoverMissingCocktails([category([])], [{ _id: 'cat-desserts', name: 'Desserts', items: [item(1)] }]);
  assert.equal(result.added.length, 0);
});

test('same cocktail name with a changed ID is not duplicated', () => {
  const result = recoverMissingCocktails([category([item(1)])], [category([{ ...item(1), _id: 'different', id: 'different' }])]);
  assert.equal(result.added.length, 0);
});

test('malformed storage is ignored and recovered cards keep availability', () => {
  assert.equal(recoverMissingCocktails([], {}).added.length, 0);
  const result = recoverMissingCocktails([], [category([null, { titleEn: 'No price' }, { ...item(3), available: false }])]);
  assert.equal(result.added.length, 1);
  assert.equal(result.added[0].available, false);
  assert.equal(result.categories[0]._id, 'cat-cocktails');
});

test('the checked-in menu retains the ten historical cocktails and missing breakfast card', () => {
  assert.equal(COCKTAILS.length, 10);
  for (const id of ['mojito', 'negroni', 'moscow-mule', 'tequila-sunrise', 'long-island-tea', 'gin-tonic', 'nimbu-pani-julep', 'spicy-mango-martini']) {
    assert.ok(COCKTAILS.some(item => item.id === id), `Missing restored cocktail: ${id}`);
  }
  assert.ok(BREAKFAST_ITEMS.some(item => item.id === 'croissant-turmeric'));
  assert.ok(COCKTAILS.every(item => !/\/cocktail-\d+\.jpg$/.test(item.img || '')), 'Restaurant interior photos must never return as cocktail images');
});
