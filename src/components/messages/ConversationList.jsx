import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { useMessages } from '../../context/MessagesContext'
import { ConversationRow } from './ConversationRow'

const filters = [
  { id: 'all', label: 'All' },
  { id: 'renter', label: 'As Renter' },
  { id: 'owner', label: 'As Owner' },
  { id: 'unread', label: 'Unread' },
]

export function ConversationList() {
  const { conversations } = useMessages()
  const [filter, setFilter] = useState('all')

  const filtered = useMemo(() => {
    let list = [...conversations]
    if (filter === 'renter') list = list.filter((c) => c.role !== 'owner')
    if (filter === 'owner') list = list.filter((c) => c.role === 'owner')
    if (filter === 'unread') list = list.filter((c) => (c.unreadCount || 0) > 0)
    list.sort((a, b) => new Date(b.lastMessage?.timestamp) - new Date(a.lastMessage?.timestamp))
    return list
  }, [conversations, filter])

  if (!conversations.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-8 py-16 text-center">
        <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-3xl bg-surface text-5xl ring-1 ring-charcoal/10">
          🚲💬
        </div>
        <h2 className="font-heading text-lg font-bold text-charcoal">No messages yet</h2>
        <p className="mt-2 text-sm text-charcoal/55">
          Start a conversation by booking a bike or listing yours!
        </p>
        <Link
          to="/home"
          className="mt-6 rounded-full bg-primary px-8 py-3 font-heading text-sm font-bold text-white shadow-lg shadow-primary/25"
        >
          Browse Bikes
        </Link>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col bg-white md:rounded-none">
      <header className="shrink-0 border-b border-charcoal/10 px-4 py-4 md:py-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-6 w-6 text-primary" strokeWidth={2} />
          <h1 className="font-heading text-xl font-extrabold text-charcoal">Messages</h1>
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-bold transition active:scale-95 ${
                filter === f.id ? 'bg-charcoal text-white' : 'bg-surface text-charcoal/70 ring-1 ring-charcoal/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-charcoal/50">No conversations in this filter.</p>
        ) : (
          filtered.map((c, i) => <ConversationRow key={c.id} conversation={c} index={i} />)
        )}
      </div>
    </div>
  )
}
