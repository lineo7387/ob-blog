import { Container } from "@/components/container";
import { PostMeta } from "@/features/blog/post-meta";
import type { PostMeta as PostMetaType } from "@/lib/content/types";

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
