import { useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCreateTask, useUpdateTask, useTask } from '@/shared/hooks/useTasks'
import { projectsApi } from '@/shared/api/projects'
import { Button } from '@/shared/ui/Button'
import { Field, Input } from '@/shared/ui/Field'
import type { TaskStatus } from '../types'

// Semua field wajib diisi kecuali MyDay dan Deskripsi — MyDay itu penanda
// pilihan (bukan isi task), dan Deskripsi boleh menyusul belakangan.
const taskFormSchema = z.object({
  title: z.string().min(1, 'Judul task wajib diisi').max(80, 'Maksimal 80 karakter'),
  description: z.string().optional().default(''),
  status: z.enum(['backlog', 'todo', 'in_progress', 'review', 'done']),
  category: z.string().min(1, 'Kategori wajib dipilih'),
  priority: z.string().min(1, 'Prioritas wajib dipilih'),
  // Dropdown mengirim null saat belum dipilih (lihat setValueAs pada register).
  assigneeId: z
    .number()
    .nullable()
    .refine((value) => value != null, 'Penanggung jawab wajib dipilih'),
  dueDate: z.string().min(1, 'Tenggat wajib diisi'),
  myDay: z.boolean().optional().default(false),
})

type TaskFormData = z.infer<typeof taskFormSchema>

type TaskFormModalProps = {
  isOpen: boolean
  projectId: number
  onClose: () => void
  /** Status awal untuk task baru, dari kolom yang diklik. Diabaikan saat mengedit. */
  defaultStatus?: TaskStatus
  /** Saat diisi, modal memuat task ini dan berpindah ke mode edit alih-alih membuat baru. */
  taskId?: number
}

/** Dipakai baik untuk membuat task baru maupun mengedit yang sudah ada, supaya
 * kedua tampilan dijamin selalu identik — hanya sumber data dan aksi submit-nya
 * yang beda. */
export function TaskFormModal({
  isOpen,
  projectId,
  onClose,
  defaultStatus = 'backlog',
  taskId,
}: TaskFormModalProps) {
  const isEditMode = taskId != null
  const modalRef = useRef<HTMLDivElement>(null)
  // Tenggat tidak boleh dipilih mundur ke masa lalu — task yang sudah lewat
  // tenggat sebelum form ini dibuka tetap tampil apa adanya (min hanya
  // membatasi pilihan BARU lewat date picker, bukan nilai yang sudah ada).
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const createTask = useCreateTask()
  const updateTask = useUpdateTask()
  const mutation = isEditMode ? updateTask : createTask

  const { data: existingTask, isPending: isTaskPending } = useTask(taskId ?? 0)

  // Kandidat penanggung jawab task di project ini — karyawan aktif perusahaan
  // pemilik project. Dipakai langsung sebagai isi dropdown supaya pilihan yang
  // tampil sama persis dengan yang diterima backend saat task disimpan.
  const {
    data: members,
    isPending: isMembersPending,
    isError: isMembersError,
  } = useQuery({
    queryKey: ['project-members', projectId],
    queryFn: () => projectsApi.getMembers(projectId),
    enabled: !!projectId && isOpen,
  })

  const employees = members ?? []
  const isEmployeesLoading = Boolean(projectId) && isMembersPending
  const isEmployeesError = isMembersError
  const hasEmployees = employees.length > 0

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    setValue,
    watch,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      status: defaultStatus,
      category: '',
      priority: 'Sedang',
      // null, bukan undefined — skema menolak undefined sebelum sempat
      // menampilkan pesan "Penanggung jawab wajib dipilih".
      assigneeId: null,
      dueDate: '',
      myDay: false,
    },
    mode: 'onChange',
    // Begitu task yang diedit selesai dimuat, form disinkronkan ke datanya —
    // RHF menulis ulang nilai form setiap kali referensi `values` berubah.
    // Key ini sengaja tidak ada sama sekali di mode buat baru, supaya reset()
    // di onSubmit tetap berfungsi seperti biasa.
    ...(isEditMode && existingTask
      ? {
          values: {
            title: existingTask.title ?? '',
            description: existingTask.description ?? '',
            status: (existingTask.status as TaskStatus) ?? 'backlog',
            category: existingTask.category ?? '',
            priority: existingTask.priority || 'Sedang',
            assigneeId: existingTask.assigneeId ?? null,
            dueDate: existingTask.dueDate ?? '',
            myDay: existingTask.myDay ?? false,
          },
        }
      : {}),
  })

  const title = watch('title')

  // Update default status ketika defaultStatus berubah (kolom berbeda diklik).
  // Hanya relevan saat membuat task baru — saat edit, status datang dari `values`.
  useEffect(() => {
    if (!isEditMode) setValue('status', defaultStatus)
  }, [defaultStatus, isEditMode, setValue])

  // Keyboard shortcuts: Esc to close, Ctrl/Cmd+Enter to save
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault()
        if (isValid && title.trim()) {
          handleSubmit(onSubmit)()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, isValid, title])

  // Focus title input ketika modal dibuka
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const titleInput = modalRef.current.querySelector('input[type="text"]') as HTMLInputElement
      titleInput?.focus()
    }
  }, [isOpen])

  const onSubmit = (data: TaskFormData) => {
    if (isEditMode) {
      // Backend melakukan partial update: field yang tidak dikirim dianggap
      // "jangan diubah", bukan "kosongkan" — kecuali string, yang tetap
      // ditimpa walau isinya "" (lihat TaskService.updateTask). Jadi title/
      // deskripsi/kategori/prioritas aman dikirim apa adanya termasuk saat
      // dikosongkan, tapi assigneeId TIDAK bisa dikosongkan lewat form ini:
      // mengosongkannya di sini hanya berarti "tidak dikirim", bukan "hapus
      // nilai lama". dueDate sengaja TIDAK PERNAH dikirim dari mode edit —
      // field itu dihilangkan dari form ini juga (lihat render di bawah).
      const payload: any = {
        title: data.title,
        description: data.description ?? '',
        status: data.status,
        category: data.category ?? '',
        priority: data.priority ?? '',
        // Selalu dikirim (termasuk saat false) karena false itu nilai yang
        // berarti, bukan "kosong" — beda dari field string di atas.
        myDay: data.myDay,
      }
      if (data.assigneeId) payload.assigneeId = data.assigneeId

      updateTask.mutate(
        { id: taskId!, data: payload },
        { onSuccess: () => onClose() },
      )
      return
    }

    const payload: any = {
      title: data.title,
      status: data.status,
      projectId, // Required: task must belong to a project
      progress: 0,
      code: '', // Backend generate otomatis
      myDay: data.myDay,
    }

    // Only add optional fields if they have values
    if (data.description?.trim()) payload.description = data.description
    if (data.category) payload.category = data.category
    if (data.priority) payload.priority = data.priority
    if (data.assigneeId) payload.assigneeId = data.assigneeId
    if (data.dueDate) payload.dueDate = data.dueDate

    createTask.mutate(payload, {
      onSuccess: () => {
        reset()
        onClose()
      },
      onError: (error) => {
        console.error('Failed to create task:', error)
      },
    })
  }

  if (!isOpen) return null

  if (isEditMode && isTaskPending) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-[600px] bg-white border-2 border-text p-10 flex items-center justify-center">
          <p className="text-body text-neutral-600">Memuat task...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        className="w-full max-w-[600px] max-h-[90vh] overflow-y-auto bg-white border-2 border-text"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b-2 border-text p-6">
          <p className="kicker">{isEditMode ? 'Task — edit task' : 'Task — buat task baru'}</p>
          <h2 className="mt-2 text-page">{isEditMode ? 'Edit Task' : 'Task Baru'}</h2>
        </div>

        {/* noValidate wajib: tanpanya, browser mem-block submit lebih dulu kalau
            ADA field yang melanggar constraint HTML native (mis. dueDate task
            lama di bawah `min`) — bahkan kalau field itu sama sekali tidak
            diubah. Validasi tetap jalan lewat Zod (zodResolver), bukan hilang. */}
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Judul */}
          <Field label="Judul Task" htmlFor="title" error={errors.title?.message}>
            <Input
              id="title"
              type="text"
              placeholder="Rekap penjualan reseller minggu ke-1"
              aria-invalid={Boolean(errors.title)}
              {...register('title')}
            />
            {!errors.title && (
              <p className="text-kicker text-neutral-600">Wajib diisi - maksimal 80 karakter</p>
            )}
          </Field>

          {/* Deskripsi */}
          <Field label="Deskripsi" htmlFor="description">
            <textarea
              id="description"
              placeholder="Jelaskan hasil yang diharapkan..."
              rows={3}
              className="w-full border-2 border-text bg-white px-3 py-2.5 text-form text-text placeholder:text-neutral-500 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
              {...register('description')}
            />
            <p className="text-kicker text-neutral-600">Opsional — boleh menyusul belakangan</p>
          </Field>

          {/* Status */}
          <Field label="Status" htmlFor="status">
            <select
              id="status"
              className="w-full border-2 border-text bg-white px-3 py-2.5 text-form text-text focus:outline-2 focus:outline-offset-0 focus:outline-accent"
              {...register('status')}
            >
              <option value="backlog">Backlog</option>
              <option value="todo">Todo</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
            <p className="text-kicker text-neutral-600">
              {isEditMode ? 'Ubah untuk memindahkan task ke kolom lain' : 'Terisi otomatis dari kolom asal'}
            </p>
          </Field>

          {/* Kategori & Prioritas (2 kolom) */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kategori" htmlFor="category" error={errors.category?.message}>
              <select
                id="category"
                aria-invalid={Boolean(errors.category)}
                className="w-full border-2 border-text bg-white px-3 py-2.5 text-form text-text focus:outline-2 focus:outline-offset-0 focus:outline-accent aria-[invalid=true]:border-accent-800"
                {...register('category')}
              >
                <option value="">Pilih kategori</option>
                <option value="LAPORAN_OPERASIONAL">Laporan Operasional</option>
                <option value="PENGEMBANGAN">Pengembangan</option>
                <option value="PERBAIKAN">Perbaikan</option>
              </select>
              {!errors.category && (
                <p className="text-kicker text-neutral-600">Wajib dipilih</p>
              )}
            </Field>

            <Field label="Prioritas" htmlFor="priority">
              <select
                id="priority"
                className="w-full border-2 border-text bg-white px-3 py-2.5 text-form text-text focus:outline-2 focus:outline-offset-0 focus:outline-accent"
                {...register('priority')}
              >
                <option value="Rendah">Rendah</option>
                <option value="Sedang">Sedang</option>
                <option value="Tinggi">Tinggi</option>
              </select>
              <p className="text-kicker text-neutral-600">Bawaan: Sedang</p>
            </Field>
          </div>

          {/* Penanggung Jawab */}
          <Field label="Penanggung Jawab" htmlFor="assigneeId" error={errors.assigneeId?.message}>
            <select
              id="assigneeId"
              disabled={!hasEmployees}
              aria-invalid={Boolean(errors.assigneeId)}
              className="w-full border-2 border-text bg-white px-3 py-2.5 text-form text-text focus:outline-2 focus:outline-offset-0 focus:outline-accent disabled:bg-neutral-100 disabled:text-neutral-500 aria-[invalid=true]:border-accent-800"
              {...register('assigneeId', {
                setValueAs: (value) => value ? Number(value) : null,
              })}
            >
              <option value="">
                {isEmployeesLoading
                  ? 'Memuat karyawan…'
                  : isEmployeesError
                    ? 'Gagal memuat karyawan'
                    : hasEmployees
                      ? 'Pilih penanggung jawab'
                      : 'Belum ada karyawan di perusahaan ini'}
              </option>
              {employees.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name} ({employee.position || 'Staff'})
                </option>
              ))}
            </select>
            {isEmployeesError ? (
              <p className="text-kicker font-bold text-accent-800">
                Daftar karyawan gagal dimuat, jadi penanggung jawab belum bisa dipilih.
                Muat ulang halaman lalu coba lagi.
              </p>
            ) : !isEmployeesLoading && !hasEmployees ? (
              <p className="text-kicker font-bold text-accent-800">
                Perusahaan project ini belum punya karyawan terdaftar, jadi task belum bisa
                dibuat. Tambahkan karyawan dulu lewat data karyawan.
              </p>
            ) : !errors.assigneeId ? (
              <p className="text-kicker text-neutral-600">Wajib dipilih</p>
            ) : null}
          </Field>

          {/* Tenggat — tidak ditampilkan lagi di mode edit: kalau task sudah lewat
              tenggat, mengubahnya lewat sini bisa dipakai untuk menutupi
              keterlambatan (menggeser tenggat maju supaya tidak lagi terlihat
              telat). Tenggat hanya ditentukan sekali saat task dibuat. */}
          {!isEditMode && (
            <Field label="Tenggat" htmlFor="dueDate" error={errors.dueDate?.message}>
              <Input
                id="dueDate"
                type="date"
                min={todayStr}
                aria-invalid={Boolean(errors.dueDate)}
                {...register('dueDate')}
              />
              {!errors.dueDate && (
                <p className="text-kicker text-neutral-600">Wajib diisi</p>
              )}
            </Field>
          )}

          {/* MyDay */}
          <div>
            <label className="flex cursor-pointer items-center gap-2 text-form font-bold select-none">
              <input
                type="checkbox"
                className="size-4 appearance-none border-2 border-text bg-white checked:border-accent checked:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-700"
                {...register('myDay')}
              />
              MyDay
            </label>
            <p className="mt-1 text-kicker text-neutral-600">
              Tandai untuk dikerjakan hari ini.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-neutral-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={mutation.isPending}
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              disabled={!isValid || !title.trim() || mutation.isPending}
            >
              {mutation.isPending
                ? 'Menyimpan...'
                : isEditMode
                  ? 'Simpan perubahan'
                  : 'Simpan task'}
            </Button>
          </div>

          {mutation.error && (
            <p role="alert" className="border-2 border-accent-800 bg-accent-100 px-3 py-2.5 text-kicker font-bold text-accent-800">
              {isEditMode ? 'Gagal menyimpan perubahan. Coba lagi.' : 'Gagal membuat task. Coba lagi.'}
            </p>
          )}

          {/* Keyboard hints */}
          <div className="text-kicker text-neutral-500 space-y-1 pt-2">
            <p>💡 <kbd className="bg-neutral-100 px-2 py-1">Esc</kbd> untuk menutup</p>
            <p>💡 <kbd className="bg-neutral-100 px-2 py-1">Ctrl</kbd>/<kbd className="bg-neutral-100 px-2 py-1">Cmd</kbd> + <kbd className="bg-neutral-100 px-2 py-1">Enter</kbd> untuk simpan</p>
          </div>
        </form>
      </div>
    </div>
  )
}
