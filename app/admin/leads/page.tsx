import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import AdminLeadsTable from "./AdminLeadsTable";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'brandsagaceo@gmail.com,quotexbert@gmail.com')
  .split(',').map(e => e.trim().toLowerCase());

export default async function AdminLeadsPage() {
  const { userId } = await auth();
  if (!userId) redirect('/sign-in');

  const caller = await prisma.user.findFirst({
    where: { OR: [{ id: userId }, { clerkUserId: userId }] },
    select: { email: true },
  });
  if (!caller || !ADMIN_EMAILS.includes(caller.email.toLowerCase())) {
    redirect('/');
  }

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
