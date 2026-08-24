'use client';

import React, { useState } from 'react';
import Image from 'next/image';

type TabType = 'BUY' | 'RENT' | 'LAND';

// Sample Property Data (3 items per category in LKR)
const propertiesData = [
  // BUY Category (3 Cards)
  {
    id: 1,
    category: 'BUY',
    type: 'Apartment',
    price: '105,000,000 LKR (345,000 USD)',
    location: 'Galle - Southern province',
    layout: '4B / 136m2',
    image: '/apartment.jpg',
  },
  {
    id: 2,
    category: 'BUY',
    type: 'Villa',
    price: '137,000,000 LKR (450,000 USD)',
    location: 'Colombo - Western province',
    layout: '4LDK / 180m2',
    image: '/villa.webp',
  },
  {
    id: 3,
    category: 'BUY',
    type: 'Luxury Condominium',
    price: '85,000,000 LKR (280,000 USD)',
    location: 'Mount Lavinia - Western province',
    layout: '3B / 125m2',
    image: '/lux.jpg',
  },

  // RENT Category (3 Cards)
  {
    id: 4,
    category: 'RENT',
    type: 'Apartment',
    price: '750,000 LKR / mo',
    location: 'Colombo 03 - Western province',
    layout: '3B / 120m2',
    image: '/images/property-4.jpg',
  },
  {
    id: 5,
    category: 'RENT',
    type: 'Beach Villa',
    price: '1,200,000 LKR / mo',
    location: 'Bentota - Southern province',
    layout: '4B / 200m2',
    image: '/images/property-5.jpg',
  },
  {
    id: 6,
    category: 'RENT',
    type: 'Penthouse',
    price: '950,000 LKR / mo',
    location: 'Colombo 07 - Western province',
    layout: '3LDK / 160m2',
    image: '/images/property-6.jpg',
  },

  // LAND Category (3 Cards)
  {
    id: 7,
    category: 'LAND',
    type: 'Beachfront Land',
    price: '60,000,000 LKR',
    location: 'Mirissa - Southern province',
    layout: '20 Perches',
    image: '/images/property-7.jpg',
  },
  {
    id: 8,
    category: 'LAND',
    type: 'Commercial Land',
    price: '120,000,000 LKR',
    location: 'Rajagiriya - Western province',
    layout: '15 Perches',
    image: '/images/property-8.jpg',
  },
  {
    id: 9,
    category: 'LAND',
    type: 'Residential Plot',
    price: '35,000,000 LKR',
    location: 'Kandy - Central province',
    layout: '12.5 Perches',
    image: '/images/property-9.jpg',
  },
];

export default function LatestPropertiesSection() {
  const [activeTab, setActiveTab] = useState<TabType>('BUY');

  // Filter properties based on selected tab (Always gets 3 cards)
  const filteredProperties = propertiesData.filter(
    (item) => item.category === activeTab
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section (Centered Title & Pill-Style Nav Bar) */}
        <div className="text-center mb-10 space-y-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Latest <span className="text-red-600">Properties</span>
          </h2>

          {/* Pill Style Filter Buttons */}
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

        {/* Property Cards Grid (3 Cards Layout) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="bg-white rounded-xl overflow-hidden group border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Property Image Container */}
              <div className="relative w-full h-[240px] bg-slate-200 overflow-hidden">
                <Image
                  src={property.image}
                  alt={property.type}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Property Details */}
              <div className="p-4 space-y-1.5 text-xs sm:text-sm text-slate-700 font-medium">
                <p>
                  <span className="text-slate-900 font-semibold">TYPE - </span>
                  {property.type}
                </p>
                <p>
                  <span className="text-slate-900 font-semibold">Price - </span>
                  {property.price}
                </p>
                <p>
                  <span className="text-slate-900 font-semibold">Location - </span>
                  {property.location}
                </p>
                <p>
                  <span className="text-slate-900 font-semibold">Layout - </span>
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