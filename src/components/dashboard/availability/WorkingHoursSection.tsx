import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
	WorkingHours,
	getWorkingHours,
	updateWorkingHours,
	validateWorkingHours,
	computeAffectedBookings,
} from "@/api/workingHours";
import { AdminAppointment, getAppointments } from "@/api/admin";
import { WorkingHoursRow } from "./WorkingHoursRow";
import { WorkingHoursConflictModal } from "./WorkingHoursConflictModal";
import { Clock, Save, RotateCcw } from "lucide-react";

export function WorkingHoursSection() {
	const queryClient = useQueryClient();
	const { toast } = useToast();
	const [draft, setDraft] = useState<WorkingHours[] | null>(null);
	const [conflictOpen, setConflictOpen] = useState(false);

	const { data: saved, isLoading } = useQuery({
		queryKey: ["working-hours"],
		queryFn: getWorkingHours,
	});

	// Look ahead 60 days for potentially affected bookings
	const { data: upcoming = [] } = useQuery<AdminAppointment[]>({
		queryKey: ["upcoming-bookings-for-working-hours"],
		queryFn: () => {
			const today = new Date();
			const end = new Date();
			end.setDate(end.getDate() + 14);
			const fmt = (d: Date) => d.toISOString().slice(0, 10);
			return getAppointments({
				startDate: fmt(today),
				endDate: fmt(end),
			});
		},
	});

	useEffect(() => {
		if (saved && !draft) setDraft(saved);
	}, [saved, draft]);

	const current = useMemo(() => draft ?? saved ?? [], [draft, saved]);
	const errors = useMemo(() => validateWorkingHours(current), [current]);
	const hasErrors = Object.keys(errors).length > 0;
	const isDirty = useMemo(
		() => JSON.stringify(current) !== JSON.stringify(saved),
		[current, saved],
	);

	const affected = useMemo(
		() => computeAffectedBookings(current, upcoming),
		[current, upcoming],
	);

	const mutation = useMutation({
		mutationFn: (hours: WorkingHours[]) => updateWorkingHours(hours),
		onMutate: async hours => {
			await queryClient.cancelQueries({ queryKey: ["working-hours"] });
			const prev = queryClient.getQueryData<WorkingHours[]>(["working-hours"]);
			queryClient.setQueryData(["working-hours"], hours);
			return { prev };
		},
		onError: (_e, _v, ctx) => {
			if (ctx?.prev) queryClient.setQueryData(["working-hours"], ctx.prev);
			toast({
				title: "Erro ao salvar",
				description: "Não foi possível atualizar o horário de funcionamento.",
				variant: "destructive",
			});
		},
		onSuccess: () => {
			toast({
				title: "Horário salvo",
				description: "O horário de funcionamento foi atualizado.",
			});
			setConflictOpen(false);
			queryClient.invalidateQueries({ queryKey: ["admin-slots"] });
			queryClient.invalidateQueries({
				queryKey: ["upcoming-bookings-for-working-hours"],
			});
			queryClient.invalidateQueries({
				queryKey: ["working-hours"],
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["working-hours"] });
		},
	});

	const handleRowChange = (next: WorkingHours) => {
		setDraft(prev =>
			(prev ?? saved ?? []).map(h =>
				h.dayOfWeek === next.dayOfWeek ? next : h,
			),
		);
	};

	const handleSave = () => {
		if (hasErrors || !draft) return;
		if (affected.length > 0) {
			setConflictOpen(true);
			return;
		}
		mutation.mutate(draft);
	};

	const handleReset = () => {
		setDraft(saved ?? null);
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-wrap items-start justify-between gap-3">
					<div>
						<CardTitle className="flex items-center gap-2">
							<Clock className="h-5 w-5 text-accent" />
							Horário de funcionamento
						</CardTitle>
						<CardDescription>
							Configure os dias e horários em que a barbearia aceita
							agendamentos.
						</CardDescription>
					</div>
					<div className="flex gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleReset}
							disabled={!isDirty || mutation.isPending}
						>
							<RotateCcw className="mr-2 h-3.5 w-3.5" />
							Desfazer
						</Button>
						<Button
							size="sm"
							onClick={handleSave}
							disabled={!isDirty || hasErrors || mutation.isPending}
							className="bg-accent hover:bg-accent/80 text-accent-foreground"
						>
							<Save className="mr-2 h-3.5 w-3.5" />
							{mutation.isPending ? "Salvando..." : "Salvar"}
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="space-y-2">
						{Array.from({ length: 7 }).map((_, i) => (
							<Skeleton key={i} className="h-14 w-full" />
						))}
					</div>
				) : (
					<div className="space-y-2">
						{[1, 2, 3, 4, 5, 6, 0].map(day => {
							const item = current.find(h => h.dayOfWeek === day);
							if (!item) return null;
							return (
								<WorkingHoursRow
									key={day}
									value={item}
									error={errors[day]}
									onChange={handleRowChange}
								/>
							);
						})}
					</div>
				)}

				{hasErrors && (
					<p className="mt-3 text-sm text-destructive">
						Corrija os horários inválidos antes de salvar.
					</p>
				)}
				{!hasErrors && isDirty && affected.length > 0 && (
					<p className="mt-3 text-sm text-amber-600 dark:text-amber-400">
						{affected.length} agendamento(s) ficarão fora do novo horário.
					</p>
				)}
			</CardContent>

			<WorkingHoursConflictModal
				open={conflictOpen}
				onOpenChange={setConflictOpen}
				affected={affected}
				isPending={mutation.isPending}
				onConfirm={() => draft && mutation.mutate(draft)}
			/>
		</Card>
	);
}
