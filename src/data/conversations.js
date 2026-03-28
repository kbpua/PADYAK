/** Seed conversations — merged with localStorage in MessagesContext */
export const conversationsSeed = [
  {
    id: 'chat-1',
    role: 'renter',
    otherUser: {
      name: 'Maria Santos',
      avatar: null,
      initials: 'MS',
      avatarColor: '#22C55E',
      isOnline: true,
    },
    bike: { name: 'Trek Marlin 5', id: 1 },
    booking: {
      date: 'Mar 28, 2026',
      time: '2:00 PM - 4:00 PM',
      status: 'confirmed',
    },
    lastMessage: {
      text: 'See you at 2! The bike is ready 🚲',
      sender: 'other',
      timestamp: '2026-03-28T09:15:00',
      read: true,
    },
    unreadCount: 0,
    messages: [
      {
        id: 'msg-1',
        type: 'text',
        sender: 'user',
        text: 'Hi Maria! Is the Trek Marlin 5 available this Saturday 2-4 PM?',
        timestamp: '2026-03-26T14:30:00',
        read: true,
        delivered: true,
      },
      {
        id: 'msg-2',
        type: 'text',
        sender: 'other',
        text: "Hi Juan! Yes, it's available. It's parked near the Vanguard Building sa UP Campus. 😊",
        timestamp: '2026-03-26T14:32:00',
        read: true,
        delivered: true,
      },
      {
        id: 'msg-3',
        type: 'text',
        sender: 'user',
        text: 'Nice! Is a helmet included?',
        timestamp: '2026-03-26T14:33:00',
        read: true,
        delivered: true,
      },
      {
        id: 'msg-4',
        type: 'text',
        sender: 'other',
        text: "Yes, I have a spare helmet you can use! I'll bring it when we meet.",
        timestamp: '2026-03-26T14:35:00',
        read: true,
        delivered: true,
      },
      {
        id: 'msg-5',
        type: 'system',
        text: '📋 Booking confirmed for Mar 28, 2:00 PM - 4:00 PM',
        timestamp: '2026-03-26T14:40:00',
      },
      {
        id: 'msg-6',
        type: 'location',
        sender: 'other',
        text: "Here's the exact pickup spot",
        location: {
          address: 'Vanguard Building, Brgy. UP Campus, Quezon City',
          lat: 14.6538,
          lng: 121.0685,
        },
        timestamp: '2026-03-27T10:00:00',
        read: true,
        delivered: true,
      },
      {
        id: 'msg-7',
        type: 'text',
        sender: 'other',
        text: 'See you at 2! The bike is ready 🚲',
        timestamp: '2026-03-28T09:15:00',
        read: true,
        delivered: true,
      },
    ],
  },
  {
    id: 'chat-2',
    role: 'renter',
    otherUser: {
      name: 'Carlos Reyes',
      avatar: null,
      initials: 'CR',
      avatarColor: '#F59E0B',
      isOnline: false,
      lastSeen: '2h ago',
    },
    bike: { name: 'Giant Escape 3', id: 3 },
    booking: {
      date: 'Mar 30, 2026',
      time: '8:00 AM - 12:00 PM',
      status: 'pending',
    },
    lastMessage: {
      text: 'Let me check my schedule and get back to you',
      sender: 'other',
      timestamp: '2026-03-27T18:45:00',
      read: true,
    },
    unreadCount: 0,
    messages: [
      {
        id: 'msg-1',
        type: 'text',
        sender: 'user',
        text: 'Hello po! Is the Giant Escape available this Sunday morning?',
        timestamp: '2026-03-27T18:30:00',
        read: true,
        delivered: true,
      },
      {
        id: 'msg-2',
        type: 'text',
        sender: 'other',
        text: 'Let me check my schedule and get back to you',
        timestamp: '2026-03-27T18:45:00',
        read: true,
        delivered: true,
      },
    ],
  },
  {
    id: 'chat-3',
    role: 'renter',
    otherUser: {
      name: 'Ana Villanueva',
      avatar: null,
      initials: 'AV',
      avatarColor: '#14B8A6',
      isOnline: true,
    },
    bike: { name: 'Folding City Pro', id: 8 },
    booking: {
      date: 'Mar 25, 2026',
      time: '3:00 PM - 5:00 PM',
      status: 'completed',
    },
    lastMessage: {
      text: 'You: Salamat po, Ana! Great bike 🙏',
      sender: 'user',
      timestamp: '2026-03-25T17:10:00',
      read: true,
    },
    unreadCount: 0,
    messages: [
      {
        id: 'msg-1',
        type: 'system',
        text: "✅ Ride completed — don't forget to rate!",
        timestamp: '2026-03-25T17:00:00',
      },
      {
        id: 'msg-2',
        type: 'image',
        sender: 'user',
        caption: 'Bike returned in good condition 👍',
        imageColor: '#22C55E',
        timestamp: '2026-03-25T17:05:00',
        read: true,
        delivered: true,
      },
      {
        id: 'msg-3',
        type: 'text',
        sender: 'user',
        text: 'Salamat po, Ana! Great bike 🙏',
        timestamp: '2026-03-25T17:10:00',
        read: true,
        delivered: true,
      },
      {
        id: 'msg-4',
        type: 'text',
        sender: 'other',
        text: 'Thank you din Juan! Glad you enjoyed the ride. Ingat! 😊',
        timestamp: '2026-03-25T17:12:00',
        read: true,
        delivered: true,
      },
      {
        id: 'msg-5',
        type: 'system',
        text: '💰 Payment of ₱55 processed via GCash',
        timestamp: '2026-03-25T17:15:00',
      },
    ],
  },
  {
    id: 'chat-4',
    role: 'renter',
    otherUser: {
      name: 'Paolo Mendoza',
      avatar: null,
      initials: 'PM',
      avatarColor: '#8B5CF6',
      isOnline: false,
      lastSeen: '5m ago',
    },
    bike: { name: 'BMX Street 20', id: 4 },
    booking: {
      date: 'Mar 29, 2026',
      time: '10:00 AM - 1:00 PM',
      status: 'confirmed',
    },
    lastMessage: {
      text: "Sige noted, I'll prepare the bike tonight",
      sender: 'other',
      timestamp: '2026-03-28T20:30:00',
      read: false,
    },
    unreadCount: 2,
    messages: [
      {
        id: 'msg-1',
        type: 'text',
        sender: 'user',
        text: "Hi Paolo! Confirmed for tomorrow 10 AM. Where's the pickup?",
        timestamp: '2026-03-28T20:15:00',
        read: true,
        delivered: true,
      },
      {
        id: 'msg-2',
        type: 'text',
        sender: 'other',
        text: 'Sa may Katipunan Ave, beside Jollibee Kati. Madali hanapin!',
        timestamp: '2026-03-28T20:20:00',
        read: false,
        delivered: true,
      },
      {
        id: 'msg-3',
        type: 'text',
        sender: 'other',
        text: "Sige noted, I'll prepare the bike tonight",
        timestamp: '2026-03-28T20:30:00',
        read: false,
        delivered: true,
      },
    ],
  },
  {
    id: 'chat-5',
    role: 'owner',
    otherUser: {
      name: 'Rico Mendoza',
      avatar: null,
      initials: 'RM',
      avatarColor: '#6366F1',
      isOnline: true,
    },
    bike: { name: 'Sunpeed Kepler', id: 7 },
    booking: {
      date: 'Mar 31, 2026',
      time: '9:00 AM - 11:00 AM',
      status: 'pending',
    },
    lastMessage: {
      text: 'You: Sure, padlock code is 2847',
      sender: 'user',
      timestamp: '2026-03-28T12:00:00',
      read: true,
    },
    unreadCount: 0,
    messages: [
      {
        id: 'msg-1',
        type: 'text',
        sender: 'other',
        text: 'Hi! Is the bike available Monday morning?',
        timestamp: '2026-03-28T11:50:00',
        read: true,
        delivered: true,
      },
      {
        id: 'msg-2',
        type: 'text',
        sender: 'user',
        text: 'Sure, padlock code is 2847',
        timestamp: '2026-03-28T12:00:00',
        read: true,
        delivered: true,
      },
    ],
  },
]

export function formatRelativeTime(iso) {
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now - d
  const diffM = Math.floor(diffMs / 60000)
  if (diffM < 1) return 'Just now'
  if (diffM < 60) return `${diffM}m ago`
  const diffH = Math.floor(diffM / 60)
  if (diffH < 24) return `${diffH}h ago`
  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}
