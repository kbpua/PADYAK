import { MessageCircle } from 'lucide-react'

export function MessagesEmptyPlaceholder() {
  return (
    <div className="hidden h-full min-h-[50vh] flex-1 flex-col items-center justify-center gap-2 bg-surface p-8 text-center md:flex">
      <MessageCircle className="h-16 w-16 text-charcoal/15" strokeWidth={1.25} />
      <p className="font-heading text-lg font-bold text-charcoal">Select a conversation</p>
      <p className="max-w-xs text-sm text-charcoal/50">
        Choose a chat from the list to start messaging
      </p>
    </div>
  )
}
