export function DateSeparator({ label }) {
  return (
    <div className="my-4 flex justify-center">
      <span className="rounded-full bg-charcoal/10 px-4 py-1 text-center text-[11px] font-semibold text-charcoal/55">
        {label}
      </span>
    </div>
  )
}

export function labelForMessageDate(iso) {
  const d = new Date(iso)
  const today = new Date()
  const y = new Date(today)
  y.setDate(y.getDate() - 1)
  if (d.toDateString() === today.toDateString()) return 'Today'
  if (d.toDateString() === y.toDateString()) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}
