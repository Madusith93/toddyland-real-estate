'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type TabType = 'BUY' | 'RENT' | 'LAND';

const propertiesData = [
  // BUY Category (3 Cards)
  {
    id: 1,
    category: 'BUY',
    type: 'Apartment',
    price: '105,000,000 LKR ',
    location: 'Galle - Southern province',
    layout: '4B / 136m2',
    image: './apartment.jpg',
  },
  {
    id: 2,
    category: 'BUY',
    type: 'Villa',
    price: '137,000,000 LKR ',
    location: 'Colombo - Western province',
    layout: '4LDK / 180m2',
    image: './villa.webp',
  },
  {
    id: 3,
    category: 'BUY',
    type: 'Luxury Condominium',
    price: '85,000,000 LKR ',
    location: 'Mount Lavinia - Western province',
    layout: '3B / 125m2',
    image: './lux.jpg',
  },

  // RENT Category (3 Cards)
  {
    id: 4,
    category: 'RENT',
    type: 'Apartment',
    price: '750,000 LKR / ',
    location: 'Colombo 03 - Western province',
    layout: '3B / 120m2',
    image: './rent apa.jpg',
  },
  {
    id: 5,
    category: 'RENT',
    type: 'Beach Villa',
    price: '1,200,000 LKR / ',
    location: 'Bentota - Southern province',
    layout: '4B / 200m2',
    image: './beach villa.jpeg',
  },
  {
    id: 6,
    category: 'RENT',
    type: 'Penthouse',
    price: '950,000 LKR / ',
    location: 'Colombo 07 - Western province',
    layout: '3LDK / 160m2',
    image: './penthouse.jpg',
  },

  // LAND Category (3 Cards)
  {
    id: 7,
    category: 'LAND',
    type: 'Beachfront Land',
    price: '60,000,000 LKR',
    location: 'Mirissa - Southern province',
    layout: '20 Perches',
    image: './beachfrontland.jpg',
  },
  {
    id: 8,
    category: 'LAND',
    type: 'Commercial Land',
    price: '120,000,000 LKR',
    location: 'Rajagiriya - Western province',
    layout: '15 Perches',
    image: './commericalland.jpg',
  },
  {
    id: 9,
    category: 'LAND',
    type: 'Residential Plot',
    price: '35,000,000 LKR',
    location: 'Kandy - Central province',
    layout: '12.5 Perches',
    image: './Residential.jpg',
  },
];

export default function LatestPropertiesSection() {
  const [activeTab, setActiveTab] = useState<TabType>('BUY');

  const filteredProperties = propertiesData.filter(
    (item) => item.category === activeTab
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-10 space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Latest <span className="text-red-600">Properties</span>
          </h2>

          {/* Nav Bar */}
          <div className="inline-flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            {(['BUY', 'RENT', 'LAND'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 tracking-wider ${
                  activeTab === tab
                    ? 'bg-red-600 text-white shadow-md scale-[1.02]'
                    : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Property Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-2xl overflow-hidden group border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              {/* Image Container matched to Most Recommended Properties (h-56 standard) */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                <Image
                  src={property.image}
                  alt={property.type}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Property Details */}
              <div className="p-5 space-y-2 text-xs sm:text-sm text-slate-700 font-medium">
                <p>
                  <span className="text-slate-900 font-bold">TYPE - </span>
                  {property.type}
                </p>
                <p>
                  <span className="text-slate-900 font-bold">Price - </span>
                  <span className="text-red-600 font-bold">{property.price}</span>
                </p>
                <p>
                  <span className="text-slate-900 font-bold">Location - </span>
                  {property.location}
                </p>
                <p>
                  <span className="text-slate-900 font-bold">Layout - </span>
                  {property.layout}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}