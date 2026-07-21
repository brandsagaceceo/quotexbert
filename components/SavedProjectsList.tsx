"use client";

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Trash, Upload, CheckCircle2, Clock, ArrowUpCircle, X } from 'lucide-react';

interface SavedProject {
  id: string;
  title: string;
  description: string;
  category: string;
  city?: string | null;
  province?: string | null;
  location?: string;
  budget?: string;
  photos: string;
  visualizerImages: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  postedAsLeadId?: string;
  estimateSummary?: string;
  aiEstimate?: {
    minCost: number;
    maxCost: number;
    confidence: number;
  };
}

interface PublishSuccessModal {
  leadId: string;
  title: string;
  cityProvince: string;
}

interface SavedProjectsProps {
  homeownerId: string;
}

export default function SavedProjectsList({ homeownerId }: SavedProjectsProps) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPosting, setIsPosting] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');
  const [successModal, setSuccessModal] = useState<PublishSuccessModal | null>(null);

  const fetchProjects = useCallback(async () => {
    try {
      const response = await fetch(`/api/saved-projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.savedProjects || []);
      }
    } catch (error) {
      console.error('Error fetching saved projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Close modal on Escape key
  useEffect(() => {
    if (!successModal) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setSuccessModal(null); };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [successModal]);

  const handleDelete = async (project: SavedProject) => {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    setDeleteMsg('');
    try {
      const response = await fetch(`/api/saved-projects/${project.id}`, { method: 'DELETE' });
      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== project.id));
        setDeleteMsg('Project deleted.');
        setTimeout(() => setDeleteMsg(''), 3000);
      } else {
        const data = await response.json().catch(() => ({}));
        setErrorMsg(data.error || 'Failed to delete project. Please try again.');
      }
    } catch {
      setErrorMsg('Failed to delete project. Please try again.');
    }
  };

  const handlePostToBoard = async (project: SavedProject) => {
    if (!confirm(`Post "${project.title}" to the QuoteXbert Job Board?`)) return;
    setErrorMsg('');
    setIsPosting(project.id);
    try {
      const response = await fetch(`/api/saved-projects/${project.id}/publish`, { method: 'POST' });
      const data = await response.json();

      if (response.ok && data.success) {
        await fetchProjects(); // Refresh status before showing modal
        const cityProvince = [data.lead?.city, data.lead?.province].filter(Boolean).join(', ')
          || project.city && [project.city, project.province].filter(Boolean).join(', ')
          || '';
        setSuccessModal({
          leadId: data.lead?.id || project.postedAsLeadId || '',
          title: data.lead?.title || project.title,
          cityProvince,
        });
      } else {
        setErrorMsg(data.error || 'Failed to post project to job board. Please try again.');
      }
    } catch {
      setErrorMsg('Failed to post project to job board. Please try again.');
    } finally {
      setIsPosting(null);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto" />
        <p className="mt-4 text-slate-600">Loading your saved projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl border-2 border-dashed border-rose-200">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Saved Projects Yet</h3>
        <p className="text-slate-600 mb-6">Get an AI estimate or use the Create Job form to save projects here.</p>
        <a href="/" className="inline-block bg-[#800020] text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-shadow">
          Get Your First Estimate
        </a>
      </div>
    );
  }

  return (
    <>
      {/* Publish success modal */}
      {successModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="publish-modal-title"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSuccessModal(null)}
          />
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto overflow-hidden">
            {/* Burgundy top bar */}
            <div className="bg-[#800020] px-6 py-5 text-center">
              <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h2 id="publish-modal-title" className="text-xl font-black text-white tracking-tight">
                Your Project Is Live!
              </h2>
            </div>

            {/* Body */}
            <div className="px-6 py-5">
              <p className="text-slate-700 text-sm leading-relaxed mb-2">
                Your project has been posted to the QuoteXbert Job Board. Contractors are being notified now.
              </p>
              <div className="mt-3 space-y-1 text-sm text-slate-600">
                <p><span className="font-semibold text-slate-800">Project:</span> {successModal.title}</p>
                {successModal.cityProvince && (
                  <p><span className="font-semibold text-slate-800">Location:</span> 📍 {successModal.cityProvince}</p>
                )}
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                {successModal.leadId && (
                  <Link
                    href={`/homeowner/jobs/${successModal.leadId}`}
                    onClick={() => setSuccessModal(null)}
                    className="flex-1 bg-[#800020] text-white font-bold py-3 px-4 rounded-xl text-center text-sm hover:bg-[#600018] transition-colors"
                  >
                    View Posted Job
                  </Link>
                )}
                <button
                  onClick={() => setSuccessModal(null)}
                  className="flex-1 bg-slate-100 text-slate-700 font-semibold py-3 px-4 rounded-xl text-sm hover:bg-slate-200 transition-colors"
                >
                  Back to My Projects
                </button>
              </div>
            </div>

            {/* Close X */}
            <button
              onClick={() => setSuccessModal(null)}
              className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900">My Saved Projects ({projects.length})</h2>
        </div>

        {/* Inline feedback messages */}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-start gap-2">
            <X className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{errorMsg}</span>
            <button onClick={() => setErrorMsg('')} className="ml-auto text-red-500 hover:text-red-700 flex-shrink-0"><X className="w-4 h-4" /></button>
          </div>
        )}
        {deleteMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            {deleteMsg}
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map(project => {
            const photos = (() => { try { return JSON.parse(project.photos || '[]'); } catch { return []; } })();
            const vizImages = (() => { try { return JSON.parse(project.visualizerImages || '[]'); } catch { return []; } })();
            const allImages = [...photos, ...vizImages];
            const locationDisplay = [project.city, project.province].filter(Boolean).join(', ') || project.location || '';
            const isPublishing = isPosting === project.id;

            return (
              <div key={project.id} className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-rose-50">
                  {allImages.length > 0 ? (
                    <Image src={allImages[0]} alt={project.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl">🏠</div>
                  )}
                  {/* Status badge */}
                  <div className="absolute top-3 right-3">
                    {project.status === 'posted' ? (
                      <span className="bg-green-600 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Posted
                      </span>
                    ) : (
                      <span className="bg-orange-500 text-white px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Draft
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-2">{project.title}</h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{project.description}</p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2 py-0.5 rounded">{project.category}</span>
                    {locationDisplay && (
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded">📍 {locationDisplay}</span>
                    )}
                  </div>

                  {project.aiEstimate && (
                    <div className="bg-gradient-to-r from-rose-50 to-orange-50 rounded-lg p-2.5 mb-3 border border-rose-100">
                      <div className="text-xs font-semibold text-rose-700 mb-0.5">AI Estimate</div>
                      <div className="text-base font-bold text-slate-900">
                        ${project.aiEstimate.minCost.toLocaleString()} – ${project.aiEstimate.maxCost.toLocaleString()}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    {project.status !== 'posted' && (
                      <button
                        onClick={() => handlePostToBoard(project)}
                        disabled={isPublishing}
                        className="flex-1 bg-[#800020] text-white font-bold py-2 px-3 rounded-lg hover:bg-[#600018] text-sm flex items-center justify-center gap-1 disabled:opacity-50 transition-colors"
                      >
                        {isPublishing ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <>
                            <ArrowUpCircle className="w-4 h-4" />
                            Post to Board
                          </>
                        )}
                      </button>
                    )}
                    {project.status === 'posted' && project.postedAsLeadId && (
                      <Link
                        href={`/homeowner/jobs/${project.postedAsLeadId}`}
                        className="flex-1 bg-green-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-green-700 text-sm text-center transition-colors"
                      >
                        View Listing
                      </Link>
                    )}
                    <button
                      onClick={() => handleDelete(project)}
                      className="bg-red-50 text-red-500 p-2 rounded-lg hover:bg-red-100 border border-red-100 transition-colors"
                      title="Delete project"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}


