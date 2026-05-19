import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { StatsCard } from "@/components/dashboard/StatsCard"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { getDashboardStats, getAppointments, getRevenueData } from "@/api/admin"
import { AdminAppointment } from "@/api/admin"
import {
	Calendar,
	DollarSign,
	Users,
	TrendingUp,
	ArrowRight,
} from "lucide-react"
import { format } from "date-fns"
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
} from "recharts"

export default function DashboardPage() {
	const { data: stats, isLoading: statsLoading } = useQuery({
		queryKey: ["dashboardStats"],
		queryFn: getDashboardStats,
	})

	const { data: appointments, isLoading: appointmentsLoading } = useQuery({
		queryKey: ["appointments"],
		queryFn: () => getAppointments(),
	})

	const { data: revenueData, isLoading: revenueLoading } = useQuery({
		queryKey: ["revenue", "7d"],
		queryFn: () => getRevenueData("7d"),
	})

	const isLoading = statsLoading || appointmentsLoading || revenueLoading

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-64">
				<LoadingSpinner size="lg" text="Carregando painel..." />
			</div>
		)
	}

	return (
		<div className="space-y-6">
			<div>
				<h2 className="text-2xl font-bold">Bem-vindo de volta!</h2>
				<p className="text-muted-foreground">
					Veja o que está acontecendo com sua barbearia hoje.
				</p>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<StatsCard
					icon={Calendar}
					label="Total de Agendamentos"
					value={stats?.totalBookings || 0}
					description="Este mês"
				/>
				<StatsCard
					icon={Users}
					label="Assinaturas Ativas"
					value={stats?.activeSubscriptions || 0}
				/>
				<StatsCard
					icon={DollarSign}
					label="Receita Mensal"
					value={`$${(stats?.monthlyRevenue || 0).toFixed(2)}`}
				/>
				<StatsCard
					icon={TrendingUp}
					label="Agendamentos Pagos"
					value={stats?.paidAppointments || 0}
					description={`${stats?.unpaidAppointments || 0} não pagos`}
				/>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				{/* Revenue Chart */}
				<Card>
					<CardHeader>
						<CardTitle>Visão Geral de Agendamentos</CardTitle>
						<CardDescription>Últimos 7 dias</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="h-[200px]">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart data={revenueData}>
									<XAxis
										dataKey="date"
										tickFormatter={value => format(new Date(value), "EEE")}
										fontSize={12}
									/>
									<YAxis fontSize={12} />
									<Tooltip
										labelFormatter={value =>
											format(new Date(value), "MMM d, yyyy")
										}
										formatter={(value: number) => [value, "Bookings"]}
									/>
									<Bar
										dataKey="bookings"
										fill="hsl(var(--accent))"
										radius={[4, 4, 0, 0]}
									/>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</CardContent>
				</Card>

				{/* Recent Appointments */}
				<Card>
					<CardHeader className="flex flex-row items-center justify-between">
						<div>
							<CardTitle>Agendamentos Recentes</CardTitle>
							<CardDescription>Últimos agendamentos</CardDescription>
						</div>
						<Button variant="ghost" size="sm" asChild>
							<Link to="/dashboard/appointments">
								Ver todos
								<ArrowRight className="ml-1 h-4 w-4" />
							</Link>
						</Button>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{appointments.map((apt: AdminAppointment) => (
								<div key={apt.id} className="flex items-center justify-between">
									<div>
										<p className="font-medium text-sm">{apt.customerName}</p>
										<p className="text-xs text-muted-foreground">
											{format(new Date(apt.date), "MMM d")} at {apt.time}
										</p>
									</div>
									<span
										className={`text-xs px-2 py-0.5 rounded-full ${
											apt.status === "BOOKED"
												? "bg-success/10 text-success"
												: apt.status === "RESERVED"
													? "bg-warning/10 text-warning"
													: "bg-destructive/10 text-destructive"
										}`}
									>
										{apt.status.toLowerCase()}
									</span>
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
