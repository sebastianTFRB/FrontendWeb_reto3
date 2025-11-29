import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { ApiError, api } from '../services/api'
import type { User } from '../types'

type AuthContextValue = {
  token: string | null
  user: User | null
  loading: boolean
  error?: string
  login: (email: string, password: string) => Promise<void>
  register: (payload: { email: string; password: string; full_name?: string }) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

const TOKEN_KEY = 'fullhouse_token'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY))
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(!!token)
  const [error, setError] = useState<string>()

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
  }

  const loadUser = async (activeToken: string) => {
    const profile = await api.me(activeToken)
    setUser(profile)
  }

  useEffect(() => {
    if (!token) return
    setLoading(true)
    loadUser(token)
      .catch(() => {
        logout()
      })
      .finally(() => setLoading(false))
  }, [token])

  const login = async (email: string, password: string) => {
    setError(undefined)
    setLoading(true)
    try {
      const result = await api.login(email, password)
      setToken(result.access_token)
      localStorage.setItem(TOKEN_KEY, result.access_token)
      await loadUser(result.access_token)
    } catch (err) {
      const detail = err instanceof ApiError ? err.message : 'No se pudo iniciar sesión'
      setError(detail)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (payload: { email: string; password: string; full_name?: string }) => {
    setError(undefined)
    setLoading(true)
    try {
      await api.register(payload)
    } catch (err) {
      const detail = err instanceof ApiError ? err.message : 'No se pudo registrar'
      setError(detail)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async () => {
    if (!token) return
    await loadUser(token)
  }

  const value = useMemo(
    () => ({ token, user, loading, error, login, logout, register, refreshUser }),
    [token, user, loading, error]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return ctx
}
