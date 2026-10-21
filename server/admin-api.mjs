import { randomBytes, timingSafeEqual } from 'node:crypto';

const SECTIONS = {
  settings: ['siteSettings', 'siteSettings'], homepage: ['homepage', 'homepage'],
  events: ['eventsContent', 'eventsContent'], contact: ['contactContent', 'contactContent'],
  printMenu: ['printMenuContent', 'printMenuContent'], menu: ['menuCategoriesData', 'menuCategoriesData'],
  gallery: ['galleryData', 'galleryData'], catering: ['cateringPageContent', 'cateringPageContent'],
  jobs: ['jobsPageContent', 'jobsPageContent'], about: ['aboutPageContent', 'aboutPageContent'],
  legal: ['legalPageContent', 'legalPageContent'], landingPages: ['landingPagesContent', 'landingPagesContent'],
  reservation: ['reservationContent', 'reservationContent'],
};

const cleanFields = fields => Object.fromEntries(Object.entries(fields).filter(([key]) => !key.startsWith('_')));

export function createAdminApi({ client, password, now = Date.now }) {
  const sessions = new Map();
  const attempts = new Map();
  const sessionAge = 12 * 60 * 60 * 1000;
  const send = (res, status, data) => {
    res.writeHead(status, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
    res.end(JSON.stringify(data));
  };
  const readBody = async req => {
    let size = 0;
    const chunks = [];
    for await (const chunk of req) {
      size += chunk.length;
      if (size > 10 * 1024 * 1024) throw new Error('Content exceeds 10 MB');
      chunks.push(chunk);
    }
    return JSON.parse(Buffer.concat(chunks).toString() || '{}');
  };
  return async (req, res, pathname) => {
    const inboxRoute = /^\/api\/(inquiries|applications)(\/(status|delete))?$/.test(pathname);
    if (!pathname.startsWith('/api/admin/') && pathname !== '/api/sync' && !inboxRoute) return false;
    try {
      const secure = req.socket.encrypted || req.headers['x-forwarded-proto'] === 'https';
      const cookie = value => `maati_admin_session=${value}; HttpOnly; SameSite=Strict; Path=/api/; Max-Age=${value ? sessionAge / 1000 : 0}${secure ? '; Secure' : ''}`;
      const session = /(?:^|;\s*)maati_admin_session=([^;]+)/.exec(req.headers.cookie || '')?.[1];
      if (pathname === '/api/admin/login' && req.method === 'POST') {
        if (!password) { send(res, 503, { success: false, error: 'Staff sign-in has not been set up yet. Please contact your website manager.' }); return true; }
        const address = req.socket.remoteAddress || 'unknown';
        const attempt = attempts.get(address);
        if (attempt && attempt.until > now() && attempt.count >= 10) { send(res, 429, { success: false, error: 'Too many login attempts. Try again in 15 minutes.' }); return true; }
        const body = await readBody(req);
        const candidate = Buffer.from(typeof body.password === 'string' ? body.password : '');
        const expected = Buffer.from(password);
        if (candidate.length !== expected.length || !timingSafeEqual(candidate, expected)) {
          attempts.set(address, { count: attempt && attempt.until > now() ? attempt.count + 1 : 1, until: now() + 900000 });
          send(res, 401, { success: false, error: 'Incorrect password.' }); return true;
        }
        attempts.delete(address);
        for (const [key, expires] of sessions) if (expires < now()) sessions.delete(key);
        const token = randomBytes(32).toString('hex');
        sessions.set(token, now() + sessionAge);
        res.setHeader('Set-Cookie', cookie(token));
        send(res, 200, { success: true }); return true;
      }
      if (pathname === '/api/admin/logout' && req.method === 'POST') {
        sessions.delete(session);
        res.setHeader('Set-Cookie', cookie(''));
        send(res, 200, { success: true }); return true;
      }
      if (!session || (sessions.get(session) || 0) <= now()) {
        send(res, 401, { success: false, error: 'Sign in to Studio again before publishing.' }); return true;
      }
      // Existing inbox handlers share the same staff session as content editing.
      if (inboxRoute) return false;
      if (pathname === '/api/admin/session' && req.method === 'GET') {
        send(res, 200, { success: true, publishingReady: Boolean(client) }); return true;
      }
      if (pathname === '/api/admin/image' && req.method === 'POST') {
        if (!client) { send(res, 503, { success: false, error: 'Photo uploads are unavailable. Ask the website manager to check the publishing connection.' }); return true; }
        const { dataUrl, filename } = await readBody(req);
        const match = typeof dataUrl === 'string' && /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(dataUrl);
        if (!match) { send(res, 400, { success: false, error: 'Choose a JPG, PNG or WebP photo.' }); return true; }
        const bytes = Buffer.from(match[2], 'base64');
        if (!bytes.length || bytes.length > 6 * 1024 * 1024) { send(res, 400, { success: false, error: 'Choose a photo smaller than 6 MB.' }); return true; }
        const asset = await client.assets.upload('image', bytes, {
          filename: (typeof filename === 'string' ? filename : 'maati-photo').replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 100),
          contentType: match[1],
        });
        send(res, 200, { success: true, url: asset.url }); return true;
      }
      if (pathname !== '/api/admin/content' || req.method !== 'POST') {
        send(res, 410, { success: false, error: 'Reload Studio to use the current publishing API.' }); return true;
      }
      if (!client) { send(res, 503, { success: false, error: 'Publishing is unavailable. Please ask your website manager to check the publishing connection.' }); return true; }
      const { section, fields, baseRevision } = await readBody(req);
      if (!Object.hasOwn(SECTIONS, section) || !fields || typeof fields !== 'object' || Array.isArray(fields)) {
        send(res, 400, { success: false, error: 'Invalid content section.' }); return true;
      }
      const [id, type] = SECTIONS[section];
      const current = await client.getDocument(id);
      if (current && current._rev !== baseRevision) {
        send(res, 409, { success: false, error: 'This content changed in Sanity or another browser. Reload Studio before editing again.' }); return true;
      }
      if (section === 'menu' && (!Array.isArray(fields.categories) || fields.categories.some(c => !c._id || !Array.isArray(c.items)))) {
        send(res, 400, { success: false, error: 'Invalid menu categories.' }); return true;
      }
      const values = cleanFields(fields);
      const saved = current
        ? await client.patch(id).ifRevisionId(baseRevision).set(values).commit({ visibility: 'sync' })
        : await client.create({ ...values, _id: id, _type: type }, { visibility: 'sync' });
      send(res, 200, { success: true, revision: saved._rev, message: 'Published to Sanity Cloud.' });
    } catch (error) {
      send(res, error.statusCode === 409 ? 409 : 500, { success: false, error: error.statusCode === 409 ? 'Content changed while saving. Reload Studio.' : error.message || 'Publishing failed.' });
    }
    return true;
  };
}
