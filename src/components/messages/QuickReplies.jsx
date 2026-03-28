const byStatus = {
  pending: [
    'Is the bike still available?',
    'Can I pick up at 2:00 PM?',
    "What's the exact pickup location?",
    'Is helmet included?',
  ],
  confirmed: [
    "I'm on my way!",
    'Running 5 mins late',
    'Can you share the pickup pin? 📍',
    'See you soon!',
  ],
  active: [
    'Quick question about the bike',
    'I need to extend my ride',
    'Having an issue with the bike',
  ],
  completed: [
    'Bike returned, thanks! 🙏',
    'Great bike, salamat!',
    'Left the bike at the agreed spot',
  ],
}

export function QuickReplies({ status, onSend, used = new Set() }) {
  const pills = byStatus[status] || byStatus.pending
  const visible = pills.filter((p) => !used.has(p))
  if (!visible.length) return null

  return (
    <div className="shrink-0 border-b border-charcoal/10 bg-white/90 px-2 py-2 md:flex md:flex-wrap md:gap-2 md:px-4 md:py-3 lg:px-6">
      <p className="mb-2 hidden text-[10px] font-bold uppercase tracking-wide text-charcoal/40 md:mb-0 md:block md:w-full">
        Quick replies
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] md:flex-wrap md:overflow-visible md:pb-0 [&::-webkit-scrollbar]:hidden">
        {visible.map((text) => (
          <button
            key={text}
            type="button"
            onClick={() => onSend(text)}
            className="shrink-0 rounded-full bg-surface px-3 py-1.5 text-left text-xs font-semibold text-charcoal ring-1 ring-charcoal/10 transition hover:bg-primary/10 hover:ring-primary/30 active:scale-[0.98] md:text-sm"
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  )
}
