'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircle, 
  Briefcase, 
  Filter, 
  CreditCard, 
  Users,
  DollarSign,
  Palette,
  Search,
  Lock,
  Globe
} from 'lucide-react';

export default function ShowcasePage() {
  const [activeFeature, setActiveFeature] = useState('overview');

  const features = [
    {
      id: 'overview',
      title: 'Platform Overview',
      icon: <Globe className="w-6 h-6" />,
      description: 'Complete job marketplace transformation'
    },
    {
      id: 'theming',
      title: 'Color Scheme',
      icon: <Palette className="w-6 h-6" />,
      description: 'Burgundy/orange theme across entire platform'
    },
    {
      id: 'jobs',
      title: 'Job System',
      icon: <Briefcase className="w-6 h-6" />,
      description: '106+ comprehensive leads across all categories'
    },
    {
      id: 'filtering',
      title: 'Advanced Filtering',
      icon: <Filter className="w-6 h-6" />,
      description: 'Search by category, budget, location, keywords'
    },
    {
      id: 'subscriptions',
      title: 'Subscription Model',
      icon: <CreditCard className="w-6 h-6" />,
      description: 'Category-based access control system'
    },
    {
      id: 'profiles',
      title: 'Working Profiles',
      icon: <Users className="w-6 h-6" />,
      description: 'Complete contractor and homeowner profiles'
    }
  ];

  const stats = [
    { label: 'Job Leads Created', value: '106+', color: 'blue' },
    { label: 'Categories Covered', value: '70+', color: 'green' },
    { label: 'Files Updated', value: '25+', color: 'purple' },
    { label: 'Features Built', value: '15+', color: 'orange' }
  ];

  const accomplishments = [
    {
      category: 'Visual Design',
      items: [
        'Complete color scheme migration from teal/blue to burgundy/orange',
        'Updated 15+ component files with consistent theming',
        'Modern gradient backgrounds and hover effects',
        'Responsive design improvements'
      ]
    },
    {
      category: 'Job Management',
      items: [
        '106 comprehensive job leads across all categories',
        'Advanced filtering system (search, category, budget, location)',
        'Subscription-based access control',
        'Job application workflow with validation'
      ]
    },
    {
      category: 'User Experience',
      items: [
        'Working profile system for contractors and homeowners',
        'Demo authentication with role switching',
        'Subscription management interface',
        'Error handling and loading states'
      ]
    },
    {
      category: 'Technical Improvements',
      items: [
        'TypeScript error fixes and code cleanup',
        'Prisma schema validation and database integrity',
        'API endpoint enhancements',
        'Component optimization and reusability'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">QuoteXpert Platform Showcase</h1>
              <p className="text-gray-600">Complete job marketplace transformation</p>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/sign-in"
                className="bg-gradient-to-r from-orange-600 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-700 hover:to-red-700 transition-all"
              >
                Sign In
              </Link>
              <Link 
                href="/contractor/jobs"
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                View Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className={`text-3xl font-bold mb-2 ${
                stat.color === 'blue' ? 'text-rose-700' :
                stat.color === 'green' ? 'text-green-600' :
                stat.color === 'purple' ? 'text-purple-600' :
                'text-orange-600'
              }`}>
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Navigation */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Feature Explorer</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {features.map((feature) => (
              <button
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  activeFeature === feature.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-gray-200 hover:border-orange-300 hover:bg-orange-25'
                }`}
              >
                <div className={`mb-2 ${
                  activeFeature === feature.id ? 'text-orange-600' : 'text-gray-600'
                }`}>
                  {feature.icon}
                </div>
                <div className="text-sm font-medium text-gray-900">{feature.title}</div>
                <div className="text-xs text-gray-500 mt-1">{feature.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Feature Details */}
        <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-100 mb-8">
          {activeFeature === 'overview' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">What We've Built</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Complete visual rebrand with burgundy/orange theme</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">106+ comprehensive job leads across all categories</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Advanced job filtering and search system</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Subscription-based access control</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Working profile system with demo data</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                      <div className="font-medium text-gray-900">View All Jobs</div>
                      <div className="text-sm text-gray-600 mt-1">Contractors can browse all 106+ leads without restrictions</div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg">
                      <div className="font-medium text-gray-900">Apply with Subscription</div>
                      <div className="text-sm text-gray-600 mt-1">Job applications require category-specific subscriptions</div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                      <div className="font-medium text-gray-900">Advanced Filtering</div>
                      <div className="text-sm text-gray-600 mt-1">Search by location, budget, category, and keywords</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'theming' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Color Scheme Transformation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Before & After</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-gray-100 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">Previous: Teal & Blue</div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-teal-500 rounded"></div>
                        <div className="w-8 h-8 bg-rose-700 rounded"></div>
                        <div className="w-8 h-8 bg-cyan-500 rounded"></div>
                      </div>
                    </div>
                    <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg">
                      <div className="font-medium text-gray-900 mb-2">Current: Burgundy & Orange</div>
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-orange-600 rounded"></div>
                        <div className="w-8 h-8 bg-red-600 rounded"></div>
                        <div className="w-8 h-8 bg-red-700 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Files Updated</h4>
                  <ul className="text-sm space-y-2 text-gray-700">
                    <li>• Homepage components</li>
                    <li>• Affiliates page</li>
                    <li>• Contact page</li>
                    <li>• Input components</li>
                    <li>• VoiceRecorder</li>
                    <li>• ImageUploader</li>
                    <li>• Auth pages</li>
                    <li>• And 8+ more files</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'jobs' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Comprehensive Job System</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-rose-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-rose-950 mb-3">106+ Job Leads</h4>
                  <p className="text-rose-900 text-sm">Comprehensive leads across all 70+ categories including appliances, construction, electrical, HVAC, plumbing, and more.</p>
                </div>
                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-3">Realistic Data</h4>
                  <p className="text-green-700 text-sm">Authentic job descriptions, budget ranges ($300-$2000+), and Canadian postal codes for genuine marketplace feel.</p>
                </div>
                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-3">Geographic Distribution</h4>
                  <p className="text-purple-700 text-sm">Jobs spread across major Canadian cities including Toronto, Vancouver, Calgary, Montreal, and more.</p>
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'filtering' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Advanced Filtering System</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Filter Options</h4>
                  <div className="space-y-3">
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Search className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-gray-900">Text Search - Keywords in title/description</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Filter className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-gray-900">Category Filter - All 70+ categories</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <DollarSign className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-gray-900">Budget Range - Min/Max filtering</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-gray-600 mr-3" />
                      <span className="text-gray-900">Location - Postal code search</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">User Experience</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Real-time filtering with instant results</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Collapsible filter panel for clean UI</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Clear filters option for easy reset</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Results counter showing filtered jobs</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'subscriptions' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Subscription-Based Access Control</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">How It Works</h4>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-rose-700 font-semibold text-sm">1</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">View All Jobs</div>
                        <div className="text-sm text-gray-600">Contractors can browse all 106+ leads without restrictions</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-orange-600 font-semibold text-sm">2</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Subscription Required</div>
                        <div className="text-sm text-gray-600">Apply button disabled for non-subscribed categories</div>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-green-600 font-semibold text-sm">3</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">Easy Subscribe</div>
                        <div className="text-sm text-gray-600">Direct links to subscribe to specific categories</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Visual Indicators</h4>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-green-900">Subscribed Category</span>
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <button className="mt-2 bg-green-600 text-white px-4 py-2 rounded text-sm">
                        Apply for Job
                      </button>
                    </div>
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-gray-700">Non-subscribed Category</span>
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                      <button className="mt-2 bg-gray-400 text-white px-4 py-2 rounded text-sm opacity-50 cursor-not-allowed">
                        Subscription Required
                      </button>
                      <Link href="/contractor/subscriptions" className="block mt-1 text-xs text-rose-700 hover:underline">
                        Subscribe to this category
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeFeature === 'profiles' && (
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Working Profile System</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Profile Features</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Complete contractor and homeowner profiles</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Demo authentication with role switching</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Profile data persistence and validation</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">Error handling and loading states</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Demo Users</h4>
                  <div className="space-y-3">
                    <div className="p-3 bg-rose-50 rounded-lg">
                      <div className="font-medium text-rose-950">Demo Homeowner</div>
                      <div className="text-sm text-rose-900">Complete homeowner profile with city and contact info</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-900">Demo Contractor</div>
                      <div className="text-sm text-green-700">Full contractor profile with company details and trade info</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="font-medium text-purple-900">Test Contractors</div>
                      <div className="text-sm text-purple-700">3 additional contractors: plumbing, electrical, painting</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Accomplishments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {accomplishments.map((section, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">{section.category}</h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Explore?</h2>
          <p className="text-orange-100 mb-6">Experience the complete job marketplace with all features working seamlessly</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/sign-in"
              className="bg-white text-orange-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Sign In
            </Link>
            <Link 
              href="/contractor/jobs"
              className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:bg-opacity-10 transition-colors"
            >
              Browse Jobs
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}