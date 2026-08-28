import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Session, User } from './types'

type AuthState = {
  token: string | null
  user: User | null
  signIn: (session: Session) => void
  signOut: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      signIn: ({ token, user }) => set({ token, user }),
      signOut: () => set({ token: null, user: null }),
    }),
    { name: 'kerja-auth' },
  ),
)

export const useIsAuthenticated = () => useAuthStore((state) => state.token !== null)
