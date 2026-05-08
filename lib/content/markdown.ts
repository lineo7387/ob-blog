import matter from "gray-matter";
import readingTime from "reading-time";
import type { PostFrontmatter, PostMeta } from "@/lib/content/types";

function readString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid or missing frontmatter field: ${field}`);
  }

  return value;
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function isValidDateString(value: string): boolean {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
}

function readDateString(value: unknown, field: string): string {
  const date = readString(value, field);
  if (!isValidDateString(date)) {
    throw new Error(`Invalid frontmatter field: ${field}`);
  }

  return date;
}

function readOptionalDateString(value: unknown, field: string): string | undefined {
  if (value === undefined) return undefined;
  const date = readOptionalString(value);
  if (date === undefined || !isValidDateString(date)) {
    throw new Error(`Invalid frontmatter field: ${field}`);
  }

  return date;
}

function readTags(value: unknown): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error("Invalid frontmatter field: tags");
  return value.map((tag) => readString(tag, "tags"));
}

function readCover(value: unknown): PostMeta["cover"] {
  if (value === undefined) return undefined;
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid frontmatter field: cover");
  }

  const cover = value as Record<string, unknown>;
  return {
    src: readString(cover.src, "cover.src"),
    alt: readString(cover.alt, "cover.alt"),
  };
}

function readSeries(value: unknown): PostMeta["series"] {
  if (value === undefined) return undefined;
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid frontmatter field: series");
  }

  const series = value as Record<string, unknown>;
  if (typeof series.order !== "number" || !Number.isFinite(series.order)) {
    throw new Error("Invalid frontmatter field: series.order");
  }

  return {
    title: readString(series.title, "series.title"),
    order: series.order,
  };
}

function readStatus(value: unknown): PostMeta["status"] {
  if (value === "published" || value === "draft") return value;
  throw new Error("Invalid frontmatter field: status");
}

export function parsePostMeta(source: string): Omit<PostMeta, "slug" | "href" | "category"> {
  const parsed = matter(source);
  const data = parsed.data as PostFrontmatter;

  return {
    title: readString(data.title, "title"),
    description: readString(data.description, "description"),
    publishedAt: readDateString(data.publishedAt, "publishedAt"),
    updatedAt: readOptionalDateString(data.updatedAt, "updatedAt"),
    status: readStatus(data.status),
    tags: readTags(data.tags),
    cover: readCover(data.cover),
    series: readSeries(data.series),
    readingTime: Math.max(1, Math.ceil(readingTime(parsed.content).minutes)),
    featured: data.featured === true,
  };
}
