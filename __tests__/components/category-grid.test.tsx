import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { CategoryGrid } from "@/features/blog/category-grid";
import { toCategoryGridItems } from "@/lib/content/category-display";
import type { CategorySummary } from "@/lib/content/types";

describe("CategoryGrid", () => {
  test("renders category cards with links, counts, descriptions, and hidden icons", () => {
    const categories: CategorySummary[] = [
      { slug: "react", title: "React", count: 14 },
      { slug: "mysql", title: "MySQL", count: 12 },
    ];

    render(<CategoryGrid categories={toCategoryGridItems(categories)} />);

    expect(screen.getByRole("heading", { name: "技术频道" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /React/ })).toHaveAttribute("href", "/blog/react");
    expect(screen.getByRole("link", { name: /MySQL/ })).toHaveAttribute("href", "/blog/mysql");
    expect(screen.getByText("14 篇文章")).toBeInTheDocument();
    expect(screen.getByText("12 篇文章")).toBeInTheDocument();
    expect(screen.getByText("组件、状态、路由与性能优化。")).toBeInTheDocument();
    expect(screen.getByText("SQL、索引、事务、复制与查询优化。")).toBeInTheDocument();
    expect(screen.getAllByTestId("category-icon")).toHaveLength(2);
  });

  test("renders nothing when there are no categories", () => {
    const { container } = render(<CategoryGrid categories={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
