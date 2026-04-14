'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { VerifiedBadge } from '@/components/VerifiedBadge';
import { ArrowLeft, Star, CheckCircle, X, DollarSign, Clock, TrendingUp, Award, MapPin, MessageCircle } from 'lucide-react';

interface JobApplication {
  id: string;
  message: string;
  proposedPrice: string;
  estimatedDays: number;
  status: string;
  createdAt: string;
  contractor: {
    id: string;
    name: string;
    email: string;
    contractorProfile?: {
      companyName: string;
      trade: string;
      yearsExperience: number;
      city: string;
      avgRating: number;
      reviewCount: number;
      profilePhoto?: string | null;
      verified?: boolean;
    };
  };
}

interface Job {
  id: string;
  title: string;
  description: string;
  budget: string;
  category: string;
  zipCode: string;
  status: string;
  maxContractors: number;
  applications: JobApplication[];
}

type SortKey = 'price' | 'rating' | 'speed';

export default function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingApplicationId, setProcessingApplicationId] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('price');

  useEffect(() => {
    params.then(setResolvedParams);
  }, [params]);

  useEffect(() => {
    if (user && resolvedParams) {
      fetchJob();
    }
  }, [user, resolvedParams]);

  const fetchJob = async () => {
    if (!user || !resolvedParams) return;
    
    try {
      const response = await fetch(`/api/homeowner/jobs/${resolvedParams.id}?homeownerId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setJob(data);
      } else {
        console.error('Failed to fetch job');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationAction = async (applicationId: string, action: 'accept' | 'reject') => {
    if (!user || !job) return;
    
    setProcessingApplicationId(applicationId);
    
    try {
      const response = await fetch('/api/applications/manage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          applicationId,
          action,
          homeownerId: user.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Refresh the job data
        await fetchJob();
        
        if (action === 'accept') {
          // Redirect to the messaging thread (API creates one on accept)
          const redirectUrl = data.redirectUrl || `/messages?threadId=${data.threadId}`;
          router.push(redirectUrl);
        }
      } else {
        console.error(`Failed to ${action} application`);
      }
    } catch (error) {
      console.error(`Error ${action}ing application:`, error);
    } finally {
      setProcessingApplicationId(null);
    }
  };

  const getRatingStars = (rating: number) => (
    Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(rating) ? 'text-yellow-400 fill-current' : 'text-gray-200'}`} />
    ))
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-rose-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
        <Link href="/homeowner/jobs"><Button variant="secondary"><ArrowLeft className="w-4 h-4 mr-2" />Back to Jobs</Button></Link>
      </div>
    );
  }

  const pending = job.applications.filter(app => app.status === 'pending');
  const accepted = job.applications.find(app => app.status === 'accepted');

  // Compute best bids for badges
  const prices = pending.map(a => parseFloat(a.proposedPrice) || 0).filter(p => p > 0);
  const lowestPrice = prices.length > 0 ? Math.min(...prices) : null;
  const highestRating = pending.reduce((best, a) => {
    const r = a.contractor.contractorProfile?.avgRating || 0;
    return r > best ? r : best;
  }, 0);
  const fastestDays = pending.reduce((best, a) => {
    const d = a.estimatedDays || 999;
    return d < best ? d : best;
  }, 999);

  const sorted = [...pending].sort((a, b) => {
    if (sortKey === 'price') return (parseFloat(a.proposedPrice) || 0) - (parseFloat(b.proposedPrice) || 0);
    if (sortKey === 'rating') return (b.contractor.contractorProfile?.avgRating || 0) - (a.contractor.contractorProfile?.avgRating || 0);
    if (sortKey === 'speed') return (a.estimatedDays || 999) - (b.estimatedDays || 999);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Back */}
        <Link href="/homeowner/jobs" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-rose-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to My Jobs
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{job.title}</h1>
          <p className="text-gray-500 mt-1">
            {accepted ? 'You selected a contractor for this job.' : `${pending.length} contractor${pending.length !== 1 ? 's' : ''} applied â€” compare bids below`}
          </p>
        </div>

        {/* Accepted contractor */}
        {accepted && (
          <div className="mb-8 bg-green-50 border border-green-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-green-800">Contractor Selected</p>
                <p className="text-sm text-green-600">{accepted.contractor.contractorProfile?.companyName || accepted.contractor.name}</p>
              </div>
              <div className="ml-auto flex gap-2">
                <Link href={`/messages?leadId=${job.id}`}>
                  <Button size="sm">
                    <MessageCircle className="w-4 h-4 mr-1.5" />
                    Chat
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex gap-6 text-sm text-green-700">
              <span className="flex items-center gap-1"><DollarSign className="w-4 h-4" /> ${accepted.proposedPrice}</span>
              {accepted.estimatedDays && <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {accepted.estimatedDays} days</span>}
            </div>
          </div>
        )}

        {!accepted && pending.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-gray-300" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">No applications yet</h3>
            <p className="text-sm text-gray-500">Contractors will apply soon â€” check back later.</p>
          </div>
        )}

        {!accepted && pending.length > 0 && (
          <>
            {/* Sort controls */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-sm font-medium text-gray-500">Sort by:</span>
              {(['price', 'rating', 'speed'] as SortKey[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setSortKey(k)}
                  className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                    sortKey === k
                      ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-rose-300'
                  }`}
                >
                  {k === 'price' ? 'ðŸ’° Lowest Price' : k === 'rating' ? 'â­ Top Rated' : 'âš¡ Fastest'}
                </button>
              ))}
            </div>

            {/* Bid cards */}
            <div className="space-y-4">
              {sorted.map((app) => {
                const cp = app.contractor.contractorProfile;
                const price = parseFloat(app.proposedPrice) || 0;
                const isBestPrice = lowestPrice !== null && price === lowestPrice;
                const isTopRated = highestRating > 0 && cp?.avgRating === highestRating;
                const isFastest = fastestDays < 999 && app.estimatedDays === fastestDays;
                const photo = cp?.profilePhoto;
                const displayName = cp?.companyName || app.contractor.name;

                return (
                  <div
                    key={app.id}
                    className={`bg-white rounded-2xl border-2 p-5 sm:p-6 transition-all hover:shadow-md ${
                      isBestPrice ? 'border-green-400' : isTopRated ? 'border-yellow-400' : 'border-gray-100'
                    }`}
                  >
                    {/* Badges */}
                    {(isBestPrice || isTopRated || isFastest) && (
                      <div className="flex gap-2 mb-4 flex-wrap">
                        {isBestPrice && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                            <DollarSign className="w-3 h-3" /> Best Price
                          </span>
                        )}
                        {isTopRated && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                            <Award className="w-3 h-3" /> Top Rated
                          </span>
                        )}
                        {isFastest && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
                            âš¡ Fastest
                          </span>
                        )}
                      </div>
                    )}

                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        {photo ? (
                          <img src={photo} alt={displayName} className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center ring-2 ring-gray-100">
                            <span className="text-white font-bold text-sm">{displayName.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{displayName}</h3>
                            <div className="flex items-center gap-2 mt-0.5">
                              <p className="text-sm text-gray-500">{cp?.trade || 'Contractor'}</p>
                              {cp?.verified && <VerifiedBadge verified={true} size="sm" />}
                            </div>
                            {cp && (
                              <div className="flex items-center gap-1 mt-1">
                                {getRatingStars(cp.avgRating)}
                                <span className="text-xs text-gray-500 ml-1">({cp.reviewCount} reviews)</span>
                              </div>
                            )}
                            {cp?.city && (
                              <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                                <MapPin className="w-3 h-3" />{cp.city}
                              </p>
                            )}
                          </div>
                          {/* Price */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-2xl font-black text-gray-900">${parseFloat(app.proposedPrice).toLocaleString()}</p>
                            {app.estimatedDays && (
                              <p className="text-xs text-gray-500 flex items-center gap-1 justify-end mt-0.5">
                                <Clock className="w-3 h-3" /> {app.estimatedDays} days
                              </p>
                            )}
                          </div>
                        </div>

                        {app.message && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <p className="text-sm text-gray-700 leading-relaxed">{app.message}</p>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-4 flex gap-2 flex-wrap">
                          <button
                            onClick={() => handleApplicationAction(app.id, 'accept')}
                            disabled={processingApplicationId === app.id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white text-sm font-bold rounded-xl disabled:opacity-60 transition-colors shadow-sm"
                          >
                            {processingApplicationId === app.id ? (
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <CheckCircle className="w-4 h-4" />
                            )}
                            {processingApplicationId === app.id ? 'Acceptingâ€¦' : 'Accept & Chat'}
                          </button>

                          <button
                            onClick={() => handleApplicationAction(app.id, 'reject')}
                            disabled={processingApplicationId === app.id}
                            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl disabled:opacity-60 transition-colors"
                          >
                            <X className="w-4 h-4" /> Decline
                          </button>

                          <Link href={`/contractor/${app.contractor.id}/portfolio`}
                            className="flex items-center gap-1.5 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold rounded-xl transition-colors"
                          >
                            View Portfolio
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
