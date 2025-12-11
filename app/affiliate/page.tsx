import React from "react";
import Link from "next/link";

export default function AffiliatePage() {
  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "Real Estate Agent",
      earnings: "$12,450",
      period: "Last 6 Months",
      avatar: "👩‍💼",
      quote: "QuotexBert's affiliate program has been an incredible addition to my business. I recommend them to all my clients doing renovations, and the commissions are fantastic!",
      rating: 5,
      referrals: 47
    },
    {
      name: "Marcus Chen",
      role: "Home Inspector",
      earnings: "$8,920",
      period: "Last 4 Months",
      avatar: "👨‍🔧",
      quote: "Every home inspection I do leads to renovation recommendations. QuotexBert makes it easy to connect homeowners with quality contractors. Win-win for everyone!",
      rating: 5,
      referrals: 34
    },
    {
      name: "Jennifer Lopez",
      role: "Interior Designer",
      earnings: "$15,780",
      period: "Last 8 Months",
      avatar: "👩‍🎨",
      quote: "As a designer, I work with contractors constantly. QuotexBert's affiliate program lets me earn while providing value to my clients. It's been a game-changer!",
      rating: 5,
      referrals: 62
    },
    {
      name: "David Park",
      role: "Property Manager",
      earnings: "$6,340",
      period: "Last 3 Months",
      avatar: "👨‍💼",
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
              🎉 Now Accepting New Affiliates
            </span>
          </div>
          <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-orange-600 via-rose-600 to-amber-600 bg-clip-text text-transparent">
            Earn While You Help Others
          </h1>
          <p className="text-2xl text-gray-700 mb-4 font-medium max-w-3xl mx-auto">
            Join Canada's #1 Home Improvement Affiliate Program
          </p>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Connect homeowners with contractors and earn generous commissions for every successful referral. No experience required!
          </p>
          
          <div className="flex justify-center gap-4">
            <button className="group relative overflow-hidden rounded-2xl px-8 py-4 font-black text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-rose-500 to-orange-500 bg-[length:200%_100%] animate-gradient"></div>
              <div className="relative text-white flex items-center gap-2">
                <span>Join Free Today</span>
                <span className="text-2xl">→</span>
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
                    <div className="text-5xl">{testimonial.avatar}</div>
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
