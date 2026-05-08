import Link from "next/link";

import { NeonPanel } from "@/components/neon-panel";
import type { CategoryGridItem } from "@/lib/content/category-display";

export function CategoryGrid({ categories }: { categories: CategoryGridItem[] }) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="category-grid-title">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-neon-orange">
          &gt; channels detected
        </p>
        <h2
          id="category-grid-title"
          className="mt-3 font-heading text-3xl font-bold text-neon-cyan drop-shadow-[0_0_10px_var(--neon-cyan)] md:text-4xl"
        >
          技术频道
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted">
          选择一个技术栈，直接进入对应的系列文章。
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={category.href}
            className="group block h-full outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan"
          >
            <NeonPanel className="flex h-full flex-col transition-transform duration-200 ease-linear group-hover:-translate-y-2">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-heading text-2xl font-bold text-foreground">
                    {category.title}
                  </h3>
                  <p className="mt-2 font-mono text-xs uppercase text-neon-orange">
                    {category.count} 篇文章
                  </p>
                </div>
                <span
                  className="flex h-14 w-14 shrink-0 items-center justify-center border bg-background/70 shadow-[0_0_22px_var(--category-accent)] transition-transform duration-200 ease-linear group-hover:scale-105"
                  style={{
                    borderColor: category.accent,
                    color: category.accent,
                    "--category-accent": category.accent,
                  }}
                >
                  <svg
                    aria-hidden="true"
                    data-testid="category-icon"
                    viewBox="0 0 24 24"
                    className="h-8 w-8 drop-shadow-[0_0_10px_currentColor]"
                  >
                    <path fill="currentColor" d={category.icon.path} />
                  </svg>
                </span>
              </div>
              <p className="mt-5 text-sm leading-7 text-muted">{category.description}</p>
            </NeonPanel>
          </Link>
        ))}
      </div>
    </section>
  );
}
