"use client";

import { Shield, Star, Sparkles, MapPin } from "lucide-react";

interface TrustBadgesProps {
  variant?: "horizontal" | "vertical" | "compact";
  showAll?: boolean;
}

export function TrustBadges({ variant = "horizontal", showAll = true }: TrustBadgesProps) {
  const badges = [
    {
      icon: Shield,
      label: "Verified Contractors",
      description: "Background-checked professionals",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: Star,
      label: "Real Reviews",
      description: "Authentic homeowner feedback",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Sparkles,
      label: "AI Estimates",
      description: "Instant accurate pricing",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: MapPin,
      label: "Toronto Focused",
      description: "Local GTA marketplace",
      color: "text-rose-600",
      bgColor: "bg-rose-50",
    },
  ];

  if (variant === "compact") {
    return (
      <div className="flex flex-wrap gap-2 justify-center">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className={`flex items-center gap-2 ${badge.bgColor} px-3 py-1.5 rounded-full`}
            >
              <Icon className={`w-4 h-4 ${badge.color}`} />
              <span className="text-xs font-semibold text-gray-700">
                {badge.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (variant === "vertical") {
    return (
      <div className="space-y-3">
        {badges.map((badge, index) => {
          const Icon = badge.icon;
          return (
            <div
              key={index}
              className={`flex items-start gap-3 ${badge.bgColor} p-4 rounded-lg`}
            >
              <div className={`${badge.color} mt-1`}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1">{badge.label}</h4>
                <p className="text-sm text-gray-600">{badge.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Horizontal (default)
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {badges.map((badge, index) => {
        const Icon = badge.icon;
        return (
          <div
            key={index}
            className={`${badge.bgColor} p-4 rounded-lg text-center hover:shadow-md transition-shadow`}
          >
            <div className={`${badge.color} mb-2 flex justify-center`}>
              <Icon className="w-8 h-8" />
            </div>
            <h4 className="font-bold text-gray-900 text-sm mb-1">
              {badge.label}
            </h4>
            <p className="text-xs text-gray-600">{badge.description}</p>
          </div>
        );
      })}
    </div>
  );
}
