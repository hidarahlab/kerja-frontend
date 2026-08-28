export type User = {
  name: string
  role: string
  /** Inisial untuk avatar kotak di sidebar, mis. "AK". */
  initials: string
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
