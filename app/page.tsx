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
