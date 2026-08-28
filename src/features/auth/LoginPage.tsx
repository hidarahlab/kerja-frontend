import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Button } from '@/shared/ui/Button'
import { Field, Input } from '@/shared/ui/Field'
import { Logo } from '@/shared/ui/Logo'
import { login } from './api'
import { loginSchema, type LoginForm } from './schema'
import { useAuthStore } from './store'
import { AuthError } from './types'

export function LoginPage() {
  const signIn = useAuthStore((state) => state.signIn)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '', remember: false },
  })

  const mutation = useMutation({
    mutationFn: login,
    onSuccess: signIn,
  })

  const serverError =
    mutation.error instanceof AuthError
      ? mutation.error.message
      : mutation.error
        ? 'Tidak bisa terhubung ke server. Coba lagi.'
        : null

  return (
    <div className="flex min-h-dvh bg-bg">
      <BrandPanel />

      <section className="flex flex-1 items-center justify-center px-6 py-10">
        <div className="w-full max-w-[420px]">
          <p className="kicker">Masuk ke akun</p>
          <h1 className="mt-2 text-page">Selamat datang</h1>
          <p className="mt-2 text-body text-neutral-600">
            Gunakan email kantor Anda untuk melanjutkan.
          </p>

          <form
            noValidate
            onSubmit={handleSubmit((values) => mutation.mutate(values))}
            className="mt-7 flex flex-col gap-5"
          >
            <Field label="Email kantor" htmlFor="email" error={errors.email?.message}>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="nama@kantor.co.id"
                aria-invalid={Boolean(errors.email)}
                {...register('email')}
              />
            </Field>

            <Field label="Kata sandi" htmlFor="password" error={errors.password?.message}>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                aria-invalid={Boolean(errors.password)}
                {...register('password')}
              />
            </Field>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-form select-none">
                <input
                  type="checkbox"
                  className="size-4 appearance-none border-2 border-text bg-white checked:border-accent checked:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-700"
                  {...register('remember')}
                />
                Ingat saya
              </label>
              <a
                href="#lupa-sandi"
                className="text-form font-bold text-accent-700 underline-offset-4 hover:underline"
              >
                Lupa sandi?
              </a>
            </div>

            {serverError ? (
              <p
                role="alert"
                className="border-2 border-accent-800 bg-accent-100 px-3 py-2.5 text-kicker font-bold text-accent-800"
              >
                {serverError}
              </p>
            ) : null}

            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? 'Memproses…' : 'Masuk'}
            </Button>
          </form>

          <hr className="mt-8 border-t border-divider" />
          <p className="mt-4 text-kicker text-neutral-600">
            Akses hanya untuk staf internal. Hubungi admin IT bila akun terkunci.
          </p>
        </div>
      </section>
    </div>
  )
}

function BrandPanel() {
  return (
    <section className="hidden w-[52%] shrink-0 flex-col justify-between bg-accent px-12 py-14 text-bg lg:flex">
      <div className="flex items-center gap-4">
        <Logo />

        {/*
          Placeholder logo perusahaan — dinonaktifkan sampai aset logo klien tersedia.
          Aktifkan kembali dengan menghapus komentar ini, lalu ganti <span> terakhir
          dengan <img src={logoPerusahaan} alt="Logo perusahaan" className="h-7" />.

          <span aria-hidden className="h-7 w-px bg-bg/40" />
          <span className="eyebrow border border-dashed border-bg/50 px-3 py-2 text-bg/70">
            Logo perusahaan
          </span>
        */}
      </div>

      <div>
        <h2 className="max-w-[13ch] text-[clamp(2.5rem,3.7vw,3.375rem)] leading-[1.05] tracking-[-0.03em]">
          Satu tempat untuk kerja kantor.
        </h2>
        <hr className="mt-7 w-24 border-t-2 border-bg" />
        <p className="mt-6 max-w-[42ch] text-project leading-relaxed text-bg/90">
          Ruang kerja digital untuk tim-mu — satu tempat, semua yang jalan hari ini.
        </p>
      </div>

      <div>
        <hr className="border-t border-bg/40" />
        <div className="mt-4 grid grid-cols-3 text-bg/80">
          <span className="eyebrow">Dashboard</span>
          <span className="eyebrow">Task</span>
          <span className="eyebrow">V1.0 — 2026</span>
        </div>
      </div>
    </section>
  )
}
