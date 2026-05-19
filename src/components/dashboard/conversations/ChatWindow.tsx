import { useEffect, useRef } from "react"
import {
	useMutation,
	useQuery,
	useQueryClient,
} from "@tanstack/react-query"
import {
	Conversation,
	Message,
	getMessages,
	sendMessage,
	setHumanTakeover,
	markAsRead,
} from "@/api/conversations"
import { ConversationHeader } from "./ConversationHeader"
import { MessageBubble } from "./MessageBubble"
import { MessageInput } from "./MessageInput"
import { EmptyState } from "@/components/EmptyState"
import { Skeleton } from "@/components/ui/skeleton"
import { MessageSquare, AlertCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { format, isSameDay } from "date-fns"

interface Props {
	conversation?: Conversation
	onBack?: () => void
}

export function ChatWindow({ conversation, onBack }: Props) {
	const queryClient = useQueryClient()
	const { toast } = useToast()
	const scrollRef = useRef<HTMLDivElement>(null)

	const conversationId = conversation?.id

	const {
		data: messages,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["conversation-messages", conversationId],
		queryFn: () => getMessages(conversationId!),
		enabled: !!conversationId,
		refetchInterval: 10000,
	})

	useEffect(() => {
		if (conversationId && conversation?.unreadCount) {
			markAsRead(conversationId).then(() => {
				queryClient.invalidateQueries({ queryKey: ["conversations"] })
			})
		}
	}, [conversationId, conversation?.unreadCount, queryClient])

	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight
		}
	}, [messages])

	const sendMutation = useMutation({
		mutationFn: (content: string) => sendMessage(conversationId!, content),
		onMutate: async content => {
			await queryClient.cancelQueries({
				queryKey: ["conversation-messages", conversationId],
			})
			const previous = queryClient.getQueryData<Message[]>([
				"conversation-messages",
				conversationId,
			])
			const optimistic: Message = {
				id: `optimistic-${Date.now()}`,
				conversationId: conversationId!,
				direction: "outgoing",
				senderType: "admin",
				content,
				createdAt: new Date().toISOString(),
				status: "sent",
			}
			queryClient.setQueryData<Message[]>(
				["conversation-messages", conversationId],
				old => [...(old || []), optimistic],
			)
			return { previous }
		},
		onError: (_err, _content, ctx) => {
			if (ctx?.previous) {
				queryClient.setQueryData(
					["conversation-messages", conversationId],
					ctx.previous,
				)
			}
			toast({
				title: "Failed to send",
				description: "Your message could not be delivered.",
				variant: "destructive",
			})
		},
		onSettled: () => {
			queryClient.invalidateQueries({
				queryKey: ["conversation-messages", conversationId],
			})
			queryClient.invalidateQueries({ queryKey: ["conversations"] })
		},
	})

	const takeoverMutation = useMutation({
		mutationFn: (enabled: boolean) =>
			setHumanTakeover(conversationId!, enabled),
		onMutate: async enabled => {
			await queryClient.cancelQueries({ queryKey: ["conversations"] })
			const previous = queryClient.getQueryData<Conversation[]>([
				"conversations",
			])
			queryClient.setQueryData<Conversation[]>(["conversations"], old =>
				old?.map(c =>
					c.id === conversationId ? { ...c, humanTakeover: enabled } : c,
				),
			)
			return { previous }
		},
		onError: (_err, _enabled, ctx) => {
			if (ctx?.previous) {
				queryClient.setQueryData(["conversations"], ctx.previous)
			}
			toast({
				title: "Failed to update",
				description: "Could not toggle human takeover.",
				variant: "destructive",
			})
		},
		onSuccess: enabled => {
			toast({
				title: enabled ? "Human Takeover On" : "Bot Resumed",
				description: enabled
					? "The bot will no longer reply to this conversation."
					: "The bot will resume automatic replies.",
			})
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["conversations"] })
		},
	})

	if (!conversation) {
		return (
			<div className="hidden md:flex flex-col items-center justify-center h-full bg-muted/20">
				<EmptyState
					icon={MessageSquare}
					title="Select a conversation"
					description="Choose a conversation from the list to start chatting."
				/>
			</div>
		)
	}

	return (
		<div className="flex flex-col h-full bg-muted/20">
			<ConversationHeader
				conversation={conversation}
				onToggleTakeover={enabled => takeoverMutation.mutate(enabled)}
				isToggling={takeoverMutation.isPending}
				onBack={onBack}
			/>

			<ScrollArea className="flex-1">
				<div ref={scrollRef} className="p-4 max-w-3xl mx-auto w-full">
					{isLoading ? (
						<div className="space-y-3">
							{Array.from({ length: 5 }).map((_, i) => (
								<div
									key={i}
									className={i % 2 === 0 ? "flex justify-start" : "flex justify-end"}
								>
									<Skeleton className="h-12 w-2/3 rounded-2xl" />
								</div>
							))}
						</div>
					) : isError ? (
						<EmptyState
							icon={AlertCircle}
							title="Couldn't load messages"
							description="Please try again."
						/>
					) : !messages || messages.length === 0 ? (
						<EmptyState
							icon={MessageSquare}
							title="No messages yet"
							description="Send the first message to start the conversation."
						/>
					) : (
						messages.map((m, i) => {
							const prev = messages[i - 1]
							const showDate =
								!prev || !isSameDay(new Date(prev.createdAt), new Date(m.createdAt))
							return (
								<div key={m.id}>
									{showDate && (
										<div className="flex justify-center my-3">
											<span className="text-[10px] uppercase tracking-wide px-2 py-1 rounded-full bg-background border text-muted-foreground">
												{format(new Date(m.createdAt), "MMM d, yyyy")}
											</span>
										</div>
									)}
									<MessageBubble message={m} />
								</div>
							)
						})
					)}
				</div>
			</ScrollArea>

			<MessageInput
				onSend={content => sendMutation.mutate(content)}
				isSending={sendMutation.isPending}
				disabled={!conversation.humanTakeover && false}
			/>
		</div>
	)
}
