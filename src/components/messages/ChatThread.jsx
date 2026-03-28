import { useEffect, useRef } from 'react'
import { ChatBubble } from './ChatBubble'
import { DateSeparator, labelForMessageDate } from './DateSeparator'

function dayKey(iso) {
  return new Date(iso).toDateString()
}

export function ChatThread({ messages, otherUser, onImageClick }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages.length])

  return (
    <div className="px-0 py-2 md:py-4">
      {messages.map((msg, i) => {
        const prev = messages[i - 1]
        const showSep = i === 0 || dayKey(msg.timestamp) !== dayKey(prev.timestamp)
        return (
          <div key={msg.id}>
            {showSep && <DateSeparator label={labelForMessageDate(msg.timestamp)} />}
            <ChatBubble
              message={
                msg.type === 'image'
                  ? { ...msg, onImageClick: () => onImageClick?.(msg) }
                  : msg
              }
              prevMessage={prev}
              otherUser={otherUser}
            />
          </div>
        )
      })}
      <div ref={bottomRef} className="h-4" />
    </div>
  )
}
