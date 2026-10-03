'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { initMap } from '../../src/core/mapInstance.js'
import { initBoundsManager } from '../../src/core/boundsManager.js'
import { addMarker, getMarkers, clearMarkers, highlightMarker } from '../../src/markers/markerManager.js'
import { createInfoWindow } from '../../src/markers/infoWindow.js'
import { initMarkerCluster } from '../../src/markers/markerCluster.js'
import { initRegionTool, clearRegionSelection } from '../../src/drawing/drawAreaTool.js'
import { useSearchParams } from 'next/navigation'
import FAQ from '../../components/FAQ'
import FilterBar, { defaultFilters, FilterState } from '../../components/FilterBar'
import { fetchProperties, getImageUrl } from '../../src/api/propertyMapApi'
import Link from 'next/link'

declare global {
  interface Window {
    handleFavorite: (id: any) => void
    handleContact: (id: any) => void
  }
}

// Rough lat/lng bounding box per province, used to frame the map when a
// province is selected from the landing-page Sri Lanka map but has no
// listings yet. Approximate — good enough for framing, not a source of truth.
const REGION_BOUNDS: Record<string, { south: number; west: number; north: number; east: number }> = {
  western:        { south: 6.4, west: 79.7, north: 7.3, east: 80.3 },
  central:        { south: 6.9, west: 80.3, north: 7.6, east: 81.0 },
  southern:       { south: 5.9, west: 80.0, north: 6.5, east: 81.5 },
  northern:       { south: 8.4, west: 79.7, north: 9.9, east: 80.8 },
  eastern:        { south: 6.8, west: 81.0, north: 9.0, east: 81.9 },
  north_western:  { south: 7.2, west: 79.7, north: 8.4, east: 80.5 },
  north_central:  { south: 7.6, west: 80.2, north: 8.9, east: 81.3 },
  uva:            { south: 6.4, west: 80.7, north: 7.4, east: 81.9 },
  sabaragamuwa:   { south: 6.4, west: 80.0, north: 7.3, east: 80.9 },
}

function PropertiesContent() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [activeRegion, setActiveRegion] = useState<string | null>(null)
  const [allProperties, setAllProperties] = useState<any[]>([])
  const [filteredProperties, setFilteredProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isDesktop, setIsDesktop] = useState(false)
  const [directTypeFilter, setDirectTypeFilter] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const [heroSearchQuery, setHeroSearchQuery] = useState<string>('')
  const [isMapReady, setIsMapReady] = useState<boolean>(false)
  const [currentCurrency, setCurrentCurrency] = useState<string>('LKR')
  const [currentUnit, setCurrentUnit] = useState<string>('M2')
  const [savedPropertyIds, setSavedPropertyIds] = useState<Set<any>>(new Set())
  const [regionFilter, setRegionFilter] = useState<string | null>(null)

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
    const rawPrice = property.price || parseInt(property.price_label?.replace(/[^0-9]/g, '')) || 1000000

    if (currentCurrency === 'LKR') {
      return `Rs ${rawPrice.toLocaleString()}`
    }

    // Approximate LKR conversion rates (LKR ~ 300 per USD)
    const rates: Record<string, { symbol: string; rate: number }> = {
      USD: { symbol: '$', rate: 0.0033 },
      EUR: { symbol: '€', rate: 0.0030 },
      GBP: { symbol: '£', rate: 0.0026 },
      AUD: { symbol: 'A$', rate: 0.0050 },
      SGD: { symbol: 'S$', rate: 0.0044 },
    }

    const match = rates[currentCurrency]
    if (match) {
      return `${match.symbol}${(rawPrice * match.rate).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
    }

    return property.price_label || `Rs ${rawPrice.toLocaleString()}`
  }

  const CURRENCY_TO_LKR: Record<string, number> = {
    USD: 1 / 0.0033,
    EUR: 1 / 0.0030,
    GBP: 1 / 0.0026,
    AUD: 1 / 0.0050,
    SGD: 1 / 0.0044,
  }

  const formatArea = (areaStr: string | number) => {
    if (!areaStr) return '-'
    const numericArea = typeof areaStr === 'number' ? areaStr : parseFloat(areaStr.toString().replace(/[^0-9.]/g, ''))
    if (isNaN(numericArea)) return areaStr.toString()
    if (currentUnit === 'SQFT') return `${(numericArea * 10.7639).toFixed(0)} sqft`
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
    // TODO: replace with your real WhatsApp business number, in international
    // format with no leading +, e.g. Sri Lanka would be 947XXXXXXXX
    const agentPhone = '94771234567'
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

  const normalize = (v: any) => (v || '').toString().trim().toLowerCase()

  // Category comes straight from the backend's `type` field, which is the
  // authoritative signal (house/apartment/commercial -> buy, land -> land,
  // rental -> rent). price_label is ALWAYS formatted as "Rs. {amount}" by
  // the backend (see Property::booted()) — it never appends "/mo" — so
  // that string check is kept only as a fallback for other data sources
  // (e.g. the standalone sampleProperties.js demo data) that predate the
  // real API and don't set type: 'rental'.
  const getListingCategory = (property: any): 'buy' | 'rent' | 'land' => {
    const type = normalize(property.type)
    if (type === 'land') return 'land'
    if (type === 'rental') return 'rent'
    if ((property.price_label || property.priceLabel || '').includes('/mo')) return 'rent'
    return 'buy'
  }

  const finalDisplayProperties = filteredProperties.filter((property: any) => {
    const category = getListingCategory(property)
    if (filters.tab === 'rent' && category !== 'rent') return false
    if (filters.tab === 'land' && category !== 'land') return false
    if (filters.tab === 'buy' && category !== 'buy') return false

    // Exact province match, set by clicking a province on the landing-page
    // Sri Lanka map. The backend calls this field "province" (district is a
    // separate, finer-grained field) — regionFilter/activeRegion are just
    // this component's internal naming for that selection.
    if (regionFilter && normalize(property.province) !== normalize(regionFilter)) return false

    if (directTypeFilter) {
      // Matches the backend's actual `type` enum: house, apartment, land,
      // commercial, rental.
      const TYPE_ALIASES: Record<string, string[]> = {
        house: ['house'],
        apartment: ['apartment', 'apt'],
        land: ['land'],
        commercial: ['commercial'],
        rental: ['rental', 'rent'],
      }
      const norm = (t: any) => (t || '').toString().toLowerCase().replace(/[\s_-]/g, '')
      const allowed = (TYPE_ALIASES[directTypeFilter] || [directTypeFilter]).map(norm)
      if (!allowed.includes(norm(property.type))) return false
    }

    if (filters.region !== 'any' && filters.region !== 'map') {
      if (normalize(property.province) !== normalize(filters.region)) return false
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

    if (filters.layout.length > 0) {
      const layoutStr = (property.layout || '').toLowerCase().replace(/\s/g, '')
      const matchesAny = filters.layout.some((l) => layoutStr.includes(l.toLowerCase().replace(/\s/g, '')))
      if (!matchesAny) return false
    }

    const toSqm = (value: number) => filters.sizeUnit === 'sqft' ? value / 10.7639 : value

    const landArea = parseFloat((property.land_area || property.landArea || '0').toString().replace(/[^0-9.]/g, ''))
    if (filters.landSizeMin && landArea < toSqm(parseFloat(filters.landSizeMin))) return false
    if (filters.landSizeMax && landArea > toSqm(parseFloat(filters.landSizeMax))) return false

    const buildingArea = parseFloat((property.building_area || property.buildingArea || '0').toString().replace(/[^0-9.]/g, ''))
    if (filters.buildingSizeMin && buildingArea < toSqm(parseFloat(filters.buildingSizeMin))) return false
    if (filters.buildingSizeMax && buildingArea > toSqm(parseFloat(filters.buildingSizeMax))) return false

    if (filters.propertySpaceMin) {
      const space = parseFloat((property.building_area || property.buildingArea || property.land_area || property.landArea || '0').toString().replace(/[^0-9.]/g, ''))
      if (space < toSqm(parseFloat(filters.propertySpaceMin))) return false
    }

    if (filters.propertyFeature.length > 0) {
      const features = getFeatures(property)
      const matchesAny = filters.propertyFeature.some((f) => features.includes(f))
      if (!matchesAny) return false
    }

    if (filters.propertyExtras.length > 0) {
      const features = getFeatures(property)
      const hasAll = filters.propertyExtras.every((extra) => features.includes(extra))
      if (!hasAll) return false
    }

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
      const provinceMatch = property.province?.toLowerCase().includes(q)
      const titleMatch = property.title?.toLowerCase().includes(q)
      const locationMatch = property.location?.toLowerCase().includes(q)
      if (!provinceMatch && !titleMatch && !locationMatch) return false
    }

    return true
  })

  useEffect(() => {
    const regionParam = searchParams.get('region')
    const typeParam = searchParams.get('type')
    const featureParam = searchParams.get('feature')
    const id = searchParams.get('id')
    const selectParam = searchParams.get('select')
    if (regionParam) setRegionFilter(regionParam.toLowerCase())
    if (typeParam) {
      setDirectTypeFilter(typeParam)

      const TAB_FOR_TYPE: Record<string, FilterState['tab']> = {
        house: 'buy',
        apartment: 'buy',
        commercial: 'buy',
        land: 'land',
        rental: 'rent',
      }
      const tab = TAB_FOR_TYPE[typeParam.toLowerCase()]
      if (tab) setFilters((prev) => ({ ...prev, tab }))
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

      initRegionTool((region: any) => {
        if (region) {
          setActiveRegion(region.name);

          const regionProperties = propertiesCache.filter((property: any) =>
            property.province?.toLowerCase().includes(region.key?.toLowerCase())
          );

          setFilteredProperties(regionProperties);
        } else {
          setActiveRegion(null);
          setFilteredProperties(propertiesCache);
        }
      });

      try {
        const properties = await fetchProperties();
        propertiesCache = properties;
        setAllProperties(properties);
        setFilteredProperties(properties);
        // Markers are painted exclusively by the sync effect below, which
        // derives from finalDisplayProperties. Adding them here as well caused
        // a race: this block's delayed paint fired after the sync effect and
        // repainted the full, unfiltered set over the filtered one.
      } catch (error) {
        console.error('Failed to fetch properties:', error)
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
  }, [heroSearchQuery, filters, filteredProperties, isMapReady, directTypeFilter, regionFilter])

  // Frame the map on the selected province. Prefers the actual filtered
  // properties (tight fit); falls back to the province's bounding box so
  // the map still moves when a province has no listings yet.
  useEffect(() => {
    const map = mapRef.current
    const g = (window as any).google
    if (!map || !g?.maps || !isMapReady) return
    if (!regionFilter) return

    const bounds = new g.maps.LatLngBounds()
    let count = 0

    finalDisplayProperties.forEach((p: any) => {
      if (typeof p.lat === 'number' && typeof p.lng === 'number' && !isNaN(p.lat) && !isNaN(p.lng)) {
        bounds.extend({ lat: p.lat, lng: p.lng })
        count++
      }
    })

    if (count === 0) {
      const rb = REGION_BOUNDS[regionFilter]
      if (!rb) return
      bounds.extend({ lat: rb.south, lng: rb.west })
      bounds.extend({ lat: rb.north, lng: rb.east })
    }

    map.fitBounds(bounds, 60)

    // A single property fits to max zoom, which is disorienting — pull back.
    if (count === 1) {
      g.maps.event.addListenerOnce(map, 'idle', () => {
        if (map.getZoom() > 13) map.setZoom(13)
      })
    }
  }, [regionFilter, finalDisplayProperties, isMapReady])

  // "north_western" -> "North Western"
  const formatRegionLabel = (region: string) =>
    region
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', fontFamily: 'sans-serif', paddingTop: 'clamp(64px, 8vw, 96px)' }}>

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
          setFilteredProperties(allProperties)
        }}
      />

      {(heroSearchQuery || activeRegion || regionFilter) && (
        <div style={{ padding: '8px 24px', background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 12px', background: '#fef2f2', borderRadius: '20px', border: '1px solid #dc2626' }}>
            <i className="fa-solid fa-location-dot" style={{ color: '#dc2626', fontSize: '12px' }}></i>
            <span style={{ fontSize: '12px', color: '#dc2626', fontWeight: 600 }}>
              {heroSearchQuery
                ? `Search: ${heroSearchQuery}`
                : regionFilter
                  ? `Province: ${formatRegionLabel(regionFilter)}`
                  : activeRegion}
            </span>
            <button
              onClick={() => {
                setHeroSearchQuery('')
                clearRegionSelection()
                setActiveRegion(null)
                setRegionFilter(null)
                setFilteredProperties(allProperties)
              }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '14px', padding: 0, fontWeight: 'bold' }}
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column-reverse', height: 'auto' }} className="properties-split">

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
                    href={`/property_info/${property.id}`}
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
                  window.open(`/property_info/${property.id}`, '_blank', 'noopener,noreferrer')
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
                        href={`/property_info/${property.id}`}
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