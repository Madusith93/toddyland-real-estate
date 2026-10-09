'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  type LoginResponse = {
    success: boolean
    message?: string
    email?: string
    status?: number
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const res = (await login(email, password)) as LoginResponse
    setLoading(false)

    if (res.success) {
      router.push('/properties')
      return
    }

    // Backend returns 403 with the email when the account exists but hasn't
    // verified its OTP yet — send them to finish that instead of just
    // showing a generic error.
    if (res.status === 403 && res.email) {
      router.push(`/verify-otp?email=${encodeURIComponent(res.email)}`)
      return
    }

    setError(res.message || 'Invalid email or password.')
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f9fafb', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
          Welcome back
        </h1>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
          Sign in to your Toddyland account.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={inputStyle}
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
            />
          </div>

          {error && <p style={{ color: '#dc2626', fontSize: '13px', margin: 0 }}>{error}</p>}

          <div style={{ textAlign: 'right' }}>
            <a href="/forgot-password" style={{ fontSize: '12px', color: '#6b7280', textDecoration: 'none' }}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px', border: 'none', borderRadius: '8px',
              background: loading ? '#9ca3af' : '#dc2626', color: '#fff',
              fontWeight: 700, fontSize: '14px', cursor: loading ? 'default' : 'pointer',
            }}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginTop: '20px' }}>
          Don't have an account?{' '}
          <a href="/register" style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none' }}>
            Sign up
          </a>
        </p>
      </div>
    </div>
  )
}

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px',
}

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px',
  fontSize: '14px', boxSizing: 'border-box',
}