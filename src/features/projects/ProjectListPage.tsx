import { useProjects } from '@/shared/hooks/useProjects'
import { ProjectTable } from './components/ProjectTable'
import type { Project } from './types'

type ProjectListPageProps = {
  onSelectProject?: (projectId: string) => void
}

export function ProjectListPage({ onSelectProject }: ProjectListPageProps) {
  // isPending, bukan isLoading: isLoading ikut mati di sela-sela retry sehingga
  // tabel sempat ter-render kosong seolah-olah datanya memang tidak ada.
  const { data, isPending, isError, error } = useProjects(0, 100)

  const projects: Project[] = (data?.content ?? []).map((p) => ({
    id: String(p.id),
    code: p.code ?? '',
    name: p.name ?? '',
    description: p.description ?? '',
    category: p.category ?? '',
    progress: p.progress ?? 0,
    // deadline boleh null di backend — jangan sampai jadi Invalid Date saat diformat.
    deadline: p.deadline ? new Date(p.deadline) : new Date(),
    assignees: (p.assignees ?? []).map((a) => ({
      name: a.name,
      initials: a.initials,
    })),
  }))

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-body text-neutral-600">Memuat project...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8">
        <p className="text-body font-bold text-red-600">Gagal memuat project.</p>
        <p className="text-kicker text-neutral-600">{String(error)}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <p className="text-project font-bold text-neutral-600">
          Pilih project untuk membuka papan kanban-nya.
        </p>
      </div>

      <ProjectTable projects={projects} onSelectProject={onSelectProject} />

      <p className="mt-4 text-kicker text-neutral-600">
        Akses hanya untuk staf internal. Hubungi admin IT bila ada pertanyaan.
      </p>
    </div>
  )
}
