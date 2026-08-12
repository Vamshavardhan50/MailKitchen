import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'restaurant.menu' | 'restaurant.restaurant';
  lang?: 'de' | 'en';
}

export const SEO: React.FC<SEOProps> = ({
  title = 'MAATI Kitchen | Fast Casual • Indian Soul | Berlin',
  description = 'Fresh, vibrant Indian ingredients in customizable Bowls, Salads, and Naan Pockets in Zimmerstraße 56, 10117 Berlin. Authentic spices, modern style.',
  keywords = 'MAATI Kitchen, Indian Food Berlin, Healthy Indian Bowls, Naan Pockets, Indian Restaurant Zimmerstraße, Berlin Fast Casual Indian',
  canonicalUrl = 'https://maatikitchen.com',
  ogImage = 'https://maatikitchen.com/assets/circle-Bq5xyFQD.png',
  ogType = 'website',
  lang = 'en'
}) => {
  useEffect(() => {
    // 1. Set Document Title
    document.title = title;

    // 2. Set or Update Meta Tag Helper
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta Tags
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'keywords', keywords);
    setMetaTag('name', 'author', 'MAATI Kitchen Berlin');

    // OpenGraph Meta Tags (Facebook, WhatsApp, LinkedIn)
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'MAATI Kitchen');
    setMetaTag('property', 'og:locale', lang === 'de' ? 'de_DE' : 'en_US');

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', canonicalUrl);

    // Update html lang attribute
    document.documentElement.lang = lang;
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, lang]);

  return null;
};
