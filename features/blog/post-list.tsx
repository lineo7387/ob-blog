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
