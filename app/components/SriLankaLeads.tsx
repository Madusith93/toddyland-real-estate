'use client';

import React from 'react';
import Image from 'next/image';
import { Landmark, Castle, Sparkles, Waves } from 'lucide-react';

const leadsData = [
  {
    id: 1,
    title: 'Lotus Tower & Colombo Skyline',
    description: 'Iconic modern landmarks and luxury urban real estate developments in the heart of Colombo.',
    image: '/nelumkulunai.jpg',
    icon: Landmark,
  },
  {
    id: 2,
    title: 'Sigiriya Ancient Fortress',
    description: 'World-famous heritage sites, eco-villas, and historic lands surrounded by natural wonder.',
    image: '/sigiriya.jpeg',
    icon: Castle,
  },
  {
    id: 3,
    title: 'Temple of the Tooth (Dalada Maligawa)',
    description: 'Rich cultural roots, serene hill-country properties, and peaceful sacred surroundings in Kandy.',
    image: '/daladamalighwa.jpeg',
    icon: Sparkles,
  },
  {
    id: 4,
    title: 'Galle Coastal Line & Dutch Fort',
    description: 'Prime beachfront plots, coastal luxury homes, and historic southern colonial heritage.',
    image: '/galle.jpeg',
    icon: Waves,
  },
];

export default function SriLankaLeadsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            4 Things That <span className="text-red-600">Sri Lanka Leads</span>
          </h2>
        </div>

        {/* 2x2 Grid (Figma Design Layout) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {leadsData.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Image Container (Aspect Ratio Matching Figma ~387x386 Square) */}
                <div className="relative w-full h-[280px] sm:h-[320px] bg-slate-100 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Icon Badge */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md p-2.5 rounded-xl shadow-sm text-red-600">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Content (Title & Description) */}
                <div className="p-6">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}