import { api } from "./client";
import { AdminAppointment } from "./admin";

export type DayOfWeek = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface WorkingHours {
	dayOfWeek: DayOfWeek;
	enabled: boolean;
	openTime: string; // "HH:mm"
	closeTime: string; // "HH:mm"
}

export const DEFAULT_WORKING_HOURS: WorkingHours[] = [
	{ dayOfWeek: 0, enabled: false, openTime: "09:00", closeTime: "13:00" },
	{ dayOfWeek: 1, enabled: true, openTime: "08:00", closeTime: "18:00" },
	{ dayOfWeek: 2, enabled: true, openTime: "08:00", closeTime: "18:00" },
	{ dayOfWeek: 3, enabled: true, openTime: "08:00", closeTime: "18:00" },
	{ dayOfWeek: 4, enabled: true, openTime: "08:00", closeTime: "18:00" },
	{ dayOfWeek: 5, enabled: true, openTime: "08:00", closeTime: "18:00" },
	{ dayOfWeek: 6, enabled: true, openTime: "08:00", closeTime: "13:00" },
];

export async function getWorkingHours(): Promise<WorkingHours[]> {
	try {
		const response = await api.get<WorkingHours[]>("/admin/working-hours");
		return response.data;
	} catch {
		// Fallback to defaults if endpoint not available yet
		return DEFAULT_WORKING_HOURS;
	}
}

export async function updateWorkingHours(
	hours: WorkingHours[],
): Promise<WorkingHours[]> {
	const response = await api.put<WorkingHours[]>("/admin/working-hours", {
		workingHours: hours,
	});
	return response.data;
}

export async function getAffectedBookings(
	hours: WorkingHours[],
): Promise<AdminAppointment[]> {
	try {
		const response = await api.post<AdminAppointment[]>(
			"/admin/working-hours/affected",
			{ workingHours: hours },
		);
		return response.data;
	} catch {
		return [];
	}
}

// Pure helper used by the UI to compute conflicts client-side from existing bookings
export function computeAffectedBookings(
	hours: WorkingHours[],
	bookings: AdminAppointment[],
): AdminAppointment[] {
	const byDay = new Map<number, WorkingHours>();
	for (const h of hours) byDay.set(h.dayOfWeek, h);

	return bookings.filter(b => {
		const d = new Date(`${b.date}`);
		if (Number.isNaN(d.getTime())) return false;
		const day = d.getDay();
		const cfg = byDay.get(day);
		if (!cfg || !cfg.enabled) return true;
		const time = b.time.slice(0, 5);
		return (
			(time < cfg.openTime || time >= cfg.closeTime) && b.status !== "CANCELED"
		);
	});
}

export function validateWorkingHours(
	hours: WorkingHours[],
): Record<number, string> {
	const errors: Record<number, string> = {};
	for (const h of hours) {
		if (!h.enabled) continue;
		if (
			!/^\d{2}:\d{2}$/.test(h.openTime) ||
			!/^\d{2}:\d{2}$/.test(h.closeTime)
		) {
			errors[h.dayOfWeek] = "Horário inválido";
			continue;
		}
		if (h.openTime >= h.closeTime) {
			errors[h.dayOfWeek] = "O fechamento deve ser depois da abertura";
		}
	}
	return errors;
}
