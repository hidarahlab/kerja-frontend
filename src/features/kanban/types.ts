export type TaskStatus = 'backlog' | 'todo' | 'in_progress' | 'review' | 'done'

export type Task = {
  id: string
  code: string
  title: string
  date: Date
  assignee: { initials: string; name: string }
  status: TaskStatus
}

export type Column = {
  id: TaskStatus
  title: string
  taskCount: number
}
