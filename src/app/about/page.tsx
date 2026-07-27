"use client";

import React, { useState, useEffect } from "react";

export default function AboutPage() {
  const [brandName, setBrandName] = useState("Woof & Wag");

  useEffect(() => {
    const localBrandName = localStorage.getItem("woof-wag-brand-name");
    if (localBrandName) setBrandName(localBrandName);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfbf9] text-[#0f172a]">
      {/* Header */}
      <header className="border-b border-orange-100/40 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3 font-display text-xl font-bold tracking-tight text-brand-navy">
            {brandName}
          </a>
          <a
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-brand-navy shadow-sm hover:bg-slate-50 transition-all"
          >
            &larr; Back to Homepage
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50/50 px-3.5 py-1 text-xs font-semibold text-brand-orange mb-4">
            Our Story & Mission
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-navy mb-4 leading-tight">
            Empowering Dog Owners with Science-Backed Care
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            Welcome to {brandName}. We specialize in bridging the gap between clinical research and warm, practical daily dog parenting.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <span className="text-3xl">🩺</span>
            <h3 className="font-display text-xl font-bold text-brand-navy mt-4 mb-2">Veterinary Vetted</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Every training methodology, dietary guide, and care tip we share undergoes vetting by licensed veterinarians and certified canine behaviorists to ensure absolute safety and wellness.
            </p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <span className="text-3xl">🐾</span>
            <h3 className="font-display text-xl font-bold text-brand-navy mt-4 mb-2">Practical Parenting</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              We skip the abstract academic jargon. Our step-by-step training outlines, schedule sheets, and nutrition lists are structured for busy families who want results naturally.
            </p>
          </div>
        </div>

        {/* The Team / Milo Section */}
        <div className="bg-gradient-to-br from-orange-50/50 to-amber-50/40 rounded-3xl p-8 sm:p-12 border border-orange-100/50 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="relative w-36 h-36 rounded-full border-4 border-white bg-slate-900 overflow-hidden shadow flex-shrink-0 flex items-center justify-center text-6xl">
            🐕
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-brand-navy mb-2">Meet Milo</h3>
            <p className="text-xs font-bold text-brand-orange uppercase tracking-wider mb-4">Chief Canine Tester & Inspiration</p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Milo is our 2-year-old Golden Retriever. From testing freeze-dried treats for our nutrition guides to demonstrating crate comfort spacing, Milo keeps us grounded in what dogs truly love. He's also the star of our interactive live feed on the landing page!
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-8 text-center text-xs text-slate-400">
        <p>&copy; 2026 {brandName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
