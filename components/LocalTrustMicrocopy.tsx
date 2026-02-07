// NEW COMPONENT: Shows location-specific trust indicators
// Usage: <LocalTrustMicrocopy location="Toronto" category="Kitchen" />
"use client";

interface LocalTrustMicrocopyProps {
  location?: string;
  category?: string;
  jobCount?: number;
}

export default function LocalTrustMicrocopy({
  location = 'GTA',
  category,
  jobCount
}: LocalTrustMicrocopyProps) {
  
  // Generate appropriate microcopy based on available data
  const generateText = (): string => {
    // If we have actual job count from database
    if (jobCount && jobCount > 0) {
      return `Based on ${jobCount} recent ${location} ${category ? category.toLowerCase() : ''} jobs`;
    }
    
    // Generic but trustworthy messages
    if (category) {
      return `Common price range for ${category.toLowerCase()} in ${location}`;
    }
    
    return `Based on recent ${location} jobs`;
  };

  return (
    <p className="text-xs text-gray-500 mt-1 italic">
      {generateText()}
    </p>
  );
}
