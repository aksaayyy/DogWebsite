import React from "react";
import HomeClient from "./HomeClient";
import { getPostsServer } from "@/lib/sanity";

// ISR: re-render at most every 10 minutes; data fetch is cached alongside
export const revalidate = 600;

export default async function Home() {
  const posts = await getPostsServer();
  return <HomeClient initialPosts={posts} />;
}
