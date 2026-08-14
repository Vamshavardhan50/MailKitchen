export const siteSettingsSchema = {
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    {
      name: 'restaurantName',
      title: 'Restaurant Name',
      type: 'string',
      initialValue: 'MAATI Kitchen',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'taglineEn',
      title: 'Tagline (English)',
      type: 'string',
      initialValue: 'Indian Soul Food — Berlin Mitte',
    },
    {
      name: 'taglineDe',
      title: 'Tagline (German)',
      type: 'string',
      initialValue: 'Indisches Soul Food — Berlin Mitte',
    },
    {
      name: 'logo',
      title: 'Logo',
      type: 'image',
    },
    {
      name: 'phone',
      title: 'Phone Number',
      type: 'string',
      initialValue: '+49 030 51891367',
    },
    {
      name: 'email',
      title: 'Email Address',
      type: 'string',
      initialValue: 'hello@maatikitchen.com',
    },
    {
      name: 'address',
      title: 'Street Address',
      type: 'string',
      initialValue: 'Dircksenstraße 105, 10178 Berlin',
    },
    {
      name: 'openingHoursEn',
      title: 'Opening Hours (English)',
      type: 'string',
      initialValue: 'Mon – Fri: 11:30 – 15:00',
    },
    {
      name: 'openingHoursDe',
      title: 'Opening Hours (German)',
      type: 'string',
      initialValue: 'Mo – Fr: 11:30 – 15:00 Uhr',
    },
    {
      name: 'instagram',
      title: 'Instagram URL',
      type: 'url',
      initialValue: 'https://instagram.com/maatikitchen',
    },
    {
      name: 'facebook',
      title: 'Facebook URL',
      type: 'url',
    },
    {
      name: 'googleMapsUrl',
      title: 'Google Maps Link',
      type: 'url',
      initialValue: 'https://maps.google.com/?q=MAATI+Kitchen+Berlin',
    },
  ],
  preview: {
    select: {
      title: 'restaurantName',
      subtitle: 'address',
      media: 'logo',
    },
  },
};
