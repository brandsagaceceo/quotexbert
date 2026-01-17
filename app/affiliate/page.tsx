import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function AffiliatePage() {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Real Estate Agent",
      earnings: "$12,450",
      period: "Last 6 Months",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop",
      quote: "QuotexBert's affiliate program has been an incredible addition to my business. I recommend them to all my clients doing renovations, and the commissions are fantastic!",
      rating: 5,
      referrals: 47
    },
    {
      name: "Marcus Chen",
      role: "Home Inspector",
      earnings: "$8,920",
      period: "Last 4 Months",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
      quote: "Every home inspection I do leads to renovation recommendations. QuotexBert makes it easy to connect homeowners with quality contractors. Win-win for everyone!",
      rating: 5,
      referrals: 34
    },
    {
      name: "Jennifer Lopez",
      role: "Interior Designer",
      earnings: "$15,780",
      period: "Last 8 Months",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&h=400&fit=crop",
      quote: "As a designer, I work with contractors constantly. QuotexBert's affiliate program lets me earn while providing value to my clients. It's been a game-changer!",
      rating: 5,
      referrals: 62
    },
    {
      name: "David Park",
      role: "Property Manager",
      earnings: "$6,340",
      period: "Last 3 Months",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop",
      quote: "Managing multiple properties means constant maintenance needs. QuotexBert's platform makes it easy to find reliable contractors, and I earn commission on every referral!",
      rating: 5,
      referrals: 28
    }
  ];

  const benefits = [
    {
      icon: "💰",
      title: "Generous Commissions",
      description: "Earn 15% commission on every contractor subscription and 10% on homeowner leads for 12 months",
      highlight: "Up to $500/referral"
    },
    {
      icon: "🎯",
      title: "Easy Tracking",
      description: "Real-time dashboard showing clicks, conversions, and earnings with detailed analytics",
      highlight: "Live Dashboard"
    },
    {
      icon: "🚀",
      title: "Marketing Materials",
      description: "Professional banners, email templates, social media posts, and landing pages provided",
      highlight: "Ready to Use"
    },
    {
      icon: "🏆",
      title: "Performance Bonuses",
      description: "Quarterly bonuses for top performers. Refer 10+ contractors and unlock exclusive rewards",
      highlight: "$1,000+ Bonuses"
    },
    {
      icon: "📱",
      title: "Dedicated Support",
      description: "Direct access to our affiliate team for questions, optimization tips, and support",
      highlight: "24/7 Available"
    },
    {
      icon: "💳",
      title: "Fast Payouts",
      description: "Monthly payments via direct deposit, PayPal, or check. No minimum threshold required",
      highlight: "Net-15 Terms"
    }
  ];

  const stats = [
    { number: "$2.3M+", label: "Paid to Affiliates" },
    { number: "1,200+", label: "Active Affiliates" },
    { number: "15%", label: "Avg Commission" },
    { number: "$850", label: "Avg Monthly Earning" }
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Sign Up Free",
      description: "Create your affiliate account in under 2 minutes. Get instant access to your unique referral link and dashboard.",
      icon: "📝"
    },
    {
      step: "2",
      title: "Share Your Link",
      description: "Promote QuotexBert using your unique link on social media, blogs, emails, or your website.",
      icon: "🔗"
    },
    {
      step: "3",
      title: "Earn Commissions",
      description: "When contractors subscribe or homeowners post jobs through your link, you earn recurring commissions.",
      icon: "💵"
    },
    {
      step: "4",
      title: "Get Paid Monthly",
      description: "Receive automatic payouts every month. Watch your earnings grow with every successful referral.",
      icon: "🎉"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 relative overflow-hidden">
      {/* Animated Background Bubbles */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-block mb-6">
            <span className="px-6 py-2 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-full text-sm font-bold shadow-lg animate-float">
              🎉 Now Accepting New Affiliates - Limited Spots!
            </span>
          </div>
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 bg-clip-text text-transparent leading-tight">
            Earn While You Help Others
          </h1>
          <p className="text-2xl text-gray-700 mb-4 font-medium max-w-3xl mx-auto">
            Join Canada's #1 Home Improvement Affiliate Program
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect homeowners with contractors and earn generous commissions for every successful referral. No experience required!
          </p>
          
          {/* Hero Image */}
          <div className="mb-8 rounded-3xl overflow-hidden shadow-2xl max-w-4xl mx-auto border-8 border-white">
            <Image
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1200&h=600&fit=crop"
              alt="Team collaboration"
              width={1200}
              height={600}
              className="w-full h-auto"
            />
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="group relative overflow-hidden rounded-2xl px-8 py-4 font-black text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 bg-[length:200%_100%] animate-gradient"></div>
              <div className="relative text-white flex items-center justify-center gap-2">
                <span>Join Free Today</span>
                <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
            
            <Link href="#how-it-works">
              <button className="px-8 py-4 bg-white rounded-2xl font-bold text-lg text-gray-800 shadow-xl hover:shadow-2xl transition-all border-2 border-gray-200 hover:border-orange-300 transform hover:scale-105">
                Learn More
              </button>
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl p-6 text-center transform hover:scale-105 transition-all border-2 border-orange-100">
              <div className="text-4xl font-black bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent mb-2">
                {stat.number}
              </div>
              <div className="text-sm text-gray-600 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="mb-20">
          <h2 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            Why Partner With Us?
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">Everything you need to succeed as an affiliate</p>
          
          {/* Feature Image */}
          <div className="mb-12 rounded-3xl overflow-hidden shadow-2xl max-w-5xl mx-auto border-8 border-white">
            <Image
              src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1200&h=500&fit=crop"
              alt="Successful partnership"
              width={1200}
              height={500}
              className="w-full h-auto"
            />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-rose-400 rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative bg-white rounded-3xl shadow-xl p-8 h-full transform hover:scale-105 transition-all duration-300">
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-black text-gray-900 mb-3">{benefit.title}</h3>
                  <p className="text-gray-600 mb-4">{benefit.description}</p>
                  <div className="inline-block px-4 py-2 bg-gradient-to-r from-orange-100 to-rose-100 rounded-full">
                    <span className="text-sm font-bold text-orange-700">{benefit.highlight}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commission Structure */}
        <div className="mb-20 bg-gradient-to-br from-green-50 to-emerald-50 rounded-3xl p-12 border-4 border-green-200">
          <h2 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Transparent Commission Structure
          </h2>
          <p className="text-center text-gray-700 text-lg mb-12">See exactly how much you'll earn from every referral</p>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Homeowner Leads</h3>
              <div className="text-4xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                10%
              </div>
              <p className="text-gray-600 text-sm mb-4">Commission on lead fees for 12 months</p>
              <div className="bg-green-100 rounded-lg p-3">
                <p className="text-green-800 font-bold">$5-15 per lead</p>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-orange-500 to-rose-500 rounded-2xl shadow-2xl p-8 text-center transform hover:scale-110 transition-all text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-bl-xl font-black text-xs">
                BEST VALUE
              </div>
              <div className="text-6xl mb-4">🔨</div>
              <h3 className="text-2xl font-black mb-2">Contractor Subscriptions</h3>
              <div className="text-4xl font-black mb-2">
                15%
              </div>
              <p className="text-white/90 text-sm mb-4">Recurring monthly commission for 12 months</p>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <p className="font-bold">$7-22 per month</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="text-6xl mb-4">🎁</div>
              <h3 className="text-2xl font-black text-gray-900 mb-2">Performance Bonuses</h3>
              <div className="text-4xl font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                Extra
              </div>
              <p className="text-gray-600 text-sm mb-4">Quarterly rewards for top performers</p>
              <div className="bg-purple-100 rounded-lg p-3">
                <p className="text-purple-800 font-bold">Up to $1,000</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h3 className="text-2xl font-black text-gray-900 mb-6 text-center">Example Earnings Calculator</h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <h4 className="font-bold text-gray-900 mb-4">Scenario A: Real Estate Agent</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex justify-between">
                    <span>• 5 contractor referrals/month</span>
                    <span className="font-bold">$75</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• 15 homeowner leads/month</span>
                    <span className="font-bold">$150</span>
                  </li>
                  <li className="flex justify-between border-t pt-2">
                    <span className="font-black">Monthly Earnings:</span>
                    <span className="font-black text-green-600">$225</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span>Yearly Income:</span>
                    <span className="font-bold text-emerald-600">$2,700+</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-rose-50 rounded-xl p-6 border-2 border-orange-200">
                <h4 className="font-bold text-gray-900 mb-4">Scenario B: Content Creator</h4>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex justify-between">
                    <span>• 20 contractor referrals/month</span>
                    <span className="font-bold">$300</span>
                  </li>
                  <li className="flex justify-between">
                    <span>• 40 homeowner leads/month</span>
                    <span className="font-bold">$400</span>
                  </li>
                  <li className="flex justify-between border-t pt-2">
                    <span className="font-black">Monthly Earnings:</span>
                    <span className="font-black text-green-600">$700</span>
                  </li>
                  <li className="flex justify-between text-sm">
                    <span>Yearly Income:</span>
                    <span className="font-bold text-emerald-600">$8,400+</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div id="how-it-works" className="mb-20 bg-white rounded-3xl shadow-2xl p-12">
          <h2 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">Start earning in 4 simple steps</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-rose-500 rounded-full mx-auto mb-6 flex items-center justify-center text-white text-3xl font-black shadow-xl transform hover:scale-110 transition-all">
                  {item.step}
                </div>
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Who It's For Section */}
        <div className="mb-20">
          <h2 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            Who Is This For?
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">Perfect for anyone connected to the home improvement industry</p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">🏡</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Real Estate Agents</h3>
              <p className="text-gray-600 text-sm">
                Recommend QuoteXbert to buyers and sellers needing renovations. Earn recurring income from every referral.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Home Inspectors</h3>
              <p className="text-gray-600 text-sm">
                Every inspection reveals repair needs. Connect clients with quality contractors and earn commissions.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">🎨</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Interior Designers</h3>
              <p className="text-gray-600 text-sm">
                Your designs need reliable contractors. Partner with QuoteXbert and earn while delivering value.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">📱</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Content Creators</h3>
              <p className="text-gray-600 text-sm">
                Share QuoteXbert with your home improvement audience. Earn passive income from social media and blogs.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">🏢</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Property Managers</h3>
              <p className="text-gray-600 text-sm">
                Managing multiple properties means constant maintenance. Streamline contractor connections and earn commissions.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">🔨</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Contractors</h3>
              <p className="text-gray-600 text-sm">
                Refer contractors in other trades you don't offer. Build a network and earn from cross-referrals.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Business Owners</h3>
              <p className="text-gray-600 text-sm">
                Own a hardware store, paint shop, or home services business? Recommend QuoteXbert and monetize your network.
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center transform hover:scale-105 transition-all">
              <div className="text-5xl mb-4">👥</div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Anyone!</h3>
              <p className="text-gray-600 text-sm">
                Know homeowners or contractors? Share your link and start earning. No industry experience required.
              </p>
            </div>
          </div>
        </div>

        {/* Real World Examples */}
        <div className="mb-20 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-12 border-4 border-blue-200">
          <h2 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Real-World Examples
          </h2>
          <p className="text-center text-gray-700 text-lg mb-12">See how affiliates are earning with QuoteXbert</p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Social Media Strategy</h3>
              <p className="text-gray-600 mb-4">
                Post before/after renovation content on Instagram and TikTok. Add your affiliate link in bio and stories. 
                One viral post can bring 50+ sign-ups.
              </p>
              <div className="bg-green-100 rounded-lg p-4">
                <p className="text-green-800 font-bold text-sm">Average: $400-800/month</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">QR Code at Job Sites</h3>
              <p className="text-gray-600 mb-4">
                Contractors can print QR codes linking to QuoteXbert and place them at completed projects. 
                Neighbors see the work and scan to get quotes for their own homes.
              </p>
              <div className="bg-green-100 rounded-lg p-4">
                <p className="text-green-800 font-bold text-sm">Average: $200-500/month</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-4xl mb-4">✉️</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Email Newsletter</h3>
              <p className="text-gray-600 mb-4">
                Real estate agents and home bloggers include QuoteXbert in their monthly newsletters. 
                One email blast to 5,000 subscribers = 100+ clicks and 10-20 conversions.
              </p>
              <div className="bg-green-100 rounded-lg p-4">
                <p className="text-green-800 font-bold text-sm">Average: $600-1,200/month</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-4xl mb-4">🌐</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Website Integration</h3>
              <p className="text-gray-600 mb-4">
                Add QuoteXbert banners to your home improvement blog or business website. 
                Passive traffic converts 24/7 without additional effort.
              </p>
              <div className="bg-green-100 rounded-lg p-4">
                <p className="text-green-800 font-bold text-sm">Average: $300-700/month</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">Word of Mouth</h3>
              <p className="text-gray-600 mb-4">
                Simply recommend QuoteXbert during conversations with homeowners or contractors. 
                Personal referrals convert at the highest rate (30-40%).
              </p>
              <div className="bg-green-100 rounded-lg p-4">
                <p className="text-green-800 font-bold text-sm">Average: $150-400/month</p>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-4xl mb-4">🎥</div>
              <h3 className="text-2xl font-black text-gray-900 mb-3">YouTube Reviews</h3>
              <p className="text-gray-600 mb-4">
                Create home renovation guides and tutorials on YouTube. Include your affiliate link in description. 
                Videos rank in search and generate passive income for years.
              </p>
              <div className="bg-green-100 rounded-lg p-4">
                <p className="text-green-800 font-bold text-sm">Average: $500-1,500/month</p>
              </div>
            </div>
          </div>
        </div>

        {/* How Payouts Work */}
        <div className="mb-20 bg-white rounded-3xl shadow-2xl p-12">
          <h2 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            How Payouts Work
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">Transparent, fast, and reliable payments</p>
          
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-start gap-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200">
              <div className="text-4xl">💰</div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Recurring Monthly Income</h3>
                <p className="text-gray-700 mb-3">
                  Earn 15% commission on contractor subscriptions for <strong>12 full months</strong> from each referral. 
                  If they stay subscribed longer, you keep earning. That's $7-22 per month per contractor, automatically.
                </p>
                <div className="bg-white rounded-lg p-4 border border-green-300">
                  <p className="text-sm text-gray-600">
                    <strong>Example:</strong> Refer 10 contractors in January → Earn $150/month every month for a year = <strong className="text-green-600">$1,800 total</strong>
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200">
              <div className="text-4xl">📅</div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Schedule</h3>
                <p className="text-gray-700 mb-3">
                  Commissions are paid on <strong>Net-15 terms</strong>. That means you get paid 15 days after the end of each month. 
                  Example: January earnings paid by February 15th.
                </p>
                <div className="bg-white rounded-lg p-4 border border-blue-300">
                  <p className="text-sm text-gray-600">
                    <strong>No minimum threshold!</strong> Even if you earn $10, we'll send it to you. Most platforms require $50-100 minimum.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
              <div className="text-4xl">💳</div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Payment Methods</h3>
                <p className="text-gray-700 mb-3">
                  Choose how you want to get paid:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Direct Deposit</strong> - Fastest method (1-2 business days)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>PayPal</strong> - Instant transfer to your PayPal account</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-600 font-bold">✓</span>
                    <span><strong>Check</strong> - Mailed to your address (allow 5-7 days)</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="flex items-start gap-6 bg-gradient-to-r from-orange-50 to-rose-50 rounded-2xl p-6 border-2 border-orange-200">
              <div className="text-4xl">🏆</div>
              <div className="flex-1">
                <h3 className="text-2xl font-black text-gray-900 mb-2">Performance Bonuses</h3>
                <p className="text-gray-700 mb-3">
                  Top performers get rewarded with quarterly bonuses:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600 font-bold">🥉</span>
                    <span><strong>10+ referrals/quarter:</strong> $250 bonus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600 font-bold">🥈</span>
                    <span><strong>25+ referrals/quarter:</strong> $500 bonus</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-orange-600 font-bold">🥇</span>
                    <span><strong>50+ referrals/quarter:</strong> $1,000 bonus + VIP perks</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mb-20">
          <h2 className="text-5xl font-black text-center mb-4 bg-gradient-to-r from-orange-600 to-rose-600 bg-clip-text text-transparent">
            Success Stories
          </h2>
          <p className="text-center text-gray-600 text-lg mb-12">Hear from our top-performing affiliates</p>
          
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-rose-400 to-amber-400 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>
                <div className="relative bg-white rounded-3xl shadow-xl p-8 transform hover:scale-105 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={64}
                        height={64}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-black text-gray-900">{testimonial.name}</h3>
                      <p className="text-sm text-gray-600 font-semibold">{testimonial.role}</p>
                      <div className="flex gap-1 mt-2">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <span key={i} className="text-yellow-400 text-lg">⭐</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-6 italic">"{testimonial.quote}"</p>
                  
                  <div className="flex justify-between items-center pt-6 border-t border-gray-200">
                    <div>
                      <div className="text-2xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        {testimonial.earnings}
                      </div>
                      <div className="text-xs text-gray-500 font-semibold">{testimonial.period}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-black text-orange-600">{testimonial.referrals}</div>
                      <div className="text-xs text-gray-500 font-semibold">Referrals</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-br from-orange-500 via-rose-500 to-amber-500 rounded-3xl shadow-2xl p-12 text-center text-white">
          <h2 className="text-5xl font-black mb-6">Ready to Start Earning?</h2>
          <p className="text-xl mb-8 opacity-90">Join thousands of successful affiliates earning passive income</p>
          
          <button className="group relative overflow-hidden rounded-2xl px-12 py-5 font-black text-xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 bg-white text-orange-600">
            <div className="relative flex items-center gap-3">
              <span>Create Free Account</span>
              <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </button>
          
          <p className="mt-6 text-sm opacity-75">No credit card required • Start earning in minutes</p>
        </div>
      </div>
    </div>
  );
}
