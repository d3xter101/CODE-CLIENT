// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import type { MetadataRoute } from "next";
import { getNews } from "@/actions/news";
import { getEvents, getNumPage } from "@/actions/events";
import { SITE_URL, validDate } from "@/lib/seo";
import { getBlogPosts } from "@/actions/blog";

export const revalidate = 3600;

const staticRoutes: {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/events", changeFrequency: "daily", priority: 0.9 },
  { path: "/news", changeFrequency: "daily", priority: 0.9 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
  { path: "/team", changeFrequency: "monthly", priority: 0.6 },
  { path: "/gallery", changeFrequency: "monthly", priority: 0.6 },
  { path: "/website-refactor", changeFrequency: "yearly", priority: 0.3 },
  { path: "/shop", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.2 },
];

// The backend may be unreachable (e.g. during a build), so a failing source
// only drops its own URLs instead of failing the whole sitemap.
async function safely<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch {
    return fallback;
  }
}

async function getAllEvents() {
  const pages = await getNumPage();
  const results = await Promise.all(
    Array.from({ length: pages }, (_, i) => getEvents(i + 1))
  );
  return results.flat();
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [news, events, blogPosts] = await Promise.all([
    safely(getNews, []),
    safely(getAllEvents, []),
    safely(getBlogPosts, []),
  ]);

  return [
    ...staticRoutes.map(({ path, changeFrequency, priority }) => ({
      url: `${SITE_URL}${path}`,
      changeFrequency,
      priority,
    })),
    ...blogPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: validDate(post.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...news
      .filter((item) => item.id)
      .map((item) => ({
        url: `${SITE_URL}/news/${item.id}`,
        lastModified: validDate(item.publishedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ...events
      .filter((event) => event.id)
      .map((event) => ({
        url: `${SITE_URL}/events/${event.id}`,
        lastModified: validDate(event.publishedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
  ];
}
