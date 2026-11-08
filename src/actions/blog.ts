// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import { BlogPost } from "@/lib/blog";

// The published posts without their content, newest first. An unreachable backend gives an empty blog.
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog`, {
      next: { revalidate: 300 },
      headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) return [];
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch the blog posts:", error);
    return [];
  }
}

// One published post with its content, null when there is none (or the backend can't be reached)
export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/blog/${encodeURIComponent(slug)}`,
      {
        next: { revalidate: 300 },
        headers: { "Content-Type": "application/json" },
      }
    );
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Failed to fetch a blog post:", error);
    return null;
  }
}
