import type { Metadata } from "next";

import { Container } from "@/components/container";
import { PostList } from "@/features/blog/post-list";
import { getAllPosts } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "博客",
  description: "oh-blog 的所有中文文章。",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <Container className="py-20 sm:py-28">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-neon-orange">
        &gt; archive loaded
      </p>
      <h1 className="mt-6 font-heading text-5xl font-black uppercase text-neon-cyan">
        博客
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">文章列表按发布时间倒序排列。</p>
      <div className="mt-12">
        <PostList posts={posts} />
      </div>
    </Container>
  );
}
