import { z } from 'zod'

export const loginSchema = z.object({
  // .pipe() menjaga urutan: cek "wajib diisi" dulu, baru cek format.
  email: z
    .string()
    .min(1, { message: 'Email kantor wajib diisi.' })
    .pipe(z.email({ message: 'Format email tidak valid.' })),
  password: z
    .string()
    .min(1, { message: 'Kata sandi wajib diisi.' })
    .min(8, { message: 'Kata sandi minimal 8 karakter.' }),
  remember: z.boolean(),
})

export type LoginForm = z.infer<typeof loginSchema>
