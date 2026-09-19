import { useState } from 'react'
import { useProjectsByCompany } from '@/shared/hooks/useProjects'
import { useCompanyId } from '@/shared/hooks/useCompany'
import { ProjectTable } from './components/ProjectTable'
import { CreateProjectModal } from './components/CreateProjectModal'
import { Button } from '@/shared/ui/Button'
import type { Project } from './types'

type ProjectListPageProps = {
  onSelectProject?: (projectId: string) => void
}

export function ProjectListPage({ onSelectProject }: ProjectListPageProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)

  // Project disaring per perusahaan pengguna. Sebelumnya memakai getAll(), yang
  // menampilkan project semua perusahaan ke siapa pun yang login.
  const {
    companyId,
    companyName,
    isPending: isCompanyPending,
    isError: isCompanyError,
  } = useCompanyId()

  // isPending, bukan isLoading: isLoading ikut mati di sela-sela retry sehingga
  // tabel sempat ter-render kosong seolah-olah datanya memang tidak ada.
  const { data, isPending, isError, error } = useProjectsByCompany(companyId ?? 0, 0, 100)

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
    status: p.status ?? '',
  }))

  if (isCompanyPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-body text-neutral-600">Memuat data perusahaan...</p>
      </div>
    )
  }

  // Tanpa perusahaan, tidak ada project yang boleh ditampilkan — menampilkan
  // semuanya justru membocorkan project perusahaan lain.
  if (isCompanyError || !companyId) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8">
        <p className="text-body font-bold text-red-600">
          Perusahaan Anda tidak dikenali.
        </p>
        <p className="text-kicker text-neutral-600">
          Silakan keluar lalu masuk kembali. Bila tetap muncul, hubungi admin IT.
        </p>
      </div>
    )
  }

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
    <>
      <div className="flex flex-col gap-6 p-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-project font-bold text-neutral-600">
              Pilih project untuk membuka papan kanban-nya.
            </p>
            {companyName && (
              <p className="mt-1 text-kicker text-neutral-600">{companyName}</p>
            )}
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            + Project baru
          </Button>
        </div>

        <ProjectTable projects={projects} onSelectProject={onSelectProject} />

        <p className="mt-4 text-kicker text-neutral-600">
          Akses hanya untuk staf internal. Hubungi admin IT bila ada pertanyaan.
        </p>
      </div>

      <CreateProjectModal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} />
    </>
  )
}
