export type User = {
  /** Id employee-nya sendiri, dipakai sebagai penulis komentar dan aktivitas. */
  id?: number
  name: string
  email?: string
  role: string
  /** Inisial untuk avatar kotak di sidebar, mis. "AK". */
  initials: string
  /**
   * Perusahaan tempat pengguna bekerja. Menentukan project mana yang boleh
   * dilihat dan siapa saja yang bisa jadi penanggung jawab task.
   *
   * Dikirim backend di respons /auth/login dan /auth/me. Tetap opsional karena
   * sesi lama di localStorage bisa saja belum memuatnya — useCompanyId()
   * memperlakukan keadaan itu sebagai gagal, bukan menebak nilainya.
   */
  companyId?: number
  companyName?: string
}

export type Session = {
  token: string
  user: User
}

export type LoginPayload = {
  email: string
  password: string
  remember: boolean
}

/** Error yang aman ditampilkan ke pengguna. */
export class AuthError extends Error {}
