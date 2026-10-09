'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

function VerifyOtpContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { verifyOtp, resendOtp } = useAuth()

  const email = searchParams.get('email') || ''
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')
    setLoading(true)
    const res = await verifyOtp(email, otp)
    setLoading(false)

    if (res.success) {
      router.push('/properties')
    } else {
      setError(res.message || 'Invalid or expired code.')
    }
  }

  const handleResend = async () => {
    setError('')
    setInfo('')
    setResending(true)
    const res = await resendOtp(email)
    setResending(false)
    setInfo(res.success ? 'A new code has been sent to your email.' : (res.message || 'Could not resend code.'))
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f9fafb', padding: '24px' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '16px', padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#111827', marginBottom: '4px' }}>
          Verify your email
        </h1>
        <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
          We sent a 6-digit code to <strong>{email || 'your email'}</strong>. Enter it below.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            required
            placeholder="000000"
            style={{
              width: '100%', padding: '14px', border: '1px solid #e5e7eb', borderRadius: '8px',
              fontSize: '24px', letterSpacing: '8px', textAlign: 'center', boxSizing: 'border-box',
            }}
          />

          {error && <p style={{ color: '#dc2626', fontSize: '13px', margin: 0 }}>{error}</p>}
          {info && <p style={{ color: '#16a34a', fontSize: '13px', margin: 0 }}>{info}</p>}

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            style={{
              padding: '12px', border: 'none', borderRadius: '8px',
              background: loading || otp.length !== 6 ? '#9ca3af' : '#dc2626', color: '#fff',
              fontWeight: 700, fontSize: '14px', cursor: loading ? 'default' : 'pointer',
            }}
          >
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <p style={{ fontSize: '13px', color: '#6b7280', textAlign: 'center', marginTop: '20px' }}>
          Didn't get a code?{' '}
          <button
            onClick={handleResend}
            disabled={resending}
            style={{ background: 'none', border: 'none', color: '#dc2626', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: '13px' }}
          >
            {resending ? 'Sending...' : 'Resend code'}
          </button>
        </p>
      </div>
    </div>
  )
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={null}>
      <VerifyOtpContent />
    </Suspense>
  )
}