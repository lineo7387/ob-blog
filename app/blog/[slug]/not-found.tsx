import { Container } from "@/components/container";
import { NeonButton } from "@/components/neon-button";
import { NeonPanel } from "@/components/neon-panel";

export default function BlogPostNotFound() {
  return (
    <Container className="py-20 sm:py-28">
      <NeonPanel>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-neon-orange">
          &gt; signal lost
        </p>
        <h1 className="mt-6 font-heading text-5xl font-black uppercase text-neon-cyan">
          文章不存在
        </h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
          这篇文章可能还在草稿箱里，也可能已经驶离网格。
        </p>
        <div className="mt-8">
          <NeonButton href="/blog">返回博客</NeonButton>
        </div>
      </NeonPanel>
    </Container>
  );
}
