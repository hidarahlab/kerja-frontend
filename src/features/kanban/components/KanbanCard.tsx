import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Sun } from 'lucide-react'
import { cn } from '@/shared/lib/cn'
import type { Task } from '../types'

type KanbanCardProps = {
  task: Task
  onTaskClick?: (taskId: string) => void
}

export function KanbanCard({ task, onTaskClick }: KanbanCardProps) {
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
      onClick={() => onTaskClick?.(task.id)}
      className={cn(
        'cursor-grab border-2 border-text bg-white p-3 active:cursor-grabbing',
        'hover:shadow-md transition-shadow',
        !isDragging && 'hover:border-accent-700',
      )}
    >
      {task.myDay && task.status !== 'done' && (
        <div className="mb-1.5 inline-flex items-center gap-1 bg-accent-100 px-1.5 py-0.5 text-kicker font-bold text-accent-800">
          <Sun size={12} />
          MyDay
        </div>
      )}
      <p className="text-form font-extrabold text-text">{task.title}</p>
      <p className="mt-1 text-kicker text-neutral-600">{task.code}</p>
      {task.lateLabel && (
        <p className="mt-1 text-kicker font-bold text-accent-800">{task.lateLabel}</p>
      )}
      <div className="mt-3 flex items-center justify-between">
        <p className="text-kicker text-neutral-600">
          {task.date.getDate()} {task.date.toLocaleString('id-ID', { month: 'short' })}
        </p>
        <div className="flex size-6 items-center justify-center rounded-full bg-accent text-bg text-kicker font-bold">
          {task.assignee.initials}
        </div>
      </div>
    </div>
  )
}
