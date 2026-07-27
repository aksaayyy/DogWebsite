"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { getPosts, Post } from "@/lib/sanity";

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredPosts = selectedCategory === "All"
    ? posts
    : posts.filter(post => post.category === selectedCategory);

  // Scroll tracking for parallax and crossfade
  const [scrollY, setScrollY] = useState(0);
  const [viewportHeight, setViewportHeight] = useState(800);

  // Dynamic Branding Settings (connected to Admin panel config)
  const [brandName, setBrandName] = useState("Woof & Wag");
  const [heroAccent, setHeroAccent] = useState("Dog Lovers & Seekers");
  const [heroText, setHeroText] = useState(
    "Welcome to Woof & Wag. Feed Milo a virtual treat on the right or scroll down to see the background video seamlessly fade into a playful toy-chewing scene as you browse articles."
  );

  // Interaction Lab States
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSpeed, setVideoSpeed] = useState(1);
  const [videoSrc, setVideoSrc] = useState("/assets/hero-dog-video.mp4");
  const [treatEffects, setTreatEffects] = useState<{ id: number; x: number; label: string }[]>([]);
  const [isBouncing, setIsBouncing] = useState(false);

  // 3D Dog Name Generator States
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState<"Male" | "Female" | "Unisex">("Unisex");
  const [selectedVibe, setSelectedVibe] = useState<"Playful" | "Regal" | "Tough" | "Cute" | "Classic">("Playful");
  const [generatedName, setGeneratedName] = useState("");
  const [spinTrigger, setSpinTrigger] = useState(0);

  useEffect(() => {
    async function loadData() {
      // First check local storage for custom mock playground posts with fallbacks
      let local = null;
      try {
        local = localStorage.getItem("woof-wag-mock-posts") || sessionStorage.getItem("woof-wag-mock-posts");
      } catch (e) {
        console.warn("Homepage storage read failed", e);
      }

      if (local) {
        setPosts(JSON.parse(local));
      } else if ((window as any).woofWagMockPosts) {
        setPosts((window as any).woofWagMockPosts);
      } else {
        const data = await getPosts();
        setPosts(data);
      }

      // Check local storage for custom branding settings with fallbacks
      let localBrandName = null;
      let localHeroAccent = null;
      let localHeroText = null;
      try {
        localBrandName = localStorage.getItem("woof-wag-brand-name") || sessionStorage.getItem("woof-wag-brand-name");
        localHeroAccent = localStorage.getItem("woof-wag-hero-accent") || sessionStorage.getItem("woof-wag-hero-accent");
        localHeroText = localStorage.getItem("woof-wag-hero-text") || sessionStorage.getItem("woof-wag-hero-text");
      } catch (e) {
        console.warn("Homepage settings read failed", e);
      }

      if (localBrandName) setBrandName(localBrandName);
      else if ((window as any).woofWagBrandName) setBrandName((window as any).woofWagBrandName);

      if (localHeroAccent) setHeroAccent(localHeroAccent);
      else if ((window as any).woofWagHeroAccent) setHeroAccent((window as any).woofWagHeroAccent);

      if (localHeroText) setHeroText(localHeroText);
      else if ((window as any).woofWagHeroText) setHeroText((window as any).woofWagHeroText);

      setIsLoaded(true);
    }
    loadData();

    // Setup scroll tracking
    setViewportHeight(window.innerHeight);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    const handleResize = () => {
      setViewportHeight(window.innerHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Sync the video source path to match speed selectors (Zoomies triggers the new running clip)
  useEffect(() => {
    const targetSrc = videoSpeed === 2 
      ? "/assets/Cute_dog_smiling_and_zoomies_202607241225.mp4" 
      : "/assets/hero-dog-video.mp4";
    if (videoSrc !== targetSrc) {
      setVideoSrc(targetSrc);
    }
  }, [videoSpeed, videoSrc]);

  // Handle source changes separately
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.playbackRate = videoSpeed;
      videoRef.current.play().catch(e => console.log("Video play interrupted:", e));
    }
  }, [videoSrc]);

  // Handle speed changes (only updating rate without reloading the video)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = videoSpeed;
    }
  }, [videoSpeed]);

  // Synthesize a cute playful bark sound using Web Audio API
  const synthesizeBark = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      
      const ctx = new AudioCtx();
      
      // First high frequency "yap"
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(140, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.1);
      
      gain1.gain.setValueAtTime(0.2, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      
      osc1.start();
      osc1.stop(ctx.currentTime + 0.15);

      // Second delayed double-yap for realism
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(130, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(290, ctx.currentTime + 0.1);
        
        gain2.gain.setValueAtTime(0.15, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        
        osc2.start();
        osc2.stop(ctx.currentTime + 0.12);
      }, 90);
      
    } catch (e) {
      console.log("Web Audio not supported or blocked:", e);
    }
  };

  const handleGiveTreat = () => {
    synthesizeBark();
    setIsBouncing(true);
    
    // Add floating emoji animation item
    const newEffect = {
      id: Date.now(),
      x: Math.random() * 80 + 10,
      label: Math.random() > 0.5 ? "🦴" : "💬 Woof!"
    };
    
    setTreatEffects((prev) => [...prev, newEffect]);

    setTimeout(() => {
      setIsBouncing(false);
    }, 400);

    setTimeout(() => {
      setTreatEffects((prev) => prev.filter((item) => item.id !== newEffect.id));
    }, 1500);
  };

  // Parallax and Opacity calculations for backgrounds
  const heroOpacity = Math.max(0, 0.18 * (1 - scrollY / (viewportHeight || 800)));
  const heroScale = 1 + (scrollY / (viewportHeight || 800)) * 0.12;
  const heroTranslateY = (scrollY / (viewportHeight || 800)) * 35;

  const blogOpacity = Math.min(0.18, Math.max(0, (scrollY - 150) / (viewportHeight || 800) * 0.18));
  const blogScale = 1.12 - Math.min(1, Math.max(0, (scrollY - 150) / (viewportHeight || 800))) * 0.12;
  const blogTranslateY = Math.max(0, 1 - (scrollY - 150) / (viewportHeight || 800)) * -35;

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Immersive Scroll-Driven Background Videos */}
      <div className="fixed inset-0 -z-20 w-full h-full overflow-hidden pointer-events-none select-none bg-[#fdfdfc]">
        {/* Background Video 1: Hero Mascot (first-dog-video) */}
        <video
          autoPlay
          loop
          muted
          playsInline
          style={{
            opacity: heroOpacity,
            transform: `scale(${heroScale}) translateY(${heroTranslateY}px)`,
          }}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ease-out"
        >
          <source src="/assets/first-dog-video.mp4" type="video/mp4" />
          <source src="/assets/hero-dog-video.mp4" type="video/mp4" />
        </video>

        {/* Background Video 2: Blog Articles Mascot (blog-dog-video) */}
        <video
          src="/assets/blog-dog-video.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            opacity: blogOpacity,
            transform: `scale(${blogScale}) translateY(${blogTranslateY}px)`,
          }}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-150 ease-out"
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-orange-100/40 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
          {/* Logo & Brand */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-orange-100 shadow-sm bg-white group-hover:scale-105 transition-all">
              <Image
                src="/assets/logo.png"
                alt="Woof & Wag Logo"
                fill
                priority
                className="object-cover"
              />
            </div>
            <span className="font-display text-xl font-bold tracking-tight text-brand-navy">
              {brandName}
            </span>
          </a>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-brand-navy-light">
            <a href="#articles" id="nav-link-articles" className="hover:text-brand-orange transition-colors">Articles</a>
            <a href="#interactive" id="nav-link-interactive" className="hover:text-brand-orange transition-colors">Interactive Lab</a>
          </nav>

          {/* Call to Actions */}
          <div className="flex items-center gap-4">
            <button 
              id="header-btn-join" 
              onClick={() => setIsJoinModalOpen(true)}
              className="rounded-full bg-brand-navy px-5 py-2 text-xs font-semibold text-white shadow-md hover:bg-brand-orange hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Join the Pack
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <section id="interactive" className="relative py-20 lg:py-28 bg-transparent">
          
          {/* Decorative glows */}
          <div className="absolute top-0 right-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-orange-100/10 blur-3xl" />
          <div className="absolute bottom-0 left-10 -z-10 h-[500px] w-[500px] rounded-full bg-amber-100/10 blur-3xl" />

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
              
              {/* Hero Left Content */}
              <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
                <div className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50/50 px-3.5 py-1 text-xs font-semibold text-brand-orange mb-6 mx-auto lg:mx-0 w-fit">
                  <span className="flex h-2 w-2 rounded-full bg-brand-orange animate-ping" />
                  Scroll Down to Crossfade Background Video
                </div>
                
                <h1 className="font-display text-4xl font-extrabold tracking-tight text-brand-navy sm:text-5xl md:text-6xl leading-tight">
                  The Premium Space for <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-orange to-amber-500">
                    {heroAccent}
                  </span>
                </h1>
                
                <p className="mt-6 max-w-2xl text-base sm:text-lg text-slate-600 leading-relaxed mx-auto lg:mx-0">
                  {heroText}
                </p>

                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <a 
                    href="#articles" 
                    id="hero-btn-explore"
                    className="inline-flex items-center justify-center rounded-full bg-brand-navy px-8 py-3.5 text-sm font-semibold text-white shadow-md hover:bg-brand-orange hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Explore Articles
                  </a>
                  <button 
                    id="hero-btn-give-treat"
                    onClick={handleGiveTreat}
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand-orange bg-white px-8 py-3.5 text-sm font-bold text-brand-orange shadow-sm hover:bg-orange-50 transition-all duration-300 transform active:scale-95"
                  >
                    Give Milo a Treat 🦴
                  </button>
                </div>

                {/* Micro Stats */}
                <div className="mt-12 pt-8 border-t border-orange-100/50 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
                  <div>
                    <div className="font-display text-2xl font-bold text-brand-navy">120+</div>
                    <div className="text-xs text-slate-500 mt-1">Breed Guides</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-brand-navy">50k+</div>
                    <div className="text-xs text-slate-500 mt-1">Monthly Readers</div>
                  </div>
                  <div>
                    <div className="font-display text-2xl font-bold text-brand-navy">100%</div>
                    <div className="text-xs text-slate-500 mt-1">Expert Approved</div>
                  </div>
                </div>
              </div>

              {/* Hero Right Media - Milo's Interactive Lab */}
              <div className="lg:col-span-6 flex justify-center items-center">
                <div className="w-full max-w-[440px] flex flex-col gap-5">
                  
                  {/* Interactive Video Container with bounce effect */}
                  <div className={`relative w-full aspect-square rounded-3xl bg-gradient-to-tr from-orange-100/40 to-amber-100/30 p-4 shadow-premium border border-white/80 transition-all duration-300 ${
                    isBouncing ? "scale-105 -rotate-2" : "hover:scale-[1.01]"
                  }`}>
                    
                    {/* Floating treats/Woof elements */}
                    {treatEffects.map((item) => (
                      <span
                        key={item.id}
                        style={{ left: `${item.x}%` }}
                        className="absolute bottom-16 z-20 text-3xl font-bold pointer-events-none animate-float-up select-none filter drop-shadow-md"
                      >
                        {item.label}
                      </span>
                    ))}

                    <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-inner bg-slate-900 flex items-center justify-center">
                      <video
                        ref={videoRef}
                        src={videoSrc}
                        autoPlay
                        loop
                        muted
                        playsInline
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    {/* Floating badge */}
                    <div className="absolute top-8 left-8 rounded-full bg-black/45 backdrop-blur-md px-3 py-1 text-[10px] text-white/90 font-semibold tracking-wide border border-white/10 uppercase select-none">
                      • Live Feed
                    </div>

                    {/* Interactive Speed Overlay Indicator */}
                    {videoSpeed !== 1 && (
                      <div className="absolute top-8 right-8 rounded-full bg-brand-orange/90 backdrop-blur-sm px-2.5 py-0.5 text-[9px] text-white font-bold tracking-wider uppercase select-none shadow">
                        Speed: {videoSpeed}x
                      </div>
                    )}
                  </div>

                  {/* Lab Controls Panel */}
                  <div className="bg-white/70 backdrop-blur-md rounded-2xl p-4 border border-orange-100/50 shadow-sm flex items-center justify-between">
                    <div>
                      <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400">
                        Milo's Play Speed
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {[
                        { id: "slow", val: 0.5, label: "Slo-Mo" },
                        { id: "normal", val: 1.0, label: "Normal" },
                        { id: "zoomies", val: 2.0, label: "Zoomies" }
                      ].map((spd) => (
                        <button
                          key={spd.val}
                          id={`speed-btn-${spd.id}`}
                          onClick={() => setVideoSpeed(spd.val)}
                          className={`rounded-full px-3 py-1.5 text-[10px] font-bold border transition-all ${
                            videoSpeed === spd.val
                              ? "bg-brand-orange border-brand-orange text-white shadow-sm"
                              : "bg-white border-slate-200 text-slate-500 hover:border-orange-200"
                          }`}
                        >
                          {spd.label}
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Articles Section */}
        <section id="articles" className="py-24 bg-white/40 backdrop-blur-xs border-t border-slate-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            
            {/* Section Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
              <div className="max-w-xl">
                <h2 className="font-display text-3xl font-bold tracking-tight text-brand-navy sm:text-4xl">
                  Curated Articles for Smart Pet Parents
                </h2>
                <p className="mt-4 text-slate-500">
                  Stay updated with the latest vet-reviewed research on canine behaviors, diets, and modern training methodologies.
                </p>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-10 border-b border-slate-100 pb-6 text-xs font-bold">
              {[
                { name: "All", label: "📋 All Articles", count: posts.length },
                { name: "Health & Wellness", label: "🩺 Health & Wellness", count: posts.filter(p => p.category === "Health & Wellness").length },
                { name: "Training & Behavior", label: "🧠 Training & Behavior", count: posts.filter(p => p.category === "Training & Behavior").length },
                { name: "Nutrition", label: "🍖 Nutrition", count: posts.filter(p => p.category === "Nutrition").length }
              ].map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`rounded-full px-4 py-2 border transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
                    selectedCategory === cat.name
                      ? "bg-brand-orange border-brand-orange text-white shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:border-orange-200 hover:text-brand-orange"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span className={`inline-flex items-center justify-center rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                    selectedCategory === cat.name
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Articles Grid */}
            {!isLoaded ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="animate-pulse border border-slate-100 rounded-2xl p-6 h-80 bg-slate-50/50" />
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
                <span className="text-4xl">📖</span>
                <h3 className="font-display font-bold text-lg text-brand-navy mt-4">No articles found in this category</h3>
                <p className="text-xs text-slate-400 mt-1">Try switching to another category or add a new article on the admin dashboard!</p>
                <a href="/admin" className="inline-block mt-4 rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold text-white">
                  Add Mock Article
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map((post) => (
                  <article 
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-premium-hover hover:border-orange-200/50 transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                  >
                    <div>
                      {/* Post Category */}
                      <div className="flex items-center justify-between mb-4">
                        <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium border ${post.categoryColor}`}>
                          {post.category}
                        </span>
                        <span className="text-xs text-slate-400">{post.readTime}</span>
                      </div>

                      {/* Post Image / Cover Photo */}
                      <div className="relative w-full h-44 rounded-xl overflow-hidden mb-5 bg-slate-100 border border-slate-100/50">
                        <img 
                          src={getFirstImageUrl(post.body, post.category)} 
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                          loading="lazy"
                        />
                      </div>

                      {/* Title */}
                      <h3 className="font-display text-xl font-bold leading-snug text-brand-navy group-hover:text-brand-orange transition-colors">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="mt-3 text-sm text-slate-500 leading-relaxed">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Author & Footer */}
                    <div className="mt-6 pt-4 border-t border-slate-50 flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-full ${post.author.avatarColor} flex items-center justify-center text-xs font-bold`}>
                        {post.author.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-brand-navy">{post.author.name}</div>
                        <div className="text-[10px] text-slate-400">{post.author.role} • {post.publishedAt}</div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Centered Article Detail Modal */}
      {selectedPost && (
        <>
          {/* Backdrop layer */}
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-fade-in cursor-pointer" onClick={() => setSelectedPost(null)} />
          
          {/* Modal centering layer */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 lg:p-12 pointer-events-none">
          <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60 animate-scale-in flex flex-col pointer-events-auto mx-auto">
            
            {/* Sticky Close Button — always visible */}
            <button 
              onClick={() => setSelectedPost(null)}
              className="absolute top-5 right-5 z-10 h-10 w-10 rounded-full bg-white/90 hover:bg-orange-50 flex items-center justify-center text-slate-500 hover:text-brand-orange font-bold text-base shadow-md border border-slate-200/60 transition-all hover:scale-105 cursor-pointer"
            >
              ✕
            </button>

            {/* Scrollable Content Area */}
            <div className="overflow-y-auto flex-1 overscroll-contain">

              {/* Full-Bleed Cover Image Hero */}
              <div className="w-full h-56 sm:h-64 md:h-72 bg-slate-100 relative">
                <img 
                  src={getFirstImageUrl(selectedPost.body, selectedPost.category)} 
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>

              {/* Article Header & Body — centered with generous padding */}
              <div className="px-8 sm:px-12 md:px-16 lg:px-20 py-8 sm:py-10">
                <div className="max-w-2xl mx-auto">

                  {/* Category Badge */}
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold border ${selectedPost.categoryColor} mb-5`}>
                    {selectedPost.category}
                  </span>

                  {/* Title */}
                  <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-navy leading-tight tracking-tight">
                    {selectedPost.title}
                  </h2>

                  {/* Author Meta */}
                  <div className="mt-6 flex items-center gap-4 pb-8 mb-8 border-b border-slate-100">
                    <div className={`h-11 w-11 rounded-full ${selectedPost.author.avatarColor} flex items-center justify-center text-sm font-bold shrink-0`}>
                      {selectedPost.author.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-brand-navy">{selectedPost.author.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">{selectedPost.author.role} · {selectedPost.publishedAt} · {selectedPost.readTime}</div>
                    </div>
                  </div>

                  {/* Article Body */}
                  <div className="prose prose-orange max-w-none text-slate-600 leading-relaxed text-base space-y-5 article-content">
                    {selectedPost.body.trim().startsWith("<") ? (
                      <div dangerouslySetInnerHTML={{ __html: selectedPost.body }} />
                    ) : (
                      selectedPost.body.split("\n\n").map((para, i) => (
                        <p key={i}>{para}</p>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  <div className="mt-14 pt-6 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
                    <span>Published by {brandName} CMS</span>
                    <button 
                      onClick={() => setSelectedPost(null)}
                      className="font-bold text-brand-navy hover:text-brand-orange transition-colors cursor-pointer"
                    >
                      ← Back to Articles
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>
          </div>
        </>
      )}

      {/* 3D Dog Name Generator Modal */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 backdrop-blur-xs transition-opacity p-4">
          <div className="absolute inset-0" onClick={() => setIsJoinModalOpen(false)} />
          
          <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 animate-slide-in grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <button 
              onClick={() => setIsJoinModalOpen(false)}
              className="absolute top-4 right-4 h-8 w-8 rounded-full bg-slate-100 hover:bg-orange-100 flex items-center justify-center text-slate-500 hover:text-brand-orange font-bold text-sm transition-all"
            >
              ✕
            </button>

            {/* Left Column: Custom Tag Preview */}
            <div className="flex flex-col items-center justify-center h-full">
              <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider mb-2">
                Engraved Tag Preview
              </span>
              <div className="relative bg-slate-50 border border-slate-100 rounded-2xl p-2 shadow-inner w-full flex justify-center items-center min-h-[220px]">
                <DogTagStatic name={generatedName} />
              </div>
            </div>

            {/* Right Column: Filters and Actions */}
            <div className="flex flex-col gap-4 text-xs font-semibold">
              <div>
                <h3 className="font-display font-extrabold text-brand-navy text-lg leading-tight">
                  Lucky Name Generator
                </h3>
                <p className="text-slate-400 text-[10px] font-medium leading-relaxed mt-1">
                  Pick the personality metrics below and click the button to generate and engrave a lucky name.
                </p>
              </div>

              {/* Gender Selector */}
              <div>
                <span className="block text-slate-500 mb-1 text-[10px] uppercase tracking-wider">Dog Gender</span>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Male", "Female", "Unisex"] as const).map(g => (
                    <button
                      key={g}
                      onClick={() => setSelectedGender(g)}
                      className={`py-1.5 rounded-lg border transition-all text-[10px] font-bold ${
                        selectedGender === g
                          ? "bg-brand-navy border-brand-navy text-white"
                          : "bg-white border-slate-200 text-slate-500 hover:border-orange-200"
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vibe Selector */}
              <div>
                <span className="block text-slate-500 mb-1 text-[10px] uppercase tracking-wider">Personality Vibe</span>
                <div className="grid grid-cols-2 gap-1.5">
                  {(["Playful", "Regal", "Tough", "Cute", "Classic"] as const).map(v => (
                    <button
                      key={v}
                      onClick={() => setSelectedVibe(v)}
                      className={`py-1.5 rounded-lg border transition-all text-[10px] font-bold ${
                        selectedVibe === v
                          ? "bg-brand-orange border-brand-orange text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-500 hover:border-orange-200"
                      }`}
                    >
                      {v === "Playful" ? "🎪 " : v === "Regal" ? "👑 " : v === "Tough" ? "⚡ " : v === "Cute" ? "🧸 " : "📖 "}
                      {v}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Trigger */}
              <button
                onClick={() => {
                  const names = dogNamesDB[selectedVibe]?.[selectedGender] || ["Milo"];
                  const randomName = names[Math.floor(Math.random() * names.length)];
                  setGeneratedName(randomName);
                  setSpinTrigger(prev => prev + 1);
                  synthesizeBark();
                  
                  // Spawn treat items on the page
                  const newEffect = {
                    id: Date.now(),
                    x: Math.random() * 80 + 10,
                    label: "🎉"
                  };
                  setTreatEffects((prev) => [...prev, newEffect]);
                  setTimeout(() => {
                    setTreatEffects((prev) => prev.filter((item) => item.id !== newEffect.id));
                  }, 1500);
                }}
                className="w-full rounded-xl bg-brand-navy text-white hover:bg-brand-orange p-3.5 text-xs font-bold transition-all shadow-md transform hover:-translate-y-0.5 mt-2 flex items-center justify-center gap-1"
              >
                Generate Lucky Name 🔊
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-slate-100 bg-slate-50 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display text-lg font-bold tracking-tight text-brand-navy">
              {brandName}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            &copy; 2026 {brandName}. All rights reserved. Designed for dog enthusiasts worldwide.
          </p>
          <div className="flex items-center gap-6 text-sm text-slate-500">
            <a href="/about" id="footer-link-about" className="hover:text-brand-orange transition-colors">About Us</a>
            <a href="/contact" id="footer-link-contact" className="hover:text-brand-orange transition-colors">Contact</a>
            <a href="/privacy" id="footer-link-privacy" className="hover:text-brand-orange transition-colors">Privacy Policy</a>
            <a href="/terms" id="footer-link-terms" className="hover:text-brand-orange transition-colors">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Static Custom Dog Collar Tag renderer with scramble text reveal animation
interface DogTagStaticProps {
  name: string;
}

function DogTagStatic({ name }: DogTagStaticProps) {
  const [displayText, setDisplayText] = useState("");
  const [isScrambling, setIsScrambling] = useState(false);

  useEffect(() => {
    if (!name) {
      setDisplayText("");
      return;
    }

    setIsScrambling(true);
    let iterations = 0;
    const targetName = name.toUpperCase();
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    const interval = setInterval(() => {
      setDisplayText(
        targetName
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < Math.floor(iterations)) return targetName[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("")
      );
      
      iterations += 0.3; // speed of revealing letters
      
      if (iterations >= targetName.length) {
        setDisplayText(targetName);
        setIsScrambling(false);
        clearInterval(interval);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [name]);

  return (
    <div className="flex flex-col items-center gap-4 w-full p-2 select-none">
      {/* Clean Custom Name Tag Image (No text overlaid on it) */}
      <div className="w-52 h-40 rounded-2xl overflow-hidden shadow-md border border-slate-200/50 bg-white">
        <img
          src="/assets/Custom_name_tag_Woofs_N_202607250807.jpeg"
          alt="Custom Name Tag"
          className="w-full h-full object-cover hover:scale-102 transition-transform duration-300"
        />
      </div>

      {/* Name Typography in the free space below */}
      <div className="w-full max-w-[208px] text-center px-4 py-3 bg-gradient-to-br from-orange-50/60 to-amber-50/60 rounded-2xl border border-orange-100/50 shadow-xs">
        <span className="text-[9px] text-brand-orange font-bold uppercase tracking-widest block mb-1">
          Engraved Name
        </span>
        {displayText ? (
          <div>
            <h4 
              className="font-display font-black bg-gradient-to-r from-brand-navy via-brand-orange to-amber-600 bg-clip-text text-transparent tracking-wide uppercase px-1 leading-none py-1"
              style={{ fontSize: `${Math.max(16, Math.min(26, 220 / displayText.length))}px` }}
            >
              {displayText}
            </h4>
            <span className="block text-[8px] font-bold text-slate-400 tracking-widest mt-1 uppercase">
              🐾 lucky dog tag 🐾
            </span>
          </div>
        ) : (
          <h4 className="font-display font-bold text-slate-300 text-sm tracking-wide uppercase py-1">
            Waiting to generate...
          </h4>
        )}
      </div>
    </div>
  );
}

// authorative dog names database categorized by personality and gender
const dogNamesDB: Record<string, Record<string, string[]>> = {
  Playful: {
    Male: ["Cooper", "Milo", "Ziggy", "Buster", "Ollie"],
    Female: ["Bella", "Daisy", "Lola", "Piper", "Penny"],
    Unisex: ["Biscuit", "Marley", "Peanut", "Coco", "Lucky"]
  },
  Regal: {
    Male: ["Winston", "Thor", "Duke", "Zeus", "Apollo"],
    Female: ["Athena", "Cleo", "Lady", "Duchess", "Zelda"],
    Unisex: ["Bailey", "Royal", "Harley", "Shadow", "Sky"]
  },
  Tough: {
    Male: ["Rex", "Rocky", "Diesel", "Spike", "Jax"],
    Female: ["Roxy", "Xena", "Harley", "Katniss", "Storm"],
    Unisex: ["Bandit", "Rebel", "Hunter", "Onyx", "Blaze"]
  },
  Cute: {
    Male: ["Teddy", "Pip", "Toby", "Gizmo", "Barnaby"],
    Female: ["Chloe", "Lily", "Sophie", "Zoe", "Rosie"],
    Unisex: ["Cookie", "Mochi", "Cupcake", "Waffles", "Pumpkin"]
  },
  Classic: {
    Male: ["Max", "Charlie", "Jack", "Buddy", "Toby"],
    Female: ["Lucy", "Sadie", "Molly", "Maggie", "Ellie"],
    Unisex: ["Riley", "Casey", "Sam", "Frankie", "Scout"]
  }
};

// Helper to extract the first image in an article body html string, with fallback assets
const SANITY_CDN = "https://cdn.sanity.io/images/x4mx0fr5/production";

const resolveAssetUrl = (url: string) => {
  if (url.startsWith("asset://image-")) {
    const rest = url.slice("asset://image-".length);
    const lastDash = rest.lastIndexOf("-");
    const ext = rest.slice(lastDash + 1);
    const ref = rest.slice(0, lastDash);
    return `${SANITY_CDN}/${ref}.${ext}`;
  }
  return url;
};

const getFirstImageUrl = (bodyContent: string, category: string) => {
  if (!bodyContent) return getFallbackImage(category);

  const match = bodyContent.match(/<img[^>]+src=["']([^"']+)["']/i);
  if (match && match[1]) {
    return resolveAssetUrl(match[1]);
  }

  return getFallbackImage(category);
};

const getFallbackImage = (category: string) => {
  if (category === "Nutrition") {
    return "/assets/fallback-nutrition.png";
  } else if (category === "Training & Behavior") {
    return "/assets/fallback-training.png";
  }
  return "/assets/fallback-health.png";
};
