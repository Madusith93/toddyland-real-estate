'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Globe2, Compass, Award } from 'lucide-react';

export default function WhyChooseUsSection() {
  const points = [
    {
      icon: Globe2,
      title: 'Local Expertise, Global Reach',
      desc: 'We understand the local market, laws, and culture — English, Japanese, and selected languages available.',
    },
    {
      icon: Compass,
      title: 'Curated Properties',
      desc: 'Luxury rentals, off-grid sanctuaries, digital nomad havens, and tourism properties — all vetted for quality & long-term value.',
    },
    {
      icon: ShieldCheck,
      title: 'End-to-End Support',
      desc: "From inquiry to keys and beyond, we're with you every step of the way.",
    },
    {
      icon: Award,
      title: 'Trusted Partner for Foreigners',
      desc: 'Ensuring your investment is secure and legally protected with deep insights into Sri Lanka property market.',
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-y border-slate-200/60">
      {/* Container aligned with Welcome section (max-w-7xl) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Section Header (Centered) */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-md border border-red-100 mb-3">
            About Our Trust
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Why <span className="text-red-600">Toddyland Real Estate</span>
          </h2>
        </div>

        {/* Content Aligned Exactly to Page Edges */}
        <div className="w-full text-left space-y-6">
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            We don't just sell any property — we sell property that has a value and purpose.
          </h3>
          
          <p className="text-base text-slate-600 leading-relaxed">
            Navigating Sri Lanka's property market can be complex. As your trusted local partner, we handle everything — from property selection and legal compliance to purchase and management.
          </p>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-4">
            {points.map((pt, idx) => {
              const Icon = pt.icon;
              return (
                <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
                  <div className="flex items-center space-x-2.5 text-red-600">
                    <Icon className="w-5 h-5 shrink-0" />
                    <h4 className="text-sm font-bold text-slate-900">{pt.title}</h4>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{pt.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Global Reps Note */}
          <div className="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-1">
            <p className="font-semibold text-slate-200">
              🌐 Representatives in Japan, United States, and Australia.
            </p>
            <p className="text-slate-400">
              If you are a Japanese investor, we can consult directly in the Japanese language.
            </p>
          </div>

          {/* Black Learn More Button */}
          <div className="pt-2 pb-8">
            <Link
              href="/services"
              className="inline-flex items-center px-8 py-3.5 rounded-xl bg-black text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg"
            >
              Learn More
            </Link>
          </div>
        </div>

        {/* Image Section (Narrower width, Tall height to match Sri Lanka map shape) */}
        <div className="w-full flex justify-center mt-6">
          <div className="relative w-full max-w-2xl h-[550px] sm:h-[650px] rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-white group">
            <Image
              src="/sri-lanka-map.png"
              alt="Sri Lanka Coverage & Real Estate Map"
              fill
              className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md p-3 rounded-xl border border-slate-200/60 shadow-sm text-center">
              <p className="text-xs font-bold text-slate-800">Internet Coverage & Regional Reach</p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}