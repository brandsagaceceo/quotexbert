'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingState from '@/components/ui/LoadingState';
import {
  ArrowLeft,
  MapPin,
  DollarSign,
  Calendar,
  Users,
  MessageCircle,
  Edit,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface Application {
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
      city: string;
    };
  };
}

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number | string;
  category: string;
  location?: string;
  zipCode?: string;
  status: string;
  createdAt: string;
  assignedContractorId: string | null;
  applications: Application[];
}

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  open: {
    label: 'Open for Applications',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  reviewing: {
    label: 'Reviewing Applications',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: <Clock className="w-4 h-4" />,
  },
  assigned: {
    label: 'Contractor Assigned',
    color: 'bg-rose-100 text-rose-800 border-rose-200',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  completed: {
    label: 'Completed',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  draft: {
    label: 'Draft',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: <AlertCircle className="w-4 h-4" />,
  },
};

export default function HomeownerJobDetailPage() {
  const { authUser: user } = useAuth();
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user && jobId) {
      fetchJob();
    }
  }, [user, jobId]);

  const fetchJob = async () => {
    if (!user) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/homeowner/jobs/${jobId}?homeownerId=${user.id}`);
      if (res.ok) {
        const data = await res.json();
        setJob(data);
      } else if (res.status === 404) {
        setError('Job not found.');
      } else {
        setError('Failed to load job details.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
      <LoadingState
        title="Loading job details"
        subtitle="Fetching your project information"
      />
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-rose-50 rounded-full mb-4">
          <AlertCircle className="w-8 h-8 text-rose-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">{error || 'Job not found'}</h2>
        <p className="text-slate-500 mb-6">The job may have been removed or you may not have permission to view it.</p>
        <Link
          href="/homeowner/jobs"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-700 to-orange-600 text-white px-5 py-2.5 rounded-xl font-semibold"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Jobs
        </Link>
      </div>
    );
  }

  const statusEntry = STATUS_CONFIG[job.status];
  const status = statusEntry ?? {
    label: job.status || 'Unknown',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: <Clock className="w-4 h-4" />,
  };
  const applicationCount = job.applications.length;
  const lowestBid =
    applicationCount > 0
      ? Math.min(...job.applications.map((a) => a.proposedPrice))
      : null;
  const formattedBudget =
    typeof job.budget === 'number'
      ? `$${job.budget.toLocaleString()}`
      : job.budget;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100" style={{ paddingBottom: 'calc(6rem + env(safe-area-inset-bottom, 0px))' }}>
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-0 z-20 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition-colors flex-shrink-0"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </button>
          <h1 className="text-base font-bold text-slate-900 truncate">{job.title}</h1>
          <div className={`ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${status.color} flex-shrink-0`}>
            {status.icon}
            <span className="hidden sm:inline">{status.label}</span>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">

        {/* Meta row */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{job.title}</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Budget</span>
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <DollarSign className="w-4 h-4 text-green-600 flex-shrink-0" />
                {formattedBudget}
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Category</span>
              <span className="text-slate-800 font-semibold capitalize">{job.category}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Location</span>
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <MapPin className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span className="truncate">{job.location || job.zipCode || 'Not set'}</span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Posted</span>
              <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                <Calendar className="w-4 h-4 text-slate-400 flex-shrink-0" />
                {new Date(job.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-3">Project Description</h3>
          <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">{job.description}</p>
        </div>

        {/* Applications summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wide">Applications</h3>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${applicationCount > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-500'}`}>
              {applicationCount} {applicationCount === 1 ? 'applicant' : 'applicants'}
            </span>
          </div>

          {applicationCount === 0 ? (
            <p className="text-sm text-slate-400 italic">No applications yet. Check back soon!</p>
          ) : (
            <div className="space-y-3">
              {lowestBid !== null && (
                <div className="flex items-center gap-2 text-sm text-green-700 font-semibold bg-green-50 rounded-xl px-4 py-2">
                  <DollarSign className="w-4 h-4" />
                  Lowest bid: ${lowestBid.toLocaleString()}
                </div>
              )}
              <div className="space-y-2">
                {job.applications.slice(0, 3).map((app) => (
                  <div key={app.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-rose-500 to-orange-500 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                      {(app.contractor.contractorProfile?.companyName || app.contractor.name || 'C').charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">
                        {app.contractor.contractorProfile?.companyName || app.contractor.name}
                      </p>
                      <p className="text-xs text-slate-400">${app.proposedPrice.toLocaleString()} proposed</p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${
                      app.status === 'accepted' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                    }`}>{app.status}</span>
                  </div>
                ))}
                {applicationCount > 3 && (
                  <p className="text-xs text-slate-400 text-center pt-1">+{applicationCount - 3} more</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href={`/homeowner/jobs/${job.id}/applications`}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-700 to-orange-600 text-white px-5 py-3.5 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all"
          >
            <Users className="w-5 h-5" />
            View Applications
            {applicationCount > 0 && (
              <span className="bg-white/25 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {applicationCount}
              </span>
            )}
          </Link>
          <Link
            href={`/homeowner/jobs/${job.id}/edit`}
            className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-5 py-3.5 rounded-2xl font-semibold hover:border-rose-400 hover:text-rose-700 transition-all"
          >
            <Edit className="w-5 h-5" />
            Edit Job
          </Link>
          <Link
            href={`/messages?leadId=${job.id}`}
            className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-5 py-3.5 rounded-2xl font-semibold hover:border-rose-400 hover:text-rose-700 transition-all"
          >
            <MessageCircle className="w-5 h-5" />
            Messages
          </Link>
        </div>

        {/* Back link */}
        <div className="pt-2">
          <Link
            href="/homeowner/jobs"
            className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-rose-700 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to all jobs
          </Link>
        </div>
      </div>
    </div>
  );
}
