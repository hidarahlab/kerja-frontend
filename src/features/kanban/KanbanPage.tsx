import { useTasks } from '@/shared/hooks/useTasks'
import { KanbanBoard } from './components/KanbanBoard'

type KanbanPageProps = {
  projectId?: string
}

export function KanbanPage({ projectId }: KanbanPageProps) {
  const { data, isPending, isError, error } = useTasks(0, 100)

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-body text-neutral-600">Memuat task...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8">
        <p className="text-body font-bold text-red-600">Gagal memuat task.</p>
        <p className="text-kicker text-neutral-600">{String(error)}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 p-8">
      <div>
        <p className="text-project font-bold text-neutral-600">
          Lima kolom status. Kartu digeser antar kolom untuk mengubah status.
        </p>
      </div>

      <KanbanBoard tasks={data?.content || []} />

      <p className="mt-4 text-kicker text-neutral-600">
        Prioritas tinggi berada di atas. Tanggal berwarna menunjukkan urgensi.
      </p>
    </div>
  )
}
