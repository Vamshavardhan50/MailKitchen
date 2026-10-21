import { createAdminApi } from './server/admin-api.mjs';
import http from 'http';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// ESM-safe __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the built frontend directory
const DIST_DIR = path.resolve(__dirname, 'dist');

// Automatically load local .env file if present
function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    try {
      const content = fs.readFileSync(envPath, 'utf8');
      content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const idx = trimmed.indexOf('=');
          const key = trimmed.substring(0, idx).trim();
          const val = trimmed.substring(idx + 1).trim().replace(/^["'](.*)["']$/, '$1');
          if (!process.env[key]) {
            process.env[key] = val;
          }
        }
      });
    } catch (e) {
      console.warn('[MAATI API Server] Note: Could not read .env file:', e.message);
    }
  }
}
loadEnv();

// Load server-side environment variables
const SANITY_PROJECT_ID = process.env.SANITY_PROJECT_ID || process.env.VITE_SANITY_PROJECT_ID || 'ohmgd0hu';
const SANITY_DATASET = process.env.SANITY_DATASET || process.env.VITE_SANITY_DATASET || 'production';
const SANITY_API_VERSION = process.env.SANITY_API_VERSION || '2024-01-01';
const SANITY_API_TOKEN = process.env.SANITY_API_TOKEN || process.env.VITE_SANITY_TOKEN || '';

const PORT = process.env.PORT || 5000;

// Initialize server-only Sanity write client
const writeClient = SANITY_API_TOKEN
  ? createClient({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: SANITY_API_VERSION,
      useCdn: false,
      token: SANITY_API_TOKEN,
    })
  : null;

const handleAdminApi = createAdminApi({ client: writeClient, password: process.env.ADMIN_PASSWORD });

const server = http.createServer(async (req, res) => {
  // CORS Headers for API
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  if (await handleAdminApi(req, res, url.pathname)) return;

  // Health check endpoint
  if (url.pathname === '/api/health' && (req.method === 'GET' || req.method === 'HEAD')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(
      JSON.stringify({
        status: 'ok',
        sanityConfigured: Boolean(writeClient),
        project: SANITY_PROJECT_ID,
        dataset: SANITY_DATASET,
      })
    );
    return;
  }

  // Helper: File paths for local persistence
  const DATA_DIR = path.resolve(process.cwd(), 'src', 'data');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const ENQUIRIES_FILE = path.join(DATA_DIR, 'receivedEnquiries.json');
  const APPLICATIONS_FILE = path.join(DATA_DIR, 'receivedApplications.json');

  const readJson = (file) => {
    try {
      if (fs.existsSync(file)) {
        return JSON.parse(fs.readFileSync(file, 'utf8') || '[]');
      }
    } catch (e) {
      console.warn('Could not read', file, e.message);
    }
    return [];
  };

  const writeJson = (file, data) => {
    try {
      fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error('Could not write', file, e.message);
    }
  };

  // Enquiry Submission Endpoint (Events & Catering)
  if (url.pathname === '/api/enquiry' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { enquiryType, name, email, phone, date, guests, company, message, consent, lang } = payload;

        if (!name || !email || !phone || !date || !guests || !consent) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Missing mandatory fields or consent.' }));
          return;
        }

        const id = `enquiry-${Date.now()}`;
        const newEnquiry = {
          _id: id,
          _type: 'enquirySubmission',
          id,
          enquiryType,
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          date,
          guests: Number(guests),
          company: (company || '').trim(),
          message: (message || '').trim(),
          consent: Boolean(consent),
          lang: lang || 'en',
          status: 'new',
          managerNotes: '',
          receivedAt: new Date().toISOString(),
        };

        // 1. Persist to local JSON file
        const list = readJson(ENQUIRIES_FILE);
        list.unshift(newEnquiry);
        writeJson(ENQUIRIES_FILE, list);

        // 2. Persist to Sanity if configured
        if (writeClient) {
          try {
            await writeClient.createOrReplace(newEnquiry);
            console.log(`[Sanity] Created enquirySubmission document: ${id}`);
          } catch (sanityErr) {
            console.warn('[Sanity Enquiry Write Warning]:', sanityErr.message);
          }
        }

        const subject = `[${enquiryType}] ${date}, ${guests} guests${company ? `, ${company}` : `, ${name}`}`;
        console.log(`[MAATI Enquiry System] New enquiry received:`, subject);

        const acknowledgement = lang === 'de'
          ? 'Vielen Dank für Ihre Anfrage. Wir haben sie erhalten und melden uns innerhalb eines Werktages bei Ihnen. Bei dringenden Anliegen erreichen Sie uns telefonisch unter +49 30 51891367. MAATI Kitchen, Zimmerstrasse 56, 10117 Berlin.'
          : 'Thank you for your enquiry. We have received it and will reply within one working day. If your request is urgent please call us on +49 30 51891367. MAATI Kitchen, Zimmerstrasse 56, 10117 Berlin.';

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: true,
            id,
            subject,
            deliveredTo: 'hello@maatikitchen.com',
            acknowledgement,
            message: 'Enquiry processed and delivered.'
          })
        );
      } catch (err) {
        console.error('[MAATI Enquiry Error]:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Server could not process enquiry' }));
      }
    });
    return;
  }

  // Get Inquiries (for Studio / Admin dashboard)
  if (url.pathname === '/api/inquiries' && req.method === 'GET') {
    const list = readJson(ENQUIRIES_FILE);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, inquiries: list }));
    return;
  }

  // Update Inquiry Status / Notes
  if (url.pathname === '/api/inquiries/status' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', async () => {
      try {
        const { id, status, managerNotes } = JSON.parse(body || '{}');
        const list = readJson(ENQUIRIES_FILE);
        const item = list.find((i) => i._id === id || i.id === id);
        if (item) {
          if (status) item.status = status;
          if (managerNotes !== undefined) item.managerNotes = managerNotes;
          writeJson(ENQUIRIES_FILE, list);

          if (writeClient) {
            try {
              await writeClient.patch(item._id).set({ status: item.status, managerNotes: item.managerNotes }).commit();
            } catch (e) {
              console.warn('[Sanity Patch Error]:', e.message);
            }
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, item }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // Job Application Submission Endpoint
  if (url.pathname === '/api/apply' && req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const { position, fullName, email, phone, experienceYears, availability, resumeLink, message, consent } = payload;

        if (!fullName || !email || !phone || !position || !consent) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'Missing mandatory applicant details.' }));
          return;
        }

        const id = `app-${Date.now()}`;
        const newApp = {
          _id: id,
          _type: 'jobApplication',
          id,
          position: position.trim(),
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          experienceYears: (experienceYears || '').trim(),
          availability: (availability || '').trim(),
          resumeLink: (resumeLink || '').trim(),
          message: (message || '').trim(),
          status: 'new',
          hrNotes: '',
          submittedAt: new Date().toISOString(),
        };

        // 1. Persist locally
        const list = readJson(APPLICATIONS_FILE);
        list.unshift(newApp);
        writeJson(APPLICATIONS_FILE, list);

        // 2. Persist to Sanity
        if (writeClient) {
          try {
            await writeClient.createOrReplace(newApp);
            console.log(`[Sanity] Created jobApplication document: ${id}`);
          } catch (sanityErr) {
            console.warn('[Sanity Job Application Write Warning]:', sanityErr.message);
          }
        }

        console.log(`[MAATI Careers] New application received for ${position}: ${fullName} (${email})`);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: true,
            id,
            message: 'Application received successfully. We look forward to reviewing your profile.'
          })
        );
      } catch (err) {
        console.error('[MAATI Careers Error]:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Server could not process application' }));
      }
    });
    return;
  }

  // Get Applications (for Studio / Admin dashboard)
  if (url.pathname === '/api/applications' && req.method === 'GET') {
    const list = readJson(APPLICATIONS_FILE);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, applications: list }));
    return;
  }

  // Update Application Status / HR Notes
  if (url.pathname === '/api/applications/status' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', async () => {
      try {
        const { id, status, hrNotes } = JSON.parse(body || '{}');
        const list = readJson(APPLICATIONS_FILE);
        const item = list.find((i) => i._id === id || i.id === id);
        if (item) {
          if (status) item.status = status;
          if (hrNotes !== undefined) item.hrNotes = hrNotes;
          writeJson(APPLICATIONS_FILE, list);

          if (writeClient) {
            try {
              await writeClient.patch(item._id).set({ status: item.status, hrNotes: item.hrNotes }).commit();
            } catch (e) {
              console.warn('[Sanity Patch Error]:', e.message);
            }
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, item }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // Delete Inquiry Endpoint
  if (url.pathname === '/api/inquiries/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', async () => {
      try {
        const { id } = JSON.parse(body || '{}');
        let list = readJson(ENQUIRIES_FILE);
        list = list.filter((i) => i._id !== id && i.id !== id);
        writeJson(ENQUIRIES_FILE, list);

        if (writeClient) {
          try {
            await writeClient.delete(id);
          } catch (e) {
            console.warn('[Sanity Delete Warning]:', e.message);
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  // Delete Job Application Endpoint
  if (url.pathname === '/api/applications/delete' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', async () => {
      try {
        const { id } = JSON.parse(body || '{}');
        let list = readJson(APPLICATIONS_FILE);
        list = list.filter((i) => i._id !== id && i.id !== id);
        writeJson(APPLICATIONS_FILE, list);

        if (writeClient) {
          try {
            await writeClient.delete(id);
          } catch (e) {
            console.warn('[Sanity Delete Warning]:', e.message);
          }
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true }));
      } catch (e) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: e.message }));
      }
    });
    return;
  }

  if (url.pathname.startsWith('/api/')) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: false, error: 'API endpoint not found.' }));
    return;
  }

  // ── STATIC FILE SERVER ── Serve built React frontend from dist/
  const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js':   'application/javascript; charset=utf-8',
    '.css':  'text/css; charset=utf-8',
    '.png':  'image/png',
    '.jpg':  'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg':  'image/svg+xml',
    '.ico':  'image/x-icon',
    '.woff': 'font/woff',
    '.woff2':'font/woff2',
    '.ttf':  'font/ttf',
    '.json': 'application/json',
    '.xml':  'application/xml',
    '.txt':  'text/plain',
  };

  // Strip query string to get the clean file path
  const reqPath = url.pathname;
  let decodedPath;
  try { decodedPath = decodeURIComponent(reqPath); } catch { res.writeHead(400); res.end('Invalid path'); return; }
  let filePath = path.resolve(DIST_DIR, '.' + decodedPath);

  // Security: prevent directory traversal outside dist/
  if (filePath !== DIST_DIR && !filePath.startsWith(DIST_DIR + path.sep)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // If path points to a directory, look for index.html inside it
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';

    // Long-lived cache for hashed assets, no-cache for HTML
    const isHashedAsset = /\.[cm]?js$|\.css$/.test(reqPath) && /-[A-Za-z0-9_-]{8,}\./.test(reqPath);
    res.setHeader('Cache-Control', isHashedAsset
      ? 'public, max-age=31536000, immutable'
      : 'no-cache, no-store, must-revalidate'
    );
    res.writeHead(200, { 'Content-Type': mime });
    fs.createReadStream(filePath).pipe(res);
  } else {
    if (path.extname(decodedPath)) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Asset not found'); return; }
    // SPA fallback — all unmatched routes return index.html so React Router handles them
    const indexPath = path.join(DIST_DIR, 'index.html');
    if (fs.existsSync(indexPath)) {
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      fs.createReadStream(indexPath).pipe(res);
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 — run npm run build first');
    }
  }
});

server.listen(PORT, () => {
  console.log(`[MAATI API Server] Running on port ${PORT}`);
  console.log(`[MAATI API Server] Sanity Project: ${SANITY_PROJECT_ID} (${SANITY_DATASET})`);
  console.log(`[MAATI API Server] Sanity Write Token Configured: ${Boolean(writeClient)}`);
});
