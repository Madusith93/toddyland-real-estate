'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

// These are the actual modules from the src/ folder you dropped into the
// project root — this component just wires them up inside React's
// lifecycle instead of the plain <script type="module"> entry point
// (src/index.js) they were originally written for.
import { initMap, destroyMap } from '../../src/core/mapInstance.js';
import { initBoundsManager } from '../../src/core/boundsManager.js';
import { addMarker, getMarkers, clearMarkers } from '../../src/markers/markerManager.js';
import { createInfoWindow, closeInfoWindow } from '../../src/markers/infoWindow.js';
import { initMarkerCluster, clearCluster } from '../../src/markers/markerCluster.js';
import { initRegionTool, removeRegionTool } from '../../src/drawing/drawAreaTool.js';
import { sampleProperties } from '../../src/data/sampleProperties.js';

const MAP_ELEMENT_ID = 'all-properties-map';

export default function AllPropertiesMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  // The district a user has clicked on the draw-area overlay, while they're
  // deciding whether to jump to the full properties page. Cleared again if
  // they click the same district a second time (initRegionTool's own
  // toggle-off behavior calls back with `null`). `province`/`provinceKey`
  // ride along from drawAreaTool.js purely for display context.
  const [selectedDistrict, setSelectedDistrict] = useState<{ key: string; name: string; province: string; provinceKey: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await initMap(MAP_ELEMENT_ID);
        if (cancelled) return;

        initBoundsManager((bounds: unknown) => {
          console.log('Fetch properties for:', bounds);
        }, MAP_ELEMENT_ID);

        // Same route/param convention as the properties page's own
        // useSearchParams() handling (searchParams.get('id') ||
        // searchParams.get('select')) — clicking a marker here selects and
        // scrolls to that listing on /properties.
        const goToProperty = (property: any) => {
          router.push(`/properties?id=${property.id}`);
        };

        sampleProperties.forEach((property: any) => {
          const marker = addMarker({
            lat: property.lat,
            lng: property.lng,
            title: property.title,
            type: property.type,
            data: property,
            mapId: MAP_ELEMENT_ID,
          });

          if (marker) {
            try {
              // AdvancedMarkerElement (used for the price-pill markers built
              // by createPriceMarkerElement) exposes its DOM node as
              // `.content` — attach the click handler there directly since
              // it doesn't reliably fire through google.maps.event.
              if (marker.content && typeof marker.content.addEventListener === 'function') {
                marker.content.style.cursor = 'pointer';
                marker.content.addEventListener('click', () => goToProperty(property));
              } else if (typeof window !== 'undefined' && (window as any).google?.maps?.event) {
                // Classic google.maps.Marker fallback.
                (window as any).google.maps.event.addListener(marker, 'click', () => goToProperty(property));
              }
            } catch (err) {
              console.log('Could not attach marker click handler:', err);
            }

            createInfoWindow(marker, property);
          }
        });

        initMarkerCluster(getMarkers(), MAP_ELEMENT_ID);

        // Same draw-area overlay as the properties page — now filtering by
        // district rather than province, since each of the 25 shapes in the
        // geojson is one district already. Clicking one highlights it and
        // shows a "Browse <District>" prompt below the map (see the
        // ready-state overlay) rather than navigating immediately, since a
        // misclick shouldn't yank someone off the landing page. The "View
        // All" badge always stays available regardless of selection.
        initRegionTool((region: { key: string; name: string; province: string; provinceKey: string } | null) => {
          setSelectedDistrict(region);
        }, MAP_ELEMENT_ID);

        setStatus('ready');
      } catch (err: any) {
        if (cancelled) return;
        console.error('[AllPropertiesMap] Failed to initialize map:', err);
        setStatus('error');
        setErrorMessage(err?.message || 'Failed to load the map');
      }
    })();

    return () => {
      cancelled = true;
      closeInfoWindow();
      clearCluster();
      clearMarkers();
      removeRegionTool(MAP_ELEMENT_ID);
      destroyMap(MAP_ELEMENT_ID);
    };
  }, [router]);

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            All Properties in Sri Lanka <span className="text-red-600">by Map</span>
          </h2>

          {/* Map Color Legends (Buy / Rent / Land) */}
          <div className="flex items-center justify-center gap-8 mt-6 text-xs sm:text-sm font-black text-slate-700">
            <div className="flex items-center gap-2">
              <span>Buy</span>
              <span className="w-8 h-3.5 bg-red-600 rounded-xs shadow-xs" />
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span>Rent</span>
              <span className="w-8 h-3.5 bg-blue-600 rounded-xs shadow-xs" />
            </div>
            <span className="text-slate-300">|</span>
            <div className="flex items-center gap-2">
              <span>Land</span>
              <span className="w-8 h-3.5 bg-green-500 rounded-xs shadow-xs" />
            </div>
          </div>
        </div>

        {/* Interactive Map Container */}
        <div className="relative w-full h-[500px] sm:h-[600px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-inner">
          <div id={MAP_ELEMENT_ID} ref={mapContainerRef} className="w-full h-full" />

          {status === 'loading' && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 pointer-events-none">
              <span className="text-sm font-bold text-slate-500">Loading map…</span>
            </div>
          )}

          {status === 'error' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-100 px-6 text-center">
              <span className="text-sm font-bold text-red-600">Couldn't load the map</span>
              <span className="text-xs text-slate-500">{errorMessage}</span>
            </div>
          )}

          {status === 'ready' && !selectedDistrict && (
            <>
              <button
                type="button"
                onClick={() => router.push('/properties')}
                className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-md hover:bg-white transition-colors cursor-pointer"
              >
                📍 {sampleProperties.length} Properties — View All
              </button>
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-200 text-[11px] font-semibold text-slate-500 shadow-sm pointer-events-none">
                Click a district to browse
              </div>
            </>
          )}

          {/* Clicking a district highlights it (via initRegionTool's own
              styling) and surfaces this prompt instead of navigating
              immediately — same click-to-select-then-confirm pattern as the
              properties page's own draw tool. Navigates with ?district=
              (properties/page.tsx already reads searchParams.get('district')),
              not ?province=. */}
          {status === 'ready' && selectedDistrict && (
            <button
              type="button"
              onClick={() => router.push(`/properties?district=${selectedDistrict.key}`)}
              className="absolute bottom-4 left-4 bg-red-600 text-white px-4 py-2 rounded-xl shadow-md hover:bg-red-700 transition-colors cursor-pointer text-xs font-bold flex items-center gap-2"
            >
              <i className="fa-solid fa-location-dot" />
              Browse {selectedDistrict.name} Properties
              <i className="fa-solid fa-arrow-right" />
            </button>
          )}
        </div>
      </div>
    </section>
  );
}