import { Message } from "@/api/conversations"
import { cn } from "@/lib/utils"
import { Bot, Check, CheckCheck, Clock } from "lucide-react"
import { format } from "date-fns"

interface Props {
	message: Message
}

export function MessageBubble({ message }: Props) {
	const isOutgoing = message.direction === "outgoing"
	const isBot = message.senderType === "bot"
	const isAdmin = message.senderType === "admin"

	return (
		<div
			className={cn(
				"flex w-full mb-2",
				isOutgoing ? "justify-end" : "justify-start",
			)}
		>
			<div
				className={cn(
					"max-w-[75%] rounded-2xl px-3.5 py-2 shadow-sm",
					isOutgoing
						? isBot
							? "bg-blue-500 text-white rounded-br-sm"
							: "bg-emerald-600 text-white rounded-br-sm"
						: "bg-background border rounded-bl-sm",
				)}
			>
				{isOutgoing && (
					<div className="flex items-center gap-1 text-[10px] opacity-80 mb-0.5">
						{isBot ? (
							<>
								<Bot className="h-3 w-3" />
								<span>Bot</span>
							</>
						) : (
							<span>{isAdmin ? "You" : "Admin"}</span>
						)}
					</div>
				)}
				<p className="text-sm whitespace-pre-wrap break-words">
					{message.content}
				</p>
				<div
					className={cn(
						"flex items-center justify-end gap-1 mt-1 text-[10px]",
						isOutgoing ? "text-white/80" : "text-muted-foreground",
					)}
				>
					<span>{format(new Date(message.createdAt), "HH:mm")}</span>
					{isOutgoing && message.status && (
						<>
							{message.status === "read" && <CheckCheck className="h-3 w-3" />}
							{message.status === "delivered" && (
								<CheckCheck className="h-3 w-3 opacity-70" />
							)}
							{message.status === "sent" && <Check className="h-3 w-3" />}
							{message.status === "failed" && (
								<Clock className="h-3 w-3 text-red-300" />
							)}
						</>
					)}
				</div>
			</div>
		</div>
	)
}
