export const aboutPageSchema = {
  name: 'aboutPage',
  title: 'About & Story Content',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Document Identifier',
      type: 'string',
      initialValue: 'About Page',
      readOnly: true,
    },
    // ── SEO ──
    {
      name: 'seoTitleEn',
      title: 'SEO Title (English) — Max 60 chars',
      type: 'string',
      initialValue: 'The Story Behind MAATI | Indian Culinary Heritage Berlin',
      validation: (Rule: any) => Rule.max(60),
    },
    {
      name: 'seoTitleDe',
      title: 'SEO Title (German) — Max 60 chars',
      type: 'string',
      initialValue: 'Die Geschichte hinter MAATI | Indische Esskultur Berlin',
      validation: (Rule: any) => Rule.max(60),
    },
    {
      name: 'seoDescEn',
      title: 'SEO Meta Description (English) — Max 160 chars',
      type: 'text',
      rows: 2,
      initialValue: 'Discover the story of MAATI Kitchen: earthen clay tradition, authentic Indian recipes, and mindful dining in Berlin Mitte.',
      validation: (Rule: any) => Rule.max(160),
    },
    {
      name: 'seoDescDe',
      title: 'SEO Meta Description (German) — Max 160 chars',
      type: 'text',
      rows: 2,
      initialValue: 'Erfahre mehr über die Vision von MAATI Kitchen: Verwurzelt in der Tradition von Ton (Maati), zeitlose indische Familienrezepte und Gastfreundschaft in Berlin.',
      validation: (Rule: any) => Rule.max(160),
    },

    // ── Content ──
    {
      name: 'h1En',
      title: 'Hero H1 Heading (English)',
      type: 'string',
      initialValue: 'The story behind MAATI',
    },
    {
      name: 'h1De',
      title: 'Hero H1 Heading (German)',
      type: 'string',
      initialValue: 'Die Geschichte hinter MAATI',
    },
    {
      name: 'clayMeaningEn',
      title: 'Concept & Philosophy (English)',
      type: 'text',
      rows: 4,
      initialValue: 'MAATI translates to "soil" or "clay" in Hindi — reflecting earthiness, warmth, and the centuries-old Indian culinary practice of slow cooking in handmade clay pots.',
    },
    {
      name: 'clayMeaningDe',
      title: 'Concept & Philosophy (German)',
      type: 'text',
      rows: 4,
      initialValue: 'MAATI bedeutet auf Hindi "Erde" oder "Ton" — ein Symbol für Bodenständigkeit, Wärme und das uralte Kochen in Tontöpfen, das den Gerichten ihren unverwechselbaren Geschmack verleiht.',
    },
    {
      name: 'images',
      title: 'Story Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
};
