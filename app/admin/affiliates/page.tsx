"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

const ADMIN_EMAILS = ["brandsagaceo@gmail.com"];

interface Commission {
  id: string;
  affiliateCode: string;
  userEmail: string;
  amount: number;
  status: string;
  stripeInvoiceId: string;
  createdAt: string;
  paidAt?: string;
}

interface AffiliateSummary {
  code: string;
  unpaidTotal: number;
  paidTotal: number;
  commissionCount: number;
}

export default function AffiliateAdminPage() {
  const { authUser: user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [affiliates, setAffiliates] = useState<AffiliateSummary[]>([]);
  const [selectedAffiliate, setSelectedAffiliate] = useState<string | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);

  useEffect(() => {
    if (!user) {
      router.push("/sign-in");
      return;
    }

    if (!ADMIN_EMAILS.includes(user.email)) {
      router.push("/");
      return;
    }

    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/affiliates");
      if (response.ok) {
        const data = await response.json();
        setAffiliates(data.affiliates || []);
      }
    } catch (error) {
      console.error("Failed to load affiliate data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCommissions = async (code: string) => {
    try {
      const response = await fetch(`/api/admin/affiliates/${code}/commissions`);
      if (response.ok) {
        const data = await response.json();
        setCommissions(data.commissions || []);
      }
    } catch (error) {
      console.error("Failed to load commissions:", error);
    }
  };

  const markPaid = async (commissionId: string) => {
    if (!confirm("Mark this commission as paid?")) return;

    try {
      const response = await fetch("/api/admin/affiliates/mark-paid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commissionId })
      });

      if (response.ok) {
        alert("Commission marked as paid!");
        if (selectedAffiliate) {
          loadCommissions(selectedAffiliate);
        }
        loadData();
      } else {
        alert("Failed to mark as paid");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error marking as paid");
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Affiliate Admin Dashboard</h1>

      {/* Affiliate Summary Cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {affiliates.map((affiliate) => (
          <div
            key={affiliate.code}
            onClick={() => {
              setSelectedAffiliate(affiliate.code);
              loadCommissions(affiliate.code);
            }}
            className="bg-white rounded-lg border-2 border-slate-200 p-6 cursor-pointer hover:border-rose-500 transition-colors"
          >
            <div className="text-sm text-slate-600 mb-1">Affiliate Code</div>
            <div className="text-2xl font-bold text-slate-900 mb-4">{affiliate.code}</div>
            
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Unpaid:</span>
                <span className="font-semibold text-rose-600">${affiliate.unpaidTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Paid:</span>
                <span className="font-semibold text-green-600">${affiliate.paidTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>Total Commissions:</span>
                <span>{affiliate.commissionCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Commission Details */}
      {selectedAffiliate && (
        <div className="bg-white rounded-lg border-2 border-slate-200 p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-4">
            Commissions for {selectedAffiliate}
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-slate-200">
                  <th className="text-left py-3 px-2 font-semibold">Date</th>
                  <th className="text-left py-3 px-2 font-semibold">User</th>
                  <th className="text-left py-3 px-2 font-semibold">Invoice</th>
                  <th className="text-right py-3 px-2 font-semibold">Amount</th>
                  <th className="text-center py-3 px-2 font-semibold">Status</th>
                  <th className="text-center py-3 px-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((commission) => (
                  <tr key={commission.id} className="border-b border-slate-100">
                    <td className="py-3 px-2 text-slate-700">
                      {new Date(commission.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2 text-slate-700 truncate max-w-xs">
                      {commission.userEmail}
                    </td>
                    <td className="py-3 px-2 text-slate-500 text-xs truncate max-w-xs">
                      {commission.stripeInvoiceId}
                    </td>
                    <td className="py-3 px-2 text-right font-semibold text-slate-900">
                      ${commission.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          commission.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {commission.status}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      {commission.status === "unpaid" && (
                        <button
                          onClick={() => markPaid(commission.id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold transition-colors"
                        >
                          Mark Paid
                        </button>
                      )}
                      {commission.status === "paid" && commission.paidAt && (
                        <span className="text-xs text-green-600">
                          {new Date(commission.paidAt).toLocaleDateString()}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {commissions.length === 0 && (
            <div className="text-center py-8 text-slate-500">
              No commissions yet for this affiliate
            </div>
          )}
        </div>
      )}
    </div>
  );
}
