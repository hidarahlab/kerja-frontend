import { useState } from 'react'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { X, Paperclip, Sun } from 'lucide-react'
import {
  useTask,
  useTaskChecklist,
  useTaskComments,
  useTaskActivities,
  useTaskAttachments,
  useUpdateTask,
} from '@/shared/hooks/useTasks'
import { cn } from '@/shared/lib/cn'
import { Button } from '@/shared/ui/Button'
import { getInitials } from '@/shared/lib/initials'

const STATUS_LABELS: Record<string, string> = {
  backlog: 'Backlog',
  todo: 'Todo',
  in_progress: 'In Progress',
  review: 'Review',
  done: 'Done',
}

type TaskDetailModalProps = {
  isOpen: boolean
  onClose: () => void
  taskId?: number | string
}

export function TaskDetailModal({ isOpen, onClose, taskId }: TaskDetailModalProps) {
  const [newComment, setNewComment] = useState('')
  const [localChecklist, setLocalChecklist] = useState<
    Array<{ id: number; text: string; completed: boolean }>
  >([])

  const taskIdNum = taskId ? Number(taskId) : 0
  const { data: taskData, isPending: isTaskPending } = useTask(taskIdNum)
  const { data: checklistData = [] } = useTaskChecklist(taskIdNum)
  const { data: commentsData = [] } = useTaskComments(taskIdNum)
  const { data: activitiesData = [] } = useTaskActivities(taskIdNum)
  const { data: attachmentsData = [] } = useTaskAttachments(taskIdNum)
  // Satu-satunya perubahan yang boleh dilakukan dari panel ini: menandai My Day.
  // Isi task sengaja tidak bisa diedit dan task tidak bisa dihapus.
  const updateTask = useUpdateTask()

  // Sync checklist dari API ke local state
  if (checklistData.length > 0 && localChecklist.length === 0) {
    setLocalChecklist(
      checklistData.map((item) => ({
        id: item.id,
        text: item.text,
        completed: item.completed,
      })),
    )
  }

  if (!isOpen) return null

  if (isTaskPending && taskIdNum > 0) {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-black/50">
        <div className="w-full sm:w-[500px] h-screen sm:h-[90vh] bg-white border-l-2 border-text flex items-center justify-center">
          <p className="text-body text-neutral-600">Memuat task...</p>
        </div>
      </div>
    )
  }

  if (!taskData) return null

  const completedCount = localChecklist.filter((item) => item.completed).length
  const totalCount = localChecklist.length

  const handleChecklistToggle = (id: number) => {
    setLocalChecklist((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    )
  }

  const isMyDay = taskData.myDay ?? false

  const toggleMyDay = () =>
    updateTask.mutate({ id: taskIdNum, data: { myDay: !isMyDay } })

  const dueDate = taskData.dueDate ? new Date(taskData.dueDate) : null
  const lastActivity = activitiesData[0]
  const lastActivityDate = lastActivity ? new Date(lastActivity.createdAt) : null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end bg-black/50">
      {/* Sidebar modal - slides dari kanan */}
      <div className="w-full sm:w-[500px] h-screen sm:h-[90vh] bg-white border-l-2 border-text overflow-y-auto flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-text p-6 flex items-start justify-between">
          <div className="flex-1">
            {taskData.myDay && taskData.status !== 'done' && (
              <div className="mb-1.5 inline-flex items-center gap-1 bg-accent-100 px-1.5 py-0.5 text-kicker font-bold text-accent-800">
                <Sun size={12} />
                MyDay
              </div>
            )}
            <p className="text-kicker text-neutral-600">{taskData.code}</p>
            <h2 className="mt-1 text-page font-bold">{taskData.title}</h2>
          </div>
          <div className="flex items-start gap-2">
            <button
              onClick={toggleMyDay}
              disabled={updateTask.isPending}
              className={cn(
                'flex items-center gap-1.5 border-2 border-text px-2 py-1 text-kicker font-bold transition-colors',
                'disabled:cursor-not-allowed disabled:opacity-55',
                isMyDay
                  ? 'bg-accent text-bg hover:bg-accent-600'
                  : 'bg-white text-text hover:bg-accent-100',
              )}
              aria-pressed={isMyDay}
              aria-label={isMyDay ? 'Hapus dari My Day' : 'Tandai My Day'}
              title={isMyDay ? 'Hapus dari My Day' : 'Tandai untuk dikerjakan hari ini'}
            >
              <Sun size={14} />
              {isMyDay ? 'My Day' : 'Set My Day'}
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-neutral-100 transition-colors"
              aria-label="Close"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 space-y-6">
          {/* Deskripsi */}
          <div>
            <h3 className="eyebrow text-text mb-2">DESKRIPSI</h3>
            <p className="text-form text-neutral-700">
              {taskData.description || '-'}
            </p>
          </div>

          {/* Checklist */}
          {localChecklist.length > 0 && (
            <div>
              <h3 className="eyebrow text-text mb-2">
                CHECKLIST {completedCount} dari {totalCount} selesai
              </h3>
              <div className="space-y-2">
                {localChecklist.map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-3 cursor-pointer p-2 hover:bg-neutral-50"
                  >
                    <input
                      type="checkbox"
                      checked={item.completed}
                      onChange={() => handleChecklistToggle(item.id)}
                      className="w-4 h-4 border-2 border-text"
                    />
                    <span
                      className={`text-form ${
                        item.completed
                          ? 'line-through text-neutral-500'
                          : 'text-text'
                      }`}
                    >
                      {item.text}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Komentar */}
          <div>
            <h3 className="eyebrow text-text mb-3">
              KOMENTAR ({commentsData.length})
            </h3>
            <div className="space-y-3 mb-4">
              {commentsData.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 bg-neutral-50 border border-divider"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-form font-bold text-text">
                      {comment.authorName}
                    </span>
                    <span className="text-kicker text-neutral-500">
                      {format(new Date(comment.createdAt), 'd MMM, HH:mm', {
                        locale: id,
                      })}
                    </span>
                  </div>
                  <p className="text-form text-neutral-700">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Tulis komentar..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 border-2 border-text px-3 py-2 text-form focus:outline-2 focus:outline-offset-0 focus:outline-accent"
              />
              <Button type="button" disabled={!newComment.trim()}>
                Kirim
              </Button>
            </div>
          </div>

          {/* Status, Kategori, Prioritas, Tenggat */}
          <div className="space-y-3 p-3 bg-neutral-50 border border-divider">
            <div>
              <p className="eyebrow text-neutral-600">STATUS</p>
              <p className="text-form font-bold text-text mt-1">
                {STATUS_LABELS[taskData.status] ?? taskData.status ?? '-'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="eyebrow text-neutral-600">KATEGORI</p>
                <p className="text-form font-bold text-text mt-1">
                  {taskData.category || '-'}
                </p>
              </div>
              <div>
                <p className="eyebrow text-neutral-600">PRIORITAS</p>
                <p className="text-form font-bold text-text mt-1">
                  {taskData.priority || '-'}
                </p>
              </div>
            </div>

            <div>
              <p className="eyebrow text-neutral-600">TENGGAT</p>
              <p className="text-form font-bold text-text mt-1">
                {dueDate ? format(dueDate, 'dd MMM yyyy', { locale: id }) : '-'}
              </p>
            </div>

            <div>
              <p className="eyebrow text-neutral-600">PENANGGUNG JAWAB</p>
              <div className="flex items-center gap-2 mt-2">
                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-kicker font-bold">
                  {getInitials(taskData.assigneeName)}
                </div>
                <div>
                  <p className="text-form font-bold text-text">
                    {taskData.assigneeName || '-'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Lampiran */}
          {attachmentsData.length > 0 && (
            <div>
              <h3 className="eyebrow text-text mb-3">
                LAMPIRAN ({attachmentsData.length})
              </h3>
              <div className="space-y-2 mb-3">
                {attachmentsData.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center gap-2 p-2 border border-divider hover:bg-neutral-50"
                  >
                    <Paperclip size={16} className="text-neutral-600" />
                    <div className="flex-1">
                      <p className="text-form font-bold text-text">
                        {file.fileName}
                      </p>
                      <p className="text-kicker text-neutral-600">
                        {(file.fileSize / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button type="button" variant="outline" className="w-full">
                + Tambah lampiran
              </Button>
            </div>
          )}

          {/* Aktivitas */}
          {activitiesData.length > 0 && (
            <div>
              <h3 className="eyebrow text-text mb-3">AKTIVITAS</h3>
              <div className="space-y-2">
                {activitiesData.map((activity) => (
                  <div key={activity.id} className="text-kicker text-neutral-600">
                    <span className="font-bold text-text">
                      {activity.action}
                    </span>{' '}
                    oleh {activity.userInitials} •{' '}
                    {format(new Date(activity.createdAt), 'd MMM', {
                      locale: id,
                    })}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="border-t-2 border-text p-4 bg-neutral-50 text-kicker text-neutral-600">
          {lastActivityDate
            ? `Terakhir diubah ${format(lastActivityDate, 'd MMM yyyy', {
                locale: id,
              })}`
            : 'Belum ada aktivitas'}
        </div>
      </div>

    </div>
  )
}
