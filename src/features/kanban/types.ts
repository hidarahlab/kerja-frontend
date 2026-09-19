export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'

export type Task = {
  id: string
  code: string
  title: string
  date: Date
  assignee: { initials: string; name: string }
  status: TaskStatus
  myDay: boolean
  /** "Telat X hari" / "Terlambat X hari" — null kalau tidak telat. Dihitung
   * sekali di KanbanBoard dari data API, lihat src/shared/lib/taskLateness.ts. */
  lateLabel: string | null
}

export type Column = {
  id: TaskStatus
  title: string
  taskCount: number
}
