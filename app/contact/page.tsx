'use client';

import React from 'react';

export default function AboutContactPage() {
  const whatsappNumber = "94760180036";
  const emailAddress = "info@toddylandrealestate.com"; // ඔයාගේ Email එක මෙතැනට දාන්න

  return (
    <main translate="yes" className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* PAGE HEADER */}
        <div className="text-center space-y-3" translate="yes">
          <div className="w-16 h-1 bg-red-600 mx-auto rounded-full mb-2"></div>
          <p className="text-xs font-bold tracking-widest text-red-600 uppercase">Contact & Info</p>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About – <span className="text-red-600">& Contact Us</span>
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-medium">
            Toddyland Real Estate — Connecting Global Buyers to Sri Lanka
          </p>
        </div>

        {/* HERO / TOP BANNER IMAGE PLACEHOLDER (Figma Layout Reference) */}
        <div className="w-full h-64 sm:h-80 bg-slate-200 rounded-2xl overflow-hidden shadow-sm border border-slate-200 relative">
          <img 
            src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80" 
            alt="Toddyland Real Estate Office & Global Network" 
            className="w-full h-full object-cover"
          />
        </div>

        {/* SECTION 1: ABOUT US & THE CHALLENGE */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8">
          
          {/* About Us */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-red-600 rounded-full inline-block"></span>
              About Us
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Toddyland Real Estate is a Sri Lanka-based real estate agency headquartered in Negombo, with global representatives in Tokyo (Japan), the UK, and Arizona (USA).
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              We serve both Sri Lankan residents and foreign investors looking to enter Sri Lanka's growing real estate market.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* The Challenge We Address */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-red-600 rounded-full inline-block"></span>
              The Challenge We Address
            </h2>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              Sri Lanka's real estate market is unsaturated and rapidly growing, but there is a lack of verified property information available to global buyers. No proper channel exists for sharing reliable property data with international investors — until now.
            </p>
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
              With Sri Lanka's tourism and real estate sectors booming exponentially, we stepped in to bridge the gap.
            </p>
          </div>

          <hr className="border-slate-100" />

          {/* Why Toddyland Real Estate */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-6 bg-red-600 rounded-full inline-block"></span>
              Why Toddyland Real estate
            </h2>
            <ul className="space-y-3 pl-2">
              <li className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>Best Value Properties</strong> – Carefully selected properties in all Island</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>Global Sales Agents</strong> – Based in Tokyo, UK, and USA, offering comprehensive guidance on the Sri Lankan property market</span>
              </li>
              <li className="flex items-start gap-3 text-sm sm:text-base text-slate-700">
                <span className="text-red-600 font-bold">•</span>
                <span><strong>Curated Selection</strong> – We don't sell everything. We post only a handful of carefully selected properties that offer the best investment value for our clients</span>
              </li>
            </ul>
          </div>

          <hr className="border-slate-100" />

          {/* Contact Us Interactive Box */}
          <div className="bg-slate-900 text-white rounded-xl p-6 sm:p-8 space-y-4">
            <h2 className="text-2xl font-bold text-white">Contact Us</h2>
            <p className="text-slate-300 text-sm sm:text-base">
              For more insights and personalized service, contact us freely. We'll make sure you receive the best service from us.
            </p>

            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-lg">📧</span>
                <span className="font-semibold text-sm sm:text-base">Email:</span>
                <a 
                  href={`mailto:${emailAddress}`} 
                  className="text-red-400 hover:underline hover:text-red-300 transition text-sm sm:text-base"
                >
                  {emailAddress}
                </a>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg">📞</span>
                <span className="font-semibold text-sm sm:text-base">WhatsApp / LINE:</span>
                <a 
                  href={`https://wa.me/${whatsappNumber}`} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-emerald-400 hover:underline hover:text-emerald-300 font-medium transition text-sm sm:text-base"
                >
                  +94 76 018 0036
                </a>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-lg">🌐</span>
                <span className="text-slate-200 text-sm sm:text-base">
                  Free consultation – let's talk about your property goals in Sri Lanka.
                </span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap gap-4">
              <a
                href={`https://wa.me/${whatsappNumber}?text=Hello%21%20I%20would%20like%20to%20get%20more%20information%20about%20your%20properties.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg font-bold text-sm transition shadow-md"
              >
                Chat on WhatsApp
              </a>
              <a
                href={`mailto:${emailAddress}`}
                className="inline-flex items-center justify-center bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-bold text-sm transition shadow-md"
              >
                Send an Email
              </a>
            </div>
          </div>

        </section>

        {/* SECTION 2: CAREERS (HIGHLY HIGHLIGHTED) */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-8">
          <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-red-600 bg-red-50 px-2.5 py-1 rounded-full border border-red-100">
                Opportunities
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 mt-2">Careers</h2>
            </div>
          </div>

          <div className="space-y-6">
            
            {/* ITEM 1: Real Estate Agent */}
            <div className="p-6 bg-slate-50/80 rounded-2xl border-l-4 border-l-red-600 border border-slate-200/80 space-y-3 shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-red-600">💼</span> Join Us as a Real Estate Agent
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We are looking for passionate, driven individuals across Sri Lanka who want to serve Sri Lankan and International clients. You will be able to maintain your own profile on our website, make global connections.
              </p>
              <ul className="space-y-2 pl-2 text-sm sm:text-base text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Attractive sales-based compensation</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Work remotely – manage your own schedule</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Serve local and international clients with pride</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Become part of a growing, trusted brand</span>
                </li>
              </ul>
              <div className="pt-2 border-t border-slate-200/60 mt-3">
                <p className="text-sm text-slate-800 bg-red-50/60 p-2.5 rounded-lg border border-red-100/80">
                  <strong className="text-red-700">For the inexperienced</strong> – No experience needed. We provide full training and guidance to help you succeed.
                </p>
              </div>
            </div>

            {/* ITEM 2: Overseas Sales Representative */}
            <div className="p-6 bg-slate-50/80 rounded-2xl border-l-4 border-l-red-600 border border-slate-200/80 space-y-3 shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-red-600">🌍</span> Join as an Overseas Sales Representative
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Since we grow fast, we are looking for sales representatives globally — especially in:
              </p>
              <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm font-semibold text-slate-800 bg-white p-3 rounded-xl border border-slate-200">
                <li className="flex items-center gap-2"><span className="text-red-600">📍</span> Australia</li>
                <li className="flex items-center gap-2"><span className="text-red-600">📍</span> UK</li>
                <li className="flex items-center gap-2"><span className="text-red-600">📍</span> US</li>
                <li className="flex items-center gap-2"><span className="text-red-600">📍</span> Japan</li>
              </ul>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed pt-1">
                Help us connect international buyers with Sri Lanka's best properties. Your work will be Real Estate promotions through Social media and other means within your network. Work remotely, earn competitive commissions, and be part of our global expansion.
              </p>
            </div>

            {/* ITEM 3: Property Owners */}
            <div className="p-6 bg-slate-50/80 rounded-2xl border-l-4 border-l-red-600 border border-slate-200/80 space-y-3 shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-red-600">🏡</span> Property Owners of Digital Nomad Workspaces
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                If you own a property with proper infrastructure (high-speed WiFi, workspaces, modern amenities), we want to hear from you. List your property with us and tap into the growing digital nomad market.
              </p>
            </div>

            {/* ITEM 4: Operation Managers */}
            <div className="p-6 bg-slate-50/80 rounded-2xl border-l-4 border-l-red-600 border border-slate-200/80 space-y-3 shadow-xs">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-red-600">⚙️</span> Operation Managers
              </h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                We are looking for experienced operation managers to join our team in Sri Lanka. If you have experience in real estate operations, client management, or team coordination, we'd love to talk.
              </p>
            </div>

          </div>
        </section>

        {/* SECTION 3: PARTNERSHIPS */}
        <section className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-slate-200/80 space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-3xl font-extrabold text-slate-900">Partnerships</h2>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-slate-900">Business Opportunities</h3>
            <p className="text-slate-600 text-sm sm:text-base">
              We are open to partnerships with:
            </p>
            <ul className="space-y-2 pl-2 text-sm sm:text-base text-slate-700">
              <li className="flex items-center gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Property developers</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Legal services</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Tax accounting firms</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-red-600 font-bold">•</span>
                <span>Other real estate related services</span>
              </li>
            </ul>
            <p className="text-slate-800 font-semibold pt-2 text-sm sm:text-base">
              Let's collaborate and grow together.
            </p>
            <div className="pt-2">
              <a 
                href={`mailto:${emailAddress}?subject=Partnership%20Opportunity`}
                className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-bold text-sm sm:text-base underline"
              >
                📧 Contact Us for Partnerships →
              </a>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}