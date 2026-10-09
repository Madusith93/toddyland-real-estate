'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const { forgotPassword } = useAuth()

  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await forgotPassword(email)
    setLoading(false)
    // The backend always returns the same generic message whether or not
    // the account exists, so we always show the "sent" state and let the
    // person proceed to enter a code — this doesn't leak which emails
    // have accounts.
    setSent(true)
  }

  if (sent) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f9fafb', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', textAlign: 'center' }}>
          <i className="fa-solid fa-envelope-circle-check" style={{ fontSize: '36px', color: '#16a34a', marginBottom: '16px', display: 'block' }}></i>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: '#111827', marginBottom: '8px' }}>
            Check your email
          </h1>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
            If an account exists for <strong>{email}</strong>, we've sent a reset code to it.
          </p>
          <button
            onClick={() => router.push(`/reset-password?email=${encodeURIComponent(email)}`)}
            style={{
              width: '100%', padding: '12px', border: 'none', borderRadius: '8px',
              background: '#dc2626', color: '#fff', fontWeight: 700, fontSize: '14px', cursor: 'pointer',
            }}
          >
            I have the code
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f9fafb', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
          Reset your password
        </h1>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
          Enter your email and we'll send you a reset code.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={{
              width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: '8px',
              fontSize: '14px', boxSizing: 'border-box',
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '12px', border: 'none', borderRadius: '8px',
              background: loading ? '#9ca3af' : '#dc2626', color: '#fff',
              fontWeight: 700, fontSize: '14px', cursor: loading ? 'default' : 'pointer',
            }}
          >
            {loading ? 'Sending...' : 'Send reset code'}
          </button>
        </form>

        <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginTop: '20px' }}>
          <a href="/login" style={{ color: '#dc2626', fontWeight: 600, textDecoration: 'none' }}>
            Back to sign in
          </a>
        </p>
      </div>
    </div>
  )
}