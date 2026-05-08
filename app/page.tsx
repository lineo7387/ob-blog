import { Container } from "@/components/container";
import { AnimatedSection } from "@/components/motion/animated-section";
import { NeonButton } from "@/components/neon-button";
import { NeonPanel } from "@/components/neon-panel";
import { CategoryGrid } from "@/features/blog/category-grid";
import { PostList } from "@/features/blog/post-list";
import { toCategoryGridItems } from "@/lib/content/category-display";
import { getCategories, getFeaturedPosts } from "@/lib/content/posts";

export default async function Home() {
  const [featuredPosts, categories] = await Promise.all([
    getFeaturedPosts(),
    getCategories(),
  ]);
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
