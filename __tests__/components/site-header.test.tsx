import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";

describe("SiteHeader", () => {
  beforeEach(() => {
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

  test("keeps mobile navigation collapsed behind a menu button by default", () => {
    render(
      <ThemeProvider>
        <SiteHeader />
      </ThemeProvider>,
    );

    const menuButton = screen.getByRole("button", { name: "切换导航菜单" });

    expect(menuButton).toHaveAttribute("aria-controls", "mobile-site-nav");
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-site-nav")).not.toBeInTheDocument();
  });

  test("shows and hides the mobile navigation panel when the menu button is toggled", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <SiteHeader />
      </ThemeProvider>,
    );

    const menuButton = screen.getByRole("button", { name: "切换导航菜单" });
    await user.click(menuButton);

    const mobileNav = screen.getByRole("navigation", { name: "移动端导航" });

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(within(mobileNav).getByRole("link", { name: "首页" })).toHaveAttribute("href", "/");
    expect(within(mobileNav).getByRole("link", { name: "博客" })).toHaveAttribute("href", "/blog");
    expect(within(mobileNav).getByRole("link", { name: "关于" })).toHaveAttribute("href", "/about");

    await user.click(screen.getByRole("button", { name: "切换导航菜单" }));

    expect(screen.getByRole("button", { name: "切换导航菜单" })).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById("mobile-site-nav")).not.toBeInTheDocument();
  });
});
