import { getMap } from '../core/mapInstance.js'

let activeRegionKey = null
let onRegionSelectedCallback = null

// Sri Lanka's 9 provinces. ISO 3166-2:LK codes are used as the join key
// (LK-1 .. LK-9) since most public Sri Lanka GeoJSON sources carry that
// code under one of a few common property names (see
// getRegionKeyFromFeature below).
const SRI_LANKA_PROVINCES = {
  western:        { name: 'Western',        color: '#eb3232', codes: ['1', 'LK-1', 'Western'] },
  central:        { name: 'Central',        color: '#eb3232', codes: ['2', 'LK-2', 'Central'] },
  southern:       { name: 'Southern',       color: '#eb3232', codes: ['3', 'LK-3', 'Southern'] },
  northern:       { name: 'Northern',       color: '#eb3232', codes: ['4', 'LK-4', 'Northern'] },
  eastern:        { name: 'Eastern',        color: '#eb3232', codes: ['5', 'LK-5', 'Eastern'] },
  north_western:  { name: 'North Western',  color: '#eb3232', codes: ['6', 'LK-6', 'North Western'] },
  north_central:  { name: 'North Central',  color: '#eb3232', codes: ['7', 'LK-7', 'North Central'] },
  uva:            { name: 'Uva',            color: '#eb3232', codes: ['8', 'LK-8', 'Uva'] },
  sabaragamuwa:   { name: 'Sabaragamuwa',   color: '#eb3232', codes: ['9', 'LK-9', 'Sabaragamuwa'] },
}

const codeToRegion = {}
Object.entries(SRI_LANKA_PROVINCES).forEach(([regionKey, region]) => {
  region.codes.forEach((code) => {
    codeToRegion[String(code).toLowerCase()] = regionKey
  })
})

function getRegionKeyFromFeature(feature) {
  // Try all known property names used across different GeoJSON sources for
  // Sri Lanka provinces (ISO code, ADM1 name, generic "name", etc.)
  const raw =
    feature.getProperty('shapeISO') ||
    feature.getProperty('ISO') ||
    feature.getProperty('iso_3166_2') ||
    feature.getProperty('ADM1_EN') ||
    feature.getProperty('NAME_1') ||
    feature.getProperty('name') ||
    feature.getProperty('province') ||
    feature.getId()

  if (!raw) return null
  return codeToRegion[String(raw).toLowerCase()] || null
}

function getStyleFn() {
  return (feature) => {
    const regionKey = getRegionKeyFromFeature(feature)
    const region = regionKey ? SRI_LANKA_PROVINCES[regionKey] : null

    if (activeRegionKey && regionKey === activeRegionKey) {
      return {
        strokeColor: region.color,
        strokeOpacity: 1,
        strokeWeight: 2,
        fillColor: region.color,
        fillOpacity: 0.35,
        visible: true,
        cursor: 'pointer',
      }
    }
    // Invisible but still receives clicks via data layer
    return {
      strokeColor: '#666',
      strokeOpacity: 0,
      strokeWeight: 1,
      fillColor: '#666',
      fillOpacity: 0.001, // near-zero keeps feature clickable
      visible: true,
      cursor: 'pointer',
    }
  }
}

export async function initRegionTool(onRegionSelected) {
  onRegionSelectedCallback = onRegionSelected
  const map = getMap()

  try {
    // NOTE: swap in a Sri Lanka province-boundaries GeoJSON URL here (e.g.
    // an ADM1-level export from GADM or HDX). Kept as a placeholder so this
    // never silently fetches Japan data - point it at your own hosted file
    // or a raw.githubusercontent.com URL for a Sri Lanka provinces geojson.
    const response = await fetch(
      '/data/sri-lanka-provinces.geojson'
    )
    const geojson = await response.json()

    // Debug: log the first feature's properties so we can verify the key names
    if (geojson.features?.length > 0) {
      console.log('[RegionTool] Sample feature properties:', geojson.features[0].properties)
      console.log('[RegionTool] Sample feature id:', geojson.features[0].id)
    }

    map.data.addGeoJson(geojson)
    map.data.setStyle(getStyleFn())

    map.data.addListener('click', (event) => {
      const regionKey = getRegionKeyFromFeature(event.feature)
      console.log('[RegionTool] Clicked feature regionKey:', regionKey)
      if (!regionKey) return
      handleRegionClick(map, regionKey)
    })

    map.data.addListener('mouseover', (event) => {
      const regionKey = getRegionKeyFromFeature(event.feature)
      if (regionKey && regionKey !== activeRegionKey) {
        const region = SRI_LANKA_PROVINCES[regionKey]
        event.feature.setProperty('_hover', true)
        map.data.overrideStyle(event.feature, {
          fillOpacity: 0.2,
          strokeOpacity: 0.6,
          strokeColor: region.color,
          fillColor: region.color,
        })
      }
    })

    map.data.addListener('mouseout', (event) => {
      map.data.revertStyle(event.feature)
    })

  } catch (err) {
    console.error('[RegionTool] Failed to load GeoJSON:', err)
  }
}

function handleRegionClick(map, regionKey) {
  if (activeRegionKey === regionKey) {
    activeRegionKey = null
    map.data.setStyle(getStyleFn())
    if (onRegionSelectedCallback) onRegionSelectedCallback(null)
    return
  }

  activeRegionKey = regionKey
  map.data.setStyle(getStyleFn())

  const region = SRI_LANKA_PROVINCES[regionKey]
  console.log(`[RegionTool] Region selected: ${region.name}`)

  if (onRegionSelectedCallback) {
    onRegionSelectedCallback({ key: regionKey, name: region.name })
  }
}

export function clearRegionSelection() {
  const map = getMap()
  activeRegionKey = null
  map.data.setStyle(getStyleFn())
}

export function removeRegionTool() {
  const map = getMap()
  map.data.forEach((feature) => map.data.remove(feature))
  activeRegionKey = null
}
