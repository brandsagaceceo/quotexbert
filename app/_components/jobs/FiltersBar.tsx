"use client";

import { useState } from "react";
import { CANADIAN_PROVINCES, TRADE_TYPES } from "@/lib/canada";

interface FiltersBarProps {
  onFiltersChange: (filters: {
    q?: string;
    trade?: string;
    minBudget?: number;
    maxBudget?: number;
    province?: string;
    city?: string;
  }) => void;
}

export default function FiltersBar({ onFiltersChange }: FiltersBarProps) {
  const [q, setQ] = useState("");
  const [trade, setTrade] = useState("");
  const [minBudget, setMinBudget] = useState("");
  const [maxBudget, setMaxBudget] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");

  const handleFiltersChange = () => {
    const filters: {
      q?: string;
      trade?: string;
      minBudget?: number;
      maxBudget?: number;
      province?: string;
      city?: string;
    } = {};

    if (q) filters.q = q;
    if (trade) filters.trade = trade;
    if (minBudget) filters.minBudget = parseInt(minBudget);
    if (maxBudget) filters.maxBudget = parseInt(maxBudget);
    if (province) filters.province = province;
    if (city) filters.city = city;

    onFiltersChange(filters);

    // Emit Clarity event
    if (typeof window !== "undefined" && window.clarity) {
      window.clarity("event", "job_filter", {
        trade: filters.trade,
        province: filters.province,
        budgetMin: filters.minBudget,
        budgetMax: filters.maxBudget,
      });
    }
  };

  const clearFilters = () => {
    setQ("");
    setTrade("");
    setMinBudget("");
    setMaxBudget("");
    setProvince("");
    setCity("");
    onFiltersChange({});
  };

  return (
    <div className="bg-white border-b border-ink-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="space-y-4">
          {/* Search */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search jobs..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full px-4 py-2 border border-ink-300 rounded-xl focus:ring-2 focus:ring-brand focus:border-brand"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleFiltersChange}
                className="px-6 py-2 bg-brand hover:bg-brand-dark text-white rounded-xl font-medium transition-colors duration-200 focus:ring-2 focus:ring-brand focus:ring-offset-2"
              >
                Search
              </button>
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-ink-600 hover:text-brand transition-colors duration-200"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Trade */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Trade
              </label>
              <select
                value={trade}
                onChange={(e) => setTrade(e.target.value)}
                className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-sm"
              >
                <option value="">All trades</option>
                {TRADE_TYPES.map((tradeType) => (
                  <option key={tradeType.value} value={tradeType.value}>
                    {tradeType.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Budget Min */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Min Budget
              </label>
              <input
                type="number"
                placeholder="$0"
                value={minBudget}
                onChange={(e) => setMinBudget(e.target.value)}
                className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-sm"
              />
            </div>

            {/* Budget Max */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Max Budget
              </label>
              <input
                type="number"
                placeholder="$10,000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(e.target.value)}
                className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-sm"
              />
            </div>

            {/* Province */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                Province
              </label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-sm"
              >
                <option value="">All provinces</option>
                {CANADIAN_PROVINCES.map((prov) => (
                  <option key={prov.code} value={prov.code}>
                    {prov.name}
                  </option>
                ))}
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-ink-700 mb-1">
                City
              </label>
              <input
                type="text"
                placeholder="City name"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-ink-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
