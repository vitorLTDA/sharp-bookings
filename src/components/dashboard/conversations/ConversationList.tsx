import { useState } from "react"
import { Conversation, ConversationFilters } from "@/api/conversations"
import { ConversationItem } from "./ConversationItem"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState } from "@/components/EmptyState"
import { Search, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
	conversations: Conversation[] | undefined
	isLoading: boolean
	activeId?: string
	onSelect: (c: Conversation) => void
	filters: ConversationFilters
	onFiltersChange: (f: ConversationFilters) => void
}

const FILTERS: { key: NonNullable<ConversationFilters["status"]>; label: string }[] = [
	{ key: "all", label: "All" },
	{ key: "unread", label: "Unread" },
	{ key: "open", label: "Open" },
	{ key: "bot", label: "Bot" },
	{ key: "human", label: "Human" },
]

export function ConversationList({
	conversations,
	isLoading,
	activeId,
	onSelect,
	filters,
	onFiltersChange,
}: Props) {
	const [search, setSearch] = useState(filters.search || "")

	return (
		<div className="flex flex-col h-full bg-background">
			<div className="p-3 border-b space-y-3">
				<div className="relative">
					<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						value={search}
						onChange={e => {
							setSearch(e.target.value)
							onFiltersChange({ ...filters, search: e.target.value })
						}}
						placeholder="Search conversations..."
						className="pl-8 h-9"
					/>
				</div>
				<div className="flex gap-1.5 overflow-x-auto -mx-1 px-1 pb-1">
					{FILTERS.map(f => (
						<button
							key={f.key}
							onClick={() => onFiltersChange({ ...filters, status: f.key })}
							className={cn(
								"text-xs px-2.5 py-1 rounded-full border whitespace-nowrap transition-colors",
								(filters.status || "all") === f.key
									? "bg-accent text-accent-foreground border-accent"
									: "bg-background text-muted-foreground hover:bg-muted",
							)}
						>
							{f.label}
						</button>
					))}
				</div>
			</div>

			<ScrollArea className="flex-1">
				{isLoading ? (
					<div className="p-3 space-y-3">
						{Array.from({ length: 6 }).map((_, i) => (
							<div key={i} className="flex gap-3">
								<Skeleton className="h-10 w-10 rounded-full" />
								<div className="flex-1 space-y-2">
									<Skeleton className="h-3 w-3/4" />
									<Skeleton className="h-3 w-1/2" />
								</div>
							</div>
						))}
					</div>
				) : !conversations || conversations.length === 0 ? (
					<EmptyState
						icon={MessageSquare}
						title="No conversations"
						description="When customers message your WhatsApp, they'll appear here."
					/>
				) : (
					conversations.map(c => (
						<ConversationItem
							key={c.id}
							conversation={c}
							active={c.id === activeId}
							onClick={() => onSelect(c)}
						/>
					))
				)}
			</ScrollArea>
		</div>
	)
}
