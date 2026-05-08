import { render, screen } from "@testing-library/react";
import { createElement } from "react";
import { describe, expect, test } from "vitest";
import { formatChineseDate } from "@/lib/format/date";
import { parsePostMeta } from "@/lib/content/markdown";
import {
  getAllPosts,
  getCategories,
  getFeaturedPosts,
  getPostBySlug,
  getPostsByCategory,
} from "@/lib/content/posts";

describe("content posts", () => {
  test("returns published posts sorted by published date descending", async () => {
    const posts = await getAllPosts();

    expect(posts.map((post) => post.slug)).toContain("system-dreams");
    expect(posts.map((post) => post.slug)).toContain("hello-neon");
    expect(posts.map((post) => post.slug)).toContain("01.react-jsx-syntax");
    expect(posts.every((post) => post.status === "published")).toBe(true);
    expect(posts.map((post) => post.slug)).not.toContain("draft-signal");
  });

  test("derives metadata for categorized markdown posts", async () => {
    const posts = await getPostsByCategory("react");
    const post = posts.find((entry) => entry.slug === "01.react-jsx-syntax");

    expect(post).toMatchObject({
      title: "前言",
      category: {
        slug: "react",
        title: "React",
      },
      href: "/blog/react/01.react-jsx-syntax",
      status: "published",
      tags: ["React"],
      series: {
        title: "React",
        order: 1,
      },
    });
    expect(post?.description).toContain("React 的核心理念之一");
  });

  test("lists categories from categorized markdown posts", async () => {
    const categories = await getCategories();

    expect(categories).toContainEqual({
      slug: "react",
      title: "React",
      count: 14,
    });
  });

  test("normalizes optional series numbering", async () => {
    const post = await getPostBySlug("hello-neon");

    expect(post?.series).toEqual({
      title: "霓虹工程日志",
      order: 1,
    });
  });

  test("renders post bodies without frontmatter", async () => {
    const post = await getPostBySlug("hello-neon");
    expect(post).not.toBeNull();

    render(createElement(post!.body));

    expect(screen.getByText(/这是/)).toBeInTheDocument();
    expect(screen.queryByText(/publishedAt/)).not.toBeInTheDocument();
    expect(screen.queryByText(/status:/)).not.toBeInTheDocument();
  });

  test("renders categorized markdown post bodies", async () => {
    const post = await getPostBySlug("01.react-jsx-syntax", "react");
    expect(post).not.toBeNull();

    render(createElement(post!.body));

    expect(screen.getByText("JSX 的本质")).toBeInTheDocument();
    expect(screen.queryByText(/publishedAt/)).not.toBeInTheDocument();
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
