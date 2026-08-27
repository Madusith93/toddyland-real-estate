'use client';

import React from 'react';

// ==========================================
// PUBLIC FOLDER IMAGE PATHS
// Place your images in public/images/ folder
// ==========================================
const IMAGE_PATHS = {
  hero: "/images/off-grid-hero.jpg",
  includes: "/images/off-grid-includes.jpg",
  modelA: "/images/off-grid-model-a.jpg",
  modelB: "/images/off-grid-model-b.jpg",
  modelC: "/images/off-grid-model-c.jpg",
  modelD: "/images/off-grid-model-d.jpg",
  whatWeDo: "/images/off-grid-what-we-do.jpg",
  dataDriven: "/images/off-grid-data-driven.jpg",
  community: "/images/off-grid-community.jpg",
  process1: "/images/off-grid-process-1.jpg",
  process2: "/images/off-grid-process-2.jpg",
  process3: "/images/off-grid-process-3.jpg",
  retire: "/images/off-grid-retire.jpg"
};

export default function OffGridLivingPage() {
  const whatsappNumber = "94760180036";
  const emailAddress = "contact@toddylandrealestate.com";

  return (
    <main className="min-h-screen bg-white text-slate-800 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-16">
        
        {/* HEADER SECTION - Port City Style with Red Accent Border & Larger Typography */}
       {/* HEADER SECTION - Centered with Red Accent Border & Larger Typography */}
<div className="flex flex-col items-center text-center space-y-3 py-4">
  <div className="border-l-4 border-red-600 pl-4 inline-block text-left sm:text-center sm:border-l-0 sm:border-b-4 sm:pb-2 sm:pl-0">
    <p className="text-sm font-semibold tracking-widest text-red-600 uppercase">
      Project - Off Grid Living
    </p>
  </div>
  
  <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
    Off-Grid <span className="text-red-600">Living In Sri Lanka</span>
  </h1>
  
  <p className="text-base sm:text-lg font-bold text-slate-800 max-w-2xl">
    Escape the Matrix. Build Your Kingdom. Raise the Next Generation.
  </p>
</div>

        {/* 1. MAIN HERO IMAGE */}
        <div className="w-full h-72 sm:h-96 bg-slate-200 rounded-lg overflow-hidden relative">
          <img 
            src={IMAGE_PATHS.hero} 
            alt="Off-Grid Living Main Hero" 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1200&q=80";
            }}
          />
        </div>

        {/* OVERVIEW TEXT */}
        <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-3xl">
          <p>
            This is for the people who need to avoid the matrix — the outside-the-box thinkers, the ones who appreciate self-sufficient life, living in community, living in nature, raising kids in a natural environment. This is for those who crave real human connection, traditional ways of life, and the freedom to live like their own kingdom. Above all, this is for those who want to create a good environment for their children and the next generation — a world where kids grow up with dirt under their nails, stars above their heads, and nature as their classroom.
          </p>
          <p>
            Going off-grid doesn't mean disconnecting from the world. It means stepping away from the noise and regaining control over your life, making your own kingdom, rather than living in someone else's place — while still enjoying the comforts of community, education, healthcare, and urban convenience just a short distance away.
          </p>
        </div>

        {/* 2. WHAT AN OFF-GRID SYSTEM INCLUDES */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-4">
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-xl font-bold text-slate-900">What an Off-Grid System Includes</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              A true off-grid system is not just a house — it is a complete, self-sustaining ecosystem that supports your family, your community, and your freedom. It starts with a house designed for autonomy, offering space to breathe, room to grow, and the privacy and peace that modern life rarely provides.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Surrounding the house, you have a garden for flowers, herbs, and beauty right outside your door, alongside a vegetable farm where you can grow your own food and know exactly what your family eats. Sustainable energy systems — such as solar panels with battery storage and firewood — power your life your way. Water independence comes from wells, rainwater harvesting, and filtration systems. Waste is managed through composting and recycling, ensuring nothing goes to waste. And perhaps most importantly, an off-grid life includes community connection — neighbors who know your name, children who play outside, and a shared sense of purpose and belonging.
            </p>
            <p className="text-sm font-semibold text-slate-800 pt-2">What an off-grid system mostly includes:</p>
            <ul className="space-y-1.5 text-sm text-slate-600 list-disc list-inside">
              <li>House designed for autonomy, with space and privacy</li>
              <li>Garden for flowers, herbs, and beauty</li>
              <li>A bath, a pool or nearby river/lake access</li>
              <li>Vegetable farm for growing your own food</li>
              <li>Sustainable energy systems (solar panels, battery storage, firewood)</li>
              <li>Water independence (wells, rainwater harvesting, filtration)</li>
              <li>Waste management (composting, recycling)</li>
              <li>Community connection and belonging</li>
              <li>Option for a small gym, yoga studio, or community kitchen — a place to gather and stay healthy, where your friends gather each evening</li>
            </ul>
          </div>
          <div className="h-64 md:h-80 bg-slate-200 rounded-lg overflow-hidden border border-slate-100">
            <img 
              src={IMAGE_PATHS.includes} 
              alt="Off-Grid System" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80";
              }}
            />
          </div>
        </section>

        {/* 3. OFF-GRID MODELS (2x2 GRID) */}
        <section className="space-y-6 pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* MODEL A */}
            <div className="space-y-3">
              <div className="h-48 bg-slate-200 rounded-lg overflow-hidden">
                <img 
                  src={IMAGE_PATHS.modelA} 
                  alt="Model A" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">TYPE - OFF GRID MODEL A</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                <li><strong>Phase 1 - Land and house Price:</strong> 340,000,000 LKR ($1,150,000 USD)</li>
                <li><strong>Phase 2 - Greenhouse and Well:</strong> 19,000,000 LKR ($65,000 USD)</li>
                <li><strong>Phase 3 - Farm and Community Wellness Hub:</strong> 30,000,000 LKR ($100,000 USD)</li>
              </ul>
            </div>

            {/* MODEL B */}
            <div className="space-y-3">
              <div className="h-48 bg-slate-200 rounded-lg overflow-hidden">
                <img 
                  src={IMAGE_PATHS.modelB} 
                  alt="Model B" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1449844908441-8829872d2607?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">TYPE - OFF GRID MODEL B</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                <li><strong>Phase 1 - Land and house Price:</strong> 340,000,000 LKR ($1,150,000 USD)</li>
                <li><strong>Phase 2 - Greenhouse and Well:</strong> 19,000,000 LKR ($65,000 USD)</li>
                <li><strong>Phase 3 - Farm and Community Wellness Hub:</strong> 30,000,000 LKR ($100,000 USD)</li>
              </ul>
            </div>

            {/* MODEL C */}
            <div className="space-y-3">
              <div className="h-48 bg-slate-200 rounded-lg overflow-hidden">
                <img 
                  src={IMAGE_PATHS.modelC} 
                  alt="Model C" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">TYPE - OFF GRID MODEL C</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                <li><strong>Phase 1 - Land and house Price:</strong> 340,000,000 LKR ($1,150,000 USD)</li>
                <li><strong>Phase 2 - Greenhouse and Well:</strong> 19,000,000 LKR ($65,000 USD)</li>
                <li><strong>Phase 3 - Farm and Community Wellness Hub:</strong> 30,000,000 LKR ($100,000 USD)</li>
              </ul>
            </div>

            {/* MODEL D */}
            <div className="space-y-3">
              <div className="h-48 bg-slate-200 rounded-lg overflow-hidden">
                <img 
                  src={IMAGE_PATHS.modelD} 
                  alt="Model D" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80";
                  }}
                />
              </div>
              <h3 className="text-sm font-bold text-slate-900 uppercase">TYPE - OFF GRID MODEL D</h3>
              <ul className="space-y-1 text-sm text-slate-600">
                <li><strong>Phase 1 - Land and house Price:</strong> 340,000,000 LKR ($1,150,000 USD)</li>
                <li><strong>Phase 2 - Greenhouse and Well:</strong> 19,000,000 LKR ($65,000 USD)</li>
                <li><strong>Phase 3 - Farm and Community Wellness Hub:</strong> 30,000,000 LKR ($100,000 USD)</li>
              </ul>
            </div>

          </div>
        </section>

        {/* 4. WHAT WE DO */}
        <section className="space-y-3 pt-4">
          <h2 className="text-xl font-bold text-slate-900">What We Do – Off-Grid Living in Sri Lanka</h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We are your partner in building your off-grid kingdom. We have properties available on our system, and we can also introduce properties as per your request, ensuring you find the right land and home for your vision.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Our partner will support you in managing every aspect — from the overall property plan to the garden, fruit and vegetable farms, and sustainable systems. We also support income generation, helping your property produce income (from agro-tourism, organic produce, or eco-lodges) so you can enjoy standard living with financial peace, even while living off-grid. If you wish, we can provide ready-made plans for your project.
          </p>
          <ul className="space-y-1.5 text-sm text-slate-600 list-disc list-inside pt-1">
            <li><strong>Properties:</strong> Available on our system or introduced per your request.</li>
            <li><strong>Planning & Development:</strong> Our partners support property planning, garden, farm, and system installation.</li>
            <li><strong>Income Generation:</strong> Support for sustainable income streams (eco-tourism, agro-tourism, organic produce).</li>
            <li><strong>Ready-Made Plans:</strong> Customized off-grid plans to choose from, customized to your needs.</li>
            <li><strong>Local Regulations:</strong> Information on local government rules and land laws.</li>
            <li><strong>Data Analysis:</strong> Trend predictions (population, income, community dynamics).</li>
          </ul>
        </section>

        {/* 5. DATA-DRIVEN DECISIONS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-4">
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-xl font-bold text-slate-900">Data-Driven Decisions for Your Future</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              We support you in making decisions based on real, verified data:
            </p>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li><strong>Population trend analysis:</strong> Understand which areas are growing or declining and how far land retains viability.</li>
              <li><strong>Income level assessment:</strong> Evaluate local economic health and opportunities for small business.</li>
              <li><strong>Community demographics:</strong> Assess age distribution and how welcoming local community is to newcomers.</li>
              <li><strong>Local service evaluation:</strong> Distance to schools, hospitals, internet, and transport.</li>
              <li><strong>Climate and environmental analysis:</strong> Rainfall patterns, soil toxicity, and suitability for off-grid systems (solar, rainwater, agriculture).</li>
              <li><strong>Long-term forecasts:</strong> Informed decision-making for your family's future in Sri Lanka.</li>
            </ul>
          </div>
          <div className="h-56 md:h-64 bg-slate-200 rounded-lg overflow-hidden border border-slate-100">
            <img 
              src={IMAGE_PATHS.dataDriven} 
              alt="Data-Driven Decisions" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80";
              }}
            />
          </div>
        </section>

        {/* 6. WHY COMMUNITY MATTERS & GLOBAL CITIZENS */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center pt-4">
          <div className="md:col-span-2 space-y-4">
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Why Community Matters – Off-Grid Living in Sri Lanka</h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Living off-grid in Sri Lanka doesn't mean living alone. You remain a global citizen connected to the modern world — but you gain what more people crave: real human connection, belonging, and a traditional village style spirit.
              </p>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Modern isolation affects mental health and practice needs. Sri Lanka's traditional village lifestyle offers total independence, clean society, and healthy environment.
              </p>
              <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
                <li>Strong community connection for a support framework and traditional village network.</li>
                <li>Mental health benefits of living among caring neighbors.</li>
                <li>Sharing resources and knowledge makes self-sufficiency easier.</li>
                <li>Children grow up with friends, nature, and shared values.</li>
              </ul>
            </div>

            <div className="space-y-2 pt-2">
              <h3 className="text-lg font-bold text-slate-900">For Global Citizens</h3>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We assist international buyers with full support throughout your journey:
              </p>
              <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
                <li>Clear guidance on visa options for long-term stay.</li>
                <li>Multilingual assistance available (English, Japanese, and more).</li>
                <li>Local legal requirements and land ownership rules (leasehold and company structures).</li>
                <li>Full integration support — we help you connect with local protocols and community networks.</li>
              </ul>
            </div>
          </div>

          <div className="h-64 md:h-80 bg-slate-200 rounded-lg overflow-hidden border border-slate-100">
            <img 
              src={IMAGE_PATHS.community} 
              alt="Community Living" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=600&q=80";
              }}
            />
          </div>
        </section>

        {/* 7. OUR PROCESS & CHECKLIST */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start pt-4">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Our Process</h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              It all starts with a consultation, where we listen to your vision, needs, and concerns. We then match you with properties that meet your criteria, arranging site visits so you can experience the land, environment, and community firsthand. From there, we design your system (house, garden, energy, water, waste) and guide you through permits and local rules. Our partners build, install, and set up everything, and we introduce you to local standard networks. And long after you're settled, we continue to support you as your off-grid life evolves.
            </p>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li><strong>Consultation:</strong> We listen to your vision</li>
              <li><strong>Property matching to your criteria</strong></li>
              <li><strong>Site visit and assessment:</strong> We visit the land with you</li>
              <li><strong>Checking the documents of property:</strong> Outstanding</li>
              <li><strong>Designing system for house, garden, energy, water, waste</strong></li>
              <li><strong>Financial and legal support:</strong> Legal rules, permits, and local rules</li>
              <li><strong>Building and setup:</strong> Our partners build and set up everything</li>
              <li><strong>Community introduction:</strong> We connect you with local people</li>
              <li><strong>Ongoing support:</strong> Support for retirement and growth</li>
            </ul>

            <div className="pt-4 space-y-2">
              <h2 className="text-xl font-bold text-slate-900">Ready to Build Your Kingdom?</h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                Contact us today to start your off-grid journey in Sri Lanka. We offer complete support — land selection, data-driven assessment, system design, local integration, as well as income generation support for sustainable living.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 uppercase">Off-Grid Living Checklist</h3>
              <p className="text-sm text-slate-500 italic">Before buying, ask yourself:</p>
              <ul className="space-y-1 text-sm text-slate-600">
                <li>✓ Do I have location-independent income?</li>
                <li>✓ Am I willing to learn basic repair & farming skills?</li>
                <li>✓ Can I handle 20+ min drives to shops?</li>
                <li>✓ Am I ready for a slower, peaceful pace of life?</li>
                <li>✓ Do I respect local culture and traditions?</li>
              </ul>
            </div>
          </div>

          {/* VERTICAL STACK OF 3 IMAGES AS SHOWN IN FIGMA */}
          <div className="space-y-3">
            <div className="h-32 bg-slate-200 rounded-lg overflow-hidden border border-slate-100">
              <img 
                src={IMAGE_PATHS.process1} 
                alt="Process Step 1" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>
            <div className="h-32 bg-slate-200 rounded-lg overflow-hidden border border-slate-100">
              <img 
                src={IMAGE_PATHS.process2} 
                alt="Process Step 2" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>
            <div className="h-32 bg-slate-200 rounded-lg overflow-hidden border border-slate-200">
              <img 
                src={IMAGE_PATHS.process3} 
                alt="Process Step 3" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80";
                }}
              />
            </div>
          </div>
        </section>

        {/* 8. RETIRE IN SRI LANKA SECTION */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start border-t border-slate-100 pt-8">
          <div className="md:col-span-2 space-y-3">
            <h2 className="text-xl font-bold text-slate-900">
              Retire in Sri Lanka – Your Evening of Life, Elevated
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              This is for global citizens, Sri Lankan expats who wish to return, and anyone seeking a peaceful and beautiful destination for their retirement years. With low cost of living and high quality of life — convert your pension, savings, or assets into a lifestyle where your money goes further. You can enjoy comfortable housing, assistance, and a high quality of life in a tropical paradise.
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              Sri Lankans are deeply respectful towards elders, keeping traditional wisdom, tradition, and value alive. Sri Lanka has thousands of ancient monasteries for meditation, retreat, or spiritual exploration. Healthcare for seniors is WHO top rated, with private hospitals available at a fraction of Western costs.
            </p>
            <p className="text-sm font-semibold text-slate-800 pt-1">Why Sri Lanka is the Best Retirement Destination:</p>
            <ul className="space-y-1 text-sm text-slate-600 list-disc list-inside">
              <li><strong>Affordable Living:</strong> Your pension goes further, live comfortably on a fraction of Western costs.</li>
              <li><strong>Healthcare Access:</strong> High quality healthcare options with private hospitals right at your doorstep.</li>
              <li><strong>Pure Natural Food:</strong> Abundant organic fruits, vegetables, and clean water.</li>
              <li><strong>Spiritual Environment:</strong> Peaceful, welcoming community where you will find your home away from home.</li>
            </ul>
          </div>

          <div className="h-64 md:h-80 bg-slate-200 rounded-lg overflow-hidden border border-slate-100">
            <img 
              src={IMAGE_PATHS.retire} 
              alt="Retire in Sri Lanka" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80";
              }}
            />
          </div>
        </section>

        {/* 9. CONTACT / CTA SECTION */}
        <div className="text-center space-y-4 pt-4 border-t border-slate-100">
          <h2 className="text-lg font-bold text-slate-900">Ready to Start Your Off-Grid Life?</h2>
          <div className="text-sm text-slate-600 space-y-1">
            <p>✉️ Email: <a href={`mailto:${emailAddress}`} className="underline font-medium text-slate-800">{emailAddress}</a></p>
            <p>💬 WhatsApp: <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="underline font-medium text-slate-800">+94 76 018 0036</a></p>
          </div>
          <p className="text-sm text-slate-500 max-w-xl mx-auto italic">
            Book a free 45-minute consultation — let's talk about your vision, your land, and your future. Escape the matrix. Build your kingdom. Raise the next generation.
          </p>
          
          <div className="flex justify-center gap-4 pt-2">
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hello%21%20I%20am%20interested%20in%20Off-Grid%20Living%20%26%20Retirement%20Opportunities%20in%20Sri%20Lanka.`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded text-sm font-semibold transition"
            >
              Contact via WhatsApp
            </a>
            <a
              href={`mailto:${emailAddress}?subject=Off-Grid%20Living%20Sri%20Lanka%20Inquiry`}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 px-5 py-2.5 rounded text-sm font-semibold transition"
            >
              Send Email
            </a>
          </div>
        </div>

      </div>
    </main>
  );
}