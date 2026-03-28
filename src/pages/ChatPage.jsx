import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowDown, ArrowLeft, MoreVertical, Phone } from 'lucide-react'
import { useMessages } from '../context/MessagesContext'
import { BookingContextBanner } from '../components/messages/BookingContextBanner'
import { ChatThread } from '../components/messages/ChatThread'
import { MessageInput } from '../components/messages/MessageInput'
import { QuickReplies } from '../components/messages/QuickReplies'
import { getOwnerReplyForQuickText } from '../data/quickReplyResponses'

export function ChatPage() {
  const { chatId } = useParams()
  const navigate = useNavigate()
  const { getConversation, markRead, sendUserMessage, addMessage } = useMessages()
  const conv = getConversation(chatId)
  const [toast, setToast] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const [imageModal, setImageModal] = useState(null)
  const [usedQuick, setUsedQuick] = useState(() => new Set())
  const [showScrollBtn, setShowScrollBtn] = useState(false)
  const scrollRef = useRef(null)

  useEffect(() => {
    if (chatId) markRead(chatId)
  }, [chatId, markRead])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(t)
  }, [toast])

  const onScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 300)
  }, [])

  const scrollToBottom = () => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }

  const handleSend = (text) => {
    sendUserMessage(chatId, text)
    setUsedQuick((s) => new Set(s).add(text))
    setTimeout(scrollToBottom, 80)

    const ownerReply = getOwnerReplyForQuickText(text)
    if (ownerReply) {
      const delayMs = 700 + Math.random() * 900
      window.setTimeout(() => {
        addMessage(chatId, {
          type: 'text',
          sender: 'other',
          text: ownerReply,
        })
        markRead(chatId)
        setTimeout(scrollToBottom, 80)
      }, delayMs)
    }
  }

  const handleAttachment = (id) => {
    if (id === 'location') {
      addMessage(chatId, {
        type: 'location',
        sender: 'user',
        text: 'Shared my location',
        location: {
          address: 'Brgy. UP Campus, near Vanguard Building',
          lat: 14.6538,
          lng: 121.0685,
        },
      })
    } else {
      addMessage(chatId, {
        type: 'image',
        sender: 'user',
        caption:
          id === 'condition'
            ? 'Bike condition at pickup — all good! 👍'
            : 'Photo shared',
        imageColor: '#14b8a6',
      })
    }
    setTimeout(scrollToBottom, 80)
  }

  if (!conv) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="text-charcoal/60">Conversation not found.</p>
        <Link to="/messages" className="font-bold text-primary">
          Back to Messages
        </Link>
      </div>
    )
  }

  const { otherUser, booking } = conv
  const subtitle = otherUser.isOnline ? 'Active now' : `Last seen ${otherUser.lastSeen || 'recently'}`

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-surface md:rounded-none">
      <header className="z-20 flex shrink-0 items-center gap-2 border-b border-charcoal/10 bg-white/95 px-2 py-2 backdrop-blur-md md:px-4">
        <button
          type="button"
          onClick={() => navigate('/messages')}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-charcoal/5 md:hidden"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5 text-charcoal" />
        </button>
        <Link
          to="/messages"
          className="hidden h-10 w-10 items-center justify-center rounded-full hover:bg-charcoal/5 md:flex"
          aria-label="Back to inbox"
        >
          <ArrowLeft className="h-5 w-5 text-charcoal" />
        </Link>
        <div className="min-w-0 flex-1 text-center md:text-left">
          <p className="truncate font-heading text-base font-bold text-charcoal">{otherUser.name}</p>
          <p className="truncate text-[11px] text-charcoal/45">{subtitle}</p>
        </div>
        <button
          type="button"
          onClick={() => setToast('Voice call coming soon')}
          className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-charcoal/5"
          aria-label="Call"
        >
          <Phone className="h-5 w-5 text-charcoal" />
        </button>
        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-charcoal/5"
            aria-label="More"
          >
            <MoreVertical className="h-5 w-5 text-charcoal" />
          </button>
          {menuOpen && (
            <>
              <button type="button" className="fixed inset-0 z-30" aria-label="Close menu" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 top-full z-40 mt-1 w-48 rounded-xl border border-charcoal/10 bg-white py-1 shadow-xl">
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-charcoal hover:bg-surface"
                >
                  View Profile
                </Link>
                <Link
                  to={`/bike/${conv.bike.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2.5 text-sm font-medium text-charcoal hover:bg-surface"
                >
                  View Booking
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    setToast('Thanks — we’ll review this report')
                  }}
                  className="block w-full px-4 py-2.5 text-left text-sm font-medium text-charcoal hover:bg-surface"
                >
                  Report User
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    setToast('Block user coming soon')
                  }}
                  className="block w-full px-4 py-2.5 text-left text-sm font-medium text-charcoal hover:bg-surface"
                >
                  Block User
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      <div className="shrink-0">
        <BookingContextBanner conversation={conv} />
      </div>

      <QuickReplies status={booking.status} used={usedQuick} onSend={handleSend} />

      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="relative min-h-0 flex-1 basis-0 overflow-y-auto overflow-x-hidden overscroll-y-contain [-webkit-overflow-scrolling:touch]"
      >
        <ChatThread
          messages={conv.messages}
          otherUser={otherUser}
          onImageClick={(msg) => setImageModal(msg)}
        />
      </div>

      <div className="relative z-10 shrink-0 bg-white">
        <AnimatePresence>
          {showScrollBtn && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={scrollToBottom}
              className="absolute bottom-[calc(100%+8px)] right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white shadow-lg md:right-6"
              aria-label="Scroll to bottom"
            >
              <ArrowDown className="h-5 w-5" />
            </motion.button>
          )}
        </AnimatePresence>
        <MessageInput onSend={handleSend} onAttachment={handleAttachment} />
      </div>

      {toast && (
        <div className="fixed left-1/2 top-20 z-[70] -translate-x-1/2 rounded-full bg-charcoal px-4 py-2 text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      )}

      <AnimatePresence>
        {imageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/70 p-4"
            onClick={() => setImageModal(null)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="max-h-[85vh] max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className="aspect-[4/3] w-full max-w-md"
                style={{ backgroundColor: imageModal.imageColor || '#22c55e' }}
              />
              {imageModal.caption && (
                <p className="border-t border-charcoal/10 p-4 text-sm text-charcoal">{imageModal.caption}</p>
              )}
              <button
                type="button"
                onClick={() => setImageModal(null)}
                className="w-full border-t border-charcoal/10 py-3 text-sm font-bold text-primary"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
