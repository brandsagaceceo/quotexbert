"use client";

import { 
  PhotoIcon, 
  CpuChipIcon, 
  UserGroupIcon, 
  CheckBadgeIcon 
} from "@heroicons/react/24/outline";

const steps = [
  {
    icon: PhotoIcon,
    title: "Share your project",
    description: "Upload a few photos or tell us what you need done.",
    color: "from-rose-700 to-[#800020]",
  },
  {
    icon: CpuChipIcon,
    title: "Get a cost estimate",
    description: "See a starting cost range based on your project details.",
    color: "from-rose-800 to-[#800020]",
  },
  {
    icon: UserGroupIcon,
    title: "Connect with contractors",
    description: "Choose whether to share your project and compare quotes from local contractors.",
    color: "from-[#800020] to-rose-900",
  },
  {
    icon: CheckBadgeIcon,
    title: "Choose your next step",
    description: "Review your quotes and decide how you want to move forward.",
    color: "from-rose-900 to-[#4a0014]",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            How QuoteXbert works
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Start with an estimate, then decide what to do next.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative group">
              {/* Connector Line (hidden on mobile, last item) */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-16 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-slate-300 to-transparent z-0" />
              )}

              {/* Card */}
              <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 z-10">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-gradient-to-r from-slate-800 to-slate-900 text-white font-black text-lg flex items-center justify-center shadow-lg">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${step.color} p-3.5 mb-5 mx-auto`}>
                  <step.icon className="w-full h-full text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-slate-600 text-sm text-center leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => {
              const estimatorElement = document.querySelector('[data-estimator]');
              if (estimatorElement) {
                estimatorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            className="inline-flex items-center gap-2 bg-[#800020] hover:bg-[#600018] text-white font-bold px-8 py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            <PhotoIcon className="w-6 h-6" />
            Get an estimate
          </button>
        </div>
      </div>
    </section>
  );
}
