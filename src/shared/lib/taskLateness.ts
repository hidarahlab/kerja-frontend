import { differenceInCalendarDays, startOfDay } from 'date-fns'

type LatenessInput = {
  status: string
  dueDate: string | null
  completedAt?: string | null
}

/**
 * "Telat X hari" untuk task aktif yang tenggatnya sudah lewat, "Terlambat X
 * hari" untuk task Done yang baru selesai setelah tenggatnya lewat. Null kalau
 * tidak telat sama sekali (termasuk task tanpa tenggat).
 */
export function taskLatenessLabel(task: LatenessInput, today: Date = new Date()): string | null {
  if (!task.dueDate) return null

  if (task.status === 'done') {
    if (!task.completedAt) return null
    const diff = differenceInCalendarDays(
      startOfDay(new Date(task.completedAt)),
      startOfDay(new Date(task.dueDate)),
    )
    return diff > 0 ? `Terlambat ${diff} hari` : null
  }

  const diff = differenceInCalendarDays(startOfDay(new Date(task.dueDate)), startOfDay(today))
  return diff < 0 ? `Telat ${Math.abs(diff)} hari` : null
}
