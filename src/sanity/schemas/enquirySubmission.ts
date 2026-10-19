export const enquirySubmissionSchema = {
  name: 'enquirySubmission',
  title: 'Received Inquiries & Bookings',
  type: 'document',
  fields: [
    {
      name: 'enquiryType',
      title: 'Inquiry Type',
      type: 'string',
      options: {
        list: [
          { title: 'Corporate Catering', value: 'corporate-catering' },
          { title: 'Private Event / Buyout', value: 'private-event' },
          { title: 'Group Booking', value: 'group-booking' },
          { title: 'General / Other', value: 'other' },
        ],
      },
      readOnly: true,
    },
    {
      name: 'status',
      title: 'Inquiry Status',
      type: 'string',
      options: {
        list: [
          { title: '🟡 New / Unread', value: 'new' },
          { title: '🔵 Contacted / In Discussion', value: 'contacted' },
          { title: '🟢 Confirmed / Booked', value: 'confirmed' },
          { title: '⚪ Archived / Cancelled', value: 'archived' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    },
    {
      name: 'name',
      title: 'Contact Name',
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
      name: 'company',
      title: 'Company / Organization (Optional)',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'date',
      title: 'Requested Event Date',
      type: 'string',
      readOnly: true,
    },
    {
      name: 'guests',
      title: 'Expected Guest Count',
      type: 'number',
      readOnly: true,
    },
    {
      name: 'message',
      title: 'Customer Message / Special Requirements',
      type: 'text',
      rows: 4,
      readOnly: true,
    },
    {
      name: 'managerNotes',
      title: 'Staff / Manager Internal Notes',
      type: 'text',
      rows: 3,
      description: 'Add your internal follow-up notes, quotation amount, or special dietary confirmations here.',
    },
    {
      name: 'receivedAt',
      title: 'Submission Received Timestamp',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      readOnly: true,
    },
    {
      name: 'lang',
      title: 'Submission Language',
      type: 'string',
      readOnly: true,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'enquiryType',
      description: 'date',
    },
    prepare({ title, subtitle, description }: any) {
      return {
        title: title || 'Anonymous Inquiry',
        subtitle: `${subtitle || 'Inquiry'} • Date: ${description || 'TBD'}`,
      };
    },
  },
};
