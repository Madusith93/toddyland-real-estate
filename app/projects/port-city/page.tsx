'use client';

import React from 'react';

// ==========================================
// PUBLIC FOLDER IMAGE PATHS
// ==========================================
const IMAGE_PATHS = {
  hero: "/images/port-city-hero.jpg",
  sub1: "/images/port-city-sub1.jpeg",
  sub2: "/images/port-city-sub2.jpg",
  sub3: "/images/port-city-sub3.jpeg",
  keyNumbers: "/images/port-city-skyline.jpeg",
  investmentTypes: "/images/port-city-marina.jpg",
  futurePotential: "/images/port-city-business.jpeg",
  specialtyNature: "/images/port-city-nature.jpeg",
  comparison: "/images/port-city-comparison.jpg",
  roiGraph: "/images/port-city-roi-graph.jpeg"
};

export default function PortCityProjectPage() {
  const whatsappNumber = "94760180036";
  const emailAddress = "info@toddylandrealestate.com";

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* PAGE HEADER */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Port City Colombo-<span className="text-red-600">Project Overview</span>
          </h1>
          <div className="w-24 h-1 bg-red-600 mx-auto rounded-full mt-2"></div>
          <p className="text-base sm:text-lg text-slate-600 font-medium max-w-3xl mx-auto pt-2">
            South Asia's premier Special Economic Zone (SEZ) & future regional financial hub.
          </p>
        </div>

        {/* HERO IMAGES SECTION */}
        <div className="space-y-4">
          <div className="w-full h-64 sm:h-80 bg-slate-200 rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative">
            <img 
              src={IMAGE_PATHS.hero} 
              alt="Port City Colombo Overview" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80";
              }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            <div className="h-28 sm:h-40 bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
              <img 
                src={IMAGE_PATHS.sub1} 
                alt="Port City Image 01" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>
            <div className="h-28 sm:h-40 bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
              <img 
                src={IMAGE_PATHS.sub2} 
                alt="Port City Image 02" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>
            <div className="h-28 sm:h-40 bg-slate-200 rounded-xl overflow-hidden border border-slate-200">
              <img 
                src={IMAGE_PATHS.sub3} 
                alt="Port City Image 03" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>
          </div>
        </div>

        {/* SECTION 1: PROJECT OVERVIEW */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-7 bg-red-600 rounded-full inline-block"></span>
            Project Overview
          </h2>
          <p className="text-slate-600 leading-relaxed text-base">
            Port City Colombo is a 269-hectare Special Economic Zone (SEZ) built on reclaimed land, representing Sri Lanka's boldest urban development and a $15 billion future investment pipeline. It is governed by the Colombo Port City Economic Commission, offering 100% foreign ownership, transactions in 16 foreign currencies, 100% capital repatriation, and long-term tax incentives. It was named "Best Knowledge Zone – Asia Pacific Region" by FDI Intelligence in 2025.
          </p>
        </section>

        {/* FIGMA LAYOUT SECTIONS (LEFT: TEXT, RIGHT: IMAGE) */}
        <div className="space-y-8">

          {/* 1. KEY NUMBERS FOR THE PROJECT */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Key numbers for the project:</h3>
                <ul className="space-y-1.5 text-slate-700 text-sm">
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">•</span> <strong>269 Ha</strong> — Project Size</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">•</span> <strong>USD 15 Billion</strong> — Investment</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">•</span> <strong>5</strong> — Distinct Precincts</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">•</span> <strong>178 Ha</strong> — Clean Title Land for Development</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">•</span> <strong>91 Ha</strong> — of Public Spaces</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">•</span> <strong>Expected City Population</strong> of 273,000</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">•</span> <strong>Creating 143,000</strong> New Jobs</li>
                  <li className="flex items-start gap-2"><span className="text-red-600 font-bold">•</span> <strong>63 Million m²</strong> — Total Build Area (GFA)</li>
                </ul>
                <p className="text-xs text-slate-500 italic pt-2">
                  These statistics highlight the immense scale and ambition of the project, positioning it as a major economic zone and future city in South Asia. The timeline indicates a planned completion by 2040.
                </p>
              </div>
              <div className="h-64 md:h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img 
                  src={IMAGE_PATHS.keyNumbers} 
                  alt="Key Numbers Skyline" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
            </div>
          </section>

          {/* 2. 7 INVESTMENT TYPES */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              <div className="md:col-span-2 space-y-3">
                <h3 className="text-xl font-bold text-slate-900">7 Investment Types</h3>
                <ol className="space-y-2 text-slate-700 text-sm">
                  <li><strong>1. Luxury Residential Real Estate</strong> — Over 600 ultra-luxury units including 1BR–3BR apartments, premium villas, and penthouses in twin 40-storey towers valued at $300M+.</li>
                  <li><strong>2. Marina‑Front Properties</strong> — Direct marina-front land, a finite and irreplaceable asset category with exceptional capital growth and rental income potential within South Asia's first Luxury Yacht Marina.</li>
                  <li><strong>3. Commercial & Office Spaces</strong> — Over 1 million sq. ft. of office space already occupied, with the Business Centre IT and commercial park set to open in 2025.</li>
                  <li><strong>4. Mixed‑Use Developments</strong> — Land parcels combining residential, commercial, and recreational spaces in a walkable, digitally connected urban core.</li>
                  <li><strong>5. Retail & Duty‑Free</strong> — South Asia's first downtown duty‑free retail destination, "The Mall at Port City Colombo," opened September 2024.</li>
                  <li><strong>6. Tourism & Hospitality</strong> — 5‑star beach resorts, oceanfront villas with private beach access, and a 101Ha swimmable lagoon.</li>
                  <li><strong>7. Business & Financial Services</strong> — A dedicated SEZ for IT, financial services, maritime, logistics, and professional services, attracting multinational corporations and regional headquarters.</li>
                </ol>
              </div>
              <div className="h-72 md:h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img 
                  src={IMAGE_PATHS.investmentTypes} 
                  alt="7 Investment Types" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
            </div>
          </section>

          {/* 3. FUTURE POTENTIAL */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <h3 className="text-xl font-bold text-slate-900">Future Potential – Competing with Dubai & Singapore</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Port City Colombo is positioning itself as a complement and alternative to Dubai and Singapore. With operating costs at a fraction of those in established hubs, a 5‑hour flight radius to 1.7 billion people, and a regulatory framework modeled after global financial centers, it offers an accessible, neutral, and scalable gateway to South Asia. Close to 200 companies have already registered, and $900 million in investments were secured from November 2025 to March 2026.
                </p>
              </div>
              <div className="h-56 md:h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img 
                  src={IMAGE_PATHS.futurePotential} 
                  alt="Future Potential" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
            </div>
          </section>

          {/* 4. SPECIALTY */}
          <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
              <div className="md:col-span-2 space-y-3">
                <h3 className="text-xl font-bold text-slate-900">
                  Specialty – Where Modern Urban Luxury Meets Wildlife, Nature, Beach, Spirituality & Peace
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Port City Colombo is the only global business hub where modern urban luxury coexists with wild elephants, golden beaches, and tropical nature. Uninterrupted Indian Ocean views, lush central parkland, a swimmable beach, and a 250‑berth luxury marina are designed for globally mobile residents seeking both world‑class business infrastructure and a life of peace and spirituality.
                </p>
                <p className="text-slate-600 text-sm leading-relaxed">
                  It offers a cost-effective, investor-friendly environment that leverages Sri Lanka's strategic location at the crossroads of global maritime routes.
                </p>
              </div>
              <div className="h-64 md:h-full bg-slate-100 rounded-xl overflow-hidden border border-slate-200">
                <img 
                  src={IMAGE_PATHS.specialtyNature} 
                  alt="Specialty Nature" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
            </div>
          </section>

        </div>

        {/* SECTION 4: COMPARISON TABLE */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
              Global Comparison
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Comparison of Modern Luxury Business Hubs in the World
            </h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3 sm:p-4 font-semibold border-b border-slate-800">Factor</th>
                  <th className="p-3 sm:p-4 font-semibold border-b border-slate-800 bg-red-700/90">Port City Colombo (2026)</th>
                  <th className="p-3 sm:p-4 font-semibold border-b border-slate-800">Dubai (UAE)</th>
                  <th className="p-3 sm:p-4 font-semibold border-b border-slate-800">Singapore</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold bg-slate-50">Tax</td>
                  <td className="p-3 sm:p-4 font-semibold text-slate-900 bg-red-50/50">0% corporate tax for up to 25 years in the SEZ.</td>
                  <td className="p-3 sm:p-4">9% corporate tax; historically 0% in free zones.</td>
                  <td className="p-3 sm:p-4">Approx. 17% corporate tax (standard rate).</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold bg-slate-50">ROI (Potential)</td>
                  <td className="p-3 sm:p-4 font-semibold text-slate-900 bg-red-50/50">High potential with $15B total investment, $300M new FDI for Phase II. Comparable to Dubai's early days.</td>
                  <td className="p-3 sm:p-4">Mature, stable but saturated with 7.3% avg. rental yield (City Centre).</td>
                  <td className="p-3 sm:p-4">Mature, stable but with high entry costs and 2.5–3.5% rental yield.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold bg-slate-50">Safety</td>
                  <td className="p-3 sm:p-4 bg-red-50/50">Very Safe (GPI: 1.43; Sri Lanka). Political stability improving since 2022.</td>
                  <td className="p-3 sm:p-4">Very Safe (GPI: 1.52; UAE). Low crime in business zones.</td>
                  <td className="p-3 sm:p-4">Very Safe (GPI: 1.34); rigorous law enforcement.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold bg-slate-50">Quality of Life</td>
                  <td className="p-3 sm:p-4 bg-red-50/50">High potential with 269‑hectare master‑planned waterfront city, 110 acres of parks. Access to fresh water & best food.</td>
                  <td className="p-3 sm:p-4">High living standards, but extreme summer heat.</td>
                  <td className="p-3 sm:p-4">Exceptional standard; costly. Less recreational activities.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold bg-slate-50">Access to Nature</td>
                  <td className="p-3 sm:p-4 font-semibold text-slate-900 bg-red-50/50">Exceptional: Beaches, wild elephants, lush tropical hinterland.</td>
                  <td className="p-3 sm:p-4">Limited: Man‑made attractions, desert.</td>
                  <td className="p-3 sm:p-4">Moderate: Gardens and parks, little wilderness.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold bg-slate-50">Access to Tourist Hubs</td>
                  <td className="p-3 sm:p-4 bg-red-50/50">Excellent: Direct flights to Maldives, India, SE Asia; gateway to beaches, hill country & ancient cities.</td>
                  <td className="p-3 sm:p-4">Hub with global connectivity; strong tourism infrastructure.</td>
                  <td className="p-3 sm:p-4">Strong regional hub; urban, not a classic tourist destination.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold bg-slate-50">Access to Culture & Food</td>
                  <td className="p-3 sm:p-4 bg-red-50/50">Rich and vibrant: Local Sinhalese & Tamil heritage, Buddhist sites, high-quality affordable cuisine.</td>
                  <td className="p-3 sm:p-4">Cosmopolitan and international; Middle Eastern and global cuisine.</td>
                  <td className="p-3 sm:p-4">Multicultural and high‑end; hawker centres, luxury dining.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold bg-slate-50">Food & Grocery Prices</td>
                  <td className="p-3 sm:p-4 bg-red-50/50">Affordable, quality is very high, fresh.</td>
                  <td className="p-3 sm:p-4">Moderate. All frozen and imported from other countries yet expensive.</td>
                  <td className="p-3 sm:p-4">Moderate. All frozen and imported from other countries yet expensive.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold bg-slate-50">Average Temperature</td>
                  <td className="p-3 sm:p-4 bg-red-50/50">Tropical, coastal: ~26–32°C year-round. Within 3 hours, Central mountains with European cool climate 15°C - 22°C.</td>
                  <td className="p-3 sm:p-4">19°C (winter) to 42°C (summer); hot desert climate.</td>
                  <td className="p-3 sm:p-4">~28°C annual average, stable year-round.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold bg-slate-50">Humidity</td>
                  <td className="p-3 sm:p-4 bg-red-50/50">Moderate; coastal humidity varies with monsoon seasons.</td>
                  <td className="p-3 sm:p-4">59–65% annual average; higher in winter months.</td>
                  <td className="p-3 sm:p-4">70–90% year-round; often humid and uncomfortable.</td>
                </tr>
                <tr className="hover:bg-slate-50">
                  <td className="p-3 sm:p-4 font-bold bg-slate-50">Recreational Options</td>
                  <td className="p-3 sm:p-4 bg-red-50/50">Emerging: ATV rides, go‑karting, marina activities, central parklands. Within 1.5h on beach with sunbed.</td>
                  <td className="p-3 sm:p-4">Artificial: Indoor ski, mall races, esports, water sports, drift‑karting, extreme sports.</td>
                  <td className="p-3 sm:p-4">Well‑developed: Kayaking, intertidal walks, pub trivia, K‑pop dance, coastal skateparks.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* SECTION 5: WHY PORT CITY IS THE BEST INVESTMENT */}
        <section className="bg-slate-900 text-white rounded-2xl p-6 sm:p-10 shadow-xl space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Why Port City Colombo is the Best Investment Destination
          </h2>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            Port City Colombo is the only global business hub that offers the perfect balance — it's not a hot desert like Dubai, and it's not a concrete jungle like Singapore. Instead, it combines world‑class business infrastructure with the tropical beauty of Sri Lanka: golden beaches, wild elephants, lush greenery, and a relaxed island lifestyle.
          </p>
          <p className="text-slate-300 leading-relaxed text-sm sm:text-base">
            With Sri Lanka's tourism industry rebounding strongly and the country positioning itself as a regional financial hub, tourism and real estate in Port City are projected to see exceptional growth over the next 20 to 30 years. As the city develops, early investors stand to benefit from significantly higher ROI — the same opportunity that early buyers in Dubai and Singapore experienced decades ago.
          </p>
          <div className="bg-red-600/20 border border-red-500/40 p-4 rounded-xl text-red-200 font-semibold text-sm sm:text-base">
            🔥 Early birds get the highest returns. Those who invest now will secure prime properties at entry‑level prices, before the city reaches its full potential. This is the moment to get in, before the world catches on.
          </div>
        </section>

        {/* SECTION 6: CONTACT & CALL TO ACTION */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center gap-2">
              📞 Let's Have a Casual Talk
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Port City Colombo is the opportunity of a lifetime — and we're here to help you seize it. Whether you're looking for luxury residences, commercial spaces, or land for development, our team of experts can guide you through every step — from property selection to legal compliance, financing, and management.
            </p>
            <p className="text-slate-800 font-medium text-sm sm:text-base">
              Let's have a casual talk. No pressure. Just honest advice and a friendly conversation about your future in Sri Lanka.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello%21%20I%20am%20interested%20in%20Port%20City%20Colombo%20Investment%20Opportunities.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition shadow-md gap-2"
            >
              💬 Chat on WhatsApp (+94 76 018 0036)
            </a>
            <a
              href={`mailto:${emailAddress}?subject=Port%20City%20Colombo%20Investment%20Inquiry`}
              className="inline-flex items-center justify-center bg-red-600 hover:bg-red-500 text-white px-6 py-3.5 rounded-xl font-bold text-sm transition shadow-md gap-2"
            >
              ✉️ Send an Email
            </a>
          </div>
        </section>

        {/* SECTION 7: TRENDS OF ROI GRAPH */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-4">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-6 bg-red-600 rounded-full inline-block"></span>
            Trends of ROI Graph
          </h2>
          <p className="text-xs text-slate-500">
            Projected Return on Investment (ROI) trajectories comparing Port City Colombo against regional benchmarks.
          </p>
          
          <div className="w-full h-72 sm:h-96 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 relative">
            <img 
              src={IMAGE_PATHS.roiGraph} 
              alt="Trends of ROI Graph" 
              className="w-full h-full object-contain bg-white p-2"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80";
              }}
            />
          </div>
        </section>
      </div>
    </main>
  );
}