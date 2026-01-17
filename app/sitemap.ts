import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://quotexbert.com'
  
  // Toronto-specific SEO landing pages (highest priority)
  const torontoPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/toronto-renovation-quotes`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/toronto-bathroom-renovation`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/toronto-kitchen-renovation`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
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

  // Blog posts
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
  ]

  const blogSitemapEntries: MetadataRoute.Sitemap = blogPosts.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  return [
    ...torontoPages,
    ...staticPages,
    ...contractorPages,
    ...legalPages,
    ...blogSitemapEntries,
  ]
}