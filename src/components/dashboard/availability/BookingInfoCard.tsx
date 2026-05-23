import { AdminAppointment } from "@/api/admin";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Phone, User, Clock } from "lucide-react";

interface BookingInfoCardProps {
	bookings: AdminAppointment[];
}

export type SlotState =
	| "AVAILABLE"
	| "BLOCKED"
	| "BOOKED"
	| "RESERVED"
	| "CANCELED";

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

export function BookingInfoCard({ bookings }: BookingInfoCardProps) {
	if (bookings.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">
				Nenhum agendamento para esta data.
			</p>
		);
	}

	return (
		<div className="space-y-2">
			{bookings.map(b => (
				<div
					key={b.id}
					className="flex items-center justify-between rounded-lg border bg-card p-3"
				>
					<div className="flex items-center gap-3 min-w-0">
						<div className="h-9 w-9 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
							<User className="h-4 w-4 text-accent" />
						</div>
						<div className="min-w-0 flex flex-col gap-1 items-start">
							<p className="text-sm font-medium truncate">{b.customerName}</p>
							<Badge
								variant="outline"
								className={cn("text-[10px] uppercase", stateStyles[b.status])}
							>
								{stateLabels[b.status]}
							</Badge>
							<div className="flex items-center gap-3 text-xs text-muted-foreground">
								<span className="flex items-center gap-1">
									<Clock className="h-3 w-3" />
									{b.time}
								</span>
								{b.customerPhone && (
									<span className="flex items-center gap-1">
										<Phone className="h-3 w-3" />
										{b.customerPhone}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			))}
		</div>
	);
}
