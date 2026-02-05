"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  CalendarDaysIcon,
  TagIcon
} from "@heroicons/react/24/outline";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  author: string;
  publishedAt: string;
  status: "draft" | "published" | "scheduled";
  category: string;
  tags: string[];
  views: number;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

  // Sample blog posts for admin - Toronto focused
  const samplePosts: BlogPost[] = [
    {
      id: "1",
      title: "10 Home Renovation Projects That Add the Most Value in Toronto 2025",
      slug: "home-renovation-projects-add-value-toronto-2025",
      excerpt: "Discover which home improvement projects offer the best ROI for Toronto homeowners in the GTA market.",
      author: "Sarah Johnson",
      publishedAt: "2025-01-15",
      status: "published",
      category: "Home Value",
      tags: ["toronto renovation", "GTA", "home value"],
      views: 1247
    },
    {
      id: "2",
      title: "How to Choose the Right Contractor in Toronto: Complete GTA Guide",
      slug: "choose-contractor-toronto-gta-guide",
      excerpt: "Finding a reliable contractor in the Greater Toronto Area. Covers licensing, WSIB, and Tarion warranties.",
      author: "Mike Rodriguez",
      publishedAt: "2025-01-10",
      status: "published",
      category: "Contractor Tips",
      tags: ["toronto contractors", "GTA", "WSIB"],
      views: 892
    },
    {
      id: "3",
      title: "Kitchen Remodel Costs in Toronto: 2025 GTA Pricing Guide",
      slug: "kitchen-remodel-costs-toronto-gta-2025",
      excerpt: "Planning a kitchen renovation in Toronto? Get detailed GTA cost breakdowns including permits and labor rates.",
      author: "Jennifer Smith",
      publishedAt: "2025-01-05",
      status: "published",
      category: "Kitchen",
      tags: ["toronto kitchen", "GTA renovation", "ontario permits"],
      views: 634
    },
    {
      id: "4",
      title: "Toronto Winter Home Preparation Checklist 2025",
      slug: "toronto-winter-home-preparation-2025",
      excerpt: "Prepare your GTA home for harsh Ontario winters with this comprehensive Toronto-specific checklist.",
      author: "David Chen",
      publishedAt: "2025-02-01",
      status: "draft",
      category: "Maintenance",
      tags: ["toronto winter", "GTA maintenance", "ontario"],
      views: 0
    }
  ];

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setPosts(samplePosts);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPosts = posts.filter(post => {
    if (filter === "all") return true;
    return post.status === filter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "scheduled":
        return "bg-rose-100 text-rose-900";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-50">
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-900 to-orange-700 bg-clip-text text-transparent mb-2">
              Blog Management
            </h1>
            <p className="text-xl text-slate-600">
              Create and manage blog posts for SEO and customer engagement
            </p>
          </div>
          <button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center">
            <PlusIcon className="h-5 w-5 mr-2" />
            New Post
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-50/80 to-blue-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-rose-700 text-sm font-medium">Total Posts</h3>
            <p className="text-3xl font-bold text-rose-950">{posts.length}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50/80 to-green-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-green-600 text-sm font-medium">Published</h3>
            <p className="text-3xl font-bold text-green-900">
              {posts.filter(p => p.status === "published").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-yellow-50/80 to-yellow-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-yellow-600 text-sm font-medium">Drafts</h3>
            <p className="text-3xl font-bold text-yellow-900">
              {posts.filter(p => p.status === "draft").length}
            </p>
          </div>
          <div className="bg-gradient-to-br from-rose-50/80 to-rose-100/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
            <h3 className="text-rose-700 text-sm font-medium">Total Views</h3>
            <p className="text-3xl font-bold text-rose-950">
              {posts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex space-x-4 mb-8">
          {["all", "published", "draft"].map((filterType) => (
            <button
              key={filterType}
              onClick={() => setFilter(filterType as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterType
                  ? "bg-orange-600 text-white"
                  : "bg-white/80 text-slate-700 hover:bg-orange-100"
              }`}
            >
              {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              {filterType !== "all" && (
                <span className="ml-2 px-2 py-1 bg-white/20 rounded-full text-xs">
                  {posts.filter(p => p.status === filterType).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Posts Table */}
        <div className="bg-gradient-to-br from-white/90 to-orange-50/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-100/80">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-slate-800">Title</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-800">Author</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-800">Status</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-800">Category</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-800">Views</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-800">Date</th>
                  <th className="px-6 py-4 text-left font-semibold text-slate-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4">
                      <div>
                        <h3 className="font-semibold text-slate-900 mb-1">
                          {post.title}
                        </h3>
                        <p className="text-sm text-slate-600 line-clamp-2">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center mt-2 space-x-2">
                          {post.tags.slice(0, 2).map(tag => (
                            <span 
                              key={tag}
                              className="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full"
                            >
                              <TagIcon className="h-3 w-3 mr-1" />
                              {tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="text-xs text-slate-500">
                              +{post.tags.length - 2} more
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {post.author}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(post.status)}`}>
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {post.category}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      {post.views.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-700">
                      <div className="flex items-center">
                        <CalendarDaysIcon className="h-4 w-4 mr-2" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Link 
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-rose-700 hover:text-rose-900 hover:bg-rose-100 rounded-lg transition-colors"
                          title="View Post"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                        <button 
                          className="p-2 text-orange-600 hover:text-orange-700 hover:bg-orange-100 rounded-lg transition-colors"
                          title="Edit Post"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button 
                          className="p-2 text-red-600 hover:text-red-700 hover:bg-red-100 rounded-lg transition-colors"
                          title="Delete Post"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SEO Tips */}
        <div className="mt-12 bg-gradient-to-br from-blue-50/80 to-orange-50/80 backdrop-blur-sm rounded-xl p-8 shadow-lg">
          <h3 className="text-2xl font-semibold text-slate-900 mb-6">SEO Best Practices for Your Blog</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Content Optimization</h4>
              <ul className="space-y-2 text-slate-600">
                <li>• Target long-tail keywords (e.g., "kitchen renovation costs 2025")</li>
                <li>• Write compelling meta descriptions (150-160 characters)</li>
                <li>• Use H1, H2, H3 tags for structure</li>
                <li>• Include internal links to service pages</li>
                <li>• Add alt text to all images</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Technical SEO</h4>
              <ul className="space-y-2 text-slate-600">
                <li>• Ensure fast loading times (&lt;3 seconds)</li>
                <li>• Optimize for mobile responsiveness</li>
                <li>• Add structured data (JSON-LD)</li>
                <li>• Create XML sitemap</li>
                <li>• Enable social media sharing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

