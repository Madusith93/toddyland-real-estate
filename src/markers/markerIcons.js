export function createMarkerIcon(type, selected = false) {
  const icons = {
    house: {
      color: '#eb3232',
      selectedColor: '#a01f1f',
      path: 'M20 8 L6 18 L8 18 L8 32 L32 32 L32 18 L34 18 Z M14 32 L14 24 L26 24 L26 32 Z'
    },
    apartment: {
      color: '#ded24c',
      selectedColor: '#a89e1f',
      path: 'M20 8 L6 18 L8 18 L8 32 L32 32 L32 18 L34 18 Z M16 32 L16 23 L24 23 L24 32 Z'
    },
    land: {
      color: '#316fe1',
      selectedColor: '#1a4aab',
      path: 'M20 6 L20 10 M20 10 L6 19 L8 19 L8 32 L32 32 L32 19 L34 19 Z M16 32 L16 23 L24 23 L24 32 Z'
    },
    commercial: {
      color: '#36ae78',
      selectedColor: '#1e7a52',
      path: 'M8 10 L8 32 L32 32 L32 10 Z M12 14 L16 14 L16 18 L12 18 Z M24 14 L28 14 L28 18 L24 18 Z M12 22 L16 22 L16 26 L12 26 Z M24 22 L28 22 L28 26 L24 26 Z M18 24 L22 24 L22 32 L18 32 Z'
    },
    rental: {
      color: '#111827',
      selectedColor: '#3b2f66',
      path: 'M20 6 L4 19 L8 19 L8 32 L32 32 L32 19 L36 19 Z M16 32 L16 22 L24 22 L24 32 Z'
    }
  }

  const icon = icons[type] || icons.house

  return {
    path: icon.path,
    fillColor: selected ? icon.selectedColor : icon.color,
    fillOpacity: 1,
    strokeColor: '#ffffff',
    strokeWeight: 2,
    scale: selected ? 1.3 : 1,
    anchor: { x: 20, y: 32 }
  }
}