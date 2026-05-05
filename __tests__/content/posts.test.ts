import { describe, expect, test } from "vitest";
import { formatChineseDate } from "@/lib/format/date";
import { parsePostMeta } from "@/lib/content/markdown";
import {
  getAllPosts,
  getFeaturedPosts,
  getPostBySlug,
} from "@/lib/content/posts";

describe("content posts", () => {
  test("returns published posts sorted by published date descending", async () => {
    const posts = await getAllPosts();

    expect(posts.map((post) => post.slug)).toEqual([
      "system-dreams",
      "hello-neon",
    ]);
    expect(posts.every((post) => post.status === "published")).toBe(true);
    expect(posts.map((post) => post.slug)).not.toContain("draft-signal");
  });

  test("normalizes optional series numbering", async () => {
    const post = await getPostBySlug("hello-neon");

    expect(post?.series).toEqual({
      title: "霓虹工程日志",
      order: 1,
    });
  });

  test("filters featured posts", async () => {
    const posts = await getFeaturedPosts();

    expect(posts.map((post) => post.slug)).toEqual(["hello-neon"]);
  });

  test("returns null for a missing slug", async () => {
    await expect(getPostBySlug("missing")).resolves.toBeNull();
  });

  test("formats dates in Chinese", () => {
    expect(formatChineseDate("2026-05-05")).toBe("2026年5月5日");
  });

  test("rejects rollover frontmatter dates", () => {
    expect(() =>
      parsePostMeta(`---
title: "Bad date"
description: "This post should not parse."
publishedAt: "2026-02-31"
status: "published"
---

Invalid date fixture.
`),
    ).toThrow("Invalid frontmatter field: publishedAt");
  });
});
