"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import Link from "next/link";

export default function ContractorJobsPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [accepting, setAccepting] = useState<string | null>(null);
  const { authUser: user, isSignedIn } = useAuth();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/jobs");
      
      if (response.ok) {
        const data = await response.json();
        setJobs(data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  const acceptJob = async (jobId: string) => {
    setAccepting(jobId);
    try {
      const response = await fetch(`/api/jobs/${jobId}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractorId: user?.id || 'demo-contractor'
        })
      });

      if (response.ok) {
        // Refresh jobs list
        fetchJobs();
        alert('Job accepted successfully!');
      } else {
        alert('Failed to accept job');
      }
    } catch (error) {
      console.error('Error accepting job:', error);
      alert('Error accepting job');
    } finally {
      setAccepting(null);
    }
  };

  const toggleJobDetails = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md w-full">
          <h1 className="text-2xl font-bold text-center mb-4">Access Restricted</h1>
          <p className="text-center mb-6">You need to sign in as a contractor to view jobs.</p>
          <div className="text-center">
            <Link href="/demo-login" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
              Demo Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Available Jobs
          </h1>
          <p className="text-xl text-gray-600">
            Welcome {user.name}! Browse home improvement projects in your area
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading jobs...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Jobs Available</h3>
            <p className="text-gray-500 mb-4">No leads have been created yet. Try logging in as a homeowner to create a lead!</p>
            <Link href="/demo-login" className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold">
              Switch to Homeowner Demo
            </Link>
          </div>
        ) : (
          <div className="grid gap-6">
            {jobs.map((job) => (
              <div key={job.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <span>📍 {job.location || job.zipCode}</span>
                      <span>💰 {job.budget}</span>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{job.category}</span>
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
                    {job.photos && JSON.parse(job.photos).length > 0 && (
                      <div className="mt-3">
                        <span className="font-medium">Photos:</span>
                        <div className="flex gap-2 mt-1">
                          {JSON.parse(job.photos).map((photo: string, index: number) => (
                            <img 
                              key={index} 
                              src={photo} 
                              alt={`Project photo ${index + 1}`}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ))}
                        </div>
                      </div>
                    )}
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
                    {job.status === 'Open' && (
                      <button 
                        onClick={() => acceptJob(job.id)}
                        disabled={accepting === job.id}
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-6 py-2 rounded-lg font-semibold disabled:opacity-50 transition-colors"
                      >
                        {accepting === job.id ? 'Accepting...' : 'Accept Job'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
