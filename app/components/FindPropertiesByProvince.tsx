'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface District {
  name: string;
  slug: string;
}

interface ProvinceData {
  id: string;
  name: string;
  slug: string;
  color: string;
  badgeBg: string;
  districts: District[];
}

const provinces: ProvinceData[] = [
  {
    id: 'northern',
    name: 'Northern',
    slug: 'northern',
    color: 'border-amber-400 bg-amber-50/60',
    badgeBg: 'bg-amber-500',
    districts: [
      { name: 'Jaffna', slug: 'jaffna' },
      { name: 'Kilinochchi', slug: 'kilinochchi' },
      { name: 'Mannar', slug: 'mannar' },
      { name: 'Mullaitivu', slug: 'mullaitivu' },
      { name: 'Vavuniya', slug: 'vavuniya' },
    ],
  },
  {
    id: 'north-central',
    name: 'North Central',
    slug: 'north-central',
    color: 'border-lime-400 bg-lime-50/60',
    badgeBg: 'bg-lime-600',
    districts: [
      { name: 'Anuradhapura', slug: 'anuradhapura' },
      { name: 'Polonnaruwa', slug: 'polonnaruwa' },
    ],
  },
  {
    id: 'north-western',
    name: 'North Western',
    slug: 'north-western',
    color: 'border-blue-400 bg-blue-50/60',
    badgeBg: 'bg-blue-500',
    districts: [
      { name: 'Kurunegala', slug: 'kurunegala' },
      { name: 'Puttalam', slug: 'puttalam' },
    ],
  },
  {
    id: 'central',
    name: 'Central',
    slug: 'central',
    color: 'border-pink-400 bg-pink-50/60',
    badgeBg: 'bg-pink-500',
    districts: [
      { name: 'Kandy', slug: 'kandy' },
      { name: 'Matale', slug: 'matale' },
      { name: 'Nuwara Eliya', slug: 'nuwara-eliya' },
    ],
  },
  {
    id: 'eastern',
    name: 'Eastern',
    slug: 'eastern',
    color: 'border-emerald-400 bg-emerald-50/60',
    badgeBg: 'bg-emerald-600',
    districts: [
      { name: 'Ampara', slug: 'ampara' },
      { name: 'Batticaloa', slug: 'batticaloa' },
      { name: 'Trincomalee', slug: 'trincomalee' },
    ],
  },
  {
    id: 'western',
    name: 'Western',
    slug: 'western',
    color: 'border-orange-400 bg-orange-50/60',
    badgeBg: 'bg-orange-500',
    districts: [
      { name: 'Colombo', slug: 'colombo' },
      { name: 'Gampaha', slug: 'gampaha' },
      { name: 'Kalutara', slug: 'kalutara' },
    ],
  },
  {
    id: 'sabaragamuwa',
    name: 'Sabaragamuwa',
    slug: 'sabaragamuwa',
    color: 'border-purple-400 bg-purple-50/60',
    badgeBg: 'bg-purple-500',
    districts: [
      { name: 'Kegalle', slug: 'kegalle' },
      { name: 'Ratnapura', slug: 'ratnapura' },
    ],
  },
  {
    id: 'uva',
    name: 'Uva Province',
    slug: 'uva',
    color: 'border-cyan-400 bg-cyan-50/60',
    badgeBg: 'bg-cyan-500',
    districts: [
      { name: 'Badulla', slug: 'badulla' },
      { name: 'Monaragala', slug: 'monaragala' },
    ],
  },
  {
    id: 'southern',
    name: 'Southern',
    slug: 'southern',
    color: 'border-green-400 bg-green-50/60',
    badgeBg: 'bg-green-600',
    districts: [
      { name: 'Galle', slug: 'galle' },
      { name: 'Hambantota', slug: 'hambantota' },
      { name: 'Matara', slug: 'matara' },
    ],
  },
];

export default function FindPropertiesByProvince() {
  const [activeProvince, setActiveProvince] = useState<string | null>(null);
  const router = useRouter();

  const getProvinceBox = (id: string) => {
    const province = provinces.find((p) => p.id === id);
    if (!province) return null;

    const isActive = activeProvince === province.id;

    return (
      <div
        key={province.id}
        onClick={() => router.push(`/properties?province=${province.slug}`)}
        onMouseEnter={() => setActiveProvince(province.id)}
        onMouseLeave={() => setActiveProvince(null)}
        className={`block p-3.5 rounded-2xl border transition-all duration-300 cursor-pointer ${
          isActive
            ? 'border-red-600 bg-red-600 text-white shadow-xl scale-[1.02]'
            : `${province.color} shadow-xs hover:border-red-400`
        }`}
      >
        <div className="flex items-center gap-2 mb-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              isActive ? 'bg-white' : province.badgeBg
            }`}
          />
          <h3
            className={`text-xs font-black uppercase tracking-wider ${
              isActive ? 'text-white' : 'text-slate-800'
            }`}
          >
            {province.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {province.districts.map((dist) => (
            <Link
              key={dist.slug}
              href={`/properties?district=${dist.slug}`}
              onClick={(e) => e.stopPropagation()}
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all shadow-2xs ${
                isActive
                  ? 'bg-white/20 text-white hover:bg-white hover:text-red-600'
                  : 'bg-white hover:bg-red-600 hover:text-white border border-slate-200/80 text-slate-700'
              }`}
            >
              {dist.name}
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Find Properties <span className="text-red-600">By Province</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column Boxes */}
          <div className="lg:col-span-4 flex flex-col gap-3.5">
            {getProvinceBox('northern')}
            {getProvinceBox('north-western')}
            {getProvinceBox('western')}
            {getProvinceBox('sabaragamuwa')}
          </div>

          {/* Center Column: Sri Lanka Map */}
          <div className="lg:col-span-4 flex items-center justify-center p-2">
            <div className="relative w-full max-w-[340px] flex justify-center items-center">
              <img
                src="./sri-lanka-map.png"
                alt="Sri Lanka Province Map"
                className={`w-full h-auto object-contain transition-all duration-300 ${
                  activeProvince ? 'brightness-105 drop-shadow-xl' : 'drop-shadow-md'
                }`}
              />
            </div>
          </div>

          {/* Right Column Boxes */}
          <div className="lg:col-span-4 flex flex-col gap-3.5">
            {getProvinceBox('north-central')}
            {getProvinceBox('central')}
            {getProvinceBox('eastern')}
            {getProvinceBox('uva')}
            {getProvinceBox('southern')}
          </div>
        </div>
      </div>
    </section>
  );
}