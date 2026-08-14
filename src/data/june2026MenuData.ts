export interface MenuItem {
  id: string;
  titleDe: string;
  titleEn: string;
  descDe?: string;
  descEn?: string;
  price: string;
  priceDe?: string;
  priceEn?: string;
  badgeDe?: 'VEGETARISCH' | 'VEGAN' | 'NON-VEGETARIAN';
  badgeEn?: 'VEGETARIAN' | 'VEGAN' | 'NON-VEGETARIAN';
  isSpicy?: boolean;
  isVeganLeaf?: boolean;
  img?: string;
  choicesDe?: string[];
  choicesEn?: string[];
}

export const BREAKFAST_ITEMS: MenuItem[] = [
  {
    id: 'croissant-chutney',
    titleDe: 'Croissant mit grünem Chutney & Käse',
    titleEn: 'Croissant with Green Chutney & Cheese',
    descDe: 'Getoastetes Croissant mit einer Mischung aus Cheddar-Käse und frischem Koriander-Chutney.',
    descEn: 'Toasted croissant with a blend of Cheddar cheese and fresh coriander chutney.',
    price: '€4,9',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/croissant-green-chutney.jpg'
  },
  {
    id: 'granola-bio',
    titleDe: 'Hausgemachtes Granola',
    titleEn: 'Homemade Granola',
    descDe: 'Haferflocken, Zimt, Kardamom, Kokosnuss, Cashewnüsse, Rosinen und Ahornsirup, serviert auf Joghurt mit frischen Früchten.',
    descEn: 'Oats, cinnamon, cardamom, coconut, cashews, raisins and maple syrup served on yoghurt with fresh fruit.',
    price: '€5,5',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/wPT_69fdf67802a5542f2c8b6cf8.jpg'
  }
];

export const NAAN_POCKET_ITEM: MenuItem = {
  id: 'punjab-naan-pockets',
  titleDe: 'Punjab Naan Taschen',
  titleEn: 'Punjab Naan Pockets',
  descDe: 'Goldbraun und knusprig getoastetes Naan-Brot, gefüllt mit Ihrer Wahl an Protein und unserer speziellen Haussauce.',
  descEn: 'Golden-brown and crispy toasted naan bread, filled with your choice of protein and our special house sauce.',
  price: 'Single €7,9 | Double €12,9',
  priceDe: 'Single €7,9 | Double €12,9',
  priceEn: 'Single €7.9 | Double €12.9',
  badgeDe: 'NON-VEGETARIAN',
  badgeEn: 'NON-VEGETARIAN',
  choicesDe: [
    'Grillhähnchen Tikka',
    'Butterhähnchen',
    'Paneer Tikka',
    'Paneer Butter Masala'
  ],
  choicesEn: [
    'Chicken Tikka',
    'Butter Chicken',
    'Paneer Tikka',
    'Paneer Butter Masala'
  ],
  img: '/assets/punjab-naan-pocket.jpg'
};

export const HAUSSPEZIALITAETEN_ITEMS: MenuItem[] = [
  {
    id: 'chettinad-spicy-chicken',
    titleDe: "Chettinad 'Spicy Chicken' Bowl",
    titleEn: "Chettinad 'Spicy Chicken' Bowl",
    descDe: 'Gegrilltes Hähnchen, roter Reis, gemischter Salat, Gurkensalat, gegrillte Paprika und Mais, serviert mit einer scharfen Chettinad-Currysauce.',
    descEn: 'Grilled chicken, red rice, mixed salad, cucumber salad, grilled bell pepper and corn, served with a spicy Chettinad curry sauce.',
    price: '€12,5',
    badgeDe: 'NON-VEGETARIAN',
    badgeEn: 'NON-VEGETARIAN',
    isSpicy: true,
    img: '/assets/Chettinad-D21PABvG.png'
  },
  {
    id: 'delhi-butter-chicken',
    titleDe: "Delhi 'Butter Chicken' Bowl",
    titleEn: "Delhi 'Butter Chicken' Bowl",
    descDe: 'Gegrilltes Hähnchen, Bulgur, Gurkensalat, gegrillte Paprika und eingelegte Zwiebeln, serviert mit einer cremigen Tomaten-Currysauce.',
    descEn: 'Grilled chicken, bulgur, cucumber salad, grilled bell pepper and pickled onions, served with a creamy tomato curry sauce.',
    price: '€11,5',
    badgeDe: 'NON-VEGETARIAN',
    badgeEn: 'NON-VEGETARIAN',
    img: '/assets/Delhi-BteN_mdh.png'
  },
  {
    id: 'kashmir-spinach-paneer',
    titleDe: "Kashmir 'Spinach Paneer' Bowl (Vegetarisch)",
    titleEn: "Kashmir 'Spinach Paneer' Bowl (Vegetarian)",
    descDe: 'Gegrillter Paneer, weißer Reis, gemischter Salat, gegrillte Rote Bete und Mais, serviert mit einer cremigen Spinat-Currysauce.',
    descEn: 'Grilled paneer, white rice, mixed salad, grilled beetroot and corn, served with a creamy spinach curry sauce.',
    price: '€11,5',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/Kashmir-Z2M0N-Rm.png'
  },
  {
    id: 'bihar-lentil-potato',
    titleDe: "Bihar 'Lentil Potato' Bowl (Vegan)",
    titleEn: "Bihar 'Lentil Potato' Bowl (Vegan)",
    descDe: 'Weißer Reis, gelbe Linsensauce (Daal), sautierte Kartoffeln, würzige schwarze Kichererbsen, Gurkensalat und marinierte Mango.',
    descEn: 'White rice, yellow lentil dal, sautéed potatoes, spiced black chickpeas, cucumber salad and marinated mango.',
    price: '€10,5',
    badgeDe: 'VEGAN',
    badgeEn: 'VEGAN',
    isVeganLeaf: true,
    img: '/assets/bihar-lentil-potato.png'
  },
  {
    id: 'bengal-malai-chicken-prawn',
    titleDe: "Bengal 'Malai Chicken | Prawn' Bowl",
    titleEn: "Bengal 'Malai Chicken | Prawn' Bowl",
    descDe: 'Gegrilltes Hähnchen oder Garnelen, roter Reis, Gurkensalat, gegrillte Paprika und gewürzte grüne Mango, serviert mit einer milden weißen Malai-Currysauce.',
    descEn: 'Grilled chicken or prawns, red rice, cucumber salad, grilled bell pepper and spiced green mango, served with a mild white Malai curry sauce.',
    price: '€12,5 | €14,5',
    priceDe: 'Hähnchen €12,5 | Garnelen €14,5',
    priceEn: 'Chicken €12.5 | Prawns €14.5',
    badgeDe: 'NON-VEGETARIAN',
    badgeEn: 'NON-VEGETARIAN',
    img: '/assets/Bengal-birKfnj1.png'
  }
];

export const AUF_BESTELLUNG_ITEMS: MenuItem[] = [
  {
    id: 'goa-tamarind-prawn',
    titleDe: "Goa 'Tamarind Prawn' Bowl",
    titleEn: "Goa 'Tamarind Prawn' Bowl",
    descDe: 'In Butter gebratene Garnelen, roter Reis, Blattsalat, gegrillte Paprika und gewürzte grüne Mango, serviert mit einer Kokos-Tamarinden-Sauce.',
    descEn: 'Butter-fried prawns, red rice, lettuce salad, grilled bell pepper and spiced green mango, served with a coconut-tamarind sauce.',
    price: '€14,9',
    badgeDe: 'NON-VEGETARIAN',
    badgeEn: 'NON-VEGETARIAN',
    img: '/assets/Goa-DLdcEMCP.png'
  },
  {
    id: 'pondicherry-caesar-chicken',
    titleDe: "Pondicherry 'Caesar Chicken' Salat",
    titleEn: "Pondicherry 'Caesar Chicken' Salad",
    descDe: 'Knuspriger Römersalat, gegrilltes Hähnchen, Zwiebeln, Parmesan, frische Kräuter und cremiges Caesar-Dressing mit indischen Gewürzen.',
    descEn: 'Crispy Romaine lettuce, grilled chicken, onions, Parmesan, fresh herbs and creamy Caesar dressing with Indian spices.',
    price: '€12,9',
    badgeDe: 'NON-VEGETARIAN',
    badgeEn: 'NON-VEGETARIAN',
    img: '/assets/Pondichery-Cesear-Salad.png'
  },
  {
    id: 'rajasthan-chana-chaat',
    titleDe: "Rajasthan 'Chana Chaat' Bowl (Vegan)",
    titleEn: "Rajasthan 'Chana Chaat' Bowl (Vegan)",
    descDe: 'Schwarze Kichererbsen, Kartoffeln, Puffreis, Gurke, Sprossensalat, Tamarinden- und Koriander-Chutney, Zitronensaft und Chaat Masala.',
    descEn: 'Black chickpeas, potatoes, puffed rice, cucumber, sprout salad, tamarind and coriander chutney, lemon juice and chaat masala.',
    price: '€9,9',
    badgeDe: 'VEGAN',
    badgeEn: 'VEGAN',
    isVeganLeaf: true,
    img: '/assets/Rajasthan-DL_KoxiT.png'
  },
  {
    id: 'bread-selection',
    titleDe: "Brot-Auswahl",
    titleEn: "Bread Selection",
    descDe: 'Naan natur | Butter-Naan | Knoblauch-Naan.',
    descEn: 'Plain Naan | Butter Naan | Garlic Naan.',
    price: '€2,5 | €2,9',
    priceDe: 'Natur €2,5 | Butter/Knoblauch €2,9',
    priceEn: 'Plain €2.5 | Butter/Garlic €2.9',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/Naan-Pocket-Butter-Chicken.jpg'
  }
];

export const NACHTISCH_ITEMS: MenuItem[] = [
  {
    id: 'mithai-auswahl',
    titleDe: 'Mithai-Auswahl (Indische Süßigkeiten)',
    titleEn: 'Mithai Selection (Indian sweets)',
    descDe: 'Auswahl an traditionellen indischen Süßigkeiten.',
    descEn: 'Selection of traditional Indian sweets.',
    price: '€2,5',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/show1-But2Twuk.jpeg'
  },
  {
    id: 'kulfi-stick',
    titleDe: 'Indisches Kulfi-Eis am Stiel',
    titleEn: 'Indian Kulfi Ice Cream on a Stick',
    descDe: 'Traditionelles indisches Milcheis am Stiel.',
    descEn: 'Traditional Indian kulfi ice cream on a stick.',
    price: '€2,5',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/milk-nLvx7kLn.png'
  },
  {
    id: 'kulfi-cup',
    titleDe: 'Indisches Kulfi-Eis (Keramikbecher)',
    titleEn: 'Indian Kulfi Ice Cream (Ceramic Cup)',
    descDe: 'Köstliches indisches Kulfi-Eis serviert in einem traditionellen Keramikbecher zum Mitnehmen.',
    descEn: 'Delicious Indian kulfi ice cream served in a traditional souvenir ceramic cup.',
    price: '€3,9',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/circle-Bq5xyFQD.png'
  }
];

export const COLD_DRINKS: MenuItem[] = [
  {
    id: 'mango-lassi',
    titleDe: 'Mango Lassi',
    titleEn: 'Mango Lassi',
    descDe: 'Gekühlter Joghurt cremig gemixt mit sonnengereiften indischen Mangos.',
    descEn: 'Chilled yogurt blended with fresh mangoes. Probiotic and cooling.',
    price: 'M €2,5 | L €3,5',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/Mango Lassi.png'
  },
  {
    id: 'salted-lassi',
    titleDe: 'Salziger Lassi (Buttermilch)',
    titleEn: 'Salted Lassi (Buttermilk)',
    descDe: 'Würzig gesalzene indische Buttermilch mit geröstetem Kreuzkümmel und Minze.',
    descEn: 'Spiced salted Indian buttermilk with roasted cumin and mint.',
    price: 'M €2,5 | L €3,5',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/Buttermilk.png'
  },
  {
    id: 'rose-milk',
    titleDe: 'Rosenmilch',
    titleEn: 'Rose Milk',
    descDe: 'Gekühlte Milch verfeinert mit aromatischem Rosensirup. Auch vegan erhältlich.',
    descEn: 'Chilled milk infused with rose syrup, lightly sweet and refreshing. With vegan Options.',
    price: 'M €2,5 | L €3,5',
    badgeDe: 'VEGAN',
    badgeEn: 'VEGAN',
    isVeganLeaf: true,
    img: '/assets/Rosemilk.png'
  },
  {
    id: 'homemade-lemonade',
    titleDe: 'Hausgemachte Limonade',
    titleEn: 'Homemade Lemonade',
    descDe: 'Frische Zitrone, prickelndes Mineralwasser, schwarzes Salz, Rohrzucker, gerösteter Kreuzkümmel (Nimbu Pani).',
    descEn: 'Fresh lemon, sparkling water, black salt, sugar, a hint of roasted cumin India\'s original electrolyte drink, popularly known as Nimbu Pani.',
    price: 'M €2,5 | L €3,5',
    badgeDe: 'VEGAN',
    badgeEn: 'VEGAN',
    isVeganLeaf: true,
    img: '/assets/Lemonade.png'
  },
  {
    id: 'zuckerrohrsaft',
    titleDe: 'Zuckerrohrsaft',
    titleEn: 'Sugarcane Juice',
    descDe: 'Frisch gepresster Zuckerrohrsaft mit einem Hauch von Ingwer und Limette.',
    descEn: 'Freshly pressed sugarcane juice with a hint of ginger and lime.',
    price: 'M €2,5 | L €3,5',
    badgeDe: 'VEGAN',
    badgeEn: 'VEGAN',
    isVeganLeaf: true,
    img: '/assets/Sugarcane Juice.png'
  },
  {
    id: 'masala-chai-cold',
    titleDe: 'Masala Chai',
    titleEn: 'Masala Chai',
    descDe: 'Schwarzer Assam-Tee mit Milch und aromatischen Masala-Gewürzen, traditionell zubereitet.',
    descEn: 'Black tea leaves brewed with milk and a rich blend of traditional warm warming spices.',
    price: 'M €2,5 | L €3,5',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/Cafe Latte_Maati.png'
  }
];

export const HOT_DRINKS: MenuItem[] = [
  {
    id: 'espresso',
    titleDe: 'Espresso',
    titleEn: 'Espresso',
    descDe: 'Kräftiger, konzentrierter schwarzer Kaffee.',
    descEn: 'Strong, concentrated shot of black coffee.',
    price: 'M €2,4',
    img: '/assets/Americano_Maati.png'
  },
  {
    id: 'double-espresso',
    titleDe: 'Doppelter Espresso',
    titleEn: 'Double Espresso',
    descDe: 'Zwei Espressoshots für den doppelten Kaffeegenuss.',
    descEn: 'Double shot of rich, concentrated black coffee.',
    price: 'M €3,4',
    img: '/assets/Americano_Maati.png'
  },
  {
    id: 'americano',
    titleDe: 'Americano',
    titleEn: 'Americano',
    descDe: 'Espresso verlängert mit heißem Wasser.',
    descEn: 'Espresso shot diluted with hot water.',
    price: 'M €2,9 | L €3,9',
    img: '/assets/Americano_Maati.png'
  },
  {
    id: 'flat-white',
    titleDe: 'Flat White',
    titleEn: 'Flat White',
    descDe: 'Espresso mit samtigem, feinporigem Milchschaum.',
    descEn: 'Espresso with velvet-like microfoam milk.',
    price: 'M €3,9',
    img: '/assets/FlatWhite_Maati.png'
  },
  {
    id: 'cappuccino',
    titleDe: 'Cappuccino',
    titleEn: 'Cappuccino',
    descDe: 'Espresso mit heißer Milch und cremigem Schaum.',
    descEn: 'Espresso topped with steamed milk and thick microfoam.',
    price: 'M €3,5 | L €4,5',
    img: '/assets/FlatWhite_Maati.png'
  },
  {
    id: 'latte',
    titleDe: 'Latte',
    titleEn: 'Latte',
    descDe: 'Klassischer Milchkaffee mit viel Milchschaum.',
    descEn: 'Steamed milk poured over a shot of espresso with thin foam.',
    price: 'M €3,5 | L €4,5',
    img: '/assets/Cafe Latte_Maati.png'
  },
  {
    id: 'tea-assortments',
    titleDe: 'Tee-Auswahl',
    titleEn: 'Tea (Assortments)',
    descDe: 'Auswahl an verschiedenen feinen Teesorten.',
    descEn: 'Selection of various fine teas.',
    price: 'M €2,5 | L €3,5',
    img: '/assets/FlatWhite_Maati.png'
  }
];

export const BOTTLED_DRINKS: MenuItem[] = [
  {
    id: 'coca-cola',
    titleDe: 'Coca Cola',
    titleEn: 'Coca Cola',
    price: '0,2L €1,9 | 0,33L €2,9',
    img: '/assets/cola.png'
  },
  {
    id: 'fanta',
    titleDe: 'Fanta Orange',
    titleEn: 'Fanta Orange',
    price: '0,2L €1,9 | 0,33L €2,9',
    img: '/assets/fanta.png'
  },
  {
    id: 'mezzo-mix',
    titleDe: 'Mezzo Mix',
    titleEn: 'Mezzo Mix',
    price: '0,2L €1,9 | 0,33L €2,9',
    img: '/assets/Mezo-Mix.png'
  },
  {
    id: 'vio-schorle',
    titleDe: 'Vio Schorle',
    titleEn: 'Vio Schorle',
    price: '0,33L €2,9',
    img: '/assets/vio-schorle.png'
  },
  {
    id: 'fuze-tea',
    titleDe: 'Fuze Tea',
    titleEn: 'Fuze Tea',
    price: '0,33L €2,9',
    img: '/assets/cola.png'
  },
  {
    id: 'water-still-sparkling',
    titleDe: 'Stilles Wasser / Sprudelwasser',
    titleEn: 'Still / Sparkling Water',
    price: '0,2L €1,9 | 0,33L €2,9',
    img: '/assets/water.png'
  },
  {
    id: 'thums-up',
    titleDe: 'Thums Up (Indische Cola)',
    titleEn: 'Thums Up (Indian Cola)',
    price: '0,33L €3,5',
    img: '/assets/Thums-UP.png'
  }
];

export const ALKOHOLISCHE_GETRAENKE: MenuItem[] = [
  {
    id: 'bayreuther',
    titleDe: 'Bayreuther Hell (0,33L)',
    titleEn: 'Bayreuther Hell (0.33L)',
    price: '€2,9',
    img: '/assets/show4-8NQJNwyl.jpeg'
  },
  {
    id: 'augustiner',
    titleDe: 'Augustiner Lagerbier Hell (0,5L)',
    titleEn: 'Augustiner Lagerbier Hell (0.5L)',
    price: '€3,9',
    img: '/assets/show3-D0blnzja.jpeg'
  },
  {
    id: 'berliner-kindl',
    titleDe: 'Berliner Kindl Natur Radler (0,5L)',
    titleEn: 'Berliner Kindl Natur Radler (0.5L)',
    price: '€3,5',
    img: '/assets/show4-8NQJNwyl.jpeg'
  }
];

export const COCKTAILS: MenuItem[] = [
  {
    id: 'aperol-spritz',
    titleDe: 'Aperol Spritz',
    titleEn: 'Aperol Spritz',
    descDe: 'Aperol, Prosecco, Soda oder Sprite, Orangenscheibe.',
    descEn: 'Aperol, Prosecco, soda or Sprite, orange slice.',
    price: '€7,5',
    img: '/assets/cocktail-1.jpg'
  },
  {
    id: 'mojito',
    titleDe: 'Mojito',
    titleEn: 'Mojito',
    descDe: 'Weißer Rum, Limettensaft, Minzblätter, Zucker, Sodawasser.',
    descEn: 'White rum, lime juice, mint leaves, sugar, soda water.',
    price: '€7,5',
    img: '/assets/cocktail-2.jpg'
  },
  {
    id: 'negroni',
    titleDe: 'Negroni',
    titleEn: 'Negroni',
    descDe: 'Gin, Campari, roter Wermut, Orangenschale.',
    descEn: 'Gin, Campari, sweet red vermouth, orange peel.',
    price: '€10',
    img: '/assets/cocktail-3.jpg'
  },
  {
    id: 'moscow-mule',
    titleDe: 'Moscow Mule',
    titleEn: 'Moscow Mule',
    descDe: 'Wodka, Ginger Beer, Limettensaft, Limettenspalte.',
    descEn: 'Vodka, ginger beer, lime juice, lime wedge.',
    price: '€10',
    img: '/assets/cocktail-4.jpg'
  },
  {
    id: 'tequila-sunrise',
    titleDe: 'Tequila Sunrise',
    titleEn: 'Tequila Sunrise',
    descDe: 'Tequila, Orangensaft, Grenadine, Orangenscheibe.',
    descEn: 'Tequila, orange juice, grenadine, orange slice.',
    price: '€10',
    img: '/assets/cocktail-5.jpg'
  },
  {
    id: 'long-island-tea',
    titleDe: 'Long Island Iced Tea',
    titleEn: 'Long Island Iced Tea',
    descDe: 'Weißer Rum, Limettensaft, Zuckersirup, Cola, Gin, Wodka, Tequila.',
    descEn: 'White rum, lime juice, sugar syrup, cola, gin, vodka, tequila.',
    price: '€10',
    img: '/assets/cocktail-6.jpg'
  },
  {
    id: 'gin-tonic',
    titleDe: 'Gin und Tonic',
    titleEn: 'Gin and Tonic',
    descDe: 'Gin, Tonic Water, Zitronenzeste.',
    descEn: 'Gin, tonic water, lemon zest.',
    price: '€10',
    img: '/assets/cocktail-7.jpg'
  },
  {
    id: 'old-fashioned',
    titleDe: 'Old Fashioned',
    titleEn: 'Old Fashioned',
    descDe: 'Rum, Limettensaft, Orgeat-Sirup, Minzzweig.',
    descEn: 'Rum, lime juice, Orgeat syrup, mint sprig.',
    price: '€10',
    img: '/assets/cocktail-8.jpg'
  },
  {
    id: 'nimbu-pani-julep',
    titleDe: 'Nimbu Pani Julep',
    titleEn: 'Nimbu Pani Julep',
    descDe: 'Weißer Rum, Limettensaft, Minzblätter, Zuckersirup, Chaat Masala.',
    descEn: 'White rum, lime juice, mint leaves, sugar syrup, chaat masala.',
    price: '€10',
    img: '/assets/cocktail-9.jpg'
  },
  {
    id: 'spicy-mango-martini',
    titleDe: 'Spicy Mango Martini',
    titleEn: 'Spicy Mango Martini',
    descDe: 'Tequila, Mangopüree, Limettensaft, Triple Sec, Tajín-Gewürzrand.',
    descEn: 'Tequila, mango puree, lime juice, triple sec, Tajín spice rim.',
    price: '€10',
    img: '/assets/cocktail-10.jpg'
  }
];
