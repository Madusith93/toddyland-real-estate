'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import {
  login as apiLogin,
  register as apiRegister,
  verifyOtp as apiVerifyOtp,
  resendOtp as apiResendOtp,
  logout as apiLogout,
  getMe,
  forgotPassword as apiForgotPassword,
  resetPassword as apiResetPassword,
} from '../../src/api/authApi.js'

interface AuthUser {
  id: number
  name: string
  email: string
  role: 'admin' | 'seller' | 'buyer'
  is_active: boolean
}

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; email?: string }>
  register: (name: string, email: string, password: string, role: 'seller' | 'buyer') => Promise<{ success: boolean; message?: string; email?: string }>
  verifyOtp: (email: string, otp: string) => Promise<{ success: boolean; message?: string }>
  resendOtp: (email: string) => Promise<{ success: boolean; message?: string }>
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string }>
  resetPassword: (email: string, otp: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = 'toddyland_auth_token'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // On first load, check for a stored token and fetch the current user.
  useEffect(() => {
    const stored = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null
    if (!stored) {
      setLoading(false)
      return
    }
    setToken(stored)
    getMe(stored).then((me) => {
      if (me) {
        setUser(me)
      } else {
        // Token was invalid/expired — clear it.
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      }
      setLoading(false)
    })
  }, [])

  const login = async (email: string, password: string) => {
    const res = await apiLogin(email, password)
    if (res.success && res.token) {
      localStorage.setItem(TOKEN_KEY, res.token)
      setToken(res.token)
      setUser(res.user)
    }
    return res
  }

  const register = async (name: string, email: string, password: string, role: 'seller' | 'buyer') => {
    return await apiRegister(name, email, password, role)
  }

  const verifyOtp = async (email: string, otp: string) => {
    const res = await apiVerifyOtp(email, otp)
    if (res.success && res.token) {
      localStorage.setItem(TOKEN_KEY, res.token)
      setToken(res.token)
      setUser(res.user)
    }
    return res
  }

  const resendOtp = async (email: string) => {
    return await apiResendOtp(email)
  }

  const forgotPassword = async (email: string) => {
    return await apiForgotPassword(email)
  }

  const resetPassword = async (email: string, otp: string, password: string) => {
    return await apiResetPassword(email, otp, password)
  }

  const logout = async () => {
    if (token) {
      await apiLogout(token)
    }
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, verifyOtp, resendOtp, forgotPassword, resetPassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}