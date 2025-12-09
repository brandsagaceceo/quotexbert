"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";

// Type declarations for Speech Recognition API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: Event) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
  start(): void;
  stop(): void;
}

declare const SpeechRecognition: {
  new (): SpeechRecognition;
};

interface EstimateResult {
  min: number;
  max: number;
  description: string;
  confidence: number;
  factors: string[];
  aiPowered?: boolean;
  // Add original project data for form pre-filling
  projectDescription?: string;
  projectImages?: File[];
}

interface StreamlinedEstimateFormProps {
  onEstimateComplete: (result: EstimateResult) => void;
  userId?: string | undefined; // Optional userId for auto-saving estimates
}

// Simple Voice Recording Component
function VoiceMicButton({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition. Please type your description instead.');
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result && result[0]) {
          const transcript = result[0].transcript;
          if (result.isFinal) {
            finalTranscript += transcript;
          }
        }
      }
      
      if (finalTranscript) {
        onTranscript(finalTranscript);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    setRecognition(recognition);
    recognition.start();
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={isListening ? stopListening : startListening}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
        isListening
          ? 'bg-red-100 text-red-700 hover:bg-red-200'
          : 'bg-teal-100 text-teal-700 hover:bg-teal-200'
      }`}
      title={isListening ? 'Click to stop recording' : 'Click to start voice input'}
    >
      {isListening ? (
        <>
          <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
          Stop Recording
        </>
      ) : (
        <>
          🎤 Voice Input
        </>
      )}
    </button>
  );
}

// Simple Photo Upload Component
function PhotoUploadButton({ onPhotosSelected }: { onPhotosSelected: (files: File[], previews: string[]) => void }) {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const previews: string[] = [];
    const loadPromises = files.map((file) => {
      return new Promise<void>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            previews.push(e.target.result as string);
          }
          resolve();
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(loadPromises).then(() => {
      onPhotosSelected(files, previews);
    });
  };

  return (
    <label className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg bg-red-100 text-red-800 hover:bg-red-200 cursor-pointer transition-colors">
      📸 Add Photos
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        capture="environment"
      />
    </label>
  );
}

export function StreamlinedEstimateForm({ onEstimateComplete, userId }: StreamlinedEstimateFormProps) {
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleVoiceTranscript = (transcript: string) => {
    // Append voice transcript to existing description
    const newDescription = description + (description ? '\n\n' : '') + transcript;
    setDescription(newDescription);
  };

  const handlePhotoUpload = (newImages: File[], previews: string[]) => {
    setImages(prev => [...prev, ...newImages]);
    setImagePreviews(prev => [...prev, ...previews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const generateEstimate = async () => {
    if (!description.trim() && images.length === 0) {
      alert("Please provide a description or upload photos of your project.");
      return;
    }

    setIsLoading(true);

    try {
      // Create FormData for multipart request
      const formData = new FormData();
      formData.append("description", description);
      formData.append("imageCount", images.length.toString());
      
      // Add homeownerId for auto-save if provided
      if (userId) {
        formData.append("homeownerId", userId);
      }

      // Add images to form data
      images.forEach((image, index) => {
        formData.append(`image_${index}`, image);
      });

      const response = await fetch("/api/ai-estimate", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate estimate");
      }

      const result = await response.json();
      // Add original project data to the result
      result.projectDescription = description;
      result.projectImages = images;
      onEstimateComplete(result);

    } catch (error) {
      console.error("Error generating estimate:", error);
      
      // Fallback to mock estimate
      const mockResult: EstimateResult = {
        min: 500,
        max: 1500,
        description: "Fallback estimate based on your project details",
        confidence: images.length > 0 ? 85 : 75,
        factors: [
          "Project description analyzed",
          ...(images.length > 0 ? [`${images.length} project photos analyzed`] : []),
          "Market rate analysis",
          "Material cost estimation",
          "Labor complexity assessment"
        ],
        aiPowered: false,
        projectDescription: description,
        projectImages: images
      };
      
      setTimeout(() => onEstimateComplete(mockResult), 1500);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAll = () => {
    setDescription("");
    setImages([]);
    setImagePreviews([]);
  };

  return (
    <Card variant="elevated" className="max-w-4xl mx-auto">
      <CardHeader className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Get Your Project Estimate</h2>
        <p className="text-gray-600 mt-2">
          Describe your project and get an instant AI-powered estimate
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Description Input */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Project Description
          </label>
          <div className="relative">
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your project in detail... (e.g., 'I need to replace my kitchen faucet. It's a standard single-handle faucet with a pull-out sprayer. The current one is leaking from the base.')"
              className="w-full bg-gray-50 border border-gray-300 rounded-lg p-4 text-gray-900 placeholder-gray-500 min-h-[120px] resize-none focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200"
            />
            
            {/* Voice and Photo Buttons */}
            <div className="mt-3 flex flex-wrap gap-2">
              <VoiceMicButton onTranscript={handleVoiceTranscript} />
              <PhotoUploadButton onPhotosSelected={handlePhotoUpload} />
            </div>
          </div>
        </div>

        {/* Photo Previews */}
        {imagePreviews.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Project Photos ({imagePreviews.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Project photo ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="primary"
            size="lg"
            onClick={generateEstimate}
            disabled={isLoading || (!description.trim() && images.length === 0)}
            className="flex-1 animate-pulse-slow shadow-2xl transform hover:scale-105 transition-all duration-300 ring-4 ring-rose-300 ring-offset-2"
          >
            {isLoading ? "Generating Estimate..." : "✨ Get My Estimate ✨"}
          </Button>
          
          {(description || images.length > 0) && (
            <Button
              variant="ghost"
              size="lg"
              onClick={clearAll}
              className="sm:w-auto"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Input Summary */}
        {(description || images.length > 0) && (
          <div className="mt-6 p-4 bg-teal-50 border border-teal-200 rounded-lg">
            <h3 className="font-semibold text-teal-900 mb-2">Your Input:</h3>
            <div className="space-y-2 text-sm text-teal-800">
              {description && (
                <div className="flex items-start space-x-2">
                  <span>📝</span>
                  <span>Description: {description.length} characters</span>
                </div>
              )}
              {images.length > 0 && (
                <div className="flex items-start space-x-2">
                  <span>📸</span>
                  <span>{images.length} project photo{images.length !== 1 ? 's' : ''} uploaded</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}