import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, TrendingUp, Users, Search, MessageSquare, Zap, DollarSign, BarChart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ultimate Contractor Growth Guide 2025 | Get More Renovation Leads | QuoteXbert',
  description:
    'The complete guide for renovation contractors to grow their business in 2025. SEO, Google Business Profile, Facebook, Google Ads, QuoteXbert, AI, CRM, reviews, and pricing strategy for Ontario contractors.',
  keywords: [
    'contractor growth guide Ontario',
    'how contractors get more leads',
    'renovation contractor leads Ontario',
    'contractor SEO Durham Region',
    'Google Business Profile contractor',
    'renovation company marketing',
    'contractor lead generation 2025',
    'grow renovation business Ontario',
  ],
  openGraph: {
    title: 'Ultimate Contractor Growth Guide 2025 | QuoteXbert',
    description: 'Everything Ontario renovation contractors need to grow their business — SEO, leads, reviews, pricing, and AI tools.',
    url: 'https://www.quotexbert.com/contractor-growth-guide',
    type: 'article',
  },
  twitter: { card: 'summary_large_image', title: 'Contractor Growth Guide 2025 | QuoteXbert', description: 'How Ontario renovation contractors get more leads and grow their business.' },
  alternates: { canonical: 'https://www.quotexbert.com/contractor-growth-guide' },
};

const growthStrategies = [
  {
    id: 'google-business',
    title: 'Google Business Profile (The #1 Priority)',
    icon: '📍',
    importance: 'Critical',
    description: "Your Google Business Profile (GBP) is the most important free tool for any local contractor. When homeowners search \"contractor near me\" or \"kitchen renovation Oshawa\", your GBP is what shows up first. A well-optimized profile generates 5–15 leads per month with zero ad spend.",
    steps: [
      'Claim and verify your Google Business Profile at business.google.com',
      'Add all services you offer (be specific: "kitchen renovation," "basement finishing," etc.)',
      'Upload 10–20+ high-quality before/after project photos',
      'Add your service area (specific Durham Region cities you serve)',
      'Set accurate hours and response time',
      'Respond to every review — good and bad — within 48 hours',
      'Post Google Updates weekly (recent projects, tips, seasonal offers)',
    ],
    metric: '5–15 leads/month (free)',
    tip: "The business with the most recent and highest-rated reviews wins in local search. Asking every happy customer for a Google review is the single best action you can take.",
  },
  {
    id: 'reviews',
    title: 'Review Generation System',
    icon: '⭐',
    importance: 'Critical',
    description: "90% of homeowners read reviews before hiring a contractor. Having 50+ recent 5-star Google reviews is more valuable than any paid advertising. The problem: most contractors don't have a systematic approach to collecting reviews.",
    steps: [
      'Create a simple review link: business.google.com/reviews (click \"get more reviews\")',
      'Text the link to every client immediately after project completion',
      'Include the review link in your completion invoice/email',
      "Add a 'Leave Us a Review' button to your website",
      'Train your team to mention reviews at project completion',
      'Respond to all reviews within 24 hours — Google rewards engagement',
      'Address negative reviews professionally; never argue or be defensive',
    ],
    metric: 'Target: 1+ review per completed project',
    tip: "Timing matters. Ask for reviews immediately after project completion — satisfaction is highest and memory is freshest. A week later, the window has closed for most clients.",
  },
  {
    id: 'seo',
    title: 'Local SEO for Contractors',
    icon: '🔍',
    importance: 'High',
    description: "Local SEO gets your website to show up when homeowners search for contractors in your service area. Unlike Google Ads, SEO builds compounding value — a page that ranks well today keeps ranking for years.",
    steps: [
      'Create a dedicated page for each city you serve (e.g., \"Basement Renovation Oshawa\")',
      'Create trade-specific pages (\"Kitchen Renovation Contractor\", \"Bathroom Renovations\")',
      'Add your city + service in page titles and H1 headings naturally',
      'List your phone number and address consistently across all platforms',
      'Get listed on: QuoteXbert, HomeStars, Google Business, Yelp, Facebook',
      'Build local citations: Chamber of Commerce, BNI, local business directories',
      'Create regular content: before/after photos, cost guides, tips for local homeowners',
    ],
    metric: '10–30% of leads from organic search within 6 months',
    tip: "Target \"{trade} {city}\" keywords. 'Kitchen renovation Whitby' is more valuable than 'kitchen renovation' because it has local intent and lower competition.",
  },
  {
    id: 'quotexbert',
    title: 'QuoteXbert: Verified Homeowner Leads',
    icon: '🤖',
    importance: 'High',
    description: "QuoteXbert connects verified homeowners with renovation contractors. Homeowners on the platform have already used AI to estimate their project — they're educated buyers who know roughly what things cost. This means better conversations, less haggling, and higher close rates.",
    steps: [
      'Create a verified contractor profile at quotexbert.com/for-contractors',
      'Upload 5+ before/after project photos for your portfolio',
      'Set your service area precisely (which cities you serve)',
      'Respond to leads within 2 hours — speed matters enormously',
      'Use the AI estimate context to have informed conversations',
      'Maintain your QuoteXbert Verified status through quality reviews',
      'Reference your profile in all other marketing materials',
    ],
    metric: 'Founding members: exclusive city priority placement',
    tip: "Speed to respond is the #1 factor in winning leads on platforms like QuoteXbert. A lead who waits 24 hours for a callback has already called 3 other contractors. Aim to respond within 2 hours.",
  },
  {
    id: 'facebook',
    title: 'Facebook & Social Media',
    icon: '📱',
    importance: 'Medium-High',
    description: "Facebook remains highly effective for local contractors, especially for referral amplification and community presence. Durham Region and GTA homeowner Facebook groups are active renovation discussion forums where your reputation can be built organically.",
    steps: [
      'Create a professional Facebook Business Page (separate from personal)',
      'Post completed project before/after photos 3× per week',
      'Join local homeowner Facebook groups (\"Whitby Homeowners\", \"Oshawa Community\" etc.)',
      'When appropriate, share helpful renovation tips in groups — not hard sales',
      'Run Facebook ads to your service area: $20–$50/day is effective for most contractors',
      'Create a Facebook portfolio album for each major project type you do',
      'Respond to every comment and message within 24 hours',
    ],
    metric: '5–20% of leads from social (once established)',
    tip: "The best Facebook content for contractors is simple: post a before photo, post during construction, post the reveal. Homeowners love renovation transformations. These posts get shared and generate organic referral traffic.",
  },
  {
    id: 'google-ads',
    title: 'Google Ads (Local Service Ads)',
    icon: '💳',
    importance: 'Medium',
    description: "Google Local Service Ads (LSAs) are pay-per-lead ads that appear above regular search results. Unlike traditional Google Ads (pay-per-click), LSAs charge only when a genuine lead contacts you. For contractors with verified Google Business Profiles, LSAs are often the best paid acquisition channel.",
    steps: [
      'Apply for Local Service Ads at ads.google.com/local-services-ads',
      'Complete Google\'s background check and licence verification',
      'Set your weekly budget (start at $150–$300/week)',
      'Optimize your LSA profile with detailed services and photos',
      'Dispute irrelevant leads within 30 days (you won\'t be charged)',
      'Target specific services: don\'t pay for leads outside your specialty',
      'Track which leads convert and adjust bidding accordingly',
    ],
    metric: 'CPL (cost per lead): $15–$60 depending on trade and city',
    tip: "Local Service Ads require Google verification (background check, licence, insurance). This verification actually builds trust with homeowners — the 'Google Guaranteed' badge on your ad converts better than regular ads.",
  },
  {
    id: 'website',
    title: 'Contractor Website Essentials',
    icon: '🌐',
    importance: 'High',
    description: "Your website is your 24/7 sales tool. Most homeowners research contractors online before calling. A professional website with real photos, testimonials, and clear calls-to-action converts browsers to callers.",
    steps: [
      'Use a simple, fast platform: WordPress, Wix, or Squarespace work well for contractors',
      'Every page needs: phone number (clickable), service area, and CTA above the fold',
      'Create dedicated pages for each service you offer (better SEO + conversion)',
      'Upload real project photos — stock photos destroy trust',
      'Feature 3–5 detailed testimonials with the client\'s first name and city',
      'Add a simple quote request form (name, project type, phone number)',
      'Make sure your site loads in under 3 seconds on mobile',
    ],
    metric: '15–40% of calls come through website (for established sites)',
    tip: "Mobile is everything. 70%+ of homeowners who search for local contractors are on a phone. If your website isn't fast and functional on mobile, you're losing leads daily.",
  },
  {
    id: 'crm',
    title: 'CRM & Follow-Up Systems',
    icon: '📊',
    importance: 'Medium',
    description: "Most contractors lose potential revenue by failing to follow up with leads. A basic CRM (customer relationship management) system tracks leads, reminds you to follow up, and helps you convert more estimates into jobs.",
    steps: [
      'Start simple: even a spreadsheet beats no system',
      'Log every lead with: name, phone, project type, estimate date, status',
      'Follow up on every estimate within 48 hours if you haven\'t heard back',
      'Send a "checking in" message to leads 1 week after estimate — many jobs are won this way',
      'Track your close rate by source to know what\'s working',
      'Tools to consider: Jobber, ServiceM8, HubSpot Free, or Monday.com',
      'After job completion, schedule a 30-day follow-up for referrals and reviews',
    ],
    metric: 'Following up increases close rate by 15–30%',
    tip: "The fortune is in the follow-up. Most contractors send one estimate and never follow up. The contractor who follows up respectfully 2–3 times often wins the job — not because they were cheapest, but because they were most responsive.",
  },
  {
    id: 'pricing',
    title: 'Pricing Strategy & Profitability',
    icon: '💰',
    importance: 'High',
    description: "Many Ontario contractors are leaving money on the table with their pricing. Understanding your true costs, market rates, and value positioning is essential for a profitable renovation business.",
    steps: [
      'Calculate your true hourly rate: wages + overhead + profit margin',
      'Research market rates in your area — use tools like QuoteXbert to see what homeowners expect',
      'Never compete on price alone; compete on: speed, reliability, communication, quality',
      'Itemize your quotes — homeowners who understand where money goes are less price-sensitive',
      'Present 3 options (good/better/best) to anchor the conversation toward mid-range',
      'Add a premium for rush jobs (2–4 week quick starts vs. 3 months out)',
      'Review pricing quarterly — material costs change, and your rates should reflect that',
    ],
    metric: 'Proper pricing: margins of 20–35% on project revenue',
    tip: "The cheapest contractor rarely wins long-term. Homeowners who choose the cheapest contractor often regret it — and don't refer you. Price for the work you do well, communicate clearly, and attract clients who value quality.",
  },
  {
    id: 'ai',
    title: 'AI Tools for Contractors',
    icon: '🤖',
    importance: 'Growing',
    description: "AI is transforming how contractors estimate, communicate, and market their businesses. Early adopters have a significant advantage over competitors still working manually.",
    steps: [
      'Use AI tools (ChatGPT, Claude) to write professional quotes and emails faster',
      'Generate social media captions and blog posts for your content marketing',
      'Use AI transcription (Otter.ai) to document client meetings efficiently',
      'Leverage platforms like QuoteXbert where homeowners arrive with AI estimates — this improves conversation quality',
      'Use Google\'s AI features in your Business Profile to enhance your presence',
      'Explore AI-powered job scheduling tools to improve efficiency',
      'Stay current: the contractors who adapt to AI now will outcompete those who don\'t',
    ],
    metric: 'Early adopters report 25–40% efficiency improvement',
    tip: "AI doesn't replace your skill as a contractor — it removes administrative burden so you spend more time doing billable work and less time on emails, invoices, and marketing.",
  },
];

const faqs = [
  {
    q: 'How do renovation contractors get more leads in Ontario?',
    a: "The most effective channels for Ontario renovation contractors are: (1) Google Business Profile with strong reviews — free and generates 5–15 leads/month for active profiles; (2) Local platforms like QuoteXbert that provide pre-qualified homeowner leads; (3) Local SEO — city-specific service pages that rank for searches like 'kitchen renovation Whitby'; (4) Social media (Facebook especially) for community presence and referral amplification; (5) Referrals from past clients — systematically asking for referrals after each project.",
  },
  {
    q: 'How much should a contractor spend on marketing in Ontario?',
    a: "Industry benchmarks suggest renovation contractors should spend 5–10% of revenue on marketing and lead generation. For a contractor doing $500,000/year in revenue, that's $25,000–$50,000 in marketing. Breakdown: $3,000–$8,000 for digital platforms and listings, $10,000–$20,000 for Google Ads (if using), balance for photography, branding, and website.",
  },
  {
    q: "What's the best way to get Google reviews as a contractor?",
    a: "The most effective method: text or email the review link to each client immediately after completing their project. SMS messages have 98% open rates. Make it easy — send the direct link, not just a request. For contractors who do 3–5 jobs per month, this system should generate 2–4 reviews per month consistently.",
  },
  {
    q: 'Should contractors use HomeStars, QuoteXbert, or both?',
    a: "Different platforms serve different purposes. HomeStars is an established platform with consumer trust. QuoteXbert offers AI-powered estimates that pre-qualify leads, meaning homeowners who contact you through QuoteXbert already understand typical pricing. Using both is ideal — HomeStars for brand presence and review collection, QuoteXbert for quality lead generation.",
  },
  {
    q: 'How do I stand out from other contractors in Durham Region?',
    a: "Five ways Durham Region contractors stand out: (1) Speed of response — most contractors respond in 24–48 hours; responding in 2 hours separates you immediately; (2) Communication — send regular project updates proactively; (3) Clean worksites — homeowners notice and tell their neighbours; (4) Follow-up after completion — almost no contractors do this, and it generates referrals; (5) Verified profiles on platforms like QuoteXbert that show homeowners you're licensed, insured, and background-checked.",
  },
];

export default function ContractorGrowthGuidePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-rose-900 text-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-400 mb-6">
            <Link href="/" className="hover:text-white">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <Link href="/guides" className="hover:text-white">Guides</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-white">Contractor Growth Guide</span>
          </nav>

          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full text-sm mb-6">
              <Users className="w-4 h-4" />
              <span>For Renovation Contractors · Ontario 2025</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
              The Ultimate Contractor<br />Growth Guide 2025
            </h1>

            <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-3xl">
              How Ontario renovation contractors get more leads, grow their reputation, and build a profitable business in 2025.
              Covers SEO, Google Business, Facebook, Google Ads, QuoteXbert, AI tools, CRM, pricing, and more.
            </p>

            <div className="flex flex-wrap gap-4 text-sm mb-8">
              {['Google Business Profile', 'Local SEO', 'Review Strategy', 'Lead Generation', 'Pricing', 'AI Tools', 'CRM'].map((tag) => (
                <span key={tag} className="bg-white/10 border border-white/20 px-3 py-1 rounded-full">✓ {tag}</span>
              ))}
            </div>

            <Link href="/for-contractors" className="inline-flex items-center gap-2 bg-rose-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-rose-700 transition-colors text-lg">
              Claim My Founding Contractor Spot on QuoteXbert
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* TOC */}
      <section className="py-10 bg-slate-50 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
            {growthStrategies.map((s) => (
              <a key={s.id} href={`#${s.id}`} className="text-rose-600 hover:text-rose-700 hover:underline font-medium">
                → {s.title.split(':')[0]?.split('(')[0]?.trim() ?? s.title}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 max-w-5xl mx-auto px-4">
        <div className="prose prose-lg text-gray-700">
          <p>
            The renovation industry in Ontario is booming — but so is competition. Homeowners have more tools than ever to research contractors, compare prices, and find reviews. The contractors who win in this environment aren&apos;t necessarily the best craftspeople — they&apos;re the best marketed.
          </p>
          <p>
            This guide covers every effective lead generation and business growth strategy for Ontario renovation contractors in 2025. Whether you&apos;re solo or running a team, whether you do kitchens or roofing, these principles apply.
          </p>
          <p>
            Importantly: you don&apos;t have to implement everything at once. Start with <strong>Google Business Profile and review generation</strong> — these two free strategies alone can significantly increase your monthly lead flow within 60–90 days.
          </p>
        </div>
      </section>

      {/* Growth Strategies */}
      {growthStrategies.map((strategy, i) => (
        <section key={strategy.id} id={strategy.id} className={`py-16 border-t border-gray-100 ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{strategy.icon}</span>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900">{strategy.title}</h2>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${strategy.importance === 'Critical' ? 'bg-red-100 text-red-800' : strategy.importance === 'High' ? 'bg-rose-100 text-rose-800' : strategy.importance === 'Medium-High' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'}`}>
                {strategy.importance}
              </span>
            </div>

            <p className="text-gray-700 leading-relaxed mb-6 text-lg">{strategy.description}</p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase tracking-wide">Action Steps</h3>
                <ol className="space-y-2">
                  {strategy.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-gray-700">
                      <span className="w-5 h-5 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">{j + 1}</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                  <p className="text-xs font-bold text-green-700 uppercase mb-1">Expected Impact</p>
                  <p className="font-bold text-gray-900 text-sm">{strategy.metric}</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <p className="text-xs font-bold text-amber-700 uppercase mb-1">Pro Tip</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{strategy.tip}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* The Contractor Growth Stack */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black mb-6">The Ontario Contractor Growth Stack</h2>
          <p className="text-gray-300 mb-8">Implement these in order — each builds on the previous.</p>

          <div className="grid md:grid-cols-2 gap-4">
            {[
              { priority: 'Week 1', action: 'Optimize Google Business Profile + set up review collection system', cost: 'Free' },
              { priority: 'Week 2–3', action: 'Create/verify QuoteXbert contractor profile + join as Founding Member', cost: 'Low monthly' },
              { priority: 'Month 1–2', action: 'Create trade-specific and city-specific pages on your website', cost: 'Free (time investment)' },
              { priority: 'Month 2–3', action: 'Activate Google Local Service Ads ($150–$300/week budget)', cost: '$600–$1,200/month' },
              { priority: 'Ongoing', action: 'Post weekly on social + respond to all reviews within 24 hours', cost: 'Free (time)' },
              { priority: 'Month 3+', action: 'Implement CRM system for lead follow-up and referral requests', cost: '$0–$80/month' },
            ].map((item) => (
              <div key={item.priority} className="bg-white/10 border border-white/20 rounded-xl p-4 flex items-start gap-4">
                <div className="flex-shrink-0 bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded-lg">{item.priority}</div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{item.action}</p>
                  <p className="text-gray-400 text-xs mt-1">💰 {item.cost}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/for-contractors" className="bg-rose-600 text-white font-bold px-8 py-4 rounded-2xl hover:bg-rose-700 transition-colors text-lg inline-block">
              Claim My Founding Contractor Spot on QuoteXbert →
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8">Contractor Growth FAQ</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-bold text-gray-900 mb-3">{faq.q}</h3>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Internal Links */}
      <section className="py-12 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <h3 className="text-xl font-black text-gray-900 mb-5">More Resources for Contractors</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Join QuoteXbert as a Contractor', href: '/for-contractors' },
              { label: 'Durham Region Contractors', href: '/durham-region-contractors' },
              { label: 'How AI Estimates Work', href: '/how-ai-works' },
              { label: 'Contractor Leads Toronto', href: '/contractor-leads-toronto' },
              { label: 'Contractor Leads Oshawa', href: '/contractor-leads-oshawa' },
              { label: 'Contractor Leads Whitby', href: '/contractor-leads-whitby' },
              { label: 'Contractor Leads Ajax', href: '/contractor-leads-ajax' },
              { label: 'Blog', href: '/blog' },
              { label: 'All Guides', href: '/guides' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: 'The Ultimate Contractor Growth Guide 2025',
        description: 'How Ontario renovation contractors get more leads and grow their business — SEO, Google Business, QuoteXbert, pricing, and AI tools.',
        author: { '@type': 'Organization', name: 'QuoteXbert' },
        publisher: { '@type': 'Organization', name: 'QuoteXbert', url: 'https://www.quotexbert.com' },
        url: 'https://www.quotexbert.com/contractor-growth-guide',
        dateModified: new Date().toISOString().split('T')[0],
      })}} />
    </main>
  );
}
