import { MAP_CONFIG } from '../config/mapConfig.js'

function isReady() {
  return !!(
    window.google &&
    window.google.maps &&
    window.google.maps.Map &&
    window.google.maps.marker &&
    window.google.maps.marker.AdvancedMarkerElement
  )
}

export async function loadGoogleMaps() {
  // If already fully loaded, skip
  if (isReady()) {
    return
  }

  // If script already exists in DOM, wait for it to finish loading
  if (document.querySelector('script[src*="maps.googleapis.com"]')) {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (isReady()) {
          clearInterval(interval)
          resolve()
        }
      }, 100)
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${MAP_CONFIG.apiKey}&libraries=drawing,places,geometry,marker&loading=async`
    script.async = true

    script.onload = () => {
      const interval = setInterval(() => {
        if (isReady()) {
          clearInterval(interval)
          resolve()
        }
      }, 50)

      // Safety timeout after 10s
      setTimeout(() => {
        clearInterval(interval)
        if (isReady()) {
          resolve()
        } else {
          reject(new Error('Google Maps libraries did not finish loading in time'))
        }
      }, 10000)
    }

    script.onerror = () => reject(new Error('Failed to load Google Maps'))
    document.head.appendChild(script)
  })
}

export function isGoogleMapsLoaded() {
  return isReady()
}