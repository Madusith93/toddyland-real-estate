'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, MapPin, Building, ArrowRight } from 'lucide-react';

export default function HeroSection() {
  const router = useRouter();
  const [location, setLocation] = useState('');
  const [propertyType, setPropertyType] = useState('');

  // Search Submit Handler - Redirects to /properties page with search params
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (location) queryParams.set('location', location);
    if (propertyType) queryParams.set('type', propertyType);

    router.push(`/properties?${queryParams.toString()}`);
  };

  return (
    <section className="relative bg-white pt-6 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Upper Grid Section: Search & Left Content + Port City Image on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-12">
        
        {/* Left Side: Title, Search Bar & Subtitle */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Title & Tagline */}
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Toddyland <span className="text-red-600">Real Estate</span>
            </h1>
            <p className="text-base sm:text-lg font-semibold text-slate-600">
              Your space. Your Kingdom. Your freedom
            </p>
          </div>

          {/* Search Bar */}
          <form 
            onSubmit={handleSearch}
            className="bg-white border-2 border-slate-200 shadow-lg rounded-2xl p-3 transition-all hover:border-red-500"
          >
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              
              {/* Location Selection */}
              <div className="sm:col-span-5 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <MapPin className="w-4 h-4 text-red-600 shrink-0" />
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Location
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    <option value="colombo">Colombo & Suburbs</option>
                    <option value="galle">Galle / Southern Coast</option>
                    <option value="kandy">Kandy & Hill Country</option>
                    <option value="port-city">Port City Colombo</option>
                    <option value="mirissa">Mirissa / Coastal</option>
                  </select>
                </div>
              </div>

              {/* Type Selection (Buy, Rent, Land only) */}
              <div className="sm:col-span-4 flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-xl border border-slate-100">
                <Building className="w-4 h-4 text-red-600 shrink-0" />
                <div className="w-full">
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    Type
                  </label>
                  <select
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold text-slate-800 focus:outline-none cursor-pointer"
                  >
                    <option value="">All Types</option>
                    <option value="buy">Buy</option>
                    <option value="rent">Rent</option>
                    <option value="land">Land</option>
                  </select>
                </div>
              </div>

              {/* Search Button */}
              <div className="sm:col-span-3">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-red-500/20"
                >
                  <Search className="w-4 h-4" />
                  <span>Search</span>
                </button>
              </div>

            </div>
          </form>

          {/* Subtitle / Description */}
          <p className="text-xs sm:text-sm font-medium text-slate-500 leading-relaxed max-w-xl">
            Sri Lanka’s Finest Properties – Every property curated for you with a purpose. 
            Local knowledge - Global standard.
          </p>
        </div>

        {/* Right Side: Port City Local Image Card (from public folder) */}
        <div className="lg:col-span-5">
          <div className="group relative h-72 sm:h-80 w-full rounded-3xl overflow-hidden shadow-xl border border-slate-100">
            <Image
              src="./portcity.webp"
              alt="Port City Colombo Sri Lanka"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
              <span className="text-[10px] font-bold bg-red-600 text-white px-3 py-1 rounded-full w-max mb-2">
                Mega Project
              </span>
              <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors">
                Port City Colombo
              </h3>
              <p className="text-xs text-slate-200 mt-1 flex items-center gap-1 font-medium">
                Explore investment opportunities <ArrowRight className="w-3.5 h-3.5" />
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Real Estate in Sri Lanka Featured Showcase Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: Luxury Sri Lankan Villas */}
        <div className="group relative h-64 rounded-3xl overflow-hidden shadow-md border border-slate-100">
          <Image
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80"
            alt="Luxury Sri Lanka Villa"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
            <span className="text-[10px] font-bold bg-slate-900 text-white px-3 py-1 rounded-full w-max mb-2">
              For Sale
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
              Villas & Luxury Homes
            </h3>
            <p className="text-xs text-slate-200 mt-1 flex items-center gap-1 font-medium">
              View available listings <ArrowRight className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>

        {/* Card 2: Sri Lankan Prime Land Plots */}
        <div className="group relative h-64 rounded-3xl overflow-hidden shadow-md border border-slate-100">
          <Image
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80"
            alt="Sri Lanka Beachfront & Hill Country Lands"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
            <span className="text-[10px] font-bold bg-slate-900 text-white px-3 py-1 rounded-full w-max mb-2">
              Land Lots
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
              Beachfront & Prime Lands
            </h3>
            <p className="text-xs text-slate-200 mt-1 flex items-center gap-1 font-medium">
              Find ideal land plots <ArrowRight className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>

        {/* Card 3: Tropical Eco & Off-Grid Living Sri Lanka */}
        <div className="group relative h-64 rounded-3xl overflow-hidden shadow-md border border-slate-100">
          <Image
            src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
            alt="Eco Off-Grid Living Sri Lanka"
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-5 flex flex-col justify-end">
            <span className="text-[10px] font-bold bg-emerald-600 text-white px-3 py-1 rounded-full w-max mb-2">
              Eco & Nature
            </span>
            <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors">
              Off-Grid Living Spaces
            </h3>
            <p className="text-xs text-slate-200 mt-1 flex items-center gap-1 font-medium">
              Explore eco sanctuaries <ArrowRight className="w-3.5 h-3.5" />
            </p>
          </div>
        </div>

      </div>

    </section>
  );
}