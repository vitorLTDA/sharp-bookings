import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getMetrics } from '@/lib/mockDashboardData';
import { fetchAppointments, fetchRevenueData } from '@/lib/mockApi';
import { DashboardAppointment, RevenueData } from '@/lib/mockDashboardData';
import { Calendar, DollarSign, Users, TrendingUp, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState<DashboardAppointment[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);

  const metrics = getMetrics();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [appointments, revenue] = await Promise.all([
          fetchAppointments(),
          fetchRevenueData('7'),
        ]);
        setRecentAppointments(appointments.slice(0, 5));
        setRevenueData(revenue);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Welcome back!</h2>
        <p className="text-muted-foreground">Here's what's happening with your shop today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={Calendar}
          label="Total Bookings"
          value={metrics.totalBookings}
          description="This month"
        />
        <StatsCard
          icon={Users}
          label="Active Subscriptions"
          value={metrics.activeSubscriptions}
        />
        <StatsCard
          icon={DollarSign}
          label="Monthly Revenue"
          value={`$${metrics.monthlyRevenue.toFixed(2)}`}
        />
        <StatsCard
          icon={TrendingUp}
          label="Paid Appointments"
          value={metrics.paidAppointments}
          description={`${metrics.unpaidAppointments} unpaid`}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Bookings Overview</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), 'EEE')}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                    formatter={(value: number) => [value, 'Bookings']}
                  />
                  <Bar dataKey="bookings" fill="hsl(var(--accent))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Appointments */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Appointments</CardTitle>
              <CardDescription>Latest bookings</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link to="/dashboard/appointments">
                View all
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm">{apt.customerName}</p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(apt.date), 'MMM d')} at {apt.time}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      apt.status === 'paid'
                        ? 'bg-success/10 text-success'
                        : apt.status === 'unpaid'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
