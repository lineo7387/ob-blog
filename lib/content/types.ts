import type { ComponentType } from "react";
import type { Route } from "next";

export type PostStatus = "published" | "draft";

export type PostCover = {
  src: string;
  alt: string;
};

export type PostSeries = {
  title: string;
  order: number;
};

export type PostCategory = {
  slug: string;
  title: string;
};

export type PostMeta = {
  slug: string;
  href: Route;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  status: PostStatus;
  tags: string[];
  category?: PostCategory;
  cover?: PostCover;
  series?: PostSeries;
  readingTime: number;
  featured: boolean;
};

export type CategorySummary = PostCategory & {
  count: number;
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
