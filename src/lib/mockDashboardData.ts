import { barbers } from "./mockData";

export type AppointmentStatus = "paid" | "unpaid" | "CANCELED";

export interface DashboardAppointment {
	id: string;
	customerId: string;
	customerName: string;
	customerPhone: string;
	customerEmail: string;
	barberId: string;
	barberName: string;
	date: string;
	time: string;
	status: AppointmentStatus;
	createdAt: string;
}

export interface Subscription {
	id: string;
	customerId: string;
	customerName: string;
	customerEmail: string;
	plan: "starter" | "pro" | "business";
	startDate: string;
	nextBillingDate: string;
	amount: number;
	status: "active" | "canceled" | "past_due";
}

export interface RevenueData {
	date: string;
	bookings: number;
	revenue: number;
}

// Generate sample appointments
function generateAppointments(): DashboardAppointment[] {
	const statuses: AppointmentStatus[] = ["paid", "unpaid", "canceled"];
	const names = [
		"John Doe",
		"Mike Smith",
		"Chris Johnson",
		"Alex Brown",
		"Sam Wilson",
		"Tom Davis",
	];
	const appointments: DashboardAppointment[] = [];

	const today = new Date();

	for (let i = 0; i < 25; i++) {
		const date = new Date(today);
		date.setDate(date.getDate() - Math.floor(Math.random() * 30));

		const barber = barbers[Math.floor(Math.random() * barbers.length)];
		const name = names[Math.floor(Math.random() * names.length)];
		const hour = 9 + Math.floor(Math.random() * 9);

		appointments.push({
			id: `apt_${i + 1}`,
			customerId: `cust_${i + 1}`,
			customerName: name,
			customerPhone: `(555) ${100 + i}-${1000 + i}`,
			customerEmail: `${name.toLowerCase().replace(" ", ".")}@email.com`,
			barberId: barber.id,
			barberName: barber.name,
			date: date.toISOString().split("T")[0],
			time: `${hour.toString().padStart(2, "0")}:00`,
			status: statuses[Math.floor(Math.random() * statuses.length)],
			createdAt: new Date(
				date.getTime() - 86400000 * Math.random() * 7,
			).toISOString(),
		});
	}

	return appointments.sort(
		(a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
	);
}

// Generate sample subscriptions
function generateSubscriptions(): Subscription[] {
	const plans = ["starter", "pro", "business"] as const;
	const names = [
		"Premium Customer",
		"Regular Joe",
		"VIP Client",
		"Business Account",
	];

	return names.map((name, i) => {
		const plan = plans[i % plans.length];
		const amount = plan === "starter" ? 9.99 : plan === "pro" ? 24.99 : 49.99;
		const startDate = new Date();
		startDate.setMonth(startDate.getMonth() - Math.floor(Math.random() * 6));

		const nextBilling = new Date(startDate);
		nextBilling.setMonth(nextBilling.getMonth() + 1);

		return {
			id: `sub_${i + 1}`,
			customerId: `cust_${100 + i}`,
			customerName: name,
			customerEmail: `${name.toLowerCase().replace(" ", ".")}@email.com`,
			plan,
			startDate: startDate.toISOString().split("T")[0],
			nextBillingDate: nextBilling.toISOString().split("T")[0],
			amount,
			status: "active" as const,
		};
	});
}

// Generate revenue data for charts
function generateRevenueData(days: number): RevenueData[] {
	const data: RevenueData[] = [];
	const today = new Date();

	for (let i = days - 1; i >= 0; i--) {
		const date = new Date(today);
		date.setDate(date.getDate() - i);

		const bookings = Math.floor(Math.random() * 8) + 2;
		const revenue = bookings * (25 + Math.random() * 15);

		data.push({
			date: date.toISOString().split("T")[0],
			bookings,
			revenue: Math.round(revenue * 100) / 100,
		});
	}

	return data;
}

export const mockAppointments = generateAppointments();
export const mockSubscriptions = generateSubscriptions();
export const mockRevenueData7Days = generateRevenueData(7);
export const mockRevenueData30Days = generateRevenueData(30);

// Calculate metrics
export function getMetrics() {
	const totalBookings = mockAppointments.filter(
		a => a.status !== "canceled",
	).length;
	const activeSubscriptions = mockSubscriptions.filter(
		s => s.status === "active",
	).length;
	const monthlyRevenue = mockSubscriptions
		.filter(s => s.status === "active")
		.reduce((sum, s) => sum + s.amount, 0);

	const bookingRevenue =
		mockAppointments.filter(a => a.status === "paid").length * 35; // Assuming $35 per booking

	return {
		totalBookings,
		activeSubscriptions,
		monthlyRevenue: monthlyRevenue + bookingRevenue,
		paidAppointments: mockAppointments.filter(a => a.status === "paid").length,
		unpaidAppointments: mockAppointments.filter(a => a.status === "unpaid")
			.length,
		canceledAppointments: mockAppointments.filter(a => a.status === "canceled")
			.length,
	};
}
