"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/lib/hooks/useAuth";

// Renovation stage chips
const STAGES = [
  { emoji: "ðŸ”¨", label: "Demolition" },
  { emoji: "ðŸªµ", label: "Framing" },
  { emoji: "ðŸ§±", label: "Drywall" },
  { emoji: "ðŸ’§", label: "Waterproofing" },
  { emoji: "ðŸª£", label: "Tile Prep" },
  { emoji: "ðŸªŸ", label: "Rough-In" },
  { emoji: "ðŸª´", label: "Flooring" },
  { emoji: "ðŸŽ¨", label: "Painting" },
  { emoji: "âœ¨", label: "Finishing" },
  { emoji: "ðŸš¿", label: "Plumbing" },
  { emoji: "âš¡", label: "Electrical" },
  { emoji: "ðŸ”§", label: "Fixtures" },
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

function getVerdict(contractorQuote: number, aiLow: number, aiHigh: number) {
  const aiMid = (aiLow + aiHigh) / 2;
  const diff = ((contractorQuote - aiMid) / aiMid) * 100;
  if (diff < -15)
    return {
      label: "Below Market â€” Possibly Too Low",
      emoji: "âš ï¸",
      colorClass: "bg-amber-50 border-amber-300 text-amber-800",
      recommendation: "Ask Contractor",
      detail: "Your contractor's quote is well below typical rates. Ask for a full written breakdown â€” unusually low quotes can mean corner-cutting on materials or scope gaps.",
    };
  if (diff <= 15)
    return {
      label: "Looks Fair",
      emoji: "âœ…",
      colorClass: "bg-green-50 border-green-300 text-green-800",
      recommendation: "Monitor Progress",
      detail: "Your contractor's quote is within the typical Toronto & GTA range. Proceed with confidence â€” just make sure everything is in writing.",
    };
  if (diff <= 35)
    return {
      label: "Slightly High",
      emoji: "ðŸŸ¡",
      colorClass: "bg-orange-50 border-orange-300 text-orange-800",
      recommendation: "Ask Contractor",
      detail: "The quote is a bit above the AI estimate. Premium materials or a tight timeline may justify it. Ask for a line-item breakdown before agreeing.",
    };
  return {
    label: "Overpriced â€” Get Another Quote",
    emoji: "ðŸš¨",
    colorClass: "bg-red-50 border-red-300 text-red-800",
    recommendation: "Get Professional Inspection",
    detail: "The quote is well above typical market rates. Get at least one more quote before proceeding â€” or post your project to our job board.",
  };
}

export default function SecondOpinionPage() {
  const { isSignedIn } = useAuth();

  // Form state (simplified)
  const [photos, setPhotos] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [stage, setStage] = useState("");
  const [worry, setWorry] = useState("");
  const [contractorQuoteRaw, setContractorQuoteRaw] = useState("");

  // Submit state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EstimateResult | null>(null);
  const [formError, setFormError] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (photos.length === 0 && !stage && !worry.trim()) {
      setFormError("Please upload a photo or describe your concern.");
      return;
    }
    setFormError("");
    setLoading(true);
    setResult(null);
    try {
      const description =
        [
          stage ? `Renovation stage: ${stage}.` : "",
          worry ? `Homeowner concern: ${worry}` : "",
          contractorQuoteRaw ? `Contractor quoted: ${contractorQuoteRaw}` : "",
        ]
          .filter(Boolean)
          .join(" ") || "General renovation second opinion.";

      const payload = {
        projectType: stage || "General Contracting",
        description,
        photos: photos.slice(0, 5),
        postalCode: "M5V",
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
      setFormError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verdict =
    result && contractorQuote > 0 && result.totals?.total_low && result.totals?.total_high
      ? getVerdict(contractorQuote, result.totals.total_low, result.totals.total_high)
      : null;

  return (
    <div className="min-h-screen bg-white">
      {/* â”€â”€ Hero â”€â”€ */}
      <section className="bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 border-b border-rose-100 py-8 md:py-12">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1.5 rounded-full mb-3 uppercase tracking-wide">
            ðŸ“¸ AI Second Opinion Â· Free Â· 30 Seconds
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 leading-tight">
            Take a photo. Get AI guidance.
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-lg mx-auto leading-relaxed">
            Upload a photo of your renovation, tell us what stage it is, and our AI will tell you
            what looks right, what may be missing, and what to ask your contractor.
          </p>
        </div>
      </section>

      <div className="max-w-xl mx-auto px-4 py-6 md:py-10">
        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* â”€â”€ Step 1: Photo Upload â”€â”€ */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">1</span>
                <h2 className="text-sm font-bold text-slate-900">Upload project photo</h2>
                <span className="ml-auto text-xs text-slate-400">optional but recommended</span>
              </div>
              <div className="p-4">
                {photos.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {photos.map((photo, i) => (
                      <div key={i} className="relative group aspect-square">
                        <Image
                          src={photo}
                          alt={`Photo ${i + 1}`}
                          fill
                          className="object-cover rounded-lg border border-slate-200"
                        />
                        <button
                          type="button"
                          onClick={() => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
                          className="absolute top-1 right-1 bg-red-600 text-white w-5 h-5 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center leading-none"
                          aria-label="Remove photo"
                        >Ã—</button>
                      </div>
                    ))}
                  </div>
                )}
                {photos.length < 5 && (
                  <label className="block cursor-pointer">
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handlePhotoUpload} disabled={uploading} />
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-5 text-center hover:border-rose-400 hover:bg-rose-50 transition-all">
                      {uploading ? (
                        <span className="text-rose-600 font-medium text-sm">Uploadingâ€¦</span>
                      ) : (
                        <>
                          <div className="text-2xl mb-1">ðŸ“·</div>
                          <p className="text-sm font-semibold text-slate-700">
                            {photos.length === 0 ? "Tap to add photos" : "Add more photos"}
                          </p>
                          <p className="text-xs text-slate-400 mt-0.5">Up to 5 images</p>
                        </>
                      )}
                    </div>
                  </label>
                )}
              </div>
            </div>

            {/* â”€â”€ Step 2: Renovation Stage â”€â”€ */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">2</span>
                <h2 className="text-sm font-bold text-slate-900">What stage is this?</h2>
              </div>
              <div className="p-4">
                <div className="flex flex-wrap gap-2">
                  {STAGES.map((s) => (
                    <button
                      key={s.label}
                      type="button"
                      onClick={() => setStage(stage === s.label ? "" : s.label)}
                      className={`stage-chip${stage === s.label ? " active" : ""}`}
                    >
                      {s.emoji} {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* â”€â”€ Step 3: Concern â”€â”€ */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-rose-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">3</span>
                <h2 className="text-sm font-bold text-slate-900">What are you worried about?</h2>
                <span className="ml-auto text-xs text-slate-400">optional</span>
              </div>
              <div className="p-4">
                <textarea
                  value={worry}
                  onChange={(e) => setWorry(e.target.value)}
                  placeholder="e.g. The drywall doesn't look finished, there are gaps near the windowâ€¦"
                  rows={3}
                  className="form-input form-textarea w-full text-sm"
                />
              </div>
            </div>

            {/* â”€â”€ Step 4: Contractor Quote â”€â”€ */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0">4</span>
                <h2 className="text-sm font-bold text-slate-900">Got a contractor quote?</h2>
                <span className="ml-auto text-xs text-slate-400">optional</span>
              </div>
              <div className="p-4">
                <p className="text-xs text-slate-500 mb-3">We'll tell you if it's fair, too high, or suspiciously low.</p>
                <div className="relative max-w-[180px]">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold text-sm">$</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={contractorQuoteRaw}
                    onChange={(e) => setContractorQuoteRaw(e.target.value)}
                    placeholder="e.g. 18,500"
                    className="form-input pl-7 text-base font-semibold w-full"
                  />
                </div>
              </div>
            </div>

            {formError && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">{formError}</p>
            )}

            {/* â”€â”€ Submit â”€â”€ */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-black py-4 rounded-2xl text-base shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Analyzing your projectâ€¦
                </span>
              ) : (
                "Get AI Second Opinion â†’"
              )}
            </button>
            <p className="text-center text-xs text-slate-400">Free Â· No sign-up required Â· ~30 seconds</p>

            {/* How it works */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              {[
                { icon: "ðŸ“·", step: "Upload photo" },
                { icon: "ðŸ¤–", step: "AI analyzes it" },
                { icon: "ðŸ“Š", step: "Get guidance" },
              ].map((s) => (
                <div key={s.step} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                  <div className="text-xl mb-1">{s.icon}</div>
                  <p className="text-xs font-semibold text-slate-600">{s.step}</p>
                </div>
              ))}
            </div>
          </form>
        ) : (
          /* â”€â”€ Results â”€â”€ */
          <div className="space-y-4">

            {/* Verdict */}
            {verdict && (
              <div className={`rounded-2xl border-2 p-4 ${verdict.colorClass}`}>
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none">{verdict.emoji}</span>
                  <div>
                    <p className="font-black text-base mb-1">{verdict.label}</p>
                    <p className="text-sm leading-relaxed opacity-90">{verdict.detail}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Price Comparison */}
            {result.totals && (contractorQuote > 0 || result.totals.total_low) && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
                <h2 className="text-xs font-bold text-slate-500 uppercase mb-3 tracking-wide">Price Comparison</h2>
                <div className={`grid gap-2 ${contractorQuote > 0 ? "grid-cols-3" : "grid-cols-2"}`}>
                  {contractorQuote > 0 && (
                    <div className="rounded-xl p-3 text-center bg-slate-50 border border-slate-200">
                      <p className="text-[10px] font-semibold text-slate-500 uppercase mb-1">Their Quote</p>
                      <p className="text-xl font-black text-slate-900">{formatCurrency(contractorQuote)}</p>
                    </div>
                  )}
                  <div className="rounded-xl p-3 text-center bg-rose-50 border border-rose-200">
                    <p className="text-[10px] font-semibold text-rose-600 uppercase mb-1">AI Low</p>
                    <p className="text-xl font-black text-rose-700">{formatCurrency(result.totals.total_low || 0)}</p>
                  </div>
                  <div className="rounded-xl p-3 text-center bg-orange-50 border border-orange-200">
                    <p className="text-[10px] font-semibold text-orange-600 uppercase mb-1">AI High</p>
                    <p className="text-xl font-black text-orange-700">{formatCurrency(result.totals.total_high || 0)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Structured AI Feedback */}
            {result.summary && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-sm font-bold text-slate-900">ðŸ¤– AI Analysis</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  <div className="px-4 py-3">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-1.5">What the AI Sees</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{result.summary}</p>
                  </div>
                  {result.scope && result.scope.length > 0 && (
                    <div className="px-4 py-3">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-2">What Looks Included</p>
                      <ul className="space-y-1">
                        {result.scope.slice(0, 5).map((item, i) => (
                          <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                            <span className="text-green-500 mt-0.5 flex-shrink-0">âœ“</span>{item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className="px-4 py-3">
                    <p className="text-xs font-bold text-slate-500 uppercase mb-2">Questions to Ask Your Contractor</p>
                    <ul className="space-y-1.5">
                      {["Is labour included, or billed separately?","What materials brand/grade are you using?","Are permits included in the price?","What's your timeline and payment schedule?"].map((q, i) => (
                        <li key={i} className="text-sm text-slate-700 flex items-start gap-2">
                          <span className="text-rose-500 flex-shrink-0">â†’</span>{q}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {verdict && (
                    <div className="px-4 py-3">
                      <p className="text-xs font-bold text-slate-500 uppercase mb-1.5">Recommendation</p>
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border-2 ${verdict.colorClass}`}>
                        {verdict.emoji} {verdict.recommendation}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Line Items */}
            {result.line_items && result.line_items.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                  <h2 className="text-sm font-bold text-slate-900">Cost Breakdown</h2>
                </div>
                <div className="divide-y divide-slate-100">
                  {result.line_items.map((item, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-2.5">
                      <span className="text-sm text-slate-700 flex-1 pr-3">{item.description}</span>
                      <span className="text-sm font-semibold text-slate-900 whitespace-nowrap">{formatCurrency(item.low)} â€“ {formatCurrency(item.high)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTAs */}
            <div className="bg-gradient-to-br from-rose-50 to-orange-50 rounded-2xl border border-rose-200 p-4">
              <h2 className="text-sm font-bold text-slate-900 mb-1">Next Step</h2>
              <p className="text-xs text-slate-600 mb-3">Get competing bids from verified GTA contractors.</p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Link href={isSignedIn ? "/create-lead" : "/sign-up"} className="flex-1 flex items-center justify-center gap-1.5 bg-gradient-to-r from-rose-600 to-orange-600 hover:from-rose-700 hover:to-orange-700 text-white font-bold py-3 px-4 rounded-xl shadow-sm transition-all text-sm text-center">
                  ðŸ“‹ Post Project & Get Bids
                </Link>
                <Link href="/contractors" className="flex-1 flex items-center justify-center gap-1.5 bg-white text-rose-700 font-semibold py-3 px-4 rounded-xl border-2 border-rose-200 transition-all text-sm text-center">
                  ðŸ” Find Contractor
                </Link>
              </div>
              <button
                onClick={() => { setResult(null); setPhotos([]); setStage(""); setWorry(""); setContractorQuoteRaw(""); }}
                className="w-full mt-2 text-xs text-slate-500 hover:text-rose-700 py-1.5 transition-colors"
              >
                â†» Try another project
              </button>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-slate-400 text-center px-2 leading-relaxed">
              AI estimates are based on Toronto & GTA market data and are for informational purposes only.
              Always get written quotes from licensed contractors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
