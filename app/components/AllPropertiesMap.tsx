'use client';

import React from 'react';

export default function AllPropertiesMap() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading - Exact Styling Matched */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            All Properties in Sri Lanka <span className="text-red-600">by Map</span>
          </h2>

          {/* Map Color Legends (Buy / Rent / Land) */}
          <div className="flex items-center justify-center gap-8 mt-6 text-xs sm:text-sm font-black text-slate-700">
            {/* BUY */}
            <div className="flex items-center gap-2">
              <span>Buy</span>
              <span className="w-8 h-3.5 bg-red-600 rounded-xs shadow-xs" />
            </div>

            <span className="text-slate-300">|</span>

            {/* RENT */}
            <div className="flex items-center gap-2">
              <span>Rent</span>
              <span className="w-8 h-3.5 bg-blue-600 rounded-xs shadow-xs" />
            </div>

            <span className="text-slate-300">|</span>

            {/* LAND */}
            <div className="flex items-center gap-2">
              <span>Land</span>
              <span className="w-8 h-3.5 bg-green-500 rounded-xs shadow-xs" />
            </div>
          </div>
        </div>

        {/* Interactive Map Container / Placeholder */}
        <div className="relative w-full h-[500px] sm:h-[600px] bg-slate-100 rounded-3xl overflow-hidden border border-slate-200 shadow-inner flex items-center justify-center">
          {/* Default Map Preview / Embedded Frame */}
          <iframe
            title="Sri Lanka Properties Map"
            src="https://maps.google.com/maps?q=Sri%20Lanka&t=&z=7&ie=UTF8&iwloc=&output=embed"
            className="w-full h-full border-0 grayscale-[25%] contrast-[105%]"
            loading="lazy"
            allowFullScreen
          />

          {/* Map Overlay Badge */}
          <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 shadow-md">
            📍 Dynamic Markers Map Space
          </div>
        </div>
      </div>
    </section>
  );
}