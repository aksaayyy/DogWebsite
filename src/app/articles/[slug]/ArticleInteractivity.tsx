"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

interface ArticleInteractivityProps {
  toc: TocItem[];
  title: string;
  slug: string;
  readTime: string;
}

export default function ArticleInteractivity({ toc, title, slug, readTime }: ArticleInteractivityProps) {
  const [activeId, setActiveId] = useState("");
  const [progress, setProgress] = useState(0);
  const [showFloating, setShowFloating] = useState(false);
  const [mobileTocOpen, setMobileTocOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [shareTooltip, setShareTooltip] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Parse readTime number
  const readTimeMin = parseInt(readTime) || 5;
  const minutesLeft = Math.max(1, Math.ceil(readTimeMin * (1 - progress / 100)));

  // Reading progress + scroll detection
  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const el = document.documentElement;
          const scrollTop = el.scrollTop || document.body.scrollTop;
          const scrollHeight = el.scrollHeight - el.clientHeight;
          const pct = scrollHeight > 0 ? Math.min(100, (scrollTop / scrollHeight) * 100) : 0;
          setProgress(Math.round(pct));
          setShowFloating(scrollTop > 500);
          if (scrollTop > 100) {
            setHasScrolled(true);
            setMobileTocOpen(false);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-spy via IntersectionObserver
  useEffect(() => {
    if (toc.length === 0) return;

    const headingIds = toc.map((h) => h.id);
    const elements = headingIds.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0,
      }
    );

    elements.forEach((el) => observerRef.current!.observe(el));

    return () => {
      observerRef.current?.disconnect();
    };
  }, [toc]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleShare = useCallback(async () => {
    const url = typeof window !== "undefined" ? `${window.location.origin}/articles/${slug}` : `https://dog-website-xvkh.vercel.app/articles/${slug}`;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch { /* cancelled */ }
    } else {
      await navigator.clipboard.writeText(url);
      setShareTooltip(true);
      setTimeout(() => setShareTooltip(false), 2000);
    }
  }, [title, slug]);

  const showToc = toc.length > 2;

  return (
    <>
      {/* Reading Progress Bar */}
      <div className="fixed top-0 left-0 w-full z-50 pointer-events-none">
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-[#f97316] to-amber-400 transition-[width] duration-150 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        {progress > 0 && (
          <div className="absolute top-2 right-4 flex items-center gap-2 text-[11px] font-bold tabular-nums">
            <span className="px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-[#f97316] shadow-sm border border-orange-100/50">
              {progress}%
            </span>
            <span className="hidden sm:inline px-2 py-0.5 rounded-full bg-white/90 backdrop-blur-sm text-slate-500 shadow-sm border border-slate-100/50">
              {minutesLeft} min left
            </span>
          </div>
        )}
      </div>

      {/* Desktop TOC Sidebar — only shown when enough headings */}
      {showToc && (
      <aside className="hidden lg:block">
        <div className="sticky top-24 space-y-4">
          <div className="toc-scroll p-5 rounded-2xl bg-white border border-slate-100 shadow-sm max-h-[calc(100vh-8rem)] overflow-y-auto">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">Table of Contents</h3>
            <nav className="space-y-1">
              {(() => {
                let h2Count = 0;
                return toc.map((item) => {
                  const isActive = activeId === item.id;
                  if (item.level === 2) h2Count++;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className={`flex items-start gap-2.5 text-[13px] leading-snug py-2 px-2.5 rounded-lg transition-all duration-200 border-l-2 ${
                        item.level === 3 ? "ml-6 text-[12px]" : "font-medium"
                      } ${
                        isActive
                          ? "text-[#f97316] bg-orange-50/80 font-semibold border-[#f97316]"
                          : "text-slate-500 hover:text-slate-800 hover:bg-slate-50 border-transparent"
                      }`}
                    >
                      {item.level === 2 ? (
                        <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 mt-0.5 ${
                          isActive ? "bg-[#f97316] text-white" : "bg-slate-100 text-slate-400"
                        }`}>
                          {h2Count}
                        </span>
                      ) : (
                        <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                          isActive ? "bg-[#f97316]" : "bg-slate-300"
                        }`} />
                      )}
                      <span className="line-clamp-2">{item.text}</span>
                    </a>
                  );
                });
              })()}
            </nav>
          </div>

          {/* Share Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-50/80 to-amber-50/60 border border-orange-100/40">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#f97316] mb-3">Share</h3>
            <button onClick={handleShare} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white border border-slate-100 text-xs font-semibold text-slate-600 hover:border-[#f97316] hover:text-[#f97316] transition-all">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              {shareTooltip ? "Link Copied!" : "Copy Link"}
            </button>
          </div>
        </div>
      </aside>
      )}

      {/* Mobile TOC — collapsible accordion */}
      {hasScrolled && (
        <div className="lg:hidden fixed bottom-20 left-4 right-4 z-40">
          <button
            onClick={() => setMobileTocOpen(!mobileTocOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#0f172a] text-white text-xs font-bold shadow-lg"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
            {mobileTocOpen ? "Close" : "Contents"}
          </button>
          {mobileTocOpen && (
            <div className="mt-2 p-4 rounded-2xl bg-white border border-slate-100 shadow-xl max-h-[50vh] overflow-y-auto toc-scroll animate-in slide-in-from-bottom">
              <nav className="space-y-1">
                {(() => {
                  let h2Count = 0;
                  return toc.map((item) => {
                    const isActive = activeId === item.id;
                    if (item.level === 2) h2Count++;
                    return (
                      <a
                        key={item.id}
                        href={`#${item.id}`}
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                          setMobileTocOpen(false);
                        }}
                        className={`flex items-start gap-2.5 text-sm leading-snug py-2 px-2.5 rounded-lg transition-all border-l-2 ${
                          item.level === 3 ? "ml-5 text-xs" : "font-medium"
                        } ${
                          isActive
                            ? "text-[#f97316] bg-orange-50 font-semibold border-[#f97316]"
                            : "text-slate-600 hover:bg-slate-50 border-transparent"
                        }`}
                      >
                        {item.level === 2 ? (
                          <span className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold shrink-0 mt-0.5 ${
                            isActive ? "bg-[#f97316] text-white" : "bg-slate-100 text-slate-400"
                          }`}>
                            {h2Count}
                          </span>
                        ) : (
                          <span className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 mt-1.5 ${
                            isActive ? "bg-[#f97316]" : "bg-slate-300"
                          }`} />
                        )}
                        <span className="line-clamp-2">{item.text}</span>
                      </a>
                    );
                  });
                })()}
              </nav>
            </div>
          )}
        </div>
      )}

      {/* Floating Buttons — back to top + share */}
      {showFloating && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2 animate-in fade-in slide-in-from-bottom">
          <button
            onClick={handleShare}
            className="group h-10 w-10 rounded-full bg-white border border-slate-200 shadow-md flex items-center justify-center text-slate-500 hover:text-[#f97316] hover:border-[#f97316] hover:shadow-lg transition-all"
            title="Share article"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
          </button>
          <button
            onClick={scrollToTop}
            className="group h-10 w-10 rounded-full bg-[#0f172a] shadow-md flex items-center justify-center text-white hover:bg-[#f97316] hover:shadow-lg transition-all"
            title="Back to top"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
          </button>
        </div>
      )}

      {/* Share tooltip */}
      {shareTooltip && (
        <div className="fixed bottom-20 right-6 z-50 px-3 py-1.5 rounded-lg bg-[#0f172a] text-white text-xs font-semibold shadow-lg animate-in fade-in">
          Link copied to clipboard!
        </div>
      )}
    </>
  );
}
