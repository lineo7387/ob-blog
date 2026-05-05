import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";

describe("ThemeToggle", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
    document.documentElement.classList.remove("dark");

    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      writable: true,
      value: vi.fn().mockImplementation((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    });
  });

  test("cycles between system, light, and dark with an accessible name", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button", { name: /切换主题/ });
    expect(button).toHaveAttribute("aria-label", "切换主题，当前为跟随系统");

    await user.click(button);
    expect(button).toHaveAttribute("aria-label", "切换主题，当前为亮色");

    await user.click(button);
    expect(button).toHaveAttribute("aria-label", "切换主题，当前为暗色");
  });

  test("syncs the selected theme to localStorage and the html element", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    const button = screen.getByRole("button", { name: /切换主题/ });

    await user.click(button);
    expect(localStorage.getItem("oh-blog-theme")).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(document.documentElement).not.toHaveClass("dark");

    await user.click(button);
    expect(localStorage.getItem("oh-blog-theme")).toBe("dark");
    expect(document.documentElement.dataset.theme).toBe("dark");
    expect(document.documentElement).toHaveClass("dark");
  });

  test("keeps server and first client render deterministic with a stored theme", () => {
    localStorage.setItem("oh-blog-theme", "dark");

    vi.stubGlobal("window", undefined);
    const serverMarkup = renderToString(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    vi.unstubAllGlobals();
    const clientFirstMarkup = renderToString(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    );

    expect(clientFirstMarkup).toBe(serverMarkup);
    expect(clientFirstMarkup).toContain("切换主题，当前为跟随系统");
  });
});
