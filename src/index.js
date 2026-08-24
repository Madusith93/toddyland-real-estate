import { initMap } from './core/mapInstance.js'
import { initBoundsManager } from './core/boundsManager.js'
import { addMarker, getMarkers } from './markers/markerManager.js'
import { createInfoWindow } from './markers/infoWindow.js'
import { initMarkerCluster } from './markers/markerCluster.js'
import { sampleProperties } from './data/sampleProperties.js'

// Button handlers - global so InfoWindow HTML can call them
window.handleFavorite = (id) => {
  console.log('Favorite property:', id)
}

window.handleContact = (id) => {
  console.log('Contact agent for property:', id)
}

initMap('map').then(() => {
  initBoundsManager((bounds) => {
    console.log('Fetch properties for:', bounds)
  })

  sampleProperties.forEach((property) => {
    const marker = addMarker({
      lat: property.lat,
      lng: property.lng,
      title: property.title,
      type: property.type,
      data: property
    })
    createInfoWindow(marker, property)
  })

  // Init clustering with all markers
  initMarkerCluster(getMarkers())

})
