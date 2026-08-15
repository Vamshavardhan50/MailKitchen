import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Environment credentials with fallback for Vite
const metaEnv = (import.meta as any).env || {};

const envProjectId = metaEnv.VITE_SANITY_PROJECT_ID || metaEnv.NEXT_PUBLIC_SANITY_PROJECT_ID || '';

export const isSanityConfigured = Boolean(
  envProjectId &&
  envProjectId !== 'your_sanity_project_id' &&
  envProjectId !== 'demo_project_id' &&
  envProjectId !== 'mock-project-id' &&
  envProjectId !== 'fallback-project' &&
  envProjectId !== 'ohmgd0hu'
);

export const sanityConfig = {
  projectId: isSanityConfigured ? envProjectId : 'maati-local',
  dataset: metaEnv.VITE_SANITY_DATASET || metaEnv.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: metaEnv.VITE_SANITY_API_VERSION || metaEnv.SANITY_API_VERSION || '2024-01-01',
  // Disabling useCdn (setting to false) guarantees fresh 200 OK data and eliminates 304 Not Modified cache errors
  useCdn: false,
  token: metaEnv.VITE_SANITY_TOKEN || metaEnv.SANITY_API_TOKEN || undefined,
};

// Initialize Sanity Client
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
