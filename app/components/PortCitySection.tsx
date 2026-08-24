'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function PortCitySection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Title Section */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Port City Project
            <span className="block text-red-600 mt-1">
              The Global Financial Hub in the Future
            </span>
          </h2>
        </div>

        {/* Images Grid Container */}
        <div className="space-y-4 mb-8">
          {/* Main Large Image Placeholder */}
          <div className="relative w-full h-[300px] sm:h-[420px] bg-slate-200 rounded-xl overflow-hidden shadow-sm">
            <Image
              src="/port-city-main.webp" 
              alt="Port City Main Banner"
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* 3 Small Images Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="relative w-full h-[220px] bg-slate-200 rounded-xl overflow-hidden shadow-sm">
              <Image
                src="/port-city-1.webp"
                alt="Port City Sub 1"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-full h-[220px] bg-slate-200 rounded-xl overflow-hidden shadow-sm">
              <Image
                src="/port-city-2.webp"
                alt="Port City Sub 2"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative w-full h-[220px] bg-slate-200 rounded-xl overflow-hidden shadow-sm">
              <Image
                src="/port-city-3.webp"
                alt="Port City Sub 3"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Description & Learn More Section */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
            Port City Colombo is Asia’s newest global business hub — designed to compete with Dubai and Singapore, strategically positioned at the heart of the world’s busiest trade routes, with one thing they don’t have: wild elephants, golden beaches, and tropical nature at your doorstep. A 269-hectare Special Economic Zone with 100% foreign ownership, tax incentives, and a regulatory framework built for speed — where global commerce meets island paradise.
          </p>
          
          <div className="pt-2">
            <Link
              href="/port-city-mega-real-estate"
              className="inline-block text-sm font-semibold text-slate-900 border-b-2 border-slate-900 hover:text-red-600 hover:border-red-600 transition-colors pb-0.5"
            >
              Learn more
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
}