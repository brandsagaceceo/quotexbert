'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ReviewDisplay } from '@/components/ReviewDisplay';
import { ArrowLeft, Calendar, MapPin, DollarSign, Clock, Star, Phone, Mail, Globe } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  caption: string;
  projectType: string;
  beforeImages: string[];
  afterImages: string[];
  projectCost: string;
  duration: string;
  materials: string;
  location: string;
  clientStory: string;
  tags: string[];
  isPublic: boolean;
  isPinned: boolean;
  createdAt: string;
}

interface ContractorProfile {
  id: string;
  companyName: string;
  trade: string;
  bio: string;
  city: string;
  phone: string;
  website: string;
  avgRating: number;
  reviewCount: number;
  verified: boolean;
  user: {
    name: string;
    email: string;
  };
}

export default function PublicContractorPortfolioPage({ params }: { params: Promise<{ id: string }> }) {
  const [contractor, setContractor] = useState<ContractorProfile | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (resolvedParams) {
      fetchContractorData();
    }
  }, [resolvedParams]);

  const fetchContractorData = async () => {
    if (!resolvedParams) return;
    
    try {
      // Fetch contractor profile
      const profileResponse = await fetch(`/api/contractors/profile?userId=${resolvedParams.id}`);
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setContractor(profileData);
      }

      // Fetch public portfolio items
      const portfolioResponse = await fetch(`/api/contractors/portfolio?contractorId=${resolvedParams.id}`);
      if (portfolioResponse.ok) {
        const portfolioData = await portfolioResponse.json();
        // Filter for public items only
        setPortfolioItems(portfolioData.filter((item: PortfolioItem) => item.isPublic));
      }
    } catch (error) {
      console.error('Error fetching contractor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p>Loading contractor profile...</p>
        </div>
      </div>
    );
  }

  if (!contractor) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Contractor Not Found</h1>
          <Button onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-6">
        <Button variant="secondary" size="sm" onClick={() => window.history.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Contractor Header */}
      <Card className="mb-8">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{contractor.companyName}</h1>
                {contractor.verified && (
                  <Badge variant="success" size="sm">Verified</Badge>
                )}
              </div>
              
              <p className="text-xl text-gray-600 mb-2">{contractor.trade} • {contractor.city}</p>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-1">
                  {getRatingStars(contractor.avgRating)}
                  <span className="ml-2 text-gray-600">
                    {contractor.avgRating}/5 ({contractor.reviewCount} reviews)
                  </span>
                </div>
              </div>

              {contractor.bio && (
                <p className="text-gray-700 max-w-2xl">{contractor.bio}</p>
              )}
            </div>

            <div className="flex flex-col space-y-3">
              {contractor.phone && (
                <Button variant="secondary" size="sm">
                  <Phone className="w-4 h-4 mr-2" />
                  {contractor.phone}
                </Button>
              )}
              <Button variant="secondary" size="sm">
                <Mail className="w-4 h-4 mr-2" />
                Contact
              </Button>
              {contractor.website && (
                <Button variant="secondary" size="sm">
                  <Globe className="w-4 h-4 mr-2" />
                  Website
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Recent Work</h2>
        <p className="text-gray-600">
          See examples of {contractor.companyName}'s completed projects
        </p>
      </div>

      {portfolioItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No public portfolio yet</h3>
            <p className="text-gray-600">
              This contractor hasn't shared any portfolio items yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {portfolioItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <Badge variant="secondary" size="sm" className="mb-2">{item.projectType}</Badge>
                    <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
                    {item.caption && (
                      <p className="text-gray-600 mt-1">{item.caption}</p>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                {/* Project Images Placeholder */}
                <div className="bg-gray-200 rounded-lg h-48 mb-4 flex items-center justify-center">
                  <p className="text-gray-500">Project Photos</p>
                </div>

                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  {item.duration && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{item.duration}</span>
                    </div>
                  )}
                  {item.projectCost && (
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span>${item.projectCost}</span>
                    </div>
                  )}
                  {item.location && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span>{item.location}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span>{formatDate(item.createdAt)}</span>
                  </div>
                </div>

                {/* Description */}
                {item.description && (
                  <div className="mb-4">
                    <p className="text-gray-700 text-sm">{item.description}</p>
                  </div>
                )}

                {/* Tags */}
                {item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Client Story */}
                {item.clientStory && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 mb-1 text-sm">Client Feedback</h4>
                    <p className="text-gray-700 text-sm italic">"{item.clientStory}"</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Reviews Section */}
      <div className="mt-12">
        <ReviewDisplay contractorId={contractor.id} maxReviews={5} />
      </div>
    </div>
  );
}