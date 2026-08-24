'use client';

import React from 'react';
import { CheckCircle2, XCircle, KeyRound, Lightbulb } from 'lucide-react';

export default function ForeignBuyerGuide() {
  return (
    <section className="py-16 bg-slate-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Title Section */}
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Information on Buying Property in Sri Lanka
            <span className="block text-red-600 mt-1">
              as a Non Sri Lankan
            </span>
          </h2>
        </div>

        {/* Content Container */}
        <div className="space-y-8">
          
          {/* Section 1: What You CAN Buy */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              <h3 className="text-xl font-bold text-slate-900">What You CAN Buy</h3>
            </div>
            <div className="space-y-3 text-slate-700 sm:text-base text-sm">
              <p>
                <span className="font-semibold text-slate-900">Apartments & Condominiums:</span> You can freely purchase a condominium unit on any floor level of a building, provided you pay the full value upfront via an inward foreign remittance.
              </p>
              <p>
                <span className="font-semibold text-slate-900">Leasehold Land:</span> You can lease land for up to 99 years. This is the primary alternative to direct freehold ownership.
              </p>
              <p>
                <span className="font-semibold text-slate-900">Through a Local Company:</span> Land can be acquired through a Sri Lankan company where more than 50% of shares are held by a Sri Lankan citizen (the Act specifies that foreign shareholding must be less than 50%).
              </p>
            </div>
          </div>

          {/* Section 2: What You CANNOT Buy */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
              <h3 className="text-xl font-bold text-slate-900">What You CANNOT Buy</h3>
            </div>
            <div className="space-y-3 text-slate-700 sm:text-base text-sm">
              <p>
                <span className="font-semibold text-slate-900">Freehold Land:</span> The direct purchase of land (freehold) is strictly prohibited for foreigners and foreign-owned companies.
              </p>
              <p>
                <span className="font-semibold text-slate-900">Agricultural Land:</span> Foreigners are prohibited from purchasing or leasing agricultural land.
              </p>
            </div>
          </div>

          {/* Section 3: Key Requirements & Costs */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <KeyRound className="w-6 h-6 text-amber-500 shrink-0" />
              <h3 className="text-xl font-bold text-slate-900">Key Requirements & Costs</h3>
            </div>
            <div className="space-y-3 text-slate-700 sm:text-base text-sm">
              <p>
                <span className="font-semibold text-slate-900">Full Payment:</span> For condominiums, you must pay the full value upfront via an inward foreign remittance.
              </p>
              <p>
                <span className="font-semibold text-slate-900">Inward Investment Account (IIA):</span> All funds must be routed through a local Inward Investment Account (IIA) bank account to comply with exchange control regulations and ensure the ability to repatriate funds later.
              </p>
              <div>
                <span className="font-semibold text-slate-900">Key Taxes:</span>
                <div className="mt-2 space-y-2 pl-4">
                  <p>
                    <span className="font-semibold text-slate-900">Stamp Duty:</span> Payable by the buyer at 3% on the first LKR 100,000 and 4% on the balance of the property's market value.
                  </p>
                  <p>
                    <span className="font-semibold text-slate-900">VAT:</span> 18% may apply to new apartment purchases from a VAT-registered developer.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Practical Advice */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-4">
              <Lightbulb className="w-6 h-6 text-amber-500 shrink-0" />
              <h3 className="text-xl font-bold text-slate-900">Practical Advice</h3>
            </div>
            <div className="space-y-3 text-slate-700 sm:text-base text-sm">
              <div>
                <span className="font-semibold text-slate-900">Hire a Lawyer:</span> Hiring a local attorney to verify title deeds and review contracts is essential for legal compliance and risk mitigation.
                <div className="mt-2 p-3 bg-red-50 border-l-4 border-red-600 text-red-900 font-medium rounded-r-lg text-sm">
                  We will be able to introduce local licensed attorney for you
                </div>
              </div>
              <p>
                <span className="font-semibold text-slate-900">Be Aware of Risks:</span> Due diligence is critical, as land titles can be complex.
              </p>
              <p>
                <span className="font-semibold text-slate-900">Visas:</span> Buying property does not grant residency, but investments of USD 100,000+ may qualify for a 5-year renewable visa.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}