// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
export const blogCategories = [
  "Events",
  "Training",
  "Projects",
  "Guides",
  "Tutorials",
] as const;

export type BlogCategory = (typeof blogCategories)[number];

// Where "Submit for Review" sends contributions. Swap for the club's real address.
export const BLOG_SUBMISSION_EMAIL = "club.code.fsts@gmail.com";

// A post body is a list of blocks, so it renders as real elements without injecting HTML.
export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  | { type: "code"; text: string };

// A post as the backend sends it (GET /api/v1/blog). The posts are written in the admin panel.
// The list leaves `content` out, a single post (GET /api/v1/blog/{slug}) has it.
export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  author: string;
  /** ISO date */
  publishedAt: string;
  readMinutes: number;
  image: string;
  imageAlt: string;
  content?: BlogBlock[];
}

/** Posts from the same category first, then the most recent ones. */
export function getRelatedPosts(
  post: BlogPost,
  posts: BlogPost[],
  count = 3
): BlogPost[] {
  const others = posts.filter((p) => p.slug !== post.slug);
  const score = (p: BlogPost) => (p.category === post.category ? 1 : 0);
  return others
    .sort(
      (a, b) =>
        score(b) - score(a) ||
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, count);
}
