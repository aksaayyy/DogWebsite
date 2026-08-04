"use client";

import React, { useState, useEffect } from "react";

export default function AffiliateDisclosurePageContent() {
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
            Advertising & Transparency
          </span>
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-brand-navy mb-4 leading-tight">
            Affiliate Disclosure
          </h1>
          <p className="text-slate-500 text-base leading-relaxed">
            In compliance with the FTC Guidelines, please read this disclosure regarding the links and monetization policies of {brandName}.
          </p>
        </div>

        <div className="space-y-12">
          {/* Section 1 */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-display text-2xl font-bold text-brand-navy flex items-center gap-2">
              <span>🤝</span> 1. Our Relationship with Advertisers
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              To support our writing, research, video curation, and server infrastructure, we participate in various affiliate marketing programs. This means that if you click on a link to a product recommendation (such as dog food, crates, collars, or supplements) and make a purchase, we may receive a small commission from the retailer.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              <strong>This does not cost you anything extra.</strong> The price of the product remains exactly the same whether you buy it through our affiliate link or directly from the merchant website.
            </p>
          </div>

          {/* Section 2 */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-display text-2xl font-bold text-brand-navy flex items-center gap-2">
              <span>🛍️</span> 2. Affiliate Networks & Programs
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {brandName} is a participant in several major affiliate programs, including:
            </p>
            <ul className="list-disc pl-5 text-slate-500 text-xs space-y-2 leading-relaxed">
              <li><strong>Amazon Services LLC Associates Program:</strong> An affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.</li>
              <li><strong>Chewy Partner Program (Impact Network):</strong> Earning referral fees by recommending quality pet food, medical supplies, and dog accessories directly to Chewy.com.</li>
              <li><strong>Other Pet Care Merchants:</strong> Select high-quality dog training tool brands, harness manufacturers, and DNA screening kits.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-display text-2xl font-bold text-brand-navy flex items-center gap-2">
              <span>🎯</span> 3. Editorial Independence
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              While we earn commission from your purchases, our product recommendations are guided strictly by research, veterinary recommendations, and genuine suitability. We never receive payment to provide positive reviews for poor products. If a product does not meet safety, health, or behavioral standards, we will call out its flaws or refuse to list it altogether. Our priority is always the wellness of Milo and your dog.
            </p>
          </div>

          {/* Section 4 */}
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-slate-100 shadow-sm space-y-4">
            <h2 className="font-display text-2xl font-bold text-brand-navy flex items-center gap-2">
              <span>📧</span> 4. Questions & Feedback
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              If you have any questions about our advertising practices or affiliate partnerships, please reach out to us at:
            </p>
            <p className="text-brand-orange font-bold text-sm">
              partnerships@woofnwagg.com
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
