import type { Metadata } from "next";
import type { Route } from "next";
import Link from "next/link";

import { Container } from "@/components/container";
import { PostList } from "@/features/blog/post-list";
import { getAllPosts, getCategories } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "博客",
  description: "oh-blog 的所有中文文章。",
};

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);

  return (
    <Container className="py-20 sm:py-28">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-neon-orange">
        &gt; archive loaded
      </p>
      <h1 className="mt-6 font-heading text-5xl font-black uppercase text-neon-cyan">
        博客
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">文章列表按发布时间倒序排列。</p>
      <nav aria-label="文章分类" className="mt-10 flex flex-wrap gap-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/blog/${category.slug}` as Route}
            className="border border-neon-cyan/40 bg-panel-strong px-3 py-2 font-mono text-xs uppercase tracking-widest text-neon-cyan transition-colors hover:border-neon-orange hover:text-neon-orange focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan"
          >
            {category.title} / {category.count}
          </Link>
        ))}
      </nav>
      <div className="mt-12">
        <PostList posts={posts} />
      </div>
    </Container>
  );
}
