import { format } from "date-fns"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { AdminAppointment } from "@/api/admin"
import { AvailabilitySlot } from "@/api/availability"
import { AlertTriangle, Phone, User } from "lucide-react"

interface BookingConflictModalProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	conflicts: { slot: AvailabilitySlot; bookings: AdminAppointment[] }[]
	onConfirm: () => void
	isPending?: boolean
}

export function BookingConflictModal({
	open,
	onOpenChange,
	conflicts,
	onConfirm,
	isPending,
}: BookingConflictModalProps) {
	const total = conflicts.reduce((sum, c) => sum + c.bookings.length, 0)

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="max-w-lg">
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-amber-500" />
						Conflito de agendamentos
					</AlertDialogTitle>
					<AlertDialogDescription>
						Você está prestes a bloquear horários que possuem{" "}
						<strong>{total}</strong> agendamento{total > 1 ? "s" : ""} ativo
						{total > 1 ? "s" : ""}. Os clientes abaixo serão afetados.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="max-h-72 overflow-y-auto space-y-3 my-2">
					{conflicts.map(({ slot, bookings }) => (
						<div
							key={slot.id}
							className="rounded-lg border bg-muted/30 p-3 space-y-2"
						>
							<div className="flex items-center justify-between">
								<span className="font-medium text-sm">
									{format(new Date(slot.startDateTime), "HH:mm")} —{" "}
									{format(new Date(slot.endDateTime), "HH:mm")}
								</span>
								<Badge variant="secondary">
									{bookings.length} cliente{bookings.length > 1 ? "s" : ""}
								</Badge>
							</div>
							{bookings.map(b => (
								<div
									key={b.id}
									className="flex items-center justify-between text-sm border-t pt-2"
								>
									<div className="flex items-center gap-2">
										<User className="h-3.5 w-3.5 text-muted-foreground" />
										<span>{b.customerName}</span>
									</div>
									{b.customerPhone && (
										<div className="flex items-center gap-1.5 text-muted-foreground text-xs">
											<Phone className="h-3 w-3" />
											{b.customerPhone}
										</div>
									)}
								</div>
							))}
						</div>
					))}
				</div>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isPending}>Voltar</AlertDialogCancel>
					<AlertDialogAction
						onClick={onConfirm}
						disabled={isPending}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{isPending ? "Bloqueando..." : "Bloquear mesmo assim"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}
