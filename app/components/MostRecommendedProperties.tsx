'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Heart, MapPin, Bed, Bath, Maximize2 } from 'lucide-react';

type TabType = 'BUY' | 'RENT' | 'LAND';

interface Property {
  id: string;
  title: string;
  price: string;
  location: string;
  category: TabType;
  type: string;
  image: string;
  beds?: number;
  baths?: number;
  size: string; // e.g. "2,200 sqft" or "136 Perch"
  badgeText?: string;
}

const propertiesData: Property[] = [
  // --- BUY PROPERTIES (6 Items) ---
  {
    id: 'b1',
    title: 'Modern Oceanview Villa in Galle',
    price: 'Rs. 135,000,000',
    location: 'Galle, Southern Province',
    category: 'BUY',
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
    beds: 4,
    baths: 4,
    size: '3,800 sqft',
    badgeText: 'Buy',
  },
  {
    id: 'b2',
    title: 'Luxury High-Rise Apartment in Colombo 03',
    price: 'Rs. 85,000,000',
    location: 'Kollupitiya, Colombo',
    category: 'BUY',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80',
    beds: 3,
    baths: 2,
    size: '1,650 sqft',
    badgeText: 'Buy',
  },
  {
    id: 'b3',
    title: 'Colonial Style Heritage Home',
    price: 'Rs. 96,000,000',
    location: 'Hanthana Road, Kandy',
    category: 'BUY',
    type: 'Bungalow',
    image: 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80',
    beds: 5,
    baths: 4,
    size: '4,200 sqft',
    badgeText: 'Buy',
  },
  {
    id: 'b4',
    title: 'Scenic Mountain Retreat House',
    price: 'Rs. 58,000,000',
    location: 'Nuwara Eliya, Central Province',
    category: 'BUY',
    type: 'House',
    image: 'https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=800&q=80',
    beds: 3,
    baths: 2,
    size: '2,100 sqft',
    badgeText: 'Buy',
  },
  {
    id: 'b5',
    title: 'Contemporary Townhouse near Beach',
    price: 'Rs. 78,000,000',
    location: 'Negombo, Western Province',
    category: 'BUY',
    type: 'Townhouse',
    image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80',
    beds: 3,
    baths: 3,
    size: '2,400 sqft',
    badgeText: 'Buy',
  },
  {
    id: 'b6',
    title: 'Private Pool Villa in Mirissa',
    price: 'Rs. 155,000,000',
    location: 'Mirissa, Southern Province',
    category: 'BUY',
    type: 'Villa',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    beds: 4,
    baths: 5,
    size: '4,500 sqft',
    badgeText: 'Buy',
  },

  // --- RENT PROPERTIES (6 Items) ---
  {
    id: 'r1',
    title: 'Fully Furnished Digital Nomad Suite',
    price: 'Rs. 350,000 / mo',
    location: 'Ahangama, Southern Province',
    category: 'RENT',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    beds: 2,
    baths: 1,
    size: '950 sqft',
    badgeText: 'Rent',
  },
  {
    id: 'r2',
    title: 'Seaside Modern Apartment',
    price: 'Rs. 520,000 / mo',
    location: 'Mount Lavinia, Western Province',
    category: 'RENT',
    type: 'Apartment',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
    beds: 3,
    baths: 2,
    size: '1,400 sqft',
    badgeText: 'Rent',
  },
  {
    id: 'r3',
    title: 'Peaceful Hill Country Cottage',
    price: 'Rs. 250,000 / mo',
    location: 'Ella, Uva Province',
    category: 'RENT',
    type: 'Cottage',
    image: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
    beds: 2,
    baths: 2,
    size: '1,200 sqft',
    badgeText: 'Rent',
  },
  {
    id: 'r4',
    title: 'Luxury Penthouse Suite with Ocean View',
    price: 'Rs. 1,000,000 / mo',
    location: 'Colombo 04, Western Province',
    category: 'RENT',
    type: 'Penthouse',
    image: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=800&q=80',
    beds: 4,
    baths: 4,
    size: '3,200 sqft',
    badgeText: 'Rent',
  },
  {
    id: 'r5',
    title: 'Cozy Surf Bungalow Near Beach',
    price: 'Rs. 280,000 / mo',
    location: 'Hikkaduwa, Southern Province',
    category: 'RENT',
    type: 'Bungalow',
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80',
    beds: 2,
    baths: 2,
    size: '1,100 sqft',
    badgeText: 'Rent',
  },
  {
    id: 'r6',
    title: 'Spacious Family Home with Garden',
    price: 'Rs. 450,000 / mo',
    location: 'Rajagiriya, Colombo',
    category: 'RENT',
    type: 'House',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80',
    beds: 4,
    baths: 3,
    size: '2,800 sqft',
    badgeText: 'Rent',
  },

  // --- LAND PROPERTIES (6 Items) ---
  {
    id: 'l1',
    title: 'Farmland in Kandy',
    price: 'Rs. 66,000,000',
    location: 'Hanthana Road, Peradeniya',
    category: 'LAND',
    type: 'Agricultural',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
    beds: 1,
    baths: 2,
    size: '136 Perch',
    badgeText: 'Land',
  },
  {
    id: 'l2',
    title: 'Prime Beachfront Land in Weligama',
    price: 'Rs. 65,000,000',
    location: 'Weligama, Southern Province',
    category: 'LAND',
    type: 'Beach Land',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    size: '40 Perch',
    badgeText: 'Land',
  },
  {
    id: 'l3',
    title: 'Scenic Tea Estate Land',
    price: 'Rs. 54,000,000',
    location: 'Kotagala, Nuwara Eliya',
    category: 'LAND',
    type: 'Estate Land',
    image: 'https://images.unsplash.com/photo-1541432901042-2d8bd64b4a9b?auto=format&fit=crop&w=800&q=80',
    size: '400 Perch',
    badgeText: 'Land',
  },
  {
    id: 'l4',
    title: 'Lakefront Commercial Plot',
    price: 'Rs. 93,000,000',
    location: 'Bolgoda, Western Province',
    category: 'LAND',
    type: 'Commercial Land',
    image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
    size: '60 Perch',
    badgeText: 'Land',
  },
  {
    id: 'l5',
    title: 'Residential Plot in Gampaha City',
    price: 'Rs. 19,500,000',
    location: 'Gampaha, Western Province',
    category: 'LAND',
    type: 'Residential Land',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
    size: '15 Perch',
    badgeText: 'Land',
  },
  {
    id: 'l6',
    title: 'Hillside Eco Development Land',
    price: 'Rs. 42,000,000',
    location: 'Ella, Uva Province',
    category: 'LAND',
    type: 'Eco Land',
    image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80',
    size: '90 Perch',
    badgeText: 'Land',
  },
];

export default function MostRecommendedProperties() {
  const [activeTab, setActiveTab] = useState<TabType>('BUY');

  const filteredProperties = propertiesData.filter(
    (item) => item.category === activeTab
  );

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Filter Tabs (Centered Layout) */}
        <div className="flex flex-col items-center text-center mb-10 gap-5">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Most Recommended <span className="text-red-600">Properties</span>
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Explore handpicked top-rated real estate options across Sri Lanka
            </p>
          </div>

          {/* Category Tabs: BUY | RENT | LAND */}
          <div className="inline-flex p-1.5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            {(['BUY', 'RENT', 'LAND'] as TabType[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 tracking-wider ${
                  activeTab === tab
                    ? 'bg-red-600 text-white shadow-md scale-[1.02]'
                    : 'text-slate-600 hover:text-red-600 hover:bg-slate-50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Property Cards Grid (6 per Tab) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <div
              key={property.id}
              className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Property Image & Badges */}
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={property.image}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  {/* Category Badge (Top Left) */}
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-semibold tracking-wide">
                    {property.badgeText} • {property.type}
                  </div>

                  {/* Favorite Button (Top Right) */}
                  <button 
                    aria-label="Add to Wishlist"
                    className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-md hover:bg-white rounded-full flex items-center justify-center text-slate-700 hover:text-red-600 transition-colors shadow-sm"
                  >
                    <Heart className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Order matching Client Sketch */}
                <div className="p-5">
                  {/* 1. Property Name */}
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
                    {property.title}
                  </h3>

                  {/* 2. Price (LKR) */}
                  <div className="text-xl font-black text-red-600 mt-1">
                    {property.price}
                  </div>

                  {/* 3. Address / Location */}
                  <div className="flex items-center gap-1.5 text-slate-500 text-xs mt-2 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-red-600 shrink-0" />
                    <span className="truncate">{property.location}</span>
                  </div>

                  {/* 4. Features / Details Badges */}
                  <div className="flex items-center gap-4 mt-5 pt-4 border-t border-slate-100 text-slate-600 text-xs font-semibold">
                    {property.beds !== undefined && (
                      <div className="flex items-center gap-1">
                        <Bed className="w-4 h-4 text-slate-400" />
                        <span>{property.beds}</span>
                      </div>
                    )}
                    {property.baths !== undefined && (
                      <div className="flex items-center gap-1">
                        <Bath className="w-4 h-4 text-slate-400" />
                        <span>{property.baths}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Maximize2 className="w-4 h-4 text-slate-400" />
                      <span>{property.size}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 5. View Details Action Button */}
              <div className="px-5 pb-5 pt-2">
                <Link
                  href={`/properties/${property.id}`}
                  className="w-full inline-flex items-center justify-center bg-slate-100 hover:bg-red-600 text-slate-800 hover:text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-all duration-300 tracking-wide uppercase"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Button (See All Properties) */}
        <div className="text-center mt-12">
          <Link
            href="/properties"
            className="inline-flex items-center justify-center bg-slate-900 hover:bg-red-600 text-white px-8 py-3.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-md hover:shadow-xl hover:scale-105"
          >
            See All Properties
          </Link>
        </div>

      </div>
    </section>
  );
}