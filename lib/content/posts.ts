import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { Route } from "next";
import readingTime from "reading-time";
import { parsePostMeta } from "@/lib/content/markdown";
import type { CategorySummary, Post, PostCategory, PostMeta } from "@/lib/content/types";

const postsDirectory = path.join(process.cwd(), "content", "posts");
const categorizedPostPublishedAt = "2026-05-08";

type InternalPostMeta = PostMeta & {
  source:
    | {
        kind: "mdx";
      }
    | {
        kind: "markdown";
        categorySlug: string;
        fileName: string;
      };
};

const categoryTitleBySlug: Record<string, string> = {
  astro: "Astro",
  electron: "Electron",
  express: "Express",
  fastapi: "FastAPI",
  htmx: "HTMX",
  java: "Java",
  javascript: "JavaScript",
  mysql: "MySQL",
  nodejs: "Node.js",
  python: "Python",
  react: "React",
  "react-native": "React Native",
  springboot: "Spring Boot",
  typescript: "TypeScript",
  vue: "Vue",
};

function getCategory(categorySlug: string): PostCategory {
  return {
    slug: categorySlug,
    title:
      categoryTitleBySlug[categorySlug] ??
      categorySlug
        .split("-")
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" "),
  };
}

function readHeadingTitle(content: string, fallback: string): string {
  const heading = content.match(/^#{1,6}\s+(.+)$/m)?.[1]?.trim();
  if (heading) return heading.replace(/`/g, "");

  return fallback
    .replace(/^\d+\.?/, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function stripMarkdown(value: string): string {
  return value
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/^>\s?/gm, "")
    .trim();
}

function readDescription(content: string): string {
  const paragraph =
    content
      .split(/\n{2,}/)
      .filter((block) => {
        const trimmed = block.trim();
        return (
          trimmed.length > 0 &&
          !trimmed.startsWith("#") &&
          !trimmed.startsWith(":::") &&
          !trimmed.startsWith("```") &&
          !trimmed.startsWith("|")
        );
      })
      .map((block) => stripMarkdown(block))
      .find((block) => block.length > 0) ?? "";

  return paragraph.length > 120 ? `${paragraph.slice(0, 117)}...` : paragraph;
}

function readSeriesOrder(fileName: string): number {
  const order = Number(fileName.match(/^(\d+)/)?.[1]);
  return Number.isFinite(order) && order > 0 ? order : 999;
}

function toPublicPostMeta({ source, ...meta }: InternalPostMeta): PostMeta {
  void source;
  return meta;
}

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

async function readCategorizedMarkdownFiles(): Promise<
  Array<{ categorySlug: string; fileName: string; slug: string; source: string }>
> {
  const categoryEntries = await fs.readdir(postsDirectory, {
    withFileTypes: true,
  });
  const categorySlugs = categoryEntries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort();

  const filesByCategory = await Promise.all(
    categorySlugs.map(async (categorySlug) => {
      const categoryDirectory = path.join(postsDirectory, categorySlug);
      const files = (await fs.readdir(categoryDirectory))
        .filter((file) => file.endsWith(".md"))
        .sort();

      return Promise.all(
        files.map(async (file) => {
          const fileName = file.replace(/\.md$/, "");

          return {
            categorySlug,
            fileName,
            slug: fileName,
            source: await fs.readFile(path.join(categoryDirectory, file), "utf8"),
          };
        }),
      );
    }),
  );

  return filesByCategory.flat();
}

async function readPostMetas(
  includeDrafts = process.env.NODE_ENV === "development",
): Promise<InternalPostMeta[]> {
  const posts = await readPostFiles();

  return posts
    .map(({ slug, source }) => ({
      slug,
      href: `/blog/${slug}` as Route,
      ...parsePostMeta(source),
      source: {
        kind: "mdx" as const,
      },
    }))
    .filter((post) => includeDrafts || post.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

async function readCategorizedPostMetas(): Promise<InternalPostMeta[]> {
  const posts = await readCategorizedMarkdownFiles();

  return posts
    .map(({ categorySlug, fileName, slug, source }) => {
      const category = getCategory(categorySlug);

      return {
        slug,
        href: `/blog/${categorySlug}/${slug}` as Route,
        title: readHeadingTitle(source, slug),
        description: readDescription(source),
        publishedAt: categorizedPostPublishedAt,
        status: "published" as const,
        tags: [category.title],
        category,
        series: {
          title: category.title,
          order: readSeriesOrder(fileName),
        },
        readingTime: Math.max(1, Math.ceil(readingTime(source).minutes)),
        featured: false,
        source: {
          kind: "markdown" as const,
          categorySlug,
          fileName,
        },
      };
    })
    .sort((a, b) => {
      if (a.category?.slug !== b.category?.slug) {
        return (a.category?.slug ?? "").localeCompare(b.category?.slug ?? "");
      }

      return (a.series?.order ?? 999) - (b.series?.order ?? 999);
    });
}

const getAllPostEntries = cache(async (): Promise<InternalPostMeta[]> => {
  const [mdxPosts, markdownPosts] = await Promise.all([
    readPostMetas(false),
    readCategorizedPostMetas(),
  ]);

  return [...mdxPosts, ...markdownPosts].sort((a, b) => {
    const dateSort = b.publishedAt.localeCompare(a.publishedAt);
    if (dateSort !== 0) return dateSort;

    const categorySort = (a.category?.slug ?? "").localeCompare(b.category?.slug ?? "");
    if (categorySort !== 0) return categorySort;

    return (a.series?.order ?? 999) - (b.series?.order ?? 999);
  });
});

export const getAllPosts = cache(async (): Promise<PostMeta[]> => {
  const posts = await getAllPostEntries();
  return posts.map(toPublicPostMeta);
});

export const getFeaturedPosts = cache(async (): Promise<PostMeta[]> => {
  const posts = await getAllPosts();
  return posts.filter((post) => post.featured);
});

export const getCategories = cache(async (): Promise<CategorySummary[]> => {
  const posts = await getAllPosts();
  const counts = new Map<string, CategorySummary>();

  for (const post of posts) {
    if (!post.category) continue;
    const current = counts.get(post.category.slug);
    counts.set(post.category.slug, {
      ...post.category,
      count: (current?.count ?? 0) + 1,
    });
  }

  return Array.from(counts.values()).sort((a, b) => a.title.localeCompare(b.title));
});

export const getPostsByCategory = cache(async (categorySlug: string): Promise<PostMeta[]> => {
  const posts = await getAllPosts();
  return posts.filter((post) => post.category?.slug === categorySlug);
});

export const getPostBySlug = cache(
  async (slug: string, categorySlug?: string): Promise<Post | null> => {
    const posts = await getAllPostEntries();
    const meta = posts.find(
      (post) => post.slug === slug && post.category?.slug === categorySlug,
    );
    if (!meta) return null;

    const body =
      meta.source.kind === "mdx"
        ? (await import(`@/content/posts/${slug}.mdx`)).default
        : (
            await import(
              `@/content/posts/${meta.source.categorySlug}/${meta.source.fileName}.md`
            )
          ).default;

    return {
      ...toPublicPostMeta(meta),
      body,
    };
  },
);
