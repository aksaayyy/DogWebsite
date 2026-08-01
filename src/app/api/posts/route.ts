import { NextResponse } from "next/server";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "x4mx0fr5";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const runtime = "edge";

function resolveAssetUrls(html: string): string {
  if (typeof html !== "string") return "";
  return html.replace(
    /asset:\/\/(image-[a-f0-9]+-\d+x\d+-(?:jpg|jpeg|png|gif|webp))/gi,
    (_match, assetId: string) => {
      const lastDash = assetId.lastIndexOf("-");
      const ext = assetId.slice(lastDash + 1);
      const ref = assetId.slice(6, lastDash);
      return `https://cdn.sanity.io/images/${projectId}/${dataset}/${ref}.${ext}?auto=format&q=80`;
    }
  );
}

export async function GET() {
  const query = `*[_type == "post"] | order(publishedAt desc) {
    "id": _id,
    title,
    slug,
    category,
    categoryColor,
    excerpt,
    body,
    readTime,
    publishedAt,
    author->{
      name,
      role,
      avatarColor
    }
  }`;

  const url = `https://${projectId}.apicdn.sanity.io/v2024-01-01/data/query/${dataset}?query=${encodeURIComponent(query)}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });
    const data = await res.json();
    const posts = (data.result || []).map((post: any) => ({
      ...post,
      body: resolveAssetUrls(post.body || ""),
    }));
    return NextResponse.json(posts, {
      headers: {
        "Cache-Control": "public, max-age=300, s-maxage=3600, stale-while-revalidate=86400",
      },
    });
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return NextResponse.json([]);
  }
}
