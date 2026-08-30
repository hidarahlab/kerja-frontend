import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { logout as logoutRequest } from './api'
import type { Session, User } from './types'

type AuthState = {
  token: string | null
  user: User | null
  signIn: (session: Session) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      signIn: ({ token, user }) => set({ token, user }),
      signOut: () => {
        // Kabari server supaya token-nya dimatikan, tapi jangan tunda pembersihan
        // state lokal — pengguna harus langsung keluar walau jaringan bermasalah.
        const { token } = get()
        if (token) void logoutRequest(token)
        set({ token: null, user: null })
      },
    }),
    { name: 'kerja-auth' },
  ),
)

export const useIsAuthenticated = () => useAuthStore((state) => state.token !== null)

/** Mock untuk development — hapus saat backend ready. */
export const mockLogin = () => {
  useAuthStore.setState({
    token: 'mock-token-' + Date.now(),
    user: {
      name: 'Admin Kantor',
      role: 'Administrator',
      initials: 'AK',
    },
  })
}
