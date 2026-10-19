export const menuLandingPageSchema = {
  name: 'menuLandingPage',
  title: 'Menu Landing Pages (SEO & Categories)',
  type: 'document',
  fields: [
    {
      name: 'categoryKey',
      title: 'Category Identifier',
      type: 'string',
      options: {
        list: [
          { title: 'Naan Pockets (/menu/naan-pockets)', value: 'naan-pockets' },
          { title: 'Signature Bowls (/menu/bowls)', value: 'bowls' },
          { title: 'Breakfast & Morning Bites (/menu/breakfast)', value: 'breakfast' },
          { title: 'Coffee & Artisan Chai (/menu/coffee-chai)', value: 'coffee-chai' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'categoryKey',
      },
      validation: (Rule: any) => Rule.required(),
    },
    // ── SEO Settings ──
    {
      name: 'seoTitleEn',
      title: 'SEO Title (English) — Max 60 chars',
      type: 'string',
      validation: (Rule: any) => Rule.max(60).warning('Keep under 60 characters for best Google display.'),
    },
    {
      name: 'seoTitleDe',
      title: 'SEO Title (German) — Max 60 chars',
      type: 'string',
      validation: (Rule: any) => Rule.max(60).warning('Keep under 60 characters for best Google display.'),
    },
    {
      name: 'seoDescEn',
      title: 'SEO Meta Description (English) — Max 160 chars',
      type: 'text',
      rows: 2,
      validation: (Rule: any) => Rule.max(160).warning('Keep under 160 characters for best Google display.'),
    },
    {
      name: 'seoDescDe',
      title: 'SEO Meta Description (German) — Max 160 chars',
      type: 'text',
      rows: 2,
      validation: (Rule: any) => Rule.max(160).warning('Keep under 160 characters for best Google display.'),
    },

    // ── Page Content ──
    {
      name: 'eyebrowEn',
      title: 'Eyebrow Tag (English)',
      type: 'string',
    },
    {
      name: 'eyebrowDe',
      title: 'Eyebrow Tag (German)',
      type: 'string',
    },
    {
      name: 'h1En',
      title: 'Page H1 Heading (English)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'h1De',
      title: 'Page H1 Heading (German)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'heroSublineEn',
      title: 'Hero Subline (English)',
      type: 'string',
    },
    {
      name: 'heroSublineDe',
      title: 'Hero Subline (German)',
      type: 'string',
    },
    {
      name: 'leadDescriptionEn',
      title: 'Lead Description (English)',
      type: 'text',
      rows: 3,
    },
    {
      name: 'leadDescriptionDe',
      title: 'Lead Description (German)',
      type: 'text',
      rows: 3,
    },
    {
      name: 'highlightsEn',
      title: 'Key Highlights / Selling Points (English)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'highlightsDe',
      title: 'Key Highlights / Selling Points (German)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'heroImage',
      title: 'Hero / Feature Image',
      type: 'image',
      options: { hotspot: true },
    },
  ],
  preview: {
    select: {
      title: 'h1En',
      subtitle: 'categoryKey',
      media: 'heroImage',
    },
  },
};
