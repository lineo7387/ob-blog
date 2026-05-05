import type { ComponentType } from "react";

export type PostStatus = "published" | "draft";

export type PostCover = {
  src: string;
  alt: string;
};

export type PostSeries = {
  title: string;
  order: number;
};

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  status: PostStatus;
  tags: string[];
  cover?: PostCover;
  series?: PostSeries;
  readingTime: number;
  featured: boolean;
};

export type Post = PostMeta & {
  body: ComponentType;
};

export type PostFrontmatter = {
  title?: unknown;
  description?: unknown;
  publishedAt?: unknown;
  updatedAt?: unknown;
  status?: unknown;
  tags?: unknown;
  cover?: unknown;
  series?: unknown;
  featured?: unknown;
};
