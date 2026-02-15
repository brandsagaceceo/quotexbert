"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { CloudArrowUpIcon, XMarkIcon, PhotoIcon, DevicePhoneMobileIcon, SparklesIcon, MicrophoneIcon } from "@heroicons/react/24/outline";
import { IPhoneFrame } from "./IPhoneFrame";

interface IPhoneEstimatorMockupProps {
  onEstimateComplete: (result: any) => void;
  userId?: string | undefined;
}

const PROJECT_TYPES = [
  "Kitchen",
  "Bathroom",
  "Plumbing",
  "Electrical",
  "Roofing",
  "Flooring",
  "Painting",
  "Deck/Fence",
  "Drywall",
  "Landscaping",
  "Basement",
  "Other",
];

interface UploadedPhoto {
  id: string;
  file: File;
  preview: string;
  isExample?: boolean;
}

export function IPhoneEstimatorMockup({ onEstimateComplete, userId }: IPhoneEstimatorMockupProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [description, setDescription] = useState("");
  const [projectType, setProjectType] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState("");
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    // Check if browser supports speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Voice input is not supported in your browser. Please try Chrome or Safari.');
      return;
    }

    if (isListening) {
      // Stop listening
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    // Start listening
    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setDescription(prev => (prev + ' ' + finalTranscript).trim());
        }
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        if (event.error === 'no-speech') {
          alert('No speech detected. Please try again.');
        } else if (event.error === 'not-allowed') {
          alert('Microphone access denied. Please enable microphone permissions.');
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    recognitionRef.current.start();
    setIsListening(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type.startsWith("image/")
    );
    
    addPhotos(files);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    addPhotos(files);
  };

  const addPhotos = (files: File[]) => {
    if (photos.length + files.length > 5) {
      setError("Maximum 5 photos allowed");
      return;
    }

    const newPhotos: UploadedPhoto[] = files.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
    setError("");
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const photo = prev.find(p => p.id === id);
      if (photo && !photo.isExample) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter(p => p.id !== id);
    });
  };

  const loadExample = () => {
    setDescription("My kitchen needs new cabinets, countertops, and backsplash. The appliances are staying. About 12ft x 10ft space.");
    setProjectType("Kitchen");
    setPostalCode("M5H 2N2");
    
    // Add example photo placeholder
    const examplePhoto: UploadedPhoto = {
      id: "example-1",
      file: new File([], "example-kitchen.jpg"),
      preview: "https://images.unsplash.com/photo-1556912167-f556f1f39fdf?w=400&h=300&fit=crop",
      isExample: true,
    };
    setPhotos([examplePhoto]);
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (photos.length === 0 && !description.trim()) {
      setError("Please upload at least one photo or provide a description");
      return;
    }

    if (!projectType) {
      setError("Please select a project type");
      return;
    }

    setIsLoading(true);
    setLoadingStage("Analyzing photos...");

    try {
      // Filter out example photos and convert real photos to base64
      const realPhotos = photos.filter(p => !p.isExample);
      const photoPromises = realPhotos.map(photo => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(photo.file);
        });
      });

      const photoBase64 = await Promise.all(photoPromises);

      // Save photos to localStorage for later use
      if (photoBase64.length > 0) {
        localStorage.setItem('estimate_photos', JSON.stringify(photoBase64));
      }

      setLoadingStage("Checking local pricing...");

      const response = await fetch("/api/estimate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          description: description.trim(),
          photos: photoBase64,
          projectType,
          postalCode: postalCode.trim(),
          userId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate estimate");
      }

      setLoadingStage("Matching contractors...");
      
      // Small delay to show final stage
      await new Promise(resolve => setTimeout(resolve, 500));

      onEstimateComplete(data);
      
      // Scroll to results
      setTimeout(() => {
        document.getElementById('estimate-results')?.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }, 300);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate estimate");
    } finally {
      setIsLoading(false);
      setLoadingStage("");
    }
  };

  return (
    <IPhoneFrame>
      <div className="px-3 md:px-6 pb-3">
        {/* Header */}
        <div className="text-center mb-4 pt-2">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 text-white px-3 py-1.5 rounded-full text-xs font-bold mb-2">
            <SparklesIcon className="w-4 h-4" />
            AI Instant Estimate
          </div>
          <h3 className="text-lg md:text-xl font-black text-slate-900 mb-1">
            Upload Phone Photos
          </h3>
          <p className="text-xs md:text-sm text-slate-600">
            Get your detailed estimate in 30 seconds
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5 text-xs">
            <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full font-semibold">✓ No signup required</span>
            <span className="bg-rose-50 text-rose-900 px-2 py-0.5 rounded-full font-semibold">✓ 100% free</span>
            <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-semibold">✓ No spam</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
          {/* Photo Upload Area - Big Drag & Drop */}
          <div>
            <label className="block text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
              <span className="bg-orange-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">2</span>
              Add Photos (Optional)
            </label>
            <p className="text-xs text-slate-600 mb-3">💡 2-3 photos recommended for best results</p>
            
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                border-3 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-all duration-200 relative min-h-[120px] flex flex-col items-center justify-center
                ${isDragging
                  ? "border-orange-500 bg-orange-50 scale-[1.02]"
                  : "border-slate-300 hover:border-orange-500 hover:bg-orange-50/50"
                }
              `}
            >
              <CloudArrowUpIcon className="w-12 h-12 mx-auto mb-3 text-orange-500" />
              <p className="text-base font-bold text-slate-900">
                Drag & drop photos here
              </p>
              <p className="text-sm text-slate-600 mt-1">
                or click to browse
              </p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                multiple
                onChange={handleFileInput}
                className="hidden"
                aria-label="Upload photos"
              />
            </div>

            {/* Photo Thumbnails */}
            {photos.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-3">
                {photos.map(photo => (
                  <div key={photo.id} className="relative group">
                    {photo.isExample && (
                      <div className="absolute top-0 left-0 bg-rose-700 text-white text-[9px] font-bold px-1 py-0.5 rounded-br z-10">
                        Example
                      </div>
                    )}
                    <Image
                      src={photo.preview}
                      alt={photo.isExample ? "Example kitchen" : "Upload preview"}
                      width={80}
                      height={80}
                      className="w-full h-16 object-cover rounded-lg border-2 border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePhoto(photo.id);
                      }}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full p-0.5 
                               opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                      aria-label="Remove photo"
                    >
                      <XMarkIcon className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Description - Compact for mobile */}
          <div>
            <label htmlFor="description" className="block text-xs md:text-sm font-bold text-slate-900 mb-1.5 md:mb-2 flex items-center gap-1.5">
              <span className="bg-orange-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">1</span>
              Describe Your Project
            </label>
            <p className="text-xs text-slate-600 mb-2">💡 More details = more accurate pricing</p>
            <div className="relative">
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Examples:
• Patch a drywall hole (about 6 inches)
• Replace bathtub + tile (small bathroom)
• Install 6 potlights in living room"
                rows={4}
                className="w-full px-3 py-2 md:py-3 border-2 border-slate-300 rounded-lg md:rounded-xl focus:border-orange-500 
                         focus:ring-2 focus:ring-orange-200 outline-none transition-all text-slate-900 text-sm md:text-base
                         placeholder:text-slate-400 resize-none"
              />
            </div>
            <button
              type="button"
              onClick={toggleVoiceInput}
              className="mt-2 text-xs text-slate-600 hover:text-orange-600 underline flex items-center gap-1"
            >
              <MicrophoneIcon className="w-4 h-4" />
              {isListening ? 'Stop voice input' : 'Prefer to talk? Use voice'}
            </button>
            {isListening && (
              <p className="text-xs text-red-600 mt-1 font-semibold animate-pulse">
                🎤 Listening... Speak your project description
              </p>
            )}
          </div>

          {/* Project Type */}
          <div>
            <label htmlFor="projectType" className="block text-xs md:text-sm font-bold text-slate-900 mb-1.5 md:mb-2 flex items-center gap-1.5">
              <span className="bg-orange-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold">3</span>
              Project Type <span className="text-red-500">*</span>
            </label>
            <p className="text-xs text-slate-600 mb-2">Helps us calculate accurate pricing</p>
            <select
              id="projectType"
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              required
              className="w-full px-3 py-2 md:py-2.5 border-2 border-slate-300 rounded-lg focus:border-orange-500 
                       focus:ring-2 focus:ring-orange-200 outline-none transition-all text-slate-900 text-sm
                       bg-white cursor-pointer"
            >
              <option value="">Select project type...</option>
              {PROJECT_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Postal Code */}
          <div>
            <label htmlFor="postalCode" className="block text-xs font-bold text-slate-700 mb-1">
              Postal Code (optional)
            </label>
            <p className="text-xs text-slate-500 mb-1.5">For accurate GTA pricing • We never share your location</p>
            <input
              id="postalCode"
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
              placeholder="M5H 2N2"
              maxLength={7}
              className="w-full px-3 py-2 md:py-2.5 border-2 border-slate-300 rounded-lg focus:border-orange-500 
                       focus:ring-2 focus:ring-orange-200 outline-none transition-all text-slate-900 text-sm
                       placeholder:text-slate-400"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-2 border-red-200 rounded-lg p-2.5">
              <p className="text-xs text-red-700 font-semibold">{error}</p>
            </div>
          )}

          {/* Submit Button - Smaller on mobile */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 
                     hover:to-orange-700 text-white font-bold py-3 md:py-4 px-4 md:px-6 rounded-lg md:rounded-xl text-sm md:text-base
                     transition-all transform hover:scale-[1.02] disabled:opacity-50 
                     disabled:cursor-not-allowed disabled:transform-none shadow-lg md:shadow-xl
                     focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            {isLoading ? (
              <span className="flex flex-col items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span className="font-bold">{loadingStage}</span>
                <span className="text-xs opacity-75">This takes just 10-15 seconds...</span>
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <SparklesIcon className="w-5 h-5" />
                See My Detailed Estimate Now
              </span>
            )}
          </button>

          {/* Enhanced Reassurance Microcopy */}
          <div className="text-center space-y-1">
            <p className="text-xs text-slate-600 font-medium">
              ✓ No signup required • ✓ No credit card • ✓ No obligation
            </p>
            <p className="text-xs text-slate-500">
              Contractors won't see your info until you choose to share it
            </p>
          </div>
        </form>
      </div>
    </IPhoneFrame>
  );
}
