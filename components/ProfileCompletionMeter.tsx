'use client';

import { CheckCircle2, Circle } from 'lucide-react';

interface ProfileCompletionProps {
  profile: {
    profilePhoto?: string;
    bio?: string;
    trade?: string;
    city?: string;
    phone?: string;
    website?: string;
    companyName?: string;
  };
  isContractor: boolean;
}

export default function ProfileCompletionMeter({ profile, isContractor }: ProfileCompletionProps) {
  const requiredFields = isContractor ? [
    { key: 'profilePhoto', label: 'Profile photo', completed: !!profile.profilePhoto },
    { key: 'companyName', label: 'Company name', completed: !!profile.companyName },
    { key: 'trade', label: 'Trade/specialty', completed: !!profile.trade },
    { key: 'city', label: 'Service area', completed: !!profile.city },
    { key: 'bio', label: 'Bio', completed: !!profile.bio },
    { key: 'phone', label: 'Phone number', completed: !!profile.phone },
  ] : [
    { key: 'profilePhoto', label: 'Profile photo', completed: !!profile.profilePhoto },
    { key: 'city', label: 'Location', completed: !!profile.city },
    { key: 'phone', label: 'Phone number', completed: !!profile.phone },
  ];

  const completed = requiredFields.filter(f => f.completed).length;
  const total = requiredFields.length;
  const percentage = Math.round((completed / total) * 100);

  if (percentage === 100) {
    return null; // Don't show when complete
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">Complete Your Profile</h3>
        <span className="text-sm font-medium text-rose-700">{percentage}%</span>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
        <div 
          className="bg-gradient-to-r from-rose-700 to-orange-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <div className="space-y-2">
        {requiredFields.filter(f => !f.completed).slice(0, 3).map((field) => (
          <div key={field.key} className="flex items-center gap-2 text-sm text-gray-600">
            <Circle className="w-4 h-4 text-gray-400" />
            <span>Add {field.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
