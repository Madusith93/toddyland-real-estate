'use client'

import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

// ─────────────────────────────────────────────────────────────────────────
// FilterState
// Field names are kept aligned with the Toddyland properties page filter
// predicate (region, propertyType, priceMin/Max, buildingSizeMin/Max,
// landSizeMin/Max, propertyFeature, ageOfBuilding, sizeUnit, tab) so this
// component drops in without touching that page's filtering logic.
// bedrooms/bathrooms/propertyHighlights/showOnlyAvailable/sortBy are new
// fields introduced by the wireframe and not yet consumed there.
// ─────────────────────────────────────────────────────────────────────────
export interface FilterState {
  tab: 'buy' | 'rent' | 'land'
  region: string
  propertyType: string
  priceCurrency: 'LKR'
  priceMin: string
  priceMax: string
  bedrooms: string[]
  bathrooms: string[]
  ageOfBuilding: string
  sizeUnit: 'sqm'
  buildingSizeMin: string
  buildingSizeMax: string
  landSizeMin: string
  landSizeMax: string
  propertyFeature: string[]
  propertyHighlights: string[]
  showOnlyAvailable: boolean
  sortBy: string
}

interface FilterBarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  onSearch?: (filters: FilterState) => void
  onToggleMap?: (hidden: boolean) => void
}

export const defaultFilters: FilterState = {
  tab: 'buy',
  region: 'any',
  propertyType: 'any',
  priceCurrency: 'LKR',
  priceMin: '',
  priceMax: '',
  bedrooms: [],
  bathrooms: [],
  ageOfBuilding: 'any',
  sizeUnit: 'sqm',
  buildingSizeMin: '',
  buildingSizeMax: '',
  landSizeMin: '',
  landSizeMax: '',
  propertyFeature: [],
  propertyHighlights: [],
  showOnlyAvailable: false,
  sortBy: 'price_low',
}

// ─────────────────────────────────────────────────────────────────────────
// Option data — sourced from the wireframe. Slugs for `region` match the
// PROVINCE_BOUNDS keys used on the properties page (western, central,
// southern, northern, eastern, north_western, north_central, uva,
// sabaragamuwa) so the two components stay in sync.
// ─────────────────────────────────────────────────────────────────────────
const regionOptions = [
  { value: 'any', label: 'Any' },
  { value: 'western', label: 'Western' },
  { value: 'southern', label: 'Southern' },
  { value: 'central', label: 'Central' },
  { value: 'north_central', label: 'North Central' },
  { value: 'sabaragamuwa', label: 'Sabaragamuwa' },
  { value: 'eastern', label: 'Eastern' },
  { value: 'north_western', label: 'North Western' },
  { value: 'uva', label: 'Uva' },
  { value: 'northern', label: 'Northern' },
]

// The wireframe listed "Apartments and Mansions" twice (items 2 and 5) —
// treated here as one option rather than two identical entries.
const propertyTypeOptions = [
  { value: 'any', label: 'Any' },
  { value: 'houses_villas', label: 'Houses and Villas' },
  { value: 'apartments_mansions', label: 'Apartments and Mansions' },
  { value: 'hotels_resorts', label: 'Hotels and Resorts' },
  { value: 'eco_lodges_cottages', label: 'Eco Lodges and Cottages' },
  { value: 'business_properties', label: 'Business Properties' },
  { value: 'farm_houses', label: 'Farm Houses' },
]

// Multi-select now (Bed Rooms / Bathrooms) — no "Any" entry since an empty
// selection already means "Any".
const countOptions = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5+', label: '5+' },
]

const ageOptions = [
  { value: 'any', label: 'Any' },
  { value: 'brandnew', label: 'Brand New' },
  { value: 'lt5', label: 'Less than 5' },
  { value: 'lt10', label: 'Less than 10' },
  { value: 'lt20', label: 'Less than 20' },
  { value: 'lt30', label: 'Less than 30' },
  { value: 'lt50', label: 'Less than 50' },
  { value: 'gt50', label: 'More than 50' },
]

const buildingSizeOptions = [
  { value: '', label: 'Any' },
  ...[10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 120, 150, 200].map((v) => ({ value: String(v), label: `${v} m²` })),
  { value: '200+', label: '200+ m²' },
]

const landSizeOptions = [
  { value: '', label: 'Any' },
  ...[40, 50, 60, 70, 80, 90, 100, 120, 150, 200, 250, 300, 400, 500, 1000, 2000, 5000].map((v) => ({ value: String(v), label: `${v.toLocaleString()} m²` })),
  { value: '10000', label: '10,000 m² (1 ha)' },
  { value: '50000+', label: '50,000+ m² (5 ha+)' },
]

const propertyFeatureOptions = [
  { value: 'internet_coverage', label: 'Internet Coverage' },
  { value: 'fiber_optic', label: 'Fiber Optic / High-Speed Internet' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'air_condition', label: 'Air Condition' },
  { value: 'parking', label: 'Parking' },
  { value: 'hot_water', label: 'Hot Water' },
  { value: 'refrigerator', label: 'Refrigerator' },
  { value: 'fully_furnished', label: 'Fully Furnished' },
  { value: 'swimming_pool', label: 'Swimming Pool' },
  { value: 'garden', label: 'Garden' },
  { value: 'clean_water_supply', label: 'Clean Water Supply' },
  { value: 'balcony', label: 'Balcony' },
  { value: 'kitchen', label: 'Kitchen' },
  { value: 'sauna', label: 'Sauna' },
]

const propertyHighlightOptions = [
  { value: 'near_beach', label: 'Near Beach' },
  { value: 'near_city_economic_zone', label: 'Near City and Economic Zone' },
  { value: 'near_tourist_attraction', label: 'Near Tourist Attraction' },
  { value: 'near_tea_plantation', label: 'Near Tea Plantation' },
  { value: 'near_mountain', label: 'Near Mountain' },
  { value: 'near_paddyfield', label: 'Near Paddyfield' },
  { value: 'near_forests', label: 'Near Forests' },
  { value: 'near_lake', label: 'Near Lake' },
  { value: 'near_river_stream', label: 'Near River / Stream' },
  { value: 'off_grid_recommended', label: 'Off-Grid Recommended' },
  { value: 'digital_nomad_workstation', label: 'Digital Nomad Workstation' },
  { value: 'recommended', label: 'Recommended' },
]

const sortOptionsByTab: Record<FilterState['tab'], { value: string; label: string }[]> = {
  buy: [
    { value: 'price_low', label: 'Price Lowest First' },
    { value: 'price_high', label: 'Price Highest First' },
    { value: 'age_new', label: 'Age - Newest First' },
    { value: 'age_old', label: 'Age - Oldest First' },
  ],
  rent: [
    { value: 'price_low', label: 'Price Lowest First' },
    { value: 'price_high', label: 'Price Highest First' },
    { value: 'age_new', label: 'Age - Newest First' },
    { value: 'age_old', label: 'Age - Oldest First' },
  ],
  land: [
    { value: 'price_low', label: 'Price Lowest First' },
    { value: 'price_high', label: 'Price Highest First' },
  ],
}

// Best-guess contained width matching a typical site container (the
// properties page's own "All Properties" section already centers at
// 1100px). Bump this — and the matching constant in properties/page.tsx —
// to whatever your Navbar's actual container maxWidth/padding is if it
// doesn't line up.
const PAGE_CONTAINER_MAX_WIDTH = '1440px'
const PAGE_CONTAINER_PADDING = '24px'

const PRICE_MIN = 20000
const PRICE_MAX = 4400000
const PRICE_STEP = 10000

const formatLKR = (n: number) => `Rs. ${n.toLocaleString()}`

// ─────────────────────────────────────────────────────────────────────────
// Shared styling
// ─────────────────────────────────────────────────────────────────────────
const headerLabelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '13px',
  fontWeight: 500,
  color: '#4b5563',
  marginBottom: '7px',
}

// Bordered, select-like box — matches the Mirailand reference's plain
// dropdown fields (label above, a bordered rounded box with the current
// value and a chevron below) rather than a borderless text link.
const triggerButtonStyle: React.CSSProperties = {
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  cursor: 'pointer',
  padding: '9px 12px',
  fontSize: '13px',
  color: '#111827',
  fontWeight: 400,
  textAlign: 'left',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '10px',
  width: '100%',
  minWidth: '150px',
}

const panelStyle: React.CSSProperties = {
  position: 'absolute',
  top: 'calc(100% + 10px)',
  left: 0,
  background: '#fff',
  border: '1px solid #e5e7eb',
  borderRadius: '10px',
  boxShadow: '0 12px 28px rgba(17,24,39,0.14)',
  padding: '14px',
  zIndex: 40,
  minWidth: '220px',
}

const optionListItemStyle = (active: boolean): React.CSSProperties => ({
  padding: '7px 10px',
  borderRadius: '6px',
  fontSize: '13px',
  cursor: 'pointer',
  color: active ? '#dc2626' : '#374151',
  fontWeight: active ? 700 : 500,
  background: active ? '#fef2f2' : 'transparent',
  whiteSpace: 'nowrap',
})

// ─────────────────────────────────────────────────────────────────────────
// FilterColumn — a header label + current-value trigger that opens a panel
// of its own directly beneath it. Mirrors the wireframe's per-column
// dropdown layout (each column's options render right under that column).
// ─────────────────────────────────────────────────────────────────────────
function FilterColumn({
  label,
  displayValue,
  isOpen,
  onToggle,
  children,
  panelWidth,
  boxWidth,
}: {
  label: string
  displayValue: string
  isOpen: boolean
  onToggle: () => void
  children: React.ReactNode
  panelWidth?: string
  boxWidth?: string
}) {
  const btnRef = useRef<HTMLButtonElement>(null)
  const [rect, setRect] = useState<{ top: number; left: number } | null>(null)

  // The filter bar scrolls horizontally in one row now, so a panel
  // positioned absolute-under-its-column would get clipped by that
  // scroll container the moment it's taller than the row itself.
  // Portaling to <body> with fixed positioning (computed from the
  // trigger's on-screen position) sidesteps that entirely.
  useEffect(() => {
    if (isOpen && btnRef.current) {
      const r = btnRef.current.getBoundingClientRect()
      setRect({ top: r.bottom + 8, left: r.left })
    }
  }, [isOpen])

  return (
    <div style={{ flexShrink: 0, width: boxWidth ?? '150px' }}>
      <label style={headerLabelStyle}>{label}</label>
      <button ref={btnRef} type="button" onClick={onToggle} style={triggerButtonStyle}>
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayValue}</span>
        <i className={`fa-solid fa-chevron-${isOpen ? 'up' : 'down'}`} style={{ fontSize: '9px', color: '#9ca3af', flexShrink: 0 }}></i>
      </button>
      {isOpen && rect && typeof document !== 'undefined' && createPortal(
        <div
          data-fb-panel
          style={{ ...panelStyle, position: 'fixed', top: rect.top, left: rect.left, width: panelWidth }}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </div>,
        document.body
      )}
    </div>
  )
}

function SingleSelectPanel({
  options,
  value,
  onSelect,
}: {
  options: { value: string; label: string }[]
  value: string
  onSelect: (v: string) => void
}) {
  return (
    // 380px comfortably fits the longest single-select list (Location's 9
    // provinces + "Any") without scrolling — 260px was cutting it off after
    // ~7 rows with no visible scrollbar to hint the rest was reachable.
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '380px', overflowY: 'auto' }}>
      {options.map((opt) => (
        <div key={opt.value} style={optionListItemStyle(value === opt.value)} onClick={() => onSelect(opt.value)}>
          {opt.label}
        </div>
      ))}
    </div>
  )
}

function CheckboxListPanel({
  options,
  selected,
  onChange,
  columns = 1,
}: {
  options: { value: string; label: string }[]
  selected: string[]
  onChange: (values: string[]) => void
  columns?: number
}) {
  const toggle = (v: string) => {
    onChange(selected.includes(v) ? selected.filter((x) => x !== v) : [...selected, v])
  }
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, minmax(180px, 1fr))`, gap: '4px 16px', maxHeight: '320px', overflowY: 'auto' }}>
      {options.map((opt) => (
        <label key={opt.value} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#374151', cursor: 'pointer', padding: '4px 0' }}>
          <input
            type="checkbox"
            checked={selected.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            style={{ width: '15px', height: '15px', accentColor: '#dc2626', cursor: 'pointer', flexShrink: 0 }}
          />
          {opt.label}
        </label>
      ))}
    </div>
  )
}

// Two-select min/max pair, used for Building Size / Land Size panels.
function MinMaxSelectPanel({
  options,
  min,
  max,
  onChangeMin,
  onChangeMax,
}: {
  options: { value: string; label: string }[]
  min: string
  max: string
  onChangeMin: (v: string) => void
  onChangeMax: (v: string) => void
}) {
  const fieldSelectStyle: React.CSSProperties = {
    padding: '6px 8px',
    borderRadius: '6px',
    border: '1px solid #e5e7eb',
    fontSize: '13px',
    color: '#374151',
    width: '150px',
  }
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <div>
        <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Min</div>
        <select style={fieldSelectStyle} value={min} onChange={(e) => onChangeMin(e.target.value)}>
          {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
      <div>
        <div style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '4px' }}>Max</div>
        <select style={fieldSelectStyle} value={max} onChange={(e) => onChangeMax(e.target.value)}>
          {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
    </div>
  )
}

// Dual-thumb price slider drawn over a decorative bar-chart backdrop, to
// echo the histogram sketched in the wireframe between the 20K and 4,400K
// marks.
function PriceRangePanel({
  min,
  max,
  onChangeMin,
  onChangeMax,
}: {
  min: string
  max: string
  onChangeMin: (v: string) => void
  onChangeMax: (v: string) => void
}) {
  const lo = min === '' ? PRICE_MIN : Number(min)
  const hi = max === '' ? PRICE_MAX : Number(max)

  // Decorative, fixed-shape "histogram" — purely visual, not real data.
  const bars = [30, 55, 80, 100, 90, 70, 60, 45, 65, 50, 35, 25, 40, 20, 15]

  return (
    <div style={{ width: '280px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '48px', marginBottom: '10px' }}>
        {bars.map((h, i) => {
          // Color each bar red if the price value it represents falls
          // inside the currently selected [lo, hi] range, grey otherwise —
          // same idea as Airbnb-style price histograms.
          const barValue = PRICE_MIN + ((i + 0.5) / bars.length) * (PRICE_MAX - PRICE_MIN)
          const inRange = barValue >= lo && barValue <= hi
          return (
            <div
              key={i}
              style={{
                flex: 1,
                height: `${h}%`,
                background: inRange ? '#dc2626' : '#e5e7eb',
                borderRadius: '1px',
                transition: 'background 0.15s',
              }}
            />
          )
        })}
      </div>
      <div style={{ position: 'relative', height: '4px', background: '#e5e7eb', borderRadius: '2px', marginBottom: '14px' }}>
        <div
          style={{
            position: 'absolute',
            height: '4px',
            borderRadius: '2px',
            background: '#dc2626',
            left: `${((lo - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
            right: `${100 - ((hi - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
          }}
        />
      </div>
      <input
        type="range"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        value={lo}
        onChange={(e) => {
          const next = Math.min(Number(e.target.value), hi - PRICE_STEP)
          onChangeMin(next <= PRICE_MIN ? '' : String(next))
        }}
        style={{ width: '100%', accentColor: '#dc2626' }}
      />
      <input
        type="range"
        min={PRICE_MIN}
        max={PRICE_MAX}
        step={PRICE_STEP}
        value={hi}
        onChange={(e) => {
          const next = Math.max(Number(e.target.value), lo + PRICE_STEP)
          onChangeMax(next >= PRICE_MAX ? '' : String(next))
        }}
        style={{ width: '100%', accentColor: '#dc2626' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '12px', fontWeight: 600, color: '#111827' }}>
        <span>{formatLKR(lo)}</span>
        <span>{formatLKR(hi)}</span>
      </div>
    </div>
  )
}

function ToggleSwitch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      aria-pressed={checked}
      style={{
        width: '40px',
        height: '22px',
        borderRadius: '11px',
        border: 'none',
        cursor: 'pointer',
        background: checked ? '#dc2626' : '#d1d5db',
        position: 'relative',
        transition: 'background 0.2s',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '2px',
          left: checked ? '20px' : '2px',
          width: '18px',
          height: '18px',
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 0.2s',
          boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
        }}
      />
    </button>
  )
}

export default function FilterBar({ filters, onChange, onSearch, onToggleMap }: FilterBarProps) {
  const [draft, setDraft] = useState<FilterState>(filters)
  const [openColumn, setOpenColumn] = useState<string | null>(null)
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [moreFiltersSnapshot, setMoreFiltersSnapshot] = useState<FilterState | null>(null)
  const [mapHidden, setMapHidden] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setDraft(filters)
  }, [filters])

  const update = (patch: Partial<FilterState>) => setDraft((prev) => ({ ...prev, ...patch }))

  const toggleColumn = (key: string) => setOpenColumn((prev) => (prev === key ? null : key))

  // Close any open column panel on an outside click, Escape, or a scroll/
  // resize. Panels are portaled and fixed-positioned from the trigger's
  // on-screen coordinates (see FilterColumn) — since the bar itself now
  // scrolls horizontally as one row, closing on scroll avoids a panel
  // drifting away from its trigger instead of trying to track it live.
  useEffect(() => {
    if (!openColumn) return
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      // Panels are portaled to document.body (see FilterColumn), so they're
      // no longer inside barRef in the DOM even though they're logically
      // part of the bar — without this check every click inside an open
      // panel reads as "outside" and closes it on mousedown, before the
      // option's own click handler ever fires.
      if (barRef.current?.contains(target)) return
      if (target.closest('[data-fb-panel]')) return
      setOpenColumn(null)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenColumn(null)
    }
    const handleScrollOrResize = () => setOpenColumn(null)
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    // capture:true so this also catches scroll events from the bar's own
    // overflow-x container, which don't bubble to window by default.
    window.addEventListener('scroll', handleScrollOrResize, true)
    window.addEventListener('resize', handleScrollOrResize)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener('scroll', handleScrollOrResize, true)
      window.removeEventListener('resize', handleScrollOrResize)
    }
  }, [openColumn])

  const commit = (next: FilterState) => {
    onChange(next)
    onSearch?.(next)
  }

  const handleSearch = () => {
    setOpenColumn(null)
    commit(draft)
  }

  const handleReset = () => {
    const resetState: FilterState = { ...defaultFilters, tab: draft.tab }
    setDraft(resetState)
    setOpenColumn(null)
    commit(resetState)
  }

  const handleToggleMap = () => {
    setMapHidden((prev) => {
      const next = !prev
      onToggleMap?.(next)
      return next
    })
  }

  const setTab = (tab: FilterState['tab']) => {
    // Changing tab commits immediately — it's a top-level view switch, not a
    // pending filter edit — and clears fields that don't apply to that tab.
    const next: FilterState = {
      ...draft,
      tab,
      sortBy: sortOptionsByTab[tab].some((o) => o.value === draft.sortBy) ? draft.sortBy : sortOptionsByTab[tab][0].value,
    }
    setDraft(next)
    setOpenColumn(null)
    commit(next)
  }

  const openMoreFilters = () => {
    setMoreFiltersSnapshot(draft)
    setShowMoreFilters(true)
  }
  const cancelMoreFilters = () => {
    if (moreFiltersSnapshot) setDraft(moreFiltersSnapshot)
    setShowMoreFilters(false)
    setMoreFiltersSnapshot(null)
  }
  const applyMoreFilters = () => {
    setShowMoreFilters(false)
    setMoreFiltersSnapshot(null)
    commit(draft)
  }

  useEffect(() => {
    if (!showMoreFilters) return
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') cancelMoreFilters() }
    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showMoreFilters])

  const isLand = draft.tab === 'land'

  const regionLabel = regionOptions.find((o) => o.value === draft.region)?.label ?? 'Any'
  const propertyTypeLabel = propertyTypeOptions.find((o) => o.value === draft.propertyType)?.label ?? 'Any'
  const countLabel = (selected: string[]) => {
    if (selected.length === 0) return 'Any'
    const sorted = selected.slice().sort()
    return sorted.length <= 2 ? sorted.join(', ') : `${sorted.length} selected`
  }
  const bedroomsLabel = countLabel(draft.bedrooms)
  const bathroomsLabel = countLabel(draft.bathrooms)
  const ageLabel = ageOptions.find((o) => o.value === draft.ageOfBuilding)?.label ?? 'Any'
  const priceLabel = draft.priceMin || draft.priceMax
    ? `${draft.priceMin ? formatLKR(Number(draft.priceMin)) : 'Any'} – ${draft.priceMax ? formatLKR(Number(draft.priceMax)) : 'Any'}`
    : 'Any'
  const landSizeLabel = draft.landSizeMin || draft.landSizeMax
    ? `${draft.landSizeMin || 'Any'} – ${draft.landSizeMax || 'Any'} m²`
    : 'Any'
  const buildingSizeLabel = draft.buildingSizeMin || draft.buildingSizeMax
    ? `${draft.buildingSizeMin || 'Any'} – ${draft.buildingSizeMax || 'Any'} m²`
    : 'Any'
  const highlightsLabel = draft.propertyHighlights.length > 0 ? `${draft.propertyHighlights.length} selected` : 'Any'
  const sortLabel = sortOptionsByTab[draft.tab].find((o) => o.value === draft.sortBy)?.label ?? sortOptionsByTab[draft.tab][0].label

  const advancedCount =
    (draft.buildingSizeMin || draft.buildingSizeMax ? 1 : 0) +
    (draft.landSizeMin || draft.landSizeMax ? 1 : 0) +
    draft.propertyFeature.length +
    draft.propertyHighlights.length +
    (draft.showOnlyAvailable ? 1 : 0)

  // Plain bordered-box action buttons (More Filters / Reset / Hide Map) —
  // same visual language as the FilterColumn boxes above, but a single
  // click action instead of a dropdown.
  const actionBoxStyle: React.CSSProperties = {
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    cursor: 'pointer',
    padding: '9px 14px',
    fontSize: '13px',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    whiteSpace: 'nowrap',
  }

  return (
    <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb' }}>

      {/* Filter bar — plain white background with bordered, select-like
          fields in a single, non-wrapping row (matching the Mirailand
          reference). Content is contained to PAGE_CONTAINER_MAX_WIDTH so it
          lines up with the navbar. On a narrow viewport the row scrolls
          horizontally instead of wrapping onto a second line — dropdown
          panels are portaled (see FilterColumn) so they aren't clipped by
          that scroll container. */}
      <div
        ref={barRef}
        style={{
          maxWidth: PAGE_CONTAINER_MAX_WIDTH,
          margin: '0 auto',
          padding: `16px ${PAGE_CONTAINER_PADDING}`,
          display: 'flex',
          alignItems: 'flex-start',
          gap: '20px',
          flexWrap: 'nowrap',
          overflowX: 'auto',
        }}
      >

        {/* Tabs — same pill/segmented-control style as the Mirailand FilterBar.
            Wrapped in the same label-then-control structure as FilterColumn
            (with the label hidden) so the pill row's top edge lines up
            exactly with the Location / Property Type value row. */}
        <div style={{ flexShrink: 0 }}>
          <div style={{ ...headerLabelStyle, visibility: 'hidden' }}>Tabs</div>
          <div style={{ display: 'inline-flex', background: '#f3f4f6', borderRadius: '8px', padding: '3px' }}>
            {(['buy', 'rent', 'land'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setTab(tab)}
                style={{
                  padding: '8px 18px',
                  borderRadius: '6px',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  fontSize: '13px',
                  background: draft.tab === tab ? '#dc2626' : 'transparent',
                  color: draft.tab === tab ? '#fff' : '#6b7280',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <FilterColumn label="Location" displayValue={regionLabel} isOpen={openColumn === 'region'} onToggle={() => toggleColumn('region')} boxWidth="140px">
          <SingleSelectPanel options={regionOptions} value={draft.region} onSelect={(v) => { update({ region: v }); setOpenColumn(null) }} />
        </FilterColumn>

        {!isLand && (
          <FilterColumn label="Property Type" displayValue={propertyTypeLabel} isOpen={openColumn === 'propertyType'} onToggle={() => toggleColumn('propertyType')} panelWidth="240px" boxWidth="170px">
            <SingleSelectPanel options={propertyTypeOptions} value={draft.propertyType} onSelect={(v) => { update({ propertyType: v }); setOpenColumn(null) }} />
          </FilterColumn>
        )}

        <FilterColumn label="Price (LKR)" displayValue={priceLabel} isOpen={openColumn === 'price'} onToggle={() => toggleColumn('price')} boxWidth="170px">
          <PriceRangePanel
            min={draft.priceMin}
            max={draft.priceMax}
            onChangeMin={(v) => update({ priceMin: v })}
            onChangeMax={(v) => update({ priceMax: v })}
          />
        </FilterColumn>

        {!isLand && (
          <>
            <FilterColumn label="Bed Rooms" displayValue={bedroomsLabel} isOpen={openColumn === 'bedrooms'} onToggle={() => toggleColumn('bedrooms')} boxWidth="100px">
              <CheckboxListPanel options={countOptions} selected={draft.bedrooms} onChange={(v) => update({ bedrooms: v })} />
            </FilterColumn>

            <FilterColumn label="Bathrooms" displayValue={bathroomsLabel} isOpen={openColumn === 'bathrooms'} onToggle={() => toggleColumn('bathrooms')} boxWidth="100px">
              <CheckboxListPanel options={countOptions} selected={draft.bathrooms} onChange={(v) => update({ bathrooms: v })} />
            </FilterColumn>

            <FilterColumn label="Age" displayValue={ageLabel} isOpen={openColumn === 'age'} onToggle={() => toggleColumn('age')} panelWidth="200px" boxWidth="130px">
              <SingleSelectPanel options={ageOptions} value={draft.ageOfBuilding} onSelect={(v) => { update({ ageOfBuilding: v }); setOpenColumn(null) }} />
            </FilterColumn>
          </>
        )}

        {isLand && (
          <>
            <FilterColumn label="Land Size" displayValue={landSizeLabel} isOpen={openColumn === 'landSize'} onToggle={() => toggleColumn('landSize')} boxWidth="150px">
              <MinMaxSelectPanel
                options={landSizeOptions}
                min={draft.landSizeMin}
                max={draft.landSizeMax}
                onChangeMin={(v) => update({ landSizeMin: v })}
                onChangeMax={(v) => update({ landSizeMax: v })}
              />
            </FilterColumn>

            <FilterColumn label="Property Highlights" displayValue={highlightsLabel} isOpen={openColumn === 'highlights'} onToggle={() => toggleColumn('highlights')} panelWidth="420px" boxWidth="180px">
              <CheckboxListPanel
                options={propertyHighlightOptions}
                selected={draft.propertyHighlights}
                onChange={(v) => update({ propertyHighlights: v })}
                columns={2}
              />
            </FilterColumn>
          </>
        )}

        {!isLand && (
          <div style={{ flexShrink: 0 }}>
            <div style={{ ...headerLabelStyle, visibility: 'hidden' }}>More Filters</div>
            <button
              type="button"
              onClick={openMoreFilters}
              style={{ ...actionBoxStyle, color: advancedCount > 0 ? '#dc2626' : '#111827', borderColor: advancedCount > 0 ? '#dc2626' : '#e5e7eb' }}
            >
              <i className="fa-solid fa-sliders" style={{ fontSize: '12px' }}></i>
              More Filters
              {advancedCount > 0 && (
                <span style={{ background: '#dc2626', color: '#fff', fontSize: '11px', fontWeight: 700, borderRadius: '10px', padding: '1px 6px' }}>
                  {advancedCount}
                </span>
              )}
            </button>
          </div>
        )}

        <div style={{ flexShrink: 0 }}>
          <div style={{ ...headerLabelStyle, visibility: 'hidden' }}>Reset</div>
          <button type="button" onClick={handleReset} style={{ ...actionBoxStyle, color: '#111827' }}>
            <i className="fa-solid fa-rotate-left" style={{ fontSize: '12px' }}></i>
            Reset Filters
          </button>
        </div>

        <div style={{ flexShrink: 0 }}>
          <div style={{ ...headerLabelStyle, visibility: 'hidden' }}>Search</div>
          <button
            type="button"
            onClick={handleSearch}
            style={{
              padding: '9px 22px',
              borderRadius: '8px',
              border: 'none',
              background: '#dc2626',
              color: '#fff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            Search
          </button>
        </div>

        <div style={{ flexShrink: 0 }}>
          <div style={{ ...headerLabelStyle, visibility: 'hidden' }}>Hide Map</div>
          <button type="button" onClick={handleToggleMap} style={{ ...actionBoxStyle, color: '#111827' }}>
            <i className={`fa-solid fa-caret-${mapHidden ? 'down' : 'up'}`} style={{ fontSize: '12px', color: '#eab308' }}></i>
            {mapHidden ? 'Show Map' : 'Hide Map'}
          </button>
        </div>

        <FilterColumn label="Sort By" displayValue={sortLabel} isOpen={openColumn === 'sort'} onToggle={() => toggleColumn('sort')} panelWidth="200px" boxWidth="180px">
          <SingleSelectPanel
            options={sortOptionsByTab[draft.tab]}
            value={draft.sortBy}
            onSelect={(v) => { update({ sortBy: v }); setOpenColumn(null); commit({ ...draft, sortBy: v }) }}
          />
        </FilterColumn>
      </div>

      {/* ══ More Filters modal (Buy/Rent only) ══ */}
      {showMoreFilters && !isLand && (
        <div
          onClick={cancelMoreFilters}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(17,24,39,0.55)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px', zIndex: 1000,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="More filters"
            style={{
              background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '640px',
              maxHeight: '85vh', display: 'flex', flexDirection: 'column',
              boxShadow: '0 20px 50px rgba(0,0,0,0.25)', overflow: 'hidden',
            }}
          >
            <div style={{ padding: '18px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#111827' }}>Filters</h3>
              <button onClick={cancelMoreFilters} aria-label="Close" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b7280', fontSize: '18px', padding: '4px 8px', lineHeight: 1 }}>
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <div style={{ padding: '20px 24px', overflowY: 'auto', flex: 1 }}>

              <div style={{ marginBottom: '22px' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>Building Size (m²)</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <select style={{ flex: 1, padding: '9px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }} value={draft.buildingSizeMin} onChange={(e) => update({ buildingSizeMin: e.target.value })}>
                    {buildingSizeOptions.map((o) => <option key={o.value} value={o.value}>{o.value === '' ? 'No min' : o.label}</option>)}
                  </select>
                  <select style={{ flex: 1, padding: '9px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }} value={draft.buildingSizeMax} onChange={(e) => update({ buildingSizeMax: e.target.value })}>
                    {buildingSizeOptions.map((o) => <option key={o.value} value={o.value}>{o.value === '' ? 'No max' : o.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '22px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>Land Size (m²)</div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <select style={{ flex: 1, padding: '9px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }} value={draft.landSizeMin} onChange={(e) => update({ landSizeMin: e.target.value })}>
                    {landSizeOptions.map((o) => <option key={o.value} value={o.value}>{o.value === '' ? 'No min' : o.label}</option>)}
                  </select>
                  <select style={{ flex: 1, padding: '9px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px' }} value={draft.landSizeMax} onChange={(e) => update({ landSizeMax: e.target.value })}>
                    {landSizeOptions.map((o) => <option key={o.value} value={o.value}>{o.value === '' ? 'No max' : o.label}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '22px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>
                  Property Features {draft.propertyFeature.length > 0 && <span style={{ color: '#dc2626' }}>({draft.propertyFeature.length} selected)</span>}
                </div>
                <CheckboxListPanel options={propertyFeatureOptions} selected={draft.propertyFeature} onChange={(v) => update({ propertyFeature: v })} columns={2} />
              </div>

              <div style={{ marginBottom: '22px', paddingTop: '20px', borderTop: '1px solid #f3f4f6' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#111827', marginBottom: '10px' }}>
                  Property Highlights {draft.propertyHighlights.length > 0 && <span style={{ color: '#dc2626' }}>({draft.propertyHighlights.length} selected)</span>}
                </div>
                <CheckboxListPanel options={propertyHighlightOptions} selected={draft.propertyHighlights} onChange={(v) => update({ propertyHighlights: v })} columns={2} />
              </div>

              <div style={{ paddingTop: '20px', borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#111827' }}>Show only available properties</span>
                <ToggleSwitch checked={draft.showOnlyAvailable} onChange={(v) => update({ showOnlyAvailable: v })} />
              </div>
            </div>

            <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '10px', flexShrink: 0, background: '#f9fafb' }}>
              <button onClick={cancelMoreFilters} style={{ padding: '9px 18px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', color: '#374151', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                Cancel
              </button>
              <button onClick={applyMoreFilters} style={{ padding: '9px 24px', borderRadius: '8px', border: 'none', background: '#dc2626', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Show-only-available toggle inline for Land tab, since there's no More Filters modal there */}
      {isLand && (
        <div style={{ borderTop: '1px solid #e5e7eb' }}>
          <div style={{ maxWidth: PAGE_CONTAINER_MAX_WIDTH, margin: '0 auto', padding: `10px ${PAGE_CONTAINER_PADDING}`, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#111827' }}>Show only available properties</span>
            <ToggleSwitch checked={draft.showOnlyAvailable} onChange={(v) => { update({ showOnlyAvailable: v }); commit({ ...draft, showOnlyAvailable: v }) }} />
          </div>
        </div>
      )}
    </div>
  )
}