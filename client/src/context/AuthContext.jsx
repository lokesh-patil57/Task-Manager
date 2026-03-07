import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/axios'
import { errorToast, successToast } from '../utils/toast'

const AuthContext = createContext(null)

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
  const [token, setToken] = useState(() => localStorage.getItem('atm_token') || '')
  const [user, setUser] = useState(() => {
    const t = localStorage.getItem('atm_token')
    const decoded = t ? decodeJwt(t) : null
    return decoded?.email ? { email: decoded.email, id: decoded.id } : null
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('atm_token')
      setUser(null)
      return
    }
    localStorage.setItem('atm_token', token)
    const decoded = decodeJwt(token)
    if (decoded?.email) setUser({ email: decoded.email, id: decoded.id })
  }, [token])

  const login = async ({ email, password }) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/login', { email, password })
      setToken(res.data.token)
      setUser(res.data.user)
      successToast('Login successful')
      return { ok: true }
    } catch (e) {
      const message = e?.response?.data?.message || 'Login failed'
      errorToast(message)
      return { ok: false, message }
    } finally {
      setLoading(false)
    }
  }

  const register = async ({ name, email, password }) => {
    setLoading(true)
    try {
      const res = await api.post('/auth/register', { name, email, password })
      setToken(res.data.token)
      setUser(res.data.user)
      successToast('Account created successfully')
      return { ok: true }
    } catch (e) {
      const message = e?.response?.data?.message || 'Registration failed'
      errorToast(message)
      return { ok: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setToken('')
    setUser(null)
    localStorage.removeItem('atm_token')
  }

  const setTokenFromOAuth = (t) => {
    setToken(t || '')
  }

  const value = useMemo(
    () => ({ token, user, loading, login, register, logout, setTokenFromOAuth }),
    [token, user, loading]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

