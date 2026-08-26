// Builds the HTML content element for a price-pill marker (AdvancedMarkerElement)

function formatPriceLabel(property) {
  const currency = (typeof window !== 'undefined' && window.localStorage)
    ? localStorage.getItem('global_currency') || 'LKR'
    : 'LKR'

  const rawPrice = property.price || parseInt((property.price_label || property.priceLabel || '').replace(/[^0-9]/g, '')) || 0

  // Approximate LKR conversion rates (LKR ~ 300 per USD)
  const rates = {
    USD: { symbol: '$', rate: 0.0033 },
    EUR: { symbol: '€', rate: 0.0030 },
    GBP: { symbol: '£', rate: 0.0026 },
    AUD: { symbol: 'A$', rate: 0.0050 },
    SGD: { symbol: 'S$', rate: 0.0044 },
  }

  let value
  let symbol

  const match = rates[currency]
  if (match) {
    value = rawPrice * match.rate
    symbol = match.symbol
  } else {
    // LKR (or unknown) falls back to native rupees
    value = rawPrice
    symbol = 'Rs '
  }

  let formatted
  if (value >= 1000000) {
    formatted = `${(value / 1000000).toFixed(1).replace(/\.0$/, '')}M`
  } else if (value >= 1000) {
    formatted = `${Math.round(value / 1000)}K`
  } else {
    formatted = `${Math.round(value)}`
  }

  const isMonthly = (property.price_label || property.priceLabel || '').includes('/mo')
  return `${symbol}${formatted}${isMonthly ? '/mo' : ''}`
}

// Colors matching the Buy / Rent / Land legend on the listings page —
// same lighter, translucent pill style the original single-color red
// pins used, just carried across all three categories.
const CATEGORY_COLORS = {
  buy:  { base: 'rgba(239, 68, 68, 0.55)',  hover: 'rgba(220, 38, 38, 0.85)', border: 'rgba(220, 38, 38, 0.6)' },  // red
  rent: { base: 'rgba(59, 130, 246, 0.55)', hover: 'rgba(37, 99, 235, 0.85)', border: 'rgba(37, 99, 235, 0.6)' },  // blue
  land: { base: 'rgba(74, 222, 128, 0.55)', hover: 'rgba(34, 197, 94, 0.85)', border: 'rgba(34, 197, 94, 0.6)' },  // green
}

function getCategory(property) {
  if (property.category) return property.category
  if (property.type === 'land') return 'land'
  if ((property.price_label || property.priceLabel || '').includes('/mo')) return 'rent'
  return 'buy'
}

function getCategoryPalette(property) {
  return CATEGORY_COLORS[getCategory(property)] || CATEGORY_COLORS.buy
}

function applyScale(wrapper, scale) {
  const label = wrapper.querySelector('.price-pill-label')
  const dot = wrapper.querySelector('.price-pill-dot')
  if (label) label.style.transform = `scale(${scale})`
  if (dot) dot.style.transform = `scale(${scale})`
}

export function createPriceMarkerElement(property, selected = false) {
  const palette = getCategoryPalette(property)

  const wrapper = document.createElement('div')
  wrapper.className = 'price-pill-marker'
  wrapper.style.display = 'flex'
  wrapper.style.flexDirection = 'column'
  wrapper.style.alignItems = 'center'
  wrapper.style.cursor = 'pointer'

  const baseScale = selected ? 1.18 : 1
  wrapper.dataset.baseScale = String(baseScale)

  const label = document.createElement('div')
  label.className = 'price-pill-label'
  label.textContent = formatPriceLabel(property)
  label.style.display = 'flex'
  label.style.alignItems = 'center'
  label.style.justifyContent = 'center'
  label.style.background = palette.base
  label.style.backdropFilter = 'blur(2px)'
  label.style.color = '#ffffff'
  label.style.fontFamily = "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  label.style.fontWeight = '700'
  label.style.fontSize = '13px'
  label.style.padding = '6px 12px'
  label.style.borderRadius = '999px'
  label.style.border = `1.5px solid ${palette.border}`
  label.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'
  label.style.whiteSpace = 'nowrap'
  label.style.transform = `scale(${baseScale})`
  label.style.transformOrigin = 'bottom center'
  label.style.transition = 'transform 0.15s ease, background 0.15s ease'
  label.style.marginBottom = '2px'

  const dot = document.createElement('div')
  dot.className = 'price-pill-dot'
  dot.style.width = '12px'
  dot.style.height = '12px'
  dot.style.borderRadius = '50%'
  dot.style.background = palette.base
  dot.style.border = '2px solid rgba(255, 255, 255, 0.85)'
  dot.style.boxShadow = '0 1px 4px rgba(0,0,0,0.2)'
  dot.style.transform = `scale(${baseScale})`
  dot.style.transformOrigin = 'top center'
  dot.style.transition = 'transform 0.15s ease'

  wrapper.appendChild(label)
  wrapper.appendChild(dot)

  wrapper.addEventListener('mouseenter', () => {
    label.style.transform = 'scale(1.3)'
    label.style.background = palette.hover
    label.style.zIndex = '10'
    dot.style.transform = 'scale(1.3)'
    wrapper.style.zIndex = '999'
  })

  wrapper.addEventListener('mouseleave', () => {
    const scale = parseFloat(wrapper.dataset.baseScale || '1')
    label.style.transform = `scale(${scale})`
    label.style.background = palette.base
    dot.style.transform = `scale(${scale})`
    wrapper.style.zIndex = ''
  })

  return wrapper
}

export function updatePriceMarkerElement(element, property, selected = false) {
  const label = element.querySelector('.price-pill-label')
  const baseScale = selected ? 1.18 : 1
  element.dataset.baseScale = String(baseScale)

  if (label) {
    label.textContent = formatPriceLabel(property)
  }
  applyScale(element, baseScale)
}