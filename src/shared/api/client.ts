import { useAuthStore } from '@/features/auth/store'

// Relatif, bukan absolut: dilewatkan proxy Vite (`/api` → localhost:8080) supaya
// bebas CORS. Backend sendiri pakai context-path `/api`, jadi prefix ini wajib.
const API_BASE_URL = '/api'

const REQUEST_TIMEOUT_MS = 10_000

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit,
): Promise<T> {
  const token = useAuthStore.getState().token

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      // Tanpa ini request menggantung selamanya saat backend mati — proxy dev
      // tidak menutup koneksi, jadi UI diam di state "memuat" tanpa pernah error.
      signal: options?.signal ?? AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
  } catch (cause) {
    const timedOut = cause instanceof DOMException && cause.name === 'TimeoutError'
    throw new ApiError(
      0,
      timedOut
        ? `Server tidak merespons dalam ${REQUEST_TIMEOUT_MS / 1000} detik. Pastikan backend jalan di localhost:8080.`
        : 'Tidak bisa menghubungi server. Pastikan backend jalan di localhost:8080.',
    )
  }

  if (!response.ok) {
    const error = await response.text()
    throw new ApiError(response.status, error || response.statusText)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

export { apiRequest, API_BASE_URL }
