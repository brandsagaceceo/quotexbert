'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Users, Briefcase, DollarSign, MessageSquare, RefreshCw, Shield } from 'lucide-react';

interface UsageData {
  period: string;
  overview: {
    users: {
      total: number;
      homeowners: number;
      contractors: number;
      new: number;
    };
    jobs: {
      total: number;
      new: number;
      completed: number;
      completionRate: string;
    };
    applications: {
      total: number;
      new: number;
      accepted: number;
      acceptanceRate: string;
    };
    revenue: {
      total: number;
      transactions: number;
    };
    engagement: {
      messages: number;
      portfolios: number;
    };
  };
}

export default function AdminMonitoringPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [usageData, setUsageData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [error, setError] = useState<string | null>(null);

  // Security check - only admins can access
  useEffect(() => {
    if (isLoaded && (!user || user.publicMetadata.role !== 'admin')) {
      router.push('/unauthorized');
      return;
    }
  }, [user, isLoaded, router]);

  const fetchData = async () => {
    if (!user || user.publicMetadata.role !== 'admin') {
      setError('Unauthorized access');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/usage?metric=overview&period=${selectedPeriod}`);
      if (response.ok) {
        const data = await response.json();
        setUsageData(data);
        setLastUpdated(new Date());
      } else {
        setError('Failed to fetch data');
      }
    } catch (error) {
      console.error('Failed to fetch monitoring data:', error);
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [selectedPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount / 100);
  };

  // Show loading while checking authentication
  if (!isLoaded || loading && !usageData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading monitoring data...</p>
        </div>
      </div>
    );
  }

  // Show unauthorized if not admin
  if (isLoaded && (!user || user.publicMetadata.role !== 'admin')) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Shield className="h-16 w-16 mx-auto mb-4 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Platform Monitoring</h1>
            <p className="text-gray-600">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
            {error && (
              <p className="text-red-600 text-sm mt-1">
                Error: {error}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedPeriod === '1d' ? 'primary' : 'secondary'}
              onClick={() => setSelectedPeriod('1d')}
            >
              24h
            </Button>
            <Button
              variant={selectedPeriod === '7d' ? 'primary' : 'secondary'}
              onClick={() => setSelectedPeriod('7d')}
            >
              7d
            </Button>
            <Button
              variant={selectedPeriod === '30d' ? 'primary' : 'secondary'}
              onClick={() => setSelectedPeriod('30d')}
            >
              30d
            </Button>
            <Button onClick={fetchData} variant="secondary" size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {usageData && (
          <div className="space-y-6">
            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium">Total Users</h3>
                  <Users className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usageData.overview.users.total}</div>
                  <p className="text-xs text-gray-500">
                    +{usageData.overview.users.new} new this period
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="secondary">
                      {usageData.overview.users.homeowners} homeowners
                    </Badge>
                    <Badge variant="secondary">
                      {usageData.overview.users.contractors} contractors
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium">Jobs</h3>
                  <Briefcase className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usageData.overview.jobs.total}</div>
                  <p className="text-xs text-gray-500">
                    +{usageData.overview.jobs.new} new this period
                  </p>
                  <div className="flex gap-2 mt-2">
                    <Badge variant="success">
                      {usageData.overview.jobs.completed} completed
                    </Badge>
                    <Badge variant="secondary">
                      {usageData.overview.jobs.completionRate}% rate
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium">Revenue</h3>
                  <DollarSign className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {formatCurrency(usageData.overview.revenue.total)}
                  </div>
                  <p className="text-xs text-gray-500">
                    {usageData.overview.revenue.transactions} transactions
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="text-sm font-medium">Engagement</h3>
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{usageData.overview.engagement.messages}</div>
                  <p className="text-xs text-gray-500">Messages sent</p>
                  <div className="mt-2">
                    <Badge variant="secondary">
                      {usageData.overview.engagement.portfolios} portfolios
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Applications Overview */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Application Metrics</h2>
                <p className="text-gray-600">Job application statistics for the selected period</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">{usageData.overview.applications.total}</div>
                    <p className="text-sm text-gray-500">Total Applications</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{usageData.overview.applications.accepted}</div>
                    <p className="text-sm text-gray-500">Accepted</p>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">{usageData.overview.applications.acceptanceRate}%</div>
                    <p className="text-sm text-gray-500">Acceptance Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* API Endpoints Info */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold">Monitoring API Endpoints</h2>
                <p className="text-gray-600">Available endpoints for detailed monitoring</p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between items-center border-b pb-2">
                    <code className="text-sm bg-gray-100 p-1 rounded">/api/admin/usage?metric=overview</code>
                    <span className="text-sm text-gray-500">Platform overview stats</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <code className="text-sm bg-gray-100 p-1 rounded">/api/admin/usage?metric=users</code>
                    <span className="text-sm text-gray-500">User registration trends</span>
                  </div>
                  <div className="flex justify-between items-center border-b pb-2">
                    <code className="text-sm bg-gray-100 p-1 rounded">/api/admin/usage?metric=revenue</code>
                    <span className="text-sm text-gray-500">Revenue and transaction data</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}