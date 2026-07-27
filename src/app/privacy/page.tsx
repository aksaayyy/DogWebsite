"use client";

import React, { useState, useEffect } from "react";

export default function PrivacyPage() {
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
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-400 mb-8">Last Updated: July 22, 2026</p>

        <div className="prose prose-orange max-w-none text-slate-600 leading-relaxed text-sm space-y-6">
          <p>
            At <strong>{brandName}</strong>, we are committed to protecting your privacy. This Privacy Policy details how we collect, use, and safeguard your personal information when you visit our website.
          </p>

          <h2 className="font-display text-xl font-bold text-brand-navy mt-8 border-b border-slate-100 pb-2">
            1. Information We Collect
          </h2>
          <p>
            We collect personal information that you voluntarily provide to us when you subscribe to our newsletter, submit mock posts, or register on the site. This may include your name, email address, and billing information (if applicable).
          </p>

          <h2 className="font-display text-xl font-bold text-brand-navy mt-8 border-b border-slate-100 pb-2">
            2. How We Use Your Information
          </h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>To personalize your experience and deliver the content you find most interesting.</li>
            <li>To send periodic newsletters or updates about Milo and our community.</li>
            <li>To monitor configuration statistics and improve website loading performance.</li>
          </ul>

          <h2 className="font-display text-xl font-bold text-brand-navy mt-8 border-b border-slate-100 pb-2">
            3. Cookies & Tracking Technologies
          </h2>
          <p>
            We use cookies to analyze web traffic and optimize your scrolling experience. You can choose to disable cookies through your individual browser settings; however, doing so may affect some site features, such as caching customized branding preferences.
          </p>

          <h2 className="font-display text-xl font-bold text-brand-navy mt-8 border-b border-slate-100 pb-2">
            4. Third-Party Sharing
          </h2>
          <p>
            We do not sell, trade, or transfer your personal data to outside parties. This excludes trusted third parties who assist us in operating our site (such as Sanity.io CMS hosting) so long as those parties agree to keep this information confidential.
          </p>

          <h2 className="font-display text-xl font-bold text-brand-navy mt-8 border-b border-slate-100 pb-2">
            5. Contact Us
          </h2>
          <p>
            If you have any questions regarding this Privacy Policy, you can reach our team at: <strong>privacy@woofandwag.com</strong>.
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
