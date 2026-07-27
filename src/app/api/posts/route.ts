import { NextResponse } from "next/server";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "x4mx0fr5";
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";

export const runtime = "edge";

export async function GET() {
  const query = `*[_type == "post"] {
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
    const res = await fetch(url, { next: { revalidate: 60 } });
    const data = await res.json();
    return NextResponse.json(data.result || []);
  } catch (error) {
    console.error("Sanity fetch failed:", error);
    return NextResponse.json([]);
  }
}
