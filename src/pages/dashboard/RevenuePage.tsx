import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getDashboardStats, getRevenueData, getSubscriptions } from '@/api/admin';
import { RevenueDataPoint, Subscription } from '@/api/admin';
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
  const [period, setPeriod] = useState<'7d' | '30d'>('7d');

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: getDashboardStats,
  });

  const { data: revenueData, isLoading: revenueLoading } = useQuery({
    queryKey: ['revenue', period],
    queryFn: () => getRevenueData(period),
  });

  const { data: subscriptions, isLoading: subsLoading } = useQuery({
    queryKey: ['subscriptions'],
    queryFn: getSubscriptions,
  });

  const isLoading = statsLoading || revenueLoading || subsLoading;

  const totalRevenue = revenueData?.reduce((sum, d) => sum + d.revenue, 0) || 0;
  const totalBookings = revenueData?.reduce((sum, d) => sum + d.bookings, 0) || 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Carregando dados de receita..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Receita e Assinaturas</h2>
        <p className="text-muted-foreground">Acompanhe seus ganhos e métricas de assinantes.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={DollarSign}
          label="Receita Mensal"
          value={`$${(stats?.monthlyRevenue || 0).toFixed(2)}`}
        />
        <StatsCard
          icon={Users}
          label="Assinaturas Ativas"
          value={stats?.activeSubscriptions || 0}
        />
        <StatsCard
          icon={TrendingUp}
          label={`Receita (${period})`}
          value={`$${totalRevenue.toFixed(2)}`}
        />
        <StatsCard
          icon={CreditCard}
          label={`Agendamentos (${period})`}
          value={totalBookings}
        />
      </div>

      {/* Period Toggle */}
      <div className="flex gap-2">
        <Button
          variant={period === '7d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('7d')}
        >
          Últimos 7 Dias
        </Button>
        <Button
          variant={period === '30d' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setPeriod('30d')}
        >
          Últimos 30 Dias
        </Button>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Bookings Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Agendamentos</CardTitle>
            <CardDescription>Número de agendamentos por dia</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), period === '7d' ? 'EEE' : 'MMM d')}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} />
                  <Tooltip
                    labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                    formatter={(value: number) => [value, 'Agendamentos']}
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
            <CardTitle>Tendência de Receita</CardTitle>
            <CardDescription>Receita diária ao longo do tempo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) => format(new Date(value), period === '7d' ? 'EEE' : 'MMM d')}
                    fontSize={12}
                  />
                  <YAxis fontSize={12} tickFormatter={(value) => `$${value}`} />
                  <Tooltip
                    labelFormatter={(value) => format(new Date(value), 'MMM d, yyyy')}
                    formatter={(value: number) => [`$${value.toFixed(2)}`, 'Receita']}
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
          <CardTitle>Assinaturas Ativas</CardTitle>
          <CardDescription>Assinantes atuais e seus planos</CardDescription>
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
                       sub.plan === 'ANNUAL'
                         ? 'default'
                         : sub.plan === 'QUARTERLY'
                         ? 'secondary'
                         : 'outline'
                     }
                   >
                     {sub.plan.charAt(0).toUpperCase() + sub.plan.slice(1).toLowerCase()}
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
