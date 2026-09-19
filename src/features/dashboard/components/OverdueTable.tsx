import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { cn } from '@/shared/lib/cn'
import type { TaskDTO } from '@/shared/api/tasks'
import { daysUntilDue } from '../dashboardData'
import { statusMeta, priorityBorderClass } from '../statusMeta'

type OverdueTableProps = {
  tasks: TaskDTO[]
  projectNameById: Map<number, string>
  /** Diklik untuk pindah ke papan kanban project si task. */
  onOpenTask: (task: TaskDTO) => void
}

export function OverdueTable({ tasks, projectNameById, onOpenTask }: OverdueTableProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden border border-divider">
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-divider p-6">
        <div>
          <h2 className="text-page font-bold">Lewat tenggat</h2>
          <p className="mt-1 text-kicker text-neutral-600">
            Task yang tanggal tenggatnya sudah terlewat dan belum selesai.
          </p>
        </div>
        <span className="shrink-0 text-kicker font-bold text-accent-800">
          {tasks.length} TASK TERLAMBAT
        </span>
      </div>

      {tasks.length === 0 ? (
        <p className="p-6 text-body text-neutral-500">Tidak ada task yang lewat tenggat. Aman.</p>
      ) : (
        <div className="min-h-0 flex-1 overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 z-10">
              <tr className="border-b border-text bg-surface">
                <th className="px-6 py-3 text-left eyebrow text-text">Task</th>
                <th className="px-6 py-3 text-left eyebrow text-text">Project</th>
                <th className="px-6 py-3 text-left eyebrow text-text">Status</th>
                <th className="px-6 py-3 text-left eyebrow text-text">Tenggat</th>
                <th className="px-6 py-3 text-right eyebrow text-text">Terlambat</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const meta = statusMeta(task.status)
                const late = Math.abs(daysUntilDue(task.dueDate))

                return (
                  <tr
                    key={task.id}
                    className="cursor-pointer border-b border-divider hover:bg-accent-100"
                    onClick={() => onOpenTask(task)}
                  >
                    <td className={cn('border-l-4 px-6 py-4', priorityBorderClass(task.priority))}>
                      <p className="text-form font-extrabold text-text">{task.title}</p>
                      <p className="mt-0.5 text-kicker text-neutral-600">
                        {task.code} · {task.assigneeName || 'Belum ada penanggung jawab'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-form text-neutral-700">
                      {projectNameById.get(task.projectId) ?? '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn('px-1.5 py-0.5 text-kicker font-bold', meta.badgeClass)}>
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-text">
                      {format(new Date(task.dueDate), 'd MMM', { locale: idLocale })}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-accent-800">{late} hari</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
