import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { cn } from '@/shared/lib/cn'
import type { Task } from '../types'

type KanbanCardProps = {
  task: Task
}

export function KanbanCard({ task }: KanbanCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        'cursor-grab border-2 border-text bg-white p-3 active:cursor-grabbing',
        'hover:shadow-md transition-shadow',
      )}
    >
      <p className="text-form font-extrabold text-text">{task.title}</p>
      <p className="mt-1 text-kicker text-neutral-600">{task.code}</p>
      <div className="mt-3 flex items-center justify-between">
        <p className="text-kicker text-neutral-600">
          {task.date.getDate()} {task.date.toLocaleString('id-ID', { month: 'short' })}
        </p>
        <div className="flex size-6 items-center justify-center bg-accent text-bg text-kicker font-bold">
          {task.assignee.initials}
        </div>
      </div>
    </div>
  )
}
