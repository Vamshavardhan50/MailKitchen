import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import { createAdminApi } from '../server/admin-api.mjs';

async function fixture(t, options = {}) {
  const documents = new Map([['menuCategoriesData', { _id: 'menuCategoriesData', _type: 'menuCategoriesData', _rev: 'r1', categories: [{ _id: 'desserts', items: [{ id: 'mithai', img: 'correct-photo', price: '€2,5' }] }], preserved: 'keep' }]]);
  let sequence = 1;
  const client = {
    async getDocument(id) { return structuredClone(documents.get(id)); },
    patch(id) {
      let revision, fields;
      const patch = {
        ifRevisionId(value) { revision = value; return patch; },
        set(value) { fields = value; return patch; },
        async commit() {
          if (options.race || documents.get(id)._rev !== revision) throw Object.assign(new Error('Conflict'), { statusCode: 409 });
          const doc = { ...documents.get(id), ...fields, _rev: `r${++sequence}` };
          documents.set(id, doc); return doc;
        },
      };
      return patch;
    },
    async create(doc) {
      if (documents.has(doc._id)) throw Object.assign(new Error('Already exists'), { statusCode: 409 });
      documents.set(doc._id, { ...doc, _rev: `r${++sequence}` });
      return documents.get(doc._id);
    },
  };
  const handle = createAdminApi({ client, password: 'test-only-password', ...options });
  const server = http.createServer(async (req, res) => {
    if (!await handle(req, res, new URL(req.url, 'http://localhost').pathname)) { res.writeHead(404); res.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  t.after(() => new Promise(resolve => { server.closeAllConnections(); server.close(resolve); }));
  const base = `http://127.0.0.1:${server.address().port}`;
  let cookie = '';
  const request = (route, body, authenticated = true) => fetch(base + route, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', ...(authenticated && cookie ? { Cookie: cookie } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const login = async () => {
    const response = await request('/api/admin/login', { password: 'test-only-password' });
    cookie = response.headers.get('set-cookie').split(';')[0];
    return response;
  };
  return { documents, request, login };
}

test('anonymous visitors and old localStorage sync cannot write to Sanity', async t => {
  const f = await fixture(t);
  assert.equal((await f.request('/api/admin/content', { section: 'menu', fields: { categories: [] } })).status, 401);
  assert.equal((await f.request('/api/admin/login', { password: 'wrong' })).status, 401);
  await f.login();
  assert.equal((await f.request('/api/sync', { menu: [] })).status, 410);
  assert.equal(f.documents.get('menuCategoriesData')._rev, 'r1');
});

test('stale browser copies cannot overwrite corrected menu photos', async t => {
  const f = await fixture(t); await f.login();
  for (const baseRevision of [undefined, 'old-revision']) {
    const response = await f.request('/api/admin/content', { section: 'menu', fields: { categories: [] }, baseRevision });
    assert.equal(response.status, 409);
  }
  assert.equal(f.documents.get('menuCategoriesData').categories[0].items[0].img, 'correct-photo');
});

test('confirmed publishing returns its revision and supports a deliberately empty menu', async t => {
  const f = await fixture(t); await f.login();
  const response = await f.request('/api/admin/content', { section: 'menu', fields: { categories: [], _id: 'wrong', _type: 'wrong' }, baseRevision: 'r1' });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).revision, 'r2');
  const doc = f.documents.get('menuCategoriesData');
  assert.deepEqual(doc.categories, []);
  assert.equal(doc._id, 'menuCategoriesData');
  assert.equal(doc._type, 'menuCategoriesData');
  assert.equal(doc.preserved, 'keep');
});

test('a concurrent Sanity change between read and commit fails safely', async t => {
  const f = await fixture(t, { race: true }); await f.login();
  const response = await f.request('/api/admin/content', { section: 'menu', fields: { categories: [] }, baseRevision: 'r1' });
  assert.equal(response.status, 409);
  assert.equal(f.documents.get('menuCategoriesData')._rev, 'r1');
});

test('invalid sections, malformed menus and unavailable backend report failure', async t => {
  const f = await fixture(t); await f.login();
  assert.equal((await f.request('/api/admin/content', { section: '__proto__', fields: {} })).status, 400);
  assert.equal((await f.request('/api/admin/content', { section: 'menu', fields: { categories: [{}] }, baseRevision: 'r1' })).status, 400);
  const offline = await fixture(t, { client: null }); await offline.login();
  assert.equal((await offline.request('/api/admin/content', { section: 'menu', fields: {} })).status, 503);
});

test('logout and session expiration revoke publishing access', async t => {
  let now = 0;
  const f = await fixture(t, { now: () => now }); await f.login();
  assert.equal((await f.request('/api/admin/session')).status, 200);
  await f.request('/api/admin/logout', {});
  assert.equal((await f.request('/api/admin/session')).status, 401);
  await f.login(); now = 13 * 60 * 60 * 1000;
  assert.equal((await f.request('/api/admin/session')).status, 401);
});
