export interface MenuItem {
  id: string;
  titleDe: string;
  titleEn: string;
  descDe?: string;
  descEn?: string;
  price: string;
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
    titleDe: 'Green Chutney & Cheese Toasted Croissant',
    titleEn: 'Green Chutney & Cheese Toasted Croissant',
    descDe: 'Getoastetes Croissant mit Gemischtem Cheddar-Käse und grünem Koriander-Chutney.',
    descEn: 'Mixed Cheddar, Green Coriander Chutney',
    price: '€4',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/wPT_69fdf67802a5542f2c8b6cf6.jpg'
  },
  {
    id: 'granola-bio',
    titleDe: 'Homemade Granola',
    titleEn: 'Homemade Granola',
    descDe: 'Haferflocken, Kardamom, Kokosnuss, Datteln, Cashews, Honig auf Joghurt & frische Früchte.',
    descEn: 'Oats, Cardomon, Coconut, Dates, Cashews, Honey over Yogurt & Fresh Fruits',
    price: '€4.5',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/wPT_69fdf67802a5542f2c8b6cf8.jpg'
  },
  {
    id: 'croissant-turmeric',
    titleDe: 'Turmeric & Cottage Cheese Croissant',
    titleEn: 'Turmeric & Cottage Cheese Croissant',
    descDe: 'Hüttenkäse, Kurkuma, grüne Chili, Kreuzkümmelsamen und Schwarzkümmelsamen.',
    descEn: 'Cottage Cheese, Turmeric, Green Chili Cumin seeds, Nigella Seeds',
    price: '€4',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/wPT_69fdf67802a5542f2c8b6cf7.jpg'
  }
];

export const NAAN_POCKET_ITEM: MenuItem = {
  id: 'punjab-naan-pockets',
  titleDe: 'Punjab Naan Pockets',
  titleEn: 'Punjab Naan Pockets',
  descDe: 'Goldbraun und knusprig getoastet Naan-Brot, gefüllt mit einer Proteinquelle nach Wahl und unserer speziellen Haussauce.',
  descEn: 'Golden-brown toasted Naan bread stuffed with your choice of protein (Chicken Tikka, Butter Chicken, Paneer Tikka, Paneer Butter Masala).',
  price: '€7,9',
  badgeDe: 'VEGETARISCH',
  badgeEn: 'VEGETARIAN',
  choicesDe: [
    'Chicken Tikka',
    'Butter Chicken',
    'Paneer Tikka',
    'Paneer Butter Masala'
  ],
  choicesEn: [
    'Chicken Tikka',
    'Butter Chicken',
    'Paneer Tikka',
    'Paneer Butter Masala'
  ],
  img: '/assets/wPT_Punjab Naan Pocket Butter Chicken.jpg'
};

export const HAUSSPEZIALITAETEN_ITEMS: MenuItem[] = [
  {
    id: 'delhi-butter-chicken',
    titleDe: "Delhi ‘Butter Chicken’ Bowl",
    titleEn: "Delhi ‘Butter Chicken’ Bowl",
    descDe: 'Gewürztes Grillhähnchen in Sahnesauce, grober Bulgur, Kachumber-Salat, gegrillte Paprika, eingelegte Zwiebeln, in einer Tomaten-Sahne-Sauce.',
    descEn: 'Roasted chicken, bulgur, kachumber salad, grilled paprika peppers, crushed papad, pickled onions, in tomato cream sauce.',
    price: '€10.9',
    badgeDe: 'NON-VEGETARIAN',
    badgeEn: 'NON-VEGETARIAN',
    img: '/assets/Delhi-BteN_mdh.png'
  },
  {
    id: 'bengal-mustard-chicken',
    titleDe: "Bengal ‘Mustard Chicken’ Bowl",
    titleEn: "Bengal ‘Mustard Chicken’ Bowl",
    descDe: 'Gegrilltes Hähnchen, gedämpfter weißer Reis, Kohl-und-Grün-Krautsalat, gegrillte Rote Bete und Karotten, gewürzte grüne Mango, in Kokos-Senf-Sauce.',
    descEn: 'Grilled chicken, steamed white rice, cabbage and green slaw, grilled beetroot and carrots, spiced green mango, in coconut mustard sauce.',
    price: '€10.9',
    badgeDe: 'NON-VEGETARIAN',
    badgeEn: 'NON-VEGETARIAN',
    img: '/assets/Bengal-birKfnj1.png'
  },
  {
    id: 'chettinad-spicy-chicken',
    titleDe: "Chettinad ‘Spicy Chicken’ Bowl",
    titleEn: "Chettinad ‘Spicy Chicken’ Bowl",
    descDe: 'Gewürztes Grillhähnchen, roter Reis, grüner Salat, Joghurt, gehackte Tomaten, Mais, gehackte Zwiebeln und grüne Chilis, in scharfer Chettinad-Currysauce.',
    descEn: 'Grilled spicy chicken, red rice, green salad, yogurt, chopped tomatoes, corn, chopped onion & green chilies, in hot chettinad curry sauce.',
    price: '€11.9',
    badgeDe: 'NON-VEGETARIAN',
    badgeEn: 'NON-VEGETARIAN',
    isSpicy: true,
    img: '/assets/Chettinad-D21PABvG.png'
  },
  {
    id: 'goa-tamarind-prawn',
    titleDe: "Goa ‘Tamarind Prawn’ Bowl",
    titleEn: "Goa ‘Tamarind Prawn’ Bowl",
    descDe: 'In Butter gebratene Garnelen, roter Reis, Kohlrabi-Salat, gemischter Blattsalat, Kirschtomaten, geröstete Kokosflocken, gewürzte grüne Mango in Kokos-Tamarinden-Sauce.',
    descEn: 'Butter-tossed prawns, red rice, kohlrabi salad, mixed greens, cherry tomatoes, roasted coconut flakes, spiced green mango in coconut tamarind sauce.',
    price: '€12.9',
    badgeDe: 'NON-VEGETARIAN',
    badgeEn: 'NON-VEGETARIAN',
    img: '/assets/Goa-DLdcEMCP.png'
  },
  {
    id: 'kashmir-fennel-paneer',
    titleDe: "Kashmir ‘Fennel Paneer’ Bowl",
    titleEn: "Kashmir ‘Fennel Paneer’ Bowl",
    descDe: 'Gegrillter marinierter Paneer oder Tofu, Perlgraupen, grüner Salat mit Röstgemüse und Sprossen, Röstzwiebeln, in Fenchel-Ingwer-Joghurtsauce (Yakhni).',
    descEn: 'Grilled marinated paneer or tofu, pearl barley, green salad with roasted vegetables and sprouts, fried onions, in fennel ginger yogurt sauce (yakhni).',
    price: '€9.9',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/Kashmir-Z2M0N-Rm.png'
  },
  {
    id: 'rajasthan-crunchy-chaat',
    titleDe: "Rajasthan ‘Crunchy Chaat’ Bowl",
    titleEn: "Rajasthan ‘Crunchy Chaat’ Bowl",
    descDe: 'Knusprig gewürzte Kichererbsen, Puffreis, Kachumber-Salat, Minz-Koriander-Tamarinden-Chutney, Granatapfelkerne, frischer Zitronensaft, Chaat Masala.',
    descEn: 'Crispy spiced chickpeas, puffed rice, kachumber salad, mint-coriander-tamarind chutney, pomegranate seeds, lemon squeeze, chaat masala.',
    price: '€9.9',
    badgeDe: 'VEGAN',
    badgeEn: 'VEGAN',
    isVeganLeaf: true,
    img: '/assets/Rajasthan-DL_KoxiT.png'
  }
];

export const AUF_BESTELLUNG_ITEMS: MenuItem[] = [
  {
    id: 'bihar-lentil-potato',
    titleDe: "Bihar 'Lentil Potato' Bowl",
    titleEn: "Bihar 'Lentil Potato' Bowl",
    descDe: 'Weißer Reis, gelbe Linsensauce (Daal), sautierte Kartoffeln, würzige schwarze Kichererbsen, Kachumber-Salat und gewürzte Mangostücke.',
    descEn: 'Steamed white rice, yellow lentil daal, sautéed potatoes, spiced black chickpeas, kachumber salad and spiced green mango.',
    price: '€11,5',
    badgeDe: 'VEGAN',
    badgeEn: 'VEGAN',
    isVeganLeaf: true,
    img: '/assets/Bihar Lentil Potato Bowl.png'
  },
  {
    id: 'pondicherry-chicken-caesar',
    titleDe: "Pondicherry 'Chicken Caesar' Salad",
    titleEn: "Pondicherry 'Chicken Caesar' Salad",
    descDe: 'Frischer Römersalat, gegrilltes Hähnchen, Zwiebeln, Parmesan, frische Kräuter und cremiges Caesar-Dressing mit einer feinen indischen Gewürznote.',
    descEn: 'Fresh romaine lettuce, grilled chicken, onions, parmesan, fresh herbs and creamy Caesar dressing with a subtle Indian spice accent.',
    price: '€14,9',
    badgeDe: 'NON-VEGETARIAN',
    badgeEn: 'NON-VEGETARIAN',
    img: '/assets/Pondichery Cesear Salad.png'
  }
];

export const NACHTISCH_ITEMS: MenuItem[] = [
  {
    id: 'mithai-auswahl',
    titleDe: 'Mithai Selection (Indian Sweets)',
    titleEn: 'Mithai Selection (Indian Sweets)',
    descDe: 'Traditionelle indische Süßigkeitenspezialitäten mit Safran, Kardamom und Nüssen.',
    descEn: 'Traditional Indian sweet delicacies with saffron, cardamom and nuts.',
    price: '€2,5',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/show1-But2Twuk.jpeg'
  },
  {
    id: 'kulfi-eis',
    titleDe: 'Indian Kulfi Ice Cream',
    titleEn: 'Indian Kulfi Ice Cream',
    descDe: 'Cremiges, traditionell hergestelltes indisches Eis am Stiel mit Pistazie und Kardamom.',
    descEn: 'Creamy, traditional slow-cooked Indian ice cream infused with pistachio & cardamom.',
    price: '€3,9',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/circle-Bq5xyFQD.png'
  }
];

export const COLD_DRINKS: MenuItem[] = [
  {
    id: 'homemade-lemonade',
    titleDe: 'Homemade Lemonade',
    titleEn: 'Homemade Lemonade',
    descDe: "Frische Zitrone, prickelndes Mineralwasser, schwarzes Salz, Rohrzucker, gerösteter Kreuzkümmel — Indiens traditionelles Erfrischungsgetränk (Nimbu Pani).",
    descEn: "Fresh lemon, sparkling water, black salt, sugar, a hint of roasted cumin India's original electrolyte drink, pupularly known as Nimbu Pani.",
    price: 'M €2.5 | L €3.5',
    badgeDe: 'VEGAN',
    badgeEn: 'VEGAN',
    img: '/assets/Lemonade.png'
  },
  {
    id: 'mango-lassi',
    titleDe: 'Mango Lassi',
    titleEn: 'Mango Lassi',
    descDe: 'Gekühlter Joghurt cremig gemixt mit sonnengereiften indischen Mangos. Probiotisch und erfrischend.',
    descEn: 'Chilled yogurt blended with fresh mangoes. Probiotic and cooling.',
    price: 'M €2.9 | L €3.9',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/Mango Lassi.png'
  },
  {
    id: 'rose-milk',
    titleDe: 'Rose Milk',
    titleEn: 'Rose Milk',
    descDe: 'Gekühlte Milch verfeinert mit aromatischem Rosensirup, angenehm süß und belebend. Auch vegan erhältlich.',
    descEn: 'Chilled milk infused with rose syrup, lightly sweet and refreshing. With vegan Options.',
    price: 'M €2.9 | L €3.9',
    badgeDe: 'VEGAN',
    badgeEn: 'VEGAN',
    img: '/assets/Rosemilk.png'
  },
  {
    id: 'salted-lassi',
    titleDe: 'Salted Lassi (Buttermilk)',
    titleEn: 'Salted Lassi (Buttermilk)',
    descDe: 'Würzig gesalzene indische Buttermilch mit geröstetem Kreuzkümmel und Minze.',
    descEn: 'Spiced salted Indian buttermilk with roasted cumin and mint.',
    price: 'M €2,5 | L €3,5',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/Buttermilk.png'
  },
  {
    id: 'zuckerrohrsaft',
    titleDe: 'Zuckerrohrsaft (Sugarcane Juice)',
    titleEn: 'Sugarcane Juice',
    descDe: 'Frisch gepresster Zuckerrohrsaft mit einem Hauch von Ingwer und Limette.',
    descEn: 'Freshly pressed sugarcane juice with a hint of ginger and lime.',
    price: 'M €3,5 | L €4,9',
    badgeDe: 'VEGAN',
    badgeEn: 'VEGAN',
    img: '/assets/Sugarcane Juice.png'
  }
];

export const HOT_DRINKS: MenuItem[] = [
  {
    id: 'masala-chai',
    titleDe: 'Masala Chai',
    titleEn: 'Masala Chai',
    descDe: 'Schwarzer Assam-Tee mit Milch aufgekocht und mit aromatischen Masala-Gewürzen (Kardamom, Zimt, Nelken) verfeinert.',
    descEn: 'Black Tea Leaves boiled with Milk, wth hint of masala for added warmth. The quintissential indian hot drink.',
    price: 'M €2.9 | L €3.9',
    badgeDe: 'VEGETARISCH',
    badgeEn: 'VEGETARIAN',
    img: '/assets/Cafe Latte_Maati.png'
  },
  {
    id: 'golden-milk',
    titleDe: 'Golden Milk',
    titleEn: 'Golden Milk',
    descDe: 'Hochwertiger indischer Kurkuma, Ingwer, Zimt und ein Hauch schwarzer Pfeffer in warmer Milch. Auch vegan erhältlich.',
    descEn: 'Premium Indian Turmeric, Ginger, Cinnamon ouch of Black pepper in warm milk. The secret health weapon of Indian Grandmothers. Vitality meets delicious. With vegan Options.',
    price: 'M €3.5 | L €4.5',
    badgeDe: 'VEGAN',
    badgeEn: 'VEGAN',
    img: '/assets/FlatWhite_Maati.png'
  }
];

export const ALKOHOLISCHE_GETRAENKE: MenuItem[] = [
  {
    id: 'bayreuther',
    titleDe: 'Bayreuther Hell (0,33L)',
    titleEn: 'Bayreuther Hell (0.33L)',
    descDe: 'Klassisches bayerisches Helles, süffig und ausgewogen.',
    descEn: 'Classic Bavarian mild lager, crisp and well-balanced.',
    price: '€2,9',
    img: '/assets/show4-8NQJNwyl.jpeg'
  },
  {
    id: 'augustiner',
    titleDe: 'Augustiner Lagerbier Hell (0,5L)',
    titleEn: 'Augustiner Lagerbier Hell (0.5L)',
    descDe: 'Münchens ältestes Traditionsbier, besonders mild und spritzig.',
    descEn: 'Munich’s oldest traditional lager, mild and refreshing.',
    price: '€3,9',
    img: '/assets/show3-D0blnzja.jpeg'
  },
  {
    id: 'berliner-kindl',
    titleDe: 'Berliner Kindl Natur Radler (0,5L)',
    titleEn: 'Berliner Kindl Natur Radler (0.5L)',
    descDe: 'Erfrischendes Radler mit natürlicher Zitronenlimonade.',
    descEn: 'Refreshing shandy with natural lemon soda.',
    price: '€3,9',
    img: '/assets/Lemonade.png'
  }
];

export const COCKTAILS: MenuItem[] = [
  {
    id: 'aperol-spritz',
    titleDe: 'Aperol Spritz',
    titleEn: 'Aperol Spritz',
    descDe: 'Prosecco, Aperol, Sodawasser und frische Orangenscheibe.',
    descEn: 'Prosecco, Aperol, soda water and fresh orange slice.',
    price: '€7,5',
    img: '/assets/show5-BiQql1jr.jpeg'
  },
  {
    id: 'old-fashioned',
    titleDe: 'Old Fashioned',
    titleEn: 'Old Fashioned',
    descDe: 'Bourbon Whiskey, Rohrzuckersirup, Angostura- und Orangenbitter.',
    descEn: 'Bourbon Whiskey, sugar syrup, Angostura & orange bitters.',
    price: '€9',
    img: '/assets/show2-CM6MShfY.jpeg'
  }
];
