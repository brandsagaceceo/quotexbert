'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ArrowLeft, User, Clock, DollarSign, MessageCircle, CheckCircle, X, Star } from 'lucide-react';

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

export default function JobApplicationsPage({ params }: { params: Promise<{ id: string }> }) {
  const { user } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [processingApplicationId, setProcessingApplicationId] = useState<string | null>(null);
  const [resolvedParams, setResolvedParams] = useState<{ id: string } | null>(null);

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
        // Refresh the job data
        await fetchJob();
        
        if (action === 'accept') {
          // Redirect to chat with the selected contractor
          router.push(`/homeowner/jobs/${job.id}/chat`);
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

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
          <Link href="/homeowner/jobs">
            <Button variant="secondary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Jobs
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const pendingApplications = job.applications.filter(app => app.status === 'pending');
  const acceptedApplication = job.applications.find(app => app.status === 'accepted');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/homeowner/jobs">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Job Details */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h1 className="text-xl font-bold">{job.title}</h1>
              <Badge variant={job.status === 'assigned' ? 'success' : 'default'}>
                {job.status === 'assigned' ? 'Contractor Selected' : 'Reviewing Applications'}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                  <p className="text-gray-600">{job.description}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Budget:</span>
                    <p className="text-gray-600">${job.budget}</p>
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>
                    <p className="text-gray-600">{job.category}</p>
                  </div>
                  <div>
                    <span className="font-medium">Location:</span>
                    <p className="text-gray-600">{job.zipCode}</p>
                  </div>
                  <div>
                    <span className="font-medium">Applications:</span>
                    <p className="text-gray-600">{job.applications.length}/{job.maxContractors}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications */}
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {acceptedApplication ? 'Selected Contractor' : 'Contractor Applications'}
            </h2>
            <p className="text-gray-600 mt-1">
              {acceptedApplication 
                ? 'You have selected a contractor for this job'
                : `Review and select from ${pendingApplications.length} applications`
              }
            </p>
          </div>

          {acceptedApplication && (
            <div className="mb-8">
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {acceptedApplication.contractor.contractorProfile?.companyName || acceptedApplication.contractor.name}
                        </h3>
                        <p className="text-sm text-gray-600">{acceptedApplication.contractor.contractorProfile?.trade}</p>
                        {acceptedApplication.contractor.contractorProfile && (
                          <div className="flex items-center space-x-1 mt-1">
                            {getRatingStars(acceptedApplication.contractor.contractorProfile.avgRating)}
                            <span className="text-sm text-gray-600 ml-1">
                              ({acceptedApplication.contractor.contractorProfile.reviewCount} reviews)
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <Badge variant="success">Selected</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="font-medium">${acceptedApplication.proposedPrice}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{acceptedApplication.estimatedDays} days estimated</span>
                    </div>
                  </div>
                  
                  {acceptedApplication.message && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
                      <p className="text-gray-600 text-sm bg-white p-3 rounded-lg border">
                        {acceptedApplication.message}
                      </p>
                    </div>
                  )}

                  <Link href={`/homeowner/jobs/${job.id}/chat`}>
                    <Button>
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat with Contractor
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          )}

          {!acceptedApplication && pendingApplications.length === 0 && (
            <Card>
              <CardContent className="text-center py-8">
                <div className="text-gray-400 mb-4">
                  <User className="w-12 h-12 mx-auto" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-600">
                  Contractors will start applying soon. Check back later or share your job listing.
                </p>
              </CardContent>
            </Card>
          )}

          {!acceptedApplication && pendingApplications.map((application) => (
            <Card key={application.id} className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {application.contractor.contractorProfile?.companyName || application.contractor.name}
                      </h3>
                      <p className="text-sm text-gray-600">{application.contractor.contractorProfile?.trade}</p>
                      {application.contractor.contractorProfile && (
                        <div className="flex items-center space-x-1 mt-1">
                          {getRatingStars(application.contractor.contractorProfile.avgRating)}
                          <span className="text-sm text-gray-600 ml-1">
                            ({application.contractor.contractorProfile.reviewCount} reviews)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">
                      Applied {new Date(application.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-4 h-4 text-gray-500" />
                    <span className="font-medium">${application.proposedPrice}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span>{application.estimatedDays} days estimated</span>
                  </div>
                </div>
                
                {application.message && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Message:</h4>
                    <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                      {application.message}
                    </p>
                  </div>
                )}

                  <div className="flex gap-3">
                    <Button
                      onClick={() => handleApplicationAction(application.id, 'accept')}
                      disabled={processingApplicationId === application.id}
                      className="flex-1"
                    >
                      {processingApplicationId === application.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Accepting...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept & Chat
                        </>
                      )}
                    </Button>
                    
                    <Button
                      variant="secondary"
                      onClick={() => handleApplicationAction(application.id, 'reject')}
                      disabled={processingApplicationId === application.id}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Decline
                    </Button>
                    
                    <Link href={`/contractor/${application.contractor.id}/portfolio`}>
                      <Button variant="secondary" size="sm">
                        View Work
                      </Button>
                    </Link>
                  </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}