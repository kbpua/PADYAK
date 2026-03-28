import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { conversationsSeed } from '../data/conversations'

const STORAGE_KEY = 'padyak_conversations'
const LEGACY_STORAGE_KEY = 'siklocity_conversations'

function loadConversations() {
  try {
    let raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      raw = localStorage.getItem(LEGACY_STORAGE_KEY)
      if (raw != null) {
        localStorage.setItem(STORAGE_KEY, raw)
        localStorage.removeItem(LEGACY_STORAGE_KEY)
      }
    }
    if (!raw) return conversationsSeed
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : conversationsSeed
  } catch {
    return conversationsSeed
  }
}

function lastPreviewFromMessage(msg) {
  if (msg.type === 'image') return '📷 Photo'
  if (msg.type === 'location') return '📍 Location shared'
  if (msg.type === 'system') return msg.text
  if (msg.sender === 'user' && msg.type === 'text') return `You: ${msg.text}`
  return msg.text || ''
}

function appendMessage(conv, msg) {
  const messages = [...conv.messages, msg]
  const unread =
    msg.sender === 'other'
      ? (conv.unreadCount || 0) + 1
      : msg.sender === 'user'
        ? 0
        : conv.unreadCount || 0
  return {
    ...conv,
    messages,
    lastMessage: {
      text: lastPreviewFromMessage(msg),
      sender: msg.sender,
      timestamp: msg.timestamp,
      read: msg.sender !== 'other',
    },
    unreadCount: unread,
  }
}

const MessagesContext = createContext(null)

export function MessagesProvider({ children }) {
  const [conversations, setConversations] = useState(loadConversations)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
  }, [conversations])

  const getConversation = useCallback(
    (chatId) => conversations.find((c) => c.id === chatId),
    [conversations],
  )

  const totalUnread = useMemo(
    () => conversations.reduce((n, c) => n + (c.unreadCount || 0), 0),
    [conversations],
  )

  const markRead = useCallback((chatId) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === chatId ? { ...c, unreadCount: 0 } : c)),
    )
  }, [])

  const patchMessage = useCallback((chatId, messageId, patch) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== chatId) return c
        return {
          ...c,
          messages: c.messages.map((m) => (m.id === messageId ? { ...m, ...patch } : m)),
        }
      }),
    )
  }, [])

  const addMessage = useCallback((chatId, message) => {
    const ts = message.timestamp || new Date().toISOString()
    const msg = {
      ...message,
      id: message.id || `msg-${Date.now()}`,
      timestamp: ts,
    }
    setConversations((prev) =>
      prev.map((c) => (c.id === chatId ? appendMessage(c, msg) : c)),
    )
    return msg.id
  }, [])

  const sendUserMessage = useCallback(
    (chatId, text, extra = {}) => {
      const id = `msg-${Date.now()}`
      const ts = new Date().toISOString()
      const msg = {
        id,
        type: 'text',
        sender: 'user',
        text,
        timestamp: ts,
        read: false,
        delivered: false,
        ...extra,
      }
      setConversations((prev) =>
        prev.map((c) => {
          if (c.id !== chatId) return c
          return appendMessage(c, msg)
        }),
      )
      setTimeout(() => patchMessage(chatId, id, { delivered: true }), 1200)
      setTimeout(() => patchMessage(chatId, id, { read: true }), 2400)
      return id
    },
    [patchMessage],
  )

  const ensureChatForBike = useCallback(
    (bike, bookingPartial = {}) => {
      const existing = conversations.find(
        (c) => c.bike.id === bike.id && c.otherUser.name === bike.owner.name,
      )
      if (existing) return existing.id
      const initials = bike.owner.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
      const colors = ['#22C55E', '#14B8A6', '#F59E0B', '#8B5CF6', '#EC4899']
      const avatarColor = colors[bike.id % colors.length]
      const id = `chat-${Date.now()}`
      const conv = {
        id,
        role: 'renter',
        otherUser: {
          name: bike.owner.name,
          avatar: null,
          initials,
          avatarColor,
          isOnline: Math.random() > 0.5,
          lastSeen: 'Recently',
        },
        bike: { name: bike.name, id: bike.id },
        booking: {
          date: bookingPartial.date || 'TBD',
          time: bookingPartial.time || 'TBD',
          status: bookingPartial.status || 'pending',
        },
        lastMessage: {
          text: 'No messages yet — say hello!',
          sender: 'system',
          timestamp: new Date().toISOString(),
          read: true,
        },
        unreadCount: 0,
        messages: [],
      }
      setConversations((prev) => [conv, ...prev])
      return id
    },
    [conversations],
  )

  const value = useMemo(
    () => ({
      conversations,
      getConversation,
      totalUnread,
      markRead,
      addMessage,
      sendUserMessage,
      patchMessage,
      ensureChatForBike,
    }),
    [
      conversations,
      getConversation,
      totalUnread,
      markRead,
      addMessage,
      sendUserMessage,
      patchMessage,
      ensureChatForBike,
    ],
  )

  return <MessagesContext.Provider value={value}>{children}</MessagesContext.Provider>
}

export function useMessages() {
  const ctx = useContext(MessagesContext)
  if (!ctx) throw new Error('useMessages must be used within MessagesProvider')
  return ctx
}
