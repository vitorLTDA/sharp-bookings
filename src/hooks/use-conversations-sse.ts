import { useEffect, useRef } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { Conversation, Message } from "@/api/conversations"

interface SSEEvent {
	type: string
	data: {
		conversationId?: string
		message?: Message
		conversation?: Conversation
		timestamp?: number
		clientId?: string
	}
}

export function useConversationsSSE() {
	const queryClient = useQueryClient()
	const eventSourceRef = useRef<EventSource | null>(null)

	useEffect(() => {
		const apiBase = import.meta.env.VITE_API_URL
		const url = `${apiBase}/conversations/stream`

		const es = new EventSource(url, { withCredentials: true })
		eventSourceRef.current = es

		es.addEventListener("message", (e: MessageEvent) => {
			try {
				const event: SSEEvent = JSON.parse(e.data)

				switch (event.type) {
					case "new-message":
						if (event.data.conversationId && event.data.message) {
							queryClient.setQueryData<Message[]>(
								["conversation-messages", event.data.conversationId],
								old => {
									if (!old) return old
									const exists = old.some(m => m.id === event.data.message!.id)
									if (exists) return old
									return [...old, event.data.message as Message]
								},
							)
						}
						queryClient.invalidateQueries({ queryKey: ["conversations"] })
						break

					case "takeover-updated":
						if (event.data.conversation) {
							queryClient.setQueryData<Conversation[]>(
								["conversations"],
								old =>
									old?.map(c =>
										c.id === event.data.conversation!.id
											? (event.data.conversation as Conversation)
											: c,
									),
							)
						}
						break

					case "read-updated":
						if (event.data.conversation) {
							queryClient.setQueryData<Conversation[]>(
								["conversations"],
								old =>
									old?.map(c =>
										c.id === event.data.conversation!.id
											? (event.data.conversation as Conversation)
											: c,
									),
							)
						}
						break
				}
			} catch {
				// ignore parse errors
			}
		})

		es.onerror = () => {
			es.close()
			// EventSource auto-reconnects, but we reset after a delay
			setTimeout(() => {
				if (eventSourceRef.current?.readyState === EventSource.CLOSED) {
					// browser will reconnect automatically
				}
			}, 3000)
		}

		return () => {
			es.close()
			eventSourceRef.current = null
		}
	}, [queryClient])
}
