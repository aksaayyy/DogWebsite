"use client";

import React, { useState, useEffect } from "react";

export default function ContactPageContent() {
  const [brandName, setBrandName] = useState("Woof & Wag");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const localBrandName = localStorage.getItem("woof-wag-brand-name");
    if (localBrandName) setBrandName(localBrandName);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return alert("Please fill out all fields!");
    setSubmitted(true);
    setName("");
    setEmail("");
    setMessage("");
  };

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
      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50/50 px-3.5 py-1 text-xs font-semibold text-brand-orange mb-4">
            Get in Touch
          </span>
          <h1 className="font-display text-4xl font-extrabold tracking-tight text-brand-navy mb-2">
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed max-w-lg mx-auto">
            Have questions about training schedules or partnership requests? Send us a message and our support pack will get back to you!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Contact Details */}
          <div className="md:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-display font-bold text-brand-navy text-sm mb-3">Response Time</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                We review care questions and partnership applications daily. Expect a response in under **24 hours**.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div>
                <h3 className="font-display font-bold text-brand-navy text-sm mb-1">General Inquiries</h3>
                <p className="text-xs text-brand-orange font-semibold">
                  hello@woofnwagg.com
                </p>
              </div>
              <div>
                <h3 className="font-display font-bold text-brand-navy text-sm mb-1">Partnerships & Media</h3>
                <p className="text-xs text-brand-orange font-semibold">
                  partnerships@woofnwagg.com
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            {submitted ? (
              <div className="text-center py-8">
                <span className="text-4xl">📨</span>
                <h3 className="font-display font-bold text-brand-navy text-lg mt-4 mb-2">Message Sent!</h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Thank you for reaching out. A copy of your inquiry has been logged, and we&apos;ll connect soon.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-6 text-xs font-bold text-brand-orange hover:underline"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 text-xs font-semibold">
                <div>
                  <label className="block text-slate-600 mb-1.5">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full rounded-lg border border-slate-200 p-3 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. jane@example.com"
                    className="w-full rounded-lg border border-slate-200 p-3 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 mb-1.5">Your Message *</label>
                  <textarea
                    required
                    value={message}
                    rows={4}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry..."
                    className="w-full rounded-lg border border-slate-200 p-3 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-brand-navy p-3.5 text-xs font-semibold text-white hover:bg-brand-orange transition-all shadow"
                >
                  Send Message
                </button>
              </form>
            )}
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
