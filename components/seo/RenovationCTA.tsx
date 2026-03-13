import Link from "next/link";
import { Camera, Sparkles, Users, ArrowRight, CheckCircle } from "lucide-react";

interface RenovationCTAProps {
  heading?: string;
  subheading?: string;
  variant?: "primary" | "secondary";
}

export default function RenovationCTA({
  heading = "Get Your Free AI Renovation Estimate",
  subheading = "Upload a photo of your project and get an instant price estimate. Connect with verified Toronto contractors in minutes.",
  variant = "primary",
}: RenovationCTAProps) {
  const isPrimary = variant === "primary";

  return (
    <section
      className={`py-16 px-4 ${
        isPrimary
          ? "bg-gradient-to-r from-rose-600 to-orange-600 text-white"
          : "bg-gradient-to-br from-rose-50 to-orange-50"
      }`}
    >
      <div className="max-w-4xl mx-auto text-center">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold mb-6 ${isPrimary ? "bg-white/20 text-white" : "bg-rose-100 text-rose-700"}`}>
          <Sparkles className="w-4 h-4" />
          <span>Free AI-Powered Tool — No Account Required</span>
        </div>

        <h2 className={`text-3xl md:text-4xl font-bold mb-4 ${isPrimary ? "text-white" : "text-gray-900"}`}>
          {heading}
        </h2>
        <p className={`text-lg mb-8 max-w-2xl mx-auto ${isPrimary ? "text-rose-100" : "text-gray-600"}`}>
          {subheading}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Link
            href="/#instant-quote"
            className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all shadow-lg hover:scale-105 ${
              isPrimary
                ? "bg-white text-rose-600 hover:bg-rose-50"
                : "bg-gradient-to-r from-rose-600 to-orange-600 text-white hover:shadow-rose-300"
            }`}
          >
            <Camera className="w-5 h-5" />
            Upload Photo &amp; Get Estimate
          </Link>
          <Link
            href="/create-lead"
            className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all border-2 ${
              isPrimary
                ? "border-white text-white hover:bg-white/10"
                : "border-rose-300 text-rose-600 hover:bg-rose-50"
            }`}
          >
            <Users className="w-5 h-5" />
            Post a Job for Free
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className={`flex flex-wrap justify-center gap-4 text-sm ${isPrimary ? "text-rose-100" : "text-gray-600"}`}>
          {["Instant AI estimates", "100% free for homeowners", "Verified Toronto contractors", "No spam or sales calls"].map((item) => (
            <span key={item} className="flex items-center gap-1">
              <CheckCircle className={`w-4 h-4 ${isPrimary ? "text-white" : "text-rose-500"}`} />
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
