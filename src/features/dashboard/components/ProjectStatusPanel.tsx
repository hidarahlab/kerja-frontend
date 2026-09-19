import { cn } from '@/shared/lib/cn'
import { TASK_STATUSES, statusMeta } from '../statusMeta'
import type { ProjectBreakdown } from '../dashboardData'

type ProjectStatusPanelProps = {
  breakdown: ProjectBreakdown[]
  totalCounts: Record<string, number>
  selectedProjectId: number | null
  onSelectProject: (projectId: number | null) => void
}

export function ProjectStatusPanel({
  breakdown,
  totalCounts,
  selectedProjectId,
  onSelectProject,
}: ProjectStatusPanelProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden border border-divider">
      <div className="flex shrink-0 items-start justify-between gap-4 border-b border-divider p-6">
        <div>
          <h2 className="text-page font-bold">Status task per project</h2>
          <p className="mt-1 text-kicker text-neutral-600">
            Klik baris project untuk memfilter My Day.
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-screen font-extrabold text-text">{breakdown.length}</p>
          <p className="eyebrow text-neutral-600">Project</p>
        </div>
      </div>

      <div className="flex shrink-0 flex-wrap gap-x-4 gap-y-1.5 border-b border-divider p-4 text-kicker">
        {TASK_STATUSES.map((status) => {
          const meta = statusMeta(status)
          return (
            <span key={status} className="flex items-center gap-1.5">
              <span className={cn('size-2.5', meta.barClass)} />
              <span className="text-neutral-600">{meta.label}</span>
              <span className="font-bold text-text">{totalCounts[status] ?? 0}</span>
            </span>
          )
        })}
      </div>

      <div className="min-h-0 flex-1 divide-y divide-divider overflow-y-auto">
        {breakdown.length === 0 ? (
          <p className="p-6 text-body text-neutral-500">Belum ada project.</p>
        ) : (
          breakdown.map((project) => {
            const isSelected = selectedProjectId === project.projectId

            return (
              <button
                key={project.projectId}
                type="button"
                onClick={() => onSelectProject(isSelected ? null : project.projectId)}
                className={cn(
                  'w-full p-4 text-left transition-colors hover:bg-accent-100/40',
                  isSelected && 'bg-accent-100',
                )}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="border border-text px-1.5 py-0.5 text-kicker font-bold">
                      {project.projectCode}
                    </span>
                    <span className="text-form font-extrabold text-text">{project.projectName}</span>
                  </div>
                  <span className="shrink-0 text-kicker font-bold text-neutral-600">
                    {project.total} TASK · {project.doneCount} DONE · {project.progressPercent}%
                  </span>
                </div>

                {project.total > 0 && (
                  <div className="mt-3 flex h-3 w-full overflow-hidden bg-neutral-200">
                    {TASK_STATUSES.map((status) => {
                      const count = project.counts[status]
                      if (count === 0) return null
                      const meta = statusMeta(status)
                      return (
                        <div
                          key={status}
                          className={meta.barClass}
                          style={{ width: `${(count / project.total) * 100}%` }}
                          title={`${meta.label}: ${count}`}
                        />
                      )
                    })}
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between text-kicker text-neutral-600">
                  <span>
                    {TASK_STATUSES.map((s) => `${statusMeta(s).label} ${project.counts[s]}`).join(' · ')}
                  </span>
                  <span className={cn('shrink-0 font-bold', project.overdueCount > 0 ? 'text-accent-800' : 'text-neutral-500')}>
                    {project.overdueCount > 0 ? `${project.overdueCount} lewat tenggat` : 'Aman'}
                  </span>
                </div>
              </button>
            )
          })
        )}
      </div>

      <div className="grid shrink-0 grid-cols-5 border-t border-divider">
        {TASK_STATUSES.map((status, i) => (
          <div key={status} className={cn('p-[5px] text-center', i > 0 && 'border-l border-divider')}>
            <p className="text-page font-extrabold text-text">{totalCounts[status] ?? 0}</p>
            <p className="eyebrow text-neutral-600">{statusMeta(status).label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
