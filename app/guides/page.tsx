import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, BookOpen, Calculator, Search, Home, Wrench, DollarSign, FileText, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Renovation Guides & Resources | Ontario Home Improvement Learning Center | QuoteXbert',
  description:
    'The most comprehensive home renovation knowledge center in Ontario. Guides, calculators, cost tables, permit advice, contractor tips, and more for Toronto, Durham Region & the GTA.',
  keywords: [
    'home renovation guides Ontario',
    'renovation learning center',
    'renovation calculator Ontario',
    'kitchen renovation guide',
    'bathroom renovation guide',
    'basement renovation guide',
    'Durham Region renovation resources',
    'Ontario home improvement',
  ],
  openGraph: {
    title: 'Renovation Guides & Resources | QuoteXbert Learning Center',
    description: 'Ontario\'s most complete renovation knowledge center — guides, calculators, and expert advice.',
    url: 'https://www.quotexbert.com/guides',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: 'Renovation Guides | QuoteXbert Learning Center', description: "Ontario's most complete home renovation knowledge center." },
  alternates: { canonical: 'https://www.quotexbert.com/guides' },
};

const guideCategories = [
  {
    id: 'cornerstone',
    name: 'Cornerstone Guides',
    icon: '📚',
    color: 'rose',
    guides: [
      {
        title: 'The Complete Ontario Renovation Cost Guide 2025',
        desc: 'Every project type, every major Ontario city — real 2025 pricing with city comparisons, ROI data, and permit costs.',
        href: '/ontario-renovation-cost-guide',
        badge: 'Cornerstone',
        readTime: '20 min read',
      },
      {
        title: 'Who Installs Schluter Shower Systems Near Me?',
        desc: 'In-depth 2026 Ontario cost guide on Schluter waterproofing systems, plywood guidelines, and hiring certified installers.',
        href: '/who-installs-schluter-shower-systems-near-me',
        badge: 'Specialist Guide',
        readTime: '15 min read',
      },
      {
        title: 'The Complete Durham Region Renovation Guide',
        desc: 'Everything you need before renovating in Durham Region — all 12 municipalities, permits, costs, timelines, and contractor advice.',
        href: '/durham-region-renovation-guide',
        badge: 'Comprehensive',
        readTime: '18 min read',
      },
      {
        title: 'How AI Renovation Estimates Work',
        desc: 'How QuoteXbert generates accurate renovation estimates calibrated to your Ontario city.',
        href: '/how-ai-works',
        badge: 'Technology',
        readTime: '8 min read',
      },
      {
        title: 'Why QuoteXbert',
        desc: 'How QuoteXbert protects homeowners from overpriced quotes with verified contractors and AI benchmarks.',
        href: '/why-quotexbert',
        badge: 'Platform',
        readTime: '6 min read',
      },
    ],
  },
  {
    id: 'calculators',
    name: 'Free Renovation Calculators',
    icon: '🧮',
    color: 'blue',
    guides: [
      { title: 'Kitchen Renovation Calculator', desc: 'Estimate your kitchen renovation cost instantly based on size, finish level, and your Ontario city.', href: '/kitchen-renovation-calculator', badge: 'Interactive', readTime: 'Calculator' },
      { title: 'Bathroom Renovation Calculator', desc: 'Get a bathroom renovation cost estimate based on bathroom type, fixtures, and location.', href: '/bathroom-renovation-calculator', badge: 'Interactive', readTime: 'Calculator' },
      { title: 'Basement Finishing Calculator', desc: 'Calculate basement renovation costs for open-concept, with bathroom, or full legal suite.', href: '/basement-renovation-calculator', badge: 'Interactive', readTime: 'Calculator' },
      { title: 'Flooring Calculator', desc: 'Calculate flooring installation costs by material type and square footage.', href: '/flooring-calculator', badge: 'Interactive', readTime: 'Calculator' },
      { title: 'Painting Cost Calculator', desc: 'Estimate painting costs for single rooms or full home interior/exterior.', href: '/painting-calculator', badge: 'Interactive', readTime: 'Calculator' },
      { title: 'Deck Building Calculator', desc: 'Calculate deck construction costs by size and material (wood, cedar, composite).', href: '/deck-calculator', badge: 'Interactive', readTime: 'Calculator' },
      { title: 'Roof Replacement Calculator', desc: 'Estimate roofing costs by home size and shingle type for Ontario homes.', href: '/roof-replacement-calculator', badge: 'Interactive', readTime: 'Calculator' },
      { title: 'Window Replacement Calculator', desc: 'Calculate window replacement costs by window count and style.', href: '/window-replacement-calculator', badge: 'Interactive', readTime: 'Calculator' },
    ],
  },
  {
    id: 'bathroom-cluster',
    name: 'Bathroom Renovation Cluster',
    icon: '🚿',
    color: 'blue',
    guides: [
      { title: 'Can I Renovate My Bathroom for $10,000?', desc: 'Honest 2026 reality check — what fits in a $10k bathroom budget in Ontario by city, what to skip, and how to stretch it.', href: '/can-i-renovate-my-bathroom-for-10000-ontario', badge: 'Budget Guide', readTime: '10 min' },
      { title: 'Bathroom Renovation Financing Ontario', desc: 'HELOC vs. renovation loans vs. contractor payment plans — 2026 rates compared for Ontario homeowners.', href: '/bathroom-renovation-financing-ontario', badge: 'Financing', readTime: '8 min' },
      { title: 'Do I Need a Permit for My Bathroom Renovation?', desc: 'Task-by-task Ontario permit guide — exactly which bathroom work requires a permit and what happens if you skip one.', href: '/bathroom-renovation-permits-ontario', badge: 'Permit Guide', readTime: '8 min' },
      { title: 'How to Compare Contractor Quotes in Ontario', desc: 'Line-by-line comparison template, 7 red flags, and what every legitimate quote must include.', href: '/how-to-compare-contractor-quotes-ontario', badge: 'Homeowner Protection', readTime: '9 min' },
      { title: 'Free Bathroom Renovation Calculator', desc: 'Instant estimate by bathroom type, city, and finish level.', href: '/bathroom-renovation-calculator', badge: 'Calculator', readTime: 'Calculator' },
    ],
  },
  {
    id: 'schluter-cluster',
    name: 'Schluter Waterproofing Guides',
    icon: '🛡️',
    color: 'slate',
    guides: [
      { title: 'Who Installs Schluter Shower Systems Near Me?', desc: 'Find certified Schluter installers in Ontario. Costs, plywood rules, and waterproofing standards.', href: '/who-installs-schluter-shower-systems-near-me', badge: 'Installer Guide', readTime: '15 min' },
      { title: 'Schluter KERDI Cost Ontario 2026', desc: 'Exact material prices for KERDI, KERDI-BOARD, and DITRA-HEAT in Ontario. Full system installation costs.', href: '/schluter-kerdi-cost-ontario', badge: 'Pricing', readTime: '10 min' },
    ],
  },
  {
    id: 'cost-guides',
    name: 'Cost & Pricing Guides',
    icon: '💰',
    color: 'green',
    guides: [
      { title: 'Durham Region Renovation Costs 2025', desc: 'Complete cost guide for all Durham Region municipalities with project-by-project pricing.', href: '/durham-region-renovation-costs', badge: 'Pricing', readTime: '12 min' },
      { title: 'Best ROI Renovations in Durham Region', desc: 'Which renovations give the best return on investment in Durham Region — ranked.', href: '/best-roi-renovations-durham-region', badge: 'ROI', readTime: '10 min' },
      { title: 'Kitchen vs Bathroom ROI in Ontario', desc: 'Data-driven comparison of renovation ROI for Ontario homeowners.', href: '/blog/kitchen-vs-bathroom-roi-ontario', badge: 'Analysis', readTime: '8 min' },
      { title: 'Should You Finish Your Basement?', desc: 'Honest analysis of when finishing a basement makes sense — and when it doesn\'t.', href: '/blog/should-you-finish-your-basement', badge: 'Decision Guide', readTime: '7 min' },
    ],
  },
  {
    id: 'permits-legal',
    name: 'Permits & Regulations',
    icon: '📋',
    color: 'amber',
    guides: [
      { title: 'Do I Need a Permit for My Bathroom Renovation?', desc: 'Ontario-wide permit guide — which bathroom tasks require a permit, permit costs by city, and consequences.', href: '/bathroom-renovation-permits-ontario', badge: 'New', readTime: '8 min' },
      { title: 'Durham Region Renovation Permit Guide', desc: 'When you need permits, how to get them, permit costs, and all municipal contacts for Durham Region.', href: '/renovation-permit-guide-durham-region', badge: 'Permit Guide', readTime: '10 min' },
      { title: 'Renovation Permits in Durham Region (Blog)', desc: 'Detailed breakdown of permit requirements by project type for Durham Region homeowners.', href: '/blog/renovation-permits-durham-region', badge: 'Blog', readTime: '8 min' },
      { title: 'Home Renovation Checklist Ontario', desc: 'Phase-by-phase renovation planning checklist from first ideas to final walkthrough.', href: '/blog/home-renovation-checklist-ontario', badge: 'Checklist', readTime: '10 min' },
    ],
  },
  {
    id: 'contractor-guides',
    name: 'Contractor Resources',
    icon: '👷',
    color: 'gray',
    guides: [
      { title: 'Ultimate Contractor Growth Guide 2025', desc: 'How Ontario renovation contractors get more leads, grow their reputation, and build a profitable business.', href: '/contractor-growth-guide', badge: 'For Contractors', readTime: '25 min' },
      { title: 'Hiring Contractors in Durham Region', desc: 'Step-by-step guide to finding, verifying, and hiring reliable contractors in Durham Region.', href: '/blog/hiring-contractors-durham-region', badge: 'Guide', readTime: '9 min' },
      { title: 'How AI Helps Homeowners Avoid Expensive Quotes', desc: 'Why AI estimates protect homeowners from overpriced contractor quotes.', href: '/blog/how-ai-helps-homeowners-avoid-expensive-quotes', badge: 'Tips', readTime: '7 min' },
      { title: 'Durham Region Contractors', desc: 'Find verified, licensed contractors serving all Durham Region municipalities.', href: '/durham-region-contractors', badge: 'Directory', readTime: 'Resource' },
    ],
  },
  {
    id: 'city-guides',
    name: 'Durham Region City Guides',
    icon: '🏙',
    color: 'purple',
    guides: [
      { title: 'Oshawa Renovation Guide', desc: 'Complete renovation guide for Oshawa — Durham Region\'s largest city.', href: '/oshawa', badge: 'City Guide', readTime: 'Resource' },
      { title: 'Whitby Renovation Guide', desc: 'Renovation guide for Whitby and Brooklin — Durham Region\'s fastest-growing city.', href: '/whitby', badge: 'City Guide', readTime: 'Resource' },
      { title: 'Ajax Renovation Guide', desc: 'Renovation guide for Ajax — family-friendly Durham Region city.', href: '/ajax', badge: 'City Guide', readTime: 'Resource' },
      { title: 'Pickering Renovation Guide', desc: 'Renovation guide for Pickering — bordering Toronto on the west side of Durham.', href: '/pickering', badge: 'City Guide', readTime: 'Resource' },
      { title: 'Clarington & Bowmanville', desc: 'Renovation guide for Clarington including Bowmanville, Courtice, and Newcastle.', href: '/clarington', badge: 'City Guide', readTime: 'Resource' },
      { title: 'All Durham Region Cities', href: '/durham-region-renovation-estimates', desc: 'Explore all 12 Durham Region municipalities.', badge: 'Directory', readTime: 'Resource' },
    ],
  },
];

const featuredTools = [
  { title: 'Get Free AI Estimate', desc: 'Upload photos and get an instant estimate for your project.', href: '/create-lead', icon: '🤖', cta: 'Get My Estimate' },
  { title: 'Kitchen Calculator', desc: 'Calculate kitchen renovation costs instantly.', href: '/kitchen-renovation-calculator', icon: '🍳', cta: 'Use Calculator' },
  { title: 'Basement Calculator', desc: 'Calculate basement finishing costs.', href: '/basement-renovation-calculator', icon: '🏠', cta: 'Use Calculator' },
  { title: 'Ontario Cost Guide', desc: 'Full price guide for every renovation type.', href: '/ontario-renovation-cost-guide', icon: '💰', cta: 'Read Guide' },
];

export default function GuidesPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-rose-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-slate-400 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-white">Renovation Guides</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm mb-6">
              <BookOpen className="w-4 h-4" />
              <span>Ontario&apos;s Most Complete Renovation Knowledge Center</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              Renovation Guides<br />&amp; Resources
            </h1>

            <p className="text-xl text-slate-300 leading-relaxed mb-8 max-w-3xl">
              Everything Ontario homeowners need to plan, budget, and execute home renovations.
              Cost guides, calculators, permit advice, city guides, and contractor resources —
              all in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Tools */}
      <section className="py-12 bg-rose-50 border-b border-rose-100">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-lg font-black text-gray-900 mb-6">Start Here: Most Popular Tools</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featuredTools.map((tool) => (
              <Link key={tool.href} href={tool.href} className="bg-white rounded-xl p-4 border border-rose-200 hover:border-rose-400 hover:shadow-md transition-all group text-center">
                <div className="text-3xl mb-2">{tool.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm mb-1 group-hover:text-rose-700">{tool.title}</h3>
                <p className="text-xs text-gray-500 mb-3">{tool.desc}</p>
                <span className="text-xs font-bold text-rose-600">{tool.cta} →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Categories */}
      {guideCategories.map((category) => (
        <section key={category.id} className="py-16 border-t border-gray-100">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-8">
              <span className="text-3xl">{category.icon}</span>
              <h2 className="text-2xl font-black text-gray-900">{category.name}</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {category.guides.map((guide) => (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="bg-white rounded-xl p-5 border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all group flex flex-col"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full">{guide.badge}</span>
                    <span className="text-xs text-gray-400">{guide.readTime}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2 group-hover:text-rose-700 transition-colors leading-tight">{guide.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed flex-1">{guide.desc}</p>
                  <div className="mt-3 text-xs font-bold text-rose-600 group-hover:text-rose-700">
                    Read More →
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Topical Cluster Navigation */}
      <section className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Browse by Topic</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Kitchen Renovation', icon: '🍳', pages: ['/kitchen-renovation-oshawa', '/kitchen-renovation-whitby', '/kitchen-renovation-ajax', '/kitchen-renovation-pickering', '/kitchen-renovation-bowmanville'], primaryHref: '/kitchen-renovation-oshawa' },
              { label: 'Bathroom Renovation', icon: '🚿', pages: ['/bathroom-renovation-oshawa', '/bathroom-renovation-whitby', '/bathroom-renovation-ajax', '/bathroom-renovation-pickering', '/bathroom-renovation-courtice'], primaryHref: '/bathroom-renovation-oshawa' },
              { label: 'Basement Finishing', icon: '🏠', pages: ['/basement-renovation-oshawa', '/basement-renovation-whitby', '/basement-renovation-ajax', '/basement-renovation-pickering', '/basement-renovation-bowmanville'], primaryHref: '/basement-renovation-oshawa' },
              { label: 'Decks & Patios', icon: '🌲', pages: ['/deck-builders-whitby', '/deck-builders-oshawa', '/deck-calculator'], primaryHref: '/deck-builders-whitby' },
              { label: 'Roofing', icon: '🏚', pages: ['/roof-replacement-pickering', '/roof-replacement-calculator'], primaryHref: '/roof-replacement-pickering' },
              { label: 'Flooring', icon: '⬛', pages: ['/flooring-ajax', '/flooring-calculator'], primaryHref: '/flooring-ajax' },
              { label: 'Painting', icon: '🖌', pages: ['/painting-bowmanville', '/painting-calculator'], primaryHref: '/painting-bowmanville' },
              { label: 'AI Estimates', icon: '🤖', pages: ['/ai-renovation-estimates-durham-region', '/how-ai-works', '/create-lead'], primaryHref: '/ai-renovation-estimates-durham-region' },
            ].map((topic) => (
              <Link key={topic.label} href={topic.primaryHref} className="bg-white rounded-xl p-4 border border-gray-200 hover:border-rose-300 hover:shadow-md transition-all group text-center">
                <div className="text-3xl mb-2">{topic.icon}</div>
                <h3 className="font-bold text-gray-900 text-sm group-hover:text-rose-700">{topic.label}</h3>
                <p className="text-xs text-gray-500 mt-1">{topic.pages.length} guides →</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">Ready to Start Your Renovation?</h2>
          <p className="text-rose-100 text-lg mb-8">Get a free AI estimate calibrated to your Ontario city. Know the fair price before talking to any contractor.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors">
              Get My Free AI Estimate →
            </Link>
            <Link href="/for-contractors" className="border border-white text-white font-semibold px-8 py-4 rounded-2xl hover:bg-rose-700 transition-colors">
              I&apos;m a Contractor
            </Link>
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'QuoteXbert Renovation Guides & Resources',
        description: "Ontario's most complete home renovation knowledge center — guides, calculators, and expert advice.",
        url: 'https://www.quotexbert.com/guides',
        publisher: { '@type': 'Organization', name: 'QuoteXbert', url: 'https://www.quotexbert.com' },
      })}} />
    </main>
  );
}
