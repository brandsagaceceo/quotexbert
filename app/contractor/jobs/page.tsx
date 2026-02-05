"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ALL_CATEGORIES } from "@/lib/categories";
import { ContractorOnboardingPopup } from "@/components/ContractorOnboardingPopup";
import { canAcceptJob, isGodUser } from "@/lib/god-access";
import { useJobNotifications, type Job } from "@/lib/hooks/useJobNotifications";
import { ToastContainer, type Toast } from "@/components/ToastNotification";

interface JobFilters {
  category?: string;
  minBudget?: number | undefined;
  maxBudget?: number | undefined;
  location?: string;
  search?: string;
}

export default function ContractorJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string>('');
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);
  const [acceptanceModal, setAcceptanceModal] = useState<{jobId: string; title: string} | null>(null);
  const [filters, setFilters] = useState<JobFilters>({});
  const [showFilters, setShowFilters] = useState(false);
  const [showOnboardingPopup, setShowOnboardingPopup] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const { authUser: user, isSignedIn } = useAuth();
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<any[]>([]);

  // Add toast notification
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  useEffect(() => {
    fetchJobs();
    fetchSubscriptions();
    
    // Check if this is a new contractor (show popup once)
    const hasSeenOnboarding = localStorage.getItem('contractor_seen_onboarding');
    const userCreatedRecently = user && checkIfNewUser(user);
    
    if (!hasSeenOnboarding && userCreatedRecently && subscriptions.length === 0) {
      // Show popup after a short delay for better UX
      setTimeout(() => {
        setShowOnboardingPopup(true);
        localStorage.setItem('contractor_seen_onboarding', 'true');
      }, 1500);
    }
  }, [user]);

  const checkIfNewUser = (user: any) => {
    // Check if user was created in the last 7 days
    if (user.createdAt) {
      const createdDate = new Date(user.createdAt);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return createdDate > sevenDaysAgo;
    }
    return false;
  };

  const fetchSubscriptions = async () => {
    if (!user) return;
    try {
      const response = await fetch(`/api/subscriptions?contractorId=${user.id}`);
      const data = await response.json();
      if (data.success) {
        setSubscriptions(data.subscriptions || []);
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error);
    }
  };

  useEffect(() => {
    applyFilters();
  }, [jobs, filters]);

  const applyFilters = () => {
    let filtered = [...jobs];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(job => 
        job.title?.toLowerCase().includes(searchLower) ||
        job.description?.toLowerCase().includes(searchLower) ||
        job.category?.toLowerCase().includes(searchLower) ||
        job.location?.toLowerCase().includes(searchLower)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(job => job.category === filters.category);
    }

    if (filters.minBudget) {
      filtered = filtered.filter(job => {
        const budgetStr = job.budget?.replace(/[^0-9]/g, '');
        const budget = parseInt(budgetStr) || 0;
        return budget >= filters.minBudget!;
      });
    }

    if (filters.maxBudget) {
      filtered = filtered.filter(job => {
        const budgetStr = job.budget?.replace(/[^0-9]/g, '');
        const budget = parseInt(budgetStr) || 0;
        return budget <= filters.maxBudget!;
      });
    }

    if (filters.location) {
      const locationLower = filters.location.toLowerCase();
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(locationLower)
      );
    }

    setFilteredJobs(filtered);
  };

  const handleFilterChange = (newFilters: Partial<JobFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({});
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      
      if (!user?.id) {
        setMessage("Please sign in to view jobs.");
        setLoading(false);
        return;
      }
      
      const contractorId = user.id;
      const response = await fetch(`/api/jobs?contractorId=${contractorId}`);
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || data); // Handle both old and new response formats
        setMessage(data.message || '');
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setMessage("Error loading jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Real-time job notifications
  useJobNotifications({
    userId: user?.id,
    enabled: isSignedIn && !!user,
    pollInterval: 15000, // Check every 15 seconds
    onNewJob: (job: Job) => {
      // Refresh jobs list
      fetchJobs();
      
      // Show toast notification
      addToast({
        title: '🎉 New Job Available!',
        message: `${job.title} - ${job.budget} in ${job.location}`,
        type: 'success',
        duration: 10000,
        action: {
          label: 'View Job',
          onClick: () => {
            // Scroll to the job
            const element = document.getElementById(`job-${job.id}`);
            element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Highlight briefly
            element?.classList.add('ring-4', 'ring-green-500');
            setTimeout(() => {
              element?.classList.remove('ring-4', 'ring-green-500');
            }, 3000);
          }
        }
      });
    }
  });

  const acceptJob = async (jobId: string, acceptanceData?: {message?: string}) => {
    setAccepting(jobId);
    
    // Find the job to check its category
    const job = jobs.find(j => j.id === jobId);
    if (!job) {
      alert('Job not found');
      setAccepting(null);
      return;
    }

    // Check if contractor is subscribed to this job's category
    const isSubscribed = subscriptions.some(sub => 
      sub.category === job.category && 
      sub.status === 'active' && 
      sub.canClaimLeads
    );

    // God users can accept ANY job without subscription
    const hasAccess = canAcceptJob(user?.email, isSubscribed);

    if (!hasAccess) {
      alert(`You must be subscribed to the "${job.category}" category to accept jobs. Please visit your subscriptions page to subscribe.`);
      setAccepting(null);
      return;
    }

    if (!user?.id) {
      alert("Please sign in to accept jobs.");
      setAccepting(null);
      return;
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractorId: user.id,
          message: acceptanceData?.message || `I'm interested in this project and would like to provide you with a quote. Let's discuss the details!`
        })
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh jobs list
        fetchJobs();
        setAcceptanceModal(null);
        
        // Redirect to messages page with specific thread
        const redirectUrl = result.redirectUrl || '/messages';
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1000);
        
        alert(result.message || 'Job accepted successfully! Redirecting to conversation with homeowner...');
      } else {
        console.error('Job acceptance failed:', result);
        alert(`Failed to accept job: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error accepting job:', error);
      alert('Error accepting job');
    } finally {
      setAccepting(null);
    }
  };

  const openAcceptanceModal = (jobId: string, title: string) => {
    setAcceptanceModal({ jobId, title });
  };

  const toggleJobDetails = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Access Restricted</h1>
          <p className="text-center mb-6">You need to sign in as a contractor to view jobs.</p>
          <div className="text-center">
            <Link href="/sign-in" className="bg-gradient-to-r from-rose-600 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-4">
            Available Jobs
          </h1>
          <p className="text-xl text-gray-600">
            Welcome {user.name}! Browse home improvement projects in your area
          </p>
          
          {message && (
            <div className={`mt-4 p-4 rounded-lg border ${
              message.includes('Subscribe') || message.includes('No jobs')
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-green-50 border-green-200 text-green-800'
            }`}>
              <p className="font-medium">{message}</p>
              {message.includes('Subscribe') && (
                <div className="mt-2">
                  <Link 
                    href="/contractor/subscriptions" 
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-lg hover:from-rose-700 hover:to-orange-700 transition-colors"
                  >
                    View Subscriptions →
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Filter Section */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50">
          <div className="p-4 border-b border-gray-200">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
              <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
                ⌄
              </span>
            </button>
          </div>
          
          {showFilters && (
            <div className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Search
                  </label>
                  <input
                    type="text"
                    placeholder="Search jobs..."
                    value={filters.search || ''}
                    onChange={(e) => handleFilterChange({ search: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={filters.category || ''}
                    onChange={(e) => handleFilterChange({ category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">All categories</option>
                    {ALL_CATEGORIES.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Min Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Min Budget
                  </label>
                  <input
                    type="number"
                    placeholder="$0"
                    value={filters.minBudget || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange({ 
                        minBudget: value ? parseInt(value) : undefined 
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Max Budget */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Max Budget
                  </label>
                  <input
                    type="number"
                    placeholder="$50,000"
                    value={filters.maxBudget || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleFilterChange({ 
                        maxBudget: value ? parseInt(value) : undefined 
                      });
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
                <div className="text-sm text-gray-600 flex items-center">
                  Showing {filteredJobs.length} of {jobs.length} jobs
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Match Your Filters</h3>
            <p className="text-gray-500 mb-4">
              {jobs.length === 0 
                ? "No leads have been created yet. Try logging in as a homeowner to create a lead!"
                : "Try adjusting your filters to see more jobs."
              }
            </p>
            <div className="space-x-2">
              {jobs.length > 0 && (
                <button 
                  onClick={clearFilters}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg font-semibold"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredJobs.map((job) => (
              <div 
                key={job.id} 
                id={`job-${job.id}`}
                className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 transition-all duration-300"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📍 {job.location || job.zipCode}</span>
                      <span>💰 {job.budget}</span>
                      <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded">{job.category}</span>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status}
                  </span>
                </div>
                
                <p className="text-gray-700 mb-4">
                  {expandedJob === job.id 
                    ? job.description 
                    : job.description?.length > 120 
                      ? job.description.substring(0, 120) + '...' 
                      : job.description
                  }
                </p>

                {/* Expanded Details */}
                {expandedJob === job.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Project Details</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Budget:</span> {job.budget}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {job.location || job.zipCode}
                      </div>
                      <div>
                        <span className="font-medium">Category:</span> {job.category}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span> {job.status}
                      </div>
                    </div>
                    {job.photos && (() => {
                      try {
                        const photos = JSON.parse(job.photos);
                        return photos.length > 0 && (
                          <div className="mt-3">
                            <span className="font-medium">Photos:</span>
                            <div className="flex gap-2 mt-1 flex-wrap">
                              {photos.map((photo: string, index: number) => (
                                <img 
                                  key={index} 
                                  src={photo} 
                                  alt={`Project photo ${index + 1}`}
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-200 hover:scale-105 transition-transform cursor-pointer"
                                  onClick={() => window.open(photo, '_blank')}
                                />
                              ))}
                            </div>
                          </div>
                        );
                      } catch (error) {
                        console.error('Error parsing photos:', error);
                        return null;
                      }
                    })()}
                  </div>
                )}

                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-gray-500">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => toggleJobDetails(job.id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      {expandedJob === job.id ? 'Hide Details' : 'View Details'}
                    </button>
                    {job.status === 'open' && (() => {
                      const isSubscribed = subscriptions.some(sub => 
                        sub.category === job.category && 
                        sub.status === 'active' && 
                        sub.canClaimLeads
                      );
                      
                      // God users can accept without subscription
                      const hasAccess = canAcceptJob(user?.email, isSubscribed);
                      
                      return hasAccess ? (
                        <button 
                          onClick={() => openAcceptanceModal(job.id, job.title)}
                          disabled={accepting === job.id}
                          className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition-colors"
                        >
                          {accepting === job.id ? 'Accepting...' : 'Accept Job'}
                        </button>
                      ) : (
                        <div className="flex flex-col items-end gap-1">
                          <button 
                            disabled
                            className="bg-gray-400 text-white px-6 py-2 rounded-lg font-semibold opacity-50 cursor-not-allowed"
                          >
                            Subscription Required
                          </button>
                          <Link 
                            href="/contractor/subscriptions"
                            className="text-xs text-rose-600 hover:text-rose-800 underline"
                          >
                            Subscribe to {job.category}
                          </Link>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Acceptance Modal */}
      {acceptanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Accept Job: {acceptanceModal.title}
            </h3>
            
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              await acceptJob(acceptanceModal.jobId, {
                message: formData.get('message') as string
              });
            }}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message to Homeowner (Optional)
                  </label>
                  <textarea
                    name="message"
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    defaultValue="I'm interested in this project and would like to provide you with a quote. Let's discuss the details!"
                  />
                </div>

                <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
                  <h4 className="font-semibold text-rose-900 mb-2">What happens next?</h4>
                  <ul className="text-sm text-rose-800 space-y-1">
                    <li>• You'll be added to this job (max 3 contractors)</li>
                    <li>• A conversation will start with the homeowner</li>
                    <li>• You can send quotes and discuss details through messages</li>
                    <li>• The homeowner will choose their preferred contractor</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setAcceptanceModal(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={accepting === acceptanceModal.jobId}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-2 px-4 rounded-lg font-semibold disabled:opacity-50 transition-colors"
                >
                  {accepting === acceptanceModal.jobId ? 'Accepting...' : 'Accept Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Onboarding Popup for New Contractors */}
      <ContractorOnboardingPopup 
        isOpen={showOnboardingPopup}
        onClose={() => setShowOnboardingPopup(false)}
        contractorName={user?.name}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}
