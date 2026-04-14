import { MetadataRoute } from 'next'
import { GTA_CITIES, RENOVATION_TYPES } from '@/lib/seo/gta-cities'
import { TORONTO_NEIGHBOURHOODS, TORONTO_SERVICES } from '@/lib/seo/toronto-pinpoint'
import { ALL_CONTRACTOR_CITY_SLUGS } from '@/lib/seo/contractor-city-data'

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
    // Programmatic SEO blog posts 2026
    'average-bathroom-renovation-cost-toronto-2026',
    'kitchen-renovation-cost-toronto-2026',
    'how-contractors-get-more-renovation-jobs-toronto',
    'basement-finishing-cost-ontario-2026',
    'renovation-mistakes-toronto-homeowners-make',
    // Existing content blog posts
    'basement-renovation-pickering-ajax',
    'bathroom-costs-oshawa-vs-toronto',
    'deck-building-costs-clarington',
    'electrical-panel-upgrade-toronto',
    'hardwood-flooring-cost-toronto',
    'kitchen-faucet-replacement-cost-toronto',
    'roof-repair-vs-replacement-gta',
    'toronto-basement-renovation-complete-guide-2026',
    'toronto-home-renovation-costs-2026',
  ]

  const blogSitemapEntries: MetadataRoute.Sitemap = blogPosts.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  // Renovation cost pages (programmatic SEO)
  const renovationCostSlugs = [
    'bathroom-renovation-cost-toronto',
    'kitchen-renovation-cost-toronto',
    'basement-finishing-cost-toronto',
    'deck-building-cost-toronto',
    'roof-replacement-cost-toronto',
    'flooring-installation-cost-toronto',
    'painting-cost-toronto',
    'plumbing-repair-cost-toronto',
    'electrical-work-cost-toronto',
    'home-renovation-cost-toronto',
  ]

  const renovationCostPages: MetadataRoute.Sitemap = renovationCostSlugs.map(slug => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  // Neighbourhood & GTA city pages (programmatic SEO)
  const neighbourhoodSlugs = [
    'renovation-estimates-leslieville',
    'renovation-estimates-the-beaches',
    'renovation-estimates-east-york',
    'renovation-estimates-liberty-village',
    'renovation-estimates-danforth',
    'renovation-estimates-high-park',
    'renovation-estimates-parkdale',
    'renovation-estimates-yorkville',
    'renovation-estimates-north-york',
    'renovation-estimates-scarborough',
    'renovation-estimates-etobicoke',
    'renovation-estimates-mississauga',
    'renovation-estimates-brampton',
    'renovation-estimates-vaughan',
    'renovation-estimates-markham',
    'renovation-estimates-richmond-hill',
    'renovation-estimates-pickering',
    'renovation-estimates-ajax',
    'renovation-estimates-whitby',
    'renovation-estimates-oshawa',
    'renovation-estimates-burlington',
    'renovation-estimates-oakville',
  ]

  const neighbourhoodPages: MetadataRoute.Sitemap = neighbourhoodSlugs.map(slug => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.85,
  }))

  // Contractor lead pages (programmatic SEO)
  const contractorLeadSlugs = [
    'contractor-leads-toronto',
    'plumber-leads-toronto',
    'electrician-leads-toronto',
    'roofing-leads-toronto',
    'handyman-leads-toronto',
    'general-contractor-leads-toronto',
    'construction-jobs-toronto',
    'renovation-jobs-toronto',
    'find-contractor-work-toronto',
    'home-renovation-leads-gta',
  ]

  const contractorLeadPages: MetadataRoute.Sitemap = contractorLeadSlugs.map(slug => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.80,
  }))

  // Trade job pages (programmatic SEO)
  const tradeJobSlugs = [
    'plumbing-jobs-toronto',
    'electrical-jobs-toronto',
    'roofing-jobs-toronto',
    'bathroom-renovation-jobs-toronto',
    'kitchen-renovation-jobs-toronto',
    'deck-building-jobs-toronto',
    'flooring-installation-jobs-toronto',
    'painting-jobs-toronto',
  ]

  const tradeJobPages: MetadataRoute.Sitemap = tradeJobSlugs.map(slug => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.78,
  }))

  return [
    ...locationPages,
    ...torontoPages,
    ...staticPages,
    ...contractorPages,
    ...legalPages,
    ...renovationCostPages,
    ...neighbourhoodPages,
    ...contractorLeadPages,
    ...tradeJobPages,
    ...blogSitemapEntries,
    // Programmatic city × renovation type pages (112 pages)
    ...GTA_CITIES.flatMap(city =>
      RENOVATION_TYPES.map(reno => ({
        url: `${baseUrl}/renovation-cost/${city.slug}/${reno.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: city.slug === 'toronto' ? 0.88 : 0.78,
      }))
    ),
    // Contractor city pages (14 pages)
    ...GTA_CITIES.map(city => ({
      url: `${baseUrl}/contractors/${city.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: city.slug === 'toronto' ? 0.90 : 0.80,
    })),
    // Contractor join page
    {
      url: `${baseUrl}/contractors/join`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.92,
    },
    // Renovation costs hub page
    {
      url: `${baseUrl}/renovation-costs`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.92,
    },
    // ─── Toronto Pinpoint SEO pages (52 neighbourhoods × 16 services = 832 pages) ───
    // Targeting local search: "kitchen renovation North York", "plumber Danforth", etc.
    ...TORONTO_NEIGHBOURHOODS.flatMap(neighbourhood =>
      TORONTO_SERVICES.map(service => ({
        url: `${baseUrl}/toronto/${neighbourhood.slug}/${service.slug}`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 
          // Priority boost for high-volume neighbourhoods
          ['north-york', 'scarborough', 'etobicoke', 'willowdale', 'danforth', 'leslieville', 'high-park', 'roncesvalles', 'yonge-eglinton', 'don-mills', 'agincourt'].includes(neighbourhood.slug)
          // Priority boost for high-volume services
          && ['kitchen-renovation', 'bathroom-renovation', 'basement-finishing', 'home-renovation-quote', 'roofing', 'general-contractor'].includes(service.slug)
            ? 0.87
            : ['north-york', 'scarborough', 'etobicoke', 'willowdale', 'danforth', 'leslieville', 'high-park', 'roncesvalles', 'yonge-eglinton', 'don-mills', 'agincourt'].includes(neighbourhood.slug)
              ? 0.82
              : ['kitchen-renovation', 'bathroom-renovation', 'basement-finishing', 'home-renovation-quote', 'roofing', 'general-contractor'].includes(service.slug)
                ? 0.80
                : 0.75,
      }))
    ),
    // ─── Contractor city + trade + intent pages (15 new pages) ──────────────────
    // City contractor lead pages (Mississauga, Brampton, Vaughan, Markham)
    // City+trade combos (plumber/electrician/roofing/handyman/GC × city)
    // "How to get jobs" intent pages for contractor acquisition SEO
    ...ALL_CONTRACTOR_CITY_SLUGS.map(slug => ({
      url: `${baseUrl}/${slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: slug.startsWith('how-to') ? 0.82 : 0.80,
    })),
  ]
}