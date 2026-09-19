import { differenceInCalendarDays, startOfDay } from 'date-fns'
import type { TaskDTO } from '@/shared/api/tasks'
import type { ProjectDTO } from '@/shared/api/projects'
import { TASK_STATUSES, type TaskStatusKey } from './statusMeta'

/** Task dianggap lewat tenggat kalau tenggatnya sudah lewat dan belum Done. */
export function isOverdue(task: TaskDTO, today: Date = new Date()): boolean {
  if (!task.dueDate || task.status === 'done') return false
  return startOfDay(new Date(task.dueDate)) < startOfDay(today)
}

/** Selisih hari dari hari ini ke tenggat: negatif = sudah lewat, positif = masih ada waktu. */
export function daysUntilDue(dueDate: string, today: Date = new Date()): number {
  return differenceInCalendarDays(startOfDay(new Date(dueDate)), startOfDay(today))
}

/** "3 hari lewat" / "Hari ini" / "sisa 3 hari" — dipakai di baris My Day. */
export function relativeDueLabel(dueDate: string, today: Date = new Date()): string {
  const diff = daysUntilDue(dueDate, today)
  if (diff < 0) return `${Math.abs(diff)} hari lewat`
  if (diff === 0) return 'Hari ini'
  return `sisa ${diff} hari`
}

export type ProjectBreakdown = {
  projectId: number
  projectCode: string
  projectName: string
  counts: Record<TaskStatusKey, number>
  total: number
  doneCount: number
  overdueCount: number
  /** Persen task berstatus done dari total task project ini, dibulatkan. 0 kalau belum ada task. */
  progressPercent: number
}

/** Menghitung task per status untuk tiap project — dasar panel "Status task per project". */
export function buildProjectBreakdown(
  tasks: TaskDTO[],
  projects: ProjectDTO[],
  today: Date = new Date(),
): ProjectBreakdown[] {
  return projects.map((project) => {
    const projectTasks = tasks.filter((t) => t.projectId === project.id)
    const counts = TASK_STATUSES.reduce(
      (acc, status) => {
        acc[status] = projectTasks.filter((t) => t.status === status).length
        return acc
      },
      {} as Record<TaskStatusKey, number>,
    )

    const total = projectTasks.length

    return {
      projectId: project.id,
      projectCode: project.code,
      projectName: project.name,
      counts,
      total,
      doneCount: counts.done,
      overdueCount: projectTasks.filter((t) => isOverdue(t, today)).length,
      progressPercent: total === 0 ? 0 : Math.round((counts.done / total) * 100),
    }
  })
}

/** Total per status lintas semua project — dipakai legenda & 5 kotak ringkasan. */
export function totalCountsByStatus(tasks: TaskDTO[]): Record<TaskStatusKey, number> {
  return TASK_STATUSES.reduce(
    (acc, status) => {
      acc[status] = tasks.filter((t) => t.status === status).length
      return acc
    },
    {} as Record<TaskStatusKey, number>,
  )
}

/** Task yang ditandai MyDay dan belum Done — badge/penandanya sendiri sudah
 * mengikuti aturan ini di kanban, jadi panel dashboard konsisten dengan itu.
 * Diurutkan tenggat paling dekat/lewat duluan; task tanpa tenggat ditaruh di akhir. */
export function myDayTasks(tasks: TaskDTO[]): TaskDTO[] {
  const filtered = tasks.filter((t) => t.myDay && t.status !== 'done')

  return [...filtered].sort((a, b) => {
    if (!a.dueDate) return 1
    if (!b.dueDate) return -1
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  })
}

/** Task lewat tenggat, diurutkan yang paling lama terlambat duluan. */
export function overdueTasks(tasks: TaskDTO[], today: Date = new Date()): TaskDTO[] {
  return tasks
    .filter((t) => isOverdue(t, today))
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
}
