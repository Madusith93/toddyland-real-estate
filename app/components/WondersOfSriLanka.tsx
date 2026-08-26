'use client';

import React from 'react';
import Image from 'next/image';

export default function WondersOfSriLanka() {
  const categories = [
    {
      id: 'wonders',
      title: '9 Wonders of Sri Lanka, That support your investment decision',
      items: [
        {
          id: 1,
          title: 'Natural Wonders',
          image: 'https://images.unsplash.com/photo-1546708973-b339540b5162?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 2,
          title: 'Cultural Heritage',
          image: 'https://images.unsplash.com/photo-1588598198321-9735fd52455b?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 3,
          title: 'Coastal Paradise',
          image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=800',
        },
      ],
    },
    {
      id: 'hot-springs',
      title: 'Hot Springs',
      items: [
        {
          id: 4,
          title: 'Thermal Springs',
          image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 5,
          title: 'Wellness Zones',
          image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 6,
          title: 'Eco Retreats',
          image: 'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&q=80&w=800',
        },
      ],
    },
    {
      id: 'interior',
      title: 'Interior',
      items: [
        {
          id: 7,
          title: 'Luxury Living',
          image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 8,
          title: 'Modern Architecture',
          image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800',
        },
        {
          id: 9,
          title: 'Tropical Designs',
          image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800',
        },
      ],
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Main Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Think Real Estate - <span className="text-red-600">Here is Why</span>
          </h2>
        </div>

        {/* Categories Stack */}
        <div className="space-y-14">
          {categories.map((cat) => (
            <div key={cat.id} className="space-y-6">
              
              {/* Category Subheading */}
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
                {cat.title}
              </h3>

              {/* Responsive 3-Column Image Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.items.map((item) => (
                  <div 
                    key={item.id}
                    className="group relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300"
                  >
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    
                    {/* Dark Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Image Title / Overlay Label */}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <p className="text-sm font-semibold tracking-wide">
                        {item.title}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}