import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
const compiled = ts.transpileModule(fs.readFileSync(new URL('../src/lib/menuEditing.ts', import.meta.url), 'utf8'), { compilerOptions: { module: ts.ModuleKind.ESNext } }).outputText;
const { updateMenuItem } = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString('base64')}`);

test('changing price or photo preserves the dish position and other cards', () => {
  const original = [{ _id: 'desserts', items: [{ _id: 'a', price: '1' }, { _id: 'b', price: '2', img: 'correct' }, { _id: 'c', price: '3' }] }];
  const result = updateMenuItem(original, { ...original[0].items[1], price: '4' }, 'desserts');
  assert.deepEqual(result[0].items.map(item => item._id), ['a', 'b', 'c']);
  assert.equal(result[0].items[1].img, 'correct');
  assert.equal(original[0].items[1].price, '2');
});

test('moving a dish removes its original copy and retains target category order', () => {
  const dish = { _id: 'drink', price: '4', img: 'correct' };
  const result = updateMenuItem([{ _id: 'first', items: [dish] }, { _id: 'second', items: [{ _id: 'other' }] }], dish, 'second');
  assert.equal(result[0].items.length, 0);
  assert.deepEqual(result[1].items.map(item => item._id), ['other', 'drink']);
});
