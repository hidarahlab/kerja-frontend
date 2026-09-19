export const TASK_STATUSES = ['backlog', 'todo', 'in_progress', 'review', 'done'] as const
export type TaskStatusKey = (typeof TASK_STATUSES)[number]

export const STATUS_META: Record<TaskStatusKey, { label: string; badgeClass: string; barClass: string }> = {
  backlog: { label: 'Backlog', badgeClass: 'bg-neutral-200 text-neutral-700', barClass: 'bg-neutral-300' },
  todo: { label: 'To Do', badgeClass: 'bg-neutral-500 text-white', barClass: 'bg-neutral-500' },
  in_progress: { label: 'In Progress', badgeClass: 'bg-accent text-white', barClass: 'bg-accent' },
  review: { label: 'Review', badgeClass: 'bg-accent-800 text-white', barClass: 'bg-accent-800' },
  done: { label: 'Done', badgeClass: 'bg-text text-white', barClass: 'bg-text' },
}

export function statusMeta(status: string) {
  return STATUS_META[status as TaskStatusKey] ?? { label: status || '-', badgeClass: 'bg-neutral-200 text-neutral-700', barClass: 'bg-neutral-300' }
}

export const PRIORITY_BORDER: Record<string, string> = {
  Tinggi: 'border-l-accent',
  Sedang: 'border-l-text',
  Rendah: 'border-l-neutral-300',
}

export function priorityBorderClass(priority: string | null | undefined) {
  return PRIORITY_BORDER[priority ?? ''] ?? 'border-l-neutral-300'
}
