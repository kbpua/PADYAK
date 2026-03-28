import { AnimatePresence, motion } from 'framer-motion'
import { MessageCircle, Phone, ShieldAlert, X } from 'lucide-react'

/**
 * Emergency help sheet — does not replace professional emergency services.
 */
export function SosModal({ open, onClose, onNotifyHost }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-charcoal/75 backdrop-blur-sm"
            aria-label="Close emergency panel"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sos-title"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className="fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-[81] max-h-[min(85dvh,520px)] overflow-y-auto rounded-3xl bg-white p-5 shadow-2xl ring-1 ring-charcoal/10 sm:inset-x-auto sm:left-1/2 sm:w-full sm:max-w-md sm:-translate-x-1/2 lg:bottom-auto lg:top-1/2 lg:left-1/2 lg:max-h-[min(90dvh,560px)] lg:-translate-x-1/2 lg:-translate-y-1/2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-white shadow-md">
                  <ShieldAlert className="h-5 w-5" strokeWidth={2} />
                </span>
                <div>
                  <h2 id="sos-title" className="font-heading text-lg font-extrabold text-charcoal">
                    Emergency help
                  </h2>
                  <p className="text-xs text-charcoal/50">Safety first — we’re here to get you to the right help.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-charcoal/50 transition hover:bg-charcoal/5"
                aria-label="Close"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-charcoal/70">
              If you or someone else is hurt or in danger, contact{' '}
              <strong className="text-charcoal">emergency services</strong> first. Padyak cannot dispatch ambulances or
              police.
            </p>

            <div className="mt-5 space-y-2.5">
              <a
                href="tel:911"
                className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 font-heading text-sm font-extrabold text-white shadow-lg shadow-red-600/30 transition hover:bg-red-700 active:scale-[0.99]"
              >
                <Phone className="h-5 w-5 shrink-0" strokeWidth={2} />
                Call 911 — National emergency
              </a>
              <a
                href="tel:117"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-charcoal/15 bg-white py-3.5 font-heading text-sm font-bold text-charcoal transition hover:bg-charcoal/[0.03] active:scale-[0.99]"
              >
                <Phone className="h-5 w-5 shrink-0 text-charcoal/60" strokeWidth={2} />
                Call 117 — Police hotline
              </a>
              {onNotifyHost && (
                <button
                  type="button"
                  onClick={() => {
                    onClose()
                    onNotifyHost()
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-primary/35 bg-primary/5 py-3.5 font-heading text-sm font-bold text-primary transition hover:bg-primary/10 active:scale-[0.99]"
                >
                  <MessageCircle className="h-5 w-5 shrink-0" strokeWidth={2} />
                  Message bike host
                </button>
              )}
            </div>

            <p className="mt-4 text-center text-[11px] leading-snug text-charcoal/45">
              Demo app: confirm numbers with your local emergency services. Use only for real emergencies.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
