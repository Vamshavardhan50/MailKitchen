export const menuItemSchema = {
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    {
      name: 'titleEn',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'titleDe',
      title: 'Title (German)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug / ID',
      type: 'slug',
      options: {
        source: 'titleEn',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'menuCategory' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'foodType',
      title: 'Food Type (Primary Classification)',
      type: 'string',
      options: {
        list: [
          { title: 'Vegetarian (VEG)', value: 'vegetarian' },
          { title: 'Non-Vegetarian (NON-VEG)', value: 'nonVegetarian' },
          { title: 'Vegan (VEGAN)', value: 'vegan' },
        ],
        layout: 'radio',
      },
      initialValue: 'vegetarian',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'price',
      title: 'Price (e.g. €11,5 or Single €7,9 | Double €12,9)',
      type: 'string',
      description: 'Standard price or multiple size/portion options',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'priceEn',
      title: 'Price Options (English, optional)',
      type: 'string',
      description: 'Localized options e.g. "Chicken €12.5 | Prawns €14.5"',
    },
    {
      name: 'priceDe',
      title: 'Price Options (German, optional)',
      type: 'string',
      description: 'Localized options e.g. "Hähnchen €12,5 | Garnelen €14,5"',
    },
    {
      name: 'descEn',
      title: 'Description (English)',
      type: 'text',
      rows: 3,
    },
    {
      name: 'descDe',
      title: 'Description (German)',
      type: 'text',
      rows: 3,
    },
    {
      name: 'image',
      title: 'Food Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'featured',
      title: 'Featured on Homepage?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'available',
      title: 'Available / In Stock?',
      type: 'boolean',
      initialValue: true,
    },
    {
      name: 'popular',
      title: 'Popular Item?',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'isSpicy',
      title: 'Spicy? (Displays Spicy Indicator)',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'badgeEn',
      title: 'Marketing Badge (English, e.g. "Chef\'s Special")',
      type: 'string',
    },
    {
      name: 'badgeDe',
      title: 'Marketing Badge (German)',
      type: 'string',
    },
    {
      name: 'displayOrder',
      title: 'Display Order within Category',
      type: 'number',
      initialValue: 0,
    },
  ],
  orderings: [
    {
      title: 'Display Order',
      name: 'displayOrderAsc',
      by: [{ field: 'displayOrder', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'titleEn',
      subtitle: 'price',
      category: 'category.name',
      foodType: 'foodType',
      media: 'image',
    },
    prepare(selection: any) {
      const { title, subtitle, category, foodType, media } = selection;
      const typeLabel =
        foodType === 'vegan'
          ? 'VEGAN'
          : foodType === 'vegetarian'
          ? 'VEG'
          : 'NON-VEG';
      return {
        title: title || 'Untitled Item',
        subtitle: `${subtitle || ''} | ${category || 'No category'} [${typeLabel}]`,
        media,
      };
    },
  },
};
