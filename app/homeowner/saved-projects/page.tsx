// /homeowner/saved-projects — Private saved project drafts for homeowners
"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, Sparkles, BookOpen, Upload, Trash2, ExternalLink } from "lucide-react";

interface SavedProject {
  id: string;
  title: string;
  description: string;
  category: string;
  city: string | null;
  province: string | null;
  zipCode: string | null;
  location: string | null;
  budget: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  postedAsLeadId: string | null;
  postedAsLead: {
    id: string;
    title: string;
    status: string;
  } | null;
}

export default function SavedProjectsPage() {
  const { authUser: user, isSignedIn } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    if (user && user.role !== "homeowner") {
      router.push("/");
      return;
    }
    if (user) fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isSignedIn]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/saved-projects");
      const data = await res.json();
      if (data.success) {
        setProjects(data.savedProjects || []);
      } else {
        setError(data.error || "Failed to load saved projects.");
      }
    } catch {
      setError("Network error loading projects.");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (project: SavedProject) => {
    setError("");
    setMessage("");

    const city = project.city || project.location?.split(",")[0]?.trim() || "";
    const province = project.province || project.location?.split(",")[1]?.trim() || "";

    if (!city || !province) {
      setError(`"${project.title}" is missing city/province. Edit the project first, then publish.`);
      return;
    }

    setPublishing(project.id);
    try {
      const res = await fetch(`/api/saved-projects/${project.id}/publish`, { method: "POST" });
      const data = await res.json();

      if (res.ok && data.success) {
        if (data.alreadyPublished) {
          setMessage(`"${project.title}" is already live on the job board.`);
        } else {
          setMessage(`"${project.title}" has been posted! Contractors will be notified.`);
        }
        await fetchProjects();
      } else {
        setError(data.error || "Failed to publish project.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPublishing(null);
    }
  };

  const handleDelete = async (project: SavedProject) => {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;

    setDeleting(project.id);
    setError("");
    try {
      const res = await fetch(`/api/saved-projects/${project.id}`, { method: "DELETE" });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== project.id));
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete project.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setDeleting(null);
    }
  };

  const displayLocation = (p: SavedProject) => {
    if (p.city && p.province) return `${p.city}, ${p.province}`;
    if (p.city) return p.city;
    if (p.location) return p.location;
    return null;
  };

  const statusBadge = (status: string) => {
    if (status === "posted") return <span className="inline-flex items-center gap-1 text-xs font-semibold bg-green-100 text-green-800 px-2.5 py-0.5 rounded-full">Live on Job Board</span>;
    if (status === "archived") return <span className="inline-flex items-center gap-1 text-xs font-semibold bg-gray-100 text-gray-600 px-2.5 py-0.5 rounded-full">Archived</span>;
    return <span className="inline-flex items-center gap-1 text-xs font-semibold bg-amber-100 text-amber-800 px-2.5 py-0.5 rounded-full">Draft</span>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#800020]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Saved Projects</h1>
            <p className="text-sm text-gray-500 mt-1">Drafts saved privately to your profile. Post to the job board when ready.</p>
          </div>
          <Link
            href="/create-lead"
            className="inline-flex items-center gap-2 bg-[#800020] text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-[#600018] transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-800 rounded-xl text-sm font-medium">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm font-medium">
            {error}
          </div>
        )}

        {/* Empty state */}
        {projects.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-gray-700 mb-2">No saved projects yet</h2>
            <p className="text-gray-500 text-sm mb-6">Save your project idea privately, then post it to the job board when you&apos;re ready.</p>
            <Link
              href="/create-lead"
              className="inline-flex items-center gap-2 bg-[#800020] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#600018] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Project
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                      {statusBadge(project.status)}
                    </div>

                    <p className="text-sm text-gray-500 line-clamp-2 mb-2">{project.description}</p>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                      {project.category && (
                        <span className="bg-gray-100 px-2 py-0.5 rounded-full">{project.category}</span>
                      )}
                      {displayLocation(project) && (
                        <span>{displayLocation(project)}</span>
                      )}
                      {project.budget && (
                        <span className="text-green-700 font-medium">{project.budget}</span>
                      )}
                      <span>Saved {new Date(project.updatedAt).toLocaleDateString()}</span>
                    </div>

                    {project.postedAsLead && (
                      <Link
                        href={`/homeowner/jobs/${project.postedAsLead.id}`}
                        className="inline-flex items-center gap-1 mt-2 text-xs text-[#800020] font-medium hover:underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        View live listing
                      </Link>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-2 flex-shrink-0">
                    {project.status !== "posted" && (
                      <button
                        onClick={() => handlePublish(project)}
                        disabled={publishing === project.id || deleting === project.id}
                        className="inline-flex items-center gap-1.5 bg-[#800020] text-white text-xs font-semibold px-3 py-2 rounded-lg hover:bg-[#600018] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {publishing === project.id ? (
                          <>
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                            Posting...
                          </>
                        ) : (
                          <>
                            <Upload className="w-3 h-3" />
                            Post to Board
                          </>
                        )}
                      </button>
                    )}
                    {project.status === "posted" && (
                      <button
                        onClick={() => handlePublish(project)}
                        disabled
                        className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 text-xs font-semibold px-3 py-2 rounded-lg cursor-default"
                      >
                        <Sparkles className="w-3 h-3" />
                        Posted
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(project)}
                      disabled={deleting === project.id || publishing === project.id}
                      className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-600 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-red-50 hover:text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {deleting === project.id ? (
                        <div className="animate-spin rounded-full h-3 w-3 border-b border-gray-500"></div>
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                      Delete
                    </button>
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
