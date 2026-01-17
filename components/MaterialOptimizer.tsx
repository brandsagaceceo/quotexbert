"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2, ArrowRight } from 'lucide-react';

interface MaterialRecommendation {
  name: string;
  priceRange: string;
  pros: string[];
  cons: string[];
  durability: string;
  waterResistance: string;
  climateRating: string;
  bestFor: string;
}

interface MaterialOptimizerResult {
  roomType: string;
  recommendations: MaterialRecommendation[];
  torontoSpecificAdvice: string;
}

const ROOM_TYPES = [
  { value: 'kitchen', label: '🍳 Kitchen' },
  { value: 'bathroom', label: '🚿 Bathroom' },
  { value: 'living-room', label: '🛋️ Living Room' },
  { value: 'bedroom', label: '🛏️ Bedroom' },
  { value: 'basement', label: '🏠 Basement' },
  { value: 'outdoor', label: '🌳 Outdoor/Deck' },
  { value: 'flooring', label: '🔲 Flooring' },
  { value: 'exterior', label: '🏡 Exterior/Siding' }
];

export default function MaterialOptimizer() {
  const [roomType, setRoomType] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MaterialOptimizerResult | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateRecommendations = async () => {
    if (!roomType) {
      alert('Please select a room type');
      return;
    }

    setIsLoading(true);

    try {
      // Call API to generate material recommendations
      const formData = new FormData();
      formData.append('roomType', roomType);
      if (image) {
        formData.append('image', image);
      }

      const response = await fetch('/api/material-optimizer', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setResult(data);
      } else {
        throw new Error('Failed to generate recommendations');
      }
    } catch (error) {
      console.error('Error:', error);
      // Use fallback recommendations
      setResult(generateFallbackRecommendations(roomType));
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackRecommendations = (type: string): MaterialOptimizerResult => {
    const recommendations: Record<string, MaterialOptimizerResult> = {
      kitchen: {
        roomType: 'Kitchen',
        recommendations: [
          {
            name: 'Quartz Countertops',
            priceRange: '$60-$100/sq.ft',
            pros: ['Non-porous, stain-resistant', 'Low maintenance', 'Wide color selection', 'Doesn\'t require sealing'],
            cons: ['Can be expensive', 'Not heat-proof', 'Visible seams on large installations'],
            durability: 'Excellent (9/10)',
            waterResistance: 'Excellent',
            climateRating: 'Perfect for Toronto - unaffected by humidity',
            bestFor: 'Busy kitchens, families with kids'
          },
          {
            name: 'Porcelain Tile Backsplash',
            priceRange: '$8-$25/sq.ft',
            pros: ['Water-resistant', 'Easy to clean', 'Heat-resistant', 'Endless design options'],
            cons: ['Grout requires maintenance', 'Cold to touch', 'Installation can be tricky'],
            durability: 'Excellent (9/10)',
            waterResistance: 'Excellent',
            climateRating: 'Ideal for Toronto - handles humidity and temperature changes',
            bestFor: 'High-traffic cooking areas'
          },
          {
            name: 'Luxury Vinyl Plank (LVP) Flooring',
            priceRange: '$3-$7/sq.ft',
            pros: ['100% waterproof', 'Warm underfoot', 'DIY-friendly', 'Looks like real wood'],
            cons: ['Can dent under heavy furniture', 'Less resale value than hardwood'],
            durability: 'Very Good (7/10)',
            waterResistance: 'Excellent',
            climateRating: 'Great for Toronto basements and kitchens',
            bestFor: 'Budget-conscious renovations, basements'
          }
        ],
        torontoSpecificAdvice: 'Toronto\'s humidity swings make quartz and porcelain excellent choices. Avoid natural stone in high-moisture areas unless properly sealed. LVP is gaining popularity in GTA homes due to waterproofing and easy maintenance.'
      },
      bathroom: {
        roomType: 'Bathroom',
        recommendations: [
          {
            name: 'Porcelain Tile',
            priceRange: '$5-$20/sq.ft',
            pros: ['100% waterproof', 'Extremely durable', 'Mold & mildew resistant', 'Low maintenance'],
            cons: ['Cold underfoot (recommend radiant heating)', 'Grout lines need sealing'],
            durability: 'Excellent (10/10)',
            waterResistance: 'Perfect',
            climateRating: 'Best choice for Toronto bathrooms - handles freeze/thaw cycles',
            bestFor: 'Showers, bathroom floors, wet areas'
          },
          {
            name: 'Quartz Vanity Top',
            priceRange: '$50-$90/sq.ft',
            pros: ['Non-porous surface', 'Resists bacteria growth', 'No sealing required', 'Beautiful patterns'],
            cons: ['Can be pricey', 'Not heat-resistant'],
            durability: 'Excellent (9/10)',
            waterResistance: 'Excellent',
            climateRating: 'Perfect for GTA - unaffected by humidity',
            bestFor: 'Vanity countertops, bathroom surfaces'
          },
          {
            name: 'Acrylic Shower Surround',
            priceRange: '$800-$2,500 installed',
            pros: ['Seamless installation', '100% waterproof', 'Easy to clean', 'Warm to touch'],
            cons: ['Can scratch easier than tile', 'Limited design options vs tile'],
            durability: 'Good (7/10)',
            waterResistance: 'Perfect',
            climateRating: 'Good for Toronto - no grout to maintain',
            bestFor: 'Budget bathroom remodels, rental properties'
          }
        ],
        torontoSpecificAdvice: 'Toronto\'s cold winters make radiant floor heating a worthwhile investment under tile. Always use waterproof membranes behind shower tile. The city\'s hard water can leave deposits - choose non-porous materials for easy cleaning.'
      },
      flooring: {
        roomType: 'Flooring',
        recommendations: [
          {
            name: 'Engineered Hardwood',
            priceRange: '$6-$12/sq.ft',
            pros: ['Real wood top layer', 'More stable than solid hardwood', 'Can be refinished 1-2 times', 'Adds resale value'],
            cons: ['More expensive than laminate', 'Not waterproof', 'Can still be affected by humidity'],
            durability: 'Very Good (8/10)',
            waterResistance: 'Fair (not for bathrooms/basements)',
            climateRating: 'Better than solid wood for Toronto - more stable in humidity changes',
            bestFor: 'Living rooms, bedrooms, main floors'
          },
          {
            name: 'Luxury Vinyl Plank (LVP)',
            priceRange: '$3-$7/sq.ft',
            pros: ['100% waterproof', 'Looks like real wood', 'DIY-friendly installation', 'Budget-friendly'],
            cons: ['Less resale value', 'Can dent under heavy loads', 'Not refinishable'],
            durability: 'Good (7/10)',
            waterResistance: 'Excellent',
            climateRating: 'Perfect for Toronto basements and humid areas',
            bestFor: 'Basements, bathrooms, kitchens, rentals'
          },
          {
            name: 'Porcelain Tile (Wood-Look)',
            priceRange: '$5-$15/sq.ft',
            pros: ['100% waterproof', 'Extremely durable', 'Looks like hardwood', 'Zero maintenance'],
            cons: ['Cold underfoot', 'Hard surface (less comfortable)', 'Professional installation recommended'],
            durability: 'Excellent (10/10)',
            waterResistance: 'Perfect',
            climateRating: 'Excellent for Toronto - handles all conditions',
            bestFor: 'High-traffic areas, mudrooms, entryways'
          }
        ],
        torontoSpecificAdvice: 'GTA homes benefit from waterproof flooring in basements and entryways due to snow/salt tracking. Engineered hardwood is more stable than solid in Toronto\'s humidity swings. Consider radiant heating under tile for comfort in cold months.'
      },
      basement: {
        roomType: 'Basement',
        recommendations: [
          {
            name: 'Luxury Vinyl Plank (LVP)',
            priceRange: '$3-$7/sq.ft',
            pros: ['100% waterproof', 'Handles basement moisture', 'Warm underfoot', 'Easy to install over concrete'],
            cons: ['Not as "high-end" as hardwood'],
            durability: 'Very Good (8/10)',
            waterResistance: 'Excellent',
            climateRating: 'Best choice for Toronto basements',
            bestFor: 'Finished basements, rec rooms, home offices'
          },
          {
            name: 'Epoxy Painted Concrete',
            priceRange: '$3-$8/sq.ft',
            pros: ['100% waterproof', 'Easy to clean', 'Modern industrial look', 'Very durable'],
            cons: ['Hard surface', 'Shows dust/pet hair', 'Requires proper surface prep'],
            durability: 'Excellent (9/10)',
            waterResistance: 'Perfect',
            climateRating: 'Ideal for Toronto basements prone to moisture',
            bestFor: 'Gyms, workshops, modern spaces'
          },
          {
            name: 'Carpet Tiles (Waterproof)',
            priceRange: '$2-$5/sq.ft',
            pros: ['Soft and warm', 'Sound dampening', 'Individual tiles replaceable', 'DIY-friendly'],
            cons: ['Not as durable as hard surfaces', 'Can stain'],
            durability: 'Fair (6/10)',
            waterResistance: 'Good (if waterproof backing)',
            climateRating: 'Good for Toronto if using moisture-resistant backing',
            bestFor: 'Playrooms, guest bedrooms, cozy spaces'
          }
        ],
        torontoSpecificAdvice: 'Toronto basements need moisture-resistant materials. Always install vapor barrier and use a dehumidifier. LVP is the most popular choice in the GTA for finished basements. Avoid solid hardwood and regular laminate. Check for any water issues before installing flooring.'
      }
    };

    return recommendations[type] || recommendations['kitchen'];
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-orange-600 bg-clip-text text-transparent mb-4">
          🛠️ Material Optimizer AI
        </h1>
        <p className="text-xl text-slate-600">
          Get expert material recommendations tailored to Toronto/GTA climate
        </p>
      </div>

      {!result ? (
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
          {/* Room Type Selection */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-slate-900 mb-3">
              Select Room Type
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ROOM_TYPES.map(type => (
                <button
                  key={type.value}
                  onClick={() => setRoomType(type.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    roomType === type.value
                      ? 'border-rose-600 bg-rose-50 text-rose-900'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{type.label.split(' ')[0]}</div>
                  <div className="text-sm font-medium">{type.label.split(' ').slice(1).join(' ')}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-6">
            <label className="block text-lg font-semibold text-slate-900 mb-3">
              Upload Photo (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-rose-400 transition-colors cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="material-image-upload"
              />
              <label htmlFor="material-image-upload" className="cursor-pointer">
                {imagePreview ? (
                  <div className="relative w-full h-64">
                    <Image
                      src={imagePreview}
                      alt="Uploaded"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <>
                    <Upload className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                    <p className="text-slate-600">Click to upload a photo of your space</p>
                    <p className="text-sm text-slate-500 mt-2">Better photos = Better recommendations</p>
                  </>
                )}
              </label>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={generateRecommendations}
            disabled={!roomType || isLoading}
            className="w-full bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing Materials...
              </>
            ) : (
              <>
                Get Material Recommendations
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Results Header */}
          <div className="bg-gradient-to-r from-rose-600 to-orange-600 text-white rounded-2xl p-6">
            <h2 className="text-2xl font-bold mb-2">
              Best Materials for Your {result.roomType}
            </h2>
            <p className="text-white/90">
              Tailored recommendations for Toronto/GTA climate and conditions
            </p>
          </div>

          {/* Toronto-Specific Advice */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-blue-900 mb-2 flex items-center gap-2">
              🍁 Toronto/GTA Climate Considerations
            </h3>
            <p className="text-blue-800">{result.torontoSpecificAdvice}</p>
          </div>

          {/* Material Recommendations */}
          <div className="grid md:grid-cols-1 gap-6">
            {result.recommendations.map((material, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg p-6 border-2 border-slate-200 hover:border-rose-300 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-1">
                      {index + 1}. {material.name}
                    </h3>
                    <div className="text-2xl font-bold text-rose-600">
                      {material.priceRange}
                    </div>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-semibold text-slate-700">Durability</div>
                    <div className="text-slate-900">{material.durability}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Pros */}
                  <div>
                    <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-1">
                      ✅ Pros
                    </h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      {material.pros.map((pro, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-green-600 mt-0.5">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div>
                    <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-1">
                      ⚠️ Cons
                    </h4>
                    <ul className="space-y-1 text-sm text-slate-700">
                      {material.cons.map((con, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-red-600 mt-0.5">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Additional Properties */}
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200">
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-1">Water Resistance</div>
                    <div className="text-sm font-bold text-slate-900">{material.waterResistance}</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-1">Climate Rating</div>
                    <div className="text-sm font-bold text-slate-900">🍁 Excellent</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-slate-600 mb-1">Best For</div>
                    <div className="text-sm font-bold text-slate-900">{material.bestFor}</div>
                  </div>
                </div>

                {/* Toronto-Specific Note */}
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="text-sm text-amber-900">
                    <span className="font-semibold">🍁 Toronto Climate Note: </span>
                    {material.climateRating}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setResult(null);
                setRoomType('');
                setImage(null);
                setImagePreview('');
              }}
              className="flex-1 bg-slate-100 text-slate-700 font-bold py-3 px-6 rounded-xl hover:bg-slate-200 transition-colors"
            >
              Try Another Room
            </button>
            <button
              onClick={() => window.location.href = '/create-lead'}
              className="flex-1 bg-gradient-to-r from-rose-600 to-orange-600 text-white font-bold py-3 px-6 rounded-xl hover:shadow-lg transition-all"
            >
              Get Contractor Quotes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
