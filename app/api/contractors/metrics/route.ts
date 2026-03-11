import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { updateContractorResponseTime } from "@/lib/responseTime";

/**
 * GET /api/contractors/metrics
 * Fetch contractor performance metrics
 * AUTH REQUIRED: Only authenticated users can view metrics
 */
export async function GET(request: Request) {
  try {
    // Verify authentication
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized - Please sign in" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const contractorId = searchParams.get("contractorId");

    if (!contractorId) {
      return NextResponse.json(
        { error: "contractorId is required" },
        { status: 400 }
      );
    }

    // Get contractor profile
    const contractor = await prisma.contractorProfile.findUnique({
      where: { userId: contractorId },
      select: {
        avgRating: true,
        reviewCount: true,
      },
    });

    if (!contractor) {
      return NextResponse.json(
        { error: "Contractor not found" },
        { status: 404 }
      );
    }

    // Try to get response time fields if they exist (after migration)
    let responseTimeData: any = null;
    try {
      // Use $queryRaw to bypass type checking for fields that may not exist yet
      const result = await prisma.$queryRaw<any[]>`
        SELECT 
          "avgResponseTimeMinutes",
          "responseTimeLabel", 
          "lastResponseCalculated",
          "completedJobs"
        FROM "contractor_profiles"
        WHERE "userId" = ${contractorId}
        LIMIT 1
      `;
      responseTimeData = result[0] || null;
    } catch {
      // Fields don't exist yet - migration not run
    }

    const completedJobs = responseTimeData?.completedJobs ?? 0;
    const avgResponseTimeMinutes = responseTimeData?.avgResponseTimeMinutes;
    const responseTimeLabel = responseTimeData?.responseTimeLabel;
    const lastResponseCalculated = responseTimeData?.lastResponseCalculated;

    // If response time hasn't been calculated yet or is stale (>7 days), recalculate
    const shouldRecalculate = 
      responseTimeData &&
      (!lastResponseCalculated ||
      (Date.now() - lastResponseCalculated.getTime()) > 7 * 24 * 60 * 60 * 1000);

    if (shouldRecalculate && avgResponseTimeMinutes === null) {
      // Trigger async recalculation (don't block the response)
      updateContractorResponseTime(contractorId).catch((err: any) => {
        console.error('Error updating response time:', err);
      });
    }

    // Use cached response time from database (merged system: job acceptances + messages)
    const responseTime = responseTimeLabel || "N/A";
    const avgResponseTimeHours = avgResponseTimeMinutes 
      ? avgResponseTimeMinutes / 60 
      : null;

    // Count leads received (jobs where contractor is in acceptedContractors array)
    const allLeads = await prisma.lead.findMany({
      where: {
        status: {
          in: ["open", "claimed", "accepted", "in_progress", "completed"],
        },
      },
      select: {
        acceptedContractors: true,
        acceptedById: true,
        claimed: true,
      },
    });

    // Parse acceptedContractors JSON arrays and count
    let leadsReceived = 0;
    let jobsAccepted = 0;

    for (const lead of allLeads) {
      try {
        const acceptedContractors = JSON.parse(
          lead.acceptedContractors || "[]"
        );
        if (
          acceptedContractors.includes(contractorId) ||
          lead.acceptedById === contractorId
        ) {
          leadsReceived++;
        }

        // Count accepted jobs (where contractor accepted the job)
        if (
          acceptedContractors.includes(contractorId) ||
          lead.acceptedById === contractorId
        ) {
          jobsAccepted++;
        }
      } catch (e) {
        // Skip invalid JSON
        continue;
      }
    }

    // Get recent activity for additional context
    const recentAcceptances = await prisma.jobAcceptance.count({
      where: {
        contractorId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    const recentReviews = await prisma.review.count({
      where: {
        contractorId,
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
        },
      },
    });

    // Calculate conversion rate (jobsAccepted / leadsReceived)
    const conversionRate = leadsReceived > 0 
      ? ((jobsAccepted / leadsReceived) * 100).toFixed(1)
      : '0.0';

    // Calculate average job value from accepted leads
    const acceptedLeads = await prisma.lead.findMany({
      where: {
        acceptedById: contractorId,
        NOT: {
          budget: "",
        },
      },
      select: {
        budget: true,
      },
    });

    let averageJobValue = 0;
    let totalValue = 0;
    let validBudgets = 0;

    for (const lead of acceptedLeads) {
      if (lead.budget) {
        // Parse budget string (e.g., "$5,000 - $10,000" or "$5000")
        const numbers = lead.budget.match(/\d+/g);
        if (numbers && numbers.length > 0) {
          // If range, take the average; if single number, use that
          const values = numbers.map(n => parseInt(n.replace(/,/g, '')));
          const avgValue = values.reduce((sum, val) => sum + val, 0) / values.length;
          totalValue += avgValue;
          validBudgets++;
        }
      }
    }

    if (validBudgets > 0) {
      averageJobValue = Math.round(totalValue / validBudgets);
    }

    // Count leads in last 30 days
    const leadsLast30Days = await prisma.lead.count({
      where: {
        OR: [
          { acceptedById: contractorId },
          {
            acceptedContractors: {
              contains: contractorId,
            },
          },
        ],
        createdAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    // Count completed jobs in last 30 days (using JobAcceptance with status completed)
    const jobsCompletedLast30Days = await prisma.lead.count({
      where: {
        acceptedById: contractorId,
        status: "completed",
        updatedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        },
      },
    });

    return NextResponse.json({
      success: true,
      metrics: {
        leadsReceived,
        jobsAccepted,
        jobsCompleted: completedJobs,
        avgRating: contractor.avgRating,
        reviewCount: contractor.reviewCount,
        responseTime,
        avgResponseTimeHours: avgResponseTimeHours && avgResponseTimeHours > 0 ? avgResponseTimeHours : null,
        // New metrics
        conversionRate: parseFloat(conversionRate),
        averageJobValue,
        leadsLast30Days,
        jobsCompletedLast30Days,
        // Additional stats
        recentActivity: {
          acceptancesLast30Days: recentAcceptances,
          reviewsLast30Days: recentReviews,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching contractor metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch metrics" },
      { status: 500 }
    );
  }
}
