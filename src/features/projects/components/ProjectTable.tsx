import { ProjectRow } from './ProjectRow'
import type { Project } from '../types'

type ProjectTableProps = {
  projects: Project[]
  onSelectProject?: (projectId: string) => void
}

export function ProjectTable({ projects, onSelectProject }: ProjectTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-text bg-surface">
            <th className="px-6 py-3 text-left eyebrow text-text">PROJECT</th>
            <th className="px-6 py-3 text-left eyebrow text-text">PROGRESS</th>
            <th className="px-6 py-3 text-left eyebrow text-text">ANGGOTA</th>
            <th className="px-6 py-3 text-right eyebrow text-text">TENGGAT</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <ProjectRow key={project.id} project={project} onClick={() => onSelectProject?.(project.id)} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
