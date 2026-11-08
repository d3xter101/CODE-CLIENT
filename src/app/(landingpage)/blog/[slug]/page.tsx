// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import BlogPostView from "@/components/blog/blog-post-view";
import { getBlogPost, getBlogPosts } from "@/actions/blog";
import { getRelatedPosts } from "@/lib/blog";
import { SITE_NAME, SITE_URL, jsonLd, noIndex, pageMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

// the posts are managed in the admin panel: known ones are built ahead, new ones are rendered on demand
export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Post not found - Code Club FST Settat", robots: noIndex };
  }

  return pageMetadata({
    title: `${post.title} - Code Club FST Settat`,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    keywords: ["Blog", post.category],
    image: post.image,
    type: "article",
    publishedTime: new Date(post.publishedAt).toISOString(),
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) notFound();

  const related = getRelatedPosts(post, await getBlogPosts());

  return (
    <main className="w-full flex-1 container mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: post.title,
            description: post.excerpt,
            image: [post.image],
            datePublished: new Date(post.publishedAt).toISOString(),
            articleSection: post.category,
            mainEntityOfPage: `${SITE_URL}/blog/${post.slug}`,
            author: { "@type": "Organization", name: post.author || SITE_NAME },
            publisher: { "@id": `${SITE_URL}/#organization` },
          }),
        }}
      />
      <BlogPostView post={post} related={related} />
    </main>
  );
}
