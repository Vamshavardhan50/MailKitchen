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

The server reads `.env` beside `server.mjs`, so PM2 can start it from another working directory. Restart the backend after changing environment settings. A missing `vps:status` npm script means this checkout has not received the update: run `git pull --ff-only origin main` first and inspect any Git errors rather than resetting local changes.

Keep the existing `VITE_SANITY_PROJECT_ID=ohmgd0hu` and `VITE_SANITY_DATASET=production`. Remove `VITE_SANITY_WRITE_TOKEN` and any `VITE_SANITY_TOKEN` from build configuration; publishing now runs on the server, authenticated by an HTTP-only session cookie. Rotate previously exposed browser write tokens in Sanity and update `SANITY_API_TOKEN` accordingly.

Build and test:

```sh
npm test
npm run build
```

Restart the existing Node process with the VPS process manager. For PM2, use `pm2 list` to find the current process name, then `pm2 restart <existing-process-name> --update-env`. The existing process must start `server.mjs` from this repository directory. If using systemd, restart the existing MAATI service instead. Do not start a second server on the same port.

The reverse proxy must send `/api/` to this Node server. The public website and Studio should use the same origin. Verify `/api/health` reports `sanityConfigured: true`, open `/studio`, and sign in with `ADMIN_PASSWORD`. A missing password produces an explicit setup error.

All ten cocktails were recovered from Git version `71d58f0`; commit `c9133f5` had removed eight. The missing turmeric cottage-cheese croissant was also restored directly in Sanity. There are now 51 published menu cards. Existing cards, prices, and corrected images were preserved. The historical `cocktail-*.jpg` files show restaurant interiors, so the eight recovered cocktails use neutral placeholders until suitable photos are provided. Existing Aperol and Old Fashioned photos remain in place.

If Studio opens but cannot sign in and `/api/admin/session` returns 404, the new frontend is talking to an older backend. Run `npm run vps:status` in the repository on the VPS to identify PM2 services and listening ports, then restart the existing service with the updated `server.mjs`. Ensure the reverse proxy sends `/api/` to that process. Do not replace the API with client-side Sanity write credentials.

Browser recovery remains available for any additional unpublished cocktail cards. It merges additions while preserving published photos and prices.

## Security dependencies

The October 2026 security update upgrades Tailwind to v4 with its PostCSS integration and retains the existing palette, radii, shadows, and form defaults. It also patches Vite, Undici, and source-map-js through the lockfile. `npm audit` reports zero vulnerabilities for the verified lockfile. Build with a supported Node version compatible with the dependencies (Node 22.12+ or Node 24 is recommended). Tailwind v4 targets Safari 16.4+, Chrome 111+, and Firefox 128+.

## Publishing

### For restaurant staff

Open `/admin` or `/studio` and sign in with the staff password. Both addresses open the same editor.

The staff interface uses MAATI's original deep green, terracotta and warm cream palette, with coloured task cards. The persistent navigation opens Food & drinks, Homepage, Photos, Hours & contact and Bookings directly. Menu cards have a labelled **Edit details** action; homepage favourites and secondary homepage sections can be expanded when needed. The dashboard also includes customer enquiry and job application shortcuts.

1. Choose a dashboard card: Menu & prices, Homepage, Photo library, Opening hours & contact, Table bookings, or Menu sections.
2. Edit the English and German text separately. Switching sections keeps open page edits; the dashboard lists pages with unpublished changes.
3. Select **Save & publish**. Wait for **Published successfully** before closing the page. If a save fails, your open edits remain and the error stays visible. You can retry or explicitly discard your changes and reload the website version.
4. Select **View live page** to check the result. A menu dialog closes only after publishing succeeds. Editing an existing dish preserves its position in its menu section.

Upload photos to the Photo library, then choose the photo in the relevant page or dish and publish that editor. The library stores Sanity asset URLs, not large embedded image strings. Restaurant ambience photos are labelled as ambience, including the historical files misleadingly named `cocktail-*.jpg`.

Contact details have one editor: **Opening hours & contact** updates the contact page and footer together. Change the booking widget in **Table bookings**. Customer enquiries and job applications require staff sign-in and confirm server saves before reporting success. Public forms keep entered details and show an error if delivery fails.

The October admin review also reconnects previously hardcoded homepage headlines, catering text/FAQs/lead time, careers headings, event highlights/photo, About values, and reservation details to published content. The previous circular homepage hero and all ten recovered cocktails remain available.

Validation: the local isolated browser preview keeps test writes in memory. All thirteen page editor tabs were checked for successful publication, with a failed-save/retry check, menu editing, and public homepage/catering/footer readback. Automated tests cover section routing, session authentication, revision conflicts, image upload responses, menu ordering, inbox merging, failed writes, and deletion boundaries.

Save changes in the relevant editor. A menu save reports success only after Sanity confirms the write. Published content refreshes through a shared Sanity listener, on focus/reconnection, and every 30 seconds as a fallback. Unsaved edits remain protected during refresh. “Refresh from Sanity” reloads cloud content; it never republishes old browser drafts. A revision conflict requires reloading Studio before making the edit again.

Menu image errors show a neutral placeholder. Sanity-hosted asset URLs avoid missing VPS files. Non-versioned local photos are revalidated rather than cached as immutable assets; filenames containing spaces are decoded correctly by the Node server.

## Image repair

The homepage uses the **previous circular hero** (`circle-Bq5xyFQD.png`) with its original circular layout and entrance animation. The published Sanity hero, public fallback, and gallery picker all use the same image.

`node scripts/repair-menu-images.mjs` previews the restoration plan using the checked-in original image mappings. `--apply` uploads the photos to Sanity and patches only image fields under a revision guard. Backups are saved in the ignored `.task-backups/` directory. Custom remote CMS images are preserved. The production repair on 21 October 2026 preserved all dishes, prices, availability, and order and verified all 37 distinct image URLs used by the 42 menu entries.
