import type { Task } from './types'

export const MOCK_TASKS: Task[] = [
  {
    id: '1',
    code: 'WRK-18',
    title: 'Siapkan data penjualan Agustus untuk dashboard',
    date: new Date('2026-08-29'),
    assignee: { initials: 'BS', name: 'Bambang Sutrisno' },
    status: 'todo',
  },
  {
    id: '2',
    code: 'WRK-22',
    title: 'Integrasi laporan marketplace ke satu format',
    date: new Date('2026-09-01'),
    assignee: { initials: 'DA', name: 'Diana Aprianto' },
    status: 'in_progress',
  },
  {
    id: '3',
    code: 'WRK-27',
    title: 'Review draft laporan penjualan semester i',
    date: new Date('2026-08-27'),
    assignee: { initials: 'DA', name: 'Diana Aprianto' },
    status: 'review',
  },
]

export const KANBAN_COLUMNS = [
  { id: 'backlog' as const, title: 'BACKLOG', taskCount: 0 },
  { id: 'todo' as const, title: 'TO DO', taskCount: 1 },
  { id: 'in_progress' as const, title: 'IN PROGRESS', taskCount: 1 },
  { id: 'review' as const, title: 'REVIEW', taskCount: 1 },
  { id: 'done' as const, title: 'DONE', taskCount: 0 },
]
