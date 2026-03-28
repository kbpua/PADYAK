import { motion } from 'framer-motion'
import { Check, CheckCheck, MapPin } from 'lucide-react'

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function sameGroup(prev, curr) {
  if (!prev || prev.type === 'system' || curr.type === 'system') return false
  if (prev.sender !== curr.sender) return false
  const a = new Date(prev.timestamp).getTime()
  const b = new Date(curr.timestamp).getTime()
  return b - a < 2 * 60 * 1000
}

export function ChatBubble({ message, prevMessage, otherUser }) {
  const grouped = sameGroup(prevMessage, message)

  if (message.type === 'system') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className="my-3 flex justify-center px-4"
      >
        <span className="max-w-[90%] rounded-full bg-charcoal/10 px-4 py-2 text-center text-[11px] font-medium leading-snug text-charcoal/65 md:text-xs">
          {message.text}
        </span>
      </motion.div>
    )
  }

  const isUser = message.sender === 'user'

  if (message.type === 'location') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className={`flex gap-2 px-3 md:px-4 lg:px-6 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isUser && (
          <div className="w-8 shrink-0">
            {!grouped && (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: otherUser.avatarColor }}
              >
                {otherUser.initials}
              </div>
            )}
          </div>
        )}
        <div className={`max-w-[85%] md:max-w-[75%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
          <div
            className={`overflow-hidden rounded-2xl shadow-sm ring-1 ring-charcoal/10 ${
              isUser ? 'rounded-br-md bg-emerald-500 text-white' : 'rounded-bl-md bg-white'
            }`}
          >
            <div className="flex h-24 items-center justify-center bg-charcoal/10 md:h-28">
              <MapPin className={`h-10 w-10 ${isUser ? 'text-white/90' : 'text-primary'}`} strokeWidth={1.5} />
            </div>
            {message.text && (
              <p className={`px-3 py-2 text-sm ${isUser ? 'text-white/95' : 'text-charcoal'}`}>{message.text}</p>
            )}
            <p className={`border-t px-3 py-2 text-xs ${isUser ? 'border-white/20 text-white/85' : 'border-charcoal/10 text-charcoal/70'}`}>
              📍 {message.location?.address}
            </p>
            <button
              type="button"
              className={`w-full py-2 text-center text-xs font-bold ${isUser ? 'text-white' : 'text-primary'}`}
            >
              Open in Maps
            </button>
          </div>
          <span className="px-1 text-[10px] text-charcoal/40">{formatTime(message.timestamp)}</span>
        </div>
      </motion.div>
    )
  }

  if (message.type === 'image') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15 }}
        className={`flex gap-2 px-3 md:px-4 lg:px-6 ${isUser ? 'justify-end' : 'justify-start'}`}
      >
        {!isUser && (
          <div className="w-8 shrink-0">
            {!grouped && (
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white"
                style={{ backgroundColor: otherUser.avatarColor }}
              >
                {otherUser.initials}
              </div>
            )}
          </div>
        )}
        <div className={`max-w-[85%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
          <button
            type="button"
            onClick={() => message.onImageClick?.()}
            className={`overflow-hidden rounded-2xl shadow-sm ring-1 ring-charcoal/10 ${
              isUser ? 'rounded-br-md' : 'rounded-bl-md'
            }`}
          >
            <div
              className="h-36 w-52 md:h-40 md:w-56"
              style={{ backgroundColor: message.imageColor || '#22c55e' }}
            />
            {message.caption && (
              <p className="bg-white px-3 py-2 text-left text-sm text-charcoal">{message.caption}</p>
            )}
          </button>
          <span className="px-1 text-[10px] text-charcoal/40">{formatTime(message.timestamp)}</span>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex gap-2 px-3 md:px-4 lg:px-6 ${isUser ? 'justify-end' : 'justify-start'} ${grouped ? 'mt-0.5' : 'mt-2'}`}
    >
      {!isUser && (
        <div className="w-8 shrink-0">
          {!grouped && (
            <div
              className="relative flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold text-white ring-2 ring-white"
              style={{ backgroundColor: otherUser.avatarColor }}
            >
              {otherUser.initials}
              {otherUser.isOnline && (
                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-white" />
              )}
            </div>
          )}
        </div>
      )}
      <div className={`max-w-[80%] md:max-w-[70%] lg:max-w-[65%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-0.5`}>
        <div
          className={`px-3.5 py-2.5 text-sm shadow-sm md:px-4 md:py-3 md:text-[15px] ${
            isUser
              ? 'rounded-2xl rounded-br-md bg-emerald-500 text-white'
              : 'rounded-2xl rounded-bl-md border border-charcoal/15 bg-gray-100 text-charcoal'
          }`}
        >
          {message.text}
        </div>
        <div className="flex items-center gap-1 px-1">
          <span className="text-[10px] text-charcoal/40">{formatTime(message.timestamp)}</span>
          {isUser && (
            <span className="text-charcoal/35">
              {message.read ? (
                <CheckCheck className="h-3.5 w-3.5 text-emerald-600" strokeWidth={2.5} />
              ) : message.delivered ? (
                <CheckCheck className="h-3.5 w-3.5 text-charcoal/40" strokeWidth={2.5} />
              ) : (
                <Check className="h-3.5 w-3.5 text-charcoal/35" strokeWidth={2.5} />
              )}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  )
}
