import { MetadataRoute } from 'next'

// GTA city slugs for renovation-cost dynamic pages
const GTA_CITY_SLUGS = [
  'toronto', 'north-york', 'scarborough', 'etobicoke', 'mississauga',
  'brampton', 'vaughan', 'markham', 'ajax', 'pickering', 'whitby', 'richmond-hill',
]

// Renovation-type page slugs
const RENOVATION_TYPE_SLUGS = [
  'kitchen-renovation-cost-toronto',
  'bathroom-renovation-cost-toronto',
  'basement-finishing-cost-toronto',
  'deck-building-cost-toronto',
  'roof-replacement-cost-toronto',
  'flooring-installation-cost-toronto',
  'painting-cost-toronto',
  'plumbing-repair-cost-toronto',
  'electrical-work-cost-toronto',
]

// Neighborhood contractor page slugs
const NEIGHBORHOOD_SLUGS = [
  'leslieville', 'the-beaches', 'east-york', 'liberty-village',
  'danforth', 'high-park', 'parkdale', 'yorkville', 'north-york', 'scarborough',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.quotexbert.com'
  
  // Location pages (NEW - highest priority for local SEO)
  const locationPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/toronto`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/durham-region`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/ajax`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/bowmanville`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ]
  
  // Toronto-specific SEO landing pages (existing)
  const torontoPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/toronto-renovation-quotes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/toronto-bathroom-renovation`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/toronto-kitchen-renovation`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
  ]
  
  // Core pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/affiliate`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ]

  // Contractor pages
  const contractorPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/contractor/jobs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.65,
    },
  ]

  // Legal pages
  const legalPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ]

  // Blog posts (existing + NEW 2026 SEO posts)
  const blogPosts = [
    'home-renovation-projects-add-value-toronto-2025',
    'choose-contractor-toronto-gta-guide',
    'kitchen-remodel-costs-toronto-gta-2025',
    'toronto-condo-bathroom-renovation-ideas',
    'toronto-roofing-repair-replacement-guide',
    'toronto-seasonal-home-maintenance-checklist',
    'basement-finishing-toronto-guide-2025',
    'complete-guide-to-basement-finishing-in-toronto-2025',
    'kitchen-renovation-costs-in-toronto-gta-2025',
    'how-to-hire-a-reliable-contractor-in-toronto-2025',
    'bathroom-remodeling-ideas-for-small-toronto-condos',
    'toronto-roofing-guide-when-to-repair-vs-replace-your-roof',
    'hardwood-flooring-installation-in-toronto-types-costs-care',
    'home-addition-permits-in-toronto-complete-2025-guide',
    'deck-building-in-toronto-design-ideas-materials-costs',
    'energy-efficient-home-upgrades-for-toronto-climate',
    'painting-your-toronto-home-interior-exterior-guide',
    'toronto-hvac-systems-choosing-the-right-heating-cooling',
    'waterproofing-your-toronto-basement-prevention-solutions',
    'landscaping-ideas-for-toronto-yards-climate-appropriate-plants',
    'window-replacement-in-toronto-types-costs-energy-savings',
    // NEW 2026 SEO-focused blog posts
    'bathroom-renovation-cost-toronto-2026',
    'kitchen-renovation-cost-gta-2026',
    'why-contractors-overquote-avoid-it-2026',
  ]

  const blogSitemapEntries: MetadataRoute.Sitemap = blogPosts.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // Programmatic SEO: renovation cost city pages
  const renovationCostCityPages: MetadataRoute.Sitemap = GTA_CITY_SLUGS.map(city => ({
    url: `${baseUrl}/renovation-cost/${city}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: city === 'toronto' ? 0.95 : 0.88,
  }))

  // Programmatic SEO: renovation-cost toronto sub-pages (existing)
  const renovationCostTorontoSubPages: MetadataRoute.Sitemap = [
    'kitchen', 'bathroom', 'basement',
  ].map(type => ({
    url: `${baseUrl}/renovation-cost/toronto/${type}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // Programmatic SEO: renovation-type specific pages
  const renovationTypePages: MetadataRoute.Sitemap = RENOVATION_TYPE_SLUGS.map(slug => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.9,
  }))

  // Programmatic SEO: neighborhood contractor pages
  const neighborhoodPages: MetadataRoute.Sitemap = NEIGHBORHOOD_SLUGS.map(slug => ({
    url: `${baseUrl}/contractors/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  return [
    ...locationPages,
    ...torontoPages,
    ...staticPages,
    ...contractorPages,
    ...legalPages,
    ...blogSitemapEntries,
    ...renovationCostCityPages,
    ...renovationCostTorontoSubPages,
    ...renovationTypePages,
    ...neighborhoodPages,
  ]
}