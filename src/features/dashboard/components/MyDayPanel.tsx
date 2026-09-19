import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { cn } from '@/shared/lib/cn'
import type { TaskDTO } from '@/shared/api/tasks'
import { myDayTasks, relativeDueLabel } from '../dashboardData'
import { statusMeta, priorityBorderClass } from '../statusMeta'
import { ChecklistProgress } from './ChecklistProgress'

type MyDayPanelProps = {
  tasks: TaskDTO[]
  filterProjectId: number | null
  projectNameById: Map<number, string>
  /** Diklik untuk pindah ke papan kanban project si task, bukan buka detailnya di sini. */
  onOpenTask: (task: TaskDTO) => void
}

export function MyDayPanel({ tasks, filterProjectId, projectNameById, onOpenTask }: MyDayPanelProps) {
  const items = myDayTasks(tasks).filter(
    (t) => filterProjectId == null || t.projectId === filterProjectId,
  )

  return (
    <div className="flex h-full flex-col overflow-hidden border border-divider">
      <div className="shrink-0 border-b border-divider p-6">
        <h2 className="text-page font-bold">My Day</h2>
        <p className="mt-1 text-kicker text-neutral-600">
          Task yang ditandai My Day, dari semua project.
        </p>
      </div>

      <div className="min-h-0 flex-1 divide-y divide-divider overflow-y-auto">
        {items.length === 0 ? (
          <p className="p-6 text-body text-neutral-500">
            {filterProjectId == null
              ? 'Belum ada task yang ditandai My Day.'
              : 'Tidak ada task My Day untuk project ini.'}
          </p>
        ) : (
          items.map((task) => {
            const meta = statusMeta(task.status)
            const dueLabel = task.dueDate ? relativeDueLabel(task.dueDate) : null
            const isLate = task.dueDate ? dueLabel?.endsWith('lewat') : false

            return (
              <div
                key={task.id}
                className={cn(
                  'flex gap-3 border-l-4 p-4 hover:bg-accent-100/40 cursor-pointer',
                  priorityBorderClass(task.priority),
                )}
                onClick={() => onOpenTask(task)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-form font-extrabold text-text">{task.title}</p>
                    {task.dueDate && (
                      <div className="shrink-0 text-right">
                        <p className="text-kicker font-bold text-text">
                          {format(new Date(task.dueDate), 'd MMM', { locale: idLocale })}
                        </p>
                        <p className={cn('text-kicker', isLate ? 'text-accent-800 font-bold' : 'text-neutral-500')}>
                          {dueLabel}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mt-1.5 flex flex-wrap items-center gap-2 text-kicker text-neutral-600">
                    {task.category && (
                      <span className="border border-text px-1.5 py-0.5 font-bold">{task.category}</span>
                    )}
                    <span>
                      {task.code} · {projectNameById.get(task.projectId) ?? 'Project tidak diketahui'} ·{' '}
                      {task.assigneeName || 'Belum ada penanggung jawab'}
                    </span>
                  </div>

                  <ChecklistProgress taskId={task.id} />

                  <div className="mt-2 flex justify-end">
                    <span className={cn('px-1.5 py-0.5 text-kicker font-bold', meta.badgeClass)}>
                      {meta.label}
                    </span>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="flex shrink-0 items-center gap-4 border-t border-divider p-4 text-kicker text-neutral-600">
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 bg-accent" /> Prioritas tinggi
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 bg-text" /> Sedang
        </span>
        <span className="flex items-center gap-1.5">
          <span className="size-2.5 bg-neutral-300" /> Rendah
        </span>
      </div>
    </div>
  )
}
