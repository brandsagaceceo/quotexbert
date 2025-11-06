import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.quotexbert.com'
  
  // Static pages
  const staticPages = [
    '',
    '/about',
    '/contact',
    '/create-lead',
    '/contractor/jobs',
    '/sign-in',
    '/sign-up',
    '/privacy',
    '/terms'
  ]

  // Toronto-focused blog posts
  const blogPosts = [
    'home-renovation-projects-add-value-toronto-2025',
    'choose-contractor-toronto-gta-guide',
    'kitchen-remodel-costs-toronto-gta-2025',
    'toronto-condo-bathroom-renovation-ideas',
    'toronto-roofing-repair-replacement-guide',
    'toronto-seasonal-home-maintenance-checklist'
  ]

  const staticSitemapEntries = staticPages.map(page => ({
    url: `${baseUrl}${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.8,
  }))

  const blogSitemapEntries = blogPosts.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticSitemapEntries, ...blogSitemapEntries]
}