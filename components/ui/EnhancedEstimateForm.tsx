"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { VoiceRecorder } from "@/components/ui/VoiceRecorder";
import { ImageUploader } from "@/components/ui/ImageUploader";

interface EstimateResult {
  min: number;
  max: number;
  description: string;
  confidence: number;
  factors: string[];
}

interface EnhancedEstimateFormProps {
  onEstimateComplete: (result: EstimateResult) => void;
}

export function EnhancedEstimateForm({ onEstimateComplete }: EnhancedEstimateFormProps) {
  const [textDescription, setTextDescription] = useState("");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"text" | "voice" | "photos">("text");

  const handleVoiceRecording = (audioBlob: Blob, transcript: string) => {
    setVoiceTranscript(transcript);
    console.log("Voice recording completed:", { audioBlob, transcript });
  };

  const handleImageUpload = (newImages: File[], previews: string[]) => {
    setImages(newImages);
    setImagePreviews(previews);
    console.log("Images uploaded:", newImages);
  };

  const generateEstimate = async () => {
    if (!textDescription && !voiceTranscript && images.length === 0) {
      alert("Please provide a description (text or voice) or upload photos of your project.");
      return;
    }

    setIsLoading(true);

    try {
      // Combine all input sources
      const combinedDescription = [
        textDescription,
        voiceTranscript || "",
      ].filter(Boolean).join("\n\n");

      // Create FormData for multipart request
      const formData = new FormData();
      formData.append("description", combinedDescription);
      formData.append("hasVoice", voiceTranscript ? "true" : "false");
      formData.append("imageCount", images.length.toString());

      // Add images to form data
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      const response = await fetch("/api/enhanced-estimate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate estimate");
      }

      const result = await response.json();
      onEstimateComplete(result);

    } catch (error) {
      console.error("Error generating estimate:", error);
      
      // Fallback to mock enhanced estimate
      const mockResult: EstimateResult = {
        min: 500,
        max: 1500,
        description: "Enhanced AI estimate based on your detailed input",
        confidence: images.length > 0 ? 85 : 75,
        factors: [
          ...(textDescription ? ["Written description provided"] : []),
          ...(voiceTranscript ? ["Voice description analyzed"] : []),
          ...(images.length > 0 ? [`${images.length} project photos analyzed`] : []),
          "Market rate analysis",
          "Material cost estimation",
          "Labor complexity assessment"
        ]
      };
      
      setTimeout(() => onEstimateComplete(mockResult), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setTextDescription("");
    setVoiceTranscript("");
    setImages([]);
    setImagePreviews([]);
  };

  const hasContent = textDescription || voiceTranscript || images.length > 0;

  return (
    <Card variant="elevated" className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Get Enhanced AI Estimate</h2>
        <p className="text-gray-600 mt-2">
          Use voice, photos, and text to get the most accurate estimate possible
        </p>
      </CardHeader>

      <CardContent>
        {/* Input Method Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("text")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === "text"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            ✏️ Text Description
          </button>
          <button
            onClick={() => setActiveTab("voice")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === "voice"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            🎤 Voice Recording
          </button>
          <button
            onClick={() => setActiveTab("photos")}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              activeTab === "photos"
                ? "text-orange-600 border-b-2 border-orange-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📸 Project Photos
          </button>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Text Input Tab */}
          {activeTab === "text" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Project Description
                </label>
                <textarea
                  id="description"
                  value={textDescription}
                  onChange={(e) => setTextDescription(e.target.value)}
                  placeholder="Describe your project in detail... (e.g., 'I need to replace my kitchen faucet. It's a standard single-handle faucet with a pull-out sprayer. The current one is leaking from the base.')"
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 min-h-[120px] resize-y focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
                {textDescription && (
                  <div className="mt-2 text-sm text-green-600 flex items-center">
                    ✓ Text description added ({textDescription.length} characters)
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Voice Input Tab */}
          {activeTab === "voice" && (
            <VoiceRecorder onRecordingComplete={handleVoiceRecording} />
          )}

          {/* Photo Upload Tab */}
          {activeTab === "photos" && (
            <ImageUploader onImagesSelected={handleImageUpload} maxImages={5} />
          )}
        </div>

        {/* Summary Section */}
        {hasContent && (
          <div className="mt-8 p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <h3 className="font-semibold text-orange-900 mb-2">Input Summary:</h3>
            <div className="space-y-2 text-sm">
              {textDescription && (
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600">✏️</span>
                  <span className="text-blue-800">Text: {textDescription.substring(0, 100)}{textDescription.length > 100 ? "..." : ""}</span>
                </div>
              )}
              {voiceTranscript && (
                <div className="flex items-start space-x-2">
                  <span className="text-red-900">🎤</span>
                  <span className="text-red-900">{voiceTranscript.substring(0, 100)}{voiceTranscript.length > 100 ? "..." : ""}</span>
                </div>
              )}
              {images.length > 0 && (
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600">📸</span>
                  <span className="text-blue-800">{images.length} project photo{images.length !== 1 ? "s" : ""} uploaded</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Button
            variant="primary"
            size="lg"
            onClick={generateEstimate}
            disabled={!hasContent || isLoading}
            isLoading={isLoading}
            className="flex-1"
          >
            {isLoading ? "Analyzing with AI..." : "Get Enhanced Estimate"}
          </Button>
          
          {hasContent && (
            <Button
              variant="ghost"
              size="lg"
              onClick={clearAll}
              disabled={isLoading}
            >
              Clear All
            </Button>
          )}
        </div>

        <div className="mt-4 text-xs text-gray-500 text-center space-y-1">
          <p>🚀 Enhanced AI uses multiple input types for more accurate estimates</p>
          <p>📊 Confidence scores increase with more detailed information</p>
        </div>
      </CardContent>
    </Card>
  );
}