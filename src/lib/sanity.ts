import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Environment credentials with fallback
const metaEnv = (import.meta as any).env || {};

export const sanityConfig = {
  projectId: metaEnv.VITE_SANITY_PROJECT_ID || '',
  dataset: metaEnv.VITE_SANITY_DATASET || 'production',
  apiVersion: metaEnv.VITE_SANITY_API_VERSION || '2024-01-01',
  useCdn: metaEnv.VITE_SANITY_USE_CDN !== 'false',
  token: metaEnv.VITE_SANITY_TOKEN || undefined,
};

export const isSanityConfigured = Boolean(
  sanityConfig.projectId && sanityConfig.projectId !== 'demo_project_id'
);

// Initialize Sanity Client
export const sanityClient = createClient(
  isSanityConfigured
    ? sanityConfig
    : {
        projectId: 'mock-project-id',
        dataset: 'production',
        apiVersion: '2024-01-01',
        useCdn: true,
      }
);

// Image builder for Sanity hosted assets
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}
