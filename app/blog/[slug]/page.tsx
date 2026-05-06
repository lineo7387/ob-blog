import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Prose } from "@/components/prose";
import { PostHero } from "@/features/blog/post-hero";
import { getAllPosts, getPostBySlug } from "@/lib/content/posts";

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "文章不存在",
    };
  }

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
    },
  };
}

export default async function BlogPostPage(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const Body = post.body;

  return (
    <>
      <PostHero post={post} />
      <Prose>
        <Body />
      </Prose>
    </>
  );
}
