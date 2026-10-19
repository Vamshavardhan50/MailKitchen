export const locationPageSchema = {
  name: 'locationPage',
  title: 'Location & Hours Content',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Document Identifier',
      type: 'string',
      initialValue: 'Location & Contact Page',
      readOnly: true,
    },
    // ── SEO ──
    {
      name: 'seoTitleEn',
      title: 'SEO Title (English) — Max 60 chars',
      type: 'string',
      initialValue: 'Find MAATI Kitchen in Berlin Mitte | Location & Hours',
      validation: (Rule: any) => Rule.max(60),
    },
    {
      name: 'seoTitleDe',
      title: 'SEO Title (German) — Max 60 chars',
      type: 'string',
      initialValue: 'MAATI Kitchen in Berlin Mitte | Anfahrt & Öffnungszeiten',
      validation: (Rule: any) => Rule.max(60),
    },
    {
      name: 'seoDescEn',
      title: 'SEO Meta Description (English) — Max 160 chars',
      type: 'text',
      rows: 2,
      initialValue: 'Visit MAATI Kitchen at Zimmerstraße 56, 10117 Berlin Mitte near Checkpoint Charlie. Open Mon-Fri 09:00-21:00, Sat 10:00-21:00. U Kochstraße / U Stadtmitte.',
      validation: (Rule: any) => Rule.max(160),
    },
    {
      name: 'seoDescDe',
      title: 'SEO Meta Description (German) — Max 160 chars',
      type: 'text',
      rows: 2,
      initialValue: 'Besuche MAATI Kitchen in der Zimmerstraße 56, 10117 Berlin nahe Checkpoint Charlie. U-Bahn Kochstraße & Stadtmitte. Öffnungszeiten, Anfahrt & Reservierung.',
      validation: (Rule: any) => Rule.max(160),
    },

    // ── Content ──
    {
      name: 'h1En',
      title: 'Hero H1 Heading (English)',
      type: 'string',
      initialValue: 'Find MAATI Kitchen in Berlin Mitte',
    },
    {
      name: 'h1De',
      title: 'Hero H1 Heading (German)',
      type: 'string',
      initialValue: 'Finden Sie MAATI Kitchen in Berlin Mitte',
    },
    {
      name: 'streetAddress',
      title: 'Street Address',
      type: 'string',
      initialValue: 'Zimmerstraße 56',
    },
    {
      name: 'postalCodeCity',
      title: 'Postal Code & City',
      type: 'string',
      initialValue: '10117 Berlin Mitte',
    },
    {
      name: 'neighborhoodNoteEn',
      title: 'Neighborhood Context (English)',
      type: 'string',
      initialValue: 'Checkpoint Charlie / Axel Springer Kiez',
    },
    {
      name: 'neighborhoodNoteDe',
      title: 'Neighborhood Context (German)',
      type: 'string',
      initialValue: 'Nahe Checkpoint Charlie & Axel-Springer-Quartier',
    },
    {
      name: 'publicTransitEn',
      title: 'Public Transit Instructions (English)',
      type: 'text',
      rows: 3,
      initialValue: 'U-Bahn: U6 Kochstraße / Checkpoint Charlie (3 min walk) or U2 Stadtmitte (5 min walk).\nBus: M29 to Charlottenstraße / Checkpoint Charlie.\nS-Bahn: Potsdamer Platz or Anhalter Bahnhof (12 min walk).',
    },
    {
      name: 'publicTransitDe',
      title: 'Public Transit Instructions (German)',
      type: 'text',
      rows: 3,
      initialValue: 'U-Bahn: U6 Kochstraße / Checkpoint Charlie (3 Min. Fußweg) oder U2 Stadtmitte (5 Min. Fußweg).\nBus: M29 bis Charlottenstraße / Checkpoint Charlie.\nS-Bahn: Potsdamer Platz oder Anhalter Bahnhof (ca. 12 Min. Fußweg).',
    },
    {
      name: 'googleMapsUrl',
      title: 'Google Maps Link',
      type: 'url',
      initialValue: 'https://maps.app.goo.gl/9z39r539s9o35Zg97',
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
};
