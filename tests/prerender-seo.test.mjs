import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '..', 'dist');

test('pre-rendered /de/menu contains dedicated German title, self-referencing canonical, reciprocal hreflang, H1 and JSON-LD', () => {
  const deMenuFile = path.join(DIST_DIR, 'de', 'menu', 'index.html');
  assert.ok(fs.existsSync(deMenuFile), 'dist/de/menu/index.html must exist');

  const content = fs.readFileSync(deMenuFile, 'utf8');

  // Check language
  assert.match(content, /<html\s+lang=["']de["']>/i);

  // Check canonical points to /de/menu NOT homepage!
  assert.match(content, /<link\s+rel=["']canonical["']\s+href=["']https:\/\/maatikitchen\.com\/de\/menu["']\s*\/?>/i);
  assert.doesNotMatch(content, /<link\s+rel=["']canonical["']\s+href=["']https:\/\/maatikitchen\.com\/["']\s*\/?>/i);

  // Check reciprocal hreflangs
  assert.match(content, /<link\s+rel=["']alternate["']\s+hreflang=["']en["']\s+href=["']https:\/\/maatikitchen\.com\/menu["']/i);
  assert.match(content, /<link\s+rel=["']alternate["']\s+hreflang=["']de["']\s+href=["']https:\/\/maatikitchen\.com\/de\/menu["']/i);
  assert.match(content, /<link\s+rel=["']alternate["']\s+hreflang=["']x-default["']\s+href=["']https:\/\/maatikitchen\.com\/menu["']/i);

  // Check German Title & H1
  assert.match(content, /<title>Speisekarte: Indische Bowls &amp; Naan Pockets \| MAATI Kitchen Berlin Mitte<\/title>/i);
  assert.match(content, /<h1[^>]*>Speisekarte: Moderne indische Bowls, Naan Pockets &amp; Chai<\/h1>/i);

  // Check JSON-LD
  assert.match(content, /<script\s+type=["']application\/ld\+json["']/i);
  assert.match(content, /"Menu"/);
});

test('pre-rendered /de/catering contains dedicated German metadata, server-rendered H1 "Indisches Catering Berlin", visible Service/area and Restaurant JSON-LD', () => {
  const deCateringFile = path.join(DIST_DIR, 'de', 'catering', 'index.html');
  assert.ok(fs.existsSync(deCateringFile), 'dist/de/catering/index.html must exist');

  const content = fs.readFileSync(deCateringFile, 'utf8');

  // Check language
  assert.match(content, /<html\s+lang=["']de["']>/i);

  // Check canonical points to /de/catering
  assert.match(content, /<link\s+rel=["']canonical["']\s+href=["']https:\/\/maatikitchen\.com\/de\/catering["']\s*\/?>/i);

  // Check reciprocal hreflangs
  assert.match(content, /<link\s+rel=["']alternate["']\s+hreflang=["']en["']\s+href=["']https:\/\/maatikitchen\.com\/catering["']/i);
  assert.match(content, /<link\s+rel=["']alternate["']\s+hreflang=["']de["']\s+href=["']https:\/\/maatikitchen\.com\/de\/catering["']/i);

  // Check exact H1 specified by user: "Indisches Catering Berlin"
  assert.match(content, /<h1[^>]*>Indisches Catering Berlin<\/h1>/i);

  // Check visible Service & area served text
  assert.match(content, /Service:\s*Indisches Firmen- &amp; Event-Catering/i);
  assert.match(content, /Einsatzgebiet:\s*Berlin/i);

  // Check Restaurant JSON-LD
  assert.match(content, /"Restaurant"/);
  assert.match(content, /"Service"/);
  assert.match(content, /"serviceType":\s*"Catering"/);
});

test('pre-rendered /catering in English contains self-referencing canonical and reciprocal hreflang', () => {
  const enCateringFile = path.join(DIST_DIR, 'catering', 'index.html');
  assert.ok(fs.existsSync(enCateringFile), 'dist/catering/index.html must exist');

  const content = fs.readFileSync(enCateringFile, 'utf8');

  // Check language
  assert.match(content, /<html\s+lang=["']en["']>/i);

  // Check canonical points to /catering
  assert.match(content, /<link\s+rel=["']canonical["']\s+href=["']https:\/\/maatikitchen\.com\/catering["']\s*\/?>/i);

  // Check reciprocal hreflangs
  assert.match(content, /<link\s+rel=["']alternate["']\s+hreflang=["']en["']\s+href=["']https:\/\/maatikitchen\.com\/catering["']/i);
  assert.match(content, /<link\s+rel=["']alternate["']\s+hreflang=["']de["']\s+href=["']https:\/\/maatikitchen\.com\/de\/catering["']/i);

  // Check English H1
  assert.match(content, /<h1[^>]*>Indian Catering Berlin<\/h1>/i);

  // Check visible Service & area served text
  assert.match(content, /Service:\s*Indian Corporate &amp; Event Catering/i);
  assert.match(content, /Area Served:\s*Berlin/i);
});
