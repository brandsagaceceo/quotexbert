#!/usr/bin/env node

/**
 * Calculate and update response times for all contractors
 * 
 * Run this script to initially populate response time metrics:
 * node calculate-response-times.js
 */

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function calculateResponseTime(contractorUserId) {
  try {
    // Get all conversations where this user is the contractor
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

    if (conversations.length === 0) {
      return {
        avgResponseTimeMinutes: null,
        responseTimeLabel: null,
        totalResponses: 0,
      };
    }

    const responseTimes = [];

    // Analyze each conversation
    for (const conversation of conversations) {
      const messages = conversation.messages;
      
      // Track response times between homeowner messages and contractor replies
      for (let i = 0; i < messages.length - 1; i++) {
        const currentMessage = messages[i];
        const nextMessage = messages[i + 1];

        // If homeowner sent a message and contractor replied
        if (
          currentMessage.senderRole === 'homeowner' &&
          nextMessage.senderRole === 'contractor' &&
          nextMessage.senderId === contractorUserId
        ) {
          const responseTimeMinutes =
            (nextMessage.createdAt.getTime() - currentMessage.createdAt.getTime()) / (1000 * 60);

          // Only count reasonable response times (ignore very long delays over 7 days)
          if (responseTimeMinutes > 0 && responseTimeMinutes <= 10080) {
            responseTimes.push(responseTimeMinutes);
          }
        }
      }
    }

    if (responseTimes.length === 0) {
      return {
        avgResponseTimeMinutes: null,
        responseTimeLabel: null,
        totalResponses: 0,
      };
    }

    // Calculate average
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

function formatResponseTime(minutes) {
  if (minutes < 5) return '~5 minutes';
  if (minutes < 15) return '~10 minutes';
  if (minutes < 30) return '~15 minutes';
  if (minutes < 60) return '~30 minutes';
  if (minutes < 120) return '~1 hour';
  if (minutes < 180) return '~2 hours';
  if (minutes < 240) return '~3 hours';
  if (minutes < 360) return '~4 hours';
  if (minutes < 480) return '~6 hours';
  if (minutes < 720) return '~8 hours';
  if (minutes < 1440) return '~12 hours';
  if (minutes < 2880) return '~1 day';
  if (minutes < 4320) return '~2 days';
  return '~3+ days';
}

async function main() {
  console.log('🚀 Starting contractor response time calculation...\n');

  try {
    // Get all contractor profiles
    const contractors = await prisma.contractorProfile.findMany({
      select: {
        id: true,
        userId: true,
        companyName: true,
      },
    });

    console.log(`📊 Found ${contractors.length} contractors to process\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const contractor of contractors) {
      try {
        console.log(`Processing: ${contractor.companyName} (${contractor.userId})`);

        const { avgResponseTimeMinutes, responseTimeLabel, totalResponses } =
          await calculateResponseTime(contractor.userId);

        // Update contractor profile
        await prisma.contractorProfile.update({
          where: {
            userId: contractor.userId,
          },
          data: {
            avgResponseTimeMinutes,
            responseTimeLabel,
            totalResponses,
            lastResponseCalculated: new Date(),
          },
        });

        if (responseTimeLabel) {
          console.log(`  ✅ Updated: ${responseTimeLabel} (${totalResponses} responses tracked)`);
          successCount++;
        } else {
          console.log(`  ⚠️  No message data available`);
        }
      } catch (error) {
        console.error(`  ❌ Error processing contractor ${contractor.userId}:`, error.message);
        errorCount++;
      }
      console.log('');
    }

    console.log('\n✨ Calculation complete!');
    console.log(`✅ Successfully updated: ${successCount} contractors`);
    console.log(`⚠️  No data: ${contractors.length - successCount - errorCount} contractors`);
    if (errorCount > 0) {
      console.log(`❌ Errors: ${errorCount} contractors`);
    }
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
