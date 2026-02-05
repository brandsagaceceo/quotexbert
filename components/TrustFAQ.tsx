"use client";

import { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const TRUST_FAQS = [
  {
    id: 1,
    question: "How does QuoteXbert pricing work?",
    answer: "We look at your photos and description, then compare them to 1,000+ real contractor quotes from Toronto and the GTA. You get a detailed breakdown showing materials, labor, and timeline. We show both a low and high price based on how complex your project is and what quality level you want. This gives you realistic numbers so you don't overpay and can negotiate with confidence."
  },
  {
    id: 2,
    question: "How are contractors verified?",
    answer: "We verify contractors through multiple checks: business registration, licensing (where applicable), insurance coverage, and reference verification. Contractors must maintain a minimum 4.0 rating and respond to homeowners within 24 hours. We monitor all communications and remove contractors who violate our quality standards."
  },
  {
    id: 3,
    question: "Why do prices vary between estimates?",
    answer: "Prices vary based on: (1) Material quality—budget vs. premium options, (2) Project complexity—standard vs. custom work, (3) Contractor experience—newer vs. established pros, (4) Timeline—rush jobs cost more, (5) Location—urban Toronto vs. outer GTA affects travel/costs. Our AI accounts for these factors to give you realistic ranges."
  },
  {
    id: 4,
    question: "Is the AI estimate accurate?",
    answer: "Our AI has 85-92% accuracy compared to actual contractor quotes in the GTA. It's trained on real project data and regional pricing. However, it's an estimate, not a binding quote. Actual costs may vary after an in-person inspection reveals hidden issues (water damage, structural problems, etc.). Always get multiple contractor bids for final pricing."
  },
  {
    id: 5,
    question: "What happens after I get an estimate?",
    answer: "After receiving your AI estimate, you can: (1) Download it as a PDF to share with contractors, (2) Post your project to our job board where verified contractors can bid, (3) Compare contractor proposals against our estimate to spot overpricing or lowballing, (4) Message contractors directly through our platform. Homeowners use QuoteXbert 100% free—we charge contractors for lead access."
  },
  {
    id: 6,
    question: "Why is QuoteXbert free for homeowners?",
    answer: "We make money from contractors who pay to access high-quality leads and subscribe to our platform. Homeowners never pay—this keeps our service unbiased. We're not paid by contractors to show them first or promote specific pros. Our incentive is to give you accurate estimates so you make informed decisions and contractors close more deals at fair prices."
  }
];

export default function TrustFAQ() {
  const [openId, setOpenId] = useState<number | null>(1); // Open first by default

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-bold">
            🔒 TRANSPARENCY & TRUST
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            How QuoteXbert Works
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Everything you need to know about our pricing, contractor verification, and platform
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {TRUST_FAQS.map((faq) => (
            <div
              key={faq.id}
              className="bg-slate-50 border-2 border-slate-200 rounded-xl overflow-hidden hover:border-rose-300 transition-colors"
            >
              <button
                onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                className="w-full px-6 py-5 flex justify-between items-center text-left hover:bg-slate-100 transition-colors"
              >
                <span className="text-lg font-bold text-slate-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDownIcon
                  className={`w-6 h-6 text-slate-600 flex-shrink-0 transition-transform duration-200 ${
                    openId === faq.id ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ${
                  openId === faq.id ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="px-6 pb-5 text-slate-700 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center p-8 bg-gradient-to-r from-rose-50 to-orange-50 rounded-2xl border-2 border-rose-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-3">
            Ready to get your estimate?
          </h3>
          <p className="text-slate-600 mb-6">
            Upload photos or describe your project. Get detailed pricing in 30 seconds.
          </p>
          <a
            href="#get-estimate"
            className="inline-block px-8 py-4 bg-gradient-to-r from-rose-700 to-orange-600 text-white text-lg font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200"
          >
            🚀 Get Free Estimate Now
          </a>
        </div>
      </div>
    </section>
  );
}
