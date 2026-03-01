export type AuthUser = {
  id: number
  name: string
  email: string
  foto?: string | null
}

type AuthPayload = {
  token: string
  user: AuthUser
}

const AUTH_KEY = 'simpeg_auth'

export function getAuth(): AuthPayload | null {
  const raw = localStorage.getItem(AUTH_KEY)
  if (!raw) return null

  try {
    return JSON.parse(raw) as AuthPayload
  } catch {
    return null
  }
}

export function setAuth(payload: AuthPayload) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(payload))
}

export function clearAuth() {
  localStorage.removeItem(AUTH_KEY)
}

export function isAuthenticated(): boolean {
  const auth = getAuth()
  return Boolean(auth?.token)
}
