import { useEffect, useRef } from 'react'
import { format } from 'date-fns'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useCreateProject } from '@/shared/hooks/useProjects'
import { PROJECT_STATUS_ACTIVE } from '@/shared/lib/projectStatus'
import { useCompanyId } from '@/shared/hooks/useCompany'
import { useAuthStore } from '@/features/auth/store'
import { Button } from '@/shared/ui/Button'
import { Field, Input } from '@/shared/ui/Field'

const createProjectSchema = z.object({
  name: z.string().min(1, 'Nama project wajib diisi').max(255),
  code: z.string().readonly(),
  // Selalu project baru (modal ini tidak punya mode edit), jadi aman ditolak
  // tegas kalau tenggatnya sudah lewat — beda dari tenggat task yang bisa saja
  // sedang mengedit task lama yang sudah lewat tenggat.
  deadline: z.string().refine(
    (value) => !value || value >= new Date().toISOString().split('T')[0],
    'Tenggat tidak boleh sebelum hari ini',
  ),
  category: z.string().optional().default(''),
  description: z.string().optional().default(''),
  priority: z.enum(['Tinggi', 'Sedang', 'Rendah']).optional().default('Sedang'),
})

type CreateProjectFormData = z.infer<typeof createProjectSchema>

type CreateProjectModalProps = {
  isOpen: boolean
  onClose: () => void
}

export function CreateProjectModal({ isOpen, onClose }: CreateProjectModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const createProject = useCreateProject()
  const { companyId, companyName } = useCompanyId()
  const currentUser = useAuthStore((state) => state.user)
  // Project baru — tenggat tidak masuk akal kalau sudah lewat sebelum project-nya
  // dibuat, jadi tidak boleh dipilih mundur ke masa lalu.
  const todayStr = format(new Date(), 'yyyy-MM-dd')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
  } = useForm<CreateProjectFormData>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: '',
      code: 'PRJ-' + Math.floor(Math.random() * 1000),
      deadline: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      category: '',
      description: '',
      priority: 'Sedang',
    },
    mode: 'onChange',
  })

  const name = watch('name')

  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  const onSubmit = (data: CreateProjectFormData) => {
    // Sebelumnya angka 1 ditulis mati di sini, sehingga project siapa pun mendarat
    // di perusahaan yang salah. Tanpa companyId yang pasti, lebih baik tidak
    // menyimpan sama sekali daripada menyimpan ke perusahaan keliru.
    if (!companyId) return

    createProject.mutate(
      {
        name: data.name,
        code: data.code,
        deadline: data.deadline,
        category: data.category || null,
        description: data.description || null,
        priority: data.priority,
        companyId,
        status: PROJECT_STATUS_ACTIVE,
        progress: 0,
        // Pembuat project otomatis jadi anggota pertama — tanpa ini kolom
        // "Anggota" selalu kosong karena tidak ada picker anggota lain di sini.
        assignees: currentUser?.id ? [{ id: currentUser.id }] : [],
      } as any,
      {
        onSuccess: () => {
          reset()
          onClose()
        },
        onError: (error) => {
          console.error('Failed to create project:', error)
        },
      },
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        ref={modalRef}
        className="w-full max-w-[700px] max-h-[90vh] overflow-y-auto bg-white border-2 border-text"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b-2 border-text p-6">
          <p className="kicker">Task — buat project baru</p>
          <h2 className="mt-2 text-page">Buat project</h2>
          {companyName && (
            <p className="mt-1 text-kicker text-neutral-600">
              Project ini dibuat untuk {companyName}.
            </p>
          )}
        </div>

        {/* noValidate: validasi tetap jalan lewat Zod (zodResolver), bukan lewat
            constraint HTML native — konsisten dengan TaskFormModal. */}
        <form noValidate onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Nama Project */}
          <Field label="Nama Project" htmlFor="name" error={errors.name?.message}>
            <Input
              id="name"
              type="text"
              placeholder="Target Penjualan Q4 2026"
              aria-invalid={Boolean(errors.name)}
              {...register('name')}
            />
          </Field>

          {/* Kode & Tenggat (2 kolom) */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Kode Project" htmlFor="code">
              <Input
                id="code"
                type="text"
                readOnly
                className="bg-neutral-100 cursor-not-allowed"
                {...register('code')}
              />
              <p className="text-kicker text-neutral-600">Otomatis</p>
            </Field>

            <Field label="Tenggat" htmlFor="deadline" error={errors.deadline?.message}>
              <Input
                id="deadline"
                type="date"
                min={todayStr}
                aria-invalid={Boolean(errors.deadline)}
                {...register('deadline')}
              />
              <p className="text-kicker text-neutral-600">Otomatis</p>
            </Field>
          </div>

          {/* Kategori */}
          <Field label="Kategori" htmlFor="category">
            <select
              id="category"
              className="w-full border-2 border-text bg-white px-3 py-2.5 text-form text-text focus:outline-2 focus:outline-offset-0 focus:outline-accent"
              {...register('category')}
            >
              <option value="">Pilih kategori</option>
              <option value="PENJUALAN">Penjualan</option>
              <option value="OPERASIONAL">Operasional</option>
              <option value="PENGEMBANGAN">Pengembangan</option>
            </select>
          </Field>

          {/* Deskripsi */}
          <Field label="Deskripsi" htmlFor="description">
            <textarea
              id="description"
              placeholder="Kejar pipeline reseller dan kanal marketplace sampai akhir tahun."
              rows={4}
              className="w-full border-2 border-text bg-white px-3 py-2.5 text-form text-text placeholder:text-neutral-500 focus:outline-2 focus:outline-offset-0 focus:outline-accent"
              {...register('description')}
            />
          </Field>

          {/* Anggota lain belum bisa ditambah dari sini — baru pembuat project
              yang otomatis tercatat (lihat assignees di onSubmit). Menambah
              anggota lain butuh picker karyawan sendiri, belum dikerjakan. */}
          <Field label="Anggota" htmlFor="members">
            <div className="flex items-center gap-2 p-3 border-2 border-text bg-white min-h-[44px]">
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-accent text-white flex items-center justify-center text-kicker font-bold">
                  {currentUser?.initials ?? '?'}
                </div>
              </div>
              <p className="ml-auto text-kicker text-neutral-600">Anda, sebagai pembuat project</p>
            </div>
          </Field>

          {/* Prioritas - Radio Buttons */}
          <Field label="Prioritas" htmlFor="priority">
            <div className="flex gap-6">
              {(['Tinggi', 'Sedang', 'Rendah'] as const).map((level) => (
                <label key={level} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value={level}
                    className="w-4 h-4 border-2 border-text"
                    {...register('priority')}
                  />
                  <span className="text-form">{level}</span>
                </label>
              ))}
            </div>
          </Field>

          {/* Kanban Columns Note */}
          <div className="p-4 bg-neutral-50 border-l-4 border-accent">
            <p className="text-kicker text-neutral-700">
              <strong>Pakai kolom standar:</strong> Backlog • To do • In progress • Review • Done
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t-2 border-neutral-200">
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={createProject.isPending}
            >
              Batalkan
            </Button>
            <Button
              type="submit"
              disabled={!isValid || !name.trim() || !companyId || createProject.isPending}
            >
              {createProject.isPending ? 'Membuat...' : 'Buat project'}
            </Button>
          </div>

          {!companyId && (
            <p role="alert" className="border-2 border-accent-800 bg-accent-100 px-3 py-2.5 text-kicker font-bold text-accent-800">
              Perusahaan Anda belum dikenali, jadi project belum bisa dibuat. Keluar
              lalu masuk kembali, atau hubungi admin IT.
            </p>
          )}

          {createProject.error && (
            <p role="alert" className="border-2 border-accent-800 bg-accent-100 px-3 py-2.5 text-kicker font-bold text-accent-800">
              Gagal membuat project. Coba lagi.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
