import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { KanbanCard } from './KanbanCard'
import type { Task, TaskStatus } from '../types'

type KanbanColumnProps = {
  status: TaskStatus
  title: string
  tasks: Task[]
}

export function KanbanColumn({ status, title, tasks }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status })

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="eyebrow text-text">{title}</p>
        <p className="text-form font-bold text-neutral-600">{tasks.length}</p>
      </div>

      <div
        ref={setNodeRef}
        className="min-h-[400px] flex flex-col gap-3 border-l-2 border-neutral-300 bg-neutral-50 p-3"
      >
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanCard key={task.id} task={task} />
          ))}
        </SortableContext>

        {tasks.length === 0 ? (
          <p className="text-center text-kicker text-neutral-400 py-8">Kosong</p>
        ) : null}

        <button
          type="button"
          className="mt-auto px-3 py-2 text-kicker font-bold text-accent-700 hover:bg-white transition-colors border-t border-dashed border-neutral-300"
        >
          + Tambah task
        </button>
      </div>
    </div>
  )
}
