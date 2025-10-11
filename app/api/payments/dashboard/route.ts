import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const role = searchParams.get('role');

    if (!userId || !role) {
      return NextResponse.json(
        { error: "User ID and role are required" },
        { status: 400 }
      );
    }

    if (role === 'contractor') {
      // Get contractor subscription summary
      const subscriptions = await prisma.contractorSubscription.findMany({
        where: { contractorId: userId },
        include: {
          transactions: {
            orderBy: { createdAt: 'desc' },
            take: 10
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      const totalMonthlyFees = subscriptions.reduce((sum, sub) => {
        return sub.status === 'active' ? sum + sub.monthlyPrice : sum;
      }, 0);

      const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active');
      const canceledSubscriptions = subscriptions.filter(sub => sub.status === 'canceled');

      const summary = {
        totalActiveSubscriptions: activeSubscriptions.length,
        totalMonthlyFees: totalMonthlyFees,
        categories: activeSubscriptions.map(sub => sub.category),
        subscriptions: subscriptions.map(sub => ({
          id: sub.id,
          category: sub.category,
          status: sub.status,
          monthlyPrice: sub.monthlyPrice,
          currentPeriodStart: sub.currentPeriodStart,
          currentPeriodEnd: sub.currentPeriodEnd,
          nextBillingDate: sub.nextBillingDate,
          canClaimLeads: sub.canClaimLeads,
          leadsThisMonth: sub.leadsThisMonth,
          monthlyLeadLimit: sub.monthlyLeadLimit,
          createdAt: sub.createdAt
        })),
        recentTransactions: subscriptions.flatMap(sub => 
          sub.transactions.map(transaction => ({
            id: transaction.id,
            amount: transaction.amount,
            status: transaction.status,
            category: sub.category,
            description: transaction.description,
            createdAt: transaction.createdAt
          }))
        ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5)
      };

      return NextResponse.json({
        success: true,
        data: summary
      });

    } else if (role === 'homeowner') {
      // Homeowners don't have subscriptions, but they may have transaction history
      // For now, return empty data since the old payment model is deprecated
      return NextResponse.json({
        success: true,
        data: {
          message: "Homeowner payment dashboard is being updated for the new subscription model.",
          transactions: []
        }
      });

    } else {
      return NextResponse.json(
        { error: "Invalid role" },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error("Error fetching payment dashboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch payment dashboard" },
      { status: 500 }
    );
  }
}