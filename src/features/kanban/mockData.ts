export const KANBAN_COLUMNS = [
  { id: 'backlog' as const, title: 'BACKLOG', taskCount: 0 },
  { id: 'todo' as const, title: 'TO DO', taskCount: 1 },
  { id: 'in_progress' as const, title: 'IN PROGRESS', taskCount: 1 },
  { id: 'review' as const, title: 'REVIEW', taskCount: 1 },
  { id: 'done' as const, title: 'DONE', taskCount: 0 },
]
