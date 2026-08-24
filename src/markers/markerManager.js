import { getMap } from '../core/mapInstance.js'
import { createPriceMarkerElement, updatePriceMarkerElement } from './priceMarker.js'

let markers = []
let selectedMarker = null

export function addMarker({ lat, lng, title, type, data, mapId = 'map' }) {
  const map = getMap(mapId)

  const content = createPriceMarkerElement(data, false)

  const marker = new window.google.maps.marker.AdvancedMarkerElement({
    position: { lat, lng },
    map,
    title,
    content
  })

  marker.propertyData = data
  marker.propertyType = type
  marker.mapId = mapId
  markers.push(marker)
  return marker
}

export function highlightMarker(propertyId) {
  markers.forEach((marker) => {
    if (marker.propertyData?.id === propertyId) {
      updatePriceMarkerElement(marker.content, marker.propertyData, true)
      selectedMarker = marker
      getMap(marker.mapId || 'map').panTo(marker.position)
    } else {
      updatePriceMarkerElement(marker.content, marker.propertyData, false)
    }
  })
}

export function addMarkers(properties, mapId = 'map') {
  properties.forEach((property) => {
    addMarker({
      lat: property.lat,
      lng: property.lng,
      title: property.title,
      type: property.type,
      data: property,
      mapId
    })
  })
}

export function clearMarkers() {
  markers.forEach((marker) => { marker.map = null })
  markers = []
}

export function getMarkers() {
  return markers
}

export function triggerMarkerClick(propertyId) {
  const marker = markers.find((m) => m.propertyData?.id === propertyId)
  if (marker && window.google?.maps) {
    window.google.maps.event.trigger(marker, 'click')
  }
}