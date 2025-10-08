"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  User,
  MapPin,
  Camera,
  MessageSquare,
  Briefcase,
  CheckCircle,
  Plus,
  Wrench,
  Lightbulb,
  ArrowRight,
  Users,
  Target,
  Smartphone,
  Gift,
  Star,
  DollarSign,
  FileText
} from "lucide-react";

interface ProfileData {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  location?: string;
  profilePhoto?: string;
  isEmailVerified?: boolean;
  completionPercentage?: number;
  specialties?: string[];
  yearsExperience?: number;
  hourlyRate?: number;
  rating?: number;
  completedJobs?: number;
  bio?: string;
}

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  category: string;
  status: string;
  zipCode: string;
  createdAt: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  jobId: string;
  createdAt: string;
  read: boolean;
  job?: {
    title: string;
  };
}

interface Quote {
  id: string;
  jobId: string;
  amount: number;
  description: string;
  status: string;
  createdAt: string;
  job: {
    title: string;
  };
}

export default function ProfilePage() {
  const { isSignedIn, authUser, authLoading } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quotes, setQuotes] = useState<Quote[]>([]);

  // Profile form states
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [yearsExperience, setYearsExperience] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(0);

  useEffect(() => {
    if (authLoading) return;

    if (!isSignedIn || !authUser) {
      router.push("/sign-in");
      return;
    }

    // Fetch profile data
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        // Fetch user profile
        const profileResponse = await fetch(`/api/profile?userId=${authUser.id}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setProfile(profileData);
          setName(profileData.name || "");
          setPhone(profileData.phone || "");
          setLocation(profileData.location || "");
          setBio(profileData.bio || "");
          setSpecialties(profileData.specialties || []);
          setYearsExperience(profileData.yearsExperience || 0);
          setHourlyRate(profileData.hourlyRate || 0);
        }

        // Fetch jobs based on role
        if (authUser.role === "homeowner") {
          const jobsResponse = await fetch(`/api/jobs?homeownerId=${authUser.id}`);
          if (jobsResponse.ok) {
            const jobsData = await jobsResponse.json();
            setJobs(jobsData);
          }
        } else if (authUser.role === "contractor") {
          const jobsResponse = await fetch(`/api/jobs?contractorId=${authUser.id}`);
          if (jobsResponse.ok) {
            const jobsData = await jobsResponse.json();
            setJobs(jobsData);
          }
        }

        // Fetch messages
        const messagesResponse = await fetch(`/api/messages?userId=${authUser.id}`);
        if (messagesResponse.ok) {
          const messagesData = await messagesResponse.json();
          setMessages(messagesData);
        }

        // Fetch quotes for contractors
        if (authUser.role === "contractor") {
          const quotesResponse = await fetch(`/api/quotes?contractorId=${authUser.id}`);
          if (quotesResponse.ok) {
            const quotesData = await quotesResponse.json();
            setQuotes(quotesData);
          }
        } else if (authUser.role === "homeowner") {
          const quotesResponse = await fetch(`/api/quotes?homeownerId=${authUser.id}`);
          if (quotesResponse.ok) {
            const quotesData = await quotesResponse.json();
            setQuotes(quotesData);
          }
        }

      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [isSignedIn, authUser, authLoading, router]);

  const handleProfilePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !authUser) return;

    // For demo purposes, we'll just store a placeholder URL
    // In a real app, you'd upload to a cloud service
    const photoUrl = URL.createObjectURL(file);
    
    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authUser.id,
          profilePhoto: photoUrl,
        }),
      });

      if (response.ok) {
        setProfile(prev => prev ? { ...prev, profilePhoto: photoUrl } : null);
      }
    } catch (error) {
      console.error("Error updating profile photo:", error);
    }
  };

  const handleProfileUpdate = async () => {
    if (!authUser) return;

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authUser.id,
          name,
          phone,
          location,
          bio,
          specialties,
          yearsExperience,
          hourlyRate,
        }),
      });

      if (response.ok) {
        const updatedProfile = await response.json();
        setProfile(updatedProfile);
        alert("Profile updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const unreadMessagesCount = messages.filter(m => !m.read).length;
  const activeJobsCount = jobs.filter(j => j.status === "open" || j.status === "in_progress").length;
  const completedJobsCount = jobs.filter(j => j.status === "completed").length;
  const pendingQuotesCount = quotes.filter(q => q.status === "pending").length;

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isSignedIn || !authUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                    {profile?.profilePhoto ? (
                      <img 
                        src={profile.profilePhoto} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-8 w-8 text-gray-600" />
                    )}
                  </div>
                  <label className="absolute -bottom-1 -right-1 bg-blue-600 rounded-full p-1 cursor-pointer hover:bg-blue-700 transition-colors">
                    <Camera className="h-3 w-3 text-white" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {profile?.name || authUser.email}
                  </h1>
                  <p className="text-gray-600 capitalize">{authUser.role}</p>
                  {profile?.location && (
                    <div className="flex items-center text-sm text-gray-500 mt-1">
                      <MapPin className="h-4 w-4 mr-1" />
                      {profile.location}
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600">Profile Completion</div>
                <div className="text-2xl font-bold text-blue-600">
                  {profile?.completionPercentage || 45}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{activeJobsCount}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages</p>
                <p className="text-2xl font-bold text-gray-900">{unreadMessagesCount}</p>
              </div>
              <MessageSquare className="h-8 w-8 text-green-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedJobsCount}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {authUser.role === "contractor" ? "Quotes Sent" : "Quotes Received"}
                </p>
                <p className="text-2xl font-bold text-gray-900">{quotes.length}</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </div>
        </div>

        {/* Quick Actions for Homeowners */}
        {authUser.role === "homeowner" && (
          <div className="bg-white rounded-lg shadow-sm mb-8">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => router.push("/post-job")}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center">
                    <Plus className="h-6 w-6 text-blue-600 mr-3" />
                    <span className="font-medium text-gray-900">Post New Job</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </button>
                <button
                  onClick={() => router.push("/messages")}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-300 hover:bg-green-50 transition-colors"
                >
                  <div className="flex items-center">
                    <MessageSquare className="h-6 w-6 text-green-600 mr-3" />
                    <span className="font-medium text-gray-900">View Messages</span>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {["overview", "profile", "jobs", "messages", "quotes"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                    activeTab === tab
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {jobs.slice(0, 3).map((job) => (
                      <div key={job.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">{job.title}</p>
                          <p className="text-sm text-gray-600">${job.budget.toLocaleString()}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          job.status === "open" ? "bg-green-100 text-green-800" :
                          job.status === "in_progress" ? "bg-yellow-100 text-yellow-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {job.status.replace("_", " ")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {authUser.role === "homeowner" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Project Ideas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { title: "Kitchen Renovation", icon: Wrench, color: "blue" },
                        { title: "Bathroom Remodel", icon: Lightbulb, color: "green" },
                        { title: "Outdoor Deck", icon: Users, color: "purple" },
                        { title: "Home Security", icon: Target, color: "orange" }
                      ].map((idea, index) => (
                        <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors">
                          <div className="flex items-center mb-2">
                            <idea.icon className={`h-5 w-5 text-${idea.color}-600 mr-2`} />
                            <span className="font-medium text-gray-900">{idea.title}</span>
                          </div>
                          <p className="text-sm text-gray-600">Get quotes from verified contractors</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input
                        type="email"
                        value={authUser.email}
                        disabled
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {authUser.role === "contractor" && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience</label>
                        <input
                          type="number"
                          value={yearsExperience}
                          onChange={(e) => setYearsExperience(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
                        <input
                          type="number"
                          value={hourlyRate}
                          onChange={(e) => setHourlyRate(parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specialties</label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {specialties.map((specialty, index) => (
                          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                            {specialty}
                            <button
                              onClick={() => setSpecialties(specialties.filter((_, i) => i !== index))}
                              className="ml-2 text-blue-600 hover:text-blue-800"
                            >
                              ×
                            </button>
                          </span>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder="Add a specialty and press Enter"
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            const value = e.currentTarget.value.trim();
                            if (value && !specialties.includes(value)) {
                              setSpecialties([...specialties, value]);
                              e.currentTarget.value = "";
                            }
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </>
                )}

                <button
                  onClick={handleProfileUpdate}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Update Profile
                </button>
              </div>
            )}

            {/* Jobs Tab */}
            {activeTab === "jobs" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {authUser.role === "homeowner" ? "Your Jobs" : "Accepted Jobs"}
                </h3>
                <div className="space-y-4">
                  {jobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                          <p className="text-gray-600 mt-1">{job.description}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-sm text-gray-500">Budget: ${job.budget.toLocaleString()}</span>
                            <span className="text-sm text-gray-500">Category: {job.category}</span>
                            <span className="text-sm text-gray-500">Location: {job.zipCode}</span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          job.status === "open" ? "bg-green-100 text-green-800" :
                          job.status === "in_progress" ? "bg-yellow-100 text-yellow-800" :
                          job.status === "completed" ? "bg-blue-100 text-blue-800" :
                          "bg-gray-100 text-gray-800"
                        }`}>
                          {job.status.replace("_", " ")}
                        </span>
                      </div>
                    </div>
                  ))}
                  {jobs.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      {authUser.role === "homeowner" ? "No jobs posted yet." : "No jobs accepted yet."}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Messages Tab */}
            {activeTab === "messages" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Messages</h3>
                <div className="space-y-4">
                  {messages.slice(0, 5).map((message) => (
                    <div key={message.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="text-gray-900">{message.content}</p>
                          {message.job && (
                            <p className="text-sm text-gray-600 mt-1">
                              Re: {message.job.title}
                            </p>
                          )}
                          <p className="text-xs text-gray-500 mt-2">
                            {new Date(message.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        {!message.read && (
                          <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        )}
                      </div>
                    </div>
                  ))}
                  {messages.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No messages yet.</p>
                  )}
                </div>
              </div>
            )}

            {/* Quotes Tab */}
            {activeTab === "quotes" && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  {authUser.role === "contractor" ? "Quotes Sent" : "Quotes Received"}
                </h3>
                <div className="space-y-4">
                  {quotes.map((quote) => (
                    <div key={quote.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-medium text-gray-900">{quote.job.title}</h4>
                          <p className="text-gray-600 mt-1">{quote.description}</p>
                          <div className="flex items-center mt-2 space-x-4">
                            <span className="text-lg font-semibold text-green-600">
                              ${quote.amount.toLocaleString()}
                            </span>
                            <span className="text-sm text-gray-500">
                              {new Date(quote.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                          quote.status === "pending" ? "bg-yellow-100 text-yellow-800" :
                          quote.status === "accepted" ? "bg-green-100 text-green-800" :
                          "bg-red-100 text-red-800"
                        }`}>
                          {quote.status}
                        </span>
                      </div>
                    </div>
                  ))}
                  {quotes.length === 0 && (
                    <p className="text-gray-500 text-center py-8">
                      {authUser.role === "contractor" ? "No quotes sent yet." : "No quotes received yet."}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Coming Soon</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { title: "Mobile App", icon: Smartphone, desc: "iOS & Android apps" },
                { title: "Referral Program", icon: Gift, desc: "Earn rewards for referrals" },
                { title: "Reviews & Ratings", icon: Star, desc: "Rate your experience" },
                { title: "Payment Integration", icon: DollarSign, desc: "Secure online payments" }
              ].map((feature, index) => (
                <div key={index} className="text-center p-4 border border-gray-200 rounded-lg">
                  <feature.icon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <h4 className="font-medium text-gray-900">{feature.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}