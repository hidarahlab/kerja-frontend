import { useTaskChecklist } from '@/shared/hooks/useTasks'
import { ProgressBar } from '@/shared/ui/ProgressBar'

/** Tidak ada endpoint agregat, jadi checklist tiap task diambil satu-satu.
 * Aman untuk skala dashboard ini (puluhan task), tapi kalau task per company
 * jadi ratusan/ribuan, ini sebaiknya diganti endpoint yang sudah membawa
 * ringkasan checklist per task. */
export function ChecklistProgress({ taskId }: { taskId: number }) {
  const { data: checklist = [] } = useTaskChecklist(taskId)

  if (checklist.length === 0) return null

  const completed = checklist.filter((item) => item.completed).length

  return (
    <div className="mt-1.5 flex items-center gap-2">
      <span className="shrink-0 text-kicker text-neutral-600">
        {completed}/{checklist.length} checklist
      </span>
      <ProgressBar value={completed} max={checklist.length} className="max-w-[120px]" />
    </div>
  )
}
