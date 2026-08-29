'use client';

import React from 'react';

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* PAGE HEADER */}
        <div className="text-center space-y-3">
         
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Our Services – <span className="text-red-600">Toddyland Real Estate</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            From Coast to Highlands — We Select the Best
          </p>
        </div>

        {/* SECTION 1: SEARCH & CONSULTATION */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-red-600 text-white text-sm rounded-full">1</span>
              Search & Consultation
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-1 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Residence & Investment Property Search Support</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We analyze market value, verify deeds, and evaluate yield, climate, transport, nearby community, loan eligibility, population growth, and proximity to schools, hospitals, supermarkets, hotels, and attractions.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">High-End Rentals</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We track metropolitan trends to find the best value in premium apartments and luxury villas.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Digital Nomad Rentals</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We offer access to our own network of fully equipped, long-term workstations — with high-speed WiFi, workspaces, and modern amenities in beachside and hill country locations.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Off-Grid Property Search & Development Consultation</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We have development partners and ready-made plans for independent, off-grid homes — designed for freedom, sustainability, and a better future for your family.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Retire Sri Lanka – Property Search</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  We help you find retirement-friendly locations — considering community, peace, climate, hospital access, transport, and spiritual life — regardless of nationality.
                </p>
              </div>
            </div>

            {/* SIDE IMAGE 1 */}
            <div className="w-full lg:w-80 shrink-0 h-64 lg:h-80 bg-slate-200 rounded-2xl overflow-hidden border border-slate-300">
              <img 
                src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80" 
                alt="Search & Consultation" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: END-TO-END BUYING SUPPORT */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 bg-red-600 text-white text-sm rounded-full">2</span>
              End-to-End Buying Support – Legal & Transaction Support
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-1 space-y-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                We manage the entire transaction process — arranging lawyers, verifying deeds, assisting with loan applications, handling taxes and documentation, and acting as your trusted local partner for leasehold or company‑backed structures.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                We also offer online property viewings, terrain and hazard mapping, and property condition checks — ensuring your investment is secure, compliant, and hassle‑free.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                We arrange lawyers, handle deed verification, support loan applications (where available), and manage tax and documentation with government departments.
              </p>

              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-2 mt-4">
                <h3 className="text-base font-bold text-slate-900">Local Partner for Foreign Buyers</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Since foreigners cannot hold freehold ownership of land, we act as your trusted local partner — guiding you through leasehold agreements, company-backed structures, and ensuring your investment is secure and compliant.
                </p>
              </div>
            </div>

            {/* SIDE IMAGE 2 */}
            <div className="w-full lg:w-80 shrink-0 h-64 lg:h-72 bg-slate-200 rounded-2xl overflow-hidden border border-slate-300">
              <img 
                src="https://images.unsplash.com/photo-1654588833369-5174f4640cd2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Legal & Transaction Support" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* SECTION 3: FULL CLOSING COST BREAKDOWN TABLE */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900">💰 Full Closing Cost Breakdown for a LKR 30 Million House</h2>
            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900 text-white uppercase text-xs">
                  <tr>
                    <th className="py-3 px-4">Cost Item</th>
                    <th className="py-3 px-4">Rate / Basis</th>
                    <th className="py-3 px-4 text-right">Estimated Cost (LKR)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  <tr><td className="py-3 px-4 font-semibold">Stamp Duty</td><td className="py-3 px-4">3% on first LKR 100,000; 4% on balance</td><td className="py-3 px-4 text-right">1,196,000</td></tr>
                  <tr><td className="py-3 px-4 font-semibold">Legal Fees</td><td className="py-3 px-4">1%–3% of property value (negotiable)</td><td className="py-3 px-4 text-right">300,000 – 900,000</td></tr>
                  <tr><td className="py-3 px-4 font-semibold">Registration Fees</td><td className="py-3 px-4">Instrument fee + Registrar General fee + optional search/copies</td><td className="py-3 px-4 text-right">~1,100</td></tr>
                  <tr><td className="py-3 px-4 font-semibold">VAT (if new apartment)</td><td className="py-3 px-4">18% (not applicable for a house)</td><td className="py-3 px-4 text-right">0</td></tr>
                  <tr><td className="py-3 px-4 font-semibold">Capital Gains Tax</td><td className="py-3 px-4">10–15% on profit (paid by seller, not buyer)</td><td className="py-3 px-4 text-right">0</td></tr>
                  <tr className="bg-red-50 text-red-900 font-bold">
                    <td className="py-4 px-4">Total Estimated Upfront Cost</td>
                    <td className="py-4 px-4"></td>
                    <td className="py-4 px-4 text-right">~1.91 million – 2.21 million</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="text-xs text-slate-500 space-y-1 italic mt-2">
              <p>
                The estimated total closing cost for a LKR 30 million house purchase is LKR 1.91 million to 2.21 million, making the final price approximately LKR 31.91 million to 32.21 million.
              </p>
              <p>
                (LKR 30 million house (approx. $89,700 USD** at 334.5 LKR/USD), the estimated total closing cost is approximately $5,700 – $6,600 USD, which is about 6.4% – 7.4% of the total property value.)
              </p>
              <p>*Depending on rate and market value at the moment</p>
            </div>
          </div>
        </section>

        {/* SECTION 4: WHERE TO BUY A PROPERTY IN SRI LANKA TABLE */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div>
            <p className="text-sm text-slate-500 italic mb-1">Learn more continued from landing page</p>
            <h2 className="text-2xl font-bold text-slate-900">Where to Buy a Property in Sri Lanka</h2>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-900 text-white uppercase text-xs">
                <tr>
                  <th className="py-3 px-4 min-w-[200px]">Purpose</th>
                  <th className="py-3 px-4 min-w-[220px]">Recommended Locations</th>
                  <th className="py-3 px-4 min-w-[280px]">Key Info</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {[
                  { p: '1. Global Business & Financial Hub', l: 'Port City Colombo', k: 'SEZ with 100% foreign ownership, tax holidays, and priority visas for global investors.' },
                  { p: '2. Retire in Sri Lanka', l: 'Colombo, Southern Coastal Areas', k: "World's most affordable retirement destination with a dedicated My Dream Home Visa." },
                  { p: '3. Tourism Property Investment', l: 'Weligama, Mirissa, Unawatuna, Galle', k: 'Growing tourism market with strong international hotel investment and rental demand.' },
                  { p: '4. Going Off‑Grid', l: 'Hasalaka (Kandy), Nationwide and country side / Downsouth', k: 'Live in a community, where you have your own vegetable garden, water electricity Internet source, full scale house, where you can raise next generation' },
                  { p: '5. Luxury Living', l: 'Colombo 7, Rajagiriya, Galle Fort, Port city', k: 'Premium neighborhoods with high-end villas, apartments, penthouses' },
                  { p: '6. Digital Nomad Lifestyle', l: 'Weligama, Galle, Kandy, Colombo, Knuckles', k: 'Modern properties with high‑speed WiFi, workspaces, and beach or hill country access. All necessities nearby' },
                  { p: '7. Affordable Housing', l: 'Nationwide', k: 'Emerging suburban corridors with affordable land and growing infrastructure.' },
                  { p: '8. Commercial & Industrial Investment', l: 'Colombo, Port City, Katunayake, Hambantota', k: 'Strategic locations near ports, airports, and special economic zones for logistics and warehousing.' },
                  { p: '9. Eco‑Farming & Cultivable Land', l: 'Nuwara Eliya, Kandy, Badulla, Kurunegala', k: 'Fertile highlands and valleys with agricultural potential for organic and sustainable farming.' },
                  { p: '10. Beachfront & Coastal Living', l: 'Negombo, Bentota, Tangalle, Galle', k: 'Pristine coastline properties with tourism potential, resort development, and rental income.' },
                  { p: '11. Living in Cool European climate all year around', l: 'Nuwara Eliya, Ella, Bandarawela, Haputale, Hatton', k: 'Cool climate, tea plantation views, and peaceful living for nature lovers and retirees. Colonial British bungalows' },
                  { p: '12. Student & Educational Hub', l: 'Colombo, Kandy, Moratuwa', k: 'Properties near universities and international schools with strong rental demand.' },
                  { p: '13. Heritage & Cultural Living', l: 'Kandy, Galle, Anuradhapura, Polonnaruwa', k: 'UNESCO heritage sites and cultural hotspots with unique lifestyle and tourism appeal.' },
                  { p: '14. Health & Wellness Living', l: 'Colombo, Galle, Kandy, Beruwala', k: 'Access to top hospitals, wellness centers, and Ayurveda resorts for health‑focused living.' },
                  { p: '15. Spiritual & Retreat Living', l: 'Kandy, Anuradhapura, Mihintale, Knuckles range', k: 'Proximity to temples, meditation centers, and peaceful spiritual communities. Monasteries in the forests. Aware of monks who meditate in the forests.' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{row.p}</td>
                    <td className="py-3 px-4 text-red-600 font-semibold">{row.l}</td>
                    <td className="py-3 px-4 text-slate-600">{row.k}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </main>
  );
}