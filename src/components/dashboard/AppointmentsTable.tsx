import { AdminAppointment } from "@/api/admin"
import { StatusBadge } from "./StatusBadge"
import { Button } from "@/components/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { MessageCircle, Eye, X } from "lucide-react"
import { format } from "date-fns"

interface AppointmentsTableProps {
	appointments: AdminAppointment[]
	onViewDetails: (appointment: AdminAppointment) => void
	onSendWhatsApp: (appointment: AdminAppointment) => void
	onCancelAppointment?: (appointment: AdminAppointment) => void
}

export function AppointmentsTable({
	appointments,
	onViewDetails,
	onSendWhatsApp,
	onCancelAppointment,
}: AppointmentsTableProps) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Cliente</TableHead>
						{/* <TableHead>Barber</TableHead> */}
						<TableHead>Data</TableHead>
						<TableHead>Horário</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right">Ações</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{appointments.map(appointment => (
						<TableRow key={appointment.id}>
							<TableCell>
								<div>
									<p className="font-medium">{appointment.customerName}</p>
									<p className="text-xs text-muted-foreground">
										{appointment.customerPhone}
									</p>
								</div>
							</TableCell>
							{/* 	<TableCell>{appointment.barberName}</TableCell> */}
							<TableCell>
								{new Date(appointment.date).toLocaleDateString("pt-BR", {
									day: "numeric",
									month: "long",
								})}
							</TableCell>
							<TableCell>{appointment.time}</TableCell>
							<TableCell>
								<StatusBadge status={appointment.status} />
							</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end gap-1">
									<Button
										variant="ghost"
										size="icon"
										onClick={() => onViewDetails(appointment)}
										title="Ver detalhes"
									>
										<Eye className="h-4 w-4" />
									</Button>
									<Button
										variant="ghost"
										size="icon"
										onClick={() => onSendWhatsApp(appointment)}
										title="Enviar WhatsApp"
										className="text-success hover:text-success"
									>
										<MessageCircle className="h-4 w-4" />
									</Button>
									{appointment.status !== "CANCELED" && onCancelAppointment && (
										<Button
											variant="ghost"
											size="icon"
											onClick={() => onCancelAppointment(appointment)}
											title="Cancelar agendamento"
											className="text-destructive hover:text-destructive"
										>
											<X className="h-4 w-4" />
										</Button>
									)}
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}
