"use client";

import { useState } from "react";

const MONTHLY_JOBS = [2, 4, 6, 8, 10];
const AVG_JOB_VALUES = [5000, 10000, 20000, 35000, 60000];

export default function EarningsCalculator() {
  const [jobsPerMonth, setJobsPerMonth] = useState(4);
  const [avgJobValue, setAvgJobValue] = useState(20000);

  const annualRevenue = jobsPerMonth * avgJobValue * 12;
  const annualLeadCost = 29 * 12;
  const roi = Math.round(annualRevenue / annualLeadCost);

  const fmt = (n: number) =>
    n >= 1000000
      ? `$${(n / 1000000).toFixed(1)}M`
      : n >= 1000
      ? `$${Math.round(n / 1000)}k`
      : `$${n}`;

  const fmtRoi = (n: number) =>
    n >= 1_000_000
      ? `${(n / 1_000_000).toFixed(1)}M×`
      : n >= 1_000
      ? `${Math.round(n / 1_000)}k×`
      : `${n}×`;

  return (
    <section className="bg-gradient-to-br from-slate-50 to-amber-50 rounded-2xl p-6 md:p-8 border border-amber-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-1">
        Earnings Estimator
      </h2>
      <p className="text-slate-600 text-sm mb-6">
        Estimate your potential annual revenue from QuoteXbert leads.
      </p>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Jobs per month */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Jobs closed per month via QuoteXbert
          </label>
          <div className="flex flex-wrap gap-2">
            {MONTHLY_JOBS.map((n) => (
              <button
                key={n}
                onClick={() => setJobsPerMonth(n)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                  jobsPerMonth === n
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:border-amber-300"
                }`}
              >
                {n} jobs
              </button>
            ))}
          </div>
        </div>

        {/* Average job value */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Average job value
          </label>
          <div className="flex flex-wrap gap-2">
            {AVG_JOB_VALUES.map((v) => (
              <button
                key={v}
                onClick={() => setAvgJobValue(v)}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition ${
                  avgJobValue === v
                    ? "bg-amber-500 border-amber-500 text-white"
                    : "bg-white border-slate-200 text-slate-700 hover:border-amber-300"
                }`}
              >
                {fmt(v)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4 bg-white rounded-xl border border-amber-200 p-3 sm:p-5">
        <div className="text-center">
          <div className="text-3xl font-black text-amber-600">{fmt(annualRevenue)}</div>
          <div className="text-xs text-slate-600 mt-1 font-medium">Annual Revenue</div>
        </div>
        <div className="text-center border-x border-slate-100">
          <div className="text-3xl font-black text-slate-700">{fmt(annualLeadCost)}</div>
          <div className="text-xs text-slate-600 mt-1 font-medium">Annual Platform Cost</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-black text-green-600">{fmtRoi(roi)}</div>
          <div className="text-xs text-slate-600 mt-1 font-medium">Return on Investment</div>
        </div>
      </div>

      <p className="text-xs text-slate-500 mt-3 text-center">
        Based on {jobsPerMonth} job{jobsPerMonth > 1 ? "s" : ""}/month × {fmt(avgJobValue)} avg value. Pro plan at $29/month.
      </p>
    </section>
  );
}
