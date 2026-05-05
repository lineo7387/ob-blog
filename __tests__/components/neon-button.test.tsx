import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { NeonButton } from "@/components/neon-button";

describe("NeonButton", () => {
  test("renders a link with an accessible name", () => {
    render(<NeonButton href="/blog">进入博客</NeonButton>);

    expect(screen.getByRole("link", { name: "进入博客" })).toHaveAttribute("href", "/blog");
  });
});
