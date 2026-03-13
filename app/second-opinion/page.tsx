"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";

const PROJECT_TYPES = [
  "Kitchen Renovation",
  "Bathroom Renovation",
  "Basement Finishing",
  "Flooring Installation",
  "Roof Replacement",
  "Deck / Patio",
  "Painting (Interior)",
  "Painting (Exterior)",
  "Electrical Work",
  "Plumbing",
  "HVAC",
  "Windows & Doors",
  "Siding",
  "Landscaping",
  "General Contracting",
  "Other",
];

interface EstimateResult {
  totals?: { total_low?: number; total_high?: number };
  summary?: string;
  line_items?: Array<{ description: string; low: number; high: number }>;
  scope?: string[];
  confidence?: string;
}

function formatCurrency(n: number) {
  return "$" + n.toLocaleString("en-CA", { maximumFractionDigits: 0 });
}

function getVerdict(
  contractorQuote: number,
  aiLow: number,
  aiHigh: number
): { label: string; color: string; icon: string; detail: string } {
  const aiMid = (aiLow + aiHigh) / 2;
  const diff = ((contractorQuote - aiMid) / aiMid) * 100;

  if (diff < -15)
    return {
      label: "Below Market — Possibly Too Low",
      color: "text-amber-700 bg-amber-50 border-amber-200",
      icon: "⚠️",
      detail:
        "Your contractor's quote is significantly below typical market rates. This could mean they plan to cut corners, upgrade materials later, or are missing scope. Ask for a detailed breakdown.",
    };
  if (diff <= 15)
    return {
      label: "Looks Fair",
      color: "text-green-700 bg-green-50 border-green-200",
      icon: "✅",
      detail:
        "Your contractor's quote is within the typical market range for this type of work in Toronto & GTA. Proceed with confidence — just make sure everything is in writing.",
    };
  if (diff <= 35)
    return {
      label: "Slightly High",
      color: "text-orange-700 bg-orange-50 border-orange-200",
      icon: "🟡",
      detail:
        "Your quote is a bit above the AI estimate. This may be justified by premium materials, tight timeline, or their experience level. Consider asking for a line-item breakdown and negotiating.",
    };
  return {
    label: "Overpriced — Get Another Quote",
    color: "text-red-700 bg-red-50 border-red-200",
    icon: "🚨",
    detail:
      "Your contractor's quote is well above typical market rates. We strongly recommend getting at least one more quote before proceeding. Post your project to get bids from verified contractors.",
  };
}

export default function SecondOpinionPage() {
  const { isSignedIn } = useAuth();

  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [contractorQuoteRaw, setContractorQuoteRaw] = useState("");
  const [whatChanged, setWhatChanged] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const contractorQuote = parseFloat(contractorQuoteRaw.replace(/[^0-9.]/g, "")) || 0;

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (photos.length + files.length > 5) {
      alert("Maximum 5 photos allowed.");
      return;
    }
    setUploading(true);
    try {
      const newPhotos: string[] = [];
      for (const file of Array.from(files)) {
        const base64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        newPhotos.push(base64);
      }
      setPhotos((prev) => [...prev, ...newPhotos]);
    } catch {
      alert("Failed to upload photos. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!projectType) e.projectType = "Please select a project type.";
    if (description.trim().length < 10)
      e.description = "Please describe the work (at least 10 characters).";
    if (!contractorQuoteRaw.trim())
      e.contractorQuote = "Please enter the contractor's quoted price.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setResult(null);
    try {
      const payload = {
        projectType,
        description:
          description +
          (whatChanged ? `\n\nChange order / scope change: ${whatChanged}` : "") +
          `\n\nContractor quoted: ${contractorQuoteRaw}`,
        photos: photos.slice(0, 5),
        postalCode: postalCode || "M5V",
      };
      const res = await fetch("/api/estimate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate estimate.");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      alert(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verdict =
    result && contractorQuote > 0 && result.totals?.total_low && result.totals?.total_high
      ? getVerdict(contractorQuote, result.totals.total_low, result.totals.total_high)
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50">
      {/* Hero */}
      <section className="py-10 md:py-16 border-b border-orange-100 bg-white/70 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="inline-block bg-rose-100 text-rose-800 text-sm font-bold px-4 py-2 rounded-full mb-4">
            🔍 SECOND OPINION TOOL · FREE
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight">
            Is Your Contractor's Quote Fair?
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-6 leading-relaxed">
            Already mid-renovation and got a surprise change order? Describe the work,
            enter the quoted price, and get an <strong>instant AI second opinion</strong> based
            on real Toronto &amp; GTA market rates.
          </p>
          <div className="flex flex-wrap gap-3 justify-center text-sm">
            <span className="bg-green-100 text-green-800 px-3 py-1.5 rounded-full font-semibold">✅ 100% Free</span>
            <span className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-full font-semibold">⚡ Results in 30 seconds</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1.5 rounded-full font-semibold">📍 Toronto & GTA Prices</span>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {!result ? (
          /* Form */
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Step 1 — Project Type */}
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="bg-rose-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold">1</span>
                What type of project is this?
              </h2>
              <p className="text-sm text-slate-500 mb-4">Select the category that best matches the work being done.</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {PROJECT_TYPES.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setProjectType(type);
                      setErrors((prev) => ({ ...prev, projectType: "" }));
                    }}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border-2 transition-all text-left leading-tight ${
                      projectType === type
                        ? "border-rose-500 bg-rose-50 text-rose-800"
                        : "border-slate-200 text-slate-700 hover:border-rose-300 hover:bg-rose-50"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              {errors.projectType && (
                <p className="mt-2 text-sm text-red-600">{errors.projectType}</p>
              )}
            </div>

            {/* Step 2 — Describe the work */}
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="bg-rose-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold">2</span>
                Describe what the contractor is doing
              </h2>
              <p className="text-sm text-slate-500 mb-3">
                Be specific: room size, materials, scope. The more detail, the more accurate the estimate.
              </p>
              <textarea
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  setErrors((prev) => ({ ...prev, description: "" }));
                }}
                placeholder="e.g. Full bathroom renovation — replace tub with walk-in shower, new tile floor (80 sq ft), vanity, toilet, and all fixtures. About 50 sq ft total."
                rows={4}
                className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-rose-400 focus:ring focus:ring-rose-100 transition text-slate-900 placeholder-slate-400"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description}</p>
              )}
            </div>

            {/* Step 3 — Contractor Quote */}
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="bg-rose-600 text-white w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold">3</span>
                What did your contractor quote?
              </h2>
              <p className="text-sm text-slate-500 mb-3">
                Enter the total quoted price so we can tell you if it's fair.
              </p>
              <div className="relative max-w-xs">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold text-lg">$</span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={contractorQuoteRaw}
                  onChange={(e) => {
                    setContractorQuoteRaw(e.target.value);
                    setErrors((prev) => ({ ...prev, contractorQuote: "" }));
                  }}
                  placeholder="e.g. 18,500"
                  className="w-full pl-8 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-rose-400 focus:ring focus:ring-rose-100 transition text-slate-900 text-lg font-semibold"
                />
              </div>
              {errors.contractorQuote && (
                <p className="mt-1 text-sm text-red-600">{errors.contractorQuote}</p>
              )}
            </div>

            {/* Step 4 — What Changed (optional) */}
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold">4</span>
                Change order or scope change? <span className="text-slate-400 font-normal text-sm">(optional)</span>
              </h2>
              <p className="text-sm text-slate-500 mb-3">
                If the contractor added new work or changed the price mid-project, describe what changed.
              </p>
              <textarea
                value={whatChanged}
                onChange={(e) => setWhatChanged(e.target.value)}
                placeholder="e.g. They found mold behind the wall and are now charging an extra $4,000 to remediate and replace the subfloor..."
                rows={3}
                className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-rose-400 focus:ring focus:ring-rose-100 transition text-slate-900 placeholder-slate-400"
              />
            </div>

            {/* Step 5 — Photos (optional) */}
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold">5</span>
                Upload photos <span className="text-slate-400 font-normal text-sm">(optional, improves accuracy)</span>
              </h2>
              <p className="text-sm text-slate-500 mb-4">
                Photos of the project site help the AI give a more accurate estimate.
              </p>

              {photos.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-4">
                  {photos.map((photo, i) => (
                    <div key={i} className="relative group">
                      <Image
                        src={photo}
                        alt={`Photo ${i + 1}`}
                        width={100}
                        height={100}
                        className="w-full h-20 object-cover rounded-lg border-2 border-slate-200"
                      />
                      <button
                        type="button"
                        onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                        className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {photos.length < 5 && (
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handlePhotoUpload}
                    disabled={uploading}
                  />
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-rose-400 hover:bg-rose-50 transition-all">
                    {uploading ? (
                      <span className="text-rose-600 font-medium text-sm">Uploading...</span>
                    ) : (
                      <>
                        <svg className="mx-auto h-8 w-8 text-slate-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-sm font-medium text-slate-600">Click to add photos</p>
                        <p className="text-xs text-slate-400 mt-1">Up to 5 images</p>
                      </>
                    )}
                  </div>
                </label>
              )}
            </div>

            {/* Step 6 — Postal Code */}
            <div className="p-6 md:p-8 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <span className="bg-slate-200 text-slate-600 w-6 h-6 rounded-full text-sm flex items-center justify-center font-bold">6</span>
                Your postal code <span className="text-slate-400 font-normal text-sm">(optional)</span>
              </h2>
              <p className="text-sm text-slate-500 mb-3">Helps calibrate prices to your exact area within the GTA.</p>
              <input
                type="text"
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value.toUpperCase())}
                maxLength={7}
                placeholder="e.g. M5V 2T6"
                className="w-full max-w-[160px] border-2 border-slate-200 rounded-xl px-4 py-2.5 focus:border-rose-400 focus:ring focus:ring-rose-100 transition text-slate-900 font-mono"
              />
            </div>

            {/* Submit */}
            <div className="p-6 md:p-8 bg-slate-50">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-black py-4 rounded-xl text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing market rates...
                  </span>
                ) : (
                  "Get My Second Opinion →"
                )}
              </button>
              <p className="text-center text-xs text-slate-500 mt-3">
                Free AI estimate • No sign-up required • Results in ~30 seconds
              </p>
            </div>
          </form>
        ) : (
          /* Results */
          <div className="space-y-6">
            {/* Verdict Banner */}
            {verdict && (
              <div className={`rounded-2xl border-2 p-6 ${verdict.color}`}>
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{verdict.icon}</span>
                  <div className="flex-1">
                    <p className="font-black text-xl mb-1">{verdict.label}</p>
                    <p className="text-sm leading-relaxed">{verdict.detail}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Quote Comparison */}
            {result.totals && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Price Comparison</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {contractorQuote > 0 && (
                    <div className="bg-slate-50 rounded-xl p-4 text-center border-2 border-slate-200">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Your Contractor Quoted</p>
                      <p className="text-3xl font-black text-slate-900">{formatCurrency(contractorQuote)}</p>
                    </div>
                  )}
                  <div className="bg-rose-50 rounded-xl p-4 text-center border-2 border-rose-200">
                    <p className="text-xs font-semibold text-rose-700 uppercase mb-1">AI Low Estimate</p>
                    <p className="text-3xl font-black text-rose-700">{formatCurrency(result.totals.total_low || 0)}</p>
                  </div>
                  <div className="bg-orange-50 rounded-xl p-4 text-center border-2 border-orange-200">
                    <p className="text-xs font-semibold text-orange-700 uppercase mb-1">AI High Estimate</p>
                    <p className="text-3xl font-black text-orange-700">{formatCurrency(result.totals.total_high || 0)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* AI Summary */}
            {result.summary && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-3">AI Analysis</h2>
                <p className="text-slate-700 leading-relaxed">{result.summary}</p>
              </div>
            )}

            {/* Line Items */}
            {result.line_items && result.line_items.length > 0 && (
              <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Cost Breakdown</h2>
                <div className="space-y-3">
                  {result.line_items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0">
                      <span className="text-slate-700 flex-1 pr-4">{item.description}</span>
                      <span className="text-slate-900 font-semibold whitespace-nowrap">
                        {formatCurrency(item.low)} – {formatCurrency(item.high)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl border-2 border-rose-200 p-6">
              <h2 className="text-xl font-bold text-slate-900 mb-2">What Would You Like to Do?</h2>
              <p className="text-slate-600 text-sm mb-5">
                Whether your quote is fair or not, your next step is getting competing bids from verified GTA contractors.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href={isSignedIn ? "/create-lead" : "/sign-up"}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-bold py-3 px-6 rounded-xl shadow-md transition-all hover:scale-[1.02] text-center"
                >
                  📋 Post Project & Get Bids
                </Link>
                <Link
                  href="/contractors"
                  className="flex items-center justify-center gap-2 bg-white hover:bg-rose-50 text-rose-700 font-bold py-3 px-6 rounded-xl border-2 border-rose-300 transition-all hover:scale-[1.02] text-center"
                >
                  🔍 Find Another Contractor
                </Link>
              </div>
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => { setResult(null); setPhotos([]); }}
                  className="text-slate-600 hover:text-rose-700 text-sm font-medium py-2 transition-colors"
                >
                  ↻ Get Another Second Opinion
                </button>
                <Link
                  href="/ai-renovation-check"
                  className="text-slate-600 hover:text-rose-700 text-sm font-medium py-2 transition-colors text-center"
                >
                  🔍 Check Work Quality with AI Inspector
                </Link>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <strong>Disclaimer:</strong> This AI estimate is based on typical Toronto & GTA market rates and is provided for informational purposes only.
              Actual costs vary based on contractor experience, material choices, timeline, and site conditions.
              Always get 2–3 written quotes from licensed contractors before making decisions.
            </div>
          </div>
        )}

        {/* How It Works */}
        {!result && (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { icon: "📝", title: "Describe the Work", desc: "Tell us exactly what your contractor plans to do and what they quoted." },
              { icon: "🤖", title: "AI Analyzes Pricing", desc: "Our AI compares against real Toronto & GTA renovation market rates." },
              { icon: "📊", title: "Get a Clear Verdict", desc: "See if the quote is fair, high, or dangerously low — in plain English." },
            ].map((step) => (
              <div key={step.title} className="bg-white rounded-xl p-5 border border-slate-200 shadow">
                <div className="text-3xl mb-2">{step.icon}</div>
                <h3 className="font-bold text-slate-900 mb-1">{step.title}</h3>
                <p className="text-sm text-slate-600">{step.desc}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
