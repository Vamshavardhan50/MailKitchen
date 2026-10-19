export const legalPageSchema = {
  name: 'legalPage',
  title: 'Legal Documents (Impressum, Privacy, Terms)',
  type: 'document',
  fields: [
    {
      name: 'pageType',
      title: 'Page Type',
      type: 'string',
      options: {
        list: [
          { title: 'Impressum (§ 5 TMG)', value: 'impressum' },
          { title: 'Privacy Policy (Datenschutz DSGVO)', value: 'privacy' },
          { title: 'Terms & Conditions (AGB)', value: 'terms' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'titleEn',
      title: 'Page Title (English)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'titleDe',
      title: 'Page Title (German)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'lastUpdated',
      title: 'Last Updated Date',
      type: 'date',
      initialValue: '2026-10-17',
    },
    {
      name: 'robots',
      title: 'Robots Directive',
      type: 'string',
      initialValue: 'noindex, follow',
      readOnly: true,
      description: 'Strictly set to "noindex, follow" to protect search crawl budget.',
    },
    {
      name: 'contentEn',
      title: 'Legal Content (English)',
      type: 'text',
      rows: 15,
    },
    {
      name: 'contentDe',
      title: 'Legal Content (German)',
      type: 'text',
      rows: 15,
    },
  ],
  preview: {
    select: {
      title: 'titleDe',
      subtitle: 'pageType',
    },
  },
};
