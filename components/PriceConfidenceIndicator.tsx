// NEW COMPONENT: Shows confidence indicator based on data quality
// Usage: <PriceConfidenceIndicator photoCount={3} category="Kitchen" />
"use client";

interface PriceConfidenceIndicatorProps {
  photoCount?: number;
  category?: string;
  description?: string;
}

export default function PriceConfidenceIndicator({
  photoCount = 0,
  category = '',
  description = ''
}: PriceConfidenceIndicatorProps) {
  
  // Calculate confidence level based on available data
  const calculateConfidence = (): { level: 'high' | 'medium' | 'low'; text: string } => {
    let score = 0;
    
    // Photo count contributes significantly
    if (photoCount >= 3) score += 40;
    else if (photoCount >= 2) score += 25;
    else if (photoCount >= 1) score += 15;
    
    // Description length matters
    if (description.length > 100) score += 30;
    else if (description.length > 50) score += 20;
    else if (description.length > 20) score += 10;
    
    // Category is known
    if (category) score += 20;
    
    // Detailed description indicators
    if (description.includes('feet') || description.includes('square') || description.includes('ft')) score += 10;
    
    if (score >= 70) {
      return {
        level: 'high',
        text: 'High confidence estimate'
      };
    } else if (score >= 40) {
      return {
        level: 'medium',
        text: photoCount < 2 
          ? 'Medium confidence – more photos may help'
          : 'Medium confidence estimate'
      };
    } else {
      return {
        level: 'low',
        text: 'Add more details or photos for better accuracy'
      };
    }
  };

  const confidence = calculateConfidence();

  return (
    <p className="text-sm text-gray-600 mt-1">
      {confidence.text}
    </p>
  );
}
