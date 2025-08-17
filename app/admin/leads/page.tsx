import { prisma } from "@/lib/prisma";
import AdminLeadsTable from "./AdminLeadsTable";

export default async function AdminLeadsPage() {
  // For now, we'll skip role checking and implement a simple admin page
  // In production, you'd add requireRole("admin") here

  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-ink-900 mb-4">
            Admin - Leads Dashboard
          </h1>
          <p className="text-xl text-ink-600">
            Manage and publish leads to the job board
          </p>
        </div>

        <AdminLeadsTable leads={leads} />
      </div>
    </div>
  );
}
