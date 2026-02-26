"use client";

interface LoadingStateProps {
  title?: string;
  subtitle?: string;
  fullScreen?: boolean;
  className?: string;
}

export default function LoadingState({
  title = "Loading...",
  subtitle = "Preparing your experience",
  fullScreen = false,
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`${fullScreen ? "min-h-screen" : "min-h-[320px]"} flex items-center justify-center bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="w-full max-w-md px-4">
        <div className="bg-white/90 backdrop-blur-sm border border-white rounded-2xl shadow-xl p-6 sm:p-7">
          <div className="relative mx-auto mb-5 h-14 w-14">
            <div className="absolute inset-0 rounded-full border-4 border-rose-200" />
            <div className="absolute inset-0 rounded-full border-4 border-rose-700 border-t-transparent animate-spin" />
          </div>

          <div className="text-center mb-5">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600 mt-1">{subtitle}</p>
          </div>

          <div className="space-y-2.5 animate-pulse" aria-hidden="true">
            <div className="h-2.5 rounded-full bg-rose-100 w-full" />
            <div className="h-2.5 rounded-full bg-orange-100 w-5/6 mx-auto" />
            <div className="h-2.5 rounded-full bg-amber-100 w-2/3 mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
