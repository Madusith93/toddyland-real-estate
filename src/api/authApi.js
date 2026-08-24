const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://127.0.0.1:8000'

// Register
export async function register(name, email, password, role) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email,
        password,
        password_confirmation: password,
        role
      })
    })
    const data = await res.json().catch(() => null)
    console.log('register response data:', data)
    if (!res.ok) {
      console.error(`register failed: ${res.status} ${res.statusText}`)
      return { ...data, success: false, status: res.status }
    }
    return { ...data, success: true }
  } catch (err) {
    console.error('register error:', err)
    return { success: false, message: 'Network error. Please try again.' }
  }
}

// Verify OTP
export async function verifyOtp(email, otp) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/verify-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp })
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      console.error(`verifyOtp failed: ${res.status} ${res.statusText}`)
      return { ...data, success: false, status: res.status }
    }
    return { ...data, success: true }
  } catch (err) {
    console.error('verifyOtp error:', err)
    return { success: false, message: 'Network error. Please try again.' }
  }
}

// Resend OTP
export async function resendOtp(email) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/resend-otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      console.error(`resendOtp failed: ${res.status} ${res.statusText}`)
      return { ...data, success: false, status: res.status }
    }
    return { ...data, success: true }
  } catch (err) {
    console.error('resendOtp error:', err)
    return { success: false, message: 'Network error. Please try again.' }
  }
}

// Login
export async function login(email, password) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      console.error(`login failed: ${res.status} ${res.statusText}`)
      return { ...data, success: false, status: res.status }
    }
    return { ...data, success: true }
  } catch (err) {
    console.error('login error:', err)
    return { success: false, message: 'Network error. Please try again.' }
  }
}

// Logout
export async function logout(token) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      console.error(`logout failed: ${res.status} ${res.statusText}`)
      return { ...data, success: false, status: res.status }
    }
    return { ...data, success: true }
  } catch (err) {
    console.error('logout error:', err)
    return { success: false, message: 'Network error. Please try again.' }
  }
}

// Get current user
export async function getMe(token) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    if (!res.ok) {
      console.error(`getMe failed: ${res.status} ${res.statusText}`)
      return null
    }
    return await res.json()
  } catch (err) {
    console.error('getMe error:', err)
    return null
  }
}