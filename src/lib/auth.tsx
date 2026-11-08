import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, ApiError, type ApiUser, type Role } from './api'

interface AuthValue {
  user: ApiUser | null
  loading: boolean
  /** False when the API is not running, so the UI can explain instead of hanging. */
  serverReachable: boolean
  isStaff: boolean
  hasRole: (...roles: Role[]) => boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refresh: () => Promise<void>
}

const AuthContext = createContext<AuthValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<ApiUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [serverReachable, setServerReachable] = useState(true)

  const refresh = useCallback(async () => {
    try {
      const { user: current } = await api.me()
      setUser(current)
      setServerReachable(true)
    } catch (error) {
      if (error instanceof ApiError && error.status !== 0) {
        setServerReachable(true)
        setUser(null)
      } else {
        setServerReachable(false)
        setUser(null)
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const signIn = useCallback(async (email: string, password: string) => {
    const { user: signedIn } = await api.login(email, password)
    setUser(signedIn)
    setServerReachable(true)
  }, [])

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      const { user: created } = await api.register(name, email, password)
      setUser(created)
      setServerReachable(true)
    },
    [],
  )

  const signOut = useCallback(async () => {
    try {
      await api.logout()
    } finally {
      setUser(null)
    }
  }, [])

  const value = useMemo<AuthValue>(
    () => ({
      user,
      loading,
      serverReachable,
      isStaff: user?.role === 'reviewer' || user?.role === 'admin',
      hasRole: (...roles: Role[]) => Boolean(user && roles.includes(user.role)),
      signIn,
      signUp,
      signOut,
      refresh,
    }),
    [user, loading, serverReachable, signIn, signUp, signOut, refresh],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside an AuthProvider')
  return context
}
