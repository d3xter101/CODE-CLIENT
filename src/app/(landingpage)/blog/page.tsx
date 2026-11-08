// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import BlogSection from "@/components/blog/blog-section";
import { getBlogPosts } from "@/actions/blog";
import { SITE_NAME, SITE_URL, jsonLd, pageMetadata } from "@/lib/seo";
import { Metadata } from "next";

export const metadata: Metadata = pageMetadata({
  title: "Blog: Tech Articles, Tutorials & Event Recaps - Code Club FST Settat",
  description:
    "Technical articles, tutorials, project showcases and event recaps from the Code Club community at FST Settat.",
  path: "/blog",
  keywords: ["Blog", "Articles", "Tutorials", "Event recaps"],
});

export default async function BlogPage() {
  const blogPosts = await getBlogPosts();

  return (
    <main className="w-full flex-1 container mx-auto">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: jsonLd({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: `${SITE_NAME} Blog`,
            url: `${SITE_URL}/blog`,
            publisher: { "@id": `${SITE_URL}/#organization` },
            blogPost: blogPosts.map((post) => ({
              "@type": "BlogPosting",
              headline: post.title,
              url: `${SITE_URL}/blog/${post.slug}`,
              datePublished: post.publishedAt,
            })),
          }),
        }}
      />
      <BlogSection posts={blogPosts} />
    </main>
  );
}
