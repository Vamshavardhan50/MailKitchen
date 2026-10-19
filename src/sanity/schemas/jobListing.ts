export const jobListingSchema = {
  name: 'jobListing',
  title: 'Job Openings (Careers)',
  type: 'document',
  fields: [
    {
      name: 'titleEn',
      title: 'Job Title (English)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'titleDe',
      title: 'Job Title (German)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug / Job Code',
      type: 'slug',
      options: { source: 'titleEn' },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'department',
      title: 'Department',
      type: 'string',
      options: {
        list: [
          { title: 'Front of House & Barista', value: 'service' },
          { title: 'Kitchen & Chef', value: 'kitchen' },
          { title: 'Management & Shift Lead', value: 'management' },
          { title: 'Catering & Logistics', value: 'catering' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'employmentType',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-time (Vollzeit)', value: 'fulltime' },
          { title: 'Part-time (Teilzeit)', value: 'parttime' },
          { title: 'Student / Minijob', value: 'minijob' },
        ],
      },
      initialValue: 'fulltime',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'location',
      title: 'Location',
      type: 'string',
      initialValue: 'Zimmerstraße 56, 10117 Berlin Mitte',
    },
    {
      name: 'descEn',
      title: 'Role Summary (English)',
      type: 'text',
      rows: 3,
    },
    {
      name: 'descDe',
      title: 'Role Summary (German)',
      type: 'text',
      rows: 3,
    },
    {
      name: 'requirementsEn',
      title: 'Requirements (English)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'requirementsDe',
      title: 'Requirements (German)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'benefitsEn',
      title: 'Benefits (English)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'benefitsDe',
      title: 'Benefits (German)',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'isActive',
      title: 'Active / Accepting Applications',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
      initialValue: 1,
    },
  ],
  preview: {
    select: {
      title: 'titleEn',
      subtitle: 'employmentType',
    },
  },
};
