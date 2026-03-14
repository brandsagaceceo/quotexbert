"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  trackSecondOpinionStarted,
  trackSecondOpinionCompleted,
  trackCreateAccountClicked,
} from "@/lib/tracking";
import {
  Upload,
  DollarSign,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type Verdict = "fair" | "possibly_high" | "likely_overpriced";

interface CheckResult {
  verdict: Verdict;
  verdictLabel: string;
  summaryLine: string;
  expectedRange: { low: string; high: string };
  quotedAmount: number;
  whatLooksOk: string[];
  whatToWatch: string[];
  questionsToAsk: string[];
  disclaimer: string;
}

// ─── Verdict card config ──────────────────────────────────────────────────────

const VERDICT_CONFIG: Record<
  Verdict,
  { icon: React.ReactNode; bg: string; border: string; badge: string; label: string }
> = {
  fair: {
    icon: <CheckCircle className="w-7 h-7 text-green-600" />,
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-800",
    label: "Looks Fair",
  },
  possibly_high: {
    icon: <AlertTriangle className="w-7 h-7 text-amber-500" />,
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-800",
    label: "Possibly High",
  },
  likely_overpriced: {
    icon: <XCircle className="w-7 h-7 text-red-500" />,
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-800",
    label: "Likely Overpriced",
  },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCAD(n: number): string {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 0,
  }).format(n);
}

async function fetchVerdict(
  description: string,
  quotedPrice: number,
  photoBase64?: string | null
): Promise<CheckResult> {
  const question = `A homeowner in the GTA has been quoted ${formatCAD(quotedPrice)} for the following renovation:\n\n"${description}"\n\nIs this quote fair, possibly high, or likely overpriced compared to 2026 Toronto/GTA market rates?\n\nRespond with JSON containing exactly these fields:\n- verdict: "fair" | "possibly_high" | "likely_overpriced"\n- verdictLabel: short label string\n- summaryLine: one sentence for the homeowner\n- expectedRangeLow: number (CAD, no formatting)\n- expectedRangeHigh: number (CAD, no formatting)\n- whatLooksOk: array of 2-3 strings (empty array if not applicable)\n- whatToWatch: array of 2-3 strings (empty array if fair)\n- questionsToAsk: array of 3 questions the homeowner should ask their contractor\n- disclaimer: one short disclaimer sentence`;

  const body: Record<string, string> = { question };
  if (photoBase64) {
    body.photo = photoBase64;
  } else {
    body.photo = "";
  }

  const resp = await fetch("/api/ai-renovation-check", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!resp.ok) throw new Error("AI service unavailable. Please try again.");

  const raw = await resp.json();

  let parsed: any;
  try {
    // The AI may return JSON inside a text field or directly
    const text: string =
      typeof raw.response === "string"
        ? raw.response
        : typeof raw.assessment === "string"
        ? raw.assessment
        : JSON.stringify(raw);
    // Extract JSON block if wrapped in markdown code fences
    const m = text.match(/```(?:json)?\s*([\s\S]*?)```/) ?? text.match(/(\{[\s\S]*\})/);
    parsed = JSON.parse(m ? (m[1] ?? text) : text);
  } catch {
    parsed = {
      verdict: "possibly_high",
      verdictLabel: "Needs More Detail",
      summaryLine:
        raw.assessment ||
        "Add more project detail or a photo for a precise comparison.",
      expectedRangeLow: quotedPrice * 0.75,
      expectedRangeHigh: quotedPrice * 1.05,
      whatLooksOk: [],
      whatToWatch: ["More detail or a photo would improve this comparison"],
      questionsToAsk: [
        "Does this price include all materials and labour?",
        "Does the quote include permit fees?",
        "What is the payment schedule?",
      ],
      disclaimer:
        "AI estimates are for guidance only. Verify with a licensed contractor.",
    };
  }

  const v: Verdict =
    parsed.verdict === "fair"
      ? "fair"
      : parsed.verdict === "likely_overpriced"
      ? "likely_overpriced"
      : "possibly_high";

  return {
    verdict: v,
    verdictLabel: parsed.verdictLabel ?? VERDICT_CONFIG[v].label,
    summaryLine: parsed.summaryLine ?? parsed.assessment ?? "",
    expectedRange: {
      low: formatCAD(Number(parsed.expectedRangeLow ?? quotedPrice * 0.75)),
      high: formatCAD(Number(parsed.expectedRangeHigh ?? quotedPrice * 1.1)),
    },
    quotedAmount: quotedPrice,
    whatLooksOk: parsed.whatLooksOk ?? [],
    whatToWatch: parsed.whatToWatch ?? [],
    questionsToAsk: parsed.questionsToAsk ?? [],
    disclaimer:
      parsed.disclaimer ??
      "AI estimates are for guidance only. Always verify with a licensed, insured GTA contractor.",
  };
}

// ─── Step badge ───────────────────────────────────────────────────────────────

function StepBadge({ n, active, done }: { n: number; active: boolean; done: boolean }) {
  return (
    <div
      className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
        done ? "bg-brand text-white" : active ? "bg-brand text-white" : "bg-gray-200 text-gray-500"
      }`}
    >
      {done ? "✓" : n}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SecondOpinionPage() {
  const [description, setDescription] = useState("");
  const [quotedPrice, setQuotedPrice] = useState("");
  const [note, setNote] = useState("");
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);
  const [startTracked, setStartTracked] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleFirstInteraction = () => {
    if (!startTracked) {
      trackSecondOpinionStarted();
      setStartTracked(true);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      setPhotoPreview(res);
      setPhotoBase64(res);
    };
    reader.readAsDataURL(file);
  };

  const handleStep1Next = () => {
    if (description.trim().length < 10) {
      setError("Please describe your project (at least a few words).");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async () => {
    const price = parseFloat(quotedPrice.replace(/[$,\s]/g, ""));
    if (!quotedPrice || isNaN(price) || price < 100) {
      setError("Please enter a valid quoted price (minimum $100).");
      return;
    }
    setError("");
    setIsLoading(true);
    setStep(3);
    try {
      const full = note.trim()
        ? `${description.trim()}\n\nAdditional context: ${note.trim()}`
        : description.trim();
      const res = await fetchVerdict(full, price, photoBase64);
      setResult(res);
      trackSecondOpinionCompleted(res.verdict);
      setTimeout(() => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Please try again.");
      setStep(2);
    } finally {
      setIsLoading(false);
    }
  };

  const vc = result ? VERDICT_CONFIG[result.verdict] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-brand text-white py-10 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1 text-xs font-semibold mb-4 uppercase tracking-wide">
            🔍 Free Second Opinion Tool
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-3 leading-tight">
            Is Your Contractor Quote Fair?
          </h1>
          <p className="text-white/80 text-base max-w-xl mx-auto">
            Describe your project and enter the contractor&apos;s price. Our AI checks it against 2026
            GTA market rates and tells you instantly: Fair, Possibly High, or Likely Overpriced.
          </p>
        </div>
      </section>

      {/* Step progress */}
      <div className="bg-white border-b border-gray-100 py-3 px-4">
        <div className="max-w-xl mx-auto flex items-center gap-2 justify-center">
          {[
            { n: 1, label: "Describe Project" },
            { n: 2, label: "Enter Quoted Price" },
            { n: 3, label: "Get Verdict" },
          ].map(({ n, label }, i) => (
            <div key={n} className="flex items-center gap-2">
              {i > 0 && <div className="w-6 h-px bg-gray-200 flex-shrink-0" />}
              <div className="flex items-center gap-1.5">
                <StepBadge n={n} active={step === n} done={step > n} />
                <span
                  className={`text-xs font-semibold hidden sm:block ${
                    step === n ? "text-brand" : step > n ? "text-gray-500" : "text-gray-300"
                  }`}
                >
                  {label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-xl mx-auto px-4 py-8">
        {/* ── Step 1 ─────────────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="font-black text-gray-900 text-lg">Step 1 — Describe Your Project</h2>

            {/* Photo */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Photo{" "}
                <span className="font-normal text-gray-400">(optional — improves accuracy)</span>
              </label>
              {photoPreview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoPreview}
                    alt="Uploaded"
                    className="w-full h-40 object-cover rounded-xl border border-gray-200"
                  />
                  <button
                    onClick={() => { setPhotoPreview(null); setPhotoBase64(null); }}
                    className="absolute top-2 right-2 bg-white rounded-full w-7 h-7 flex items-center justify-center shadow text-gray-600 hover:text-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-brand hover:text-brand transition-colors"
                >
                  <Upload className="w-6 h-6" />
                  <span className="text-xs font-semibold">Tap to upload photo</span>
                </button>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Describe the renovation <span className="text-red-500">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => { setDescription(e.target.value); handleFirstInteraction(); }}
                onFocus={handleFirstInteraction}
                placeholder="e.g. Full kitchen renovation — new cabinets, countertops, backsplash, and appliances. ~150 sq ft. North York semi-detached."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand resize-none"
              />
              <p className="text-xs text-gray-400 mt-1">
                More detail = more accurate verdict.
              </p>
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button
              onClick={handleStep1Next}
              className="w-full bg-brand text-white font-bold py-3.5 rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
            >
              Next — Enter Quoted Price <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ── Step 2 ─────────────────────────────────────────────────────── */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-5">
            <h2 className="font-black text-gray-900 text-lg">Step 2 — Enter the Quoted Price</h2>

            <div className="bg-gray-50 rounded-xl px-4 py-3 text-xs text-gray-600 border border-gray-100">
              <span className="font-semibold text-gray-800">Your project: </span>
              {description.length > 90 ? description.slice(0, 90) + "…" : description}
              <button onClick={() => { setStep(1); setError(""); }} className="ml-2 text-brand underline">
                Edit
              </button>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Contractor&apos;s quoted price (CAD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={quotedPrice}
                  onChange={(e) => setQuotedPrice(e.target.value)}
                  placeholder="e.g. 35,000"
                  className="w-full border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand"
                  inputMode="numeric"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Anything else to add?{" "}
                <span className="text-gray-400 font-normal">(optional)</span>
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Labour only. Includes demo and disposal. Contractor is not licensed."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand resize-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

            <button
              onClick={handleSubmit}
              className="w-full bg-brand text-white font-bold py-3.5 rounded-xl hover:bg-brand-dark transition-colors flex items-center justify-center gap-2"
            >
              Get My Second Opinion <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-gray-400">
              Free · No sign-up required · Results in ~20 seconds
            </p>
          </div>
        )}

        {/* ── Step 3 ─────────────────────────────────────────────────────── */}
        {step === 3 && (
          <div ref={resultRef}>
            {isLoading ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <Loader2 className="w-10 h-10 text-brand animate-spin mx-auto mb-4" />
                <h3 className="font-black text-gray-900 mb-1">Analysing your quote…</h3>
                <p className="text-sm text-gray-500">Comparing against 2026 GTA market rates</p>
              </div>
            ) : result && vc ? (
              <div className="space-y-5">
                {/* Verdict card */}
                <div className={`rounded-2xl border-2 ${vc.border} ${vc.bg} p-6`}>
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-0.5">{vc.icon}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${vc.badge}`}>
                          {result.verdictLabel}
                        </span>
                        <span className="text-xs text-gray-500">
                          for {formatCAD(result.quotedAmount)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 font-medium leading-relaxed">
                        {result.summaryLine}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                    <div className="bg-white/70 rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-0.5">Expected Low</div>
                      <div className="font-black text-gray-900 text-sm">{result.expectedRange.low}</div>
                    </div>
                    <div className="bg-white/70 rounded-xl p-3">
                      <div className="text-xs text-gray-500 mb-0.5">Expected High</div>
                      <div className="font-black text-gray-900 text-sm">{result.expectedRange.high}</div>
                    </div>
                    <div className={`rounded-xl p-3 ${vc.bg} border ${vc.border}`}>
                      <div className="text-xs text-gray-500 mb-0.5">You Were Quoted</div>
                      <div className="font-black text-brand text-sm">{formatCAD(result.quotedAmount)}</div>
                    </div>
                  </div>
                </div>

                {/* What looks OK */}
                {result.whatLooksOk.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" /> What looks okay
                    </h3>
                    <ul className="space-y-1.5">
                      {result.whatLooksOk.map((item, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="text-green-500 flex-shrink-0 mt-0.5">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* What to watch */}
                {result.whatToWatch.length > 0 && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-5">
                    <h3 className="font-bold text-gray-900 text-sm mb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500" /> What may need attention
                    </h3>
                    <ul className="space-y-1.5">
                      {result.whatToWatch.map((item, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="text-amber-500 flex-shrink-0 mt-0.5">→</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Questions to ask */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5">
                  <button
                    onClick={() => setShowQuestions((v) => !v)}
                    className="w-full flex items-center justify-between text-sm font-bold text-gray-900"
                  >
                    <span>💬 Questions to ask your contractor</span>
                    {showQuestions ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {showQuestions && (
                    <ul className="mt-3 space-y-2">
                      {result.questionsToAsk.map((q, i) => (
                        <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                          <span className="font-bold text-brand flex-shrink-0">{i + 1}.</span>
                          {q}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* CTA */}
                <div className="bg-brand rounded-2xl p-6 text-white text-center">
                  <h3 className="font-black text-lg mb-2">Want More Quotes to Compare?</h3>
                  <p className="text-white/80 text-sm mb-5 leading-relaxed">
                    Post your project for free and receive competitive bids from verified GTA
                    contractors within hours.
                  </p>
                  <Link
                    href="/create-lead"
                    onClick={() => trackCreateAccountClicked("second_opinion_result")}
                    data-track="create_account_clicked"
                    className="block w-full bg-white text-brand font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors mb-3"
                  >
                    Post Your Project — Get Real Bids →
                  </Link>
                  <Link
                    href="/"
                    className="block w-full bg-white/10 border border-white/20 text-white font-semibold py-2.5 rounded-xl hover:bg-white/20 transition-colors text-sm"
                  >
                    Get AI Estimate Instead
                  </Link>
                </div>

                <button
                  onClick={() => {
                    setStep(1);
                    setResult(null);
                    setDescription("");
                    setQuotedPrice("");
                    setNote("");
                    setPhotoPreview(null);
                    setPhotoBase64(null);
                    setStartTracked(false);
                  }}
                  className="w-full text-center text-xs text-gray-400 hover:text-brand transition-colors py-2 underline"
                >
                  Check a different quote
                </button>

                <p className="text-center text-xs text-gray-400 px-2 leading-relaxed">
                  {result.disclaimer}
                </p>
              </div>
            ) : null}
          </div>
        )}

        {/* Trust strip */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-1.5 text-xs text-gray-400 font-medium">
          {["✓ Free to use", "✓ No sign-up required", "✓ 2026 GTA price data", "✓ AI-powered"].map(
            (t) => <span key={t}>{t}</span>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          Need help?{" "}
          <a href="tel:9052429460" className="text-brand underline">
            905-242-9460
          </a>{" "}
          ·{" "}
          <Link href="/contact" className="text-brand underline">
            Contact support
          </Link>
        </p>
      </div>

      {/* FAQ */}
      <section className="bg-white border-t border-gray-100 py-10 px-4">
        <div className="max-w-xl mx-auto">
          <h2 className="font-black text-gray-900 text-lg mb-5 text-center">Common Questions</h2>
          <div className="space-y-3">
            {[
              {
                q: "Is this really free?",
                a: "Yes — one free second opinion per session, no account required. Create a free account for unlimited checks.",
              },
              {
                q: "How accurate is the AI?",
                a: "Our AI uses 2026 GTA renovation market data and contractor-grade pricing models. Results are for guidance — always verify your final contract.",
              },
              {
                q: "Can I use this for any renovation type?",
                a: "Yes — kitchens, bathrooms, basements, roofing, painting, decks, HVAC, and more. The more detail you provide, the better.",
              },
              {
                q: "What if my quote turns out to be overpriced?",
                a: "Post your project on QuoteXbert for free and get competing bids from verified GTA contractors — often within 24 hours.",
              },
            ].map((faq) => (
              <details
                key={faq.q}
                className="border border-gray-100 rounded-xl overflow-hidden group"
              >
                <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-semibold text-sm text-gray-900 hover:bg-gray-50 list-none">
                  {faq.q}
                  <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
