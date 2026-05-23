import { cn } from "@/lib/utils";
import { Check, Lock, User, AlertCircle, XCircle } from "lucide-react";
import { AvailabilitySlot } from "@/api/availability";
import { format } from "date-fns";

export type SlotState =
	| "AVAILABLE"
	| "BLOCKED"
	| "BOOKED"
	| "RESERVED"
	| "CANCELED";

interface TimeSlotCardProps {
	slot: AvailabilitySlot;
	selected: boolean;
	onClick: () => void;
}

const stateStyles: Record<SlotState, string> = {
	AVAILABLE:
		"border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10 text-foreground",
	BLOCKED:
		"border-muted-foreground/30 bg-muted text-muted-foreground hover:bg-muted/80",
	BOOKED: "border-accent/40 bg-accent/10 text-foreground hover:bg-accent/15",
	RESERVED:
		"border-amber-500/40 bg-amber-500/10 text-foreground hover:bg-amber-500/15",
	CANCELED:
		"border-red-500/40 bg-red-500/10 text-foreground hover:bg-red-500/15",
};

const stateLabels: Record<SlotState, string> = {
	AVAILABLE: "Disponível",
	BLOCKED: "Bloqueado",
	BOOKED: "Reservado",
	RESERVED: "Pendente",
	CANCELED: "Cancelado",
};

const stateIcons: Record<SlotState, React.ElementType> = {
	AVAILABLE: Check,
	BLOCKED: Lock,
	BOOKED: User,
	RESERVED: AlertCircle,
	CANCELED: XCircle,
};

export function TimeSlotCard({ slot, selected, onClick }: TimeSlotCardProps) {
	const state = slot.status as SlotState;
	const Icon = stateIcons[state];
	const start = format(new Date(slot.startDateTime), "HH:mm");
	const end = format(new Date(slot.endDateTime), "HH:mm");

	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"relative flex flex-col items-start gap-1 rounded-lg border p-3 text-left transition-all",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				stateStyles[state],
				selected &&
					"ring-2 ring-accent ring-offset-2 ring-offset-background border-accent",
			)}
		>
			<div className="flex w-full items-center justify-between">
				<span className="font-semibold tabular-nums">{start}</span>
				<Icon className="h-3.5 w-3.5 opacity-70" />
			</div>
			<span className="text-xs opacity-70 tabular-nums">até {end}</span>
			<span className="text-[10px] uppercase tracking-wider font-medium opacity-80">
				{stateLabels[state]}
			</span>
		</button>
	);
}
