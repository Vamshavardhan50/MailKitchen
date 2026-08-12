export const menuItemSchema = {
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    {
      name: 'id',
      title: 'Item ID (Slug/Unique Key)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
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
      name: 'price',
      title: 'Price (e.g. €10.9)',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'House Favorites (Breakfast)', value: 'breakfast' },
          { title: 'Punjab Naan Pockets', value: 'naan-pockets' },
          { title: 'House Favorites (Lunch Bowls)', value: 'lunch' },
          { title: 'Made to Order', value: 'made-to-order' },
          { title: 'Desserts', value: 'desserts' },
          { title: 'Cold Specials', value: 'cold-drinks' },
          { title: 'Hot Specials', value: 'hot-drinks' },
          { title: 'Alcoholic Beverages', value: 'alcoholic' },
          { title: 'Cocktails', value: 'cocktails' },
        ],
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'badgeEn',
      title: 'Dietary Badge (English - e.g. VEGAN, VEGETARIAN, NON-VEGETARIAN)',
      type: 'string',
    },
    {
      name: 'badgeDe',
      title: 'Dietary Badge (German)',
      type: 'string',
    },
    {
      name: 'isSpicy',
      title: 'Spicy? (Shows 🌶️)',
      type: 'boolean',
      initialValue: false,
    },
    {
      name: 'isVeganLeaf',
      title: 'Vegan Leaf Symbol? (Shows 🌱)',
      type: 'boolean',
      initialValue: false,
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
      name: 'order',
      title: 'Display Order',
      type: 'number',
      initialValue: 0,
    },
  ],
};

export const schemaTypes = [menuItemSchema];
