export interface LunchItem {
  id: string;
  title: string;
  desc: string;
  price: string;
  badge: 'NON-VEGETARIAN' | 'VEGETARIAN' | 'VEGAN';
  isSpicy?: boolean;
  isVeganLeaf?: boolean;
  img: string;
}

export interface BreakfastItem {
  id: string;
  title: string;
  desc: string;
  price: string;
  badge: 'VEGETARIAN' | 'VEGTARIAN' | 'NON-VEGETARIAN';
  img: string;
}

export interface DrinkItem {
  id: string;
  title: string;
  desc?: string;
  sizes: { label: string; price: string }[];
  badge?: string;
  isHot?: boolean;
  img: string;
}

export const LUNCH_ITEMS: LunchItem[] = [
  {
    id: 'delhi',
    title: "Delhi ‘Butter Chicken’ Bowl",
    desc: 'Roasted chicken, bulgur, kachumber salad, grilled paprika peppers, crushed papad, pickled onions, in tomato cream sauce.',
    price: '€10.9',
    badge: 'NON-VEGETARIAN',
    img: '/assets/Delhi-BteN_mdh.png'
  },
  {
    id: 'bengal',
    title: "Bengal ‘Mustard Chicken’ Bowl",
    desc: 'Grilled chicken, steamed white rice, cabbage and green slaw, grilled beetroot and carrots, spiced green mango, in coconut mustard sauce.',
    price: '€10.9',
    badge: 'NON-VEGETARIAN',
    img: '/assets/Bengal-birKfnj1.png'
  },
  {
    id: 'chettinad',
    title: "Chettinad ‘Spicy Chicken’ Bowl",
    desc: 'Grilled spicy chicken, red rice, green salad, yogurt, chopped tomatoes, corn, chopped onion & green chilies, in hot chettinad curry sauce.',
    price: '€11.9',
    badge: 'NON-VEGETARIAN',
    isSpicy: true,
    img: '/assets/Chettinad-D21PABvG.png'
  },
  {
    id: 'goa',
    title: "Goa ‘Tamarind Prawn’ Bowl",
    desc: "Butter-tossed prawns, red rice, kohlrabi salad, mixed greens, cherry tomatoes, roasted coconut flakes, spiced green mango in coconut tamarind sauce.",
    price: '€12.9',
    badge: 'NON-VEGETARIAN',
    img: '/assets/Goa-DLdcEMCP.png'
  },
  {
    id: 'kashmir',
    title: "Kashmir ‘Fennel Paneer’ Bowl",
    desc: "Grilled marinated paneer or tofu, pearl barley, green salad with roasted vegetables and sprouts, fried onions, in fennel ginger yogurt sauce (yakhni).",
    price: '€9.9',
    badge: 'VEGETARIAN',
    img: '/assets/Kashmir-Z2M0N-Rm.png'
  },
  {
    id: 'rajasthan',
    title: "Rajasthan ‘Crunchy Chaat’ Bowl",
    desc: "Crispy spiced chickpeas, puffed rice, kachumber salad, mint-coriander-tamarind chutney, pomegranate seeds, lemon squeeze, chaat masala.",
    price: '€9.9',
    badge: 'VEGAN',
    isVeganLeaf: true,
    img: '/assets/Rajasthan-DL_KoxiT.png'
  }
];

export const BREAKFAST_ITEMS: BreakfastItem[] = [
  {
    id: 'croissant-chutney',
    title: 'Green Chutney & Cheese Toasted Croissant',
    desc: 'Mixed Cheddar, Green Coriander Chutney',
    price: '€4',
    badge: 'VEGETARIAN',
    img: '/assets/wPT_69fdf67802a5542f2c8b6cf6.jpg'
  },
  {
    id: 'granola',
    title: 'Homemade Granola',
    desc: 'Oats, Cardomon, Coconut, Dates, Cashews, Honey over Yogurt & Fresh Fruits',
    price: '€4.5',
    badge: 'VEGTARIAN',
    img: '/assets/wPT_69fdf67802a5542f2c8b6cf8.jpg'
  },
  {
    id: 'croissant-turmeric',
    title: 'Turmeric & Cottage Cheese Croissant',
    desc: 'Cottage Cheese, Turmeric, Green Chili Cumin seeds, Nigella Seeds',
    price: '€4',
    badge: 'VEGETARIAN',
    img: '/assets/wPT_69fdf67802a5542f2c8b6cf7.jpg'
  }
];

export const COLD_DRINKS: DrinkItem[] = [
  {
    id: 'lemonade',
    title: 'Homemade Lemonade',
    desc: "Fresh lemon, sparkling water, black salt, sugar, a hint of roasted cumin India's original electrolyte drink, pupularly known as Nimbu Pani.",
    badge: 'VEGAN',
    sizes: [{ label: 'M (0.2l)', price: '€2.5' }, { label: 'L (0.33l)', price: '€3.5' }],
    img: '/assets/Lemonade.png'
  },
  {
    id: 'mango-lassi',
    title: 'Mango Lassi',
    desc: 'Chilled yogurt blended with fresh mangoes. Probiotic and cooling.',
    badge: 'VEGETARIAN',
    sizes: [{ label: 'M (0.2l)', price: '€2.9' }, { label: 'L (0.33l)', price: '€3.9' }],
    img: '/assets/Mango Lassi.png'
  },
  {
    id: 'rose-milk',
    title: 'Rose Milk',
    desc: 'Chilled milk infused with rose syrup, lightly sweet and refreshing. With vegan Options.',
    badge: 'VEGAN',
    sizes: [{ label: 'M (0.2l)', price: '€2.9' }, { label: 'L (0.33l)', price: '€3.9' }],
    img: '/assets/Rosemilk.png'
  }
];

export const HOT_DRINKS: DrinkItem[] = [
  {
    id: 'masala-chai',
    title: 'Masala Chai',
    desc: 'Black Tea Leaves boiled with Milk, wth hint of masala for added warmth. The quintissential indian hot drink.',
    badge: 'VEGETARIAN',
    sizes: [{ label: 'M', price: '€2.9' }, { label: 'L', price: '€3.9' }],
    isHot: true,
    img: '/assets/Cafe Latte_Maati.png'
  },
  {
    id: 'golden-milk',
    title: 'Golden Milk',
    desc: 'Premium Indian Turmeric, Ginger, Cinnamon ouch of Black pepper in warm milk. The secret health weapon of Indian Grandmothers. Vitality meets delicious. With vegan Options.',
    badge: 'VEGAN',
    sizes: [{ label: 'M', price: '€3.5' }, { label: 'L', price: '€4.5' }],
    isHot: true,
    img: '/assets/FlatWhite_Maati.png'
  }
];

export const MAATI_WAY_STEPS = [
  {
    step: 1,
    title: 'Choose your base (Upto 1)',
    items: ['White Rice', 'Red Rice', 'Bulgar Wheat', 'Pearl Barley', 'Salad(Mix)']
  },
  {
    step: 2,
    title: 'Choose your Protein',
    items: [
      'Poached Chicken (+€2)',
      'Grilled Chicken (+€2) 🌶️',
      'Grilled Spicy chicken (+€2.5)',
      'Butter Garlic Prawns (+€3)',
      'Grilled Paneer (+€1.5)',
      'Grilled Tofu (+€1)'
    ]
  },
  {
    step: 3,
    title: 'Choose your sides (Upto 2)',
    items: [
      'Dark Green Salad leaves',
      'Mixed salad (Kachumbar)',
      'Grilled Paprika',
      'Cherry Tomatoes',
      'Grilled Beetroot',
      'Sprout Salad',
      'Baby Carrots'
    ]
  },
  {
    step: 4,
    title: 'Choose your Sauce (Pick 1)',
    items: [
      'Tomato Cream Sauce',
      'Coconut Mustard Sauce',
      'Fennel Ginger Yoghurt Sauce',
      'Coconut Tamarind Sauce',
      'Chettinad Curry Sauce',
      'Coriander Mint Lemon Chutney'
    ]
  },
  {
    step: 5,
    title: 'Finishers (Upto 2)',
    items: [
      'Crushed Papads',
      'Spicy Crunchy Sev',
      'Diced Raw Mangoes',
      'Coriander chutney 🌶️',
      'Tamarind chutney',
      'Chopped Onions & Green Chillies 🌶️🌶️',
      'Roasted Cashews (+€2)'
    ]
  }
];

export const DICTIONARY = {
  de: {
    nav_menu: 'Speisekarte',
    nav_events: 'Events',
    nav_about: 'Über uns',
    nav_locations: 'Standorte',
    nav_reservations: 'Reservierungen',
    hero_badge: 'FAST CASUAL • INDIAN SOUL',
    hero_title_1: 'Craft Your Own',
    hero_title_2: 'Flavor Journey',
    hero_desc: 'Fresh, vibrant Indian ingredients in customizable Bowls, Salads, and Wraps.Authentic spices, Modern style.',
    hero_btn_menu: 'View Menu',
    hero_btn_res: 'Reservations',
    hero_fresh: 'FRESH INGREDIENTS',
    hero_spices: 'AUTHENTIC SPICES',
    hero_ready: 'READY IN MINUTES',
    lunch_title: 'House Favorites (Lunch)',
    lunch_desc: 'Discover our most-loved signature combinations, crafted for perfect balance.',
    maati_way_label: 'CUSTOMIZED TO YOUR TASTE',
    maati_way_title: 'The MAATI Way',
    breakfast_title: 'House Favorites (Breakfast)',
    breakfast_desc: 'Curated combinations for the perfect bite.',
    cold_title: 'Maati Cold Specials',
    hot_title: 'Maati Hot Specials',
    experience_label: 'EXPERIENCE',
    experience_title: 'Breakfast, Lunch and Events at MAATI',
    experience_desc: 'A warm, modern space designed for quick breakfast & lunches and cozy events alike.',
    experience_img_alt: 'Restaurant Interior — Warm Dining Experience',
    ready_label: 'READY TO EAT?',
    ready_title: 'Visit us at Zimmestr. 56, 10117 Berlin - where every bite tells a story.😊',
    ready_btn_menu: 'View Menu',
    ready_btn_res: 'Reservations',
    footer_tagline: 'Rooted in Indian tradition. Reimagined for the modern table.',
    location_address: 'ADRESSE',
    location_directions: 'ROUTE AUF GOOGLE MAPS ANZEIGEN',
    location_phone: 'TELEFON',
    location_email: 'E-MAIL',
    location_hours: 'ÖFFNUNGSZEITEN',
    location_book: 'Tisch reservieren',
    location_mon_fri: 'Montag - Freitag',
    location_sat: 'Samstag',
    location_sun: 'Sonntag',
    location_closed: 'Geschlossen',
    res_modal_title: 'Tisch reservieren'
  },
  en: {
    nav_menu: 'Menu',
    nav_events: 'Events',
    nav_about: 'About Us',
    nav_locations: 'Locations',
    nav_reservations: 'Reservations',
    hero_badge: 'FAST CASUAL • INDIAN SOUL',
    hero_title_1: 'Craft Your Own',
    hero_title_2: 'Flavor Journey',
    hero_desc: 'Fresh, vibrant Indian ingredients in customizable Bowls, Salads, and Wraps.Authentic spices, Modern style.',
    hero_btn_menu: 'View Menu',
    hero_btn_res: 'Reservations',
    hero_fresh: 'FRESH INGREDIENTS',
    hero_spices: 'AUTHENTIC SPICES',
    hero_ready: 'READY IN MINUTES',
    lunch_title: 'House Favorites (Lunch)',
    lunch_desc: 'Discover our most-loved signature combinations, crafted for perfect balance.',
    maati_way_label: 'CUSTOMIZED TO YOUR TASTE',
    maati_way_title: 'The MAATI Way',
    breakfast_title: 'House Favorites (Breakfast)',
    breakfast_desc: 'Curated combinations for the perfect bite.',
    cold_title: 'Maati Cold Specials',
    hot_title: 'Maati Hot Specials',
    experience_label: 'EXPERIENCE',
    experience_title: 'Breakfast, Lunch and Events at MAATI',
    experience_desc: 'A warm, modern space designed for quick breakfast & lunches and cozy events alike.',
    experience_img_alt: 'Restaurant Interior — Warm Dining Experience',
    ready_label: 'READY TO EAT?',
    ready_title: 'Visit us at Zimmestr. 56, 10117 Berlin - where every bite tells a story.😊',
    ready_btn_menu: 'View Menu',
    ready_btn_res: 'Reservations',
    footer_tagline: 'Rooted in Indian tradition. Reimagined for the modern table.',
    location_address: 'ADDRESS',
    location_directions: 'VIEW ON GOOGLE MAPS',
    location_phone: 'PHONE',
    location_email: 'EMAIL',
    location_hours: 'OPENING HOURS',
    location_book: 'Make a Reservation',
    location_mon_fri: 'Monday - Friday',
    location_sat: 'Saturday',
    location_sun: 'Sunday',
    location_closed: 'Closed',
    res_modal_title: 'Make a Reservation'
  }
};
