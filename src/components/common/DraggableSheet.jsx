import { forwardRef, useState } from 'react'
import { animate, motion, useDragControls, useMotionValue } from 'framer-motion'

/**
 * Bottom sheet: drag via the handle only so inner scroll areas keep working.
 * Snap: released past half of maxDrag stays collapsed (y=maxDrag), else expanded (y=0).
 * Put bg / shadow / fixed|absolute on this root so the whole card moves with y (no ghost shell).
 */
export const DraggableSheet = forwardRef(function DraggableSheet(
  { children, className = '', maxDrag = 120 },
  ref,
) {
  const y = useMotionValue(0)
  const controls = useDragControls()
  const [dragging, setDragging] = useState(false)

  const onDragEnd = () => {
    setDragging(false)
    const curr = y.get()
    const target = curr > maxDrag / 2 ? maxDrag : 0
    animate(y, target, { type: 'spring', stiffness: 400, damping: 38 })
  }

  return (
    <motion.div
      ref={ref}
      drag="y"
      dragControls={controls}
      dragListener={false}
      dragConstraints={{ top: 0, bottom: maxDrag }}
      dragElastic={{ top: 0, bottom: 0.08 }}
      style={{ y }}
      onDragStart={() => setDragging(true)}
      onDragEnd={onDragEnd}
      className={`${dragging ? 'select-none' : ''} ${className}`}
    >
      <div
        className="flex shrink-0 cursor-grab justify-center px-6 py-3 touch-none active:cursor-grabbing"
        onPointerDown={(e) => controls.start(e)}
        role="presentation"
        aria-hidden
      >
        <div className="pointer-events-none h-1.5 w-14 rounded-full bg-charcoal/20" />
      </div>
      {children}
    </motion.div>
  )
})
