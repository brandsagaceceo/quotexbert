"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Trash, Edit, Upload, CheckCircle2, Clock, ArrowUpCircle } from 'lucide-react';

interface SavedProject {
  id: string;
  title: string;
  description: string;
  category: string;
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

interface SavedProjectsProps {
  homeownerId: string;
}

export default function SavedProjectsList({ homeownerId }: SavedProjectsProps) {
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<SavedProject | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, [homeownerId]);

  const fetchProjects = async () => {
    try {
      const response = await fetch(`/api/saved-projects?homeownerId=${homeownerId}`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.savedProjects || []);
      }
    } catch (error) {
      console.error('Error fetching saved projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this saved project?')) return;

    try {
      const response = await fetch(`/api/saved-projects?id=${projectId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setProjects(prev => prev.filter(p => p.id !== projectId));
        alert('Project deleted successfully');
      } else {
        alert('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete project');
    }
  };

  const handlePostToBoard = async (project: SavedProject) => {
    if (!confirm(`Post "${project.title}" to the job board?`)) return;

    setIsPosting(true);
    try {
      const response = await fetch('/api/saved-projects/post-to-board', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ savedProjectId: project.id })
      });

      const data = await response.json();

      if (response.ok) {
        alert('✅ Project posted to job board successfully!');
        fetchProjects(); // Refresh to show updated status
      } else {
        alert(data.error || 'Failed to post project to job board');
      }
    } catch (error) {
      console.error('Error posting to board:', error);
      alert('Failed to post project to job board');
    } finally {
      setIsPosting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600 mx-auto"></div>
        <p className="mt-4 text-slate-600">Loading your saved projects...</p>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl border-2 border-dashed border-rose-200">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">No Saved Projects Yet</h3>
        <p className="text-slate-600 mb-6">
          Create an AI estimate to automatically save it here!
        </p>
        <a
          href="/"
          className="inline-block bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold py-3 px-6 rounded-lg hover:shadow-lg transition-shadow"
        >
          Get Your First Estimate
        </a>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-slate-900">
          My Saved Projects ({projects.length})
        </h2>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map(project => {
          const photos = JSON.parse(project.photos || '[]');
          const visualizerImages = JSON.parse(project.visualizerImages || '[]');
          const allImages = [...photos, ...visualizerImages];

          return (
            <div
              key={project.id}
              className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Project Image */}
              <div className="relative h-48 bg-gradient-to-br from-rose-100 to-orange-100">
                {allImages.length > 0 ? (
                  <Image
                    src={allImages[0]}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-6xl">
                    🏠
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-3 right-3">
                  {project.status === 'posted' ? (
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Posted
                    </div>
                  ) : (
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Draft
                    </div>
                  )}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2">
                  {project.title}
                </h3>
                <p className="text-sm text-slate-600 mb-3 line-clamp-3">
                  {project.description}
                </p>

                {/* Category & Location */}
                <div className="flex flex-wrap gap-2 mb-3">
                  <span className="bg-rose-100 text-rose-700 text-xs font-semibold px-2 py-1 rounded">
                    {project.category}
                  </span>
                  {project.location && (
                    <span className="bg-slate-100 text-slate-700 text-xs font-semibold px-2 py-1 rounded">
                      📍 {project.location}
                    </span>
                  )}
                </div>

                {/* AI Estimate */}
                {project.aiEstimate && (
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-3 mb-3 border border-purple-200">
                    <div className="text-xs font-semibold text-purple-700 mb-1">
                      AI Estimate
                    </div>
                    <div className="text-lg font-bold text-slate-900">
                      ${project.aiEstimate.minCost.toLocaleString()} - ${project.aiEstimate.maxCost.toLocaleString()}
                    </div>
                    <div className="text-xs text-slate-600">
                      {project.aiEstimate.confidence}% confidence
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {project.status === 'draft' && (
                    <button
                      onClick={() => handlePostToBoard(project)}
                      disabled={isPosting}
                      className="flex-1 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold py-2 px-3 rounded-lg hover:shadow-lg transition-shadow text-sm flex items-center justify-center gap-1 disabled:opacity-50"
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      Post to Board
                    </button>
                  )}

                  {project.status === 'posted' && project.postedAsLeadId && (
                    <a
                      href={`/leads/${project.postedAsLeadId}`}
                      className="flex-1 bg-green-600 text-white font-bold py-2 px-3 rounded-lg hover:bg-green-700 transition-colors text-sm text-center"
                    >
                      View Listing
                    </a>
                  )}

                  <button
                    onClick={() => handleDelete(project.id)}
                    className="bg-red-100 text-red-600 p-2 rounded-lg hover:bg-red-200 transition-colors"
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
  );
}
