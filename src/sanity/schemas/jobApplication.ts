export const jobApplicationSchema = {
  name: 'jobApplication',
  title: 'Received Job Applications',
  type: 'document',
  fields: [
    {
      name: 'position',
      title: 'Position Applied For',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'status',
      title: 'Application Status',
      type: 'string',
      options: {
        list: [
          { title: '🟡 New / Unreviewed', value: 'new' },
          { title: '🔵 Under Review', value: 'reviewing' },
          { title: '🟣 Interview Scheduled', value: 'interview' },
          { title: '🟢 Hired', value: 'hired' },
          { title: '🔴 Not Selected', value: 'rejected' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    },
    {
      name: 'fullName',
      title: 'Applicant Full Name',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'experienceYears',
      title: 'Experience Level / Background',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'availability',
      title: 'Earliest Start Date / Availability',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'resumeLink',
      title: 'Resume / LinkedIn / Portfolio Link',
      type: 'url',
      readOnly: true,
    },
    {
      name: 'message',
      title: 'Cover Note / Introduction',
      type: 'text',
      rows: 4,
      readOnly: true,
    },
    {
      name: 'hrNotes',
      title: 'Internal HR / Interview Notes',
      type: 'text',
      rows: 3,
      description: 'Internal interview feedback, trial shift schedule, or compensation notes.',
    },
    {
      name: 'submittedAt',
      title: 'Application Submitted Timestamp',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: 'fullName',
      subtitle: 'position',
      description: 'status',
    },
    prepare({ title, subtitle, description }: any) {
      return {
        title: title || 'New Applicant',
        subtitle: `${subtitle || 'General Application'} [Status: ${description || 'new'}]`,
      };
    },
  },
};
