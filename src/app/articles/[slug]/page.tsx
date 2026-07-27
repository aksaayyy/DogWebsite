import Link from "next/link";
import { Viewport } from "next";
import type { Metadata } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "x4mx0fr5";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

function resolveAssetUrls(html: string): string {
  return html.replace(
    /asset:\/\/(image-[a-f0-9]+-\d+x\d+-(?:jpg|jpeg|png|gif|webp))/gi,
    (_match, assetId: string) => {
      const lastDash = assetId.lastIndexOf("-");
      const ext = assetId.slice(lastDash + 1);
      const ref = assetId.slice(6, lastDash);
      return `https://cdn.sanity.io/images/${projectId}/${dataset}/${ref}.${ext}`;
    }
  );
}

async function getPost(slug: string) {
  const query = `*[_type == "post" && slug.current == "${slug}"][0] {
    "id": _id, title, slug, category, categoryColor, excerpt,
    body, readTime, publishedAt,
    author->{ name, role, avatarColor }
  }`;
  const url = `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();
    return data.result ? { ...data.result, body: resolveAssetUrls(data.result.body || "") } : null;
  } catch {
    return null;
  }
}

async function getAdjacentPosts(slug: string) {
  const allQuery = `*[_type == "post"] | order(publishedAt desc) { "id": _id, title, slug, category, categoryColor, excerpt, readTime, publishedAt, author->{ name, role, avatarColor } }`;
  const url = `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(allQuery)}`;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();
    const posts = (data.result || []).map((p: any) => ({ ...p, body: resolveAssetUrls(p.body || "") }));
    const idx = posts.findIndex((p: any) => p.slug?.current === slug);
    return { prev: idx < posts.length - 1 ? posts[idx + 1] : null, next: idx > 0 ? posts[idx - 1] : null };
  } catch {
    return { prev: null, next: null };
  }
}

function getFirstImageUrl(body: string): string {
  if (!body) return "";
  const match = body.match(/<img[^>]+src=["']([^"']+)["']/i);
  return match?.[1] || "";
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article Not Found" };
  return {
    title: `${post.title} | Woof & Wag`,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, type: "article" },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, adjacent] = await Promise.all([getPost(slug), getAdjacentPosts(slug)]);

  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center py-20">
            <span className="text-5xl">🐕</span>
            <h1 className="font-[var(--font-display)] text-2xl font-bold text-[#0f172a] mt-4">Article Not Found</h1>
            <p className="text-slate-500 mt-2 text-sm">The article you are looking for does not exist or has been moved.</p>
            <Link href="/" className="inline-block mt-6 rounded-full bg-[#0f172a] px-6 py-3 text-sm font-semibold text-white hover:bg-[#f97316] transition-all duration-300">
              Back to Home
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const heroImage = getFirstImageUrl(post.body);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Cover Hero */}
        {heroImage && (
          <div className="w-full h-56 sm:h-72 md:h-80 lg:h-96 bg-slate-100 relative">
            <img src={heroImage} alt={post.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
          </div>
        )}

        {/* Article Content */}
        <article className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="max-w-3xl mx-auto">
            {/* Back Link */}
            <Link href="/#articles" className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-400 hover:text-[#f97316] transition-colors mb-6">
              ← Back to Articles
            </Link>

            {/* Category Badge */}
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold border ${post.categoryColor} mb-4`}>
              {post.category}
            </span>

            {/* Title */}
            <h1 className="font-[var(--font-display)] text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#0f172a] leading-tight tracking-tight">
              {post.title}
            </h1>

            {/* Author Meta */}
            <div className="mt-6 flex items-center gap-4 pb-6 mb-8 border-b border-slate-100">
              <div className={`h-11 w-11 rounded-full ${post.author.avatarColor} flex items-center justify-center text-sm font-bold shrink-0`}>
                {post.author.name.split(" ").map((n: string) => n[0]).join("")}
              </div>
              <div>
                <div className="text-sm font-bold text-[#0f172a]">{post.author.name}</div>
                <div className="text-xs text-slate-400 mt-0.5">{post.author.role} · {post.publishedAt} · {post.readTime}</div>
              </div>
            </div>

            {/* Article Body */}
            <div className="article-content prose prose-orange max-w-none text-slate-600 leading-relaxed">
              {post.body.trim().startsWith("<") ? (
                <div dangerouslySetInnerHTML={{ __html: post.body }} />
              ) : (
                post.body.split("\n\n").map((para: string, i: number) => (
                  <p key={i}>{para}</p>
                ))
              )}
            </div>

            {/* Bottom Navigation */}
            <div className="mt-14 pt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                {adjacent.prev && (
                  <Link href={`/articles/${adjacent.prev.slug.current}`} className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-100 hover:border-[#f97316]/30 hover:shadow-md transition-all max-w-xs">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">← Previous</span>
                    <span className="text-sm font-bold text-[#0f172a] group-hover:text-[#f97316] transition-colors line-clamp-2">{adjacent.prev.title}</span>
                  </Link>
                )}
                {adjacent.next && (
                  <Link href={`/articles/${adjacent.next.slug.current}`} className="group flex flex-col gap-1 p-4 rounded-xl border border-slate-100 hover:border-[#f97316]/30 hover:shadow-md transition-all max-w-xs sm:ml-auto text-right">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Next →</span>
                    <span className="text-sm font-bold text-[#0f172a] group-hover:text-[#f97316] transition-colors line-clamp-2">{adjacent.next.title}</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-orange-100/40 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-4 sm:px-6 lg:px-8">
        <a href="/" className="flex items-center gap-3">
          <span className="font-[var(--font-display)] text-xl font-bold tracking-tight text-[#0f172a]">Woof &amp; Wag</span>
        </a>
        <nav className="flex items-center gap-6 text-sm font-medium text-[#1e293b]">
          <a href="/" className="hover:text-[#f97316] transition-colors">Articles</a>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-slate-50 py-8 mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4">
        <span className="font-[var(--font-display)] text-lg font-bold tracking-tight text-[#0f172a]">Woof &amp; Wag</span>
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500">
          <a href="/" className="hover:text-[#f97316] transition-colors">About Us</a>
          <a href="/" className="hover:text-[#f97316] transition-colors">Contact</a>
          <a href="/" className="hover:text-[#f97316] transition-colors">Privacy Policy</a>
          <a href="/" className="hover:text-[#f97316] transition-colors">Terms of Service</a>
        </div>
      </div>
    </footer>
  );
}
