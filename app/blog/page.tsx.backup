"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head";
import { CalendarDaysIcon, ClockIcon, UserIcon } from "@heroicons/react/24/outline";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: number;
  category: string;
  tags: string[];
  imageUrl: string;
  seoTitle?: string;
  seoDescription?: string;
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  // Sample blog posts with Toronto-focused SEO content
  const samplePosts: BlogPost[] = [
    {
      id: "1",
      title: "10 Home Renovation Projects That Add the Most Value in Toronto 2025",
      slug: "home-renovation-projects-add-value-toronto-2025",
      excerpt: "Discover which home improvement projects offer the best ROI for Toronto homeowners. From kitchen updates to bathroom remodels tailored to the GTA market.",
      content: "Full content would go here...",
      author: "Sarah Johnson",
      publishedAt: "2025-01-15",
      readTime: 8,
      category: "Home Value",
      tags: ["toronto renovation", "GTA", "home value", "investment", "ontario"],
      imageUrl: "/blog/toronto-home-renovation.jpg",
      seoTitle: "Top 10 Home Renovations That Add Value in Toronto 2025 | QuotexBert",
      seoDescription: "Maximize your Toronto home's value with these 10 proven renovation projects. Expert insights on ROI, costs, and finding GTA contractors."
    },
    {
      id: "2",
      title: "How to Choose the Right Contractor in Toronto: Complete GTA Guide",
      slug: "choose-contractor-toronto-gta-guide",
      excerpt: "Finding a reliable contractor in the Greater Toronto Area can be challenging. Our comprehensive guide covers licensing, permits, and vetting Toronto-area contractors.",
      content: "Full content would go here...",
      author: "Mike Rodriguez",
      publishedAt: "2025-01-10",
      readTime: 12,
      category: "Contractor Tips",
      tags: ["toronto contractors", "GTA", "WSIB", "ontario licensing", "tarion"],
      imageUrl: "/blog/toronto-contractors.jpg",
      seoTitle: "How to Choose Toronto Contractors 2025 | GTA Hiring Guide",
      seoDescription: "Find reliable contractors in Toronto & GTA. Learn about Ontario licensing, WSIB, Tarion warranties, and avoiding contractor scams in the Toronto area."
    },
    {
      id: "3",
      title: "Kitchen Remodel Costs in Toronto: 2025 GTA Pricing Guide",
      slug: "kitchen-remodel-costs-toronto-gta-2025",
      excerpt: "Planning a kitchen renovation in Toronto? Get detailed cost breakdowns for GTA kitchen remodels including permits, labor rates, and material costs.",
      content: "Full content would go here...",
      author: "Jennifer Smith",
      publishedAt: "2025-01-05",
      readTime: 10,
      category: "Kitchen",
      tags: ["toronto kitchen", "GTA renovation", "ontario permits", "kitchen costs"],
      imageUrl: "/blog/toronto-kitchen-costs.jpg",
      seoTitle: "Kitchen Renovation Costs Toronto 2025 | GTA Pricing & Permits",
      seoDescription: "Complete Toronto kitchen remodel cost guide for 2025. GTA pricing, Ontario building permits, and budgeting tips for your Toronto kitchen renovation."
    },
    {
      id: "4",
      title: "Small Condo Bathroom Renovation Ideas for Toronto Living",
      slug: "toronto-condo-bathroom-renovation-ideas",
      excerpt: "Transform your small Toronto condo bathroom with space-maximizing renovation ideas. Perfect solutions for downtown condos and GTA townhomes.",
      content: "Full content would go here...",
      author: "David Chen",
      publishedAt: "2024-12-28",
      readTime: 6,
      category: "Bathroom",
      tags: ["toronto condo", "small bathroom", "GTA", "downtown toronto"],
      imageUrl: "/blog/toronto-condo-bathroom.jpg",
      seoTitle: "Toronto Condo Bathroom Renovation Ideas 2025 | Small Space Solutions",
      seoDescription: "Maximize your Toronto condo bathroom space. Expert renovation ideas for small GTA bathrooms, downtown condos, and space-saving solutions."
    },
    {
      id: "5",
      title: "Toronto Roofing: Repair vs Replacement for GTA Homes",
      slug: "toronto-roofing-repair-replacement-guide",
      excerpt: "Toronto's harsh winters demand quality roofing. Learn when to repair vs replace your roof in the GTA climate, plus finding qualified Toronto roofers.",
      content: "Full content would go here...",
      author: "Tom Wilson",
      publishedAt: "2024-12-20",
      readTime: 9,
      category: "Roofing",
      tags: ["toronto roofing", "GTA roofers", "ontario winter", "roof replacement"],
      imageUrl: "/blog/toronto-roofing.jpg",
      seoTitle: "Toronto Roofing Guide 2025 | Repair vs Replace Your GTA Roof",
      seoDescription: "Expert Toronto roofing advice for GTA homeowners. Winter damage, repair vs replacement costs, and finding qualified Ontario roofers."
    },
    {
      id: "6",
      title: "Seasonal Home Maintenance Checklist for Toronto Homeowners",
      slug: "toronto-seasonal-home-maintenance-checklist",
      excerpt: "Stay ahead of costly repairs with our Toronto-specific seasonal maintenance checklist. Protect your GTA home from harsh Ontario winters and humid summers.",
      content: "Full content would go here...",
      author: "Lisa Parker",
      publishedAt: "2024-12-15",
      readTime: 7,
      category: "Maintenance",
      tags: ["toronto maintenance", "GTA", "ontario winter prep", "seasonal checklist"],
      imageUrl: "/blog/toronto-seasonal-maintenance.jpg",
      seoTitle: "Toronto Home Maintenance Checklist 2025 | GTA Seasonal Care",
      seoDescription: "Essential seasonal maintenance for Toronto homes. Prepare for Ontario winters, prevent costly repairs, and protect your GTA property year-round."
    },
    {
      id: "7",
      title: "Complete Guide to Basement Renovations in Toronto: Budget & Design Ideas",
      slug: "toronto-basement-renovation-guide-budget-ideas",
      excerpt: "Transform your Toronto basement into a functional living space. Expert budget breakdown, design ideas, and hiring GTA contractors for basement renovations.",
      content: "Full content would go here...",
      author: "Marc Thompson",
      publishedAt: "2025-01-20",
      readTime: 11,
      category: "Basement",
      tags: ["toronto basement", "GTA renovation", "basement ideas", "toronto contractors", "finished basement"],
      imageUrl: "/blog/toronto-basement-renovation.jpg",
      seoTitle: "Toronto Basement Renovation Guide 2025 | Budget, Design & Contractors",
      seoDescription: "Complete guide to finishing your Toronto basement. Budget breakdown, design ideas, GTA contractor tips, and Ontario permit information for basement renovations."
    },
    {
      id: "8",
      title: "Finding the Right Basement Contractor in Whitby & GTA: 10 Questions to Ask",
      slug: "whitby-basement-contractor-questions",
      excerpt: "Choosing a basement contractor in Whitby or the GTA? Learn the 10 critical questions to ask, red flags to avoid, and how to verify credentials.",
      content: "Full content would go here...",
      author: "Amanda Wells",
      publishedAt: "2025-01-18",
      readTime: 8,
      category: "Contractor Tips",
      tags: ["whitby contractor", "basement contractor", "GTA", "contractor vetting", "ontario"],
      imageUrl: "/blog/whitby-basement-contractor.jpg",
      seoTitle: "Whitby Basement Contractors: 10 Questions to Ask | GTA Hiring Guide",
      seoDescription: "Find reliable basement contractors in Whitby and GTA. Essential questions to ask, red flags, WSIB verification, and contractor hiring tips."
    },
    {
      id: "9",
      title: "Why Basement Waterproofing is Essential in Toronto's Wet Climate",
      slug: "toronto-basement-waterproofing-why-important",
      excerpt: "Toronto's rainy climate makes basement waterproofing essential. Learn about common GTA moisture problems, solutions, and the cost of waterproofing.",
      content: "Full content would go here...",
      author: "Robert Hayes",
      publishedAt: "2025-01-16",
      readTime: 9,
      category: "Basement",
      tags: ["toronto waterproofing", "basement moisture", "GTA", "foundation", "drainage"],
      imageUrl: "/blog/toronto-waterproofing.jpg",
      seoTitle: "Toronto Basement Waterproofing Guide 2025 | GTA Moisture Solutions",
      seoDescription: "Why waterproofing matters in Toronto. Solutions for GTA basement moisture, drainage problems, and expert waterproofing contractors in Ontario."
    }
  ];

  useEffect(() => {
    // Simulate loading blog posts
    setTimeout(() => {
      setPosts(samplePosts);
      setLoading(false);
    }, 1000);
  }, []);

  const categories = ["all", ...Array.from(new Set(posts.map(post => post.category)))];
  
  const filteredPosts = selectedCategory === "all" 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <Head>
        <title>Blog | Toronto Home Improvement Tips & Contractor Guides | QuotexBert</title>
        <meta name="description" content="Expert Toronto home improvement tips, GTA contractor guides, and renovation advice. Get the latest insights on Toronto home projects, costs, and finding the right Ontario contractors." />
        <meta name="keywords" content="toronto home improvement, GTA renovation tips, toronto contractors, ontario home repair, toronto remodeling, GTA home maintenance" />
        <meta property="og:title" content="Blog | Toronto Home Improvement Tips & Contractor Guides" />
        <meta property="og:description" content="Expert Toronto home improvement tips, GTA contractor guides, and renovation advice from Ontario industry professionals." />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="geo.region" content="CA-ON" />
        <meta name="geo.placename" content="Toronto" />
        <meta name="geo.position" content="43.6532;-79.3832" />
        <meta name="ICBM" content="43.6532, -79.3832" />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-900 to-orange-700 bg-clip-text text-transparent mb-6 leading-tight">
              Blog
            </h1>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Expert tips, guides, and insights for Greater Toronto Area homeowners. Make informed decisions about your GTA home improvement projects with local expertise.
            </p>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-red-600 to-orange-600 text-white shadow-lg"
                    : "bg-white/80 text-slate-700 hover:bg-orange-100 border border-orange-200"
                }`}
              >
                {category === "all" ? "All Posts" : category}
              </button>
            ))}
          </div>

          {/* Blog Posts Grid */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article key={post.id} className="group">
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="bg-gradient-to-br from-white/90 to-orange-50/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      {/* Image */}
                      <div className="h-48 bg-gradient-to-br from-orange-200 to-red-200 relative overflow-hidden">
                        <img
                          src={post.imageUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop"}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=400&fit=crop";
                          }}
                        />
                        <div className="absolute inset-0 bg-black/20"></div>
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 bg-orange-600 text-white text-sm font-medium rounded-full">
                            {post.category}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h2 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-orange-700 transition-colors">
                          {post.title}
                        </h2>
                        <p className="text-slate-600 mb-4 line-clamp-3">
                          {post.excerpt}
                        </p>

                        {/* Meta info */}
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <UserIcon className="h-4 w-4 mr-1" />
                              {post.author}
                            </div>
                            <div className="flex items-center">
                              <ClockIcon className="h-4 w-4 mr-1" />
                              {post.readTime} min read
                            </div>
                          </div>
                          <div className="flex items-center">
                            <CalendarDaysIcon className="h-4 w-4 mr-1" />
                            {formatDate(post.publishedAt)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-to-r from-red-50/80 to-orange-50/80 rounded-xl p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Start Your Home Improvement Project?
            </h3>
            <p className="text-xl text-slate-600 mb-6">
              Get instant estimates and connect with verified contractors in your area
            </p>
            <Link 
              href="/"
              className="inline-block bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Get Your Free Estimate
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}