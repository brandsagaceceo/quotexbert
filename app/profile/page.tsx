"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  User,
  MapPin,
  Phone,
  Globe,
  Clock,
  Mail,
  Star,
  Award,
  Camera,
  Edit3,
  Save,
  X,
  Plus,
  Briefcase,
  DollarSign,
  Edit,
  Trash
} from "lucide-react";

interface ProfileData {
  id: string;
  name?: string;
  email: string;
  role: string;
  phone?: string;
  city?: string;
  profilePhoto?: string;
  coverPhoto?: string;
  isEmailVerified?: boolean;
  companyName?: string;
  trade?: string;
  bio?: string;
  website?: string;
  verified?: boolean;
  avgRating?: number;
  reviewCount?: number;
  completedJobs?: number;
  totalJobs?: number;
  isActive?: boolean;
  serviceRadiusKm?: number;
}

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  projectType: string;
  projectCost?: string;
  duration?: string;
  location?: string;
  materials?: string;
  clientStory?: string;
  isPublic: boolean;
  isPinned: boolean;
  tags: string;
  createdAt: string;
  updatedAt: string;
}

interface JobData {
  id: string;
  title: string;
  status: string;
  budget: string;
  createdAt: string;
}

export default function UnifiedProfilePage() {
  const { isSignedIn, authUser, authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isUploading, setIsUploading] = useState(false);
  const [showPortfolioForm, setShowPortfolioForm] = useState(false);
  const [editingPortfolioItem, setEditingPortfolioItem] = useState<PortfolioItem | null>(null);
  const [editData, setEditData] = useState({
    companyName: '',
    trade: '',
    bio: '',
    city: '',
    phone: '',
    website: '',
    serviceRadiusKm: 25
  });

  useEffect(() => {
    const loadProfile = async () => {
      // Wait for auth to load
      if (authLoading) {
        console.log("[ProfilePage] Auth still loading...");
        setIsLoading(true);
        return;
      }

      // If not signed in, redirect
      if (!isSignedIn) {
        console.log("[ProfilePage] Not signed in, redirecting to sign-in");
        setIsLoading(false);
        router.push("/sign-in");
        return;
      }

      // Wait for authUser to be populated (it might be loading from API)
      if (!authUser) {
        console.log("[ProfilePage] Waiting for authUser...");
        setIsLoading(true);
        return;
      }

      console.log("[ProfilePage] Starting profile load for user:", authUser.id, "role:", authUser.role);
      setIsLoading(true);
      
      try {
        // Fetch the actual role from the server
        const roleResponse = await fetch('/api/user/role');
        const roleData = await roleResponse.json();
        console.log("[ProfilePage] Role API response:", roleData);
        
        // If no role found anywhere, redirect to onboarding
        if (!roleData.role && !authUser.role) {
          console.log("[ProfilePage] No role found, redirecting to onboarding");
          setIsLoading(false);
          router.push("/onboarding");
          return;
        }

        const userRole = roleData.role || authUser.role;

        // Create a basic profile from authUser
        const basicProfile: ProfileData = {
          id: authUser.id,
          email: authUser.email,
          name: authUser.name || authUser.email,
          role: userRole,
        };
        
        // Set the basic profile first so page can render
        setProfile(basicProfile);
        console.log("[ProfilePage] Set basicProfile:", basicProfile);
        
        // Fetch extended profile data in background
        try {
          const profileResponse = await fetch(`/api/profile?userId=${authUser.id}`);
          if (profileResponse.ok) {
            const profileData = await profileResponse.json();
            console.log("[ProfilePage] Loaded profileData:", profileData);
            setProfile(profileData);
            
            // Initialize edit data
            setEditData({
              companyName: profileData.companyName || '',
              trade: profileData.trade || '',
              bio: profileData.bio || '',
              city: profileData.city || '',
              phone: profileData.phone || '',
              website: profileData.website || '',
              serviceRadiusKm: profileData.serviceRadiusKm || 25
            });
          }
        } catch (error) {
          console.log("[ProfilePage] Error fetching extended profile, using basic profile");
        }

        // Fetch portfolio if contractor
        if (userRole === 'contractor') {
          try {
            const portfolioResponse = await fetch(`/api/contractors/portfolio?contractorId=${authUser.id}`);
            if (portfolioResponse.ok) {
              const portfolioData = await portfolioResponse.json();
              console.log("[ProfilePage] Loaded portfolioData:", portfolioData);
              setPortfolio(portfolioData || []);
            }
          } catch (error) {
            console.log("[ProfilePage] Portfolio not available yet");
          }

          // Fetch jobs
          try {
            const jobsResponse = await fetch(`/api/jobs?contractorId=${authUser.id}`);
            if (jobsResponse.ok) {
              const jobsData = await jobsResponse.json();
              console.log("[ProfilePage] Loaded jobsData:", jobsData);
              setJobs(jobsData.jobs?.slice(0, 5) || []);
            }
          } catch (error) {
            console.log("[ProfilePage] Jobs not available yet");
          }
        }
        
        console.log("[ProfilePage] Setting isLoading to false");
        setIsLoading(false);
      } catch (error) {
        console.error("[ProfilePage] Error loading profile:", error);
        setIsLoading(false);
      }
    };

    console.log("[ProfilePage] About to call loadProfile");
    loadProfile();
  }, [isSignedIn, authUser, authLoading, router]);

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authUser?.id,
          ...editData
        })
      });

      if (response.ok) {
        const body = await response.json();
        // API returns { success: true, profile: updatedUser }
        const updatedProfile = body?.profile ?? body;
        console.debug('[ProfilePage] Save response body:', body);
        setProfile(updatedProfile);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Upload file using our real upload API
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', authUser?.id || '');
      formData.append('type', 'profile');

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Upload failed');
      }

      const uploadResult = await uploadResponse.json();
      
      // Update profile with new photo URL
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authUser?.id,
          profilePhoto: uploadResult.url
        })
      });

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, profilePhoto: uploadResult.url } : null);
        alert('Profile picture updated successfully!');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert(`Failed to upload profile picture: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPortfolioItem = async (portfolioData: any) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractorId: profile?.id,
          ...portfolioData
        })
      });

      if (response.ok) {
        const newItem = await response.json();
        setPortfolio(prev => [newItem, ...prev]);
        setShowPortfolioForm(false);
        alert('Portfolio item added successfully!');
      } else {
        throw new Error('Failed to add portfolio item');
      }
    } catch (error) {
      console.error('Error adding portfolio item:', error);
      alert('Failed to add portfolio item. Please try again.');
    }
  };

  const handleEditPortfolioItem = async (id: string, portfolioData: any) => {
    try {
      const response = await fetch('/api/portfolio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...portfolioData })
      });

      if (response.ok) {
        const updatedItem = await response.json();
        setPortfolio(prev => prev.map(item => item.id === id ? updatedItem : item));
        setEditingPortfolioItem(null);
        alert('Portfolio item updated successfully!');
      } else {
        throw new Error('Failed to update portfolio item');
      }
    } catch (error) {
      console.error('Error updating portfolio item:', error);
      alert('Failed to update portfolio item. Please try again.');
    }
  };

  const handleDeletePortfolioItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this portfolio item?')) {
      return;
    }

    try {
      const response = await fetch(`/api/portfolio?id=${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setPortfolio(prev => prev.filter(item => item.id !== id));
        alert('Portfolio item deleted successfully!');
      } else {
        throw new Error('Failed to delete portfolio item');
      }
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      alert('Failed to delete portfolio item. Please try again.');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading auth... (v2)</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn || !authUser) {
    return null;
  }

  if (isLoading) {
    console.log("[ProfilePage RENDER] Showing loading spinner, isLoading:", isLoading);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-rose-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Setting up profile... (loading data)</p>
          <p className="text-xs text-gray-400 mt-2">Debug: authUser={authUser?.email}, isLoading={String(isLoading)}</p>
        </div>
      </div>
    );
  }

  console.log("[ProfilePage RENDER] Rendering main profile, profile:", profile);

  const displayName = profile?.companyName || profile?.name || authUser.email;
  const isContractor = authUser.role === 'contractor';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100">
      {/* Persistent Edit/Save Button - Top Right */}
      <div className="fixed top-24 right-6 md:top-28 md:right-8 z-50">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-rose-600 to-orange-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all flex items-center gap-2 shadow-xl text-sm md:text-base"
          >
            <Edit3 className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Edit Profile</span>
            <span className="sm:hidden">Edit</span>
          </button>
        ) : (
          <div className="flex flex-col sm:flex-row gap-2">
            <button
              onClick={handleSaveProfile}
              className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:shadow-lg flex items-center justify-center gap-2 shadow-xl text-sm md:text-base"
            >
              <Save className="h-3 w-3 md:h-4 md:w-4" />
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-slate-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-xl font-semibold hover:bg-slate-700 flex items-center justify-center gap-2 shadow-xl text-sm md:text-base"
            >
              <X className="h-3 w-3 md:h-4 md:w-4" />
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Cover Photo Section */}
      <div className="relative h-64 md:h-80 overflow-visible">
        {/* Cover Photo */}
        <div className="absolute inset-0 overflow-hidden">
          {profile?.coverPhoto ? (
            <img 
              src={profile.coverPhoto} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600">
              {/* Default cover with pattern */}
              <div className="absolute inset-0 opacity-20" style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              }}></div>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
        </div>

        {/* Cover Photo Edit Button */}
        {isEditing && (
          <div className="absolute top-4 right-4 z-10">
            <input
              type="file"
              id="coverPhotoInput"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    const base64String = reader.result as string;
                    setProfile(prev => prev ? { ...prev, coverPhoto: base64String } : prev);
                  };
                  reader.readAsDataURL(file);
                }
              }}
              className="hidden"
            />
            <button
              onClick={() => document.getElementById('coverPhotoInput')?.click()}
              className="bg-white/95 backdrop-blur-sm text-slate-900 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-lg hover:shadow-xl hover:scale-105 font-semibold border border-white/20"
            >
              <Camera className="h-5 w-5 text-rose-600" />
              Change Cover
            </button>
          </div>
        )}

        {/* Profile Info Container - Fixed positioning */}
        <div className="absolute -bottom-24 left-0 right-0">
          <div className="container mx-auto px-4 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              {/* Profile Picture */}
              <div className="relative group flex-shrink-0">
                <div className="relative w-40 h-40 md:w-48 md:h-48 rounded-2xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-rose-100 to-orange-100">
                  {profile?.profilePhoto ? (
                    <img 
                      src={profile.profilePhoto} 
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-600 to-orange-600">
                      <User className="h-20 w-20 text-white" />
                    </div>
                  )}
                  
                  {/* Edit overlay */}
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        id="profilePhotoInput"
                        accept="image/*"
                        onChange={handleProfilePictureUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => document.getElementById('profilePhotoInput')?.click()}
                        disabled={isUploading}
                        className="absolute inset-0 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer hover:bg-black/80"
                      >
                        {isUploading ? (
                          <div className="animate-spin rounded-full h-10 w-10 border-4 border-white border-t-transparent"></div>
                        ) : (
                          <>
                            <Camera className="h-10 w-10 text-white mb-2" />
                            <span className="text-white text-sm font-bold">Change Photo</span>
                          </>
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Profile Info */}
              <div className="flex-1 pb-6">
                <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 border border-slate-200">
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">{displayName}</h1>
                    <p className="text-rose-700 font-semibold text-lg capitalize mb-3">
                      {profile?.trade || authUser.role}
                    </p>
                    <div className="flex flex-wrap items-center gap-4 text-slate-600">
                      {profile?.city && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4 text-rose-600" />
                          <span>{profile.city}</span>
                        </div>
                      )}
                      {isContractor && profile?.verified && (
                        <div className="flex items-center gap-1 text-green-600">
                          <Award className="h-4 w-4" />
                          <span className="font-medium">Verified Contractor</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer for overlapping profile card */}
      <div className="h-32 md:h-36"></div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4">
          <nav className="flex space-x-8">
            {['overview', 'portfolio', 'jobs', 'contact'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-2 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-rose-600 text-rose-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === 'overview' && (
              <>
                {/* Bio Section */}
                <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-slate-900">About</h2>
                    {isEditing && (
                      <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-3 py-1 rounded-full">Editing Mode</span>
                    )}
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
                      className="w-full p-4 border-2 border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                      rows={5}
                      placeholder="Tell people about your experience, specialties, and what makes you unique..."
                    />
                  ) : (
                    <p className="text-slate-600 leading-relaxed text-base">
                      {profile?.bio || "No bio added yet. Click Edit Profile to add information about your experience and services."}
                    </p>
                  )}
                </div>

                {/* Stats Cards */}
                {isContractor && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                      <Briefcase className="h-8 w-8 text-rose-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{profile?.completedJobs || 0}</div>
                      <div className="text-sm text-gray-600">Completed Jobs</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                      <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{profile?.avgRating || 0}</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                      <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{profile?.reviewCount || 0}</div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'portfolio' && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Portfolio</h2>
                  <button 
                    onClick={() => setShowPortfolioForm(true)}
                    className="bg-gradient-to-r from-rose-600 to-orange-600 text-white px-5 py-3 rounded-xl hover:from-rose-700 hover:to-orange-700 flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                  >
                    <Plus className="h-5 w-5" />
                    Add Project
                  </button>
                </div>
                
                {portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolio.map((item) => (
                      <div key={item.id} className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                        {/* Project Image */}
                        <div className="relative h-64 overflow-hidden">
                          {item.imageUrl ? (
                            <img 
                              src={item.imageUrl} 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&q=80';
                              }}
                            />
                          ) : (
                            <img 
                              src='https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop&q=80' 
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                          )}
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          
                          {/* Project Type Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-sm text-rose-700 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                              {item.projectType}
                            </span>
                          </div>

                          {/* Edit/Delete buttons - show on hover */}
                          <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={() => setEditingPortfolioItem(item)}
                              className="bg-white/95 backdrop-blur-sm text-rose-600 p-2 rounded-full hover:bg-rose-600 hover:text-white transition-colors shadow-lg"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDeletePortfolioItem(item.id)}
                              className="bg-white/95 backdrop-blur-sm text-red-600 p-2 rounded-full hover:bg-red-600 hover:text-white transition-colors shadow-lg"
                            >
                              <Trash className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Project Details */}
                        <div className="p-5">
                          <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-1">{item.title}</h3>
                          <p className="text-sm text-slate-600 mb-4 line-clamp-2">{item.description}</p>
                          
                          {/* Project Stats */}
                          <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                            {item.projectCost && (
                              <div className="flex items-center gap-1 text-green-600 font-semibold">
                                <DollarSign className="h-4 w-4" />
                                <span className="text-sm">{item.projectCost}</span>
                              </div>
                            )}
                            {item.duration && (
                              <div className="text-xs text-slate-500 flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {item.duration}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-gradient-to-br from-slate-50 to-rose-50 rounded-2xl border-2 border-dashed border-slate-300">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-rose-100 to-orange-100 rounded-full mb-6">
                      <Camera className="h-10 w-10 text-rose-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-3">Showcase Your Best Work</h3>
                    <p className="text-slate-600 mb-6 max-w-md mx-auto">
                      {isContractor 
                        ? "Add photos and details of completed projects to attract more clients"
                        : "Share AI estimates and past projects you're proud of"}
                    </p>
                    <button 
                      onClick={() => setShowPortfolioForm(true)}
                      className="bg-gradient-to-r from-rose-600 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all inline-flex items-center gap-2"
                    >
                      <Camera className="h-5 w-5" />
                      Add Your First {isContractor ? "Project" : "Estimate"}
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Jobs</h2>
                
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-gray-900">{job.title}</h3>
                            <div className="flex items-center text-sm text-gray-600 mt-1">
                              <DollarSign className="h-4 w-4 mr-1" />
                              {job.budget}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            job.status === 'completed' ? 'bg-green-100 text-green-800' :
                            job.status === 'in-progress' ? 'bg-rose-100 text-rose-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {job.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs yet</h3>
                    <p className="text-gray-600">Start accepting jobs to build your work history.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'contact' && (
              <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 border border-slate-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-slate-900">Contact Information</h2>
                  {isEditing && (
                    <span className="text-xs text-rose-600 font-semibold bg-rose-50 px-3 py-1 rounded-full">Editing Mode</span>
                  )}
                </div>
                
                <div className="space-y-5">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Company Name</label>
                        <input
                          type="text"
                          value={editData.companyName || ''}
                          onChange={(e) => setEditData({...editData, companyName: e.target.value})}
                          className="w-full p-4 border-2 border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                          placeholder="Your Company Name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Trade/Specialty</label>
                        <input
                          type="text"
                          value={editData.trade}
                          onChange={(e) => setEditData({...editData, trade: e.target.value})}
                          className="w-full p-4 border-2 border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                          placeholder="e.g., General Contractor, Plumber, Electrician"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Phone</label>
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          className="w-full p-4 border-2 border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">City</label>
                        <input
                          type="text"
                          value={editData.city}
                          onChange={(e) => setEditData({...editData, city: e.target.value})}
                          className="w-full p-4 border-2 border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                          placeholder="Toronto"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2">Website</label>
                        <input
                          type="url"
                          value={editData.website}
                          onChange={(e) => setEditData({...editData, website: e.target.value})}
                          className="w-full p-4 border-2 border-rose-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all"
                          placeholder="https://yourwebsite.com"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
                          <Mail className="h-6 w-6 text-white" />
                        </div>
                        <div className="ml-4">
                          <p className="text-xs font-semibold text-slate-500 uppercase">Email</p>
                          <p className="text-base font-medium text-slate-900">{authUser.email}</p>
                        </div>
                      </div>
                      {profile?.phone ? (
                        <div className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
                            <Phone className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <p className="text-xs font-semibold text-slate-500 uppercase">Phone</p>
                            <p className="text-base font-medium text-slate-900">{profile.phone}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                          <Phone className="h-5 w-5 text-slate-400 mr-3" />
                          <span className="text-slate-500 italic">No phone number added</span>
                        </div>
                      )}
                      {profile?.website ? (
                        <div className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
                            <Globe className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-4 flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-500 uppercase">Website</p>
                            <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-base font-medium text-rose-600 hover:text-rose-700 hover:underline truncate block">
                              {profile.website}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                          <Globe className="h-5 w-5 text-slate-400 mr-3" />
                          <span className="text-slate-500 italic">No website added</span>
                        </div>
                      )}
                      {profile?.city ? (
                        <div className="flex items-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                          <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-rose-500 to-orange-500 rounded-xl flex items-center justify-center">
                            <MapPin className="h-6 w-6 text-white" />
                          </div>
                          <div className="ml-4">
                            <p className="text-xs font-semibold text-slate-500 uppercase">Location</p>
                            <p className="text-base font-medium text-slate-900">{profile.city}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center p-4 bg-slate-50 rounded-xl border-2 border-dashed border-slate-300">
                          <MapPin className="h-5 w-5 text-slate-400 mr-3" />
                          <span className="text-slate-500 italic">No location added</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Location */}
            {profile?.city && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Location</h3>
                <div className="flex items-center text-gray-700">
                  <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                  <span>{profile.city}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Form Modal */}
      {showPortfolioForm && (
        <PortfolioForm
          onSubmit={handleAddPortfolioItem}
          onCancel={() => setShowPortfolioForm(false)}
          userId={authUser?.id || ''}
        />
      )}

      {/* Portfolio Edit Modal */}
      {editingPortfolioItem && (
        <PortfolioForm
          onSubmit={(data) => handleEditPortfolioItem(editingPortfolioItem.id, data)}
          onCancel={() => setEditingPortfolioItem(null)}
          userId={authUser?.id || ''}
          initialData={editingPortfolioItem}
        />
      )}
    </div>
  );
}

// Portfolio Form Component
interface PortfolioFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  userId: string;
  initialData?: PortfolioItem;
}

function PortfolioForm({ onSubmit, onCancel, userId, initialData }: PortfolioFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
    projectType: initialData?.projectType || 'general',
    projectCost: initialData?.projectCost || '',
    duration: initialData?.duration || '',
    location: initialData?.location || '',
    materials: initialData?.materials || '',
    clientStory: initialData?.clientStory || '',
    imageUrl: initialData?.imageUrl || ''
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('userId', userId);
      formDataUpload.append('type', 'portfolio');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });

      if (response.ok) {
        const result = await response.json();
        setFormData(prev => ({ ...prev, imageUrl: result.url }));
      } else {
        alert('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Please enter a project title');
      return;
    }
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {initialData ? 'Edit Portfolio Item' : 'Add Portfolio Item'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Modern Kitchen Renovation"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Type
              </label>
              <select
                value={formData.projectType}
                onChange={(e) => setFormData(prev => ({ ...prev, projectType: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="general">General</option>
                <option value="kitchen">Kitchen</option>
                <option value="bathroom">Bathroom</option>
                <option value="flooring">Flooring</option>
                <option value="painting">Painting</option>
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
                <option value="outdoor">Outdoor</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project Cost
                </label>
                <input
                  type="text"
                  value={formData.projectCost}
                  onChange={(e) => setFormData(prev => ({ ...prev, projectCost: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., $5,000 - $10,000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 2 weeks"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Toronto, ON"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Describe the project details..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Materials Used
              </label>
              <input
                type="text"
                value={formData.materials}
                onChange={(e) => setFormData(prev => ({ ...prev, materials: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Oak flooring, granite countertops"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Client Story
              </label>
              <textarea
                value={formData.clientStory}
                onChange={(e) => setFormData(prev => ({ ...prev, clientStory: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                placeholder="What did the client say about this project?"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Project Photo
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {formData.imageUrl ? (
                  <div className="relative">
                    <img src={formData.imageUrl} alt="Project" className="w-full h-48 object-cover rounded" />
                  </div>
                ) : (
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="portfolioImageUpload"
                    />
                    <label
                      htmlFor="portfolioImageUpload"
                      className="cursor-pointer bg-gradient-to-r from-rose-600 to-orange-600 text-white px-4 py-2 rounded-lg hover:from-rose-700 hover:to-orange-700"
                    >
                      {uploading ? 'Uploading...' : 'Upload Photo'}
                    </label>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                type="button"
                onClick={onCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-lg hover:from-rose-700 hover:to-orange-700"
              >
                {initialData ? 'Update Project' : 'Add Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}