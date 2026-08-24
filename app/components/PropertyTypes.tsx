'use client';

import React from 'react';
import Link from 'next/link';

interface PropertyTypeCategory {
  id: string;
  title: string;
  typeParam: string;
  image: string;
}

const propertyTypes: PropertyTypeCategory[] = [
  {
    id: '1',
    title: 'Houses and Villas',
    typeParam: 'House',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '2',
    title: 'Apartments',
    typeParam: 'Apartment',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '3',
    title: 'Hotels and Resorts',
    typeParam: 'Hotel',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '4',
    title: 'Bungalows',
    typeParam: 'Bungalow',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '5',
    title: 'Lands & Plots',
    typeParam: 'Land',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: '6',
    title: 'Commercial Properties',
    typeParam: 'Commercial',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
  },
];

export default function PropertyTypes() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight capitalize">
            Find Property By <span className="text-red-600">Specific Type</span>
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Select a property type to explore available listings across Sri Lanka
          </p>
        </div>

        {/* 3x2 Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {propertyTypes.map((item) => (
            <Link
              key={item.id}
              href={`/properties?type=${item.typeParam}`}
              className="group block bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 hover:border-red-500/30 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image Box */}
              <div className="relative h-64 w-full overflow-hidden bg-slate-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Title Box */}
              <div className="p-5 text-center bg-white group-hover:bg-red-50/30 transition-colors">
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}