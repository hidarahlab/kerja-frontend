import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from './KanbanCard'
import type { Task, TaskStatus } from '../types'

type KanbanColumnProps = {
  status: TaskStatus
  title: string
  tasks: Task[]
  /**
   * Kolom tempat task baru dibuat — hanya Backlog. Kolom lain diisi dengan
   * menggeser kartu, bukan membuat task langsung di sana.
   */
  isCreateColumn?: boolean
  /** Project yang sudah selesai tidak bisa ditambahi task baru. */
  isProjectDone?: boolean
  onAddTaskClick?: () => void
  onTaskClick?: (taskId: string) => void
}

export function KanbanColumn({
  status,
  title,
  tasks,
  isCreateColumn = false,
  isProjectDone = false,
  onAddTaskClick,
  onTaskClick,
}: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status })

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="shrink-0">
        <p className="eyebrow text-text">{title}</p>
        <p className="text-form font-bold text-neutral-600">{tasks.length}</p>
      </div>

      {/* border-l-2/bg dipindah ke wrapper ini supaya tetap membungkus tombol
          "+ Tambah task" walau tombolnya sendiri sudah di luar area scroll. */}
      <div className="flex min-h-0 flex-1 flex-col border-l-2 border-neutral-300 bg-neutral-50">
        <div
          ref={setNodeRef}
          className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3"
        >
          <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
            {tasks.map((task) => (
              <KanbanCard key={task.id} task={task} onTaskClick={onTaskClick} />
            ))}
          </SortableContext>

          {tasks.length === 0 ? (
            <p className="text-center text-kicker text-neutral-400 py-8">Kosong</p>
          ) : null}
        </div>

        {/* Hanya kolom Backlog yang punya area ini — kolom lain sengaja kosong
            supaya jelas task masuk lewat Backlog lalu digeser ke kanan. */}
        {isCreateColumn &&
          (isProjectDone ? (
            <p className="shrink-0 border-t border-dashed border-neutral-300 px-3 py-2 text-center text-kicker text-neutral-500">
              Project sudah selesai
            </p>
          ) : (
            <button
              type="button"
              onClick={onAddTaskClick}
              className="shrink-0 px-3 py-2 text-kicker font-bold text-accent-700 hover:bg-white transition-colors border-t border-dashed border-neutral-300"
            >
              + Tambah task
            </button>
          ))}
      </div>
    </div>
  )
}
