import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Environment credentials with bulletproof fallback for Vite & VPS builds
const metaEnv = (import.meta as any).env || {};

export const SANITY_PROJECT_ID =
  metaEnv.VITE_SANITY_PROJECT_ID ||
  metaEnv.NEXT_PUBLIC_SANITY_PROJECT_ID ||
  'ohmgd0hu';

export const SANITY_DATASET =
  metaEnv.VITE_SANITY_DATASET ||
  metaEnv.NEXT_PUBLIC_SANITY_DATASET ||
  'production';

export const SANITY_API_VERSION =
  metaEnv.VITE_SANITY_API_VERSION ||
  '2024-01-01';

export const SANITY_TOKEN =
  metaEnv.VITE_SANITY_TOKEN ||
  metaEnv.SANITY_API_TOKEN ||
  'skkZ2RXyMQXYgJ7zNaYWGkv0yVoisUfslQHD6NnTHyI9V0Yn0LnysidiRl3Rn9HQnymZn7uRKBMlyfsGN7XHXwi4Ejsxnjm5xt7HznmJoTqrkXdHDBDOKIaWnRxdJQA3sCwdgcDhRySCslFVZu1eEWrXx1XhyJu5BYL0TODoTB4gHBg7J3DC';

export const isSanityConfigured = Boolean(
  SANITY_PROJECT_ID &&
  SANITY_PROJECT_ID !== 'your_sanity_project_id' &&
  SANITY_PROJECT_ID !== 'demo_project_id' &&
  SANITY_PROJECT_ID !== 'mock-project-id' &&
  SANITY_PROJECT_ID !== 'fallback-project'
);

export const sanityConfig = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false, // always fresh live data
  token: SANITY_TOKEN || undefined,
};

// Read client (used everywhere for fetching data)
export const sanityClient = createClient(sanityConfig);

// Write client — used by admin panel to save to Sanity cloud
export const sanityWriteClient = createClient({
  ...sanityConfig,
  useCdn: false,
  token: SANITY_TOKEN,
});

export const canWriteToSanity = true;

// Image builder for Sanity hosted assets
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  if (!source) return { url: () => '' };
  try {
    return builder.image(source);
  } catch (err) {
    return { url: () => '' };
  }
}

