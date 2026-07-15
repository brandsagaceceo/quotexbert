import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRight, Star, CheckCircle, Zap, Brain, Camera, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'How the AI Renovation Estimate Works | QuoteXbert',
  description:
    'Understand how QuoteXbert\'s AI generates accurate renovation estimates for Toronto, Durham Region, and Ontario homeowners. How photos, project data, and local pricing create your estimate.',
  keywords: [
    'how AI renovation estimate works',
    'QuoteXbert AI explained',
    'AI renovation pricing Ontario',
    'renovation estimate technology',
    'how does QuoteXbert work',
  ],
  openGraph: {
    title: 'How the AI Renovation Estimate Works | QuoteXbert',
    description: "How QuoteXbert's AI creates accurate renovation estimates from your photos and project details.",
    url: 'https://www.quotexbert.com/how-ai-works',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'How the AI Works | QuoteXbert',
    description: "How QuoteXbert's AI creates accurate renovation estimates for Ontario homeowners.",
  },
  alternates: {
    canonical: 'https://www.quotexbert.com/how-ai-works',
  },
};

const steps = [
  {
    step: '1',
    icon: '📸',
    title: 'You Upload Photos',
    desc: 'Take photos of the space you want to renovate. The more angles and detail, the better. Our AI uses computer vision to assess room size, existing materials, layout complexity, and potential challenges.',
  },
  {
    step: '2',
    icon: '📝',
    title: 'You Describe the Project',
    desc: 'Tell us what you want to change. New kitchen cabinets? Full bathroom gut? Basement finish? The more specific your description, the more accurate the estimate. Material preferences (budget, mid-range, premium) are factored in.',
  },
  {
    step: '3',
    icon: '📍',
    title: 'We Localize to Your City',
    desc: 'We ask where you\'re located. A kitchen renovation in Oshawa costs less than the same project in Toronto core. Our AI applies city-specific calibration for every Durham Region, GTA, and Ontario location we serve.',
  },
  {
    step: '4',
    icon: '🤖',
    title: 'AI Analyses Your Project',
    desc: 'Our AI cross-references your photos and description against thousands of similar completed Ontario projects. It identifies comparable renovations, applies current material costs, and accounts for labour rates in your specific city.',
  },
  {
    step: '5',
    icon: '📊',
    title: 'You Receive Your Estimate',
    desc: 'Within minutes, you receive a detailed estimate showing low, mid, and high ranges for your project calibrated to your city. The estimate includes what drives cost variation, so you can understand the range.',
  },
  {
    step: '6',
    icon: '🔗',
    title: 'Connect with Verified Contractors',
    desc: "Use your estimate as a benchmark when you receive contractor quotes. Connect directly with QuoteXbert-verified contractors who serve your area — no middlemen, no fees.",
  },
];

const accuracy = [
  { metric: 'Projects in Training Data', value: '10,000+', desc: 'Completed Ontario renovations' },
  { metric: 'Estimate Accuracy', value: '±15%', desc: 'Typical variance from final contractor quotes for standard projects' },
  { metric: 'Cities Calibrated', value: '30+', desc: 'Ontario cities with local pricing data' },
  { metric: 'Update Frequency', value: 'Monthly', desc: 'Material costs and labour rates updated regularly' },
];

const limitations = [
  { title: 'Not a Final Quote', desc: 'AI estimates are benchmarks — not final contractor quotes. A contractor still needs to assess your specific property to account for site-specific factors, hidden issues, and exact material costs.' },
  { title: 'Standard Projects Only', desc: 'The AI is most accurate for common renovation types (kitchen, bathroom, basement, deck, roofing). Highly unusual or custom projects may have lower accuracy.' },
  { title: 'Scope Interpretation', desc: 'The AI interprets your project description. Unclear or incomplete descriptions produce less accurate estimates. Be specific about what you want done.' },
  { title: 'Older Homes', desc: 'Homes built before 1970 often have complications (knob-and-tube wiring, galvanized plumbing, asbestos) that AI can\'t see. Budget an extra 15–20% contingency for older Ontario homes.' },
];

const faqs = [
  { q: 'How accurate is the AI estimate?', a: 'For standard renovation projects (kitchen, bathroom, basement, deck, roofing), AI estimates are typically within 15% of final contractor quotes. About 70% of projects come in within 10% of the AI estimate. The accuracy is highest for mid-range projects in common home types, and lower for luxury custom work or very old homes with unknown conditions.' },
  { q: 'Can the AI see my photos properly?', a: 'Yes — our AI uses computer vision technology trained on thousands of home renovation images. It can assess room dimensions (roughly), identify materials, spot complexity, and detect potential issues visible in photos like moisture staining or structural features. Better photos produce better estimates.' },
  { q: 'Why does the AI give a range instead of a single number?', a: 'Renovation costs genuinely vary based on material quality, contractor overhead, project complexity, and timing. Giving a range is more honest than a single number — it represents the realistic spectrum of what your project could cost based on comparable Ontario projects.' },
  { q: 'How does the AI know about pricing in my city?', a: "We've collected pricing data from completed renovation projects across Ontario, tagged by location. This lets the AI apply city-specific multipliers — so Pickering prices are different from downtown Toronto prices, and Bowmanville prices differ from both. The data is updated monthly." },
  { q: 'Is my project data private?', a: 'Yes. Your photos and project details are used only to generate your estimate and (if you choose) to share with verified contractors you select. We do not sell your data or use it for advertising. See our Privacy Policy for full details.' },
];

export default function HowAIWorksPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.5))] -z-10" />
        <div className="max-w-6xl mx-auto px-4">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-rose-600">Home</Link>
            <ArrowRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">How the AI Works</span>
          </nav>

          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-lg">
              <Brain className="w-5 h-5 text-rose-600" />
              <span className="font-semibold text-gray-900">AI-Powered Local Market Estimates</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              <span className="text-[#800020]">
                How the AI<br />Estimate Works
              </span>
            </h1>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
              QuoteXbert&apos;s AI generates renovation estimates trained on 10,000+ completed Ontario projects.
              It&apos;s calibrated by city, material quality, and project type — giving you a data-driven benchmark
              in under 3 minutes.
            </p>

            <div className="pt-4">
              <Link href="/create-lead" className="inline-flex items-center gap-2 bg-[#800020] text-white font-bold px-8 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all text-lg">
                📸 Try It Free — Get My Estimate <ArrowRight className="w-5 h-5" />
              </Link>
              <p className="text-sm text-gray-500 mt-3">Free · No commitment · Takes 2 minutes</p>
            </div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">How Your Estimate is Generated</h2>
          <p className="text-center text-gray-600 mb-10">Six steps from photo upload to accurate renovation estimate</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <div key={step.step} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 bg-rose-600 text-white font-black rounded-full flex items-center justify-center text-sm">{step.step}</div>
                  <div className="text-3xl">{step.icon}</div>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Accuracy */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">AI Estimate Accuracy</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-8">
            {accuracy.map((item) => (
              <div key={item.metric} className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm text-center">
                <p className="text-3xl font-black text-rose-600 mb-2">{item.value}</p>
                <p className="font-bold text-gray-900 text-sm mb-1">{item.metric}</p>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Limitations (transparency) */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-3 text-center">What the AI Can&apos;t Do</h2>
          <p className="text-center text-gray-600 mb-10">We believe in transparency. Here are the limitations of AI renovation estimates.</p>
          <div className="grid md:grid-cols-2 gap-5">
            {limitations.map((item) => (
              <div key={item.title} className="bg-amber-50 rounded-xl p-5 border border-amber-200">
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-[#800020] text-white">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black mb-4">See How Accurate Your Estimate Is</h2>
          <p className="text-rose-100 text-lg mb-8">Upload photos of your project. Get an instant estimate calibrated to your Ontario city. Compare to contractor quotes. It&apos;s free.</p>
          <Link href="/create-lead" className="bg-white text-rose-600 font-bold px-8 py-4 rounded-2xl hover:bg-rose-50 transition-colors inline-block text-lg">
            Get My Free AI Estimate →
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-gray-900 mb-8 text-center">AI Estimate FAQ</h2>
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
          <h3 className="text-xl font-black text-gray-900 mb-5">Related Resources</h3>
          <div className="flex flex-wrap gap-3">
            {[
              { label: 'Why QuoteXbert', href: '/why-quotexbert' },
              { label: 'Privacy Policy', href: '/privacy' },
              { label: 'For Homeowners', href: '/create-lead' },
              { label: 'For Contractors', href: '/for-contractors' },
              { label: 'Durham Region', href: '/durham-region' },
              { label: 'Toronto', href: '/toronto' },
              { label: 'About', href: '/about' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="bg-white border border-slate-200 text-slate-700 hover:text-rose-600 hover:border-rose-200 text-sm font-medium px-4 py-2 rounded-lg transition-colors">{link.label}</Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
