"use client";

interface VerifiedBadgeProps {
  verified: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function VerifiedBadge({ 
  verified, 
  className = "", 
  size = "md" 
}: VerifiedBadgeProps) {
  if (!verified) return null;

  const sizeClasses = {
    sm: "text-xs gap-1 px-2 py-0.5",
    md: "text-sm gap-1.5 px-3 py-1",
    lg: "text-base gap-2 px-4 py-1.5",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <span
      className={`inline-flex items-center ${sizeClasses[size]} rounded-full bg-green-100 border border-green-300 text-green-800 font-semibold ${className}`}
    >
      <svg
        className={iconSizes[size]}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
      <span>Verified Contractor</span>
    </span>
  );
}
