'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Plus, Edit, Pin, Eye, EyeOff, Calendar, MapPin, DollarSign, Clock, Heart, MessageCircle, Share2, MoreHorizontal } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  caption: string;
  projectType: string;
  beforeImages: string[];
  afterImages: string[];
  projectCost: string;
  duration: string;
  materials: string;
  location: string;
  clientStory: string;
  isPublic: boolean;
  isPinned: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function ContractorPortfolioPage() {
  const { user } = useAuth();
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (user && user.role === 'contractor') {
      fetchPortfolioItems();
    }
  }, [user]);

  const fetchPortfolioItems = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/contractors/portfolio?contractorId=${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setPortfolioItems(data);
      }
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (itemId: string, isPublic: boolean) => {
    try {
      const response = await fetch(`/api/contractors/portfolio/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPublic: !isPublic }),
      });

      if (response.ok) {
        await fetchPortfolioItems(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating visibility:', error);
    }
  };

  const togglePin = async (itemId: string, isPinned: boolean) => {
    try {
      const response = await fetch(`/api/contractors/portfolio/${itemId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isPinned: !isPinned }),
      });

      if (response.ok) {
        await fetchPortfolioItems(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating pin status:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (user?.role !== 'contractor') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">This page is only available to contractors.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-700 mx-auto mb-4"></div>
          <p>Loading your portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Portfolio</h1>
          <p className="text-gray-600 mt-2">Showcase your completed projects to attract new clients</p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {/* Stats */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-rose-700">{portfolioItems.length}</div>
            <div className="text-sm text-gray-600">Total Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{portfolioItems.filter(item => item.isPublic).length}</div>
            <div className="text-sm text-gray-600">Public Projects</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{portfolioItems.filter(item => item.isPinned).length}</div>
            <div className="text-sm text-gray-600">Pinned Projects</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Project Form Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-screen overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add New Project</h2>
                <Button variant="secondary" onClick={() => setShowAddForm(false)}>
                  Close
                </Button>
              </div>
              <p className="text-gray-600 mb-4">
                Create a portfolio post to showcase your work. This will be displayed on your profile and in job applications.
              </p>
              <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                <p className="text-gray-500">Portfolio form coming soon!</p>
                <p className="text-sm text-gray-400 mt-2">
                  This will include photo upload, project details, and social-style posting
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Portfolio Feed */}
      {portfolioItems.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Plus className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-600 mb-4">
              Start building your portfolio by adding your completed projects. Show potential clients your best work!
            </p>
            <Button onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Project
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Pinned items first */}
          {portfolioItems
            .filter(item => item.isPinned)
            .map((item) => (
              <PortfolioCard 
                key={item.id} 
                item={item} 
                onToggleVisibility={toggleVisibility}
                onTogglePin={togglePin}
              />
            ))}
          
          {/* Regular items */}
          {portfolioItems
            .filter(item => !item.isPinned)
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((item) => (
              <PortfolioCard 
                key={item.id} 
                item={item} 
                onToggleVisibility={toggleVisibility}
                onTogglePin={togglePin}
              />
            ))}
        </div>
      )}
    </div>
  );
}

function PortfolioCard({ 
  item, 
  onToggleVisibility, 
  onTogglePin 
}: { 
  item: PortfolioItem;
  onToggleVisibility: (id: string, isPublic: boolean) => void;
  onTogglePin: (id: string, isPinned: boolean) => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className={`${item.isPinned ? 'border-orange-200 bg-orange-50' : ''}`}>
      <CardHeader>
        <div className="flex justify-between items-start gap-3">
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              {item.isPinned && (
                <Badge variant="warning" size="sm">
                  <Pin className="w-3 h-3 mr-1" />
                  Pinned
                </Badge>
              )}
              <Badge variant="secondary" size="sm">{item.projectType}</Badge>
              {!item.isPublic && (
                <Badge variant="error" size="sm">
                  <EyeOff className="w-3 h-3 mr-1" />
                  Private
                </Badge>
              )}
            </div>
            <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
            {item.caption && (
              <p className="text-gray-600 mt-1">{item.caption}</p>
            )}
          </div>
          
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onToggleVisibility(item.id, item.isPublic)}
              className="p-2"
            >
              {item.isPublic ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onTogglePin(item.id, item.isPinned)}
              className="p-2"
            >
              <Pin className={`w-3.5 h-3.5 ${item.isPinned ? 'text-orange-600' : ''}`} />
            </Button>
            <Button variant="secondary" size="sm" className="p-2">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Project Images Placeholder */}
        <div className="bg-gray-200 rounded-lg h-64 mb-4 flex items-center justify-center">
          <p className="text-gray-500">Project Photos</p>
        </div>

        {/* Project Details */}
        <div className="grid md:grid-cols-2 gap-4 mb-4 text-sm">
          {item.duration && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>Duration: {item.duration}</span>
            </div>
          )}
          {item.projectCost && (
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-gray-500" />
              <span>Budget: ${item.projectCost}</span>
            </div>
          )}
          {item.location && (
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span>{item.location}</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <span>{formatDate(item.createdAt)}</span>
          </div>
        </div>

        {/* Description */}
        {item.description && (
          <div className="mb-4">
            <p className="text-gray-700">{item.description}</p>
          </div>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {item.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-rose-100 text-rose-900 px-2 py-1 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Client Story */}
        {item.clientStory && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-medium text-gray-900 mb-2">Client Feedback</h4>
            <p className="text-gray-700 text-sm italic">"{item.clientStory}"</p>
          </div>
        )}

        {/* Social Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-1 text-gray-500 hover:text-red-500">
              <Heart className="w-5 h-5" />
              <span className="text-sm">12</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-blue-500">
              <MessageCircle className="w-5 h-5" />
              <span className="text-sm">3</span>
            </button>
            <button className="flex items-center space-x-1 text-gray-500 hover:text-green-500">
              <Share2 className="w-5 h-5" />
              <span className="text-sm">Share</span>
            </button>
          </div>
          
          <Button variant="secondary" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}