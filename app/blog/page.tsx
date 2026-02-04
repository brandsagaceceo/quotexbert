"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";

// Default fallback image for blog posts without images
const DEFAULT_BLOG_IMAGE = "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=500&fit=crop&q=80";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  imageUrl: string;
  seoTitle: string;
  seoDescription: string;
  isDIY?: boolean;
}

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "Complete Guide to Basement Finishing in Toronto 2025",
      slug: "basement-finishing-toronto-guide-2025",
      excerpt: "Transform your Toronto basement into a beautiful living space. Learn about permits, costs, design ideas, and finding the right GTA contractor for your project.",
      author: "Michael Chen",
      publishedAt: "2025-01-22",
      readTime: 12,
      category: "Basement",
      tags: ["toronto basement", "GTA renovation", "basement finishing", "toronto permits"],
      imageUrl: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=500&fit=crop",
      seoTitle: "Basement Finishing Toronto 2025 | Complete GTA Guide & Costs",
      seoDescription: "Expert guide to finishing your Toronto basement. Permits, costs, design ideas, and finding qualified GTA contractors for basement renovations."
    },
    {
      id: "2",
      title: "Kitchen Renovation Costs in Toronto & GTA: 2025 Price Guide",
      slug: "toronto-kitchen-renovation-costs-2025",
      excerpt: "Planning a kitchen reno in Toronto? Get accurate cost breakdowns for cabinets, countertops, appliances, and labor in the Greater Toronto Area.",
      author: "Sarah Thompson",
      publishedAt: "2025-01-20",
      readTime: 10,
      category: "Kitchen",
      tags: ["toronto kitchen", "renovation costs", "GTA pricing", "kitchen remodel"],
      imageUrl: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&h=500&fit=crop&q=80",
      seoTitle: "Toronto Kitchen Renovation Costs 2025 | GTA Pricing Guide",
      seoDescription: "Complete kitchen renovation cost guide for Toronto homeowners. GTA pricing, permit costs, and budgeting tips for your Toronto kitchen remodel."
    },
    {
      id: "3",
      title: "How to Hire a Reliable Contractor in Toronto: 2025 Checklist",
      slug: "hire-reliable-contractor-toronto-checklist",
      excerpt: "Avoid contractor scams in Toronto! Our comprehensive checklist covers licensing, insurance, WSIB, references, and red flags to watch for in the GTA.",
      author: "Jennifer Martinez",
      publishedAt: "2025-01-18",
      readTime: 8,
      category: "Contractor Tips",
      tags: ["toronto contractors", "hiring guide", "contractor tips", "GTA"],
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=500&fit=crop",
      seoTitle: "How to Hire Contractors in Toronto 2025 | GTA Hiring Checklist",
      seoDescription: "Find reliable contractors in Toronto with our expert checklist. Verify licensing, WSIB, insurance, and avoid common contractor scams in the GTA."
    },
    {
      id: "4",
      title: "Bathroom Remodeling Ideas for Small Toronto Condos",
      slug: "small-bathroom-ideas-toronto-condos",
      excerpt: "Maximize your small Toronto condo bathroom with clever design ideas. Space-saving solutions, modern fixtures, and renovation tips for downtown living.",
      author: "David Park",
      publishedAt: "2025-01-15",
      readTime: 7,
      category: "Bathroom",
      tags: ["toronto condo", "small bathroom", "bathroom ideas", "downtown toronto"],
      imageUrl: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800&h=500&fit=crop",
      seoTitle: "Small Bathroom Ideas for Toronto Condos 2025 | Space-Saving Tips",
      seoDescription: "Transform your small Toronto condo bathroom. Expert design ideas, space-saving fixtures, and renovation tips for downtown GTA condos.",
      isDIY: true
    },
    {
      id: "5",
      title: "Toronto Roofing Guide: When to Repair vs Replace Your Roof",
      slug: "toronto-roofing-repair-vs-replace",
      excerpt: "Toronto winters are tough on roofs. Learn when to repair vs replace, costs, materials best for Ontario climate, and finding qualified Toronto roofers.",
      author: "Robert Wilson",
      publishedAt: "2025-01-12",
      readTime: 9,
      category: "Roofing",
      tags: ["toronto roofing", "roof replacement", "GTA roofers", "ontario winter"],
      imageUrl: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&h=500&fit=crop&q=80",
      seoTitle: "Toronto Roofing Guide 2025 | Repair vs Replace Your GTA Roof",
      seoDescription: "Expert Toronto roofing advice. Learn when to repair vs replace, costs, winter damage prevention, and finding qualified Ontario roofers."
    },
    {
      id: "6",
      title: "Hardwood Flooring Installation in Toronto: Types, Costs & Care",
      slug: "hardwood-flooring-toronto-guide",
      excerpt: "Choose the perfect hardwood flooring for your Toronto home. Compare engineered vs solid wood, costs, installation tips, and top GTA flooring contractors.",
      author: "Lisa Chang",
      publishedAt: "2025-01-10",
      readTime: 8,
      category: "Flooring",
      tags: ["toronto flooring", "hardwood floors", "GTA contractors", "flooring costs"],
      imageUrl: "https://images.unsplash.com/photo-1600607687644-c7171b42498f?w=800&h=500&fit=crop",
      seoTitle: "Hardwood Flooring Toronto 2025 | Installation Guide & Costs",
      seoDescription: "Complete guide to hardwood flooring in Toronto. Types, costs, installation tips, and finding qualified GTA flooring contractors.",
      isDIY: true
    },
    {
      id: "7",
      title: "Home Addition Permits in Toronto: Complete 2025 Guide",
      slug: "toronto-home-addition-permits-guide",
      excerpt: "Planning a home addition in Toronto? Navigate City of Toronto permits, zoning regulations, costs, and the approval process for GTA home expansions.",
      author: "Mark Stevens",
      publishedAt: "2025-01-08",
      readTime: 11,
      category: "Permits",
      tags: ["toronto permits", "home addition", "city of toronto", "zoning"],
      imageUrl: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=500&fit=crop",
      seoTitle: "Toronto Home Addition Permits 2025 | City Approval Guide",
      seoDescription: "Navigate Toronto home addition permits easily. City of Toronto regulations, zoning requirements, costs, and approval timeline for GTA additions."
    },
    {
      id: "8",
      title: "Deck Building in Toronto: Design Ideas, Materials & Costs",
      slug: "toronto-deck-building-guide",
      excerpt: "Build the perfect outdoor space for your Toronto home. Deck design ideas, material comparisons, permit requirements, and finding GTA deck builders.",
      author: "Amanda Rodriguez",
      publishedAt: "2025-01-05",
      readTime: 10,
      category: "Outdoor",
      tags: ["toronto deck", "outdoor living", "GTA contractors", "deck design"],
      imageUrl: "https://images.unsplash.com/photo-1600585152915-d208bec867a1?w=800&h=500&fit=crop",
      seoTitle: "Deck Building Toronto 2025 | Design Ideas, Materials & Costs",
      seoDescription: "Build your dream Toronto deck. Design ideas, material options, permit requirements, and finding qualified GTA deck contractors.",
      isDIY: true
    },
    {
      id: "9",
      title: "Energy-Efficient Home Upgrades for Toronto's Climate",
      slug: "energy-efficient-upgrades-toronto",
      excerpt: "Save money and stay comfortable in Toronto's extreme weather. Top energy-efficient upgrades, rebates, and ROI for GTA homeowners.",
      author: "Tom Anderson",
      publishedAt: "2025-01-02",
      readTime: 9,
      category: "Energy",
      tags: ["toronto energy", "home efficiency", "ontario rebates", "GTA upgrades"],
      imageUrl: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=800&h=500&fit=crop",
      seoTitle: "Energy-Efficient Home Upgrades Toronto 2025 | Save Money & Stay Warm",
      seoDescription: "Top energy-efficient upgrades for Toronto homes. Ontario rebates, ROI calculations, and contractors for GTA energy improvements.",
      isDIY: true
    },
    {
      id: "10",
      title: "Painting Your Toronto Home: Interior & Exterior Guide",
      slug: "toronto-painting-guide-interior-exterior",
      excerpt: "Refresh your Toronto home with a new paint job. Color trends, climate considerations, costs, and finding professional GTA painters.",
      author: "Emily Watson",
      publishedAt: "2024-12-30",
      readTime: 7,
      category: "Painting",
      tags: ["toronto painting", "interior paint", "exterior paint", "GTA painters"],
      imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&h=500&fit=crop",
      seoTitle: "Toronto Home Painting Guide 2025 | Interior & Exterior Tips",
      seoDescription: "Complete painting guide for Toronto homeowners. Color trends, climate considerations, costs, and finding qualified GTA painting contractors.",
      isDIY: true
    },
    {
      id: "11",
      title: "Toronto HVAC Systems: Choosing the Right Heating & Cooling",
      slug: "toronto-hvac-heating-cooling-guide",
      excerpt: "Stay comfortable year-round in Toronto. Compare HVAC systems for Ontario's climate, costs, energy efficiency, and top GTA HVAC contractors.",
      author: "Kevin Lee",
      publishedAt: "2024-12-28",
      readTime: 10,
      category: "HVAC",
      tags: ["toronto hvac", "heating cooling", "GTA contractors", "energy efficiency"],
      imageUrl: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&h=500&fit=crop",
      seoTitle: "Toronto HVAC Guide 2025 | Heating & Cooling Systems for Ontario",
      seoDescription: "Choose the right HVAC system for your Toronto home. Compare options, costs, energy efficiency, and find qualified GTA HVAC contractors."
    },
    {
      id: "12",
      title: "Waterproofing Your Toronto Basement: Prevention & Solutions",
      slug: "toronto-basement-waterproofing-guide",
      excerpt: "Protect your Toronto home from water damage. Basement waterproofing methods, costs, signs of water problems, and qualified GTA contractors.",
      author: "Rachel Green",
      publishedAt: "2024-12-25",
      readTime: 9,
      category: "Basement",
      tags: ["toronto waterproofing", "basement", "water damage", "GTA contractors"],
      imageUrl: "https://images.unsplash.com/photo-1607400201889-565b1ee75f8e?w=800&h=500&fit=crop",
      seoTitle: "Toronto Basement Waterproofing 2025 | Protection & Solutions",
      seoDescription: "Protect your Toronto basement from water damage. Waterproofing methods, costs, prevention tips, and finding qualified GTA contractors."
    },
    {
      id: "13",
      title: "Landscaping Ideas for Toronto Yards: Climate-Appropriate Plants",
      slug: "toronto-landscaping-ideas-climate-plants",
      excerpt: "Create a beautiful Toronto yard that thrives in Ontario's climate. Native plants, hardscaping ideas, costs, and finding GTA landscapers.",
      author: "Daniel Brown",
      publishedAt: "2024-12-22",
      readTime: 8,
      category: "Landscaping",
      tags: ["toronto landscaping", "ontario plants", "GTA contractors", "garden design"],
      imageUrl: "https://images.unsplash.com/photo-1558904541-efa843a96f01?w=800&h=500&fit=crop",
      seoTitle: "Toronto Landscaping Guide 2025 | Climate-Appropriate Plants & Ideas",
      seoDescription: "Beautiful landscaping for Toronto homes. Native Ontario plants, hardscaping ideas, costs, and finding qualified GTA landscaping contractors."
    },
    {
      id: "14",
      title: "Window Replacement in Toronto: Types, Costs & Energy Savings",
      slug: "toronto-window-replacement-guide",
      excerpt: "Upgrade your Toronto home's windows for better energy efficiency. Compare window types, costs, rebates, and top GTA window installers.",
      author: "Patricia Miller",
      publishedAt: "2024-12-20",
      readTime: 9,
      category: "Windows",
      tags: ["toronto windows", "energy savings", "window replacement", "GTA contractors"],
      imageUrl: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&h=500&fit=crop&q=80",
      seoTitle: "Window Replacement Toronto 2025 | Energy-Efficient Options & Costs",
      seoDescription: "Replace your Toronto home windows for better efficiency. Types, costs, Ontario rebates, and finding qualified GTA window contractors."
    },
    {
      id: "15",
      title: "Home Insurance and Renovations in Toronto: What You Need to Know",
      slug: "toronto-home-insurance-renovations",
      excerpt: "Don't let renovations void your insurance! Learn how Toronto home improvements affect insurance, what to disclose, and protecting your investment.",
      author: "Steven Adams",
      publishedAt: "2024-12-18",
      readTime: 7,
      category: "Insurance",
      tags: ["toronto insurance", "home renovations", "ontario insurance", "GTA"],
      imageUrl: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=500&fit=crop",
      seoTitle: "Toronto Home Insurance & Renovations 2025 | What to Know",
      seoDescription: "Protect your Toronto renovation investment. How home improvements affect insurance, what to disclose, and Ontario insurance requirements."
    },
    {
      id: "16",
      title: "Toronto Condo Renovation Rules & Restrictions 2025",
      slug: "toronto-condo-renovation-rules",
      excerpt: "Planning a condo reno in Toronto? Learn about building rules, noise bylaws, insurance requirements, and working with property management in the GTA.",
      author: "Jessica Taylor",
      publishedAt: "2024-12-15",
      readTime: 10,
      category: "Contractor Tips",
      tags: ["toronto condo", "renovation rules", "GTA", "bylaws"],
      imageUrl: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=500&fit=crop",
      seoTitle: "Toronto Condo Renovation Rules 2025 | Complete Guide",
      seoDescription: "Navigate Toronto condo renovation rules. Building requirements, noise bylaws, insurance, and working with GTA condo boards."
    },
    {
      id: "17",
      title: "Smart Home Technology for Toronto Homes: Worth the Investment?",
      slug: "smart-home-toronto-guide",
      excerpt: "Upgrade your Toronto home with smart technology. Best devices for Canadian climate, costs, installation, and finding qualified GTA integrators.",
      author: "Alex Kumar",
      publishedAt: "2024-12-12",
      readTime: 9,
      category: "Energy",
      tags: ["smart home", "toronto tech", "home automation", "GTA"],
      imageUrl: "https://images.unsplash.com/photo-1558002038-1055907df827?w=800&h=500&fit=crop",
      seoTitle: "Smart Home Tech Toronto 2025 | Installation Guide & Costs",
      seoDescription: "Transform your Toronto home with smart technology. Best devices, costs, installation tips, and finding GTA smart home contractors.",
      isDIY: true
    },
    {
      id: "18",
      title: "Garage Conversion Ideas for Toronto Homes",
      slug: "toronto-garage-conversion-ideas",
      excerpt: "Maximize your Toronto property with a garage conversion. Ideas, permits, costs, insulation for Ontario winters, and qualified GTA contractors.",
      author: "Ryan Murphy",
      publishedAt: "2024-12-10",
      readTime: 8,
      category: "Basement",
      tags: ["garage conversion", "toronto renovation", "GTA contractors", "home addition"],
      imageUrl: "https://images.unsplash.com/photo-1590845947670-c009801ffa74?w=800&h=500&fit=crop&q=80",
      seoTitle: "Toronto Garage Conversion 2025 | Ideas, Permits & Costs",
      seoDescription: "Convert your Toronto garage into living space. Design ideas, permits, insulation for Ontario climate, costs, and GTA contractors."
    },
    {
      id: "19",
      title: "Accessible Home Renovations in Toronto: Aging in Place",
      slug: "toronto-accessible-home-renovations",
      excerpt: "Make your Toronto home accessible for all ages. Bathroom modifications, ramps, wider doorways, Ontario grants, and specialized GTA contractors.",
      author: "Linda Martinez",
      publishedAt: "2024-12-08",
      readTime: 11,
      category: "Bathroom",
      tags: ["accessible renovation", "aging in place", "toronto", "ontario grants"],
      imageUrl: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&h=500&fit=crop",
      seoTitle: "Accessible Home Renovations Toronto 2025 | Aging in Place Guide",
      seoDescription: "Create an accessible Toronto home. Modifications, Ontario grants, costs, and finding specialized GTA accessibility contractors."
    },
    {
      id: "20",
      title: "Foundation Repair in Toronto: Signs, Costs & Solutions",
      slug: "toronto-foundation-repair-guide",
      excerpt: "Protect your Toronto home's foundation. Warning signs, repair methods, costs, preventing damage in freeze-thaw cycles, and expert GTA contractors.",
      author: "Michael O'Brien",
      publishedAt: "2024-12-05",
      readTime: 12,
      category: "Contractor Tips",
      tags: ["foundation repair", "toronto", "structural", "GTA contractors"],
      imageUrl: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=500&fit=crop",
      seoTitle: "Foundation Repair Toronto 2025 | Signs, Costs & Prevention",
      seoDescription: "Fix your Toronto home's foundation. Warning signs, repair methods, costs for Ontario climate, and qualified GTA foundation contractors."
    },
    {
      id: "21",
      title: "Outdoor Kitchen Design for Toronto Backyards",
      slug: "toronto-outdoor-kitchen-design",
      excerpt: "Build the perfect outdoor kitchen for Toronto entertaining. Design ideas, weatherproofing for Ontario, costs, and finding skilled GTA contractors.",
      author: "Sophia Chen",
      publishedAt: "2024-12-02",
      readTime: 10,
      category: "Outdoor",
      tags: ["outdoor kitchen", "toronto backyard", "GTA", "entertaining"],
      imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=500&fit=crop",
      seoTitle: "Outdoor Kitchen Toronto 2025 | Design Ideas & Costs",
      seoDescription: "Create an outdoor kitchen for your Toronto backyard. Design ideas, weatherproofing, costs, and finding qualified GTA contractors."
    },
    {
      id: "22",
      title: "Fire Safety Upgrades for Toronto Homes: Code Requirements",
      slug: "toronto-fire-safety-upgrades",
      excerpt: "Ensure your Toronto home meets fire code. Smoke alarms, sprinklers, escape routes, Ontario Building Code requirements, and qualified GTA contractors.",
      author: "David Wong",
      publishedAt: "2024-11-28",
      readTime: 8,
      category: "Contractor Tips",
      tags: ["fire safety", "building code", "toronto", "ontario"],
      imageUrl: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&h=500&fit=crop&q=80",
      seoTitle: "Fire Safety Upgrades Toronto 2025 | Code Requirements & Costs",
      seoDescription: "Upgrade fire safety in your Toronto home. Ontario Building Code requirements, costs, and finding qualified GTA fire safety contractors."
    },
    {
      id: "23",
      title: "Toronto Home Office Renovation: Design & Tax Deductions",
      slug: "toronto-home-office-renovation",
      excerpt: "Create the perfect Toronto home office. Design ideas, soundproofing, lighting, CRA tax deductions, and finding GTA renovation contractors.",
      author: "Caroline Lee",
      publishedAt: "2024-11-25",
      readTime: 9,
      category: "Basement",
      tags: ["home office", "toronto renovation", "tax deductions", "GTA"],
      imageUrl: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=500&fit=crop",
      seoTitle: "Toronto Home Office Renovation 2025 | Design & Tax Guide",
      seoDescription: "Build your dream Toronto home office. Design tips, soundproofing, CRA tax deductions, and qualified GTA contractors."
    },
    {
      id: "24",
      title: "Pool Installation in Toronto: Types, Costs & Maintenance",
      slug: "toronto-pool-installation-guide",
      excerpt: "Add a pool to your Toronto backyard. Compare pool types, installation costs, winterizing for Ontario, maintenance, and trusted GTA pool builders.",
      author: "James Mitchell",
      publishedAt: "2024-11-22",
      readTime: 11,
      category: "Outdoor",
      tags: ["pool installation", "toronto backyard", "GTA", "outdoor living"],
      imageUrl: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=800&h=500&fit=crop",
      seoTitle: "Pool Installation Toronto 2025 | Types, Costs & Winterizing",
      seoDescription: "Install a pool in your Toronto backyard. Types, costs, winterizing for Ontario, maintenance, and finding qualified GTA pool contractors."
    },
    {
      id: "25",
      title: "Historic Home Renovation in Toronto: Preserving Character",
      slug: "toronto-historic-home-renovation",
      excerpt: "Renovate your historic Toronto home with care. Heritage permits, preserving character, modern upgrades, costs, and specialized GTA contractors.",
      author: "Margaret Thompson",
      publishedAt: "2024-11-18",
      readTime: 13,
      category: "Contractor Tips",
      tags: ["historic homes", "heritage", "toronto", "GTA renovation"],
      imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&h=500&fit=crop",
      seoTitle: "Historic Home Renovation Toronto 2025 | Heritage Preservation",
      seoDescription: "Renovate your historic Toronto home. Heritage permits, preserving character, modern upgrades, and specialized GTA restoration contractors."
    }
  ];

  const categories = ["all", "Basement", "Kitchen", "Bathroom", "Roofing", "Contractor Tips", "Flooring", "HVAC", "Outdoor", "Energy", "Windows"];

  const filteredPosts = selectedCategory === "all"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  const diyPosts = blogPosts.filter((post) => post.isDIY);

  return (
    <>
      <Script
        id="quotexbert-blog-schema"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Blog',
            name: 'QuoteXbert Toronto Home Renovation Blog',
            description:
              'Practical renovation, repair, and DIY advice for Toronto and GTA homeowners, reviewed by local contractors.',
            url: 'https://www.quotexbert.com/blog',
            inLanguage: 'en-CA',
            author: {
              '@type': 'Organization',
              name: 'QuoteXbert',
            },
          }),
        }}
      />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm mb-4">
                <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse" />
                <span className="uppercase tracking-wide text-xs md:text-sm text-orange-100">For GTA homeowners</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">Toronto Home Renovation Blog</h1>
              <p className="text-lg md:text-xl text-orange-100 max-w-2xl">
                Straightforward, experience-based guides written for real Toronto and GTA homeowners.
                No fluff 	 just practical timelines, cost ranges, and decisions we see every week.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="relative w-72 h-40 rounded-2xl bg-white/10 border border-white/15 shadow-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-500/40 via-orange-400/30 to-amber-300/30" />
                <div className="relative h-full w-full flex flex-col justify-between p-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">Trending this week</span>
                    <span className="text-xs text-orange-100">Updated for 2025</span>
                  </div>
                  <div className="space-y-2 text-xs text-orange-50">
                    <p>
                      • Basement finishing timelines in Toronto
                    </p>
                    <p>
                      • What contractors really look for in good leads
                    </p>
                    <p>
                      • DIY vs pro: when to call in help
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-rose-700 to-orange-600 text-white shadow-md"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {category === "all" ? "All Articles" : category}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => {
              // Ensure every blog post has an image - use fallback if missing or invalid
              const imageUrl = post.imageUrl && post.imageUrl.trim() !== '' ? post.imageUrl : DEFAULT_BLOG_IMAGE;
              
              return (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:-translate-y-2 hover:scale-[1.01]"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      // Additional fallback if image fails to load
                      const target = e.target as HTMLImageElement;
                      if (target.src !== DEFAULT_BLOG_IMAGE) {
                        target.src = DEFAULT_BLOG_IMAGE;
                      }
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="bg-rose-700 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      {post.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-rose-800 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <CalendarDaysIcon className="w-4 h-4" />
                        {new Date(post.publishedAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric"
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <ClockIcon className="w-4 h-4" />
                        {post.readTime} min
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-rose-700 bg-rose-50 px-2 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-rose-700 font-semibold hover:text-orange-600 transition-colors"
                  >
                    Read More
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </article>
              );
            })}
          </div>
        </section>

        {/* DIY Guides Section */}
        {diyPosts.length > 0 && (
          <section className="max-w-6xl mx-auto px-4 pb-16">
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-1">
                  DIY-Friendly Guides for Homeowners
                </h2>
                <p className="text-sm md:text-base text-slate-600 max-w-2xl">
                  Weekend projects and upgrade ideas you can realistically tackle yourself —
                  plus clear signals for when it's safer to bring in a licensed pro.
                </p>
              </div>
              <span className="inline-flex items-center gap-2 text-xs md:text-sm text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
                <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
                Curated by Toronto renovation advisors
              </span>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {diyPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white/90 backdrop-blur-sm rounded-xl border border-rose-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group hover:-translate-y-1 hover:scale-[1.005]"
                >
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-orange-50">
                      <span className="inline-flex items-center gap-1 bg-black/40 px-2 py-1 rounded-full">
                        <ClockIcon className="w-3 h-3" />
                        {post.readTime} min DIY read
                      </span>
                      <span className="bg-emerald-500/80 px-2 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wide">
                        DIY-Friendly
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="text-base md:text-lg font-semibold text-slate-900 mb-2 line-clamp-2 group-hover:text-rose-800 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs md:text-sm text-slate-600 mb-3 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-rose-700 text-sm font-semibold hover:text-orange-600 transition-colors"
                    >
                      Open Guide
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-rose-900 to-orange-900 text-white py-16 mt-12">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Your Renovation?</h2>
            <p className="text-xl text-orange-100 mb-8">
              Get instant estimates and connect with verified Toronto contractors
            </p>
            <Link
              href="/"
              className="inline-block bg-white text-rose-900 px-8 py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all"
            >
              Get Free Estimate
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
