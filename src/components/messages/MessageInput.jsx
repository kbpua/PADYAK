import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp, Mic, Plus } from 'lucide-react'
import { AttachmentMenu } from './AttachmentMenu'

export function MessageInput({ onSend, onAttachment }) {
  const [text, setText] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const submit = () => {
    const t = text.trim()
    if (!t) return
    onSend(t)
    setText('')
  }

  return (
    <>
      <div className="border-t border-charcoal/10 bg-white/90 px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-lg md:px-4 lg:px-6">
        <div className="mx-auto flex max-w-4xl items-end gap-2">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="mb-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-charcoal/5 text-charcoal transition hover:bg-charcoal/10 active:scale-95"
            aria-label="Attachments"
          >
            <Plus className="h-6 w-6" strokeWidth={2} />
          </button>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), submit())}
            placeholder="Type a message..."
            className="min-h-[44px] flex-1 rounded-full border border-charcoal/10 bg-charcoal/[0.06] px-4 py-2.5 text-sm text-charcoal placeholder:text-charcoal/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <AnimatePresence mode="wait">
            {text.trim() ? (
              <motion.button
                key="send"
                type="button"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                onClick={submit}
                className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-white shadow-md shadow-primary/25 transition hover:bg-[#1ea34a] active:scale-95"
                aria-label="Send"
              >
                <ArrowUp className="h-5 w-5" strokeWidth={2.5} />
              </motion.button>
            ) : (
              <motion.button
                key="mic"
                type="button"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="mb-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-charcoal/10 text-charcoal/50"
                aria-label="Voice message"
                disabled
              >
                <Mic className="h-5 w-5" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
      <AttachmentMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        onPick={(id) => {
          setMenuOpen(false)
          onAttachment(id)
        }}
      />
    </>
  )
}
