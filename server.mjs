import http from 'http';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

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

  // Health check endpoint
  if (url.pathname === '/api/health' && req.method === 'GET') {
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

  // Secure Cloud Sync Endpoint
  if (url.pathname === '/api/sync' && req.method === 'POST') {
    if (!writeClient) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(
        JSON.stringify({
          success: false,
          error: 'SANITY_API_TOKEN is not configured on the server. Please check server environment.',
        })
      );
      return;
    }

    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });

    req.on('end', async () => {
      try {
        const payload = JSON.parse(body || '{}');
        const results = [];

        // 1. Site Settings
        if (payload.settings) {
          await writeClient.createOrReplace({
            _id: 'siteSettings',
            _type: 'siteSettings',
            ...payload.settings,
          });
          results.push('siteSettings');
        }

        // 2. Homepage Content
        if (payload.homepage) {
          await writeClient.createOrReplace({
            _id: 'homepage',
            _type: 'homepage',
            ...payload.homepage,
          });
          results.push('homepage');
        }

        // 3. Events Content
        if (payload.events) {
          await writeClient.createOrReplace({
            _id: 'eventsContent',
            _type: 'eventsContent',
            ...payload.events,
          });
          results.push('eventsContent');
        }

        // 4. Contact Content
        if (payload.contact) {
          await writeClient.createOrReplace({
            _id: 'contactContent',
            _type: 'contactContent',
            ...payload.contact,
          });
          results.push('contactContent');
        }

        // 5. Print Menu Content
        if (payload.printMenu) {
          await writeClient.createOrReplace({
            _id: 'printMenuContent',
            _type: 'printMenuContent',
            ...payload.printMenu,
          });
          results.push('printMenuContent');
        }

        // 6. Menu Categories & Dishes
        if (payload.menu && Array.isArray(payload.menu)) {
          await writeClient.createOrReplace({
            _id: 'menuCategoriesData',
            _type: 'menuCategoriesData',
            categories: payload.menu,
            updatedAt: new Date().toISOString(),
          });
          results.push('menuCategoriesData');
        }

        // 7. Gallery Assets
        if (payload.gallery && Array.isArray(payload.gallery)) {
          await writeClient.createOrReplace({
            _id: 'galleryAssetsData',
            _type: 'galleryAssetsData',
            assets: payload.gallery,
            updatedAt: new Date().toISOString(),
          });
          results.push('galleryAssetsData');
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: true,
            syncedSections: results,
            message: `Successfully published ${results.length} sections to Sanity Cloud!`,
          })
        );
      } catch (err) {
        console.error('Server sync error:', err);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(
          JSON.stringify({
            success: false,
            error: err?.message || 'Failed to publish to Sanity',
          })
        );
      }
    });
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

server.listen(PORT, () => {
  console.log(`[MAATI API Server] Running on port ${PORT}`);
  console.log(`[MAATI API Server] Sanity Project: ${SANITY_PROJECT_ID} (${SANITY_DATASET})`);
  console.log(`[MAATI API Server] Sanity Write Token Configured: ${Boolean(writeClient)}`);
});
