import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useState } from 'react'
import { AppShell } from '@/app/layout/AppShell'
import type { NavKey } from '@/app/layout/Sidebar'
import { LoginPage } from '@/features/auth/LoginPage'
import { useAuthStore } from '@/features/auth/store'
import { ProjectListPage } from '@/features/projects/ProjectListPage'

const PAGE = {
  dashboard: { kicker: 'Ringkasan penjualan', title: 'Dashboard' },
  task: { kicker: 'Manajemen pekerjaan', title: 'Project' },
} satisfies Record<NavKey, { kicker: string; title: string }>

export default function App() {
  const token = useAuthStore((state) => state.token)
  const [active, setActive] = useState<NavKey>('dashboard')

  // Guard sementara — diganti route guard saat TanStack Router dipasang.
  if (!token) return <LoginPage />

  const page = PAGE[active]

  return (
    <AppShell
      active={active}
      onNavigate={setActive}
      kicker={page.kicker}
      title={page.title}
      headerAside={format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
    >
      {active === 'task' && <ProjectListPage />}
      {active === 'dashboard' && (
        <div className="flex h-full items-center justify-center p-10">
          <p className="text-body text-neutral-600">
            Dashboard menyusul.
          </p>
        </div>
      )}
    </AppShell>
  )
}
