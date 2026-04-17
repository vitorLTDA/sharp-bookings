import { AvailabilitySlot } from "@/api/availability";
import { TimeSlot } from "@/lib/types";

export function transformSlot(slot: AvailabilitySlot): TimeSlot {
	const dateTime = new Date(slot.startDateTime);
	const hours = dateTime.getHours().toString().padStart(2, "0");
	const minutes = dateTime.getMinutes().toString().padStart(2, "0");
	const time = `${hours}:${minutes}`;

	const statusMap: Record<string, TimeSlot["status"]> = {
		AVAILABLE: "available",
		BOOKED: "booked",
		RESERVED: "reserved",
	};
	const status = statusMap[slot.status] || "available";

	return { time, status };
}
