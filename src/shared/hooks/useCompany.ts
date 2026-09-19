import { useAuthStore } from '@/features/auth/store'

/**
 * Perusahaan tempat pengguna yang sedang login bekerja.
 *
 * Ini satu-satunya sumber kebenaran soal "perusahaan saya". Semua yang bersifat
 * per-perusahaan — daftar project, pembuatan project, pilihan penanggung jawab —
 * harus lewat sini, bukan menebak dari data lain atau menulis angka mati.
 *
 * Nilainya datang langsung dari respons /auth/login dan /auth/me, jadi tidak ada
 * panggilan jaringan tambahan di sini.
 */
export function useCompanyId() {
  const user = useAuthStore((state) => state.user)

  return {
    companyId: user?.companyId,
    companyName: user?.companyName,
    // Sesi dibaca dari store, tidak ada yang perlu ditunggu.
    isPending: false,
    // Sesi lama (dibuat sebelum backend mengirim companyId) tidak punya nilai ini;
    // pengguna harus masuk ulang daripada ditebak-tebak perusahaannya.
    isError: user != null && user.companyId == null,
  }
}
