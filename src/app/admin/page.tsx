"use client";

import React, { useState, useEffect } from "react";
import { isSanityConfigured, fallbackPosts, Post } from "@/lib/sanity";

export default function AdminPage() {
  const [configured, setConfigured] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<"overview" | "database" | "create" | "settings">("overview");

  // Editor form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Health & Wellness");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [readTime, setReadTime] = useState("5 min read");
  const [authorName, setAuthorName] = useState("Dr. Sarah Jenkins");
  const [authorRole, setAuthorRole] = useState("Veterinarian");
  const [localImportPath, setLocalImportPath] = useState("");

  // Admin authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const authStatus = sessionStorage.getItem("admin-authenticated");
      if (authStatus === "true") {
        setIsAuthenticated(true);
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "Begusarai@101") {
      setIsAuthenticated(true);
      sessionStorage.setItem("admin-authenticated", "true");
      setAuthError("");
    } else {
      setAuthError("❌ Incorrect password. Please try again.");
    }
  };

  // Branding Settings State
  const [brandName, setBrandName] = useState("Woof & Wag");
  const [heroAccent, setHeroAccent] = useState("Dog Lovers & Seekers");
  const [heroText, setHeroText] = useState(
    "Welcome to Woof & Wag. Feed Milo a virtual treat on the right or scroll down to see the background video seamlessly fade into a playful toy-chewing scene as you browse articles."
  );

  // Sanitize raw HTML documents: strip DOCTYPE, html, head, style, script, body wrappers
  // so only the article content remains (safe for dangerouslySetInnerHTML inside the modal)
  const sanitizeArticleHtml = (raw: string): string => {
    let html = raw;

    // Remove <!DOCTYPE ...>
    html = html.replace(/<!DOCTYPE[^>]*>/gi, "");

    // Remove <script ...>...</script> blocks (including JSON-LD schema)
    html = html.replace(/<script[\s\S]*?<\/script>/gi, "");

    // Remove <style ...>...</style> blocks
    html = html.replace(/<style[\s\S]*?<\/style>/gi, "");

    // Remove <head>...</head> entirely
    html = html.replace(/<head[\s\S]*?<\/head>/gi, "");

    // Remove <meta .../> tags
    html = html.replace(/<meta[^>]*\/?>/gi, "");

    // Remove <link .../> tags
    html = html.replace(/<link[^>]*\/?>/gi, "");

    // Remove <title>...</title>
    html = html.replace(/<title[\s\S]*?<\/title>/gi, "");

    // Unwrap <html ...> and </html>
    html = html.replace(/<\/?html[^>]*>/gi, "");

    // Unwrap <body ...> and </body>
    html = html.replace(/<\/?body[^>]*>/gi, "");

    // Trim leading/trailing whitespace
    return html.trim();
  };

  const parseHtmlAndAutofill = (htmlContent: string) => {
    if (!htmlContent || !htmlContent.trim().startsWith("<")) return;

    // Helper to strip HTML tags
    const stripTags = (str: string) => str.replace(/<\/?[^>]+(>|$)/g, "").trim();

    // Helper to extract meta tag content by name or property
    const getMeta = (attr: string, value: string): string => {
      const regex = new RegExp(`<meta\\s+(?:[^>]*?)?(?:name|property)=["']${value}["'][^>]*?content=["']([^"']*?)["']`, "i");
      const match = htmlContent.match(regex);
      if (match) return match[1].trim();
      // Try reversed attribute order (content before name/property)
      const regex2 = new RegExp(`<meta\\s+(?:[^>]*?)?content=["']([^"']*?)["'][^>]*?(?:name|property)=["']${value}["']`, "i");
      const match2 = htmlContent.match(regex2);
      return match2 ? match2[1].trim() : "";
    };

    // 1. Detect Title — prefer <title> tag, then <meta og:title>, then first <h1>/<h2>
    const titleTagMatch = htmlContent.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const ogTitle = getMeta("property", "og:title");
    const h1Match = htmlContent.match(/<h[12][^>]*>([\s\S]*?)<\/h[12]>/i);

    if (titleTagMatch && titleTagMatch[1]) {
      setTitle(stripTags(titleTagMatch[1]));
    } else if (ogTitle) {
      setTitle(ogTitle);
    } else if (h1Match && h1Match[1]) {
      setTitle(stripTags(h1Match[1]));
    }

    // 2. Detect Excerpt — prefer <meta description>, then first callout <p>, then first body <p>
    const metaDescription = getMeta("name", "description");
    if (metaDescription) {
      const excerpt = metaDescription.length > 150 ? metaDescription.substring(0, 147) + "..." : metaDescription;
      setExcerpt(excerpt);
    } else {
      let excerptText = "";
      const calloutMatch = htmlContent.match(/class=["']expert-callout["'][^>]*>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>/i);
      if (calloutMatch && calloutMatch[1]) {
        excerptText = stripTags(calloutMatch[1]);
      } else {
        // Skip author byline paragraphs
        const pMatches = htmlContent.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi);
        for (const m of pMatches) {
          const text = stripTags(m[1]);
          if (text.length > 30 && !text.startsWith("By ") && !text.match(/^(Dr\.|Author|Published|Written)/i)) {
            excerptText = text;
            break;
          }
        }
      }
      if (excerptText) {
        if (excerptText.length > 150) excerptText = excerptText.substring(0, 147) + "...";
        setExcerpt(excerptText);
      }
    }

    // 3. Calculate Read Time — strip all HTML, count words in body content only
    let bodyForCounting = htmlContent;
    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    if (bodyMatch) bodyForCounting = bodyMatch[1];
    const cleanText = stripTags(bodyForCounting);
    const wordCount = cleanText.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(wordCount / 200));
    setReadTime(`${minutes} min read`);

    // 4. Detect Category — prefer <meta article:section>, then keyword matching
    const metaSection = getMeta("property", "article:section");
    if (metaSection) {
      const sectionLower = metaSection.toLowerCase();
      if (sectionLower.includes("training") || sectionLower.includes("behavi") || sectionLower.includes("exercise")) {
        setCategory("Training & Behavior");
      } else if (sectionLower.includes("nutrition") || sectionLower.includes("food") || sectionLower.includes("diet")) {
        setCategory("Nutrition");
      } else if (sectionLower.includes("health") || sectionLower.includes("wellness") || sectionLower.includes("vet")) {
        setCategory("Health & Wellness");
      }
    } else {
      // Fallback: keyword detection from content
      const contentLower = htmlContent.toLowerCase();
      if (
        contentLower.includes("training") || 
        contentLower.includes("behavior") || 
        contentLower.includes("behaviour") || 
        contentLower.includes("bite") || 
        contentLower.includes("mouthing") || 
        contentLower.includes("nipping") ||
        contentLower.includes("exercise") ||
        contentLower.includes("routine") ||
        contentLower.includes("habit") ||
        contentLower.includes("activity") ||
        contentLower.includes("barking") ||
        contentLower.includes("command") ||
        contentLower.includes("obedience")
      ) {
        setCategory("Training & Behavior");
      } else if (
        contentLower.includes("nutrition") || 
        contentLower.includes("diet") || 
        contentLower.includes("treat") || 
        contentLower.includes("food") ||
        contentLower.includes("kibble") ||
        contentLower.includes("meal") ||
        contentLower.includes("ingredient") ||
        contentLower.includes("feed")
      ) {
        setCategory("Nutrition");
      } else if (
        contentLower.includes("health") || 
        contentLower.includes("wellness") || 
        contentLower.includes("vet") || 
        contentLower.includes("medical") || 
        contentLower.includes("teething") ||
        contentLower.includes("injury") ||
        contentLower.includes("vaccine") ||
        contentLower.includes("disease")
      ) {
        setCategory("Health & Wellness");
      }
    }

    // 5. Detect Author — prefer <meta author>, then "Dr." pattern in body
    const metaAuthor = getMeta("name", "author");
    if (metaAuthor) {
      setAuthorName(metaAuthor);
      if (metaAuthor.startsWith("Dr")) {
        setAuthorRole("Veterinarian");
      }
    } else {
      const authorMatch = htmlContent.match(/(?:Dr\.|Dr)\s+[A-Z][a-z]+\s+[A-Z][a-z]+/);
      if (authorMatch) {
        setAuthorName(authorMatch[0]);
        setAuthorRole("Veterinarian");
      }
    }
  };

  useEffect(() => {
    setConfigured(isSanityConfigured);
    
    // Load posts with fallbacks
    let local = null;
    try {
      local = localStorage.getItem("woof-wag-mock-posts") || sessionStorage.getItem("woof-wag-mock-posts");
    } catch (e) {
      console.warn("Storage read failed", e);
    }
    
    if (local) {
      setPosts(JSON.parse(local));
    } else if ((window as any).woofWagMockPosts) {
      setPosts((window as any).woofWagMockPosts);
    } else {
      setPosts(fallbackPosts);
    }

    // Load settings with fallbacks
    let localBrandName = null;
    let localHeroAccent = null;
    let localHeroText = null;
    try {
      localBrandName = localStorage.getItem("woof-wag-brand-name") || sessionStorage.getItem("woof-wag-brand-name");
      localHeroAccent = localStorage.getItem("woof-wag-hero-accent") || sessionStorage.getItem("woof-wag-hero-accent");
      localHeroText = localStorage.getItem("woof-wag-hero-text") || sessionStorage.getItem("woof-wag-hero-text");
    } catch (e) {
      console.warn("Storage read failed", e);
    }

    if (localBrandName) setBrandName(localBrandName);
    else if ((window as any).woofWagBrandName) setBrandName((window as any).woofWagBrandName);

    if (localHeroAccent) setHeroAccent(localHeroAccent);
    else if ((window as any).woofWagHeroAccent) setHeroAccent((window as any).woofWagHeroAccent);

    if (localHeroText) setHeroText(localHeroText);
    else if ((window as any).woofWagHeroText) setHeroText((window as any).woofWagHeroText);
  }, []);

  const handleAddPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !excerpt || !body) return alert("Please fill out all required fields!");

    let categoryColor = "text-emerald-700 bg-emerald-50 border-emerald-100";
    let avatarColor = "bg-amber-100 text-amber-800";
    
    if (category === "Training & Behavior") {
      categoryColor = "text-blue-700 bg-blue-50 border-blue-100";
      avatarColor = "bg-blue-100 text-blue-800";
    } else if (category === "Nutrition") {
      categoryColor = "text-orange-700 bg-orange-50 border-orange-100";
      avatarColor = "bg-rose-100 text-rose-800";
    }

    const newPost: Post = {
      id: `mock-${Date.now()}`,
      title,
      slug: { current: title.toLowerCase().replace(/[^a-z0-9]+/g, "-") },
      category,
      categoryColor,
      excerpt,
      body,
      readTime,
      publishedAt: new Date().toISOString().split("T")[0],
      author: {
        name: authorName,
        role: authorRole,
        avatarColor
      }
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    
    let savedToLocalStorage = false;
    let savedToSessionStorage = false;
    try {
      localStorage.setItem("woof-wag-mock-posts", JSON.stringify(updated));
      savedToLocalStorage = true;
    } catch (error) {
      console.warn("LocalStorage setItem failed. Attempting sessionStorage.", error);
      try {
        sessionStorage.setItem("woof-wag-mock-posts", JSON.stringify(updated));
        savedToSessionStorage = true;
      } catch (sessError) {
        console.warn("SessionStorage setItem failed. Using in-memory array.", sessError);
      }
    }
    
    // Always persist to in-memory window object as last fallback
    (window as any).woofWagMockPosts = updated;

    // Reset fields
    setTitle("");
    setExcerpt("");
    setBody("");
    
    if (savedToLocalStorage) {
      alert("Article created! It is now live on the homepage.");
    } else if (savedToSessionStorage) {
      alert("Article created successfully! It is saved to temporary Session Storage (Local Storage quota is full).");
    } else {
      alert("Article created successfully! It is active for this session (Local/Session Storage limits exceeded).");
    }
    setActiveTab("database");
  };

  const handleHtmlFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let htmlFile: File | null = null;
    const imageFiles: File[] = [];

    // Separate HTML file from image files
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.name.endsWith(".html") || file.name.endsWith(".htm")) {
        htmlFile = file;
      } else if (file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp)$/i.test(file.name)) {
        imageFiles.push(file);
      }
    }

    if (!htmlFile) {
      alert("❌ Please select at least one HTML article file (.html)!");
      return;
    }

    const htmlReader = new FileReader();
    htmlReader.onload = async (htmlEvent) => {
      let htmlContent = htmlEvent.target?.result as string;
      if (!htmlContent) return;

      // If images were selected, read as base64 and replace inline
      if (imageFiles.length > 0) {
        const readImageAsBase64 = (file: File): Promise<{ name: string; dataUrl: string }> => {
          return new Promise((resolve) => {
            const imgReader = new FileReader();
            imgReader.onload = (imgEvent) => {
              resolve({
                name: file.name,
                dataUrl: imgEvent.target?.result as string
              });
            };
            imgReader.readAsDataURL(file);
          });
        };

        const base64Images = await Promise.all(imageFiles.map(readImageAsBase64));

        base64Images.forEach((img) => {
          // Replace any references like src="images/filename.png" or src="filename.png" or src="./images/filename.png"
          const escapedName = img.name.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`src=["'](?:images\\/|\\.\\/images\\/)?${escapedName}["']`, 'gi');
          htmlContent = htmlContent.replace(regex, `src="${img.dataUrl}"`);
        });
      }

      parseHtmlAndAutofill(htmlContent);
      setBody(sanitizeArticleHtml(htmlContent));

      if (imageFiles.length > 0) {
        alert(`⚡ Article loaded! Embedded ${imageFiles.length} images directly into the HTML (Base64 data URLs) and auto-detected metadata!`);
      } else {
        alert("⚡ HTML article loaded successfully (no associated images uploaded).");
      }
    };
    htmlReader.readAsText(htmlFile);
  };

  const handleHtmlFolderImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    let htmlFile: File | null = null;
    const imageFiles: File[] = [];

    // Traverse directory structure
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const name = file.name.toLowerCase();
      if (name.endsWith(".html") || name.endsWith(".htm")) {
        htmlFile = file;
      } else if (file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp)$/i.test(name)) {
        imageFiles.push(file);
      }
    }

    if (!htmlFile) {
      alert("❌ Could not find any HTML article file (.html) inside the selected folder!");
      return;
    }

    const htmlReader = new FileReader();
    htmlReader.onload = async (htmlEvent) => {
      let htmlContent = htmlEvent.target?.result as string;
      if (!htmlContent) return;

      if (imageFiles.length > 0) {
        const readImageAsBase64 = (file: File): Promise<{ filename: string; dataUrl: string }> => {
          return new Promise((resolve) => {
            const imgReader = new FileReader();
            imgReader.onload = (imgEvent) => {
              resolve({
                filename: file.name,
                dataUrl: imgEvent.target?.result as string
              });
            };
            imgReader.readAsDataURL(file);
          });
        };

        const base64Images = await Promise.all(imageFiles.map(readImageAsBase64));

        base64Images.forEach((img) => {
          // Replace any references like src="images/filename.png" or src="filename.png"
          const escapedName = img.filename.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
          const regex = new RegExp(`src=["'](?:images\\/|\\.\\/images\\/)?${escapedName}["']`, 'gi');
          htmlContent = htmlContent.replace(regex, `src="${img.dataUrl}"`);
        });
      }

      parseHtmlAndAutofill(htmlContent);
      setBody(sanitizeArticleHtml(htmlContent));
      alert(`⚡ Folder imported! Found HTML article and successfully embedded ${imageFiles.length} images directly (Base64 data URLs) and auto-filled metadata!`);
    };
    htmlReader.readAsText(htmlFile);
  };

  const handleLocalPathImport = async () => {
    if (!localImportPath) {
      alert("Please paste a local folder path first!");
      return;
    }

    try {
      const res = await fetch("/api/import", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ folderPath: localImportPath })
      });

      const data = await res.json();
      if (data.error) {
        alert(`❌ Import Failed: ${data.error}`);
        return;
      }

      if (data.html) {
        parseHtmlAndAutofill(data.html);
        setBody(sanitizeArticleHtml(data.html));
        alert("⚡ Successfully imported local article folder! All images have been embedded as inline Base64 data URLs!");
      }
    } catch (err: any) {
      alert(`❌ Connection error: ${err.message}`);
    }
  };

  const handleDeletePost = (id: string | number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      const updated = posts.filter(post => post.id !== id);
      setPosts(updated);
      
      try {
        localStorage.setItem("woof-wag-mock-posts", JSON.stringify(updated));
      } catch (error) {
        try {
          sessionStorage.setItem("woof-wag-mock-posts", JSON.stringify(updated));
        } catch (sessError) {
          console.warn("Failed to persist deletions", sessError);
        }
      }
      (window as any).woofWagMockPosts = updated;
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    let savedToLocalStorage = false;
    let savedToSessionStorage = false;
    try {
      localStorage.setItem("woof-wag-brand-name", brandName);
      localStorage.setItem("woof-wag-hero-accent", heroAccent);
      localStorage.setItem("woof-wag-hero-text", heroText);
      savedToLocalStorage = true;
    } catch (error) {
      console.warn("LocalStorage setItem failed. Attempting sessionStorage.", error);
      try {
        sessionStorage.setItem("woof-wag-brand-name", brandName);
        sessionStorage.setItem("woof-wag-hero-accent", heroAccent);
        sessionStorage.setItem("woof-wag-hero-text", heroText);
        savedToSessionStorage = true;
      } catch (sessError) {
        console.warn("SessionStorage setItem failed. Using in-memory variables.", sessError);
      }
    }
    
    (window as any).woofWagBrandName = brandName;
    (window as any).woofWagHeroAccent = heroAccent;
    (window as any).woofWagHeroText = heroText;
    
    if (savedToLocalStorage) {
      alert("Branding settings saved successfully! Homepage updated.");
    } else if (savedToSessionStorage) {
      alert("Settings saved to temporary Session Storage (LocalStorage quota full). Homepage updated.");
    } else {
      alert("Settings updated in temporary memory. Homepage updated.");
    }
  };

  const handleResetAll = () => {
    if (confirm("This will reset all articles and branding back to defaults. Continue?")) {
      try {
        localStorage.removeItem("woof-wag-mock-posts");
        localStorage.removeItem("woof-wag-brand-name");
        localStorage.removeItem("woof-wag-hero-accent");
        localStorage.removeItem("woof-wag-hero-text");
        
        sessionStorage.removeItem("woof-wag-mock-posts");
        sessionStorage.removeItem("woof-wag-brand-name");
        sessionStorage.removeItem("woof-wag-hero-accent");
        sessionStorage.removeItem("woof-wag-hero-text");
      } catch (e) {
        // Ignored
      }
      
      delete (window as any).woofWagMockPosts;
      delete (window as any).woofWagBrandName;
      delete (window as any).woofWagHeroAccent;
      delete (window as any).woofWagHeroText;
      
      setPosts(fallbackPosts);
      setBrandName("Woof & Wag");
      setHeroAccent("Dog Lovers & Seekers");
      setHeroText("Welcome to Woof & Wag. Feed Milo a virtual treat on the right or scroll down to see the background video seamlessly fade into a playful toy-chewing scene as you browse articles.");
      
      alert("System restored to factory defaults.");
      window.location.reload();
    }
  };

  // Schema code for Sanity studio
  const schemaCode = `// schemas/post.ts
export default {
  name: 'post',
  title: 'Blog Post',
  type: 'document',
  fields: [
    { name: 'title', title: 'Title', type: 'string' },
    { name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title' } },
    { name: 'category', title: 'Category', type: 'string' },
    { name: 'categoryColor', title: 'Category Color Classes', type: 'string' },
    { name: 'excerpt', title: 'Excerpt', type: 'text' },
    { name: 'body', title: 'Body Text', type: 'text' },
    { name: 'readTime', title: 'Read Time (e.g., \"5 min read\")', type: 'string' },
    { name: 'publishedAt', title: 'Published Date', type: 'date' },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }]
    }
  ]
}`;

  // Compute category stats
  const nutritionCount = posts.filter(p => p.category === "Nutrition").length;
  const healthCount = posts.filter(p => p.category === "Health & Wellness").length;
  const trainingCount = posts.filter(p => p.category === "Training & Behavior").length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 selection:bg-brand-orange selection:text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-95" />
        
        <div className="relative w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl animate-fade-in text-center">
          <div className="h-14 w-14 rounded-full bg-brand-orange/20 flex items-center justify-center text-2xl mx-auto mb-6 border border-brand-orange/30 animate-pulse">
            🔒
          </div>

          <h2 className="font-display font-extrabold text-white text-xl">Staff Access Required</h2>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            Please enter the system password to access the CMS & configuration settings.
          </p>

          <form onSubmit={handleLogin} className="mt-8 space-y-4 text-xs font-semibold text-left">
            <div>
              <label className="block text-slate-300 mb-1.5 uppercase tracking-wide text-[10px]">Password</label>
              <input
                id="admin-password-input"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-white font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange placeholder-slate-600 transition-all"
              />
            </div>

            {authError && (
              <p id="admin-auth-error" className="text-rose-400 text-[10px] mt-2 font-bold animate-bounce">
                {authError}
              </p>
            )}

            <button
              id="admin-unlock-btn"
              type="submit"
              className="w-full rounded-xl bg-brand-orange p-3 text-xs font-bold text-white hover:bg-brand-navy hover:shadow-lg transition-all transform hover:-translate-y-0.5 mt-4 cursor-pointer"
            >
              Unlock Dashboard &rarr;
            </button>
          </form>

          <a 
            href="/"
            className="inline-block text-[10px] text-slate-400 hover:text-white font-bold transition-colors mt-6 uppercase tracking-wider"
          >
            &larr; Back to Site
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-200 pb-6 mb-8 gap-4">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-brand-navy">
              Control Panel & CMS Config
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Configure your Sanity Headless CMS integrations and test layouts with local playgrounds.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              id="admin-btn-reset-system"
              onClick={handleResetAll}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-500 hover:text-rose-600 shadow-sm transition-all"
            >
              Reset System
            </button>
            <a
              href="/"
              id="admin-link-view-site"
              className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-4 py-2 text-xs font-semibold text-white shadow-md hover:bg-brand-orange hover:shadow-lg transition-all"
            >
              &larr; View Live Site
            </a>
          </div>
        </div>

        {/* CMS Configuration Diagnostics Banner */}
        <div className={`mb-8 p-6 rounded-2xl border ${
          configured 
            ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
            : "bg-amber-50 border-amber-200 text-amber-800"
        }`}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-start gap-4">
              <span className="text-3xl">{configured ? "⚡" : "⚙️"}</span>
              <div>
                <h3 className="font-bold text-lg">
                  {configured ? "CMS Connected successfully" : "CMS Local Fallback Mode Active"}
                </h3>
                <p className="text-sm mt-1 opacity-90 leading-relaxed">
                  {configured 
                    ? "Next.js is successfully connected to your live Sanity dataset. Ready to serve production posts." 
                    : "No environment variables found (`NEXT_PUBLIC_SANITY_PROJECT_ID` is unset). The application is currently serving custom static articles."}
                </p>
              </div>
            </div>
            {!configured && (
              <span className="inline-flex items-center rounded-md bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800 border border-amber-200 uppercase tracking-wide">
                Simulated Database
              </span>
            )}
          </div>
        </div>

        {/* Tab Controls Navigation */}
        <div className="flex border-b border-slate-200 mb-8 overflow-x-auto gap-6 text-sm font-semibold">
          {[
            { id: "overview", label: "Overview & Analytics", icon: "📊" },
            { id: "database", label: `Articles Database (${posts.length})`, icon: "📖" },
            { id: "create", label: "Write Article", icon: "✍️" },
            { id: "settings", label: "Site Branding Settings", icon: "⚙️" }
          ].map((tab) => (
            <button
              key={tab.id}
              id={`admin-tab-btn-${tab.id}`}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 border-b-2 transition-all whitespace-nowrap flex items-center gap-2 px-1 ${
                activeTab === tab.id
                  ? "border-brand-orange text-brand-orange"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Contents */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Main Left Side Area (Changes based on selected Tab) */}
          <div className="lg:col-span-8">
            
            {/* TAB 1: OVERVIEW & STATS */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Stats Widgets */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-2xl">📚</span>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3">Total Articles</h4>
                    <p className="text-3xl font-extrabold text-brand-navy mt-1">{posts.length}</p>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">100% active on site</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-2xl">📈</span>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3">Simulated Reads</h4>
                    <p className="text-3xl font-extrabold text-brand-navy mt-1">48,320</p>
                    <span className="text-[10px] text-emerald-600 font-semibold mt-1 inline-block">+12% increase this month</span>
                  </div>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <span className="text-2xl">👩‍⚕️</span>
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-3">Contributors</h4>
                    <p className="text-3xl font-extrabold text-brand-navy mt-1">3</p>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 inline-block">All Veterinary Approved</span>
                  </div>
                </div>

                {/* Category distribution bar chart */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-display font-bold text-brand-navy text-lg mb-6">Category Distribution</h3>
                  <div className="space-y-4">
                    {[
                      { name: "Health & Wellness", count: healthCount, color: "bg-emerald-500", percent: posts.length ? (healthCount / posts.length) * 100 : 0 },
                      { name: "Training & Behavior", count: trainingCount, color: "bg-blue-500", percent: posts.length ? (trainingCount / posts.length) * 100 : 0 },
                      { name: "Nutrition", count: nutritionCount, color: "bg-orange-500", percent: posts.length ? (nutritionCount / posts.length) * 100 : 0 }
                    ].map((cat) => (
                      <div key={cat.name} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-700">{cat.name}</span>
                          <span className="text-slate-400">{cat.count} articles ({Math.round(cat.percent)}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                          <div 
                            style={{ width: `${cat.percent}%` }}
                            className={`${cat.color} h-full rounded-full transition-all duration-500`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick actions guide */}
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                  <h3 className="font-display font-bold text-brand-navy text-lg mb-4">Quick Setup Guide</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">
                    Connecting your own database is simple. Follow the schema code reference on the right sidebar, input your project configuration variables inside `.env.local`, and restart the developer build environment.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: ARTICLES DATABASE LIST */}
            {activeTab === "database" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-display font-bold text-brand-navy text-lg">Manage Blog Posts</h3>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{posts.length} Items</span>
                </div>
                <div className="overflow-x-auto">
                  {posts.length === 0 ? (
                    <div className="text-center py-12">
                      <span className="text-3xl">📖</span>
                      <h4 className="font-bold text-slate-700 mt-2">No articles in database</h4>
                      <p className="text-xs text-slate-400 mt-1">Write a new article to get started.</p>
                    </div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-50 text-slate-400 border-b border-slate-100 uppercase tracking-wider font-bold text-[9px]">
                          <th className="py-3 px-6">Title</th>
                          <th className="py-3 px-4">Category</th>
                          <th className="py-3 px-4">Author</th>
                          <th className="py-3 px-4">Published At</th>
                          <th className="py-3 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                        {posts.map((post) => (
                          <tr key={post.id} className="hover:bg-slate-50/40 transition-colors">
                            <td className="py-4 px-6 font-bold text-brand-navy max-w-xs truncate">{post.title}</td>
                            <td className="py-4 px-4">
                              <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold border ${post.categoryColor}`}>
                                {post.category}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-slate-500">{post.author.name}</td>
                            <td className="py-4 px-4 text-slate-400">{post.publishedAt}</td>
                            <td className="py-4 px-6 text-right">
                              <button
                                onClick={() => handleDeletePost(post.id)}
                                className="text-rose-500 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1 rounded-full transition-colors font-bold text-[10px]"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: CREATE ARTICLE FORM */}
            {activeTab === "create" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-display text-lg font-bold text-brand-navy border-b border-slate-100 pb-3 mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <span>Write Blog Article</span>
                  <span className="text-[10px] text-brand-orange font-normal italic">
                    ⚡ Paste HTML or upload a .html file to auto-detect fields!
                  </span>
                </h3>

                {/* Direct HTML File / Folder Uploader */}
                <div className="mb-6 p-4 rounded-xl bg-orange-50/50 border border-dashed border-brand-orange/30 space-y-3">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="font-bold text-brand-navy text-xs">Direct Article & Local Folder Import</h4>
                      <p className="text-[10px] text-slate-500 font-medium">Select your output folder or paste the absolute local path to automatically embed all images.</p>
                    </div>
                    <div className="flex flex-wrap gap-2 shrink-0">
                      <label className="cursor-pointer rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-[9px] font-bold text-slate-700 shadow-sm transition-all transform hover:-translate-y-0.5">
                        <span>📂 Select Files</span>
                        <input
                          type="file"
                          multiple
                          accept=".html,.htm,.png,.jpg,.jpeg,.webp"
                          onChange={handleHtmlFileImport}
                          className="hidden"
                        />
                      </label>
                      <label className="cursor-pointer rounded-full bg-slate-100 hover:bg-slate-200 px-3 py-1.5 text-[9px] font-bold text-slate-700 shadow-sm transition-all transform hover:-translate-y-0.5">
                        <span>📁 Select Folder</span>
                        <input
                          type="file"
                          {...{ webkitdirectory: "", directory: "" } as any}
                          onChange={handleHtmlFolderImport}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  
                  {/* Local path quick import */}
                  <div className="flex gap-2 text-[10px]">
                    <input
                      type="text"
                      placeholder="e.g., C:\Users\Administrator\Desktop\article\article-forge\output\canine-exercise-routine-habit-formation-2026"
                      value={localImportPath}
                      onChange={(e) => setLocalImportPath(e.target.value)}
                      className="flex-1 rounded-lg border border-slate-200 px-3 py-1.5 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white shadow-inner"
                    />
                    <button
                      type="button"
                      onClick={handleLocalPathImport}
                      className="bg-brand-navy hover:bg-brand-orange text-white px-4 py-1.5 rounded-lg font-bold shadow-sm transition-all shrink-0"
                    >
                      ⚡ Quick Import
                    </button>
                  </div>
                </div>

                <form id="admin-create-post-form" onSubmit={handleAddPost} className="space-y-6 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-600 mb-1.5">Article Title *</label>
                    <input
                      type="text"
                      required
                      id="create-post-title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Why Golden Retrievers Make Amazing Family Pets"
                      className="w-full rounded-lg border border-slate-200 p-3 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-slate-600 mb-1.5 flex justify-between items-center">
                        <span>Category *</span>
                        <span className="text-[9px] text-brand-orange font-normal italic">Auto-detected / Editable</span>
                      </label>
                      <select
                        id="create-post-category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 p-3 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange bg-white cursor-pointer"
                      >
                        <option>Health & Wellness</option>
                        <option>Training & Behavior</option>
                        <option>Nutrition</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1.5">Read Time *</label>
                      <input
                        type="text"
                        required
                        id="create-post-readtime"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        placeholder="e.g., 5 min read"
                        className="w-full rounded-lg border border-slate-200 p-3 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label className="block text-slate-600 mb-1.5">Author Name *</label>
                      <input
                        type="text"
                        required
                        id="create-post-author-name"
                        value={authorName}
                        onChange={(e) => setAuthorName(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 p-3 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-600 mb-1.5">Author Role *</label>
                      <input
                        type="text"
                        required
                        id="create-post-author-role"
                        value={authorRole}
                        onChange={(e) => setAuthorRole(e.target.value)}
                        className="w-full rounded-lg border border-slate-200 p-3 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1.5">Short Excerpt (Grid Card Preview Summary) *</label>
                    <textarea
                      required
                      id="create-post-excerpt"
                      value={excerpt}
                      rows={2}
                      onChange={(e) => setExcerpt(e.target.value)}
                      placeholder="Short summary of the article..."
                      className="w-full rounded-lg border border-slate-200 p-3 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1.5">Full Body Paragraphs (Article Reading View) *</label>
                    <textarea
                      required
                      id="create-post-body"
                      value={body}
                      rows={6}
                      onChange={(e) => {
                        const val = e.target.value;
                        parseHtmlAndAutofill(val);
                        setBody(sanitizeArticleHtml(val));
                      }}
                      placeholder="Enter the full article body content..."
                      className="w-full rounded-lg border border-slate-200 p-3 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>

                  <button
                    type="submit"
                    id="create-post-btn-submit"
                    className="w-full rounded-xl bg-brand-navy p-3.5 text-xs font-semibold text-white hover:bg-brand-orange transition-all shadow"
                  >
                    Publish Post to Site
                  </button>
                </form>
              </div>
            )}

            {/* TAB 4: SITE BRANDING CONFIGURATION */}
            {activeTab === "settings" && (
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="font-display text-lg font-bold text-brand-navy border-b border-slate-100 pb-3 mb-6">
                  Branding Configuration Settings
                </h3>
                <form id="admin-branding-form" onSubmit={handleSaveSettings} className="space-y-6 text-xs font-semibold">
                  <div>
                    <label className="block text-slate-600 mb-1.5">Website Brand Name</label>
                    <input
                      type="text"
                      id="settings-brand-name"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1.5">Hero Headline Orange Highlight Text</label>
                    <input
                      type="text"
                      id="settings-hero-accent"
                      value={heroAccent}
                      onChange={(e) => setHeroAccent(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1.5">Hero Subtext Paragraph</label>
                    <textarea
                      id="settings-hero-text"
                      value={heroText}
                      rows={4}
                      onChange={(e) => setHeroText(e.target.value)}
                      className="w-full rounded-lg border border-slate-200 p-3 text-slate-800 font-medium focus:outline-none focus:ring-1 focus:ring-brand-orange"
                    />
                  </div>

                  <button
                    type="submit"
                    id="settings-btn-submit"
                    className="w-full rounded-xl bg-brand-orange p-3.5 text-xs font-bold text-white hover:bg-brand-orange-hover transition-all shadow"
                  >
                    Save Changes & Update Frontend
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* Right Side Sidebar: Always shows setup details */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Sanity Setup Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <h3 className="font-display font-bold text-brand-navy text-md mb-3">
                Sanity Studio Integration
              </h3>
              <p className="text-[11px] text-slate-400 leading-relaxed mb-4">
                To link your database:
              </p>
              <div className="space-y-4 text-xs">
                <div>
                  <div className="font-bold text-slate-800">1. Create studio folder</div>
                  <code className="block mt-1 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded font-mono">
                    npm create sanity@latest
                  </code>
                </div>
                <div>
                  <div className="font-bold text-slate-800">2. Set .env.local keys</div>
                  <pre className="block mt-1 bg-slate-900 text-slate-200 text-[10px] p-2.5 rounded font-mono leading-tight">
{`NEXT_PUBLIC_SANITY_PROJECT_ID=""
NEXT_PUBLIC_SANITY_DATASET=""`}
                  </pre>
                </div>
              </div>
            </div>

            {/* Schema Reference Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-brand-navy text-sm">
                  Schema Code
                </h3>
                <span className="text-[9px] bg-slate-100 text-slate-500 font-semibold px-2 py-0.5 rounded">TypeScript</span>
              </div>
              <pre className="bg-slate-950 text-slate-300 text-[9px] p-3.5 rounded-xl overflow-x-auto max-h-48 font-mono leading-tight">
                {schemaCode}
              </pre>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
