/** Simulated owner replies for quick-reply chips (demo — keys match QuickReplies.jsx exactly). */
export const ownerReplyForQuickMessage = {
  // pending
  'Is the bike still available?':
    "Hi! Yes, it's still open for the time we discussed. Say the word and I'll hold it for you.",
  'Can I pick up at 2:00 PM?':
    '2:00 PM works on my end. Once you confirm the booking, I’ll share the exact meet-up spot.',
  "What's the exact pickup location?":
    'Pickup is along CP Garcia near the campus side — I’ll drop a pin here before your slot so it’s easy to find.',
  'Is helmet included?':
    'Yes — helmet and a cable lock are included. Everything’s checked before handoff.',

  // confirmed
  "I'm on my way!": 'Great! I’ll be there with the bike. Text me if anything changes.',
  'Running 5 mins late': 'No worries, take your time. I’ll be around the pickup area.',
  'Can you share the pickup pin? 📍':
    'Here’s the spot — meet at the agreed corner; I’ll wave you down. (Pin would show on a live map.)',
  'See you soon!': 'See you! Ride safe and enjoy 🚲',

  // active
  'Quick question about the bike': 'Sure — what do you need? Happy to help while you’re out.',
  'I need to extend my ride':
    'Tell me how much longer you need. I’ll check if the next renter allows a short extension.',
  'Having an issue with the bike':
    'Please stop if it feels unsafe. Describe what you’re seeing and we’ll figure it out — I’m on it.',

  // completed
  'Bike returned, thanks! 🙏': 'Thanks for taking care of it! Hope to host you again soon.',
  'Great bike, salamat!': 'Salamat rin! Glad you enjoyed the ride.',
  'Left the bike at the agreed spot': 'Noted — thanks for confirming. All good on my side!',
}

export function getOwnerReplyForQuickText(text) {
  return ownerReplyForQuickMessage[text] ?? null
}
