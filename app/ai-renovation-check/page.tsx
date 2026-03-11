"use client";

import { useState } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AIRenovationCheckPage() {
  const { authUser, isSignedIn } = useAuth();
  const router = useRouter();
  const [photos, setPhotos] = useState<string[]>([]);
  const [question, setQuestion] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const samplePrompts = [
    "Does this shower prep look correct?",
    "Should there be cement board here?",
    "Is this waterproofing done right?",
    "Is this tile backing okay?",
    "Does this framing look proper?",
    "Is this electrical work safe?"
  ];

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);

    try {
      const uploadedUrls: string[] = [];
      
      for (const file of Array.from(files)) {
        // Convert to base64 for demo purposes
        const reader = new FileReader();
        const base64Promise = new Promise<string>((resolve) => {
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        const base64 = await base64Promise;
        uploadedUrls.push(base64);
      }

      setPhotos([...photos, ...uploadedUrls]);
    } catch (error) {
      console.error("Error uploading photos:", error);
      alert("Failed to upload photos. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!question.trim() || photos.length === 0) {
      alert("Please upload at least one photo and ask a question.");
      return;
    }

    setIsAnalyzing(true);

    try {
      // Mock AI response for now - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setResponse(`Based on your photo, here's what I can see:

**Observations:**
Your renovation work shows signs that may need attention. I notice some areas that could use professional verification.

**What to Ask Your Contractor:**
1. Can you explain the installation method used here?
2. Is this approach up to current building codes?
3. What materials were specified for this area?
4. Can I see documentation of the work plan?

**Recommended Next Steps:**
- Document this with additional photos from different angles
- Request clarification from your contractor in writing
- Consider getting a second opinion from a licensed building inspector
- Check if your work requires a building permit

**Important Disclaimer:**
⚠️ This AI guidance is informational only and NOT a replacement for licensed building inspections or code compliance reviews. Always consult with qualified professionals for definitive assessments.

If you have concerns about safety or code compliance, contact a licensed building inspector immediately.`);
    } catch (error) {
      console.error("Error analyzing photo:", error);
      alert("Failed to analyze photo. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-blue-100 text-blue-800 text-sm font-semibold px-4 py-2 rounded-full mb-4">
            🔍 AI Renovation Inspector
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Ask AI About Your Renovation
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Upload photos of your in-progress renovation and get AI-powered guidance on whether work looks correct.
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-slate-200 overflow-hidden">
          {/* Photo Upload Section */}
          <div className="p-8 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              1. Upload Renovation Photos
            </h2>
            
            {photos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {photos.map((photo, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={photo}
                      alt={`Renovation photo ${index + 1}`}
                      width={200}
                      height={200}
                      className="w-full h-40 object-cover rounded-lg border-2 border-slate-200"
                    />
                    <button
                      onClick={() => removePhoto(index)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <label className="block">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={uploading}
              />
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all">
                {uploading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span className="text-blue-600 font-semibold">Uploading...</span>
                  </div>
                ) : (
                  <>
                    <svg className="mx-auto h-12 w-12 text-slate-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-lg font-semibold text-slate-700 mb-2">
                      Click to upload photos
                    </p>
                    <p className="text-sm text-slate-500">
                      Upload multiple angles of the work you want checked
                    </p>
                  </>
                )}
              </div>
            </label>
          </div>

          {/* Question Section */}
          <div className="p-8 border-b border-slate-200">
            <h2 className="text-2xl font-bold text-slate-900 mb-4">
              2. Ask Your Question
            </h2>
            
            <div className="mb-4">
              <p className="text-sm text-slate-600 mb-3">Try these common questions:</p>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(prompt)}
                    className="text-sm bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 px-3 py-2 rounded-lg transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="What do you want to know about this work?"
              rows={4}
              className="w-full border-2 border-slate-300 rounded-xl p-4 focus:border-blue-500 focus:ring focus:ring-blue-200 transition-all text-slate-900"
            />

            <button
              onClick={handleAskQuestion}
              disabled={isAnalyzing || photos.length === 0 || !question.trim()}
              className="mt-4 w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] shadow-lg"
            >
              {isAnalyzing ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </span>
              ) : (
                "Get AI Guidance"
              )}
            </button>
          </div>

          {/* Response Section */}
          {response && (
            <div className="p-8 bg-slate-50">
              <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI Guidance
              </h2>
              <div className="bg-white rounded-xl p-6 border-2 border-blue-200">
                <div className="prose prose-slate max-w-none">
                  {response.split('\n').map((line, index) => (
                    <p key={index} className="mb-3 text-slate-700 whitespace-pre-line">
                      {line}
                    </p>
                  ))}
                </div>
              </div>

              <div className="mt-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-bold text-amber-900 mb-1">Important Disclaimer</p>
                    <p className="text-sm text-amber-800">
                      This AI guidance is informational only and NOT a replacement for licensed building inspections, 
                      professional contractor assessments, or code compliance reviews. Always consult with qualified 
                      professionals for definitive assessments of your renovation work.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="mt-8 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <div className="text-3xl mb-3">🔍</div>
            <h3 className="font-bold text-slate-900 mb-2">Visual Analysis</h3>
            <p className="text-sm text-slate-600">
              AI analyzes your photos to identify potential issues or concerns with the work.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <div className="text-3xl mb-3">💬</div>
            <h3 className="font-bold text-slate-900 mb-2">Ask Your Contractor</h3>
            <p className="text-sm text-slate-600">
              Get specific questions to ask your contractor about the work being done.
            </p>
          </div>
          
          <div className="bg-white rounded-xl p-6 border-2 border-slate-200">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-bold text-slate-900 mb-2">Document Issues</h3>
            <p className="text-sm text-slate-600">
              Create a record of concerns to discuss with your contractor or inspector.
            </p>
          </div>
        </div>

        {/* When to Use */}
        <div className="mt-8 bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl p-8 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-slate-900 mb-4">When to Use This Tool</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Good Uses:
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Getting a second opinion on work in progress</li>
                <li>• Learning what questions to ask your contractor</li>
                <li>• Understanding if something looks unusual</li>
                <li>• Documenting concerns before final payment</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                NOT a Replacement For:
              </h4>
              <ul className="space-y-2 text-sm text-slate-700">
                <li>• Licensed building inspections</li>
                <li>• Professional contractor assessments</li>
                <li>• Code compliance verification</li>
                <li>• Structural engineering reviews</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
