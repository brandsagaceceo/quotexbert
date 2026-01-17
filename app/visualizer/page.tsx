"use client";

import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BeforeAfterSlider } from "@/components/visualizer/BeforeAfterSlider";
import { QuoteCtaModal } from "@/components/visualizer/QuoteCtaModal";
import { UpgradeModal } from "@/components/visualizer/UpgradeModal";
import type { RoomType, FlooringStyle, FlooringColor, WallColor, DesignStyle } from "@/types/visualizer";

export default function VisualizerPage() {
  const { authUser, isSignedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [beforeImage, setBeforeImage] = useState<File | null>(null);
  const [beforeImagePreview, setBeforeImagePreview] = useState<string>("");
  const [afterImage, setAfterImage] = useState<string>("");
  const [generationId, setGenerationId] = useState<string>("");
  
  // Simplified: Just description
  const [description, setDescription] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);

  // Usage & Modals
  const [usage, setUsage] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    if (searchParams.get("success") === "true") {
      setShowSuccessMessage(true);
      // Refresh usage after successful subscription
      fetchUsage();
    }
  }, [searchParams]);

  useEffect(() => {
    if (isSignedIn) {
      fetchUsage();
    }
  }, [isSignedIn]);

  const fetchUsage = async () => {
    try {
      const response = await fetch("/api/visualizer/usage");
      const data = await response.json();
      if (data.success) {
        setUsage(data.data);
      }
    } catch (error) {
      console.error("Error fetching usage:", error);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBeforeImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBeforeImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }

    if (!beforeImage) {
      setError("Please upload a room photo first");
      return;
    }

    if (!description.trim()) {
      setError("Please describe what you want done to the space");
      return;
    }

    // Check if user has generations remaining
    if (usage && !usage.isAllowed) {
      setShowUpgradeModal(true);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("beforeImage", beforeImage);
      formData.append("description", description);

      const response = await fetch("/api/visualizer/generate", {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setAfterImage(data.data.afterImageUrl);
        setGenerationId(data.data.generationId);
        setShowQuoteModal(true);
        fetchUsage(); // Refresh usage count
      } else {
        if (data.code === "LIMIT_REACHED") {
          setShowUpgradeModal(true);
        } else {
          setError(data.error || "Failed to generate visualization");
        }
      }
    } catch (error) {
      console.error("Error generating:", error);
      setError("Failed to generate visualization. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      recorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        
        // Send to Whisper API for transcription
        const formData = new FormData();
        formData.append('audio', audioBlob);
        
        try {
          const response = await fetch('/api/transcribe', {
            method: 'POST',
            body: formData
          });
          
          const data = await response.json();
          if (data.success) {
            setDescription(prev => prev ? `${prev} ${data.text}` : data.text);
          }
        } catch (error) {
          console.error('Transcription error:', error);
        }
        
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-rose-50">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <div className="font-black text-lg">Welcome to AI Visualizer Pro!</div>
                <div className="text-sm text-green-100">You now have unlimited AI generations</div>
              </div>
            </div>
            <button onClick={() => setShowSuccessMessage(false)} className="text-white hover:text-green-100">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 text-rose-600 hover:text-rose-700 font-semibold mb-6">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to QuoteXbert
          </Link>

          <div className="inline-block mb-4">
            <div className="flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full font-bold shadow-lg">
              <span className="text-2xl">✨</span>
              <span>AI HOME VISUALIZER</span>
            </div>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black bg-gradient-to-r from-rose-900 via-pink-700 to-purple-900 bg-clip-text text-transparent mb-4">
            Visualize Your Dream Space
            <br />
            With AI Magic
          </h1>

          <p className="text-xl sm:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Upload a room photo, describe your vision (voice or text), and 
            <span className="font-bold text-rose-600"> watch AI transform it instantly</span>. 
            See exactly what your space will look like before you start!
          </p>

          {/* Usage Counter */}
          {isSignedIn && usage && (
            <div className="mt-6 inline-block">
              {usage.isPaidSubscriber ? (
                <div className="bg-gradient-to-r from-purple-100 to-pink-100 border-2 border-purple-300 px-6 py-3 rounded-full">
                  <span className="font-black text-purple-900">♾️ UNLIMITED</span>
                  <span className="text-purple-700 ml-2">• Pro Member</span>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-rose-100 to-orange-100 border-2 border-rose-300 px-6 py-3 rounded-full">
                  <span className="font-black text-gray-900">{usage.generationsRemaining} of {usage.generationsUsed + usage.generationsRemaining} Free Generations Left</span>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="ml-3 text-rose-600 hover:text-rose-700 font-bold underline"
                  >
                    Upgrade to Pro
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Main Content */}
        {!afterImage ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Left: Upload & Options */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-gray-100 order-1">
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 mb-6 flex items-center gap-3">
                <span className="text-3xl">📸</span>
                <span>1. Upload Room Photo</span>
              </h2>

              {/* Upload Area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-4 border-dashed border-gray-300 hover:border-rose-500 rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 group mb-6 bg-gradient-to-br from-gray-50 to-white"
              >
                {beforeImagePreview ? (
                  <div className="relative">
                    <Image
                      src={beforeImagePreview}
                      alt="Preview"
                      width={400}
                      height={300}
                      className="mx-auto rounded-xl shadow-lg"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-xl flex items-center justify-center">
                      <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Click to change photo
                      </span>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="text-6xl mb-4 group-hover:scale-110 transition-transform">🏠</div>
                    <p className="text-xl font-bold text-gray-900 mb-2">Click to upload room photo</p>
                    <p className="text-gray-600">or drag and drop</p>
                    <p className="text-sm text-gray-500 mt-2">PNG, JPG up to 10MB</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {/* Simplified Description Input with Voice */}
              <div className="space-y-4">
                <div>
                  <label className="block text-lg font-black text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-2xl">💬</span>
                    <span>2. Describe Your Vision</span>
                  </label>
                  <div className="relative">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="e.g., Paint the walls light gray, add hardwood flooring, modern minimalist style with plants..."
                      rows={5}
                      className="w-full px-4 py-4 pr-14 border-2 border-gray-300 rounded-xl focus:border-rose-500 focus:ring-2 focus:ring-rose-200 transition-all resize-none text-base"
                    />
                    
                    {/* Voice Button */}
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`absolute bottom-3 right-3 p-3 rounded-full transition-all ${
                        isRecording 
                          ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                          : 'bg-rose-500 hover:bg-rose-600'
                      } text-white shadow-lg`}
                    >
                      {isRecording ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <rect x="6" y="6" width="8" height="8" rx="1" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {isRecording ? (
                      <span className="text-red-600 font-bold">🔴 Recording... Click microphone to stop</span>
                    ) : (
                      <span>💡 Type or click the 🎤 microphone to describe what you want</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700">
                  {error}
                </div>
              )}

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={loading || !beforeImage || !description.trim()}
                className="w-full mt-6 bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 text-white py-5 rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>Generating Magic...</span>
                  </>
                ) : (
                  <>
                    <span className="text-3xl">✨</span>
                    <span>Generate AI Visualization</span>
                    <span className="text-3xl">→</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Why Different Section */}
            <div className="space-y-6 order-2 lg:order-2">
              {/* Why QuoteXbert is Different */}
              <div className="bg-gradient-to-br from-rose-600 via-rose-500 to-orange-500 rounded-3xl shadow-2xl p-8 text-white border-4 border-white">
                <h2 className="text-3xl font-black mb-6 flex items-center gap-3 drop-shadow-lg">
                  <span className="text-4xl">🏆</span>
                  <span className="drop-shadow-md">Why QuoteXbert is Different</span>
                </h2>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 shadow-lg">
                    <div className="font-black text-xl mb-2 text-gray-900 flex items-center gap-2">
                      <span className="text-2xl">💡</span>
                      <span>AI-Powered Fair Pricing</span>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed">
                      Unlike other platforms, we show you what jobs SHOULD cost before contractors bid. No more overpaying!
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-lg">
                    <div className="font-black text-xl mb-2 text-gray-900 flex items-center gap-2">
                      <span className="text-2xl">🎨</span>
                      <span>Visualize THEN Quote</span>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed">
                      See your renovation with AI, then get real quotes from verified contractors. Make informed decisions.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-lg">
                    <div className="font-black text-xl mb-2 text-gray-900 flex items-center gap-2">
                      <span className="text-2xl">💰</span>
                      <span>100% Free for Homeowners</span>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed">
                      Zero commissions, zero hidden fees. We charge contractors, not you. Get quotes completely free.
                    </p>
                  </div>
                  <div className="bg-white rounded-xl p-5 shadow-lg">
                    <div className="font-black text-xl mb-2 text-gray-900 flex items-center gap-2">
                      <span className="text-2xl">✅</span>
                      <span>Verified Contractors Only</span>
                    </div>
                    <p className="text-gray-700 text-base leading-relaxed">
                      Every contractor is screened, reviewed, and rated. No sketchy operators allowed.
                    </p>
                  </div>
                </div>
              </div>

              {/* Pro Testimonials */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-3xl shadow-xl p-8 border-2 border-purple-200">
                <h3 className="text-2xl font-black text-gray-900 mb-4">💬 Pro Users Love It</h3>
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-4 shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <Image
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop"
                        alt="User"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-bold text-gray-900">Jennifer L.</div>
                        <div className="text-xs text-gray-600">Pro Member • Toronto</div>
                      </div>
                    </div>
                    <div className="text-yellow-500 text-sm mb-2">⭐⭐⭐⭐⭐</div>
                    <p className="text-gray-700 text-sm">
                      "Visualized my entire basement reno before even calling contractors. Saved me from making expensive mistakes. Worth way more than $6.99!"
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <Image
                        src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop"
                        alt="User"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-bold text-gray-900">Michael R.</div>
                        <div className="text-xs text-gray-600">Pro Member • Mississauga</div>
                      </div>
                    </div>
                    <div className="text-yellow-500 text-sm mb-2">⭐⭐⭐⭐⭐</div>
                    <p className="text-gray-700 text-sm">
                      "The AI is incredible. I tried 15 different flooring options before picking one. My wife and I finally agreed on a design!"
                    </p>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow">
                    <div className="flex items-center gap-3 mb-2">
                      <Image
                        src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop"
                        alt="User"
                        width={40}
                        height={40}
                        className="rounded-full"
                      />
                      <div>
                        <div className="font-bold text-gray-900">Sarah M.</div>
                        <div className="text-xs text-gray-600">Pro Member • North York</div>
                      </div>
                    </div>
                    <div className="text-yellow-500 text-sm mb-2">⭐⭐⭐⭐⭐</div>
                    <p className="text-gray-700 text-sm">
                      "Best renovation tool ever. I generated 30+ designs for my kitchen. When I finally got quotes, I knew exactly what I wanted!"
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Results View */
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
              <div className="text-center mb-8">
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-4xl font-black text-gray-900 mb-3">Your AI Transformation is Ready!</h2>
                <p className="text-xl text-gray-600">Drag the slider to compare before and after</p>
              </div>

              <BeforeAfterSlider
                beforeImage={beforeImagePreview}
                afterImage={afterImage}
                className="mb-8"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => {
                    setAfterImage("");
                    setBeforeImage(null);
                    setBeforeImagePreview("");
                    setGenerationId("");
                  }}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  🔄 Generate Another Design
                </button>
                <button
                  onClick={() => setShowQuoteModal(true)}
                  className="bg-gradient-to-r from-rose-600 to-orange-600 text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                >
                  📋 Get Real Contractor Quotes →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <QuoteCtaModal
        isOpen={showQuoteModal}
        onClose={() => setShowQuoteModal(false)}
        generationId={generationId}
        beforeImage={beforeImagePreview}
        afterImage={afterImage}
      />

      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        generationsUsed={usage?.generationsUsed || 0}
        generationsLimit={usage?.generationsUsed + usage?.generationsRemaining || 10}
      />
    </div>
  );
}
