# Home Category Grid Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a homepage technical-channel grid where each blog category renders as a linked card with a Simple Icons technology logo, count, and Chinese description.

**Architecture:** Keep category discovery in `lib/content/posts.ts` and add a small display-metadata helper for homepage presentation. Render the grid with a Server Component under `features/blog/`, then compose it into `app/page.tsx` between the hero and featured posts.

**Tech Stack:** Next.js 16 App Router, React 19 Server Components, TypeScript, Tailwind CSS v4, Vitest, Testing Library, `simple-icons`.

---

## File Structure

- Create: `lib/content/category-display.ts`
  - Owns category description, accent, Simple Icons mapping, fallback icon, and `toCategoryGridItems()`.
- Create: `features/blog/category-grid.tsx`
  - Server-rendered category card grid component.
- Create: `__tests__/content/category-display.test.ts`
  - Unit tests for category display metadata, known icon mapping, fallback behavior, and route hrefs.
- Create: `__tests__/components/category-grid.test.tsx`
  - Component test for links, counts, descriptions, and icon accessibility behavior.
- Modify: `app/page.tsx`
  - Fetch categories and render `CategoryGrid` between hero and featured posts.
- Modify: `package.json`
  - Add `simple-icons` dependency.
- Modify: `pnpm-lock.yaml`
  - Updated by `pnpm add simple-icons`.

## Prerequisite: Read Local Next.js Docs

- [ ] **Step 1: Read App Router page and project structure docs**

Run:

```bash
sed -n '1,220p' node_modules/next/dist/docs/01-app/01-getting-started/03-layouts-and-pages.md
sed -n '1,180p' node_modules/next/dist/docs/01-app/01-getting-started/02-project-structure.md
```

Expected: docs describe `app/` pages, layouts, and project organization. Confirm no route-file changes are needed beyond `app/page.tsx`.

- [ ] **Step 2: Read Server/Client Component and navigation docs**

Run:

```bash
sed -n '1,220p' node_modules/next/dist/docs/01-app/01-getting-started/05-server-and-client-components.md
sed -n '1,220p' node_modules/next/dist/docs/01-app/01-getting-started/04-linking-and-navigating.md
```

Expected: docs confirm `app/page.tsx` and `features/blog/category-grid.tsx` can stay Server Components, and `next/link` is the correct navigation primitive.

## Task 1: Add Simple Icons Dependency

**Files:**
- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [ ] **Step 1: Install dependency**

Run:

```bash
pnpm add simple-icons
```

Expected: `package.json` contains `"simple-icons"` under `dependencies`, and `pnpm-lock.yaml` changes only for that package and lockfile metadata.

- [ ] **Step 2: Verify package exports**

Run:

```bash
node -e "const icons = require('simple-icons'); console.log(Boolean(icons.siReact && icons.siNodedotjs && icons.siMysql))"
```

Expected:

```txt
true
```

- [ ] **Step 3: Commit dependency**

Run:

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add simple icons"
```

Expected: commit succeeds with only dependency files staged.

## Task 2: Add Category Display Metadata

**Files:**
- Create: `__tests__/content/category-display.test.ts`
- Create: `lib/content/category-display.ts`

- [ ] **Step 1: Write failing tests**

Create `__tests__/content/category-display.test.ts`:

```ts
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run:

```bash
pnpm test:run -- __tests__/content/category-display.test.ts
```

Expected: FAIL because `@/lib/content/category-display` does not exist.

- [ ] **Step 3: Implement metadata helper**

Create `lib/content/category-display.ts`:

```ts
import type { Route } from "next";
import {
  siAstro,
  siElectron,
  siExpress,
  siFastapi,
  siHtmx,
  siJavascript,
  siMysql,
  siNodedotjs,
  siPython,
  siReact,
  siSpringboot,
  siTypescript,
  siVuedotjs,
  type SimpleIcon,
} from "simple-icons";
import type { CategorySummary } from "@/lib/content/types";

export type CategoryIcon = Pick<SimpleIcon, "title" | "hex" | "path">;

export type CategoryGridItem = CategorySummary & {
  href: Route;
  description: string;
  accent: string;
  icon: CategoryIcon;
};

const fallbackIcon: CategoryIcon = {
  title: "Code",
  hex: "22D3EE",
  path: "M4 7.5 1.5 12 4 16.5l1.7-.95L3.75 12l1.95-3.55L4 7.5Zm16 0-1.7.95L20.25 12l-1.95 3.55 1.7.95 2.5-4.5L20 7.5ZM14.35 5 8.6 19h2.05L16.4 5h-2.05Z",
};

const displayMetaBySlug: Record<string, { description: string; icon: CategoryIcon; accent?: string }> = {
  astro: {
    description: "内容驱动站点、组件岛与 Astro 5 实践。",
    icon: siAstro,
  },
  electron: {
    description: "桌面应用、IPC、安全、打包与性能。",
    icon: siElectron,
  },
  express: {
    description: "Node.js Web 服务、路由、中间件与静态资源。",
    icon: siExpress,
  },
  fastapi: {
    description: "Python API、类型声明、异步服务与工程化。",
    icon: siFastapi,
  },
  htmx: {
    description: "HTML 优先的交互增强与服务端渲染体验。",
    icon: siHtmx,
  },
  java: {
    description: "Java 语言基础、工程实践与生态要点。",
    icon: fallbackIcon,
    accent: "#F89820",
  },
  javascript: {
    description: "语言机制、浏览器 API 与现代工程基础。",
    icon: siJavascript,
  },
  mysql: {
    description: "SQL、索引、事务、复制与查询优化。",
    icon: siMysql,
  },
  nodejs: {
    description: "运行时、模块系统、异步 I/O 与工程实践。",
    icon: siNodedotjs,
  },
  python: {
    description: "语法、生态、服务开发与自动化实践。",
    icon: siPython,
  },
  react: {
    description: "组件、状态、路由与性能优化。",
    icon: siReact,
  },
  "react-native": {
    description: "跨端组件、布局、状态与移动端工程实践。",
    icon: siReact,
    accent: "#61DAFB",
  },
  springboot: {
    description: "后端工程、配置、安全、测试与部署。",
    icon: siSpringboot,
  },
  typescript: {
    description: "类型系统、工程配置与大型项目维护。",
    icon: siTypescript,
  },
  vue: {
    description: "组合式 API、响应式系统、路由与构建优化。",
    icon: siVuedotjs,
  },
};

export function getCategoryDisplayMeta(slug: string) {
  const meta = displayMetaBySlug[slug];
  const icon = meta?.icon ?? fallbackIcon;

  return {
    description: meta?.description ?? "汇总该技术方向的系列笔记与实践文章。",
    icon,
    accent: meta?.accent ?? `#${icon.hex}`,
  };
}

export function toCategoryGridItems(categories: CategorySummary[]): CategoryGridItem[] {
  return categories.map((category) => ({
    ...category,
    href: `/blog/${category.slug}` as Route,
    ...getCategoryDisplayMeta(category.slug),
  }));
}
```

- [ ] **Step 4: Run metadata tests**

Run:

```bash
pnpm test:run -- __tests__/content/category-display.test.ts
```

Expected: PASS.

- [ ] **Step 5: Commit metadata helper**

Run:

```bash
git add __tests__/content/category-display.test.ts lib/content/category-display.ts
git commit -m "feat: add category display metadata"
```

Expected: commit succeeds with the metadata helper and tests.

## Task 3: Add Category Grid Component

**Files:**
- Create: `__tests__/components/category-grid.test.tsx`
- Create: `features/blog/category-grid.tsx`

- [ ] **Step 1: Write failing component test**

Create `__tests__/components/category-grid.test.tsx`:

```tsx
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
```

- [ ] **Step 2: Run test to verify it fails**

Run:

```bash
pnpm test:run -- __tests__/components/category-grid.test.tsx
```

Expected: FAIL because `@/features/blog/category-grid` does not exist.

- [ ] **Step 3: Implement component**

Create `features/blog/category-grid.tsx`:

```tsx
import Link from "next/link";
import type { CategoryGridItem } from "@/lib/content/category-display";

export function CategoryGrid({ categories }: { categories: CategoryGridItem[] }) {
  if (categories.length === 0) return null;

  return (
    <section aria-labelledby="category-grid-title">
      <div className="mb-8">
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-neon-orange">
          &gt; channels detected
        </p>
        <h2 id="category-grid-title" className="mt-4 font-heading text-3xl text-neon-cyan">
          技术频道
        </h2>
        <p className="mt-3 max-w-2xl text-muted">
          选择一个技术栈，直接进入对应的系列文章。
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={category.href}
            className="group border border-neon-cyan/30 bg-panel-strong p-5 transition-all duration-200 hover:-translate-y-1 hover:border-neon-orange hover:shadow-[0_0_22px_rgba(255,107,53,0.22)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan"
          >
            <div className="flex items-start gap-4">
              <span
                className="grid size-12 shrink-0 place-items-center border bg-background/70 transition-transform duration-200 group-hover:rotate-3"
                style={{
                  borderColor: category.accent,
                  boxShadow: `0 0 18px ${category.accent}44`,
                }}
                aria-hidden="true"
              >
                <svg
                  data-testid="category-icon"
                  viewBox="0 0 24 24"
                  className="size-6"
                  fill="currentColor"
                  style={{ color: category.accent }}
                  aria-hidden="true"
                >
                  <path d={category.icon.path} />
                </svg>
              </span>
              <span className="min-w-0">
                <span className="block font-heading text-xl text-foreground transition-colors group-hover:text-neon-orange">
                  {category.title}
                </span>
                <span className="mt-1 block font-mono text-xs uppercase tracking-widest text-neon-cyan">
                  {category.count} 篇文章
                </span>
              </span>
            </div>
            <p className="mt-4 min-h-12 text-sm leading-6 text-muted">{category.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run component test**

Run:

```bash
pnpm test:run -- __tests__/components/category-grid.test.tsx
```

Expected: PASS.

- [ ] **Step 5: Commit component**

Run:

```bash
git add __tests__/components/category-grid.test.tsx features/blog/category-grid.tsx
git commit -m "feat: add category grid component"
```

Expected: commit succeeds with the component and test.

## Task 4: Compose Grid Into Homepage

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Update homepage data and rendering**

Modify `app/page.tsx` to import the grid and category metadata:

```tsx
import { Container } from "@/components/container";
import { AnimatedSection } from "@/components/motion/animated-section";
import { NeonButton } from "@/components/neon-button";
import { NeonPanel } from "@/components/neon-panel";
import { CategoryGrid } from "@/features/blog/category-grid";
import { PostList } from "@/features/blog/post-list";
import { toCategoryGridItems } from "@/lib/content/category-display";
import { getCategories, getFeaturedPosts } from "@/lib/content/posts";

export default async function Home() {
  const [featuredPosts, categories] = await Promise.all([getFeaturedPosts(), getCategories()]);
  const categoryItems = toCategoryGridItems(categories);

  return (
    <>
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
      <Container className="pb-20">
        <CategoryGrid categories={categoryItems} />
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

- [ ] **Step 2: Run targeted tests**

Run:

```bash
pnpm test:run -- __tests__/content/category-display.test.ts __tests__/components/category-grid.test.tsx
```

Expected: PASS.

- [ ] **Step 3: Commit homepage composition**

Run:

```bash
git add app/page.tsx
git commit -m "feat: show category grid on homepage"
```

Expected: commit succeeds with only `app/page.tsx`.

## Task 5: Verify Build, Lint, and Visual Result

**Files:**
- No planned source edits unless verification finds a bug.

- [ ] **Step 1: Run full tests**

Run:

```bash
pnpm test:run
```

Expected: PASS for the full Vitest suite.

- [ ] **Step 2: Run lint**

Run:

```bash
pnpm lint
```

Expected: PASS with no ESLint errors.

- [ ] **Step 3: Run production build**

Run:

```bash
pnpm build
```

Expected: PASS. Confirm there are no Server Component, typed route, or package import errors.

- [ ] **Step 4: Start local dev server**

Run:

```bash
pnpm dev
```

Expected: local server starts and prints a localhost URL, usually `http://localhost:3000`.

- [ ] **Step 5: Inspect homepage in browser**

Open the local URL and verify:

- The homepage shows hero, then `技术频道`, then `精选文章`.
- Category cards render icons.
- Card links point to `/blog/<categorySlug>`.
- Mobile width has one column.
- Desktop width has three columns.
- Text does not overlap or overflow.

- [ ] **Step 6: Commit any verification fixes**

If verification required source changes, run:

```bash
git add <changed-files>
git commit -m "fix: polish homepage category grid"
```

Expected: commit succeeds only if fixes were needed. If no fixes were needed, skip this step.
