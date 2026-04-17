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
