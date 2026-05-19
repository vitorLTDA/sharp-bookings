import { AppointmentStatus } from "@/lib/mockDashboardData"
import { api } from "./client"

export interface DashboardStats {
	totalBookings: number
	activeSubscriptions: number
	monthlyRevenue: number
	paidAppointments: number
	unpaidAppointments: number
	canceledAppointments: number
}

export interface AdminAppointment {
	id: string
	slotId: string
	customerId: string
	customerName: string
	customerPhone: string
	customerEmail: string
	date: string
	time: string
	status: AppointmentStatus
	barberName: string
	barberId: string
	createdAt: string
}

export interface RevenueDataPoint {
	date: string
	bookings: number
	revenue: number
}

export interface Subscription {
	id: string
	customerId: string
	customerName: string
	customerEmail: string
	plan: string
	startDate: string
	nextBillingDate: string
	amount: number
	status: string
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
	const response = await api.get("/admin/stats")
	return response.data
}

export const getAppointments = async (filters?: {
	status?: string
	startDate?: string
	endDate?: string
}): Promise<AdminAppointment[]> => {
	const response = await api.get("/admin/appointments", { params: filters })
	return response.data
}

export const getRevenueData = async (
	period: "7d" | "30d" = "7d",
	startDate?: string,
	endDate?: string,
): Promise<RevenueDataPoint[]> => {
	const params = { period, startDate, endDate }
	if (startDate && endDate) {
		params.startDate = startDate
		params.endDate = endDate
	}
	const response = await api.get("/admin/revenue", { params })
	return response.data
}

export const getSubscriptions = async (): Promise<Subscription[]> => {
	const response = await api.get("/admin/subscriptions")
	return response.data
}

export const getAvailability = async () => {
	const response = await api.get("/admin/availability")
	return response.data
}

export const updateAvailability = async (businessHours: any) => {
	const response = await api.put("/admin/availability", { businessHours })
	return response.data
}

export const sendWhatsAppNotification = async (
	type: "single" | "day",
	data: any,
) => {
	const response = await api.post("/whatsapp/send", { type, ...data })
	return response.data
}

export const createAdminAppointment = async (data: {
	slotId: string
	name: string
	phone?: string
	email?: string
}) => {
	const response = await api.post("/admin/appointments", data)
	return response.data
}

export const cancelAppointment = async (slotId: string) => {
	const response = await api.post("/slots/cancel", { slotId })
	return response.data
}
