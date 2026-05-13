'use client';

import React from 'react';
import Link from 'next/link';

const newsItems = [
  {
    id: 1,
    title: "New TallyPrime v7.0 Released with Advanced AI Features!",
    date: "May 12, 2026",
    category: "Product Update",
    description: "Experience the next level of accounting with AI-driven automation, faster data processing, and enhanced GST reporting. The new version brings unprecedented speed and accuracy to your financial management.",
    content: "TallyPrime v7.0 is here, and it's a game-changer for businesses of all sizes. With integrated AI capabilities, it can now predict cash flow trends, automatically categorize expenses, and provide smarter GST compliance checks. Our technical team is ready to help you upgrade and train your staff on these new features.",
    link: "/products#compare"
  },
  {
    id: 2,
    title: "Sarvadnya Infotech LLP Awarded Top Certified Partner 2026.",
    date: "May 10, 2026",
    category: "Achievement",
    description: "We are proud to be recognized for our commitment to excellence and unmatched customer support in the Tally ecosystem.",
    content: "This award belongs to our customers who have trusted us for years. Being named the Top Certified Partner 2026 in the region motivates us to push our boundaries further. We remain committed to our 'Never Deny Support' philosophy.",
    link: "/about"
  },
  {
    id: 3,
    title: "E-Invoicing Limits Reduced: Stay Compliant with TallyPrime.",
    date: "May 08, 2026",
    category: "Statutory",
    description: "New statutory regulations are in effect. Ensure your business is compliant with our seamless e-invoicing solutions.",
    content: "The government has recently lowered the threshold for mandatory e-invoicing. If your turnover exceeds the new limit, you must generate IRN for every B2B invoice. TallyPrime makes this process completely seamless. Contact us today for a compliance audit.",
    link: "/contact"
  },
  {
    id: 4,
    title: "Upcoming Webinar: Optimizing Your Supply Chain with Tally Custom Modules.",
    date: "May 05, 2026",
    category: "Event",
    description: "Join our experts this Thursday at 3 PM to learn how industry-specific modules can streamline your operations.",
    content: "Supply chain efficiency is critical in today's competitive market. In this webinar, we will demonstrate how our custom TDL modules for logistics, transport, and inventory management can provide real-time visibility and cost savings.",
    link: "/tutorials"
  },
  {
    id: 5,
    title: "Our 'Never Deny Support' Policy is now live for all small businesses.",
    date: "May 01, 2026",
    category: "Policy",
    description: "Fast response and zero turn-away support. We ensure your Tally issues are resolved first, regardless of your contract status.",
    content: "We believe that technical glitches shouldn't stop your business growth. Our new policy ensures that any Tally user can reach out to us for emergency support. We prioritize resolution over paperwork, ensuring you stay productive.",
    link: "/contact"
  }
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-[#f9fafb] pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-[#0f0529] mb-4">
            Latest <span className="text-[#7338a0]">News</span> & Updates
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stay informed about the latest Tally updates, statutory changes, and Sarvadnya Infotech announcements.
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                  {item.category}
                </span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {item.date}
                </span>
              </div>
              
              <h2 className="text-xl font-bold text-[#0f0529] mb-4 group-hover:text-[#7338a0] transition-colors leading-tight">
                {item.title}
              </h2>
              
              <p className="text-slate-600 text-sm mb-6 leading-relaxed flex-grow">
                {item.description}
              </p>

              <div className="pt-6 border-t border-slate-50 flex flex-col gap-4">
                <p className="text-slate-500 text-xs italic">
                  {item.content}
                </p>
                <Link 
                  href={item.link}
                  className="inline-flex items-center gap-2 text-[#7338a0] font-bold text-xs uppercase tracking-widest hover:gap-3 transition-all"
                >
                  Learn More
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
