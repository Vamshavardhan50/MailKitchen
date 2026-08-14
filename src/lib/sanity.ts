import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Environment credentials with fallback for Vite
const metaEnv = (import.meta as any).env || {};

export const sanityConfig = {
  projectId: metaEnv.VITE_SANITY_PROJECT_ID || metaEnv.NEXT_PUBLIC_SANITY_PROJECT_ID || 'ohmgd0hu',
  dataset: metaEnv.VITE_SANITY_DATASET || metaEnv.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: metaEnv.VITE_SANITY_API_VERSION || metaEnv.SANITY_API_VERSION || '2024-01-01',
  useCdn: metaEnv.VITE_SANITY_USE_CDN !== 'false',
  token: metaEnv.VITE_SANITY_TOKEN || metaEnv.SANITY_API_TOKEN || undefined,
};

export const isSanityConfigured = Boolean(
  sanityConfig.projectId &&
  sanityConfig.projectId !== 'your_sanity_project_id' &&
  sanityConfig.projectId !== 'demo_project_id' &&
  sanityConfig.projectId !== 'mock-project-id'
);

// Initialize Sanity Client
export const sanityClient = createClient(
  isSanityConfigured
    ? sanityConfig
    : {
        projectId: 'fallback-project',
        dataset: 'production',
        apiVersion: '2024-01-01',
        useCdn: true,
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
