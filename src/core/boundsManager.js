import { getMap } from './mapInstance.js'

let boundsChangedListener = null

export function initBoundsManager(onBoundsChanged, elementId = 'map') {
  const map = getMap(elementId)

  // Wait for map to be idle then fire
  boundsChangedListener = map.addListener('idle', () => {
    const bounds = map.getBounds()

    if (!bounds) return

    const ne = bounds.getNorthEast()
    const sw = bounds.getSouthWest()

    const boundsData = {
      north: ne.lat(),
      east: ne.lng(),
      south: sw.lat(),
      west: sw.lng()
    }

    console.log('Map bounds changed:', boundsData)
    onBoundsChanged(boundsData)
  })
}

export function removeBoundsManager() {
  if (boundsChangedListener) {
    google.maps.event.removeListener(boundsChangedListener)
    boundsChangedListener = null
  }
}

export function getCurrentBounds(elementId = 'map') {
  const map = getMap(elementId)
  const bounds = map.getBounds()

  if (!bounds) return null

  const ne = bounds.getNorthEast()
  const sw = bounds.getSouthWest()

  return {
    north: ne.lat(),
    east: ne.lng(),
    south: sw.lat(),
    west: sw.lng()
  }
}