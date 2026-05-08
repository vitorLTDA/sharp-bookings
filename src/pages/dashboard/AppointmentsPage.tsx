import { useState } from "react"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { format } from "date-fns"
import { AppointmentsTable } from "@/components/dashboard/AppointmentsTable"
import { AppointmentDetailModal } from "@/components/dashboard/AppointmentDetailModal"
import { AdminBookingModal } from "@/components/dashboard/AdminBookingModal"
import { DateRangeFilter } from "@/components/dashboard/DateRangeFilter"
import { EmptyState } from "@/components/EmptyState"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"
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
import {
	getAppointments,
	sendWhatsAppNotification,
	cancelAppointment,
} from "@/api/admin"
import { AdminAppointment } from "@/api/admin"
import { Plus, Calendar, MessageCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Skeleton } from "@/components/ui/skeleton"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { DashboardAppointment } from "@/lib/mockDashboardData"

export default function AppointmentsPage() {
	const queryClient = useQueryClient()
	const [statusFilter, setStatusFilter] = useState<string>("all")
	const [dateFrom, setDateFrom] = useState<Date | undefined>()
	const [dateTo, setDateTo] = useState<Date | undefined>()
	const [selectedAppointment, setSelectedAppointment] =
		useState<AdminAppointment | null>(null)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
	const [cancelTarget, setCancelTarget] = useState<AdminAppointment | null>(
		null,
	)
	const { toast } = useToast()

	const { mutate: cancelMutate, isPending: isCanceling } = useMutation({
		mutationFn: (slotId: string) => cancelAppointment(slotId),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["appointments"] })
			toast({
				title: "Agendamento Cancelado",
				description: "O agendamento foi cancelado com sucesso.",
			})
			setCancelTarget(null)
		},
		onError: (error: any) => {
			toast({
				title: "Erro",
				description:
					error.response?.data?.error || "Falha ao cancelar agendamento",
				variant: "destructive",
			})
		},
	})

	const { data: appointments, isLoading } = useQuery({
		queryKey: ["appointments", statusFilter, dateFrom, dateTo],
		queryFn: () =>
			getAppointments({
				status: statusFilter === "all" ? undefined : statusFilter.toUpperCase(),
				startDate: dateFrom ? format(dateFrom, "yyyy-MM-dd") : undefined,
				endDate: dateTo ? format(dateTo, "yyyy-MM-dd") : undefined,
			}),
	})

	const handleViewDetails = (appointment: DashboardAppointment) => {
		setSelectedAppointment(appointment)
		setIsModalOpen(true)
	}

	const handleSendWhatsApp = async (appointment: AdminAppointment) => {
		const result = await sendWhatsAppNotification("single", {
			appointmentId: appointment.id,
		})
		toast({
			title: "Notificação Enviada",
			description: result.message,
		})
	}

	const handleCancelAppointment = (appointment: AdminAppointment) => {
		setCancelTarget(appointment)
	}

	const handleNotifyDay = async () => {
		if (!dateFrom) {
			toast({
				title: "Selecione uma data",
				description:
					"Por favor, selecione uma data para notificar todos os clientes desse dia.",
				variant: "destructive",
			})
			return
		}

		const result = await sendWhatsAppNotification("day", {
			date: format(dateFrom, "yyyy-MM-dd"),
		})
		toast({
			title: "Notificações Enviadas",
			description: result.message,
		})
	}

	return (
		<div className="space-y-6">
			<div className="md:flex items-center justify-between">
				<div>
					<h2 className="text-2xl font-bold">Agendamentos</h2>
					<p className="text-muted-foreground">
						Gerencie seus agendamentos e envie notificações.
					</p>
				</div>
				<div className="flex gap-2">
					<Button
						className="bg-accent hover:bg-accent/50"
						onClick={() => setIsBookingModalOpen(true)}
					>
						<Plus className="mr-2 h-4 w-4" />
						Adicionar Agendamento
					</Button>
					<Button onClick={handleNotifyDay} variant="outline">
						<MessageCircle className="mr-2 h-4 w-4" />
						Notificar Dia
					</Button>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-4">
				<Select value={statusFilter} onValueChange={v => setStatusFilter(v)}>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">Todos os Status</SelectItem>
						<SelectItem value="BOOKED">Pago</SelectItem>
						<SelectItem value="RESERVED">Não Pago</SelectItem>
						<SelectItem value="CANCELED">Cancelado</SelectItem>
					</SelectContent>
				</Select>

				<DateRangeFilter
					dateFrom={dateFrom}
					dateTo={dateTo}
					onDateFromChange={setDateFrom}
					onDateToChange={setDateTo}
				/>
			</div>

			{/* Table */}
			{isLoading ? (
				<div className="space-y-3">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="h-16 w-full" />
					))}
				</div>
			) : appointments.length === 0 ? (
				<EmptyState
					icon={Calendar}
					title="Nenhum agendamento encontrado"
					description="Tente ajustar seus filtros ou volte mais tarde."
				/>
			) : (
				<AppointmentsTable
					appointments={appointments}
					onViewDetails={handleViewDetails}
					onSendWhatsApp={handleSendWhatsApp}
					onCancelAppointment={handleCancelAppointment}
				/>
			)}

			<AppointmentDetailModal
				appointment={selectedAppointment}
				open={isModalOpen}
				onOpenChange={setIsModalOpen}
				onSendWhatsApp={handleSendWhatsApp}
			/>

			<AdminBookingModal
				open={isBookingModalOpen}
				onOpenChange={setIsBookingModalOpen}
				onSuccess={() => {
					queryClient.invalidateQueries({ queryKey: ["appointments"] })
					setIsBookingModalOpen(false)
				}}
			/>

			<AlertDialog
				open={!!cancelTarget}
				onOpenChange={() => setCancelTarget(null)}
			>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Cancelar Agendamento</AlertDialogTitle>
						<AlertDialogDescription>
							Tem certeza que deseja cancelar este agendamento de{" "}
							{cancelTarget?.customerName} em{" "}
							{cancelTarget && format(new Date(cancelTarget.date), "MMM d")} às{" "}
							{cancelTarget?.time}?
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Voltar</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => cancelMutate(cancelTarget!.slotId)}
							disabled={isCanceling}
							className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
						>
							{isCanceling ? (
								<LoadingSpinner size="sm" />
							) : (
								"Cancelar Agendamento"
							)}
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	)
}
