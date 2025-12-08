"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CalendarDaysIcon, ClockIcon } from "@heroicons/react/24/outline";

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
      imageUrl: "https://images.unsplash.com/photo-1556912167-f556f1f39faa?w=800&h=500&fit=crop",
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
      seoDescription: "Transform your small Toronto condo bathroom. Expert design ideas, space-saving fixtures, and renovation tips for downtown GTA condos."
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
      imageUrl: "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800&h=500&fit=crop",
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
      imageUrl: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800&h=500&fit=crop",
      seoTitle: "Hardwood Flooring Toronto 2025 | Installation Guide & Costs",
      seoDescription: "Complete guide to hardwood flooring in Toronto. Types, costs, installation tips, and finding qualified GTA flooring contractors."
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
      imageUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=500&fit=crop",
      seoTitle: "Deck Building Toronto 2025 | Design Ideas, Materials & Costs",
      seoDescription: "Build your dream Toronto deck. Design ideas, material options, permit requirements, and finding qualified GTA deck contractors."
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
      seoDescription: "Top energy-efficient upgrades for Toronto homes. Ontario rebates, ROI calculations, and contractors for GTA energy improvements."
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
      seoDescription: "Complete painting guide for Toronto homeowners. Color trends, climate considerations, costs, and finding qualified GTA painting contractors."
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
      imageUrl: "https://images.unsplash.com/photo-1545259742-24f9b04e9cfb?w=800&h=500&fit=crop",
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
    }
  ];

  const categories = ["all", "Basement", "Kitchen", "Bathroom", "Roofing", "Contractor Tips", "Flooring", "HVAC", "Outdoor", "Energy", "Windows"];

  const filteredPosts = selectedCategory === "all"
    ? blogPosts
    : blogPosts.filter(post => post.category === selectedCategory);

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h1 className="text-5xl font-bold mb-4">Toronto Home Renovation Blog</h1>
            <p className="text-xl text-orange-100">
              Expert advice, cost guides, and tips for GTA homeowners
            </p>
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
            {filteredPosts.map((post) => (
              <article
                key={post.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group hover-lift"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
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
            ))}
          </div>
        </section>

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
