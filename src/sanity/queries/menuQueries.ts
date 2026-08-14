/**
 * Centralized GROQ Queries for MAATI Kitchen
 */

// 1. Get all active categories sorted by display order
export const getMenuCategoriesQuery = `
  *[_type == "menuCategory" && active == true] | order(displayOrder asc) {
    _id,
    name,
    nameDe,
    slug,
    description,
    descriptionDe,
    image,
    displayOrder
  }
`;

// 2. Get all available menu items with dereferenced category
export const getMenuItemsQuery = `
  *[_type == "menuItem" && available == true] | order(displayOrder asc) {
    _id,
    titleEn,
    titleDe,
    slug,
    descEn,
    descDe,
    price,
    priceEn,
    priceDe,
    foodType,
    image,
    featured,
    available,
    popular,
    isSpicy,
    badgeEn,
    badgeDe,
    displayOrder,
    category->{
      _id,
      name,
      nameDe,
      slug
    }
  }
`;

// 3. Get featured menu items for Homepage (featured == true && available == true)
export const getFeaturedMenuItemsQuery = `
  *[_type == "menuItem" && featured == true && available == true] | order(displayOrder asc) {
    _id,
    titleEn,
    titleDe,
    slug,
    descEn,
    descDe,
    price,
    priceEn,
    priceDe,
    foodType,
    image,
    featured,
    available,
    popular,
    isSpicy,
    badgeEn,
    badgeDe,
    displayOrder,
    category->{
      _id,
      name,
      nameDe,
      slug
    }
  }
`;

// 4. Get active categories with nested available items
export const getMenuByCategoryQuery = `
  *[_type == "menuCategory" && active == true] | order(displayOrder asc) {
    _id,
    name,
    nameDe,
    slug,
    description,
    descriptionDe,
    displayOrder,
    "items": *[_type == "menuItem" && references(^._id) && available == true] | order(displayOrder asc) {
      _id,
      titleEn,
      titleDe,
      slug,
      descEn,
      descDe,
      price,
      priceEn,
      priceDe,
      foodType,
      image,
      featured,
      available,
      popular,
      isSpicy,
      badgeEn,
      badgeDe,
      displayOrder
    }
  }
`;

// 5. Get Homepage Content
export const getHomepageQuery = `
  *[_type == "homepage"][0] {
    _id,
    heroEyebrowEn,
    heroEyebrowDe,
    heroTitleEn,
    heroTitleDe,
    heroSubtitleEn,
    heroSubtitleDe,
    heroDescEn,
    heroDescDe,
    heroImage,
    featuredEyebrowEn,
    featuredEyebrowDe,
    featuredTitleEn,
    featuredTitleDe,
    experienceEyebrowEn,
    experienceEyebrowDe,
    experienceTitleEn,
    experienceTitleDe,
    experienceDescEn,
    experienceDescDe,
    cateringTitleEn,
    cateringTitleDe,
    cateringDescEn,
    cateringDescDe
  }
`;

// 6. Get Global Site Settings
export const getSiteSettingsQuery = `
  *[_type == "siteSettings"][0] {
    _id,
    restaurantName,
    taglineEn,
    taglineDe,
    logo,
    phone,
    email,
    address,
    openingHoursEn,
    openingHoursDe,
    instagram,
    facebook,
    googleMapsUrl
  }
`;
