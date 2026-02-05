'use client';

import { User, MapPin, Mail, Phone, Globe, Award, Edit3, Save, X, Camera } from 'lucide-react';
import { useState } from 'react';

interface ProfileHeaderProps {
  profile: {
    id: string;
    name?: string;
    email: string;
    role: string;
    profilePhoto?: string;
    companyName?: string;
    trade?: string;
    city?: string;
    phone?: string;
    website?: string;
    verified?: boolean;
  };
  isEditing: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isUploading: boolean;
}

export default function ProfileHeader({
  profile,
  isEditing,
  onEditToggle,
  onSave,
  onPhotoUpload,
  isUploading
}: ProfileHeaderProps) {
  const displayName = profile.companyName || profile.name || profile.email;
  const isContractor = profile.role === 'contractor';

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0 group">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-rose-100 to-orange-100 border-2 border-white shadow-md">
              {profile.profilePhoto ? (
                <img 
                  src={profile.profilePhoto} 
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-700 to-orange-600">
                  <User className="w-10 h-10 md:w-12 md:h-12 text-white" />
                </div>
              )}
              
              {isEditing && (
                <>
                  <input
                    type="file"
                    id="profilePhotoInput"
                    accept="image/*"
                    onChange={onPhotoUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => document.getElementById('profilePhotoInput')?.click()}
                    disabled={isUploading}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent"></div>
                    ) : (
                      <>
                        <Camera className="w-6 h-6 text-white mb-1" />
                        <span className="text-white text-xs font-medium">Change</span>
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                  {displayName}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-900 capitalize">
                    {profile.trade || profile.role}
                  </span>
                  {isContractor && profile.verified && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <Award className="w-3 h-3" />
                      Verified
                    </span>
                  )}
                </div>
              </div>

              {/* Edit/Save buttons - inline with header */}
              <div className="flex-shrink-0">
                {!isEditing ? (
                  <button
                    onClick={onEditToggle}
                    className="touch-target px-4 py-2 bg-gradient-to-r from-rose-700 to-orange-600 text-white rounded-lg font-medium text-sm hover:from-rose-800 hover:to-orange-700 transition-all flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={onSave}
                      className="touch-target px-4 py-2 bg-green-600 text-white rounded-lg font-medium text-sm hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={onEditToggle}
                      className="touch-target px-4 py-2 bg-gray-600 text-white rounded-lg font-medium text-sm hover:bg-gray-700 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Contact info - with ellipsis for overflow */}
            <div className="space-y-1.5 text-sm text-gray-600">
              {profile.city && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 flex-shrink-0 text-rose-700" />
                  <span className="truncate">{profile.city}</span>
                </div>
              )}
              {profile.email && (
                <div className="flex items-center gap-1.5">
                  <Mail className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{profile.email}</span>
                </div>
              )}
              {profile.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <span className="truncate">{profile.phone}</span>
                </div>
              )}
              {profile.website && (
                <div className="flex items-center gap-1.5">
                  <Globe className="w-4 h-4 flex-shrink-0 text-gray-400" />
                  <a 
                    href={profile.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="truncate hover:text-rose-700 transition-colors"
                  >
                    {profile.website.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
