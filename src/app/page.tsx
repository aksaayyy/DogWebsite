import React from "react";
import HomeClient from "./HomeClient";
import { getPostsServer } from "@/lib/sanity";

// Set revalidate to 0 to bypass caching during build time or request time
export const revalidate = 0;

export default async function Home() {
  const posts = await getPostsServer();
  return <HomeClient initialPosts={posts} />;
}
