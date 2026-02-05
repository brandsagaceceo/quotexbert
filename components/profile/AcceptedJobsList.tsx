"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, Clock, MapPin, DollarSign, MessageCircle, AlertCircle } from 'lucide-react';

interface AcceptedJob {
  id: string;
  title: string;
  description: string;
  budget: string;
  location: string;
  status: string;
  acceptedAt: string;
  homeownerName: string;
  homeownerEmail: string;
  category: string;
  deadline?: string;
}

export default function AcceptedJobsList({ contractorId }: { contractorId: string }) {
  const [jobs, setJobs] = useState<AcceptedJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    fetchAcceptedJobs();
  }, [contractorId]);

  const fetchAcceptedJobs = async () => {
    try {
      const response = await fetch(`/api/contractor/accepted-jobs?contractorId=${contractorId}`);
      if (response.ok) {
        const data = await response.json();
        setJobs(data.jobs || []);
      }
    } catch (error) {
      console.error('Error fetching accepted jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      accepted: 'bg-blue-100 text-blue-700 border-blue-200',
      in_progress: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      completed: 'bg-green-100 text-green-700 border-green-200',
      cancelled: 'bg-red-100 text-red-700 border-red-200',
    };

    const icons = {
      accepted: <Clock className="h-4 w-4" />,
      in_progress: <AlertCircle className="h-4 w-4" />,
      completed: <CheckCircle2 className="h-4 w-4" />,
      cancelled: <AlertCircle className="h-4 w-4" />,
    };

    const label = status.replace('_', ' ');

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-700 border-gray-200'}`}>
        {icons[status as keyof typeof icons]}
        {label.toUpperCase()}
      </span>
    );
  };

  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    if (filter === 'active') return job.status === 'accepted' || job.status === 'in_progress';
    if (filter === 'completed') return job.status === 'completed';
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filter Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filter === 'all' 
              ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All ({jobs.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filter === 'active' 
              ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active ({jobs.filter(j => j.status === 'accepted' || j.status === 'in_progress').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
            filter === 'completed' 
              ? 'bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-lg' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed ({jobs.filter(j => j.status === 'completed').length})
        </button>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">No Jobs Yet</h3>
          <p className="text-gray-600 mb-4">
            {filter === 'all' 
              ? "You haven't accepted any jobs yet. Browse available jobs to get started!" 
              : `No ${filter} jobs found.`}
          </p>
          {filter === 'all' && (
            <Link 
              href="/contractor/jobs"
              className="inline-block bg-gradient-to-r from-rose-600 to-orange-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Browse Jobs
            </Link>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all hover:border-rose-300">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                    {getStatusBadge(job.status)}
                  </div>
                  <p className="text-gray-600 mb-3">{job.description}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="text-xs text-gray-500">Budget</div>
                    <div className="font-bold">{job.budget}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <MapPin className="h-5 w-5 text-rose-600" />
                  <div>
                    <div className="text-xs text-gray-500">Location</div>
                    <div className="font-bold">{job.location}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="text-xs text-gray-500">Accepted</div>
                    <div className="font-bold text-sm">{new Date(job.acceptedAt).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircle2 className="h-5 w-5 text-purple-600" />
                  <div>
                    <div className="text-xs text-gray-500">Category</div>
                    <div className="font-bold text-sm">{job.category}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div>
                  <div className="text-xs text-gray-500">Homeowner</div>
                  <div className="font-semibold text-gray-900">{job.homeownerName}</div>
                </div>
                <div className="flex gap-2">
                  <Link
                    href={`/conversations/${job.id}`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center gap-2"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Message
                  </Link>
                  <Link
                    href={`/contractor/jobs`}
                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                  >
                    Browse More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
