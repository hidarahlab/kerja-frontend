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
import { getInitials } from '@/shared/lib/initials'
import { taskLatenessLabel } from '@/shared/lib/taskLateness'
import { KanbanColumn } from './KanbanColumn'
import { TaskFormModal } from './TaskFormModal'
import { TaskDetailModal } from './TaskDetailModal'
import { KANBAN_COLUMNS } from '../mockData'
import type { Task, TaskStatus } from '../types'

const STATUSES = KANBAN_COLUMNS.map((c) => c.id) as TaskStatus[]

/**
 * Task baru hanya dibuat dari kolom Backlog; kolom lain diisi dengan menggeser
 * kartu. Jadi setiap task selalu punya titik masuk yang sama.
 */
const CREATE_COLUMN: TaskStatus = 'backlog'

type KanbanBoardProps = {
  tasks: TaskDTO[]
  projectId: number
  /** Project yang sudah selesai tidak boleh ditambahi task baru — tombol tambah disembunyikan. */
  isProjectDone?: boolean
}

export function KanbanBoard({ tasks: apiTasks, projectId, isProjectDone = false }: KanbanBoardProps) {
  const [pendingStatus, setPendingStatus] = useState<Map<number, TaskStatus>>(
    new Map(),
  )
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null)
  const updateTask = useUpdateTask()

  // distance: 8 — gerakan di bawah 8px dianggap klik, bukan drag. Tanpa ini
  // kartu tidak bisa dibedakan antara "diklik untuk buka detail" dan "digeser
  // ke kolom lain", karena keduanya sama-sama mulai dari pointerdown.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
  )

  const tasks: Task[] = useMemo(
    () =>
      apiTasks.map((t) => ({
        id: String(t.id),
        code: t.code ?? '',
        title: t.title ?? '',
        date: t.dueDate ? new Date(t.dueDate) : new Date(),
        assignee: {
          initials: getInitials(t.assigneeName ?? t.assigneeInitials),
          name: t.assigneeName ?? '',
        },
        status: (pendingStatus.get(t.id) ?? t.status) as TaskStatus,
        myDay: t.myDay ?? false,
        // Dihitung dari status/completedAt asli dari server, bukan status
        // optimistik saat drag — completedAt baru terisi setelah server
        // membalas, jadi label ikut status yang sama supaya tidak salah cocok.
        lateLabel: taskLatenessLabel({
          status: t.status,
          dueDate: t.dueDate,
          completedAt: t.completedAt,
        }),
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
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
      >
        <div className="flex h-full gap-6 overflow-x-auto pb-4">
          {KANBAN_COLUMNS.map((column) => (
            <div key={column.id} className="h-full w-72 flex-shrink-0">
              <KanbanColumn
                status={column.id}
                title={column.title}
                tasks={tasks.filter((t) => t.status === column.id)}
                isCreateColumn={column.id === CREATE_COLUMN}
                isProjectDone={isProjectDone}
                onAddTaskClick={() => setIsAddModalOpen(true)}
                onTaskClick={(taskId) => {
                  setSelectedTaskId(taskId)
                  setIsDetailModalOpen(true)
                }}
              />
            </div>
          ))}
        </div>
      </DndContext>

      <TaskFormModal
        isOpen={isAddModalOpen}
        defaultStatus={CREATE_COLUMN}
        projectId={projectId}
        onClose={() => setIsAddModalOpen(false)}
      />

      <TaskDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        taskId={selectedTaskId ? Number(selectedTaskId) : undefined}
      />
    </>
  )
}
