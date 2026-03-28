import { motion, AnimatePresence } from 'framer-motion'

const items = [
  { id: 'camera', label: 'Camera', emoji: '📷' },
  { id: 'library', label: 'Photo Library', emoji: '🖼️' },
  { id: 'location', label: 'Share Location', emoji: '📍' },
  { id: 'condition', label: 'Bike condition', emoji: '🚲' },
]

export function AttachmentMenu({ open, onClose, onPick }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-charcoal/40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed bottom-24 left-4 right-4 z-[61] mx-auto max-w-sm rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-charcoal/10 md:bottom-28"
          >
            <p className="mb-3 text-center text-sm font-bold text-charcoal">Attach</p>
            <div className="grid grid-cols-2 gap-2">
              {items.map((it) => (
                <button
                  key={it.id}
                  type="button"
                  onClick={() => onPick(it.id)}
                  className="flex flex-col items-center gap-2 rounded-xl bg-surface py-4 text-xs font-semibold text-charcoal ring-1 ring-charcoal/10 transition hover:bg-primary/10 active:scale-[0.98]"
                >
                  <span className="text-2xl">{it.emoji}</span>
                  {it.label}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
