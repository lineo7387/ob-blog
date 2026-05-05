import Link from "next/link";

import { NeonPanel } from "@/components/neon-panel";
import { PostMeta } from "@/features/blog/post-meta";
import type { PostMeta as PostMetaType } from "@/lib/content/types";

export function PostCard({ post }: { post: PostMetaType }) {
  return (
    <NeonPanel className="group transition-transform duration-200 ease-linear hover:-translate-y-2">
      <PostMeta post={post} />
      <h2 className="mt-5 font-heading text-2xl font-bold text-neon-cyan drop-shadow-[0_0_8px_var(--neon-cyan)]">
        <Link
          href={`/blog/${post.slug}`}
          className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-neon-cyan"
        >
          {post.title}
        </Link>
      </h2>
      <p className="mt-4 text-sm leading-7 text-muted">{post.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="border border-neon-magenta/50 px-2 py-1 font-mono text-xs text-neon-magenta"
          >
            #{tag}
          </span>
        ))}
      </div>
    </NeonPanel>
  );
}
