import type { Route } from "next";
import Link from "next/link";

import { formatChineseDate } from "@/lib/format/date";
import type { PostMeta as PostMetaType } from "@/lib/content/types";

export function PostMeta({
  post,
}: {
  post: Pick<PostMetaType, "publishedAt" | "readingTime" | "series" | "category">;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-widest text-muted">
      {post.category ? (
        <Link
          href={`/blog/${post.category.slug}` as Route}
          className="text-neon-magenta outline-none transition-colors hover:text-neon-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan"
        >
          {post.category.title}
        </Link>
      ) : null}
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
