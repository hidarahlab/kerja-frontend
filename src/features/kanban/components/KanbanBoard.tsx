import { useState, useMemo } from 'react'
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { useUpdateTask } from '@/shared/hooks/useTasks'
import type { TaskDTO } from '@/shared/api/tasks'
import { KanbanColumn } from './KanbanColumn'
import { KANBAN_COLUMNS } from '../mockData'
import type { Task, TaskStatus } from '../types'

const STATUSES = KANBAN_COLUMNS.map((c) => c.id) as TaskStatus[]

// Backend mengisi assigneeInitials dengan nama lengkap, jadi inisial dibentuk di sini.
function toInitials(name: string | null | undefined) {
  if (!name) return '?'
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('')
}

type KanbanBoardProps = {
  tasks: TaskDTO[]
}

export function KanbanBoard({ tasks: apiTasks }: KanbanBoardProps) {
  const [pendingStatus, setPendingStatus] = useState<Map<number, TaskStatus>>(
    new Map(),
  )
  const updateTask = useUpdateTask()

  const sensors = useSensors(useSensor(PointerSensor))

  const tasks: Task[] = useMemo(
    () =>
      apiTasks.map((t) => ({
        id: String(t.id),
        code: t.code ?? '',
        title: t.title ?? '',
        date: t.dueDate ? new Date(t.dueDate) : new Date(),
        assignee: {
          initials: toInitials(t.assigneeName ?? t.assigneeInitials),
          name: t.assigneeName ?? '',
        },
        status: (pendingStatus.get(t.id) ?? t.status) as TaskStatus,
      })),
    [apiTasks, pendingStatus],
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event
    if (!over) return

    const taskId = Number(active.id)
    const overId = String(over.id)

    // Kartu bisa dijatuhkan di atas kolom (id = status) atau di atas kartu lain
    // (id = task id) — kasus kedua harus dipetakan dulu ke status kolomnya.
    const newStatus = STATUSES.includes(overId as TaskStatus)
      ? (overId as TaskStatus)
      : tasks.find((t) => t.id === overId)?.status

    if (!newStatus) return

    const current = tasks.find((t) => t.id === String(taskId))
    if (!current || current.status === newStatus) return

    setPendingStatus((prev) => new Map(prev).set(taskId, newStatus))

    updateTask.mutate(
      { id: taskId, data: { status: newStatus } },
      {
        onSettled: () => {
          setPendingStatus((prev) => {
            const next = new Map(prev)
            next.delete(taskId)
            return next
          })
        },
      },
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-6 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((column) => (
          <div key={column.id} className="flex-shrink-0 w-72">
            <KanbanColumn
              status={column.id}
              title={column.title}
              tasks={tasks.filter((t) => t.status === column.id)}
            />
          </div>
        ))}
      </div>
    </DndContext>
  )
}
