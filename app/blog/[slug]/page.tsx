"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Head from "next/head";
import { 
  CalendarDaysIcon, 
  ClockIcon, 
  UserIcon, 
  ShareIcon,
  ArrowLeftIcon 
} from "@heroicons/react/24/outline";

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

export default function BlogPostPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Sample blog posts data (in real app, this would come from API/CMS)
  const blogPosts: BlogPost[] = [
    {
      id: "1",
      title: "10 Home Renovation Projects That Add the Most Value in Toronto 2025",
      slug: "home-renovation-projects-add-value-toronto-2025",
      excerpt: "Discover which home improvement projects offer the best ROI for Toronto homeowners.",
      content: `
        <div class="prose prose-lg max-w-none">
          <p>When it comes to home improvement in the Greater Toronto Area, not all projects are created equal. Some renovations can significantly boost your home's value in Toronto's competitive real estate market, while others might not provide the return on investment you're hoping for.</p>
          
          <h2>Top Value-Adding Renovations for Toronto Homes</h2>
          
          <h3>1. Kitchen Remodel (ROI: 75-85% in GTA)</h3>
          <p>A well-planned kitchen renovation consistently ranks as one of the best investments for Toronto homeowners. In the GTA market, focus on:</p>
          <ul>
            <li>Updated appliances with energy-efficient models (important for Toronto Hydro savings)</li>
            <li>Quality countertops (quartz or granite - popular in Toronto's luxury market)</li>
            <li>Modern cabinetry with soft-close doors</li>
            <li>Improved lighting and electrical outlets (up to Ontario electrical code)</li>
          </ul>
          
          <h3>2. Bathroom Addition/Renovation (ROI: 60-80% in Toronto)</h3>
          <p>Adding a bathroom or updating an existing one can significantly increase your home's appeal in Toronto's market, especially in older GTA homes with limited bathrooms. Ensure all work meets Ontario Building Code requirements.</p>
          
          <h3>3. Deck/Patio Addition (ROI: 65-75% in GTA)</h3>
          <p>Outdoor living spaces have become increasingly valuable in Toronto, especially post-2020. A well-built deck extends your living space during Toronto's short summers and appeals to GTA buyers. Consider composite materials for Toronto's harsh winters.</p>
          
          <h3>4. Energy-Efficient Windows (ROI: 70-80% in Ontario)</h3>
          <p>New windows improve energy efficiency during Toronto's cold winters, reduce noise from busy GTA streets, and enhance curb appeal. Look for Energy Star certified options and take advantage of Ontario energy rebates.</p>
          
          <h3>5. Hardwood Floor Refinishing (ROI: 80-90% in Toronto)</h3>
          <p>One of the highest ROI projects for Toronto homes, refinishing existing hardwood floors is cost-effective and dramatically improves aesthetics. Original hardwood is highly valued in Toronto's heritage homes.</p>
          
          <h2>Planning Your Toronto Renovation</h2>
          
          <p>Before starting any project in the GTA:</p>
          <ol>
            <li>Research Toronto/GTA market trends and neighborhood values</li>
            <li>Get multiple quotes from licensed Ontario contractors</li>
            <li>Check if you need City of Toronto building permits</li>
            <li>Consider your timeline for selling in Toronto's seasonal market</li>
            <li>Focus on universal appeal over personal taste for GTA buyers</li>
          </ol>
          
          <h2>Finding the Right Toronto Contractor</h2>
          
          <p>The success of your renovation largely depends on choosing the right GTA contractor. Use platforms like QuotexBert to:</p>
          <ul>
            <li>Compare multiple quotes from verified Toronto-area contractors</li>
            <li>Read verified reviews from other GTA homeowners</li>
            <li>Check contractor credentials (WSIB, Tarion warranty, Ontario licensing)</li>
            <li>Get detailed project estimates with Toronto permit costs included</li>
          </ul>
          
          <p>Remember, the cheapest option isn't always the best in Toronto's market. Look for contractors with proper Ontario licensing, WSIB coverage, and a track record of quality work in the GTA.</p>
          
          <h2>Toronto-Specific Considerations</h2>
          
          <p>When renovating in Toronto, consider these local factors:</p>
          <ul>
            <li><strong>Climate:</strong> Choose materials that withstand Toronto's freeze-thaw cycles</li>
            <li><strong>Heritage Homes:</strong> Many Toronto neighborhoods have heritage restrictions</li>
            <li><strong>Permits:</strong> City of Toronto has specific permitting requirements</li>
            <li><strong>Timing:</strong> Plan around Toronto's construction season (April-October)</li>
            <li><strong>Resale Market:</strong> Focus on features that appeal to Toronto buyers</li>
          </ul>
        </div>
      `,
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
      content: `
        <div class="prose prose-lg max-w-none">
          <p>Choosing the right contractor in the Greater Toronto Area can make or break your home improvement project. A good GTA contractor will deliver quality work on time and within budget, while a poor choice can lead to delays, cost overruns, and subpar results in Toronto's competitive market.</p>
          
          <h2>Step 1: Research Toronto-Area Contractors</h2>
          
          <h3>Start with Your GTA Network</h3>
          <ul>
            <li>Ask friends, family, and neighbors in Toronto for referrals</li>
            <li>Check with local GTA hardware stores like Home Depot, Rona, or independent suppliers</li>
            <li>Consult Toronto real estate agents who see various contractor work across the GTA</li>
            <li>Ask in Toronto neighborhood Facebook groups and NextDoor</li>
          </ul>
          
          <h3>Online Research for GTA Contractors</h3>
          <ul>
            <li>Use platforms like QuotexBert for verified Toronto contractor listings</li>
            <li>Check Better Business Bureau ratings (Toronto office)</li>
            <li>Read Google and Yelp reviews, focusing on GTA projects</li>
            <li>Look at contractor websites and Toronto-area portfolios</li>
            <li>Check HomeStars.com (popular in Toronto market)</li>
          </ul>
          
          <h2>Step 2: Verify Ontario/Toronto Credentials</h2>
          
          <h3>Essential Documentation for GTA Contractors</h3>
          <ul>
            <li><strong>Ontario License:</strong> Verify licensing with Technical Standards and Safety Authority (TSSA) for electrical/gas work</li>
            <li><strong>WSIB Coverage:</strong> All legitimate Ontario contractors must have Workplace Safety Insurance Board coverage</li>
            <li><strong>Liability Insurance:</strong> Request current certificates (minimum $2M recommended in GTA)</li>
            <li><strong>Tarion Warranty:</strong> For major renovations, ensure contractor is Tarion registered</li>
            <li><strong>City of Toronto Business License:</strong> Required for contractors working in Toronto</li>
          </ul>
          
          <h3>Red Flags to Avoid in Toronto</h3>
          <ul>
            <li>Door-to-door solicitation (common scam in Toronto suburbs)</li>
            <li>Requests for full payment upfront (illegal in Ontario for amounts over $100)</li>
            <li>No written contracts or estimates</li>
            <li>Pressure to sign immediately</li>
            <li>Significantly lower bids than other GTA contractors</li>
            <li>No fixed Toronto address or Ontario phone number</li>
          </ul>
          
          <h2>Step 3: The Toronto Contractor Interview</h2>
          
          <h3>Essential Questions for GTA Contractors</h3>
          <ol>
            <li>How long have you been working in the Toronto area?</li>
            <li>Can you provide references from recent GTA projects?</li>
            <li>Are you familiar with City of Toronto permit requirements?</li>
            <li>What's your typical project timeline during Toronto construction season?</li>
            <li>How do you handle Toronto's strict noise bylaws?</li>
            <li>Who will supervise the work daily in Toronto?</li>
            <li>Do you have experience with Toronto's heritage home restrictions?</li>
          </ol>
          
          <h2>Step 4: Compare Toronto Contractor Bids</h2>
          
          <p>Get at least three detailed written estimates from GTA contractors that include:</p>
          <ul>
            <li>Material specifications and quantities (with Toronto supplier costs)</li>
            <li>Labor costs and realistic Toronto timeline</li>
            <li>City of Toronto permit costs and application fees</li>
            <li>Disposal fees (Toronto waste management requirements)</li>
            <li>Payment schedule (compliant with Ontario Consumer Protection Act)</li>
            <li>Change order procedures</li>
            <li>Winter weather contingencies (important in Toronto)</li>
          </ul>
          
          <h2>Toronto Building Permits and Regulations</h2>
          
          <p>Ensure your GTA contractor understands:</p>
          <ul>
            <li>City of Toronto building permit requirements</li>
            <li>Ontario Building Code compliance</li>
            <li>Heritage property restrictions (common in Toronto neighborhoods)</li>
            <li>Noise bylaws (7 AM - 8 PM weekdays, 9 AM - 8 PM weekends)</li>
            <li>Parking and street occupancy permits</li>
          </ul>
          
          <h2>Using QuotexBert for Toronto Contractor Selection</h2>
          
          <p>Our platform streamlines the GTA contractor selection process by:</p>
          <ul>
            <li>Pre-screening contractors for Ontario licensing and WSIB coverage</li>
            <li>Providing verified customer reviews from Toronto homeowners</li>
            <li>Offering instant quote comparisons from multiple GTA contractors</li>
            <li>Facilitating secure communication and payments</li>
            <li>Ensuring contractors understand Toronto permit requirements</li>
          </ul>
          
          <h2>Seasonal Considerations for Toronto Projects</h2>
          
          <p>When hiring contractors in the GTA, consider Toronto's seasonal factors:</p>
          <ul>
            <li><strong>Peak Season:</strong> April-October (higher prices, longer waits)</li>
            <li><strong>Winter Work:</strong> Limited outdoor projects, heating costs</li>
            <li><strong>Spring Rush:</strong> Book early for popular contractors</li>
            <li><strong>Fall Completion:</strong> Ideal for winter-proofing projects</li>
          </ul>
          
          <p>Remember: the goal isn't just finding the cheapest Toronto contractor, but finding the best value – quality work at a fair price from a reliable GTA professional who understands local requirements.</p>
        </div>
      `,
      author: "Mike Rodriguez",
      publishedAt: "2025-01-10",
      readTime: 12,
      category: "Contractor Tips",
      tags: ["toronto contractors", "GTA", "WSIB", "ontario licensing", "tarion"],
      imageUrl: "/blog/toronto-contractors.jpg",
      seoTitle: "How to Choose Toronto Contractors 2025 | GTA Hiring Guide",
      seoDescription: "Find reliable contractors in Toronto & GTA. Learn about Ontario licensing, WSIB, Tarion warranties, and avoiding contractor scams in the Toronto area."
    }
  ];

  useEffect(() => {
    const slug = params.slug as string;
    
    // Find the post by slug
    const foundPost = blogPosts.find(p => p.slug === slug);
    
    if (foundPost) {
      setPost(foundPost);
      
      // Get related posts from same category
      const related = blogPosts
        .filter(p => p.category === foundPost.category && p.id !== foundPost.id)
        .slice(0, 2);
      setRelatedPosts(related);
    }
    
    setLoading(false);
  }, [params.slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const sharePost = () => {
    if (navigator.share && post) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else if (post) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Post Not Found</h1>
            <p className="text-slate-600 mb-8">The blog post you're looking for doesn't exist.</p>
            <Link 
              href="/blog"
              className="inline-flex items-center bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-lg font-medium hover:from-red-700 hover:to-orange-700 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{post.seoTitle || post.title}</title>
        <meta name="description" content={post.seoDescription || post.excerpt} />
        <meta name="keywords" content={post.tags.join(', ')} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:author" content={post.author} />
        <meta property="article:published_time" content={post.publishedAt} />
        <meta property="article:section" content={post.category} />
        {post.tags.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
        <meta name="twitter:card" content="summary_large_image" />
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              "headline": post.title,
              "description": post.excerpt,
              "author": {
                "@type": "Person",
                "name": post.author
              },
              "datePublished": post.publishedAt,
              "dateModified": post.publishedAt,
              "publisher": {
                "@type": "Organization",
                "name": "QuoteXbert",
                "logo": {
                  "@type": "ImageObject",
                  "url": "/logo.svg"
                }
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": window.location.href
              }
            })
          }}
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-red-50">
        <div className="max-w-4xl mx-auto px-4 py-16">
          {/* Back to Blog */}
          <Link 
            href="/blog"
            className="inline-flex items-center text-orange-600 hover:text-orange-700 mb-8 font-medium"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Blog
          </Link>

          {/* Article Header */}
          <article className="bg-gradient-to-br from-white/90 to-orange-50/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
            {/* Hero Image */}
            <div className="h-64 bg-gradient-to-br from-orange-200 to-red-200 relative overflow-hidden">
              <img
                src={post.imageUrl || "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=500&fit=crop"}
                alt={post.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=500&fit=crop";
                }}
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute bottom-6 left-6">
                <span className="px-4 py-2 bg-orange-600 text-white font-medium rounded-full">
                  {post.category}
                </span>
              </div>
            </div>

            <div className="p-8">
              {/* Title and Meta */}
              <header className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center justify-between gap-4 text-slate-600">
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 mr-2" />
                      <span className="font-medium">{post.author}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDaysIcon className="h-5 w-5 mr-2" />
                      {formatDate(post.publishedAt)}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-5 w-5 mr-2" />
                      {post.readTime} min read
                    </div>
                  </div>
                  
                  <button
                    onClick={sharePost}
                    className="flex items-center text-orange-600 hover:text-orange-700 font-medium"
                  >
                    <ShareIcon className="h-5 w-5 mr-2" />
                    Share
                  </button>
                </div>
              </header>

              {/* Content */}
              <div 
                className="prose prose-lg max-w-none prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-orange-600 prose-strong:text-slate-900"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Author Note / Human Guidance */}
              <div className="mt-10 p-5 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="text-sm text-slate-800 font-semibold mb-1">
                  A quick note from our Toronto team
                </p>
                <p className="text-sm text-slate-700 mb-2">
                  Every project and street in the GTA is slightly different. Use this article as
                  a practical starting point, then speak with at least two licensed local contractors
                  before locking in a budget or timeline.
                </p>
                <p className="text-xs text-slate-500">
                  We update these guides regularly based on real projects posted through QuoteXbert
                  in Toronto, Durham, Peel, and York Region.
                </p>
              </div>

              {/* Tags */}
              <div className="mt-12 pt-8 border-t border-slate-200">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </article>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Posts</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost.id} 
                    href={`/blog/${relatedPost.slug}`}
                    className="group block"
                  >
                    <div className="bg-gradient-to-br from-white/90 to-orange-50/90 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                      <span className="inline-block px-3 py-1 bg-orange-600 text-white text-sm font-medium rounded-full mb-3">
                        {relatedPost.category}
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-orange-700 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-slate-600 text-sm">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="mt-16 bg-gradient-to-r from-red-50/80 to-orange-50/80 rounded-xl p-8 text-center shadow-lg">
            <h3 className="text-2xl font-bold text-slate-900 mb-4">
              Ready to Start Your Project?
            </h3>
            <p className="text-slate-600 mb-6">
              Get instant estimates from verified contractors in your area
            </p>
            <Link 
              href="/"
              className="inline-block bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Get Free Estimate
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}