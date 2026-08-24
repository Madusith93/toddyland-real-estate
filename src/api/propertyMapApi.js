const API_BASE_URL =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_URL) ||
  'http://127.0.0.1:8000'

export function getImageUrl(path) {
  if (!path) return '/realestate/images/prop-minka.jpg'
  if (path.startsWith('http')) return path
  if (path.startsWith('/realestate/')) return path
  if (path.startsWith('/storage/')) return `${API_BASE_URL}${path}`
  return `${API_BASE_URL}${path}`
}

// Fetch properties list (with optional filters)
export async function fetchProperties(filters = {}) {
  const params = new URLSearchParams()

  if (filters.bounds) {
    params.append('north', filters.bounds.north)
    params.append('south', filters.bounds.south)
    params.append('east', filters.bounds.east)
    params.append('west', filters.bounds.west)
  }

  if (filters.region) params.append('region', filters.region)
  if (filters.type && filters.type !== 'all') params.append('type', filters.type)
  if (filters.minPrice) params.append('min_price', filters.minPrice)
  if (filters.maxPrice) params.append('max_price', filters.maxPrice)
  if (filters.recommended) params.append('recommended', 'true')

  try {
    const res = await fetch(`${API_BASE_URL}/api/properties?${params.toString()}`)
    if (!res.ok) {
      console.error(`fetchProperties failed: ${res.status} ${res.statusText}`)
      return []
    }
    const data = await res.json()
    return data.data ?? data
  } catch (err) {
    console.error('fetchProperties error:', err)
    return []
  }
}

// Fetch single property
export async function fetchProperty(id) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/properties/${id}`)
    if (!res.ok) {
      console.error(`fetchProperty failed: ${res.status} ${res.statusText}`)
      return null
    }
    return await res.json()
  } catch (err) {
    console.error('fetchProperty error:', err)
    return null
  }
}

// Submit a new property (seller)
export async function submitProperty(formData, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/properties`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      console.error(`submitProperty failed: ${res.status} ${res.statusText}`)
      return { success: false, status: res.status, error: data?.message || 'Failed to submit property', data }
    }
    return { success: true, data }
  } catch (err) {
    console.error('submitProperty error:', err)
    return { success: false, error: err.message || 'Network error' }
  }
}

// Get seller's own properties
export async function fetchMyProperties(token) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/properties`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (!res.ok) {
      console.error(`fetchMyProperties failed: ${res.status} ${res.statusText}`)
      return []
    }
    const data = await res.json()
    return data.data ?? data
  } catch (err) {
    console.error('fetchMyProperties error:', err)
    return []
  }
}

// Delete a property (seller)
export async function deleteProperty(id, token) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/properties/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      console.error(`deleteProperty failed: ${res.status} ${res.statusText}`)
      return { success: false, status: res.status, error: data?.message || 'Failed to delete property' }
    }
    return { success: true, data }
  } catch (err) {
    console.error('deleteProperty error:', err)
    return { success: false, error: err.message || 'Network error' }
  }
}