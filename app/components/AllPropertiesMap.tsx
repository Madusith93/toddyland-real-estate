'use client';

import React, { useEffect, useRef, useState } from 'react';

// These are the actual modules from the src/ folder you dropped into the
// project root — this component just wires them up inside React's
// lifecycle instead of the plain <script type="module"> entry point
// (src/index.js) they were originally written for.
import { initMap, destroyMap } from '../../src/core/mapInstance.js';
import { initBoundsManager } from '../../src/core/boundsManager.js';
import { addMarker, getMarkers, clearMarkers } from '../../src/markers/markerManager.js';
import { createInfoWindow, closeInfoWindow } from '../../src/markers/infoWindow.js';
import { initMarkerCluster, clearCluster } from '../../src/markers/markerCluster.js';
import { sampleProperties } from '../../src/data/sampleProperties.js';

const MAP_ELEMENT_ID = 'all-properties-map';

export default function AllPropertiesMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        await initMap(MAP_ELEMENT_ID);
        if (cancelled) return;

        initBoundsManager((bounds: unknown) => {
          console.log('Fetch properties for:', bounds);
        }, MAP_ELEMENT_ID);

        sampleProperties.forEach((property: any) => {
          const marker = addMarker({
            lat: property.lat,
            lng: property.lng,
            title: property.title,
            type: property.type,
            data: property,
            mapId: MAP_ELEMENT_ID,
          });
          createInfoWindow(marker, property);
        });

        initMarkerCluster(getMarkers(), MAP_ELEMENT_ID);

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
      destroyMap(MAP_ELEMENT_ID);
    };
  }, []);

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

          {status === 'ready' && (
            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-md pointer-events-none">
              📍 {sampleProperties.length} Properties
            </div>
          )}
        </div>
      </div>
    </section>
  );
}