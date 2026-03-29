import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { Sidebar } from './Sidebar'

/** Full-bleed map-style routes: no outer padding so split layouts can use the full main area */
const immersivePaths = ['/explore', '/ride/active']

export function AppLayout({ children }) {
  const { pathname } = useLocation()
  const mainRef = useRef(null)

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
    mainRef.current?.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])
  const isOnboarding = pathname === '/'
  const hideSidebar = pathname === '/login'
  const hideBottomNav = isOnboarding || pathname === '/ride/active' || pathname === '/login'
  const immersive = immersivePaths.includes(pathname)
  const messagesRoute = pathname.startsWith('/messages')
  const fullBleedMain = immersive || messagesRoute

  return (
    <div
      className={
        isOnboarding
          ? 'min-h-svh bg-surface'
          : 'flex min-h-svh flex-col bg-surface lg:flex-row lg:h-screen lg:bg-charcoal'
      }
    >
      {!isOnboarding && !hideSidebar && <Sidebar />}
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <main
          ref={mainRef}
          className={`flex min-h-0 flex-1 flex-col ${
            fullBleedMain
              ? 'overflow-hidden lg:p-0'
              : 'overflow-y-auto lg:bg-surface lg:rounded-tl-3xl lg:shadow-[inset_1px_0_0_rgba(15,23,42,0.06)] lg:px-5 lg:py-4 xl:px-8 xl:py-5'
          }`}
        >
          <div
            className={
              messagesRoute
                ? 'flex min-h-0 w-full flex-1 flex-col overflow-hidden lg:h-full lg:flex-1'
                : immersive
                  ? 'min-h-svh lg:min-h-full'
                  : 'min-h-full w-full lg:mx-auto lg:max-w-[min(1600px,100%)]'
            }
          >
            <div
              className={
                hideBottomNav
                  ? 'min-h-svh pb-8 lg:min-h-full lg:pb-8'
                  : messagesRoute
                    ? 'flex h-[100dvh] max-h-[100dvh] min-h-0 w-full flex-col overflow-hidden pb-24 lg:h-full lg:max-h-none lg:flex-1 lg:pb-0'
                    : 'min-h-svh pb-24 lg:min-h-full lg:pb-8'
              }
            >
              {children}
            </div>
          </div>
        </main>
      </div>
      {!hideBottomNav && <BottomNav />}
    </div>
  )
}
