"use client";

import { useState } from "react";
import { Sparkles, Upload, DollarSign, Clock, AlertCircle, CheckCircle, Image as ImageIcon, Wand2 } from "lucide-react";

interface AIQuote {
  estimatedCostLow: number;
  estimatedCostHigh: number;
  breakdown: {
    materials: number;
    labor: number;
    permits: number;
    disposal: number;
    contingency: number;
  };
  timeline: {
    min: number;
    max: number;
    unit: string;
  };
  considerations: string[];
  riskFactors: string[];
  recommendedSpecialties: string[];
  confidence: string;
}

export function AIQuoteEstimator() {
  const [jobDescription, setJobDescription] = useState("");
  const [category, setCategory] = useState("general");
  const [city, setCity] = useState("Toronto");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<AIQuote | null>(null);
  const [visualizationUrl, setVisualizationUrl] = useState<string | null>(null);
  const [generatingViz, setGeneratingViz] = useState(false);

  const categories = [
    "General Contracting",
    "Kitchen Renovation",
    "Bathroom Remodel",
    "Basement Finishing",
    "Roofing",
    "Flooring",
    "Painting",
    "Electrical",
    "Plumbing",
    "HVAC",
    "Deck/Patio",
    "Landscaping"
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setImages(prev => [...prev, ...filesArray].slice(0, 5)); // Max 5 images
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleGetQuote = async () => {
    if (!jobDescription.trim()) {
      alert("Please describe your project");
      return;
    }

    setLoading(true);
    try {
      // For now, we'll send image count instead of actual images
      // In production, you'd upload images to storage first
      const response = await fetch("/api/ai-quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobDescription,
          category,
          city,
          images: images.map(img => img.name) // Send image metadata
        })
      });

      if (!response.ok) {
        throw new Error("Failed to get quote");
      }

      const data = await response.json();
      setQuote(data.quote);
    } catch (error) {
      console.error("Error getting AI quote:", error);
      alert("Failed to generate quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateVisualization = async () => {
    if (!quote || !jobDescription) return;

    setGeneratingViz(true);
    try {
      const response = await fetch("/api/ai-visualize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: jobDescription,
          items: quote.recommendedSpecialties,
          style: 'natural'
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate visualization");
      }

      const data = await response.json();
      setVisualizationUrl(data.imageUrl);
    } catch (error) {
      console.error("Error generating visualization:", error);
      alert("Failed to generate visualization. Please try again.");
    } finally {
      setGeneratingViz(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10 animate-fade-in-up">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-100 to-orange-100 rounded-full mb-4">
          <Sparkles className="w-5 h-5 text-rose-700 animate-pulse" />
          <span className="text-rose-900 font-semibold">AI-Powered Estimator</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-900 via-red-800 to-orange-900 bg-clip-text text-transparent mb-4">
          Get Instant AI Cost Estimate
        </h2>
        <p className="text-xl text-slate-600">
          Upload photos and describe your project - our AI analyzes and provides detailed Toronto pricing
        </p>
      </div>

      {!quote ? (
        <div className="bg-white rounded-3xl shadow-2xl border-2 border-rose-100 p-8">
          {/* Category Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Project Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* City Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Location
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g., Toronto, Mississauga, North York"
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all"
            />
          </div>

          {/* Photo Upload */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Upload Photos (Optional, up to 5)
            </label>
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-rose-400 transition-colors cursor-pointer"
                 onClick={() => document.getElementById('image-upload')?.click()}>
              <Upload className="w-12 h-12 mx-auto mb-3 text-slate-400" />
              <p className="text-slate-600 mb-2">Click to upload photos of your project</p>
              <p className="text-sm text-slate-400">Helps AI provide more accurate estimates</p>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            
            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-3 mt-4">
                {images.map((img, idx) => (
                  <div key={idx} className="relative group">
                    <img 
                      src={URL.createObjectURL(img)} 
                      alt={`Upload ${idx + 1}`}
                      className="w-full h-20 object-cover rounded-lg"
                    />
                    <button
                      onClick={() => removeImage(idx)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Job Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-900 mb-3">
              Describe Your Project
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Example: I want to renovate my 10x12 kitchen. Need new cabinets, countertops, backsplash, and flooring. The space currently has old laminate counters and vinyl flooring from the 90s..."
              rows={6}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all resize-none"
            />
            <p className="text-sm text-slate-500 mt-2">
              Be as detailed as possible for accurate estimates. Include dimensions, materials, current condition, etc.
            </p>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleGetQuote}
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-700 to-orange-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                AI Analyzing Your Project...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Get AI Estimate
              </>
            )}
          </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fade-in-up">
          {/* Cost Estimate Card */}
          <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-3xl shadow-2xl border-2 border-rose-200 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900">Estimated Cost</h3>
              <span className={`px-4 py-2 rounded-full text-sm font-semibold ${
                quote.confidence === 'high' ? 'bg-green-100 text-green-800' :
                quote.confidence === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                'bg-orange-100 text-orange-800'
              }`}>
                {quote.confidence.toUpperCase()} Confidence
              </span>
            </div>
            
            <div className="text-center mb-8">
              <div className="text-5xl font-bold bg-gradient-to-r from-rose-700 to-orange-600 bg-clip-text text-transparent mb-2">
                ${quote.estimatedCostLow.toLocaleString()} - ${quote.estimatedCostHigh.toLocaleString()}
              </div>
              <p className="text-slate-600">CAD (Toronto/GTA rates)</p>
            </div>

            {/* Breakdown */}
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Materials</span>
                  <span className="font-bold text-slate-900">${quote.breakdown.materials.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Labor</span>
                  <span className="font-bold text-slate-900">${quote.breakdown.labor.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Permits</span>
                  <span className="font-bold text-slate-900">${quote.breakdown.permits.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Disposal</span>
                  <span className="font-bold text-slate-900">${quote.breakdown.disposal.toLocaleString()}</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-700">Contingency</span>
                  <span className="font-bold text-slate-900">${quote.breakdown.contingency.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="flex items-center gap-3 bg-white rounded-xl p-4">
              <Clock className="w-6 h-6 text-rose-600" />
              <div>
                <div className="font-semibold text-slate-900">Estimated Timeline</div>
                <div className="text-slate-600">
                  {quote.timeline.min}-{quote.timeline.max} {quote.timeline.unit}
                </div>
              </div>
            </div>
          </div>

          {/* Considerations */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 p-8">
            <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
              Key Considerations
            </h4>
            <ul className="space-y-2">
              {quote.considerations.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-700">
                  <span className="text-green-600 mt-1">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Risk Factors */}
          {quote.riskFactors.length > 0 && (
            <div className="bg-white rounded-3xl shadow-xl border-2 border-orange-200 p-8">
              <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <AlertCircle className="w-6 h-6 text-orange-600" />
                Risk Factors
              </h4>
              <ul className="space-y-2">
                {quote.riskFactors.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-slate-700">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Recommended Specialists */}
          <div className="bg-white rounded-3xl shadow-xl border-2 border-slate-200 p-8">
            <h4 className="text-xl font-bold text-slate-900 mb-4">Recommended Specialists</h4>
            <div className="flex flex-wrap gap-2">
              {quote.recommendedSpecialties.map((specialty, idx) => (
                <span key={idx} className="px-4 py-2 bg-rose-100 text-rose-800 rounded-full text-sm font-medium">
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* AI Visualization Section */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl border-2 border-purple-200 p-8">
            <div className="flex items-center gap-3 mb-6">
              <Wand2 className="w-8 h-8 text-purple-600" />
              <div>
                <h4 className="text-2xl font-bold text-slate-900">✨ Visualize Your Project</h4>
                <p className="text-slate-600">See what your finished project will look like with AI-generated images</p>
              </div>
            </div>

            {!visualizationUrl ? (
              <button
                onClick={handleGenerateVisualization}
                disabled={generatingViz}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {generatingViz ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-3 border-white border-t-transparent"></div>
                    <span>AI Creating Your Vision...</span>
                  </>
                ) : (
                  <>
                    <ImageIcon className="w-6 h-6" />
                    <span>Generate AI Visualization (FREE)</span>
                  </>
                )}
              </button>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img 
                    src={visualizationUrl} 
                    alt="AI Generated Visualization" 
                    className="w-full h-auto animate-fade-in"
                  />
                  <div className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    🎨 AI Generated
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleGenerateVisualization}
                    disabled={generatingViz}
                    className="flex-1 px-4 py-3 border-2 border-purple-300 text-purple-700 rounded-xl font-semibold hover:bg-purple-50 transition-colors disabled:opacity-50"
                  >
                    {generatingViz ? "Generating..." : "Generate New Vision"}
                  </button>
                  <button
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    📸 Post with This Photo
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-4">
            <button
              onClick={() => {
                setQuote(null);
                setVisualizationUrl(null);
              }}
              className="flex-1 px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Try Another Quote
            </button>
            <button
              className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-700 to-orange-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all"
            >
              {visualizationUrl ? "Post to Job Board with Photos" : "Get Professional Quotes"}
            </button>
          </div>

          {/* Disclaimer */}
          <div className="text-center text-sm text-slate-500 bg-slate-50 rounded-xl p-4">
            <AlertCircle className="w-4 h-4 inline-block mr-1" />
            This is an AI-generated estimate. Actual costs may vary. Get professional quotes for accuracy.
          </div>
        </div>
      )}
    </div>
  );
}
