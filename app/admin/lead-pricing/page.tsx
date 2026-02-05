"use client";

import { useState, useEffect } from "react";

interface LeadPricing {
  id: string;
  trade: string;
  city: string;
  priceCents: number;
  createdAt: string;
  updatedAt: string;
}

export default function AdminLeadPricingPage() {
  const [pricingData, setPricingData] = useState<LeadPricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<LeadPricing | null>(null);

  const [formData, setFormData] = useState({
    trade: "",
    city: "default",
    priceCents: 900,
  });

  const fetchPricing = async () => {
    try {
      const response = await fetch("/api/admin/lead-pricing");
      if (response.ok) {
        const data = await response.json();
        setPricingData(data);
      }
    } catch (error) {
      console.error("Error fetching pricing:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPricing();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/admin/lead-pricing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchPricing();
        setShowAddForm(false);
        setEditingItem(null);
        setFormData({ trade: "", city: "default", priceCents: 900 });
      }
    } catch (error) {
      console.error("Error saving pricing:", error);
    }
  };

  const handleEdit = (item: LeadPricing) => {
    setEditingItem(item);
    setFormData({
      trade: item.trade,
      city: item.city,
      priceCents: item.priceCents,
    });
    setShowAddForm(true);
  };

  const handleDelete = async (trade: string, city: string) => {
    if (!confirm("Are you sure you want to delete this pricing rule?")) return;

    try {
      const response = await fetch(
        `/api/admin/lead-pricing?trade=${trade}&city=${city}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        await fetchPricing();
      }
    } catch (error) {
      console.error("Error deleting pricing:", error);
    }
  };

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(cents / 100);
  };

  const commonTrades = [
    "plumbing",
    "electrical",
    "painting",
    "roofing",
    "hvac",
    "flooring",
    "landscaping",
    "general",
    "bathroom",
    "kitchen",
  ];

  if (loading) {
    return <div className="text-center py-8">Loading pricing data...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">
            Lead Pricing Management
          </h1>
          <p className="text-neutral-600">
            Configure pricing for lead claims by trade and city
          </p>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl p-6 border shadow-sm mb-8">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              {editingItem ? "Edit Pricing Rule" : "Add Pricing Rule"}
            </h2>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Trade
                </label>
                <input
                  type="text"
                  value={formData.trade}
                  onChange={(e) =>
                    setFormData({ ...formData, trade: e.target.value })
                  }
                  placeholder="e.g., plumbing"
                  list="trades"
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                  required
                />
                <datalist id="trades">
                  {commonTrades.map((trade) => (
                    <option key={trade} value={trade} />
                  ))}
                </datalist>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  placeholder="default for all cities"
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Price (CAD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.priceCents / 100}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      priceCents: Math.round(parseFloat(e.target.value) * 100),
                    })
                  }
                  className="w-full border border-neutral-300 rounded-lg px-3 py-2"
                  required
                />
              </div>

              <div className="flex items-end space-x-2">
                <button
                  type="submit"
                  className="bg-[#800020] text-white px-4 py-2 rounded-lg hover:bg-[#600018]"
                >
                  {editingItem ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingItem(null);
                    setFormData({
                      trade: "",
                      city: "default",
                      priceCents: 900,
                    });
                  }}
                  className="border border-neutral-300 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-50"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Pricing Table */}
        <div className="bg-white rounded-xl border shadow-sm">
          <div className="p-6 border-b border-neutral-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-neutral-900">
                Current Pricing Rules
              </h2>
              {!showAddForm && (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="bg-[#800020] text-white px-4 py-2 rounded-lg hover:bg-[#600018]"
                >
                  Add Pricing Rule
                </button>
              )}
            </div>
          </div>

          {pricingData.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-neutral-500 mb-4">
                No pricing rules configured
              </div>
              <button
                onClick={() => setShowAddForm(true)}
                className="text-[#800020] hover:underline"
              >
                Add your first pricing rule
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-700">
                      Trade
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-700">
                      City
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-700">
                      Price per Lead
                    </th>
                    <th className="text-left px-6 py-3 text-sm font-medium text-neutral-700">
                      Last Updated
                    </th>
                    <th className="text-right px-6 py-3 text-sm font-medium text-neutral-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {pricingData.map((item) => (
                    <tr
                      key={`${item.trade}-${item.city}`}
                      className="hover:bg-neutral-50"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900 capitalize">
                          {item.trade}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-neutral-600 capitalize">
                          {item.city === "default" ? (
                            <span className="italic">All cities</span>
                          ) : (
                            item.city
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900">
                          {formatCurrency(item.priceCents)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-neutral-600">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="text-[#800020] hover:text-[#600018] text-sm font-medium"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.trade, item.city)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Quick Setup */}
        <div className="mt-8 bg-rose-50 rounded-xl p-6 border border-rose-200">
          <h3 className="text-lg font-semibold text-rose-950 mb-4">
            💡 Quick Setup Suggestions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium text-rose-900 mb-2">
                Common Trade Pricing:
              </h4>
              <ul className="space-y-1 text-rose-900">
                <li>• Plumbing: $12.00 - $15.00</li>
                <li>• Electrical: $15.00 - $20.00</li>
                <li>• Painting: $8.00 - $12.00</li>
                <li>• Roofing: $20.00 - $25.00</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-rose-900 mb-2">Pro Tips:</h4>
              <ul className="space-y-1 text-rose-900">
                <li>• Use "default" city for general pricing</li>
                <li>• Higher prices for specialized trades</li>
                <li>• City-specific pricing for competitive markets</li>
                <li>• Monitor contractor feedback on pricing</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
