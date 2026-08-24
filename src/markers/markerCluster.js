import { MarkerClusterer } from '@googlemaps/markerclusterer'
import { getMap } from '../core/mapInstance.js'

let clusterer = null

export function initMarkerCluster(markers, mapId = 'map') {
  const map = getMap(mapId)

  if (clusterer) {
    clusterer.clearMarkers()
    clusterer = null
  }

  clusterer = new MarkerClusterer({
    map,
    markers,
    renderer: {
      render({ count, position }) {
        return new window.google.maps.Marker({
          position,
          icon: getClusterIcon(count),
          label: {
            text: String(count),
            color: 'black',
            fontSize: '13px',
            fontWeight: 'bold'
          },
          zIndex: Number(window.google.maps.Marker.MAX_ZINDEX) + count
        })
      }
    }
  })

  return clusterer
}

export function clearCluster() {
  if (clusterer) {
    clusterer.clearMarkers()
    clusterer = null
  }
}

function getClusterIcon(count) {
  const size = count > 10 ? 52 : count > 5 ? 46 : 40

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="#ffffff" opacity="0.3"/>
      <circle cx="${size / 2}" cy="${size / 2}" r="${size / 2 - 6}" fill="#ffffff"/>
    </svg>
  `

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(size, size),
    anchor: new window.google.maps.Point(size / 2, size / 2)
  }
}