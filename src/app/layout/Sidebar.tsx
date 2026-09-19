import { useAuthStore } from '@/features/auth/store'
import { cn } from '@/shared/lib/cn'
import { Logo } from '@/shared/ui/Logo'
import { LogOut } from 'lucide-react'

export type NavKey = 'dashboard' | 'task'

const MENU: { key: NavKey; label: string }[] = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'task', label: 'Project' },
]

type SidebarProps = {
  active: NavKey
  onNavigate: (key: NavKey) => void
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  const user = useAuthStore((state) => state.user)
  const signOut = useAuthStore((state) => state.signOut)

  return (
    <aside className="flex w-[220px] shrink-0 flex-col bg-surface">
      <div className="border-b border-divider px-5 py-4">
        <Logo />
      </div>

      <nav className="flex-1 px-4 py-5">
        <p className="eyebrow mb-3 text-neutral-600">Menu</p>
        <ul className="flex flex-col gap-1">
          {MENU.map((item) => {
            const isActive = item.key === active
            return (
              <li key={item.key}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.key)}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'w-full px-3 py-2.5 text-left text-project font-extrabold transition-colors',
                    isActive
                      ? 'bg-accent text-bg hover:bg-accent-600'
                      : 'text-text hover:bg-accent-100',
                  )}
                >
                  {item.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="flex items-center gap-3 border-t border-divider px-5 py-4">
        <span
          aria-hidden
          className="flex size-8 shrink-0 items-center justify-center bg-text text-label font-extrabold text-bg"
        >
          {user?.initials ?? 'AK'}
        </span>
        <span className="flex min-w-0 flex-col leading-tight">
          <span className="truncate text-form font-extrabold">{user?.name ?? 'Admin Kantor'}</span>
          <span className="text-kicker text-neutral-600">{user?.role ?? 'Administrator'}</span>
        </span>
        <button
          type="button"
          onClick={signOut}
          title="Keluar"
          aria-label="Keluar"
          className="ml-auto shrink-0 p-1 text-neutral-600 transition-colors hover:text-accent-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-700"
        >
          <LogOut aria-hidden className="size-4" />
        </button>
      </div>
    </aside>
  )
}
