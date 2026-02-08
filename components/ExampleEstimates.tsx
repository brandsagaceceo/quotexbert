"use client";

import { useState } from "react";
import { CheckCircleIcon, ClockIcon, WrenchScrewdriverIcon } from "@heroicons/react/24/outline";

const EXAMPLE_ESTIMATES = [
  {
    id: 1,
    title: "Drywall Hole Repair",
    location: "Toronto, ON",
    costLow: 180,
    costHigh: 350,
    materials: "$40 - $80",
    labor: "$140 - $270",
    time: "1-2 hours",
    proCount: 3,
    lineItems: [
      { name: "Drywall patch (6\" x 6\")", cost: "$15-25" },
      { name: "Joint compound", cost: "$12-18" },
      { name: "Sanding & paint touch-up", cost: "$13-37" },
      { name: "Labor (skilled handyman)", cost: "$140-270" }
    ]
  },
  {
    id: 2,
    title: "Kitchen Faucet Installation",
    location: "Scarborough, ON",
    costLow: 250,
    costHigh: 450,
    materials: "$80 - $200",
    labor: "$170 - $250",
    time: "2-3 hours",
    proCount: 5,
    lineItems: [
      { name: "Mid-range kitchen faucet", cost: "$80-200" },
      { name: "Supply lines & fittings", cost: "$15-25" },
      { name: "Plumber's putty & tape", cost: "$8-12" },
      { name: "Licensed plumber labor", cost: "$170-250" }
    ]
  },
  {
    id: 3,
    title: "Basement Pot Lights (8 lights)",
    location: "Ajax, ON",
    costLow: 920,
    costHigh: 1450,
    materials: "$320 - $650",
    labor: "$600 - $800",
    time: "4-6 hours",
    proCount: 4,
    lineItems: [
      { name: "8x LED pot lights (6\")", cost: "$200-400" },
      { name: "Wiring & electrical boxes", cost: "$80-150" },
      { name: "Dimmer switch (optional)", cost: "$40-100" },
      { name: "Licensed electrician labor", cost: "$600-800" }
    ]
  }
];

export default function ExampleEstimates() {
  const [selectedExample, setSelectedExample] = useState(EXAMPLE_ESTIMATES[0]);

  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4 px-4 py-2 bg-rose-100 text-rose-900 rounded-full text-sm font-bold">
            SEE HOW IT WORKS
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
            Real Estimate Examples
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            See the level of detail our AI provides. No vague ranges—actual line items, materials, and labor breakdowns.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Example Cards - Click to View */}
          <div className="lg:col-span-1 space-y-4">
            {EXAMPLE_ESTIMATES.map((example) => (
              <button
                key={example.id}
                onClick={() => setSelectedExample(example)}
                className={`w-full text-left p-6 rounded-xl border-2 transition-all duration-200 ${
                  selectedExample.id === example.id
                    ? 'bg-white border-rose-700 shadow-xl scale-105'
                    : 'bg-white border-slate-200 hover:border-rose-300 hover:shadow-lg'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-900 mb-1">
                      {example.title}
                    </h3>
                    <p className="text-sm text-slate-500 mb-2">📍 {example.location}</p>
                    <div className="text-xl font-bold text-rose-700">
                      ${example.costLow.toLocaleString()} - ${example.costHigh.toLocaleString()}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Detailed Estimate View */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-rose-700 to-orange-600 px-8 py-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{selectedExample.title}</h3>
                <p className="text-blue-100">📍 {selectedExample.location}</p>
              </div>

              {/* Cost Summary */}
              <div className="p-8 border-b border-slate-200">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-black text-green-700">
                      ${selectedExample.costLow.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">Low Estimate</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-3xl font-black text-orange-700">
                      ${selectedExample.costHigh.toLocaleString()}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">High Estimate</div>
                  </div>
                  <div className="text-center p-4 bg-rose-50 rounded-lg">
                    <div className="text-3xl font-black text-rose-900">
                      {selectedExample.proCount}
                    </div>
                    <div className="text-sm text-slate-600 mt-1">Pros Available</div>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-slate-700">
                    <WrenchScrewdriverIcon className="w-5 h-5 text-rose-700" />
                    <span className="font-semibold">Materials:</span> {selectedExample.materials}
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="font-semibold">Labor:</span> {selectedExample.labor}
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <ClockIcon className="w-5 h-5 text-orange-600" />
                    <span className="font-semibold">Time:</span> {selectedExample.time}
                  </div>
                </div>
              </div>

              {/* Line Items Breakdown */}
              <div className="p-8">
                <h4 className="text-lg font-bold text-slate-900 mb-4">📋 Detailed Breakdown</h4>
                <div className="space-y-3">
                  {selectedExample.lineItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <span className="text-slate-700 font-medium">{item.name}</span>
                      <span className="text-rose-700 font-bold">{item.cost}</span>
                    </div>
                  ))}
                </div>

                {/* Trust Badge */}
                <div className="mt-8 p-4 bg-rose-50 border-l-4 border-rose-700 rounded">
                  <p className="text-sm text-slate-700">
                    <strong>✓ AI-Generated Estimate</strong> • Based on 1,000+ real Toronto/GTA quotes • 
                    <span className="text-rose-700 font-semibold"> Get yours in 30 seconds</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#get-estimate"
            className="inline-block px-8 py-4 bg-gradient-to-r from-rose-700 to-orange-600 text-white text-xl font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
          >
            🚀 Get Your Free Estimate Now
          </a>
          <p className="text-slate-600 mt-4 text-sm">
            Upload photos or describe your project • No signup required
          </p>
        </div>
      </div>
    </section>
  );
}
