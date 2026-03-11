import { NextRequest, NextResponse } from 'next/server';
import { updateContractorResponseTime, updateAllContractorResponseTimes } from '@/lib/responseTime';

/**
 * API endpoint to manually trigger response time calculations
 * 
 * GET /api/contractors/response-time?userId=XXX - Calculate for specific contractor
 * POST /api/contractors/response-time (with {"all": true}) - Calculate for all contractors
 */

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId parameter is required' },
        { status: 400 }
      );
    }

    // Calculate and update response time for specific contractor
    await updateContractorResponseTime(userId);

    return NextResponse.json({
      success: true,
      message: `Response time updated for contractor ${userId}`,
    });
  } catch (error) {
    console.error('Error updating contractor response time:', error);
    return NextResponse.json(
      { error: 'Failed to update response time' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (body.all === true) {
      // Calculate and update response times for all contractors
      console.log('Starting batch response time calculation for all contractors...');
      
      // Run asynchronously and return immediately
      updateAllContractorResponseTimes().catch((err) => {
        console.error('Error in batch response time calculation:', err);
      });

      return NextResponse.json({
        success: true,
        message: 'Batch response time calculation started. This may take a few minutes.',
      });
    } else if (body.userId) {
      // Calculate for specific contractor
      await updateContractorResponseTime(body.userId);

      return NextResponse.json({
        success: true,
        message: `Response time updated for contractor ${body.userId}`,
      });
    } else {
      return NextResponse.json(
        { error: 'Either "all: true" or "userId" must be provided' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error in response time calculation:', error);
    return NextResponse.json(
      { error: 'Failed to calculate response times' },
      { status: 500 }
    );
  }
}
