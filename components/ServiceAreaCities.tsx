"use client";

import { MapPinIcon } from "@heroicons/react/24/outline";

const GTA_CITIES = [
  { name: "Toronto", highlight: true },
  { name: "Mississauga", highlight: false },
  { name: "Markham", highlight: false },
  { name: "Vaughan", highlight: false },
  { name: "Brampton", highlight: false },
  { name: "Oshawa", highlight: true },
  { name: "Whitby", highlight: true },
  { name: "Ajax", highlight: true },
  { name: "Pickering", highlight: true },
  { name: "Bowmanville", highlight: true },
  { name: "Clarington", highlight: true },
  { name: "Scarborough", highlight: false },
  { name: "North York", highlight: false },
  { name: "Etobicoke", highlight: false },
  { name: "Richmond Hill", highlight: false },
  { name: "Burlington", highlight: false },
  { name: "Oakville", highlight: false },
  { name: "Milton", highlight: false },
];

export function ServiceAreaCities() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-orange-100 px-4 py-2 rounded-full mb-4">
            <MapPinIcon className="w-5 h-5 text-rose-600" />
            <span className="text-sm font-bold text-rose-900">SERVING THE GTA</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-3">
            Trusted Across the Greater Toronto Area
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Connecting homeowners with verified contractors in Toronto, Durham Region, and surrounding communities
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 max-w-5xl mx-auto">
          {GTA_CITIES.map((city) => (
            <div
              key={city.name}
              className={`
                px-5 py-2.5 rounded-full font-semibold text-sm transition-all
                ${city.highlight
                  ? "bg-gradient-to-r from-rose-600 to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-105"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105"
                }
                cursor-default
              `}
            >
              {city.name}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <p className="text-slate-600 text-sm">
            Don't see your city?{" "}
            <a href="/about" className="text-orange-600 font-semibold hover:text-orange-700 underline">
              We're expanding across Ontario
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
