import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ADMIN_EMAILS = (
  process.env.ADMIN_EMAILS || "brandsagaceo@gmail.com,quotexbert@gmail.com"
)
  .split(",")
  .map((e) => e.trim().toLowerCase());

export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }
    const user = await prisma.user.findUnique({
      where: { clerkUserId: userId },
      select: { email: true },
    });
    if (!user || !ADMIN_EMAILS.includes(user.email.toLowerCase())) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "7d";
    const metric = searchParams.get("metric") || "overview";

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case "1d":
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case "30d":
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case "90d":
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    if (metric === "overview") {
      // Platform overview statistics
      const [
        totalUsers,
        homeowners,
        contractors,
        newUsers,
        totalJobs,
        newJobs,
        completedJobs,
        totalApplications,
        newApplications,
        acceptedApplications,
        pendingApplications,
        totalQuotes,
        newQuotes,
        pendingQuotes,
        totalSubscriptions,
        activeSubscriptions,
        pastDueSubscriptions,
        paymentStats,
        creditStats,
        pendingTransactions,
        seoCounts,
        messageCount,
        portfolioCount,
        recentJobs,
        recentUsers,
        recentTransactions,
        recentSeoArticles,
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "homeowner" } }),
        prisma.user.count({ where: { role: "contractor" } }),
        prisma.user.count({ where: { createdAt: { gte: startDate } } }),
        prisma.lead.count({ where: { isSeeded: false } }),
        prisma.lead.count({
          where: { isSeeded: false, createdAt: { gte: startDate } },
        }),
        prisma.lead.count({ where: { isSeeded: false, status: "completed" } }),
        prisma.jobApplication.count(),
        prisma.jobApplication.count({
          where: { createdAt: { gte: startDate } },
        }),
        prisma.jobApplication.count({ where: { status: "accepted" } }),
        prisma.jobApplication.count({ where: { status: "pending" } }),
        prisma.quote.count(),
        prisma.quote.count({ where: { createdAt: { gte: startDate } } }),
        prisma.quote.count({
          where: { status: { in: ["draft", "sent", "revision_requested"] } },
        }),
        prisma.contractorSubscription.count(),
        prisma.contractorSubscription.count({ where: { status: "active" } }),
        prisma.contractorSubscription.count({ where: { status: "past_due" } }),
        prisma.transaction.aggregate({
          _sum: { amount: true },
          _count: true,
          where: {
            status: "completed",
            createdAt: { gte: startDate },
          },
        }),
        prisma.transaction.aggregate({
          _sum: { amount: true },
          _count: true,
          where: { type: "credit", createdAt: { gte: startDate } },
        }),
        prisma.transaction.count({ where: { status: "pending" } }),
        prisma.seoArticle.groupBy({
          by: ["status"],
          _count: { _all: true },
        }),
        prisma.message.count({ where: { createdAt: { gte: startDate } } }),
        prisma.portfolioItem.count(),
        prisma.lead.findMany({
          where: { isSeeded: false, createdAt: { gte: startDate } },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, title: true, status: true, createdAt: true },
        }),
        prisma.user.findMany({
          where: { createdAt: { gte: startDate } },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: { id: true, role: true, createdAt: true },
        }),
        prisma.transaction.findMany({
          where: { createdAt: { gte: startDate } },
          orderBy: { createdAt: "desc" },
          take: 5,
          select: {
            id: true,
            description: true,
            status: true,
            createdAt: true,
          },
        }),
        prisma.seoArticle.findMany({
          orderBy: { updatedAt: "desc" },
          take: 5,
          select: { id: true, title: true, status: true, updatedAt: true },
        }),
      ]);

      const seo: Record<string, number> = Object.fromEntries(
        seoCounts.map((group) => [group.status, group._count._all]),
      );
      const recentActivity = [
        ...recentJobs.map((job) => ({
          id: `job:${job.id}`,
          type: "job",
          description: `Job posted: ${job.title}`,
          status: job.status,
          timestamp: job.createdAt.toISOString(),
        })),
        ...recentUsers.map((recentUser) => ({
          id: `user:${recentUser.id}`,
          type: "account",
          description: `New ${recentUser.role || "unassigned"} account`,
          status: "created",
          timestamp: recentUser.createdAt.toISOString(),
        })),
        ...recentTransactions.map((transaction) => ({
          id: `transaction:${transaction.id}`,
          type: "transaction",
          description: transaction.description,
          status: transaction.status,
          timestamp: transaction.createdAt.toISOString(),
        })),
        ...recentSeoArticles.map((article) => ({
          id: `seo:${article.id}`,
          type: "seo",
          description: `SEO article: ${article.title}`,
          status: article.status,
          timestamp: article.updatedAt.toISOString(),
        })),
      ]
        .sort((left, right) => right.timestamp.localeCompare(left.timestamp))
        .slice(0, 10);

      return NextResponse.json({
        period,
        generatedAt: now.toISOString(),
        overview: {
          users: {
            total: totalUsers,
            homeowners,
            contractors,
            new: newUsers,
          },
          jobs: {
            total: totalJobs,
            new: newJobs,
            completed: completedJobs,
            completionRate:
              totalJobs > 0
                ? ((completedJobs / totalJobs) * 100).toFixed(1)
                : 0,
          },
          applications: {
            total: totalApplications,
            new: newApplications,
            accepted: acceptedApplications,
            acceptanceRate:
              totalApplications > 0
                ? ((acceptedApplications / totalApplications) * 100).toFixed(1)
                : 0,
          },
          quotes: {
            total: totalQuotes,
            new: newQuotes,
            pending: pendingQuotes,
          },
          subscriptions: {
            total: totalSubscriptions,
            active: activeSubscriptions,
            pastDue: pastDueSubscriptions,
          },
          revenue: {
            total: paymentStats._sum.amount || 0,
            transactions: paymentStats._count,
          },
          credits: {
            total: creditStats._sum.amount || 0,
            transactions: creditStats._count,
          },
          pending: {
            applications: pendingApplications,
            transactions: pendingTransactions,
            subscriptions: pastDueSubscriptions,
            seoReview:
              (seo.draft || 0) + (seo.approved || 0) + (seo.failed || 0),
          },
          seo: {
            total: Object.values(seo).reduce((sum, count) => sum + count, 0),
            draft: seo.draft || 0,
            approved: seo.approved || 0,
            published: seo.published || 0,
            failed: seo.failed || 0,
          },
          engagement: {
            messages: messageCount,
            portfolios: portfolioCount,
          },
        },
        recentActivity,
      });
    }

    if (metric === "users") {
      // User analytics
      const userTrends = (await prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as registrations,
          SUM(CASE WHEN role = 'homeowner' THEN 1 ELSE 0 END) as homeowners,
          SUM(CASE WHEN role = 'contractor' THEN 1 ELSE 0 END) as contractors
        FROM users 
        WHERE createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      `) as Array<{
        date: string;
        registrations: number;
        homeowners: number;
        contractors: number;
      }>;

      return NextResponse.json({
        period,
        userTrends,
      });
    }

    if (metric === "revenue") {
      // Revenue analytics
      const revenueData = (await prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          SUM(amount) as revenue,
          COUNT(*) as transactions,
          AVG(amount) as avgTransaction
        FROM transactions 
        WHERE status = 'completed' AND createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      `) as Array<{
        date: string;
        revenue: number;
        transactions: number;
        avgTransaction: number;
      }>;

      return NextResponse.json({
        period,
        revenueData,
      });
    }

    return NextResponse.json({ error: "Invalid metric" }, { status: 400 });
  } catch (error) {
    console.error("Usage analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch usage data" },
      { status: 500 },
    );
  }
}
