/**
 * ContractorCityTemplate — GTA city-specific contractor lead pages
 *
 * Clones the structure of ContractorLeadTemplate exactly, with an additional
 * "Contractor Leads by City" internal link section that cross-links all city
 * pages. Existing ContractorLeadTemplate is NOT modified.
 */
import Link from "next/link";
import { Sparkles, CheckCircle, Users, Briefcase, ArrowRight, Star, MapPin, DollarSign } from "lucide-react";
import { ContractorLeadData } from "@/lib/seo/contractor-lead-data";
import FAQSection from "@/components/seo/FAQSection";
import InternalLinksSection from "@/components/seo/InternalLinksSection";
import StructuredData from "@/components/seo/StructuredData";

interface Props {
  data: ContractorLeadData;
}

// Trade-specific lead pages — Toronto hub
const tradeContractorLinks = [
  { href: "/contractor-leads-toronto", label: "Contractor Leads Toronto" },
  { href: "/plumber-leads-toronto", label: "Plumber Leads Toronto" },
  { href: "/electrician-leads-toronto", label: "Electrician Leads Toronto" },
  { href: "/roofing-leads-toronto", label: "Roofing Leads Toronto" },
  { href: "/handyman-leads-toronto", label: "Handyman Leads Toronto" },
  { href: "/general-contractor-leads-toronto", label: "General Contractor Leads Toronto" },
  { href: "/renovation-jobs-toronto", label: "Renovation Jobs Toronto" },
  { href: "/home-renovation-leads-gta", label: "GTA Renovation Leads" },
];

// GTA city contractor lead pages — all available city pages cross-linked
const cityContractorLinks = [
  { href: "/contractor-leads-mississauga", label: "Contractor Leads Mississauga" },
  { href: "/contractor-leads-brampton", label: "Contractor Leads Brampton" },
  { href: "/contractor-leads-vaughan", label: "Contractor Leads Vaughan" },
  { href: "/contractor-leads-markham", label: "Contractor Leads Markham" },
  { href: "/contractor-leads-scarborough", label: "Contractor Leads Scarborough" },
  { href: "/contractor-leads-richmond-hill", label: "Contractor Leads Richmond Hill" },
  { href: "/contractor-leads-oakville", label: "Contractor Leads Oakville" },
  { href: "/contractor-leads-etobicoke", label: "Contractor Leads Etobicoke" },
  { href: "/contractor-leads-north-york", label: "Contractor Leads North York" },
  { href: "/contractor-leads-burlington", label: "Contractor Leads Burlington" },
  { href: "/contractor-leads-pickering", label: "Contractor Leads Pickering" },
  { href: "/contractor-leads-ajax", label: "Contractor Leads Ajax" },
  { href: "/contractor-leads-oshawa", label: "Contractor Leads Oshawa" },
  { href: "/contractor-leads-whitby", label: "Contractor Leads Whitby" },
  { href: "/contractor-leads-hamilton", label: "Contractor Leads Hamilton" },
  { href: "/contractor-leads-milton", label: "Contractor Leads Milton" },
  { href: "/contractor-leads-kitchener", label: "Contractor Leads Kitchener" },
  { href: "/contractor-leads-waterloo", label: "Contractor Leads Waterloo" },
  { href: "/contractor-leads-cambridge", label: "Contractor Leads Cambridge" },
];

// Trade job type pages
const tradeJobLinks = [
  { href: "/plumbing-jobs-toronto", label: "Plumbing Jobs Toronto" },
  { href: "/electrical-jobs-toronto", label: "Electrical Jobs Toronto" },
  { href: "/roofing-jobs-toronto", label: "Roofing Jobs Toronto" },
  { href: "/kitchen-renovation-jobs-toronto", label: "Kitchen Reno Jobs" },
  { href: "/bathroom-renovation-jobs-toronto", label: "Bathroom Reno Jobs" },
  { href: "/flooring-installation-jobs-toronto", label: "Flooring Jobs Toronto" },
];

export default function ContractorCityTemplate({ data }: Props) {
  return (
    <>
      <StructuredData type="Organization" />
      <StructuredData type="Service" serviceName={`Renovation Lead Generation for ${data.tradeName}`} city={data.h1} />

      <div className="min-h-screen bg-white">
        {/* Hero */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-2 mb-4 text-slate-300">
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">For {data.tradeName} · GTA & Ontario</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{data.h1}</h1>
            <p className="text-lg text-slate-300 mb-6 max-w-2xl">{data.intro}</p>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-8">
              {data.stats.map((stat, i) => (
                <div key={i} className="bg-white/10 rounded-xl px-5 py-3 text-center">
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-slate-300">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg"
              >
                <Briefcase className="w-5 h-5" />
                Join as a {data.tradeName.replace(/s$/, "")} — Free
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/contractors"
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                View Contractor Profiles
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-10 text-center">How QuoteXbert Works for {data.tradeName}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {data.howItWorks.map((step, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex gap-4">
                  <div className="w-10 h-10 bg-rose-100 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-rose-600">
                    {i + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{step.step}</h3>
                    <p className="text-gray-600 text-sm">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits */}
        <div className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Why {data.tradeName} Choose QuoteXbert</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {data.benefits.map((benefit, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-100">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-800 font-medium">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Example Jobs */}
        <div className="py-16 px-4 bg-gray-50">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <DollarSign className="w-7 h-7 text-rose-500" />
              Example Jobs Available Right Now
            </h2>
            <div className="space-y-4">
              {data.exampleJobs.map((job, i) => (
                <div key={i} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{job.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-rose-600">{job.budget}</p>
                    <span className="text-xs text-gray-400">estimated budget</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link
                href="/onboarding"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:opacity-90 transition-all shadow-lg"
              >
                <Sparkles className="w-5 h-5" />
                View All Available Leads
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="py-16 px-4 bg-gradient-to-r from-rose-600 to-orange-600 text-white">
          <div className="max-w-3xl mx-auto text-center">
            <Star className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Start Getting {data.tradeName} Leads Today</h2>
            <p className="text-rose-100 mb-8">
              Join hundreds of GTA contractors who are growing their business with QuoteXbert. Creating a profile is free and takes under 10 minutes.
            </p>
            <Link
              href="/onboarding"
              className="inline-flex items-center gap-2 bg-white text-rose-600 px-8 py-4 rounded-xl font-bold text-xl hover:bg-rose-50 transition-all shadow-lg"
            >
              <Briefcase className="w-6 h-6" />
              Create Free Contractor Profile
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <FAQSection faqs={data.faqs} title={`${data.h1} — FAQ`} />

        {/* Internal Links — city pages (excludes current page) */}
        <InternalLinksSection
          title="Contractor Leads by GTA City"
          links={cityContractorLinks.filter((l) => !l.href.includes(data.slug))}
          columns={3}
        />

        {/* Internal Links — trade-specific pages */}
        <InternalLinksSection
          title="Contractor Leads by Trade — Toronto & GTA"
          links={tradeContractorLinks}
          columns={4}
        />

        {/* Internal Links — job opportunity pages */}
        <InternalLinksSection
          title="Find Trade-Specific Job Opportunities"
          links={tradeJobLinks}
          columns={3}
        />
      </div>
    </>
  );
}
