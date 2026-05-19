import { Conversation } from "@/api/conversations"
import { Bot, User, ArrowLeft } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

interface Props {
	conversation: Conversation
	onToggleTakeover: (enabled: boolean) => void
	isToggling: boolean
	onBack?: () => void
}

export function ConversationHeader({
	conversation,
	onToggleTakeover,
	isToggling,
	onBack,
}: Props) {
	const name = conversation.contactName || conversation.phoneNumber
	const initials = name
		.split(" ")
		.map(p => p[0])
		.slice(0, 2)
		.join("")
		.toUpperCase()

	return (
		<div className="flex items-center gap-3 px-4 py-3 border-b bg-background">
			{onBack && (
				<Button
					variant="ghost"
					size="icon"
					className="md:hidden h-8 w-8"
					onClick={onBack}
				>
					<ArrowLeft className="h-4 w-4" />
				</Button>
			)}
			<div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
				<span className="text-sm font-semibold text-accent">{initials}</span>
			</div>
			<div className="flex-1 min-w-0">
				<p className="font-semibold text-sm truncate">{name}</p>
				<p className="text-xs text-muted-foreground truncate">
					{conversation.phoneNumber}
					{conversation.lastSeenAt && (
						<>
							{" · last seen "}
							{formatDistanceToNow(new Date(conversation.lastSeenAt), {
								addSuffix: true,
							})}
						</>
					)}
				</p>
			</div>

			<div className="flex items-center gap-3">
				<div
					className={cn(
						"hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full",
						conversation.humanTakeover
							? "bg-amber-500/10 text-amber-700 dark:text-amber-400"
							: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
					)}
				>
					{conversation.humanTakeover ? (
						<>
							<User className="h-3 w-3" />
							Human Handling
						</>
					) : (
						<>
							<Bot className="h-3 w-3" />
							Bot Active
						</>
					)}
				</div>
				<label className="flex items-center gap-2 cursor-pointer">
					<span className="text-xs text-muted-foreground hidden md:inline">
						Takeover
					</span>
					<Switch
						checked={!!conversation.humanTakeover}
						onCheckedChange={onToggleTakeover}
						disabled={isToggling}
					/>
				</label>
			</div>
		</div>
	)
}
