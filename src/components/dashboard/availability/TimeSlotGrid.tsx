import { AvailabilitySlot } from "@/api/availability"
import { TimeSlotCard } from "./TimeSlotCard"
import { EmptyState } from "@/components/EmptyState"
import { CalendarX } from "lucide-react"

interface TimeSlotGridProps {
	slots: AvailabilitySlot[]
	selectedIds: Set<string>
	onToggle: (slot: AvailabilitySlot) => void
}

export function TimeSlotGrid({
	slots,
	selectedIds,
	onToggle,
}: TimeSlotGridProps) {
	if (slots.length === 0) {
		return (
			<EmptyState
				icon={CalendarX}
				title="Nenhum horário"
				description="Não há horários configurados para esta data."
			/>
		)
	}

	return (
		<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
			{slots.map(slot => (
				<TimeSlotCard
					key={slot.id}
					slot={slot}
					selected={selectedIds.has(slot.id)}
					onClick={() => onToggle(slot)}
				/>
			))}
		</div>
	)
}
