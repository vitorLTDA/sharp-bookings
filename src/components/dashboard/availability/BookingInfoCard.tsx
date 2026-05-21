import { AdminAppointment } from "@/api/admin"
import { Badge } from "@/components/ui/badge"
import { Phone, User, Clock } from "lucide-react"

interface BookingInfoCardProps {
	bookings: AdminAppointment[]
}

export function BookingInfoCard({ bookings }: BookingInfoCardProps) {
	if (bookings.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">
				Nenhum agendamento para esta data.
			</p>
		)
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
						<div className="min-w-0">
							<p className="text-sm font-medium truncate">{b.customerName}</p>
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
					<Badge variant="outline" className="text-[10px] uppercase">
						{b.status}
					</Badge>
				</div>
			))}
		</div>
	)
}
