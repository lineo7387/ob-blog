import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { PostHero } from "@/features/blog/post-hero";
import type { PostMeta } from "@/lib/content/types";

const post: PostMeta = {
  slug: "javascript-long-title",
  href: "/blog/javascript-long-title",
  title: "JavaScript 变量与数据类型",
  description: "一篇用于验证移动端长标题不会撑宽页面的文章。",
  publishedAt: "2026-05-08",
  status: "published",
  tags: ["JavaScript"],
  category: {
    slug: "javascript",
    title: "JavaScript",
  },
  series: {
    title: "JavaScript",
    order: 1,
  },
  readingTime: 8,
  featured: false,
};

describe("PostHero", () => {
  test("uses mobile-safe title wrapping", () => {
    render(<PostHero post={post} />);

    const heading = screen.getByRole("heading", {
      name: "JavaScript 变量与数据类型",
    });

    expect(heading).toHaveClass("break-words");
    expect(heading).toHaveClass("[overflow-wrap:anywhere]");
    expect(heading).toHaveClass("text-4xl");
    expect(heading).toHaveClass("sm:text-7xl");
  });
});
