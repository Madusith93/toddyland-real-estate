'use client';

import React, { useState, useEffect } from 'react';

const SAMPLE_PROPERTIES = [
  {
    id: "prop-1",
    type: "Apartment",
    priceLkr: "345,000 LKR",
    priceUsd: "65,000 USD",
    location: "Galle - Southern province",
    layout: "4B / 136m2",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "prop-2",
    type: "Buy / Villa",
    priceLkr: "345,000 LKR",
    priceUsd: "65,000 USD",
    location: "Galle - Southern province",
    layout: "4LDK / 136m2",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "prop-3",
    type: "Apartment",
    priceLkr: "345,000 LKR",
    priceUsd: "65,000 USD",
    location: "Galle - Southern province",
    layout: "4LDK / 136m2",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80"
  }
];

const INITIAL_AGENTS = [
  {
    id: "ag-001",
    name: "Kasun Fernando",
    role: "Real Estate Agent",
    primaryCity: "Wennappuwa",
    areasCovered: "All Island, Colombo, Wennappuwa",
    languages: "English, Japanese, Sinhalese",
    expertise: ["Houses and Villas", "Luxury Apartments", "Villas"],
    focus: ["Property Buyers side", "Property Sellers side"],
    phone: "+94 77 123 4567",
    email: "kasun@realtor.lk",
    properties: SAMPLE_PROPERTIES
  },
  {
    id: "ag-002",
    name: "Dan Mathota",
    role: "Real Estate Agent",
    primaryCity: "Wennappuwa",
    areasCovered: "All Island, Colombo, Wennappuwa",
    languages: "English, Japanese, Sinhalese",
    expertise: ["Houses and Villas", "Luxury Apartments"],
    focus: ["Property Buyers side", "Property Sellers side"],
    phone: "+94 71 987 6543",
    email: "dan.mathota@realtor.lk",
    properties: SAMPLE_PROPERTIES
  }
];

export default function AgentsPage() {
  const [agents, setAgents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      const res = await fetch('/api/agents', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          setAgents(data);
          return;
        }
      }
      setAgents(INITIAL_AGENTS);
    } catch (err) {
      setAgents(INITIAL_AGENTS);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
    const interval = setInterval(() => {
      fetchAgents();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main translate="yes" className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* PAGE HEADER (Two Colors with Translation Fix) */}
        <div className="text-center space-y-3" translate="yes">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Registered <span className="text-red-600">Agents</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Verified Property Advisors & Specialists in Sri Lanka
          </p>
        </div>

        {/* HERO BANNER IMAGE */}
        <div className="w-full h-64 sm:h-80 bg-slate-200 rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80" 
            alt="Real Estate Network Banner" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* STATUS BAR */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Official Agents Directory</h2>
            <p className="text-xs text-slate-500">Sorted by newest registration</p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-md border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Auto Update Active
          </div>
        </div>

        {/* AGENTS LISTING */}
        {isLoading ? (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200/80 text-slate-500 text-sm">
            Loading agent profiles...
          </div>
        ) : agents.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-white rounded-2xl border border-slate-200/80 shadow-sm">
            No registered agents found at the moment.
          </div>
        ) : (
          <div className="space-y-10">
            {agents.map((agent) => (
              <section 
                key={agent.id}
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/80 space-y-6"
              >
                {/* Agent Header Name */}
                <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                    {agent.name}
                  </h2>
                  <span className="text-xs font-medium text-slate-400">ID: {agent.id}</span>
                </div>

                {/* Agent Info Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-start">
                  
                  {/* Left Column: Photo */}
                  <div className="md:col-span-1">
                    <div className="w-full h-48 bg-slate-100 rounded-xl overflow-hidden border border-slate-200 flex items-center justify-center">
                      {agent.image ? (
                        <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center p-3">
                          <span className="text-3xl block mb-1">👤</span>
                          <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Agent Photo</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column: Information & Details */}
                  <div className="md:col-span-3 space-y-2.5 text-sm text-slate-700">
                    <p className="font-bold text-red-600 uppercase text-xs tracking-wider">
                      {agent.role || "Real Estate Agent"}
                    </p>
                    <p><strong className="text-slate-900">Primary City:</strong> {agent.primaryCity || agent.location || "Wennappuwa"}</p>
                    <p><strong className="text-slate-900">Areas Covered:</strong> {agent.areasCovered || "All Island, Colombo, Wennappuwa"}</p>
                    <p><strong className="text-slate-900">Languages:</strong> {agent.languages || "English, Japanese, Sinhalese"}</p>
                    
                    {/* Expertise List Checkboxes */}
                    <div className="pt-2">
                      <strong className="text-slate-900 block mb-1">Expertise Property Type:</strong>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {Array.isArray(agent.expertise) ? agent.expertise.map((exp, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-md text-slate-800">
                            <span className="text-slate-400">☐</span> {exp}
                          </span>
                        )) : (
                          <span className="inline-flex items-center gap-1.5 bg-slate-100 border border-slate-200/80 px-2.5 py-1 rounded-md text-slate-800">
                            <span className="text-slate-400">☐</span> Houses and Villas
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Buyer / Seller Focus */}
                    <div className="pt-1">
                      <strong className="text-slate-900 block mb-1">Buyer / Seller Focus:</strong>
                      <div className="flex flex-wrap gap-2 text-xs">
                        {Array.isArray(agent.focus) ? agent.focus.map((f, idx) => (
                          <span key={idx} className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-md font-medium">
                            <span>☐</span> {f}
                          </span>
                        )) : (
                          <span className="inline-flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-100 px-2.5 py-1 rounded-md font-medium">
                            <span>☐</span> Property Buyers & Sellers Side
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Contacts */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4 items-center">
                      {agent.phone && (
                        <a 
                          href={`https://wa.me/${agent.phone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1.5 text-emerald-600 hover:underline font-bold"
                        >
                          💬 WhatsApp ({agent.phone})
                        </a>
                      )}
                      {agent.email && (
                        <a 
                          href={`mailto:${agent.email}`} 
                          className="inline-flex items-center gap-1.5 text-slate-700 hover:underline font-medium"
                        >
                          ✉️ {agent.email}
                        </a>
                      )}
                    </div>
                  </div>

                </div>

                {/* LISTED PROPERTIES SECTION */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                  <h3 className="text-xs font-bold tracking-wider text-slate-900 uppercase">
                    LISTED PROPERTIES
                  </h3>

                  <div className="flex items-center gap-2">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                      {(agent.properties || SAMPLE_PROPERTIES).map((prop, idx) => (
                        <div 
                          key={idx} 
                          className="bg-slate-50/80 rounded-xl border border-slate-200/80 overflow-hidden shadow-xs hover:border-slate-300 transition"
                        >
                          <div className="h-28 bg-slate-200 overflow-hidden relative">
                            <img 
                              src={prop.image} 
                              alt={prop.type} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80";
                              }}
                            />
                          </div>
                          <div className="p-3 space-y-1 text-xs">
                            <p className="font-bold text-slate-900">TYPE - {prop.type}</p>
                            <p className="text-slate-700 font-semibold">
                              Price - {prop.priceLkr} ({prop.priceUsd})
                            </p>
                            <p className="text-slate-500 text-[11px]">Location - {prop.location}</p>
                            <p className="text-slate-500 text-[11px]">Layout - {prop.layout}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <a 
                      href={`/agents/${agent.id}`} 
                      className="hidden sm:flex items-center justify-center p-2 text-slate-400 hover:text-red-600 transition"
                      title="View all properties"
                    >
                      <span className="text-2xl font-bold">→</span>
                    </a>
                  </div>
                </div>

              </section>
            ))}
          </div>
        )}

        {/* BECOME A REAL ESTATE AGENT */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-red-600 rounded-full inline-block"></span>
              Become a Real Estate Agent . 3 step easy process
            </h2>
          </div>

          <div className="space-y-4 text-sm text-slate-700">
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
              <p className="font-bold text-slate-900">Step 1: Register Your Interest</p>
              <p className="text-slate-600 text-xs mt-0.5">Fill out our simple registration form with your basic details</p>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
              <p className="font-bold text-slate-900">Step 2: Complete Your Agent Profile</p>
              <p className="text-slate-600 text-xs mt-0.5">Tell us about your expertise and primary areas</p>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/60">
              <p className="font-bold text-slate-900">Step 3: Get Verified, Make contract & Start Listing</p>
            </div>
          </div>

          <div className="pt-2">
            <a 
              href="https://wa.me/94760180036?text=Hello%21%20I%20am%20interested%20in%20becoming%20a%20Real%20Estate%20Agent."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center bg-red-600 hover:bg-red-500 text-white font-bold text-sm px-6 py-3 rounded-lg transition shadow-md"
            >
              Apply as an Agent Now →
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}