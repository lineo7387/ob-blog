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

  test("centers desktop title content with the same reading width as the article body", () => {
    const { container } = render(<PostHero post={post} />);

    const centeredColumn = container.querySelector(".mx-auto.sm\\:max-w-3xl");
    const heading = container.querySelector("h1");

    expect(centeredColumn).not.toBeNull();
    expect(centeredColumn).toContainElement(heading);
  });
});
