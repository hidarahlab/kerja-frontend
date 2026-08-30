import type { LoginPayload, Session } from './types'
import { AuthError } from './types'

/**
 * Terhubung ke kerja-backend (Spring Boot).
 *
 * Saat development, panggilan /api diteruskan ke http://localhost:8080
 * lewat proxy yang diatur di vite.config.ts — jadi tidak ada masalah CORS.
 */

/** Mengambil pesan error yang aman ditampilkan dari body respons backend. */
async function messageFrom(res: Response, fallback: string) {
  try {
    const body = await res.json()
    return typeof body?.message === 'string' && body.message ? body.message : fallback
  } catch {
    return fallback
  }
}

export async function login({ email, password, remember }: LoginPayload): Promise<Session> {
  let res: Response
  try {
    res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, remember }),
    })
  } catch {
    // Gagal menghubungi server — biarkan LoginPage menampilkan pesan koneksinya sendiri.
    throw new Error('network')
  }

  if (!res.ok) {
    throw new AuthError(await messageFrom(res, 'Email atau kata sandi salah.'))
  }

  return res.json()
}

/**
 * Mematikan token di server. Backend selalu membalas 200, tapi kegagalan jaringan
 * pun sengaja diabaikan: pengguna tetap harus bisa keluar dari aplikasi.
 */
export async function logout(token: string): Promise<void> {
  try {
    await fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    // diabaikan — state lokal tetap dibersihkan oleh store
  }
}

/** Memastikan token yang tersimpan di localStorage masih sah di server. */
export async function fetchCurrentUser(token: string): Promise<Session['user']> {
  const res = await fetch('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) {
    throw new AuthError(await messageFrom(res, 'Sesi sudah berakhir. Silakan masuk kembali.'))
  }

  return res.json()
}
