'use client';

import React from 'react';
import Link from 'next/link';
import { User } from 'lucide-react';

export default function TeamSection() {
  const teamMembers = [
    {
      id: 1,
      name: 'Dan',
      role: 'Founder and CEO',
      desc: 'Leading the strategic vision and expansion of Toddyland Real Estate across global markets.',
    },
    {
      id: 2,
      name: 'Operation Manager',
      role: 'Operations & Logistics',
      desc: 'Overseeing daily business operations, client onboarding, and seamless property legal compliance.',
    },
    {
      id: 3,
      name: 'Sales Executive',
      role: 'Client Relations & Sales',
      desc: 'Connecting international buyers with premium curated real estate opportunities across Sri Lanka.',
    },
  ];

  return (
    <section className="py-16 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <span className="inline-block text-xs font-bold uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-md border border-red-100 mb-3">
            Leadership & Experts
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Meet <span className="text-red-600">The Team</span>
          </h2>
        </div>

        {/* Team Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-12">
          {teamMembers.map((member) => (
            <div 
              key={member.id} 
              className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow"
            >
              {/* Profile Icon Container */}
              <div className="w-16 h-16 rounded-full bg-slate-200/70 flex items-center justify-center mb-4 text-slate-600">
                <User className="w-8 h-8 stroke-[1.5]" />
              </div>
              
              {/* Member Name */}
              <h3 className="text-lg font-bold text-slate-900">
                {member.name}
              </h3>

              {/* Member Role */}
              {member.role && (
                <p className="text-xs font-semibold text-red-600 mb-3 uppercase tracking-wider">
                  {member.role}
                </p>
              )}

              {/* Description */}
              {member.desc && (
                <p className="text-xs text-slate-500 leading-relaxed max-w-xs">
                  {member.desc}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* See More Button */}
        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 rounded-xl bg-black text-white font-bold text-xs sm:text-sm hover:bg-slate-800 transition-colors shadow-md hover:shadow-lg"
          >
            See More
          </Link>
        </div>

      </div>
    </section>
  );
}