/**
 * Centralized GROQ Queries for MAATI Kitchen
 */

// 1. Get all active categories sorted by display order (excluding drafts)
export const getMenuCategoriesQuery = `
  *[_type == "menuCategory" && active != false && !(_id in path("drafts.**"))] | order(displayOrder asc) {
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

// 2. Get all available menu items with dereferenced category (excluding drafts)
export const getMenuItemsQuery = `
  *[_type == "menuItem" && available != false && !(_id in path("drafts.**"))] | order(displayOrder asc) {
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

// 3. Get featured menu items for Homepage (featured == true && available != false, excluding drafts)
export const getFeaturedMenuItemsQuery = `
  *[_type == "menuItem" && featured == true && available != false && !(_id in path("drafts.**"))] | order(featuredOrder asc, displayOrder asc) {
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
    featuredOrder,
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

// 4. Get active categories with nested available items (excluding drafts)
export const getMenuByCategoryQuery = `
  *[_type == "menuCategory" && active != false && !(_id in path("drafts.**"))] | order(displayOrder asc) {
    _id,
    name,
    nameDe,
    slug,
    description,
    descriptionDe,
    displayOrder,
    "items": *[_type == "menuItem" && references(^._id) && available != false && !(_id in path("drafts.**"))] | order(displayOrder asc) {
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
      featuredOrder,
      available,
      popular,
      isSpicy,
      badgeEn,
      badgeDe,
      displayOrder
    }
  }
`;

// 5. Get Homepage Content (excluding drafts)
export const getHomepageQuery = `
  *[_type == "homepage" && !(_id in path("drafts.**"))][0]
`;

// 6. Get Global Site Settings (excluding drafts)
export const getSiteSettingsQuery = `
  *[_type == "siteSettings" && !(_id in path("drafts.**"))][0]
`;

