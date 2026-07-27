"use client";

import React, { useState, useEffect } from "react";

export default function TermsPage() {
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
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-brand-navy mb-2">
          Terms of Service
        </h1>
        <p className="text-xs text-slate-400 mb-8">Last Updated: July 22, 2026</p>

        <div className="prose prose-orange max-w-none text-slate-600 leading-relaxed text-sm space-y-6">
          <p>
            Welcome to <strong>{brandName}</strong>. By accessing our website, you agree to comply with and be bound by the following Terms of Service. Please read them carefully.
          </p>

          <h2 className="font-display text-xl font-bold text-brand-navy mt-8 border-b border-slate-100 pb-2">
            1. Acceptance of Terms
          </h2>
          <p>
            By using this website, you represent that you are at least 18 years of age (or have parental permission) and agree to abide by these terms. If you do not agree to these terms, you must discontinue your use of our services.
          </p>

          <h2 className="font-display text-xl font-bold text-brand-navy mt-8 border-b border-slate-100 pb-2">
            2. Intellectual Property
          </h2>
          <p>
            All content on {brandName}, including text, brand graphics, logos, and custom Golden Retriever video assets, is the property of {brandName} and is protected by international copyright laws. You may not distribute or replicate these assets without written permission.
          </p>

          <h2 className="font-display text-xl font-bold text-brand-navy mt-8 border-b border-slate-100 pb-2">
            3. User Contributions
          </h2>
          <p>
            If you create or submit articles via the admin configuration panels, you represent that you own the rights to the content. You must not submit material that is unlawful, defamatory, or violates any third-party copyrights.
          </p>

          <h2 className="font-display text-xl font-bold text-brand-navy mt-8 border-b border-slate-100 pb-2">
            4. Limitation of Liability
          </h2>
          <p>
            The information provided on this blog is for general educational purposes and does not constitute official veterinary medical advice. {brandName} is not liable for any decisions made based on care, diet, or behavior instructions published here. Always consult a veterinarian for health issues.
          </p>

          <h2 className="font-display text-xl font-bold text-brand-navy mt-8 border-b border-slate-100 pb-2">
            5. Governing Law
          </h2>
          <p>
            These Terms of Service are governed by and construed in accordance with the local laws, without regard to conflict of law principles.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-8 text-center text-xs text-slate-400">
        <p>&copy; 2026 {brandName}. All rights reserved.</p>
      </footer>
    </div>
  );
}
