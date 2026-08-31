import { getMap } from '../core/mapInstance.js'

// Keyed by mapId (mirroring mapInstance.js's own mapInstances pattern) so
// this tool can be attached to more than one map on the site — e.g. the
// properties page's map (default id "map") AND the landing page's
// AllPropertiesMap (id "all-properties-map") — without one page's clicks,
// active-selection state, or teardown stepping on the other's.
const toolState = {}

function getState(mapId) {
  if (!toolState[mapId]) {
    toolState[mapId] = { activeRegionKey: null, onRegionSelectedCallback: null }
  }
  return toolState[mapId]
}

const initializedMapIds = new Set()
const SRI_LANKA_DISTRICTS = {
  ampara:        { name: 'Ampara',        province: 'Eastern',        provinceKey: 'eastern',       color: '#eb3232' },
  anuradhapura:  { name: 'Anuradhapura',  province: 'North Central',  provinceKey: 'north_central',  color: '#eb3232' },
  badulla:       { name: 'Badulla',       province: 'Uva',            provinceKey: 'uva',            color: '#eb3232' },
  batticaloa:    { name: 'Batticaloa',    province: 'Eastern',        provinceKey: 'eastern',        color: '#eb3232' },
  colombo:       { name: 'Colombo',       province: 'Western',        provinceKey: 'western',        color: '#eb3232' },
  galle:         { name: 'Galle',         province: 'Southern',       provinceKey: 'southern',       color: '#eb3232' },
  gampaha:       { name: 'Gampaha',       province: 'Western',        provinceKey: 'western',        color: '#eb3232' },
  hambantota:    { name: 'Hambantota',    province: 'Southern',       provinceKey: 'southern',       color: '#eb3232' },
  jaffna:        { name: 'Jaffna',        province: 'Northern',       provinceKey: 'northern',       color: '#eb3232' },
  kalutara:      { name: 'Kalutara',      province: 'Western',        provinceKey: 'western',        color: '#eb3232' },
  kandy:         { name: 'Kandy',         province: 'Central',        provinceKey: 'central',        color: '#eb3232' },
  kegalle:       { name: 'Kegalle',       province: 'Sabaragamuwa',   provinceKey: 'sabaragamuwa',   color: '#eb3232' },
  kilinochchi:   { name: 'Kilinochchi',   province: 'Northern',       provinceKey: 'northern',       color: '#eb3232' },
  kurunegala:    { name: 'Kurunegala',    province: 'North Western',  provinceKey: 'north_western',  color: '#eb3232' },
  mannar:        { name: 'Mannar',        province: 'Northern',       provinceKey: 'northern',       color: '#eb3232' },
  matale:        { name: 'Matale',        province: 'Central',        provinceKey: 'central',        color: '#eb3232' },
  matara:        { name: 'Matara',        province: 'Southern',       provinceKey: 'southern',       color: '#eb3232' },
  monaragala:    { name: 'Monaragala',    province: 'Uva',            provinceKey: 'uva',            color: '#eb3232' },
  mullaitivu:    { name: 'Mullaitivu',    province: 'Northern',       provinceKey: 'northern',       color: '#eb3232' },
  nuwara_eliya:  { name: 'Nuwara Eliya',  province: 'Central',        provinceKey: 'central',        color: '#eb3232' },
  polonnaruwa:   { name: 'Polonnaruwa',   province: 'North Central',  provinceKey: 'north_central',  color: '#eb3232' },
  puttalam:      { name: 'Puttalam',      province: 'North Western',  provinceKey: 'north_western',  color: '#eb3232' },
  ratnapura:     { name: 'Ratnapura',     province: 'Sabaragamuwa',   provinceKey: 'sabaragamuwa',   color: '#eb3232' },
  trincomalee:   { name: 'Trincomalee',   province: 'Eastern',        provinceKey: 'eastern',        color: '#eb3232' },
  vavuniya:      { name: 'Vavuniya',      province: 'Northern',       provinceKey: 'northern',       color: '#eb3232' },
}

function getRegionKeyFromFeature(feature) {
  // `district_key` is the field this app's own geojson was built with —
  // check it first. The rest are fallbacks in case the file ever gets
  // swapped for a different Sri Lanka boundaries source that doesn't carry
  // that exact property.
  const raw =
    feature.getProperty('district_key') ||
    feature.getProperty('name') ||
    feature.getProperty('NAME_1') ||
    feature.getProperty('hasc') ||
    feature.getId()

  if (!raw) return null
  const normalized = String(raw).toLowerCase().trim().replace(/\s+/g, '_')
  if (SRI_LANKA_DISTRICTS[normalized]) return normalized

  // Handles a raw "Nuwara Eliya" (space instead of underscore, different
  // case) or an HASC code like "LK.CO" falling through to here.
  const byName = Object.entries(SRI_LANKA_DISTRICTS).find(
    ([, d]) => d.name.toLowerCase() === String(raw).toLowerCase()
  )
  return byName ? byName[0] : null
}

function getStyleFn(mapId) {
  const state = getState(mapId)
  return (feature) => {
    const regionKey = getRegionKeyFromFeature(feature)
    const region = regionKey ? SRI_LANKA_DISTRICTS[regionKey] : null

    if (state.activeRegionKey && regionKey === state.activeRegionKey) {
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

// mapId defaults to 'map' so existing callers (properties/page.tsx, which
// calls initMap('map')) don't need to change. Pass the same id you gave
// initMap() when attaching this to a different map (e.g.
// initRegionTool(callback, 'all-properties-map')).
export async function initRegionTool(onRegionSelected, mapId = 'map') {
  const state = getState(mapId)
  state.onRegionSelectedCallback = onRegionSelected

  // Already attached to this map — don't re-fetch the geojson or attach a
  // second copy of the click/mouseover/mouseout listeners. The callback
  // above is still refreshed on every call, since a re-invocation (e.g. a
  // component remounting with fresh closures) legitimately needs its new
  // callback wired in even though the map layer itself doesn't need
  // rebuilding.
  if (initializedMapIds.has(mapId)) {
    console.log(`[RegionTool] initRegionTool("${mapId}") already attached — refreshing callback only`)
    return
  }
  // Claimed synchronously, before the fetch below — not after it succeeds.
  // If two initRegionTool() calls for the same mapId land back-to-back
  // (which is exactly the double-invoke scenario this guard exists for),
  // marking it only on success would leave a window where both calls see
  // initializedMapIds.has(mapId) === false and both proceed to attach
  // listeners anyway.
  initializedMapIds.add(mapId)

  const map = getMap(mapId)

  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''
    const response = await fetch(`${basePath}/data/sri-lanka-provinces.geojson`)
    if (!response.ok) {
      throw new Error(`Failed to fetch district boundaries: ${response.status} ${response.statusText}`)
    }
    const geojson = await response.json()

    // Debug: log the first feature's properties so we can verify the key names
    if (geojson.features?.length > 0) {
      console.log('[RegionTool] Sample feature properties:', geojson.features[0].properties)
      console.log('[RegionTool] Sample feature id:', geojson.features[0].id)
    }

    map.data.addGeoJson(geojson)
    map.data.setStyle(getStyleFn(mapId))

    map.data.addListener('click', (event) => {
      const regionKey = getRegionKeyFromFeature(event.feature)
      console.log('[RegionTool] Clicked feature regionKey:', regionKey)
      if (!regionKey) return
      handleRegionClick(map, mapId, regionKey)
    })

    map.data.addListener('mouseover', (event) => {
      const regionKey = getRegionKeyFromFeature(event.feature)
      if (regionKey && regionKey !== state.activeRegionKey) {
        const region = SRI_LANKA_DISTRICTS[regionKey]
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
    console.error(`[RegionTool] Failed to load GeoJSON (mapId="${mapId}"):`, err)
    // Setup didn't actually succeed — release the claim so a later retry
    // (e.g. the user reloads, or another effect run happens) isn't
    // permanently blocked by a failed first attempt.
    initializedMapIds.delete(mapId)
  }
}

function handleRegionClick(map, mapId, regionKey) {
  const state = getState(mapId)

  if (state.activeRegionKey === regionKey) {
    state.activeRegionKey = null
    map.data.setStyle(getStyleFn(mapId))
    if (state.onRegionSelectedCallback) state.onRegionSelectedCallback(null)
    return
  }

  state.activeRegionKey = regionKey
  map.data.setStyle(getStyleFn(mapId))

  const region = SRI_LANKA_DISTRICTS[regionKey]
  console.log(`[RegionTool] District selected: ${region.name} (${region.province} Province)`)

  if (state.onRegionSelectedCallback) {
    // `key` is a district slug (e.g. "colombo") — matches property.district
    // in properties/page.tsx's normalizeProperty(), so its existing
    // initRegionTool() callback (which filters propertiesCache by
    // property.district?.includes(region.key)) keeps working unchanged.
    // province/provinceKey are extra context for display only.
    state.onRegionSelectedCallback({
      key: regionKey,
      name: region.name,
      province: region.province,
      provinceKey: region.provinceKey,
    })
  }
}

export function clearRegionSelection(mapId = 'map') {
  try {
    const map = getMap(mapId)
    const state = getState(mapId)
    state.activeRegionKey = null
    map.data.setStyle(getStyleFn(mapId))
  } catch (err) {
    // Map for this id may already be gone (e.g. called after destroyMap(),
    // or for a map/page that never initialized this tool) — cleanup-style
    // calls shouldn't throw and crash the caller over that.
    console.warn(`[RegionTool] clearRegionSelection: no map "${mapId}" to clear:`, err.message)
  }
}

export function removeRegionTool(mapId = 'map') {
  try {
    const map = getMap(mapId)
    map.data.forEach((feature) => map.data.remove(feature))
  } catch (err) {
    console.warn(`[RegionTool] removeRegionTool: no map "${mapId}" to remove features from:`, err.message)
  }
  delete toolState[mapId]
  // Release the "already attached" claim too — a genuine unmount+remount
  // (navigating away from the page and back, not just a Strict
  // Mode/Fast-Refresh double-invoke within the same mount) destroys the
  // underlying map and should be allowed to set the region tool up fresh
  // next time, not stay permanently skipped because of this guard.
  initializedMapIds.delete(mapId)
}