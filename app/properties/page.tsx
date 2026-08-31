'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { initMap } from '../../src/core/mapInstance.js'
import { initBoundsManager } from '../../src/core/boundsManager.js'
import { addMarker, getMarkers, clearMarkers, highlightMarker } from '../../src/markers/markerManager.js'
import { createInfoWindow } from '../../src/markers/infoWindow.js'
import { initMarkerCluster } from '../../src/markers/markerCluster.js'
import { initRegionTool, clearRegionSelection } from '../../src/drawing/drawAreaTool.js'
import { useSearchParams } from 'next/navigation'
import FAQ from '../components/FAQ'
import FilterBar, { defaultFilters, FilterState } from '../components/FilterBar'
import { fetchProperties, getImageUrl } from '../../src/api/propertyMapApi'
import { sampleProperties } from '../../src/data/sampleProperties.js'
import Link from 'next/link'

declare global {
  interface Window {
    handleFavorite: (id: any) => void
    handleContact: (id: any) => void
  }
}

// Kept in sync with the same constant in components/FilterBar.tsx so the
// location-chip row lines up under the same container width as the filter
// bar (and, ideally, the Navbar) instead of hugging the browser edge.
const PAGE_CONTAINER_MAX_WIDTH = '1440px'
const PAGE_CONTAINER_PADDING = '24px'

// Rough lat/lng bounding box per province, used to frame the map when a
// province is selected from the landing-page Sri Lanka map but has no
// listings yet.
const PROVINCE_BOUNDS: Record<string, { south: number; west: number; north: number; east: number }> = {
  western:        { south: 6.40, west: 79.65, north: 7.30, east: 80.30 },
  central:        { south: 6.90, west: 80.30, north: 7.90, east: 81.10 },
  southern:       { south: 5.90, west: 80.10, north: 6.60, east: 81.00 },
  northern:       { south: 8.40, west: 79.70, north: 9.90, east: 80.75 },
  eastern:        { south: 6.60, west: 81.00, north: 9.05, east: 81.90 },
  north_western:  { south: 7.20, west: 79.70, north: 8.40, east: 80.50 },
  north_central:  { south: 7.50, west: 80.10, north: 8.80, east: 81.10 },
  uva:            { south: 6.40, west: 80.70, north: 7.30, east: 81.90 },
  sabaragamuwa:   { south: 6.40, west: 80.10, north: 7.20, east: 80.90 },
}

// Sri Lanka's 25 districts grouped under their province, used for the
// district sub-filter and to fall back to the parent province's bounding
// box when a district has no listings yet.
const DISTRICTS_BY_PROVINCE: Record<string, { key: string; label: string }[]> = {
  western:       [{ key: 'colombo', label: 'Colombo' }, { key: 'gampaha', label: 'Gampaha' }, { key: 'kalutara', label: 'Kalutara' }],
  central:       [{ key: 'kandy', label: 'Kandy' }, { key: 'matale', label: 'Matale' }, { key: 'nuwara_eliya', label: 'Nuwara Eliya' }],
  southern:      [{ key: 'galle', label: 'Galle' }, { key: 'matara', label: 'Matara' }, { key: 'hambantota', label: 'Hambantota' }],
  northern:      [{ key: 'jaffna', label: 'Jaffna' }, { key: 'kilinochchi', label: 'Kilinochchi' }, { key: 'mannar', label: 'Mannar' }, { key: 'vavuniya', label: 'Vavuniya' }, { key: 'mullaitivu', label: 'Mullaitivu' }],
  eastern:       [{ key: 'trincomalee', label: 'Trincomalee' }, { key: 'batticaloa', label: 'Batticaloa' }, { key: 'ampara', label: 'Ampara' }],
  north_western: [{ key: 'kurunegala', label: 'Kurunegala' }, { key: 'puttalam', label: 'Puttalam' }],
  north_central: [{ key: 'anuradhapura', label: 'Anuradhapura' }, { key: 'polonnaruwa', label: 'Polonnaruwa' }],
  uva:           [{ key: 'badulla', label: 'Badulla' }, { key: 'monaragala', label: 'Monaragala' }],
  sabaragamuwa:  [{ key: 'ratnapura', label: 'Ratnapura' }, { key: 'kegalle', label: 'Kegalle' }],
}

// Reverse lookup: district key -> parent province key, so the map can frame
// on the province's bounds when the district itself has no coordinates yet.
const DISTRICT_TO_PROVINCE: Record<string, string> = Object.entries(DISTRICTS_BY_PROVINCE).reduce(
  (acc, [province, districts]) => {
    districts.forEach((d) => { acc[d.key] = province })
    return acc
  },
  {} as Record<string, string>
)

// ─────────────────────────────────────────────────────────────────────────
// normalizeProperty()
//
// Listings can arrive in two shapes: the flat schema used by
// src/data/sampleProperties.js (single `image` string, `priceLabel`,
// `propertyId`, string `landArea`/`buildingArea` like "140 sqm" or "-",
// `type` in {apartment, villa, house, land}, one `features` array, no
// district) — or the richer internal shape this page originally used
// (`images` array, `property_id`, `building_category`, numeric
// `land_area`/`building_area`, separate `features`/`highlights`, explicit
// `district`). This normalizes either shape into one consistent internal
// shape so the rest of the page only has to know about one.
//
// It's applied both to the sample fallback data below AND to whatever
// fetchProperties() returns, so real backend data in either shape works
// the same way without further changes here.
// ─────────────────────────────────────────────────────────────────────────
const AREA_NA = new Set(['-', '', 'n/a', 'na'])

const parseAreaValue = (v: any): number | undefined => {
  if (v === undefined || v === null) return undefined
  if (typeof v === 'number') return isNaN(v) ? undefined : v
  const s = v.toString().trim().toLowerCase()
  if (AREA_NA.has(s)) return undefined
  const n = parseFloat(s.replace(/[^0-9.]/g, ''))
  return isNaN(n) ? undefined : n
}

const parseLayoutCount = (layout: string | undefined, kind: 'Bed' | 'Bath'): number | undefined => {
  if (!layout) return undefined
  const m = layout.match(new RegExp(`(\\d+)\\s*${kind}`, 'i'))
  return m ? parseInt(m[1], 10) : undefined
}

// Maps the flat schema's `type` (apartment/villa/house/land) to the
// FilterBar's Property Type vocabulary (houses_villas, apartments_mansions,
// etc.) so the Property Type dropdown still works against this data.
const TYPE_TO_BUILDING_CATEGORY: Record<string, string> = {
  apartment: 'apartments_mansions',
  villa: 'houses_villas',
  house: 'houses_villas',
  land: 'land',
}

// A flat list of every district, used by inferDistrict() below.
const ALL_DISTRICTS_FLAT = Object.values(DISTRICTS_BY_PROVINCE).flat()

// The flat sample-data schema doesn't carry a `district` field, only a
// free-text `location` (e.g. "Colombo 3, Western Province"). Guess the
// district by checking whether any known district name appears in the
// location or title text, so the district sub-filter still narrows
// results sensibly instead of excluding everything.
const inferDistrict = (text: string): string | undefined => {
  const lower = (text || '').toLowerCase()
  const match = ALL_DISTRICTS_FLAT.find((d) => lower.includes(d.label.toLowerCase()))
  return match?.key
}

// Buy / Rent / Land is the FilterBar's top-level tab split. The flat schema
// has no explicit category field, so it's inferred the same way the map
// marker module (createPriceMarkerElement's getCategory) does: land type ->
// 'land', a price label containing "/mo" -> 'rent', otherwise 'buy'.
const getListingCategory = (raw: any): 'buy' | 'rent' | 'land' => {
  if (raw.listingCategory) return raw.listingCategory
  if (raw.type === 'land') return 'land'
  if (raw.type === 'rental') return 'rent'
  const label = (raw.priceLabel || raw.price_label || '').toString()
  if (label.includes('/mo')) return 'rent'
  return 'buy'
}

function normalizeProperty(raw: any): any {
  const listingCategory = getListingCategory(raw)
  const featureList: string[] = Array.isArray(raw.features) ? raw.features : []

  return {
    ...raw,
    id: raw.id,
    property_id: raw.property_id || raw.propertyId,
    title: raw.title,
    // Raw sub-type (apartment/villa/house/land, or the old houses_villas-
    // style slug) — used for the card badge and the Property Type filter.
    type: raw.type,
    // 'buy' | 'rent' | 'land' — drives the Buy/Rent/Land tabs.
    listingCategory,
    building_category: raw.building_category || TYPE_TO_BUILDING_CATEGORY[raw.type] || 'houses_villas',
    price: raw.price,
    price_label: raw.price_label || raw.priceLabel,
    location: raw.location,
    region: raw.region,
    district: raw.district || inferDistrict(`${raw.location || ''} ${raw.title || ''}`),
    lat: raw.lat,
    lng: raw.lng,
    images: Array.isArray(raw.images) ? raw.images : (raw.image ? [raw.image] : []),
    bedrooms: raw.bedrooms ?? parseLayoutCount(raw.layout, 'Bed'),
    bathrooms: raw.bathrooms ?? parseLayoutCount(raw.layout, 'Bath'),
    layout: raw.layout,
    land_area: raw.land_area ?? parseAreaValue(raw.landArea),
    building_area: raw.building_area ?? parseAreaValue(raw.buildingArea),
    year_of_construction: raw.year_of_construction || raw.yearOfConstruction,
    // The flat schema only has one `features` list (no separate
    // highlights) — mirror it into `highlights` too so both the Property
    // Features and Property Highlights filters can match against it.
    features: featureList,
    highlights: Array.isArray(raw.highlights) ? raw.highlights : featureList,
    note: raw.note,
    available: raw.available !== false,
  }
}

// Sample/demo listings — used only as a fallback while the real backend
// isn't connected yet (see the fetchProperties() try/catch below), so the
// site has something on the map and in the list to show a client. Sourced
// from src/data/sampleProperties.js — the same file AllPropertiesMap.tsx
// reads on the landing page, so demo listings match everywhere. Delete
// this block (and the fallback branch that references it) once the real
// API is wired up and returning data.
const SAMPLE_PROPERTIES: any[] = sampleProperties.map(normalizeProperty)

function PropertiesContent() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [allProperties, setAllProperties] = useState<any[]>([])
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  // True when fetchProperties() failed or returned nothing, so we fell back
  // to SAMPLE_PROPERTIES. Drives the "demo data" banner below — remove both
  // once the real backend is live.
  const [usingSampleData, setUsingSampleData] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  // Toggled from the FilterBar's "Hide Map" control — hides both the map
  // and its adjoining property-list column, leaving just the filter bar
  // and the full-width "All Properties" section further down the page.
  const [mapHidden, setMapHidden] = useState(false)
  const [directTypeFilter, setDirectTypeFilter] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const [heroSearchQuery, setHeroSearchQuery] = useState<string>('')
  const [isMapReady, setIsMapReady] = useState<boolean>(false)
  const [currentCurrency, setCurrentCurrency] = useState<string>('LKR')
  const [currentUnit, setCurrentUnit] = useState<string>('M2')
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<any>>(new Set())
  // Province-level filter, set from the landing-page Sri Lanka map (?province=)
  const [regionFilter, setRegionFilter] = useState<string | null>(null)
  // District-level sub-filter, set from the landing-page map (?district=) or
  // narrowed further once a province is already selected.
  const [districtFilter, setDistrictFilter] = useState<string | null>(null)

  // Holds the Google Maps instance so the region effect can pan/zoom it.
  const mapRef = useRef<any>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const mql = window.matchMedia('(min-width: 768px)')
    setIsDesktop(mql.matches)

    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches)
    mql.addEventListener('change', handleChange)
    return () => mql.removeEventListener('change', handleChange)
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('saved_properties') || '[]')
        setSavedPropertyIds(new Set(stored))
      } catch {
        setSavedPropertyIds(new Set())
      }
    }
  }, [])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCurrency = localStorage.getItem('global_currency') || 'LKR'
      setCurrentCurrency(savedCurrency)
      const savedUnit = localStorage.getItem('global_unit') || 'M2'
      setCurrentUnit(savedUnit)
      const savedLang = localStorage.getItem('global_language') || 'EN'

      const langMap: { [key: string]: string } = {
        'EN': 'en',
        'SI': 'si',
        'TA': 'ta',
      }

      const targetLang = langMap[savedLang] || 'en'

      if (document.cookie.indexOf('googtrans') === -1 || !document.cookie.includes(targetLang)) {
        document.cookie = `googtrans=/en/${targetLang}; path=/;`
      }
    }

    const handlePreferencesUpdate = () => {
      setCurrentCurrency(localStorage.getItem('global_currency') || 'LKR')
      setCurrentUnit(localStorage.getItem('global_unit') || 'M2')
    }

    window.addEventListener('preferencesChanged', handlePreferencesUpdate)
    return () => window.removeEventListener('preferencesChanged', handlePreferencesUpdate)
  }, [])

  const formatPrice = (property: any) => {
    const rawPrice = property.price || parseInt(property.price_label?.replace(/[^0-9]/g, '')) || 10000000
    // Rentals carry their monthly figure in `price` (e.g. 120000), not a
    // separate rate — append "/mo" ourselves rather than relying on
    // price_label always being present.
    const suffix = property.listingCategory === 'rent' ? '/mo' : ''

    if (currentCurrency === 'LKR') {
      return `Rs. ${rawPrice.toLocaleString()}${suffix}`
    }

    // Indicative LKR -> foreign-currency rates. These are placeholder rates
    // for display only — swap in a live FX feed before relying on them for
    // anything transactional.
    const rates: Record<string, { symbol: string; rate: number }> = {
      USD: { symbol: '$', rate: 1 / 300 },
      GBP: { symbol: '£', rate: 1 / 380 },
      EUR: { symbol: '€', rate: 1 / 320 },
      AUD: { symbol: 'A$', rate: 1 / 200 },
    }

    const match = rates[currentCurrency]
    if (match) {
      return `${match.symbol}${(rawPrice * match.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}${suffix}`
    }

    return property.price_label || `Rs. ${rawPrice.toLocaleString()}${suffix}`
  }

  const CURRENCY_TO_LKR: Record<string, number> = {
    USD: 300,
    GBP: 380,
    EUR: 320,
    AUD: 200,
  }

  const formatArea = (areaStr: string | number) => {
    if (!areaStr) return '-'
    const numericArea = typeof areaStr === 'number' ? areaStr : parseFloat(areaStr.toString().replace(/[^0-9.]/g, ''))
    if (isNaN(numericArea)) return areaStr.toString()
    if (currentUnit === 'SQFT') return `${(numericArea * 10.7639).toFixed(0)} sqft`
    if (currentUnit === 'PERCH') return `${(numericArea / 25.29).toFixed(2)} perches`
    return `${numericArea} m²`
  }

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property)
    highlightMarker(property.id)

    try {
      const markers = getMarkers()
      const match = markers.find((m: any) => {
        const data = m.data ?? m.propertyData ?? (typeof m.get === 'function' ? m.get('data') : null)
        return data?.id === property.id
      })
      if (match && (window as any).google?.maps?.event) {
        ;(window as any).google.maps.event.trigger(match, 'click')
      }
    } catch (err) {
      console.log('Could not trigger info window for property click:', err)
    }
  }

  const handleViewOnMap = (property: any) => {
    handlePropertyClick(property)
    const mapEl = document.getElementById('map')
    if (mapEl) {
      mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleShareWhatsApp = (property: any) => {
    const propertyUrl = typeof window !== 'undefined'
      ? `${window.location.origin}${window.location.pathname}?id=${property.id}`
      : ''
    const message = `Check out this property: ${property.title}\n${formatPrice(property)} - ${property.location}\n${propertyUrl}`
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const handleSaveProperty = (property: any) => {
    setSavedPropertyIds((prev) => {
      const next = new Set(prev)
      if (next.has(property.id)) {
        next.delete(property.id)
      } else {
        next.add(property.id)
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem('saved_properties', JSON.stringify(Array.from(next)))
        window.dispatchEvent(new Event('savedPropertiesChanged'))
      }
      return next
    })
    if (typeof window !== 'undefined' && typeof window.handleFavorite === 'function') {
      window.handleFavorite(property.id)
    }
  }

  const handleMessageAgent = (property: any) => {
    const agentPhone = '94771234567' // +94 77 123 4567 in international format for wa.me
    const message = property
      ? `Hi, I'm interested in this property: ${property.title} (${formatPrice(property)}) - ${property.location}. Could you share more details?`
      : "Hi, I'm interested in one of your properties. Could you share more details?"
    const whatsappUrl = `https://wa.me/${agentPhone}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  const getBuildingAge = (property: any): number => {
    const str = (property.year_of_construction || property.yearOfConstruction || '').toString()
    if (/new/i.test(str)) return 0
    const matchAge = str.match(/\((\d+)\s*years? old\)/i)
    if (matchAge) return parseInt(matchAge[1], 10)
    const matchYear = str.match(/\b(19|20)\d{2}\b/)
    if (matchYear) return new Date().getFullYear() - parseInt(matchYear[0], 10)
    return -1
  }

  const getFeatures = (property: any): string[] => {
    const f = property.features
    if (Array.isArray(f)) return f
    if (typeof f === 'string') {
      try { return JSON.parse(f) } catch { return [] }
    }
    return []
  }

  // Location-based highlights (near beach, near tea plantation, etc.) — a
  // separate list from `features` (in-property amenities like hot water,
  // wifi, sauna), matching the FilterBar's Property Highlights section.
  const getHighlights = (property: any): string[] => {
    const h = property.highlights
    if (Array.isArray(h)) return h
    if (typeof h === 'string') {
      try { return JSON.parse(h) } catch { return [] }
    }
    return []
  }

  const normalize = (v: any) => (v || '').toString().trim().toLowerCase()

  // Bed Rooms / Bathrooms are multi-select now — an empty array means "Any",
  // otherwise the listing matches if it satisfies ANY of the selected
  // counts. '5+' means "5 or more"; every other value is an exact match.
  const matchesCount = (filterValues: string[], actual: any): boolean => {
    if (filterValues.length === 0) return true
    const n = parseInt((actual ?? '').toString().replace(/[^0-9]/g, ''), 10)
    if (isNaN(n)) return true // don't exclude listings that haven't set this field yet
    return filterValues.some((fv) => (fv === '5+' ? n >= 5 : n === parseInt(fv, 10)))
  }

  const finalDisplayProperties = filteredProperties.filter((property: any) => {
    // listingCategory ('buy'/'rent'/'land') is set by normalizeProperty() —
    // it's derived, not a raw field, so it works the same way whether the
    // underlying data uses the flat sampleProperties.js schema or the
    // richer internal one.
    if (filters.tab === 'rent' && property.listingCategory !== 'rent') return false
    if (filters.tab === 'land' && property.listingCategory !== 'land') return false
    if (filters.tab === 'buy' && property.listingCategory !== 'buy') return false

    // Exact province match, set by clicking a province on the landing-page Sri Lanka map
    if (regionFilter && normalize(property.region) !== normalize(regionFilter)) return false

    // Exact district match, set from the landing-page map or a district sub-filter
    if (districtFilter && normalize(property.district) !== normalize(districtFilter)) return false

    if (directTypeFilter) {
      // Adjust the right-hand arrays to match the exact type strings your API
      // returns. Kept aligned with the FilterBar's propertyType slugs.
      const TYPE_ALIASES: Record<string, string[]> = {
        houses_villas: ['houses_villas', 'house', 'villa', 'houses_and_villas'],
        apartments_mansions: ['apartments_mansions', 'apartment', 'flat', 'condo', 'mansion'],
        hotels_resorts: ['hotels_resorts', 'hotel', 'resort'],
        eco_lodges_cottages: ['eco_lodges_cottages', 'eco_lodge', 'cottage'],
        business_properties: ['business_properties', 'business', 'commercial'],
        farm_houses: ['farm_houses', 'farmhouse', 'farm_house'],
        land: ['land', 'bare_land'],
        rental: ['rental', 'rent'],
      }
      const norm = (t: any) => (t || '').toString().toLowerCase().replace(/[\s_-]/g, '')
      const allowed = (TYPE_ALIASES[directTypeFilter] || [directTypeFilter]).map(norm)
      if (!allowed.includes(norm(property.type))) return false
    }

    if (filters.region !== 'any' && filters.region !== 'map') {
      if (normalize(property.region) !== normalize(filters.region)) return false
    }

    if (filters.propertyType !== 'any') {
      if (normalize(property.building_category) !== normalize(filters.propertyType)) return false
    }

    const rawPrice = property.price || parseInt(property.price_label?.replace(/[^0-9]/g, '')) || 0
    const currencyToLkr = filters.priceCurrency === 'LKR' ? 1 : (CURRENCY_TO_LKR[filters.priceCurrency] ?? 1)
    if (filters.priceMin) {
      const min = parseFloat(filters.priceMin) * currencyToLkr
      if (rawPrice < min) return false
    }
    if (filters.priceMax) {
      const max = parseFloat(filters.priceMax) * currencyToLkr
      if (rawPrice > max) return false
    }

    if (!matchesCount(filters.bedrooms, property.bedrooms)) return false
    if (!matchesCount(filters.bathrooms, property.bathrooms)) return false

    // FilterBar's size dropdowns are already denominated in m² (sizeUnit is
    // fixed to 'sqm' there), so land/building area compare directly — no
    // unit conversion needed here. (formatArea's separate sqft/perch toggle
    // is a display-only preference and doesn't affect filtering.)
    const landArea = parseFloat((property.land_area || property.landArea || '0').toString().replace(/[^0-9.]/g, ''))
    if (filters.landSizeMin && landArea < parseFloat(filters.landSizeMin)) return false
    if (filters.landSizeMax && landArea > parseFloat(filters.landSizeMax)) return false

    const buildingArea = parseFloat((property.building_area || property.buildingArea || '0').toString().replace(/[^0-9.]/g, ''))
    if (filters.buildingSizeMin && buildingArea < parseFloat(filters.buildingSizeMin)) return false
    if (filters.buildingSizeMax && buildingArea > parseFloat(filters.buildingSizeMax)) return false

    if (filters.propertyFeature.length > 0) {
      const features = getFeatures(property)
      const matchesAny = filters.propertyFeature.some((f) => features.includes(f))
      if (!matchesAny) return false
    }

    if (filters.propertyHighlights.length > 0) {
      const highlights = getHighlights(property)
      const matchesAny = filters.propertyHighlights.some((h) => highlights.includes(h))
      if (!matchesAny) return false
    }

    if (filters.showOnlyAvailable && property.available === false) return false

    if (filters.ageOfBuilding !== 'any') {
      const age = getBuildingAge(property)
      if (age !== -1) {
        const ageMap: { [key: string]: (a: number) => boolean } = {
          brandnew: (a) => a === 0,
          lt5: (a) => a < 5,
          lt10: (a) => a < 10,
          lt20: (a) => a < 20,
          lt30: (a) => a < 30,
          lt50: (a) => a < 50,
          gt50: (a) => a > 50,
        }
        const check = ageMap[filters.ageOfBuilding]
        if (check && !check(age)) return false
      }
    }

    if (heroSearchQuery.trim()) {
      const q = heroSearchQuery.toLowerCase()
      const regionMatch = property.region?.toLowerCase().includes(q)
      const districtMatch = property.district?.toLowerCase().includes(q)
      const titleMatch = property.title?.toLowerCase().includes(q)
      const locationMatch = property.location?.toLowerCase().includes(q)
      if (!regionMatch && !districtMatch && !titleMatch && !locationMatch) return false
    }

    return true
  })

  useEffect(() => {
    const regionParam = searchParams.get('province') || searchParams.get('region')
    const districtParam = searchParams.get('district')
    const typeParam = searchParams.get('type')
    const featureParam = searchParams.get('feature')
    const id = searchParams.get('id')
    const selectParam = searchParams.get('select')
    if (regionParam) setRegionFilter(regionParam.toLowerCase())
    if (districtParam) setDistrictFilter(districtParam.toLowerCase())
    if (typeParam) {
      const lowerType = typeParam.toLowerCase()
      // Top-level Buy/Rent/Land links — e.g. the Navbar's Properties
      // dropdown, which links to /properties?type=buy, ?type=rent,
      // ?type=land — map directly onto FilterBar's tab values, so just
      // switch tabs. These must NOT also go through directTypeFilter below:
      // 'buy'/'rent' aren't real property.type values (every listing's raw
      // type is apartment/villa/house/land — nothing is literally "buy"),
      // so setting directTypeFilter to 'buy' ran it through TYPE_ALIASES,
      // matched no listing at all, and filtered the page down to zero
      // properties. listingCategory (which the tab filter already checks)
      // is what actually distinguishes buy/rent/land — that's a derived
      // field from normalizeProperty(), not the raw type.
      const TOP_LEVEL_TAB: Record<string, FilterState['tab']> = {
        buy: 'buy',
        rent: 'rent',
        rental: 'rent', // older alias, in case another link still uses it
        land: 'land',
      }

      if (TOP_LEVEL_TAB[lowerType]) {
        setDirectTypeFilter(null) // clear any earlier specific-type narrowing
        setFilters((prev) => ({ ...prev, tab: TOP_LEVEL_TAB[lowerType] }))
      } else {
        // A specific property-type slug (houses_villas,
        // apartments_mansions, hotels_resorts, eco_lodges_cottages,
        // business_properties, farm_houses) — narrow to that exact type via
        // directTypeFilter/TYPE_ALIASES (see finalDisplayProperties above),
        // and switch to the tab it implies.
        setDirectTypeFilter(typeParam)

        const TAB_FOR_TYPE: Record<string, FilterState['tab']> = {
          houses_villas: 'buy',
          apartments_mansions: 'buy',
          hotels_resorts: 'buy',
          eco_lodges_cottages: 'buy',
          business_properties: 'buy',
          farm_houses: 'buy',
        }
        const tab = TAB_FOR_TYPE[lowerType]
        if (tab) setFilters((prev) => ({ ...prev, tab }))
      }
    }
    if (featureParam) setFilters((prev) => ({ ...prev, propertyFeature: [featureParam] }))
    const targetId = id || selectParam
    if (targetId && allProperties.length > 0) {
      const property = allProperties.find((p: any) => p.id === parseInt(targetId) || p.id === targetId)
      if (property) {
        setTimeout(() => {
          handlePropertyClick(property)
          const el = document.getElementById(`property-${property.id}`)
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }, 1500)
      }
    }
  }, [searchParams, allProperties])

  // The map/list section is hidden with display:none rather than unmounted
  // (unmounting would destroy the Google Maps instance, which only
  // initializes once). Since the container has zero size while hidden,
  // Google Maps needs an explicit resize + re-center once it's shown again.
  useEffect(() => {
    if (mapHidden) return
    const map = mapRef.current
    if (!map || typeof window === 'undefined' || !(window as any).google?.maps) return
    setTimeout(() => {
      const center = map.getCenter()
      ;(window as any).google.maps.event.trigger(map, 'resize')
      if (center) map.setCenter(center)
    }, 50)
  }, [mapHidden])

  useEffect(() => {
    window.handleFavorite = (id: any) => console.log('Favorite:', id)
    window.handleContact = (id: any) => console.log('Contact:', id)

    initMap('map').then(async (map) => {
      if (!map) return

      mapRef.current = map
      setLoading(false)
      setIsMapReady(true)

      // Google Maps measures its container's size once at init. Since the
      // container's height now comes from a CSS class (needed for the
      // mobile/desktop responsive split) rather than a synchronous inline
      // style, the map can initialize before that CSS has fully resolved,
      // rendering into a 0-height area and appearing blank. Forcing a
      // resize + re-center after the layout settles fixes this reliably.
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).google?.maps) {
          const center = map.getCenter()
          ;(window as any).google.maps.event.trigger(map, 'resize')
          if (center) map.setCenter(center)
        }
      }, 300)

      initBoundsManager((bounds: any) => {
        console.log('Fetch properties for bounds:', bounds)
      })

      let propertiesCache: any[] = [];

      // drawAreaTool.js now selects by district (25 individually clickable
      // shapes) rather than grouping into 9 provinces — see
      // src/drawing/drawAreaTool.js. Its callback shape is
      // { key: districtSlug, name: districtName, province, provinceKey }.
      //
      // Routed through districtFilter/regionFilter state (same as a
      // ?district=/?province= URL param) instead of hand-filtering
      // propertiesCache and overwriting filteredProperties directly, for
      // two reasons: (1) finalDisplayProperties already applies every other
      // active filter (tab, price, bedrooms, features, ...) on top of
      // whatever filteredProperties holds, so setting districtFilter and
      // letting that existing pipeline do the narrowing keeps a clicked
      // district composable with the rest of FilterBar instead of a
      // separate one-off filter path; (2) the "frame the map to the
      // selected area" effect below is gated on `regionFilter ||
      // districtFilter` being set — a district clicked directly on the map
      // now pans/zooms the map to it, which didn't happen before.
      initRegionTool((region: { key: string; name: string; province?: string; provinceKey?: string } | null) => {
        if (region) {
          setActiveRegion(region.name);
          setDistrictFilter(region.key);
          setRegionFilter(region.provinceKey ?? null);
        } else {
          setActiveRegion(null);
          setDistrictFilter(null);
          setRegionFilter(null);
        }
      });

      try {
        const properties = await fetchProperties();
        // Normalize real API data the same way as the sample fallback, in
        // case the backend returns the flat sampleProperties.js-style shape
        // (or a mix) rather than the original richer internal shape.
        const normalizedFetched = Array.isArray(properties) ? properties.map(normalizeProperty) : []
        // Backend isn't connected yet in some environments — fall back to
        // sample listings rather than showing an empty "0 properties" page.
        const finalProperties = normalizedFetched.length > 0 ? normalizedFetched : SAMPLE_PROPERTIES
        setUsingSampleData(finalProperties === SAMPLE_PROPERTIES)
        propertiesCache = finalProperties;
        setAllProperties(finalProperties);
        setFilteredProperties(finalProperties);
        // Markers are painted exclusively by the sync effect below, which
        // derives from finalDisplayProperties. Adding them here as well caused
        // a race: this block's delayed paint fired after the sync effect and
        // repainted the full, unfiltered set over the filtered one.
      } catch (error) {
        console.error('Failed to fetch properties, falling back to sample data:', error)
        setUsingSampleData(true)
        propertiesCache = SAMPLE_PROPERTIES;
        setAllProperties(SAMPLE_PROPERTIES);
        setFilteredProperties(SAMPLE_PROPERTIES);
      }
    })
  }, [])

  // Single source of truth for map markers — always mirrors the filtered list.
  useEffect(() => {
    if (isMapReady) {
      try {
        clearMarkers()
        finalDisplayProperties.forEach((property: any) => {
          const lat = property.lat
          const lng = property.lng
          if (typeof lat !== 'number' || typeof lng !== 'number' || isNaN(lat) || isNaN(lng)) {
            return
          }
          const marker = addMarker({
            lat,
            lng,
            title: property.title,
            type: property.type,
            data: property
          })
          if (marker && typeof createInfoWindow === 'function') createInfoWindow(marker, property)
        })
        initMarkerCluster(getMarkers())
      } catch (err) {
        console.log('Map sync safe catch:', err)
      }
    }
  }, [heroSearchQuery, filters, filteredProperties, isMapReady, directTypeFilter, regionFilter, districtFilter])

  // Frame the map on the selected province/district. Prefers the actual
  // filtered properties (tight fit); falls back to the district's — or, if
  // absent, the parent province's — bounding box so the map still moves
  // when an area has no listings yet.
  //
  // Only reframes when the SELECTED AREA itself changes (a new district/
  // province — via a map click or a ?district=/?province= link) — not on
  // every other filter tweak (price, bedrooms, tab, ...) that also
  // recomputes finalDisplayProperties while a district stays selected.
  // Without this guard, adjusting an unrelated filter while viewing a
  // district would re-snap the camera every time, which felt jarring —
  // the map should hold still once you're looking at the area you picked.
  const lastFramedAreaRef = useRef<string | null>(null)

  useEffect(() => {
    const map = mapRef.current
    const g = (window as any).google
    if (!map || !g?.maps || !isMapReady) return
    if (!regionFilter && !districtFilter) {
      lastFramedAreaRef.current = null
      return
    }

    const areaKey = `${regionFilter ?? ''}|${districtFilter ?? ''}`
    if (lastFramedAreaRef.current === areaKey) return
    lastFramedAreaRef.current = areaKey

    const bounds = new g.maps.LatLngBounds()
    let count = 0

    finalDisplayProperties.forEach((p: any) => {
      if (typeof p.lat === 'number' && typeof p.lng === 'number' && !isNaN(p.lat) && !isNaN(p.lng)) {
        bounds.extend({ lat: p.lat, lng: p.lng })
        count++
      }
    })

    if (count === 0) {
      const provinceKey = regionFilter || (districtFilter ? DISTRICT_TO_PROVINCE[districtFilter] : null)
      const rb = provinceKey ? PROVINCE_BOUNDS[provinceKey] : null
      if (!rb) return
      bounds.extend({ lat: rb.south, lng: rb.west })
      bounds.extend({ lat: rb.north, lng: rb.east })
    }

    // No longer pulling back to zoom 13 for a single-property match — a
    // tight fitBounds on one point is left as-is; that extra snap was the
    // part that felt disorienting.
    map.fitBounds(bounds, 60)
  }, [regionFilter, districtFilter, finalDisplayProperties, isMapReady])

  const activeAreaLabel = () => {
    if (heroSearchQuery) return `Search: ${heroSearchQuery}`
    if (districtFilter) {
      const label = Object.values(DISTRICTS_BY_PROVINCE).flat().find((d) => d.key === districtFilter)?.label
      return `District: ${label || districtFilter}`
    }
    if (regionFilter) return `Province: ${regionFilter.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`
    return activeRegion
  }

  return (
    // Small deliberate gap below the navbar (Navbar itself sits in normal
    // document flow, so this is just breathing room, not the fixed-navbar
    // overlap compensation the original clamp(64px, 8vw, 96px) value was
    // for). Bump this if it still reads as touching the navbar, or remove
    // it if Navbar ever becomes fixed/sticky and starts overlapping content.
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif', paddingTop: '20px' }}>

      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateX(-50%) translateY(20px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }

        /* Mobile-first defaults: list panel flows naturally with the page
           (no internal scroll cap). Map height is handled via inline style
           driven by JS (isDesktop), not CSS — Google Maps measures its
           container synchronously at init, and relying on an external
           stylesheet class here caused the map to render blank on mobile
           before the CSS had resolved. */
        .property-list-panel {
          max-height: none !important;
          overflow-y: visible !important;
        }

        @media (min-width: 768px) {
          .properties-split { flex-direction: row !important; height: 80vh !important; overflow: hidden; }
          .property-list-panel {
            width: 520px !important;
            min-width: 520px !important;
            max-height: 80vh !important;
            overflow-y: auto !important;
          }
        }
        @media (min-width: 500px) {
          .card-image { width: 200px !important; min-width: 200px !important; }
        }
        @media (min-width: 640px) {
          .bottom-card-image { width: 280px !important; min-width: 280px !important; }
        }
      `}</style>

      {/* Demo-data notice — visible only while the real backend isn't
          returning listings yet. Safe to delete this block (and the
          usingSampleData state + SAMPLE_PROPERTIES fallback above) once
          fetchProperties() is hitting the live API. */}
      {usingSampleData && (
        <div style={{ background: '#fffbeb', borderBottom: '1px solid #fde68a' }}>
          <div style={{ maxWidth: PAGE_CONTAINER_MAX_WIDTH, margin: '0 auto', padding: `8px ${PAGE_CONTAINER_PADDING}`, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-circle-info" style={{ color: '#b45309', fontSize: '13px' }}></i>
            <span style={{ fontSize: '13px', color: '#92400e' }}>
              Showing sample listings for preview — the live backend isn't connected yet.
            </span>
          </div>
        </div>
      )}

      <FilterBar
        filters={filters}
        onChange={setFilters}
        onSearch={() => {
          // Every search starts fresh from ALL properties.
          // Wipe earlier narrowing: map region draw, hero region text, hero type.
          clearRegionSelection()
          setActiveRegion(null)
          setHeroSearchQuery('')
          setDirectTypeFilter(null)
          setRegionFilter(null)
          setDistrictFilter(null)
          setFilteredProperties(allProperties)
        }}
        onToggleMap={setMapHidden}
      />

      {(heroSearchQuery || activeRegion || regionFilter || districtFilter) && (
        <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: PAGE_CONTAINER_MAX_WIDTH, margin: '0 auto', padding: `8px ${PAGE_CONTAINER_PADDING}` }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#fef2f2', borderRadius: '20px', border: '1px solid #dc2626' }}>
              <i className="fa-solid fa-location-dot" style={{ color: '#dc2626', fontSize: '12px' }}></i>
              <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
                {activeAreaLabel()}
              </span>
              <button
                onClick={() => {
                  setHeroSearchQuery('')
                  clearRegionSelection()
                  setActiveRegion(null)
                  setRegionFilter(null)
                  setDistrictFilter(null)
                  setFilteredProperties(allProperties)
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '14px', padding: 0, fontWeight: 'bold' }}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{ display: mapHidden ? 'none' : 'flex', flexDirection: 'column-reverse', height: 'auto' }}
        className="properties-split"
      >

        {/* Property List Panel */}
        <div style={{ width: '100%', overflowY: 'auto', background: '#f9fafb', borderRight: '1px solid #e5e7eb', padding: '20px 24px' }} className="property-list-panel">
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
            <i className="fa-solid fa-house" style={{ marginRight: '6px' }}></i>
            {finalDisplayProperties.length} properties found
          </p>

          {finalDisplayProperties.length === 0 && !loading && (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#9ca3af' }}>
              <i className="fa-solid fa-house-circle-xmark" style={{ fontSize: '36px', marginBottom: '12px', display: 'block' }}></i>
              <p style={{ fontSize: '14px' }}>No properties found matching your criteria.</p>
              <button
                onClick={() => {
                  setHeroSearchQuery('')
                  setFilters(defaultFilters)
                  setDirectTypeFilter(null)
                  setRegionFilter(null)
                  setDistrictFilter(null)
                  clearRegionSelection()
                  setActiveRegion(null)
                  setFilteredProperties(allProperties)
                }}
                style={{ marginTop: '12px', padding: '8px 16px', border: 'none', borderRadius: '8px', background: '#111827', color: '#fff', cursor: 'pointer', fontSize: '13px' }}
              >
                <i className="fa-solid fa-rotate-left" style={{ marginRight: '6px' }}></i>
                Reset Filters
              </button>
            </div>
          )}

          {finalDisplayProperties.map((property: any) => (
            <div
              key={property.id}
              id={`property-${property.id}`}
              onClick={() => handlePropertyClick(property)}
              style={{
                background: '#fff', borderRadius: '12px', overflow: 'hidden',
                marginBottom: '12px',
                boxShadow: selectedProperty?.id === property.id
                  ? '0 0 0 2px #111827, 0 4px 12px rgba(17,24,39,0.2)'
                  : '0 1px 3px rgba(0,0,0,0.08)',
                cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexWrap: 'wrap',
              }}
            >
              <div style={{ position: 'relative', width: '100%', minWidth: '0', height: '200px', overflow: 'hidden', background: '#e5e7eb' }} className="card-image">
                <img
                  src={getImageUrl(property.images?.[0])}
                  alt={property.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: '8px', left: '8px', background: '#111827', color: '#fff', fontSize: '10px', fontWeight: 600, padding: '3px 8px', borderRadius: '4px', textTransform: 'capitalize' }}>
                  {property.type.replace('_', ' ')}
                </span>
              </div>

              <div style={{ flex: 1, padding: '12px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                {/* Top row: property name (larger) on the left, favourite button on the right */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                  <span style={{ fontSize: '17px', fontWeight: 700, color: '#111827', margin: '4px 0' }}>
                    {property.title}
                  </span>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleSaveProperty(property) }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: savedPropertyIds.has(property.id) ? '#dc2626' : '#9ca3af', padding: 0, flexShrink: 0 }}
                  >
                    <i className={savedPropertyIds.has(property.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i>
                  </button>
                </div>

                {/* Price, in red */}
                <span style={{ fontWeight: 700, fontSize: '17px', color: '#dc2626' }}>
                  {formatPrice(property)}
                </span>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span style={{ fontSize: '11px', color: '#9ca3af' }}>
                    <i className="fa-solid fa-location-dot" style={{ marginRight: '4px', color: '#dc2626' }}></i>
                    {property.location}
                  </span>
                </div>

                {/* Bottom row: View Details button aligned to the right */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                  <Link
                    href={`/property_info?id=${property.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    style={{ padding: '8px 16px', border: 'none', borderRadius: '6px', background: '#111827', fontSize: '11px', cursor: 'pointer', color: '#fff', fontWeight: 500, textDecoration: 'none', display: 'inline-block' }}
                  >
                    <i className="fa-solid fa-eye" style={{ marginRight: '5px' }}></i>
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map Column */}
        <div
          style={{
            position: 'relative',
            flex: isDesktop ? 1 : 'none',
            height: isDesktop ? '80vh' : '220px',
            minHeight: isDesktop ? '80vh' : '220px',
          }}
          className="map-column"
        >
           <div id="map" style={{ width: '100%', height: '100%' }} />

          {loading && (
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              background: 'rgba(255,255,255,0.92)', display: 'flex',
              alignItems: 'center', justifyContent: 'center', zIndex: 5
            }}>
              <div style={{ textAlign: 'center' }}>
                <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px', color: '#111827', marginBottom: '12px', display: 'block' }}></i>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#374151' }}>Loading properties...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Property List Section */}
      <div style={{ background: '#fff', padding: 'clamp(24px, 6vw, 40px) 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#111827', margin: 0 }}>
                <i className="fa-solid fa-list" style={{ marginRight: '8px', color: '#6b7280' }}></i>
                All Properties
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px', marginBottom: 0 }}>
                {finalDisplayProperties.length} properties found
              </p>
            </div>

            <Link
              href="/list-property/info"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                padding: '10px 20px', background: '#111827', color: '#fff',
                borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                textDecoration: 'none', whiteSpace: 'nowrap',
              }}
            >
              <i className="fa-solid fa-plus"></i>
              List Your Property
            </Link>
          </div>

          {finalDisplayProperties.map((property: any) => {
            const detailRows = [
              { label: 'PRICE', value: formatPrice(property), icon: 'fa-money-bill-wave' },
              { label: 'LAYOUT', value: property.layout || '-', icon: 'fa-table-cells' },
              { label: 'BUILDING AREA', value: formatArea(property.building_area), icon: 'fa-building' },
              { label: 'LAND AREA', value: formatArea(property.land_area), icon: 'fa-expand' },
              { label: 'LOCATION', value: property.location, icon: 'fa-location-dot' },
            ]

            return (
              <div
                key={property.id}
                id={`property-list-${property.id}`}
                onClick={() => {
                  window.open(`/property_info?id=${property.id}`, '_blank', 'noopener,noreferrer')
                }}
                style={{
                  background: selectedProperty?.id === property.id ? '#f3f4f6' : '#fff',
                  border: `1px solid ${selectedProperty?.id === property.id ? '#111827' : '#f3f4f6'}`,
                  borderRadius: '16px', overflow: 'hidden', marginBottom: '24px',
                  padding: '16px', cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: '#6b7280', textTransform: 'capitalize', background: '#f3f4f6', padding: '3px 10px', borderRadius: '20px' }}>
                      {property.type.replace('_', ' ')}
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleSaveProperty(property) }}
                      style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', color: savedPropertyIds.has(property.id) ? '#dc2626' : '#111827', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <i className={savedPropertyIds.has(property.id) ? 'fa-solid fa-heart' : 'fa-regular fa-heart'}></i> {savedPropertyIds.has(property.id) ? 'SAVED' : 'SAVE'}
                    </button>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#111827', margin: 0, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    {property.title}
                  </h3>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ width: '100%', minWidth: '0', height: '200px', borderRadius: '8px', overflow: 'hidden', background: '#e5e7eb' }} className="bottom-card-image">
                    <img
                      src={getImageUrl(property.images?.[0])}
                      alt={property.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>

                    {/* Aligned label - value detail rows, larger font */}
                    <div style={{ marginBottom: '14px' }}>
                      {detailRows.map((row) => (
                        <div
                          key={row.label}
                          style={{
                            display: 'grid',
                            gridTemplateColumns: '180px 16px 1fr',
                            alignItems: 'baseline',
                            padding: '4px 0',
                          }}
                        >
                          <span style={{ fontSize: '14px', fontWeight: 700, color: '#374151' }}>
                            <i className={`fa-solid ${row.icon}`} style={{ marginRight: '6px', color: '#9ca3af', fontSize: '12px' }}></i>
                            {row.label}
                          </span>
                          <span style={{ fontSize: '14px', color: '#9ca3af' }}>-</span>
                          <span style={{
                            fontSize: row.label === 'PRICE' ? '18px' : '15px',
                            fontWeight: row.label === 'PRICE' ? 800 : 600,
                            color: row.label === 'PRICE' ? '#dc2626' : '#111827',
                          }}>
                            {row.value}
                          </span>
                        </div>
                      ))}
                    </div>

                    <p style={{
                      fontSize: '13px', color: '#374151', marginBottom: '16px',
                      display: 'flex', alignItems: 'baseline', gap: '6px',
                      width: '100%', minWidth: 0, overflow: 'hidden',
                    }}>
                      <i className="fa-regular fa-star" style={{ color: '#f59e0b', flexShrink: 0 }}></i>
                      <span style={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        minWidth: 0,
                        display: 'block',
                      }}>
                        {property.note}
                      </span>
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: 600 }}>
                        <i className="fa-solid fa-hashtag" style={{ marginRight: '4px' }}></i>
                        PROPERTY ID {property.property_id}
                      </span>
                      <Link
                        href={`/property_info?id=${property.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        style={{ padding: '8px 20px', background: '#111827', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none', display: 'inline-block' }}
                      >
                        <i className="fa-solid fa-arrow-up-right-from-square" style={{ marginRight: '6px' }}></i>
                        VIEW
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Pagination */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '32px', marginBottom: '32px' }}>
            {[1, 2, 3, 4, 5, 6].map((page) => (
              <button
                key={page}
                style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  background: page === 1 ? '#111827' : '#fff',
                  color: page === 1 ? '#fff' : '#374151',
                  fontSize: '13px', fontWeight: 600, cursor: 'pointer'
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <FAQ />
        </div>
      </div>


    </div>
  )
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        minHeight: '100vh', fontFamily: 'sans-serif', color: '#6b7280'
      }}>
        <div style={{ textAlign: 'center' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '32px', marginBottom: '12px', display: 'block', color: '#111827' }}></i>
          <p style={{ fontSize: '14px' }}>Loading page content...</p>
        </div>
      </div>
    }>
      <PropertiesContent />
    </Suspense>
  )
}