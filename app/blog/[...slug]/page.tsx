import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/container";
import { Prose } from "@/components/prose";
import { PostHero } from "@/features/blog/post-hero";
import { PostList } from "@/features/blog/post-list";
import { getAllPosts, getCategories, getPostBySlug, getPostsByCategory } from "@/lib/content/posts";

export async function generateStaticParams() {
  const [posts, categories] = await Promise.all([getAllPosts(), getCategories()]);
  const legacyPostParams = posts
    .filter((post) => !post.category)
    .map((post) => ({ slug: [post.slug] }));
  const categoryParams = categories.map((category) => ({ slug: [category.slug] }));
  const categorizedPostParams = posts
    .filter((post) => post.category)
    .map((post) => ({ slug: [post.category!.slug, post.slug] }));

  return [...legacyPostParams, ...categoryParams, ...categorizedPostParams];
}

export async function generateMetadata(
  props: PageProps<"/blog/[...slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;

  if (slug.length === 1) {
    const categories = await getCategories();
    const category = categories.find((entry) => entry.slug === slug[0]);

    if (category) {
      return {
        title: `${category.title} 分类`,
        description: `${category.title} 分类下的中文技术文章。`,
      };
    }

    const post = await getPostBySlug(slug[0]);
    if (!post) {
      return {
        title: "文章不存在",
      };
    }

    return getPostMetadata(post);
  }

  if (slug.length === 2) {
    const post = await getPostBySlug(slug[1], slug[0]);
    if (!post) {
      return {
        title: "文章不存在",
      };
    }

    return getPostMetadata(post);
  }

  return {
    title: "文章不存在",
  };
}

export default async function BlogSlugPage(props: PageProps<"/blog/[...slug]">) {
  const { slug } = await props.params;

  if (slug.length === 1) {
    const categories = await getCategories();
    const category = categories.find((entry) => entry.slug === slug[0]);

    if (category) {
      const posts = await getPostsByCategory(category.slug);

      return (
        <Container className="py-20 sm:py-28">
          <p className="font-mono text-sm uppercase tracking-[0.3em] text-neon-orange">
            &gt; category channel
          </p>
          <h1 className="mt-6 font-heading text-5xl font-black uppercase text-neon-cyan">
            {category.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-muted">
            已载入 {category.count} 篇 {category.title} 分类文章。
          </p>
          <div className="mt-12">
            <PostList posts={posts} />
          </div>
        </Container>
      );
    }

    const post = await getPostBySlug(slug[0]);
    if (!post) notFound();

    return <PostPage post={post} />;
  }

  if (slug.length === 2) {
    const post = await getPostBySlug(slug[1], slug[0]);
    if (!post) notFound();

    return <PostPage post={post} />;
  }

  notFound();
}

function getPostMetadata(post: NonNullable<Awaited<ReturnType<typeof getPostBySlug>>>): Metadata {
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

function PostPage({ post }: { post: NonNullable<Awaited<ReturnType<typeof getPostBySlug>>> }) {
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
