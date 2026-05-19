import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
	Conversation,
	ConversationFilters,
	getConversations,
} from "@/api/conversations"
import { ConversationList } from "@/components/dashboard/conversations/ConversationList"
import { ChatWindow } from "@/components/dashboard/conversations/ChatWindow"
import { cn } from "@/lib/utils"

export default function ConversationsPage() {
	const [filters, setFilters] = useState<ConversationFilters>({ status: "all" })
	const [activeId, setActiveId] = useState<string | undefined>()

	const { data: conversations, isLoading } = useQuery({
		queryKey: ["conversations", filters],
		queryFn: () => getConversations(filters),
		refetchInterval: 15000,
	})

	const active = conversations?.find(c => c.id === activeId)

	return (
		<div className="-m-6 h-[calc(100vh-3.5rem)] flex bg-background">
			<aside
				className={cn(
					"w-full md:w-80 lg:w-96 border-r flex-shrink-0",
					active && "hidden md:flex md:flex-col",
					!active && "flex flex-col",
				)}
			>
				<ConversationList
					conversations={conversations}
					isLoading={isLoading}
					activeId={activeId}
					onSelect={(c: Conversation) => setActiveId(c.id)}
					filters={filters}
					onFiltersChange={setFilters}
				/>
			</aside>
			<section
				className={cn(
					"flex-1 min-w-0",
					active ? "flex flex-col" : "hidden md:flex md:flex-col",
				)}
			>
				<ChatWindow
					conversation={active}
					onBack={() => setActiveId(undefined)}
				/>
			</section>
		</div>
	)
}
