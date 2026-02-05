'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import Link from 'next/link';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Users, MessageCircle, Clock, DollarSign, Edit, Trash2 } from 'lucide-react';

interface JobApplication {
  id: string;
  message: string;
  proposedPrice: number;
  estimatedCompletion: string;
  status: string;
  appliedAt: string;
  contractor: {
    id: string;
    name: string;
    email: string;
    contractorProfile?: {
      companyName: string;
      trade: string;
      yearsExperience: number;
      city: string;
    };
  };
}

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  zipCode: string;
  status: string;
  maxContractors: number;
  createdAt: string;
  applications: JobApplication[];
  assignedContractorId: string | null;
}

export default function HomeownerJobsPage() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingJobId, setDeletingJobId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchJobs();
    }
  }, [user]);

  const fetchJobs = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/homeowner/jobs?homeownerId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    setDeletingJobId(jobId);
    
    try {
      const response = await fetch(`/api/homeowner/jobs/${jobId}?homeownerId=${user?.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove the job from the list
        setJobs(jobs.filter(job => job.id !== jobId));
      } else {
        alert('Failed to delete job. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job. Please try again.');
    } finally {
      setDeletingJobId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: { label: 'Draft', variant: 'secondary' as const },
      open: { label: 'Open for Applications', variant: 'default' as const },
      reviewing: { label: 'Reviewing Applications', variant: 'outline' as const },
      assigned: { label: 'Assigned', variant: 'success' as const },
      completed: { label: 'Completed', variant: 'success' as const },
    };
    
    return statusConfig[status as keyof typeof statusConfig] || { label: status, variant: 'default' as const };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-700 mx-auto mb-4"></div>
          <p>Loading your jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
          <p className="text-gray-600 mt-2">Manage your posted jobs and contractor applications</p>
        </div>
        <Link href="/homeowner/jobs/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {jobs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <div className="text-gray-400 mb-4">
              <Users className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs posted yet</h3>
            <p className="text-gray-600 mb-4">Start by posting your first job to find qualified contractors.</p>
            <Link href="/homeowner/jobs/create">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Post Your First Job
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {jobs.map((job) => {
            const statusInfo = getStatusBadge(job.status);
            const applicationCount = job.applications.length;
            const lowestBid = job.applications.length > 0 
              ? Math.min(...job.applications.map(app => app.proposedPrice))
              : null;

            return (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <p className="mt-2 text-base text-gray-600">
                        {job.description}
                      </p>
                    </div>
                    <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600 mt-4">
                    <span className="flex items-center">
                      <DollarSign className="w-4 h-4 mr-1" />
                      Budget: ${job.budget.toLocaleString()}
                    </span>
                    <span>Category: {job.category}</span>
                    <span>ZIP: {job.zipCode}</span>
                    <span className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {applicationCount}/{job.maxContractors} Applications
                    </span>
                    {lowestBid && (
                      <span className="flex items-center text-green-600">
                        <DollarSign className="w-4 h-4 mr-1" />
                        Lowest Bid: ${lowestBid.toLocaleString()}
                      </span>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="flex gap-3 flex-wrap">
                    <Link href={`/homeowner/jobs/${job.id}`}>
                      <Button variant="secondary" size="sm">
                        <Clock className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                    </Link>
                    
                    {applicationCount > 0 && (
                      <Link href={`/homeowner/jobs/${job.id}/applications`}>
                        <Button size="sm">
                          <Users className="w-4 h-4 mr-2" />
                          Review Applications ({applicationCount})
                        </Button>
                      </Link>
                    )}
                    
                    {job.status === 'assigned' && (
                      <Link href={`/homeowner/jobs/${job.id}/chat`}>
                        <Button variant="secondary" size="sm">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chat with Contractor
                        </Button>
                      </Link>
                    )}

                    {/* Edit button - available for draft and open jobs */}
                    {(job.status === 'draft' || job.status === 'open') && (
                      <Link href={`/homeowner/jobs/${job.id}/edit`}>
                        <Button variant="secondary" size="sm">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      </Link>
                    )}

                    {/* Delete button */}
                    <Button 
                      variant="error" 
                      size="sm"
                      onClick={() => handleDeleteJob(job.id)}
                      disabled={deletingJobId === job.id}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      {deletingJobId === job.id ? 'Deleting...' : 'Delete'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}