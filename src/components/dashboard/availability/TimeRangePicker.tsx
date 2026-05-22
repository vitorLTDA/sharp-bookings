import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface TimeRangePickerProps {
	open: string
	close: string
	onOpenChange: (value: string) => void
	onCloseChange: (value: string) => void
	disabled?: boolean
	error?: boolean
}

export function TimeRangePicker({
	open,
	close,
	onOpenChange,
	onCloseChange,
	disabled,
	error,
}: TimeRangePickerProps) {
	return (
		<div className="flex items-center gap-2">
			<Input
				type="time"
				value={open}
				disabled={disabled}
				onChange={e => onOpenChange(e.target.value)}
				className={cn(
					"w-[110px] h-9",
					error && "border-destructive focus-visible:ring-destructive",
				)}
				step={1800}
			/>
			<span className="text-muted-foreground text-sm">→</span>
			<Input
				type="time"
				value={close}
				disabled={disabled}
				onChange={e => onCloseChange(e.target.value)}
				className={cn(
					"w-[110px] h-9",
					error && "border-destructive focus-visible:ring-destructive",
				)}
				step={1800}
			/>
		</div>
	)
}
