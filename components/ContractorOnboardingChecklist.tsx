"use client";

import { useState, useEffect } from "react";
import { CheckCircle, Circle, ChevronRight, X } from "lucide-react";
import Link from "next/link";

const STEPS = [
  {
    id: "viewed-jobs",
    localKey: "checklist_viewed_jobs",
    label: "Browse available jobs",
    description: "See what projects are waiting for you",
    href: "/contractor/jobs",
  },
  {
    id: "accepted-job",
    localKey: "checklist_accepted_job",
    label: "Accept your first job",
    description: "Start working with a homeowner",
    href: "/contractor/jobs",
  },
  {
    id: "sent-message",
    localKey: "checklist_sent_message",
    label: "Send your first message",
    description: "Introduce yourself to a homeowner",
    href: "/messages",
  },
];

export function ContractorOnboardingChecklist() {
  const [done, setDone] = useState<Record<string, boolean>>({});
  const [dismissed, setDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const state: Record<string, boolean> = {};
    STEPS.forEach((s) => {
      state[s.id] = localStorage.getItem(s.localKey) === "1";
    });
    setDone(state);
    setDismissed(localStorage.getItem("checklist_dismissed") === "1");
    setMounted(true);
  }, []);

  if (!mounted || dismissed) return null;

  const completedCount = Object.values(done).filter(Boolean).length;
  if (completedCount === STEPS.length) return null;

  return (
    <div className="mb-6 bg-white rounded-xl shadow-sm border border-rose-100 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-50 to-orange-50 px-4 py-3 flex items-center justify-between border-b border-rose-100">
        <div>
          <h3 className="font-semibold text-gray-900 text-sm">Getting Started</h3>
          <p className="text-xs text-gray-500 mt-0.5">
            {completedCount}/{STEPS.length} steps completed
          </p>
        </div>
        <button
          onClick={() => {
            localStorage.setItem("checklist_dismissed", "1");
            setDismissed(true);
          }}
          className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors"
          aria-label="Dismiss checklist"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100">
        <div
          className="h-1 bg-gradient-to-r from-rose-500 to-orange-500 transition-all duration-500"
          style={{ width: `${(completedCount / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Steps */}
      <div className="divide-y divide-gray-50">
        {STEPS.map((step) => {
          const isDone = done[step.id];
          return (
            <Link
              key={step.id}
              href={step.href}
              className={`flex items-center gap-3 px-4 py-3 transition-colors group ${
                isDone
                  ? "opacity-60 pointer-events-none"
                  : "hover:bg-rose-50"
              }`}
            >
              {isDone ? (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-gray-300 group-hover:text-rose-400 flex-shrink-0 transition-colors" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${
                    isDone ? "line-through text-gray-400" : "text-gray-800"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>
              </div>
              {!isDone && (
                <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-rose-400 flex-shrink-0 transition-colors" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
