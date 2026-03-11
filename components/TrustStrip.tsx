import { CheckCircle, Star, Zap, MapPin } from "lucide-react";

export default function TrustStrip() {
  const badges = [
    {
      icon: <CheckCircle size={24} className="text-green-600" />,
      title: "Verified Contractors",
      description: "All contractors verified & background checked",
    },
    {
      icon: <Star size={24} className="text-yellow-500" />,
      title: "Real Homeowner Reviews",
      description: "Authentic reviews from verified customers",
    },
    {
      icon: <Zap size={24} className="text-orange-600" />,
      title: "Instant AI Estimates",
      description: "Get renovation quotes in 30 seconds",
    },
    {
      icon: <MapPin size={24} className="text-rose-600" />,
      title: "Toronto Focused",
      description: "Local contractors serving the GTA",
    },
  ];

  return (
    <div className="w-full bg-gradient-to-r from-slate-50 to-slate-100 py-12 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-xl sm:text-2xl font-bold text-gray-900 mb-8">
          Why Homeowners Trust QuoteXbert
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {badges.map((badge, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300 text-center"
            >
              <div className="flex justify-center mb-4">{badge.icon}</div>
              <h4 className="font-bold text-gray-900 mb-2 text-base sm:text-lg">
                {badge.title}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {badge.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
