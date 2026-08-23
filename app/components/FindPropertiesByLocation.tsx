'use client';

import React from 'react';

interface LocationCardProps {
  title: string;
  imageSrc: string;
}

const locationData: LocationCardProps[] = [
  {
    title: 'Near Beach',
    imageSrc:
      'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Near Cities and Economic Zones',
    imageSrc:
      'https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Near Tourist Attraction',
    imageSrc:
      'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Near Tea Plantation',
    imageSrc:
      'https://images.unsplash.com/photo-1546842931-886c185b4c8c?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Near Mountain',
    imageSrc:
      'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Near Forest',
    imageSrc:
      'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Near River',
    imageSrc:
      'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Near Lake',
    imageSrc:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Near Paddy Field',
    imageSrc:
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  },
];

export default function FindPropertiesByLocation() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Find Properties in Sri Lanka <span className="text-red-600">by Specific Location</span>
          </h2>
        </div>

        {/* 3x3 Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {locationData.map((item, index) => (
            <div
              key={index}
              className="group relative h-48 sm:h-56 rounded-2xl overflow-hidden bg-slate-100 shadow-sm border border-slate-200 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex items-center justify-center text-center px-4"
            >
              {/* Location Background Image */}
              <img
                src={item.imageSrc}
                alt={item.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Dark Overlay for Text Readability */}
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />

              {/* Centered Title with Drop Shadow (No White Box) */}
              <span className="relative z-10 text-white font-extrabold text-base sm:text-lg tracking-wide uppercase drop-shadow-md group-hover:scale-105 transition-transform duration-300">
                {item.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}