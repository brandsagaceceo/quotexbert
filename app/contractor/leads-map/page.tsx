"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import { UrgencyBadge } from "@/components/UrgencyBadge";
import LoadingState from "@/components/ui/LoadingState";
import { MapPin, DollarSign, Clock, Briefcase, Eye, CheckCircle } from "lucide-react";

interface Job {
  id: string;
  title: string;
  category: string;
  budget: string;
  location?: string;
  zipCode: string;
  city?: string;
  description: string;
  status: string;
  createdAt: string;
  latitude?: number;
  longitude?: number;
}

export default function ContractorLeadsMapPage() {
  const { authUser, isSignedIn, authLoading } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"map" | "list">("list");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  // GTA city pin positions (percent x, percent y within the map container)
  const GTA_PINS: Record<string, { x: number; y: number; label: string }> = {
    Toronto:       { x: 50, y: 52, label: 'Toronto' },
    Mississauga:   { x: 34, y: 58, label: 'Mississauga' },
    Scarborough:   { x: 66, y: 51, label: 'Scarborough' },
    'North York':  { x: 50, y: 38, label: 'North York' },
    Etobicoke:     { x: 30, y: 54, label: 'Etobicoke' },
    Markham:       { x: 70, y: 36, label: 'Markham' },
    Brampton:      { x: 26, y: 46, label: 'Brampton' },
    Vaughan:       { x: 42, y: 30, label: 'Vaughan' },
    'Richmond Hill': { x: 56, y: 28, label: 'Richmond Hill' },
    Oakville:      { x: 26, y: 68, label: 'Oakville' },
    Ajax:          { x: 76, y: 52, label: 'Ajax' },
    Pickering:     { x: 73, y: 55, label: 'Pickering' },
    Burlington:    { x: 20, y: 70, label: 'Burlington' },
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isSignedIn || authUser?.role !== "contractor") {
      router.push("/sign-in");
      return;
    }
    fetchJobs();
  }, [isSignedIn, authUser, authLoading]);

  const fetchJobs = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/jobs");
      if (response.ok) {
        const data = await response.json();
        // Filter for open jobs
        const openJobs = data.jobs.filter((job: Job) => job.status === "open");
        setJobs(openJobs);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewJob = (jobId: string) => {
    router.push(`/contractor/jobs#job-${jobId}`);
  };

  const handleAcceptJob = (jobId: string) => {
    router.push(`/contractor/jobs#job-${jobId}`);
  };

  const getJobsByCity = () => {
    const cityMap: { [key: string]: Job[] } = {};
    jobs.forEach((job) => {
      const city = job.city || job.location || job.zipCode;
      if (!cityMap[city]) {
        cityMap[city] = [];
      }
      cityMap[city].push(job);
    });
    return cityMap;
  };

  if (authLoading || isLoading) {
    return <LoadingState />;
  }

  if (!isSignedIn || authUser?.role !== "contractor") {
    return null;
  }

  const jobsByCity = getJobsByCity();
  const cities = Object.keys(jobsByCity).sort();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Jobs Near You
          </h1>
          <p className="text-gray-300 text-lg">
            Browse renovation leads in your service area
          </p>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white mb-1">{jobs.length}</div>
            <div className="text-gray-300 text-sm">Available Jobs</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white mb-1">{cities.length}</div>
            <div className="text-gray-300 text-sm">Cities</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white mb-1">
              {jobs.filter((j) => new Date().getTime() - new Date(j.createdAt).getTime() < 3600000).length}
            </div>
            <div className="text-gray-300 text-sm">New (Last Hour)</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="text-2xl font-bold text-white mb-1">
              {jobs.filter((j) => new Date().getTime() - new Date(j.createdAt).getTime() < 1800000).length}
            </div>
            <div className="text-gray-300 text-sm">🔥 Hot Leads</div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setViewMode("list")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "list"
                ? "bg-rose-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            List View
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              viewMode === "map"
                ? "bg-rose-600 text-white"
                : "bg-white/10 text-gray-300 hover:bg-white/20"
            }`}
          >
            Map View
          </button>
        </div>

        {/* City filter chip when a city is selected */}
        {selectedCity && viewMode === 'list' && (
          <div className="mb-4 flex items-center gap-2">
            <span className="text-gray-300 text-sm">Filtered by:</span>
            <button
              onClick={() => setSelectedCity(null)}
              className="inline-flex items-center gap-1.5 bg-rose-600 text-white text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-rose-700"
            >
              <MapPin size={12} /> {selectedCity} &times;
            </button>
          </div>
        )}

        {/* Content */}
        {viewMode === "list" ? (
          <div className="space-y-8">
            {cities.filter(c => !selectedCity || c === selectedCity).length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center border border-white/20">
                <Briefcase size={64} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Jobs Available</h3>
                <p className="text-gray-300">
                  Check back soon for new renovation leads in your area.
                </p>
              </div>
            ) : (
              cities.filter(c => !selectedCity || c === selectedCity).map((city) => (
                <div key={city} className="space-y-4">
                  {/* City Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <MapPin size={24} className="text-rose-500" />
                    <h2 className="text-2xl font-bold text-white">{city}</h2>
                    <span className="bg-rose-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {jobsByCity[city] ? jobsByCity[city].length : 0} {jobsByCity[city] && jobsByCity[city].length === 1 ? "job" : "jobs"}
                    </span>
                  </div>

                  {/* Job Cards */}
                  <div className="grid gap-4">
                    {jobsByCity[city] && jobsByCity[city].map((job) => (
                      <div
                        key={job.id}
                        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/50 hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                          {/* Left Side - Job Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-3">
                              <div className="bg-rose-100 rounded-lg p-3">
                                <Briefcase size={24} className="text-rose-600" />
                              </div>
                              <div className="flex-1">
                                <h3 className="text-xl font-bold text-gray-900 mb-1">
                                  {job.title}
                                </h3>
                                <div className="flex items-center gap-3 text-sm text-gray-600 flex-wrap">
                                  <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded">
                                    {job.category}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin size={14} />
                                    {job.location || job.zipCode}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-700 mb-4 line-clamp-2">
                              {job.description}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center gap-4 flex-wrap">
                              <div className="flex items-center gap-2 text-gray-700">
                                <DollarSign size={18} className="text-green-600" />
                                <span className="font-semibold">{job.budget}</span>
                              </div>
                              <UrgencyBadge createdAt={job.createdAt} />
                            </div>
                          </div>

                          {/* Right Side - Actions */}
                          <div className="flex lg:flex-col gap-3 lg:min-w-[180px]">
                            <button
                              onClick={() => handleViewJob(job.id)}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                            >
                              <Eye size={18} />
                              <span>View Details</span>
                            </button>
                            <button
                              onClick={() => handleAcceptJob(job.id)}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                              <CheckCircle size={18} />
                              <span>Accept Job</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <p className="text-gray-300 text-sm">Click a city to filter jobs</p>
              {selectedCity && (
                <button onClick={() => setSelectedCity(null)} className="text-xs text-rose-400 hover:text-rose-300">
                  Clear filter
                </button>
              )}
            </div>
            {/* SVG Heatmap */}
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              {/* Background map grid */}
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox="0 0 100 56"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Lake Ontario (bottom) */}
                <rect x="0" y="44" width="100" height="12" fill="#1e3a5f" opacity="0.6" rx="2" />
                <text x="50" y="51" textAnchor="middle" fill="#3b82f6" fontSize="3" opacity="0.7">Lake Ontario</text>

                {/* GTA region outline */}
                <rect x="5" y="5" width="90" height="40" fill="#1e2942" opacity="0.5" rx="4" />

                {/* Grid lines */}
                {[20, 35, 50, 65, 80].map(x => (
                  <line key={`v${x}`} x1={x} y1="5" x2={x} y2="44" stroke="white" strokeWidth="0.2" opacity="0.1" />
                ))}
                {[15, 25, 35].map(y => (
                  <line key={`h${y}`} x1="5" y1={y} x2="95" y2={y} stroke="white" strokeWidth="0.2" opacity="0.1" />
                ))}

                {/* City pins */}
                {Object.entries(GTA_PINS).map(([city, pin]) => {
                  const count = jobsByCity[city]?.length || 0;
                  const maxCount = Math.max(...Object.values(jobsByCity).map(j => j.length), 1);
                  const intensity = count > 0 ? 0.3 + (count / maxCount) * 0.7 : 0;
                  const radius = count > 0 ? 2.5 + (count / maxCount) * 4 : 1.5;
                  const isSelected = selectedCity === city;

                  return (
                    <g
                      key={city}
                      onClick={() => { if (count > 0) { setSelectedCity(city === selectedCity ? null : city); setViewMode('list'); } }}
                      style={{ cursor: count > 0 ? 'pointer' : 'default' }}
                    >
                      {/* Glow ring for active cities */}
                      {count > 0 && (
                        <circle
                          cx={pin.x}
                          cy={pin.y}
                          r={radius + 2}
                          fill={isSelected ? '#f43f5e' : '#f97316'}
                          opacity={0.2 * intensity}
                        />
                      )}
                      {/* Main circle */}
                      <circle
                        cx={pin.x}
                        cy={pin.y}
                        r={radius}
                        fill={count === 0 ? '#475569' : isSelected ? '#f43f5e' : `rgba(249, 115, 22, ${intensity})`}
                        stroke={isSelected ? '#fff' : count > 0 ? '#fed7aa' : '#334155'}
                        strokeWidth="0.5"
                      />
                      {/* Count label */}
                      {count > 0 && (
                        <text
                          x={pin.x}
                          y={pin.y + 0.6}
                          textAnchor="middle"
                          fill="white"
                          fontSize="1.8"
                          fontWeight="bold"
                        >
                          {count}
                        </text>
                      )}
                      {/* City name */}
                      <text
                        x={pin.x}
                        y={pin.y + radius + 2.5}
                        textAnchor="middle"
                        fill={count > 0 ? '#e2e8f0' : '#64748b'}
                        fontSize="1.6"
                      >
                        {pin.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Legend */}
            <div className="p-4 flex items-center gap-6 text-xs text-gray-400 border-t border-white/10">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-orange-500 opacity-90" />
                <span>Jobs available (circle size = volume)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <span>Selected city</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-slate-600" />
                <span>No current jobs</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
