"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ALL_CATEGORIES } from "@/lib/categories";
import { ContractorOnboardingPopup } from "@/components/ContractorOnboardingPopup";
import { canAcceptJob, isUnlimitedTestContractor } from "@/lib/god-access";
import { useJobNotifications, type Job } from "@/lib/hooks/useJobNotifications";
import { ToastContainer, type Toast } from "@/components/ToastNotification";
import LoadingState from "@/components/ui/LoadingState";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import { formatDistanceToNow } from "date-fns";
import { ContractorMetricsCard } from "@/components/ContractorMetricsCard";

interface JobFilters {
  category?: string;
  minBudget?: number | undefined;
  maxBudget?: number | undefined;
  location?: string;
  search?: string;
  sortBy?: 'newest' | 'budget-high' | 'budget-low';
  urgency?: 'hot' | 'active' | 'older';
}

function ContractorJobsContent() {
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
  const [newJobAlert, setNewJobAlert] = useState<any | null>(null);
  const { authUser: user, isSignedIn } = useAuth();
  const router = useRouter();

  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [highlightedJobId, setHighlightedJobId] = useState<string | null>(null);
  const searchParams = useSearchParams();

  // Add toast notification
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Read highlight param and scroll+highlight after jobs load
  useEffect(() => {
    const highlightId = searchParams?.get('highlight');
    if (!highlightId || loading) return;
    setHighlightedJobId(highlightId);
    const el = document.getElementById(`job-${highlightId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.add('ring-4', 'ring-rose-500', 'ring-offset-2');
      setTimeout(() => {
        el.classList.remove('ring-4', 'ring-rose-500', 'ring-offset-2');
        setHighlightedJobId(null);
      }, 4000);
    }
  }, [loading, searchParams]);

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

    // Filter by urgency
    if (filters.urgency) {
      filtered = filtered.filter(job => {
        const minutesAgo = (Date.now() - new Date(job.createdAt).getTime()) / 60000;
        if (filters.urgency === 'hot') return minutesAgo <= 30;
        if (filters.urgency === 'active') return minutesAgo > 30 && minutesAgo <= 360;
        if (filters.urgency === 'older') return minutesAgo > 360;
        return true;
      });
    }

    // Apply sorting
    if (filters.sortBy === 'newest') {
      filtered = filtered.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } else if (filters.sortBy === 'budget-high') {
      filtered = filtered.sort((a, b) => {
        const budgetA = parseInt(a.budget?.replace(/[^0-9]/g, '') || '0');
        const budgetB = parseInt(b.budget?.replace(/[^0-9]/g, '') || '0');
        return budgetB - budgetA;
      });
    } else if (filters.sortBy === 'budget-low') {
      filtered = filtered.sort((a, b) => {
        const budgetA = parseInt(a.budget?.replace(/[^0-9]/g, '') || '0');
        const budgetB = parseInt(b.budget?.replace(/[^0-9]/g, '') || '0');
        return budgetA - budgetB;
      });
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
    userId: user?.id || '',
    enabled: isSignedIn && !!user,
    pollInterval: 30000, // Check every 30 seconds
    onNewJob: (job: Job) => {
      // Refresh jobs list
      fetchJobs();
      
      // Show alert banner for matching jobs
      if (subscriptions.some(sub => sub.category === job.category && sub.status === 'active')) {
        setNewJobAlert(job);
        setTimeout(() => setNewJobAlert(null), 60000); // Hide after 1 minute
      }
      
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
      addToast({
        title: 'Error',
        message: 'Job not found',
        type: 'error',
        duration: 5000
      });
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
      addToast({
        title: 'Subscription Required',
        message: `You must be subscribed to the "${job.category}" category to accept jobs.`,
        type: 'warning',
        duration: 6000,
        action: {
          label: 'View Subscriptions',
          onClick: () => router.push('/contractor/subscriptions')
        }
      });
      setAccepting(null);
      return;
    }

    if (!user?.id) {
      addToast({
        title: 'Authentication Required',
        message: 'Please sign in to accept jobs',
        type: 'warning',
        duration: 5000
      });
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
        
        // Show success toast
        addToast({
          title: '✅ Job Accepted Successfully!',
          message: 'You can now send quotes through messages. Redirecting to conversation...',
          type: 'success',
          duration: 4000
        });
        
        // Redirect to messages page with specific thread
        const redirectUrl = result.redirectUrl || '/messages';
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1500);
      } else {
        console.error('Job acceptance failed:', result);
        addToast({
          title: 'Failed to Accept Job',
          message: result.error || 'An unknown error occurred. Please try again.',
          type: 'error',
          duration: 6000
        });
      }
    } catch (error) {
      console.error('Error accepting job:', error);
      addToast({
        title: 'Error',
        message: 'Failed to accept job. Please check your connection and try again.',
        type: 'error',
        duration: 5000
      });
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

  const activeFilterCount = Object.values(filters).filter(
    (value) => value !== undefined && value !== ''
  ).length;

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

          {/* Unlimited test-contractor access is silently active – no badge shown */}
          
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

        {/* Performance Metrics */}
        {user?.id && (
          <div className="mb-6">
            <ContractorMetricsCard contractorId={user.id} />
          </div>
        )}

        {/* New Job Alert Banner */}
        {newJobAlert && (
          <div className="mb-6 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-2xl p-6 shadow-2xl animate-pulse">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">🔥</span>
                  <h3 className="text-2xl font-black">New Renovation Lead Near You!</h3>
                </div>
                <div className="space-y-1 text-lg">
                  <p className="font-semibold">{newJobAlert.location} – {newJobAlert.category} – {newJobAlert.budget}</p>
                  <p className="opacity-90">{newJobAlert.title}</p>
                </div>
                <button
                  onClick={() => {
                    const element = document.getElementById(`job-${newJobAlert.id}`);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    setNewJobAlert(null);
                  }}
                  className="mt-4 bg-white text-orange-600 font-bold py-2 px-6 rounded-lg hover:bg-orange-50 transition"
                >
                  View Job →
                </button>
              </div>
              <button
                onClick={() => setNewJobAlert(null)}
                className="text-white hover:text-orange-100 text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Quick Hot Leads Filters */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50 p-4">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => {
                const newFilters = { ...filters };
                delete newFilters.urgency;
                delete newFilters.sortBy;
                setFilters(newFilters);
              }}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                !filters.urgency && !filters.sortBy
                  ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Jobs
            </button>
            <button
              onClick={() => {
                const newFilters = { ...filters };
                newFilters.urgency = 'hot';
                delete newFilters.sortBy;
                setFilters(newFilters);
              }}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                filters.urgency === 'hot'
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border-2 border-orange-200'
              }`}
            >
              <span>🔥</span> Hot Leads
            </button>
            <button
              onClick={() => {
                const newFilters = { ...filters };
                delete newFilters.urgency;
                newFilters.sortBy = 'newest';
                setFilters(newFilters);
              }}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                filters.sortBy === 'newest'
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-2 border-blue-200'
              }`}
            >
              ✨ Newest Jobs
            </button>
            <button
              onClick={() => {
                const newFilters = { ...filters };
                delete newFilters.urgency;
                newFilters.sortBy = 'budget-high';
                setFilters(newFilters);
              }}
              className={`px-5 py-2.5 rounded-lg font-semibold transition-all ${
                filters.sortBy === 'budget-high'
                  ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
                  : 'bg-green-50 text-green-700 hover:bg-green-100 border-2 border-green-200'
              }`}
            >
              💰 Highest Value
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="mb-6 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-white/50">
          <div className="p-4 border-b border-gray-200">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-between w-full text-left"
            >
              <h3 className="text-lg font-semibold text-gray-900">
                Filters {activeFilterCount > 0 && <span className="text-sm text-rose-700">({activeFilterCount} active)</span>}
              </h3>
              <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>
                ⌄
              </span>
            </button>
          </div>
          
          {showFilters && (
            <div className="p-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 md:gap-4 mb-4">
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

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    placeholder="City or ZIP"
                    value={filters.location || ''}
                    onChange={(e) => handleFilterChange({ location: e.target.value })}
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

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy || ''}
                    onChange={(e) => handleFilterChange({ sortBy: e.target.value as 'newest' | 'budget-high' | 'budget-low' || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Default</option>
                    <option value="newest">Newest First</option>
                    <option value="budget-high">Highest Budget</option>
                    <option value="budget-low">Lowest Budget</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  onClick={clearFilters}
                  className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                >
                  Clear Filters
                </button>
                <div className="text-sm text-gray-600 flex items-center sm:justify-end">
                  Showing {filteredJobs.length} of {jobs.length} jobs
                </div>
              </div>
            </div>
          )}
        </div>

        {loading ? (
          <LoadingState
            title="Loading available jobs"
            subtitle="Finding projects that match your categories"
          />
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
            {filteredJobs.map((job) => {
              const _isSubscribed = subscriptions.some(sub =>
                sub.category === job.category &&
                sub.status === 'active' &&
                sub.canClaimLeads
              );
              const _hasAccess = canAcceptJob(user?.email, _isSubscribed);
              // For non-subscribers, only show city-level location
              const _displayLocation = _hasAccess
                ? (job.location || job.zipCode)
                : (job.location || job.zipCode || '').split(',')[0].trim() || job.zipCode || 'Location hidden';
              return (
              <div 
                key={job.id} 
                id={`job-${job.id}`}
                className={`bg-white/80 backdrop-blur-sm rounded-xl p-4 md:p-6 shadow-lg border border-white/50 transition-all duration-300 ${highlightedJobId === job.id ? 'ring-4 ring-rose-500 ring-offset-2' : ''}`}
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-base md:text-xl font-bold text-gray-900 mb-1.5">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600 flex-wrap gap-2 mb-2">
                      <span className="whitespace-nowrap">📍 {_displayLocation}{!_hasAccess && ' (area only)'}</span>
                      <span className="whitespace-nowrap">💰 {job.budget}</span>
                      <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded whitespace-nowrap">{job.category}</span>
                      {/* Contractor Interest Counter */}
                      {job._count?.applications > 0 && (
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded whitespace-nowrap font-semibold flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          {job._count.applications} contractor{job._count.applications !== 1 ? 's' : ''} interested
                        </span>
                      )}
                    </div>
                    {/* Urgency Badge */}
                    <UrgencyBadge createdAt={job.createdAt} />
                    {/* Claimed Badge */}
                    {job.claimed && job.claimedBy && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium flex items-center gap-1">
                          🔥 Claimed
                          {job.claimedAt && (
                            <span className="text-xs opacity-75">
                              {new Date(job.createdAt).getTime() - new Date(job.claimedAt).getTime() < 3600000 
                                ? 'recently' 
                                : formatDistanceToNow(new Date(job.claimedAt), { addSuffix: true })}
                            </span>
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    job.status === 'open' ? 'bg-green-100 text-green-800' : 
                    job.status === 'claimed' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </div>
                
                {_hasAccess ? (
                  <p className="text-gray-700 mb-4">
                    {expandedJob === job.id 
                      ? job.description 
                      : job.description?.length > 120 
                        ? job.description.substring(0, 120) + '...' 
                        : job.description
                    }
                  </p>
                ) : (
                  <div className="mb-4 relative rounded-xl overflow-hidden">
                    <p className="text-gray-700 blur-sm select-none pointer-events-none leading-relaxed">
                      {job.description?.substring(0, 150) || 'Subscribe to see the full project description and contact details.'}
                    </p>
                    <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[1px]">
                      <Link href="/contractor/subscriptions"
                        className="bg-gradient-to-r from-rose-600 to-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-all">
                        Subscribe to {job.category} to unlock
                      </Link>
                    </div>
                  </div>
                )}

                {/* Expanded Details */}
                {expandedJob === job.id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Project Details</h4>
                    <div className="grid md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Budget:</span> {job.budget}
                      </div>
                      <div>
                        <span className="font-medium">Location:</span> {_hasAccess ? (job.location || job.zipCode) : _displayLocation + ' (area only)'}
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

                <div className="flex justify-between items-center mt-3 flex-wrap gap-2">
                  <span className="text-xs text-gray-500">
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <button 
                      onClick={() => toggleJobDetails(job.id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      {expandedJob === job.id ? 'Hide Details' : 'View Details'}
                    </button>
                    {job.status === 'open' && (() => {
                      // Access already computed per card above as _hasAccess
                      return _hasAccess ? (
                        <button 
                          onClick={() => openAcceptanceModal(job.id, job.title)}
                          disabled={accepting === job.id}
                          className="bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors"
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
              );
            })}
          </div>
        )}
      </div>

      {/* Acceptance Modal */}
      {acceptanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
          <div className="min-h-full flex items-center justify-center p-4 py-8">
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
                    <li>• <strong>📞 Homeowner's phone number will be revealed after acceptance</strong></li>
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
                  className="flex-1 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white py-2 px-4 rounded-lg font-semibold disabled:opacity-50 transition-colors"
                >
                  {accepting === acceptanceModal.jobId ? 'Accepting...' : 'Accept Job'}
                </button>
              </div>
            </form>
          </div>
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

export default function ContractorJobsPage() {
  return (
    <Suspense fallback={null}>
      <ContractorJobsContent />
    </Suspense>
  );
}
