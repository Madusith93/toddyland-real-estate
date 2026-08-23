'use client';

import React from 'react';

export default function ServicesSection() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Section Title (Centered - Exactly like Welcome Section) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight ">
            Services
          </h2>
        </div>

        {/* Content Box (Aligned Exactly to Welcome Section's Left Margin & Width) */}
        <div className="w-full text-slate-700 leading-relaxed space-y-8">
          {/* Service 1 */}
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              1. Search & Consultation - Akiya, New properties, Second hand properties
            </h3>
            <p className="text-base text-slate-600 leading-relaxed max-w-5xl">
              We provide end‑to‑end property support across Sri Lanka — from residence and investment searches with full due diligence, to high‑end rentals, fully equipped digital nomad workstations, off‑grid development with ready‑made plans, and retirement property consultations — all tailored to your lifestyle, budget, and long‑term goals.
            </p>
          </div>

          {/* Service 2 */}
          <div className="space-y-3">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              2. End‑to‑End Buying Support – Legal & Transaction Support
            </h3>
            <p className="text-base text-slate-600 leading-relaxed max-w-5xl">
              We manage the entire transaction process — arranging lawyers, verifying deeds, assisting with loan applications, handling taxes and documentation, and acting as your trusted local partner for leasehold or company‑backed structures. We also offer online property viewings, terrain and hazard mapping, and property condition checks — ensuring your investment is secure, compliant, and hassle‑free.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}