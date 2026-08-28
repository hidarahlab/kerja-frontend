import type { ReactNode } from 'react'
import { Sidebar, type NavKey } from './Sidebar'

type AppShellProps = {
  active: NavKey
  onNavigate: (key: NavKey) => void
  kicker: string
  title: string
  headerAside?: ReactNode
  children: ReactNode
}

export function AppShell({
  active,
  onNavigate,
  kicker,
  title,
  headerAside,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-dvh bg-bg">
      <Sidebar active={active} onNavigate={onNavigate} />

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-start justify-between gap-6 border-b border-divider px-8 py-5">
          <div>
            <p className="kicker">{kicker}</p>
            <h1 className="mt-1 text-screen">{title}</h1>
          </div>
          {headerAside ? (
            <div className="shrink-0 pt-1 text-kicker text-neutral-600">{headerAside}</div>
          ) : null}
        </header>

        <div className="min-w-0 flex-1">{children}</div>
      </main>
    </div>
  )
}
