# oh-blog Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the first usable foundation for `oh-blog`: Chinese Vaporwave personal blog routes, local MDX content abstraction, theme switching with Element Plus style expansion, Motion animation islands, and focused tests.

**Architecture:** Keep the root-level `app/` directory and add clear layers: `components/` for reusable UI, `features/blog/` for blog presentation, `lib/content/` for content source abstraction, `content/posts/` for local MDX, and `lib/format/` for deterministic helpers. Routes stay Server Components by default; theme and Motion behavior live in small Client Component islands.

**Tech Stack:** Next.js 16.2.4 App Router, React 19.2.4, TypeScript, Tailwind CSS v4, MDX via official Next MDX support, Motion for React, Vitest, React Testing Library.

---

## File Structure

Create or modify the following files:

- Modify: `package.json` to add scripts and dependencies.
- Modify: `next.config.ts` to enable MDX page extensions and `typedRoutes`.
- Create: `mdx-components.tsx` for App Router MDX component convention.
- Create: `vitest.config.mts` for component and helper tests.
- Create: `vitest.setup.ts` for test matchers.
- Modify: `app/globals.css` for Tailwind v4 theme variables, theme tokens, base layers, scanlines, grids, and reduced motion.
- Modify: `app/layout.tsx` for Chinese metadata, fonts, theme initialization, and site shell.
- Modify: `app/page.tsx` for personal homepage.
- Create: `app/about/page.tsx`.
- Create: `app/blog/page.tsx`.
- Create: `app/blog/[slug]/page.tsx`.
- Create: `app/blog/[slug]/not-found.tsx`.
- Create: `components/container.tsx`.
- Create: `components/neon-button.tsx`.
- Create: `components/neon-panel.tsx`.
- Create: `components/prose.tsx`.
- Create: `components/site-header.tsx`.
- Create: `components/site-footer.tsx`.
- Create: `components/motion/animated-section.tsx`.
- Create: `components/theme/theme-provider.tsx`.
- Create: `components/theme/theme-toggle.tsx`.
- Create: `features/blog/post-card.tsx`.
- Create: `features/blog/post-list.tsx`.
- Create: `features/blog/post-hero.tsx`.
- Create: `features/blog/post-meta.tsx`.
- Create: `lib/content/types.ts`.
- Create: `lib/content/markdown.ts`.
- Create: `lib/content/posts.ts`.
- Create: `lib/format/date.ts`.
- Create: `content/posts/hello-neon.mdx`.
- Create: `content/posts/system-dreams.mdx`.
- Create: `__tests__/content/posts.test.ts`.
- Create: `__tests__/components/neon-button.test.tsx`.
- Create: `__tests__/components/theme-toggle.test.tsx`.

## Task 1: Dependencies and Project Configuration

**Files:**
- Modify: `package.json`
- Modify: `next.config.ts`
- Create: `mdx-components.tsx`
- Create: `vitest.config.mts`
- Create: `vitest.setup.ts`

- [ ] **Step 1: Install runtime dependencies**

Run:

```bash
pnpm add @next/mdx @mdx-js/loader @mdx-js/react gray-matter reading-time motion
```

Expected: `package.json` and `pnpm-lock.yaml` include the new runtime dependencies.

- [ ] **Step 2: Install test dependencies**

Run:

```bash
pnpm add -D @types/mdx @mdx-js/rollup vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom @testing-library/jest-dom vite-tsconfig-paths
```

Expected: `package.json` and `pnpm-lock.yaml` include the new dev dependencies.

- [ ] **Step 3: Update scripts**

Modify `package.json` scripts to include:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

- [ ] **Step 4: Configure Next for MDX and typed routes**

Replace `next.config.ts` with:

```ts
import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  typedRoutes: true,
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
```

- [ ] **Step 5: Add MDX components convention**

Create `mdx-components.tsx`:

```tsx
import type { MDXComponents } from "mdx/types";

const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
```

- [ ] **Step 6: Add Vitest config**

Create `vitest.config.mts`:

```ts
import react from "@vitejs/plugin-react";
import mdx from "@mdx-js/rollup";
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), mdx(), react()],
  test: {
    environment: "jsdom",
    globals: false,
    setupFiles: ["./vitest.setup.ts"],
  },
});
```

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 7: Verify config compiles**

Run:

```bash
pnpm lint
pnpm test:run -- --passWithNoTests
```

Expected: lint passes or only reports existing unmodified project issues; Vitest exits successfully with no test files or discovered tests.

- [ ] **Step 8: Commit**

```bash
git add package.json pnpm-lock.yaml next.config.ts mdx-components.tsx vitest.config.mts vitest.setup.ts
git commit -m "chore: configure mdx motion and tests"
```

## Task 2: Content Types, Markdown Helpers, and Tests

**Files:**
- Create: `lib/content/types.ts`
- Create: `lib/content/markdown.ts`
- Create: `lib/content/posts.ts`
- Create: `lib/format/date.ts`
- Create: `content/posts/hello-neon.mdx`
- Create: `content/posts/system-dreams.mdx`
- Create: `__tests__/content/posts.test.ts`

- [ ] **Step 1: Write failing content tests**

Create `__tests__/content/posts.test.ts`:

```ts
import { describe, expect, test } from "vitest";
import { formatChineseDate } from "@/lib/format/date";
import { getAllPosts, getFeaturedPosts, getPostBySlug } from "@/lib/content/posts";

describe("content posts", () => {
  test("returns published posts sorted by published date descending", async () => {
    const posts = await getAllPosts();

    expect(posts.map((post) => post.slug)).toEqual([
      "system-dreams",
      "hello-neon",
    ]);
    expect(posts.every((post) => post.status === "published")).toBe(true);
  });

  test("normalizes optional series numbering", async () => {
    const post = await getPostBySlug("hello-neon");

    expect(post?.series).toEqual({
      title: "霓虹工程日志",
      order: 1,
    });
  });

  test("filters featured posts", async () => {
    const posts = await getFeaturedPosts();

    expect(posts.map((post) => post.slug)).toEqual(["hello-neon"]);
  });

  test("returns null for a missing slug", async () => {
    await expect(getPostBySlug("missing")).resolves.toBeNull();
  });

  test("formats dates in Chinese", () => {
    expect(formatChineseDate("2026-05-05")).toBe("2026年5月5日");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
pnpm test:run __tests__/content/posts.test.ts
```

Expected: FAIL because `lib/content/posts` and `lib/format/date` do not exist yet.

- [ ] **Step 3: Create content types**

Create `lib/content/types.ts`:

```ts
import type { ComponentType } from "react";

export type PostStatus = "published" | "draft";

export type PostCover = {
  src: string;
  alt: string;
};

export type PostSeries = {
  title: string;
  order: number;
};

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  status: PostStatus;
  tags: string[];
  cover?: PostCover;
  series?: PostSeries;
  readingTime: number;
  featured: boolean;
};

export type Post = PostMeta & {
  body: ComponentType;
};

export type PostFrontmatter = {
  title?: unknown;
  description?: unknown;
  publishedAt?: unknown;
  updatedAt?: unknown;
  status?: unknown;
  tags?: unknown;
  cover?: unknown;
  series?: unknown;
  featured?: unknown;
};
```

- [ ] **Step 4: Create date formatter**

Create `lib/format/date.ts`:

```ts
export function formatChineseDate(value: string): string {
  const date = new Date(`${value}T00:00:00+08:00`);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date: ${value}`);
  }

  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "Asia/Shanghai",
  }).format(date);
}
```

- [ ] **Step 5: Create markdown normalization helpers**

Create `lib/content/markdown.ts`:

```ts
import matter from "gray-matter";
import readingTime from "reading-time";
import type { PostFrontmatter, PostMeta } from "@/lib/content/types";

function readString(value: unknown, field: string): string {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`Invalid or missing frontmatter field: ${field}`);
  }

  return value;
}

function readOptionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim() !== "" ? value : undefined;
}

function readTags(value: unknown): string[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) throw new Error("Invalid frontmatter field: tags");
  return value.map((tag) => readString(tag, "tags"));
}

function readCover(value: unknown): PostMeta["cover"] {
  if (value === undefined) return undefined;
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid frontmatter field: cover");
  }

  const cover = value as Record<string, unknown>;
  return {
    src: readString(cover.src, "cover.src"),
    alt: readString(cover.alt, "cover.alt"),
  };
}

function readSeries(value: unknown): PostMeta["series"] {
  if (value === undefined) return undefined;
  if (typeof value !== "object" || value === null) {
    throw new Error("Invalid frontmatter field: series");
  }

  const series = value as Record<string, unknown>;
  if (typeof series.order !== "number" || !Number.isFinite(series.order)) {
    throw new Error("Invalid frontmatter field: series.order");
  }

  return {
    title: readString(series.title, "series.title"),
    order: series.order,
  };
}

function readStatus(value: unknown): PostMeta["status"] {
  if (value === "published" || value === "draft") return value;
  throw new Error("Invalid frontmatter field: status");
}

export function parsePostMeta(source: string): Omit<PostMeta, "slug"> {
  const parsed = matter(source);
  const data = parsed.data as PostFrontmatter;

  return {
    title: readString(data.title, "title"),
    description: readString(data.description, "description"),
    publishedAt: readString(data.publishedAt, "publishedAt"),
    updatedAt: readOptionalString(data.updatedAt),
    status: readStatus(data.status),
    tags: readTags(data.tags),
    cover: readCover(data.cover),
    series: readSeries(data.series),
    readingTime: Math.max(1, Math.ceil(readingTime(parsed.content).minutes)),
    featured: data.featured === true,
  };
}
```

- [ ] **Step 6: Create sample MDX posts**

Create `content/posts/hello-neon.mdx`:

```mdx
---
title: "你好，霓虹"
description: "oh-blog 的第一篇霓虹日志，记录一个中文 Vaporwave 博客的开场。"
publishedAt: "2026-05-01"
status: "published"
tags:
  - "设计系统"
  - "Next.js"
featured: true
series:
  title: "霓虹工程日志"
  order: 1
---

这是 `oh-blog` 的第一篇文章。它应该读起来像一块发光的终端面板，但正文仍然需要足够舒服。
```

Create `content/posts/system-dreams.mdx`:

```mdx
---
title: "系统之梦"
description: "关于内容抽象层、主题变量和霓虹界面的第二篇记录。"
publishedAt: "2026-05-05"
status: "published"
tags:
  - "架构"
  - "主题"
featured: false
---

内容层不应该把页面绑死在本地文件上。页面只需要知道文章模型，不需要知道文章从哪里来。
```

- [ ] **Step 7: Create post query API**

Create `lib/content/posts.ts`:

```ts
import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { parsePostMeta } from "@/lib/content/markdown";
import type { Post, PostMeta } from "@/lib/content/types";

const postsDirectory = path.join(process.cwd(), "content", "posts");

async function readPostFiles(): Promise<Array<{ slug: string; source: string }>> {
  const files = await fs.readdir(postsDirectory);
  const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

  return Promise.all(
    mdxFiles.map(async (file) => ({
      slug: file.replace(/\.mdx$/, ""),
      source: await fs.readFile(path.join(postsDirectory, file), "utf8"),
    })),
  );
}

async function readPostMetas(includeDrafts = process.env.NODE_ENV === "development"): Promise<PostMeta[]> {
  const posts = await readPostFiles();

  return posts
    .map(({ slug, source }) => ({
      slug,
      ...parsePostMeta(source),
    }))
    .filter((post) => includeDrafts || post.status === "published")
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export const getAllPosts = cache(async (): Promise<PostMeta[]> => {
  return readPostMetas(false);
});

export const getFeaturedPosts = cache(async (): Promise<PostMeta[]> => {
  const posts = await getAllPosts();
  return posts.filter((post) => post.featured);
});

export const getPostBySlug = cache(async (slug: string): Promise<Post | null> => {
  const posts = await getAllPosts();
  const meta = posts.find((post) => post.slug === slug);
  if (!meta) return null;

  const body = (await import(`@/content/posts/${slug}.mdx`)).default;

  return {
    ...meta,
    body,
  };
});
```

- [ ] **Step 8: Run tests to verify they pass**

Run:

```bash
pnpm test:run __tests__/content/posts.test.ts
```

Expected: PASS.

- [ ] **Step 9: Run type-aware build check**

Run:

```bash
pnpm build
```

Expected: build may fail only if MDX import typing or dynamic MDX import bundling needs adjustment. If it fails, adjust `getPostBySlug` to use an explicit module map:

```ts
const postModules = {
  "hello-neon": () => import("@/content/posts/hello-neon.mdx"),
  "system-dreams": () => import("@/content/posts/system-dreams.mdx"),
} satisfies Record<string, () => Promise<{ default: Post["body"] }>>;
```

Then load with `const load = postModules[slug as keyof typeof postModules]`.

- [ ] **Step 10: Commit**

```bash
git add lib/content lib/format content/posts __tests__/content
git commit -m "feat: add local post content layer"
```

## Task 3: Theme Tokens, Fonts, and Root Layout

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace global CSS with theme variables**

Modify `app/globals.css` to include these foundations:

```css
@import "tailwindcss";

:root {
  --background: #f7fbff;
  --foreground: #14121f;
  --panel: rgba(255, 255, 255, 0.82);
  --panel-strong: #ffffff;
  --muted: #5d6475;
  --border: #bfd7ff;
  --neon-magenta: #d900ff;
  --neon-cyan: #0077ff;
  --neon-orange: #ff7a00;
  --grid-line: rgba(0, 119, 255, 0.22);
  --scanline: rgba(0, 0, 0, 0.04);
  --glow-cyan: rgba(0, 119, 255, 0.28);
  --glow-magenta: rgba(217, 0, 255, 0.2);
  --font-heading: var(--font-orbitron);
  --font-body: var(--font-share-tech), ui-monospace, SFMono-Regular, Menlo, monospace;
}

html.dark {
  --background: #090014;
  --foreground: #e0e0e0;
  --panel: rgba(26, 16, 60, 0.8);
  --panel-strong: #1a103c;
  --muted: rgba(224, 224, 224, 0.72);
  --border: #2d1b4e;
  --neon-magenta: #ff00ff;
  --neon-cyan: #00ffff;
  --neon-orange: #ff9900;
  --grid-line: rgba(255, 0, 255, 0.35);
  --scanline: rgba(0, 0, 0, 0.25);
  --glow-cyan: rgba(0, 255, 255, 0.34);
  --glow-magenta: rgba(255, 0, 255, 0.36);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-panel: var(--panel);
  --color-panel-strong: var(--panel-strong);
  --color-muted: var(--muted);
  --color-border: var(--border);
  --color-neon-magenta: var(--neon-magenta);
  --color-neon-cyan: var(--neon-cyan);
  --color-neon-orange: var(--neon-orange);
  --font-sans: var(--font-body);
  --font-mono: var(--font-body);
  --font-heading: var(--font-heading);
}

* {
  box-sizing: border-box;
}

html {
  min-height: 100%;
  background: var(--background);
  color: var(--foreground);
  color-scheme: light;
}

html.dark {
  color-scheme: dark;
}

body {
  min-height: 100vh;
  margin: 0;
  background:
    radial-gradient(circle at 50% 15%, var(--glow-magenta), transparent 34rem),
    linear-gradient(180deg, var(--background), var(--background));
  color: var(--foreground);
  font-family: var(--font-body);
  transition:
    background-color 240ms linear,
    color 240ms linear;
}

body::before,
body::after {
  position: fixed;
  inset: 0;
  pointer-events: none;
  content: "";
}

body::before {
  z-index: 0;
  background-image:
    linear-gradient(transparent 95%, var(--grid-line) 95%),
    linear-gradient(90deg, transparent 95%, var(--grid-line) 95%);
  background-size: 42px 42px;
  mask-image: linear-gradient(to bottom, transparent, black 35%, transparent 88%);
  transform: perspective(520px) rotateX(62deg) translateY(18vh) scale(1.8);
  transform-origin: top center;
}

body::after {
  z-index: 50;
  background: linear-gradient(rgba(18, 16, 20, 0) 50%, var(--scanline) 50%);
  background-size: 100% 4px;
  mix-blend-mode: multiply;
}

::selection {
  background: var(--neon-cyan);
  color: #05010a;
}

:focus-visible {
  outline: 2px solid var(--neon-cyan);
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 1ms !important;
    scroll-behavior: auto !important;
    transition-duration: 1ms !important;
  }
}
```

- [ ] **Step 2: Modify root layout with fonts, metadata, and theme boot script**

Replace `app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Orbitron, Share_Tech_Mono } from "next/font/google";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme/theme-provider";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech",
  subsets: ["latin"],
  weight: "400",
});

const themeScript = `
(() => {
  const storageKey = "oh-blog-theme";
  const stored = localStorage.getItem(storageKey);
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  const resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL("https://oh-blog.local"),
  title: {
    default: "oh-blog",
    template: "%s | oh-blog",
  },
  description: "一个中文 Vaporwave / Outrun 风格的个人博客。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${orbitron.variable} ${shareTechMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <ThemeProvider>
          <div className="relative z-10 flex min-h-screen flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 3: Run lint to catch missing components**

Run:

```bash
pnpm lint
```

Expected: FAIL because `SiteHeader`, `SiteFooter`, and `ThemeProvider` do not exist yet.

- [ ] **Step 4: Commit after dependent components exist**

Delay commit until Task 4 and Task 5 create the referenced files.

## Task 4: Theme Provider and Element Plus Style Toggle

**Files:**
- Create: `components/theme/theme-provider.tsx`
- Create: `components/theme/theme-toggle.tsx`
- Create: `__tests__/components/theme-toggle.test.tsx`

- [ ] **Step 1: Write failing theme toggle test**

Create `__tests__/components/theme-toggle.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeToggle } from "@/components/theme/theme-toggle";

describe("ThemeToggle", () => {
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
});
```

- [ ] **Step 2: Install user-event for this test**

Run:

```bash
pnpm add -D @testing-library/user-event
```

Expected: dependency added.

- [ ] **Step 3: Run test to verify it fails**

Run:

```bash
pnpm test:run __tests__/components/theme-toggle.test.tsx
```

Expected: FAIL because theme components do not exist.

- [ ] **Step 4: Create theme provider**

Create `components/theme/theme-provider.tsx`:

```tsx
"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Theme = "system" | "light" | "dark";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: Theme, origin?: { x: number; y: number }) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const storageKey = "oh-blog-theme";

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function resolveTheme(theme: Theme): ResolvedTheme {
  return theme === "system" ? getSystemTheme() : theme;
}

function applyTheme(theme: Theme): ResolvedTheme {
  const resolved = resolveTheme(theme);
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("dark", resolved === "dark");
  return resolved;
}

function animateThemeChange(update: () => void, origin?: { x: number; y: number }) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const startViewTransition = document.startViewTransition?.bind(document);

  if (!origin || prefersReducedMotion || !startViewTransition) {
    update();
    return;
  }

  const transition = startViewTransition(update);
  const endRadius = Math.hypot(
    Math.max(origin.x, window.innerWidth - origin.x),
    Math.max(origin.y, window.innerHeight - origin.y),
  );

  void transition.ready.then(() => {
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${origin.x}px ${origin.y}px)`,
          `circle(${endRadius}px at ${origin.x}px ${origin.y}px)`,
        ],
      },
      {
        duration: 520,
        easing: "cubic-bezier(.4, 0, .2, 1)",
        pseudoElement: "::view-transition-new(root)",
      },
    );
  });
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    const initialTheme: Theme =
      stored === "light" || stored === "dark" || stored === "system" ? stored : "system";

    setThemeState(initialTheme);
    setResolvedTheme(applyTheme(initialTheme));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const listener = () => {
      if (theme === "system") {
        setResolvedTheme(applyTheme("system"));
      }
    };

    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [theme]);

  const setTheme = useCallback((nextTheme: Theme, origin?: { x: number; y: number }) => {
    animateThemeChange(() => {
      localStorage.setItem(storageKey, nextTheme);
      setThemeState(nextTheme);
      setResolvedTheme(applyTheme(nextTheme));
    }, origin);
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside ThemeProvider");
  return value;
}
```

- [ ] **Step 5: Add View Transition type shim if TypeScript needs it**

If `document.startViewTransition` is not typed by the current TypeScript DOM library, create `types/view-transition.d.ts`:

```ts
interface ViewTransition {
  readonly ready: Promise<void>;
  readonly finished: Promise<void>;
  readonly updateCallbackDone: Promise<void>;
  skipTransition(): void;
}

interface Document {
  startViewTransition?: (updateCallback: () => void) => ViewTransition;
}
```

If TypeScript already knows this API, do not create the shim.

- [ ] **Step 6: Create theme toggle**

Create `components/theme/theme-toggle.tsx`:

```tsx
"use client";

import { useTheme } from "@/components/theme/theme-provider";

const order = ["system", "light", "dark"] as const;

const labels = {
  system: "跟随系统",
  light: "亮色",
  dark: "暗色",
} as const;

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const index = order.indexOf(theme);
    const nextTheme = order[(index + 1) % order.length];

    setTheme(nextTheme, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`切换主题，当前为${labels[theme]}`}
      className="group relative inline-flex h-8 w-16 items-center border-2 border-neon-cyan bg-panel text-foreground shadow-[0_0_18px_var(--glow-cyan)] transition-colors"
    >
      <span
        className="absolute left-1 top-1 h-5 w-5 bg-neon-cyan shadow-[0_0_14px_var(--neon-cyan)] transition-transform group-hover:bg-neon-magenta"
        style={{ transform: resolvedTheme === "dark" ? "translateX(32px)" : "translateX(0)" }}
      />
      <span className="sr-only">{labels[theme]}</span>
      <span aria-hidden className="relative z-10 grid w-full grid-cols-2 text-[10px]">
        <span>☼</span>
        <span>☾</span>
      </span>
    </button>
  );
}
```

- [ ] **Step 7: Run theme toggle test**

Run:

```bash
pnpm test:run __tests__/components/theme-toggle.test.tsx
```

Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add components/theme __tests__/components/theme-toggle.test.tsx package.json pnpm-lock.yaml types/view-transition.d.ts
git commit -m "feat: add animated theme switching"
```

## Task 5: Reusable UI Primitives and Site Chrome

**Files:**
- Create: `components/container.tsx`
- Create: `components/neon-button.tsx`
- Create: `components/neon-panel.tsx`
- Create: `components/prose.tsx`
- Create: `components/site-header.tsx`
- Create: `components/site-footer.tsx`
- Create: `__tests__/components/neon-button.test.tsx`

- [ ] **Step 1: Write failing NeonButton test**

Create `__tests__/components/neon-button.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { NeonButton } from "@/components/neon-button";

describe("NeonButton", () => {
  test("renders a link with an accessible name", () => {
    render(<NeonButton href="/blog">进入博客</NeonButton>);

    expect(screen.getByRole("link", { name: "进入博客" })).toHaveAttribute("href", "/blog");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test:run __tests__/components/neon-button.test.tsx
```

Expected: FAIL because `NeonButton` does not exist yet.

- [ ] **Step 3: Create Container**

Create `components/container.tsx`:

```tsx
type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Container({ children, className = "" }: ContainerProps) {
  return (
    <div className={`mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Create NeonButton**

Create `components/neon-button.tsx`:

```tsx
import Link from "next/link";

type NeonButtonProps = {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary";
  className?: string;
};

const variants = {
  primary:
    "border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-background hover:shadow-[0_0_24px_var(--neon-cyan)]",
  secondary:
    "border-neon-magenta bg-neon-magenta text-white hover:bg-transparent hover:text-neon-magenta hover:shadow-[0_0_24px_var(--neon-magenta)]",
};

export function NeonButton({
  children,
  href,
  variant = "primary",
  className = "",
}: NeonButtonProps) {
  const classes = `inline-flex h-12 -skew-x-12 items-center justify-center border-2 px-5 font-mono text-sm uppercase tracking-wider transition-all duration-200 ease-linear hover:skew-x-0 ${variants[variant]} ${className}`;
  const content = <span className="inline-block skew-x-12 transition-transform group-hover:skew-x-0">{children}</span>;

  if (href) {
    return (
      <Link href={href} className={`group ${classes}`}>
        {content}
      </Link>
    );
  }

  return <button className={`group ${classes}`}>{content}</button>;
}
```

- [ ] **Step 5: Create NeonPanel**

Create `components/neon-panel.tsx`:

```tsx
type NeonPanelProps = {
  children: React.ReactNode;
  className?: string;
};

export function NeonPanel({ children, className = "" }: NeonPanelProps) {
  return (
    <section
      className={`border border-neon-magenta/35 border-t-2 border-t-neon-cyan bg-panel p-6 shadow-[0_0_30px_var(--glow-cyan)] backdrop-blur-md ${className}`}
    >
      {children}
    </section>
  );
}
```

- [ ] **Step 6: Create Prose**

Create `components/prose.tsx`:

```tsx
type ProseProps = {
  children: React.ReactNode;
};

export function Prose({ children }: ProseProps) {
  return (
    <article className="mx-auto max-w-3xl text-lg leading-9 text-foreground/90 [&_a]:text-neon-cyan [&_a]:underline [&_code]:bg-panel-strong [&_code]:px-1.5 [&_h2]:font-heading [&_h2]:text-3xl [&_h2]:text-neon-cyan [&_p]:my-6">
      {children}
    </article>
  );
}
```

- [ ] **Step 7: Create SiteHeader and SiteFooter**

Create `components/site-header.tsx`:

```tsx
import Link from "next/link";
import { Container } from "@/components/container";
import { ThemeToggle } from "@/components/theme/theme-toggle";

const links = [
  { href: "/", label: "首页" },
  { href: "/blog", label: "博客" },
  { href: "/about", label: "关于" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/82 backdrop-blur-xl">
      <Container className="flex h-16 items-center justify-between gap-6">
        <Link href="/" className="font-heading text-xl font-black uppercase text-neon-cyan drop-shadow-[0_0_10px_var(--neon-cyan)]">
          oh-blog
        </Link>
        <nav className="flex items-center gap-5 text-sm text-muted">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="transition-colors hover:text-neon-magenta">
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </Container>
    </header>
  );
}
```

Create `components/site-footer.tsx`:

```tsx
import { Container } from "@/components/container";

export function SiteFooter() {
  return (
    <footer className="border-t border-border py-10 text-sm text-muted">
      <Container className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 oh-blog</p>
        <p className="font-mono uppercase tracking-wider text-neon-cyan">Digital nostalgia / neon future</p>
      </Container>
    </footer>
  );
}
```

- [ ] **Step 8: Run component test**

Run:

```bash
pnpm test:run __tests__/components/neon-button.test.tsx
```

Expected: PASS.

- [ ] **Step 9: Run lint**

Run:

```bash
pnpm lint
```

Expected: PASS or actionable lint errors in the files just created. Fix all new-file lint errors.

- [ ] **Step 10: Commit**

```bash
git add app/globals.css app/layout.tsx components __tests__/components
git commit -m "feat: add vaporwave design primitives"
```

## Task 6: Blog Feature Components

**Files:**
- Create: `features/blog/post-meta.tsx`
- Create: `features/blog/post-card.tsx`
- Create: `features/blog/post-list.tsx`
- Create: `features/blog/post-hero.tsx`

- [ ] **Step 1: Create post metadata component**

Create `features/blog/post-meta.tsx`:

```tsx
import { formatChineseDate } from "@/lib/format/date";
import type { PostMeta as PostMetaType } from "@/lib/content/types";

export function PostMeta({ post }: { post: Pick<PostMetaType, "publishedAt" | "readingTime" | "series"> }) {
  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted">
      {post.series ? (
        <span className="text-neon-orange">
          {post.series.title} / {String(post.series.order).padStart(2, "0")}
        </span>
      ) : null}
      <time dateTime={post.publishedAt}>{formatChineseDate(post.publishedAt)}</time>
      <span>{post.readingTime} 分钟阅读</span>
    </div>
  );
}
```

- [ ] **Step 2: Create post card**

Create `features/blog/post-card.tsx`:

```tsx
import Link from "next/link";
import { NeonPanel } from "@/components/neon-panel";
import type { PostMeta as PostMetaType } from "@/lib/content/types";
import { PostMeta } from "@/features/blog/post-meta";

export function PostCard({ post }: { post: PostMetaType }) {
  return (
    <NeonPanel className="group transition-transform duration-200 ease-linear hover:-translate-y-2">
      <PostMeta post={post} />
      <h2 className="mt-5 font-heading text-2xl font-bold text-neon-cyan drop-shadow-[0_0_8px_var(--neon-cyan)]">
        <Link href={`/blog/${post.slug}`} className="outline-none">
          {post.title}
        </Link>
      </h2>
      <p className="mt-4 text-sm leading-7 text-muted">{post.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span key={tag} className="border border-neon-magenta/50 px-2 py-1 font-mono text-xs text-neon-magenta">
            #{tag}
          </span>
        ))}
      </div>
    </NeonPanel>
  );
}
```

- [ ] **Step 3: Create post list**

Create `features/blog/post-list.tsx`:

```tsx
import { PostCard } from "@/features/blog/post-card";
import type { PostMeta } from "@/lib/content/types";

export function PostList({ posts }: { posts: PostMeta[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {posts.map((post) => (
        <PostCard key={post.slug} post={post} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Create post hero**

Create `features/blog/post-hero.tsx`:

```tsx
import { Container } from "@/components/container";
import type { PostMeta as PostMetaType } from "@/lib/content/types";
import { PostMeta } from "@/features/blog/post-meta";

export function PostHero({ post }: { post: PostMetaType }) {
  return (
    <Container className="py-16 sm:py-24">
      <PostMeta post={post} />
      <h1 className="mt-6 max-w-4xl font-heading text-5xl font-black uppercase leading-tight text-neon-cyan drop-shadow-[0_0_24px_var(--neon-cyan)] sm:text-7xl">
        {post.title}
      </h1>
      <p className="mt-6 max-w-2xl text-xl leading-9 text-muted">{post.description}</p>
    </Container>
  );
}
```

- [ ] **Step 5: Run lint**

Run:

```bash
pnpm lint
```

Expected: PASS or only lint errors in these files. Fix all new-file lint errors.

- [ ] **Step 6: Commit**

```bash
git add features/blog
git commit -m "feat: add blog presentation components"
```

## Task 7: Routes, Metadata, and Pages

**Files:**
- Modify: `app/page.tsx`
- Create: `app/about/page.tsx`
- Create: `app/blog/page.tsx`
- Create: `app/blog/[slug]/page.tsx`
- Create: `app/blog/[slug]/not-found.tsx`

- [ ] **Step 1: Replace homepage**

Replace `app/page.tsx` with:

```tsx
import { Container } from "@/components/container";
import { NeonButton } from "@/components/neon-button";
import { NeonPanel } from "@/components/neon-panel";
import { PostList } from "@/features/blog/post-list";
import { getFeaturedPosts } from "@/lib/content/posts";

export default async function Home() {
  const featuredPosts = await getFeaturedPosts();

  return (
    <>
      <Container className="py-20 sm:py-32">
        <section>
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-neon-orange">
            &gt; synthetic journal online
          </p>
          <h1 className="mt-6 max-w-5xl font-heading text-6xl font-black uppercase leading-none text-transparent bg-gradient-to-r from-neon-orange via-neon-magenta to-neon-cyan bg-clip-text sm:text-8xl">
            oh-blog
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-9 text-muted">
            一个中文 Vaporwave / Outrun 风格的个人博客，记录前端、设计系统和数字怀旧。
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <NeonButton href="/blog">进入博客</NeonButton>
            <NeonButton href="/about" variant="secondary">关于我</NeonButton>
          </div>
        </section>
      </Container>
      <Container className="pb-24">
        <NeonPanel className="mb-8">
          <h2 className="font-heading text-3xl text-neon-cyan">精选文章</h2>
          <p className="mt-3 text-muted">从霓虹终端里挑出的最近信号。</p>
        </NeonPanel>
        <PostList posts={featuredPosts} />
      </Container>
    </>
  );
}
```

- [ ] **Step 2: Add about page**

Create `app/about/page.tsx`:

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { NeonPanel } from "@/components/neon-panel";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 oh-blog 和这个中文霓虹博客的设计方向。",
};

export default function AboutPage() {
  return (
    <Container className="py-20 sm:py-28">
      <NeonPanel>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-neon-orange">&gt; about signal</p>
        <h1 className="mt-6 font-heading text-5xl font-black uppercase text-neon-cyan">关于 oh-blog</h1>
        <p className="mt-6 max-w-3xl text-lg leading-9 text-muted">
          这里是一个把前端工程、界面设计和数字怀旧放在同一个屏幕里的中文个人站。它应该大胆、发光、带一点终端噪声，同时仍然认真对待读者的眼睛。
        </p>
      </NeonPanel>
    </Container>
  );
}
```

- [ ] **Step 3: Add blog index page**

Create `app/blog/page.tsx`:

```tsx
import type { Metadata } from "next";
import { Container } from "@/components/container";
import { PostList } from "@/features/blog/post-list";
import { getAllPosts } from "@/lib/content/posts";

export const metadata: Metadata = {
  title: "博客",
  description: "oh-blog 的所有中文文章。",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <Container className="py-20 sm:py-28">
      <p className="font-mono text-sm uppercase tracking-[0.3em] text-neon-orange">&gt; archive loaded</p>
      <h1 className="mt-6 font-heading text-5xl font-black uppercase text-neon-cyan">博客</h1>
      <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">文章列表按发布时间倒序排列。</p>
      <div className="mt-12">
        <PostList posts={posts} />
      </div>
    </Container>
  );
}
```

- [ ] **Step 4: Add blog detail page**

Create `app/blog/[slug]/page.tsx`:

```tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Prose } from "@/components/prose";
import { PostHero } from "@/features/blog/post-hero";
import { getAllPosts, getPostBySlug } from "@/lib/content/posts";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "文章不存在",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const Body = post.body;

  return (
    <>
      <PostHero post={post} />
      <Prose>
        <Body />
      </Prose>
    </>
  );
}
```

- [ ] **Step 5: Add blog not found page**

Create `app/blog/[slug]/not-found.tsx`:

```tsx
import { Container } from "@/components/container";
import { NeonButton } from "@/components/neon-button";
import { NeonPanel } from "@/components/neon-panel";

export default function BlogPostNotFound() {
  return (
    <Container className="py-20 sm:py-28">
      <NeonPanel>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-neon-orange">&gt; signal lost</p>
        <h1 className="mt-6 font-heading text-5xl font-black uppercase text-neon-cyan">文章不存在</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">这篇文章可能还在草稿箱里，也可能已经驶离网格。</p>
        <div className="mt-8">
          <NeonButton href="/blog">返回博客</NeonButton>
        </div>
      </NeonPanel>
    </Container>
  );
}
```

- [ ] **Step 6: Run build to generate route types**

Run:

```bash
pnpm build
```

Expected: PASS. If `PageProps` is not available before type generation, run `pnpm next typegen` if supported by the installed Next CLI, then rerun build.

- [ ] **Step 7: Commit**

```bash
git add app
git commit -m "feat: add blog routes and metadata"
```

## Task 8: Motion Animation Island

**Files:**
- Create: `components/motion/animated-section.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create Motion Client Component**

Create `components/motion/animated-section.tsx`:

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";

type AnimatedSectionProps = {
  children: React.ReactNode;
  className?: string;
};

export function AnimatedSection({ children, className = "" }: AnimatedSectionProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.section
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 24 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      {children}
    </motion.section>
  );
}
```

- [ ] **Step 2: Add the animation island to the homepage**

Modify the hero wrapper in `app/page.tsx` to import and use `AnimatedSection`:

```tsx
import { AnimatedSection } from "@/components/motion/animated-section";
```

Replace the homepage hero wrapper:

```tsx
<Container className="py-20 sm:py-32">
  <AnimatedSection>
    <p className="font-mono text-sm uppercase tracking-[0.3em] text-neon-orange">
      &gt; synthetic journal online
    </p>
    <h1 className="mt-6 max-w-5xl bg-gradient-to-r from-neon-orange via-neon-magenta to-neon-cyan bg-clip-text font-heading text-6xl font-black uppercase leading-none text-transparent sm:text-8xl">
      oh-blog
    </h1>
    <p className="mt-8 max-w-2xl text-xl leading-9 text-muted">
      一个中文 Vaporwave / Outrun 风格的个人博客，记录前端、设计系统和数字怀旧。
    </p>
    <div className="mt-10 flex flex-col gap-4 sm:flex-row">
      <NeonButton href="/blog">进入博客</NeonButton>
      <NeonButton href="/about" variant="secondary">
        关于我
      </NeonButton>
    </div>
  </AnimatedSection>
</Container>
```

- [ ] **Step 3: Run lint**

Run:

```bash
pnpm lint
```

Expected: PASS.

- [ ] **Step 4: Run homepage build check**

Run:

```bash
pnpm build
```

Expected: PASS. Confirm the only Client Component boundary for homepage animation is `AnimatedSection`.

- [ ] **Step 5: Commit**

```bash
git add components/motion app/page.tsx
git commit -m "feat: add motion animation island"
```

## Task 9: Final Verification and Browser Review

**Files:**
- Review all changed files.

- [ ] **Step 1: Run tests**

Run:

```bash
pnpm test:run
```

Expected: all Vitest tests pass.

- [ ] **Step 2: Run lint**

Run:

```bash
pnpm lint
```

Expected: lint passes.

- [ ] **Step 3: Run production build**

Run:

```bash
pnpm build
```

Expected: build passes and route types generate cleanly.

- [ ] **Step 4: Start dev server**

Run:

```bash
pnpm dev
```

Expected: Next starts on `http://localhost:3000`, or the next available port if 3000 is occupied.

- [ ] **Step 5: Inspect pages in browser**

Open:

```txt
http://localhost:3000/
http://localhost:3000/blog
http://localhost:3000/blog/hello-neon
http://localhost:3000/about
```

Expected:

- Header and footer render on every page.
- Theme toggle cycles system, light, and dark.
- Theme switch expands from the toggle position where supported.
- Blog list shows `system-dreams` before `hello-neon`.
- `hello-neon` shows series number `霓虹工程日志 / 01`.
- Article body is readable in both themes.
- Reduced motion mode disables major transition effects.

- [ ] **Step 6: Stop dev server**

Stop the running `pnpm dev` process with `Ctrl-C`.

- [ ] **Step 7: Commit verification fixes**

If any verification fixes were required:

```bash
git add .
git commit -m "fix: polish foundation verification"
```

If no fixes were required, do not create an empty commit.

## Plan Self-Review Checklist

- Spec coverage: routes, content abstraction, MDX, Chinese defaults, Vaporwave visuals, Tailwind v4 theme tokens, Element Plus style theme transition, Motion islands, accessibility, and Vitest coverage are represented.
- Completion scan: every task includes concrete files, commands, and code snippets.
- Type consistency: `PostMeta`, `Post`, `getAllPosts`, `getPostBySlug`, `ThemeProvider`, `ThemeToggle`, and `AnimatedSection` names are consistent across tasks.
- Scope check: tags pages, search, comments, newsletter, admin, and draft preview remain out of scope.
