"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface PortfolioItem {
  id: string;
  title: string;
  caption?: string;
  imageUrl: string;
  createdAt: string;
}

export default function PortfolioManagementPage() {
  const { authUser: user, authLoading } = useAuth();
  const router = useRouter();
  
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    file: null as File | null,
  });

  useEffect(() => {
    if (!authLoading && user) {
      // Check if user is a contractor
      const role = user.role;
      if (role !== "contractor") {
        router.push("/");
        return;
      }

      fetchPortfolio();
    }
  }, [authLoading, user, router]);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      // Get contractor profile first to get the contractor ID
      const profileResponse = await fetch(`/api/contractors/profile?userId=${user?.id}`);
      if (!profileResponse.ok) {
        throw new Error("Profile not found");
      }
      
      const profileData = await profileResponse.json();
      const contractorId = profileData.profile.id;
      
      // Fetch portfolio items
      const portfolioResponse = await fetch(`/api/contractors/portfolio?contractorId=${contractorId}`);
      if (portfolioResponse.ok) {
        const portfolioData = await portfolioResponse.json();
        setPortfolioItems(portfolioData.portfolioItems || []);
      }
    } catch (err) {
      setError("Failed to load portfolio");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be less than 5MB");
        return;
      }
      
      setFormData(prev => ({ ...prev, file }));
      setError(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const uploadToCloudinary = async (file: File): Promise<string> => {
    // In a real implementation, you would upload to your preferred service
    // For now, this is a placeholder that would integrate with your S3 upload utility
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "portfolio_uploads"); // Configure in Cloudinary
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    
    if (!response.ok) {
      throw new Error("Failed to upload image");
    }
    
    const data = await response.json();
    return data.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file || !formData.title) {
      setError("Please provide a title and select an image");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Upload image first
      // For demo purposes, we'll use a placeholder URL
      // In production, integrate with your S3 upload utility
      const imageUrl = `https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=400&h=300&fit=crop`;
      
      // Create portfolio item
      const response = await fetch("/api/contractors/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          caption: formData.caption,
          imageUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add portfolio item");
      }

      const data = await response.json();
      setPortfolioItems(prev => [data.portfolioItem, ...prev]);
      
      // Reset form
      setFormData({
        title: "",
        caption: "",
        file: null,
      });
      setShowForm(false);
      
      // Reset file input
      const fileInput = document.getElementById("file") as HTMLInputElement;
      if (fileInput) fileInput.value = "";
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add portfolio item");
    } finally {
      setUploading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-900 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="animate-pulse">
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="h-8 bg-gray-700 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-gray-700 rounded-lg overflow-hidden">
                    <div className="h-48 bg-gray-600"></div>
                    <div className="p-4">
                      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-gray-800 rounded-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-white">Portfolio Management</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              {showForm ? "Cancel" : "Add New Item"}
            </button>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Add New Item Form */}
          {showForm && (
            <div className="bg-gray-700 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-bold text-white mb-6">Add Portfolio Item</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Project title (e.g., 'Kitchen Renovation', 'Bathroom Remodel')"
                  />
                </div>

                <div>
                  <label htmlFor="caption" className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    id="caption"
                    name="caption"
                    value={formData.caption}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Brief description of the project, materials used, challenges overcome..."
                  />
                </div>

                <div>
                  <label htmlFor="file" className="block text-sm font-medium text-gray-300 mb-2">
                    Image *
                  </label>
                  <input
                    type="file"
                    id="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    className="w-full bg-gray-600 border border-gray-500 rounded-lg px-4 py-3 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Max file size: 5MB. Supported formats: JPG, PNG, WebP
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={uploading}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    {uploading ? "Uploading..." : "Add to Portfolio"}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Portfolio Grid */}
          {portfolioItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-300 mb-2">No portfolio items yet</h3>
              <p className="text-gray-400 mb-6">
                Start building your portfolio by adding photos of your best work.
              </p>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Add Your First Item
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolioItems.map((item) => (
                <div key={item.id} className="bg-gray-700 rounded-lg overflow-hidden group">
                  <div className="relative h-48">
                    <Image
                      src={item.imageUrl}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-2 line-clamp-1">
                      {item.title}
                    </h3>
                    {item.caption && (
                      <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                    <p className="text-gray-500 text-xs">
                      Added {formatDate(item.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
