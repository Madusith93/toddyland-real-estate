import { loadGoogleMaps } from './mapLoader.js'
import { MAP_CONFIG } from '../config/mapConfig.js'

const mapInstances = {}

export async function initMap(elementId) {
  await loadGoogleMaps()

  const mapElement = document.getElementById(elementId)

  if (!mapElement) {
    console.warn(`Element with id "${elementId}" not found, skipping map init`)
    return null
  }

  // Reuse the cached map only if it's still bound to the SAME DOM node
  // that is currently in the document. In a Next.js app, client-side route
  // navigation unmounts and remounts components without a full page reload —
  // this module's state (mapInstances) persists across that navigation, but
  // the actual <div id="..."> gets destroyed and a new one created. Without
  // this check, we'd return a "live-looking" map object that's actually
  // still wired to a detached, dead DOM node — causing a blank map until a
  // hard refresh resets all module state.
  const cached = mapInstances[elementId]
  if (cached && cached.__boundElement === mapElement && document.body.contains(mapElement)) {
    return cached
  }

  const map = new window.google.maps.Map(mapElement, {
    center: MAP_CONFIG.center,
    zoom: MAP_CONFIG.zoom,
    mapTypeControl: true,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true,
    gestureHandling: 'greedy',
    mapId: MAP_CONFIG.mapId || 'DEMO_MAP_ID'
  })

  // Tag the map with the exact DOM node it's bound to, so a future call
  // can detect if that node has since been replaced/unmounted and knows
  // to rebuild instead of returning a stale reference.
  map.__boundElement = mapElement
  mapInstances[elementId] = map

  console.log(`Map initialized: ${elementId}`)
  return map
}

export function getMap(elementId = 'map') {
  if (!mapInstances[elementId]) {
    throw new Error(`Map "${elementId}" not initialized. Call initMap() first.`)
  }
  return mapInstances[elementId]
}

export function destroyMap(elementId = 'map') {
  delete mapInstances[elementId]
}