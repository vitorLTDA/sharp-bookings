import { useState, KeyboardEvent } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Send, Loader2 } from "lucide-react"

interface Props {
	onSend: (content: string) => void
	disabled?: boolean
	isSending?: boolean
}

export function MessageInput({ onSend, disabled, isSending }: Props) {
	const [value, setValue] = useState("")

	const handleSend = () => {
		const trimmed = value.trim()
		if (!trimmed || disabled) return
		onSend(trimmed)
		setValue("")
	}

	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	return (
		<div className="border-t p-3 bg-background">
			<div className="flex items-end gap-2">
				<Textarea
					value={value}
					onChange={e => setValue(e.target.value)}
					onKeyDown={handleKeyDown}
					placeholder="Type a message..."
					disabled={disabled}
					rows={1}
					className="min-h-[40px] max-h-32 resize-none"
				/>
				<Button
					onClick={handleSend}
					disabled={disabled || !value.trim() || isSending}
					size="icon"
					className="bg-accent hover:bg-accent/80 shrink-0"
				>
					{isSending ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Send className="h-4 w-4" />
					)}
				</Button>
			</div>
		</div>
	)
}
