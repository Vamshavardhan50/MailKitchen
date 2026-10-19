import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'restaurant.menu' | 'restaurant.restaurant';
  lang?: 'de' | 'en';
  enPath?: string; // base path without /de prefix, e.g. "/events" or "/catering"
  robots?: string; // e.g. "index, follow" or "noindex, follow"
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'MAATI Kitchen | Modern Indian Restaurant & Café Berlin Mitte',
  description = 'Modern Indian food in Berlin Mitte: fresh bowls, naan pockets, curries, specialty coffee and chai. Vegan options. Zimmerstraße 56, near Checkpoint Charlie.',
  canonicalUrl,
  ogImage = 'https://maatikitchen.com/assets/circle-Bq5xyFQD.png',
  ogType = 'website',
  lang = 'en',
  enPath,
  robots = 'index, follow, max-image-preview:large',
  structuredData
}) => {
  useEffect(() => {
    // 1. Calculate proper canonical and hreflang URLs
    const rawPath = enPath !== undefined ? enPath : (typeof window !== 'undefined' ? window.location.pathname.replace(/^\/de(\/|$)/, '$1') : '');
    const cleanPath = rawPath === '' || rawPath === '/' ? '' : (rawPath.startsWith('/') ? rawPath : `/${rawPath}`);
    
    const enUrl = `https://maatikitchen.com${cleanPath}`;
    const deUrl = `https://maatikitchen.com/de${cleanPath}`;
    const currentCanonical = canonicalUrl || (lang === 'de' ? deUrl : enUrl);

    // 2. Set Document Title
    document.title = title;

    // 3. Set or Update Meta Tag Helper
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attrName, attrVal);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Standard Meta Tags - keywords explicitly eliminated as per SEO v2.0
    const keywordsEl = document.querySelector('meta[name="keywords"]');
    if (keywordsEl) {
      keywordsEl.remove();
    }

    setMetaTag('name', 'description', description);
    setMetaTag('name', 'author', 'MAATI Kitchen Berlin');
    setMetaTag('name', 'robots', robots);

    // OpenGraph Meta Tags
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:url', currentCanonical);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'MAATI Kitchen');
    setMetaTag('property', 'og:locale', lang === 'de' ? 'de_DE' : 'en_US');

    // Twitter Card Tags
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);

    // 4. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!canonicalLink) {
      canonicalLink = document.createElement('link');
      canonicalLink.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute('href', currentCanonical);

    // 5. Alternate Hreflang Tags (en, de, x-default)
    const setHreflang = (hreflang: string, href: string) => {
      let linkEl = document.querySelector(`link[rel="alternate"][hreflang="${hreflang}"]`) as HTMLLinkElement;
      if (!linkEl) {
        linkEl = document.createElement('link');
        linkEl.setAttribute('rel', 'alternate');
        linkEl.setAttribute('hreflang', hreflang);
        document.head.appendChild(linkEl);
      }
      linkEl.setAttribute('href', href);
    };

    setHreflang('en', enUrl);
    setHreflang('de', deUrl);
    setHreflang('x-default', enUrl);

    // 6. Update html lang attribute
    document.documentElement.lang = lang;

    // 7. Dynamic JSON-LD Structured Data if provided
    let scriptEl = document.querySelector('script#page-structured-data') as HTMLScriptElement;
    if (structuredData) {
      if (!scriptEl) {
        scriptEl = document.createElement('script');
        scriptEl.id = 'page-structured-data';
        scriptEl.type = 'application/ld+json';
        document.head.appendChild(scriptEl);
      }
      scriptEl.textContent = JSON.stringify(structuredData);
    } else if (scriptEl) {
      scriptEl.remove();
    }
  }, [title, description, canonicalUrl, ogImage, ogType, lang, enPath, robots, structuredData]);

  return null;
};

