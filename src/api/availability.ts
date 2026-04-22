import { transformSlot } from "@/utils/slots";
import { api } from "./client";
import { TimeSlot } from "@/lib/types";

export interface AvailabilitySlot {
	id: string;
	startDateTime: string;
	endDateTime: string;
	status: "AVAILABLE" | "BOOKED" | "RESERVED";
	maxReservations: number;
	reservedBy: unknown;
}

export async function getAvailableSlots(date: string): Promise<TimeSlot[]> {
	try {
		const response = await api.get<AvailabilitySlot[]>(`/availability/${date}`);
		return response.data.map(transformSlot);
	} catch (error) {
		console.error("Error fetching available slots:", error);
		throw error;
	}
}

export interface CustomerInfo {
	name: string;
	phone: string;
	email: string;
}

export async function reserveSlot(slotId: string, customerInfo: CustomerInfo) {
	try {
		const response = await api.post("/slots/reserve", { slotId, ...customerInfo });
		return response.data;
	} catch (error) {
		console.error("Error reserving slot:", error);
		throw error;
	}
}
