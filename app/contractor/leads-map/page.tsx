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
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hotOnly, setHotOnly] = useState(false);

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

  const getJobsByCity = (jobList: Job[]) => {
    const cityMap: { [key: string]: Job[] } = {};
    jobList.forEach((job) => {
      const city = job.city || job.location || job.zipCode;
      if (!cityMap[city]) {
        cityMap[city] = [];
      }
      cityMap[city].push(job);
    });
    return cityMap;
  };

  const isHotLead = (job: Job) =>
    new Date().getTime() - new Date(job.createdAt).getTime() < 1800000;

  const allCategories = Array.from(new Set(jobs.map((j) => j.category).filter(Boolean))).sort();

  const filteredJobs = jobs.filter((job) => {
    if (hotOnly && !isHotLead(job)) return false;
    if (activeCategory && job.category !== activeCategory) return false;
    if (selectedCity) {
      const city = job.city || job.location || job.zipCode;
      if (city !== selectedCity) return false;
    }
    return true;
  });

  if (authLoading || isLoading) {
    return <LoadingState />;
  }

  if (!isSignedIn || authUser?.role !== "contractor") {
    return null;
  }

  const jobsByCity = getJobsByCity(filteredJobs);
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
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div className="stat-card">
            <div className="stat-value">{jobs.length}</div>
            <div className="stat-label">Available Jobs</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{Object.keys(getJobsByCity(jobs)).length}</div>
            <div className="stat-label">Cities</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {jobs.filter((j) => new Date().getTime() - new Date(j.createdAt).getTime() < 3600000).length}
            </div>
            <div className="stat-label">New (Last Hour)</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {jobs.filter((j) => isHotLead(j)).length}
            </div>
            <div className="stat-label">🔥 Hot Leads</div>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="mb-4">
          <div className="chip-scroll-row">
            <button
              onClick={() => setHotOnly((v) => !v)}
              className={`stage-chip whitespace-nowrap ${hotOnly ? "active" : ""}`}
            >
              🔥 Hot Leads Only
            </button>
            <button
              onClick={() => setActiveCategory(null)}
              className={`stage-chip whitespace-nowrap ${!activeCategory ? "active" : ""}`}
            >
              All Categories
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat === activeCategory ? null : cat)}
                className={`stage-chip whitespace-nowrap ${activeCategory === cat ? "active" : ""}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="mb-5 flex items-center justify-between gap-3 flex-wrap">
          <div className="view-toggle">
            <button
              onClick={() => setViewMode("list")}
              className={`view-toggle-btn ${viewMode === "list" ? "active" : ""}`}
            >
              ☰ List
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`view-toggle-btn ${viewMode === "map" ? "active" : ""}`}
            >
              🗺 Map
            </button>
          </div>
          {(selectedCity || activeCategory || hotOnly) && (
            <button
              onClick={() => { setSelectedCity(null); setActiveCategory(null); setHotOnly(false); }}
              className="text-xs text-rose-400 hover:text-rose-300 underline"
            >
              Clear all filters
            </button>
          )}
        </div>

        {/* Content */}
        {viewMode === "list" ? (
          <div className="space-y-8">
            {cities.length === 0 ? (
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-12 text-center border border-white/20">
                <Briefcase size={64} className="text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-2">No Jobs Found</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {hotOnly || activeCategory || selectedCity
                    ? "Try clearing your filters to see all available leads."
                    : "Check back soon for new renovation leads in your area."}
                </p>
                {(hotOnly || activeCategory || selectedCity) && (
                  <button
                    onClick={() => { setSelectedCity(null); setActiveCategory(null); setHotOnly(false); }}
                    className="text-rose-400 underline text-sm hover:text-rose-300"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            ) : (
              cities.map((city) => (
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
                  <div className="grid gap-3">
                    {jobsByCity[city] && jobsByCity[city].map((job) => (
                      <div
                        key={job.id}
                        className="job-card-compact"
                      >
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                          {/* Left Side - Job Info */}
                          <div className="flex-1">
                            <div className="flex items-start gap-3 mb-2">
                              <div>
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                  <h3 className="text-base font-bold text-white">
                                    {job.title}
                                  </h3>
                                  {isHotLead(job) && (
                                    <span className="text-xs bg-rose-600 text-white px-2 py-0.5 rounded-full font-semibold">🔥 Hot</span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-400 flex-wrap">
                                  <span className="bg-white/10 text-gray-200 px-2 py-0.5 rounded">
                                    {job.category}
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <MapPin size={12} />
                                    {job.location || job.zipCode}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-400 text-sm mb-2 line-clamp-2">
                              {job.description}
                            </p>

                            {/* Meta Info */}
                            <div className="flex items-center gap-3 flex-wrap">
                              <div className="flex items-center gap-1 text-green-400 text-sm font-semibold">
                                <DollarSign size={14} className="text-green-400" />
                                {job.budget}
                              </div>
                              <UrgencyBadge createdAt={job.createdAt} />
                            </div>
                          </div>

                          {/* Right Side - Actions */}
                          <div className="flex lg:flex-col gap-2 lg:min-w-[160px]">
                            <button
                              onClick={() => handleViewJob(job.id)}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                            >
                              <Eye size={15} />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => handleAcceptJob(job.id)}
                              className="flex-1 lg:flex-none flex items-center justify-center gap-1.5 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                            >
                              <CheckCircle size={15} />
                              <span>Accept</span>
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
            <div className="heat-map-container relative w-full" style={{ paddingBottom: '56.25%' }}>
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
                  const totalCount = getJobsByCity(jobs)[city]?.length || 0;
                  const maxCount = Math.max(...Object.values(getJobsByCity(jobs)).map(j => j.length), 1);
                  const intensity = totalCount > 0 ? 0.3 + (totalCount / maxCount) * 0.7 : 0;
                  const radius = totalCount > 0 ? 2.5 + (totalCount / maxCount) * 4 : 1.5;
                  const isSelected = selectedCity === city;
                  const hasFilteredJobs = count > 0;

                  return (
                    <g
                      key={city}
                      onClick={() => { if (totalCount > 0) { setSelectedCity(city === selectedCity ? null : city); setViewMode('list'); } }}
                      style={{ cursor: totalCount > 0 ? 'pointer' : 'default' }}
                    >
                      {/* Glow ring for active cities */}
                      {totalCount > 0 && (
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
                        fill={totalCount === 0 ? '#475569' : isSelected ? '#f43f5e' : hasFilteredJobs ? `rgba(249, 115, 22, ${intensity})` : `rgba(100, 116, 139, 0.5)`}
                        stroke={isSelected ? '#fff' : totalCount > 0 ? '#fed7aa' : '#334155'}
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
                        fill={totalCount > 0 ? '#e2e8f0' : '#64748b'}
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
