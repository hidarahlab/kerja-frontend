import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { useState } from 'react'
import { AppShell } from '@/app/layout/AppShell'
import type { NavKey } from '@/app/layout/Sidebar'
import { LoginPage } from '@/features/auth/LoginPage'
import { useAuthStore } from '@/features/auth/store'
import { ProjectListPage } from '@/features/projects/ProjectListPage'
import { KanbanPage } from '@/features/kanban/KanbanPage'
import { useProject } from '@/shared/hooks/useProjects'

const PAGE = {
  dashboard: { kicker: 'Ringkasan penjualan', title: 'Dashboard' },
  task: { kicker: 'Manajemen pekerjaan', title: 'Project' },
} satisfies Record<NavKey, { kicker: string; title: string }>

// QueryClientProvider sudah dipasang di main.tsx — jangan tambahkan lagi di sini.
export default function App() {
  const token = useAuthStore((state) => state.token)
  const [active, setActive] = useState<NavKey>('dashboard')
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const { data: projectData } = useProject(selectedProjectId ? Number(selectedProjectId) : 0)

  // Guard sementara — diganti route guard saat TanStack Router dipasang.
  if (!token) return <LoginPage />

  const page = PAGE[active]
  const projectTitle = projectData?.name ?? 'Kanban'

  return (
    <AppShell
      active={active}
      onNavigate={(nav) => {
        setActive(nav)
        setSelectedProjectId(null) // Reset project saat switch halaman
      }}
      kicker={page.kicker}
      title={selectedProjectId ? projectTitle : page.title}
      headerAside={format(new Date(), 'EEEE, d MMMM yyyy', { locale: id })}
    >
      {active === 'task' && selectedProjectId ? (
        <KanbanPage projectId={selectedProjectId} />
      ) : active === 'task' ? (
        <ProjectListPage onSelectProject={setSelectedProjectId} />
      ) : null}
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
