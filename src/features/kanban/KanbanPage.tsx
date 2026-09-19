import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, Check } from 'lucide-react'
import { tasksApi } from '@/shared/api/tasks'
import { useProject, useUpdateProject } from '@/shared/hooks/useProjects'
import { isProjectCompleted, PROJECT_STATUS_COMPLETED } from '@/shared/lib/projectStatus'
import { Button } from '@/shared/ui/Button'
import { KanbanBoard } from './components/KanbanBoard'

type KanbanPageProps = {
  projectId?: string
  onBack?: () => void
}

export function KanbanPage({ projectId, onBack }: KanbanPageProps) {
  const projectIdNum = projectId ? Number(projectId) : 0
  const [askConfirm, setAskConfirm] = useState(false)

  // Judul project ditampilkan di kepala papan supaya jelas kanban siapa yang dibuka.
  // Sengaja lewat useProject (bukan useQuery sendiri) supaya memakai key cache yang
  // sama dengan useUpdateProject — tanpa itu, status project tidak ikut segar
  // setelah ditandai selesai.
  const { data: project } = useProject(projectIdNum)
  const updateProject = useUpdateProject(projectIdNum)

  const isDone = isProjectCompleted(project?.status)

  const setStatus = (status: string) =>
    updateProject.mutate({ status }, { onSettled: () => setAskConfirm(false) })

  // Fetch tasks by project ID
  const { data, isPending, isError, error } = useQuery({
    queryKey: ['tasks', 'project', projectIdNum],
    queryFn: () => tasksApi.getByProject(projectIdNum, 0, 100),
    enabled: !!projectIdNum,
  })

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-body text-neutral-600">Memuat task...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8">
        <p className="text-body font-bold text-red-600">Gagal memuat task.</p>
        <p className="text-kicker text-neutral-600">{String(error)}</p>
      </div>
    )
  }

  return (
    // h-full + overflow-hidden: halaman kanban mengisi persis tinggi yang
    // disediakan AppShell dan tidak ikut memanjang — papan kolom di bawah yang
    // scroll sendiri (lihat min-h-0 flex-1 pada wrapper KanbanBoard).
    <div className="flex h-full flex-col gap-6 overflow-hidden p-8">
      {onBack && (
        <button
          onClick={onBack}
          className="flex w-fit shrink-0 items-center gap-2 font-bold text-accent-700 transition-colors hover:text-accent-900"
          title="Kembali ke daftar project"
        >
          <ArrowLeft size={20} />
          <span>Kembali</span>
        </button>
      )}

      <div className="flex shrink-0 items-start justify-between gap-6">
        <div>
          {project && (
            <p className="kicker">
              {project.code} — {project.name}
            </p>
          )}
          <p className="text-project font-bold text-neutral-600">
            {isDone
              ? 'Project sudah selesai. Task lama tetap bisa dibuka dan digeser, tapi task baru tidak bisa ditambah.'
              : 'Lima kolom status. Kartu digeser antar kolom untuk mengubah status.'}
          </p>
        </div>

        {project && (
          <div className="flex shrink-0 items-center gap-3">
            {isDone ? (
              // Project yang sudah selesai hanya ditandai, tidak bisa dibuka lagi dari sini.
              <span className="inline-flex items-center gap-1.5 bg-accent-800 px-2 py-1 text-kicker font-bold text-bg">
                <Check size={14} strokeWidth={3} />
                Sudah selesai
              </span>
            ) : askConfirm ? (
              // Konfirmasi wajib: sekali ditandai selesai, tidak ada tombol untuk
              // membatalkannya — project terkunci dari penambahan task baru.
              <div className="flex items-center gap-3 border-2 border-text bg-accent-100 px-3 py-2">
                <p className="text-kicker font-bold text-text">
                  Tandai selesai? Task baru tidak bisa ditambah lagi, dan ini tidak bisa dibatalkan.
                </p>
                <Button
                  variant="secondary"
                  onClick={() => setAskConfirm(false)}
                  disabled={updateProject.isPending}
                >
                  Batal
                </Button>
                <Button
                  onClick={() => setStatus(PROJECT_STATUS_COMPLETED)}
                  disabled={updateProject.isPending}
                >
                  {updateProject.isPending ? 'Menyimpan...' : 'Ya, selesai'}
                </Button>
              </div>
            ) : (
              <Button onClick={() => setAskConfirm(true)}>
                <span className="flex items-center gap-2">
                  <Check size={16} strokeWidth={3} />
                  Project selesai
                </span>
              </Button>
            )}
          </div>
        )}
      </div>

      {updateProject.error && (
        <p role="alert" className="shrink-0 border-2 border-accent-800 bg-accent-100 px-3 py-2.5 text-kicker font-bold text-accent-800">
          Gagal mengubah status project. Coba lagi.
        </p>
      )}

      <div className="min-h-0 flex-1">
        <KanbanBoard
          tasks={data?.content || []}
          projectId={projectIdNum}
          isProjectDone={isDone}
        />
      </div>

      <p className="shrink-0 text-kicker text-neutral-600">
        Prioritas tinggi berada di atas. Tanggal berwarna menunjukkan urgensi.
      </p>
    </div>
  )
}
