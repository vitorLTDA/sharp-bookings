import { useMemo, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import {
	getAdminSlotsForDate,
	blockSlots,
	unblockSlots,
	AvailabilitySlot,
} from "@/api/availability"
import { getAppointments, AdminAppointment } from "@/api/admin"
import { TimeSlotGrid } from "@/components/dashboard/availability/TimeSlotGrid"
import { BookingConflictModal } from "@/components/dashboard/availability/BookingConflictModal"
import { BookingInfoCard } from "@/components/dashboard/availability/BookingInfoCard"
import { WorkingHoursSection } from "@/components/dashboard/availability/WorkingHoursSection"
import { Lock, Unlock, X, CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AvailabilityPage() {
	const queryClient = useQueryClient()
	const { toast } = useToast()
	const [selectedDate, setSelectedDate] = useState<Date>(new Date())
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
	const [conflictOpen, setConflictOpen] = useState(false)

	const dateKey = format(selectedDate, "yyyy-MM-dd")

	const { data: slots = [], isLoading: slotsLoading } = useQuery({
		queryKey: ["admin-slots", dateKey],
		queryFn: () => getAdminSlotsForDate(dateKey),
	})

	const { data: bookings = [], isLoading: bookingsLoading } = useQuery({
		queryKey: ["admin-day-bookings", dateKey],
		queryFn: () =>
			getAppointments({ startDate: dateKey, endDate: dateKey }),
	})

	const bookingsBySlot = useMemo(() => {
		const map = new Map<string, AdminAppointment[]>()
		for (const b of bookings) {
			const list = map.get(b.slotId) ?? []
			list.push(b)
			map.set(b.slotId, list)
		}
		return map
	}, [bookings])

	const selectedSlots = useMemo(
		() => slots.filter(s => selectedIds.has(s.id)),
		[slots, selectedIds],
	)

	const blockable = selectedSlots.filter(s => s.status !== "BLOCKED")
	const unblockable = selectedSlots.filter(s => s.status === "BLOCKED")

	const conflicts = useMemo(
		() =>
			blockable
				.map(slot => ({
					slot,
					bookings: bookingsBySlot.get(slot.id) ?? [],
				}))
				.filter(c => c.bookings.length > 0),
		[blockable, bookingsBySlot],
	)

	const toggleSlot = (slot: AvailabilitySlot) => {
		setSelectedIds(prev => {
			const next = new Set(prev)
			if (next.has(slot.id)) next.delete(slot.id)
			else next.add(slot.id)
			return next
		})
	}

	const invalidate = () => {
		queryClient.invalidateQueries({ queryKey: ["admin-slots", dateKey] })
		queryClient.invalidateQueries({
			queryKey: ["admin-day-bookings", dateKey],
		})
	}

	const blockMutation = useMutation({
		mutationFn: (ids: string[]) => blockSlots(ids),
		onMutate: async ids => {
			await queryClient.cancelQueries({ queryKey: ["admin-slots", dateKey] })
			const prev = queryClient.getQueryData<AvailabilitySlot[]>([
				"admin-slots",
				dateKey,
			])
			queryClient.setQueryData<AvailabilitySlot[]>(
				["admin-slots", dateKey],
				old =>
					old?.map(s =>
						ids.includes(s.id) ? { ...s, status: "BLOCKED" } : s,
					) ?? [],
			)
			return { prev }
		},
		onError: (_err, _vars, ctx) => {
			if (ctx?.prev)
				queryClient.setQueryData(["admin-slots", dateKey], ctx.prev)
			toast({
				title: "Erro",
				description: "Não foi possível bloquear os horários.",
				variant: "destructive",
			})
		},
		onSuccess: () => {
			toast({
				title: "Horários bloqueados",
				description: "Os horários selecionados foram marcados como indisponíveis.",
			})
			setSelectedIds(new Set())
			setConflictOpen(false)
		},
		onSettled: invalidate,
	})

	const unblockMutation = useMutation({
		mutationFn: (ids: string[]) => unblockSlots(ids),
		onMutate: async ids => {
			await queryClient.cancelQueries({ queryKey: ["admin-slots", dateKey] })
			const prev = queryClient.getQueryData<AvailabilitySlot[]>([
				"admin-slots",
				dateKey,
			])
			queryClient.setQueryData<AvailabilitySlot[]>(
				["admin-slots", dateKey],
				old =>
					old?.map(s =>
						ids.includes(s.id) ? { ...s, status: "AVAILABLE" } : s,
					) ?? [],
			)
			return { prev }
		},
		onError: (_err, _vars, ctx) => {
			if (ctx?.prev)
				queryClient.setQueryData(["admin-slots", dateKey], ctx.prev)
			toast({
				title: "Erro",
				description: "Não foi possível desbloquear os horários.",
				variant: "destructive",
			})
		},
		onSuccess: () => {
			toast({
				title: "Horários liberados",
				description: "Os horários selecionados agora estão disponíveis.",
			})
			setSelectedIds(new Set())
		},
		onSettled: invalidate,
	})

	const handleBlock = () => {
		if (blockable.length === 0) return
		if (conflicts.length > 0) {
			setConflictOpen(true)
			return
		}
		blockMutation.mutate(blockable.map(s => s.id))
	}

	const handleUnblock = () => {
		if (unblockable.length === 0) return
		unblockMutation.mutate(unblockable.map(s => s.id))
	}

	const legendItems = [
		{ label: "Disponível", className: "bg-emerald-500/20 border-emerald-500/40" },
		{ label: "Bloqueado", className: "bg-muted border-muted-foreground/40" },
		{ label: "Reservado", className: "bg-accent/20 border-accent/40" },
		{ label: "Pendente", className: "bg-amber-500/20 border-amber-500/40" },
	]

	return (
		<div className="space-y-6">
			<div className="flex flex-wrap items-start justify-between gap-4">
				<div>
					<h2 className="text-2xl font-bold">Disponibilidade</h2>
					<p className="text-muted-foreground">
						Bloqueie datas e horários específicos da agenda.
					</p>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="outline"
						onClick={handleUnblock}
						disabled={
							unblockable.length === 0 || unblockMutation.isPending
						}
					>
						<Unlock className="mr-2 h-4 w-4" />
						Liberar ({unblockable.length})
					</Button>
					<Button
						onClick={handleBlock}
						disabled={blockable.length === 0 || blockMutation.isPending}
						className="bg-accent hover:bg-accent/80 text-accent-foreground"
					>
						<Lock className="mr-2 h-4 w-4" />
						Bloquear ({blockable.length})
					</Button>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-[320px_1fr]">
				<div className="space-y-4">
					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base flex items-center gap-2">
								<CalendarDays className="h-4 w-4 text-accent" />
								Selecione uma data
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Calendar
								mode="single"
								selected={selectedDate}
								onSelect={d => {
									if (d) {
										setSelectedDate(d)
										setSelectedIds(new Set())
									}
								}}
								locale={ptBR}
								className={cn("p-0 pointer-events-auto")}
							/>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="pb-3">
							<CardTitle className="text-base">Agendamentos do dia</CardTitle>
							<CardDescription>
								{bookings.length} no total
							</CardDescription>
						</CardHeader>
						<CardContent>
							{bookingsLoading ? (
								<div className="space-y-2">
									<Skeleton className="h-14 w-full" />
									<Skeleton className="h-14 w-full" />
								</div>
							) : (
								<BookingInfoCard bookings={bookings} />
							)}
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<div className="flex flex-wrap items-center justify-between gap-3">
							<div>
								<CardTitle className="capitalize">
									{format(selectedDate, "EEEE, d 'de' MMMM", {
										locale: ptBR,
									})}
								</CardTitle>
								<CardDescription>
									Clique nos horários para selecionar e depois bloqueie ou
									libere.
								</CardDescription>
							</div>
							{selectedIds.size > 0 && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => setSelectedIds(new Set())}
								>
									<X className="mr-1 h-3.5 w-3.5" />
									Limpar seleção
								</Button>
							)}
						</div>
						<Separator className="mt-3" />
						<div className="flex flex-wrap gap-3 pt-2">
							{legendItems.map(l => (
								<div
									key={l.label}
									className="flex items-center gap-1.5 text-xs text-muted-foreground"
								>
									<span
										className={cn("h-3 w-3 rounded-sm border", l.className)}
									/>
									{l.label}
								</div>
							))}
						</div>
					</CardHeader>
					<CardContent>
						{slotsLoading ? (
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
								{Array.from({ length: 12 }).map((_, i) => (
									<Skeleton key={i} className="h-20 w-full" />
								))}
							</div>
						) : (
							<TimeSlotGrid
								slots={slots}
								selectedIds={selectedIds}
								onToggle={toggleSlot}
							/>
						)}
					</CardContent>
				</Card>
			</div>

			<BookingConflictModal
				open={conflictOpen}
				onOpenChange={setConflictOpen}
				conflicts={conflicts}
				isPending={blockMutation.isPending}
				onConfirm={() => blockMutation.mutate(blockable.map(s => s.id))}
			/>
		</div>
	)
}
