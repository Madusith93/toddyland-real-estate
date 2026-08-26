'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, MessageSquare, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <h3 className="text-xl font-black text-white tracking-tight">
              Toddyland <span className="text-red-600">Real Estate</span>
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Your trusted partner for curated, high-value, and legal real estate investments across Sri Lanka.
            </p>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-red-500 shrink-0" />
                <a 
                  href="mailto:info@toddylandrealestate.com" 
                  className="hover:underline"
                >
                  info@toddylandrealestate.com
                </a>
              </li>
              <li className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                <a 
                  href="https://wa.me/94760180036" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  WhatsApp / LINE: +94 76 018 0036
                </a>
              </li>
            </ul>
          </div>

          {/* Free Consultation Callout */}
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/60 space-y-2">
            <div className="flex items-center space-x-2 text-red-500 font-bold text-xs">
              <Globe className="w-4 h-4" />
              <span>Free Consultation</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Let's talk about your property goals in Sri Lanka. Contact us for direct assistance in English or Japanese.
            </p>
          </div>

        </div>

        {/* Bottom Section (Copyright & Incarnet Credits) */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4 text-center sm:text-left">
          
          <p>
            © {new Date().getFullYear()} Toddyland Real Estate. All rights reserved.
          </p>

          {/* Designed by Incarnet Link */}
          <p className="flex items-center gap-1">
            <span>Designed & Developed by</span>
            <a 
              href="https://incarnate.lk/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-bold text-white hover:text-red-500 transition-colors underline decoration-red-600/50 underline-offset-4"
            >
              Incarnet
            </a>
          </p>

        </div>

      </div>
    </footer>
  );
}