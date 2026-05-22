import { Switch } from "@/components/ui/switch"
import { WorkingHours } from "@/api/workingHours"
import { TimeRangePicker } from "./TimeRangePicker"
import { cn } from "@/lib/utils"

const DAY_NAMES = [
	"Domingo",
	"Segunda",
	"Terça",
	"Quarta",
	"Quinta",
	"Sexta",
	"Sábado",
]

interface WorkingHoursRowProps {
	value: WorkingHours
	error?: string
	onChange: (next: WorkingHours) => void
}

export function WorkingHoursRow({
	value,
	error,
	onChange,
}: WorkingHoursRowProps) {
	return (
		<div
			className={cn(
				"flex flex-wrap items-center gap-3 sm:gap-4 py-3 px-3 rounded-md border bg-card transition-colors",
				!value.enabled && "bg-muted/30",
			)}
		>
			<div className="flex items-center gap-3 min-w-[140px]">
				<Switch
					checked={value.enabled}
					onCheckedChange={enabled => onChange({ ...value, enabled })}
					aria-label={`Ativar ${DAY_NAMES[value.dayOfWeek]}`}
				/>
				<span
					className={cn(
						"font-medium text-sm",
						!value.enabled && "text-muted-foreground",
					)}
				>
					{DAY_NAMES[value.dayOfWeek]}
				</span>
			</div>

			<div className="flex-1 flex flex-wrap items-center gap-3">
				{value.enabled ? (
					<>
						<TimeRangePicker
							open={value.openTime}
							close={value.closeTime}
							onOpenChange={openTime => onChange({ ...value, openTime })}
							onCloseChange={closeTime => onChange({ ...value, closeTime })}
							error={!!error}
						/>
						{error && (
							<span className="text-xs text-destructive">{error}</span>
						)}
					</>
				) : (
					<span className="text-sm text-muted-foreground italic">Fechado</span>
				)}
			</div>
		</div>
	)
}
