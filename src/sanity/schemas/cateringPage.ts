export const cateringPageSchema = {
  name: 'cateringPage',
  title: 'Catering Page Content',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Document Identifier',
      type: 'string',
      initialValue: 'Catering Page',
      readOnly: true,
    },
    // ── SEO ──
    {
      name: 'seoTitleEn',
      title: 'SEO Title (English) — Max 60 chars',
      type: 'string',
      initialValue: 'Indian Catering in Berlin for Offices & Events | MAATI',
      validation: (Rule: any) => Rule.max(60),
    },
    {
      name: 'seoTitleDe',
      title: 'SEO Title (German) — Max 60 chars',
      type: 'string',
      initialValue: 'Indisches Catering in Berlin für Events & Büros | MAATI',
      validation: (Rule: any) => Rule.max(60),
    },
    {
      name: 'seoDescEn',
      title: 'SEO Meta Description (English) — Max 160 chars',
      type: 'text',
      rows: 2,
      initialValue: 'Fresh Indian office lunches, conference buffets, and private celebration catering in Berlin. Hot curry bowls, naan pockets, finger food. Request a quote.',
      validation: (Rule: any) => Rule.max(160),
    },
    {
      name: 'seoDescDe',
      title: 'SEO Meta Description (German) — Max 160 chars',
      type: 'text',
      rows: 2,
      initialValue: 'Frisches indisches Catering für Bürolunches, Meetings und Firmen-Events in Berlin Mitte. Warme Bowls, Naan-Pockets & Fingerfood. Jetzt unverbindlich anfragen.',
      validation: (Rule: any) => Rule.max(160),
    },

    // ── Header Content ──
    {
      name: 'h1En',
      title: 'Hero H1 Heading (English)',
      type: 'string',
      initialValue: 'Indian Catering in Berlin for Offices and Events',
    },
    {
      name: 'h1De',
      title: 'Hero H1 Heading (German)',
      type: 'string',
      initialValue: 'Indisches Catering in Berlin für Büros und Events',
    },
    {
      name: 'leadEn',
      title: 'Lead Paragraph (English)',
      type: 'text',
      rows: 3,
      initialValue: 'From team lunches to corporate conferences — we bring freshly crafted curry bowls, warm naan pockets, and signature street-food treats directly to your venue in Berlin.',
    },
    {
      name: 'leadDe',
      title: 'Lead Paragraph (German)',
      type: 'text',
      rows: 3,
      initialValue: 'Vom Teamlunch bis zur großen Konferenz — wir liefern frische Curry-Bowls, ofenwarme Naan-Pockets und Streetfood-Klassiker zuverlässig direkt zu Ihnen ins Büro oder zur Eventlocation.',
    },

    // ── Packages ──
    {
      name: 'packages',
      title: 'Catering Packages',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'nameEn', title: 'Package Name (English)', type: 'string' },
            { name: 'nameDe', title: 'Package Name (German)', type: 'string' },
            { name: 'priceFrom', title: 'Price Starting At (e.g., €14,50 / person)', type: 'string' },
            { name: 'minGuests', title: 'Minimum Guests (e.g., 10)', type: 'number' },
            { name: 'descEn', title: 'Description (English)', type: 'text', rows: 2 },
            { name: 'descDe', title: 'Description (German)', type: 'text', rows: 2 },
            { name: 'includedEn', title: 'Included Items (English)', type: 'array', of: [{ type: 'string' }] },
            { name: 'includedDe', title: 'Included Items (German)', type: 'array', of: [{ type: 'string' }] },
          ],
        },
      ],
    },

    // ── Direct Inquiries ──
    {
      name: 'inquiryEmail',
      title: 'Inquiry Email Address',
      type: 'string',
      initialValue: 'catering@maatikitchen.com',
    },
    {
      name: 'inquiryPhone',
      title: 'Inquiry Phone Number',
      type: 'string',
      initialValue: '+49 30 51891367',
    },
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
};
