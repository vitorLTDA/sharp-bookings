import { api } from "./client"

export interface Conversation {
	id: string
	contactName?: string
	phoneNumber: string
	lastMessage?: string
	lastMessageAt?: string
	unreadCount?: number
	humanTakeover?: boolean
	status?: "open" | "closed"
	assignedTo?: string | null
	lastSeenAt?: string
}

export interface Message {
	id: string
	conversationId: string
	direction: "incoming" | "outgoing"
	senderType: "user" | "bot" | "admin"
	content: string
	createdAt: string
	status?: "sent" | "delivered" | "read" | "failed"
}

export interface ConversationFilters {
	search?: string
	status?: "all" | "open" | "unread" | "assigned" | "bot" | "human"
}

export const getConversations = async (
	filters: ConversationFilters = {},
): Promise<Conversation[]> => {
	const response = await api.get("/conversations", { params: filters })
	return response.data
}

export const getConversation = async (id: string): Promise<Conversation> => {
	const response = await api.get(`/conversations/${id}`)
	return response.data
}

export const getMessages = async (
	conversationId: string,
): Promise<Message[]> => {
	const response = await api.get(`/conversations/${conversationId}/messages`)
	return response.data
}

export const sendMessage = async (
	conversationId: string,
	content: string,
): Promise<Message> => {
	const response = await api.post(`/conversations/${conversationId}/messages`, {
		content,
	})
	return response.data
}

export const setHumanTakeover = async (
	conversationId: string,
	humanTakeover: boolean,
): Promise<Conversation> => {
	const response = await api.patch(
		`/conversations/${conversationId}/takeover`,
		{ humanTakeover },
	)
	return response.data
}

export const markAsRead = async (conversationId: string): Promise<void> => {
	await api.post(`/conversations/${conversationId}/read`)
}
