import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { Check } from 'lucide-react'
import { ProgressBar } from '@/shared/ui/ProgressBar'
import { AvatarStack } from '@/shared/ui/AvatarStack'
import { isProjectCompleted } from '@/shared/lib/projectStatus'
import type { Project } from '../types'

type ProjectRowProps = {
  project: Project
  onClick?: () => void
}

export function ProjectRow({ project, onClick }: ProjectRowProps) {
  const isDone = isProjectCompleted(project.status)

  return (
    <tr className="border-b border-divider hover:bg-accent-100 cursor-pointer" onClick={onClick}>
      <td className="px-6 py-4">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-form font-extrabold text-text">{project.name}</p>
            {isDone && (
              <span className="inline-flex shrink-0 items-center gap-1 bg-accent-800 px-1.5 py-0.5 text-kicker font-bold text-bg">
                <Check size={12} strokeWidth={3} />
                Sudah selesai
              </span>
            )}
          </div>
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
