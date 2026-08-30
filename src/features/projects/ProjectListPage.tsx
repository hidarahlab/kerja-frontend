import { ProjectTable } from './components/ProjectTable'
import { MOCK_PROJECTS } from './mockData'

export function ProjectListPage() {
  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <p className="text-project font-bold text-neutral-600">
          Pilih project untuk membuka papan kanban-nya.
        </p>
      </div>

      <ProjectTable projects={MOCK_PROJECTS} />

      <p className="mt-4 text-kicker text-neutral-600">
        Akses hanya untuk staf internal. Hubungi admin IT bila ada pertanyaan.
      </p>
    </div>
  )
}
