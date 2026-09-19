import { useMemo, useState } from 'react'
import { useCompanyId } from '@/shared/hooks/useCompany'
import { useTasksByCompany } from '@/shared/hooks/useTasks'
import { useProjectsByCompany } from '@/shared/hooks/useProjects'
import type { TaskDTO } from '@/shared/api/tasks'
import { SummaryCards } from './components/SummaryCards'
import { MyDayPanel } from './components/MyDayPanel'
import { ProjectStatusPanel } from './components/ProjectStatusPanel'
import { OverdueTable } from './components/OverdueTable'
import { buildProjectBreakdown, myDayTasks, overdueTasks, totalCountsByStatus } from './dashboardData'

type DashboardPageProps = {
  /** Pindah ke papan kanban milik project ini — dipakai saat task di panel My Day diklik. */
  onNavigateToProject: (projectId: string) => void
}

export function DashboardPage({ onNavigateToProject }: DashboardPageProps) {
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null)

  const { companyId, isPending: isCompanyPending, isError: isCompanyError } = useCompanyId()

  // 100 cukup untuk skala perusahaan saat ini — kalau task per company sudah
  // ribuan, dashboard ini butuh endpoint agregat, bukan menaikkan angka ini.
  const {
    data: taskPage,
    isPending: isTasksPending,
    isError: isTasksError,
  } = useTasksByCompany(companyId ?? 0, 0, 100)
  const {
    data: projectPage,
    isPending: isProjectsPending,
    isError: isProjectsError,
  } = useProjectsByCompany(companyId ?? 0, 0, 100)

  const tasks = useMemo(() => taskPage?.content ?? [], [taskPage])
  const projects = useMemo(() => projectPage?.content ?? [], [projectPage])

  const projectNameById = useMemo(
    () => new Map(projects.map((p) => [p.id, p.name])),
    [projects],
  )

  const breakdown = useMemo(() => buildProjectBreakdown(tasks, projects), [tasks, projects])
  const totalCounts = useMemo(() => totalCountsByStatus(tasks), [tasks])
  const overdue = useMemo(() => overdueTasks(tasks), [tasks])
  const myDayCount = useMemo(() => myDayTasks(tasks).length, [tasks])

  const doneCount = totalCounts.done ?? 0
  const activeCount = tasks.length - doneCount

  if (isCompanyPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-body text-neutral-600">Memuat data perusahaan...</p>
      </div>
    )
  }

  if (isCompanyError || !companyId) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8">
        <p className="text-body font-bold text-red-600">Perusahaan Anda tidak dikenali.</p>
        <p className="text-kicker text-neutral-600">
          Silakan keluar lalu masuk kembali. Bila tetap muncul, hubungi admin IT.
        </p>
      </div>
    )
  }

  if (isTasksPending || isProjectsPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-body text-neutral-600">Memuat dashboard...</p>
      </div>
    )
  }

  // Tanpa ini, gagal fetch (mis. backend sempat tidak terjangkau) diam-diam
  // dianggap "0 task/project" — sehingga angka yang salah malah terlihat lebih
  // meyakinkan daripada pesan error yang jujur.
  if (isTasksError || isProjectsError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8">
        <p className="text-body font-bold text-red-600">Gagal memuat data dashboard.</p>
        <p className="text-kicker text-neutral-600">
          Pastikan koneksi ke server stabil, lalu muat ulang halaman ini.
        </p>
      </div>
    )
  }

  return (
    // h-full + overflow-hidden: dashboard mengisi persis tinggi yang disediakan
    // AppShell, tidak lebih — jadi tidak pernah minta scroll ke halaman.
    // min-h-0 di baris panel wajib ada supaya grid itu boleh mengecil di bawah
    // tinggi kontennya sendiri (baru begitu scroll internal tiap panel kepakai).
    <div className="flex h-full flex-col gap-6 overflow-hidden px-8 pb-8 pt-[3px]">
      <SummaryCards
        cards={[
          { label: 'Total Project', value: projects.length, description: 'semua project aktif' },
          { label: 'Total Task', value: tasks.length, description: `${doneCount} selesai · ${activeCount} jalan` },
          { label: 'My Day', value: myDayCount, description: `${myDayCount} belum selesai` },
          { label: 'Lewat Tenggat', value: overdue.length, description: 'task perlu ditindak' },
        ]}
      />

      <div className="grid min-h-0 flex-[3] grid-cols-1 gap-6 lg:grid-cols-2">
        <MyDayPanel
          tasks={tasks}
          filterProjectId={selectedProjectId}
          projectNameById={projectNameById}
          onOpenTask={(task: TaskDTO) => onNavigateToProject(String(task.projectId))}
        />
        <ProjectStatusPanel
          breakdown={breakdown}
          totalCounts={totalCounts}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
        />
      </div>

      {/* flex-[2] + min-h: dulu panel ini ikut tinggi kontennya sendiri
          (shrink-0), jadi kalau task lewat tenggat lagi banyak, dia "makan"
          jatah tinggi grid di atas sampai My Day & Status Project keliatan
          kosong padahal cuma kegencet ke 0px. Sekarang dapat jatah tinggi
          tetap dan scroll sendiri di dalam (lihat OverdueTable). min-h
          memastikan minimal 1 baris penuh selalu kelihatan walau layar
          pendek — tanpanya flex-[2] saja bisa kegencet ke ukuran yang cuma
          menampilkan sepotong baris. */}
      <div className="min-h-[240px] flex-[2]">
        <OverdueTable
          tasks={overdue}
          projectNameById={projectNameById}
          onOpenTask={(task: TaskDTO) => onNavigateToProject(String(task.projectId))}
        />
      </div>
    </div>
  )
}
