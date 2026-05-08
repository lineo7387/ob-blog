import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Prose } from "@/components/prose";

describe("Prose", () => {
  test("contains mobile overflow for long code and text content", () => {
    render(
      <Prose>
        <p>https://example.com/really/long/path/that/should/not/push/the/page/wider</p>
        <pre>
          <code>const element = &lt;h1 className=&quot;title&quot;&gt;Hello&lt;/h1&gt;;</code>
        </pre>
      </Prose>,
    );

    const article = screen.getByRole("article");

    expect(article).toHaveClass("min-w-0");
    expect(article).toHaveClass("max-w-full");
    expect(article).toHaveClass("break-words");
    expect(article).toHaveClass("[overflow-wrap:anywhere]");
    expect(article).toHaveClass("[&_pre]:max-w-full");
    expect(article).toHaveClass("[&_pre]:overflow-x-auto");
    expect(article).toHaveClass("[&_pre_code]:inline-block");
    expect(article).toHaveClass("[&_pre_code]:min-w-max");
  });
});
