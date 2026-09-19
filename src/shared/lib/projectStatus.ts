/** Status project yang sudah ditutup — harus sama dengan ProjectService.STATUS_COMPLETED di backend. */
export const PROJECT_STATUS_COMPLETED = 'COMPLETED'

/** Status project yang masih berjalan. */
export const PROJECT_STATUS_ACTIVE = 'ACTIVE'

/**
 * Perbandingan mengabaikan besar-kecil huruf: data lama menyimpan "active"
 * sementara yang baru "ACTIVE", jadi status tidak bisa dibandingkan langsung.
 */
export function isProjectCompleted(status?: string | null): boolean {
  return (status ?? '').toUpperCase() === PROJECT_STATUS_COMPLETED
}
