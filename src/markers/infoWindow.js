import { getMap } from '../core/mapInstance.js'
import { getImageUrl } from '../api/propertyMapApi.js'

let currentInfoWindow = null
let carouselImages = []
let carouselIndex = 0

// Approximate LKR conversion rates (LKR ~ 300 per USD)
const CURRENCY_RATES = {
  USD: 0.0033,
  EUR: 0.0030,
  GBP: 0.0026,
  AUD: 0.0050,
  SGD: 0.0044,
}

const CURRENCY_SYMBOLS = {
  LKR: 'Rs ',
  USD: '$',
  EUR: '€',
  GBP: '£',
  AUD: 'A$',
  SGD: 'S$',
}

const SAVED_PROPERTIES_KEY = 'saved_properties'

function injectInfoWindowStyleOverrides() {
  if (typeof document === 'undefined') return
  if (document.getElementById('info-window-style-overrides')) return

  const style = document.createElement('style')
  style.id = 'info-window-style-overrides'
  style.textContent = `
    .gm-style-iw,
    .gm-style-iw-c,
    .gm-style-iw-d {
      padding: 0 !important;
      margin: 0 !important;
      overflow: hidden !important;
    }
    .gm-ui-hover-effect { display: none !important; }
  `
  document.head.appendChild(style)
}

injectInfoWindowStyleOverrides()

function getPriceLabel(property) {
  const rawPrice = property.price
    || parseInt((property.price_label || '').replace(/[^0-9]/g, ''), 10)
    || 0

  if (!rawPrice) {
    return property.price_label || property.priceLabel || 'Price on request'
  }

  const currency = (typeof window !== 'undefined' && localStorage.getItem('global_currency')) || 'LKR'

  if (currency === 'LKR' || !CURRENCY_RATES[currency]) {
    return `Rs ${rawPrice.toLocaleString()}`
  }

  const converted = rawPrice * CURRENCY_RATES[currency]
  const symbol = CURRENCY_SYMBOLS[currency] || ''
  return `${symbol}${converted.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
}

function getSavedPropertyIds() {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(SAVED_PROPERTIES_KEY) || '[]')
  } catch {
    return []
  }
}

function isPropertySaved(id) {
  return getSavedPropertyIds().some((savedId) => String(savedId) === String(id))
}

function updateCarouselImage() {
  const imgEl = document.getElementById('info-window-carousel-img')
  const counterEl = document.getElementById('info-window-carousel-counter')
  if (!imgEl || carouselImages.length === 0) return
  imgEl.src = getImageUrl(carouselImages[carouselIndex])
  if (counterEl) counterEl.textContent = `${carouselIndex + 1} / ${carouselImages.length}`
}

function renderFavoriteButtonState(saved) {
  const btn = document.getElementById('info-window-favorite-btn')
  if (!btn) return
  btn.innerHTML = saved ? '♥ Saved' : '♡ Favorite'
  btn.style.color = saved ? '#dc2626' : '#555'
  btn.style.borderColor = saved ? '#dc2626' : '#ddd'
}

function stripGoogleChromeSpacing() {
  const contentEl = document.getElementById('info-window-carousel-img')
  if (!contentEl) return

  const ourWrapper = contentEl.closest('a')
  if (!ourWrapper) return

  let node = ourWrapper
  let ancestor = node.parentElement
  let levels = 0

  while (ancestor && levels < 8) {
    ancestor.style.setProperty('padding', '0', 'important')
    ancestor.style.setProperty('margin', '0', 'important')

    if (levels < 3) {
      Array.from(ancestor.children).forEach((child) => {
        if (child !== node) {
          child.style.setProperty('display', 'none', 'important')
        }
      })
    }

    node = ancestor
    ancestor = ancestor.parentElement
    levels++
  }
}

if (typeof window !== 'undefined') {
  window.__infoWindowNextImage = function (event) {
    event.preventDefault()
    event.stopPropagation()
    if (carouselImages.length === 0) return
    carouselIndex = (carouselIndex + 1) % carouselImages.length
    updateCarouselImage()
  }

  window.__infoWindowPrevImage = function (event) {
    event.preventDefault()
    event.stopPropagation()
    if (carouselImages.length === 0) return
    carouselIndex = (carouselIndex - 1 + carouselImages.length) % carouselImages.length
    updateCarouselImage()
  }

  window.__infoWindowClose = function (event) {
    event.preventDefault()
    event.stopPropagation()
    if (currentInfoWindow) {
      currentInfoWindow.close()
      currentInfoWindow = null
    }
  }

  window.__infoWindowToggleFavorite = function (event, id) {
    event.preventDefault()
    event.stopPropagation()

    const current = getSavedPropertyIds()
    const idStr = String(id)
    const alreadySaved = current.some((savedId) => String(savedId) === idStr)
    const next = alreadySaved
      ? current.filter((savedId) => String(savedId) !== idStr)
      : [...current, id]

    localStorage.setItem(SAVED_PROPERTIES_KEY, JSON.stringify(next))
    window.dispatchEvent(new Event('savedPropertiesChanged'))
    renderFavoriteButtonState(!alreadySaved)

    // Keep any existing external hook (e.g. analytics) working if one is set.
    if (typeof window.handleFavorite === 'function') {
      window.handleFavorite(id)
    }
  }
}

export function createInfoWindow(marker, property) {
  // Close any existing open info window
  if (currentInfoWindow) {
    currentInfoWindow.close()
  }

  const images = Array.isArray(property.images) && property.images.length > 0
    ? property.images
    : null
  const placeholderImage = 'https://placehold.co/260x140?text=No+Image'
  const typeLabel = (property.type || '').replace(/_/g, ' ')

  function buildContent() {
    carouselImages = images || []
    carouselIndex = 0

    const priceLabel = getPriceLabel(property)
    const imageUrl = images ? getImageUrl(images[0]) : placeholderImage
    const hasMultipleImages = carouselImages.length > 1
    const saved = isPropertySaved(property.id)

    const carouselControlsHtml = hasMultipleImages ? `
      <button onclick="window.__infoWindowPrevImage(event)" aria-label="Previous photo" style="
        position: absolute; top: 50%; left: 6px; transform: translateY(-50%);
        width: 26px; height: 26px; border-radius: 50%; border: none;
        background: rgba(0,0,0,0.5); color: #fff; cursor: pointer; font-size: 15px;
        display: flex; align-items: center; justify-content: center; z-index: 2; padding: 0;
      ">‹</button>
      <button onclick="window.__infoWindowNextImage(event)" aria-label="Next photo" style="
        position: absolute; top: 50%; right: 6px; transform: translateY(-50%);
        width: 26px; height: 26px; border-radius: 50%; border: none;
        background: rgba(0,0,0,0.5); color: #fff; cursor: pointer; font-size: 15px;
        display: flex; align-items: center; justify-content: center; z-index: 2; padding: 0;
      ">›</button>
      <span id="info-window-carousel-counter" style="
        position: absolute; bottom: 6px; right: 8px;
        background: rgba(0,0,0,0.55); color: #fff; font-size: 10px;
        padding: 2px 7px; border-radius: 10px; z-index: 2;
      ">1 / ${carouselImages.length}</span>
    ` : ''

    return `
      <a href="/property_info/${property.id}" target="_blank" rel="noopener noreferrer" style="
        display: block;
        width: 260px;
        font-family: Arial, sans-serif;
        border-radius: 8px;
        overflow: hidden;
        text-decoration: none;
        color: inherit;
        cursor: pointer;
      ">
        <!-- Property Image + type badge + close button + carousel controls -->
        <div style="
          width: 100%;
          height: 140px;
          background-color: #e0e0e0;
          overflow: hidden;
          position: relative;
        ">
          <img
            id="info-window-carousel-img"
            src="${imageUrl}"
            alt="${property.title}"
            style="width: 100%; height: 100%; object-fit: cover; display: block;"
          />
          <span style="
            position: absolute;
            top: 8px;
            left: 8px;
            background: #111827;
            color: #fff;
            font-size: 10px;
            font-weight: 700;
            padding: 3px 8px;
            border-radius: 4px;
            text-transform: capitalize;
            z-index: 2;
          ">${typeLabel}</span>
          <button onclick="window.__infoWindowClose(event)" aria-label="Close" style="
            position: absolute; top: 8px; right: 8px;
            width: 26px; height: 26px; border-radius: 50%; border: none;
            background: rgba(0,0,0,0.5); color: #fff; cursor: pointer; font-size: 14px;
            display: flex; align-items: center; justify-content: center;
            z-index: 3; padding: 0; line-height: 1;
          ">✕</button>
          ${carouselControlsHtml}
        </div>

        <!-- Property Details -->
        <div style="padding: 12px;">

          <!-- Price — highlighted -->
          <div style="
            font-size: 18px;
            font-weight: 800;
            color: #dc2626;
            margin-bottom: 4px;
          ">
            ${priceLabel}
          </div>

          <!-- Title — highlighted -->
          <div style="
            font-size: 14px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 6px;
          ">
            ${property.title}
          </div>

          <!-- Location -->
          <div style="
            font-size: 12px;
            color: #888;
            margin-bottom: 10px;
          ">
            📍 ${property.location}
          </div>

          <!-- Favorite -->
          <button
            id="info-window-favorite-btn"
            onclick="window.__infoWindowToggleFavorite(event, ${property.id})"
            style="
              width: 100%;
              padding: 8px;
              background: white;
              border: 1px solid ${saved ? '#dc2626' : '#ddd'};
              border-radius: 4px;
              font-size: 12px;
              cursor: pointer;
              color: ${saved ? '#dc2626' : '#555'};
            "
          >
            ${saved ? '♥ Saved' : '♡ Favorite'}
          </button>

        </div>
      </a>
    `
  }

  const infoWindow = new google.maps.InfoWindow({ content: buildContent() })

  infoWindow.addListener('domready', stripGoogleChromeSpacing)

  marker.addListener('click', () => {
    if (currentInfoWindow) {
      currentInfoWindow.close()
    }
    
    infoWindow.setContent(buildContent())
    infoWindow.open(getMap(marker.mapId || 'map'), marker)
    currentInfoWindow = infoWindow
  })

  return infoWindow
}

export function closeInfoWindow() {
  if (currentInfoWindow) {
    currentInfoWindow.close()
    currentInfoWindow = null
  }
}