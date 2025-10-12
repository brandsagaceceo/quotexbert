import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    // For now, allow access - in production you'd check authentication
    // const session = await getServerSession(authOptions);
    // if (!session?.user || session.user.role !== 'admin') {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    const metric = searchParams.get('metric') || 'overview';

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '1d':
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        break;
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    }

    if (metric === 'overview') {
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
        paymentStats,
        messageCount,
        portfolioCount
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: 'homeowner' } }),
        prisma.user.count({ where: { role: 'contractor' } }),
        prisma.user.count({ where: { createdAt: { gte: startDate } } }),
        prisma.lead.count(),
        prisma.lead.count({ where: { createdAt: { gte: startDate } } }),
        prisma.lead.count({ where: { status: 'completed' } }),
        prisma.jobApplication.count(),
        prisma.jobApplication.count({ where: { createdAt: { gte: startDate } } }),
        prisma.jobApplication.count({ where: { status: 'accepted' } }),
        prisma.transaction.aggregate({
          _sum: { amount: true },
          _count: true,
          where: { 
            status: 'completed',
            createdAt: { gte: startDate }
          }
        }),
        prisma.message.count({ where: { createdAt: { gte: startDate } } }),
        prisma.portfolioItem.count()
      ]);

      return NextResponse.json({
        period,
        overview: {
          users: {
            total: totalUsers,
            homeowners,
            contractors,
            new: newUsers
          },
          jobs: {
            total: totalJobs,
            new: newJobs,
            completed: completedJobs,
            completionRate: totalJobs > 0 ? (completedJobs / totalJobs * 100).toFixed(1) : 0
          },
          applications: {
            total: totalApplications,
            new: newApplications,
            accepted: acceptedApplications,
            acceptanceRate: totalApplications > 0 ? (acceptedApplications / totalApplications * 100).toFixed(1) : 0
          },
          revenue: {
            total: paymentStats._sum.amount || 0,
            transactions: paymentStats._count
          },
          engagement: {
            messages: messageCount,
            portfolios: portfolioCount
          }
        }
      });
    }

    if (metric === 'users') {
      // User analytics
      const userTrends = await prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as registrations,
          SUM(CASE WHEN role = 'homeowner' THEN 1 ELSE 0 END) as homeowners,
          SUM(CASE WHEN role = 'contractor' THEN 1 ELSE 0 END) as contractors
        FROM users 
        WHERE createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      ` as Array<{ date: string, registrations: number, homeowners: number, contractors: number }>;

      return NextResponse.json({
        period,
        userTrends
      });
    }

    if (metric === 'revenue') {
      // Revenue analytics
      const revenueData = await prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          SUM(amount) as revenue,
          COUNT(*) as transactions,
          AVG(amount) as avgTransaction
        FROM transactions 
        WHERE status = 'completed' AND createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      ` as Array<{ date: string, revenue: number, transactions: number, avgTransaction: number }>;

      return NextResponse.json({
        period,
        revenueData
      });
    }

    return NextResponse.json({ error: 'Invalid metric' }, { status: 400 });

  } catch (error) {
    console.error('Usage analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}

      return NextResponse.json({
        period,
        overview: {
          users: {
            total: totalUsers,
            homeowners,
            contractors,
            new: newUsers
          },
          jobs: {
            total: totalJobs,
            new: newJobs,
            completed: completedJobs,
            completionRate: totalJobs > 0 ? (completedJobs / totalJobs * 100).toFixed(1) : 0
          },
          applications: {
            total: totalApplications,
            new: newApplications,
            accepted: acceptedApplications,
            acceptanceRate: totalApplications > 0 ? (acceptedApplications / totalApplications * 100).toFixed(1) : 0
          },
          revenue: {
            total: paymentStats._sum.amount || 0,
            transactions: paymentStats._count
          },
          engagement: {
            messages: messageCount,
            portfolios: portfolioCount
          }
        }
      });
    }

    if (metric === 'users') {
      // User analytics
      const userTrends = await prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          COUNT(*) as registrations,
          SUM(CASE WHEN role = 'homeowner' THEN 1 ELSE 0 END) as homeowners,
          SUM(CASE WHEN role = 'contractor' THEN 1 ELSE 0 END) as contractors
        FROM users 
        WHERE createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      ` as Array<{ date: string, registrations: number, homeowners: number, contractors: number }>;

      return NextResponse.json({
        period,
        userTrends
      });
    }

    if (metric === 'revenue') {
      // Revenue analytics
      const revenueData = await prisma.$queryRaw`
        SELECT 
          DATE(createdAt) as date,
          SUM(amount) as revenue,
          COUNT(*) as transactions,
          AVG(amount) as avgTransaction
        FROM transactions 
        WHERE status = 'completed' AND createdAt >= ${startDate}
        GROUP BY DATE(createdAt)
        ORDER BY date DESC
      ` as Array<{ date: string, revenue: number, transactions: number, avgTransaction: number }>;

      return NextResponse.json({
        period,
        revenueData
      });
    }

    return NextResponse.json({ error: 'Invalid metric' }, { status: 400 });

  } catch (error) {
    console.error('Usage analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch usage data' },
      { status: 500 }
    );
  }
}