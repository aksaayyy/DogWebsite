"use client";

import React, { useState, useEffect } from "react";

export default function EditorialPolicyPageContent() {
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
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50/50 px-3.5 py-1 text-xs font-semibold text-brand-orange mb-4">
            Editorial Integrity
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-navy mb-4 leading-tight">
            Our Editorial Standards & Policy
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            At {brandName}, our mission is to empower dog parents with reliable, research-informed, and practical care guides. Here is how we ensure our content is accurate and trustworthy.
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-display text-2xl font-bold text-brand-navy flex items-center gap-2">
              <span>🩺</span> 1. Evidence-Based Research & Sourcing
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We do not publish rumors, hearsay, or untested trends. Every claim regarding canine health, diet, toxicity, or behavior modification is thoroughly researched. Our primary sources include:
            </p>
            <ul className="list-disc pl-5 text-slate-500 text-xs space-y-2 leading-relaxed">
              <li>Peer-reviewed veterinary journals (e.g., Journal of the American Veterinary Medical Association, Frontiers in Veterinary Science).</li>
              <li>Official guidelines from board-certified organizations like the American College of Veterinary Internal Medicine (ACVIM) and the Association of American Feed Control Officials (AAFCO).</li>
              <li>Direct consultation and review of clinical studies from veterinary universities.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-display text-2xl font-bold text-brand-navy flex items-center gap-2">
              <span>🤖</span> 2. Responsible Use of AI Technology
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To support our content pipeline and maintain deep, comprehensive coverage of complex topics, we use advanced AI models to assist with research compilation and initial drafts. However, we maintain a strict <strong>Human-in-the-Loop</strong> policy:
            </p>
            <ul className="list-disc pl-5 text-slate-500 text-xs space-y-2 leading-relaxed">
              <li>No AI-generated draft is ever published raw or unchecked.</li>
              <li>Our editorial team rigorously fact-checks every statement, source reference, and dosage recommendation.</li>
              <li>We adapt all text to ensure it communicates with warmth, empathy, and clinical accuracy suited for everyday pet parents.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-display text-2xl font-bold text-brand-navy flex items-center gap-2">
              <span>✍️</span> 3. Author & Reviewer Standards
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our articles are written by experienced pet care writers and behavior specialists. For critical health and nutrition guides, we aim to have content reviewed or backed by licensed veterinary experts (DVMs) or certified canine behavior consultants (CCBCs). Every guide lists the author and the last updated date.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-display text-2xl font-bold text-brand-navy flex items-center gap-2">
              <span>✉️</span> 4. Corrections and Accuracy Reports
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              We strive for perfection but acknowledge that science and pet care guidelines evolve. If you believe there is an error, contradiction, or outdated detail in any of our guides, please report it to our editorial team:
            </p>
            <p className="text-brand-orange font-bold text-sm">
              corrections@woofnwagg.com
            </p>
            <p className="text-slate-500 text-xs leading-relaxed">
              Our team will review the claim, cross-reference it with peer-reviewed veterinary databases, and issue a correction or update to the page within 24 hours if verified.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-8 text-center text-xs text-slate-400 mt-12">
        <p>&copy; 2026 {brandName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
