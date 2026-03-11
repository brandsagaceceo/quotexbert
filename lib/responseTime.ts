/**
 * Response Time Tracking Utility
 * 
 * Calculates and formats contractor response times based on message timestamps
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Calculate average response time for a contractor
 * Combines TWO data sources for complete responsiveness picture:
 * 1. Job acceptance time (Lead created -> Contractor accepts)
 * 2. Message reply time (Homeowner message -> Contractor reply)
 */
export async function calculateContractorResponseTime(contractorUserId: string): Promise<{
  avgResponseTimeMinutes: number | null;
  responseTimeLabel: string | null;
  totalResponses: number;
}> {
  try {
    const responseTimes: number[] = [];

    // DATA SOURCE 1: Job acceptance times
    // Measures how quickly contractor accepts job leads
    const jobAcceptances = await prisma.jobAcceptance.findMany({
      where: { contractorId: contractorUserId },
      select: {
        createdAt: true,
        lead: {
          select: {
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Last 50 acceptances
    });

    for (const acceptance of jobAcceptances) {
      if (acceptance.lead?.createdAt) {
        const responseTimeMinutes =
          (acceptance.createdAt.getTime() - acceptance.lead.createdAt.getTime()) /
          (1000 * 60);
        
        // Only count responses within 7 days (filter out old jobs)
        if (responseTimeMinutes > 0 && responseTimeMinutes <= 10080) {
          responseTimes.push(responseTimeMinutes);
        }
      }
    }

    // DATA SOURCE 2: Message reply times
    // Measures how quickly contractor replies to homeowner messages
    const conversations = await prisma.conversation.findMany({
      where: {
        contractorId: contractorUserId,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'asc',
          },
        },
      },
    });

    // Analyze each conversation
    for (const conversation of conversations) {
      const messages = conversation.messages;
      
      // Track response times between homeowner messages and contractor replies
      for (let i = 0; i < messages.length - 1; i++) {
        const currentMessage = messages[i];
        const nextMessage = messages[i + 1];

        // If homeowner sent a message and contractor replied
        if (
          currentMessage &&
          nextMessage &&
          currentMessage.senderRole === 'homeowner' &&
          nextMessage.senderRole === 'contractor' &&
          nextMessage.senderId === contractorUserId
        ) {
          const responseTimeMinutes =
            (nextMessage.createdAt.getTime() - currentMessage.createdAt.getTime()) / (1000 * 60);

          // Only count reasonable response times (ignore very long delays over 7 days)
          if (responseTimeMinutes > 0 && responseTimeMinutes <= 10080) { // 7 days max
            responseTimes.push(responseTimeMinutes);
          }
        }
      }
    }

    // No response data from either source
    if (responseTimes.length === 0) {
      return {
        avgResponseTimeMinutes: null,
        responseTimeLabel: null,
        totalResponses: 0,
      };
    }

    // Calculate average from BOTH job acceptances and message replies
    const avgResponseTimeMinutes = Math.round(
      responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length
    );

    // Generate human-readable label
    const responseTimeLabel = formatResponseTime(avgResponseTimeMinutes);

    return {
      avgResponseTimeMinutes,
      responseTimeLabel,
      totalResponses: responseTimes.length,
    };
  } catch (error) {
    console.error('Error calculating contractor response time:', error);
    return {
      avgResponseTimeMinutes: null,
      responseTimeLabel: null,
      totalResponses: 0,
    };
  }
}

/**
 * Format response time in minutes to human-readable label
 */
function formatResponseTime(minutes: number): string {
  if (minutes < 5) {
    return '~5 minutes';
  } else if (minutes < 15) {
    return '~10 minutes';
  } else if (minutes < 30) {
    return '~15 minutes';
  } else if (minutes < 60) {
    return '~30 minutes';
  } else if (minutes < 120) {
    return '~1 hour';
  } else if (minutes < 180) {
    return '~2 hours';
  } else if (minutes < 240) {
    return '~3 hours';
  } else if (minutes < 360) {
    return '~4 hours';
  } else if (minutes < 480) {
    return '~6 hours';
  } else if (minutes < 720) {
    return '~8 hours';
  } else if (minutes < 1440) {
    return '~12 hours';
  } else if (minutes < 2880) {
    return '~1 day';
  } else if (minutes < 4320) {
    return '~2 days';
  } else {
    return '~3+ days';
  }
}

/**
 * Update contractor profile with latest response time data
 */
export async function updateContractorResponseTime(contractorUserId: string): Promise<void> {
  try {
    const { avgResponseTimeMinutes, responseTimeLabel, totalResponses } =
      await calculateContractorResponseTime(contractorUserId);

    // Find contractor profile
    const contractorProfile = await prisma.contractorProfile.findUnique({
      where: {
        userId: contractorUserId,
      },
    });

    if (!contractorProfile) {
      console.warn(`No contractor profile found for user ${contractorUserId}`);
      return;
    }

    // Update contractor profile with response time metrics
    await prisma.contractorProfile.update({
      where: {
        userId: contractorUserId,
      },
      data: {
        avgResponseTimeMinutes,
        responseTimeLabel,
        totalResponses,
        lastResponseCalculated: new Date(),
      },
    });

    console.log(
      `Updated response time for contractor ${contractorUserId}: ${responseTimeLabel} (${avgResponseTimeMinutes}min)`
    );
  } catch (error) {
    console.error('Error updating contractor response time:', error);
  }
}

/**
 * Batch update response times for all contractors
 * Useful for initial setup or periodic recalculation
 */
export async function updateAllContractorResponseTimes(): Promise<void> {
  try {
    const contractors = await prisma.contractorProfile.findMany({
      select: {
        userId: true,
      },
    });

    console.log(`Updating response times for ${contractors.length} contractors...`);

    for (const contractor of contractors) {
      await updateContractorResponseTime(contractor.userId);
    }

    console.log('Finished updating all contractor response times');
  } catch (error) {
    console.error('Error batch updating contractor response times:', error);
  }
}
