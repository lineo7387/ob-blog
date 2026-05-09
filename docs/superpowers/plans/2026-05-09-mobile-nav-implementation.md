# Mobile Nav Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current mobile header row of always-visible links with a hamburger-triggered menu panel while keeping the desktop navigation unchanged.

**Architecture:** Keep `components/site-header.tsx` as the top-level header entry point, but move the mobile-only open/close behavior into a focused client component so the stateful menu does not leak into the rest of the layout. Reuse the existing `links` data for both mobile and desktop navigation so labels, routes, and ordering stay consistent.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Tailwind CSS 4, Testing Library, Vitest

---

## File Structure

- Modify: `components/site-header.tsx`
  - Keep the sticky header shell and shared navigation data.
  - Render desktop navigation as today.
  - Hand mobile-only behavior to a dedicated client component.
- Create: `components/site-header-mobile-nav.tsx`
  - Own the hamburger button, open/close state, and the expanded mobile nav panel.
  - Render brand, theme toggle, and mobile links in one focused unit.
- Modify: `__tests__/components/site-header.test.tsx`
  - Replace the current “two visible mobile rows” expectation with interaction tests for the collapsed and expanded menu.

### Task 1: Lock the desired mobile behavior in tests

**Files:**
- Modify: `__tests__/components/site-header.test.tsx`

- [ ] **Step 1: Write the failing test**

Replace the current single layout assertion with these two tests:

```tsx
import { render, screen } from "@testing-library/react";
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

    const menuButton = screen.getByRole("button", { name: "打开导航菜单" });

    expect(screen.getByRole("link", { name: "oh-blog" })).toBeVisible();
    expect(screen.getByRole("button", { name: /切换主题/ })).toBeVisible();
    expect(menuButton).toHaveAttribute("aria-expanded", "false");
    expect(screen.queryByRole("link", { name: "首页" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "博客" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "关于" })).not.toBeInTheDocument();
  });

  test("shows and hides the mobile navigation panel when the menu button is toggled", async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <SiteHeader />
      </ThemeProvider>,
    );

    const menuButton = screen.getByRole("button", { name: "打开导航菜单" });
    await user.click(menuButton);

    expect(menuButton).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("link", { name: "首页" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "博客" })).toHaveAttribute("href", "/blog");
    expect(screen.getByRole("link", { name: "关于" })).toHaveAttribute("href", "/about");

    await user.click(screen.getByRole("button", { name: "收起导航菜单" }));

    expect(screen.getByRole("button", { name: "打开导航菜单" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("link", { name: "首页" })).not.toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `pnpm test:run __tests__/components/site-header.test.tsx`

Expected: FAIL because the current header still renders the mobile links immediately and has no hamburger button or expanded-state attributes.

- [ ] **Step 3: Commit the red test**

```bash
git add __tests__/components/site-header.test.tsx
git commit -m "test: cover mobile nav menu behavior"
```

### Task 2: Implement the mobile menu with the smallest client-side boundary

**Files:**
- Create: `components/site-header-mobile-nav.tsx`
- Modify: `components/site-header.tsx`

- [ ] **Step 1: Write the focused client component**

Create `components/site-header-mobile-nav.tsx`:

```tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import type { UrlObject } from "url";
import { ThemeToggle } from "@/components/theme/theme-toggle";

type HeaderLink = {
  href: UrlObject;
  label: string;
};

type SiteHeaderMobileNavProps = {
  links: ReadonlyArray<HeaderLink>;
};

export function SiteHeaderMobileNav({ links }: SiteHeaderMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex w-full flex-col gap-3 sm:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="font-heading text-xl font-black uppercase text-neon-cyan drop-shadow-[0_0_10px_var(--neon-cyan)]"
        >
          oh-blog
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-site-nav"
            aria-label={isOpen ? "收起导航菜单" : "打开导航菜单"}
            onClick={() => setIsOpen((open) => !open)}
            className="inline-flex h-10 w-10 items-center justify-center border-2 border-neon-cyan bg-panel text-neon-cyan shadow-[0_0_18px_var(--glow-cyan)] transition-colors hover:text-neon-magenta"
          >
            <span aria-hidden className="font-mono text-lg leading-none">
              {isOpen ? "×" : "≡"}
            </span>
          </button>
        </div>
      </div>

      {isOpen ? (
        <nav
          id="mobile-site-nav"
          className="border border-neon-cyan/40 bg-panel shadow-[0_0_24px_var(--glow-cyan)]"
        >
          {links.map((link) => (
            <Link
              key={String(link.href.pathname)}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="block border-t border-border px-4 py-3 font-mono text-sm text-foreground transition-colors first:border-t-0 hover:text-neon-magenta"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 2: Wire the new component into the header shell**

Update `components/site-header.tsx` to render separate mobile and desktop sections:

```tsx
import Link from "next/link";
import type { UrlObject } from "url";
import { Container } from "@/components/container";
import { SiteHeaderMobileNav } from "@/components/site-header-mobile-nav";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const links: ReadonlyArray<{ href: UrlObject; label: string }> = [
  { href: { pathname: "/" }, label: "首页" },
  { href: { pathname: "/blog" }, label: "博客" },
  { href: { pathname: "/about" }, label: "关于" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/82 backdrop-blur-xl">
      <Container className="py-3 sm:h-16 sm:py-0">
        <SiteHeaderMobileNav links={links} />

        <div className="hidden h-full items-center justify-between gap-6 sm:flex">
          <Link
            href="/"
            className="font-heading text-xl font-black uppercase text-neon-cyan drop-shadow-[0_0_10px_var(--neon-cyan)]"
          >
            oh-blog
          </Link>
          <div className="flex items-center gap-5">
            <nav className="flex min-w-0 items-center justify-start gap-5 text-sm text-muted">
              {links.map((link) => (
                <Link
                  key={String(link.href.pathname)}
                  href={link.href}
                  className="transition-colors hover:text-neon-magenta"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </header>
  );
}
```

- [ ] **Step 3: Run the focused test to verify it passes**

Run: `pnpm test:run __tests__/components/site-header.test.tsx`

Expected: PASS with both menu-collapsed and menu-expanded tests green.

- [ ] **Step 4: Commit the implementation**

```bash
git add components/site-header.tsx components/site-header-mobile-nav.tsx __tests__/components/site-header.test.tsx
git commit -m "feat: add mobile nav menu"
```

### Task 3: Verify adjacent behavior and local UI

**Files:**
- Test: `__tests__/components/site-header.test.tsx`
- Test: `__tests__/components/theme-toggle.test.tsx`

- [ ] **Step 1: Run related component tests**

Run: `pnpm test:run __tests__/components/site-header.test.tsx __tests__/components/theme-toggle.test.tsx`

Expected: PASS. Confirms the new mobile nav did not break the theme toggle interaction contract.

- [ ] **Step 2: Start the local app for manual verification**

Run: `pnpm exec next dev --hostname 127.0.0.1 --port 3000`

Expected: Next.js dev server starts and prints `http://127.0.0.1:3000`.

- [ ] **Step 3: Verify the mobile header in the browser**

Manual checks at `http://127.0.0.1:3000`:

```text
1. Set the viewport to a mobile width around 390px.
2. Confirm the header shows only the brand, theme toggle, and menu button.
3. Click the menu button and verify 首页 / 博客 / 关于 appear as a vertical panel.
4. Click the menu button again and verify the panel collapses cleanly.
5. Increase the viewport to desktop width and verify the existing horizontal nav is still present.
```

- [ ] **Step 4: Commit the verification checkpoint**

```bash
git add components/site-header.tsx components/site-header-mobile-nav.tsx __tests__/components/site-header.test.tsx
git commit -m "test: verify mobile nav header flow"
```

## Self-Review

- **Spec coverage:** The plan covers collapsed mobile header state, toggle behavior, preserved route ordering, desktop fallback, touch-friendly panel structure, and sticky-header-compatible panel placement.
- **Placeholder scan:** No `TODO`, `TBD`, or “similar to previous task” shortcuts remain.
- **Type consistency:** `links` shape stays `{ href: UrlObject; label: string }` across both header components; menu state is consistently named `isOpen`; the mobile nav element consistently uses `mobile-site-nav`.
