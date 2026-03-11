"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { useToast } from "@/components/ToastProvider";
import LoadingState from "@/components/ui/LoadingState";
import {
  ArrowLeft,
  Save,
  X,
  Upload,
  Image as ImageIcon
} from "lucide-react";

interface ProjectData {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  budget?: string;
  photos: string[];
  homeownerId: string;
}

const CATEGORIES = [
  "Kitchen Renovation",
  "Bathroom Renovation",
  "Basement Finishing",
  "Flooring",
  "Painting",
  "Roofing",
  "Windows & Doors",
  "Landscaping",
  "Electrical",
  "Plumbing",
  "HVAC",
  "General Contracting",
  "Other"
];

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  const { authUser, isSignedIn } = useAuth();
  const toast = useToast();
  
  const [project, setProject] = useState<ProjectData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    budget: "",
    photos: [] as string[]
  });

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
        const projectData = {
          ...data.savedProject,
          photos: JSON.parse(data.savedProject.photos || "[]")
        };
        
        setProject(projectData);
        setFormData({
          title: projectData.title || "",
          description: projectData.description || "",
          category: projectData.category || "",
          location: projectData.location || "",
          budget: projectData.budget || "",
          photos: projectData.photos || []
        });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error("Project title is required");
      return;
    }
    
    if (!formData.description.trim()) {
      toast.error("Project description is required");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/saved-projects/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success("Project updated successfully!");
        router.push(`/project/${params.id}`);
      } else {
        toast.error("Failed to update project");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("Failed to update project");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePhoto = (index: number) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600">This project may have been deleted or is no longer available.</p>
        </div>
      </div>
    );
  }

  // Check if user owns this project
  if (authUser?.id !== project.homeownerId && authUser?.role !== "admin") {
    router.push(`/project/${params.id}`);
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push(`/project/${params.id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Project</span>
          </button>
          
          <h1 className="text-3xl font-bold text-gray-900">Edit Project</h1>
          <p className="text-gray-600 mt-2">Update your renovation project details</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          {/* Project Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Kitchen Renovation"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              required
            >
              <option value="">Select a category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Toronto, ON"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          {/* Budget */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Budget Range
            </label>
            <input
              type="text"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="e.g., $5,000 - $10,000"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Project Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your renovation project in detail..."
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              {formData.description.length} characters
            </p>
          </div>

          {/* Existing Photos */}
          {formData.photos.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Project Photos
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {formData.photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={photo}
                      alt={`Project photo ${index + 1}`}
                      className="w-full aspect-square object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(index)}
                      className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push(`/project/${params.id}`)}
              disabled={isSaving}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-lg hover:from-rose-700 hover:to-orange-700 transition-all font-semibold shadow-md hover:shadow-lg disabled:opacity-50"
            >
              <Save className="w-5 h-5" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
