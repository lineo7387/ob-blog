import { describe, expect, test } from "vitest";
import { getCategoryDisplayMeta, toCategoryGridItems } from "@/lib/content/category-display";
import type { CategorySummary } from "@/lib/content/types";

describe("category display metadata", () => {
  test("returns custom display metadata for known technical categories", () => {
    const react = getCategoryDisplayMeta("react");

    expect(react.description).toBe("组件、状态、路由与性能优化。");
    expect(react.accent).toMatch(/^#[0-9A-Fa-f]{6}$/);
    expect(react.icon.title).toBe("React");
    expect(react.icon.path.length).toBeGreaterThan(100);
  });

  test("uses the OpenJDK technology logo for Java metadata", () => {
    const java = getCategoryDisplayMeta("java");

    expect(java.description).toBe("Java 语言基础、工程实践与生态要点。");
    expect(java.accent).toBe("#F89820");
    expect(java.icon.title).toBe("OpenJDK");
    expect(java.icon.title).not.toBe("Code");
  });

  test("keeps the Express icon visible on dark category cards", () => {
    const express = getCategoryDisplayMeta("express");

    expect(express.icon.title).toBe("Express");
    expect(express.icon.hex).toBe("000000");
    expect(express.accent).toBe("#22D3EE");
  });

  test("keeps mapped technical categories on Simple Icons logos", () => {
    const mappedTechnologyCategories = [
      "astro",
      "electron",
      "express",
      "fastapi",
      "htmx",
      "java",
      "javascript",
      "mysql",
      "nodejs",
      "python",
      "react",
      "react-native",
      "springboot",
      "typescript",
      "vue",
    ];

    for (const slug of mappedTechnologyCategories) {
      expect(getCategoryDisplayMeta(slug).icon.title).not.toBe("Code");
    }
  });

  test("returns fallback metadata for unknown categories", () => {
    const meta = getCategoryDisplayMeta("unknown-stack");

    expect(meta.description).toBe("汇总该技术方向的系列笔记与实践文章。");
    expect(meta.accent).toBe("#22D3EE");
    expect(meta.icon.title).toBe("Code");
    expect(meta.icon.path).toContain("M4");
  });

  test("decorates category summaries for the homepage grid", () => {
    const categories: CategorySummary[] = [
      { slug: "react", title: "React", count: 14 },
      { slug: "mysql", title: "MySQL", count: 12 },
    ];

    expect(toCategoryGridItems(categories)).toEqual([
      expect.objectContaining({
        slug: "react",
        title: "React",
        count: 14,
        href: "/blog/react",
        description: "组件、状态、路由与性能优化。",
      }),
      expect.objectContaining({
        slug: "mysql",
        title: "MySQL",
        count: 12,
        href: "/blog/mysql",
        description: "SQL、索引、事务、复制与查询优化。",
      }),
    ]);
  });
});
