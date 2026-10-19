export const eventsPageSchema = {
  name: 'eventsPage',
  title: 'Events & Celebrations Content',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Document Identifier',
      type: 'string',
      initialValue: 'Events Page',
      readOnly: true,
    },
    // ── SEO ──
    {
      name: 'seoTitleEn',
      title: 'SEO Title (English) — Max 60 chars',
      type: 'string',
      initialValue: 'Private Events & Celebrations at MAATI | Berlin Mitte',
      validation: (Rule: any) => Rule.max(60),
    },
    {
      name: 'seoTitleDe',
      title: 'SEO Title (German) — Max 60 chars',
      type: 'string',
      initialValue: 'Private Events & Feiern bei MAATI | Berlin Mitte',
      validation: (Rule: any) => Rule.max(60),
    },
    {
      name: 'seoDescEn',
      title: 'SEO Meta Description (English) — Max 160 chars',
      type: 'text',
      rows: 2,
      initialValue: 'Host your private party, company dinner or team celebration at MAATI Kitchen in Berlin Mitte. Tailored Indian menus, cozy indoor seating & sunny terrace.',
      validation: (Rule: any) => Rule.max(160),
    },
    {
      name: 'seoDescDe',
      title: 'SEO Meta Description (German) — Max 160 chars',
      type: 'text',
      rows: 2,
      initialValue: 'Plane deine private Feier, Firmenevents oder Geburtstage bei MAATI Kitchen in Berlin Mitte. Individuelle Menüs, gemütliches Ambiente und Sonnenterrasse.',
      validation: (Rule: any) => Rule.max(160),
    },

    // ── Content ──
    {
      name: 'h1En',
      title: 'Hero H1 Heading (English)',
      type: 'string',
      initialValue: 'Private Events & Celebrations at MAATI, Berlin Mitte',
    },
    {
      name: 'h1De',
      title: 'Hero H1 Heading (German)',
      type: 'string',
      initialValue: 'Private Events & Feiern bei MAATI, Berlin Mitte',
    },
    {
      name: 'leadEn',
      title: 'Lead Paragraph (English)',
      type: 'text',
      rows: 3,
      initialValue: 'From intimate birthday dinners to team milestones and product celebrations, our modern space at Zimmerstraße 56 is available for exclusive private buyouts and reserved group dining.',
    },
    {
      name: 'leadDe',
      title: 'Lead Paragraph (German)',
      type: 'text',
      rows: 3,
      initialValue: 'Von Geburtstagsessen bis hin zu Firmenfeiern und Teamevents: Unser stilvolles Restaurant in der Zimmerstraße 56 bietet den perfekten Rahmen für unvergessliche Abende in Berlin Mitte.',
    },

    // ── Capacity & Features ──
    {
      name: 'seatedCapacity',
      title: 'Seated Capacity (e.g. 50)',
      type: 'number',
      initialValue: 50,
    },
    {
      name: 'standingCapacity',
      title: 'Standing Reception Capacity (e.g. 80)',
      type: 'number',
      initialValue: 80,
    },
    {
      name: 'terraceCapacity',
      title: 'Terrace Capacity (e.g. 30)',
      type: 'number',
      initialValue: 30,
    },

    // ── Gallery ──
    {
      name: 'gallery',
      title: 'Event Gallery Images',
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
