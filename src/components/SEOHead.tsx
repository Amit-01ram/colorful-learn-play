import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'article' | 'video' | 'website';
  publishedTime?: string;
  author?: string;
  videoData?: {
    duration?: number;
    uploadDate?: string;
    thumbnailUrl?: string;
    embedUrl?: string;
  };
}

export default function SEOHead({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  publishedTime,
  author,
  videoData
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Update meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords || '');
    
    // Open Graph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:url', url || window.location.href, 'property');
    updateMetaTag('og:image', image || '', 'property');
    
    if (publishedTime) {
      updateMetaTag('article:published_time', publishedTime, 'property');
    }
    
    if (author) {
      updateMetaTag('article:author', author, 'property');
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', type === 'video' ? 'player' : 'summary_large_image', 'name');
    updateMetaTag('twitter:title', title, 'name');
    updateMetaTag('twitter:description', description, 'name');
    updateMetaTag('twitter:image', image || '', 'name');

    // Video-specific Open Graph tags
    if (type === 'video' && videoData) {
      updateMetaTag('og:video', videoData.embedUrl || '', 'property');
      updateMetaTag('og:video:type', 'text/html', 'property');
      updateMetaTag('og:video:width', '1280', 'property');
      updateMetaTag('og:video:height', '720', 'property');
      
      if (videoData.duration) {
        updateMetaTag('video:duration', videoData.duration.toString(), 'property');
      }
    }

    // Canonical URL
    updateLinkTag('canonical', url || window.location.href);

    // Structured Data for Videos
    if (type === 'video' && videoData) {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": title,
        "description": description,
        "thumbnailUrl": videoData.thumbnailUrl || image,
        "uploadDate": videoData.uploadDate || publishedTime,
        "duration": videoData.duration ? `PT${videoData.duration}S` : undefined,
        "embedUrl": videoData.embedUrl,
        "publisher": {
          "@type": "Organization",
          "name": "Content Hub",
          "url": window.location.origin
        }
      };

      updateStructuredData('video-schema', structuredData);
    }

    // Structured Data for Articles
    if (type === 'article') {
      const structuredData = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": title,
        "description": description,
        "image": image,
        "datePublished": publishedTime,
        "author": {
          "@type": "Person",
          "name": author || "Content Hub"
        },
        "publisher": {
          "@type": "Organization",
          "name": "Content Hub",
          "url": window.location.origin
        }
      };

      updateStructuredData('article-schema', structuredData);
    }

    // Cleanup function to remove structured data when component unmounts
    return () => {
      removeStructuredData('video-schema');
      removeStructuredData('article-schema');
    };
  }, [title, description, keywords, image, url, type, publishedTime, author, videoData]);

  return null; // This component doesn't render anything
}

function updateMetaTag(name: string, content: string, attribute: string = 'name') {
  let tag = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attribute, name);
    document.head.appendChild(tag);
  }
  
  tag.content = content;
}

function updateLinkTag(rel: string, href: string) {
  let tag = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!tag) {
    tag = document.createElement('link');
    tag.rel = rel;
    document.head.appendChild(tag);
  }
  
  tag.href = href;
}

function updateStructuredData(id: string, data: any) {
  // Remove existing structured data
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.id = id;
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function removeStructuredData(id: string) {
  const existing = document.getElementById(id);
  if (existing) {
    existing.remove();
  }
}