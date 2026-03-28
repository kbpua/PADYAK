import { Outlet, useLocation } from 'react-router-dom'
import { ConversationList } from '../components/messages/ConversationList'

export function MessagesLayout() {
  const { pathname } = useLocation()
  const chatId = /^\/messages\/([^/]+)$/.exec(pathname)?.[1]

  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-surface md:flex-row lg:h-full">
      <aside
        className={`flex w-full shrink-0 flex-col border-charcoal/10 bg-white md:h-full md:max-h-full md:w-80 md:border-r md:shadow-none lg:w-96 ${
          chatId ? 'hidden min-h-0 md:flex' : 'flex min-h-0 flex-1 md:min-h-0 md:flex-none'
        }`}
      >
        <ConversationList />
      </aside>
      <main
        className={`min-h-0 min-w-0 flex-1 overflow-hidden bg-white ${
          chatId ? 'flex h-full min-h-0 flex-col' : 'hidden md:flex md:h-full md:min-h-0 md:flex-col'
        }`}
      >
        <Outlet />
      </main>
    </div>
  )
}
