export const homepageSchema = {
  name: 'homepage',
  title: 'Homepage Content',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Document Identifier',
      type: 'string',
      initialValue: 'Main Landing Page',
      readOnly: true,
    },
    // ── 1. Hero Section ──
    {
      name: 'heroEyebrowEn',
      title: 'Hero Eyebrow (English)',
      type: 'string',
      initialValue: 'BERLIN MITTE',
    },
    {
      name: 'heroEyebrowDe',
      title: 'Hero Eyebrow (German)',
      type: 'string',
      initialValue: 'BERLIN MITTE',
    },
    {
      name: 'heroTitleEn',
      title: 'Hero Title (English)',
      type: 'string',
      initialValue: 'INDIAN SOUL FOOD',
    },
    {
      name: 'heroTitleDe',
      title: 'Hero Title (German)',
      type: 'string',
      initialValue: 'INDISCHES SOUL FOOD',
    },
    {
      name: 'heroSubtitleEn',
      title: 'Hero Subtitle (English)',
      type: 'string',
      initialValue: 'LUNCH & DRINKS',
    },
    {
      name: 'heroSubtitleDe',
      title: 'Hero Subtitle (German)',
      type: 'string',
      initialValue: 'MITTAGESSEN & GETRÄNKE',
    },
    {
      name: 'heroDescEn',
      title: 'Hero Description (English)',
      type: 'text',
      rows: 2,
      initialValue: 'Crafted with authentic heritage recipes and mindful local ingredients.',
    },
    {
      name: 'heroDescDe',
      title: 'Hero Description (German)',
      type: 'text',
      rows: 2,
      initialValue: 'Zubereitet nach authentischen Familienrezepten und mit regionalen Zutaten.',
    },
    {
      name: 'heroImage',
      title: 'Hero Flatlay Image',
      type: 'image',
      options: { hotspot: true },
    },
    // ── 2. Featured Menu Section ──
    {
      name: 'featuredEyebrowEn',
      title: 'Featured Section Eyebrow (English)',
      type: 'string',
      initialValue: 'OUR SPECIALTIES',
    },
    {
      name: 'featuredEyebrowDe',
      title: 'Featured Section Eyebrow (German)',
      type: 'string',
      initialValue: 'UNSERE SPEZIALITÄTEN',
    },
    {
      name: 'featuredTitleEn',
      title: 'Featured Section Title (English)',
      type: 'string',
      initialValue: 'Treat Your Tastebuds',
    },
    {
      name: 'featuredTitleDe',
      title: 'Featured Section Title (German)',
      type: 'string',
      initialValue: 'Verwöhnen Sie Ihren Gaumen',
    },
    // ── 3. Experience Section ──
    {
      name: 'experienceEyebrowEn',
      title: 'Experience Eyebrow (English)',
      type: 'string',
      initialValue: 'EXPERIENCE',
    },
    {
      name: 'experienceEyebrowDe',
      title: 'Experience Eyebrow (German)',
      type: 'string',
      initialValue: 'ERLEBNIS',
    },
    {
      name: 'experienceTitleEn',
      title: 'Experience Title (English)',
      type: 'string',
      initialValue: 'Breakfast, Lunch and Events at MAATI',
    },
    {
      name: 'experienceTitleDe',
      title: 'Experience Title (German)',
      type: 'string',
      initialValue: 'Frühstück, Mittagessen und Events bei MAATI',
    },
    {
      name: 'experienceDescEn',
      title: 'Experience Description (English)',
      type: 'text',
      rows: 2,
      initialValue: 'A warm, modern space designed for quick breakfast & lunches and cozy events alike.',
    },
    {
      name: 'experienceDescDe',
      title: 'Experience Description (German)',
      type: 'text',
      rows: 2,
      initialValue: 'Ein warmer, moderner Raum für ein schnelles Frühstück, Mittagessen und gemütliche Events.',
    },
    // ── 4. Catering Section ──
    {
      name: 'cateringTitleEn',
      title: 'Catering Title (English)',
      type: 'string',
      initialValue: 'Bold Flavours That Fuel Your Team',
    },
    {
      name: 'cateringTitleDe',
      title: 'Catering Title (German)',
      type: 'string',
      initialValue: 'Kräftige Aromen, die Ihr Team begeistern',
    },
    {
      name: 'cateringDescEn',
      title: 'Catering Description (English)',
      type: 'text',
      rows: 3,
      initialValue: 'From team lunches to full corporate events — we bring freshly crafted bowls, warm naan pockets, and signature drinks directly to your office.',
    },
    {
      name: 'cateringDescDe',
      title: 'Catering Description (German)',
      type: 'text',
      rows: 3,
      initialValue: 'Von Team-Lunches bis hin zu großen Firmenfeiern — wir bringen frisch zubereitete Bowls, warme Naan-Taschen und Signature Drinks direkt in Ihr Büro.',
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
};
