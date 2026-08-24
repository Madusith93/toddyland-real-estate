export function getMarkerIcon(type, selected = false) {
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
    villa: {
      color: '#111827',
      selectedColor: '#3b2f66',
      path: 'M20 6 L4 19 L8 19 L8 32 L32 32 L32 19 L36 19 Z M16 32 L16 22 L24 22 L24 32 Z'
    }
  }

  const icon = icons[type] || icons.house
  const color = selected ? icon.selectedColor : icon.color
  const size = selected ? 50 : 40

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 10}" viewBox="0 0 40 50">
      <path d="M20 0 C9 0 0 9 0 20 C0 35 20 50 20 50 C20 50 40 35 40 20 C40 9 31 0 20 0 Z"
        fill="${color}" />
      <circle cx="20" cy="20" r="13" fill="white" opacity="0.2"/>
      <path d="${icon.path}" fill="white" />
    </svg>
  `

  return {
    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg),
    scaledSize: new window.google.maps.Size(size, size + 10),
    anchor: new window.google.maps.Point(size / 2, size + 10)
  }
}