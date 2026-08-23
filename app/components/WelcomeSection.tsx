'use client';

import React from 'react';

export default function WelcomeSection() {
  return (
    <section className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Section Title (Centered) */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Welcome to <span className="text-red-600">Toddyland Real Estate</span>
          </h2>
        </div>

        {/* Content Aligned Exactly to Map's Left Edge */}
        <div className="w-full text-slate-700 leading-relaxed space-y-6">
          {/* Subheading */}
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
            Discover Sri Lanka’s Finest Properties – Curated Just for You.
          </h3>

          {/* Intro Paragraphs */}
          <p className="text-base text-slate-600">
            We don't sell everything. We sell only selected properties – handpicked for their quality, location, and long-term value.
          </p>

          <p className="text-base text-slate-600">
            What sets us apart – we have many offline properties that are never exposed to the internet. These exclusive listings are available only through our personal network, giving you access to opportunities that others simply cannot find.
          </p>

          <p className="text-base text-slate-600">
            Whether you're looking for a luxury rental, a self-sufficient off-grid sanctuary, or a strategic business investment, Toddyland Real Estate connects you with Sri Lanka's best – both online and offline.
          </p>

          {/* What We Offer Heading */}
          <div className="pt-6">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
              What We Offer
            </h3>

            <p className="text-base font-semibold text-slate-800 mb-6">
              We sell and rent out properties across Sri Lanka.
            </p>

            {/* Offerings List */}
            <div className="space-y-6">
              {/* Selling Section */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <span>🏠</span> Selling Properties:
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2">
                  <li>Houses for residential or investment purposes</li>
                  <li>Income-generating tourism properties (hotels, villas, guesthouses)</li>
                  <li>Bare Lands residential or investment purposes</li>
                </ul>
              </div>

              {/* Renting Section */}
              <div>
                <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-2">
                  <span>🏢</span> Renting Properties:
                </h4>
                <ul className="list-disc list-inside space-y-1.5 text-slate-600 pl-2">
                  <li>Premium apartments in high-rise buildings in cities</li>
                  <li>Digital nomad properties with modern infrastructure (high-speed WiFi, workspaces)</li>
                  <li>Beachside villas and peaceful hill country retreats</li>
                </ul>
              </div>
            </div>

            {/* Closing Note */}
            <p className="text-base text-slate-600 mt-8 pt-6 border-t border-slate-100">
              Our database consists of carefully selected properties across Sri Lanka's most desirable locations — from coastal hotspots to serene highlands.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}