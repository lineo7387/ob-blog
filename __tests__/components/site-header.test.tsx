import { cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";

describe("SiteHeader", () => {
  afterEach(() => {
    cleanup();
  });

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

    const menuButton = screen.getByRole("button", { name: "打开导航菜单" });
    const mobileNavId = menuButton.getAttribute("aria-controls");

    expect(mobileNavId).toBeTruthy();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(mobileNavId ?? "")).not.toBeInTheDocument();
  });

  test("keeps desktop navigation grouped on the right and preserves the full desktop theme switch", () => {
    render(
      <ThemeProvider>
        <SiteHeader />
      </ThemeProvider>,
    );

    const desktopNav = screen.getByRole("navigation", { name: "主导航" });
    const themeButtons = screen.getAllByRole("button", { name: /切换主题/ });
    const menuButton = screen.getByRole("button", { name: "打开导航菜单" });

    expect(desktopNav).toHaveClass("justify-start");
    expect(themeButtons).toHaveLength(2);
    expect(themeButtons[0]).toHaveClass("h-10", "w-10");
    expect(themeButtons[1]).toHaveClass("h-8", "w-16");
    expect(menuButton).toHaveClass("h-10", "w-10");
  });

  test("shows and hides the mobile navigation panel when the menu button is toggled", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <SiteHeader />
      </ThemeProvider>,
    );

    const menuButton = screen.getByRole("button", { name: "打开导航菜单" });
    const mobileNavId = menuButton.getAttribute("aria-controls");

    await user.click(menuButton);

    const closeButton = screen.getByRole("button", { name: "收起导航菜单" });
    const mobileNav = screen.getByRole("navigation", { name: "移动端导航" });

    expect(mobileNavId).toBeTruthy();
    expect(closeButton).toHaveAttribute("aria-controls", mobileNavId);
    expect(closeButton).toHaveAttribute("aria-expanded", "true");
    expect(mobileNav).toHaveAttribute("id", mobileNavId);
    expect(within(mobileNav).getByRole("link", { name: "首页" })).toHaveAttribute("href", "/");
    expect(within(mobileNav).getByRole("link", { name: "博客" })).toHaveAttribute("href", "/blog");
    expect(within(mobileNav).getByRole("link", { name: "关于" })).toHaveAttribute("href", "/about");

    await user.click(closeButton);

    expect(screen.getByRole("button", { name: "打开导航菜单" })).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(mobileNavId ?? "")).not.toBeInTheDocument();
  });

  test("closes the mobile navigation panel when Escape is pressed", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <SiteHeader />
      </ThemeProvider>,
    );

    const menuButton = screen.getByRole("button", { name: "打开导航菜单" });
    const mobileNavId = menuButton.getAttribute("aria-controls");

    await user.click(menuButton);
    await user.keyboard("{Escape}");

    expect(screen.getByRole("button", { name: "打开导航菜单" })).toHaveAttribute("aria-expanded", "false");
    expect(document.getElementById(mobileNavId ?? "")).not.toBeInTheDocument();
  });
});
