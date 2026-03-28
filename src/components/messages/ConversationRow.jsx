import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { formatRelativeTime } from '../../data/conversations'

export function ConversationRow({ conversation, index }) {
  const { otherUser, bike, booking, lastMessage, unreadCount: rawUnread } = conversation
  const unreadCount = rawUnread || 0
  const preview = lastMessage?.text || ''

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.2 }}
    >
      <NavLink
        to={`/messages/${conversation.id}`}
        className={({ isActive }) =>
          `flex gap-3 border-b border-charcoal/5 px-4 py-3 transition hover:bg-charcoal/[0.02] md:px-3 ${
            unreadCount > 0 ? 'bg-primary/[0.04]' : ''
          } ${isActive ? 'bg-primary/[0.07]' : ''}`
        }
      >
        <div className="relative shrink-0">
          <div
            className="flex h-12 w-12 items-center justify-center rounded-full text-sm font-bold text-white ring-2 ring-white"
            style={{ backgroundColor: otherUser.avatarColor }}
          >
            {otherUser.initials}
          </div>
          {otherUser.isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-primary ring-2 ring-white" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`truncate font-heading text-sm ${unreadCount > 0 ? 'font-extrabold text-charcoal' : 'font-bold text-charcoal'}`}
            >
              {otherUser.name}
            </p>
            <span className="shrink-0 text-[10px] font-semibold text-charcoal/40">
              {lastMessage?.timestamp ? formatRelativeTime(lastMessage.timestamp) : ''}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-charcoal/50">{preview}</p>
          <p className="mt-1.5 inline-flex max-w-full items-center gap-1 truncate rounded-full bg-charcoal/5 px-2 py-0.5 text-[10px] font-semibold text-charcoal/70">
            🚲 {bike.name} · {booking.date}
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="flex shrink-0 flex-col items-end justify-center">
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        )}
      </NavLink>
    </motion.div>
  )
}
