# oh-blog Project Foundation Design

## Context

`oh-blog` starts from a fresh Create Next App baseline with Next.js 16.2.4, React 19.2.4, TypeScript, ESLint, and Tailwind CSS v4. The project keeps the current root-level `app/` directory.

Project-specific constraints:

- `AGENTS.md` requires reading local Next documentation under `node_modules/next/dist/docs/` before implementation.
- Next 16 App Router conventions apply, including Promise-based `params` and `searchParams`, Server Components by default, and `proxy.ts` replacing middleware.
- `designer.md` defines a high-intensity Vaporwave / Outrun visual system.
- This foundation design does not implement application code. It defines the architecture and implementation target for a later plan.

## Product Scope

First version routes:

- `/` personal homepage
- `/blog` post listing
- `/blog/[slug]` post detail
- `/about` about page

The site defaults to Chinese:

- Root document language is `zh-CN`.
- UI copy, metadata, SEO descriptions, and date formatting default to Chinese.
- Internationalization is not part of the first implementation.

Out of scope for the first version:

- Tags route such as `/tags/[tag]`
- Search
- Comments
- Newsletter subscription
- Admin/editor dashboard
- Draft preview routes

## Architecture

Use a layered architecture:

- Route layer: `app/`
- Reusable design system layer: `components/`
- Blog feature layer: `features/blog/`
- Content abstraction layer: `lib/content/`
- Local content source: `content/posts/`
- Shared formatting utilities: `lib/format/`

Pages consume stable content APIs and UI components. Pages must not read MDX files or parse frontmatter directly. This keeps the route layer independent from the initial local content source and leaves room to replace MDX with a CMS later.

Recommended Next.js config:

- Enable `typedRoutes: true`.
- Do not enable experimental or platform-specific features unless a later implementation plan identifies a concrete need.
- Do not introduce `proxy.ts` in the first version unless request-aware redirects or request header changes become necessary.

Server and Client Component boundaries:

- Routes and most display components remain Server Components by default.
- Client Components are only used for theme state, theme toggle animation, Motion-powered UI islands, or browser-only interactions.
- Do not place `"use client"` at page or layout level unless a specific route cannot be implemented otherwise.

## Proposed File Responsibilities

```txt
app/
  layout.tsx
  globals.css
  page.tsx
  about/page.tsx
  blog/page.tsx
  blog/[slug]/page.tsx
  blog/[slug]/not-found.tsx

components/
  site-header.tsx
  site-footer.tsx
  container.tsx
  neon-button.tsx
  neon-panel.tsx
  prose.tsx
  motion/animated-section.tsx
  theme/theme-provider.tsx
  theme/theme-toggle.tsx

features/
  blog/post-card.tsx
  blog/post-list.tsx
  blog/post-hero.tsx
  blog/post-meta.tsx

lib/
  content/posts.ts
  content/types.ts
  content/markdown.ts
  format/date.ts

content/
  posts/
    example-post.mdx

__tests__/
  content/posts.test.ts
  components/neon-button.test.tsx
```

`app/` handles routing, metadata, layout composition, route-level error states, and Next special files.

`components/` contains reusable, cross-page UI primitives and site chrome. These components should express the Vaporwave design system through tokens rather than one-off hard-coded classes.

`components/motion/` contains small Client Component animation islands using Motion for React.

`components/theme/` contains theme state, persistence, and the Element Plus style expansion transition.

`features/blog/` contains blog-specific presentation components.

`lib/content/` contains the local content source adapter and the public content query API.

`lib/format/` contains deterministic formatting helpers such as Chinese date formatting.

`content/posts/` stores first-version local posts.

## Content Model

The content layer exposes a normalized `Post` model:

```ts
type Post = {
  slug: string
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  status: "published" | "draft"
  tags: string[]
  cover?: {
    src: string
    alt: string
  }
  series?: {
    title: string
    order: number
  }
  readingTime: number
  featured: boolean
  body: MDXContent
}
```

Required frontmatter fields:

- `title`
- `description`
- `publishedAt`
- `status`

Optional frontmatter fields:

- `updatedAt`
- `tags`
- `cover`
- `series`
- `featured`

Post numbering:

- No global article number is required.
- Series numbering is supported with optional `series.title` and `series.order`.
- URLs continue to use `slug` as the only route identifier.

Draft behavior:

- Draft posts do not appear in production listing pages.
- Draft posts do not appear in `generateStaticParams()`.
- Development may display drafts with a visible draft indicator.

Content APIs:

- `getAllPosts()` returns normalized published posts sorted by `publishedAt` descending unless explicitly asked for drafts in development.
- `getPostBySlug(slug)` returns a single normalized post or `null`.
- `getFeaturedPosts()` returns featured published posts.

Content implementation strategy:

- Store posts as local MDX content in `content/posts/`.
- Do not use MDX files as App Router page files.
- Use a content adapter in `lib/content/` to read frontmatter, validate required fields, compute reading time, and expose normalized posts.
- Prefer official Next MDX support for rendering MDX with App Router. Implementation may add `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, and `@types/mdx` as described in the local Next MDX guide.
- If frontmatter parsing is not provided by the selected MDX path, add a small parser dependency such as `gray-matter`.
- If reading time is not computed internally, add a small deterministic helper or a focused package such as `reading-time`.

## Routing, Metadata, and SEO

Root metadata defines the Chinese site defaults. The post detail route generates per-post metadata from the normalized `Post` model:

- title
- description
- Open Graph title and description
- optional Open Graph image from `cover`
- canonical URL

`app/blog/[slug]/page.tsx` must follow Next 16 route typing:

- Treat `params` as a Promise.
- Prefer `PageProps<'/blog/[slug]'>` after route types are generated.
- Call `notFound()` when `getPostBySlug()` returns `null`.

`generateStaticParams()` should use published posts from `getAllPosts()`.

If metadata and page rendering need the same post, use a shared cached content function where appropriate. Avoid adding complex revalidation in the first version unless implementation discovers a real need.

## Visual System

Use the Vaporwave / Outrun system from `designer.md` as the visual foundation:

- Neon magenta, cyan, and sunset orange accents
- Dark synthetic background
- Perspective grid backgrounds
- CRT scanline overlay
- Terminal/window chrome details
- Skewed and sharp-edged interactive elements
- Strong glow, gradient text, and geometric composition

The site supports both dark and light themes:

- Dark mode is the primary high-intensity Vaporwave mode.
- Light mode is a Daylight Synthwave adaptation: still neon and geometric, but with reduced glow, reduced scanline opacity, and improved text contrast.
- The user can choose `system`, `light`, or `dark`.

Theme implementation strategy:

- Define all core visual tokens as CSS variables in `app/globals.css`.
- Use a root class or data attribute such as `html.dark` and `html[data-theme="light"]`.
- Map CSS variables into Tailwind v4 with `@theme inline`.
- Components use stable Tailwind token utilities such as `bg-background`, `text-foreground`, and `border-neon-cyan`.
- Avoid dynamic Tailwind class construction.
- Avoid hard-coded theme colors inside reusable components unless the value is a deliberate non-theme asset.

Typography:

- Use `next/font` so fonts are self-hosted.
- Use Orbitron for headings and strong Latin/numeric display text.
- Use Share Tech Mono for UI labels, metadata, code-like details, and terminal accents.
- Chinese body copy should fall back to a readable system sans-serif if the display fonts do not support Chinese well.

## Theme Toggle Animation

Theme switching should emulate the Element Plus click transition shown in the reference image:

- The theme toggle records the clicked button center.
- The new theme reveals through a circular expansion from that point.
- The expansion radius is large enough to cover the full viewport.
- Prefer the View Transition API with a `clip-path: circle(...)` animation.
- Provide a fixed overlay fallback for browsers without View Transition support.
- Respect `prefers-reduced-motion: reduce` by switching themes without expansion animation.
- Persist user choice in `localStorage`.
- Use a small inline script in the root document to apply the initial theme before hydration and prevent a flash of the wrong theme.

This transition is visual only. The actual theme state remains CSS variables controlled by the root theme class or attribute, so it is compatible with Tailwind CSS v4.

## Animation Strategy

Use CSS-first animation:

- Scanlines
- Grid atmosphere
- Glow pulses
- Hover skew transitions
- Terminal cursor
- Basic color and shadow transitions

Use Motion for React only for orchestration that benefits from an animation library:

- Homepage section entrance
- Scroll reveal
- Blog card stagger
- Future list layout transitions

Motion rules:

- Import Motion from `motion/react`.
- Keep Motion usage inside small Client Component boundaries.
- Do not mark full pages or the root layout as Client Components to use Motion.
- Respect `prefers-reduced-motion`.

## Accessibility

Core requirements:

- Keyboard-visible focus states with strong neon contrast.
- Theme toggle has an accessible name and exposes current state.
- Motion and theme transitions respect reduced motion preferences.
- Article body has comfortable Chinese reading width, line height, and contrast in both themes.
- Decorative scanlines, grids, and glow layers must not block pointer events or screen reader flow.
- Links and buttons remain distinguishable by more than color alone where practical.

## Testing and Verification

Add Vitest and React Testing Library for focused tests:

- Content parsing and normalization
- Draft filtering
- Slug lookup
- Featured post filtering
- Series numbering normalization
- Date formatting
- Synchronous UI component rendering and accessible names

Do not force unit tests for async Server Components in the first version. Use `pnpm lint` and `pnpm build` as integration verification. Add Playwright later if visual regression or page-level behavior becomes important.

Expected verification commands for implementation:

```bash
pnpm lint
pnpm test
pnpm build
```

## Open Decisions Resolved

- Content source: local abstraction layer first, CMS-replaceable later.
- First route scope: personal site plus blog.
- Source layout: keep root-level `app/`.
- Visual intensity: full Vaporwave / Outrun.
- Language: Chinese first.
- Components: custom lightweight design system, no shadcn/ui in first version.
- Tests: add Vitest + React Testing Library.
- Animation library: include Motion for React with small Client Component boundaries.
- Theme: support system, light, and dark with Element Plus style circular expansion transition.
