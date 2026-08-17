import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Environment credentials with fallback for Vite
const metaEnv = (import.meta as any).env || {};

const envProjectId = metaEnv.VITE_SANITY_PROJECT_ID || metaEnv.NEXT_PUBLIC_SANITY_PROJECT_ID || '';
const envToken = metaEnv.VITE_SANITY_TOKEN || metaEnv.SANITY_API_TOKEN || '';

export const isSanityConfigured = Boolean(
  envProjectId &&
  envProjectId !== 'your_sanity_project_id' &&
  envProjectId !== 'demo_project_id' &&
  envProjectId !== 'mock-project-id' &&
  envProjectId !== 'fallback-project'
);

export const sanityConfig = {
  projectId: isSanityConfigured ? envProjectId : 'maati-local',
  dataset: metaEnv.VITE_SANITY_DATASET || 'production',
  apiVersion: metaEnv.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn: false, // always fresh data
  token: envToken || undefined,
};

// Read client (used everywhere for fetching data)
export const sanityClient = createClient(
  isSanityConfigured
    ? sanityConfig
    : {
        projectId: 'maati-local',
        dataset: 'production',
        apiVersion: '2024-01-01',
        useCdn: false,
      }
);

// Write client — used by admin panel to save to Sanity cloud
// Has token so it can create/update documents
export const sanityWriteClient = isSanityConfigured && envToken
  ? createClient({ ...sanityConfig, useCdn: false, token: envToken })
  : null;

export const canWriteToSanity = Boolean(sanityWriteClient);


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
