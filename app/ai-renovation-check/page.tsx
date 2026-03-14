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
    <div className="min-h-screen bg-white">

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white py-14 md:py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-rose-600/20 border border-rose-500/40 text-rose-300 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            🤖 AI-Powered Quality Check
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 leading-tight">
            Snap Your Reno.
            <br />
            <span className="bg-gradient-to-r from-rose-400 to-orange-400 bg-clip-text text-transparent">
              AI Be the Judge.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-xl mx-auto leading-relaxed">
            Is your renovation getting done right? Take a photo, tell us the stage — our AI will tell you what looks correct, what's missing, and what to ask your contractor.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>Free · No sign-up required</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>Results in ~30 seconds</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-400 inline-block"></span>Works mid-renovation</span>
          </div>
        </div>
      </section>

      {/* Main Tool */}
      <div className="max-w-2xl mx-auto px-4 py-10 md:py-14">

        {/* Step 1 — Photo upload */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-black flex items-center justify-center flex-shrink-0">1</span>
            <h2 className="text-xl font-black text-slate-900">Upload your renovation photo</h2>
          </div>

          {photos.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {photos.map((photo, index) => (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-slate-200">
                  <Image
                    src={photo}
                    alt={`Renovation photo ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover object-center"
                  />
                  <button
                    onClick={() => removePhoto(index)}
                    className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    aria-label="Remove photo"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <label className="block">
            <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" disabled={uploading} />
            <div className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${uploading ? 'border-rose-300 bg-rose-50' : 'border-slate-300 hover:border-rose-500 hover:bg-rose-50/40'}`}>
              {uploading ? (
                <div className="flex items-center justify-center gap-2 text-rose-600 font-semibold">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Loading photo...
                </div>
              ) : (
                <>
                  <div className="text-5xl mb-3">📸</div>
                  <p className="text-base font-bold text-slate-800">Tap to add photos</p>
                  <p className="text-sm text-slate-500 mt-1">Up to 5 images · The more angles the better</p>
                </>
              )}
            </div>
          </label>
        </div>

        {/* Step 2 — What to check */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-8 rounded-full bg-slate-900 text-white text-sm font-black flex items-center justify-center flex-shrink-0">2</span>
            <h2 className="text-xl font-black text-slate-900">What's happening in this photo?</h2>
          </div>
          <p className="text-sm text-slate-500 mb-3 ml-11">Tell us what stage or concern you want checked. The more specific, the better the AI reads it.</p>

          <div className="flex flex-wrap gap-2 mb-4 ml-11">
            {samplePrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setQuestion(prompt)}
                className={`text-sm px-3 py-2 rounded-lg border font-medium transition-all ${question === prompt ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300 hover:border-slate-500 hover:bg-slate-50'}`}
              >
                {prompt}
              </button>
            ))}
          </div>

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. Is this drywall installed correctly? Does the waterproofing look right? Is there anything missing before tile goes in?"
            rows={3}
            className="w-full border-2 border-slate-300 rounded-xl p-4 focus:border-slate-900 focus:ring-2 focus:ring-slate-200 outline-none transition-all text-slate-900 text-sm resize-none"
          />
        </div>

        {/* CTA */}
        <button
          onClick={handleAskQuestion}
          disabled={isAnalyzing || photos.length === 0 || !question.trim()}
          className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-black py-4 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all text-lg shadow-xl shadow-rose-500/20"
        >
          {isAnalyzing ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              AI is judging your reno...
            </span>
          ) : (
            "🤖 Let AI Be the Judge →"
          )}
        </button>
        <p className="text-center text-xs text-slate-400 mt-3">Free · No sign-up · ~30 seconds</p>

        {/* Result */}
        {response && (
          <div className="mt-10 bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-rose-600 to-orange-600 px-6 py-4 flex items-center gap-3">
              <span className="text-2xl">🤖</span>
              <div>
                <p className="text-white font-black text-lg leading-none">AI Verdict</p>
                <p className="text-rose-100 text-xs mt-0.5">Based on your photo & description</p>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-3">
                {response.split('\n').filter(l => l.trim()).map((line, index) => (
                  <p key={index} className="text-slate-200 text-sm leading-relaxed whitespace-pre-line">
                    {line}
                  </p>
                ))}
              </div>
              <div className="mt-6 flex items-start gap-3 bg-amber-900/40 border border-amber-600/40 rounded-xl p-4">
                <span className="text-amber-400 text-lg flex-shrink-0">⚠️</span>
                <p className="text-amber-200 text-xs leading-relaxed">
                  AI guidance is informational only — not a substitute for a licensed building inspector or professional assessment.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* How it works — below fold */}
        {!response && (
          <div className="mt-14 border-t border-slate-100 pt-12">
            <h3 className="text-center text-xl font-black text-slate-900 mb-8">How it works</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-4xl mb-2">📸</div>
                <p className="text-sm font-bold text-slate-800">Snap a photo</p>
                <p className="text-xs text-slate-500 mt-1">Any stage of your renovation</p>
              </div>
              <div>
                <div className="text-4xl mb-2">🤖</div>
                <p className="text-sm font-bold text-slate-800">AI analyzes it</p>
                <p className="text-xs text-slate-500 mt-1">Checks for issues, red flags, gaps</p>
              </div>
              <div>
                <div className="text-4xl mb-2">✅</div>
                <p className="text-sm font-bold text-slate-800">Get a verdict</p>
                <p className="text-xs text-slate-500 mt-1">Know exactly what to ask your contractor</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
