import React, { useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface SEOHeadProps {
  title: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'profile' | 'event';
  publishedTime?: string;
  author?: string;
  canonicalUrl?: string;
  jsonLd?: Record<string, any>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  keywords,
  image = 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1200&q=80',
  type = 'website',
  publishedTime,
  author = 'Jamalpur Science & Technology University',
  canonicalUrl,
  jsonLd
}) => {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  useEffect(() => {
    const siteName = isBn
      ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়'
      : 'Jamalpur Science & Technology University (JSTU)';
    const siteSuffix = isBn
      ? 'জেএসটিইউ প্রাতিষ্ঠানিক পোর্টাল | জামালপুর-২০১২'
      : 'JSTU Smart Campus | Jamalpur-2012';

    const fullTitle = `${title} | ${siteSuffix}`;
    document.title = fullTitle;

    const currentUrl = canonicalUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const metaDesc =
      description ||
      (isBn
        ? 'জামালপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয় (জেএসটিইউ) - স্মার্ট ক্যাম্পাস, পেপারলেস গভর্ন্যান্স, একাডেমিক কারিকুলাম ও গবেষণা।'
        : 'Official portal of Jamalpur Science & Technology University (JSTU), Jamalpur-2012, Bangladesh. Smart paperless university services, accredited academic programs, and research.');

    // Helper to update or create meta tags
    const updateMeta = (selector: string, attrName: string, attrValue: string, content: string) => {
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attrName, attrValue);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Standard meta
    updateMeta('meta[name="description"]', 'name', 'description', metaDesc);
    if (keywords && keywords.length > 0) {
      updateMeta('meta[name="keywords"]', 'name', 'keywords', keywords.join(', '));
    }

    // OpenGraph
    updateMeta('meta[property="og:title"]', 'property', 'og:title', fullTitle);
    updateMeta('meta[property="og:description"]', 'property', 'og:description', metaDesc);
    updateMeta('meta[property="og:type"]', 'property', 'og:type', type);
    updateMeta('meta[property="og:url"]', 'property', 'og:url', currentUrl);
    updateMeta('meta[property="og:image"]', 'property', 'og:image', image);
    updateMeta('meta[property="og:site_name"]', 'property', 'og:site_name', siteName);
    updateMeta('meta[property="og:locale"]', 'property', 'og:locale', isBn ? 'bn_BD' : 'en_US');

    if (publishedTime) {
      updateMeta('meta[property="article:published_time"]', 'property', 'article:published_time', publishedTime);
    }
    if (author) {
      updateMeta('meta[property="article:author"]', 'property', 'article:author', author);
    }

    // Twitter Card
    updateMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    updateMeta('meta[name="twitter:title"]', 'name', 'twitter:title', fullTitle);
    updateMeta('meta[name="twitter:description"]', 'name', 'twitter:description', metaDesc);
    updateMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);

    // Canonical link tag
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', currentUrl);

    // Schema.org JSON-LD Structured Data
    const baseStructuredData = jsonLd || {
      '@context': 'https://schema.org',
      '@type': 'EducationalOrganization',
      name: siteName,
      alternateName: 'JSTU',
      url: currentUrl,
      logo: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Jamalpur Sadar',
        postalCode: '2012',
        addressCountry: 'BD'
      },
      sameAs: [
        'https://facebook.com',
        'https://twitter.com',
        'https://linkedin.com',
        'https://youtube.com'
      ]
    };

    let scriptLd = document.getElementById('jsonld-structured-data');
    if (!scriptLd) {
      scriptLd = document.createElement('script');
      scriptLd.id = 'jsonld-structured-data';
      scriptLd.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptLd);
    }
    scriptLd.textContent = JSON.stringify(baseStructuredData);
  }, [title, description, keywords, image, type, publishedTime, author, canonicalUrl, jsonLd, isBn]);

  return null;
};
