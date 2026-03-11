"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ToastProvider";
import LoadingState from "@/components/ui/LoadingState";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  DollarSign,
  Tag,
  MessageCircle,
  Users,
  CheckCircle2,
  Clock,
  Upload,
  ExternalLink
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProjectData {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  budget?: string;
  photos: string[];
  visualizerImages: string[];
  status: string;
  createdAt: string;
  updatedAt: string;
  homeownerId: string;
  postedAsLeadId?: string;
  aiEstimate?: {
    id: string;
    minCost: number;
    maxCost: number;
    confidence: number;
    items: Array<{
      id: string;
      category: string;
      description: string;
      minCost: number;
      maxCost: number;
    }>;
  };
  postedAsLead?: {
    id: string;
    status: string;
    applications?: Array<{ id: string }>;
    acceptances?: Array<{ id: string }>;
  };
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { authUser, isSignedIn } = useAuth();
  const toast = useToast();
  
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    
    if (params.id) {
      fetchProject();
    }
  }, [params.id, isSignedIn]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/saved-projects/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        
        // Parse JSON fields
        const parsedProject = {
          ...data.savedProject,
          photos: JSON.parse(data.savedProject.photos || "[]"),
          visualizerImages: JSON.parse(data.savedProject.visualizerImages || "[]"),
        };
        
        setProject(parsedProject);
      } else {
        toast.error("Project not found");
        router.push("/profile");
      }
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error("Failed to load project");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!project) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/saved-projects/${project.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Project deleted successfully");
        router.push("/profile");
      } else {
        toast.error("Failed to delete project");
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handlePostToBoard = async () => {
    if (!project) return;
    
    if (project.postedAsLeadId) {
      toast.info("This project is already posted to the job board");
      return;
    }

    try {
      const response = await fetch("/api/saved-projects/post-to-board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ savedProjectId: project.id }),
      });

      if (response.ok) {
        toast.success("Project posted to job board!");
        fetchProject(); // Refresh to get updated status
      } else {
        const data = await response.json();
        toast.error(data.error || "Failed to post project");
      }
    } catch (error) {
      console.error("Error posting project:", error);
      toast.error("Failed to post project");
    }
  };

  const handleMarkCompleted = async () => {
    if (!project) return;
    
    try {
      const response = await fetch(`/api/saved-projects/${project.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "completed" }),
      });

      if (response.ok) {
        toast.success("Project marked as completed!");
        fetchProject();
      } else {
        toast.error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">This project may have been deleted or is no longer available.</p>
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Profile
          </Link>
        </div>
      </div>
    );
  }

  const statusColor = {
    draft: "bg-gray-100 text-gray-800",
    saved: "bg-blue-100 text-blue-800",
    posted: "bg-green-100 text-green-800",
    completed: "bg-purple-100 text-purple-800",
    archived: "bg-gray-100 text-gray-600",
  }[project.status] || "bg-gray-100 text-gray-800";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            
            <div className="flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
              </span>
              
              {(authUser?.id === project.homeownerId || authUser?.role === "admin") && (
                <>
                  <Link
                    href={`/project/${project.id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Link>
                  
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Header */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{project.title}</h1>
              
              <div className="flex flex-wrap gap-4 mb-6">
                {project.category && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Tag className="w-5 h-5" />
                    <span className="font-medium">{project.category}</span>
                  </div>
                )}
                
                {project.location && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{project.location}</span>
                  </div>
                )}
                
                {project.budget && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <DollarSign className="w-5 h-5" />
                    <span className="font-semibold text-green-600">{project.budget}</span>
                  </div>
                )}
              </div>

              <div className="prose max-w-none">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{project.description}</p>
              </div>
            </div>

            {/* Photos */}
            {project.photos.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Project Photos</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.photos.map((photo, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                      <Image
                        src={photo}
                        alt={`Project photo ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Visualizer Images */}
            {project.visualizerImages.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">AI Visualizations</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.visualizerImages.map((image, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                      <Image
                        src={image}
                        alt={`AI visualization ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* AI Estimate Details */}
            {project.aiEstimate && (
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Cost Estimate Breakdown</h2>
                
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6 mb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Estimated Range</p>
                      <p className="text-3xl font-bold text-green-700">
                        ${project.aiEstimate.minCost.toLocaleString()} - ${project.aiEstimate.maxCost.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Confidence</p>
                      <p className="text-2xl font-bold text-green-600">{project.aiEstimate.confidence}%</p>
                    </div>
                  </div>
                </div>

                {project.aiEstimate.items.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-gray-900">Cost Breakdown</h3>
                    {project.aiEstimate.items.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-gray-900">{item.category}</p>
                            <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                          </div>
                          <div className="text-right ml-4">
                            <p className="font-semibold text-gray-900">
                              ${item.minCost.toLocaleString()} - ${item.maxCost.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Actions Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Project Actions</h3>
              
              <div className="space-y-3">
                {project.status !== "posted" && project.status !== "completed" && (
                  <button
                    onClick={handlePostToBoard}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all font-semibold shadow-md hover:shadow-lg"
                  >
                    <Upload className="w-5 h-5" />
                    Post to Job Board
                  </button>
                )}
                
                {project.postedAsLeadId && (
                  <Link
                    href={`/contractor/jobs`}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                  >
                    <ExternalLink className="w-5 h-5" />
                    View on Job Board
                  </Link>
                )}
                
                {project.status === "posted" && (
                  <button
                    onClick={handleMarkCompleted}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    <CheckCircle2 className="w-5 h-5" />
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Project Information</h3>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Created</p>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                  <div className="flex items-center gap-2 text-gray-900">
                    <Clock className="w-4 h-4" />
                    <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                  </div>
                </div>
                
                {project.postedAsLead && (
                  <>
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm text-gray-500 mb-1">Job Status</p>
                      <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                        {project.postedAsLead.status}
                      </span>
                    </div>
                    
                    {project.postedAsLead.applications && project.postedAsLead.applications.length > 0 && (
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Contractor Applications</p>
                        <div className="flex items-center gap-2 text-gray-900">
                          <Users className="w-4 h-4" />
                          <span className="font-semibold">{project.postedAsLead.applications.length} applications</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-3">Delete Project?</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{project.title}"? This action cannot be undone.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Project"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
