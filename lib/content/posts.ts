import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { parsePostMeta } from "@/lib/content/markdown";
import type { Post, PostMeta } from "@/lib/content/types";

const postsDirectory = path.join(process.cwd(), "content", "posts");

async function readPostFiles(): Promise<Array<{ slug: string; source: string }>> {
  const files = await fs.readdir(postsDirectory);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  return Promise.all(
    mdxFiles.map(async (file) => ({
      slug: file.replace(/\.mdx$/, ""),
      source: await fs.readFile(path.join(postsDirectory, file), "utf8"),
    })),
  );
}

async function readPostMetas(
  includeDrafts = process.env.NODE_ENV === "development",
): Promise<PostMeta[]> {
  const posts = await readPostFiles();

  return posts
    .map(({ slug, source }) => ({
      slug,
      ...parsePostMeta(source),
    }))
    .filter((post) => includeDrafts || post.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export const getAllPosts = cache(async (): Promise<PostMeta[]> => {
  return readPostMetas(false);
});

export const getFeaturedPosts = cache(async (): Promise<PostMeta[]> => {
  const posts = await getAllPosts();
  return posts.filter((post) => post.featured);
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const posts = await getAllPosts();
  const meta = posts.find((post) => post.slug === slug);
  if (!meta) return null;

  const body = (await import(`@/content/posts/${slug}.mdx`)).default;

  return {
    ...meta,
    body,
  };
});
