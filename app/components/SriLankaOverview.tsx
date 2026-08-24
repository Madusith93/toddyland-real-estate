'use client';

import React from 'react';

interface MapCardItem {
  id: string;
  title: string;
  description: string;
  image: string;
}

const mapSectionItems: MapCardItem[] = [
  {
    id: 'terrain-map',
    title: 'Terrain Map',
    description: 'Topography, elevation & geographic features of Sri Lanka',
    image: '/maps/terrain.webp',
  },
  {
    id: 'economic-zones',
    title: 'Major Economic Zones',
    description: 'Commercial hubs, industrial zones & development sectors',
    image: '/maps/economic-zones.webp',
  },
  {
    id: 'weather-may-sep',
    title: 'Weather Map (May - Sep)',
    description: 'Southwest Monsoon (Yala) rainfall & climate coverage',
    image: '/maps/may sep.png',
  },
  {
    id: 'weather-oct-apr',
    title: 'Weather Map (Oct - Apr)',
    description: 'Northeast Monsoon (Maha) climate & weather patterns',
    image: '/maps/oct apr.jpeg',
  },
];

export default function SriLankaMaps() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight capitalize">
            Sri Lanka <span className="text-red-600">Regional Overview</span> & Maps
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Explore terrain, economic zones, and seasonal monsoon patterns across Sri Lanka
          </p>
        </div>

        {/* 2x2 Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {mapSectionItems.map((item) => (
            <div key={item.id} className="flex flex-col items-center">
              
              {/* Card Title */}
              <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">
                {item.title}
              </h3>

              {/* Image Container */}
              <div className="relative w-full max-w-[420px] h-[450px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-50 p-2 group flex items-center justify-center">
                <img
                  src={item.image}
                  alt={item.title}
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=1000&q=80";
                  }}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Overlay & Description on Hover */}
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <p className="text-white text-sm font-medium">
                    {item.description}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}