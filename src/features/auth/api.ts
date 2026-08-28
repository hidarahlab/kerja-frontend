import type { LoginPayload, Session } from './types'
import { AuthError } from './types'

/**
 * MOCK — belum terhubung ke backend.
 *
 * Untuk menyambungkan ke API asli, ganti isi fungsi ini saja:
 *
 *   const res = await fetch('/api/auth/login', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ email, password }),
 *   })
 *   if (!res.ok) throw new AuthError('Email atau kata sandi salah.')
 *   return res.json()
 *
 * Sisa aplikasi tidak perlu diubah.
 */

/** Kata sandi ini sengaja ditolak, supaya tampilan error bisa diuji. */
const MOCK_INVALID_PASSWORD = 'gagal1234'

export async function login({ email, password }: LoginPayload): Promise<Session> {
  await new Promise((resolve) => setTimeout(resolve, 700))

  if (password === MOCK_INVALID_PASSWORD) {
    throw new AuthError('Email atau kata sandi salah.')
  }

  const name = displayNameFrom(email)

  return {
    token: `mock-token-${crypto.randomUUID()}`,
    user: {
      name,
      role: 'Administrator',
      initials: initialsFrom(name),
    },
  }
}

/** "budi.santoso@kantor.co.id" → "Budi Santoso" */
function displayNameFrom(email: string) {
  const local = email.split('@')[0] ?? ''
  const words = local.split(/[._-]+/).filter(Boolean)
  if (words.length === 0) return 'Admin Kantor'
  return words.map((word) => word[0]!.toUpperCase() + word.slice(1)).join(' ')
}

function initialsFrom(name: string) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
  return (initials || 'AK').toUpperCase()
}
