import type { Metadata } from "next";

import { Container } from "@/components/container";
import { NeonPanel } from "@/components/neon-panel";

export const metadata: Metadata = {
  title: "关于",
  description: "关于 oh-blog 和这个中文霓虹博客的设计方向。",
};

export default function AboutPage() {
  return (
    <Container className="py-20 sm:py-28">
      <NeonPanel>
        <p className="font-mono text-sm uppercase tracking-[0.3em] text-neon-orange">
          &gt; about signal
        </p>
        <h1 className="mt-6 font-heading text-5xl font-black uppercase text-neon-cyan">
          关于 oh-blog
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-9 text-muted">
          这里是一个把前端工程、界面设计和数字怀旧放在同一个屏幕里的中文个人站。它应该大胆、发光、带一点终端噪声，同时仍然认真对待读者的眼睛。
        </p>
      </NeonPanel>
    </Container>
  );
}
