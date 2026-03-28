/**
 * Renders public/logo.png with extra scale so baked-in margins fill the frame.
 * Parent should set a fixed size and overflow-hidden (rounded corners optional).
 */
export function AppLogo({ zoom = 1.22, className = '' }) {
  const z = typeof zoom === 'number' && zoom > 0 ? zoom : 1.22
  return (
    <img
      src="/logo.png"
      alt=""
      width={256}
      height={256}
      decoding="async"
      draggable={false}
      className={`pointer-events-none block h-full w-full object-contain [transform-origin:center] ${className}`}
      style={{ transform: `scale(${z})` }}
    />
  )
}
