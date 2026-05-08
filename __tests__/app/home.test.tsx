import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import Home from "@/app/page";

describe("Home", () => {
  test("renders the category grid between the hero and featured posts", async () => {
    render(await Home());

    const heroCopy = screen.getByText(/Vaporwave \/ Outrun/);
    const categoryHeading = screen.getByRole("heading", { name: "技术频道" });
    const featuredHeading = screen.getByRole("heading", { name: "精选文章" });

    expect(heroCopy.compareDocumentPosition(categoryHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(categoryHeading.compareDocumentPosition(featuredHeading)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(
      screen.getByRole("link", { name: /^React\s+\d+\s+篇文章/ }),
    ).toHaveAttribute("href", "/blog/react");
  });
});
