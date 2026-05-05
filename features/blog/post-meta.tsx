import { formatChineseDate } from "@/lib/format/date";
import type { PostMeta as PostMetaType } from "@/lib/content/types";

export function PostMeta({
  post,
}: {
  post: Pick<PostMetaType, "publishedAt" | "readingTime" | "series">;
}) {
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
