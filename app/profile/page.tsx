"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  User,
  MapPin,
  Phone,
  Globe,
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
    if (authLoading) return;

    if (!isSignedIn || !authUser) {
      router.push("/sign-in");
      return;
    }

    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch profile
        const profileResponse = await fetch(`/api/profile?userId=${authUser.id}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
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

        // Fetch portfolio if contractor
        if (authUser.role === 'contractor') {
          try {
            const portfolioResponse = await fetch(`/api/contractors/portfolio?contractorId=${authUser.id}`);
            if (portfolioResponse.ok) {
              const portfolioData = await portfolioResponse.json();
              setPortfolio(portfolioData || []);
            }
          } catch (error) {
            console.log("Portfolio not available yet");
          }

          // Fetch jobs
          try {
            const jobsResponse = await fetch(`/api/jobs?contractorId=${authUser.id}`);
            if (jobsResponse.ok) {
              const jobsData = await jobsResponse.json();
              setJobs(jobsData.jobs?.slice(0, 5) || []);
            }
          } catch (error) {
            console.log("Jobs not available yet");
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
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
        const updatedProfile = await response.json();
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

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isSignedIn || !authUser || !profile) {
    return null;
  }

  const displayName = profile.companyName || profile.name || authUser.email;
  const isContractor = authUser.role === 'contractor';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header/Cover Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 h-64">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative container mx-auto px-4 h-full flex items-end pb-6">
          <div className="flex items-end space-x-6">
            {/* Profile Photo */}
            <div className="relative">
              <div className="w-32 h-32 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center overflow-hidden">
                {profile.profilePhoto ? (
                  <img 
                    src={profile.profilePhoto} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-16 w-16 text-gray-400" />
                )}
              </div>
              <input
                type="file"
                id="profilePictureInput"
                accept="image/*"
                onChange={handleProfilePictureUpload}
                className="hidden"
              />
              <button 
                onClick={() => document.getElementById('profilePictureInput')?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white p-2 rounded-full shadow-lg transition-colors"
              >
                {isUploading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                ) : (
                  <Camera className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {/* Basic Info */}
            <div className="text-white mb-4">
              <h1 className="text-3xl font-bold">{displayName}</h1>
              <p className="text-blue-100 capitalize text-lg">{profile.trade || authUser.role}</p>
              {profile.city && (
                <div className="flex items-center mt-2 text-blue-100">
                  <MapPin className="h-4 w-4 mr-1" />
                  {profile.city}
                </div>
              )}
              {isContractor && profile.verified && (
                <div className="flex items-center mt-2 text-green-300">
                  <Award className="h-4 w-4 mr-1" />
                  Verified Contractor
                </div>
              )}
            </div>
          </div>
          
          {/* Edit Button */}
          <div className="ml-auto mb-4">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 flex items-center"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit Profile
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveProfile}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 flex items-center"
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

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
                    ? 'border-blue-600 text-blue-600'
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
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
                  {isEditing ? (
                    <textarea
                      value={editData.bio}
                      onChange={(e) => setEditData({...editData, bio: e.target.value})}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={4}
                      placeholder="Tell people about your experience, specialties, and what makes you unique..."
                    />
                  ) : (
                    <p className="text-gray-600">
                      {profile.bio || "No bio added yet. Click Edit Profile to add information about your experience and services."}
                    </p>
                  )}
                </div>

                {/* Stats Cards */}
                {isContractor && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                      <Briefcase className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{profile.completedJobs || 0}</div>
                      <div className="text-sm text-gray-600">Completed Jobs</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                      <Star className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{profile.avgRating || 0}</div>
                      <div className="text-sm text-gray-600">Average Rating</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                      <Award className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900">{profile.reviewCount || 0}</div>
                      <div className="text-sm text-gray-600">Reviews</div>
                    </div>
                  </div>
                )}
              </>
            )}

            {activeTab === 'portfolio' && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Portfolio</h2>
                  <button 
                    onClick={() => setShowPortfolioForm(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Project
                  </button>
                </div>
                
                {portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {portfolio.map((item) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg overflow-hidden">
                        <img 
                          src={item.imageUrl || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop'} 
                          alt={item.title}
                          className="w-full h-48 object-cover"
                        />
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900">{item.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                              {item.projectCost && (
                                <p className="text-sm font-medium text-green-600 mt-2">{item.projectCost}</p>
                              )}
                              {item.duration && (
                                <p className="text-xs text-gray-500">{item.duration}</p>
                              )}
                              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                                {item.projectType}
                              </span>
                            </div>
                            <div className="flex space-x-2 ml-4">
                              <button
                                onClick={() => setEditingPortfolioItem(item)}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePortfolioItem(item.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items yet</h3>
                    <p className="text-gray-600">Showcase your best work by adding photos and descriptions of completed projects.</p>
                    <button 
                      onClick={() => setShowPortfolioForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4"
                    >
                      Add Your First Project
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
                            job.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
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
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                
                <div className="space-y-4">
                  {isEditing ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={editData.companyName}
                          onChange={(e) => setEditData({...editData, companyName: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Trade/Specialty</label>
                        <input
                          type="text"
                          value={editData.trade}
                          onChange={(e) => setEditData({...editData, trade: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => setEditData({...editData, phone: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input
                          type="text"
                          value={editData.city}
                          onChange={(e) => setEditData({...editData, city: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                        <input
                          type="url"
                          value={editData.website}
                          onChange={(e) => setEditData({...editData, website: e.target.value})}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center text-gray-600">
                        <Mail className="h-5 w-5 mr-3" />
                        {authUser.email}
                      </div>
                      {profile.phone && (
                        <div className="flex items-center text-gray-600">
                          <Phone className="h-5 w-5 mr-3" />
                          {profile.phone}
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center text-gray-600">
                          <Globe className="h-5 w-5 mr-3" />
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {profile.website}
                          </a>
                        </div>
                      )}
                      {profile.city && (
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-5 w-5 mr-3" />
                          {profile.city}
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
            {profile.city && (
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
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
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
                      className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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