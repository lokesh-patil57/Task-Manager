import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/axios'
import { errorToast, successToast } from '../utils/toast'

const AuthContext = createContext(null)
const TOKEN_KEY = 'atm_token'

const DEMO_CREDENTIALS = {
  name: 'Demo User',
  email: 'demo@taskflow.app',
  password: 'Demo@taskflow123',
}

function decodeJwt(token) {
  try {
    const payload = token.split('.')[1]
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '')
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem(TOKEN_KEY)
    const decoded = t ? decodeJwt(t) : null
    return decoded?.email ? { email: decoded.email, id: decoded.id } : null
  })
  const [loading, setLoading] = useState(false)
  const [initialized, setInitialized] = useState(false)

  // Persist / clear token
  useEffect(() => {
    if (!token) {
      localStorage.removeItem(TOKEN_KEY)
      setUser(null)
    } else {
      localStorage.setItem(TOKEN_KEY, token)
    }
  }, [token])

  // On mount, if a token already exists, rehydrate user from /api/auth/me
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY)
    if (!storedToken) {
      setInitialized(true)
      return
    }
    api
      .get('/auth/me')
      .then((res) => {
        if (res.data?.user) setUser(res.data.user)
      })
      .catch(() => {
        // Invalid / expired token – clear it
        setToken('')
      })
      .finally(() => setInitialized(true))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async ({ email, password }, opts = {}) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      setToken(res.data.token)
      setUser(res.data.user)
      if (!opts.silent) successToast('Login successful')
      return { ok: true }
    } catch (e) {
      const message = e?.response?.data?.message || 'Login failed'
      if (!opts.silent) errorToast(message)
      return { ok: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  const register = useCallback(async ({ name, email, password }, opts = {}) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { name, email, password })
      setToken(res.data.token)
      setUser(res.data.user)
      if (!opts.silent) successToast('Account created successfully')
      return { ok: true }
    } catch (e) {
      const message = e?.response?.data?.message || 'Registration failed'
      if (!opts.silent) errorToast(message)
      return { ok: false, message }
    } finally {
      setLoading(false)
    }
  }, [])

  /** Auto-login with a shared demo account, creating it if needed. */
  const demoLogin = useCallback(async () => {
    setLoading(true)
    try {
      const loginRes = await api.post('/auth/login', {
        email: DEMO_CREDENTIALS.email,
        password: DEMO_CREDENTIALS.password,
      })
      setToken(loginRes.data.token)
      setUser(loginRes.data.user)
      successToast('Welcome to the demo!')
      return { ok: true }
    } catch {
      // Account may not exist yet – register it
      try {
        const regRes = await api.post('/auth/register', DEMO_CREDENTIALS)
        setToken(regRes.data.token)
        setUser(regRes.data.user)
        successToast('Welcome to the demo!')
        return { ok: true }
      } catch (e2) {
        const message = e2?.response?.data?.message || 'Demo login failed'
        errorToast(message)
        return { ok: false, message }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    setToken('')
    setUser(null)
    localStorage.removeItem(TOKEN_KEY)
  }, [])

  const setTokenFromOAuth = useCallback((t) => {
    setToken(t || '')
  }, [])

  const isAuthenticated = Boolean(token)

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      initialized,
      isAuthenticated,
      login,
      register,
      demoLogin,
      logout,
      setTokenFromOAuth,
    }),
    [token, user, loading, initialized, isAuthenticated, login, register, demoLogin, logout, setTokenFromOAuth]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
