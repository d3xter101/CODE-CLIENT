// #made and reviewed by Abdelhamid SAIDI - 2 Nov 2026
import { getBlogPosts } from "@/actions/blog";
import { getEvents } from "@/actions/events";
import { getNews } from "@/actions/news";
import { faqs } from "@/lib/faq";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

async function safely<T>(load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await load();
  } catch {
    return fallback;
  }
}

/**
 * llms.txt: a plain-text summary of the site for AI assistants and AI search
 * (https://llmstxt.org). It gives the facts and links to the pages that matter.
 */
export async function GET() {
  const [events, news, posts] = await Promise.all([
    safely(() => getEvents(1), []),
    safely(getNews, []),
    safely(getBlogPosts, []),
  ]);

  const lines = [
    `# ${SITE_NAME}`,
    "",
    `> ${SITE_DESCRIPTION}`,
    "",
    "Code Club is based at the Faculty of Sciences and Techniques of Settat (FST Settat), Hassan First University, Morocco. " +
      "It is run by students and open to every motivated student of the faculty, whatever their level.",
    "",
    "## Main pages",
    `- [Home](${SITE_URL}/): what the club is and how to join`,
    `- [Events](${SITE_URL}/events): hackathons, competitions, trainings and orientation sessions`,
    `- [News](${SITE_URL}/news): announcements from the club`,
    `- [Blog](${SITE_URL}/blog): articles written by members`,
    `- [Photo gallery](${SITE_URL}/gallery): photos of past events`,
    `- [Team](${SITE_URL}/team): the office members and the developers`,
    `- [Shop](${SITE_URL}/shop): club items members can book`,
    "",
    "## Frequently asked questions",
    ...faqs.map((f) => `- ${f.question} ${f.answer}`),
  ];

  if (events.length) {
    lines.push("", "## Recent events", ...events.slice(0, 10).map((e) => `- [${e.title}](${SITE_URL}/events/${e.id}) (${e.eventType.toLowerCase()})`));
  }
  if (news.length) {
    lines.push("", "## Recent news", ...news.slice(0, 10).map((n) => `- [${n.title}](${SITE_URL}/news/${n.id})`));
  }
  if (posts.length) {
    lines.push("", "## Blog articles", ...posts.slice(0, 20).map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug})`));
  }
  lines.push("", "## Optional", `- [Sitemap](${SITE_URL}/sitemap.xml)`, `- [Website changes](${SITE_URL}/website-refactor)`, "");

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
