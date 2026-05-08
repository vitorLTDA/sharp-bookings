import { StatusBadge } from "./StatusBadge"
import { Button } from "@/components/ui/button"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog"
import { MessageCircle, Phone, Mail, Calendar, Clock, User } from "lucide-react"
import { format } from "date-fns"
import { DashboardAppointment } from "@/lib/mockDashboardData"

interface AppointmentDetailModalProps {
	appointment: DashboardAppointment | null
	open: boolean
	onOpenChange: (open: boolean) => void
	onSendWhatsApp: (appointment: DashboardAppointment) => void
}

export function AppointmentDetailModal({
	appointment,
	open,
	onOpenChange,
	onSendWhatsApp,
}: AppointmentDetailModalProps) {
	if (!appointment) return null

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Detalhes do Agendamento</DialogTitle>
					<DialogDescription>Agendamento #{appointment.id}</DialogDescription>
				</DialogHeader>

				<div className="space-y-4 py-4">
					<div className="flex items-center justify-between">
						<span className="text-sm text-muted-foreground">Status</span>
						<StatusBadge status={appointment.status} />
					</div>

					<div className="space-y-3">
						<h4 className="text-sm font-medium">Informações do Cliente</h4>
						<div className="space-y-2 text-sm">
							<div className="flex items-center gap-2">
								<User className="h-4 w-4 text-muted-foreground" />
								<span>{appointment.customerName}</span>
							</div>
							<div className="flex items-center gap-2">
								<Mail className="h-4 w-4 text-muted-foreground" />
								<span>{appointment.customerEmail}</span>
							</div>
							<div className="flex items-center gap-2">
								<Phone className="h-4 w-4 text-muted-foreground" />
								<span>{appointment.customerPhone}</span>
							</div>
						</div>
					</div>

					<div className="space-y-3">
						<h4 className="text-sm font-medium">Detalhes do Agendamento</h4>
						<div className="space-y-2 text-sm">
							{/* <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>Barber: {appointment.barberName}</span>
              </div> */}
							<div className="flex items-center gap-2">
								<Calendar className="h-4 w-4 text-muted-foreground" />
								<span>
									{format(new Date(appointment.date), "EEEE, MMMM d, yyyy")}
								</span>
							</div>
							<div className="flex items-center gap-2">
								<Clock className="h-4 w-4 text-muted-foreground" />
								<span>{appointment.time}</span>
							</div>
						</div>
					</div>
				</div>

				<DialogFooter className="gap-2 sm:gap-0">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Fechar
					</Button>
					<Button
						className="bg-success text-success-foreground hover:bg-success/90"
						onClick={() => {
							onSendWhatsApp(appointment)
							onOpenChange(false)
						}}
					>
						<MessageCircle className="mr-2 h-4 w-4" />
						Enviar WhatsApp
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	)
}
