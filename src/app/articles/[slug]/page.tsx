import Link from "next/link";
import type { Metadata } from "next";
import ArticleInteractivity from "./ArticleInteractivity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "x4mx0fr5";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const SANITY_CDN = `https://cdn.sanity.io/images/${projectId}/${dataset}`;

function resolveAssetUrls(html: string): string {
  return html.replace(
    /asset:\/\/(image-[a-f0-9]+-\d+x\d+-(?:jpg|jpeg|png|gif|webp))/gi,
    (_match, assetId: string) => {
      const lastDash = assetId.lastIndexOf("-");
      const ext = assetId.slice(lastDash + 1);
      const ref = assetId.slice(6, lastDash);
      return `${SANITY_CDN}/${ref}.${ext}`;
    }
  );
}

async function sanityFetch(query: string, params: Record<string, string> = {}) {
  const url = `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, params }),
    cache: "no-store",
  });
  const data = await res.json();
  return data.result;
}

async function getPost(slug: string) {
  const result = await sanityFetch(
    `*[_type == "post" && slug.current == $slug][0] {
      "id": _id, title, slug, category, categoryColor, excerpt,
      body, readTime, publishedAt,
      author->{ name, role, avatarColor }
    }`,
    { slug }
  );
  return result ? { ...result, body: resolveAssetUrls(result.body || "") } : null;
}

async function getRelatedPosts(slug: string) {
  const result = await sanityFetch(
    `*[_type == "post" && slug.current != $slug] | order(publishedAt desc) [0...3] {
      "id": _id, title, slug, category, categoryColor, excerpt, readTime, publishedAt,
      body, author->{ name, role, avatarColor }
    }`,
    { slug }
  );
  return (result || []).map((p: any) => ({ ...p, body: resolveAssetUrls(p.body || "") }));
}

function getFirstImageUrl(body: string): string {
  if (!body) return "";
  const match = body.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || "";
}

function extractTableOfContents(body: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const idCounts: Record<string, number> = {};
  const regex = /<h([23])[^>]*>(.*?)<\/h\1>/gi;
  let match;
  while ((match = regex.exec(body)) !== null) {
    const text = match[2].replace(/<[^>]+>/g, "").trim();
    let id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (idCounts[id]) {
      idCounts[id]++;
      id = `${id}-${idCounts[id]}`;
    } else {
      idCounts[id] = 1;
    }
    headings.push({ id, text, level: parseInt(match[1]) });
  }
  return headings;
}

function addIdsToHeadings(html: string): string {
  const idCounts: Record<string, number> = {};
  return html.replace(/<h([23])[^>]*>(.*?)<\/h\1>/gi, (_match, level, content) => {
    const text = content.replace(/<[^>]+>/g, "").trim();
    let id = text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    if (idCounts[id]) {
      idCounts[id]++;
      id = `${id}-${idCounts[id]}`;
    } else {
      idCounts[id] = 1;
    }
    return `<h${level} id="${id}">${content}</h${level}>`;
  });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article Not Found | Woof & Wag" };
  return {
    title: `${post.title} | Woof & Wag`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, relatedPosts] = await Promise.all([getPost(slug), getRelatedPosts(slug)]);

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen bg-[#fcfbf9]">
        <Header />
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
        <Footer />
      </div>
    );
  }

  const heroImage = getFirstImageUrl(post.body);
  const toc = extractTableOfContents(post.body);
  const processedBody = addIdsToHeadings(post.body);

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbf9]">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative w-full bg-gradient-to-b from-slate-900 to-slate-800">
          {heroImage && (
            <div className="absolute inset-0">
              <img src={heroImage} alt={post.title} className="w-full h-full object-cover opacity-30" />
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/70 via-slate-900/50 to-slate-900" />
            </div>
          )}
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-14 sm:pt-20 sm:pb-20 lg:pt-20 lg:pb-24">
            <Link href="/#articles" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-300 hover:text-[#f97316] transition-colors mb-8 group">
              <svg className="w-4 h-4 transition-transform group-hover:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Back to Articles
            </Link>
            <div className="max-w-3xl">
              <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold border ${post.categoryColor} mb-5`}>
                {post.category}
              </span>
              <h1 className="font-[var(--font-display)] text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                {post.title}
              </h1>
              <p className="mt-5 text-lg text-slate-300 leading-relaxed max-w-2xl">
                {post.excerpt}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <div className="flex items-center gap-3">
                  <div className={`h-11 w-11 rounded-full ${post.author.avatarColor} flex items-center justify-center text-sm font-bold text-white ring-2 ring-white/20`}>
                    {post.author.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{post.author.name}</div>
                    <div className="text-xs text-slate-400">{post.author.role}</div>
                  </div>
                </div>
                <div className="h-6 w-px bg-slate-600 hidden sm:block" />
                <div className="flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    {post.publishedAt}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    {post.readTime}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Article Body */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-10">
            {/* Main Content */}
            <article className="max-w-[680px]">

              {/* Article Body */}
              <div className="article-content text-slate-600 leading-relaxed">
                {processedBody.trim().startsWith("<") ? (
                  <div dangerouslySetInnerHTML={{ __html: processedBody }} />
                ) : (
                  post.body.split("\n\n").map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))
                )}
              </div>

              {/* Author Card */}
              <div className="mt-14 pt-8 border-t border-slate-100">
                <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <div className={`h-14 w-14 rounded-full ${post.author.avatarColor} flex items-center justify-center text-base font-bold shrink-0`}>
                    {post.author.name.split(" ").map((n: string) => n[0]).join("")}
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-[#f97316] mb-1">Written by</div>
                    <div className="text-base font-bold text-[#0f172a]">{post.author.name}</div>
                    <div className="text-sm text-slate-500 mt-0.5">{post.author.role}</div>
                  </div>
                </div>
              </div>
            </article>

            {/* Desktop sidebar — TOC + share */}
            <ArticleInteractivity
              toc={toc}
              title={post.title}
              slug={slug}
              readTime={post.readTime}
            />
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="border-t border-slate-100 bg-white/60 py-14">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="font-[var(--font-display)] text-2xl font-bold text-[#0f172a] mb-8">Continue Reading</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {relatedPosts.map((rp: any) => (
                  <Link
                    key={rp.id}
                    href={`/articles/${rp.slug.current}`}
                    className="group flex flex-col rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm hover:shadow-lg hover:border-orange-200/50 transition-all duration-300 transform hover:-translate-y-1"
                  >
                    {(() => {
                      const img = getFirstImageUrl(rp.body || "");
                      return img ? (
                        <div className="h-44 bg-slate-100 overflow-hidden">
                          <img src={img} alt={rp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        </div>
                      ) : null;
                    })()}
                    <div className="p-5 flex flex-col flex-1">
                      <span className={`inline-flex items-center self-start rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${rp.categoryColor} mb-3`}>
                        {rp.category}
                      </span>
                      <h3 className="font-[var(--font-display)] text-base font-bold text-[#0f172a] group-hover:text-[#f97316] transition-colors leading-snug line-clamp-2">
                        {rp.title}
                      </h3>
                      <p className="mt-2 text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
                        {rp.excerpt}
                      </p>
                      <div className="mt-4 pt-3 border-t border-slate-50 flex items-center gap-2">
                        <div className={`h-6 w-6 rounded-full ${rp.author?.avatarColor} flex items-center justify-center text-[8px] font-bold`}>
                          {rp.author?.name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                        </div>
                        <span className="text-[10px] text-slate-400 font-medium">{rp.readTime}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bottom CTA */}
        <section className="py-16 text-center">
          <div className="max-w-lg mx-auto px-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-orange-50 flex items-center justify-center mb-5">
              <span className="text-3xl">🐾</span>
            </div>
            <h2 className="font-[var(--font-display)] text-xl font-bold text-[#0f172a]">Enjoyed this article?</h2>
            <p className="text-sm text-slate-500 mt-2 mb-6">Explore more vet-reviewed guides on dog nutrition, training, and wellness.</p>
            <Link href="/#articles" className="inline-flex items-center gap-2 rounded-full bg-[#0f172a] px-7 py-3 text-sm font-semibold text-white hover:bg-[#f97316] transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg">
              Browse All Articles
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-orange-100/40 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3 group">
          <span className="font-[var(--font-display)] text-xl font-bold tracking-tight text-[#0f172a] group-hover:text-[#f97316] transition-colors">Woof &amp; Wag</span>
        </a>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-[#1e293b]">
          <a href="/" className="hover:text-[#f97316] transition-colors">Articles</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
          <span className="font-[var(--font-display)] text-lg font-bold tracking-tight text-[#0f172a]">Woof &amp; Wag</span>
          <p className="text-xs text-slate-400">&copy; 2026 Woof &amp; Wag. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-5 mt-6 pt-6 border-t border-slate-100 text-sm text-slate-500">
          <a href="/" className="hover:text-[#f97316] transition-colors">About Us</a>
          <a href="/" className="hover:text-[#f97316] transition-colors">Contact</a>
          <a href="/" className="hover:text-[#f97316] transition-colors">Privacy Policy</a>
          <a href="/" className="hover:text-[#f97316] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
