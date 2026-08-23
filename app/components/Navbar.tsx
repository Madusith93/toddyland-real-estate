'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, Globe, Menu, X, Trees, Ship } from 'lucide-react';
import PreferencesModal from './PreferencesModal';

export default function Navbar() {
  const [isPropOpen, setIsPropOpen] = useState(false);
  const [isProjectsOpen, setIsProjectsOpen] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  
  // State for Preferences Modal & Preferences Display
  const [isPrefModalOpen, setIsPrefModalOpen] = useState(false);
  const [prefDisplay, setPrefDisplay] = useState('EN / USD');

  // Sync Preferences state with LocalStorage
  const updatePrefDisplay = () => {
    if (typeof window !== 'undefined') {
      const lang = localStorage.getItem('global_language') || 'EN';
      const curr = localStorage.getItem('global_currency') || 'USD';
      setPrefDisplay(`${lang} / ${curr}`);
    }
  };

  useEffect(() => {
    updatePrefDisplay();
    window.addEventListener('preferencesChanged', updatePrefDisplay);
    return () => {
      window.removeEventListener('preferencesChanged', updatePrefDisplay);
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* 1. Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <span className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Toddyland <span className="text-red-600">Real Estate</span>
            </span>
          </Link>

          {/* 2. Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 lg:gap-2">
            
            {/* PROPERTIES Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsPropOpen(true)}
              onMouseLeave={() => setIsPropOpen(false)}
            >
              <Link 
                href="/properties"
                className="px-3 py-2 rounded-lg text-xs font-black text-slate-800 hover:text-red-600 hover:bg-red-50 flex items-center gap-1 transition-all uppercase tracking-wider"
              >
                PROPERTIES
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isPropOpen ? 'rotate-180 text-red-600' : ''}`} />
              </Link>

              {isPropOpen && (
                <div className="absolute top-full left-0 w-48 bg-white border border-slate-200 rounded-xl shadow-xl p-2 space-y-1 animate-in fade-in duration-150">
                  <Link
                    href="/properties?type=buy"
                    className="block px-4 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-red-500 hover:text-white transition-all uppercase"
                  >
                    BUY
                  </Link>
                  <Link
                    href="/properties?type=rent"
                    className="block px-4 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-red-500 hover:text-white transition-all uppercase"
                  >
                    RENT
                  </Link>
                  <Link
                    href="/properties?type=land"
                    className="block px-4 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-red-500 hover:text-white transition-all uppercase"
                  >
                    LAND
                  </Link>
                </div>
              )}
            </div>

            <Link 
              href="/services" 
              className="px-3 py-2 rounded-lg text-xs font-black text-slate-800 hover:text-red-600 hover:bg-red-50 transition-all uppercase tracking-wider"
            >
              SERVICES
            </Link>

            {/* PROJECTS Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsProjectsOpen(true)}
              onMouseLeave={() => setIsProjectsOpen(false)}
            >
              <button 
                className="px-3 py-2 rounded-lg text-xs font-black text-slate-800 hover:text-red-600 hover:bg-red-50 flex items-center gap-1 transition-all uppercase tracking-wider"
              >
                PROJECTS
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isProjectsOpen ? 'rotate-180 text-red-600' : ''}`} />
              </button>

              {isProjectsOpen && (
                <div className="absolute top-full left-0 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 space-y-1 animate-in fade-in duration-150">
                  <Link
                    href="/projects/port-city"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-red-50 hover:text-red-600 transition-all uppercase"
                  >
                    <Ship className="w-4 h-4 text-red-600 shrink-0" />
                    <span>1. Port City & Mega Real Estate</span>
                  </Link>
                  <Link
                    href="/projects/off-grid"
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-bold text-slate-800 hover:bg-red-50 hover:text-red-600 transition-all uppercase"
                  >
                    <Trees className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>2. Off Grid Living</span>
                  </Link>
                </div>
              )}
            </div>

            <Link 
              href="/contact" 
              className="px-3 py-2 rounded-lg text-xs font-black text-slate-800 hover:text-red-600 hover:bg-red-50 transition-all uppercase tracking-wider"
            >
              CONTACT US
            </Link>

            <Link 
              href="/agents" 
              className="px-3 py-2 rounded-lg text-xs font-black text-slate-800 hover:text-red-600 hover:bg-red-50 transition-all uppercase tracking-wider"
            >
              AGENTS
            </Link>

          </nav>

          {/* 3. Right Action Items */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            
            <Link
              href="/list-property"
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-red-500/25"
            >
              LIST YOUR PROPERTY
            </Link>

            {/* Currency / Language Selector Button */}
            <button 
              onClick={() => setIsPrefModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold hover:bg-slate-100 transition-colors"
            >
              <Globe className="w-4 h-4 text-slate-500" />
              <span>{prefDisplay}</span>
            </button>
          </div>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="xl:hidden p-2 rounded-xl text-slate-800 hover:bg-slate-100"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

        </div>

        {/* Mobile Menu */}
        {mobileMenu && (
          <div className="xl:hidden bg-white border-b border-slate-200 px-6 py-5 space-y-4">
            <Link href="/properties" className="block text-xs font-black text-slate-800 py-1 uppercase">PROPERTIES</Link>
            <Link href="/services" className="block text-xs font-black text-slate-800 py-1 uppercase">SERVICES</Link>
            <Link href="/projects/port-city" className="block text-xs font-black text-slate-800 py-1 uppercase">PROJECTS</Link>
            <Link href="/contact" className="block text-xs font-black text-slate-800 py-1 uppercase">CONTACT US</Link>
            <Link href="/agents" className="block text-xs font-black text-slate-800 py-1 uppercase">AGENTS</Link>
            
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <button 
                onClick={() => {
                  setMobileMenu(false);
                  setIsPrefModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-full border border-slate-200 bg-slate-50 text-slate-800 text-xs font-bold"
              >
                <Globe className="w-4 h-4 text-slate-500" />
                <span>Preferences ({prefDisplay})</span>
              </button>

              <Link 
                href="/list-property" 
                className="block w-full text-center py-3 bg-red-600 text-white rounded-full font-black text-xs uppercase"
              >
                LIST YOUR PROPERTY
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Preferences Modal Instance */}
      <PreferencesModal 
        isOpen={isPrefModalOpen} 
        onClose={() => setIsPrefModalOpen(false)} 
      />
    </>
  );
}