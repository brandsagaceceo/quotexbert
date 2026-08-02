import { MetadataRoute } from 'next'
import { GTA_CITIES, RENOVATION_TYPES } from '@/lib/seo/gta-cities'
import { TORONTO_NEIGHBOURHOODS, TORONTO_SERVICES } from '@/lib/seo/toronto-pinpoint'
import { ALL_CONTRACTOR_CITY_SLUGS } from '@/lib/seo/contractor-city-data'
import { ALL_CITY_SLUGS, ALL_TRADE_SLUGS, ALL_COMBO_PARAMS } from '@/lib/seo/contractor-acquisition-data'
import { blogPostMetadata } from '@/app/blog/blog-metadata'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.quotexbert.com'
  
  // Location pages (NEW - highest priority for local SEO)
  const locationPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/toronto`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/durham-region`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.92 },
    { url: `${baseUrl}/clarington`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/ajax`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.87 },
    { url: `${baseUrl}/bowmanville`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.87 },
    { url: `${baseUrl}/oshawa`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.88 },
    { url: `${baseUrl}/whitby`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.88 },
    { url: `${baseUrl}/pickering`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.87 },
    { url: `${baseUrl}/courtice`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/newcastle`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.84 },
    { url: `${baseUrl}/port-perry`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.83 },
    { url: `${baseUrl}/uxbridge`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.82 },
    { url: `${baseUrl}/scugog`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.81 },
    { url: `${baseUrl}/brock`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.80 },
    // Durham Region landing pages
    { url: `${baseUrl}/durham-region-renovation-estimates`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.90 },
    { url: `${baseUrl}/durham-region-contractors`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.90 },
    { url: `${baseUrl}/durham-region-home-renovation`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.89 },
    { url: `${baseUrl}/durham-region-renovation-costs`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.89 },
    // Durham local content pages
    { url: `${baseUrl}/kitchen-renovation-bowmanville`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/bathroom-renovation-courtice`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/basement-renovation-oshawa`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/deck-builders-whitby`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.84 },
    { url: `${baseUrl}/flooring-ajax`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.84 },
    { url: `${baseUrl}/roof-replacement-pickering`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.84 },
    { url: `${baseUrl}/painting-bowmanville`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.83 },
    { url: `${baseUrl}/drywall-oshawa`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.83 },
    { url: `${baseUrl}/general-contractors-durham-region`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.87 },
    { url: `${baseUrl}/home-renovation-durham-region`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.87 },
    // Trust pages
    { url: `${baseUrl}/why-quotexbert`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.80 },
    { url: `${baseUrl}/how-ai-works`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.80 },
    // Durham Region resource guides (Phase 2)
    { url: `${baseUrl}/renovation-permit-guide-durham-region`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.86 },
    { url: `${baseUrl}/best-roi-renovations-durham-region`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/ai-renovation-estimates-durham-region`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.88 },
    // Durham city+trade pages (Phase 2)
    { url: `${baseUrl}/kitchen-renovation-oshawa`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.87 },
    { url: `${baseUrl}/kitchen-renovation-whitby`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.87 },
    { url: `${baseUrl}/kitchen-renovation-ajax`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.87 },
    { url: `${baseUrl}/kitchen-renovation-pickering`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.87 },
    { url: `${baseUrl}/bathroom-renovation-oshawa`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.86 },
    { url: `${baseUrl}/bathroom-renovation-whitby`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.86 },
    { url: `${baseUrl}/bathroom-renovation-ajax`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.86 },
    { url: `${baseUrl}/bathroom-renovation-pickering`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.86 },
    { url: `${baseUrl}/basement-renovation-whitby`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.86 },
    { url: `${baseUrl}/basement-renovation-ajax`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.86 },
    { url: `${baseUrl}/basement-renovation-pickering`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.86 },
    // Phase 3 — Authority Content (Pillar Pages)
    { url: `${baseUrl}/ontario-renovation-cost-guide`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.96 },
    { url: `${baseUrl}/durham-region-renovation-guide`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.94 },
    { url: `${baseUrl}/contractor-growth-guide`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.93 },
    // Phase 3 — Renovation Calculators
    { url: `${baseUrl}/renovation-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/kitchen-renovation-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.87 },
    { url: `${baseUrl}/bathroom-renovation-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.87 },
    { url: `${baseUrl}/basement-renovation-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.87 },
    { url: `${baseUrl}/flooring-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/painting-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/deck-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/roof-replacement-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    { url: `${baseUrl}/window-replacement-calculator`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.85 },
    // Phase 4 — Basement Renovation Cluster
    { url: `${baseUrl}/how-much-does-it-cost-to-finish-a-basement-in-ontario`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.92 },
    { url: `${baseUrl}/do-i-need-permits-to-finish-my-basement-ontario`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.90 },
    { url: `${baseUrl}/basement-suite-vs-open-concept-ontario`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.89 },
    // Phase 4 — Bathroom Renovation Cluster
    { url: `${baseUrl}/can-i-renovate-my-bathroom-for-10000-ontario`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.90 },
    { url: `${baseUrl}/bathroom-renovation-financing-ontario`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.89 },
    { url: `${baseUrl}/bathroom-renovation-permits-ontario`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.89 },
    { url: `${baseUrl}/how-to-compare-contractor-quotes-ontario`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.88 },
    // Phase 4 — Schluter Cluster
    { url: `${baseUrl}/schluter-kerdi-cost-ontario`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.88 },
    { url: `${baseUrl}/who-installs-schluter-shower-systems-near-me`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.88 },
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

  // Affiliate SEO landing pages
  const affiliateSeoPages: MetadataRoute.Sitemap = [
    'make-money-online-toronto',
    'side-hustles-toronto',
    'passive-income-canada',
    'affiliate-marketing-toronto',
    'affiliate-programs-canada',
    'best-affiliate-programs-canada',
    'how-to-make-money-referring-contractors',
    'contractor-referral-program-canada',
    'earn-money-from-contractor-leads',
  ].map(slug => ({
    url: `${baseUrl}/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

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

  const blogSitemapEntries: MetadataRoute.Sitemap = Object.entries(blogPostMetadata).map(([slug, post]) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(post.publishedAt),
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
    'renovation-estimates-milton',
    'renovation-estimates-newmarket',
    'renovation-estimates-aurora',
    'renovation-estimates-thornhill',
    'renovation-estimates-stouffville',
    'renovation-estimates-caledon',
    // Expanded Ontario cities
    'renovation-estimates-hamilton',
    'renovation-estimates-barrie',
    'renovation-estimates-guelph',
    'renovation-estimates-kitchener',
    'renovation-estimates-waterloo',
    'renovation-estimates-cambridge',
    // Premium Toronto neighbourhoods
    'renovation-estimates-forest-hill',
    'renovation-estimates-rosedale',
    'renovation-estimates-leaside',
    'renovation-estimates-the-annex',
    'renovation-estimates-trinity-bellwoods',
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

  const pages: MetadataRoute.Sitemap = [
    ...locationPages,
    ...torontoPages,
    ...staticPages,
    ...affiliateSeoPages,
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

    // ─── NEW: Contractor Acquisition SEO System ───────────────────────────────
    // Main contractor leads hub
    {
      url: `${baseUrl}/contractor-leads`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.94,
    },
    // City contractor lead pages (17 cities)
    ...ALL_CITY_SLUGS.map(city => ({
      url: `${baseUrl}/contractor-leads/${city}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: ['toronto', 'mississauga', 'oshawa', 'vaughan', 'markham'].includes(city) ? 0.90 : 0.85,
    })),
    // Trade contractor lead pages (20 trades)
    ...ALL_TRADE_SLUGS.map(trade => ({
      url: `${baseUrl}/contractor-leads/trades/${trade}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: ['general-contractors', 'renovation-contractors', 'roofers', 'electricians', 'plumbers'].includes(trade) ? 0.88 : 0.83,
    })),
    // City + trade combination pages (14 combos)
    ...ALL_COMBO_PARAMS.map(({ city, trade }) => ({
      url: `${baseUrl}/contractor-leads/${city}/${trade}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: city === 'toronto' ? 0.87 : 0.82,
    })),
    // Comparison and alternative pages
    {
      url: `${baseUrl}/homestars-alternative`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.88,
    },
    {
      url: `${baseUrl}/contractor-lead-generation-canada`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.86,
    },
    {
      url: `${baseUrl}/pay-per-lead-alternative`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
    {
      url: `${baseUrl}/how-to-get-contractor-leads`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.87,
    },
    {
      url: `${baseUrl}/best-app-for-contractors-canada`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    },
  ]

  return pages.map((entry) => {
    if (entry.url.includes('/blog/')) return entry

    const { lastModified: _lastModified, ...page } = entry
    return page
  })
}