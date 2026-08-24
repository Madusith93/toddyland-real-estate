const apiKey =
  (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY) ||
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_MAPS_API_KEY) ||
  ''

export const MAP_CONFIG = {
  // Geographic center of Sri Lanka
  center: { lat: 7.8731, lng: 80.7718 },
  zoom: 8,
  libraries: ['drawing', 'places', 'geometry'],
  apiKey
}
