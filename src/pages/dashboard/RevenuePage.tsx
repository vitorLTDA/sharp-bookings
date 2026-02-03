import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { fetchRevenueData, fetchSubscriptions } from '@/lib/mockApi';
import { getMetrics, RevenueData, Subscription } from '@/lib/mockDashboardData';
import { DollarSign, Users, TrendingUp, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export default function RevenuePage() {
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'7' | '30'>('7');
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);

  const metrics = getMetrics();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [revenue, subs] = await Promise.all([
          fetchRevenueData(period),
          fetchSubscriptions(),
        ]);
        setRevenueData(revenue);
        setSubscriptions(subs);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [period]);

  const totalRevenue = revenueData.reduce((sum, d) => sum + d.revenue, 0);
  const totalBookings = revenueData.reduce((sum, d) => sum + d.bookings, 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading revenue data..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Revenue & Subscriptions</h2>
        <p className="text-muted-foreground">Track your earnings and subscriber metrics.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={DollarSign}
          label="Monthly Revenue"
          value={`$${metrics.monthlyRevenue.toFixed(2)}`}
        />
        <StatsCard
          icon={Users}
          label="Active Subscriptions"
          value={metrics.activeSubscriptions}
        />
        <StatsCard
          icon={TrendingUp}
          label={`Revenue (${period}d)`}
          value={`$${totalRevenue.toFixed(2)}`}
        />
        <StatsCard
          icon={CreditCard}
          label={`Bookings (${period}d)`}
          value={totalBookings}
        />
      </div>

      {/* Period Toggle */}
      <div className="flex gap-2">
        <Button
          variant={period === '7' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('7')}
        >
          Last 7 Days
        </Button>
        <Button
          variant={period === '30' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('30')}
        >
          Last 30 Days
        </Button>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bookings Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings</CardTitle>
            <CardDescription>Number of appointments per day</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), period === '7' ? 'EEE' : 'MMM d')}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                    formatter={(value: number) => [value, 'Bookings']}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Bar dataKey="bookings" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Daily revenue over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), period === '7' ? 'EEE' : 'MMM d')}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Revenue']}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="hsl(var(--accent))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--accent))' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscriptions List */}
      <Card>
        <CardHeader>
          <CardTitle>Active Subscriptions</CardTitle>
          <CardDescription>Current subscribers and their plans</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <div key={sub.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="font-medium">{sub.customerName}</p>
                  <p className="text-sm text-muted-foreground">{sub.customerEmail}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge
                    variant={
                      sub.plan === 'business'
                        ? 'default'
                        : sub.plan === 'pro'
                        ? 'secondary'
                        : 'outline'
                    }
                  >
                    {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1)}
                  </Badge>
                  <span className="text-sm font-medium">${sub.amount}/mo</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
