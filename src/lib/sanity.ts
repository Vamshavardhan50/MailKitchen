import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Public Sanity configuration for read queries
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

export const isSanityConfigured = Boolean(
  SANITY_PROJECT_ID &&
  SANITY_PROJECT_ID !== 'your_sanity_project_id' &&
  SANITY_PROJECT_ID !== 'demo_project_id' &&
  SANITY_PROJECT_ID !== 'mock-project-id' &&
  SANITY_PROJECT_ID !== 'fallback-project' &&
  SANITY_PROJECT_ID !== 'maati-local'
);

export const sanityConfig = {
  projectId: SANITY_PROJECT_ID,
  dataset: SANITY_DATASET,
  apiVersion: SANITY_API_VERSION,
  useCdn: false, // direct fresh data
};

// Read-only client used across the website for fetching published content
export const sanityClient = createClient(sanityConfig);

// Safe environment logging (No secrets)
if (typeof window !== 'undefined') {
  console.log(`[MAATI CMS] Connected to Sanity Project: ${SANITY_PROJECT_ID} (${SANITY_DATASET})`);
}

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


