import Link from "next/link";

export const metadata = {
  title: "Page Not Found | Woof & Wag",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbf9]">
      <header className="sticky top-0 z-40 w-full border-b border-orange-100/40 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
          <a href="/" className="flex items-center gap-3 group">
            <span className="font-[var(--font-display)] text-xl font-bold tracking-tight text-[#0f172a] group-hover:text-[#f97316] transition-colors">Woof &amp; Wag</span>
          </a>
        </div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center py-20">
          <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 flex items-center justify-center mb-6">
            <span className="text-4xl">🐕</span>
          </div>
          <h1 className="font-[var(--font-display)] text-2xl font-bold text-[#0f172a]">Article Not Found</h1>
          <p className="text-slate-500 mt-2 text-sm max-w-md mx-auto">The article you are looking for does not exist or has been moved.</p>
          <Link href="/" className="inline-flex items-center gap-2 mt-6 rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#f97316] transition-all duration-300">
            ← Back to Home
          </Link>
        </div>
      </main>
      <footer className="border-t border-slate-100 bg-slate-50 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-slate-400">&copy; 2026 Woof &amp; Wag. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
