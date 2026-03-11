/**
 * SEO utilities for generating slugs and metadata
 */

/**
 * Generate SEO-friendly slug from contractor name and city
 * Example: "Mike's Plumbing" + "Toronto" -> "mikes-plumbing-toronto"
 */
export function generateContractorSlug(companyName: string, city: string): string {
  const cleanName = companyName
    .toLowerCase()
    .replace(/['']/g, '') // Remove apostrophes
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .trim()
    .replace(/\s+/g, '-'); // Replace spaces with hyphens

  const cleanCity = city
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');

  return `${cleanName}-${cleanCity}`;
}

/**
 * Generate slug from contractor profile
 */
export function getContractorSlug(contractor: {
  companyName: string;
  city?: string;
  id?: string;
}): string {
  if (contractor.city) {
    return generateContractorSlug(contractor.companyName, contractor.city);
  }
  // Fallback to ID-based slug if no city
  return contractor.id || contractor.companyName.toLowerCase().replace(/\s+/g, '-');
}

/**
 * Generate SEO title for contractor page
 */
export function getContractorSEOTitle(
  companyName: string,
  trade: string,
  city?: string
): string {
  if (city) {
    return `${companyName} - ${trade} in ${city} | QuoteXbert`;
  }
  return `${companyName} - ${trade} | QuoteXbert`;
}

/**
 * Generate SEO description for contractor page
 */
export function getContractorSEODescription(
  companyName: string,
  trade: string,
  city?: string,
  avgRating?: number,
  completedJobs?: number
): string {
  const parts: string[] = [];
  
  parts.push(`${companyName} specializes in ${trade.toLowerCase()}`);
  
  if (city) {
    parts.push(`serving ${city} and surrounding areas`);
  }
  
  if (avgRating && avgRating > 0) {
    parts.push(`with a ${avgRating.toFixed(1)} star rating`);
  }
  
  if (completedJobs && completedJobs > 0) {
    parts.push(`and ${completedJobs}+ completed projects`);
  }
  
  parts.push('Get a free quote today on QuoteXbert.');
  
  return parts.join('. ') + '.';
}

/**
 * Generate renovation cost page slug
 */
export function generateRenovationCostSlug(city: string, renovationType: string): string {
  const cleanCity = city.toLowerCase().replace(/\s+/g, '-');
  const cleanType = renovationType.toLowerCase().replace(/\s+/g, '-');
  return `/renovation-cost/${cleanCity}/${cleanType}`;
}

/**
 * Parse contractor slug to extract components
 */
export function parseContractorSlug(slug: string): {
  companyNamePart: string;
  cityPart?: string;
} {
  const parts = slug.split('-');
  
  // Last part is usually the city
  if (parts.length > 2) {
    const cityPart = parts[parts.length - 1];
    const companyNamePart = parts.slice(0, -1).join('-');
    if (cityPart) {
      return { companyNamePart, cityPart };
    }
    return { companyNamePart };
  }
  
  return { companyNamePart: slug };
}

/**
 * Generate structured data (JSON-LD) for contractor
 */
export function generateContractorStructuredData(contractor: {
  companyName: string;
  trade: string;
  city?: string;
  avgRating?: number;
  reviewCount?: number;
  phone?: string;
  website?: string;
  bio?: string;
}) {
  const structuredData: any = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: contractor.companyName,
    description: contractor.bio || `${contractor.trade} services`,
  };

  if (contractor.city) {
    structuredData.address = {
      '@type': 'PostalAddress',
      addressLocality: contractor.city,
      addressRegion: 'ON',
      addressCountry: 'CA',
    };
  }

  if (contractor.avgRating && contractor.reviewCount) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: contractor.avgRating.toFixed(1),
      reviewCount: contractor.reviewCount,
      bestRating: '5',
      worstRating: '1',
    };
  }

  if (contractor.phone) {
    structuredData.telephone = contractor.phone;
  }

  if (contractor.website) {
    structuredData.url = contractor.website;
  }

  return structuredData;
}
