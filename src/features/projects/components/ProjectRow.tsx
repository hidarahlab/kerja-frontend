import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { AvatarStack } from '@/shared/ui/AvatarStack'
import type { Project } from '../types'

type ProjectRowProps = {
  project: Project
}

export function ProjectRow({ project }: ProjectRowProps) {
  return (
    <tr className="border-b border-divider hover:bg-accent-100">
      <td className="px-6 py-4">
        <div>
          <p className="text-form font-extrabold text-text">{project.name}</p>
          <p className="mt-0.5 text-kicker text-neutral-600">{project.description}</p>
        </div>
      </td>
      <td className="px-6 py-4">
        <p className="mb-2 text-kicker font-bold text-neutral-700">{project.progress}%</p>
        <ProgressBar value={project.progress} max={100} />
      </td>
      <td className="px-6 py-4">
        <AvatarStack initials={project.assignees.map((a) => a.initials)} />
      </td>
      <td className="px-6 py-4 text-right">
        <p className="font-bold text-text">
          {format(project.deadline, 'd MMM yyyy', { locale: idLocale })}
        </p>
      </td>
    </tr>
  )
}
