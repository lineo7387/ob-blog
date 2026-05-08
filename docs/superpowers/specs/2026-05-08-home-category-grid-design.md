# Home Category Grid Design

## Context

`oh-blog` already reads categorized Markdown posts from `content/posts/<category>/` and exposes category summaries through `getCategories()`. The `/blog` page already links to category routes such as `/blog/react`, and `app/blog/[...slug]/page.tsx` already renders category archive pages.

The homepage currently presents the hero and featured posts. Because the content is strongly tutorial- and technology-category-driven, the homepage should expose the main technical channels directly instead of requiring readers to discover them through the blog archive.

## Goal

Add a homepage "technical channels" section that gives each category a visual card with a technology icon, title, article count, short description, and link to the existing category page.

This should make the homepage better at answering:

- What topics does this blog cover?
- Where should I start if I care about one technology stack?
- How can I jump directly into a topic series?

## Scope

In scope:

- Homepage category card grid between the hero and featured posts.
- Icon support for each technology category.
- Category descriptions and visual accent metadata.
- Reuse of existing category routes and content APIs.
- Focused tests for category metadata and rendering behavior.

Out of scope:

- New category route structure.
- Search, filtering, or sorting controls.
- Tag pages.
- CMS or admin editing.
- Per-category hero images.

## Recommended Approach

Use the existing category model as the source of truth and add presentation metadata for homepage display.

Install and use `simple-icons` for technology stack icons. Map known category slugs to Simple Icons entries, such as React, Vue, Node.js, MySQL, Spring Boot, Electron, TypeScript, JavaScript, Python, FastAPI, Astro, Express, HTMX, Java, and React Native.

Use a fallback icon style for categories that do not have an explicit mapping. The fallback should look intentional in the Vaporwave interface, such as a terminal/code glyph or a generic neon mark.

This approach is preferred because the blog has many technology categories and will likely add more. A local folder of copied SVGs would avoid one dependency, but it would make future category maintenance more manual.

## Data Design

Keep the existing `CategorySummary` shape for core content data:

```ts
type CategorySummary = {
  slug: string
  title: string
  count: number
}
```

Add a small presentation metadata layer keyed by category slug:

```ts
type CategoryDisplayMeta = {
  description: string
  icon: React.ComponentType
  accent: string
}
```

The metadata should not replace the content model. It should decorate category summaries for display. This keeps route and content logic separate from homepage visual decisions.

Descriptions should be concise and Chinese-first. Examples:

- React: "组件、状态、路由与性能优化。"
- Node.js: "运行时、模块系统、异步 I/O 与工程实践。"
- Spring Boot: "后端工程、配置、安全、测试与部署。"
- MySQL: "SQL、索引、事务、复制与查询优化。"

If a category has no custom description, use a fallback such as:

> 汇总该技术方向的系列笔记与实践文章。

## UI Design

Add a section after the homepage hero and before featured posts.

Section content:

- Eyebrow: `> channels detected`
- Heading: `技术频道`
- Supporting copy: A short sentence explaining that readers can choose a stack and enter its article series.
- Category grid: responsive cards.

Card content:

- Icon badge.
- Category title.
- Article count.
- One-line or two-line description.
- Full-card link to `/blog/<categorySlug>`.

Layout:

- Mobile: one column.
- Tablet: two columns.
- Desktop: three columns.

Visual treatment:

- Match existing Vaporwave / Outrun styling.
- Use neon borders, dark panel backgrounds, and subtle hover glow.
- Keep icon treatment consistent across brands. Brand color can be used as a small accent or glow, but the cards should still feel like one design system.
- Avoid oversized cards. The section should add navigation value without pushing featured posts too far down.

## Component Design

Add a blog feature component such as:

```txt
features/blog/category-grid.tsx
```

The component should accept prepared category view models:

```ts
type CategoryGridItem = {
  slug: string
  title: string
  count: number
  description: string
  href: Route
  icon: React.ComponentType
  accent: string
}
```

The page should stay responsible for fetching data. The component should stay responsible for rendering.

Add a content/display helper only if it keeps the page simple, for example:

```txt
lib/content/categories.ts
```

or keep the metadata near the blog feature if it is only used for display. The final implementation should follow the repository's existing organization and avoid over-abstracting a single-use mapping.

## Data Flow

1. `app/page.tsx` calls `getCategories()` alongside `getFeaturedPosts()`.
2. Category summaries are decorated with homepage display metadata.
3. The homepage renders the category grid.
4. Each card links to the existing `/blog/<categorySlug>` route.
5. Existing category pages continue to render the post list for that category.

No new server action, API route, or client-side state is required.

## Error Handling

If no categories exist, the homepage should omit the category section rather than rendering an empty panel.

If an icon mapping is missing, render the fallback icon and fallback description.

If a category route is missing due to a future content bug, the existing `notFound()` behavior on `/blog/[...slug]` remains the route-level guard.

## Testing

Add focused tests for the new behavior:

- Category decoration returns known descriptions and fallback descriptions.
- Known slugs receive icon metadata without throwing.
- Homepage/category grid rendering includes category links, titles, counts, and descriptions.

Existing tests for content posts should continue to pass.

## Implementation Notes

Before implementation, read the relevant local Next.js guide under `node_modules/next/dist/docs/` as required by `AGENTS.md`, especially App Router and routing guidance relevant to `app/page.tsx` and typed routes.

The implementation should avoid making the homepage a Client Component. The icon rendering and category cards can be rendered as Server Components unless the selected icon package forces a client boundary.

The implementation should add the `simple-icons` dependency through the project's package manager and keep lockfile changes limited to that dependency.
