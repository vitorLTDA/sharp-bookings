import { Conversation } from "@/api/conversations"
import { cn } from "@/lib/utils"
import { Bot, User } from "lucide-react"
import { formatDistanceToNowStrict } from "date-fns"

interface Props {
	conversation: Conversation
	active: boolean
	onClick: () => void
}

export function ConversationItem({ conversation, active, onClick }: Props) {
	const name = conversation.contactName || conversation.phoneNumber
	const initials = name
		.split(" ")
		.map(p => p[0])
		.slice(0, 2)
		.join("")
		.toUpperCase()
	const unread = conversation.unreadCount && conversation.unreadCount > 0

	return (
		<button
			onClick={onClick}
			className={cn(
				"w-full flex items-start gap-3 px-4 py-3 border-b text-left transition-colors hover:bg-muted/50",
				active && "bg-muted",
			)}
		>
			<div className="relative shrink-0">
				<div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center">
					<span className="text-sm font-semibold text-accent">{initials}</span>
				</div>
				<div
					className={cn(
						"absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background flex items-center justify-center",
						conversation.humanTakeover ? "bg-amber-500" : "bg-emerald-500",
					)}
					title={conversation.humanTakeover ? "Human Handling" : "Bot Active"}
				>
					{conversation.humanTakeover ? (
						<User className="h-2.5 w-2.5 text-white" />
					) : (
						<Bot className="h-2.5 w-2.5 text-white" />
					)}
				</div>
			</div>

			<div className="flex-1 min-w-0">
				<div className="flex items-center justify-between gap-2">
					<p className="font-medium text-sm truncate">{name}</p>
					{conversation.lastMessageAt && (
						<span className="text-[10px] text-muted-foreground shrink-0">
							{formatDistanceToNowStrict(new Date(conversation.lastMessageAt), {
								addSuffix: false,
							})}
						</span>
					)}
				</div>
				<div className="flex items-center justify-between gap-2 mt-0.5">
					<p
						className={cn(
							"text-xs truncate",
							unread
								? "text-foreground font-medium"
								: "text-muted-foreground",
						)}
					>
						{conversation.lastMessage || "No messages yet"}
					</p>
					{unread ? (
						<span className="shrink-0 min-w-[18px] h-[18px] px-1 rounded-full bg-accent text-accent-foreground text-[10px] font-semibold flex items-center justify-center">
							{conversation.unreadCount}
						</span>
					) : null}
				</div>
				<p className="text-[10px] text-muted-foreground mt-0.5 truncate">
					{conversation.phoneNumber}
				</p>
			</div>
		</button>
	)
}
