import { format } from "date-fns";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { AdminAppointment } from "@/api/admin";
import { AlertTriangle, User, Phone, Calendar } from "lucide-react";

interface WorkingHoursConflictModalProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	affected: AdminAppointment[];
	onConfirm: () => void;
	isPending?: boolean;
}

export function WorkingHoursConflictModal({
	open,
	onOpenChange,
	affected,
	onConfirm,
	isPending,
}: WorkingHoursConflictModalProps) {
	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent className="max-w-lg">
				<AlertDialogHeader>
					<AlertDialogTitle className="flex items-center gap-2">
						<AlertTriangle className="h-5 w-5 text-amber-500" />
						Agendamentos fora do novo horário
					</AlertDialogTitle>
					<AlertDialogDescription>
						As novas horas de funcionamento afetam{" "}
						<strong>{affected.length}</strong> agendamento
						{affected.length > 1 ? "s" : ""} existente
						{affected.length > 1 ? "s" : ""}. Revise antes de salvar.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<div className="max-h-72 overflow-y-auto space-y-2 my-2">
					{affected.map(b => (
						<div
							key={b.id}
							className="rounded-lg border bg-muted/30 p-3 space-y-1.5 text-sm"
						>
							<div className="flex items-center justify-between">
								<div className="flex items-center gap-2 font-medium">
									<User className="h-3.5 w-3.5 text-muted-foreground" />
									{b.customerName}
								</div>
								<Badge variant="secondary" className="text-xs">
									{b.status}
								</Badge>
							</div>
							<div className="flex items-center gap-2 text-muted-foreground text-xs">
								<Calendar className="h-3 w-3" />
								{format(new Date(`${b.date}`), "dd/MM/yyyy 'às' HH:mm")}
							</div>
							{b.customerPhone && (
								<div className="flex items-center gap-2 text-muted-foreground text-xs">
									<Phone className="h-3 w-3" />
									{b.customerPhone}
								</div>
							)}
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
						{isPending ? "Salvando..." : "Salvar mesmo assim"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
