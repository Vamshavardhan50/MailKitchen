# MAATI Kitchen

The public React site and MAATI Studio use the published Sanity `ohmgd0hu/production` dataset. The consolidated `menuCategoriesData` document is the menu authority; local menu data is an offline fallback. Homepage favorites derive from the same published menu.

## VPS update

Run these in the existing repository directory on the VPS:

```sh
git pull origin main
npm ci
```

Before starting the updated server, set these **server-only** values in the VPS `.env`:

```dotenv
SANITY_API_TOKEN=your_existing_sanity_editor_token
ADMIN_PASSWORD=your_chosen_studio_password
```

Keep the existing `VITE_SANITY_PROJECT_ID=ohmgd0hu` and `VITE_SANITY_DATASET=production`. Remove `VITE_SANITY_WRITE_TOKEN` and any `VITE_SANITY_TOKEN` from build configuration; publishing now runs on the server, authenticated by an HTTP-only session cookie. Rotate previously exposed browser write tokens in Sanity and update `SANITY_API_TOKEN` accordingly.

Build and test:

```sh
npm test
npm run build
```

Restart the existing Node process with the VPS process manager. For PM2, use `pm2 list` to find the current process name, then `pm2 restart <existing-process-name> --update-env`. The existing process must start `server.mjs` from this repository directory. If using systemd, restart the existing MAATI service instead. Do not start a second server on the same port.

The reverse proxy must send `/api/` to this Node server. The public website and Studio should use the same origin. Verify `/api/health` reports `sanityConfigured: true`, open `/studio`, and sign in with `ADMIN_PASSWORD`. A missing password produces an explicit setup error.

**Recover the 10 cocktail cards:** after deployment, open `/admin` in the same browser/profile where all 10 cards were visible. Do not clear that browser's site data. If 8 cards exist only in that browser, Studio lists their names in “Recover 8 unpublished cocktail cards.” Click “Publish missing cocktails to website.” This merges additions into the published menu under a revision guard and preserves corrected images and prices on existing cards. A fresh browser cannot access another browser's unpublished local data.

## Publishing

Save changes in the relevant editor. A menu save reports success only after Sanity confirms the write. Published content refreshes through a shared Sanity listener, on focus/reconnection, and every 30 seconds as a fallback. Unsaved edits remain protected during refresh. “Refresh from Sanity” reloads cloud content; it never republishes old browser drafts. A revision conflict requires reloading Studio before making the edit again.

Menu image errors show a neutral placeholder. Sanity-hosted asset URLs avoid missing VPS files. Non-versioned local photos are revalidated rather than cached as immutable assets; filenames containing spaces are decoded correctly by the Node server.

## Image repair

`node scripts/repair-menu-images.mjs` previews the restoration plan using the checked-in original image mappings. `--apply` uploads the photos to Sanity and patches only image fields under a revision guard. Backups are saved in the ignored `.task-backups/` directory. Custom remote CMS images are preserved. The production repair on 21 October 2026 preserved all dishes, prices, availability, and order and verified all 37 distinct image URLs used by the 42 menu entries.
